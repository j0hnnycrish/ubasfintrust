import { Router, Request, Response } from 'express';
import { AuthMiddleware, AuthRequest } from '../middleware/auth';
import { db } from '../config/db';
import { logger } from '../utils/logger';
import { notificationService } from '../services/notificationService';
import { EmailService } from '../services/emailService';
import { SMSService } from '../services/smsService';
import { body, validationResult } from 'express-validator';

const router = Router();

// Apply authentication to all routes
router.use(AuthMiddleware.verifyToken);

// Get user notification preferences
router.get('/preferences', async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    
    let preferences = await db('notification_preferences')
      .where('user_id', userId)
      .first();

    if (!preferences) {
      // Create default preferences
      const defaultPreferences = {
        user_id: userId,
        email: true,
        sms: true,
        push: true,
        in_app: true,
        transaction_email: true,
        transaction_sms: true,
        security_email: true,
        security_sms: true,
        account_email: true,
        account_sms: false,
        system_email: false,
        system_sms: false,
        marketing_email: false,
        marketing_sms: false,
      };

      await db('notification_preferences').insert(defaultPreferences);
      preferences = defaultPreferences;
    }

    res.json({
      success: true,
      data: preferences
    });
  } catch (error) {
    logger.error('Failed to get notification preferences:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get notification preferences'
    });
  }
});

// Update user notification preferences
router.put('/preferences', [
  body('email').optional().isBoolean(),
  body('sms').optional().isBoolean(),
  body('push').optional().isBoolean(),
  body('in_app').optional().isBoolean(),
  body('transaction_email').optional().isBoolean(),
  body('transaction_sms').optional().isBoolean(),
  body('security_email').optional().isBoolean(),
  body('security_sms').optional().isBoolean(),
  body('account_email').optional().isBoolean(),
  body('account_sms').optional().isBoolean(),
  body('system_email').optional().isBoolean(),
  body('system_sms').optional().isBoolean(),
  body('marketing_email').optional().isBoolean(),
  body('marketing_sms').optional().isBoolean(),
], async (req: AuthRequest, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const userId = req.user!.id;
    const updates = req.body;

    await db('notification_preferences')
      .where('user_id', userId)
      .update({
        ...updates,
        updated_at: new Date()
      });

    res.json({
      success: true,
      message: 'Notification preferences updated successfully'
    });
  } catch (error) {
    logger.error('Failed to update notification preferences:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update notification preferences'
    });
  }
});

// Get user notifications (in-app)
router.get('/', async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const { page = 1, limit = 20, type, read } = req.query;
    const offset = (Number(page) - 1) * Number(limit);

    let query = db('notifications')
      .where('user_id', userId)
      .orderBy('created_at', 'desc');

    if (type) {
      query = query.where('type', type as string);
    }

    if (read !== undefined) {
      query = query.where('read', read === 'true');
    }

    const notifications = await query
      .limit(Number(limit))
      .offset(offset);

    const total = await db('notifications')
      .where('user_id', userId)
      .count('* as count')
      .first();

    const unreadCount = await db('notifications')
      .where('user_id', userId)
      .where('read', false)
      .count('* as count')
      .first();

    res.json({
      success: true,
      data: {
        notifications,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total: Number(total?.count || 0),
          pages: Math.ceil(Number(total?.count || 0) / Number(limit))
        },
        unreadCount: Number(unreadCount?.count || 0)
      }
    });
  } catch (error) {
    logger.error('Failed to get notifications:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get notifications'
    });
  }
});

// Mark notification as read
router.patch('/:id/read', async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const notificationId = req.params.id;

    const notification = await db('notifications')
      .where('id', notificationId)
      .where('user_id', userId)
      .first();

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }

    await db('notifications')
      .where('id', notificationId)
      .update({
        read: true,
        read_at: new Date(),
        updated_at: new Date()
      });

    res.json({
      success: true,
      message: 'Notification marked as read'
    });
  } catch (error) {
    logger.error('Failed to mark notification as read:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to mark notification as read'
    });
  }
});

// Mark all notifications as read
router.patch('/read-all', async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;

    await db('notifications')
      .where('user_id', userId)
      .where('read', false)
      .update({
        read: true,
        read_at: new Date(),
        updated_at: new Date()
      });

    res.json({
      success: true,
      message: 'All notifications marked as read'
    });
  } catch (error) {
    logger.error('Failed to mark all notifications as read:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to mark all notifications as read'
    });
  }
});

// Delete notification
router.delete('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const notificationId = req.params.id;

    const deleted = await db('notifications')
      .where('id', notificationId)
      .where('user_id', userId)
      .del();

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }

    res.json({
      success: true,
      message: 'Notification deleted successfully'
    });
  } catch (error) {
    logger.error('Failed to delete notification:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete notification'
    });
  }
});

// Test notification endpoint (for testing purposes)
router.post('/test', [
  body('type').isIn(['transaction', 'security', 'account', 'system', 'marketing']),
  body('priority').isIn(['low', 'medium', 'high', 'critical']),
  body('title').notEmpty(),
  body('message').notEmpty(),
  body('channels').isArray(),
], async (req: AuthRequest, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const userId = req.user!.id;
    const { type, priority, title, message, channels, data } = req.body;

    // Emit test notification event
    notificationService.emit('test:notification', {
      userId,
      type,
      priority,
      title,
      message,
      channels,
      data
    });

    res.json({
      success: true,
      message: 'Test notification sent'
    });
  } catch (error) {
    logger.error('Failed to send test notification:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send test notification'
    });
  }
});

// Get notification delivery logs
router.get('/logs', async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const { page = 1, limit = 20, channel, status } = req.query;
    const offset = (Number(page) - 1) * Number(limit);

    let query = db('notification_logs')
      .join('notification_events', 'notification_logs.event_id', 'notification_events.id')
      .where('notification_logs.user_id', userId)
      .select(
        'notification_logs.*',
        'notification_events.title',
        'notification_events.type'
      )
      .orderBy('notification_logs.created_at', 'desc');

    if (channel) {
      query = query.where('notification_logs.channel', channel as string);
    }

    if (status) {
      query = query.where('notification_logs.status', status as string);
    }

    const logs = await query
      .limit(Number(limit))
      .offset(offset);

    const total = await db('notification_logs')
      .where('user_id', userId)
      .count('* as count')
      .first();

    res.json({
      success: true,
      data: {
        logs,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total: Number(total?.count || 0),
          pages: Math.ceil(Number(total?.count || 0) / Number(limit))
        }
      }
    });
  } catch (error) {
    logger.error('Failed to get notification logs:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get notification logs'
    });
  }
});

// Get provider health status
router.get('/providers/health', async (req: AuthRequest, res: Response) => {
  try {
    const emailService = new EmailService();
    const smsService = new SMSService();

    const [emailProviders, smsProviders] = await Promise.all([
      emailService.getProviderStatus(),
      smsService.getProviderStatus()
    ]);

    res.json({
      success: true,
      data: {
        email: emailProviders,
        sms: smsProviders
      }
    });
  } catch (error) {
    logger.error('Failed to get provider health status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get provider health status'
    });
  }
});

export default router;
