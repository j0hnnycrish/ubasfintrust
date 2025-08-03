import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  PiggyBank, 
  TrendingUp, 
  Shield, 
  Clock,
  CheckCircle,
  ArrowRight,
  Calculator,
  Globe,
  Smartphone,
  CreditCard,
  AlertCircle
} from 'lucide-react';

export default function SavingsAccount() {
  const features = [
    {
      icon: TrendingUp,
      title: 'Competitive Interest Rates',
      description: 'Earn up to 4.5% APY on your savings with our tiered interest structure'
    },
    {
      icon: Shield,
      title: 'FDIC Insured',
      description: 'Your deposits are protected up to $250,000 by FDIC insurance'
    },
    {
      icon: Clock,
      title: 'No Minimum Balance',
      description: 'Start saving with any amount - no minimum balance required'
    },
    {
      icon: Smartphone,
      title: 'Mobile Banking',
      description: 'Manage your savings anytime, anywhere with our mobile app'
    },
    {
      icon: Globe,
      title: 'Online Access',
      description: '24/7 online banking with real-time balance updates'
    },
    {
      icon: CreditCard,
      title: 'Free Debit Card',
      description: 'Complimentary debit card with global ATM access'
    }
  ];

  const accountTypes = [
    {
      name: 'Basic Savings',
      rate: '2.5% APY',
      minimum: '$0',
      features: ['No monthly fees', 'Online banking', 'Mobile app access', 'Free debit card'],
      recommended: false
    },
    {
      name: 'High-Yield Savings',
      rate: '4.5% APY',
      minimum: '$1,000',
      features: ['Premium interest rate', 'Priority customer service', 'Advanced analytics', 'Investment advisory'],
      recommended: true
    },
    {
      name: 'Youth Savings',
      rate: '3.0% APY',
      minimum: '$0',
      features: ['For ages 13-24', 'Financial education resources', 'No fees', 'Parent/guardian oversight'],
      recommended: false
    }
  ];

  const benefits = [
    'No monthly maintenance fees',
    'Free online and mobile banking',
    'Free ATM access at 50,000+ locations',
    'Automatic savings programs',
    'Goal-based savings tools',
    'Round-up savings feature',
    'Direct deposit available',
    'Overdraft protection options'
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-green-900 to-green-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <PiggyBank className="h-12 w-12 text-green-300" />
                <h1 className="text-4xl md:text-5xl font-bold">Savings Account</h1>
              </div>
              <p className="text-xl text-green-100 mb-8">
                Grow your money with competitive interest rates and the security of FDIC insurance. 
                Start building your financial future today.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg" 
                  className="bg-white text-green-900 hover:bg-gray-100"
                  onClick={() => window.location.href = '/open-account'}
                >
                  Open Account Now
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-white text-white hover:bg-white hover:text-green-900"
                >
                  <Calculator className="h-5 w-5 mr-2" />
                  Calculate Earnings
                </Button>
              </div>
            </div>
            <div className="relative">
              <Card className="bg-white/10 backdrop-blur border-white/20">
                <CardContent className="p-8">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-white mb-2">4.5%</div>
                    <div className="text-green-200 mb-4">Annual Percentage Yield</div>
                    <div className="text-sm text-green-100">
                      On High-Yield Savings Account
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose Our Savings Account?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Experience banking that puts your financial growth first with features designed for modern savers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="text-center shadow-lg hover:shadow-xl transition-shadow">
                  <CardHeader>
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Icon className="h-8 w-8 text-green-600" />
                    </div>
                    <CardTitle className="text-xl text-gray-900">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">{feature.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>

      {/* Account Types */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Choose Your Savings Account</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Select the savings account that best fits your financial goals and lifestyle.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {accountTypes.map((account, index) => (
              <Card key={index} className={`relative shadow-lg hover:shadow-xl transition-shadow ${
                account.recommended ? 'border-2 border-green-500' : ''
              }`}>
                {account.recommended && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-green-500 text-white px-4 py-2 rounded-full text-sm font-medium">
                      Most Popular
                    </span>
                  </div>
                )}
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl text-gray-900">{account.name}</CardTitle>
                  <div className="text-3xl font-bold text-green-600 my-4">{account.rate}</div>
                  <CardDescription className="text-lg">
                    Minimum Balance: {account.minimum}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 mb-6">
                    {account.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center text-gray-700">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button 
                    className={`w-full ${
                      account.recommended 
                        ? 'bg-green-600 hover:bg-green-700' 
                        : 'bg-gray-600 hover:bg-gray-700'
                    }`}
                    onClick={() => window.location.href = '/open-account'}
                  >
                    Open {account.name}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Additional Benefits</h2>
              <p className="text-xl text-gray-600 mb-8">
                Your savings account comes with a comprehensive suite of benefits designed to make banking convenient and rewarding.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-6">
              <Card className="bg-green-50 border-green-200">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-3">
                    <TrendingUp className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-semibold text-green-800 mb-2">Automatic Savings</h3>
                      <p className="text-green-700 text-sm">
                        Set up automatic transfers from your checking account to build savings effortlessly.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-3">
                    <Calculator className="h-6 w-6 text-blue-600 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-semibold text-blue-800 mb-2">Savings Calculator</h3>
                      <p className="text-blue-700 text-sm">
                        Use our online calculator to see how your savings can grow over time with compound interest.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-purple-50 border-purple-200">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-3">
                    <Shield className="h-6 w-6 text-purple-600 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-semibold text-purple-800 mb-2">Security Features</h3>
                      <p className="text-purple-700 text-sm">
                        Advanced security measures including fraud monitoring and account alerts keep your money safe.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 bg-green-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Saving?</h2>
          <p className="text-xl text-green-100 mb-8 max-w-3xl mx-auto">
            Open your savings account today and start earning competitive interest on your money. 
            It only takes a few minutes to get started.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-white text-green-900 hover:bg-gray-100"
              onClick={() => window.location.href = '/open-account'}
            >
              Open Account Now
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-white text-white hover:bg-white hover:text-green-900"
              onClick={() => window.location.href = '/contact'}
            >
              Speak to an Advisor
            </Button>
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="py-8 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="bg-yellow-50 border-yellow-200">
            <CardContent className="p-6">
              <div className="flex items-start space-x-3">
                <AlertCircle className="h-6 w-6 text-yellow-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-yellow-800 mb-2">Important Information</h3>
                  <p className="text-yellow-700 text-sm">
                    Annual Percentage Yield (APY) is accurate as of the current date and may change at any time. 
                    Minimum balance requirements apply to earn stated APY. Fees may reduce earnings. 
                    FDIC insurance covers up to $250,000 per depositor, per bank, per ownership category.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
