import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';
import { toast } from 'sonner';

// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

// Create axios instance
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Token management (standardized keys)
const getToken = (): string | null => {
  return localStorage.getItem('ubas_token');
};

const getRefreshToken = (): string | null => {
  return localStorage.getItem('ubas_refresh_token');
};

const setTokens = (accessToken: string, refreshToken: string): void => {
  localStorage.setItem('ubas_token', accessToken);
  localStorage.setItem('ubas_refresh_token', refreshToken);
};

const clearTokens = (): void => {
  localStorage.removeItem('ubas_token');
  localStorage.removeItem('ubas_refresh_token');
  localStorage.removeItem('ubas_user');
};

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error: AxiosError<any>) => {
    const originalRequest = error.config as any;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = getRefreshToken();
      if (refreshToken) {
        try {
          const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
            refreshToken,
          });

          const { accessToken, refreshToken: newRefreshToken } = response.data.data;
          setTokens(accessToken, newRefreshToken);

          // Retry original request with new token
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return api(originalRequest);
        } catch (refreshError) {
          // Refresh failed, redirect to login
          clearTokens();
          window.location.href = '/';
          return Promise.reject(refreshError);
        }
      } else {
        // No refresh token, redirect to login
        clearTokens();
        window.location.href = '/';
      }
    }

  // No demo fallbacks in live mode

    // Handle other errors (toast)
    const respData: any = error.response?.data;
    if (respData?.message) {
      toast.error(respData.message);
    } else if (error.message) {
      toast.error(error.message);
    }
    return Promise.reject(error);
  }
);

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: string[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  accountType: string;
  kycStatus: string;
  twoFactorEnabled: boolean;
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

// Auth API
export const authAPI = {
  register: async (userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone: string;
    dateOfBirth: string;
    accountType: string;
  }): Promise<ApiResponse> => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  login: async (credentials: {
    email: string;
    password: string;
    twoFactorToken?: string;
  }): Promise<ApiResponse<{ user: User; accessToken: string; refreshToken: string; requiresTwoFactor?: boolean }>> => {
    const response = await api.post('/auth/login', credentials);
    
    if (response.data.success && response.data.data.accessToken) {
      const { user, accessToken, refreshToken } = response.data.data;
      setTokens(accessToken, refreshToken);
  localStorage.setItem('ubas_user', JSON.stringify(user));
    }
    
    return response.data;
  },

  logout: async (): Promise<void> => {
    try {
      const refreshToken = getRefreshToken();
      await api.post('/auth/logout', { refreshToken });
    } catch (error) {
      // Ignore logout errors
    } finally {
      clearTokens();
    }
  },

  setup2FA: async (): Promise<ApiResponse<{ secret: string; qrCode: string }>> => {
    const response = await api.post('/auth/setup-2fa');
    return response.data;
  },

  verify2FA: async (token: string): Promise<ApiResponse> => {
    const response = await api.post('/auth/verify-2fa', { token });
    return response.data;
  },

  disable2FA: async (password: string, twoFactorToken: string): Promise<ApiResponse> => {
    const response = await api.post('/auth/disable-2fa', { password, twoFactorToken });
    return response.data;
  },
};

// User API
export const userAPI = {
  getProfile: async (): Promise<ApiResponse<User>> => {
    const response = await api.get('/users/profile');
    return response.data;
  },

  updateProfile: async (userData: {
    firstName?: string;
    lastName?: string;
    phone?: string;
  }): Promise<ApiResponse> => {
    const response = await api.put('/users/profile', userData);
    return response.data;
  },

  changePassword: async (passwordData: {
    currentPassword: string;
    newPassword: string;
  }): Promise<ApiResponse> => {
    const response = await api.put('/users/password', passwordData);
    return response.data;
  },

  getAccounts: async (): Promise<ApiResponse<Account[]>> => {
    const response = await api.get('/users/accounts');
    return response.data;
  },

  getTransactions: async (params?: {
    page?: number;
    limit?: number;
    type?: string;
    status?: string;
  }): Promise<ApiResponse<Transaction[]>> => {
    const response = await api.get('/users/transactions', { params });
    return response.data;
  },
};

// Account API
export const accountAPI = {
  create: async (accountData: { accountType: string; currency?: string; initialDeposit?: number }): Promise<ApiResponse<{ accountId: string; accountNumber: string }>> => {
    const response = await api.post('/accounts', accountData);
    return response.data;
  },
  getAccount: async (accountId: string): Promise<ApiResponse<Account>> => {
    const response = await api.get(`/accounts/${accountId}`);
    return response.data;
  },

  getBalance: async (accountId: string): Promise<ApiResponse<{
    balance: number;
    availableBalance: number;
    currency: string;
  }>> => {
    const response = await api.get(`/accounts/${accountId}/balance`);
    return response.data;
  },

  getTransactions: async (accountId: string, params?: {
    page?: number;
    limit?: number;
    type?: string;
    status?: string;
  }): Promise<ApiResponse<Transaction[]>> => {
    const response = await api.get(`/accounts/${accountId}/transactions`, { params });
    return response.data;
  },
};

// Transaction API
export const transactionAPI = {
  transfer: async (transferData: {
    fromAccountId: string;
    toAccountNumber: string;
    amount: number;
    description: string;
    recipientName?: string;
  }): Promise<ApiResponse<{
    reference: string;
    amount: number;
    fee: number;
  }>> => {
    const response = await api.post('/transactions/transfer', transferData);
    return response.data;
  },

  getTransaction: async (transactionId: string): Promise<ApiResponse<Transaction>> => {
    const response = await api.get(`/transactions/${transactionId}`);
    return response.data;
  },
};

// Admin API
export const adminAPI = {
  getStats: async (): Promise<ApiResponse<any>> => {
    const response = await api.get('/admin/stats');
    return response.data;
  },
  listUsers: async (params?: { page?: number; limit?: number; search?: string }): Promise<ApiResponse<any>> => {
    const response = await api.get('/admin/users', { params });
    return response.data;
  },
  createUser: async (userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone: string;
    dateOfBirth: string;
    accountType: string;
  }): Promise<ApiResponse<any>> => {
    const response = await api.post('/admin/users', userData);
    return response.data;
  },
  createAccountForUser: async (userId: string, data: { accountType: string; currency?: string; initialBalance?: number }): Promise<ApiResponse<{ accountId: string; accountNumber: string }>> => {
    const response = await api.post(`/admin/users/${userId}/accounts`, data);
    return response.data;
  },
  seedTransactions: async (accountId: string, data?: { count?: number; type?: string }): Promise<ApiResponse<{ inserted: number; netChange: number }>> => {
    const response = await api.post(`/admin/accounts/${accountId}/transactions/seed`, data || {});
    return response.data;
  },
  grantCredit: async (accountId: string, data: { amount: number; purpose: string; currency?: string }): Promise<ApiResponse<{ grantId: string }>> => {
    const response = await api.post(`/admin/accounts/${accountId}/grants`, data);
    return response.data;
  },
  listUserAccounts: async (userId: string): Promise<ApiResponse<any[]>> => {
    const response = await api.get(`/admin/users/${userId}/accounts`);
    return response.data;
  },
  listAccountTransactions: async (accountId: string, params?: { page?: number; limit?: number }): Promise<ApiResponse<any[]>> => {
    const response = await api.get(`/admin/accounts/${accountId}/transactions`, { params });
    return response.data;
  },
  testEmail: async (data: { to: string; subject: string; message: string }): Promise<ApiResponse<{ provider: string; messageId?: string }>> => {
    const response = await api.post('/admin/email/test', data);
    return response.data;
  },
  getEmailHealth: async (): Promise<ApiResponse<{ providers: Array<{ name: string; healthy: boolean }> }>> => {
    const response = await api.get('/admin/email/health');
    return response.data;
  },
  sendTestNotification: async (data: { userId: string; channel?: 'email'|'sms'|'in_app'|'push' }): Promise<ApiResponse<any>> => {
    const response = await api.post('/admin/notifications/test', data);
    return response.data;
  },
  completeOnboarding: async (): Promise<ApiResponse<any>> => {
    const response = await api.post('/users/onboarding/complete');
    return response.data;
  }
};

// Diagnostics API (merged provider health)
export const diagnosticsAPI = {
  get: async (): Promise<ApiResponse<any>> => {
    const response = await api.get('/_diagnostics');
    return response.data;
  }
};

// Templates API (admin)
export const templateAPI = {
  list: async (locale?: string): Promise<ApiResponse<any>> => {
    const response = await api.get('/templates', { params: locale ? { locale } : {} });
    return response.data;
  },
  create: async (tpl: { type: string; channel: string; name: string; body: string; subject?: string; locale?: string; stepOrder?: number; icon?: string }): Promise<ApiResponse<any>> => {
    const response = await api.post('/templates', tpl);
    return response.data;
  },
  update: async (id: string, updates: Partial<{ name: string; body: string; subject: string; locale: string; icon: string; step_order: number }>): Promise<ApiResponse<any>> => {
    const response = await api.put(`/templates/${id}`, updates);
    return response.data;
  },
  delete: async (id: string): Promise<ApiResponse<any>> => {
    const response = await api.delete(`/templates/${id}`);
    return response.data;
  },
  render: async (template: string, data?: object, options?: object): Promise<ApiResponse<{ html: string; missing: string[]; cached?: boolean }>> => {
    const response = await api.post('/templates/render', { template, data, options });
    return response.data;
  }
};

export const providerAPI = {
  health: async (): Promise<ApiResponse<any>> => {
    const response = await api.get('/templates/_health/providers');
    return response.data;
  }
};

// Grants API
export const grantsAPI = {
  list: async (): Promise<ApiResponse<any[]>> => {
    const response = await api.get('/grants');
    return response.data;
  },
  apply: async (data: { accountId: string; amount: number; purpose: string }): Promise<ApiResponse<{ grantId: string }>> => {
    const response = await api.post('/grants/apply', data);
    return response.data;
  }
};

// Payment API
export const paymentAPI = {
  createDepositIntent: async (accountId: string, amount: number, currency: string = 'USD'): Promise<ApiResponse<{
    id: string;
    amount: number;
    currency: string;
    status: string;
    clientSecret?: string;
  }>> => {
    const response = await api.post('/payments/deposit/create-intent', {
      accountId,
      amount,
      currency
    });
    return response.data;
  },

  simulateCompletion: async (simulationId: string, success: boolean = true): Promise<ApiResponse<{ message: string }>> => {
    const response = await api.post('/payments/simulate-completion', {
      simulationId,
      success
    });
    return response.data;
  },

  createWithdrawal: async (withdrawalData: {
    accountId: string;
    amount: number;
    bankDetails: {
      accountNumber: string;
      bankCode: string;
      accountName: string;
    };
  }): Promise<ApiResponse<{
    transferId: string;
    status: string;
  }>> => {
    const response = await api.post('/payments/withdraw', withdrawalData);
    return response.data;
  },

  externalTransfer: async (transferData: {
    fromAccountId: string;
    toAccountNumber: string;
    amount: number;
    description: string;
    recipientName?: string;
  }): Promise<ApiResponse<{
    id: string;
    status: string;
  }>> => {
    const response = await api.post('/payments/transfer/external', transferData);
    return response.data;
  },

  getPaymentMethods: async (): Promise<ApiResponse<Array<{
    id: string;
    type: string;
    name: string;
    enabled: boolean;
    description: string;
  }>>> => {
    const response = await api.get('/payments/methods');
    return response.data;
  },

  getBanks: async (): Promise<ApiResponse<Array<{
    code: string;
    name: string;
  }>>> => {
    const response = await api.get('/payments/banks');
    return response.data;
  },

  verifyAccount: async (accountNumber: string, bankCode: string): Promise<ApiResponse<{
    accountNumber: string;
    accountName: string;
    bankCode: string;
    bankName: string;
  }>> => {
    const response = await api.post('/payments/verify-account', {
      accountNumber,
      bankCode
    });
    return response.data;
  },
};

// Export the configured axios instance
export default api;
