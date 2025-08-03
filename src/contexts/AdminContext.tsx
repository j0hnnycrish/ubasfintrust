import React, { createContext, useContext, useState, useEffect } from 'react';

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
  adminLogin: (credentials: { username: string; password: string }) => Promise<{ success: boolean; error?: string }>;
  adminLogout: () => void;
  
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
  
  // Data Management
  refreshData: () => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  // Initialize with sample data
  useEffect(() => {
    // Load existing data from localStorage first
    const storedCustomers = localStorage.getItem('ubas_customers');
    const storedTransactions = localStorage.getItem('ubas_transactions');

    if (storedCustomers && storedTransactions) {
      try {
        setCustomers(JSON.parse(storedCustomers));
        setTransactions(JSON.parse(storedTransactions));
      } catch (error) {
        console.error('Error loading stored data:', error);
        // Fall back to sample data if stored data is corrupted
        initializeSampleData();
      }
    } else {
      initializeSampleData();
    }

    // Check for stored admin session
    const storedAdmin = localStorage.getItem('ubas_admin');
    if (storedAdmin) {
      try {
        const adminData = JSON.parse(storedAdmin);
        setAdminUser(adminData);
      } catch (error) {
        localStorage.removeItem('ubas_admin');
      }
    }
  }, []);

  const initializeSampleData = () => {
    const sampleCustomers: Customer[] = [
      {
        id: '1',
        username: 'john.doe',
        email: 'john.doe@email.com',
        fullName: 'John Doe',
        phoneNumber: '+1-555-0123',
        accountType: 'personal',
        accountNumber: 'UBAS001234567',
        isVerified: true,
        kycStatus: 'approved',
        createdAt: '2024-01-15',
        status: 'active',
        accounts: [
          {
            id: 'acc1',
            customerId: '1',
            name: 'Primary Checking',
            type: 'checking',
            balance: 12847.32,
            availableBalance: 12847.32,
            accountNumber: '****1234',
            status: 'active',
            createdAt: '2024-01-15'
          },
          {
            id: 'acc2',
            customerId: '1',
            name: 'High Yield Savings',
            type: 'savings',
            balance: 45230.18,
            accountNumber: '****5678',
            interestRate: 4.25,
            status: 'active',
            createdAt: '2024-01-15'
          }
        ]
      },
      {
        id: '2',
        username: 'business.user',
        email: 'contact@business.com',
        fullName: 'Business Account',
        phoneNumber: '+1-555-0124',
        accountType: 'business',
        accountNumber: 'UBAS002345678',
        isVerified: true,
        kycStatus: 'approved',
        createdAt: '2024-01-10',
        status: 'active',
        accounts: [
          {
            id: 'acc3',
            customerId: '2',
            name: 'Business Operating',
            type: 'business',
            balance: 187450.00,
            availableBalance: 187450.00,
            accountNumber: '****9012',
            status: 'active',
            createdAt: '2024-01-10'
          }
        ]
      }
    ];

    const sampleTransactions: Transaction[] = [
      {
        id: 'txn1',
        accountId: 'acc1',
        customerId: '1',
        date: '2024-01-15',
        description: 'Amazon Purchase',
        amount: -45.67,
        type: 'debit',
        category: 'Shopping',
        status: 'completed',
        reference: 'TXN001'
      },
      {
        id: 'txn2',
        accountId: 'acc1',
        customerId: '1',
        date: '2024-01-15',
        description: 'Salary Deposit',
        amount: 5200.00,
        type: 'credit',
        category: 'Income',
        status: 'completed',
        reference: 'TXN002'
      }
    ];

    setCustomers(sampleCustomers);
    setTransactions(sampleTransactions);

    // Save sample data to localStorage
    localStorage.setItem('ubas_customers', JSON.stringify(sampleCustomers));
    localStorage.setItem('ubas_transactions', JSON.stringify(sampleTransactions));
  };

  // Save data to localStorage whenever it changes
  useEffect(() => {
    if (customers.length > 0) {
      localStorage.setItem('ubas_customers', JSON.stringify(customers));
    }
  }, [customers]);

  useEffect(() => {
    if (transactions.length > 0) {
      localStorage.setItem('ubas_transactions', JSON.stringify(transactions));
    }
  }, [transactions]);

  const adminLogin = async (credentials: { username: string; password: string }): Promise<{ success: boolean; error?: string }> => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check admin credentials
      if (credentials.username === 'admin' && credentials.password === 'admin123') {
        const admin: AdminUser = {
          id: 'admin1',
          username: 'admin',
          email: 'admin@ubasfinancial.com',
          role: 'super_admin',
          permissions: ['all'],
          lastLogin: new Date().toISOString()
        };
        
        localStorage.setItem('ubas_admin', JSON.stringify(admin));
        setAdminUser(admin);
        return { success: true };
      }
      
      return { success: false, error: 'Invalid admin credentials' };
    } catch (error) {
      return { success: false, error: 'Login failed' };
    }
  };

  const adminLogout = () => {
    localStorage.removeItem('ubas_admin');
    setAdminUser(null);
  };

  const createCustomer = async (customerData: Partial<Customer>): Promise<{ success: boolean; error?: string; customer?: Customer }> => {
    try {
      const newCustomer: Customer = {
        id: `cust_${Date.now()}`,
        username: customerData.username || '',
        email: customerData.email || '',
        fullName: customerData.fullName || '',
        phoneNumber: customerData.phoneNumber || '',
        accountType: customerData.accountType || 'personal',
        accountNumber: `UBAS${Math.random().toString().substr(2, 9)}`,
        isVerified: false,
        kycStatus: 'pending',
        createdAt: new Date().toISOString().split('T')[0],
        status: 'active',
        accounts: []
      };
      
      setCustomers(prev => [...prev, newCustomer]);
      return { success: true, customer: newCustomer };
    } catch (error) {
      return { success: false, error: 'Failed to create customer' };
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
      const newAccount: CustomerAccount = {
        id: `acc_${Date.now()}`,
        customerId,
        name: accountData.name || 'New Account',
        type: accountData.type || 'checking',
        balance: accountData.balance || 0,
        availableBalance: accountData.balance || 0,
        accountNumber: `****${Math.random().toString().substr(2, 4)}`,
        status: 'active',
        createdAt: new Date().toISOString().split('T')[0],
        ...accountData
      };
      
      setCustomers(prev => prev.map(customer => 
        customer.id === customerId 
          ? { ...customer, accounts: [...customer.accounts, newAccount] }
          : customer
      ));
      
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

  const refreshData = () => {
    // Force re-render of data
    setCustomers(prev => [...prev]);
    setTransactions(prev => [...prev]);
  };

  const value: AdminContextType = {
    adminUser,
    isAdminAuthenticated: !!adminUser,
    customers,
    transactions,
    adminLogin,
    adminLogout,
    createCustomer,
    updateCustomer,
    deleteCustomer,
    createAccount,
    updateAccount,
    updateAccountBalance,
    createTransaction,
    updateTransaction,
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
