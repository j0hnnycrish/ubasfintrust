import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useBankingData } from '@/hooks/useBankingData';
import { AccountCard } from './AccountCard';
import { QuickActions } from './QuickActions';
import { TransactionHistory } from './TransactionHistory';
import { EnhancedTransactionHistory } from './EnhancedTransactionHistory';
import { EnhancedBillPayment } from '@/components/banking/EnhancedBillPayment';
import { NotificationBell } from '@/components/notifications/NotificationBell';
import { KYCManager } from '@/components/kyc/KYCManager';
import { AdvancedTransactionHistory } from '@/components/transactions/AdvancedTransactionHistory';
import { BillPaymentSystem } from '@/components/payments/BillPaymentSystem';
import { AccountManagement } from '@/components/account/AccountManagement';
import { AccountProfile } from '@/components/profile/AccountProfile';
import { AnalyticsDashboard } from '@/components/analytics/AnalyticsDashboard';
import { UBASLogoCompact } from '@/components/ui/UBASLogo';
import { Button } from '@/components/ui/button';
import {
  User,
  CreditCard,
  PiggyBank,
  Receipt,
  Shield,
  Bell,
  LogOut,
  Settings,
  ChevronDown,
  TrendingUp,
  BarChart3,
  Search,
} from 'lucide-react';
import { Input } from '@/components/ui/input';

interface DashboardProps {
  onTransfer: () => void;
  onViewTransactions: () => void;
  onAIChat: () => void;
  onBillPay: () => void;
  onDeposit: () => void;
  onInvest: () => void;
  onLogout: () => void;
}

export function Dashboard({ onTransfer, onViewTransactions, onAIChat, onBillPay, onDeposit, onInvest, onLogout }: DashboardProps) {
  const { user } = useAuth();
  const { accounts, totalBalance, formatCurrency, isLoading } = useBankingData();
  const [searchQuery, setSearchQuery] = useState('');
    const [currentView, setCurrentView] = useState<'dashboard' | 'transactions' | 'payments' | 'account' | 'profile' | 'analytics'>('dashboard');

  const handleKYCView = () => setCurrentView('dashboard'); // KYC is integrated into dashboard
  const handleTransactionsView = () => setCurrentView('transactions');
  const handleBillsView = () => setCurrentView('payments');
  const handleAccountView = () => setCurrentView('account');
  const handleProfileView = () => setCurrentView('profile');
  const handleAnalyticsView = () => setCurrentView('analytics');
  const handleBackToDashboard = () => setCurrentView('dashboard');

  if (isLoading) {
    return (
      <div className="min-h-screen bg-banking-bg flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-banking-gold mx-auto mb-4"></div>
          <p className="text-banking-dark">Loading your banking data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-banking-bg">
      {/* Header */}
      <header className="bg-white border-b border-banking-gold/20 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo and Brand */}
            <div className="flex items-center space-x-4">
              <UBASLogoCompact width={160} height={40} className="hover:opacity-90 transition-opacity" />
            </div>

            {/* Search */}
            <div className="hidden md:flex items-center space-x-4 flex-1 max-w-md mx-8">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-banking-gray" />
                <Input
                  placeholder="Search transactions, accounts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 border-banking-gold/20 focus:border-banking-gold"
                />
              </div>
            </div>

            {/* User menu */}
            <div className="flex items-center space-x-4">
              <NotificationBell />
              <Button variant="ghost" size="sm" onClick={handleBillsView} title="Enhanced Bill Payment">
                <CreditCard className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={handleTransactionsView} title="Enhanced Transaction History">
                <Receipt className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={handleKYCView} title="Identity Verification">
                <Shield className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={handleProfileView} title="User Profile">
                <User className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={handleAccountView} title="Account Settings">
                <Settings className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={handleAnalyticsView} title="Analytics Dashboard">
                <BarChart3 className="h-4 w-4" />
              </Button>
              <div className="flex items-center space-x-3">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-medium text-banking-dark">
                    {user?.fullName || user?.username}
                  </p>
                  <p className="text-xs text-banking-gray">{user?.email}</p>
                </div>
                <Button
                  variant="banking-outline"
                  size="sm"
                  onClick={onLogout}
                  className="flex items-center space-x-2"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="hidden sm:inline">Logout</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      {currentView === 'transactions' ? (
        <AdvancedTransactionHistory onBack={handleBackToDashboard} />
      ) : currentView === 'payments' ? (
        <BillPaymentSystem onBack={handleBackToDashboard} />
      ) : currentView === 'analytics' ? (
        <AnalyticsDashboard onBack={handleBackToDashboard} />
      ) : (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="bg-gradient-banking rounded-xl p-6 text-banking-dark shadow-banking">
            <h2 className="text-2xl font-bold mb-2">
              Welcome back, {user?.fullName?.split(' ')[0] || user?.username}!
            </h2>
            <p className="text-lg opacity-90">
              Your total balance: <span className="font-bold">{formatCurrency(totalBalance)}</span>
            </p>
            <p className="text-sm opacity-75 mt-2">
              Last login: {new Date().toLocaleDateString()} • Secure banking environment
            </p>
          </div>
        </div>

        {/* Accounts Grid */}
        <div className="mb-8">
          <h3 className="text-xl font-bold text-banking-dark mb-4">Your Accounts</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {accounts.map((account) => (
              <AccountCard key={account.id} account={account} />
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <QuickActions
            onTransfer={onTransfer}
            onViewTransactions={onViewTransactions}
            onAIChat={onAIChat}
            onBillPay={onBillPay}
            onDeposit={onDeposit}
            onInvest={onInvest}
            onAnalytics={handleAnalyticsView}
          />
        </div>

        {/* Recent Transactions */}
        {accounts.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {accounts.slice(0, 2).map((account) => (
              <TransactionHistory
                key={account.id}
                accountId={account.id}
                limit={3}
              />
            ))}
          </div>
        )}
        </main>
      )}

      {/* Account Management View */}
      {currentView === 'account' && (
        <AccountManagement onBack={handleBackToDashboard} />
      )}

      {/* Profile View */}
      {currentView === 'profile' && (
        <div className="max-w-4xl mx-auto p-6">
          <div className="mb-6">
            <Button variant="ghost" onClick={handleBackToDashboard} className="mb-4">
              ← Back to Dashboard
            </Button>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">User Profile</h1>
            <p className="text-gray-600">Manage your personal information and account details</p>
          </div>
          <AccountProfile />
        </div>
      )}
    </div>
  );
}