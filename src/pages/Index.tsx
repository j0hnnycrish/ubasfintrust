import { useState } from 'react';
import { useBankingStore } from '@/lib/bankingStore';
import { AuthPage } from '@/components/auth/AuthPage';
import { Dashboard } from '@/components/dashboard/Dashboard';
import { TransferForm } from '@/components/transfers/TransferForm';
import { TransactionsPage } from '@/components/transactions/TransactionsPage';
import { AIChat } from '@/components/ai/AIChat';

type AppView = 'dashboard' | 'transfer' | 'transactions' | 'ai-chat';

const Index = () => {
  const isAuthenticated = useBankingStore((state) => state.isAuthenticated);
  const [currentView, setCurrentView] = useState<AppView>('dashboard');

  if (!isAuthenticated) {
    return <AuthPage />;
  }

  const renderView = () => {
    switch (currentView) {
      case 'transfer':
        return (
          <TransferForm
            onBack={() => setCurrentView('dashboard')}
            onSuccess={() => setCurrentView('dashboard')}
          />
        );
      case 'transactions':
        return (
          <TransactionsPage
            onBack={() => setCurrentView('dashboard')}
          />
        );
      case 'ai-chat':
        return (
          <AIChat
            onBack={() => setCurrentView('dashboard')}
          />
        );
      default:
        return (
          <Dashboard
            onTransfer={() => setCurrentView('transfer')}
            onViewTransactions={() => setCurrentView('transactions')}
            onAIChat={() => setCurrentView('ai-chat')}
          />
        );
    }
  };

  return renderView();
};

export default Index;
