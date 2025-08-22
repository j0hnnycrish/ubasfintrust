import { useState } from 'react';
import { useBankingData } from '@/hooks/useBankingData';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowUpRight, ArrowDownLeft, Plus, Minus, Send } from 'lucide-react';
import { toast } from 'sonner';

export function BankingOperations() {
  const { accounts, deposit, withdraw, transfer, isLoading } = useBankingData();
  const [activeOperation, setActiveOperation] = useState<'deposit' | 'withdraw' | 'transfer' | null>(null);
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [selectedAccount, setSelectedAccount] = useState('');
  const [toAccountNumber, setToAccountNumber] = useState('');

  const handleDeposit = async () => {
    if (!selectedAccount || !amount) {
      toast.error('Please select an account and enter an amount');
      return;
    }

    const result = await deposit(selectedAccount, parseFloat(amount), description || 'Deposit');
    if (result.success) {
      setAmount('');
      setDescription('');
      setActiveOperation(null);
    }
  };

  const handleWithdraw = async () => {
    if (!selectedAccount || !amount) {
      toast.error('Please select an account and enter an amount');
      return;
    }

    const result = await withdraw(selectedAccount, parseFloat(amount), description || 'Withdrawal');
    if (result.success) {
      setAmount('');
      setDescription('');
      setActiveOperation(null);
    }
  };

  const handleTransfer = async () => {
    if (!selectedAccount || !amount || !toAccountNumber) {
      toast.error('Please fill in all transfer details');
      return;
    }

    const result = await transfer(selectedAccount, toAccountNumber, parseFloat(amount), description || 'Transfer');
    if (result.success) {
      setAmount('');
      setDescription('');
      setToAccountNumber('');
      setActiveOperation(null);
    }
  };

  const resetForm = () => {
    setAmount('');
    setDescription('');
    setToAccountNumber('');
    setActiveOperation(null);
  };

  if (accounts.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <p className="text-gray-600 mb-4">No accounts found. Please create an account first.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Banking Operations</h2>
        <p className="text-gray-600">Manage your money with deposits, withdrawals, and transfers</p>
      </div>

      {/* Operation Buttons */}
      {!activeOperation && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setActiveOperation('deposit')}>
            <CardContent className="flex items-center justify-center p-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Plus className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-900">Deposit Money</h3>
                <p className="text-sm text-gray-600">Add money to your account</p>
              </div>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setActiveOperation('withdraw')}>
            <CardContent className="flex items-center justify-center p-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Minus className="h-6 w-6 text-red-600" />
                </div>
                <h3 className="font-semibold text-gray-900">Withdraw Money</h3>
                <p className="text-sm text-gray-600">Take money from your account</p>
              </div>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setActiveOperation('transfer')}>
            <CardContent className="flex items-center justify-center p-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Send className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900">Transfer Money</h3>
                <p className="text-sm text-gray-600">Send money to another account</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Operation Forms */}
      {activeOperation && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {activeOperation === 'deposit' && <Plus className="h-5 w-5 text-green-600" />}
              {activeOperation === 'withdraw' && <Minus className="h-5 w-5 text-red-600" />}
              {activeOperation === 'transfer' && <Send className="h-5 w-5 text-blue-600" />}
              {activeOperation.charAt(0).toUpperCase() + activeOperation.slice(1)} Money
            </CardTitle>
            <CardDescription>
              {activeOperation === 'deposit' && 'Add money to your selected account'}
              {activeOperation === 'withdraw' && 'Withdraw money from your selected account'}
              {activeOperation === 'transfer' && 'Transfer money to another account'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="account-select">From Account</Label>
              <Select value={selectedAccount} onValueChange={setSelectedAccount}>
                <SelectTrigger>
                  <SelectValue placeholder="Select an account" />
                </SelectTrigger>
                <SelectContent>
                  {accounts.map((account) => (
                    <SelectItem key={account.id} value={account.id}>
                      {account.accountType?.charAt(0).toUpperCase() + account.accountType?.slice(1)} Account - {account.accountNumber} 
                      (${account.balance.toLocaleString()})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {activeOperation === 'transfer' && (
              <div>
                <Label htmlFor="to-account">To Account Number</Label>
                <Input
                  id="to-account"
                  type="text"
                  placeholder="Enter destination account number"
                  value={toAccountNumber}
                  onChange={(e) => setToAccountNumber(e.target.value)}
                />
              </div>
            )}

            <div>
              <Label htmlFor="amount">Amount ($)</Label>
              <Input
                id="amount"
                type="number"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                min="0.01"
                step="0.01"
              />
            </div>

            <div>
              <Label htmlFor="description">Description (Optional)</Label>
              <Input
                id="description"
                type="text"
                placeholder="Enter description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div className="flex gap-2 pt-4">
              <Button
                onClick={
                  activeOperation === 'deposit' 
                    ? handleDeposit 
                    : activeOperation === 'withdraw' 
                    ? handleWithdraw 
                    : handleTransfer
                }
                disabled={isLoading}
                className={`flex-1 ${
                  activeOperation === 'deposit' 
                    ? 'bg-green-600 hover:bg-green-700' 
                    : activeOperation === 'withdraw' 
                    ? 'bg-red-600 hover:bg-red-700' 
                    : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                {isLoading ? 'Processing...' : `${activeOperation.charAt(0).toUpperCase() + activeOperation.slice(1)}`}
              </Button>
              <Button variant="outline" onClick={resetForm}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
