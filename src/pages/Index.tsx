import { useState } from 'react';
import { useBankingStore } from '@/lib/bankingStore';
import { HomePage } from '@/components/homepage/HomePage';
import { PersonalLogin } from '@/components/auth/PersonalLogin';
import { BusinessLogin } from '@/components/auth/BusinessLogin';
import { CorporateLogin } from '@/components/auth/CorporateLogin';
import { Dashboard } from '@/components/dashboard/Dashboard';
import { TransferForm } from '@/components/transfers/TransferForm';
import { TransactionsPage } from '@/components/transactions/TransactionsPage';
import { AIChat } from '@/components/ai/AIChat';
import { AccountType } from '@/types/accountTypes';

type AppView = 'home' | 'login' | 'dashboard' | 'transfer' | 'transactions' | 'ai-chat';
type LoginType = AccountType | null;

const Index = () => {
  const isAuthenticated = useBankingStore((state) => state.isAuthenticated);
  const [currentView, setCurrentView] = useState<AppView>('home');
  const [loginType, setLoginType] = useState<LoginType>(null);

  const handleAccountLogin = (accountType: string) => {
    setLoginType(accountType as AccountType);
    setCurrentView('login');
  };

  const handleLoginSuccess = () => {
    setCurrentView('dashboard');
    setLoginType(null);
  };

  const handleBackToHome = () => {
    setCurrentView('home');
    setLoginType(null);
  };

  // If not authenticated, show homepage or login
  if (!isAuthenticated) {
    if (currentView === 'home') {
      return <HomePage onAccountLogin={handleAccountLogin} />;
    }
    
    if (currentView === 'login' && loginType) {
      const LoginComponent = {
        personal: PersonalLogin,
        business: BusinessLogin,
        corporate: CorporateLogin,
        private: CorporateLogin, // Use corporate login for private banking
      }[loginType];

      return (
        <LoginComponent
          onBack={handleBackToHome}
          onSwitchToRegister={() => {}}
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
