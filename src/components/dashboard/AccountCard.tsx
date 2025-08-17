import type { Account as StoreAccount } from '@/lib/bankingStore';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useBankingStore } from '@/lib/bankingStore';
import { CreditCard, Eye, EyeOff, TrendingUp, Wallet } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

interface AccountCardProps {
  account: StoreAccount;
}

export function AccountCard({ account }: AccountCardProps) {
  const [showBalance, setShowBalance] = useState(true);
  const formatCurrency = useBankingStore((state) => state.formatCurrency);

  const getAccountIcon = () => {
    switch (account.accountType) {
      case 'checking':
        return <Wallet className="h-5 w-5" />;
      case 'savings':
        return <TrendingUp className="h-5 w-5" />;
      case 'business':
        return <CreditCard className="h-5 w-5" />;
      case 'investment':
        return <TrendingUp className="h-5 w-5" />;
      default:
        return <Wallet className="h-5 w-5" />;
    }
  };

  const getAccountTypeLabel = () => {
    return account.accountType.charAt(0).toUpperCase() + account.accountType.slice(1);
  };

  const getAccountTypeColor = () => {
  // Unified brand red styling regardless of account type for consistent theme
  return 'bg-brand-100 text-brand-700 border-brand-200';
  };

  return (
    <Card className="relative overflow-hidden bg-white/80 backdrop-blur border border-brand-200 shadow-card-banking hover:shadow-elegant transition-all duration-300">
      <div className="absolute top-0 right-0 w-24 h-24 bg-brand-100 rounded-full -translate-y-12 translate-x-12"></div>
      
      <CardHeader className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-brand-100 rounded-lg text-brand-600">
              {getAccountIcon()}
            </div>
            <div>
              <h3 className="font-semibold text-brand-800">{getAccountTypeLabel()} Account</h3>
              <p className="text-sm text-brand-600">****{account.accountNumber.slice(-4)}</p>
            </div>
          </div>
          
          <Badge className={getAccountTypeColor()}>
            {account.status === 'active' ? 'Active' : 'Inactive'}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm text-brand-600">Available Balance</p>
            <div className="flex items-center space-x-2">
              {showBalance ? (
                <span className="text-2xl font-bold text-brand-800">
                  {formatCurrency(account.balance)}
                </span>
              ) : (
                <span className="text-2xl font-bold text-brand-800">••••••</span>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowBalance(!showBalance)}
                className="p-1 h-auto hover:bg-brand-100"
              >
                {showBalance ? (
                  <EyeOff className="h-4 w-4 text-brand-500" />
                ) : (
                  <Eye className="h-4 w-4 text-brand-500" />
                )}
              </Button>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-brand-200/60">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-brand-600">Account Number</p>
              <p className="font-medium text-brand-800">{account.accountNumber}</p>
            </div>
            <div>
              <p className="text-brand-600">Last Activity</p>
              <p className="font-medium text-brand-800">
                {new Date(account.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}