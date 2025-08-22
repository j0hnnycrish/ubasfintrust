import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AccountOverview } from './AccountOverview';
import { AccountsView } from './AccountsView';
import { TransactionsView } from './TransactionsView';
import { TransfersView } from './TransfersView';
import { SettingsView } from './SettingsView';
import { TransferModal } from '../banking/TransferModal';
import { BillPayModal } from '../banking/BillPayModal';
import { DepositModal } from '../banking/DepositModal';
import { InvestmentModal } from '../banking/InvestmentModal';
import { useAuth } from '@/contexts/AuthContext';
import { useAdmin } from '@/contexts/AdminContext';
import { UBASLogoCompact } from '@/components/ui/UBASLogo';

import { 
  Bell,
  Settings,
  LogOut,
  User,
  Menu,
  X,
  Home,
  FileText,
  Smartphone,
  HelpCircle,
  ArrowUpRight,
  ArrowDownLeft,
  Clock,
  CheckCircle,
  AlertTriangle,
  CreditCard,
  PiggyBank,
  TrendingUp,
  Shield,
  Download
} from 'lucide-react';

interface ComprehensiveDashboardProps {
  onLogout: () => void;
}

export function ComprehensiveDashboard({ onLogout }: ComprehensiveDashboardProps) {
  const { user, logout } = useAuth();
  const { customers, transactions } = useAdmin();
  const [activeTab, setActiveTab] = useState('overview');
  const [showBalances, setShowBalances] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [showBillPayModal, setShowBillPayModal] = useState(false);
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [showInvestmentModal, setShowInvestmentModal] = useState(false);

  const handleLogout = () => {
    logout();
    onLogout();
  };

  const navigationItems = [
    { id: 'overview', label: 'Overview', icon: Home },
    { id: 'accounts', label: 'Accounts', icon: CreditCard },
    { id: 'transactions', label: 'Transactions', icon: FileText },
    { id: 'transfers', label: 'Transfers', icon: ArrowUpRight },
    { id: 'investments', label: 'Investments', icon: TrendingUp },
    { id: 'statements', label: 'Statements', icon: Download },
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'help', label: 'Help & Support', icon: HelpCircle }
  ];

  // Get real transactions for the current user
  const getUserTransactions = () => {
    if (!user) return [];

    const customer = customers.find(c => c.username === user.username);
    if (!customer) return [];

    // Get transactions for this customer's accounts
    const customerAccountIds = customer.accounts.map(acc => acc.id);
    return transactions
      .filter(txn => customerAccountIds.includes(txn.accountId))
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 10); // Get latest 10 transactions
  };

  const recentTransactions = getUserTransactions();

  const alerts = [
    {
      id: '1',
      type: 'info' as const,
      title: 'Account Statement Ready',
      message: 'Your December statement is now available for download.',
      date: '2024-01-15'
    },
    {
      id: '2',
      type: 'warning' as const,
      title: 'Low Balance Alert',
      message: 'Your checking account balance is below $500.',
      date: '2024-01-14'
    },
    {
      id: '3',
      type: 'success' as const,
      title: 'Payment Processed',
      message: 'Your credit card payment of $1,250 has been processed.',
      date: '2024-01-13'
    }
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'warning': return AlertTriangle;
      case 'success': return CheckCircle;
      default: return Bell;
    }
  };

  const getAlertColor = (type: string) => {
    switch (type) {
      case 'warning': return 'text-yellow-700 bg-yellow-50 border-yellow-200';
      case 'success': return 'text-red-700 bg-red-50 border-red-200';
      default: return 'text-red-700 bg-red-50 border-red-200';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden mr-2"
              >
                <Menu className="h-5 w-5" />
              </Button>
              <UBASLogoCompact width={120} height={32} className="mr-3" />
            </div>
            
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm">
                <Bell className="h-5 w-5" />
              </Button>
              <div className="flex items-center space-x-2">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{user?.fullName}</p>
                  <p className="text-xs text-gray-500 capitalize">{user?.accountType} Banking</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Navigation */}
          <div className={`lg:w-64 ${sidebarOpen ? 'block' : 'hidden lg:block'}`}>
            <Card>
              <CardContent className="p-0">
                <nav className="space-y-1">
                  {navigationItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.id}
                        onClick={() => setActiveTab(item.id)}
                        className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-none first:rounded-t-lg last:rounded-b-lg transition-colors ${
                          activeTab === item.id
                            ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                        }`}
                      >
                        <Icon className="mr-3 h-5 w-5" />
                        {item.label}
                      </button>
                    );
                  })}
                </nav>
              </CardContent>
            </Card>

          </div>

          {/* Main Content */}
          <div className="flex-1">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-gray-900">Account Overview</h2>
                  <Badge variant="outline" className="text-green-600 border-green-200">
                    <Shield className="h-3 w-3 mr-1" />
                    Secure Session
                  </Badge>
                </div>

                <AccountOverview
                  showBalances={showBalances}
                  onToggleBalances={() => setShowBalances(!showBalances)}
                  onTransferClick={() => setShowTransferModal(true)}
                />

                {/* Recent Transactions */}
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Transactions</CardTitle>
                    <CardDescription>Your latest account activity</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recentTransactions.slice(0, 5).map((transaction) => (
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
                              {transaction.type === 'credit' ? '+' : '-'}{formatCurrency(Math.abs(transaction.amount))}
                            </p>
                            <Badge 
                              variant={transaction.status === 'completed' ? 'default' : 'secondary'}
                              className="text-xs"
                            >
                              {transaction.status}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 text-center">
                      <Button variant="outline">View All Transactions</Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Alerts & Notifications */}
                <Card>
                  <CardHeader>
                    <CardTitle>Alerts & Notifications</CardTitle>
                    <CardDescription>Important updates about your accounts</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {alerts.map((alert) => {
                        const Icon = getAlertIcon(alert.type);
                        return (
                          <div key={alert.id} className={`p-4 rounded-lg border ${getAlertColor(alert.type)}`}>
                            <div className="flex items-start space-x-3">
                              <Icon className="h-5 w-5 mt-0.5" />
                              <div className="flex-1">
                                <h4 className="font-medium">{alert.title}</h4>
                                <p className="text-sm mt-1">{alert.message}</p>
                                <p className="text-xs mt-2 opacity-75">{alert.date}</p>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === 'accounts' && <AccountsView />}
            {activeTab === 'transactions' && <TransactionsView />}
            {activeTab === 'transfers' && <TransfersView />}
            {activeTab === 'investments' && (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Investment Portfolio</h3>
                <p className="text-gray-500 mb-6">Investment features coming soon</p>
                <Button variant="outline">Contact Investment Advisor</Button>
              </div>
            )}
            {activeTab === 'statements' && (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Download className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Account Statements</h3>
                <p className="text-gray-500 mb-6">Statement download features coming soon</p>
                <Button variant="outline">Request Statement</Button>
              </div>
            )}
            {activeTab === 'settings' && <SettingsView />}
            {activeTab === 'help' && (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <HelpCircle className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Help & Support</h3>
                <p className="text-gray-500 mb-6">24/7 customer support available</p>
                <Button variant="outline">Contact Support</Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Transfer Modal */}
      <TransferModal
        isOpen={showTransferModal}
        onClose={() => setShowTransferModal(false)}
        onSuccess={() => {
          // Refresh account data or show success message
          console.log('Transfer completed successfully');
        }}
      />

      {/* Bill Pay Modal */}
      <BillPayModal
        isOpen={showBillPayModal}
        onClose={() => setShowBillPayModal(false)}
        onSuccess={() => {
          console.log('Bill payment completed successfully');
        }}
      />

      {/* Deposit Modal */}
      <DepositModal
        isOpen={showDepositModal}
        onClose={() => setShowDepositModal(false)}
        onSuccess={() => {
          console.log('Deposit completed successfully');
        }}
      />

      {/* Investment Modal */}
      <InvestmentModal
        isOpen={showInvestmentModal}
        onClose={() => setShowInvestmentModal(false)}
        onSuccess={() => {
          console.log('Investment completed successfully');
        }}
      />
    </div>
  );
}
