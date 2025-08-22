import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useBankingData } from '@/hooks/useBankingData';
import { billPaymentAPI } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar } from '@/components/ui/calendar';
import { useToast } from '@/hooks/use-toast';
import { 
  ArrowLeft,
  Zap, 
  Wifi, 
  Car, 
  Home, 
  Phone, 
  CreditCard, 
  GraduationCap,
  Shield,
  Clock,
  CheckCircle,
  DollarSign,
  Plus,
  RefreshCw,
  TrendingUp,
  TrendingDown,
  Activity,
  Receipt,
  Repeat,
  PlayCircle,
  PauseCircle,
  StopCircle
} from 'lucide-react';

interface Provider {
  id: string;
  name: string;
  category: string;
  logo?: string;
  description: string;
  acceptsPartialPayments: boolean;
  fees: {
    type: 'fixed' | 'percentage';
    amount: number;
  };
}

interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
}

interface PaymentHistory {
  id: string;
  providerId: string;
  providerName: string;
  amount: number;
  fee: number;
  status: string;
  reference: string;
  accountNumber: string;
  description?: string;
  scheduledDate?: string;
  processedDate?: string;
  createdAt: string;
}

interface RecurringPayment {
  id: string;
  providerId: string;
  providerName: string;
  amount: number;
  frequency: 'weekly' | 'monthly' | 'quarterly';
  nextPaymentDate: string;
  status: 'active' | 'paused' | 'cancelled';
  accountNumber: string;
  fromAccountId: string;
}

interface UpcomingPayment {
  id?: string;
  providerId: string;
  providerName: string;
  amount: number;
  dueDate: string;
  accountNumber: string;
  type: 'scheduled' | 'recurring' | 'estimated';
  status: 'pending' | 'overdue';
}

interface BillSummary {
  totalPaid: number;
  totalFees: number;
  paymentCount: number;
  averageAmount: number;
  topCategories: Array<{
    category: string;
    amount: number;
    count: number;
  }>;
  monthlyTrend: Array<{
    month: string;
    amount: number;
    count: number;
  }>;
}

interface EnhancedBillPaymentProps {
  onBack: () => void;
}

export function EnhancedBillPayment({ onBack }: EnhancedBillPaymentProps) {
  const { user } = useAuth();
  const { accounts, formatCurrency } = useBankingData();
  const { toast } = useToast();

  // Data states
  const [providers, setProviders] = useState<Provider[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [paymentHistory, setPaymentHistory] = useState<PaymentHistory[]>([]);
  const [recurringPayments, setRecurringPayments] = useState<RecurringPayment[]>([]);
  const [upcomingPayments, setUpcomingPayments] = useState<UpcomingPayment[]>([]);
  const [billSummary, setBillSummary] = useState<BillSummary | null>(null);

  // UI states
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [filteredProviders, setFilteredProviders] = useState<Provider[]>([]);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showRecurringModal, setShowRecurringModal] = useState(false);
  const [activeTab, setActiveTab] = useState('pay-bill');

  // Payment form states
  const [paymentForm, setPaymentForm] = useState({
    providerId: '',
    providerName: '',
    fromAccountId: '',
    amount: '',
    accountNumber: '',
    description: '',
    scheduleDate: '',
  });

  // Recurring form states
  const [recurringForm, setRecurringForm] = useState({
    providerId: '',
    providerName: '',
    fromAccountId: '',
    amount: '',
    accountNumber: '',
    frequency: 'monthly' as 'weekly' | 'monthly' | 'quarterly',
    startDate: '',
    description: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validatingAccount, setValidatingAccount] = useState(false);
  const [accountValidation, setAccountValidation] = useState<{
    valid: boolean;
    accountName?: string;
    currentBalance?: number;
    dueDate?: string;
  } | null>(null);

  // Load initial data
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [
        categoriesRes,
        providersRes,
        historyRes,
        recurringRes,
        upcomingRes,
        summaryRes
      ] = await Promise.all([
        billPaymentAPI.getCategories(),
        billPaymentAPI.getProviders(),
        billPaymentAPI.getPaymentHistory({ limit: 20 }),
        billPaymentAPI.getRecurringPayments(),
        billPaymentAPI.getUpcomingPayments(30),
        billPaymentAPI.getBillSummary('month')
      ]);

      if (categoriesRes.success) setCategories(categoriesRes.data || []);
      if (providersRes.success) {
        setProviders(providersRes.data || []);
        setFilteredProviders(providersRes.data || []);
      }
      if (historyRes.success) setPaymentHistory(historyRes.data || []);
      if (recurringRes.success) setRecurringPayments(recurringRes.data || []);
      if (upcomingRes.success) setUpcomingPayments(upcomingRes.data || []);
      if (summaryRes.success) setBillSummary(summaryRes.data);
    } catch (error) {
      toast({
        title: 'Error Loading Data',
        description: 'Failed to load bill payment data. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // Filter providers by category
  useEffect(() => {
    if (selectedCategory) {
      setFilteredProviders(providers.filter(p => p.category === selectedCategory));
    } else {
      setFilteredProviders(providers);
    }
  }, [selectedCategory, providers]);

  // Account validation
  const validateAccount = async (providerId: string, accountNumber: string) => {
    if (!providerId || !accountNumber) return;
    
    setValidatingAccount(true);
    try {
      const response = await billPaymentAPI.validateAccount(providerId, accountNumber);
      if (response.success) {
        setAccountValidation(response.data);
        if (response.data?.valid) {
          toast({
            title: 'Account Validated',
            description: `Account verified for ${response.data.accountName || 'this provider'}`,
          });
        } else {
          toast({
            title: 'Invalid Account',
            description: 'The account number is not valid for this provider.',
            variant: 'destructive',
          });
        }
      }
    } catch (error) {
      toast({
        title: 'Validation Failed',
        description: 'Could not validate account. Please check the details.',
        variant: 'destructive',
      });
    } finally {
      setValidatingAccount(false);
    }
  };

  // Submit one-time payment
  const submitPayment = async () => {
    if (!paymentForm.providerId || !paymentForm.fromAccountId || !paymentForm.amount || !paymentForm.accountNumber) {
      toast({
        title: 'Missing Information',
        description: 'Please fill in all required fields.',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await billPaymentAPI.payBill({
        providerId: paymentForm.providerId,
        fromAccountId: paymentForm.fromAccountId,
        amount: parseFloat(paymentForm.amount),
        accountNumber: paymentForm.accountNumber,
        description: paymentForm.description,
        scheduleDate: paymentForm.scheduleDate,
      });

      if (response.success) {
        toast({
          title: 'Payment Successful',
          description: `Bill payment of ${formatCurrency(response.data.amount)} has been ${paymentForm.scheduleDate ? 'scheduled' : 'processed'}.`,
        });
        
        setShowPaymentModal(false);
        resetPaymentForm();
        loadData(); // Refresh data
      }
    } catch (error) {
      toast({
        title: 'Payment Failed',
        description: 'There was an error processing your payment. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Submit recurring payment
  const submitRecurringPayment = async () => {
    if (!recurringForm.providerId || !recurringForm.fromAccountId || !recurringForm.amount || !recurringForm.accountNumber) {
      toast({
        title: 'Missing Information',
        description: 'Please fill in all required fields.',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await billPaymentAPI.createRecurringPayment({
        providerId: recurringForm.providerId,
        fromAccountId: recurringForm.fromAccountId,
        amount: parseFloat(recurringForm.amount),
        accountNumber: recurringForm.accountNumber,
        frequency: recurringForm.frequency,
        startDate: recurringForm.startDate,
        description: recurringForm.description,
      });

      if (response.success) {
        toast({
          title: 'Recurring Payment Created',
          description: `Recurring payment set up successfully. Next payment: ${response.data.nextPaymentDate}`,
        });
        
        setShowRecurringModal(false);
        resetRecurringForm();
        loadData(); // Refresh data
      }
    } catch (error) {
      toast({
        title: 'Setup Failed',
        description: 'There was an error setting up recurring payment. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Manage recurring payment
  const manageRecurringPayment = async (recurringId: string, action: 'pause' | 'resume' | 'cancel') => {
    try {
      let status: 'active' | 'paused' | 'cancelled';
      switch (action) {
        case 'pause':
          status = 'paused';
          break;
        case 'resume':
          status = 'active';
          break;
        case 'cancel':
          status = 'cancelled';
          break;
      }

      if (action === 'cancel') {
        await billPaymentAPI.cancelRecurringPayment(recurringId);
      } else {
        await billPaymentAPI.updateRecurringPayment(recurringId, { status });
      }

      toast({
        title: 'Success',
        description: `Recurring payment ${action}${action.endsWith('e') ? 'd' : action === 'cancel' ? 'led' : 'ed'} successfully.`,
      });
      
      loadData(); // Refresh data
    } catch (error) {
      toast({
        title: 'Error',
        description: `Failed to ${action} recurring payment. Please try again.`,
        variant: 'destructive',
      });
    }
  };

  const resetPaymentForm = () => {
    setPaymentForm({
      providerId: '',
      providerName: '',
      fromAccountId: '',
      amount: '',
      accountNumber: '',
      description: '',
      scheduleDate: '',
    });
    setAccountValidation(null);
  };

  const resetRecurringForm = () => {
    setRecurringForm({
      providerId: '',
      providerName: '',
      fromAccountId: '',
      amount: '',
      accountNumber: '',
      frequency: 'monthly',
      startDate: '',
      description: '',
    });
  };

  const getCategoryIcon = (categoryId: string) => {
    switch (categoryId) {
      case 'utilities': return <Zap className="h-5 w-5" />;
      case 'internet': return <Wifi className="h-5 w-5" />;
      case 'insurance': return <Shield className="h-5 w-5" />;
      case 'automotive': return <Car className="h-5 w-5" />;
      case 'mortgage': return <Home className="h-5 w-5" />;
      case 'mobile': return <Phone className="h-5 w-5" />;
      case 'credit': return <CreditCard className="h-5 w-5" />;
      case 'education': return <GraduationCap className="h-5 w-5" />;
      default: return <Receipt className="h-5 w-5" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
      case 'paid':
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case 'scheduled':
        return <Badge className="bg-blue-100 text-blue-800">Scheduled</Badge>;
      case 'failed':
        return <Badge className="bg-red-100 text-red-800">Failed</Badge>;
      case 'cancelled':
        return <Badge className="bg-gray-100 text-gray-800">Cancelled</Badge>;
      case 'overdue':
        return <Badge className="bg-red-100 text-red-800">Overdue</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getFrequencyIcon = (frequency: string) => {
    switch (frequency) {
      case 'weekly': return <Clock className="h-4 w-4" />;
      case 'monthly': return <Clock className="h-4 w-4" />;
      case 'quarterly': return <Activity className="h-4 w-4" />;
      default: return <Repeat className="h-4 w-4" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading bill payment data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Button variant="ghost" onClick={onBack} className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Enhanced Bill Payment Center</h1>
              <p className="text-gray-600">Pay bills, manage recurring payments, and track your spending</p>
            </div>
            <Button onClick={() => loadData()}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        {billSummary && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Paid</p>
                    <p className="text-2xl font-bold text-gray-900">{formatCurrency(billSummary.totalPaid)}</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Fees</p>
                    <p className="text-2xl font-bold text-red-600">{formatCurrency(billSummary.totalFees)}</p>
                  </div>
                  <TrendingDown className="h-8 w-8 text-red-600" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Payments</p>
                    <p className="text-2xl font-bold text-blue-600">{billSummary.paymentCount}</p>
                  </div>
                  <Activity className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Average</p>
                    <p className="text-2xl font-bold text-purple-600">{formatCurrency(billSummary.averageAmount)}</p>
                  </div>
                  <DollarSign className="h-8 w-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Main Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="pay-bill">Pay Bill</TabsTrigger>
            <TabsTrigger value="recurring">Recurring</TabsTrigger>
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* Pay Bill Tab */}
          <TabsContent value="pay-bill" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Categories */}
              <Card>
                <CardHeader>
                  <CardTitle>Bill Categories</CardTitle>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setSelectedCategory('')}
                    className={selectedCategory === '' ? 'bg-blue-50' : ''}
                  >
                    All Categories
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {categories.map((category) => (
                      <Button
                        key={category.id}
                        variant="outline"
                        className={`w-full justify-start ${selectedCategory === category.id ? 'bg-blue-50 border-blue-200' : ''}`}
                        onClick={() => setSelectedCategory(category.id)}
                      >
                        {getCategoryIcon(category.id)}
                        <span className="ml-2">{category.name}</span>
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Providers */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>
                      Service Providers {selectedCategory && `- ${categories.find(c => c.id === selectedCategory)?.name}`}
                    </CardTitle>
                    <Button onClick={() => setShowPaymentModal(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Pay Bill
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredProviders.map((provider) => (
                      <div 
                        key={provider.id} 
                        className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                        onClick={() => {
                          setPaymentForm(prev => ({ 
                            ...prev, 
                            providerId: provider.id, 
                            providerName: provider.name 
                          }));
                          setShowPaymentModal(true);
                        }}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-medium text-gray-900">{provider.name}</h3>
                          {getCategoryIcon(provider.category)}
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{provider.description}</p>
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span>Fee: {provider.fees.type === 'fixed' ? formatCurrency(provider.fees.amount) : `${provider.fees.amount}%`}</span>
                          {provider.acceptsPartialPayments && <Badge variant="outline" className="text-xs">Partial OK</Badge>}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Recurring Payments Tab */}
          <TabsContent value="recurring" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Recurring Payments</h2>
              <Button onClick={() => setShowRecurringModal(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Set Up Recurring Payment
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {recurringPayments.map((payment) => (
                <Card key={payment.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-medium text-gray-900">{payment.providerName}</h3>
                      {getStatusBadge(payment.status)}
                    </div>
                    
                    <div className="space-y-2 text-sm text-gray-600 mb-4">
                      <div className="flex items-center">
                        {getFrequencyIcon(payment.frequency)}
                        <span className="ml-2 capitalize">{payment.frequency}</span>
                      </div>
                      <div className="flex items-center">
                        <DollarSign className="h-4 w-4" />
                        <span className="ml-2">{formatCurrency(payment.amount)}</span>
                      </div>
                      <div className="flex items-center">
                        <CalendarIcon className="h-4 w-4" />
                        <span className="ml-2">Next: {new Date(payment.nextPaymentDate).toLocaleDateString()}</span>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      {payment.status === 'active' && (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => manageRecurringPayment(payment.id, 'pause')}
                        >
                          <PauseCircle className="h-4 w-4" />
                        </Button>
                      )}
                      {payment.status === 'paused' && (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => manageRecurringPayment(payment.id, 'resume')}
                        >
                          <PlayCircle className="h-4 w-4" />
                        </Button>
                      )}
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => manageRecurringPayment(payment.id, 'cancel')}
                      >
                        <StopCircle className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Upcoming Payments Tab */}
          <TabsContent value="upcoming" className="space-y-6">
            <h2 className="text-xl font-semibold">Upcoming Payments (Next 30 Days)</h2>
            
            <div className="space-y-3">
              {upcomingPayments.map((payment, index) => (
                <Card key={payment.id || index}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div>
                          <h3 className="font-medium text-gray-900">{payment.providerName}</h3>
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <span>Account: {payment.accountNumber}</span>
                            <span>Due: {new Date(payment.dueDate).toLocaleDateString()}</span>
                            <span className="capitalize">{payment.type}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-semibold text-gray-900">{formatCurrency(payment.amount)}</p>
                        {getStatusBadge(payment.status)}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Payment History Tab */}
          <TabsContent value="history" className="space-y-6">
            <h2 className="text-xl font-semibold">Payment History</h2>
            
            <div className="space-y-3">
              {paymentHistory.map((payment) => (
                <Card key={payment.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div>
                          <h3 className="font-medium text-gray-900">{payment.providerName}</h3>
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <span>Ref: {payment.reference}</span>
                            <span>Account: {payment.accountNumber}</span>
                            <span>{new Date(payment.createdAt).toLocaleDateString()}</span>
                            {payment.fee > 0 && <span>Fee: {formatCurrency(payment.fee)}</span>}
                          </div>
                          {payment.description && (
                            <p className="text-sm text-gray-600 mt-1">{payment.description}</p>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-semibold text-gray-900">{formatCurrency(payment.amount)}</p>
                        {getStatusBadge(payment.status)}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <h2 className="text-xl font-semibold">Bill Payment Analytics</h2>
            
            {billSummary && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Top Categories */}
                <Card>
                  <CardHeader>
                    <CardTitle>Top Categories</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {billSummary.topCategories.map((category, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            {getCategoryIcon(category.category)}
                            <span className="capitalize">{category.category}</span>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">{formatCurrency(category.amount)}</p>
                            <p className="text-sm text-gray-500">{category.count} payments</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Monthly Trend */}
                <Card>
                  <CardHeader>
                    <CardTitle>Monthly Trend</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {billSummary.monthlyTrend.map((month, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <span>{month.month}</span>
                          <div className="text-right">
                            <p className="font-medium">{formatCurrency(month.amount)}</p>
                            <p className="text-sm text-gray-500">{month.count} payments</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Payment Modal */}
        <Dialog open={showPaymentModal} onOpenChange={setShowPaymentModal}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Pay Bill</DialogTitle>
              <DialogDescription>Make a one-time bill payment</DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              {/* Provider Selection */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Service Provider</Label>
                  <Select 
                    value={paymentForm.providerId} 
                    onValueChange={(value) => {
                      const provider = providers.find(p => p.id === value);
                      setPaymentForm(prev => ({ 
                        ...prev, 
                        providerId: value, 
                        providerName: provider?.name || '' 
                      }));
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select provider" />
                    </SelectTrigger>
                    <SelectContent>
                      {providers.map((provider) => (
                        <SelectItem key={provider.id} value={provider.id}>
                          {provider.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Pay From Account</Label>
                  <Select 
                    value={paymentForm.fromAccountId} 
                    onValueChange={(value) => setPaymentForm(prev => ({ ...prev, fromAccountId: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select account" />
                    </SelectTrigger>
                    <SelectContent>
                      {accounts.map((account) => (
                        <SelectItem key={account.id} value={account.id}>
                          {account.accountType} ({account.accountNumber}) - {formatCurrency(account.balance)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Account Number and Validation */}
              <div>
                <Label>Account Number</Label>
                <div className="flex space-x-2">
                  <Input
                    value={paymentForm.accountNumber}
                    onChange={(e) => setPaymentForm(prev => ({ ...prev, accountNumber: e.target.value }))}
                    placeholder="Your account number with the provider"
                  />
                  <Button 
                    variant="outline"
                    onClick={() => validateAccount(paymentForm.providerId, paymentForm.accountNumber)}
                    disabled={!paymentForm.providerId || !paymentForm.accountNumber || validatingAccount}
                  >
                    {validatingAccount ? 'Validating...' : 'Validate'}
                  </Button>
                </div>
                {accountValidation && (
                  <div className={`mt-2 p-2 rounded text-sm ${accountValidation.valid ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                    {accountValidation.valid ? (
                      <div>
                        <p>✓ Account validated</p>
                        {accountValidation.accountName && <p>Account Name: {accountValidation.accountName}</p>}
                        {accountValidation.currentBalance && <p>Current Balance: {formatCurrency(accountValidation.currentBalance)}</p>}
                        {accountValidation.dueDate && <p>Due Date: {new Date(accountValidation.dueDate).toLocaleDateString()}</p>}
                      </div>
                    ) : (
                      <p>✗ Invalid account number</p>
                    )}
                  </div>
                )}
              </div>

              {/* Amount and Schedule */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Amount</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={paymentForm.amount}
                    onChange={(e) => setPaymentForm(prev => ({ ...prev, amount: e.target.value }))}
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <Label>Schedule Date (Optional)</Label>
                  <Input
                    type="date"
                    value={paymentForm.scheduleDate}
                    onChange={(e) => setPaymentForm(prev => ({ ...prev, scheduleDate: e.target.value }))}
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <Label>Description (Optional)</Label>
                <Textarea
                  value={paymentForm.description}
                  onChange={(e) => setPaymentForm(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Payment description or memo"
                />
              </div>

              {/* Actions */}
              <div className="flex space-x-3">
                <Button variant="outline" onClick={() => setShowPaymentModal(false)}>
                  Cancel
                </Button>
                <Button onClick={submitPayment} disabled={isSubmitting}>
                  {isSubmitting ? 'Processing...' : 'Pay Bill'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Recurring Payment Modal */}
        <Dialog open={showRecurringModal} onOpenChange={setShowRecurringModal}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Set Up Recurring Payment</DialogTitle>
              <DialogDescription>Create an automatic recurring bill payment</DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              {/* Provider and Account */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Service Provider</Label>
                  <Select 
                    value={recurringForm.providerId} 
                    onValueChange={(value) => {
                      const provider = providers.find(p => p.id === value);
                      setRecurringForm(prev => ({ 
                        ...prev, 
                        providerId: value, 
                        providerName: provider?.name || '' 
                      }));
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select provider" />
                    </SelectTrigger>
                    <SelectContent>
                      {providers.map((provider) => (
                        <SelectItem key={provider.id} value={provider.id}>
                          {provider.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Pay From Account</Label>
                  <Select 
                    value={recurringForm.fromAccountId} 
                    onValueChange={(value) => setRecurringForm(prev => ({ ...prev, fromAccountId: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select account" />
                    </SelectTrigger>
                    <SelectContent>
                      {accounts.map((account) => (
                        <SelectItem key={account.id} value={account.id}>
                          {account.accountType} ({account.accountNumber}) - {formatCurrency(account.balance)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Account Number and Amount */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Account Number</Label>
                  <Input
                    value={recurringForm.accountNumber}
                    onChange={(e) => setRecurringForm(prev => ({ ...prev, accountNumber: e.target.value }))}
                    placeholder="Your account number"
                  />
                </div>

                <div>
                  <Label>Amount</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={recurringForm.amount}
                    onChange={(e) => setRecurringForm(prev => ({ ...prev, amount: e.target.value }))}
                    placeholder="0.00"
                  />
                </div>
              </div>

              {/* Frequency and Start Date */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Frequency</Label>
                  <Select 
                    value={recurringForm.frequency} 
                    onValueChange={(value: 'weekly' | 'monthly' | 'quarterly') => 
                      setRecurringForm(prev => ({ ...prev, frequency: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="quarterly">Quarterly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Start Date</Label>
                  <Input
                    type="date"
                    value={recurringForm.startDate}
                    onChange={(e) => setRecurringForm(prev => ({ ...prev, startDate: e.target.value }))}
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <Label>Description (Optional)</Label>
                <Textarea
                  value={recurringForm.description}
                  onChange={(e) => setRecurringForm(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Payment description or memo"
                />
              </div>

              {/* Actions */}
              <div className="flex space-x-3">
                <Button variant="outline" onClick={() => setShowRecurringModal(false)}>
                  Cancel
                </Button>
                <Button onClick={submitRecurringPayment} disabled={isSubmitting}>
                  {isSubmitting ? 'Setting Up...' : 'Create Recurring Payment'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
