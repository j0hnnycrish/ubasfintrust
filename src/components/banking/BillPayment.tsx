import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { 
  Zap, 
  Wifi, 
  Car, 
  Home, 
  Phone, 
  CreditCard, 
  GraduationCap,
  Shield,
  Calendar,
  Clock,
  CheckCircle
} from 'lucide-react';

interface BillCategory {
  id: string;
  name: string;
  icon: React.ReactNode;
  providers: string[];
}

interface BillPaymentProps {
  onBack: () => void;
}

export function BillPayment({ onBack }: BillPaymentProps) {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedProvider, setSelectedProvider] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [paymentAccount, setPaymentAccount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const billCategories: BillCategory[] = [
    {
      id: 'utilities',
      name: 'Utilities',
      icon: <Zap className="h-5 w-5" />,
      providers: ['ConEd', 'National Grid', 'PSE&G', 'BGE', 'Pepco']
    },
    {
      id: 'internet',
      name: 'Internet & Cable',
      icon: <Wifi className="h-5 w-5" />,
      providers: ['Verizon', 'Comcast', 'Spectrum', 'AT&T', 'Cox']
    },
    {
      id: 'insurance',
      name: 'Insurance',
      icon: <Shield className="h-5 w-5" />,
      providers: ['State Farm', 'Geico', 'Progressive', 'Allstate', 'Liberty Mutual']
    },
    {
      id: 'automotive',
      name: 'Automotive',
      icon: <Car className="h-5 w-5" />,
      providers: ['Toyota Financial', 'Ford Credit', 'Honda Finance', 'BMW Financial', 'Mercedes-Benz Financial']
    },
    {
      id: 'mortgage',
      name: 'Mortgage & Rent',
      icon: <Home className="h-5 w-5" />,
      providers: ['Wells Fargo', 'Chase', 'Bank of America', 'Quicken Loans', 'Property Management Co.']
    },
    {
      id: 'mobile',
      name: 'Mobile & Phone',
      icon: <Phone className="h-5 w-5" />,
      providers: ['Verizon', 'AT&T', 'T-Mobile', 'Sprint', 'Cricket']
    },
    {
      id: 'credit',
      name: 'Credit Cards',
      icon: <CreditCard className="h-5 w-5" />,
      providers: ['American Express', 'Chase', 'Capital One', 'Citi', 'Discover']
    },
    {
      id: 'education',
      name: 'Education',
      icon: <GraduationCap className="h-5 w-5" />,
      providers: ['Federal Student Aid', 'Sallie Mae', 'Navient', 'Great Lakes', 'Nelnet']
    }
  ];

  const userAccounts = [
    { id: 'checking-001', name: 'Primary Checking', balance: 5420.50 },
    { id: 'savings-001', name: 'High Yield Savings', balance: 15750.25 },
    { id: 'checking-002', name: 'Business Checking', balance: 8900.00 }
  ];

  const recentBills = [
    { provider: 'ConEd', amount: 125.50, dueDate: '2024-02-15', status: 'paid' },
    { provider: 'Verizon', amount: 89.99, dueDate: '2024-02-18', status: 'pending' },
    { provider: 'State Farm', amount: 245.00, dueDate: '2024-02-20', status: 'upcoming' }
  ];

  const handlePayBill = async () => {
    if (!selectedCategory || !selectedProvider || !accountNumber || !amount || !paymentAccount) {
      toast({
        title: 'Missing Information',
        description: 'Please fill in all required fields.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: 'Payment Successful',
        description: `$${amount} payment to ${selectedProvider} has been processed.`,
      });

      // Reset form
      setSelectedCategory('');
      setSelectedProvider('');
      setAccountNumber('');
      setAmount('');
      setPaymentAccount('');
    } catch (error) {
      toast({
        title: 'Payment Failed',
        description: 'There was an error processing your payment. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'text-green-600';
      case 'pending':
        return 'text-yellow-600';
      case 'upcoming':
        return 'text-blue-600';
      default:
        return 'text-gray-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'upcoming':
        return <Calendar className="h-4 w-4 text-blue-600" />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Button variant="ghost" onClick={onBack} className="mb-4">
            ← Back to Dashboard
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">Bill Payment Center</h1>
          <p className="text-gray-600">Pay your bills quickly and securely</p>
        </div>

        <Tabs defaultValue="pay-bill" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="pay-bill">Pay Bill</TabsTrigger>
            <TabsTrigger value="recent-bills">Recent Bills</TabsTrigger>
          </TabsList>

          <TabsContent value="pay-bill" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Bill Categories */}
              <Card>
                <CardHeader>
                  <CardTitle>Select Bill Category</CardTitle>
                  <CardDescription>Choose the type of bill you want to pay</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3">
                    {billCategories.map((category) => (
                      <Button
                        key={category.id}
                        variant={selectedCategory === category.id ? 'default' : 'outline'}
                        className="h-16 flex flex-col items-center justify-center space-y-1"
                        onClick={() => {
                          setSelectedCategory(category.id);
                          setSelectedProvider('');
                        }}
                      >
                        {category.icon}
                        <span className="text-xs">{category.name}</span>
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Payment Form */}
              <Card>
                <CardHeader>
                  <CardTitle>Payment Details</CardTitle>
                  <CardDescription>Enter your payment information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {selectedCategory && (
                    <div className="space-y-2">
                      <Label htmlFor="provider">Service Provider</Label>
                      <Select value={selectedProvider} onValueChange={setSelectedProvider}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select provider" />
                        </SelectTrigger>
                        <SelectContent>
                          {billCategories
                            .find(cat => cat.id === selectedCategory)
                            ?.providers.map((provider) => (
                              <SelectItem key={provider} value={provider}>
                                {provider}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="account-number">Account Number</Label>
                    <Input
                      id="account-number"
                      placeholder="Enter your account number"
                      value={accountNumber}
                      onChange={(e) => setAccountNumber(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="amount">Payment Amount</Label>
                    <Input
                      id="amount"
                      type="number"
                      placeholder="0.00"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="payment-account">Pay From Account</Label>
                    <Select value={paymentAccount} onValueChange={setPaymentAccount}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select account" />
                      </SelectTrigger>
                      <SelectContent>
                        {userAccounts.map((account) => (
                          <SelectItem key={account.id} value={account.id}>
                            {account.name} - {formatCurrency(account.balance)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <Button 
                    onClick={handlePayBill} 
                    className="w-full"
                    disabled={isLoading || !selectedCategory || !selectedProvider || !accountNumber || !amount || !paymentAccount}
                  >
                    {isLoading ? 'Processing Payment...' : 'Pay Bill'}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="recent-bills" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Bill Payments</CardTitle>
                <CardDescription>Your payment history and upcoming bills</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentBills.map((bill, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        {getStatusIcon(bill.status)}
                        <div>
                          <h4 className="font-medium">{bill.provider}</h4>
                          <p className="text-sm text-gray-600">Due: {bill.dueDate}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{formatCurrency(bill.amount)}</p>
                        <p className={`text-sm capitalize ${getStatusColor(bill.status)}`}>
                          {bill.status}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
