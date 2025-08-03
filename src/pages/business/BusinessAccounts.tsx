import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Building, 
  CreditCard, 
  Shield, 
  Clock,
  CheckCircle,
  ArrowRight,
  TrendingUp,
  Users,
  Globe,
  AlertCircle,
  Zap,
  Calculator
} from 'lucide-react';

export default function BusinessAccounts() {
  const features = [
    {
      icon: Building,
      title: 'Business-Focused Features',
      description: 'Specialized tools designed specifically for business banking needs'
    },
    {
      icon: CreditCard,
      title: 'Business Debit Cards',
      description: 'Multiple cards for employees with spending controls and monitoring'
    },
    {
      icon: Shield,
      title: 'Fraud Protection',
      description: 'Advanced security measures to protect your business finances'
    },
    {
      icon: Clock,
      title: '24/7 Online Banking',
      description: 'Manage your business finances anytime with our online platform'
    },
    {
      icon: TrendingUp,
      title: 'Cash Flow Management',
      description: 'Tools to track and optimize your business cash flow'
    },
    {
      icon: Users,
      title: 'Multi-User Access',
      description: 'Grant access to multiple team members with role-based permissions'
    }
  ];

  const accountTypes = [
    {
      name: 'Business Essential',
      monthlyFee: '$15',
      minimum: '$2,500',
      transactions: '200 free transactions',
      features: [
        '200 free monthly transactions',
        'Business debit card',
        'Online banking',
        'Mobile app access',
        'Basic reporting'
      ],
      recommended: false
    },
    {
      name: 'Business Professional',
      monthlyFee: '$35',
      minimum: '$10,000',
      transactions: '500 free transactions',
      features: [
        '500 free monthly transactions',
        'Multiple debit cards',
        'Advanced online banking',
        'Cash management tools',
        'Detailed analytics',
        'Priority customer service'
      ],
      recommended: true
    },
    {
      name: 'Business Premium',
      monthlyFee: '$75',
      minimum: '$25,000',
      transactions: 'Unlimited transactions',
      features: [
        'Unlimited monthly transactions',
        'Premium debit cards',
        'Treasury management',
        'Dedicated relationship manager',
        'Custom reporting',
        'API access'
      ],
      recommended: false
    }
  ];

  const benefits = [
    'No setup fees or account opening costs',
    'Free business debit cards',
    'Mobile check deposit',
    'ACH transfers and wire transfers',
    'Merchant services integration',
    'Payroll processing services',
    'Business credit line options',
    'FDIC insurance protection'
  ];

  const businessTools = [
    {
      icon: Calculator,
      title: 'Financial Analytics',
      description: 'Comprehensive reporting and analytics to track business performance'
    },
    {
      icon: Zap,
      title: 'Quick Payments',
      description: 'Fast payment processing for vendors, employees, and suppliers'
    },
    {
      icon: Globe,
      title: 'International Banking',
      description: 'Foreign exchange services and international wire transfers'
    },
    {
      icon: Shield,
      title: 'Risk Management',
      description: 'Tools to monitor and manage financial risks for your business'
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
                <Building className="h-12 w-12 text-blue-300" />
                <h1 className="text-4xl md:text-5xl font-bold">Business Accounts</h1>
              </div>
              <p className="text-xl text-blue-100 mb-8">
                Power your business with banking solutions designed for growth. From startups to enterprises, 
                we have the right account to support your business goals.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg" 
                  className="bg-white text-blue-900 hover:bg-gray-100"
                  onClick={() => window.location.href = '/open-account'}
                >
                  Open Business Account
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-white text-white hover:bg-white hover:text-blue-900"
                  onClick={() => window.location.href = '/contact'}
                >
                  Speak to Advisor
                </Button>
              </div>
            </div>
            <div className="relative">
              <Card className="bg-white/10 backdrop-blur border-white/20">
                <CardContent className="p-8">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-white mb-2">500</div>
                    <div className="text-blue-200 mb-4">Free Transactions</div>
                    <div className="text-sm text-blue-100">
                      With Business Professional Account
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
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Business Banking Features</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Everything your business needs to manage finances efficiently and grow successfully.
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
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Choose Your Business Account</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Select the business account that best fits your company's size and banking needs.
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
                  <div className="text-sm text-green-600 font-medium mt-2">
                    {account.transactions}
                  </div>
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

      {/* Business Tools */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Advanced Business Tools</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Powerful tools and services to help your business operate more efficiently and profitably.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {businessTools.map((tool, index) => {
              const Icon = tool.icon;
              return (
                <Card key={index} className="text-center shadow-lg hover:shadow-xl transition-shadow">
                  <CardHeader>
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Icon className="h-8 w-8 text-white" />
                    </div>
                    <CardTitle className="text-lg text-gray-900">{tool.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 text-sm">{tool.description}</p>
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
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Why Choose Our Business Banking?</h2>
              <p className="text-xl text-gray-600 mb-8">
                Experience business banking that understands your needs and supports your growth at every stage.
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
                    <Building className="h-6 w-6 text-blue-600 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-semibold text-blue-800 mb-2">Dedicated Support</h3>
                      <p className="text-blue-700 text-sm">
                        Get personalized support from business banking specialists who understand your industry.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-green-50 border-green-200">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-3">
                    <TrendingUp className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-semibold text-green-800 mb-2">Growth Solutions</h3>
                      <p className="text-green-700 text-sm">
                        Access credit lines, loans, and investment services to fuel your business growth.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-purple-50 border-purple-200">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-3">
                    <Globe className="h-6 w-6 text-purple-600 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-semibold text-purple-800 mb-2">Global Reach</h3>
                      <p className="text-purple-700 text-sm">
                        Expand internationally with our global banking network and foreign exchange services.
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
          <h2 className="text-3xl font-bold mb-4">Ready to Grow Your Business?</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
            Open your business account today and discover banking solutions designed to help your business thrive. 
            Get started in minutes with our streamlined application process.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-white text-blue-900 hover:bg-gray-100"
              onClick={() => window.location.href = '/open-account'}
            >
              Open Business Account
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-white text-white hover:bg-white hover:text-blue-900"
              onClick={() => window.location.href = '/contact'}
            >
              Schedule Consultation
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
                  <h3 className="font-semibold text-yellow-800 mb-2">Business Account Information</h3>
                  <p className="text-yellow-700 text-sm">
                    Monthly fees and minimum balance requirements apply. Transaction fees may apply for exceeding included transactions. 
                    Business documentation required for account opening. Terms and conditions apply.
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
