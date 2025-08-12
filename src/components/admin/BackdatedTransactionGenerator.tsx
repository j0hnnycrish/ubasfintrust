import React, { useState } from 'react';
import { useAdmin } from '@/contexts/AdminContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Calendar,
  DollarSign,
  Loader2,
  CheckCircle,
  AlertCircle,
  Plus,
  History,
  TrendingUp,
  TrendingDown
} from 'lucide-react';

export function BackdatedTransactionGenerator() {
  const { customers, createTransaction } = useAdmin();
  const [isGenerating, setIsGenerating] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  
  const [generatorSettings, setGeneratorSettings] = useState({
    customerId: '',
    accountId: '',
    startDate: '',
    endDate: '',
    transactionCount: '50',
    transactionPattern: 'realistic', // realistic, heavy_spending, conservative
    includeWeekends: true,
    includeHolidays: true
  });

  // Get account type-specific transaction templates
  const getTransactionTemplates = (accountType: string) => {
    const familyNames = ['Johnson', 'Smith', 'Williams', 'Brown', 'Davis', 'Miller', 'Wilson', 'Moore', 'Taylor', 'Anderson'];
    const randomFamilyName = familyNames[Math.floor(Math.random() * familyNames.length)];

    const baseTemplates = {
      // Personal Account Templates
      personal: {
        income: [
          { description: 'Salary Deposit - ABC Company', amount: [3000, 6500], type: 'credit', category: 'Income' },
          { description: 'Freelance Payment', amount: [500, 2000], type: 'credit', category: 'Income' },
          { description: `Transfer from ${randomFamilyName}`, amount: [100, 800], type: 'credit', category: 'Family Transfer' },
          { description: 'Tax Refund', amount: [800, 3000], type: 'credit', category: 'Government' },
          { description: 'Cashback Reward', amount: [25, 150], type: 'credit', category: 'Rewards' },
          { description: 'Gift Money', amount: [50, 500], type: 'credit', category: 'Gift' }
        ],
        expenses: [
          // Daily Life
          { description: 'Grocery Store - Walmart', amount: [45, 180], type: 'debit', category: 'Groceries' },
          { description: 'Gas Station - Shell', amount: [35, 85], type: 'debit', category: 'Gas & Fuel' },
          { description: 'POS Purchase - Target', amount: [25, 120], type: 'debit', category: 'Shopping' },
          { description: 'Pharmacy - CVS', amount: [15, 65], type: 'debit', category: 'Healthcare' },
          { description: 'Coffee Shop - Starbucks', amount: [4, 12], type: 'debit', category: 'Food & Dining' },
          { description: 'Fast Food - McDonald\'s', amount: [8, 25], type: 'debit', category: 'Food & Dining' },
          { description: 'Restaurant - Local Diner', amount: [25, 85], type: 'debit', category: 'Food & Dining' },

          // Transportation
          { description: 'Parking Meter', amount: [2, 8], type: 'debit', category: 'Transportation' },
          { description: 'Uber Ride', amount: [12, 45], type: 'debit', category: 'Transportation' },
          { description: 'Public Transit', amount: [2, 5], type: 'debit', category: 'Transportation' },

          // Healthcare
          { description: 'Doctor Visit Copay', amount: [25, 50], type: 'debit', category: 'Healthcare' },
          { description: 'Prescription Medication', amount: [15, 85], type: 'debit', category: 'Healthcare' },
          { description: 'Dental Cleaning', amount: [100, 200], type: 'debit', category: 'Healthcare' },

          // Utilities & Bills
          { description: 'Electric Bill - ConEd', amount: [85, 180], type: 'debit', category: 'Utilities' },
          { description: 'Internet Bill - Comcast', amount: [65, 120], type: 'debit', category: 'Utilities' },
          { description: 'Phone Bill - Verizon', amount: [45, 95], type: 'debit', category: 'Utilities' },
          { description: 'Water Bill', amount: [35, 75], type: 'debit', category: 'Utilities' },

          // Entertainment & Lifestyle
          { description: 'Movie Theater', amount: [12, 35], type: 'debit', category: 'Entertainment' },
          { description: 'Netflix Subscription', amount: [15, 20], type: 'debit', category: 'Entertainment' },
          { description: 'Gym Membership', amount: [25, 65], type: 'debit', category: 'Health & Fitness' },
          { description: 'Hair Salon', amount: [35, 85], type: 'debit', category: 'Personal Care' },

          // Online Shopping
          { description: 'Amazon Purchase', amount: [25, 150], type: 'debit', category: 'Online Shopping' },
          { description: 'eBay Purchase', amount: [15, 85], type: 'debit', category: 'Online Shopping' },

          // Family & Personal
          { description: `Transfer to ${randomFamilyName}`, amount: [100, 500], type: 'debit', category: 'Family Transfer' },
          { description: 'ATM Withdrawal', amount: [20, 200], type: 'debit', category: 'Cash Withdrawal' },
          { description: 'Bank Fee - Overdraft', amount: [35, 35], type: 'debit', category: 'Bank Fees' }
        ]
      },

      // Business Account Templates
      business: {
        income: [
          { description: 'Client Payment - Invoice #1001', amount: [2500, 15000], type: 'credit', category: 'Revenue' },
          { description: 'Consulting Services Payment', amount: [1500, 8000], type: 'credit', category: 'Revenue' },
          { description: 'Product Sales Revenue', amount: [800, 5000], type: 'credit', category: 'Revenue' },
          { description: 'Contract Payment', amount: [3000, 20000], type: 'credit', category: 'Revenue' },
          { description: 'Subscription Revenue', amount: [500, 2500], type: 'credit', category: 'Revenue' },
          { description: 'Business Loan Deposit', amount: [10000, 50000], type: 'credit', category: 'Financing' }
        ],
        expenses: [
          // Office & Operations
          { description: 'Office Rent Payment', amount: [1500, 5000], type: 'debit', category: 'Rent & Utilities' },
          { description: 'Office Supplies - Staples', amount: [85, 350], type: 'debit', category: 'Office Supplies' },
          { description: 'Business Internet - Comcast', amount: [150, 300], type: 'debit', category: 'Utilities' },
          { description: 'Phone System - Verizon', amount: [200, 500], type: 'debit', category: 'Communications' },

          // Employee Related
          { description: 'Payroll Processing', amount: [5000, 25000], type: 'debit', category: 'Payroll' },
          { description: 'Employee Benefits', amount: [800, 3000], type: 'debit', category: 'Benefits' },
          { description: 'Workers Compensation', amount: [300, 1200], type: 'debit', category: 'Insurance' },

          // Professional Services
          { description: 'Legal Services - Law Firm', amount: [500, 2500], type: 'debit', category: 'Professional Services' },
          { description: 'Accounting Services', amount: [300, 1500], type: 'debit', category: 'Professional Services' },
          { description: 'Marketing Agency', amount: [1000, 5000], type: 'debit', category: 'Marketing' },

          // Equipment & Technology
          { description: 'Computer Equipment', amount: [800, 3000], type: 'debit', category: 'Equipment' },
          { description: 'Software License - Microsoft', amount: [200, 800], type: 'debit', category: 'Software' },
          { description: 'Cloud Services - AWS', amount: [150, 1000], type: 'debit', category: 'Technology' },

          // Travel & Entertainment
          { description: 'Business Travel', amount: [300, 1500], type: 'debit', category: 'Travel' },
          { description: 'Client Dinner', amount: [85, 300], type: 'debit', category: 'Entertainment' },
          { description: 'Conference Registration', amount: [200, 800], type: 'debit', category: 'Education' },

          // Banking & Fees
          { description: 'Wire Transfer Fee', amount: [25, 45], type: 'debit', category: 'Bank Fees' },
          { description: 'Business Account Fee', amount: [15, 35], type: 'debit', category: 'Bank Fees' }
        ]
      },

      // Savings Account Templates
      savings: {
        income: [
          { description: 'Interest Payment', amount: [15, 150], type: 'credit', category: 'Interest' },
          { description: 'Transfer from Checking', amount: [500, 2000], type: 'credit', category: 'Transfer' },
          { description: 'Direct Deposit - Savings', amount: [200, 1000], type: 'credit', category: 'Savings Deposit' },
          { description: 'Dividend Payment', amount: [50, 300], type: 'credit', category: 'Investment Income' }
        ],
        expenses: [
          { description: 'Transfer to Checking', amount: [200, 1500], type: 'debit', category: 'Transfer' },
          { description: 'Emergency Withdrawal', amount: [500, 2000], type: 'debit', category: 'Emergency Fund' },
          { description: 'Savings Account Fee', amount: [5, 15], type: 'debit', category: 'Bank Fees' }
        ]
      },

      // Investment Account Templates
      investment: {
        income: [
          { description: 'Stock Dividend - AAPL', amount: [50, 500], type: 'credit', category: 'Dividends' },
          { description: 'Bond Interest Payment', amount: [100, 800], type: 'credit', category: 'Interest' },
          { description: 'Mutual Fund Distribution', amount: [200, 1500], type: 'credit', category: 'Distributions' },
          { description: 'Capital Gains Distribution', amount: [300, 2000], type: 'credit', category: 'Capital Gains' },
          { description: 'Investment Deposit', amount: [1000, 10000], type: 'credit', category: 'Investment Deposit' }
        ],
        expenses: [
          { description: 'Stock Purchase - MSFT', amount: [500, 5000], type: 'debit', category: 'Stock Purchase' },
          { description: 'Mutual Fund Purchase', amount: [1000, 8000], type: 'debit', category: 'Fund Purchase' },
          { description: 'Investment Management Fee', amount: [25, 150], type: 'debit', category: 'Management Fees' },
          { description: 'Trading Commission', amount: [5, 25], type: 'debit', category: 'Trading Fees' },
          { description: 'Investment Withdrawal', amount: [1000, 5000], type: 'debit', category: 'Withdrawal' }
        ]
      },

      // Credit Account Templates
      credit: {
        income: [
          { description: 'Payment Received', amount: [100, 2000], type: 'credit', category: 'Payment' },
          { description: 'Cashback Reward', amount: [25, 200], type: 'credit', category: 'Rewards' },
          { description: 'Refund Credit', amount: [50, 500], type: 'credit', category: 'Refund' }
        ],
        expenses: [
          { description: 'Purchase - Amazon', amount: [25, 300], type: 'debit', category: 'Online Shopping' },
          { description: 'Restaurant Charge', amount: [35, 150], type: 'debit', category: 'Dining' },
          { description: 'Gas Station Purchase', amount: [40, 80], type: 'debit', category: 'Gas' },
          { description: 'Interest Charge', amount: [15, 85], type: 'debit', category: 'Interest' },
          { description: 'Late Fee', amount: [25, 35], type: 'debit', category: 'Fees' },
          { description: 'Annual Fee', amount: [95, 450], type: 'debit', category: 'Annual Fee' }
        ]
      }
    };

    return baseTemplates[accountType as keyof typeof baseTemplates] || baseTemplates.personal;
  };

  const getRandomTransaction = (accountType: string, pattern: string) => {
    const templates = getTransactionTemplates(accountType);

    // Weight the selection based on the chosen pattern
    const weightedTemplates = [];

    let expenseWeight = 7;
    let incomeWeight = 3;

    switch (pattern) {
      case 'heavy_spending':
        expenseWeight = 8;
        incomeWeight = 2;
        break;
      case 'conservative':
        expenseWeight = 6;
        incomeWeight = 4;
        break;
      default: // realistic
        expenseWeight = 7;
        incomeWeight = 3;
    }

    // Add weighted templates
    for (let i = 0; i < expenseWeight; i++) {
      weightedTemplates.push(...templates.expenses);
    }
    for (let i = 0; i < incomeWeight; i++) {
      weightedTemplates.push(...templates.income);
    }

    const template = weightedTemplates[Math.floor(Math.random() * weightedTemplates.length)];

    const minAmount = template.amount[0];
    const maxAmount = template.amount[1];
    const amount = Math.random() * (maxAmount - minAmount) + minAmount;

    return {
      ...template,
      amount: Math.round(amount * 100) / 100
    };
  };

  const generateRandomDate = (start: Date, end: Date) => {
    const startTime = start.getTime();
    const endTime = end.getTime();
    const randomTime = startTime + Math.random() * (endTime - startTime);
    return new Date(randomTime);
  };

  const getAccountTypeDescription = (accountType: string) => {
    switch (accountType) {
      case 'personal':
        return 'Will generate personal transactions: groceries, gas, restaurants, POS purchases, family transfers, healthcare, utilities, and personal income.';
      case 'business':
        return 'Will generate business transactions: client payments, office expenses, payroll, professional services, equipment purchases, and business income.';
      case 'savings':
        return 'Will generate savings-focused transactions: interest payments, transfers to/from checking, and minimal fees.';
      case 'investment':
        return 'Will generate investment transactions: stock purchases, dividends, bond interest, mutual fund distributions, and trading fees.';
      case 'credit':
        return 'Will generate credit card transactions: purchases, payments, interest charges, fees, and cashback rewards.';
      default:
        return 'Will generate general banking transactions appropriate for this account type.';
    }
  };

  const handleGenerate = async () => {
    setError('');
    setSuccess('');
    setIsGenerating(true);

    try {
      if (!generatorSettings.customerId || !generatorSettings.accountId) {
        setError('Please select a customer and account');
        setIsGenerating(false);
        return;
      }

      if (!generatorSettings.startDate || !generatorSettings.endDate) {
        setError('Please select start and end dates');
        setIsGenerating(false);
        return;
      }

      const startDate = new Date(generatorSettings.startDate);
      const endDate = new Date(generatorSettings.endDate);
      const transactionCount = parseInt(generatorSettings.transactionCount);

      if (startDate >= endDate) {
        setError('End date must be after start date');
        setIsGenerating(false);
        return;
      }

      // Get the selected account to determine its type
      const selectedAccount = allAccounts.find(acc => acc.id === generatorSettings.accountId);
      const accountType = selectedAccount?.type || 'personal';

      const transactions = [];
      for (let i = 0; i < transactionCount; i++) {
        const template = getRandomTransaction(accountType, generatorSettings.transactionPattern);
        let transactionDate = generateRandomDate(startDate, endDate);

        // Skip weekends if not included
        if (!generatorSettings.includeWeekends) {
          while (transactionDate.getDay() === 0 || transactionDate.getDay() === 6) {
            transactionDate = generateRandomDate(startDate, endDate);
          }
        }

        // Generate a realistic reference number
        const refNumber = `TXN${Date.now().toString().slice(-6)}${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`;

        const transaction = {
          accountId: generatorSettings.accountId,
          customerId: generatorSettings.customerId,
          description: template.description,
          amount: template.type === 'debit' ? -template.amount : template.amount,
          type: template.type,
          category: template.category,
          date: transactionDate.toISOString().split('T')[0],
          reference: refNumber,
          status: Math.random() < 0.03 ? 'failed' : (Math.random() < 0.08 ? 'pending' : 'completed')
        } as const;

        transactions.push(transaction);

        // Inject realistic banking anomalies and fees
        // 1) ATM fees after withdrawals
        if (transaction.type === 'debit' && /ATM Withdrawal|Cash Withdrawal/i.test(transaction.description) && Math.random() < 0.4) {
          const feeAmount = parseFloat((Math.random() * (5 - 2.5) + 2.5).toFixed(2));
          transactions.push({
            accountId: transaction.accountId,
            customerId: transaction.customerId,
            description: 'ATM Withdrawal Fee',
            amount: -feeAmount,
            type: 'debit',
            category: 'Bank Fees',
            date: transaction.date,
            reference: `FEE${refNumber}`,
            status: 'completed'
          });
        }

        // 2) International transaction fee for foreign purchases/travel
        if (transaction.type === 'debit' && /International|Hotel|Airline|Uber|Taxi|Booking/i.test(transaction.description) && Math.random() < 0.3) {
          const fxFee = Math.max(Math.abs(transaction.amount) * (Math.random() * 0.02 + 0.01), 0.5);
          transactions.push({
            accountId: transaction.accountId,
            customerId: transaction.customerId,
            description: 'International Transaction Fee',
            amount: -parseFloat(fxFee.toFixed(2)),
            type: 'debit',
            category: 'FX Fees',
            date: transaction.date,
            reference: `FXF${refNumber}`,
            status: 'completed'
          });
        }

        // 3) Occasional refunds/chargebacks for online shopping
        if (transaction.type === 'debit' && /Amazon|eBay|Online|Purchase|POS|Restaurant|Subscription/i.test(transaction.description)) {
          // Failed transaction (authorization declined)
          if (transaction.status === 'failed' && Math.random() < 0.6) {
            transactions[transactions.length - 1].description = `${transaction.description} (Declined: Insufficient funds)`;
          }

          // Refund or chargeback
          const refundChance = Math.random();
          if (refundChance < 0.06) {
            // Add refund credit 1-14 days later
            const daysLater = Math.floor(Math.random() * 14) + 1;
            const refundDate = new Date(transactionDate.getTime());
            refundDate.setDate(refundDate.getDate() + daysLater);
            transactions.push({
              accountId: transaction.accountId,
              customerId: transaction.customerId,
              description: `Refund - ${transaction.description}`,
              amount: Math.abs(transaction.amount),
              type: 'credit',
              category: 'Refund',
              date: refundDate.toISOString().split('T')[0],
              reference: `RFD${refNumber}`,
              status: 'completed'
            });
          } else if (refundChance < 0.08) {
            // Chargeback credit
            const daysLater = Math.floor(Math.random() * 30) + 3;
            const cbDate = new Date(transactionDate.getTime());
            cbDate.setDate(cbDate.getDate() + daysLater);
            transactions.push({
              accountId: transaction.accountId,
              customerId: transaction.customerId,
              description: `Chargeback - ${transaction.description}`,
              amount: Math.abs(transaction.amount),
              type: 'credit',
              category: 'Chargeback',
              date: cbDate.toISOString().split('T')[0],
              reference: `CBK${refNumber}`,
              status: 'completed'
            });
          }
        }

        // 4) Random overdraft/NSF fee
        if (Math.random() < 0.02) {
          const ofee = parseFloat((Math.random() * (45 - 15) + 15).toFixed(2));
          transactions.push({
            accountId: transaction.accountId,
            customerId: transaction.customerId,
            description: 'Overdraft/NSF Fee',
            amount: -ofee,
            type: 'debit',
            category: 'Bank Fees',
            date: transaction.date,
            reference: `NSF${refNumber}`,
            status: 'completed'
          });
        }
      }

      // Sort transactions by date
      transactions.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

      // Create transactions
      for (const transaction of transactions) {
        await createTransaction(transaction);
        // Small delay to prevent overwhelming the system
        await new Promise(resolve => setTimeout(resolve, 10));
      }

      setSuccess(`Successfully generated ${transactionCount} backdated transactions`);
    } catch (error) {
      setError('Failed to generate transactions');
    } finally {
      setIsGenerating(false);
    }
  };

  const allAccounts = customers.flatMap(customer => 
    customer.accounts.map(account => ({
      ...account,
      customerName: customer.fullName,
      customerId: customer.id
    }))
  );

  const selectedCustomerAccounts = allAccounts.filter(
    account => account.customerId === generatorSettings.customerId
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <History className="h-5 w-5 mr-2" />
          Backdated Transaction Generator
        </CardTitle>
        <CardDescription>
          Generate realistic historical transactions for customer accounts
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="customer">Customer</Label>
            <Select 
              value={generatorSettings.customerId} 
              onValueChange={(value) => setGeneratorSettings(prev => ({ 
                ...prev, 
                customerId: value, 
                accountId: '' 
              }))}
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
            <Label htmlFor="account">Account</Label>
            <Select 
              value={generatorSettings.accountId} 
              onValueChange={(value) => setGeneratorSettings(prev => ({ ...prev, accountId: value }))}
              disabled={!generatorSettings.customerId}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select account" />
              </SelectTrigger>
              <SelectContent>
                {selectedCustomerAccounts.map((account) => (
                  <SelectItem key={account.id} value={account.id}>
                    {account.name} ({account.accountNumber})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <Label htmlFor="startDate">Start Date</Label>
            <Input
              id="startDate"
              type="date"
              value={generatorSettings.startDate}
              onChange={(e) => setGeneratorSettings(prev => ({ ...prev, startDate: e.target.value }))}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="endDate">End Date</Label>
            <Input
              id="endDate"
              type="date"
              value={generatorSettings.endDate}
              onChange={(e) => setGeneratorSettings(prev => ({ ...prev, endDate: e.target.value }))}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="transactionCount">Number of Transactions</Label>
            <Input
              id="transactionCount"
              type="number"
              min="1"
              max="500"
              value={generatorSettings.transactionCount}
              onChange={(e) => setGeneratorSettings(prev => ({ ...prev, transactionCount: e.target.value }))}
            />
          </div>
        </div>

        <div className="space-y-4">
          <Label>Transaction Pattern</Label>
          <Select
            value={generatorSettings.transactionPattern}
            onValueChange={(value) => setGeneratorSettings(prev => ({ ...prev, transactionPattern: value }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select transaction pattern" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="realistic">Realistic Pattern (70% expenses, 30% income)</SelectItem>
              <SelectItem value="heavy_spending">Heavy Spending (80% expenses, 20% income)</SelectItem>
              <SelectItem value="conservative">Conservative (60% expenses, 40% income)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="includeWeekends"
              checked={generatorSettings.includeWeekends}
              onChange={(e) => setGeneratorSettings(prev => ({ ...prev, includeWeekends: e.target.checked }))}
              className="rounded"
            />
            <Label htmlFor="includeWeekends" className="text-sm">
              Include Weekend Transactions
            </Label>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="includeHolidays"
              checked={generatorSettings.includeHolidays}
              onChange={(e) => setGeneratorSettings(prev => ({ ...prev, includeHolidays: e.target.checked }))}
              className="rounded"
            />
            <Label htmlFor="includeHolidays" className="text-sm">
              Include Holiday Transactions
            </Label>
          </div>
        </div>

        {/* Account Type Information */}
        {selectedCustomerAccounts.find(acc => acc.id === generatorSettings.accountId) && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 mb-2">
              Account Type: {selectedCustomerAccounts.find(acc => acc.id === generatorSettings.accountId)?.type.charAt(0).toUpperCase() + selectedCustomerAccounts.find(acc => acc.id === generatorSettings.accountId)?.type.slice(1)}
            </h4>
            <p className="text-sm text-blue-800">
              {getAccountTypeDescription(selectedCustomerAccounts.find(acc => acc.id === generatorSettings.accountId)?.type || '')}
            </p>
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

        <Button 
          onClick={handleGenerate}
          disabled={isGenerating}
          className="w-full bg-purple-600 hover:bg-purple-700"
        >
          {isGenerating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating Transactions...
            </>
          ) : (
            <>
              <Plus className="mr-2 h-4 w-4" />
              Generate Backdated Transactions
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
