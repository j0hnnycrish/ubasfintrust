import { Account } from '@/types/banking';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useBankingStore } from '@/lib/bankingStore';
import { CreditCard, Eye, EyeOff, TrendingUp, Wallet } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

interface AccountCardProps {
  account: Account;
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
    switch (account.accountType) {
      case 'checking':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'savings':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'business':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'investment':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <Card className="relative overflow-hidden bg-gradient-card border-banking-gold/20 shadow-card-banking hover:shadow-elegant transition-all duration-300">
      <div className="absolute top-0 right-0 w-24 h-24 bg-banking-gold/10 rounded-full -translate-y-12 translate-x-12"></div>
      
      <CardHeader className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-banking-gold/10 rounded-lg text-banking-gold">
              {getAccountIcon()}
            </div>
            <div>
              <h3 className="font-semibold text-banking-dark">{getAccountTypeLabel()} Account</h3>
              <p className="text-sm text-banking-gray">****{account.accountNumber.slice(-4)}</p>
            </div>
          </div>
          
          <Badge className={getAccountTypeColor()}>
            {account.isActive ? 'Active' : 'Inactive'}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm text-banking-gray">Available Balance</p>
            <div className="flex items-center space-x-2">
              {showBalance ? (
                <span className="text-2xl font-bold text-banking-dark">
                  {formatCurrency(account.balance)}
                </span>
              ) : (
                <span className="text-2xl font-bold text-banking-dark">••••••</span>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowBalance(!showBalance)}
                className="p-1 h-auto hover:bg-banking-gold/10"
              >
                {showBalance ? (
                  <EyeOff className="h-4 w-4 text-banking-gray" />
                ) : (
                  <Eye className="h-4 w-4 text-banking-gray" />
                )}
              </Button>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-banking-gold/20">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-banking-gray">Account Number</p>
              <p className="font-medium text-banking-dark">{account.accountNumber}</p>
            </div>
            <div>
              <p className="text-banking-gray">Last Activity</p>
              <p className="font-medium text-banking-dark">
                {account.lastActivity.toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}