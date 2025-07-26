import { toast } from '@/hooks/use-toast';

export interface Notification {
  id: string;
  type: 'transaction' | 'security' | 'account' | 'system' | 'marketing';
  priority: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  actionUrl?: string;
  metadata?: Record<string, any>;
}

export interface NotificationPreferences {
  email: boolean;
  sms: boolean;
  push: boolean;
  inApp: boolean;
}

export interface NotificationSettings {
  transaction: NotificationPreferences;
  security: NotificationPreferences;
  account: NotificationPreferences;
  system: NotificationPreferences;
  marketing: NotificationPreferences;
}

class NotificationService {
  private notifications: Notification[] = [];
  private listeners: ((notifications: Notification[]) => void)[] = [];
  private settings: NotificationSettings = {
    transaction: { email: true, sms: true, push: true, inApp: true },
    security: { email: true, sms: true, push: true, inApp: true },
    account: { email: true, sms: false, push: true, inApp: true },
    system: { email: false, sms: false, push: true, inApp: true },
    marketing: { email: false, sms: false, push: false, inApp: true },
  };

  // Subscribe to notification updates
  subscribe(listener: (notifications: Notification[]) => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  // Notify all listeners
  private notifyListeners() {
    this.listeners.forEach(listener => listener([...this.notifications]));
  }

  // Add a new notification
  addNotification(notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) {
    const newNotification: Notification = {
      ...notification,
      id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      read: false,
    };

    this.notifications.unshift(newNotification);
    this.notifyListeners();

    // Show toast for high priority notifications
    if (notification.priority === 'high' || notification.priority === 'critical') {
      toast({
        title: notification.title,
        description: notification.message,
        variant: notification.priority === 'critical' ? 'destructive' : 'default',
      });
    }

    // Simulate sending notifications via different channels
    this.simulateNotificationDelivery(newNotification);

    return newNotification.id;
  }

  // Simulate notification delivery
  private simulateNotificationDelivery(notification: Notification) {
    const preferences = this.settings[notification.type];
    
    if (preferences.email) {
      console.log(`📧 Email notification sent: ${notification.title}`);
    }
    
    if (preferences.sms) {
      console.log(`📱 SMS notification sent: ${notification.title}`);
    }
    
    if (preferences.push) {
      console.log(`🔔 Push notification sent: ${notification.title}`);
    }
  }

  // Mark notification as read
  markAsRead(notificationId: string) {
    const notification = this.notifications.find(n => n.id === notificationId);
    if (notification) {
      notification.read = true;
      this.notifyListeners();
    }
  }

  // Mark all notifications as read
  markAllAsRead() {
    this.notifications.forEach(n => n.read = true);
    this.notifyListeners();
  }

  // Get all notifications
  getNotifications() {
    return [...this.notifications];
  }

  // Get unread notifications
  getUnreadNotifications() {
    return this.notifications.filter(n => !n.read);
  }

  // Get notifications by type
  getNotificationsByType(type: Notification['type']) {
    return this.notifications.filter(n => n.type === type);
  }

  // Delete notification
  deleteNotification(notificationId: string) {
    this.notifications = this.notifications.filter(n => n.id !== notificationId);
    this.notifyListeners();
  }

  // Clear all notifications
  clearAllNotifications() {
    this.notifications = [];
    this.notifyListeners();
  }

  // Update notification settings
  updateSettings(newSettings: Partial<NotificationSettings>) {
    this.settings = { ...this.settings, ...newSettings };
  }

  // Get notification settings
  getSettings() {
    return { ...this.settings };
  }

  // Banking-specific notification methods
  notifyTransaction(type: 'sent' | 'received' | 'failed', amount: number, currency: string, recipient?: string) {
    const messages = {
      sent: `You sent ${currency} ${amount.toLocaleString()} ${recipient ? `to ${recipient}` : ''}`,
      received: `You received ${currency} ${amount.toLocaleString()} ${recipient ? `from ${recipient}` : ''}`,
      failed: `Transaction of ${currency} ${amount.toLocaleString()} failed`,
    };

    this.addNotification({
      type: 'transaction',
      priority: type === 'failed' ? 'high' : 'medium',
      title: `Transaction ${type === 'sent' ? 'Sent' : type === 'received' ? 'Received' : 'Failed'}`,
      message: messages[type],
      metadata: { amount, currency, recipient, transactionType: type },
    });
  }

  notifyLogin(location: string, device: string, success: boolean = true) {
    this.addNotification({
      type: 'security',
      priority: success ? 'low' : 'critical',
      title: success ? 'Successful Login' : 'Failed Login Attempt',
      message: success 
        ? `You logged in from ${device} in ${location}`
        : `Failed login attempt from ${device} in ${location}`,
      metadata: { location, device, loginSuccess: success },
    });
  }

  notifySecurityAlert(alertType: 'password_change' | 'device_added' | 'suspicious_activity' | 'account_locked', details?: string) {
    const messages = {
      password_change: 'Your password was successfully changed',
      device_added: 'A new device was added to your account',
      suspicious_activity: 'Suspicious activity detected on your account',
      account_locked: 'Your account has been temporarily locked for security',
    };

    this.addNotification({
      type: 'security',
      priority: alertType === 'suspicious_activity' || alertType === 'account_locked' ? 'critical' : 'high',
      title: 'Security Alert',
      message: details || messages[alertType],
      metadata: { alertType, details },
    });
  }

  notifyAccountUpdate(updateType: 'profile' | 'settings' | 'verification' | 'limit_change', details: string) {
    this.addNotification({
      type: 'account',
      priority: 'medium',
      title: 'Account Updated',
      message: details,
      metadata: { updateType, details },
    });
  }

  notifySystemMaintenance(startTime: Date, endTime: Date, services: string[]) {
    this.addNotification({
      type: 'system',
      priority: 'medium',
      title: 'Scheduled Maintenance',
      message: `System maintenance scheduled from ${startTime.toLocaleString()} to ${endTime.toLocaleString()}`,
      metadata: { startTime, endTime, services },
    });
  }
}

// Create singleton instance
export const notificationService = new NotificationService();

// Initialize notification service
// Real notifications will be generated based on actual user activity
