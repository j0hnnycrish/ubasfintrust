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
  TrendingUp,
  DollarSign,
  Loader2, 
  CheckCircle,
  AlertCircle,
  PieChart,
  BarChart3,
  Target,
  Shield
} from 'lucide-react';

interface InvestmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function InvestmentModal({ isOpen, onClose, onSuccess }: InvestmentModalProps) {
  const [step, setStep] = useState(1); // 1: Select Investment, 2: Investment Details, 3: Success
  const [formData, setFormData] = useState({
    investmentType: '',
    amount: '',
    fromAccount: '',
    riskTolerance: '',
    timeHorizon: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const investmentTypes = [
    {
      id: 'savings_cd',
      name: 'Certificate of Deposit',
      description: 'Fixed-rate, FDIC insured savings',
      icon: Shield,
      color: 'bg-green-100 text-green-600',
      minAmount: 1000,
      expectedReturn: '4.5% - 5.2%',
      risk: 'Low'
    },
    {
      id: 'mutual_funds',
      name: 'Mutual Funds',
      description: 'Diversified portfolio management',
      icon: PieChart,
      color: 'bg-blue-100 text-blue-600',
      minAmount: 500,
      expectedReturn: '6% - 10%',
      risk: 'Medium'
    },
    {
      id: 'etf',
      name: 'Exchange-Traded Funds',
      description: 'Low-cost index fund investing',
      icon: BarChart3,
      color: 'bg-purple-100 text-purple-600',
      minAmount: 100,
      expectedReturn: '7% - 12%',
      risk: 'Medium'
    },
    {
      id: 'target_date',
      name: 'Target Date Funds',
      description: 'Retirement-focused investing',
      icon: Target,
      color: 'bg-orange-100 text-orange-600',
      minAmount: 250,
      expectedReturn: '5% - 9%',
      risk: 'Medium'
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
      setError('Investment failed. Please try again.');
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
      <h3 className="text-lg font-semibold text-gray-900">Select Investment Type</h3>
      <div className="space-y-4">
        {investmentTypes.map((type) => {
          const Icon = type.icon;
          return (
            <button
              key={type.id}
              onClick={() => {
                handleInputChange('investmentType', type.id);
                setStep(2);
              }}
              className={`w-full p-4 rounded-lg border-2 transition-all hover:shadow-md text-left ${
                formData.investmentType === type.id
                  ? 'border-red-600 bg-red-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-start space-x-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${type.color}`}>
                  <Icon className="h-6 w-6" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{type.name}</h4>
                  <p className="text-sm text-gray-600 mb-2">{type.description}</p>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div>
                      <span className="text-gray-500">Min:</span>
                      <span className="ml-1 font-medium">{formatCurrency(type.minAmount)}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Return:</span>
                      <span className="ml-1 font-medium">{type.expectedReturn}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Risk:</span>
                      <span className={`ml-1 font-medium ${
                        type.risk === 'Low' ? 'text-green-600' :
                        type.risk === 'Medium' ? 'text-yellow-600' :
                        'text-red-600'
                      }`}>{type.risk}</span>
                    </div>
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );

  const renderStep2 = () => {
    const selectedInvestmentType = investmentTypes.find(type => type.id === formData.investmentType);
    
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-3">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${selectedInvestmentType?.color}`}>
            {selectedInvestmentType && <selectedInvestmentType.icon className="h-5 w-5" />}
          </div>
          <h3 className="text-lg font-semibold text-gray-900">{selectedInvestmentType?.name}</h3>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="fromAccount">Invest From Account</Label>
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

          <div className="space-y-2">
            <Label htmlFor="amount">Investment Amount</Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="amount"
                type="number"
                step="0.01"
                min={selectedInvestmentType?.minAmount}
                value={formData.amount}
                onChange={(e) => handleInputChange('amount', e.target.value)}
                placeholder={`Minimum ${formatCurrency(selectedInvestmentType?.minAmount || 0)}`}
                className="pl-10"
              />
            </div>
            <p className="text-sm text-gray-600">
              Minimum investment: {formatCurrency(selectedInvestmentType?.minAmount || 0)}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="riskTolerance">Risk Tolerance</Label>
              <Select value={formData.riskTolerance} onValueChange={(value) => handleInputChange('riskTolerance', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select risk level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="conservative">Conservative</SelectItem>
                  <SelectItem value="moderate">Moderate</SelectItem>
                  <SelectItem value="aggressive">Aggressive</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="timeHorizon">Time Horizon</Label>
              <Select value={formData.timeHorizon} onValueChange={(value) => handleInputChange('timeHorizon', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Investment period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="short">1-3 years</SelectItem>
                  <SelectItem value="medium">3-7 years</SelectItem>
                  <SelectItem value="long">7+ years</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 mb-2">Investment Summary</h4>
            <div className="space-y-1 text-sm text-blue-800">
              <div className="flex justify-between">
                <span>Expected Return:</span>
                <span className="font-medium">{selectedInvestmentType?.expectedReturn}</span>
              </div>
              <div className="flex justify-between">
                <span>Risk Level:</span>
                <span className="font-medium">{selectedInvestmentType?.risk}</span>
              </div>
              <div className="flex justify-between">
                <span>Management Fee:</span>
                <span className="font-medium">0.25% - 0.75%</span>
              </div>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <p className="text-sm text-yellow-800">
              <strong>Important:</strong> All investments carry risk. Past performance does not guarantee future results.
            </p>
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
              className="flex-1 bg-blue-600 hover:bg-blue-700"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <TrendingUp className="mr-2 h-4 w-4" />
                  Start Investment
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
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Investment Started!</h3>
        <p className="text-gray-600">
          Your investment of {formatCurrency(parseFloat(formData.amount))} has been initiated.
        </p>
      </div>
      <div className="bg-gray-50 rounded-lg p-4">
        <p className="text-sm text-gray-600">
          <strong>Confirmation:</strong> INV{Date.now().toString().slice(-8)}
        </p>
        <p className="text-sm text-gray-600 mt-1">
          <strong>Portfolio:</strong> {investmentTypes.find(t => t.id === formData.investmentType)?.name}
        </p>
        <p className="text-sm text-gray-600 mt-1">
          <strong>Processing:</strong> 1-2 business days
        </p>
      </div>
      <Button 
        onClick={onClose}
        className="w-full bg-green-600 hover:bg-green-700"
      >
        View Portfolio
      </Button>
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center">
          <DialogTitle className="text-2xl font-bold text-gray-900">
            Start Investing
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            {step === 1 ? 'Choose your investment strategy' :
             step === 2 ? 'Configure your investment' :
             'Investment confirmation'}
          </DialogDescription>
        </DialogHeader>

        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
        {step === 3 && renderStep3()}
      </DialogContent>
    </Dialog>
  );
}
