import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Wallet, 
  CreditCard, 
  Shield, 
  Clock,
  CheckCircle,
  ArrowRight,
  Smartphone,
  Globe,
  DollarSign,
  AlertCircle,
  Zap,
  Users
} from 'lucide-react';

export default function CurrentAccount() {
  const features = [
    {
      icon: CreditCard,
      title: 'Free Debit Card',
      description: 'Contactless debit card with global acceptance and no foreign transaction fees'
    },
    {
      icon: Shield,
      title: 'Overdraft Protection',
      description: 'Optional overdraft protection to avoid declined transactions'
    },
    {
      icon: Clock,
      title: '24/7 Banking',
      description: 'Round-the-clock access to your account through online and mobile banking'
    },
    {
      icon: Smartphone,
      title: 'Mobile Check Deposit',
      description: 'Deposit checks instantly using your smartphone camera'
    },
    {
      icon: Globe,
      title: 'Global ATM Access',
      description: 'Free access to 50,000+ ATMs worldwide'
    },
    {
      icon: Zap,
      title: 'Instant Transfers',
      description: 'Send money instantly to friends and family with Zelle'
    }
  ];

  const accountTypes = [
    {
      name: 'Essential Checking',
      monthlyFee: '$0',
      minimum: '$0',
      features: ['No monthly fees', 'Free debit card', 'Online banking', 'Mobile app', 'ATM access'],
      recommended: true
    },
    {
      name: 'Premium Checking',
      monthlyFee: '$15',
      minimum: '$2,500',
      features: ['Premium debit card', 'Priority customer service', 'Free checks', 'Overdraft protection', 'Investment advisory'],
      recommended: false
    },
    {
      name: 'Student Checking',
      monthlyFee: '$0',
      minimum: '$0',
      features: ['For students under 25', 'No fees', 'Financial education', 'Budgeting tools', 'Parent notifications'],
      recommended: false
    }
  ];

  const benefits = [
    'No minimum balance required',
    'Free online and mobile banking',
    'Free bill pay service',
    'Direct deposit available',
    'Account alerts and notifications',
    'Budgeting and spending tools',
    'Customer support 24/7',
    'FDIC insured up to $250,000'
  ];

  const digitalFeatures = [
    {
      icon: Smartphone,
      title: 'Mobile Banking App',
      description: 'Full-featured app with biometric login, account management, and instant notifications'
    },
    {
      icon: Globe,
      title: 'Online Banking',
      description: 'Secure web portal with advanced features like spending analytics and goal setting'
    },
    {
      icon: CreditCard,
      title: 'Digital Wallet',
      description: 'Add your debit card to Apple Pay, Google Pay, and Samsung Pay for contactless payments'
    },
    {
      icon: Users,
      title: 'P2P Payments',
      description: 'Send money to friends and family instantly with Zelle, Venmo, and other payment services'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-900 to-blue-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <Wallet className="h-12 w-12 text-blue-300" />
                <h1 className="text-4xl md:text-5xl font-bold">Current Account</h1>
              </div>
              <p className="text-xl text-blue-100 mb-8">
                Your everyday banking made simple. Enjoy fee-free banking with all the features you need 
                for modern financial management.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg" 
                  className="bg-white text-blue-900 hover:bg-gray-100"
                  onClick={() => window.location.href = '/open-account'}
                >
                  Open Account Now
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-white text-white hover:bg-white hover:text-blue-900"
                  onClick={() => window.location.href = '/contact'}
                >
                  Learn More
                </Button>
              </div>
            </div>
            <div className="relative">
              <Card className="bg-white/10 backdrop-blur border-white/20">
                <CardContent className="p-8">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-white mb-2">$0</div>
                    <div className="text-blue-200 mb-4">Monthly Fees</div>
                    <div className="text-sm text-blue-100">
                      On Essential Checking Account
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
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Everything You Need for Daily Banking</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our current account comes packed with features to make your financial life easier and more convenient.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="text-center shadow-lg hover:shadow-xl transition-shadow">
                  <CardHeader>
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Icon className="h-8 w-8 text-blue-600" />
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
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Choose Your Current Account</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Select the checking account that matches your banking needs and lifestyle.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {accountTypes.map((account, index) => (
              <Card key={index} className={`relative shadow-lg hover:shadow-xl transition-shadow ${
                account.recommended ? 'border-2 border-blue-500' : ''
              }`}>
                {account.recommended && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-blue-500 text-white px-4 py-2 rounded-full text-sm font-medium">
                      Most Popular
                    </span>
                  </div>
                )}
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl text-gray-900">{account.name}</CardTitle>
                  <div className="text-3xl font-bold text-blue-600 my-4">{account.monthlyFee}</div>
                  <CardDescription className="text-lg">
                    Minimum Balance: {account.minimum}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 mb-6">
                    {account.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center text-gray-700">
                        <CheckCircle className="h-5 w-5 text-blue-500 mr-3 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button 
                    className={`w-full ${
                      account.recommended 
                        ? 'bg-blue-600 hover:bg-blue-700' 
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

      {/* Digital Banking Features */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Digital Banking at Your Fingertips</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Experience modern banking with our award-winning digital platforms designed for convenience and security.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {digitalFeatures.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="text-center shadow-lg hover:shadow-xl transition-shadow">
                  <CardHeader>
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Icon className="h-8 w-8 text-white" />
                    </div>
                    <CardTitle className="text-lg text-gray-900">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 text-sm">{feature.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Why Choose Our Current Account?</h2>
              <p className="text-xl text-gray-600 mb-8">
                Experience banking that works for you with comprehensive features and unmatched convenience.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-blue-500 flex-shrink-0" />
                    <span className="text-gray-700">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-6">
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-3">
                    <DollarSign className="h-6 w-6 text-blue-600 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-semibold text-blue-800 mb-2">No Hidden Fees</h3>
                      <p className="text-blue-700 text-sm">
                        Transparent pricing with no surprise charges. What you see is what you get.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-green-50 border-green-200">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-3">
                    <Zap className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-semibold text-green-800 mb-2">Instant Notifications</h3>
                      <p className="text-green-700 text-sm">
                        Get real-time alerts for all account activity to stay on top of your finances.
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
                      <h3 className="font-semibold text-purple-800 mb-2">Advanced Security</h3>
                      <p className="text-purple-700 text-sm">
                        Multi-layer security with fraud monitoring and zero liability protection.
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
      <div className="py-16 bg-blue-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Switch to Better Banking?</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
            Join thousands of satisfied customers who have made the switch to UBAS Financial Trust. 
            Open your account in minutes and start enjoying fee-free banking today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-white text-blue-900 hover:bg-gray-100"
              onClick={() => window.location.href = '/open-account'}
            >
              Open Account Now
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-white text-white hover:bg-white hover:text-blue-900"
              onClick={() => window.location.href = '/contact'}
            >
              Compare Accounts
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
                    Account terms and conditions apply. Overdraft fees may apply if you opt into overdraft protection. 
                    ATM fees may apply at non-network ATMs. Mobile carrier charges may apply for mobile banking services.
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
