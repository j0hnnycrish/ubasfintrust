import { useState } from 'react';
import { ProfessionalNavigation } from '@/components/homepage/ProfessionalNavigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  TrendingUp,
  DollarSign,
  Percent,
  Calculator,
  Info,
  Clock,
  Globe
} from 'lucide-react';

export default function Rates() {
  const [selectedCurrency, setSelectedCurrency] = useState('USD');

  const savingsRates = [
    { accountType: 'Basic Savings', minBalance: '$500', rate: '2.50%', apy: '2.53%' },
    { accountType: 'Premium Savings', minBalance: '$10,000', rate: '3.25%', apy: '3.30%' },
    { accountType: 'Elite Savings', minBalance: '$50,000', rate: '4.00%', apy: '4.08%' },
    { accountType: 'Private Banking Savings', minBalance: '$250,000', rate: '4.75%', apy: '4.86%' }
  ];

  const fixedDepositRates = [
    { term: '3 Months', minDeposit: '$1,000', rate: '3.50%', apy: '3.56%' },
    { term: '6 Months', minDeposit: '$1,000', rate: '4.00%', apy: '4.08%' },
    { term: '12 Months', minDeposit: '$1,000', rate: '4.50%', apy: '4.60%' },
    { term: '24 Months', minDeposit: '$1,000', rate: '5.00%', apy: '5.12%' },
    { term: '36 Months', minDeposit: '$1,000', rate: '5.25%', apy: '5.39%' },
    { term: '60 Months', minDeposit: '$1,000', rate: '5.50%', apy: '5.65%' }
  ];

  const loanRates = [
    { loanType: 'Personal Loan', term: '2-7 years', rate: '8.99% - 24.99%', features: 'Unsecured, Quick approval' },
    { loanType: 'Auto Loan', term: '3-7 years', rate: '4.99% - 12.99%', features: 'New & used vehicles' },
    { loanType: 'Home Mortgage', term: '15-30 years', rate: '6.25% - 8.50%', features: 'Fixed & variable rates' },
    { loanType: 'Business Loan', term: '1-10 years', rate: '7.50% - 18.99%', features: 'Working capital & expansion' },
    { loanType: 'Student Loan', term: '5-20 years', rate: '5.99% - 12.99%', features: 'Education financing' }
  ];

  const exchangeRates = [
    { currency: 'EUR/USD', buy: '1.0845', sell: '1.0865', change: '+0.12%' },
    { currency: 'GBP/USD', buy: '1.2634', sell: '1.2654', change: '-0.08%' },
    { currency: 'USD/JPY', buy: '149.25', sell: '149.45', change: '+0.34%' },
    { currency: 'USD/CHF', buy: '0.8720', sell: '0.8740', change: '+0.10%' },
    { currency: 'USD/CAD', buy: '1.3456', sell: '1.3476', change: '-0.05%' },
    { currency: 'AUD/USD', buy: '0.6523', sell: '0.6543', change: '+0.22%' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <ProfessionalNavigation />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-banking-dark to-banking-gold py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Current Rates & Pricing
            </h1>
            <p className="text-xl text-banking-light max-w-3xl mx-auto mb-8">
              Stay informed with our competitive interest rates and transparent pricing across all banking products.
            </p>
            <div className="flex items-center justify-center text-banking-light">
              <Clock className="h-5 w-5 mr-2" />
              <span>Last updated: {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Rates Content */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Tabs defaultValue="savings" className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-8">
              <TabsTrigger value="savings">Savings</TabsTrigger>
              <TabsTrigger value="deposits">Fixed Deposits</TabsTrigger>
              <TabsTrigger value="loans">Loans</TabsTrigger>
              <TabsTrigger value="exchange">Exchange Rates</TabsTrigger>
            </TabsList>

            {/* Savings Rates */}
            <TabsContent value="savings">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TrendingUp className="h-6 w-6 mr-2 text-banking-gold" />
                    Savings Account Interest Rates
                  </CardTitle>
                  <CardDescription>
                    Competitive interest rates on all savings account types. Rates are compounded daily and paid monthly.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-3 px-4">Account Type</th>
                          <th className="text-left py-3 px-4">Minimum Balance</th>
                          <th className="text-left py-3 px-4">Interest Rate</th>
                          <th className="text-left py-3 px-4">APY</th>
                        </tr>
                      </thead>
                      <tbody>
                        {savingsRates.map((rate, index) => (
                          <tr key={index} className="border-b hover:bg-gray-50">
                            <td className="py-3 px-4 font-medium">{rate.accountType}</td>
                            <td className="py-3 px-4">{rate.minBalance}</td>
                            <td className="py-3 px-4 text-banking-gold font-semibold">{rate.rate}</td>
                            <td className="py-3 px-4 text-banking-gold font-semibold">{rate.apy}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Fixed Deposit Rates */}
            <TabsContent value="deposits">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Calculator className="h-6 w-6 mr-2 text-banking-gold" />
                    Fixed Deposit Interest Rates
                  </CardTitle>
                  <CardDescription>
                    Secure your future with our competitive fixed deposit rates. Higher returns for longer terms.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-3 px-4">Term</th>
                          <th className="text-left py-3 px-4">Minimum Deposit</th>
                          <th className="text-left py-3 px-4">Interest Rate</th>
                          <th className="text-left py-3 px-4">APY</th>
                        </tr>
                      </thead>
                      <tbody>
                        {fixedDepositRates.map((rate, index) => (
                          <tr key={index} className="border-b hover:bg-gray-50">
                            <td className="py-3 px-4 font-medium">{rate.term}</td>
                            <td className="py-3 px-4">{rate.minDeposit}</td>
                            <td className="py-3 px-4 text-banking-gold font-semibold">{rate.rate}</td>
                            <td className="py-3 px-4 text-banking-gold font-semibold">{rate.apy}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Loan Rates */}
            <TabsContent value="loans">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Percent className="h-6 w-6 mr-2 text-banking-gold" />
                    Loan Interest Rates
                  </CardTitle>
                  <CardDescription>
                    Competitive loan rates for all your financing needs. Rates vary based on creditworthiness and loan terms.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-3 px-4">Loan Type</th>
                          <th className="text-left py-3 px-4">Term</th>
                          <th className="text-left py-3 px-4">Interest Rate Range</th>
                          <th className="text-left py-3 px-4">Features</th>
                        </tr>
                      </thead>
                      <tbody>
                        {loanRates.map((rate, index) => (
                          <tr key={index} className="border-b hover:bg-gray-50">
                            <td className="py-3 px-4 font-medium">{rate.loanType}</td>
                            <td className="py-3 px-4">{rate.term}</td>
                            <td className="py-3 px-4 text-banking-gold font-semibold">{rate.rate}</td>
                            <td className="py-3 px-4 text-sm text-gray-600">{rate.features}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Exchange Rates */}
            <TabsContent value="exchange">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Globe className="h-6 w-6 mr-2 text-banking-gold" />
                    Foreign Exchange Rates
                  </CardTitle>
                  <CardDescription>
                    Real-time foreign exchange rates for major currency pairs. Rates updated every 15 minutes during market hours.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-3 px-4">Currency Pair</th>
                          <th className="text-left py-3 px-4">Buy Rate</th>
                          <th className="text-left py-3 px-4">Sell Rate</th>
                          <th className="text-left py-3 px-4">24h Change</th>
                        </tr>
                      </thead>
                      <tbody>
                        {exchangeRates.map((rate, index) => (
                          <tr key={index} className="border-b hover:bg-gray-50">
                            <td className="py-3 px-4 font-medium">{rate.currency}</td>
                            <td className="py-3 px-4 font-semibold">{rate.buy}</td>
                            <td className="py-3 px-4 font-semibold">{rate.sell}</td>
                            <td className={`py-3 px-4 font-semibold ${
                              rate.change.startsWith('+') ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {rate.change}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Disclaimer */}
          <Card className="mt-8">
            <CardContent className="pt-6">
              <div className="flex items-start">
                <Info className="h-5 w-5 text-banking-gold mr-3 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-gray-600">
                  <p className="font-semibold mb-2">Important Information:</p>
                  <ul className="space-y-1 list-disc list-inside">
                    <li>Interest rates are subject to change without notice and may vary based on account balance, creditworthiness, and market conditions.</li>
                    <li>APY (Annual Percentage Yield) assumes interest remains on deposit until maturity. Early withdrawal penalties may apply.</li>
                    <li>Loan rates shown are starting rates for qualified borrowers. Your actual rate may be higher based on credit evaluation.</li>
                    <li>Foreign exchange rates are indicative and subject to market fluctuations. Actual rates may vary for transactions.</li>
                    <li>All rates are effective as of the date shown and are subject to change. Contact us for current rates and terms.</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
