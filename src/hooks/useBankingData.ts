import { useState, useEffect, useCallback } from 'react';
import { userAPI, accountAPI, Account, Transaction } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export const useBankingData = () => {
  const { user, isAuthenticated } = useAuth();
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch user accounts
  const fetchAccounts = useCallback(async () => {
    if (!isAuthenticated || !user) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await userAPI.getAccounts();
      if (response.success && response.data) {
        setAccounts(response.data);
      } else {
        setError(response.message || 'Failed to fetch accounts');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch accounts');
      console.error('Failed to fetch accounts:', err);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, user]);

  // Fetch user transactions
  const fetchTransactions = useCallback(async (accountId?: string) => {
    if (!isAuthenticated || !user) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      let response;
      if (accountId) {
        response = await accountAPI.getTransactions(accountId);
      } else {
        response = await userAPI.getTransactions();
      }
      
      if (response.success && response.data) {
        setTransactions(response.data);
      } else {
        setError(response.message || 'Failed to fetch transactions');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch transactions');
      console.error('Failed to fetch transactions:', err);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, user]);

  // Create new account
  const createAccount = useCallback(async (accountType: string, initialBalance: number = 5000) => {
    if (!isAuthenticated || !user) {
      toast.error('Please login to create an account');
      return { success: false };
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await accountAPI.create({
        accountType,
        currency: 'USD',
        initialBalance
      });
      
      if (response.success) {
        toast.success('Account created successfully!');
        await fetchAccounts(); // Refresh accounts
        return { success: true, data: response.data };
      } else {
        toast.error(response.message || 'Failed to create account');
        return { success: false, error: response.message };
      }
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Failed to create account';
      toast.error(errorMsg);
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, user, fetchAccounts]);

  // Banking operations
  const deposit = useCallback(async (accountId: string, amount: number, description?: string) => {
    if (!isAuthenticated || !user) {
      toast.error('Please login to perform this operation');
      return { success: false };
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await accountAPI.deposit(accountId, amount, description);
      
      if (response.success) {
        toast.success(`Successfully deposited $${amount}`);
        await fetchAccounts(); // Refresh accounts
        await fetchTransactions(); // Refresh transactions
        return { success: true, data: response.data };
      } else {
        toast.error(response.message || 'Failed to deposit');
        return { success: false, error: response.message };
      }
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Failed to deposit';
      toast.error(errorMsg);
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, user, fetchAccounts, fetchTransactions]);

  const withdraw = useCallback(async (accountId: string, amount: number, description?: string) => {
    if (!isAuthenticated || !user) {
      toast.error('Please login to perform this operation');
      return { success: false };
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await accountAPI.withdraw(accountId, amount, description);
      
      if (response.success) {
        toast.success(`Successfully withdrew $${amount}`);
        await fetchAccounts(); // Refresh accounts
        await fetchTransactions(); // Refresh transactions
        return { success: true, data: response.data };
      } else {
        toast.error(response.message || 'Failed to withdraw');
        return { success: false, error: response.message };
      }
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Failed to withdraw';
      toast.error(errorMsg);
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, user, fetchAccounts, fetchTransactions]);

  const transfer = useCallback(async (fromAccountId: string, toAccountNumber: string, amount: number, description?: string) => {
    if (!isAuthenticated || !user) {
      toast.error('Please login to perform this operation');
      return { success: false };
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await accountAPI.transfer(fromAccountId, toAccountNumber, amount, description);
      
      if (response.success) {
        toast.success(`Successfully transferred $${amount}`);
        await fetchAccounts(); // Refresh accounts
        await fetchTransactions(); // Refresh transactions
        return { success: true, data: response.data };
      } else {
        toast.error(response.message || 'Failed to transfer');
        return { success: false, error: response.message };
      }
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Failed to transfer';
      toast.error(errorMsg);
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, user, fetchAccounts, fetchTransactions]);

  // Auto-fetch data when user is authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      fetchAccounts();
      fetchTransactions();
    }
  }, [isAuthenticated, user, fetchAccounts, fetchTransactions]);

  // Helper functions
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getTotalBalance = () => {
    return accounts.reduce((sum, account) => sum + account.balance, 0);
  };

  const getAccountByType = (type: string) => {
    return accounts.find(account => account.accountType === type);
  };

  return {
    // Data
    accounts,
    transactions,
    totalBalance: getTotalBalance(),
    
    // State
    isLoading,
    error,
    
    // Actions
    fetchAccounts,
    fetchTransactions,
    createAccount,
    deposit,
    withdraw,
    transfer,
    
    // Helpers
    formatCurrency,
    getAccountByType,
  };
};
