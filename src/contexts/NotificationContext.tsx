import { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { useToast } from '@/hooks/use-toast';

interface Notification {
  id: string;
  type: 'transaction' | 'security' | 'investment' | 'account' | 'system' | 'marketing';
  title: string;
  message: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'unread' | 'read' | 'archived';
  timestamp: string;
  actionRequired?: boolean;
  actionUrl?: string;
  metadata?: {
    amount?: number;
    accountNumber?: string;
    transactionId?: string;
    symbol?: string;
  };
}

interface NotificationSettings {
  email: {
    transactions: boolean;
    security: boolean;
    investments: boolean;
    marketing: boolean;
    system: boolean;
  };
  sms: {
    transactions: boolean;
    security: boolean;
    investments: boolean;
    critical: boolean;
  };
  push: {
    transactions: boolean;
    security: boolean;
    investments: boolean;
    marketing: boolean;
    system: boolean;
  };
  desktop: {
    enabled: boolean;
    sound: boolean;
  };
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  settings: NotificationSettings;
  isConnected: boolean;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'status'>) => void;
  markAsRead: (notificationId: string) => void;
  markAllAsRead: () => void;
  archiveNotification: (notificationId: string) => void;
  deleteNotification: (notificationId: string) => void;
  updateSettings: (settings: NotificationSettings) => void;
  subscribeToNotifications: () => void;
  unsubscribeFromNotifications: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

interface NotificationProviderProps {
  children: ReactNode;
}

export function NotificationProvider({ children }: NotificationProviderProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const ws = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [reconnectAttempts, setReconnectAttempts] = useState(0);
  const maxReconnectAttempts = 5;

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [settings, setSettings] = useState<NotificationSettings>({
    email: {
      transactions: true,
      security: true,
      investments: true,
      marketing: false,
      system: true,
    },
    sms: {
      transactions: true,
      security: true,
      investments: false,
      critical: true,
    },
    push: {
      transactions: true,
      security: true,
      investments: true,
      marketing: false,
      system: true,
    },
    desktop: {
      enabled: true,
      sound: true,
    },
  });

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('notificationSettings');
    if (savedSettings) {
      try {
        setSettings(JSON.parse(savedSettings));
      } catch (error) {
        console.error('Failed to parse notification settings:', error);
      }
    }

    // Request notification permission
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }

    // Load initial notifications
    loadInitialNotifications();
  }, []);

  // WebSocket connection management
  useEffect(() => {
    if (user) {
      subscribeToNotifications();
    } else {
      unsubscribeFromNotifications();
    }

    return () => {
      unsubscribeFromNotifications();
    };
  }, [user]);

  const loadInitialNotifications = () => {
    // In a real app, this would load from an API
    // For now, we'll load some mock data
    const mockNotifications: Notification[] = [
      {
        id: '1',
        type: 'transaction',
        title: 'Payment Received',
        message: 'You received a payment of $500.00',
        priority: 'medium',
        status: 'unread',
        timestamp: new Date().toISOString(),
        metadata: { amount: 500 }
      }
    ];

    setNotifications(mockNotifications);
  };

  const subscribeToNotifications = () => {
    if (!user || ws.current?.readyState === WebSocket.OPEN) return;

    try {
      // In a real app, this would connect to your WebSocket server
      // For demo purposes, we'll simulate a connection
      const mockWs = {
        readyState: WebSocket.OPEN,
        close: () => {},
        addEventListener: () => {},
        removeEventListener: () => {},
      };

      // Simulate connection
      setIsConnected(true);
      setReconnectAttempts(0);

      // Simulate receiving notifications periodically
      const interval = setInterval(() => {
        if (Math.random() > 0.9) { // 10% chance every 30 seconds
          simulateIncomingNotification();
        }
      }, 30000);

      ws.current = {
        ...mockWs,
        close: () => {
          clearInterval(interval);
          setIsConnected(false);
        }
      } as any;

    } catch (error) {
      console.error('Failed to connect to notification service:', error);
      handleReconnect();
    }
  };

  const unsubscribeFromNotifications = () => {
    if (ws.current) {
      ws.current.close();
      ws.current = null;
    }
    setIsConnected(false);

    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
  };

  const handleReconnect = () => {
    if (reconnectAttempts >= maxReconnectAttempts) {
      console.error('Max reconnection attempts reached');
      return;
    }

    const delay = Math.min(1000 * Math.pow(2, reconnectAttempts), 30000); // Exponential backoff
    
    reconnectTimeoutRef.current = setTimeout(() => {
      setReconnectAttempts(prev => prev + 1);
      subscribeToNotifications();
    }, delay);
  };

  const simulateIncomingNotification = () => {
    const notificationTypes = [
      {
        type: 'transaction' as const,
        title: 'Payment Processed',
        message: 'Your payment of $250.00 has been processed successfully',
        priority: 'medium' as const,
        metadata: { amount: 250, transactionId: 'TXN' + Date.now() }
      },
      {
        type: 'security' as const,
        title: 'Login Alert',
        message: 'New login detected from a new device',
        priority: 'high' as const,
      },
      {
        type: 'investment' as const,
        title: 'Price Alert',
        message: 'AAPL has reached your target price',
        priority: 'medium' as const,
        metadata: { symbol: 'AAPL' }
      },
      {
        type: 'system' as const,
        title: 'System Update',
        message: 'New features are now available in your account',
        priority: 'low' as const,
      }
    ];

    const randomNotification = notificationTypes[Math.floor(Math.random() * notificationTypes.length)];
    addNotification(randomNotification);
  };

  const addNotification = (notificationData: Omit<Notification, 'id' | 'timestamp' | 'status'>) => {
    const notification: Notification = {
      ...notificationData,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toISOString(),
      status: 'unread',
    };

    setNotifications(prev => [notification, ...prev]);

    // Show toast for high priority notifications
    if (notification.priority === 'high' || notification.priority === 'critical') {
      toast({
        title: notification.title,
        description: notification.message,
        variant: notification.priority === 'critical' ? 'destructive' : 'default',
      });
    }

    // Show desktop notification if enabled
    if (settings.desktop.enabled && shouldShowNotification(notification)) {
      showDesktopNotification(notification);
    }

    // Play sound if enabled
    if (settings.desktop.sound) {
      playNotificationSound(notification.priority);
    }
  };

  const shouldShowNotification = (notification: Notification): boolean => {
    switch (notification.type) {
      case 'transaction':
        return settings.push.transactions;
      case 'security':
        return settings.push.security;
      case 'investment':
        return settings.push.investments;
      case 'system':
        return settings.push.system;
      case 'marketing':
        return settings.push.marketing;
      default:
        return true;
    }
  };

  const showDesktopNotification = (notification: Notification) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      const desktopNotification = new Notification(notification.title, {
        body: notification.message,
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        tag: notification.id,
      });

      // Auto-close after 5 seconds
      setTimeout(() => {
        desktopNotification.close();
      }, 5000);

      // Handle click
      desktopNotification.onclick = () => {
        window.focus();
        markAsRead(notification.id);
        desktopNotification.close();
      };
    }
  };

  const playNotificationSound = (priority: Notification['priority']) => {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      // Different frequencies for different priorities
      const frequencies = {
        low: 400,
        medium: 600,
        high: 800,
        critical: 1000,
      };

      oscillator.frequency.setValueAtTime(frequencies[priority], audioContext.currentTime);
      oscillator.type = 'sine';
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);

      oscillator.start();
      oscillator.stop(audioContext.currentTime + 0.2);
    } catch (error) {
      // Silently fail if audio context is not supported
      console.warn('Audio notifications not supported:', error);
    }
  };

  const markAsRead = (notificationId: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === notificationId
          ? { ...notification, status: 'read' as const }
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, status: 'read' as const }))
    );
  };

  const archiveNotification = (notificationId: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === notificationId
          ? { ...notification, status: 'archived' as const }
          : notification
      )
    );
  };

  const deleteNotification = (notificationId: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== notificationId));
  };

  const updateSettings = (newSettings: NotificationSettings) => {
    setSettings(newSettings);
    localStorage.setItem('notificationSettings', JSON.stringify(newSettings));
  };

  const unreadCount = notifications.filter(n => n.status === 'unread').length;

  const value: NotificationContextType = {
    notifications,
    unreadCount,
    settings,
    isConnected,
    addNotification,
    markAsRead,
    markAllAsRead,
    archiveNotification,
    deleteNotification,
    updateSettings,
    subscribeToNotifications,
    unsubscribeFromNotifications,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}

// Helper hook for triggering specific notification types
export function useNotificationTriggers() {
  const { addNotification } = useNotifications();

  const notifyTransaction = (type: 'sent' | 'received', amount: number, details?: string) => {
    addNotification({
      type: 'transaction',
      title: `Payment ${type === 'sent' ? 'Sent' : 'Received'}`,
      message: `${type === 'sent' ? 'You sent' : 'You received'} $${amount.toFixed(2)}${details ? ` - ${details}` : ''}`,
      priority: 'medium',
      metadata: { amount, transactionId: 'TXN' + Date.now() }
    });
  };

  const notifySecurityEvent = (event: string, severity: 'low' | 'high' = 'high') => {
    addNotification({
      type: 'security',
      title: 'Security Alert',
      message: event,
      priority: severity === 'high' ? 'high' : 'medium',
      actionRequired: severity === 'high'
    });
  };

  const notifyInvestment = (symbol: string, message: string, priority: Notification['priority'] = 'medium') => {
    addNotification({
      type: 'investment',
      title: 'Investment Update',
      message,
      priority,
      metadata: { symbol }
    });
  };

  const notifySystem = (title: string, message: string) => {
    addNotification({
      type: 'system',
      title,
      message,
      priority: 'low'
    });
  };

  return {
    notifyTransaction,
    notifySecurityEvent,
    notifyInvestment,
    notifySystem,
  };
}
