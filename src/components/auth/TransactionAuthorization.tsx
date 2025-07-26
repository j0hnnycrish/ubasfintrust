import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Shield, Lock, AlertTriangle, CheckCircle, Clock } from 'lucide-react';

interface TransactionDetails {
  amount: number;
  currency: string;
  recipient: string;
  accountNumber: string;
  description: string;
  type: 'transfer' | 'payment' | 'withdrawal';
}

interface TransactionAuthorizationProps {
  transaction: TransactionDetails;
  onAuthorize: (authCode: string) => void;
  onCancel: () => void;
}

export function TransactionAuthorization({ 
  transaction, 
  onAuthorize, 
  onCancel 
}: TransactionAuthorizationProps) {
  const [authCode, setAuthCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes
  const { toast } = useToast();

  // Countdown timer
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      toast({
        title: 'Session Expired',
        description: 'Transaction authorization has expired. Please try again.',
        variant: 'destructive',
      });
      onCancel();
    }
  }, [timeLeft, onCancel, toast]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatAmount = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Simulate authorization process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Validate authorization code format
      if (authCode.length === 6 && /^\d{6}$/.test(authCode)) {
        toast({
          title: 'Transaction Authorized',
          description: 'Your transaction has been successfully authorized.',
        });
        onAuthorize(authCode);
      } else {
        toast({
          title: 'Invalid Authorization Code',
          description: 'Please enter a valid 6-digit authorization code.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Authorization Failed',
        description: 'An error occurred during authorization. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getTransactionIcon = () => {
    switch (transaction.type) {
      case 'transfer':
        return '💸';
      case 'payment':
        return '💳';
      case 'withdrawal':
        return '🏧';
      default:
        return '💰';
    }
  };

  const getTransactionTypeLabel = () => {
    switch (transaction.type) {
      case 'transfer':
        return 'Money Transfer';
      case 'payment':
        return 'Bill Payment';
      case 'withdrawal':
        return 'Cash Withdrawal';
      default:
        return 'Transaction';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg shadow-2xl border-orange-200 bg-white/95 backdrop-blur-sm">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-orange-100 rounded-full">
              <Lock className="h-8 w-8 text-orange-600" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-orange-900">
            Transaction Authorization Required
          </CardTitle>
          <CardDescription className="text-orange-600">
            Please authorize this transaction to proceed
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Security Warning */}
          <div className="flex items-start space-x-3 p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-amber-800">Security Notice</p>
              <p className="text-amber-700">
                Never share your authorization code with anyone. UBAS Financial Trust will never ask for this code.
              </p>
            </div>
          </div>

          {/* Transaction Details */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg border">
              <div className="text-2xl">{getTransactionIcon()}</div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">{getTransactionTypeLabel()}</h3>
                <p className="text-sm text-gray-600">{transaction.description}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Amount</Label>
                <p className="text-2xl font-bold text-green-600">
                  {formatAmount(transaction.amount, transaction.currency)}
                </p>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Recipient</Label>
                <p className="font-medium text-gray-900">{transaction.recipient}</p>
                <p className="text-sm text-gray-600">{transaction.accountNumber}</p>
              </div>
            </div>
          </div>

          {/* Authorization Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="authCode" className="text-orange-900 font-medium">
                Enter Transaction Authorization Code
              </Label>
              <Input
                id="authCode"
                type="text"
                placeholder="000000"
                value={authCode}
                onChange={(e) => setAuthCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                className="text-center text-2xl tracking-widest border-orange-200 focus:border-orange-500 focus:ring-orange-500"
                maxLength={6}
                required
              />
              <p className="text-xs text-gray-600">
                Check your registered email or SMS for the authorization code
              </p>
            </div>

            {/* Timer */}
            <div className="flex items-center justify-center space-x-2 text-sm text-orange-700 bg-orange-50 p-3 rounded-lg">
              <Clock className="h-4 w-4" />
              <span>Session expires in {formatTime(timeLeft)}</span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Button 
                type="button"
                variant="outline"
                className="border-gray-300 text-gray-700 hover:bg-gray-50"
                onClick={onCancel}
                disabled={isLoading}
              >
                Cancel Transaction
              </Button>
              <Button 
                type="submit" 
                className="bg-orange-600 hover:bg-orange-700 text-white"
                disabled={isLoading || authCode.length !== 6}
              >
                {isLoading ? 'Authorizing...' : 'Authorize Transaction'}
              </Button>
            </div>
          </form>



          {/* Security Features */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-xs text-gray-600">
              <Shield className="h-3 w-3" />
              <span>256-bit SSL encryption</span>
            </div>
            <div className="flex items-center space-x-2 text-xs text-gray-600">
              <Shield className="h-3 w-3" />
              <span>Multi-factor authentication</span>
            </div>
            <div className="flex items-center space-x-2 text-xs text-gray-600">
              <Shield className="h-3 w-3" />
              <span>Real-time fraud monitoring</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
