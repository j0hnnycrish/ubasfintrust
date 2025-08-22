import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { paymentAPI } from '@/lib/api';
import { useBankingStore } from '@/lib/bankingStore';
import { toast } from 'sonner';
import { Loader2, CreditCard, DollarSign } from 'lucide-react';

// Initialize Stripe (optional in simulation mode)
const stripeKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '';
const stripePromise = stripeKey ? loadStripe(stripeKey) : Promise.resolve(null as any);

interface DepositFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

const DepositFormContent: React.FC<DepositFormProps> = ({ onSuccess, onCancel }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { accounts, fetchAccounts } = useBankingStore();
  
  const [isLoading, setIsLoading] = useState(false);
  const [amount, setAmount] = useState('');
  const [selectedAccount, setSelectedAccount] = useState('');
  const [currency, setCurrency] = useState('USD');
  const MIN_DEPOSIT = Number(import.meta.env.VITE_MINIMUM_DEPOSIT || 1);
  const SIMULATE_PAYMENTS = (import.meta.env.VITE_SIMULATE_PAYMENTS || 'true') === 'true';

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    // In simulation mode we don't require Stripe to be present
    if (!SIMULATE_PAYMENTS && (!stripe || !elements)) {
      toast.error('Stripe not loaded');
      return;
    }

    if (!selectedAccount) {
      toast.error('Please select an account');
      return;
    }

    if (!amount || parseFloat(amount) < MIN_DEPOSIT) {
      toast.error(`Minimum deposit amount is $${MIN_DEPOSIT}`);
      return;
    }

    setIsLoading(true);

    try {
      // Create payment intent
  const response = await paymentAPI.createDepositIntent(
        selectedAccount,
        parseFloat(amount),
        currency
      );

      if (!response.success || !response.data?.clientSecret) {
        throw new Error(response.message || 'Failed to create payment intent');
      }

  if (SIMULATE_PAYMENTS) {
        // Call simulation endpoint to complete the payment
        const sim = await paymentAPI.simulateCompletion(response.data.id, true);
        if (!sim.success) throw new Error(sim.message || 'Simulation failed');
        toast.success('Deposit successful!');
        await fetchAccounts();
        onSuccess?.();
  } else if (stripe && elements && response.data.clientSecret) {
        const cardElement = elements.getElement(CardElement);
        if (!cardElement) {
          throw new Error('Card element not found');
        }
        const { error, paymentIntent } = await stripe.confirmCardPayment(
          response.data.clientSecret,
          {
            payment_method: {
              card: cardElement,
              billing_details: {
        name: 'UBAS User',
              },
            },
          }
        );
        if (error) throw new Error(error.message);
        if (paymentIntent?.status === 'succeeded') {
          toast.success('Deposit successful!');
          await fetchAccounts();
          onSuccess?.();
        }
      } else {
        throw new Error('Payment processing unavailable');
      }
    } catch (error: any) {
      toast.error(error.message || 'Deposit failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="h-5 w-5" />
          Deposit Funds
        </CardTitle>
        <CardDescription>
          Add money to your account using a debit or credit card
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Account Selection */}
          <div className="space-y-2">
            <Label htmlFor="account">Select Account</Label>
            <Select value={selectedAccount} onValueChange={setSelectedAccount}>
              <SelectTrigger>
                <SelectValue placeholder="Choose account" />
              </SelectTrigger>
              <SelectContent>
                {accounts.map((account) => (
                  <SelectItem key={account.id} value={account.id}>
                    {account.accountType} - {account.accountNumber}
                    <span className="ml-2 text-sm text-muted-foreground">
                      ${account.balance.toLocaleString()}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Amount Input */}
          <div className="space-y-2">
            <Label htmlFor="amount">Amount</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-sm text-muted-foreground">$
              </span>
              <Input
                id="amount"
                type="number"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="pl-8"
                min={MIN_DEPOSIT}
                step="0.01"
                required
              />
            </div>
            <p className="text-xs text-muted-foreground">Minimum deposit: ${MIN_DEPOSIT}</p>
          </div>

          {/* Currency Selection */}
          <div className="space-y-2">
            <Label htmlFor="currency">Currency</Label>
            <Select value={currency} onValueChange={setCurrency}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="USD">US Dollar ($)</SelectItem>
                <SelectItem value="EUR">Euro (€)</SelectItem>
                <SelectItem value="GBP">British Pound (£)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Card Element */}
          <div className="space-y-2">
            <Label>Card Details</Label>
            <div className="p-3 border rounded-md">
              <CardElement
                options={{
                  style: {
                    base: {
                      fontSize: '16px',
                      color: '#424770',
                      '::placeholder': {
                        color: '#aab7c4',
                      },
                    },
                  },
                }}
              />
            </div>
          </div>

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
              disabled={(!SIMULATE_PAYMENTS && !stripe) || isLoading}
              className="flex-1"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <CreditCard className="mr-2 h-4 w-4" />
                  Deposit ${amount || '0'}
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

const DepositForm: React.FC<DepositFormProps> = (props) => {
  return (
    <Elements stripe={stripePromise}>
      <DepositFormContent {...props} />
    </Elements>
  );
};

export default DepositForm;
