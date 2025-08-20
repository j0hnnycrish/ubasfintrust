import { EventEmitter } from 'events';
import { logger } from '../utils/logger';
import { db } from '../config/db';
import { v4 as uuidv4 } from 'uuid';
import { EmailService } from './emailService';
import * as smsModule from './smsService';
import { FraudDetectionService } from './fraudDetectionService';
import { sendEventEmail } from '../email/resend';

export interface NotificationEvent {
  id?: string;
  userId: string;
  type: 'transaction' | 'security' | 'account' | 'system' | 'marketing' | 'fraud_alert' | 'kyc' | 'registration' | 'password_reset' | 'profile_update' | 'admin_alert' | 'kyc_submitted' | 'admin_kyc_review' | 'kyc_approved' | 'kyc_rejected' | 'investment_created' | 'bill_payment_completed';
  priority: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  message: string;
  data?: Record<string, any>;
  metadata?: Record<string, any>;
  channels: ('email' | 'sms' | 'push' | 'in_app')[];
  scheduledFor?: Date;
}

export interface NotificationPreferences {
  userId: string;
  email: boolean;
  sms: boolean;
  push: boolean;
  inApp: boolean;
  transactionEmail: boolean;
  transactionSms: boolean;
  securityEmail: boolean;
  securitySms: boolean;
  accountEmail: boolean;
  accountSms: boolean;
  systemEmail: boolean;
  systemSms: boolean;
  marketingEmail: boolean;
  marketingSms: boolean;
  fraudAlertEmail: boolean;
  fraudAlertSms: boolean;
  kycEmail: boolean;
  kycSms: boolean;
  registrationEmail: boolean;
  registrationSms: boolean;
  passwordResetEmail: boolean;
  passwordResetSms: boolean;
  profileUpdateEmail: boolean;
  profileUpdateSms: boolean;
  adminAlertEmail: boolean;
  adminAlertSms: boolean;
}

export interface NotificationLog {
  id: string;
  userId: string;
  eventId: string;
  channel: string;
  provider: string;
  status: 'pending' | 'sent' | 'failed' | 'retry';
  attempts: number;
  lastAttempt: Date;
  error?: string;
  metadata?: Record<string, any>;
}

class NotificationService extends EventEmitter {
  private emailService: EmailService;
  private smsService: { sendSMS: (args: { to: string; message: string; provider?: string; priority?: string }) => Promise<any> };
  private maxRetries = 3;
  private retryDelays = [1000, 5000, 15000]; // 1s, 5s, 15s

  constructor() {
    super();
    this.emailService = new EmailService();
    this.smsService = smsModule as any;
    this.setupEventListeners();
  }

  private setupEventListeners() {
    // Listen for banking events
    this.on('transaction:completed', this.handleTransactionCompleted.bind(this));
    this.on('transaction:failed', this.handleTransactionFailed.bind(this));
    this.on('security:login', this.handleSecurityLogin.bind(this));
    this.on('security:suspicious', this.handleSuspiciousActivity.bind(this));
    this.on('account:updated', this.handleAccountUpdated.bind(this));
    this.on('system:maintenance', this.handleSystemMaintenance.bind(this));
  }

  // Main method to send notifications
  async sendNotification(event: NotificationEvent): Promise<void> {
    try {
      // Get user preferences
      const preferences = await this.getUserPreferences(event.userId);
      if (!preferences) {
        logger.warn(`No notification preferences found for user ${event.userId}`);
        return;
      }

      // Get user contact info
      const user = await db('users')
        .select('email', 'phone', 'first_name', 'last_name')
        .where('id', event.userId)
        .first();

      if (!user) {
        logger.error(`User not found: ${event.userId}`);
        return;
      }

      // Filter channels based on preferences
      const enabledChannels = this.filterChannelsByPreferences(event, preferences);

      // Send notifications through enabled channels
      for (const channel of enabledChannels) {
        await this.sendThroughChannel(event, user, channel);
      }

      // Log the notification event
      await this.logNotificationEvent(event);

    } catch (error) {
      logger.error('Failed to send notification:', error);
    }
  }

  private filterChannelsByPreferences(
    event: NotificationEvent, 
    preferences: NotificationPreferences
  ): string[] {
    const enabledChannels: string[] = [];

    // Check global preferences first
    if (preferences.email && event.channels.includes('email')) {
      // Check type-specific preferences
      const typeEmailKey = `${event.type}Email` as keyof NotificationPreferences;
      if (preferences[typeEmailKey]) {
        enabledChannels.push('email');
      }
    }

    if (preferences.sms && event.channels.includes('sms')) {
      const typeSmsKey = `${event.type}Sms` as keyof NotificationPreferences;
      if (preferences[typeSmsKey]) {
        enabledChannels.push('sms');
      }
    }

    if (preferences.push && event.channels.includes('push')) {
      enabledChannels.push('push');
    }

    if (preferences.inApp && event.channels.includes('in_app')) {
      enabledChannels.push('in_app');
    }

    return enabledChannels;
  }

  private async sendThroughChannel(
    event: NotificationEvent,
    user: any,
    channel: string
  ): Promise<void> {
    const logId = uuidv4();
    try {
      let result;
      switch (channel) {
        case 'email':
          // Use Resend API for all event-based emails
          result = await sendEventEmail({
            to: user.email,
            subject: event.title,
            html: this.generateEmailHTML(event, user),
            type: event.type === 'fraud_alert' ? 'alert' : 'notification'
          });
          break;

        case 'sms':
          result = await this.smsService.sendSMS({
            to: user.phone,
            message: `${event.title}: ${event.message}`,
            priority: event.priority
          });
          break;

        case 'push':
          // TODO: Implement push notifications
          result = { success: true, provider: 'push', messageId: 'push-' + Date.now() };
          break;

        case 'in_app':
          // Store in database for in-app notifications
          await this.storeInAppNotification(event);
          result = { success: true, provider: 'in_app', messageId: 'in_app-' + Date.now() };
          break;

        default:
          throw new Error(`Unsupported channel: ${channel}`);
      }

      // Log successful delivery
      await this.logNotificationDelivery(logId, event, channel, result, 'sent');

    } catch (error) {
      logger.error(`Failed to send ${channel} notification:`, error);
      
      // Log failed delivery
      await this.logNotificationDelivery(logId, event, channel, null, 'failed', error);
      
      // Schedule retry for critical notifications
      if (event.priority === 'critical') {
        await this.scheduleRetry(logId, event, user, channel, 1);
      }
    }
  }

  private generateEmailHTML(event: NotificationEvent, user: any): string {
    const substitute = (text: string) => {
      if (!text) return text;
      const variables: Record<string,string> = {
        firstName: user.first_name || '',
        lastName: user.last_name || '',
        email: user.email || ''
      };
      return text.replace(/{{(\w+)}}/g, (_, k) => variables[k] ?? '');
    };
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>${event.title}</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #E53935; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9f9f9; }
          .footer { padding: 20px; text-align: center; font-size: 12px; color: #666; }
          .priority-high { border-left: 4px solid #D32F2F; }
          .priority-critical { border-left: 4px solid #dc2626; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>UBAS Financial Trust</h1>
          </div>
          <div class="content ${event.priority === 'high' ? 'priority-high' : event.priority === 'critical' ? 'priority-critical' : ''}">
            <h2>Hello ${user.first_name},</h2>
            <h3>${event.title}</h3>
            <p>${substitute(event.message)}</p>
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

  private async storeInAppNotification(event: NotificationEvent): Promise<void> {
    await db('notifications').insert({
      id: uuidv4(),
      user_id: event.userId,
      type: event.type,
      priority: event.priority,
      title: event.title,
      message: event.message,
      data: JSON.stringify(event.data || {}),
      read: false,
      created_at: new Date(),
    });
  }

  private async scheduleRetry(
    logId: string,
    event: NotificationEvent,
    user: any,
    channel: string,
    attempt: number
  ): Promise<void> {
    if (attempt > this.maxRetries) {
      logger.error(`Max retries exceeded for notification ${event.id}`);
      return;
    }

    const delay = this.retryDelays[attempt - 1] || 15000;
    
    setTimeout(async () => {
      try {
        await this.sendThroughChannel(event, user, channel);
      } catch (error) {
        await this.scheduleRetry(logId, event, user, channel, attempt + 1);
      }
    }, delay);
  }

  // Event handlers for different banking events
  private async handleTransactionCompleted(data: any): Promise<void> {
    const event: NotificationEvent = {
      id: uuidv4(),
      userId: data.userId,
      type: 'transaction',
      priority: 'medium',
      title: 'Transaction Completed',
      message: `Your ${data.type} of ${data.currency} ${data.amount.toLocaleString()} has been completed successfully.`,
      data: data,
      channels: ['email', 'sms', 'in_app', 'push']
    };

    await this.sendNotification(event);
  }

  private async handleTransactionFailed(data: any): Promise<void> {
    const event: NotificationEvent = {
      id: uuidv4(),
      userId: data.userId,
      type: 'transaction',
      priority: 'high',
      title: 'Transaction Failed',
      message: `Your ${data.type} of ${data.currency} ${data.amount.toLocaleString()} has failed. Please try again or contact support.`,
      data: data,
      channels: ['email', 'sms', 'in_app', 'push']
    };

    await this.sendNotification(event);
  }

  private async handleSecurityLogin(data: any): Promise<void> {
    const event: NotificationEvent = {
      id: uuidv4(),
      userId: data.userId,
      type: 'security',
      priority: data.success ? 'low' : 'critical',
      title: data.success ? 'Successful Login' : 'Failed Login Attempt',
      message: data.success 
        ? `You logged in from ${data.device} in ${data.location}`
        : `Failed login attempt from ${data.device} in ${data.location}`,
      data: data,
      channels: data.success ? ['in_app'] : ['email', 'sms', 'in_app', 'push']
    };

    await this.sendNotification(event);
  }

  private async handleSuspiciousActivity(data: any): Promise<void> {
    const event: NotificationEvent = {
      id: uuidv4(),
      userId: data.userId,
      type: 'security',
      priority: 'critical',
      title: 'Suspicious Activity Detected',
      message: `Suspicious activity detected on your account: ${data.description}`,
      data: data,
      channels: ['email', 'sms', 'in_app', 'push']
    };

    await this.sendNotification(event);
  }

  private async handleAccountUpdated(data: any): Promise<void> {
    const event: NotificationEvent = {
      id: uuidv4(),
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

  private async handleSystemMaintenance(data: any): Promise<void> {
    // Send to all users
    const users = await db('users').select('id').where('is_active', true);
    
    for (const user of users) {
      const event: NotificationEvent = {
        id: uuidv4(),
        userId: user.id,
        type: 'system',
        priority: 'medium',
        title: 'Scheduled Maintenance',
        message: `System maintenance scheduled from ${data.startTime} to ${data.endTime}`,
        data: data,
        channels: ['email', 'in_app']
      };

      await this.sendNotification(event);
    }
  }

  // Utility methods
  private async getUserPreferences(userId: string): Promise<NotificationPreferences | null> {
    const preferences = await db('notification_preferences')
      .where('user_id', userId)
      .first();

    if (!preferences) {
      // Create default preferences
      const defaultPreferences: Partial<NotificationPreferences> = {
        userId,
        email: true,
        sms: true,
        push: true,
        inApp: true,
        transactionEmail: true,
        transactionSms: true,
        securityEmail: true,
        securitySms: true,
        accountEmail: true,
        accountSms: false,
        systemEmail: false,
        systemSms: false,
        marketingEmail: false,
        marketingSms: false,
      };

      await db('notification_preferences').insert({
        user_id: userId,
        ...defaultPreferences
      });

      return defaultPreferences as NotificationPreferences;
    }

    return preferences;
  }

  private async logNotificationEvent(event: NotificationEvent): Promise<void> {
    await db('notification_events').insert({
      id: event.id,
      user_id: event.userId,
      type: event.type,
      priority: event.priority,
      title: event.title,
      message: event.message,
      data: JSON.stringify(event.data || {}),
      channels: JSON.stringify(event.channels),
      created_at: new Date(),
    });
  }

  private async logNotificationDelivery(
    logId: string,
    event: NotificationEvent,
    channel: string,
    result: any,
    status: string,
    error?: any
  ): Promise<void> {
    await db('notification_logs').insert({
      id: logId,
      user_id: event.userId,
      event_id: event.id,
      channel,
      provider: result?.provider || 'unknown',
      status,
      attempts: 1,
      last_attempt: new Date(),
      error: error?.message,
      metadata: JSON.stringify(result || {}),
    });
  }

  // Public API methods
  async updateUserPreferences(userId: string, preferences: Partial<NotificationPreferences>): Promise<void> {
    await db('notification_preferences')
      .where('user_id', userId)
      .update(preferences);
  }

  async getNotificationHistory(userId: string, limit = 50): Promise<any[]> {
    return await db('notifications')
      .where('user_id', userId)
      .orderBy('created_at', 'desc')
      .limit(limit);
  }

  async markNotificationAsRead(notificationId: string): Promise<void> {
    await db('notifications')
      .where('id', notificationId)
      .update({ read: true, read_at: new Date() });
  }
}

export const notificationService = new NotificationService();
export default notificationService;
