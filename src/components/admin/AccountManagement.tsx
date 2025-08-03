import React, { useState } from 'react';
import { useAdmin } from '@/contexts/AdminContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Plus, 
  Search, 
  Edit, 
  DollarSign,
  CreditCard,
  CheckCircle,
  AlertCircle,
  Loader2,
  PiggyBank,
  Building,
  TrendingUp,
  Briefcase
} from 'lucide-react';

export function AccountManagement() {
  const { customers, createAccount, updateAccount, updateAccountBalance } = useAdmin();
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showBalanceModal, setShowBalanceModal] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    customerId: '',
    name: '',
    type: 'checking' as 'checking' | 'savings' | 'credit' | 'investment' | 'business',
    balance: '',
    interestRate: '',
    creditLimit: ''
  });

  const [balanceData, setBalanceData] = useState({
    newBalance: ''
  });

  // Get all accounts from all customers
  const allAccounts = customers.flatMap(customer => 
    customer.accounts.map(account => ({
      ...account,
      customerName: customer.fullName,
      customerEmail: customer.email
    }))
  );

  const filteredAccounts = allAccounts.filter(account =>
    account.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    account.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    account.accountNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const resetForm = () => {
    setFormData({
      customerId: '',
      name: '',
      type: 'checking',
      balance: '',
      interestRate: '',
      creditLimit: ''
    });
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsSubmitting(true);

    // Validation
    if (!formData.customerId || !formData.name || !formData.balance) {
      setError('Please fill in all required fields');
      setIsSubmitting(false);
      return;
    }

    const balance = parseFloat(formData.balance);
    if (isNaN(balance) || balance < 0) {
      setError('Please enter a valid balance amount');
      setIsSubmitting(false);
      return;
    }

    try {
      const accountData = {
        name: formData.name,
        type: formData.type,
        balance: balance,
        ...(formData.interestRate && { interestRate: parseFloat(formData.interestRate) }),
        ...(formData.creditLimit && { creditLimit: parseFloat(formData.creditLimit) })
      };

      const result = await createAccount(formData.customerId, accountData);

      if (result.success) {
        setSuccess('Account created successfully');
        setShowCreateModal(false);
        resetForm();
      } else {
        setError(result.error || 'Failed to create account');
      }
    } catch (error) {
      setError('An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBalanceUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsSubmitting(true);

    const newBalance = parseFloat(balanceData.newBalance);
    if (isNaN(newBalance) || newBalance < 0) {
      setError('Please enter a valid balance amount');
      setIsSubmitting(false);
      return;
    }

    try {
      const result = await updateAccountBalance(selectedAccount.id, newBalance);

      if (result.success) {
        setSuccess('Account balance updated successfully');
        setShowBalanceModal(false);
        setBalanceData({ newBalance: '' });
        setSelectedAccount(null);
      } else {
        setError(result.error || 'Failed to update balance');
      }
    } catch (error) {
      setError('An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const openBalanceModal = (account: any) => {
    setSelectedAccount(account);
    setBalanceData({ newBalance: account.balance.toString() });
    setShowBalanceModal(true);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getAccountIcon = (type: string) => {
    switch (type) {
      case 'checking': return CreditCard;
      case 'savings': return PiggyBank;
      case 'business': return Building;
      case 'investment': return TrendingUp;
      case 'credit': return Briefcase;
      default: return DollarSign;
    }
  };

  const getAccountColor = (type: string) => {
    switch (type) {
      case 'checking': return 'bg-blue-100 text-blue-600';
      case 'savings': return 'bg-green-100 text-green-600';
      case 'business': return 'bg-purple-100 text-purple-600';
      case 'investment': return 'bg-yellow-100 text-yellow-600';
      case 'credit': return 'bg-red-100 text-red-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Account Management</h2>
          <p className="text-gray-600">Manage customer accounts and balances</p>
        </div>
        <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
          <DialogTrigger asChild>
            <Button onClick={resetForm} className="bg-green-600 hover:bg-green-700">
              <Plus className="h-4 w-4 mr-2" />
              Create Account
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Create New Account</DialogTitle>
              <DialogDescription>Add a new account for a customer</DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="customerId">Customer *</Label>
                <Select 
                  value={formData.customerId} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, customerId: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select customer" />
                  </SelectTrigger>
                  <SelectContent>
                    {customers.map((customer) => (
                      <SelectItem key={customer.id} value={customer.id}>
                        {customer.fullName} ({customer.email})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Account Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Primary Checking"
                    disabled={isSubmitting}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">Account Type</Label>
                  <Select 
                    value={formData.type} 
                    onValueChange={(value: any) => setFormData(prev => ({ ...prev, type: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="checking">Checking</SelectItem>
                      <SelectItem value="savings">Savings</SelectItem>
                      <SelectItem value="credit">Credit</SelectItem>
                      <SelectItem value="investment">Investment</SelectItem>
                      <SelectItem value="business">Business</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="balance">Initial Balance *</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="balance"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.balance}
                    onChange={(e) => setFormData(prev => ({ ...prev, balance: e.target.value }))}
                    placeholder="0.00"
                    className="pl-10"
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              {formData.type === 'savings' && (
                <div className="space-y-2">
                  <Label htmlFor="interestRate">Interest Rate (%)</Label>
                  <Input
                    id="interestRate"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.interestRate}
                    onChange={(e) => setFormData(prev => ({ ...prev, interestRate: e.target.value }))}
                    placeholder="4.25"
                    disabled={isSubmitting}
                  />
                </div>
              )}

              {formData.type === 'credit' && (
                <div className="space-y-2">
                  <Label htmlFor="creditLimit">Credit Limit</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="creditLimit"
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.creditLimit}
                      onChange={(e) => setFormData(prev => ({ ...prev, creditLimit: e.target.value }))}
                      placeholder="5000.00"
                      className="pl-10"
                      disabled={isSubmitting}
                    />
                  </div>
                </div>
              )}

              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {success && (
                <Alert className="bg-green-50 border-green-200">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-800">{success}</AlertDescription>
                </Alert>
              )}

              <div className="flex space-x-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1"
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  className="flex-1 bg-green-600 hover:bg-green-700"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Plus className="mr-2 h-4 w-4" />
                      Create Account
                    </>
                  )}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Balance Update Modal */}
      <Dialog open={showBalanceModal} onOpenChange={setShowBalanceModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Update Account Balance</DialogTitle>
            <DialogDescription>
              Update balance for {selectedAccount?.name} ({selectedAccount?.accountNumber})
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleBalanceUpdate} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="currentBalance">Current Balance</Label>
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-lg font-semibold">
                  {selectedAccount && formatCurrency(selectedAccount.balance)}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="newBalance">New Balance *</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="newBalance"
                  type="number"
                  step="0.01"
                  min="0"
                  value={balanceData.newBalance}
                  onChange={(e) => setBalanceData({ newBalance: e.target.value })}
                  placeholder="0.00"
                  className="pl-10"
                  disabled={isSubmitting}
                />
              </div>
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
                onClick={() => setShowBalanceModal(false)}
                className="flex-1"
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="flex-1 bg-blue-600 hover:bg-blue-700"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  <>
                    <DollarSign className="mr-2 h-4 w-4" />
                    Update Balance
                  </>
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center space-x-2">
            <Search className="h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search accounts by name, customer, or account number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1"
            />
          </div>
        </CardContent>
      </Card>

      {/* Account List */}
      <Card>
        <CardHeader>
          <CardTitle>Accounts ({filteredAccounts.length})</CardTitle>
          <CardDescription>All customer accounts in the system</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredAccounts.map((account) => {
              const Icon = getAccountIcon(account.type);
              return (
                <div key={account.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getAccountColor(account.type)}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{account.name}</h4>
                      <p className="text-sm text-gray-500">{account.customerName}</p>
                      <p className="text-xs text-gray-400">{account.accountNumber} • {account.type}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="text-lg font-semibold">{formatCurrency(account.balance)}</p>
                      {account.interestRate && (
                        <p className="text-xs text-green-600">{account.interestRate}% APY</p>
                      )}
                      {account.creditLimit && (
                        <p className="text-xs text-gray-500">Limit: {formatCurrency(account.creditLimit)}</p>
                      )}
                      <Badge className={account.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                        {account.status}
                      </Badge>
                    </div>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openBalanceModal(account)}
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Update Balance
                    </Button>
                  </div>
                </div>
              );
            })}
            
            {filteredAccounts.length === 0 && (
              <div className="text-center py-8">
                <CreditCard className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No accounts found</h3>
                <p className="text-gray-500">
                  {searchTerm ? 'Try adjusting your search terms' : 'Get started by creating your first account'}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
