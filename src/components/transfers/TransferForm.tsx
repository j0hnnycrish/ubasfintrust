import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useBankingStore } from '@/lib/bankingStore';
import { ArrowLeft, Send, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface TransferFormProps {
  onBack: () => void;
  onSuccess: () => void;
}

export function TransferForm({ onBack, onSuccess }: TransferFormProps) {
  const [formData, setFormData] = useState({
    fromAccountId: '',
    toAccountNumber: '',
    amount: '',
    description: '',
    recipientName: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const { accounts, transferFunds, formatCurrency, getAccountByNumber } = useBankingStore();
  const { toast } = useToast();

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.fromAccountId) {
      newErrors.fromAccountId = 'Please select a source account';
    }

    if (!formData.toAccountNumber) {
      newErrors.toAccountNumber = 'Please enter recipient account number';
    } else if (formData.toAccountNumber.length !== 10) {
      newErrors.toAccountNumber = 'Account number must be 10 digits';
    }

    if (!formData.amount) {
      newErrors.amount = 'Please enter an amount';
    } else {
      const amount = parseFloat(formData.amount);
      if (isNaN(amount) || amount <= 0) {
        newErrors.amount = 'Please enter a valid amount';
      } else {
        const sourceAccount = accounts.find(acc => acc.id === formData.fromAccountId);
        if (sourceAccount && amount > sourceAccount.balance) {
          newErrors.amount = 'Insufficient funds';
        }
      }
    }

    if (!formData.recipientName) {
      newErrors.recipientName = 'Please enter recipient name';
    }

    if (!formData.description) {
      newErrors.description = 'Please enter a description';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const result = await transferFunds({
        fromAccountId: formData.fromAccountId,
        toAccountNumber: formData.toAccountNumber,
        amount: parseFloat(formData.amount),
        description: formData.description,
        recipientName: formData.recipientName,
      });

      if (result.success) {
        toast({
          title: 'Transfer Successful',
          description: `${formatCurrency(parseFloat(formData.amount))} has been sent to ${formData.recipientName}`,
        });
        onSuccess();
      } else {
        toast({
          title: 'Transfer Failed',
          description: result.error || 'An error occurred during the transfer',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'An unexpected error occurred',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  const selectedAccount = accounts.find(acc => acc.id === formData.fromAccountId);
  const recipientAccount = formData.toAccountNumber ? getAccountByNumber(formData.toAccountNumber) : null;

  return (
  <div className="min-h-screen bg-gradient-to-b from-brand-50 via-white to-brand-50 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <Button
            variant="banking-outline"
            onClick={onBack}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          
          <h1 className="text-3xl font-bold text-brand-800">Transfer Funds</h1>
          <p className="text-brand-600 mt-2">Send money securely to another account</p>
        </div>

  <Card className="shadow-elegant bg-white/80 backdrop-blur border border-brand-200">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Send className="h-5 w-5 text-brand-600" />
              <span>New Transfer</span>
            </CardTitle>
            <CardDescription>
              Fill in the details below to send money to another account
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Source Account */}
              <div className="space-y-2">
                <Label htmlFor="fromAccount" className="text-brand-700 font-medium">
                  From Account
                </Label>
                <Select
                  value={formData.fromAccountId}
                  onValueChange={(value) => handleChange('fromAccountId', value)}
                >
                  <SelectTrigger className={`border-brand-200 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 ${errors.fromAccountId ? 'border-red-500' : ''}`}>
                    <SelectValue placeholder="Select source account" />
                  </SelectTrigger>
                  <SelectContent>
                    {accounts.map((account) => (
                      <SelectItem key={account.id} value={account.id}>
                        <div className="flex items-center justify-between w-full">
                          <span>{account.accountType.charAt(0).toUpperCase() + account.accountType.slice(1)} - ****{account.accountNumber.slice(-4)}</span>
                          <span className="ml-4 font-medium">{formatCurrency(account.balance)}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.fromAccountId && <p className="text-red-500 text-sm">{errors.fromAccountId}</p>}
                {selectedAccount && (
                  <p className="text-sm text-brand-600">
                    Available: {formatCurrency(selectedAccount.balance)}
                  </p>
                )}
              </div>

              {/* Recipient Account Number */}
              <div className="space-y-2">
                <Label htmlFor="toAccountNumber" className="text-brand-700 font-medium">
                  Recipient Account Number
                </Label>
                <Input
                  id="toAccountNumber"
                  placeholder="Enter 10-digit account number"
                  value={formData.toAccountNumber}
                  onChange={(e) => handleChange('toAccountNumber', e.target.value.replace(/\D/g, '').slice(0, 10))}
                  className={`border-brand-200 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 ${errors.toAccountNumber ? 'border-red-500' : ''}`}
                  maxLength={10}
                />
                {errors.toAccountNumber && <p className="text-red-500 text-sm">{errors.toAccountNumber}</p>}
                {recipientAccount && (
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      Account found: {recipientAccount.accountType.charAt(0).toUpperCase() + recipientAccount.accountType.slice(1)} Account
                    </AlertDescription>
                  </Alert>
                )}
              </div>

              {/* Recipient Name */}
              <div className="space-y-2">
                <Label htmlFor="recipientName" className="text-brand-700 font-medium">
                  Recipient Name
                </Label>
                <Input
                  id="recipientName"
                  placeholder="Enter recipient's full name"
                  value={formData.recipientName}
                  onChange={(e) => handleChange('recipientName', e.target.value)}
                  className={`border-brand-200 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 ${errors.recipientName ? 'border-red-500' : ''}`}
                />
                {errors.recipientName && <p className="text-red-500 text-sm">{errors.recipientName}</p>}
              </div>

              {/* Amount */}
              <div className="space-y-2">
                <Label htmlFor="amount" className="text-brand-700 font-medium">
                  Amount
                </Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="0.00"
                  value={formData.amount}
                  onChange={(e) => handleChange('amount', e.target.value)}
                  className={`border-brand-200 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 ${errors.amount ? 'border-red-500' : ''}`}
                  min="0"
                  step="0.01"
                />
                {errors.amount && <p className="text-red-500 text-sm">{errors.amount}</p>}
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description" className="text-brand-700 font-medium">
                  Description
                </Label>
                <Textarea
                  id="description"
                  placeholder="What is this transfer for?"
                  value={formData.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  className={`border-brand-200 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 ${errors.description ? 'border-red-500' : ''}`}
                  rows={3}
                />
                {errors.description && <p className="text-red-500 text-sm">{errors.description}</p>}
              </div>

              {/* Transfer Summary */}
              {formData.amount && selectedAccount && (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Transfer Summary:</strong><br />
                    Amount: {formatCurrency(parseFloat(formData.amount) || 0)}<br />
                    From: {selectedAccount.accountType} ****{selectedAccount.accountNumber.slice(-4)}<br />
                    To: {formData.recipientName || 'Recipient'} (****{formData.toAccountNumber.slice(-4)})
                  </AlertDescription>
                </Alert>
              )}

              <div className="flex space-x-4 pt-4">
                <Button
                  type="button"
                  variant="banking-outline"
                  onClick={onBack}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="banking"
                  disabled={isLoading}
                  className="flex-1"
                >
                  {isLoading ? 'Processing...' : 'Send Money'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}