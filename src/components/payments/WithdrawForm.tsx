import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { paymentAPI } from '@/lib/api';
import { useBankingStore } from '@/lib/bankingStore';
import { toast } from 'sonner';
import { Loader2, ArrowUpRight, Building2 } from 'lucide-react';

interface WithdrawFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

interface Bank {
  code: string;
  name: string;
}

const WithdrawForm: React.FC<WithdrawFormProps> = ({ onSuccess, onCancel }) => {
  const { accounts, fetchAccounts } = useBankingStore();
  
  const [isLoading, setIsLoading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [amount, setAmount] = useState('');
  const [selectedAccount, setSelectedAccount] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [bankCode, setBankCode] = useState('');
  const [accountName, setAccountName] = useState('');
  const [banks, setBanks] = useState<Bank[]>([]);
  const [verifiedAccount, setVerifiedAccount] = useState<any>(null);

  // Fetch banks on component mount
  useEffect(() => {
    const fetchBanks = async () => {
      try {
        const response = await paymentAPI.getBanks();
        if (response.success && response.data) {
          setBanks(response.data);
        }
      } catch (error) {
        console.error('Failed to fetch banks:', error);
      }
    };

    fetchBanks();
  }, []);

  // Verify account details when account number and bank code are provided
  useEffect(() => {
    const verifyAccount = async () => {
      if (accountNumber.length === 10 && bankCode) {
        setIsVerifying(true);
        try {
          const response = await paymentAPI.verifyAccount(accountNumber, bankCode);
          if (response.success && response.data) {
            setVerifiedAccount(response.data);
            setAccountName(response.data.accountName);
          }
        } catch (error) {
          console.error('Account verification failed:', error);
          setVerifiedAccount(null);
          setAccountName('');
        } finally {
          setIsVerifying(false);
        }
      } else {
        setVerifiedAccount(null);
        setAccountName('');
      }
    };

    verifyAccount();
  }, [accountNumber, bankCode]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!selectedAccount) {
      toast.error('Please select an account');
      return;
    }

    if (!amount || parseFloat(amount) < 100) {
      toast.error('Minimum withdrawal amount is ₦100');
      return;
    }

    if (!verifiedAccount) {
      toast.error('Please verify the recipient account details');
      return;
    }

    const selectedAccountData = accounts.find(acc => acc.id === selectedAccount);
    if (!selectedAccountData) {
      toast.error('Selected account not found');
      return;
    }

    if (selectedAccountData.availableBalance < parseFloat(amount)) {
      toast.error('Insufficient funds');
      return;
    }

    setIsLoading(true);

    try {
      const response = await paymentAPI.createWithdrawal({
        accountId: selectedAccount,
        amount: parseFloat(amount),
        bankDetails: {
          accountNumber,
          bankCode,
          accountName: verifiedAccount.accountName,
        },
      });

      if (response.success) {
        toast.success('Withdrawal request submitted successfully!');
        await fetchAccounts(); // Refresh account balances
        onSuccess?.();
      } else {
        throw new Error(response.message || 'Withdrawal failed');
      }
    } catch (error: any) {
      toast.error(error.message || 'Withdrawal failed');
    } finally {
      setIsLoading(false);
    }
  };

  const selectedAccountData = accounts.find(acc => acc.id === selectedAccount);

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ArrowUpRight className="h-5 w-5" />
          Withdraw Funds
        </CardTitle>
        <CardDescription>
          Transfer money from your account to another bank
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Account Selection */}
          <div className="space-y-2">
            <Label htmlFor="account">From Account</Label>
            <Select value={selectedAccount} onValueChange={setSelectedAccount}>
              <SelectTrigger>
                <SelectValue placeholder="Choose account" />
              </SelectTrigger>
              <SelectContent>
                {accounts.map((account) => (
                  <SelectItem key={account.id} value={account.id}>
                    {account.accountType} - {account.accountNumber}
                    <span className="ml-2 text-sm text-muted-foreground">
                      ₦{account.availableBalance.toLocaleString()}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedAccountData && (
              <p className="text-xs text-muted-foreground">
                Available: ₦{selectedAccountData.availableBalance.toLocaleString()}
              </p>
            )}
          </div>

          {/* Amount Input */}
          <div className="space-y-2">
            <Label htmlFor="amount">Amount</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-sm text-muted-foreground">
                ₦
              </span>
              <Input
                id="amount"
                type="number"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="pl-8"
                min="100"
                step="0.01"
                max={selectedAccountData?.availableBalance || undefined}
                required
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Minimum withdrawal: ₦100
            </p>
          </div>

          {/* Bank Selection */}
          <div className="space-y-2">
            <Label htmlFor="bank">Recipient Bank</Label>
            <Select value={bankCode} onValueChange={setBankCode}>
              <SelectTrigger>
                <SelectValue placeholder="Select bank" />
              </SelectTrigger>
              <SelectContent>
                {banks.map((bank) => (
                  <SelectItem key={bank.code} value={bank.code}>
                    {bank.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Account Number Input */}
          <div className="space-y-2">
            <Label htmlFor="accountNumber">Account Number</Label>
            <Input
              id="accountNumber"
              type="text"
              placeholder="0123456789"
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
              maxLength={10}
              required
            />
            {isVerifying && (
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <Loader2 className="h-3 w-3 animate-spin" />
                Verifying account...
              </p>
            )}
          </div>

          {/* Account Name Display */}
          {verifiedAccount && (
            <div className="space-y-2">
              <Label>Account Name</Label>
              <div className="p-3 bg-muted rounded-md">
                <p className="font-medium">{verifiedAccount.accountName}</p>
                <p className="text-sm text-muted-foreground">{verifiedAccount.bankName}</p>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading || !verifiedAccount}
              className="flex-1"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Building2 className="mr-2 h-4 w-4" />
                  Withdraw ₦{amount || '0'}
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default WithdrawForm;
