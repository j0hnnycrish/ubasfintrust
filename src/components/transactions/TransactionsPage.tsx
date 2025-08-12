import { useState } from 'react';
import { useBankingStore } from '@/lib/bankingStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Search, Filter, Download, ArrowDownLeft, ArrowUpRight, CreditCard, Minus, Plus } from 'lucide-react';
import { Transaction } from '@/types/banking';

interface TransactionsPageProps {
  onBack: () => void;
}

export function TransactionsPage({ onBack }: TransactionsPageProps) {
  const { accounts, getTransactionsByAccountId, formatCurrency } = useBankingStore();
  const [selectedAccountId, setSelectedAccountId] = useState(accounts[0]?.id || '');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  const transactions = selectedAccountId ? getTransactionsByAccountId(selectedAccountId) : [];
  
  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = searchQuery === '' || 
      transaction.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transaction.reference.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transaction.recipientName?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || transaction.status === statusFilter;
    const matchesType = typeFilter === 'all' || transaction.type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const getTransactionIcon = (transaction: Transaction) => {
    // Use differing depths of brand red to imply direction/type while keeping single hue family
    if (transaction.toAccountId === selectedAccountId || transaction.type === 'deposit') {
      return <ArrowDownLeft className="h-4 w-4 text-brand-600" />;
    } else if (transaction.type === 'withdrawal') {
      return <Minus className="h-4 w-4 text-brand-700" />;
    } else if (transaction.type === 'payment') {
      return <CreditCard className="h-4 w-4 text-brand-500" />;
    } else {
      return <ArrowUpRight className="h-4 w-4 text-brand-700" />;
    }
  };

  const getTransactionAmount = (transaction: Transaction) => {
    if (transaction.toAccountId === selectedAccountId) {
      return `+${formatCurrency(transaction.amount)}`;
    } else {
      return `-${formatCurrency(transaction.amount)}`;
    }
  };

  const getAmountColor = (transaction: Transaction) => {
    return transaction.toAccountId === selectedAccountId || transaction.type === 'deposit'
      ? 'text-brand-600'
      : 'text-brand-700';
  };

  const getStatusColor = (status: string) => {
    // Map all statuses into red shade variants
    switch (status) {
      case 'completed':
        return 'bg-brand-100 text-brand-700 border-brand-200';
      case 'pending':
        return 'bg-brand-50 text-brand-600 border-brand-200';
      case 'failed':
        return 'bg-brand-200 text-brand-800 border-brand-300';
      case 'cancelled':
        return 'bg-brand-50 text-brand-500 border-brand-100';
      default:
        return 'bg-brand-50 text-brand-600 border-brand-100';
    }
  };

  const selectedAccount = accounts.find(acc => acc.id === selectedAccountId);

  return (
  <div className="min-h-screen bg-gradient-to-b from-brand-50 via-white to-brand-50 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <Button
            variant="banking-outline"
            onClick={onBack}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          
          <h1 className="text-3xl font-bold text-brand-800">Transaction History</h1>
          <p className="text-brand-600 mt-2">View and manage your transaction history</p>
        </div>

        {/* Account Selector and Filters */}
  <Card className="mb-6 shadow-card-banking bg-white/80 backdrop-blur border border-brand-200">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-brand-800">Filters & Account</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {/* Account Selector */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-brand-700">Account</label>
                <Select value={selectedAccountId} onValueChange={setSelectedAccountId}>
                  <SelectTrigger className="border-brand-200 focus:border-brand-500 focus:ring-1 focus:ring-brand-500">
                    <SelectValue placeholder="Select account" />
                  </SelectTrigger>
                  <SelectContent>
                    {accounts.map((account) => (
                      <SelectItem key={account.id} value={account.id}>
                        {account.accountType.charAt(0).toUpperCase() + account.accountType.slice(1)} - ****{account.accountNumber.slice(-4)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Search */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-brand-700">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-brand-500" />
                  <Input
                    placeholder="Search transactions..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 border-brand-200 focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
                  />
                </div>
              </div>

              {/* Status Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-brand-700">Status</label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="border-brand-200 focus:border-brand-500 focus:ring-1 focus:ring-brand-500">
                    <SelectValue placeholder="All statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Type Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-brand-700">Type</label>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="border-brand-200 focus:border-brand-500 focus:ring-1 focus:ring-brand-500">
                    <SelectValue placeholder="All types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="transfer">Transfer</SelectItem>
                    <SelectItem value="deposit">Deposit</SelectItem>
                    <SelectItem value="withdrawal">Withdrawal</SelectItem>
                    <SelectItem value="payment">Payment</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Export Button */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-brand-700">Export</label>
                <Button variant="outline" className="w-full">
                  <Download className="h-4 w-4 mr-2" />
                  Export CSV
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Account Summary */}
        {selectedAccount && (
          <Card className="mb-6 shadow-card-banking bg-brand-100 border border-brand-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between text-brand-800">
                <div>
                  <h3 className="text-lg font-semibold">
                    {selectedAccount.accountType.charAt(0).toUpperCase() + selectedAccount.accountType.slice(1)} Account
                  </h3>
                  <p className="opacity-75">****{selectedAccount.accountNumber.slice(-4)}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-brand-600">Current Balance</p>
                  <p className="text-2xl font-bold">{formatCurrency(selectedAccount.balance)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Transactions List */}
  <Card className="shadow-card-banking bg-white/80 backdrop-blur border border-brand-200">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl font-bold text-brand-800">
                Transactions ({filteredTransactions.length})
              </CardTitle>
              <div className="flex items-center space-x-2">
                <Filter className="h-4 w-4 text-brand-500" />
                <span className="text-sm text-brand-600">
                  {filteredTransactions.length} of {transactions.length} transactions
                </span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {filteredTransactions.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-brand-600 text-lg">No transactions found</p>
                <p className="text-brand-600 text-sm mt-2">
                  Try adjusting your filters or search criteria
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredTransactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between p-4 bg-white/70 rounded-lg border border-brand-200/60 hover:shadow-md transition-all hover:bg-white"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="p-3 bg-brand-100 rounded-lg">
                        {getTransactionIcon(transaction)}
                      </div>
                      <div className="space-y-1">
                        <p className="font-semibold text-brand-800">{transaction.description}</p>
                        <div className="flex items-center space-x-3">
                          <p className="text-sm text-brand-600">
                            {transaction.timestamp.toLocaleDateString()} at {transaction.timestamp.toLocaleTimeString()}
                          </p>
                          <Badge className={getStatusColor(transaction.status)}>
                            {transaction.status}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {transaction.type}
                          </Badge>
                        </div>
                        {transaction.recipientName && (
                          <p className="text-sm text-brand-600">
                            {transaction.toAccountId === selectedAccountId ? 'From' : 'To'}: {transaction.recipientName}
                          </p>
                        )}
                        <p className="text-xs text-brand-500 font-mono">{transaction.reference}</p>
                      </div>
                    </div>
                    
                    <div className="text-right space-y-1">
                      <p className={`text-lg font-bold ${getAmountColor(transaction)}`}>
                        {getTransactionAmount(transaction)}
                      </p>
                      {transaction.category && (
                        <Badge variant="secondary" className="text-xs">
                          {transaction.category}
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}