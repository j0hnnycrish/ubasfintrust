import React, { createContext, useContext, useState, useEffect } from 'react';
import { adminAPI, authAPI } from '@/lib/api';

interface AdminUser {
  id: string;
  username: string;
  email: string;
  role: 'super_admin' | 'admin' | 'manager';
  permissions: string[];
  lastLogin: string;
}

interface Customer {
  id: string;
  username: string;
  email: string;
  fullName: string;
  phoneNumber: string;
  accountType: 'personal' | 'business' | 'corporate' | 'private';
  accountNumber: string;
  isVerified: boolean;
  kycStatus: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  status: 'active' | 'suspended' | 'closed';
  accounts: CustomerAccount[];
}

interface CustomerAccount {
  id: string;
  customerId: string;
  name: string;
  type: 'checking' | 'savings' | 'credit' | 'investment' | 'business';
  balance: number;
  availableBalance?: number;
  accountNumber: string;
  interestRate?: number;
  creditLimit?: number;
  status: 'active' | 'frozen' | 'closed';
  createdAt: string;
}

interface Transaction {
  id: string;
  accountId: string;
  customerId: string;
  date: string;
  description: string;
  amount: number;
  type: 'credit' | 'debit';
  category: string;
  status: 'pending' | 'completed' | 'failed';
  reference: string;
}

interface AdminContextType {
  adminUser: AdminUser | null;
  isAdminAuthenticated: boolean;
  customers: Customer[];
  transactions: Transaction[];
  customerMeta: { page: number; limit: number; total: number; totalPages: number; search?: string };
  txMeta: { [accountId: string]: { page: number; limit: number; total?: number; totalPages?: number } };
  adminLogin: (credentials: { username: string; password: string }) => Promise<{ success: boolean; error?: string }>;
  adminLogout: () => void;
  adminChangePassword: (currentPassword: string, newPassword: string) => Promise<{ success: boolean; error?: string }>;
  
  // Customer Management
  createCustomer: (customerData: Partial<Customer>) => Promise<{ success: boolean; error?: string; customer?: Customer }>;
  updateCustomer: (customerId: string, updates: Partial<Customer>) => Promise<{ success: boolean; error?: string }>;
  deleteCustomer: (customerId: string) => Promise<{ success: boolean; error?: string }>;
  
  // Account Management
  createAccount: (customerId: string, accountData: Partial<CustomerAccount>) => Promise<{ success: boolean; error?: string }>;
  updateAccount: (accountId: string, updates: Partial<CustomerAccount>) => Promise<{ success: boolean; error?: string }>;
  updateAccountBalance: (accountId: string, newBalance: number) => Promise<{ success: boolean; error?: string }>;
  
  // Transaction Management
  createTransaction: (transactionData: Partial<Transaction>) => Promise<{ success: boolean; error?: string }>;
  updateTransaction: (transactionId: string, updates: Partial<Transaction>) => Promise<{ success: boolean; error?: string }>;
  fetchAccountTransactions: (accountId: string, page?: number, limit?: number) => Promise<{ success: boolean; error?: string; transactions?: Transaction[] }>;
  setCustomerSearch: (search: string) => void;
  fetchCustomers: (page?: number, limit?: number) => Promise<void>;
  
  // Data Management
  refreshData: () => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [customerMeta, setCustomerMeta] = useState({ page:1, limit:20, total:0, totalPages:0, search:'' });
  const [txMeta, setTxMeta] = useState<{[accountId:string]: { page:number; limit:number; total?:number; totalPages?:number }}>({});

  // Load real data from backend
  const fetchAdminData = async () => {
    try {
  const usersResp = await adminAPI.listUsers({ page: customerMeta.page, limit: customerMeta.limit, search: customerMeta.search || undefined });
      if (!usersResp.success || !usersResp.data) return;
      const rawUsers = usersResp.data as any[];
      // For each user fetch accounts
      const enriched: Customer[] = [];
      for (const u of rawUsers) {
        try {
          const accResp = await adminAPI.listUserAccounts(u.id);
          const accounts = (accResp.success && accResp.data ? accResp.data : []).map((a:any) => ({
            id: a.id,
            customerId: u.id,
            name: a.account_type?.charAt(0).toUpperCase()+a.account_type?.slice(1)+' Account',
            type: (a.account_type || 'checking'),
            balance: a.balance || 0,
            availableBalance: a.available_balance || a.balance || 0,
            accountNumber: a.account_number,
            status: a.status || 'active',
            createdAt: a.created_at?.split('T')[0] || ''
          }));
          enriched.push({
            id: u.id,
            username: u.email.split('@')[0],
            email: u.email,
            fullName: `${u.first_name} ${u.last_name}`.trim(),
            phoneNumber: u.phone || '',
            accountType: u.account_type,
            accountNumber: accounts[0]?.accountNumber || '',
            isVerified: !!u.is_verified,
            kycStatus: u.kyc_status,
            createdAt: u.created_at?.split('T')[0] || '',
            status: u.is_active ? 'active' : 'suspended',
            accounts
          });
        } catch {}
      }
      setCustomers(enriched);
      if (usersResp.pagination) {
        setCustomerMeta(prev => ({ ...prev, ...usersResp.pagination, search: customerMeta.search }));
      }
    } catch (e) {
      console.warn('Failed to fetch admin data', e);
    }
  };

  useEffect(() => {
    // Restore admin session & load data if tokens exist
    const storedAdmin = localStorage.getItem('ubas_admin');
    if (storedAdmin) {
      try { setAdminUser(JSON.parse(storedAdmin)); fetchAdminData(); } catch { localStorage.removeItem('ubas_admin'); }
    }
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
  // Persist minimal cache (optional)
  if (customers.length > 0) localStorage.setItem('ubas_customers', JSON.stringify(customers));
  }, [customers]);

  useEffect(() => {
  if (transactions.length > 0) localStorage.setItem('ubas_transactions', JSON.stringify(transactions));
  }, [transactions]);

  const adminLogin = async (credentials: { username: string; password: string }): Promise<{ success: boolean; error?: string }> => {
    try {
      // Treat username field as email for backend auth
      const email = credentials.username;
      const resp = await authAPI.login({ email, password: credentials.password });
      if (!resp.success || !resp.data) {
        return { success: false, error: resp.message || 'Login failed' };
      }
  const { user } = resp.data;
      if (user.accountType !== 'corporate') {
        return { success: false, error: 'Insufficient role: corporate required' };
      }
      const admin: AdminUser = {
        id: user.id,
        username: user.email.split('@')[0],
        email: user.email,
        role: 'super_admin',
        permissions: ['all'],
        lastLogin: new Date().toISOString()
      };
      localStorage.setItem('ubas_admin', JSON.stringify(admin));
      setAdminUser(admin);
  // After login load backend data
  await fetchAdminData();
  return { success: true };
    } catch (error: any) {
      return { success: false, error: error?.response?.data?.message || 'Admin login failed' };
    }
  };

  const adminLogout = () => {
    localStorage.removeItem('ubas_admin');
    setAdminUser(null);
  };

  const adminChangePassword = async (currentPassword: string, newPassword: string): Promise<{ success: boolean; error?: string }> => {
    try {
      // Reuse user password change endpoint (admin user is just a corporate account type)
      const resp = await (await import('@/lib/api')).userAPI.changePassword({ currentPassword, newPassword });
      if (!resp.success) return { success: false, error: resp.message || 'Password change failed' };
      return { success: true };
    } catch (e: any) {
      return { success: false, error: e?.response?.data?.message || e.message || 'Password change error' };
    }
  };

  const createCustomer = async (customerData: Partial<Customer>): Promise<{ success: boolean; error?: string; customer?: Customer }> => {
    try {
      if (!customerData.email || !customerData.fullName) {
        return { success: false, error: 'Email and full name required' };
      }

      // Simple name split for backend fields
      const [firstName, ...rest] = customerData.fullName.split(' ');
      const lastName = rest.join(' ') || 'User';

      const cd: any = customerData; // allow optional extended fields from UI
      const payload = {
        email: customerData.email,
        password: cd.password || 'TempPass#123',
        firstName,
        lastName,
        phone: customerData.phoneNumber || '+10000000000',
        dateOfBirth: cd.dateOfBirth || '1990-01-01',
        accountType: customerData.accountType || 'personal'
      } as const;

      const response = await adminAPI.createUser(payload);
      if (!response.success || !response.data) {
        return { success: false, error: response.message || 'Backend creation failed' };
      }

      const newCustomer: Customer = {
        id: response.data.userId,
        username: customerData.username || payload.email.split('@')[0],
        email: payload.email,
        fullName: customerData.fullName,
        phoneNumber: payload.phone,
        accountType: payload.accountType as any,
        accountNumber: response.data.accountNumber,
        isVerified: false,
        kycStatus: 'pending',
        createdAt: new Date().toISOString().split('T')[0],
        status: 'active',
        accounts: []
      };

      setCustomers(prev => [...prev, newCustomer]);
      return { success: true, customer: newCustomer };
    } catch (error: any) {
      return { success: false, error: error.message || 'Failed to create customer' };
    }
  };

  const updateCustomer = async (customerId: string, updates: Partial<Customer>): Promise<{ success: boolean; error?: string }> => {
    try {
      setCustomers(prev => prev.map(customer => 
        customer.id === customerId ? { ...customer, ...updates } : customer
      ));
      return { success: true };
    } catch (error) {
      return { success: false, error: 'Failed to update customer' };
    }
  };

  const deleteCustomer = async (customerId: string): Promise<{ success: boolean; error?: string }> => {
    try {
      setCustomers(prev => prev.filter(customer => customer.id !== customerId));
      setTransactions(prev => prev.filter(transaction => transaction.customerId !== customerId));
      return { success: true };
    } catch (error) {
      return { success: false, error: 'Failed to delete customer' };
    }
  };

  const createAccount = async (customerId: string, accountData: Partial<CustomerAccount>): Promise<{ success: boolean; error?: string }> => {
    try {
      const acctType = (accountData.type as any) || 'checking';
      const resp = await adminAPI.createAccountForUser(customerId, { accountType: acctType, currency: 'USD', initialBalance: accountData.balance || 0 });
      if (!resp.success || !resp.data) return { success: false, error: resp.message || 'Backend account creation failed' };
      const newAccount: CustomerAccount = {
        id: resp.data.accountId,
        customerId,
        name: accountData.name || acctType.charAt(0).toUpperCase()+acctType.slice(1)+' Account',
        type: acctType,
        balance: accountData.balance || 0,
        availableBalance: accountData.balance || 0,
        accountNumber: resp.data.accountNumber,
        status: 'active',
        createdAt: new Date().toISOString().split('T')[0]
      };
      setCustomers(prev => prev.map(c => c.id === customerId ? { ...c, accounts: [...c.accounts, newAccount] } : c));
      return { success: true };
    } catch (error) {
      return { success: false, error: 'Failed to create account' };
    }
  };

  const updateAccount = async (accountId: string, updates: Partial<CustomerAccount>): Promise<{ success: boolean; error?: string }> => {
    try {
      setCustomers(prev => prev.map(customer => ({
        ...customer,
        accounts: customer.accounts.map(account => 
          account.id === accountId ? { ...account, ...updates } : account
        )
      })));
      return { success: true };
    } catch (error) {
      return { success: false, error: 'Failed to update account' };
    }
  };

  const updateAccountBalance = async (accountId: string, newBalance: number): Promise<{ success: boolean; error?: string }> => {
    return updateAccount(accountId, { balance: newBalance, availableBalance: newBalance });
  };

  const createTransaction = async (transactionData: Partial<Transaction>): Promise<{ success: boolean; error?: string }> => {
    try {
      const newTransaction: Transaction = {
        id: `txn_${Date.now()}`,
        accountId: transactionData.accountId || '',
        customerId: transactionData.customerId || '',
        date: transactionData.date || new Date().toISOString().split('T')[0],
        description: transactionData.description || '',
        amount: transactionData.amount || 0,
        type: transactionData.type || 'debit',
        category: transactionData.category || 'Other',
        status: 'completed',
        reference: `TXN${Date.now().toString().slice(-6)}`,
        ...transactionData
      };
      
      setTransactions(prev => [...prev, newTransaction]);
      
      // Update account balance
      if (newTransaction.accountId && newTransaction.amount !== 0) {
        setCustomers(prev => prev.map(customer => ({
          ...customer,
          accounts: customer.accounts.map(account => 
            account.id === newTransaction.accountId 
              ? { 
                  ...account, 
                  balance: account.balance + newTransaction.amount,
                  availableBalance: (account.availableBalance || account.balance) + newTransaction.amount
                }
              : account
          )
        })));
      }
      
      return { success: true };
    } catch (error) {
      return { success: false, error: 'Failed to create transaction' };
    }
  };

  const updateTransaction = async (transactionId: string, updates: Partial<Transaction>): Promise<{ success: boolean; error?: string }> => {
    try {
      setTransactions(prev => prev.map(transaction => 
        transaction.id === transactionId ? { ...transaction, ...updates } : transaction
      ));
      return { success: true };
    } catch (error) {
      return { success: false, error: 'Failed to update transaction' };
    }
  };

  const fetchAccountTransactions = async (accountId: string, page: number = 1, limit: number = 25) => {
    try {
      const resp = await adminAPI.listAccountTransactions(accountId, { page, limit });
      if (!resp.success) return { success:false, error: resp.message || 'Fetch failed' };
      const txsRaw = (resp.data || []) as any[];
      const mapped: Transaction[] = txsRaw.map(r => ({
        id: r.id,
        accountId: accountId,
        customerId: r.from_account_id ? (customers.find(c=>c.accounts.some(a=>a.id===r.from_account_id))?.id || '') : (customers.find(c=>c.accounts.some(a=>a.id===r.to_account_id))?.id || ''),
        date: (r.created_at || '').split('T')[0],
        description: r.description || r.type,
        amount: r.to_account_id === accountId ? r.amount : -r.amount,
        type: r.to_account_id === accountId ? 'credit':'debit',
        category: r.category || 'General',
        status: r.status || 'completed',
        reference: r.reference
      }));
      setTransactions(prev => {
        // Replace existing for this account (simple approach) while keeping others
        const others = prev.filter(t => t.accountId !== accountId);
        return [...others, ...mapped];
      });
      setTxMeta(prev => ({ ...prev, [accountId]: { page, limit, total: resp.pagination?.total, totalPages: resp.pagination?.totalPages } }));
      return { success: true, transactions: mapped };
    } catch (e:any) {
      return { success:false, error: e.message };
    }
  };

  const setCustomerSearch = (search: string) => {
    setCustomerMeta(prev => ({ ...prev, search, page:1 }));
  };

  const fetchCustomers = async (page?: number, limit?: number) => {
    if (page || limit) setCustomerMeta(prev => ({ ...prev, page: page||prev.page, limit: limit||prev.limit }));
    await fetchAdminData();
  };

  const refreshData = () => { fetchAdminData(); };

  const value: AdminContextType = {
    adminUser,
    isAdminAuthenticated: !!adminUser,
    customers,
    transactions,
  customerMeta,
  txMeta,
    adminLogin,
    adminLogout,
  adminChangePassword,
    createCustomer,
    updateCustomer,
    deleteCustomer,
    createAccount,
    updateAccount,
    updateAccountBalance,
    createTransaction,
    updateTransaction,
  fetchAccountTransactions,
  setCustomerSearch,
  fetchCustomers,
    refreshData
  };

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
}
