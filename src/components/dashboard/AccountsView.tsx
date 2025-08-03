import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useAdmin } from '@/contexts/AdminContext';
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
  const { customers, transactions } = useAdmin();
  const [showBalances, setShowBalances] = useState(true);

  // Get customer data
  const customer = customers.find(c => c.username === user?.username);
  const accounts = customer?.accounts || [];

  // Get transactions for each account
  const getAccountTransactions = (accountId: string) => {
    return transactions
      .filter(txn => txn.accountId === accountId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
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
    switch (type) {
      case 'checking': return CreditCard;
      case 'savings': return PiggyBank;
      case 'business': return Building;
      case 'investment': return TrendingUp;
      case 'credit': return Briefcase;
      default: return DollarSign;
    }
  };

  const getAccountColor = (type: string) => {
    switch (type) {
      case 'checking': return 'bg-blue-100 text-blue-600 border-blue-200';
      case 'savings': return 'bg-green-100 text-green-600 border-green-200';
      case 'business': return 'bg-purple-100 text-purple-600 border-purple-200';
      case 'investment': return 'bg-yellow-100 text-yellow-600 border-yellow-200';
      case 'credit': return 'bg-red-100 text-red-600 border-red-200';
      default: return 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };

  const getAccountTypeDescription = (type: string) => {
    switch (type) {
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
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            Open New Account
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
          const Icon = getAccountIcon(account.type);
          const accountTransactions = getAccountTransactions(account.id);
          const isCredit = account.type === 'credit';
          
          return (
            <Card key={account.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 ${getAccountColor(account.type)}`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">{account.name}</CardTitle>
                      <CardDescription>
                        {getAccountTypeDescription(account.type)} • {account.accountNumber}
                      </CardDescription>
                    </div>
                  </div>
                  <Badge variant="outline" className="capitalize">
                    {account.status}
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
                  
                  {account.creditLimit && (
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-sm text-gray-600 mb-1">Credit Limit</p>
                      <p className="text-2xl font-bold">
                        {formatCurrency(account.creditLimit)}
                      </p>
                    </div>
                  )}
                  
                  {account.interestRate && (
                    <div className="bg-green-50 rounded-lg p-4">
                      <p className="text-sm text-green-600 mb-1">Interest Rate</p>
                      <p className="text-2xl font-bold text-green-700">
                        {account.interestRate}% APY
                      </p>
                    </div>
                  )}
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
                              transaction.type === 'credit' ? 'bg-green-100' : 'bg-red-100'
                            }`}>
                              {transaction.type === 'credit' ? (
                                <ArrowDownLeft className="h-4 w-4 text-green-600" />
                              ) : (
                                <ArrowUpRight className="h-4 w-4 text-red-600" />
                              )}
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{transaction.description}</p>
                              <p className="text-sm text-gray-500">{transaction.category} • {transaction.date}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className={`font-semibold ${
                              transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {transaction.type === 'credit' ? '+' : ''}
                              {formatCurrency(Math.abs(transaction.amount))}
                            </p>
                            <Badge variant="outline" className="text-xs">
                              {transaction.status}
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
