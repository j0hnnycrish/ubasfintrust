import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  TrendingUp, 
  Clock, 
  Shield, 
  Zap,
  CheckCircle,
  ArrowRight,
  Calculator,
  BarChart3,
  CreditCard,
  AlertCircle,
  Users,
  Building
} from 'lucide-react';

export default function CashManagement() {
  const services = [
    {
      icon: TrendingUp,
      title: 'Liquidity Management',
      description: 'Optimize cash flow and maximize returns on excess funds'
    },
    {
      icon: Clock,
      title: 'Payment Processing',
      description: 'Streamline payments with automated clearing and settlement'
    },
    {
      icon: Shield,
      title: 'Risk Management',
      description: 'Mitigate financial risks with advanced monitoring tools'
    },
    {
      icon: Zap,
      title: 'Real-time Reporting',
      description: 'Access live cash position and transaction data'
    },
    {
      icon: Calculator,
      title: 'Cash Forecasting',
      description: 'Predict future cash needs with advanced analytics'
    },
    {
      icon: BarChart3,
      title: 'Investment Solutions',
      description: 'Invest surplus cash in money market and short-term instruments'
    }
  ];

  const solutions = [
    {
      name: 'Zero Balance Accounts',
      description: 'Automatically sweep funds between accounts to optimize cash',
      features: [
        'Automatic fund transfers',
        'Centralized cash control',
        'Reduced idle balances',
        'Improved cash visibility'
      ],
      bestFor: 'Multi-location businesses'
    },
    {
      name: 'Concentration Banking',
      description: 'Consolidate funds from multiple accounts into master account',
      features: [
        'Centralized cash pooling',
        'Enhanced liquidity management',
        'Reduced banking costs',
        'Simplified reconciliation'
      ],
      bestFor: 'Companies with multiple subsidiaries'
    },
    {
      name: 'Controlled Disbursement',
      description: 'Optimize timing of check clearings for better cash flow',
      features: [
        'Early morning reporting',
        'Predictable cash outflows',
        'Improved float management',
        'Enhanced forecasting'
      ],
      bestFor: 'High-volume check issuers'
    }
  ];

  const benefits = [
    'Maximize investment returns on excess cash',
    'Reduce banking fees and costs',
    'Improve cash flow forecasting accuracy',
    'Automate routine cash management tasks',
    'Enhance financial reporting and analytics',
    'Minimize operational risks',
    'Streamline payment processes',
    'Access to dedicated relationship managers'
  ];

  const digitalTools = [
    {
      icon: BarChart3,
      title: 'Cash Dashboard',
      description: 'Real-time view of all accounts, balances, and transactions across your organization'
    },
    {
      icon: Calculator,
      title: 'Forecasting Tools',
      description: 'Advanced analytics to predict cash flows and optimize liquidity management'
    },
    {
      icon: CreditCard,
      title: 'Payment Hub',
      description: 'Centralized platform for all payment types including ACH, wires, and checks'
    },
    {
      icon: Shield,
      title: 'Fraud Prevention',
      description: 'Advanced security features including positive pay and account reconciliation'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-emerald-900 to-emerald-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <TrendingUp className="h-12 w-12 text-emerald-300" />
                <h1 className="text-4xl md:text-5xl font-bold">Cash Management</h1>
              </div>
              <p className="text-xl text-emerald-100 mb-8">
                Optimize your business cash flow with sophisticated treasury management solutions. 
                Maximize returns, minimize risks, and streamline operations.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg" 
                  className="bg-white text-emerald-900 hover:bg-gray-100"
                  onClick={() => window.location.href = '/contact'}
                >
                  Get Started
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-white text-white hover:bg-white hover:text-emerald-900"
                  onClick={() => window.location.href = '/contact'}
                >
                  Schedule Demo
                </Button>
              </div>
            </div>
            <div className="relative">
              <Card className="bg-white/10 backdrop-blur border-white/20">
                <CardContent className="p-8">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-white mb-2">24/7</div>
                    <div className="text-emerald-200 mb-4">Real-time Access</div>
                    <div className="text-sm text-emerald-100">
                      To your cash position and transactions
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Services Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Cash Management Services</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive treasury solutions to optimize your cash flow and enhance financial efficiency.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <Card key={index} className="text-center shadow-lg hover:shadow-xl transition-shadow">
                  <CardHeader>
                    <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Icon className="h-8 w-8 text-emerald-600" />
                    </div>
                    <CardTitle className="text-xl text-gray-900">{service.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">{service.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>

      {/* Solutions */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Cash Management Solutions</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Choose the right cash management solution for your business structure and needs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {solutions.map((solution, index) => (
              <Card key={index} className="shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader>
                  <CardTitle className="text-xl text-gray-900">{solution.name}</CardTitle>
                  <CardDescription className="text-gray-600">{solution.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Key Features:</h4>
                    <ul className="space-y-1">
                      {solution.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center text-sm text-gray-700">
                          <CheckCircle className="h-4 w-4 text-emerald-500 mr-2 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="bg-emerald-50 rounded-lg p-3">
                    <p className="text-emerald-800 text-xs font-medium">Best For:</p>
                    <p className="text-emerald-700 text-xs">{solution.bestFor}</p>
                  </div>
                  
                  <Button 
                    className="w-full bg-emerald-600 hover:bg-emerald-700"
                    onClick={() => window.location.href = '/contact'}
                  >
                    Learn More
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Digital Tools */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Digital Cash Management Tools</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Advanced digital platforms to manage your cash operations efficiently and securely.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {digitalTools.map((tool, index) => {
              const Icon = tool.icon;
              return (
                <Card key={index} className="text-center shadow-lg hover:shadow-xl transition-shadow">
                  <CardHeader>
                    <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-red-700 rounded-full flex items-center justify-center mx-auto mb-4">
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

      {/* Benefits */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Why Choose Our Cash Management?</h2>
              <p className="text-xl text-gray-600 mb-8">
                Experience treasury management that delivers measurable results and operational efficiency.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-emerald-500 flex-shrink-0" />
                    <span className="text-gray-700">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-6">
              <Card className="bg-emerald-50 border-emerald-200">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-3">
                    <TrendingUp className="h-6 w-6 text-emerald-600 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-semibold text-emerald-800 mb-2">Maximize Returns</h3>
                      <p className="text-emerald-700 text-sm">
                        Optimize your cash position to earn maximum returns on excess funds while maintaining liquidity.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-red-50 border-red-200">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-3">
                    <Users className="h-6 w-6 text-red-600 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-semibold text-red-800 mb-2">Expert Support</h3>
                      <p className="text-red-700 text-sm">
                        Dedicated treasury specialists provide ongoing support and strategic guidance.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-purple-50 border-purple-200">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-3">
                    <Building className="h-6 w-6 text-purple-600 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-semibold text-purple-800 mb-2">Scalable Solutions</h3>
                      <p className="text-purple-700 text-sm">
                        Solutions that grow with your business from startup to enterprise level.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Implementation Process */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Implementation Process</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our structured approach ensures smooth implementation of your cash management solution.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { step: '1', title: 'Analysis', description: 'Comprehensive review of your current cash management processes' },
              { step: '2', title: 'Design', description: 'Custom solution design based on your specific requirements' },
              { step: '3', title: 'Implementation', description: 'Seamless setup and integration with your existing systems' },
              { step: '4', title: 'Optimization', description: 'Ongoing monitoring and optimization for maximum efficiency' }
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-white">{item.step}</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 bg-emerald-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Optimize Your Cash Flow?</h2>
          <p className="text-xl text-emerald-100 mb-8 max-w-3xl mx-auto">
            Transform your treasury operations with our advanced cash management solutions. 
            Contact our specialists to get started.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-white text-emerald-900 hover:bg-gray-100"
              onClick={() => window.location.href = '/contact'}
            >
              Contact Specialist
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-white text-white hover:bg-white hover:text-emerald-900"
              onClick={() => window.location.href = '/contact'}
            >
              Schedule Demo
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
                  <h3 className="font-semibold text-yellow-800 mb-2">Cash Management Information</h3>
                  <p className="text-yellow-700 text-sm">
                    Cash management services are subject to eligibility requirements and account minimums. 
                    Fees apply for various services. Investment products are not FDIC insured and may lose value. 
                    Consult with our specialists for detailed terms and conditions.
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
