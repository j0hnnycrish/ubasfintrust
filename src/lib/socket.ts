import { io, Socket } from 'socket.io-client';
import { toast } from 'sonner';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

class SocketService {
  private socket: Socket | null = null;
  private userId: string | null = null;

  connect(userId: string): void {
    if (this.socket?.connected) {
      return;
    }

    this.userId = userId;
    this.socket = io(SOCKET_URL, {
      transports: ['websocket'],
      autoConnect: true,
    });

    this.socket.on('connect', () => {
      console.log('Connected to WebSocket server');
      this.socket?.emit('join_user_room', userId);
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from WebSocket server');
    });

    this.socket.on('connect_error', (error) => {
      console.error('WebSocket connection error:', error);
    });

    // Listen for transaction events
    this.socket.on('transaction_completed', (data) => {
      toast.success(`Transaction completed: ${data.reference}`, {
        description: `Amount: ${data.amount} ${data.currency || 'NGN'}`,
      });
    });

    this.socket.on('transaction_received', (data) => {
      toast.success(`Money received from ${data.from}`, {
        description: `Amount: ${data.amount} ${data.currency || 'NGN'}`,
      });
    });

    this.socket.on('transaction_failed', (data) => {
      toast.error(`Transaction failed: ${data.reference}`, {
        description: data.reason || 'Unknown error',
      });
    });

    // Listen for account events
    this.socket.on('account_locked', (data) => {
      toast.error('Account Locked', {
        description: data.reason || 'Your account has been temporarily locked',
      });
    });

    this.socket.on('account_unlocked', () => {
      toast.success('Account Unlocked', {
        description: 'Your account has been unlocked',
      });
    });

    // Listen for security events
    this.socket.on('security_alert', (data) => {
      toast.warning('Security Alert', {
        description: data.message,
      });
    });

    this.socket.on('login_from_new_device', (data) => {
      toast.warning('New Device Login', {
        description: `Login detected from ${data.location || 'unknown location'}`,
      });
    });

    // Listen for system notifications
    this.socket.on('system_maintenance', (data) => {
      toast.info('System Maintenance', {
        description: data.message,
      });
    });

    this.socket.on('service_update', (data) => {
      toast.info('Service Update', {
        description: data.message,
      });
    });
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.userId = null;
    }
  }

  emit(event: string, data: unknown): void {
    if (this.socket?.connected) {
      this.socket.emit(event, data);
    }
  }

  on(event: string, callback: (data: unknown) => void): void {
    if (this.socket) {
      this.socket.on(event, callback);
    }
  }

  off(event: string, callback?: (data: unknown) => void): void {
    if (this.socket) {
      this.socket.off(event, callback);
    }
  }

  isConnected(): boolean {
    return this.socket?.connected || false;
  }
}

export const socketService = new SocketService();
export default socketService;
