import nodemailer from 'nodemailer';
import { logger } from '../utils/logger';
import { env } from '../config/env';

export interface EmailOptions {
  to: string;
  subject: string;
  text: string;
  html?: string;
  priority?: 'low' | 'medium' | 'high' | 'critical';
}

export interface EmailProvider {
  name: string;
  send: (options: EmailOptions) => Promise<{ success: boolean; messageId?: string; error?: string }>;
  isHealthy: () => Promise<boolean>;
}

export class EmailService {
  private providers: EmailProvider[] = [];
  private currentProviderIndex = 0;

  constructor() {
    this.initializeProviders();
  }

  private initializeProviders() {
    // Prefer Resend if configured
    if (env.RESEND_API_KEY) {
      this.providers.push(new ResendProvider());
    }
    // Add SMTP (Zoho or other) as fallback if configured
    if (env.SMTP_HOST && env.SMTP_USER && env.SMTP_PASS) {
      this.providers.push(new SMTPProvider());
    }

    logger.info(`Initialized ${this.providers.length} email providers (Resend + SMTP if configured)`);
  }

  async sendEmail(options: EmailOptions): Promise<{ success: boolean; provider: string; messageId?: string; error?: string }> {
    if (this.providers.length === 0) {
      throw new Error('No email providers configured');
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
          logger.warn(`Email provider ${provider.name} is not healthy, skipping`);
          continue;
        }

        const result = await provider.send(options);
        
        if (result.success) {
          // Update current provider index for next time
          this.currentProviderIndex = providerIndex;
          
          logger.info(`Email sent successfully via ${provider.name}`, {
            to: options.to,
            subject: options.subject,
            messageId: result.messageId
          });

          return {
            success: true,
            provider: provider.name,
            messageId: result.messageId
          };
        } else {
          lastError = result.error || 'Unknown error';
          logger.warn(`Email provider ${provider.name} failed: ${lastError}`);
        }
      } catch (error: any) {
        lastError = error.message;
        logger.error(`Email provider ${provider.name} error:`, error);
      }
    }

    // All providers failed
    logger.error('All email providers failed', { lastError });
    return {
      success: false,
      provider: 'none',
      error: lastError
    };
  }

  async getProviderStatus(): Promise<{ name: string; healthy: boolean }[]> {
    const status: { name: string; healthy: boolean }[] = [];

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

// SMTP Provider using Nodemailer
class SMTPProvider implements EmailProvider {
  name = 'SMTP';
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: env.SMTP_HOST,
      port: parseInt(env.SMTP_PORT),
      secure: env.SMTP_PORT === '465',
      auth: {
        user: env.SMTP_USER,
        pass: env.SMTP_PASS,
      },
    });
  }

  async send(options: EmailOptions): Promise<{ success: boolean; messageId?: string; error?: string }> {
    try {
      const result = await this.transporter.sendMail({
        from: `${env.FROM_NAME} <${env.FROM_EMAIL || env.SMTP_USER}>`,
        to: options.to,
        subject: options.subject,
        text: options.text,
        html: options.html,
        priority: options.priority === 'critical' ? 'high' : 'normal',
      });

      return {
        success: true,
        messageId: result.messageId,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  async isHealthy(): Promise<boolean> {
    try {
      await this.transporter.verify();
      return true;
    } catch (error) {
      return false;
    }
  }
}

// SendGrid Provider
class SendGridProvider implements EmailProvider {
  name = 'SendGrid';

  async send(options: EmailOptions): Promise<{ success: boolean; messageId?: string; error?: string }> {
    try {
      const sgMail = require('@sendgrid/mail');
      sgMail.setApiKey(env.SENDGRID_API_KEY);

      const msg = {
        to: options.to,
        from: env.FROM_EMAIL,
        subject: options.subject,
        text: options.text,
        html: options.html,
      };

      const result = await sgMail.send(msg);

      return {
        success: true,
        messageId: result[0]?.headers?.['x-message-id'],
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  async isHealthy(): Promise<boolean> {
    return !!env.SENDGRID_API_KEY;
  }
}

// Mailgun Provider
class MailgunProvider implements EmailProvider {
  name = 'Mailgun';

  async send(options: EmailOptions): Promise<{ success: boolean; messageId?: string; error?: string }> {
    try {
      const formData = require('form-data');
      const Mailgun = require('mailgun.js');
      
      const mailgun = new Mailgun(formData);
      const mg = mailgun.client({
        username: 'api',
        key: env.MAILGUN_API_KEY,
      });

      const result = await mg.messages.create(env.MAILGUN_DOMAIN, {
        from: `${env.FROM_NAME} <${env.FROM_EMAIL || 'noreply@' + env.MAILGUN_DOMAIN}>`,
        to: options.to,
        subject: options.subject,
        text: options.text,
        html: options.html,
      });

      return {
        success: true,
        messageId: result.id,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  async isHealthy(): Promise<boolean> {
    return !!(env.MAILGUN_API_KEY && env.MAILGUN_DOMAIN);
  }
}

// Resend Provider
class ResendProvider implements EmailProvider {
  name = 'Resend';

  async send(options: EmailOptions): Promise<{ success: boolean; messageId?: string; error?: string }> {
    try {
      const { Resend } = require('resend');
      const resend = new Resend(env.RESEND_API_KEY);

      const result = await resend.emails.send({
        from: `${env.FROM_NAME} <${env.FROM_EMAIL}>`,
        to: options.to,
        subject: options.subject,
        text: options.text,
        html: options.html,
      });

      return {
        success: true,
        messageId: result.data?.id,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  async isHealthy(): Promise<boolean> {
    return !!env.RESEND_API_KEY;
  }
}

// Amazon SES Provider
class SESProvider implements EmailProvider {
  name = 'Amazon SES';

  async send(options: EmailOptions): Promise<{ success: boolean; messageId?: string; error?: string }> {
    try {
      const { SESClient, SendEmailCommand } = require('@aws-sdk/client-ses');

      const ses = new SESClient({
        region: env.AWS_REGION,
        credentials: {
          accessKeyId: env.AWS_ACCESS_KEY_ID,
          secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
        },
      });

      const params = {
        Source: env.FROM_EMAIL,
        Destination: {
          ToAddresses: [options.to],
        },
        Message: {
          Subject: { Data: options.subject },
          Body: {
            Text: options.text ? { Data: options.text } : undefined,
            Html: { Data: options.html || options.text },
          },
        },
      };

      const result = await ses.send(new SendEmailCommand(params));
      
      return {
        success: true,
        messageId: result?.MessageId,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  async isHealthy(): Promise<boolean> {
    return !!(env.AWS_ACCESS_KEY_ID && env.AWS_SECRET_ACCESS_KEY && env.AWS_REGION);
  }
}

export default EmailService;
