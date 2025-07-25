export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  createdAt: Date;
  avatar?: string;
}

export interface Account {
  id: string;
  userId: string;
  accountNumber: string;
  accountType: 'checking' | 'savings' | 'business' | 'investment';
  balance: number;
  currency: string;
  isActive: boolean;
  createdAt: Date;
  lastActivity: Date;
}

export interface Transaction {
  id: string;
  fromAccountId: string;
  toAccountId?: string;
  amount: number;
  type: 'transfer' | 'deposit' | 'withdrawal' | 'payment' | 'fee';
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  description: string;
  reference: string;
  timestamp: Date;
  category?: string;
  recipientName?: string;
  recipientEmail?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  accounts: Account[];
}

export interface TransferRequest {
  fromAccountId: string;
  toAccountNumber: string;
  amount: number;
  description: string;
  recipientName: string;
}