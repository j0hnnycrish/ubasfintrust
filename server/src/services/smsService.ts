import axios from 'axios';
import { logger } from '../utils/logger';
import { env } from '../config/env';

export interface SMSOptions {
  to: string;
  message: string;
  priority?: 'low' | 'medium' | 'high' | 'critical';
}

export interface SMSProvider {
  name: string;
  send: (options: SMSOptions) => Promise<{ success: boolean; messageId?: string; error?: string }>;
  isHealthy: () => Promise<boolean>;
}

export class SMSService {
  private providers: SMSProvider[] = [];
  private currentProviderIndex = 0;

  constructor() {
    this.initializeProviders();
  }

  private initializeProviders() {
    // Twilio Provider
    if (env.TWILIO_ACCOUNT_SID && env.TWILIO_AUTH_TOKEN) {
      this.providers.push(new TwilioProvider());
    }

    // Vonage (Nexmo) Provider
    if (env.VONAGE_API_KEY && env.VONAGE_API_SECRET) {
      this.providers.push(new VonageProvider());
    }

    // TextBelt Provider (Free tier: 1 SMS/day)
    this.providers.push(new TextBeltProvider());

    // SMS.to Provider (Free tier available)
    if (env.SMSTO_API_KEY) {
      this.providers.push(new SMSToProvider());
    }

    // Africa's Talking Provider (Free credits available)
    if (env.AFRICASTALKING_API_KEY && env.AFRICASTALKING_USERNAME) {
      this.providers.push(new AfricasTalkingProvider());
    }

    // Termii Provider (Nigerian SMS service with free tier)
    if (env.TERMII_API_KEY) {
      this.providers.push(new TermiiProvider());
    }

    logger.info(`Initialized ${this.providers.length} SMS providers`);
  }

  async sendSMS(options: SMSOptions): Promise<{ success: boolean; provider: string; messageId?: string; error?: string }> {
    if (this.providers.length === 0) {
      throw new Error('No SMS providers configured');
    }

    // Clean phone number
    const cleanPhone = this.cleanPhoneNumber(options.to);
    if (!cleanPhone) {
      return {
        success: false,
        provider: 'none',
        error: 'Invalid phone number format'
      };
    }

    let lastError: string = '';
    
    // Try each provider in order
    for (let i = 0; i < this.providers.length; i++) {
      const providerIndex = (this.currentProviderIndex + i) % this.providers.length;
      const provider = this.providers[providerIndex];

      try {
        // Check if provider is healthy
        const isHealthy = await provider.isHealthy();
        if (!isHealthy) {
          logger.warn(`SMS provider ${provider.name} is not healthy, skipping`);
          continue;
        }

        const result = await provider.send({
          ...options,
          to: cleanPhone
        });
        
        if (result.success) {
          // Update current provider index for next time
          this.currentProviderIndex = providerIndex;
          
          logger.info(`SMS sent successfully via ${provider.name}`, {
            to: cleanPhone,
            messageId: result.messageId
          });

          return {
            success: true,
            provider: provider.name,
            messageId: result.messageId
          };
        } else {
          lastError = result.error || 'Unknown error';
          logger.warn(`SMS provider ${provider.name} failed: ${lastError}`);
        }
      } catch (error: any) {
        lastError = error.message;
        logger.error(`SMS provider ${provider.name} error:`, error);
      }
    }

    // All providers failed
    logger.error('All SMS providers failed', { lastError });
    return {
      success: false,
      provider: 'none',
      error: lastError
    };
  }

  private cleanPhoneNumber(phone: string): string | null {
    // Remove all non-digit characters
    const cleaned = phone.replace(/\D/g, '');
    
    // Handle Nigerian numbers
    if (cleaned.startsWith('234')) {
      return '+' + cleaned;
    } else if (cleaned.startsWith('0') && cleaned.length === 11) {
      return '+234' + cleaned.substring(1);
    } else if (cleaned.length === 10) {
      return '+234' + cleaned;
    } else if (cleaned.length > 10) {
      return '+' + cleaned;
    }
    
    return null;
  }

  async getProviderStatus(): Promise<{ name: string; healthy: boolean }[]> {
    const status = [];
    
    for (const provider of this.providers) {
      try {
        const healthy = await provider.isHealthy();
        status.push({ name: provider.name, healthy });
      } catch (error) {
        status.push({ name: provider.name, healthy: false });
      }
    }

    return status;
  }
}

// Twilio Provider
class TwilioProvider implements SMSProvider {
  name = 'Twilio';

  async send(options: SMSOptions): Promise<{ success: boolean; messageId?: string; error?: string }> {
    try {
      const twilio = require('twilio');
      const client = twilio(env.TWILIO_ACCOUNT_SID, env.TWILIO_AUTH_TOKEN);

      const message = await client.messages.create({
        body: options.message,
        from: env.TWILIO_PHONE_NUMBER,
        to: options.to,
      });

      return {
        success: true,
        messageId: message.sid,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  async isHealthy(): Promise<boolean> {
    return !!(env.TWILIO_ACCOUNT_SID && env.TWILIO_AUTH_TOKEN && env.TWILIO_PHONE_NUMBER);
  }
}

// Vonage (Nexmo) Provider
class VonageProvider implements SMSProvider {
  name = 'Vonage';

  async send(options: SMSOptions): Promise<{ success: boolean; messageId?: string; error?: string }> {
    try {
      const { Vonage } = require('@vonage/server-sdk');
      
      const vonage = new Vonage({
        apiKey: env.VONAGE_API_KEY,
        apiSecret: env.VONAGE_API_SECRET,
      });

      const result = await vonage.sms.send({
        to: options.to,
        from: env.VONAGE_FROM_NUMBER || 'UBAS Bank',
        text: options.message,
      });

      if (result.messages[0].status === '0') {
        return {
          success: true,
          messageId: result.messages[0]['message-id'],
        };
      } else {
        return {
          success: false,
          error: result.messages[0]['error-text'],
        };
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  async isHealthy(): Promise<boolean> {
    return !!(env.VONAGE_API_KEY && env.VONAGE_API_SECRET);
  }
}

// TextBelt Provider (Free tier: 1 SMS/day)
class TextBeltProvider implements SMSProvider {
  name = 'TextBelt';

  async send(options: SMSOptions): Promise<{ success: boolean; messageId?: string; error?: string }> {
    try {
      const response = await axios.post('https://textbelt.com/text', {
        phone: options.to,
        message: options.message,
        key: env.TEXTBELT_API_KEY, // 'textbelt' for free tier
      });

      if (response.data.success) {
        return {
          success: true,
          messageId: response.data.textId,
        };
      } else {
        return {
          success: false,
          error: response.data.error,
        };
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  async isHealthy(): Promise<boolean> {
    return true; // TextBelt is always available
  }
}

// SMS.to Provider
class SMSToProvider implements SMSProvider {
  name = 'SMS.to';

  async send(options: SMSOptions): Promise<{ success: boolean; messageId?: string; error?: string }> {
    try {
      const response = await axios.post('https://api.sms.to/sms/send', {
        to: options.to,
        message: options.message,
        sender_id: 'UBAS Bank',
      }, {
        headers: {
          'Authorization': `Bearer ${env.SMSTO_API_KEY}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.data.success) {
        return {
          success: true,
          messageId: response.data.message_id,
        };
      } else {
        return {
          success: false,
          error: response.data.message,
        };
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || error.message,
      };
    }
  }

  async isHealthy(): Promise<boolean> {
    return !!env.SMSTO_API_KEY;
  }
}

// Africa's Talking Provider
class AfricasTalkingProvider implements SMSProvider {
  name = 'AfricasTalking';

  async send(options: SMSOptions): Promise<{ success: boolean; messageId?: string; error?: string }> {
    try {
      const AfricasTalking = require('africastalking');
      
      const africastalking = AfricasTalking({
        apiKey: env.AFRICASTALKING_API_KEY,
        username: env.AFRICASTALKING_USERNAME,
      });

      const sms = africastalking.SMS;
      const result = await sms.send({
        to: [options.to],
        message: options.message,
        from: env.AFRICASTALKING_SENDER_ID,
      });

      if (result.SMSMessageData.Recipients[0].status === 'Success') {
        return {
          success: true,
          messageId: result.SMSMessageData.Recipients[0].messageId,
        };
      } else {
        return {
          success: false,
          error: result.SMSMessageData.Recipients[0].status,
        };
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  async isHealthy(): Promise<boolean> {
    return !!(env.AFRICASTALKING_API_KEY && env.AFRICASTALKING_USERNAME);
  }
}

// Termii Provider (Nigerian SMS service)
class TermiiProvider implements SMSProvider {
  name = 'Termii';

  async send(options: SMSOptions): Promise<{ success: boolean; messageId?: string; error?: string }> {
    try {
      const response = await axios.post('https://api.ng.termii.com/api/sms/send', {
        to: options.to,
        from: env.TERMII_SENDER_ID,
        sms: options.message,
        type: 'plain',
        channel: 'generic',
        api_key: env.TERMII_API_KEY,
      });

      if (response.data.message_id) {
        return {
          success: true,
          messageId: response.data.message_id,
        };
      } else {
        return {
          success: false,
          error: response.data.message || 'Unknown error',
        };
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || error.message,
      };
    }
  }

  async isHealthy(): Promise<boolean> {
    return !!env.TERMII_API_KEY;
  }
}

export default SMSService;
