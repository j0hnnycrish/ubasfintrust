import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Bell, 
  BellRing, 
  Check, 
  Trash2, 
  Settings, 
  CreditCard, 
  Shield, 
  User, 
  Server,
  Tag,
  Clock,
  X
} from 'lucide-react';
import { notificationService, Notification } from '@/lib/notificationService';
import { formatDistanceToNow } from 'date-fns';

interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NotificationCenter({ isOpen, onClose }: NotificationCenterProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    const unsubscribe = notificationService.subscribe(setNotifications);
    setNotifications(notificationService.getNotifications());
    return unsubscribe;
  }, []);

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'transaction':
        return <CreditCard className="h-4 w-4" />;
      case 'security':
        return <Shield className="h-4 w-4" />;
      case 'account':
        return <User className="h-4 w-4" />;
      case 'system':
        return <Server className="h-4 w-4" />;
      case 'marketing':
        return <Tag className="h-4 w-4" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  const getPriorityColor = (priority: Notification['priority']) => {
    switch (priority) {
      case 'critical':
        return 'bg-red-100 border-red-200 text-red-800';
      case 'high':
        return 'bg-orange-100 border-orange-200 text-orange-800';
      case 'medium':
        return 'bg-blue-100 border-blue-200 text-blue-800';
      case 'low':
        return 'bg-gray-100 border-gray-200 text-gray-800';
      default:
        return 'bg-gray-100 border-gray-200 text-gray-800';
    }
  };

  const getFilteredNotifications = () => {
    if (activeTab === 'all') return notifications;
    if (activeTab === 'unread') return notifications.filter(n => !n.read);
    return notifications.filter(n => n.type === activeTab);
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleMarkAsRead = (notificationId: string) => {
    notificationService.markAsRead(notificationId);
  };

  const handleMarkAllAsRead = () => {
    notificationService.markAllAsRead();
  };

  const handleDeleteNotification = (notificationId: string) => {
    notificationService.deleteNotification(notificationId);
  };

  const handleClearAll = () => {
    notificationService.clearAllNotifications();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-end p-4">
      <Card className="w-full max-w-md h-[80vh] bg-white shadow-2xl">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div className="flex items-center space-x-2">
            <BellRing className="h-5 w-5 text-blue-600" />
            <CardTitle className="text-lg">Notifications</CardTitle>
            {unreadCount > 0 && (
              <Badge variant="destructive" className="text-xs">
                {unreadCount}
              </Badge>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleMarkAllAsRead}
              disabled={unreadCount === 0}
            >
              <Check className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 mx-4 mb-4">
              <TabsTrigger value="all" className="text-xs">
                All ({notifications.length})
              </TabsTrigger>
              <TabsTrigger value="unread" className="text-xs">
                Unread ({unreadCount})
              </TabsTrigger>
              <TabsTrigger value="transaction" className="text-xs">
                <CreditCard className="h-3 w-3" />
              </TabsTrigger>
            </TabsList>

            <ScrollArea className="h-[calc(80vh-140px)]">
              <TabsContent value={activeTab} className="mt-0 px-4">
                <div className="space-y-3">
                  {getFilteredNotifications().length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <Bell className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p>No notifications</p>
                    </div>
                  ) : (
                    getFilteredNotifications().map((notification) => (
                      <div
                        key={notification.id}
                        className={`p-4 rounded-lg border transition-all hover:shadow-md ${
                          notification.read 
                            ? 'bg-gray-50 border-gray-200' 
                            : 'bg-white border-blue-200 shadow-sm'
                        }`}
                      >
                        <div className="flex items-start space-x-3">
                          <div className={`p-2 rounded-full ${getPriorityColor(notification.priority)}`}>
                            {getNotificationIcon(notification.type)}
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <h4 className={`text-sm font-medium ${
                                  notification.read ? 'text-gray-700' : 'text-gray-900'
                                }`}>
                                  {notification.title}
                                </h4>
                                <p className={`text-sm mt-1 ${
                                  notification.read ? 'text-gray-500' : 'text-gray-600'
                                }`}>
                                  {notification.message}
                                </p>
                                <div className="flex items-center space-x-2 mt-2">
                                  <Clock className="h-3 w-3 text-gray-400" />
                                  <span className="text-xs text-gray-400">
                                    {formatDistanceToNow(notification.timestamp, { addSuffix: true })}
                                  </span>
                                  <Badge 
                                    variant="outline" 
                                    className="text-xs"
                                  >
                                    {notification.type}
                                  </Badge>
                                </div>
                              </div>
                              
                              <div className="flex items-center space-x-1 ml-2">
                                {!notification.read && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleMarkAsRead(notification.id)}
                                    className="h-6 w-6 p-0"
                                  >
                                    <Check className="h-3 w-3" />
                                  </Button>
                                )}
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDeleteNotification(notification.id)}
                                  className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </TabsContent>
            </ScrollArea>
          </Tabs>

          {notifications.length > 0 && (
            <div className="p-4 border-t bg-gray-50">
              <div className="flex justify-between">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleClearAll}
                  className="text-xs"
                >
                  <Trash2 className="h-3 w-3 mr-1" />
                  Clear All
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs"
                >
                  <Settings className="h-3 w-3 mr-1" />
                  Settings
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
