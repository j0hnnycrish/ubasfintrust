import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';
import { toast } from 'sonner';

// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://ubasfintrust.jcrish4eva.workers.dev/api/v1';

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
  username: string;
  firstName?: string;
  lastName?: string;
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

// Auth API
export const authAPI = {
  register: async (userData: {
    username: string;
    password: string;
    firstName: string;
    lastName: string;
    phone: string;
    dateOfBirth: string;
    accountType: string;
  }): Promise<ApiResponse<{ userId: string; accountNumber: string }>> => {
    const response = await api.post('/auth/register', {
      username: userData.username,
      password: userData.password,
      first_name: userData.firstName,
      last_name: userData.lastName,
      phone: userData.phone,
      account_type: userData.accountType,
      date_of_birth: userData.dateOfBirth
    });
    return response.data;
  },

  login: async (credentials: {
    username?: string;
    phone?: string;
    password: string;
    twoFactorToken?: string;
  }): Promise<ApiResponse<{ user: User; token: string; requiresTwoFactor?: boolean }>> => {
    const response = await api.post('/auth/login', credentials);
    if (response.data.success && response.data.token) {
      const { token } = response.data;
      localStorage.setItem('ubas_token', token);
      setTokens(token, token);
    }
    return response.data;
  },

  adminLogin: async (credentials: {
    username: string;
    password: string;
  }): Promise<{ success: boolean; token?: string; user?: { id: string; username: string; role: string }; message?: string }> => {
    const response = await api.post('/auth/admin/login', credentials);
    if (response.data.success && response.data.token) {
      const { token } = response.data;
      localStorage.setItem('ubas_token', token);
      setTokens(token, token);
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

  // Add whoami endpoint for checking auth status
  whoami: async (): Promise<ApiResponse<{ authenticated: boolean; id?: string; username?: string }>> => {
    const response = await api.get('/auth/whoami');
    return response.data;
  },
};

// Account API
export const accountAPI = {
  create: async (accountData: { accountType: string; currency?: string; initialBalance?: number }): Promise<ApiResponse<{ id: string; account_number: string; balance: number }>> => {
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

  // Banking operations
  deposit: async (accountId: string, amount: number, description?: string): Promise<ApiResponse<{ transaction_id: string; new_balance: number }>> => {
    const response = await api.post(`/accounts/${accountId}/deposit`, { amount, description });
    return response.data;
  },

  withdraw: async (accountId: string, amount: number, description?: string): Promise<ApiResponse<{ transaction_id: string; new_balance: number }>> => {
    const response = await api.post(`/accounts/${accountId}/withdraw`, { amount, description });
    return response.data;
  },

  transfer: async (fromAccountId: string, toAccountNumber: string, amount: number, description?: string): Promise<ApiResponse<{ transaction_id: string; new_balance: number }>> => {
    const response = await api.post(`/accounts/${fromAccountId}/transfer`, { 
      to_account_number: toAccountNumber, 
      amount, 
      description 
    });
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
  
  getUser: async (userId: string): Promise<ApiResponse<any>> => {
    const response = await api.get(`/admin/users/${userId}`);
    return response.data;
  },
  
  updateUser: async (userId: string, userData: any): Promise<ApiResponse<any>> => {
    const response = await api.put(`/admin/users/${userId}`, userData);
    return response.data;
  },
  
  deleteUser: async (userId: string): Promise<ApiResponse<any>> => {
    const response = await api.delete(`/admin/users/${userId}`);
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
    const response = await api.post('/admin/users', {
      email: userData.email,
      password: userData.password,
      first_name: userData.firstName,
      last_name: userData.lastName,
      phone: userData.phone,
      date_of_birth: userData.dateOfBirth,
      account_type: userData.accountType
    });
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

// KYC API
export const kycAPI = {
  submit: async (kycData: {
    personalInfo: {
      firstName: string;
      lastName: string;
      dateOfBirth: string;
      nationality: string;
    };
    addressInfo: {
      street: string;
      city: string;
      state: string;
      country: string;
    };
    employmentInfo: {
      employmentStatus: string;
      monthlyIncome: string;
    };
    documents: {
      primaryId?: File;
      proofOfAddress?: File;
      incomeProof?: File;
      bankStatement?: File;
      selfie?: File;
    };
    agreements: {
      termsAndConditions: boolean;
      privacyPolicy: boolean;
    };
  }): Promise<ApiResponse<{ kyc_id: string; status: string }>> => {
    const formData = new FormData();
    
    // Add personal information (matching backend format)
    formData.append('personal_firstName', kycData.personalInfo.firstName);
    formData.append('personal_lastName', kycData.personalInfo.lastName);
    formData.append('personal_dateOfBirth', kycData.personalInfo.dateOfBirth);
    formData.append('personal_nationality', kycData.personalInfo.nationality);
    
    // Add address information
    formData.append('address_street', kycData.addressInfo.street);
    formData.append('address_city', kycData.addressInfo.city);
    formData.append('address_state', kycData.addressInfo.state);
    formData.append('address_country', kycData.addressInfo.country);
    
    // Add employment information
    formData.append('employment_status', kycData.employmentInfo.employmentStatus);
    formData.append('employment_monthlyIncome', kycData.employmentInfo.monthlyIncome);
    
    // Add agreements
    formData.append('agreement_terms', kycData.agreements.termsAndConditions.toString());
    formData.append('agreement_privacy', kycData.agreements.privacyPolicy.toString());
    
    // Add document files (matching backend expected names)
    if (kycData.documents.primaryId) {
      formData.append('document_primaryId', kycData.documents.primaryId);
    }
    if (kycData.documents.proofOfAddress) {
      formData.append('document_proofOfAddress', kycData.documents.proofOfAddress);
    }
    if (kycData.documents.incomeProof) {
      formData.append('document_incomeProof', kycData.documents.incomeProof);
    }
    if (kycData.documents.bankStatement) {
      formData.append('document_bankStatement', kycData.documents.bankStatement);
    }
    if (kycData.documents.selfie) {
      formData.append('document_selfie', kycData.documents.selfie);
    }

    const response = await api.post('/kyc/submit', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  getStatus: async (): Promise<ApiResponse<{ 
    status: string; 
    id?: string; 
    submitted_at?: string; 
    reviewed_at?: string;
    rejection_reason?: string;
    documents?: Array<{
      type: string;
      status: string;
      uploadedAt: string;
    }>;
  }>> => {
    const response = await api.get('/kyc/status');
    return response.data;
  },
};

// Bill Payment API
export const billPaymentAPI = {
  getProviders: async (category?: string): Promise<ApiResponse<Array<{
    id: string;
    name: string;
    category: string;
    logo?: string;
    description: string;
    acceptsPartialPayments: boolean;
    fees: {
      type: 'fixed' | 'percentage';
      amount: number;
    };
  }>>> => {
    const response = await api.get('/bills/providers', { 
      params: category ? { category } : {} 
    });
    return response.data;
  },

  getCategories: async (): Promise<ApiResponse<Array<{
    id: string;
    name: string;
    description: string;
    icon: string;
  }>>> => {
    const response = await api.get('/bills/categories');
    return response.data;
  },

  validateAccount: async (providerId: string, accountNumber: string): Promise<ApiResponse<{
    valid: boolean;
    accountName?: string;
    currentBalance?: number;
    dueDate?: string;
  }>> => {
    const response = await api.post('/bills/validate-account', {
      providerId,
      accountNumber
    });
    return response.data;
  },

  payBill: async (paymentData: {
    providerId: string;
    fromAccountId: string;
    amount: number;
    accountNumber: string;
    description?: string;
    scheduleDate?: string;
  }): Promise<ApiResponse<{
    paymentId: string;
    reference: string;
    amount: number;
    fee: number;
    status: string;
    scheduledDate?: string;
  }>> => {
    const response = await api.post('/bills/pay', paymentData);
    return response.data;
  },

  getPaymentHistory: async (params?: {
    page?: number;
    limit?: number;
    providerId?: string;
    status?: string;
    fromDate?: string;
    toDate?: string;
  }): Promise<ApiResponse<Array<{
    id: string;
    providerId: string;
    providerName: string;
    amount: number;
    fee: number;
    status: string;
    reference: string;
    accountNumber: string;
    description?: string;
    scheduledDate?: string;
    processedDate?: string;
    createdAt: string;
  }>>> => {
    const response = await api.get('/bills/history', { params });
    return response.data;
  },

  getRecurringPayments: async (): Promise<ApiResponse<Array<{
    id: string;
    providerId: string;
    providerName: string;
    amount: number;
    frequency: 'weekly' | 'monthly' | 'quarterly';
    nextPaymentDate: string;
    status: 'active' | 'paused' | 'cancelled';
    accountNumber: string;
    fromAccountId: string;
  }>>> => {
    const response = await api.get('/bills/recurring');
    return response.data;
  },

  createRecurringPayment: async (recurringData: {
    providerId: string;
    fromAccountId: string;
    amount: number;
    accountNumber: string;
    frequency: 'weekly' | 'monthly' | 'quarterly';
    startDate: string;
    description?: string;
  }): Promise<ApiResponse<{
    recurringId: string;
    nextPaymentDate: string;
  }>> => {
    const response = await api.post('/bills/recurring', recurringData);
    return response.data;
  },

  updateRecurringPayment: async (recurringId: string, updates: {
    amount?: number;
    frequency?: 'weekly' | 'monthly' | 'quarterly';
    status?: 'active' | 'paused' | 'cancelled';
  }): Promise<ApiResponse> => {
    const response = await api.put(`/bills/recurring/${recurringId}`, updates);
    return response.data;
  },

  cancelRecurringPayment: async (recurringId: string): Promise<ApiResponse> => {
    const response = await api.delete(`/bills/recurring/${recurringId}`);
    return response.data;
  },

  getUpcomingPayments: async (days?: number): Promise<ApiResponse<Array<{
    id?: string;
    providerId: string;
    providerName: string;
    amount: number;
    dueDate: string;
    accountNumber: string;
    type: 'scheduled' | 'recurring' | 'estimated';
    status: 'pending' | 'overdue';
  }>>> => {
    const response = await api.get('/bills/upcoming', { 
      params: days ? { days } : {} 
    });
    return response.data;
  },

  getBillSummary: async (period?: 'month' | 'quarter' | 'year'): Promise<ApiResponse<{
    totalPaid: number;
    totalFees: number;
    paymentCount: number;
    averageAmount: number;
    topCategories: Array<{
      category: string;
      amount: number;
      count: number;
    }>;
    monthlyTrend: Array<{
      month: string;
      amount: number;
      count: number;
    }>;
  }>> => {
    const response = await api.get('/bills/summary', { 
      params: period ? { period } : {} 
    });
    return response.data;
  },
};

// Investment API
export const investmentAPI = {
  getPortfolio: async (): Promise<ApiResponse<{
    totalValue: number;
    totalGain: number;
    totalGainPercent: number;
    dayChange: number;
    dayChangePercent: number;
    cash: number;
    investments: Array<{
      id: string;
      symbol: string;
      name: string;
      type: 'stock' | 'etf' | 'mutual_fund' | 'bond' | 'crypto' | 'commodity';
      quantity: number;
      avgPrice: number;
      currentPrice: number;
      marketValue: number;
      totalGain: number;
      totalGainPercent: number;
      dayChange: number;
      dayChangePercent: number;
      sector?: string;
      exchange?: string;
      dividendYield?: number;
    }>;
  }>> => {
    const response = await api.get('/investments/portfolio');
    return response.data;
  },

  getMarketData: async (symbols: string[]): Promise<ApiResponse<Array<{
    symbol: string;
    name: string;
    price: number;
    change: number;
    changePercent: number;
    volume: number;
    marketCap?: number;
    peRatio?: number;
    dividendYield?: number;
    high52Week?: number;
    low52Week?: number;
  }>>> => {
    const response = await api.get('/investments/market-data', {
      params: { symbols: symbols.join(',') }
    });
    return response.data;
  },

  searchInvestments: async (query: string, type?: string): Promise<ApiResponse<Array<{
    symbol: string;
    name: string;
    type: 'stock' | 'etf' | 'mutual_fund' | 'bond' | 'crypto';
    exchange: string;
    price: number;
    change: number;
    changePercent: number;
    description?: string;
    sector?: string;
  }>>> => {
    const response = await api.get('/investments/search', {
      params: { q: query, type }
    });
    return response.data;
  },

  buyInvestment: async (orderData: {
    symbol: string;
    quantity: number;
    orderType: 'market' | 'limit' | 'stop';
    limitPrice?: number;
    stopPrice?: number;
    fromAccountId: string;
    timeInForce?: 'day' | 'gtc' | 'ioc';
  }): Promise<ApiResponse<{
    orderId: string;
    symbol: string;
    quantity: number;
    estimatedCost: number;
    fees: number;
    status: 'pending' | 'filled' | 'cancelled';
    estimatedSettlement: string;
  }>> => {
    const response = await api.post('/investments/buy', orderData);
    return response.data;
  },

  sellInvestment: async (orderData: {
    symbol: string;
    quantity: number;
    orderType: 'market' | 'limit' | 'stop';
    limitPrice?: number;
    stopPrice?: number;
    timeInForce?: 'day' | 'gtc' | 'ioc';
  }): Promise<ApiResponse<{
    orderId: string;
    symbol: string;
    quantity: number;
    estimatedProceeds: number;
    fees: number;
    status: 'pending' | 'filled' | 'cancelled';
    estimatedSettlement: string;
  }>> => {
    const response = await api.post('/investments/sell', orderData);
    return response.data;
  },

  getOrders: async (params?: {
    status?: string;
    symbol?: string;
    page?: number;
    limit?: number;
  }): Promise<ApiResponse<Array<{
    id: string;
    symbol: string;
    side: 'buy' | 'sell';
    quantity: number;
    orderType: string;
    status: string;
    filledQuantity: number;
    averagePrice: number;
    fees: number;
    createdAt: string;
    updatedAt: string;
  }>>> => {
    const response = await api.get('/investments/orders', { params });
    return response.data;
  },

  getOrderHistory: async (params?: {
    symbol?: string;
    fromDate?: string;
    toDate?: string;
    page?: number;
    limit?: number;
  }): Promise<ApiResponse<Array<{
    id: string;
    symbol: string;
    side: 'buy' | 'sell';
    quantity: number;
    price: number;
    fees: number;
    total: number;
    executedAt: string;
    settlementDate: string;
  }>>> => {
    const response = await api.get('/investments/orders/history', { params });
    return response.data;
  },

  getWatchlist: async (): Promise<ApiResponse<Array<{
    symbol: string;
    name: string;
    price: number;
    change: number;
    changePercent: number;
    addedAt: string;
  }>>> => {
    const response = await api.get('/investments/watchlist');
    return response.data;
  },

  addToWatchlist: async (symbol: string): Promise<ApiResponse> => {
    const response = await api.post('/investments/watchlist', { symbol });
    return response.data;
  },

  removeFromWatchlist: async (symbol: string): Promise<ApiResponse> => {
    const response = await api.delete(`/investments/watchlist/${symbol}`);
    return response.data;
  },

  getPerformanceMetrics: async (period?: 'day' | 'week' | 'month' | 'quarter' | 'year' | 'all'): Promise<ApiResponse<{
    totalReturn: number;
    totalReturnPercent: number;
    annualizedReturn: number;
    volatility: number;
    sharpeRatio: number;
    maxDrawdown: number;
    beta: number;
    alpha: number;
    performanceData: Array<{
      date: string;
      portfolioValue: number;
      benchmarkValue: number;
    }>;
    assetAllocation: Array<{
      type: string;
      value: number;
      percentage: number;
    }>;
    sectorAllocation: Array<{
      sector: string;
      value: number;
      percentage: number;
    }>;
  }>> => {
    const response = await api.get('/investments/performance', {
      params: period ? { period } : {}
    });
    return response.data;
  },

  getDividends: async (params?: {
    year?: number;
    page?: number;
    limit?: number;
  }): Promise<ApiResponse<Array<{
    id: string;
    symbol: string;
    amount: number;
    exDate: string;
    payDate: string;
    recordDate: string;
    status: 'pending' | 'paid';
  }>>> => {
    const response = await api.get('/investments/dividends', { params });
    return response.data;
  },

  getNewsAndAlerts: async (symbols?: string[]): Promise<ApiResponse<Array<{
    id: string;
    headline: string;
    summary: string;
    source: string;
    publishedAt: string;
    url: string;
    sentiment: 'positive' | 'negative' | 'neutral';
    symbols: string[];
  }>>> => {
    const response = await api.get('/investments/news', {
      params: symbols ? { symbols: symbols.join(',') } : {}
    });
    return response.data;
  },

  createPriceAlert: async (alertData: {
    symbol: string;
    alertType: 'above' | 'below';
    targetPrice: number;
    notificationMethod: 'email' | 'sms' | 'push';
  }): Promise<ApiResponse<{
    alertId: string;
  }>> => {
    const response = await api.post('/investments/alerts', alertData);
    return response.data;
  },

  getAlerts: async (): Promise<ApiResponse<Array<{
    id: string;
    symbol: string;
    alertType: string;
    targetPrice: number;
    currentPrice: number;
    status: 'active' | 'triggered' | 'expired';
    createdAt: string;
  }>>> => {
    const response = await api.get('/investments/alerts');
    return response.data;
  },

  deleteAlert: async (alertId: string): Promise<ApiResponse> => {
    const response = await api.delete(`/investments/alerts/${alertId}`);
    return response.data;
  },
};

// Export the configured axios instance
export default api;
