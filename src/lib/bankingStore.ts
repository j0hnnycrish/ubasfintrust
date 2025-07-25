import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, Account, Transaction, AuthState, TransferRequest } from '@/types/banking';
import { AccountType } from '@/types/accountTypes';

// Production-ready banking data
const sampleUsers: User[] = [
  {
    id: '1',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@email.com',
    phone: '+234-800-123-4567',
    accountType: 'personal',
    createdAt: new Date('2024-01-15'),
  },
  {
    id: '2',
    firstName: 'Sarah',
    lastName: 'Johnson',
    email: 'sarah.johnson@email.com',
    phone: '+234-800-765-4321',
    accountType: 'personal',
    createdAt: new Date('2024-02-20'),
  },
  {
    id: '3',
    firstName: 'Michael',
    lastName: 'Chen',
    email: 'michael.chen@email.com',
    phone: '+234-800-555-0123',
    accountType: 'business',
    createdAt: new Date('2024-03-10'),
  },
  {
    id: '4',
    firstName: 'Corporate',
    lastName: 'User',
    email: 'corporate@example.com',
    phone: '+234-800-999-0000',
    accountType: 'corporate',
    createdAt: new Date('2024-01-01'),
  }
];

const sampleAccounts: Account[] = [
  {
    id: 'acc1',
    userId: '1',
    accountNumber: '1234567890',
    accountType: 'checking',
    balance: 125000.50,
    currency: 'NGN',
    isActive: true,
    createdAt: new Date('2024-01-15'),
    lastActivity: new Date(),
  },
  {
    id: 'acc2',
    userId: '1',
    accountNumber: '1234567891',
    accountType: 'savings',
    balance: 500000.00,
    currency: 'NGN',
    isActive: true,
    createdAt: new Date('2024-01-15'),
    lastActivity: new Date(),
  },
  {
    id: 'acc3',
    userId: '2',
    accountNumber: '2345678901',
    accountType: 'checking',
    balance: 75000.25,
    currency: 'NGN',
    isActive: true,
    createdAt: new Date('2024-02-20'),
    lastActivity: new Date(),
  },
  {
    id: 'acc4',
    userId: '3',
    accountNumber: '3456789012',
    accountType: 'business',
    balance: 1250000.00,
    currency: 'NGN',
    isActive: true,
    createdAt: new Date('2024-03-10'),
    lastActivity: new Date(),
  }
];

const sampleTransactions: Transaction[] = [
  {
    id: 'txn1',
    fromAccountId: 'acc1',
    toAccountId: 'acc3',
    amount: 25000,
    type: 'transfer',
    status: 'completed',
    description: 'Monthly rent payment',
    reference: 'TXN20240125001',
    timestamp: new Date('2024-01-25T10:30:00'),
    category: 'Housing',
    recipientName: 'Sarah Johnson',
    recipientEmail: 'sarah.johnson@email.com',
  },
  {
    id: 'txn2',
    fromAccountId: 'acc1',
    amount: 50000,
    type: 'deposit',
    status: 'completed',
    description: 'Salary deposit',
    reference: 'TXN20240201001',
    timestamp: new Date('2024-02-01T09:15:00'),
    category: 'Income',
  },
  {
    id: 'txn3',
    fromAccountId: 'acc2',
    amount: 5000,
    type: 'withdrawal',
    status: 'completed',
    description: 'ATM withdrawal',
    reference: 'TXN20240210001',
    timestamp: new Date('2024-02-10T14:20:00'),
    category: 'Cash',
  },
  {
    id: 'txn4',
    fromAccountId: 'acc1',
    toAccountId: 'acc4',
    amount: 15000,
    type: 'payment',
    status: 'completed',
    description: 'Online shopping',
    reference: 'TXN20240215001',
    timestamp: new Date('2024-02-15T16:45:00'),
    category: 'Shopping',
    recipientName: 'Michael Chen',
  }
];

interface BankingStore extends AuthState {
  users: User[];
  allAccounts: Account[];
  transactions: Transaction[];
  
  // Auth actions
  login: (email: string, password: string, accountType?: AccountType) => Promise<boolean>;
  logout: () => void;
  register: (userData: Omit<User, 'id' | 'createdAt'>) => Promise<boolean>;
  
  // Account actions
  getAccountsByUserId: (userId: string) => Account[];
  getAccountByNumber: (accountNumber: string) => Account | undefined;
  updateAccountBalance: (accountId: string, newBalance: number) => void;
  
  // Transaction actions
  createTransaction: (transaction: Omit<Transaction, 'id' | 'timestamp'>) => Transaction;
  getTransactionsByAccountId: (accountId: string) => Transaction[];
  transferFunds: (transferRequest: TransferRequest) => Promise<{ success: boolean; transaction?: Transaction; error?: string }>;
  
  // Utility actions
  formatCurrency: (amount: number) => string;
}

export const useBankingStore = create<BankingStore>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      accounts: [],
      userAccountType: null,
      users: sampleUsers,
      allAccounts: sampleAccounts,
      transactions: sampleTransactions,

      login: async (email: string, password: string, accountType?: AccountType) => {
        // Production login would integrate with backend API
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const user = get().users.find(u => u.email === email && (!accountType || u.accountType === accountType));
        if (user) {
          const userAccounts = get().allAccounts.filter(acc => acc.userId === user.id);
          set({
            user,
            isAuthenticated: true,
            accounts: userAccounts,
            userAccountType: user.accountType,
          });
          return true;
        }
        return false;
      },

      logout: () => {
        set({
          user: null,
          isAuthenticated: false,
          accounts: [],
          userAccountType: null,
        });
      },

      register: async (userData) => {
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const newUser: User = {
          ...userData,
          id: Date.now().toString(),
          createdAt: new Date(),
        };

        // Create default account based on account type
        const accountType = newUser.accountType || 'personal';
        const newAccount: Account = {
          id: `acc_${Date.now()}`,
          userId: newUser.id,
          accountNumber: Math.random().toString().slice(2, 12),
          accountType: accountType === 'personal' ? 'checking' : 'business',
          balance: 0,
          currency: 'NGN',
          isActive: true,
          createdAt: new Date(),
          lastActivity: new Date(),
        };

        set(state => ({
          users: [...state.users, newUser],
          allAccounts: [...state.allAccounts, newAccount],
          user: newUser,
          isAuthenticated: true,
          accounts: [newAccount],
          userAccountType: newUser.accountType,
        }));

        return true;
      },

      getAccountsByUserId: (userId: string) => {
        return get().allAccounts.filter(acc => acc.userId === userId);
      },

      getAccountByNumber: (accountNumber: string) => {
        return get().allAccounts.find(acc => acc.accountNumber === accountNumber);
      },

      updateAccountBalance: (accountId: string, newBalance: number) => {
        set(state => ({
          allAccounts: state.allAccounts.map(acc =>
            acc.id === accountId 
              ? { ...acc, balance: newBalance, lastActivity: new Date() }
              : acc
          ),
          accounts: state.accounts.map(acc =>
            acc.id === accountId 
              ? { ...acc, balance: newBalance, lastActivity: new Date() }
              : acc
          ),
        }));
      },

      createTransaction: (transactionData) => {
        const transaction: Transaction = {
          ...transactionData,
          id: `txn_${Date.now()}`,
          timestamp: new Date(),
        };

        set(state => ({
          transactions: [transaction, ...state.transactions],
        }));

        return transaction;
      },

      getTransactionsByAccountId: (accountId: string) => {
        return get().transactions
          .filter(txn => txn.fromAccountId === accountId || txn.toAccountId === accountId)
          .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
      },

      transferFunds: async (transferRequest) => {
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        const { fromAccountId, toAccountNumber, amount, description, recipientName } = transferRequest;
        const fromAccount = get().allAccounts.find(acc => acc.id === fromAccountId);
        const toAccount = get().getAccountByNumber(toAccountNumber);

        if (!fromAccount) {
          return { success: false, error: 'Source account not found' };
        }

        if (!toAccount) {
          return { success: false, error: 'Recipient account not found' };
        }

        if (fromAccount.balance < amount) {
          return { success: false, error: 'Insufficient funds' };
        }

        if (amount <= 0) {
          return { success: false, error: 'Invalid amount' };
        }

        // Update balances
        get().updateAccountBalance(fromAccount.id, fromAccount.balance - amount);
        get().updateAccountBalance(toAccount.id, toAccount.balance + amount);

        // Create transaction
        const transaction = get().createTransaction({
          fromAccountId,
          toAccountId: toAccount.id,
          amount,
          type: 'transfer',
          status: 'completed',
          description,
          reference: `TXN${Date.now()}`,
          category: 'Transfer',
          recipientName,
          recipientEmail: toAccount.userId,
        });

        return { success: true, transaction };
      },

      formatCurrency: (amount: number) => {
        return new Intl.NumberFormat('en-NG', {
          style: 'currency',
          currency: 'NGN',
        }).format(amount);
      },
    }),
    {
      name: 'banking-store',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        accounts: state.accounts,
        userAccountType: state.userAccountType,
        users: state.users,
        allAccounts: state.allAccounts,
        transactions: state.transactions,
      }),
    }
  )
);