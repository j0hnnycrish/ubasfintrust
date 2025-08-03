import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Building, 
  TrendingUp, 
  Shield, 
  Clock,
  CheckCircle,
  ArrowRight,
  DollarSign,
  Calculator,
  Target,
  AlertCircle,
  Zap,
  Users
} from 'lucide-react';

export default function BusinessLoans() {
  const features = [
    {
      icon: TrendingUp,
      title: 'Competitive Rates',
      description: 'Business loan rates starting from 6.5% APR for qualified borrowers'
    },
    {
      icon: Clock,
      title: 'Fast Approval',
      description: 'Get approved quickly with our streamlined business loan process'
    },
    {
      icon: Shield,
      title: 'Flexible Terms',
      description: 'Loan terms from 1 to 10 years to match your business needs'
    },
    {
      icon: Zap,
      title: 'Quick Funding',
      description: 'Access funds as soon as 24 hours after approval'
    },
    {
      icon: Calculator,
      title: 'No Prepayment Penalty',
      description: 'Pay off your loan early without additional fees'
    },
    {
      icon: Users,
      title: 'Expert Guidance',
      description: 'Dedicated business loan specialists to guide you through the process'
    }
  ];

  const loanTypes = [
    {
      name: 'Term Loans',
      rate: '6.5% - 15.99%',
      amount: '$25,000 - $5M',
      term: '1-10 years',
      description: 'Traditional business loans for expansion, equipment, or working capital',
      features: [
        'Fixed or variable rates',
        'Predictable monthly payments',
        'Use for any business purpose',
        'Build business credit history'
      ],
      popular: true
    },
    {
      name: 'Lines of Credit',
      rate: '7.5% - 18.99%',
      amount: '$10,000 - $1M',
      term: 'Revolving',
      description: 'Flexible credit line for ongoing business expenses and cash flow',
      features: [
        'Access funds as needed',
        'Pay interest only on used amount',
        'Revolving credit facility',
        'Perfect for seasonal businesses'
      ],
      popular: false
    },
    {
      name: 'Equipment Financing',
      rate: '5.99% - 14.99%',
      amount: '$10,000 - $2M',
      term: '2-7 years',
      description: 'Specialized financing for business equipment and machinery',
      features: [
        'Equipment serves as collateral',
        'Lower rates than unsecured loans',
        'Preserve working capital',
        'Tax advantages available'
      ],
      popular: false
    }
  ];

  const requirements = [
    'Business operating for at least 2 years',
    'Annual revenue of $100,000+',
    'Personal credit score of 650+',
    'Business credit score of 600+',
    'Debt-to-income ratio below 40%',
    'Current financial statements',
    'Business tax returns (2 years)',
    'Valid business license'
  ];

  const benefits = [
    {
      icon: Target,
      title: 'Multiple Use Cases',
      description: 'Use funds for expansion, inventory, equipment, or working capital needs'
    },
    {
      icon: Shield,
      title: 'Competitive Terms',
      description: 'Industry-leading rates and flexible repayment terms for your business'
    },
    {
      icon: Calculator,
      title: 'Transparent Pricing',
      description: 'No hidden fees or surprise charges - clear and upfront pricing'
    },
    {
      icon: Clock,
      title: 'Quick Process',
      description: 'Streamlined application and approval process to get funds fast'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-green-900 to-green-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <Building className="h-12 w-12 text-green-300" />
                <h1 className="text-4xl md:text-5xl font-bold">Business Loans</h1>
              </div>
              <p className="text-xl text-green-100 mb-8">
                Fuel your business growth with flexible financing solutions. From working capital to expansion, 
                we have the right loan to help your business succeed.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg" 
                  className="bg-white text-green-900 hover:bg-gray-100"
                  onClick={() => window.location.href = '/open-account'}
                >
                  Apply for Loan
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-white text-white hover:bg-white hover:text-green-900"
                >
                  <Calculator className="h-5 w-5 mr-2" />
                  Calculate Payment
                </Button>
              </div>
            </div>
            <div className="relative">
              <Card className="bg-white/10 backdrop-blur border-white/20">
                <CardContent className="p-8">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-white mb-2">6.5%</div>
                    <div className="text-green-200 mb-4">Starting APR</div>
                    <div className="text-sm text-green-100">
                      For qualified business borrowers
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
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose Our Business Loans?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Experience business lending that understands your needs and supports your growth ambitions.
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

      {/* Loan Types */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Business Loan Options</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Choose the financing solution that best matches your business needs and goals.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {loanTypes.map((loan, index) => (
              <Card key={index} className={`relative shadow-lg hover:shadow-xl transition-shadow ${
                loan.popular ? 'border-2 border-green-500' : ''
              }`}>
                {loan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-green-500 text-white px-4 py-2 rounded-full text-sm font-medium">
                      Most Popular
                    </span>
                  </div>
                )}
                <CardHeader>
                  <CardTitle className="text-2xl text-gray-900">{loan.name}</CardTitle>
                  <CardDescription className="text-gray-600">{loan.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">APR Range:</span>
                      <span className="font-semibold text-green-600">{loan.rate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Loan Amount:</span>
                      <span className="font-semibold">{loan.amount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Terms:</span>
                      <span className="font-semibold">{loan.term}</span>
                    </div>
                  </div>
                  
                  <div className="border-t pt-4">
                    <h4 className="font-semibold text-gray-900 mb-2">Key Features:</h4>
                    <ul className="space-y-1">
                      {loan.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center text-sm text-gray-700">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <Button 
                    className={`w-full ${
                      loan.popular 
                        ? 'bg-green-600 hover:bg-green-700' 
                        : 'bg-gray-600 hover:bg-gray-700'
                    }`}
                    onClick={() => window.location.href = '/open-account'}
                  >
                    Apply for {loan.name}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Requirements & Benefits */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Requirements */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Loan Requirements</h2>
              <p className="text-xl text-gray-600 mb-8">
                To qualify for a business loan, your business should meet these basic requirements:
              </p>
              <div className="space-y-3">
                {requirements.map((requirement, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700">{requirement}</span>
                  </div>
                ))}
              </div>
              <div className="mt-8">
                <Card className="bg-green-50 border-green-200">
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-green-800 mb-2">Pre-qualification Available</h3>
                    <p className="text-green-700 text-sm">
                      Check your eligibility without affecting your credit score. Get pre-qualified in minutes.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Additional Benefits */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Loan Benefits</h2>
              <p className="text-xl text-gray-600 mb-8">
                Enjoy these additional advantages when you choose our business loans:
              </p>
              <div className="space-y-6">
                {benefits.map((benefit, index) => {
                  const Icon = benefit.icon;
                  return (
                    <Card key={index} className="shadow-md">
                      <CardContent className="p-6">
                        <div className="flex items-start space-x-4">
                          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <Icon className="h-6 w-6 text-green-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900 mb-2">{benefit.title}</h3>
                            <p className="text-gray-600 text-sm">{benefit.description}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Application Process */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Simple Application Process</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Get your business loan in just a few easy steps. Our streamlined process gets you funded fast.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { step: '1', title: 'Apply Online', description: 'Complete our secure business loan application' },
              { step: '2', title: 'Submit Documents', description: 'Upload required financial documents and statements' },
              { step: '3', title: 'Get Approved', description: 'Receive approval decision within 24-48 hours' },
              { step: '4', title: 'Receive Funds', description: 'Access your funds as soon as the next business day' }
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
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
      <div className="py-16 bg-green-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Grow Your Business?</h2>
          <p className="text-xl text-green-100 mb-8 max-w-3xl mx-auto">
            Take the next step in your business journey. Apply for a business loan today and get the funding 
            you need to achieve your goals.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-white text-green-900 hover:bg-gray-100"
              onClick={() => window.location.href = '/open-account'}
            >
              Apply for Loan
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-white text-white hover:bg-white hover:text-green-900"
              onClick={() => window.location.href = '/contact'}
            >
              Speak to Specialist
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
                  <h3 className="font-semibold text-yellow-800 mb-2">Important Loan Information</h3>
                  <p className="text-yellow-700 text-sm">
                    APR ranges from 6.5% to 25.99% based on creditworthiness and business qualifications. 
                    Loan terms vary by product. All loans subject to credit approval. Business collateral may be required. 
                    Fees may apply.
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
