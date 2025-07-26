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

// Token management
const getToken = (): string | null => {
  return localStorage.getItem('accessToken');
};

const getRefreshToken = (): string | null => {
  return localStorage.getItem('refreshToken');
};

const setTokens = (accessToken: string, refreshToken: string): void => {
  localStorage.setItem('accessToken', accessToken);
  localStorage.setItem('refreshToken', refreshToken);
};

const clearTokens = (): void => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('user');
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
  async (error: AxiosError) => {
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

    // Handle other errors
    if (error.response?.data?.message) {
      toast.error(error.response.data.message);
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
  }): Promise<ApiResponse<{ user: User; accessToken: string; refreshToken: string }>> => {
    const response = await api.post('/auth/login', credentials);
    
    if (response.data.success && response.data.data.accessToken) {
      const { user, accessToken, refreshToken } = response.data.data;
      setTokens(accessToken, refreshToken);
      localStorage.setItem('user', JSON.stringify(user));
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

// Payment API
export const paymentAPI = {
  createDepositIntent: async (accountId: string, amount: number, currency: string = 'NGN'): Promise<ApiResponse<{
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
