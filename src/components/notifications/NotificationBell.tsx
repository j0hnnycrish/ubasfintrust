import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bell, BellRing } from 'lucide-react';
import { notificationService, Notification } from '@/lib/notificationService';
import { NotificationCenter } from './NotificationCenter';

export function NotificationBell() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [hasNewNotifications, setHasNewNotifications] = useState(false);

  useEffect(() => {
    const unsubscribe = notificationService.subscribe((newNotifications) => {
      const previousUnreadCount = notifications.filter(n => !n.read).length;
      const currentUnreadCount = newNotifications.filter(n => !n.read).length;
      
      setNotifications(newNotifications);
      
      // Show animation if there are new unread notifications
      if (currentUnreadCount > previousUnreadCount) {
        setHasNewNotifications(true);
        setTimeout(() => setHasNewNotifications(false), 3000);
      }
    });

    setNotifications(notificationService.getNotifications());
    return unsubscribe;
  }, [notifications]);

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        className={`relative p-2 ${hasNewNotifications ? 'animate-pulse' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        {hasNewNotifications ? (
          <BellRing className="h-5 w-5 text-blue-600" />
        ) : (
          <Bell className="h-5 w-5 text-gray-600" />
        )}
        
        {unreadCount > 0 && (
          <Badge 
            variant="destructive" 
            className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center text-xs p-0 min-w-[20px]"
          >
            {unreadCount > 99 ? '99+' : unreadCount}
          </Badge>
        )}
      </Button>

      <NotificationCenter 
        isOpen={isOpen} 
        onClose={() => setIsOpen(false)} 
      />
    </>
  );
}
