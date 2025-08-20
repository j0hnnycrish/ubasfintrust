import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useBankingData } from '@/hooks/useBankingData';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  CreditCard,
  PiggyBank,
  Building,
  TrendingUp,
  Briefcase,
  DollarSign,
  Eye,
  EyeOff,
  Plus,
  Settings,
  Download,
  ArrowUpRight,
  ArrowDownLeft
} from 'lucide-react';

export function AccountsView() {
  const { user } = useAuth();
  const { accounts, transactions, totalBalance, isLoading, createAccount } = useBankingData();
  const [showBalances, setShowBalances] = useState(true);

  const handleCreateAccount = async (accountType: string) => {
    await createAccount(accountType);
  };

  // Get transactions for each account
  const getAccountTransactions = (accountId: string) => {
    return transactions
      .filter(txn => txn.fromAccountId === accountId || txn.toAccountId === accountId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 3); // Show last 3 transactions
  };

  const formatCurrency = (amount: number) => {
    if (!showBalances) return '••••••';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getAccountIcon = (type: string) => {
    switch (type?.toLowerCase()) {
      case 'checking': return CreditCard;
      case 'savings': return PiggyBank;
      case 'business': return Building;
      case 'investment': return TrendingUp;
      case 'credit': return Briefcase;
      default: return DollarSign;
    }
  };

  const getAccountColor = (type: string) => {
    switch (type?.toLowerCase()) {
      case 'checking': return 'bg-red-100 text-red-700 border-red-300';
      case 'savings': return 'bg-green-100 text-green-700 border-green-300';
      case 'business': return 'bg-blue-100 text-blue-700 border-blue-300';
      case 'investment': return 'bg-purple-100 text-purple-700 border-purple-300';
      case 'credit': return 'bg-orange-100 text-orange-700 border-orange-300';
      default: return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const getAccountTypeDescription = (type: string) => {
    switch (type?.toLowerCase()) {
      case 'checking': return 'Everyday banking and transactions';
      case 'savings': return 'Earn interest on your deposits';
      case 'business': return 'Business banking and operations';
      case 'investment': return 'Investment and wealth management';
      case 'credit': return 'Credit line and borrowing';
      default: return 'Banking account';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">My Accounts</h2>
          <p className="text-gray-600">Manage your banking accounts and view details</p>
        </div>
        <div className="flex space-x-4">
          <Button
            variant="outline"
            onClick={() => setShowBalances(!showBalances)}
            className="flex items-center space-x-2"
          >
            {showBalances ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            <span>{showBalances ? 'Hide' : 'Show'} Balances</span>
          </Button>
          <Button 
            className="bg-blue-600 hover:bg-blue-700"
            onClick={() => handleCreateAccount('savings')}
            disabled={isLoading}
          >
            <Plus className="h-4 w-4 mr-2" />
            {isLoading ? 'Creating...' : 'Open New Account'}
          </Button>
        </div>
      </div>

      {/* Account Summary */}
      <Card className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
        <CardHeader>
          <CardTitle className="text-xl">Total Balance</CardTitle>
          <CardDescription className="text-blue-100">
            Across all your accounts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold mb-2">
            {formatCurrency(accounts.reduce((sum, account) => sum + account.balance, 0))}
          </div>
          <p className="text-blue-100">
            {accounts.length} active account{accounts.length !== 1 ? 's' : ''}
          </p>
        </CardContent>
      </Card>

      {/* Individual Accounts */}
      <div className="grid gap-6">
        {accounts.map((account) => {
          const Icon = getAccountIcon(account.accountType);
          const accountTransactions = getAccountTransactions(account.id);
          const isCredit = account.accountType?.toLowerCase() === 'credit';
          
          return (
            <Card key={account.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 ${getAccountColor(account.accountType)}`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">{account.accountType?.charAt(0).toUpperCase() + account.accountType?.slice(1)} Account</CardTitle>
                      <CardDescription>
                        {getAccountTypeDescription(account.accountType)} • {account.accountNumber}
                      </CardDescription>
                    </div>
                  </div>
                  <Badge variant="outline" className="capitalize">
                    active
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Balance Information */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-600 mb-1">
                      {isCredit ? 'Current Balance' : 'Available Balance'}
                    </p>
                    <p className="text-2xl font-bold">
                      {isCredit && account.balance < 0 ? '-' : ''}
                      {formatCurrency(Math.abs(account.balance))}
                    </p>
                  </div>
                  
                  {account.availableBalance !== undefined && account.availableBalance !== account.balance && (
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-sm text-gray-600 mb-1">Available Balance</p>
                      <p className="text-2xl font-bold">
                        {formatCurrency(account.availableBalance)}
                      </p>
                    </div>
                  )}
                  
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-600 mb-1">Currency</p>
                    <p className="text-2xl font-bold">
                      {account.currency || 'USD'}
                    </p>
                  </div>
                </div>

                {/* Recent Transactions */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Recent Transactions</h4>
                  {accountTransactions.length > 0 ? (
                    <div className="space-y-2">
                      {accountTransactions.map((transaction) => (
                        <div key={transaction.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                              transaction.amount > 0 ? 'bg-green-100' : 'bg-red-100'
                            }`}>
                              {transaction.amount > 0 ? (
                                <ArrowDownLeft className="h-4 w-4 text-green-600" />
                              ) : (
                                <ArrowUpRight className="h-4 w-4 text-red-600" />
                              )}
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{transaction.description || 'Transaction'}</p>
                              <p className="text-sm text-gray-500">{transaction.type || 'transfer'} • {new Date(transaction.createdAt).toLocaleDateString()}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className={`font-semibold ${
                              transaction.amount > 0 ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {transaction.amount > 0 ? '+' : ''}
                              {formatCurrency(Math.abs(transaction.amount))}
                            </p>
                            <Badge variant="outline" className="text-xs">
                              {transaction.status || 'completed'}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-4 text-gray-500">
                      <p>No recent transactions</p>
                    </div>
                  )}
                </div>

                {/* Account Actions */}
                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" size="sm">
                    <ArrowUpRight className="h-4 w-4 mr-1" />
                    Transfer
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-1" />
                    Statement
                  </Button>
                  <Button variant="outline" size="sm">
                    <Settings className="h-4 w-4 mr-1" />
                    Settings
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {accounts.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <CreditCard className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Accounts Found</h3>
            <p className="text-gray-600 mb-6">
              You don't have any accounts yet. Contact support to set up your first account.
            </p>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Open Your First Account
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
