import React, { useState, useEffect } from 'react';
import { 
  CreditCard, 
  TrendingUp, 
  TrendingDown, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Plus, 
  Send, 
  Receipt, 
  Settings, 
  Bell, 
  Eye, 
  EyeOff,
  Download,
  Filter,
  Search,
  Calendar,
  DollarSign,
  PiggyBank,
  Building,
  Smartphone
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ProfessionalNavigation } from '../homepage/ProfessionalNavigation';

interface Account {
  id: string;
  name: string;
  type: string;
  balance: number;
  accountNumber: string;
  currency: string;
}

interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: 'credit' | 'debit';
  category: string;
  balance: number;
}

interface BankingDashboardProps {
  userAccount: {
    name: string;
    accountType: string;
    customerId: string;
  };
  onLogout: () => void;
}

export function BankingDashboard({ userAccount, onLogout }: BankingDashboardProps) {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<string>('');
  const [showBalance, setShowBalance] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data - In real app, this would come from API
  useEffect(() => {
    const mockAccounts: Account[] = [
      {
        id: '1',
        name: 'Primary Savings',
        type: 'Savings',
        balance: 45750.25,
        accountNumber: '****1234',
        currency: 'USD'
      },
      {
        id: '2',
        name: 'Current Account',
        type: 'Current',
        balance: 12340.80,
        accountNumber: '****5678',
        currency: 'USD'
      },
      {
        id: '3',
        name: 'Fixed Deposit',
        type: 'Fixed Deposit',
        balance: 100000.00,
        accountNumber: '****9012',
        currency: 'USD'
      }
    ];

    const mockTransactions: Transaction[] = [
      {
        id: '1',
        date: '2024-01-26',
        description: 'Salary Credit - ABC Corp',
        amount: 5500.00,
        type: 'credit',
        category: 'Salary',
        balance: 45750.25
      },
      {
        id: '2',
        date: '2024-01-25',
        description: 'Online Transfer to John Doe',
        amount: -250.00,
        type: 'debit',
        category: 'Transfer',
        balance: 40250.25
      },
      {
        id: '3',
        date: '2024-01-24',
        description: 'Grocery Store Payment',
        amount: -85.50,
        type: 'debit',
        category: 'Shopping',
        balance: 40500.75
      },
      {
        id: '4',
        date: '2024-01-23',
        description: 'Interest Credit',
        amount: 125.30,
        type: 'credit',
        category: 'Interest',
        balance: 40586.25
      },
      {
        id: '5',
        date: '2024-01-22',
        description: 'Utility Bill Payment',
        amount: -180.00,
        type: 'debit',
        category: 'Bills',
        balance: 40460.95
      }
    ];

    setAccounts(mockAccounts);
    setTransactions(mockTransactions);
    setSelectedAccount(mockAccounts[0].id);
  }, []);

  const selectedAccountData = accounts.find(acc => acc.id === selectedAccount);
  const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);

  const filteredTransactions = transactions.filter(transaction =>
    transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    transaction.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const handleAccountLogin = (accountType: string) => {
    console.log(`Account login for: ${accountType}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <ProfessionalNavigation onAccountLogin={handleAccountLogin} />
      
      {/* Dashboard Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Welcome back, {userAccount.name}</h1>
              <p className="text-gray-600">Customer ID: {userAccount.customerId}</p>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm">
                <Bell className="h-4 w-4 mr-2" />
                Notifications
              </Button>
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
              <Button onClick={onLogout} variant="outline" size="sm">
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column - Account Overview */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Account Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {accounts.map((account) => (
                <Card 
                  key={account.id} 
                  className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
                    selectedAccount === account.id ? 'ring-2 ring-yellow-500 shadow-lg' : ''
                  }`}
                  onClick={() => setSelectedAccount(account.id)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm font-medium text-gray-600">{account.name}</CardTitle>
                      <CreditCard className="h-4 w-4 text-gray-400" />
                    </div>
                    <CardDescription className="text-xs">{account.accountNumber}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-2xl font-bold text-gray-900">
                          {showBalance ? formatCurrency(account.balance) : '••••••'}
                        </p>
                        <p className="text-xs text-gray-500">{account.type}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowBalance(!showBalance);
                        }}
                      >
                        {showBalance ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Manage your banking needs</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Button className="h-20 flex-col space-y-2 bg-yellow-600 hover:bg-yellow-700">
                    <Send className="h-6 w-6" />
                    <span className="text-sm">Transfer</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex-col space-y-2">
                    <Receipt className="h-6 w-6" />
                    <span className="text-sm">Pay Bills</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex-col space-y-2">
                    <Download className="h-6 w-6" />
                    <span className="text-sm">Statements</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex-col space-y-2">
                    <Plus className="h-6 w-6" />
                    <span className="text-sm">New Account</span>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Recent Transactions */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Recent Transactions</CardTitle>
                    <CardDescription>
                      {selectedAccountData?.name} - {selectedAccountData?.accountNumber}
                    </CardDescription>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Search transactions..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 w-64"
                      />
                    </div>
                    <Button variant="outline" size="sm">
                      <Filter className="h-4 w-4 mr-2" />
                      Filter
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredTransactions.map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex items-center space-x-4">
                        <div className={`p-2 rounded-full ${
                          transaction.type === 'credit' ? 'bg-green-100' : 'bg-red-100'
                        }`}>
                          {transaction.type === 'credit' ? 
                            <ArrowDownLeft className="h-4 w-4 text-green-600" /> : 
                            <ArrowUpRight className="h-4 w-4 text-red-600" />
                          }
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{transaction.description}</p>
                          <div className="flex items-center space-x-2 text-sm text-gray-500">
                            <span>{transaction.date}</span>
                            <Badge variant="secondary" className="text-xs">{transaction.category}</Badge>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`font-semibold ${
                          transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {transaction.type === 'credit' ? '+' : ''}{formatCurrency(transaction.amount)}
                        </p>
                        <p className="text-sm text-gray-500">
                          Balance: {formatCurrency(transaction.balance)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Summary & Tools */}
          <div className="space-y-6">
            
            {/* Total Balance */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <DollarSign className="h-5 w-5 text-yellow-600" />
                  <span>Total Balance</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-gray-900">
                  {showBalance ? formatCurrency(totalBalance) : '••••••••'}
                </p>
                <div className="flex items-center space-x-2 mt-2">
                  <TrendingUp className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-green-600">+2.5% this month</span>
                </div>
              </CardContent>
            </Card>

            {/* Banking Services */}
            <Card>
              <CardHeader>
                <CardTitle>Banking Services</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <PiggyBank className="h-4 w-4 mr-3" />
                  Investment Portfolio
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Building className="h-4 w-4 mr-3" />
                  Loan Applications
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <CreditCard className="h-4 w-4 mr-3" />
                  Credit Cards
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Smartphone className="h-4 w-4 mr-3" />
                  Mobile Banking
                </Button>
              </CardContent>
            </Card>

            {/* Support */}
            <Card>
              <CardHeader>
                <CardTitle>Need Help?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full">
                  Contact Support
                </Button>
                <Button variant="outline" className="w-full">
                  Schedule Appointment
                </Button>
                <Button variant="outline" className="w-full">
                  FAQ & Help
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
