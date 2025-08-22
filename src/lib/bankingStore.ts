import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AccountType } from '@/types/accountTypes';
import { authAPI, userAPI, transactionAPI } from '@/lib/api';
import { socketService } from '@/lib/socket';
import { toast } from 'sonner';

// Updated types to match API
export interface User {
  id: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  // Match API shape: string; we still track userAccountType separately as AccountType
  accountType?: string;
  kycStatus?: string;
  twoFactorEnabled?: boolean;
}

export interface Account {
  id: string;
  accountNumber: string;
  accountType: string;
  balance: number;
  availableBalance: number;
  currency: string;
  status: string;
  createdAt: string;
}

export interface Transaction {
  id: string;
  fromAccountId?: string;
  toAccountId?: string;
  amount: number;
  currency: string;
  type: string;
  status: string;
  description: string;
  reference: string;
  category: string;
  feeAmount?: number;
  processedAt?: string;
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  accounts: Account[];
  transactions: Transaction[];
  userAccountType: AccountType | null;
}

interface BankingStore extends AuthState {
  // Loading states
  isLoading: boolean;
  
  // Auth actions
  login: (username: string, password: string, twoFactorToken?: string) => Promise<{ success: boolean; requiresTwoFactor?: boolean; error?: string }>;
  logout: () => Promise<void>;
  register: (userData: any) => Promise<{ success: boolean; error?: string }>;
  
  // Account actions
  fetchAccounts: () => Promise<void>;
  fetchAccountBalance: (accountId: string) => Promise<void>;
  
  // Transaction actions
  fetchTransactions: (accountId?: string) => Promise<void>;
  transfer: (transferData: {
    fromAccountId: string;
    toAccountNumber: string;
    amount: number;
    description: string;
    recipientName?: string;
  }) => Promise<{ success: boolean; error?: string }>;
  // Legacy names used by components
  transferFunds: (transferData: {
    fromAccountId: string;
    toAccountNumber: string;
    amount: number;
    description: string;
    recipientName?: string;
  }) => Promise<{ success: boolean; error?: string }>;
  
  // Profile actions
  updateProfile: (userData: { firstName?: string; lastName?: string; phone?: string }) => Promise<{ success: boolean; error?: string }>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<{ success: boolean; error?: string }>;
  
  // 2FA actions
  setup2FA: () => Promise<{ success: boolean; secret?: string; qrCode?: string; error?: string }>;
  verify2FA: (token: string) => Promise<{ success: boolean; error?: string }>;
  disable2FA: (password: string, twoFactorToken: string) => Promise<{ success: boolean; error?: string }>;
  
  // Utility functions
  formatCurrency: (amount: number) => string;
  initializeSocket: () => void;
  disconnectSocket: () => void;
  
  // Legacy compatibility methods
  getAccountsByUserId: (userId: string) => Account[];
  getTransactionsByAccountId: (accountId: string) => Transaction[];
  getAccountByNumber: (accountNumber: string) => Account | undefined;
}

export const useBankingStore = create<BankingStore>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      isAuthenticated: false,
      accounts: [],
      transactions: [],
      userAccountType: null,
      isLoading: false,

      // Auth actions
    login: async (username: string, password: string, twoFactorToken?: string) => {
        set({ isLoading: true });
        try {
      const response = await authAPI.login({ username, password, twoFactorToken });
          
          if (response.success) {
      if (response.data?.user) {
              const user = response.data.user;
              set({
                user,
                isAuthenticated: true,
        userAccountType: (user.accountType as AccountType) || null,
                isLoading: false
              });
              
              // Initialize socket connection
              get().initializeSocket();
              
              // Fetch user accounts
              await get().fetchAccounts();
              
              return { success: true };
            } else if (response.data?.requiresTwoFactor) {
              set({ isLoading: false });
              return { success: true, requiresTwoFactor: true };
            }
          }
          
          set({ isLoading: false });
          return { success: false, error: response.message || 'Login failed' };
        } catch (error: any) {
          set({ isLoading: false });
          return { success: false, error: error.message || 'Login failed' };
        }
      },

      logout: async () => {
        try {
          await authAPI.logout();
        } catch (error) {
          console.error('Logout error:', error);
        } finally {
          get().disconnectSocket();
          set({
            user: null,
            isAuthenticated: false,
            accounts: [],
            transactions: [],
            userAccountType: null,
          });
        }
      },

      register: async (userData: any) => {
        set({ isLoading: true });
        try {
          const payload = {
            username: userData.username || (userData.email ? String(userData.email).split('@')[0] : `${(userData.firstName || 'user').toString().toLowerCase()}${(userData.lastName || '').toString().toLowerCase()}`),
            password: userData.password || 'Password123!',
            firstName: userData.firstName || '',
            lastName: userData.lastName || '',
            phone: userData.phone || userData.phoneNumber || '',
            dateOfBirth: userData.dateOfBirth || '1990-01-01',
            accountType: (userData.accountType as string) || 'personal',
          };
          const response = await authAPI.register(payload);
          set({ isLoading: false });
          
          if (response.success) {
            toast.success('Registration successful! Please login to continue.');
            return { success: true };
          }
          
          return { success: false, error: response.message || 'Registration failed' };
        } catch (error: any) {
          set({ isLoading: false });
          return { success: false, error: error.message || 'Registration failed' };
        }
      },

      // Account actions
      fetchAccounts: async () => {
        try {
          const response = await userAPI.getAccounts();
          if (response.success && response.data) {
            set({ accounts: response.data });
          }
        } catch (error) {
          console.error('Failed to fetch accounts:', error);
        }
      },

      fetchAccountBalance: async (accountId: string) => {
        try {
          const response = await userAPI.getAccounts();
          if (response.success && response.data) {
            set({ accounts: response.data });
          }
        } catch (error) {
          console.error('Failed to fetch account balance:', error);
        }
      },

      // Transaction actions
      fetchTransactions: async (accountId?: string) => {
        try {
          const response = await userAPI.getTransactions();
          if (response.success && response.data) {
            set({ transactions: response.data });
          }
        } catch (error) {
          console.error('Failed to fetch transactions:', error);
        }
      },

      transfer: async (transferData) => {
        set({ isLoading: true });
        try {
          const response = await transactionAPI.transfer(transferData);
          set({ isLoading: false });
          
          if (response.success) {
            // Refresh accounts and transactions
            await get().fetchAccounts();
            await get().fetchTransactions();
            
            toast.success('Transfer completed successfully!');
            return { success: true };
          }
          
          return { success: false, error: response.message || 'Transfer failed' };
        } catch (error: any) {
          set({ isLoading: false });
          return { success: false, error: error.message || 'Transfer failed' };
        }
      },

      // Legacy wrapper to satisfy components expecting transferFunds
      transferFunds: async (transferData) => {
        return await get().transfer(transferData);
      },

      // Profile actions
      updateProfile: async (userData) => {
        try {
          const response = await userAPI.updateProfile(userData);
          if (response.success) {
            // Update user in store
            const currentUser = get().user;
            if (currentUser) {
              set({
                user: {
                  ...currentUser,
                  ...userData
                }
              });
            }
            toast.success('Profile updated successfully!');
            return { success: true };
          }
          return { success: false, error: response.message || 'Update failed' };
        } catch (error: any) {
          return { success: false, error: error.message || 'Update failed' };
        }
      },

      changePassword: async (currentPassword: string, newPassword: string) => {
        try {
          const response = await userAPI.changePassword({ currentPassword, newPassword });
          if (response.success) {
            toast.success('Password changed successfully!');
            return { success: true };
          }
          return { success: false, error: response.message || 'Password change failed' };
        } catch (error: any) {
          return { success: false, error: error.message || 'Password change failed' };
        }
      },

      // 2FA actions
      setup2FA: async () => {
        try {
          const response = await authAPI.setup2FA();
          if (response.success && response.data) {
            return { 
              success: true, 
              secret: response.data.secret, 
              qrCode: response.data.qrCode 
            };
          }
          return { success: false, error: response.message || '2FA setup failed' };
        } catch (error: any) {
          return { success: false, error: error.message || '2FA setup failed' };
        }
      },

      verify2FA: async (token: string) => {
        try {
          const response = await authAPI.verify2FA(token);
          if (response.success) {
            // Update user 2FA status
            const currentUser = get().user;
            if (currentUser) {
              set({
                user: {
                  ...currentUser,
                  twoFactorEnabled: true
                }
              });
            }
            toast.success('2FA enabled successfully!');
            return { success: true };
          }
          return { success: false, error: response.message || '2FA verification failed' };
        } catch (error: any) {
          return { success: false, error: error.message || '2FA verification failed' };
        }
      },

      disable2FA: async (password: string, twoFactorToken: string) => {
        try {
          const response = await authAPI.disable2FA(password, twoFactorToken);
          if (response.success) {
            // Update user 2FA status
            const currentUser = get().user;
            if (currentUser) {
              set({
                user: {
                  ...currentUser,
                  twoFactorEnabled: false
                }
              });
            }
            toast.success('2FA disabled successfully!');
            return { success: true };
          }
          return { success: false, error: response.message || '2FA disable failed' };
        } catch (error: any) {
          return { success: false, error: error.message || '2FA disable failed' };
        }
      },

      // Utility functions
      formatCurrency: (amount: number) => {
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
        }).format(amount);
      },

      initializeSocket: () => {
        const user = get().user;
        if (user) {
          socketService.connect(user.id);
        }
      },

      disconnectSocket: () => {
        socketService.disconnect();
      },

      // Legacy compatibility methods
      getAccountsByUserId: (userId: string) => {
        return get().accounts;
      },

      getTransactionsByAccountId: (accountId: string) => {
        return get().transactions.filter(
          tx => tx.fromAccountId === accountId || tx.toAccountId === accountId
        );
      },

      getAccountByNumber: (accountNumber: string) => {
        return get().accounts.find(a => a.accountNumber === accountNumber);
      },
    }),
    {
      name: 'banking-store',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        userAccountType: state.userAccountType,
      }),
    }
  )
);
