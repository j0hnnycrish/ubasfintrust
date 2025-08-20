import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import {
  Bell,
  BellOff,
  Settings,
  Check,
  X,
  AlertTriangle,
  DollarSign,
  CreditCard,
  TrendingUp,
  User,
  Shield,
  Mail,
  MessageSquare,
  Smartphone,
  Globe,
  Clock,
  CheckCircle,
  XCircle,
  Info,
  Archive,
  Trash2,
  Send,
  Users,
  Filter,
  Search,
  MoreVertical,
  Eye,
  Volume2,
  VolumeX,
  Zap
} from 'lucide-react';

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

interface AdminNotification {
  id: string;
  title: string;
  message: string;
  type: 'announcement' | 'maintenance' | 'security' | 'update';
  targetAudience: 'all' | 'premium' | 'new_users' | 'custom';
  scheduledFor?: string;
  status: 'draft' | 'scheduled' | 'sent';
  recipients?: string[];
}

export function NotificationSystem() {
  const { user } = useAuth();
  const { toast } = useToast();
  const ws = useRef<WebSocket | null>(null);

  // State for notifications
  const [notifications, setNotifications] = useState<Notification[]>([]);
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

  // UI State
  const [activeTab, setActiveTab] = useState('notifications');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  // Admin state
  const [adminNotifications, setAdminNotifications] = useState<AdminNotification[]>([]);
  const [showAdminCompose, setShowAdminCompose] = useState(false);
  const [adminForm, setAdminForm] = useState({
    title: '',
    message: '',
    type: 'announcement' as AdminNotification['type'],
    targetAudience: 'all' as AdminNotification['targetAudience'],
    scheduledFor: '',
  });

  // Initialize WebSocket connection
  useEffect(() => {
    connectWebSocket();
    loadNotifications();
    loadSettings();

    // Request notification permission
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }

    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, []);

  const connectWebSocket = () => {
    // In a real app, this would connect to your WebSocket server
    // For demo purposes, we'll simulate a connection
    setIsConnected(true);
    
    // Simulate receiving notifications
    const interval = setInterval(() => {
      if (Math.random() > 0.8) { // 20% chance every 10 seconds
        simulateNewNotification();
      }
    }, 10000);

    return () => clearInterval(interval);
  };

  const simulateNewNotification = () => {
    const types: Notification['type'][] = ['transaction', 'security', 'investment', 'account', 'system'];
    const priorities: Notification['priority'][] = ['low', 'medium', 'high', 'critical'];
    
    const mockNotifications = [
      {
        type: 'transaction',
        title: 'Payment Received',
        message: 'You received a payment of $500.00 from John Doe',
        metadata: { amount: 500, transactionId: 'TXN' + Date.now() }
      },
      {
        type: 'security',
        title: 'Login Alert',
        message: 'New login detected from Chrome on Windows',
        priority: 'high'
      },
      {
        type: 'investment',
        title: 'Price Alert',
        message: 'AAPL has reached your target price of $190.00',
        metadata: { symbol: 'AAPL' }
      },
      {
        type: 'system',
        title: 'Maintenance Notice',
        message: 'Scheduled maintenance will occur tonight from 2-4 AM EST'
      }
    ];

    const randomNotification = mockNotifications[Math.floor(Math.random() * mockNotifications.length)];
    
    const newNotification: Notification = {
      id: Date.now().toString(),
      type: randomNotification.type as Notification['type'],
      title: randomNotification.title,
      message: randomNotification.message,
      priority: (randomNotification as any).priority || priorities[Math.floor(Math.random() * priorities.length)],
      status: 'unread',
      timestamp: new Date().toISOString(),
      metadata: (randomNotification as any).metadata,
    };

    setNotifications(prev => [newNotification, ...prev]);
    showDesktopNotification(newNotification);
    playNotificationSound(newNotification.priority);
  };

  const loadNotifications = () => {
    // Mock notifications data
    const mockNotifications: Notification[] = [
      {
        id: '1',
        type: 'transaction',
        title: 'Payment Sent',
        message: 'Payment of $250.00 sent to Electric Company',
        priority: 'medium',
        status: 'read',
        timestamp: '2024-01-15T10:30:00Z',
        metadata: { amount: 250, transactionId: 'TXN123456' }
      },
      {
        id: '2',
        type: 'security',
        title: 'Password Changed',
        message: 'Your account password was successfully changed',
        priority: 'high',
        status: 'read',
        timestamp: '2024-01-15T09:15:00Z',
        actionRequired: false
      },
      {
        id: '3',
        type: 'investment',
        title: 'Investment Update',
        message: 'Your portfolio gained 2.5% today (+$1,250)',
        priority: 'low',
        status: 'unread',
        timestamp: '2024-01-15T16:00:00Z'
      },
      {
        id: '4',
        type: 'system',
        title: 'New Feature Available',
        message: 'Check out our new investment analytics dashboard',
        priority: 'low',
        status: 'unread',
        timestamp: '2024-01-15T08:00:00Z'
      }
    ];

    setNotifications(mockNotifications);
  };

  const loadSettings = () => {
    // Load from localStorage or API
    const savedSettings = localStorage.getItem('notificationSettings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  };

  const saveSettings = (newSettings: NotificationSettings) => {
    setSettings(newSettings);
    localStorage.setItem('notificationSettings', JSON.stringify(newSettings));
    toast({
      title: 'Settings Saved',
      description: 'Your notification preferences have been updated.',
    });
  };

  const showDesktopNotification = (notification: Notification) => {
    if (settings.desktop.enabled && 'Notification' in window && Notification.permission === 'granted') {
      new Notification(notification.title, {
        body: notification.message,
        icon: '/favicon.ico', // Add your app icon
        badge: '/favicon.ico',
        tag: notification.id,
      });
    }
  };

  const playNotificationSound = (priority: Notification['priority']) => {
    if (!settings.desktop.sound) return;

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
  };

  const markAsRead = (notificationId: string) => {
    setNotifications(prev =>
      prev.map(n => n.id === notificationId ? { ...n, status: 'read' } : n)
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(n => ({ ...n, status: 'read' as const }))
    );
  };

  const archiveNotification = (notificationId: string) => {
    setNotifications(prev =>
      prev.map(n => n.id === notificationId ? { ...n, status: 'archived' } : n)
    );
  };

  const deleteNotification = (notificationId: string) => {
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
  };

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'transaction': return <DollarSign className="h-5 w-5" />;
      case 'security': return <Shield className="h-5 w-5" />;
      case 'investment': return <TrendingUp className="h-5 w-5" />;
      case 'account': return <User className="h-5 w-5" />;
      case 'system': return <Settings className="h-5 w-5" />;
      case 'marketing': return <Mail className="h-5 w-5" />;
    }
  };

  const getPriorityColor = (priority: Notification['priority']) => {
    switch (priority) {
      case 'low': return 'text-gray-600 bg-gray-100';
      case 'medium': return 'text-blue-600 bg-blue-100';
      case 'high': return 'text-orange-600 bg-orange-100';
      case 'critical': return 'text-red-600 bg-red-100';
    }
  };

  const filteredNotifications = notifications.filter(notification => {
    const matchesType = filterType === 'all' || notification.type === filterType;
    const matchesStatus = filterStatus === 'all' || notification.status === filterStatus;
    const matchesSearch = searchQuery === '' || 
      notification.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notification.message.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesType && matchesStatus && matchesSearch;
  });

  const unreadCount = notifications.filter(n => n.status === 'unread').length;

  const sendAdminNotification = () => {
    const newNotification: AdminNotification = {
      id: Date.now().toString(),
      ...adminForm,
      status: adminForm.scheduledFor ? 'scheduled' : 'sent',
    };

    setAdminNotifications(prev => [newNotification, ...prev]);
    setAdminForm({
      title: '',
      message: '',
      type: 'announcement',
      targetAudience: 'all',
      scheduledFor: '',
    });
    setShowAdminCompose(false);

    toast({
      title: 'Notification Sent',
      description: `Notification ${adminForm.scheduledFor ? 'scheduled' : 'sent'} successfully.`,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Bell className="h-8 w-8 text-gray-700" />
            {unreadCount > 0 && (
              <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                {unreadCount}
              </Badge>
            )}
          </div>
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Notifications</h2>
            <p className="text-muted-foreground">
              {unreadCount} unread • Connection: {isConnected ? 'Connected' : 'Disconnected'}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" onClick={() => setShowSettings(true)}>
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
          {user?.role === 'admin' && (
            <Button onClick={() => setShowAdminCompose(true)}>
              <Send className="h-4 w-4 mr-2" />
              Send Notification
            </Button>
          )}
        </div>
      </div>

      {/* Connection Status */}
      <Card className={`border-l-4 ${isConnected ? 'border-l-green-500 bg-green-50' : 'border-l-red-500 bg-red-50'}`}>
        <CardContent className="p-4">
          <div className="flex items-center space-x-3">
            <div className={`h-2 w-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
            <span className="font-medium">
              {isConnected ? 'Real-time notifications active' : 'Connection lost - retrying...'}
            </span>
            {isConnected && <Zap className="h-4 w-4 text-green-600" />}
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="notifications">
            Notifications ({unreadCount})
          </TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
          {user?.role === 'admin' && (
            <TabsTrigger value="admin">Admin Panel</TabsTrigger>
          )}
        </TabsList>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="space-y-4">
          {/* Filters and Actions */}
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search notifications..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="transaction">Transactions</SelectItem>
                  <SelectItem value="security">Security</SelectItem>
                  <SelectItem value="investment">Investments</SelectItem>
                  <SelectItem value="account">Account</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="unread">Unread</SelectItem>
                  <SelectItem value="read">Read</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2">
              <Button variant="outline" onClick={markAllAsRead} disabled={unreadCount === 0}>
                <CheckCircle className="h-4 w-4 mr-2" />
                Mark All Read
              </Button>
            </div>
          </div>

          {/* Notifications List */}
          <div className="space-y-3">
            {filteredNotifications.length === 0 ? (
              <Card>
                <CardContent className="text-center py-8">
                  <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No notifications</h3>
                  <p className="text-gray-600">You're all caught up!</p>
                </CardContent>
              </Card>
            ) : (
              filteredNotifications.map((notification) => (
                <Card 
                  key={notification.id} 
                  className={`cursor-pointer transition-colors hover:bg-gray-50 ${
                    notification.status === 'unread' ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                  }`}
                  onClick={() => markAsRead(notification.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-4">
                      <div className={`p-2 rounded-full ${getPriorityColor(notification.priority)}`}>
                        {getNotificationIcon(notification.type)}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium text-gray-900 truncate">
                            {notification.title}
                          </h4>
                          <div className="flex items-center space-x-2">
                            <Badge variant="outline" className="text-xs">
                              {notification.priority}
                            </Badge>
                            <span className="text-xs text-gray-500">
                              {new Date(notification.timestamp).toLocaleString()}
                            </span>
                          </div>
                        </div>
                        
                        <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                        
                        {notification.metadata && (
                          <div className="mt-2 flex items-center space-x-4 text-xs text-gray-500">
                            {notification.metadata.amount && (
                              <span>Amount: ${notification.metadata.amount}</span>
                            )}
                            {notification.metadata.transactionId && (
                              <span>ID: {notification.metadata.transactionId}</span>
                            )}
                            {notification.metadata.symbol && (
                              <span>Symbol: {notification.metadata.symbol}</span>
                            )}
                          </div>
                        )}
                        
                        {notification.actionRequired && (
                          <div className="mt-3">
                            <Button size="sm" variant="outline">
                              Take Action
                            </Button>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center space-x-2">
                        {notification.status === 'unread' && (
                          <div className="h-2 w-2 bg-blue-500 rounded-full" />
                        )}
                        
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            archiveNotification(notification.id);
                          }}
                        >
                          <Archive className="h-4 w-4" />
                        </Button>
                        
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteNotification(notification.id);
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        {/* Preferences Tab */}
        <TabsContent value="preferences" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Email Notifications */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Mail className="h-5 w-5" />
                  <span>Email Notifications</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(settings.email).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between">
                    <Label className="capitalize">{key.replace('_', ' ')}</Label>
                    <Switch
                      checked={value}
                      onCheckedChange={(checked) =>
                        setSettings(prev => ({
                          ...prev,
                          email: { ...prev.email, [key]: checked }
                        }))
                      }
                    />
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* SMS Notifications */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MessageSquare className="h-5 w-5" />
                  <span>SMS Notifications</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(settings.sms).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between">
                    <Label className="capitalize">{key.replace('_', ' ')}</Label>
                    <Switch
                      checked={value}
                      onCheckedChange={(checked) =>
                        setSettings(prev => ({
                          ...prev,
                          sms: { ...prev.sms, [key]: checked }
                        }))
                      }
                    />
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Push Notifications */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Smartphone className="h-5 w-5" />
                  <span>Push Notifications</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(settings.push).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between">
                    <Label className="capitalize">{key.replace('_', ' ')}</Label>
                    <Switch
                      checked={value}
                      onCheckedChange={(checked) =>
                        setSettings(prev => ({
                          ...prev,
                          push: { ...prev.push, [key]: checked }
                        }))
                      }
                    />
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Desktop Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Globe className="h-5 w-5" />
                  <span>Desktop Settings</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Desktop notifications</Label>
                  <Switch
                    checked={settings.desktop.enabled}
                    onCheckedChange={(checked) =>
                      setSettings(prev => ({
                        ...prev,
                        desktop: { ...prev.desktop, enabled: checked }
                      }))
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label>Sound alerts</Label>
                  <Switch
                    checked={settings.desktop.sound}
                    onCheckedChange={(checked) =>
                      setSettings(prev => ({
                        ...prev,
                        desktop: { ...prev.desktop, sound: checked }
                      }))
                    }
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="flex justify-end">
            <Button onClick={() => saveSettings(settings)}>
              Save Preferences
            </Button>
          </div>
        </TabsContent>

        {/* Admin Panel Tab */}
        {user?.role === 'admin' && (
          <TabsContent value="admin" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Send Notification to Users</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Title</Label>
                    <Input
                      value={adminForm.title}
                      onChange={(e) => setAdminForm(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Notification title"
                    />
                  </div>
                  <div>
                    <Label>Type</Label>
                    <Select 
                      value={adminForm.type} 
                      onValueChange={(value: AdminNotification['type']) => 
                        setAdminForm(prev => ({ ...prev, type: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="announcement">Announcement</SelectItem>
                        <SelectItem value="maintenance">Maintenance</SelectItem>
                        <SelectItem value="security">Security</SelectItem>
                        <SelectItem value="update">Update</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label>Message</Label>
                  <Textarea
                    value={adminForm.message}
                    onChange={(e) => setAdminForm(prev => ({ ...prev, message: e.target.value }))}
                    placeholder="Notification message"
                    rows={4}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Target Audience</Label>
                    <Select 
                      value={adminForm.targetAudience} 
                      onValueChange={(value: AdminNotification['targetAudience']) => 
                        setAdminForm(prev => ({ ...prev, targetAudience: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Users</SelectItem>
                        <SelectItem value="premium">Premium Users</SelectItem>
                        <SelectItem value="new_users">New Users</SelectItem>
                        <SelectItem value="custom">Custom List</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Schedule For (Optional)</Label>
                    <Input
                      type="datetime-local"
                      value={adminForm.scheduledFor}
                      onChange={(e) => setAdminForm(prev => ({ ...prev, scheduledFor: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-3">
                  <Button variant="outline" onClick={() => setAdminForm({
                    title: '',
                    message: '',
                    type: 'announcement',
                    targetAudience: 'all',
                    scheduledFor: '',
                  })}>
                    Clear
                  </Button>
                  <Button onClick={sendAdminNotification}>
                    {adminForm.scheduledFor ? 'Schedule Notification' : 'Send Now'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>

      {/* Settings Modal */}
      <Dialog open={showSettings} onOpenChange={setShowSettings}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Notification Settings</DialogTitle>
            <DialogDescription>
              Configure how you want to receive notifications
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* Quick toggles */}
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Bell className="h-5 w-5" />
                      <span>All Notifications</span>
                    </div>
                    <Switch 
                      checked={Object.values(settings.email).some(v => v)}
                      onCheckedChange={(checked) => {
                        setSettings(prev => ({
                          ...prev,
                          email: Object.fromEntries(
                            Object.keys(prev.email).map(key => [key, checked])
                          ) as typeof prev.email,
                          push: Object.fromEntries(
                            Object.keys(prev.push).map(key => [key, checked])
                          ) as typeof prev.push,
                        }));
                      }}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {settings.desktop.sound ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
                      <span>Sound Alerts</span>
                    </div>
                    <Switch 
                      checked={settings.desktop.sound}
                      onCheckedChange={(checked) =>
                        setSettings(prev => ({
                          ...prev,
                          desktop: { ...prev.desktop, sound: checked }
                        }))
                      }
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="flex justify-end space-x-3">
              <Button variant="outline" onClick={() => setShowSettings(false)}>
                Cancel
              </Button>
              <Button onClick={() => {
                saveSettings(settings);
                setShowSettings(false);
              }}>
                Save Settings
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
