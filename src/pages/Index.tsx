import { useState } from 'react';
import { useBankingStore } from '@/lib/bankingStore';
import { HomePage } from '@/components/homepage/HomePage';
import { ProfessionalLogin } from '@/components/auth/ProfessionalLogin';
import { KYCRegistration } from '@/components/auth/KYCRegistration';
import { Dashboard } from '@/components/dashboard/Dashboard';
import { TransferForm } from '@/components/transfers/TransferForm';
import { TransactionsPage } from '@/components/transactions/TransactionsPage';
import { AIChat } from '@/components/ai/AIChat';
import { AccountType } from '@/types/accountTypes';

type AppView = 'home' | 'login' | 'register' | 'dashboard' | 'transfer' | 'transactions' | 'ai-chat';

const Index = () => {
  const isAuthenticated = useBankingStore((state) => state.isAuthenticated);
  const [currentView, setCurrentView] = useState<AppView>('home');

  const handleAccountLogin = () => {
    setCurrentView('login');
  };

  const handleSwitchToRegister = () => {
    setCurrentView('register');
  };

  const handleLoginSuccess = () => {
    setCurrentView('dashboard');
  };

  const handleRegistrationComplete = () => {
    setCurrentView('home');
  };

  const handleBackToHome = () => {
    setCurrentView('home');
  };

  // If not authenticated, show homepage, login, or registration
  if (!isAuthenticated) {
    if (currentView === 'home') {
      return <HomePage onAccountLogin={handleAccountLogin} />;
    }

    if (currentView === 'login') {
      return (
        <ProfessionalLogin
          onBack={handleBackToHome}
          onSwitchToRegister={handleSwitchToRegister}
        />
      );
    }

    if (currentView === 'register') {
      return (
        <KYCRegistration
          onBack={handleBackToHome}
          onComplete={handleRegistrationComplete}
        />
      );
    }

    return <HomePage onAccountLogin={handleAccountLogin} />;
  }

  // Authenticated user views
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
            onLogout={handleBackToHome}
          />
        );
    }
  };

  return renderView();
};

export default Index;
