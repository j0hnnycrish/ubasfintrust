import { Transaction } from '@/types/banking';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useBankingStore } from '@/lib/bankingStore';
import { ArrowDownLeft, ArrowUpRight, CreditCard, Minus, Plus } from 'lucide-react';

interface TransactionHistoryProps {
  accountId: string;
  limit?: number;
}

export function TransactionHistory({ accountId, limit = 5 }: TransactionHistoryProps) {
  const getTransactionsByAccountId = useBankingStore((state) => state.getTransactionsByAccountId);
  const formatCurrency = useBankingStore((state) => state.formatCurrency);
  const transactions = getTransactionsByAccountId(accountId).slice(0, limit);

  const getTransactionIcon = (transaction: Transaction) => {
    if (transaction.toAccountId === accountId) {
      // Incoming transaction
      return <ArrowDownLeft className="h-4 w-4 text-green-600" />;
    } else if (transaction.type === 'deposit') {
      return <Plus className="h-4 w-4 text-green-600" />;
    } else if (transaction.type === 'withdrawal') {
      return <Minus className="h-4 w-4 text-red-600" />;
    } else if (transaction.type === 'payment') {
      return <CreditCard className="h-4 w-4 text-blue-600" />;
    } else {
      // Outgoing transaction
      return <ArrowUpRight className="h-4 w-4 text-red-600" />;
    }
  };

  const getTransactionAmount = (transaction: Transaction) => {
    if (transaction.toAccountId === accountId) {
      // Incoming transaction - show as positive
      return `+${formatCurrency(transaction.amount)}`;
    } else {
      // Outgoing transaction - show as negative
      return `-${formatCurrency(transaction.amount)}`;
    }
  };

  const getAmountColor = (transaction: Transaction) => {
    if (transaction.toAccountId === accountId || transaction.type === 'deposit') {
      return 'text-green-600';
    } else {
      return 'text-red-600';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'failed':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'cancelled':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (transactions.length === 0) {
    return (
      <Card className="shadow-card-banking bg-gradient-card border-banking-gold/20">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-banking-dark">Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-banking-gray">No transactions found</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-card-banking bg-gradient-card border-banking-gold/20">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-banking-dark">Recent Transactions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {transactions.map((transaction) => (
            <div
              key={transaction.id}
              className="flex items-center justify-between p-4 bg-white/50 rounded-lg border border-banking-gold/10 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-banking-gold/10 rounded-lg">
                  {getTransactionIcon(transaction)}
                </div>
                <div className="space-y-1">
                  <p className="font-medium text-banking-dark">{transaction.description}</p>
                  <div className="flex items-center space-x-2">
                    <p className="text-sm text-banking-gray">
                      {transaction.timestamp.toLocaleDateString()}
                    </p>
                    <Badge className={getStatusColor(transaction.status)}>
                      {transaction.status}
                    </Badge>
                  </div>
                  {transaction.recipientName && (
                    <p className="text-sm text-banking-gray">
                      {transaction.toAccountId === accountId ? 'From' : 'To'}: {transaction.recipientName}
                    </p>
                  )}
                </div>
              </div>
              
              <div className="text-right space-y-1">
                <p className={`font-bold ${getAmountColor(transaction)}`}>
                  {getTransactionAmount(transaction)}
                </p>
                <p className="text-xs text-banking-gray">{transaction.reference}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}