import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/contexts/AuthContext';
import { useAdmin } from '@/contexts/AdminContext';
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
  ArrowUpRight, 
  DollarSign,
  Loader2, 
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  Shield,
  Clock,
  CreditCard,
  Building
} from 'lucide-react';

interface TransferModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  transferType?: string;
}

interface Account {
  id: string;
  name: string;
  type: string;
  balance: number;
  accountNumber: string;
}

export function TransferModal({ isOpen, onClose, onSuccess, transferType = 'internal' }: TransferModalProps) {
  const { user } = useAuth();
  const { customers, updateAccountBalance, createTransaction } = useAdmin();
  const [step, setStep] = useState(1); // 1: Details, 2: Review, 3: Success
  const [formData, setFormData] = useState({
    fromAccount: '',
    toAccount: '',
    transferType: transferType, // internal, external, wire, international
    amount: '',
    memo: '',
    scheduledDate: '',
    recipientName: '',
    recipientBank: '',
    routingNumber: '',
    accountNumber: '',
    swiftCode: '',
    recipientAddress: '',
    recipientCountry: '',
    purposeOfTransfer: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Get real customer accounts
  const customer = customers.find(c => c.username === user?.username);
  const accounts = customer?.accounts || [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (step === 1) {
      // Validate form
      if (!formData.fromAccount || !formData.amount) {
        setError('Please fill in all required fields');
        return;
      }

      const amount = parseFloat(formData.amount);
      if (isNaN(amount) || amount <= 0) {
        setError('Please enter a valid amount');
        return;
      }

      const fromAccount = accounts.find(acc => acc.id === formData.fromAccount);
      if (fromAccount && amount > fromAccount.balance) {
        setError('Insufficient funds in selected account');
        return;
      }

      if (formData.transferType === 'internal' && !formData.toAccount) {
        setError('Please select a destination account');
        return;
      }

      if (formData.transferType === 'external' && (!formData.recipientName || !formData.accountNumber || !formData.routingNumber)) {
        setError('Please fill in all recipient details');
        return;
      }

      setStep(2);
      return;
    }

    if (step === 2) {
      setIsSubmitting(true);
      try {
        const amount = parseFloat(formData.amount);
        const fromAccount = accounts.find(acc => acc.id === formData.fromAccount);
        const toAccount = accounts.find(acc => acc.id === formData.toAccount);

        if (!fromAccount) {
          throw new Error('Source account not found');
        }

        // Generate transaction reference
        const refNumber = `TXN${Date.now().toString().slice(-6)}${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`;

        if (formData.transferType === 'internal' && toAccount) {
          // Internal transfer - update both account balances
          await updateAccountBalance(formData.fromAccount, fromAccount.balance - amount);
          await updateAccountBalance(formData.toAccount, toAccount.balance + amount);

          // Create debit transaction for source account
          await createTransaction({
            accountId: formData.fromAccount,
            customerId: customer?.id || '',
            description: `Transfer to ${toAccount.name}`,
            amount: -amount,
            type: 'debit',
            category: 'Transfer',
            date: new Date().toISOString().split('T')[0],
            reference: refNumber,
            status: 'completed'
          });

          // Create credit transaction for destination account
          await createTransaction({
            accountId: formData.toAccount,
            customerId: customer?.id || '',
            description: `Transfer from ${fromAccount.name}`,
            amount: amount,
            type: 'credit',
            category: 'Transfer',
            date: new Date().toISOString().split('T')[0],
            reference: refNumber,
            status: 'completed'
          });
        } else {
          // External transfer - only debit from source account
          await updateAccountBalance(formData.fromAccount, fromAccount.balance - amount);

          // Create debit transaction
          let description = '';
          let status = 'pending';

          switch (formData.transferType) {
            case 'wire':
              description = `Wire Transfer to ${formData.recipientName}`;
              status = 'completed';
              break;
            case 'international':
              description = `International Wire to ${formData.recipientName} (${formData.recipientCountry})`;
              status = 'pending';
              break;
            case 'external':
              description = `External Transfer to ${formData.recipientName}`;
              status = 'pending';
              break;
            case 'mobile':
              description = `Mobile Payment to ${formData.recipientName}`;
              status = 'completed';
              break;
            default:
              description = `Transfer to ${formData.recipientName}`;
              status = 'pending';
          }

          await createTransaction({
            accountId: formData.fromAccount,
            customerId: customer?.id || '',
            description: description,
            amount: -amount,
            type: 'debit',
            category: 'Transfer',
            date: new Date().toISOString().split('T')[0],
            reference: refNumber,
            status: status
          });

          // Add transfer fees
          const transferFee = getTransferFee();
          if (transferFee > 0) {
            await updateAccountBalance(formData.fromAccount, fromAccount.balance - amount - transferFee);

            let feeDescription = '';
            switch (formData.transferType) {
              case 'wire':
                feeDescription = 'Wire Transfer Fee';
                break;
              case 'international':
                feeDescription = 'International Wire Transfer Fee';
                break;
              case 'external':
                feeDescription = 'External Transfer Fee';
                break;
              default:
                feeDescription = 'Transfer Fee';
            }

            await createTransaction({
              accountId: formData.fromAccount,
              customerId: customer?.id || '',
              description: feeDescription,
              amount: -transferFee,
              type: 'debit',
              category: 'Fees',
              date: new Date().toISOString().split('T')[0],
              reference: `FEE${refNumber}`,
              status: 'completed'
            });
          }
        }

        // Simulate processing time
        await new Promise(resolve => setTimeout(resolve, 1500));
        setStep(3);
        onSuccess(); // Trigger refresh of account data
      } catch (error) {
        setError('Transfer failed. Please try again.');
        console.error('Transfer error:', error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (error) setError('');
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
      setError('');
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getTransferFee = () => {
    switch (formData.transferType) {
      case 'internal': return 0;
      case 'external': return 3.00;
      case 'wire': return 25.00;
      case 'international': return 45.00;
      case 'mobile': return 0;
      default: return 0;
    }
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      {/* Transfer Type */}
      <div className="space-y-2">
        <Label htmlFor="transferType">Transfer Type</Label>
        <Select
          value={formData.transferType}
          onValueChange={(value) => handleInputChange('transferType', value)}
          disabled={transferType !== 'internal'} // Disable if specific type was selected
        >
          <SelectTrigger>
            <SelectValue placeholder="Select transfer type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="internal">
              <div className="flex items-center space-x-2">
                <CreditCard className="h-4 w-4" />
                <div>
                  <div className="font-medium">Between My Accounts</div>
                  <div className="text-xs text-gray-500">Free • Instant</div>
                </div>
              </div>
            </SelectItem>
            <SelectItem value="external">
              <div className="flex items-center space-x-2">
                <Building className="h-4 w-4" />
                <div>
                  <div className="font-medium">External Transfer (ACH)</div>
                  <div className="text-xs text-gray-500">$3.00 fee • 1-3 business days</div>
                </div>
              </div>
            </SelectItem>
            <SelectItem value="wire">
              <div className="flex items-center space-x-2">
                <ArrowUpRight className="h-4 w-4" />
                <div>
                  <div className="font-medium">Domestic Wire</div>
                  <div className="text-xs text-gray-500">$25.00 fee • Same day</div>
                </div>
              </div>
            </SelectItem>
            <SelectItem value="international">
              <div className="flex items-center space-x-2">
                <Globe className="h-4 w-4" />
                <div>
                  <div className="font-medium">International Wire</div>
                  <div className="text-xs text-gray-500">$45.00 fee • 1-5 business days</div>
                </div>
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* From Account */}
      <div className="space-y-2">
        <Label htmlFor="fromAccount">From Account</Label>
        <Select 
          value={formData.fromAccount} 
          onValueChange={(value) => handleInputChange('fromAccount', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select source account" />
          </SelectTrigger>
          <SelectContent>
            {accounts.map((account) => (
              <SelectItem key={account.id} value={account.id}>
                <div className="flex justify-between items-center w-full">
                  <div>
                    <div className="font-medium">{account.name}</div>
                    <div className="text-xs text-gray-500">{account.accountNumber}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">{formatCurrency(account.balance)}</div>
                    <div className="text-xs text-gray-500">{account.type}</div>
                  </div>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* To Account (Internal) */}
      {formData.transferType === 'internal' && (
        <div className="space-y-2">
          <Label htmlFor="toAccount">To Account</Label>
          <Select 
            value={formData.toAccount} 
            onValueChange={(value) => handleInputChange('toAccount', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select destination account" />
            </SelectTrigger>
            <SelectContent>
              {accounts.filter(acc => acc.id !== formData.fromAccount).map((account) => (
                <SelectItem key={account.id} value={account.id}>
                  <div className="flex justify-between items-center w-full">
                    <div>
                      <div className="font-medium">{account.name}</div>
                      <div className="text-xs text-gray-500">{account.accountNumber}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">{formatCurrency(account.balance)}</div>
                      <div className="text-xs text-gray-500">{account.type}</div>
                    </div>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* External Account Details */}
      {formData.transferType === 'external' && (
        <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium text-gray-900">Recipient Details</h4>
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              <Label htmlFor="recipientName">Recipient Name</Label>
              <Input
                id="recipientName"
                type="text"
                placeholder="Full name on account"
                value={formData.recipientName}
                onChange={(e) => handleInputChange('recipientName', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="recipientBank">Bank Name</Label>
              <Input
                id="recipientBank"
                type="text"
                placeholder="Recipient's bank name"
                value={formData.recipientBank}
                onChange={(e) => handleInputChange('recipientBank', e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="routingNumber">Routing Number</Label>
                <Input
                  id="routingNumber"
                  type="text"
                  placeholder="9-digit routing number"
                  value={formData.routingNumber}
                  onChange={(e) => handleInputChange('routingNumber', e.target.value)}
                  maxLength={9}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="accountNumber">Account Number</Label>
                <Input
                  id="accountNumber"
                  type="text"
                  placeholder="Account number"
                  value={formData.accountNumber}
                  onChange={(e) => handleInputChange('accountNumber', e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* International Transfer Details */}
      {formData.transferType === 'international' && (
        <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium text-gray-900">International Recipient Details</h4>
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              <Label htmlFor="recipientName">Recipient Name</Label>
              <Input
                id="recipientName"
                type="text"
                placeholder="Full name as it appears on bank account"
                value={formData.recipientName}
                onChange={(e) => handleInputChange('recipientName', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="recipientAddress">Recipient Address</Label>
              <Input
                id="recipientAddress"
                type="text"
                placeholder="Complete address"
                value={formData.recipientAddress}
                onChange={(e) => handleInputChange('recipientAddress', e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="recipientCountry">Country</Label>
                <Select
                  value={formData.recipientCountry}
                  onValueChange={(value) => handleInputChange('recipientCountry', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CA">Canada</SelectItem>
                    <SelectItem value="GB">United Kingdom</SelectItem>
                    <SelectItem value="DE">Germany</SelectItem>
                    <SelectItem value="FR">France</SelectItem>
                    <SelectItem value="JP">Japan</SelectItem>
                    <SelectItem value="AU">Australia</SelectItem>
                    <SelectItem value="MX">Mexico</SelectItem>
                    <SelectItem value="IN">India</SelectItem>
                    <SelectItem value="CN">China</SelectItem>
                    <SelectItem value="BR">Brazil</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="purposeOfTransfer">Purpose</Label>
                <Select
                  value={formData.purposeOfTransfer}
                  onValueChange={(value) => handleInputChange('purposeOfTransfer', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Purpose" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="family_support">Family Support</SelectItem>
                    <SelectItem value="business_payment">Business Payment</SelectItem>
                    <SelectItem value="education">Education</SelectItem>
                    <SelectItem value="investment">Investment</SelectItem>
                    <SelectItem value="property">Property Purchase</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="recipientBank">Recipient Bank Name</Label>
              <Input
                id="recipientBank"
                type="text"
                placeholder="Bank name"
                value={formData.recipientBank}
                onChange={(e) => handleInputChange('recipientBank', e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="swiftCode">SWIFT/BIC Code</Label>
                <Input
                  id="swiftCode"
                  type="text"
                  placeholder="SWIFT code (8-11 characters)"
                  value={formData.swiftCode}
                  onChange={(e) => handleInputChange('swiftCode', e.target.value.toUpperCase())}
                  maxLength={11}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="accountNumber">Account Number/IBAN</Label>
                <Input
                  id="accountNumber"
                  type="text"
                  placeholder="Account number or IBAN"
                  value={formData.accountNumber}
                  onChange={(e) => handleInputChange('accountNumber', e.target.value)}
                />
              </div>
            </div>
          </div>
          <Alert className="bg-yellow-50 border-yellow-200">
            <AlertCircle className="h-4 w-4 text-yellow-600" />
            <AlertDescription className="text-yellow-800">
              International transfers may take 1-5 business days and are subject to additional compliance checks.
            </AlertDescription>
          </Alert>
        </div>
      )}

      {/* Amount */}
      <div className="space-y-2">
        <Label htmlFor="amount">Amount</Label>
        <div className="relative">
          <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            id="amount"
            type="number"
            placeholder="0.00"
            value={formData.amount}
            onChange={(e) => handleInputChange('amount', e.target.value)}
            className="pl-10"
            step="0.01"
            min="0"
          />
        </div>
      </div>

      {/* Memo */}
      <div className="space-y-2">
        <Label htmlFor="memo">Memo (Optional)</Label>
        <Input
          id="memo"
          type="text"
          placeholder="What's this transfer for?"
          value={formData.memo}
          onChange={(e) => handleInputChange('memo', e.target.value)}
        />
      </div>

      {/* Fee Information */}
      {getTransferFee() > 0 && (
        <Alert>
          <DollarSign className="h-4 w-4" />
          <AlertDescription>
            A fee of {formatCurrency(getTransferFee())} will be charged for this transfer type.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );

  const renderStep2 = () => {
    const fromAccount = accounts.find(acc => acc.id === formData.fromAccount);
    const toAccount = accounts.find(acc => acc.id === formData.toAccount);
    const amount = parseFloat(formData.amount);
    const fee = getTransferFee();
    const total = amount + fee;

    return (
      <div className="space-y-6">
        <div className="text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <ArrowUpRight className="h-8 w-8 text-blue-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Review Transfer</h3>
          <p className="text-gray-600">Please review the details before confirming</p>
        </div>

        <div className="bg-gray-50 rounded-lg p-6 space-y-4">
          <div className="flex justify-between">
            <span className="text-gray-600">From:</span>
            <div className="text-right">
              <div className="font-medium">{fromAccount?.name}</div>
              <div className="text-sm text-gray-500">{fromAccount?.accountNumber}</div>
            </div>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-600">To:</span>
            <div className="text-right">
              {formData.transferType === 'internal' ? (
                <>
                  <div className="font-medium">{toAccount?.name}</div>
                  <div className="text-sm text-gray-500">{toAccount?.accountNumber}</div>
                </>
              ) : (
                <>
                  <div className="font-medium">{formData.recipientName}</div>
                  <div className="text-sm text-gray-500">{formData.recipientBank}</div>
                </>
              )}
            </div>
          </div>

          <div className="border-t pt-4">
            <div className="flex justify-between">
              <span className="text-gray-600">Amount:</span>
              <span className="font-medium">{formatCurrency(amount)}</span>
            </div>
            {fee > 0 && (
              <div className="flex justify-between">
                <span className="text-gray-600">Fee:</span>
                <span className="font-medium">{formatCurrency(fee)}</span>
              </div>
            )}
            <div className="flex justify-between font-semibold text-lg border-t pt-2 mt-2">
              <span>Total:</span>
              <span>{formatCurrency(total)}</span>
            </div>
          </div>

          {formData.memo && (
            <div className="flex justify-between">
              <span className="text-gray-600">Memo:</span>
              <span className="font-medium">{formData.memo}</span>
            </div>
          )}
        </div>

        <Alert>
          <Shield className="h-4 w-4" />
          <AlertDescription>
            This transfer will be processed securely using bank-grade encryption.
          </AlertDescription>
        </Alert>
      </div>
    );
  };

  const renderStep3 = () => (
    <div className="space-y-6 text-center">
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
        <CheckCircle className="h-8 w-8 text-green-600" />
      </div>
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Transfer Successful!</h3>
        <p className="text-gray-600">
          Your transfer of {formatCurrency(parseFloat(formData.amount))} has been processed successfully.
        </p>
      </div>
      <div className="bg-gray-50 rounded-lg p-4">
        <p className="text-sm text-gray-600">
          <strong>Reference Number:</strong> TXN{Date.now().toString().slice(-8)}
        </p>
        <p className="text-sm text-gray-600 mt-1">
          <strong>Processing Time:</strong> {formData.transferType === 'internal' ? 'Instant' : formData.transferType === 'wire' ? 'Same day' : '1-3 business days'}
        </p>
      </div>
      <Button 
        onClick={() => {
          onSuccess();
          onClose();
        }}
        className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold"
      >
        Done
      </Button>
    </div>
  );

  const getStepTitle = () => {
    switch (step) {
      case 1: return 'Transfer Money';
      case 2: return 'Review Transfer';
      case 3: return 'Transfer Complete';
      default: return 'Transfer Money';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center">
          <DialogTitle className="text-2xl font-bold text-gray-900">
            {getStepTitle()}
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            {step < 3 ? `Step ${step} of 2` : 'Complete'}
          </DialogDescription>
        </DialogHeader>

        {step < 3 ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            {step === 1 && renderStep1()}
            {step === 2 && renderStep2()}

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="flex space-x-4">
              {step > 1 && (
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={handleBack}
                  className="flex-1"
                  disabled={isSubmitting}
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
              )}
              
              <Button 
                type="submit" 
                className={`${step === 1 ? 'w-full' : 'flex-1'} bg-blue-600 hover:bg-blue-700 text-white font-semibold`}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : step === 1 ? (
                  'Review Transfer'
                ) : (
                  <>
                    <Shield className="mr-2 h-4 w-4" />
                    Confirm Transfer
                  </>
                )}
              </Button>
            </div>
          </form>
        ) : (
          renderStep3()
        )}
      </DialogContent>
    </Dialog>
  );
}
