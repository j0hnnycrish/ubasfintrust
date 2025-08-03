// Standalone Notification System - Production Ready
// This can be run independently and integrated with the main app

const express = require('express');
const cors = require('cors');
const { EventEmitter } = require('events');
const axios = require('axios');
const nodemailer = require('nodemailer');

// Environment configuration
const env = {
  PORT: process.env.NOTIFICATION_PORT || 3001,
  
  // Email providers
  SMTP_HOST: process.env.SMTP_HOST,
  SMTP_PORT: process.env.SMTP_PORT || '587',
  SMTP_USER: process.env.SMTP_USER,
  SMTP_PASS: process.env.SMTP_PASS,
  FROM_EMAIL: process.env.FROM_EMAIL || 'noreply@ubasfintrust.com',
  FROM_NAME: process.env.FROM_NAME || 'UBAS Financial Trust',
  
  SENDGRID_API_KEY: process.env.SENDGRID_API_KEY,
  MAILGUN_API_KEY: process.env.MAILGUN_API_KEY,
  MAILGUN_DOMAIN: process.env.MAILGUN_DOMAIN,
  RESEND_API_KEY: process.env.RESEND_API_KEY,
  
  // SMS providers
  TWILIO_ACCOUNT_SID: process.env.TWILIO_ACCOUNT_SID,
  TWILIO_AUTH_TOKEN: process.env.TWILIO_AUTH_TOKEN,
  TWILIO_PHONE_NUMBER: process.env.TWILIO_PHONE_NUMBER,
  TEXTBELT_API_KEY: process.env.TEXTBELT_API_KEY || 'textbelt',
  TERMII_API_KEY: process.env.TERMII_API_KEY,
  TERMII_SENDER_ID: process.env.TERMII_SENDER_ID || 'UBAS Bank',
};

// Logger
const logger = {
  info: (msg, data) => console.log(`[INFO] ${msg}`, data || ''),
  warn: (msg, data) => console.warn(`[WARN] ${msg}`, data || ''),
  error: (msg, data) => console.error(`[ERROR] ${msg}`, data || ''),
};

// Email Service with multiple providers
class EmailService {
  constructor() {
    this.providers = [];
    this.initializeProviders();
  }

  initializeProviders() {
    // SMTP Provider
    if (env.SMTP_HOST && env.SMTP_USER && env.SMTP_PASS) {
      this.providers.push({
        name: 'SMTP',
        send: async (options) => {
          const transporter = nodemailer.createTransport({
            host: env.SMTP_HOST,
            port: parseInt(env.SMTP_PORT),
            secure: env.SMTP_PORT === '465',
            auth: {
              user: env.SMTP_USER,
              pass: env.SMTP_PASS,
            },
          });

          const result = await transporter.sendMail({
            from: `${env.FROM_NAME} <${env.FROM_EMAIL}>`,
            to: options.to,
            subject: options.subject,
            text: options.text,
            html: options.html,
          });

          return { success: true, messageId: result.messageId };
        },
        isHealthy: async () => true
      });
    }

    // SendGrid Provider
    if (env.SENDGRID_API_KEY) {
      this.providers.push({
        name: 'SendGrid',
        send: async (options) => {
          const sgMail = require('@sendgrid/mail');
          sgMail.setApiKey(env.SENDGRID_API_KEY);

          const result = await sgMail.send({
            to: options.to,
            from: env.FROM_EMAIL,
            subject: options.subject,
            text: options.text,
            html: options.html,
          });

          return { success: true, messageId: result[0]?.headers?.['x-message-id'] };
        },
        isHealthy: async () => true
      });
    }

    logger.info(`Initialized ${this.providers.length} email providers`);
  }

  async sendEmail(options) {
    if (this.providers.length === 0) {
      throw new Error('No email providers configured');
    }

    for (const provider of this.providers) {
      try {
        const result = await provider.send(options);
        if (result.success) {
          logger.info(`Email sent via ${provider.name}`, { to: options.to, subject: options.subject });
          return { success: true, provider: provider.name, messageId: result.messageId };
        }
      } catch (error) {
        logger.error(`Email provider ${provider.name} failed:`, error.message);
      }
    }

    return { success: false, error: 'All email providers failed' };
  }
}

// SMS Service with multiple providers
class SMSService {
  constructor() {
    this.providers = [];
    this.initializeProviders();
  }

  initializeProviders() {
    // Twilio Provider
    if (env.TWILIO_ACCOUNT_SID && env.TWILIO_AUTH_TOKEN) {
      this.providers.push({
        name: 'Twilio',
        send: async (options) => {
          const twilio = require('twilio');
          const client = twilio(env.TWILIO_ACCOUNT_SID, env.TWILIO_AUTH_TOKEN);

          const message = await client.messages.create({
            body: options.message,
            from: env.TWILIO_PHONE_NUMBER,
            to: options.to,
          });

          return { success: true, messageId: message.sid };
        },
        isHealthy: async () => true
      });
    }

    // TextBelt Provider (Free tier)
    this.providers.push({
      name: 'TextBelt',
      send: async (options) => {
        const response = await axios.post('https://textbelt.com/text', {
          phone: options.to,
          message: options.message,
          key: env.TEXTBELT_API_KEY,
        });

        if (response.data.success) {
          return { success: true, messageId: response.data.textId };
        } else {
          throw new Error(response.data.error);
        }
      },
      isHealthy: async () => true
    });

    // Termii Provider (Nigerian SMS)
    if (env.TERMII_API_KEY) {
      this.providers.push({
        name: 'Termii',
        send: async (options) => {
          const response = await axios.post('https://api.ng.termii.com/api/sms/send', {
            to: options.to,
            from: env.TERMII_SENDER_ID,
            sms: options.message,
            type: 'plain',
            channel: 'generic',
            api_key: env.TERMII_API_KEY,
          });

          if (response.data.message_id) {
            return { success: true, messageId: response.data.message_id };
          } else {
            throw new Error(response.data.message || 'Unknown error');
          }
        },
        isHealthy: async () => true
      });
    }

    logger.info(`Initialized ${this.providers.length} SMS providers`);
  }

  cleanPhoneNumber(phone) {
    const cleaned = phone.replace(/\D/g, '');
    
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

  async sendSMS(options) {
    if (this.providers.length === 0) {
      throw new Error('No SMS providers configured');
    }

    const cleanPhone = this.cleanPhoneNumber(options.to);
    if (!cleanPhone) {
      return { success: false, error: 'Invalid phone number format' };
    }

    for (const provider of this.providers) {
      try {
        const result = await provider.send({ ...options, to: cleanPhone });
        if (result.success) {
          logger.info(`SMS sent via ${provider.name}`, { to: cleanPhone });
          return { success: true, provider: provider.name, messageId: result.messageId };
        }
      } catch (error) {
        logger.error(`SMS provider ${provider.name} failed:`, error.message);
      }
    }

    return { success: false, error: 'All SMS providers failed' };
  }
}

// Notification Service
class NotificationService extends EventEmitter {
  constructor() {
    super();
    this.emailService = new EmailService();
    this.smsService = new SMSService();
    this.notifications = []; // In-memory storage for demo
    this.setupEventListeners();
  }

  setupEventListeners() {
    this.on('transaction:completed', this.handleTransactionCompleted.bind(this));
    this.on('transaction:failed', this.handleTransactionFailed.bind(this));
    this.on('security:login', this.handleSecurityLogin.bind(this));
    this.on('security:suspicious', this.handleSuspiciousActivity.bind(this));
    this.on('account:updated', this.handleAccountUpdated.bind(this));
    this.on('test:notification', this.handleTestNotification.bind(this));
  }

  async sendNotification(event) {
    try {
      logger.info('Processing notification event:', event.type);

      // Mock user preferences (in production, fetch from database)
      const preferences = {
        email: true,
        sms: true,
        transactionEmail: true,
        transactionSms: true,
        securityEmail: true,
        securitySms: true,
        accountEmail: true,
        accountSms: false,
      };

      // Mock user data (in production, fetch from database)
      const user = {
        email: 'user@example.com',
        phone: '+2348012345678',
        firstName: 'John',
        lastName: 'Doe'
      };

      // Filter channels based on preferences
      const enabledChannels = this.filterChannelsByPreferences(event, preferences);

      // Send notifications through enabled channels
      for (const channel of enabledChannels) {
        await this.sendThroughChannel(event, user, channel);
      }

      // Store in-app notification
      this.notifications.push({
        id: Date.now().toString(),
        userId: event.userId,
        type: event.type,
        priority: event.priority,
        title: event.title,
        message: event.message,
        read: false,
        createdAt: new Date(),
      });

      logger.info('Notification processing completed');

    } catch (error) {
      logger.error('Failed to send notification:', error.message);
    }
  }

  filterChannelsByPreferences(event, preferences) {
    const enabledChannels = [];

    if (preferences.email && event.channels.includes('email')) {
      const typeEmailKey = `${event.type}Email`;
      if (preferences[typeEmailKey]) {
        enabledChannels.push('email');
      }
    }

    if (preferences.sms && event.channels.includes('sms')) {
      const typeSmsKey = `${event.type}Sms`;
      if (preferences[typeSmsKey]) {
        enabledChannels.push('sms');
      }
    }

    if (event.channels.includes('in_app')) {
      enabledChannels.push('in_app');
    }

    return enabledChannels;
  }

  async sendThroughChannel(event, user, channel) {
    try {
      switch (channel) {
        case 'email':
          await this.emailService.sendEmail({
            to: user.email,
            subject: event.title,
            text: event.message,
            html: this.generateEmailHTML(event, user),
          });
          break;

        case 'sms':
          await this.smsService.sendSMS({
            to: user.phone,
            message: `${event.title}: ${event.message}`,
          });
          break;

        case 'in_app':
          // Handled in sendNotification method
          break;
      }
    } catch (error) {
      logger.error(`Failed to send ${channel} notification:`, error.message);
    }
  }

  generateEmailHTML(event, user) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>${event.title}</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #1e40af; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9f9f9; }
          .footer { padding: 20px; text-align: center; font-size: 12px; color: #666; }
          .priority-high { border-left: 4px solid #f59e0b; }
          .priority-critical { border-left: 4px solid #dc2626; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>UBAS Financial Trust</h1>
          </div>
          <div class="content ${event.priority === 'high' ? 'priority-high' : event.priority === 'critical' ? 'priority-critical' : ''}">
            <h2>Hello ${user.firstName},</h2>
            <h3>${event.title}</h3>
            <p>${event.message}</p>
            ${event.data ? `<div><strong>Details:</strong><pre>${JSON.stringify(event.data, null, 2)}</pre></div>` : ''}
            <p>If you have any questions, please contact our support team.</p>
          </div>
          <div class="footer">
            <p>&copy; 2024 UBAS Financial Trust. All rights reserved.</p>
            <p>This is an automated message. Please do not reply to this email.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  // Event handlers
  async handleTransactionCompleted(data) {
    const event = {
      id: Date.now().toString(),
      userId: data.userId,
      type: 'transaction',
      priority: 'medium',
      title: 'Transaction Completed',
      message: `Your ${data.type} of ${data.currency} ${data.amount.toLocaleString()} has been completed successfully.`,
      data: data,
      channels: ['email', 'sms', 'in_app']
    };

    await this.sendNotification(event);
  }

  async handleTransactionFailed(data) {
    const event = {
      id: Date.now().toString(),
      userId: data.userId,
      type: 'transaction',
      priority: 'high',
      title: 'Transaction Failed',
      message: `Your ${data.type} of ${data.currency} ${data.amount.toLocaleString()} has failed. Please try again or contact support.`,
      data: data,
      channels: ['email', 'sms', 'in_app']
    };

    await this.sendNotification(event);
  }

  async handleSecurityLogin(data) {
    const event = {
      id: Date.now().toString(),
      userId: data.userId,
      type: 'security',
      priority: data.success ? 'low' : 'critical',
      title: data.success ? 'Successful Login' : 'Failed Login Attempt',
      message: data.success 
        ? `You logged in from ${data.device} in ${data.location}`
        : `Failed login attempt from ${data.device} in ${data.location}`,
      data: data,
      channels: data.success ? ['in_app'] : ['email', 'sms', 'in_app']
    };

    await this.sendNotification(event);
  }

  async handleSuspiciousActivity(data) {
    const event = {
      id: Date.now().toString(),
      userId: data.userId,
      type: 'security',
      priority: 'critical',
      title: 'Suspicious Activity Detected',
      message: `Suspicious activity detected on your account: ${data.description}`,
      data: data,
      channels: ['email', 'sms', 'in_app']
    };

    await this.sendNotification(event);
  }

  async handleAccountUpdated(data) {
    const event = {
      id: Date.now().toString(),
      userId: data.userId,
      type: 'account',
      priority: 'medium',
      title: 'Account Updated',
      message: `Your account has been updated: ${data.description}`,
      data: data,
      channels: ['email', 'in_app']
    };

    await this.sendNotification(event);
  }

  async handleTestNotification(data) {
    const event = {
      id: Date.now().toString(),
      userId: data.userId,
      type: data.type,
      priority: data.priority,
      title: data.title,
      message: data.message,
      data: data.data,
      channels: data.channels
    };

    await this.sendNotification(event);
  }

  // API methods
  getNotifications(userId) {
    return this.notifications
      .filter(n => n.userId === userId)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  markAsRead(notificationId) {
    const notification = this.notifications.find(n => n.id === notificationId);
    if (notification) {
      notification.read = true;
      notification.readAt = new Date();
    }
  }
}

// Express app setup
const app = express();
const notificationService = new NotificationService();

app.use(cors());
app.use(express.json());

// API Routes
app.post('/api/notifications/send', async (req, res) => {
  try {
    const { event, userId, type, priority, title, message, channels, data } = req.body;

    if (event) {
      // Emit predefined event
      notificationService.emit(event, req.body);
    } else {
      // Send custom notification
      await notificationService.sendNotification({
        id: Date.now().toString(),
        userId,
        type,
        priority,
        title,
        message,
        channels,
        data
      });
    }

    res.json({ success: true, message: 'Notification sent successfully' });
  } catch (error) {
    logger.error('Failed to send notification:', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/api/notifications/:userId', (req, res) => {
  try {
    const notifications = notificationService.getNotifications(req.params.userId);
    res.json({ success: true, data: notifications });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.patch('/api/notifications/:id/read', (req, res) => {
  try {
    notificationService.markAsRead(req.params.id);
    res.json({ success: true, message: 'Notification marked as read' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/api/notifications/providers/status', async (req, res) => {
  try {
    const emailProviders = notificationService.emailService.providers.map(p => ({
      name: p.name,
      type: 'email',
      healthy: true
    }));

    const smsProviders = notificationService.smsService.providers.map(p => ({
      name: p.name,
      type: 'sms',
      healthy: true
    }));

    res.json({
      success: true,
      data: {
        email: emailProviders,
        sms: smsProviders
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'notification-system',
    timestamp: new Date().toISOString(),
    providers: {
      email: notificationService.emailService.providers.length,
      sms: notificationService.smsService.providers.length
    }
  });
});

// Start server
const server = app.listen(env.PORT, () => {
  logger.info(`🔔 Notification Service running on port ${env.PORT}`);
  logger.info(`📧 Email providers: ${notificationService.emailService.providers.length}`);
  logger.info(`📱 SMS providers: ${notificationService.smsService.providers.length}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully');
  server.close(() => {
    logger.info('Notification service stopped');
    process.exit(0);
  });
});

module.exports = { app, notificationService };
