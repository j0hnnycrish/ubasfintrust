import { useState } from 'react';
import { useBankingStore } from '@/lib/bankingStore';
import { AccountCard } from './AccountCard';
import { QuickActions } from './QuickActions';
import { TransactionHistory } from './TransactionHistory';
import { Button } from '@/components/ui/button';
import { LogOut, Settings, Bell, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import bankingLogo from '@/assets/banking-logo.jpg';

interface DashboardProps {
  onTransfer: () => void;
  onViewTransactions: () => void;
  onAIChat: () => void;
}

export function Dashboard({ onTransfer, onViewTransactions, onAIChat }: DashboardProps) {
  const { user, accounts, logout, formatCurrency } = useBankingStore();
  const [searchQuery, setSearchQuery] = useState('');

  const totalBalance = accounts.reduce((sum, account) => sum + account.balance, 0);

  return (
    <div className="min-h-screen bg-banking-bg">
      {/* Header */}
      <header className="bg-white border-b border-banking-gold/20 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo and Brand */}
            <div className="flex items-center space-x-4">
              <img 
                src={bankingLogo} 
                alt="Providus Bank" 
                className="w-10 h-10 rounded-full shadow-md"
              />
              <div>
                <h1 className="text-xl font-bold text-banking-dark">Providus Bank</h1>
                <p className="text-xs text-banking-gray">AI Banking Simulation</p>
              </div>
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
              <Button variant="ghost" size="sm">
                <Bell className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Settings className="h-4 w-4" />
              </Button>
              <div className="flex items-center space-x-3">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-medium text-banking-dark">
                    {user?.firstName} {user?.lastName}
                  </p>
                  <p className="text-xs text-banking-gray">{user?.email}</p>
                </div>
                <Button
                  variant="banking-outline"
                  size="sm"
                  onClick={logout}
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
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="bg-gradient-banking rounded-xl p-6 text-banking-dark shadow-banking">
            <h2 className="text-2xl font-bold mb-2">
              Welcome back, {user?.firstName}!
            </h2>
            <p className="text-lg opacity-90">
              Your total balance: <span className="font-bold">{formatCurrency(totalBalance)}</span>
            </p>
            <p className="text-sm opacity-75 mt-2">
              Last login: {new Date().toLocaleDateString()} • All systems operational
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
    </div>
  );
}