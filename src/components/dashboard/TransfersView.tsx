import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useAdmin } from '@/contexts/AdminContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TransferModal } from '../banking/TransferModal';
import {
  ArrowUpRight,
  ArrowDownLeft,
  Plus,
  Clock,
  CheckCircle,
  AlertCircle,
  Globe,
  Building,
  CreditCard,
  Smartphone,
  Shield
} from 'lucide-react';

export function TransfersView() {
  const { user } = useAuth();
  const { customers, transactions } = useAdmin();
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [selectedTransferType, setSelectedTransferType] = useState<string>('');

  // Get customer data and transfer transactions
  const customer = customers.find(c => c.username === user?.username);
  const customerAccountIds = customer?.accounts.map(acc => acc.id) || [];
  
  const transferTransactions = transactions
    .filter(txn => 
      customerAccountIds.includes(txn.accountId) && 
      (txn.category === 'Transfer' || txn.description.toLowerCase().includes('transfer'))
    )
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(Math.abs(amount));
  };

  const getAccountName = (accountId: string) => {
    const account = customer?.accounts.find(acc => acc.id === accountId);
    return account ? `${account.name} (${account.accountNumber})` : 'Unknown Account';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const transferTypes = [
    {
      id: 'internal',
      title: 'Between My Accounts',
      description: 'Transfer money between your UBAS accounts',
      icon: CreditCard,
      fee: 'Free',
      time: 'Instant',
      color: 'bg-blue-100 text-blue-600 border-blue-200'
    },
    {
      id: 'external',
      title: 'External Transfer (ACH)',
      description: 'Send money to other US banks',
      icon: Building,
      fee: '$3.00',
      time: '1-3 business days',
      color: 'bg-green-100 text-green-600 border-green-200'
    },
    {
      id: 'wire',
      title: 'Domestic Wire',
      description: 'Fast same-day wire transfer',
      icon: ArrowUpRight,
      fee: '$25.00',
      time: 'Same day',
      color: 'bg-purple-100 text-purple-600 border-purple-200'
    },
    {
      id: 'international',
      title: 'International Wire',
      description: 'Send money worldwide via SWIFT',
      icon: Globe,
      fee: '$45.00',
      time: '1-5 business days',
      color: 'bg-orange-100 text-orange-600 border-orange-200'
    },
    {
      id: 'mobile',
      title: 'Mobile Payment',
      description: 'Send money via phone number or email',
      icon: Smartphone,
      fee: 'Free',
      time: 'Instant',
      color: 'bg-pink-100 text-pink-600 border-pink-200'
    }
  ];

  const handleTransferTypeSelect = (type: string) => {
    setSelectedTransferType(type);
    setShowTransferModal(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Transfers</h2>
          <p className="text-gray-600">Send money and manage your transfers</p>
        </div>
      </div>

      {/* Transfer Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {transferTypes.map((type) => {
          const Icon = type.icon;
          return (
            <Card 
              key={type.id} 
              className="hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => handleTransferTypeSelect(type.id)}
            >
              <CardHeader>
                <div className="flex items-center space-x-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 ${type.color}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{type.title}</CardTitle>
                    <CardDescription className="text-sm">
                      {type.description}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-600">Fee: <span className="font-medium">{type.fee}</span></p>
                    <p className="text-sm text-gray-600">Time: <span className="font-medium">{type.time}</span></p>
                  </div>
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="h-4 w-4 mr-1" />
                    Send
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Recent Transfers */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Transfers</CardTitle>
          <CardDescription>Your latest transfer activity</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {transferTransactions.length > 0 ? (
              transferTransactions.slice(0, 10).map((transaction) => (
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
                        {getAccountName(transaction.accountId)}
                      </p>
                      <p className="text-xs text-gray-400">
                        {transaction.date} • Ref: {transaction.reference}
                      </p>
                    </div>
                  </div>
                  
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
              ))
            ) : (
              <div className="text-center py-12">
                <ArrowUpRight className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No Transfers Yet</h3>
                <p className="text-gray-600 mb-6">
                  You haven't made any transfers yet. Start by sending money to another account.
                </p>
                <Button 
                  onClick={() => setShowTransferModal(true)}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Make Your First Transfer
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Transfer Limits & Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="h-5 w-5 mr-2" />
              Transfer Limits
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-600">Daily limit:</span>
              <span className="font-medium">$10,000</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Monthly limit:</span>
              <span className="font-medium">$50,000</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">International limit:</span>
              <span className="font-medium">$25,000</span>
            </div>
            <div className="pt-2 border-t">
              <p className="text-sm text-gray-500">
                Limits may vary based on your account type and verification status.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="h-5 w-5 mr-2" />
              Processing Times
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-600">Internal transfers:</span>
              <span className="font-medium">Instant</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">ACH transfers:</span>
              <span className="font-medium">1-3 business days</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Wire transfers:</span>
              <span className="font-medium">Same day</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">International:</span>
              <span className="font-medium">1-5 business days</span>
            </div>
            <div className="pt-2 border-t">
              <p className="text-sm text-gray-500">
                Processing times may vary based on destination and cut-off times.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Transfer Modal */}
      <TransferModal
        isOpen={showTransferModal}
        onClose={() => {
          setShowTransferModal(false);
          setSelectedTransferType('');
        }}
        onSuccess={() => {
          // Refresh data or show success message
          console.log('Transfer completed successfully');
        }}
        transferType={selectedTransferType}
      />
    </div>
  );
}
