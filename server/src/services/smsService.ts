import twilio from 'twilio';

// Optional providers loaded dynamically to avoid build-time dependency errors
let messagebird: any = null;
try { messagebird = require('messagebird'); } catch {}

// Type for SMS options
interface SMSOptions {
  to: string;
  message: string;
  provider?: 'textbelt' | 'twilio' | 'vonage' | 'messagebird';
}

const twilioClient = (process.env['TWILIO_ACCOUNT_SID']?.startsWith('AC') && process.env['TWILIO_AUTH_TOKEN'])
  ? twilio(process.env['TWILIO_ACCOUNT_SID']!, process.env['TWILIO_AUTH_TOKEN']!)
  : null;
const vonageClient: any = null;
const messageBirdClient = (messagebird && typeof messagebird === 'function' && process.env['MESSAGEBIRD_API_KEY'])
  ? messagebird(process.env['MESSAGEBIRD_API_KEY']!)
  : null;
let plivoClient: any = null;

export async function sendSMS({ to, message, provider = 'textbelt' }: SMSOptions): Promise<any> {
  try {
    if (provider === 'textbelt' && process.env['TEXTBELT_API_KEY']) {
      const resp = await fetch('https://textbelt.com/text', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: to, message, key: process.env['TEXTBELT_API_KEY'] })
      });
      const data: any = await resp.json();
      if (data.success) return data;
      throw new Error((data && data.error) || 'TextBelt send failed');
    } else if (provider === 'twilio' && twilioClient) {
      return await twilioClient.messages.create({
        body: message,
        from: process.env['TWILIO_PHONE_NUMBER']!,
        to,
      });
    } else if (provider === 'vonage' && vonageClient) {
      return await vonageClient.message.sendSms(
        process.env['VONAGE_PHONE_NUMBER']!,
        to,
        message
      );
    } else if (provider === 'messagebird' && messageBirdClient) {
      return await new Promise((resolve, reject) => {
        messageBirdClient.messages.create({
          originator: process.env['MESSAGEBIRD_PHONE_NUMBER']!,
          recipients: [to],
          body: message,
        }, (err: any, response: any) => {
          if (err) reject(err);
          else resolve(response);
        });
      });
    } else {
      // Fallback logic: prefer TextBelt if configured, else try others in order
      if (process.env['TEXTBELT_API_KEY']) {
        const resp = await fetch('https://textbelt.com/text', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ phone: to, message, key: process.env['TEXTBELT_API_KEY'] })
        });
        const data: any = await resp.json();
        if (data.success) return data;
      }
      if (twilioClient && process.env['TWILIO_PHONE_NUMBER']) {
        try {
          return await twilioClient.messages.create({
            body: message,
            from: process.env['TWILIO_PHONE_NUMBER']!,
            to,
          });
        } catch {}
      }
      if (vonageClient && process.env['VONAGE_PHONE_NUMBER']) {
        try {
          return await vonageClient.message.sendSms(
            process.env['VONAGE_PHONE_NUMBER']!,
            to,
            message
          );
        } catch {}
      }
      if (messageBirdClient && process.env['MESSAGEBIRD_PHONE_NUMBER']) {
        try {
          return await new Promise((resolve, reject) => {
            messageBirdClient.messages.create({
              originator: process.env['MESSAGEBIRD_PHONE_NUMBER']!,
              recipients: [to],
              body: message,
            }, (err: any, response: any) => {
              if (err) reject(err);
              else resolve(response);
            });
          });
        } catch {}
      }

      throw new Error('All SMS providers failed');
    }
  } catch (err) {
    // Log error for monitoring and alerting
    console.error('SMS sending failed:', err);
    throw err;
  }
}
