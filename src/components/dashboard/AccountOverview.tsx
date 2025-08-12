import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Eye, 
  EyeOff,
  ArrowUpRight,
  ArrowDownLeft,
  CreditCard,
  PiggyBank,
  Building,
  Briefcase
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useAdmin } from '@/contexts/AdminContext';

interface Account {
  id: string;
  name: string;
  type: 'checking' | 'savings' | 'credit' | 'investment' | 'business';
  balance: number;
  availableBalance?: number;
  accountNumber: string;
  interestRate?: number;
  creditLimit?: number;
  lastTransaction?: {
    amount: number;
    description: string;
    date: string;
  };
}

interface AccountOverviewProps {
  showBalances: boolean;
  onToggleBalances: () => void;
  onTransferClick?: () => void;
}

export function AccountOverview({ showBalances, onToggleBalances, onTransferClick }: AccountOverviewProps) {
  const { user } = useAuth();
  const { customers } = useAdmin();

  // Get account data from admin context based on logged-in user
  const getAccountsForUser = (): Account[] => {
    if (!user) return [];

    // Find the customer in admin data that matches the logged-in user
    const customer = customers.find(c => c.username === user.username);
    if (!customer) return [];

    // Convert admin account format to component account format
    return customer.accounts.map(account => ({
      id: account.id,
      name: account.name,
      type: account.type,
      balance: account.balance,
      availableBalance: account.availableBalance || account.balance,
      accountNumber: account.accountNumber,
      interestRate: account.interestRate,
      creditLimit: account.creditLimit,
      lastTransaction: {
        amount: Math.random() > 0.5 ? -45.67 : 156.78,
        description: Math.random() > 0.5 ? 'Recent Purchase' : 'Recent Deposit',
        date: new Date().toISOString().split('T')[0]
      }
    }));
  };

  const accounts = getAccountsForUser();
  const totalBalance = accounts.reduce((sum, account) => sum + account.balance, 0);

  const getAccountIcon = (type: Account['type']) => {
    switch (type) {
      case 'checking': return CreditCard;
      case 'savings': return PiggyBank;
      case 'business': return Building;
      case 'investment': return TrendingUp;
      case 'credit': return Briefcase;
      default: return DollarSign;
    }
  };

  const getAccountColor = (type: Account['type']) => {
    switch (type) {
      case 'checking': return 'bg-red-100 text-red-700';
      case 'savings': return 'bg-red-50 text-red-700';
      case 'business': return 'bg-red-100 text-red-700';
      case 'investment': return 'bg-red-50 text-red-700';
      case 'credit': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const formatCurrency = (amount: number) => {
    if (!showBalances) return '••••••';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(Math.abs(amount));
  };

  const formatAccountNumber = (accountNumber: string) => {
    if (!showBalances) return '••••••••';
    return accountNumber;
  };

  return (
    <div className="space-y-6">
      {/* Total Balance Card */}
      <Card className="bg-gradient-to-r from-red-700 to-red-800 text-white">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-lg font-medium">Total Balance</CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleBalances}
            className="text-white hover:bg-white/20"
          >
            {showBalances ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </Button>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">
            {formatCurrency(totalBalance)}
          </div>
          <p className="text-red-100 text-sm">
            Across {accounts.length} accounts
          </p>
        </CardContent>
      </Card>

      {/* Individual Accounts */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {accounts.map((account) => {
          const Icon = getAccountIcon(account.type);
          const isCredit = account.type === 'credit';
          const displayBalance = isCredit ? Math.abs(account.balance) : account.balance;
          
          return (
            <Card key={account.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{account.name}</CardTitle>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${getAccountColor(account.type)}`}>
                  <Icon className="h-4 w-4" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="text-2xl font-bold">
                    {isCredit && account.balance < 0 ? '-' : ''}
                    {formatCurrency(displayBalance)}
                  </div>
                  
                  {account.availableBalance !== undefined && (
                    <p className="text-xs text-gray-500">
                      Available: {formatCurrency(account.availableBalance)}
                    </p>
                  )}
                  
                  {account.creditLimit && (
                    <p className="text-xs text-gray-500">
                      Credit Limit: {formatCurrency(account.creditLimit)}
                    </p>
                  )}
                  
                  {account.interestRate && (
                    <p className="text-xs text-green-600">
                      {account.interestRate}% APY
                    </p>
                  )}
                  
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{formatAccountNumber(account.accountNumber)}</span>
                    <span className="capitalize">{account.type}</span>
                  </div>
                  
                  {account.lastTransaction && (
                    <div className="pt-2 border-t">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-500">Last transaction</span>
                        <div className="flex items-center space-x-1">
                          {account.lastTransaction.amount > 0 ? (
                            <ArrowUpRight className="h-3 w-3 text-green-500" />
                          ) : (
                            <ArrowDownLeft className="h-3 w-3 text-red-500" />
                          )}
                          <span className={account.lastTransaction.amount > 0 ? 'text-green-600' : 'text-red-600'}>
                            {formatCurrency(Math.abs(account.lastTransaction.amount))}
                          </span>
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 mt-1 truncate">
                        {account.lastTransaction.description}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common banking tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button
              variant="outline"
              className="h-20 flex flex-col space-y-2"
              onClick={onTransferClick}
            >
              <ArrowUpRight className="h-6 w-6" />
              <span className="text-sm">Transfer</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col space-y-2">
              <CreditCard className="h-6 w-6" />
              <span className="text-sm">Pay Bills</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col space-y-2">
              <PiggyBank className="h-6 w-6" />
              <span className="text-sm">Deposit</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col space-y-2">
              <TrendingUp className="h-6 w-6" />
              <span className="text-sm">Invest</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
