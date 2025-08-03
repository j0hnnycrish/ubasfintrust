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
  Wallet,
  DollarSign,
  Loader2, 
  CheckCircle,
  AlertCircle,
  Camera,
  Upload,
  CreditCard,
  Building
} from 'lucide-react';

interface DepositModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function DepositModal({ isOpen, onClose, onSuccess }: DepositModalProps) {
  const [step, setStep] = useState(1); // 1: Select Method, 2: Deposit Details, 3: Success
  const [formData, setFormData] = useState({
    depositType: '',
    toAccount: '',
    amount: '',
    checkFront: null as File | null,
    checkBack: null as File | null,
    routingNumber: '',
    accountNumber: '',
    bankName: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const depositTypes = [
    {
      id: 'mobile_check',
      name: 'Mobile Check Deposit',
      description: 'Take photos of your check',
      icon: Camera,
      color: 'bg-blue-100 text-blue-600',
      fee: 'Free',
      time: '1-2 business days'
    },
    {
      id: 'ach_transfer',
      name: 'ACH Transfer',
      description: 'Transfer from another bank',
      icon: Building,
      color: 'bg-green-100 text-green-600',
      fee: 'Free',
      time: '3-5 business days'
    },
    {
      id: 'wire_transfer',
      name: 'Wire Transfer',
      description: 'Receive wire transfer',
      icon: CreditCard,
      color: 'bg-purple-100 text-purple-600',
      fee: '$15.00',
      time: 'Same day'
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
      setError('Deposit failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (error) setError('');
  };

  const handleFileUpload = (field: 'checkFront' | 'checkBack', file: File | null) => {
    setFormData(prev => ({ ...prev, [field]: file }));
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Select Deposit Method</h3>
      <div className="space-y-4">
        {depositTypes.map((type) => {
          const Icon = type.icon;
          return (
            <button
              key={type.id}
              onClick={() => {
                handleInputChange('depositType', type.id);
                setStep(2);
              }}
              className={`w-full p-4 rounded-lg border-2 transition-all hover:shadow-md text-left ${
                formData.depositType === type.id 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center space-x-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${type.color}`}>
                  <Icon className="h-6 w-6" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{type.name}</h4>
                  <p className="text-sm text-gray-600">{type.description}</p>
                  <div className="flex space-x-4 mt-1">
                    <span className="text-xs text-gray-500">Fee: {type.fee}</span>
                    <span className="text-xs text-gray-500">Time: {type.time}</span>
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );

  const renderMobileCheckDeposit = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="amount">Check Amount</Label>
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

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Front of Check</Label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
            <Camera className="h-8 w-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-600">Take photo of front</p>
            <input
              type="file"
              accept="image/*"
              capture="environment"
              onChange={(e) => handleFileUpload('checkFront', e.target.files?.[0] || null)}
              className="hidden"
              id="checkFront"
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="mt-2"
              onClick={() => document.getElementById('checkFront')?.click()}
            >
              <Camera className="h-4 w-4 mr-1" />
              Capture
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Back of Check</Label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
            <Camera className="h-8 w-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-600">Take photo of back</p>
            <input
              type="file"
              accept="image/*"
              capture="environment"
              onChange={(e) => handleFileUpload('checkBack', e.target.files?.[0] || null)}
              className="hidden"
              id="checkBack"
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="mt-2"
              onClick={() => document.getElementById('checkBack')?.click()}
            >
              <Camera className="h-4 w-4 mr-1" />
              Capture
            </Button>
          </div>
        </div>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
        <p className="text-sm text-yellow-800">
          <strong>Important:</strong> Make sure both sides of the check are clearly visible and all text is readable.
        </p>
      </div>
    </div>
  );

  const renderACHTransfer = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="bankName">Bank Name</Label>
        <Input
          id="bankName"
          value={formData.bankName}
          onChange={(e) => handleInputChange('bankName', e.target.value)}
          placeholder="Name of your bank"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="routingNumber">Routing Number</Label>
          <Input
            id="routingNumber"
            value={formData.routingNumber}
            onChange={(e) => handleInputChange('routingNumber', e.target.value)}
            placeholder="9-digit routing number"
            maxLength={9}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="accountNumber">Account Number</Label>
          <Input
            id="accountNumber"
            value={formData.accountNumber}
            onChange={(e) => handleInputChange('accountNumber', e.target.value)}
            placeholder="Your account number"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="amount">Transfer Amount</Label>
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
    </div>
  );

  const renderStep2 = () => {
    const selectedDepositType = depositTypes.find(type => type.id === formData.depositType);
    
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-3">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${selectedDepositType?.color}`}>
            {selectedDepositType && <selectedDepositType.icon className="h-5 w-5" />}
          </div>
          <h3 className="text-lg font-semibold text-gray-900">{selectedDepositType?.name}</h3>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="toAccount">Deposit To Account</Label>
            <Select value={formData.toAccount} onValueChange={(value) => handleInputChange('toAccount', value)}>
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

          {formData.depositType === 'mobile_check' && renderMobileCheckDeposit()}
          {formData.depositType === 'ach_transfer' && renderACHTransfer()}
          {formData.depositType === 'wire_transfer' && (
            <div className="space-y-2">
              <Label htmlFor="amount">Expected Amount</Label>
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
              <p className="text-sm text-gray-600">
                Wire transfer details will be provided after confirmation.
              </p>
            </div>
          )}

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
                  <Wallet className="mr-2 h-4 w-4" />
                  Submit Deposit
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
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Deposit Submitted!</h3>
        <p className="text-gray-600">
          Your deposit of {formatCurrency(parseFloat(formData.amount))} has been submitted for processing.
        </p>
      </div>
      <div className="bg-gray-50 rounded-lg p-4">
        <p className="text-sm text-gray-600">
          <strong>Confirmation:</strong> DP{Date.now().toString().slice(-8)}
        </p>
        <p className="text-sm text-gray-600 mt-1">
          <strong>Processing Time:</strong> {depositTypes.find(t => t.id === formData.depositType)?.time}
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
            Make Deposit
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            {step === 1 ? 'Choose how you want to deposit money' :
             step === 2 ? 'Enter deposit details' :
             'Deposit confirmation'}
          </DialogDescription>
        </DialogHeader>

        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
        {step === 3 && renderStep3()}
      </DialogContent>
    </Dialog>
  );
}
