import React, { useState, useEffect } from 'react';
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
  DollarSign,
  FileText,
  CheckCircle,
  AlertCircle,
  Loader2,
  ArrowUpRight,
  ArrowDownLeft,
  Clock,
  X
} from 'lucide-react';

export function TransactionManagement() {
  const { customers, transactions, txMeta, fetchAccountTransactions, createTransaction } = useAdmin();
  const [loadingTx, setLoadingTx] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeAccount, setActiveAccount] = useState<string>('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    customerId: '',
    accountId: '',
    description: '',
    amount: '',
    type: 'debit' as 'credit' | 'debit',
    category: '',
    date: new Date().toISOString().split('T')[0]
  });

  // Get all accounts from all customers for selection
  const allAccounts = customers.flatMap(customer => 
    customer.accounts.map(account => ({
      ...account,
      customerName: customer.fullName,
      customerId: customer.id
    }))
  );

  const scoped = activeAccount ? transactions.filter(t=>t.accountId===activeAccount) : transactions;
  const filteredTransactions = scoped.filter(transaction => {
    const customer = customers.find(c => c.id === transaction.customerId);
    const account = customer?.accounts.find(a => a.id === transaction.accountId);
    
    return (
      transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer?.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      account?.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const resetForm = () => {
    setFormData({
      customerId: '',
      accountId: '',
      description: '',
      amount: '',
      type: 'debit',
      category: '',
      date: new Date().toISOString().split('T')[0]
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
    if (!formData.accountId || !formData.description || !formData.amount || !formData.category) {
      setError('Please fill in all required fields');
      setIsSubmitting(false);
      return;
    }

    const amount = parseFloat(formData.amount);
    if (isNaN(amount) || amount <= 0) {
      setError('Please enter a valid amount');
      setIsSubmitting(false);
      return;
    }

    try {
      const transactionData = {
        accountId: formData.accountId,
        customerId: formData.customerId,
        description: formData.description,
        amount: formData.type === 'debit' ? -amount : amount,
        type: formData.type,
        category: formData.category,
        date: formData.date
      };

      const result = await createTransaction(transactionData);

      if (result.success) {
        setSuccess('Transaction created successfully');
        setShowCreateModal(false);
        resetForm();
      } else {
        setError(result.error || 'Failed to create transaction');
      }
    } catch (error) {
      setError('An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCustomerChange = (customerId: string) => {
    setFormData(prev => ({ 
      ...prev, 
      customerId, 
      accountId: '' // Reset account when customer changes
    }));
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(Math.abs(amount));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const categories = [
    'Income',
    'Shopping',
    'Utilities',
    'Food & Dining',
    'Transportation',
    'Healthcare',
    'Entertainment',
    'Transfer',
    'Interest',
    'Fees',
    'Other'
  ];

  useEffect(()=>{
    // initial load: fetch recent transactions for first account if any
    if (!activeAccount && customers.length>0) {
      const firstAcc = customers[0].accounts[0];
      if (firstAcc) { setActiveAccount(firstAcc.id); fetchAccountTransactions(firstAcc.id,1,25); }
    }
  }, [customers]);

  const handleAccountSelect = async (accountId:string) => {
    setActiveAccount(accountId);
    setLoadingTx(true);
    await fetchAccountTransactions(accountId,1,25);
    setLoadingTx(false);
  };

  const accountPagination = activeAccount ? txMeta[activeAccount] : undefined;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Transaction Management</h2>
          <p className="text-gray-600">Create and manage customer transactions</p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={activeAccount} onValueChange={handleAccountSelect}>
            <SelectTrigger className="w-64">
              <SelectValue placeholder="Select account to view" />
            </SelectTrigger>
            <SelectContent>
              {customers.flatMap(c=>c.accounts.map(a=>({a,c}))).map(({a,c})=> (
                <SelectItem key={a.id} value={a.id}>{c.fullName} • {a.name} ({a.accountNumber})</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="outline" disabled={!activeAccount || loadingTx} onClick={async()=> { if (!activeAccount) return; setLoadingTx(true); await fetchAccountTransactions(activeAccount, (accountPagination?.page||1), accountPagination?.limit||25); setLoadingTx(false);} }>{loadingTx? <Loader2 className="h-4 w-4 animate-spin" /> : 'Refresh'}</Button>
        </div>
        <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
          <DialogTrigger asChild>
            <Button onClick={resetForm} className="bg-purple-600 hover:bg-purple-700">
              <Plus className="h-4 w-4 mr-2" />
              Add Transaction
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Create New Transaction</DialogTitle>
              <DialogDescription>Add a transaction to a customer account</DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="customerId">Customer *</Label>
                <Select 
                  value={formData.customerId} 
                  onValueChange={handleCustomerChange}
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

              <div className="space-y-2">
                <Label htmlFor="accountId">Account *</Label>
                <Select 
                  value={formData.accountId} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, accountId: value }))}
                  disabled={!formData.customerId}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select account" />
                  </SelectTrigger>
                  <SelectContent>
                    {allAccounts
                      .filter(account => account.customerId === formData.customerId)
                      .map((account) => (
                        <SelectItem key={account.id} value={account.id}>
                          {account.name} ({account.accountNumber}) - {formatCurrency(account.balance)}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="type">Transaction Type</Label>
                  <Select 
                    value={formData.type} 
                    onValueChange={(value: any) => setFormData(prev => ({ ...prev, type: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="credit">
                        <div className="flex items-center">
                          <ArrowDownLeft className="h-4 w-4 mr-2 text-green-600" />
                          Credit (Money In)
                        </div>
                      </SelectItem>
                      <SelectItem value="debit">
                        <div className="flex items-center">
                          <ArrowUpRight className="h-4 w-4 mr-2 text-red-600" />
                          Debit (Money Out)
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="amount">Amount *</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="amount"
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.amount}
                      onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                      placeholder="0.00"
                      className="pl-10"
                      disabled={isSubmitting}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Input
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Transaction description"
                  disabled={isSubmitting}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select 
                    value={formData.category} 
                    onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
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
                  className="flex-1 bg-purple-600 hover:bg-purple-700"
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
                      Create Transaction
                    </>
                  )}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center space-x-2">
            <Search className="h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search transactions by description, category, customer, or account..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1"
            />
          </div>
        </CardContent>
      </Card>

    {/* Transaction List */}
      <Card>
        <CardHeader>
      <CardTitle>Transactions {activeAccount && accountPagination ? `(Page ${accountPagination.page}${accountPagination.totalPages? ' of '+accountPagination.totalPages:''})` : `(${filteredTransactions.length})`}</CardTitle>
      <CardDescription>{activeAccount? 'Transactions for selected account' : 'All loaded transactions'}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {loadingTx && <div className="flex items-center text-sm text-gray-500"><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Loading transactions...</div>}
            {!loadingTx && filteredTransactions.map((transaction) => {
              const customer = customers.find(c => c.id === transaction.customerId);
              const account = customer?.accounts.find(a => a.id === transaction.accountId);
              
              return (
                <div key={transaction.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      transaction.type === 'credit' ? 'bg-green-100' : 'bg-red-100'
                    }`}>
                      {transaction.type === 'credit' ? (
                        <ArrowDownLeft className="h-5 w-5 text-green-600" />
                      ) : (
                        <ArrowUpRight className="h-5 w-5 text-red-600" />
                      )}
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{transaction.description}</h4>
                      <p className="text-sm text-gray-500">
                        {customer?.fullName} • {account?.name} ({account?.accountNumber})
                      </p>
                      <p className="text-xs text-gray-400">
                        {transaction.category} • {transaction.date} • Ref: {transaction.reference}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className={`text-lg font-semibold ${
                        transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {transaction.type === 'credit' ? '+' : '-'}{formatCurrency(transaction.amount)}
                      </p>
                      <Badge className={getStatusColor(transaction.status)}>
                        {transaction.status}
                      </Badge>
                    </div>
                  </div>
                </div>
              );
            })}
            
            {!loadingTx && filteredTransactions.length === 0 && (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No transactions found</h3>
                <p className="text-gray-500">
                  {searchTerm ? 'Try adjusting your search terms' : 'Get started by creating your first transaction'}
                </p>
              </div>
            )}
            {activeAccount && accountPagination && accountPagination.totalPages && accountPagination.totalPages > 1 && (
              <div className="flex items-center justify-between pt-4 border-t">
                <div className="text-xs text-gray-500">Page {accountPagination.page} of {accountPagination.totalPages}{typeof accountPagination.total !== 'undefined' && ` • ${accountPagination.total} total`}</div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" disabled={accountPagination.page<=1 || loadingTx} onClick={async()=>{ setLoadingTx(true); await fetchAccountTransactions(activeAccount, (accountPagination.page-1), accountPagination.limit); setLoadingTx(false);} }>Prev</Button>
                  <Button variant="outline" size="sm" disabled={accountPagination.page>= (accountPagination.totalPages||1) || loadingTx} onClick={async()=>{ setLoadingTx(true); await fetchAccountTransactions(activeAccount, (accountPagination.page+1), accountPagination.limit); setLoadingTx(false);} }>Next</Button>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
