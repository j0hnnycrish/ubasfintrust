import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Receipt,
  DollarSign,
  Loader2, 
  CheckCircle,
  AlertCircle,
  Zap,
  Wifi,
  Car,
  Home
} from 'lucide-react';

interface BillPayModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function BillPayModal({ isOpen, onClose, onSuccess }: BillPayModalProps) {
  const [step, setStep] = useState(1); // 1: Select Bill, 2: Payment Details, 3: Success
  const [formData, setFormData] = useState({
    billType: '',
    payee: '',
    accountNumber: '',
    amount: '',
    dueDate: '',
    fromAccount: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const billTypes = [
    {
      id: 'utilities',
      name: 'Utilities',
      icon: Zap,
      color: 'bg-yellow-100 text-yellow-600',
      payees: ['Electric Company', 'Gas Company', 'Water Department']
    },
    {
      id: 'internet',
      name: 'Internet & Cable',
      icon: Wifi,
      color: 'bg-blue-100 text-blue-600',
      payees: ['Comcast', 'Verizon', 'AT&T', 'Spectrum']
    },
    {
      id: 'auto',
      name: 'Auto Loan',
      icon: Car,
      color: 'bg-green-100 text-green-600',
      payees: ['Chase Auto', 'Wells Fargo Auto', 'Capital One Auto']
    },
    {
      id: 'mortgage',
      name: 'Mortgage',
      icon: Home,
      color: 'bg-purple-100 text-purple-600',
      payees: ['Bank of America Mortgage', 'Quicken Loans', 'Wells Fargo Mortgage']
    }
  ];

  const accounts = [
    { id: '1', name: 'Primary Checking', balance: 12847.32, accountNumber: '****1234' },
    { id: '2', name: 'High Yield Savings', balance: 45230.18, accountNumber: '****5678' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      setStep(3);
      onSuccess();
    } catch (error) {
      setError('Payment failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (error) setError('');
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Select Bill Type</h3>
      <div className="grid grid-cols-2 gap-4">
        {billTypes.map((type) => {
          const Icon = type.icon;
          return (
            <button
              key={type.id}
              onClick={() => {
                handleInputChange('billType', type.id);
                setStep(2);
              }}
              className={`p-4 rounded-lg border-2 transition-all hover:shadow-md ${
                formData.billType === type.id 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 ${type.color}`}>
                <Icon className="h-6 w-6" />
              </div>
              <p className="font-medium text-gray-900">{type.name}</p>
            </button>
          );
        })}
      </div>
    </div>
  );

  const renderStep2 = () => {
    const selectedBillType = billTypes.find(type => type.id === formData.billType);
    
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-3">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${selectedBillType?.color}`}>
            {selectedBillType && <selectedBillType.icon className="h-5 w-5" />}
          </div>
          <h3 className="text-lg font-semibold text-gray-900">{selectedBillType?.name} Payment</h3>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="payee">Payee</Label>
            <Select value={formData.payee} onValueChange={(value) => handleInputChange('payee', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select payee" />
              </SelectTrigger>
              <SelectContent>
                {selectedBillType?.payees.map((payee) => (
                  <SelectItem key={payee} value={payee}>{payee}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="accountNumber">Account Number</Label>
            <Input
              id="accountNumber"
              value={formData.accountNumber}
              onChange={(e) => handleInputChange('accountNumber', e.target.value)}
              placeholder="Your account number with the payee"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Amount</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  value={formData.amount}
                  onChange={(e) => handleInputChange('amount', e.target.value)}
                  placeholder="0.00"
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="dueDate">Due Date</Label>
              <Input
                id="dueDate"
                type="date"
                value={formData.dueDate}
                onChange={(e) => handleInputChange('dueDate', e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="fromAccount">Pay From Account</Label>
            <Select value={formData.fromAccount} onValueChange={(value) => handleInputChange('fromAccount', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select account" />
              </SelectTrigger>
              <SelectContent>
                {accounts.map((account) => (
                  <SelectItem key={account.id} value={account.id}>
                    <div className="flex justify-between items-center w-full">
                      <span>{account.name} ({account.accountNumber})</span>
                      <span className="ml-4">{formatCurrency(account.balance)}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="flex space-x-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setStep(1)}
              className="flex-1"
              disabled={isSubmitting}
            >
              Back
            </Button>
            <Button 
              type="submit" 
              className="flex-1 bg-green-600 hover:bg-green-700"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Receipt className="mr-2 h-4 w-4" />
                  Pay Bill
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    );
  };

  const renderStep3 = () => (
    <div className="space-y-6 text-center">
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
        <CheckCircle className="h-8 w-8 text-green-600" />
      </div>
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Payment Successful!</h3>
        <p className="text-gray-600">
          Your {formData.payee} bill payment of {formatCurrency(parseFloat(formData.amount))} has been scheduled.
        </p>
      </div>
      <div className="bg-gray-50 rounded-lg p-4">
        <p className="text-sm text-gray-600">
          <strong>Confirmation:</strong> BP{Date.now().toString().slice(-8)}
        </p>
        <p className="text-sm text-gray-600 mt-1">
          <strong>Processing Date:</strong> {formData.dueDate || 'Next business day'}
        </p>
      </div>
      <Button 
        onClick={onClose}
        className="w-full bg-green-600 hover:bg-green-700"
      >
        Done
      </Button>
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center">
          <DialogTitle className="text-2xl font-bold text-gray-900">
            Pay Bills
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            {step === 1 ? 'Choose the type of bill you want to pay' :
             step === 2 ? 'Enter payment details' :
             'Payment confirmation'}
          </DialogDescription>
        </DialogHeader>

        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
        {step === 3 && renderStep3()}
      </DialogContent>
    </Dialog>
  );
}
