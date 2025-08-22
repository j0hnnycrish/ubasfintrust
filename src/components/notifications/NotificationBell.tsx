import { useState } from 'react';
import { useNotifications } from '@/contexts/NotificationContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  // DropdownMenu,
  DropdownMenuContent,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import {
  Bell,
  BellOff,
  Check,
  CheckCheck,
  DollarSign,
  Shield,
  TrendingUp,
  User,
  Settings,
  Mail,
  Clock,
  Archive,
  Trash2,
  ExternalLink
} from 'lucide-react';

interface NotificationBellProps {
  onViewAll?: () => void;
}

export function NotificationBell({ onViewAll }: NotificationBellProps) {
  const { 
    notifications, 
    unreadCount, 
    markAsRead, 
    markAllAsRead, 
    archiveNotification,
    deleteNotification,
    isConnected 
  } = useNotifications();
  
  const [isOpen, setIsOpen] = useState(false);

  // Get recent notifications (last 10)
  const recentNotifications = notifications
    .filter(n => n.status !== 'archived')
    .slice(0, 10);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'transaction': return <DollarSign className="h-4 w-4 text-green-600" />;
      case 'security': return <Shield className="h-4 w-4 text-red-600" />;
      case 'investment': return <TrendingUp className="h-4 w-4 text-blue-600" />;
      case 'account': return <User className="h-4 w-4 text-purple-600" />;
      case 'system': return <Settings className="h-4 w-4 text-gray-600" />;
      case 'marketing': return <Mail className="h-4 w-4 text-orange-600" />;
      default: return <Bell className="h-4 w-4 text-gray-600" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'border-l-red-500 bg-red-50';
      case 'high': return 'border-l-orange-500 bg-orange-50';
      case 'medium': return 'border-l-blue-500 bg-blue-50';
      case 'low': return 'border-l-gray-500 bg-gray-50';
      default: return 'border-l-gray-300 bg-white';
    }
  };

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const notificationTime = new Date(timestamp);
    const diffInMinutes = Math.floor((now.getTime() - notificationTime.getTime()) / 60000);

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    
    return notificationTime.toLocaleDateString();
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          {isConnected ? (
            <Bell className="h-5 w-5" />
          ) : (
            <BellOff className="h-5 w-5 text-gray-400" />
          )}
          
          {unreadCount > 0 && (
            <Badge 
              className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
              variant="destructive"
            >
              {unreadCount > 99 ? '99+' : unreadCount}
            </Badge>
          )}

          {/* Connection indicator */}
          <div className={`absolute bottom-0 right-0 h-2 w-2 rounded-full ${
            isConnected ? 'bg-green-500' : 'bg-red-500'
          }`} />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-96 p-0">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center space-x-2">
            <Bell className="h-5 w-5" />
            <h3 className="font-semibold">Notifications</h3>
            {unreadCount > 0 && (
              <Badge variant="secondary" className="text-xs">
                {unreadCount} new
              </Badge>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  markAllAsRead();
                }}
                className="text-xs"
              >
                <CheckCheck className="h-3 w-3 mr-1" />
                Mark all read
              </Button>
            )}
          </div>
        </div>

        {/* Connection Status */}
        <div className={`px-4 py-2 text-xs ${
          isConnected ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50'
        }`}>
          <div className="flex items-center space-x-2">
            <div className={`h-1.5 w-1.5 rounded-full ${
              isConnected ? 'bg-green-500' : 'bg-red-500'
            }`} />
            <span>
              {isConnected ? 'Real-time notifications active' : 'Connection lost'}
            </span>
          </div>
        </div>

        {/* Notifications List */}
        {recentNotifications.length === 0 ? (
          <div className="p-8 text-center">
            <Bell className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 font-medium">No notifications</p>
            <p className="text-gray-400 text-sm">You're all caught up!</p>
          </div>
        ) : (
          <ScrollArea className="max-h-96">
            <div className="p-2">
              {recentNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`relative group p-3 rounded-lg mb-2 cursor-pointer transition-colors hover:bg-gray-50 border-l-2 ${
                    notification.status === 'unread' 
                      ? getPriorityColor(notification.priority)
                      : 'border-l-gray-200 bg-white hover:bg-gray-50'
                  }`}
                  onClick={() => {
                    if (notification.status === 'unread') {
                      markAsRead(notification.id);
                    }
                  }}
                >
                  {/* Unread indicator */}
                  {notification.status === 'unread' && (
                    <div className="absolute top-2 right-2 h-2 w-2 bg-blue-500 rounded-full" />
                  )}

                  <div className="flex items-start space-x-3">
                    <div className="mt-0.5">
                      {getNotificationIcon(notification.type)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className={`text-sm font-medium truncate ${
                          notification.status === 'unread' ? 'text-gray-900' : 'text-gray-700'
                        }`}>
                          {notification.title}
                        </h4>
                        <div className="flex items-center space-x-1 text-xs text-gray-500">
                          <Clock className="h-3 w-3" />
                          <span>{formatTimeAgo(notification.timestamp)}</span>
                        </div>
                      </div>
                      
                      <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                        {notification.message}
                      </p>
                      
                      {notification.metadata && (
                        <div className="mt-2 flex items-center space-x-3 text-xs text-gray-500">
                          {notification.metadata.amount && (
                            <span className="font-medium">
                              ${notification.metadata.amount.toFixed(2)}
                            </span>
                          )}
                          {notification.metadata.symbol && (
                            <span className="font-medium">
                              {notification.metadata.symbol}
                            </span>
                          )}
                          {notification.metadata.transactionId && (
                            <span>
                              ID: {notification.metadata.transactionId}
                            </span>
                          )}
                        </div>
                      )}

                      {notification.actionRequired && (
                        <div className="mt-2">
                          <Button size="sm" variant="outline" className="text-xs h-6">
                            <ExternalLink className="h-3 w-3 mr-1" />
                            Take Action
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Quick Actions (shown on hover) */}
                  <div className="absolute top-2 right-6 opacity-0 group-hover:opacity-100 transition-opacity flex items-center space-x-1">
                    {notification.status === 'unread' && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0"
                        onClick={(e) => {
                          e.stopPropagation();
                          markAsRead(notification.id);
                        }}
                      >
                        <Check className="h-3 w-3" />
                      </Button>
                    )}
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        archiveNotification(notification.id);
                      }}
                    >
                      <Archive className="h-3 w-3" />
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0 text-red-600 hover:text-red-700"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteNotification(notification.id);
                      }}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}

        {/* Footer */}
        {recentNotifications.length > 0 && (
          <>
            <DropdownMenuSeparator />
            <div className="p-2">
              <Button
                variant="ghost"
                className="w-full justify-center text-sm"
                onClick={() => {
                  setIsOpen(false);
                  onViewAll?.();
                }}
              >
                View All Notifications
              </Button>
            </div>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
