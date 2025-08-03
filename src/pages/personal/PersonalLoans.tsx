import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  DollarSign, 
  Clock, 
  Shield, 
  Calculator,
  CheckCircle,
  ArrowRight,
  TrendingDown,
  FileText,
  Zap,
  AlertCircle,
  Users,
  CreditCard
} from 'lucide-react';

export default function PersonalLoans() {
  const features = [
    {
      icon: TrendingDown,
      title: 'Competitive Rates',
      description: 'Personal loan rates starting from 5.99% APR for qualified borrowers'
    },
    {
      icon: Clock,
      title: 'Quick Approval',
      description: 'Get approved in minutes with our streamlined application process'
    },
    {
      icon: Shield,
      title: 'No Prepayment Penalty',
      description: 'Pay off your loan early without any additional fees or penalties'
    },
    {
      icon: Zap,
      title: 'Fast Funding',
      description: 'Receive funds as soon as the next business day after approval'
    },
    {
      icon: FileText,
      title: 'Flexible Terms',
      description: 'Choose repayment terms from 2 to 7 years that fit your budget'
    },
    {
      icon: Users,
      title: 'Personal Service',
      description: 'Dedicated loan specialists to guide you through the process'
    }
  ];

  const loanTypes = [
    {
      name: 'Debt Consolidation',
      rate: '5.99% - 18.99%',
      amount: '$5,000 - $100,000',
      term: '2-7 years',
      description: 'Combine multiple debts into one manageable monthly payment',
      benefits: ['Lower interest rates', 'Simplified payments', 'Potential credit score improvement'],
      popular: true
    },
    {
      name: 'Home Improvement',
      rate: '6.49% - 19.99%',
      amount: '$5,000 - $100,000',
      term: '2-7 years',
      description: 'Finance your home renovation or improvement projects',
      benefits: ['No collateral required', 'Quick funding', 'Increase home value'],
      popular: false
    },
    {
      name: 'Major Purchase',
      rate: '6.99% - 20.99%',
      amount: '$2,000 - $50,000',
      term: '2-5 years',
      description: 'Finance large purchases like appliances, furniture, or electronics',
      benefits: ['Fixed monthly payments', 'No down payment', 'Preserve savings'],
      popular: false
    }
  ];

  const requirements = [
    'Minimum age of 18 years',
    'Valid government-issued ID',
    'Proof of income (pay stubs, tax returns)',
    'Minimum credit score of 600',
    'Debt-to-income ratio below 40%',
    'U.S. citizenship or permanent residency',
    'Active checking account',
    'Stable employment history'
  ];

  const benefits = [
    {
      icon: Calculator,
      title: 'Loan Calculator',
      description: 'Use our online calculator to estimate your monthly payments and total interest'
    },
    {
      icon: Shield,
      title: 'Rate Protection',
      description: 'Your rate is locked in once approved - no surprises or rate increases'
    },
    {
      icon: CreditCard,
      title: 'Credit Building',
      description: 'On-time payments help build and improve your credit score over time'
    },
    {
      icon: FileText,
      title: 'Simple Process',
      description: 'Minimal paperwork with most documents uploaded digitally'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-purple-900 to-purple-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <DollarSign className="h-12 w-12 text-purple-300" />
                <h1 className="text-4xl md:text-5xl font-bold">Personal Loans</h1>
              </div>
              <p className="text-xl text-purple-100 mb-8">
                Achieve your financial goals with our flexible personal loans. Whether you're consolidating debt, 
                improving your home, or making a major purchase, we have the right loan for you.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg" 
                  className="bg-white text-purple-900 hover:bg-gray-100"
                  onClick={() => window.location.href = '/open-account'}
                >
                  Apply Now
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-white text-white hover:bg-white hover:text-purple-900"
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
                    <div className="text-4xl font-bold text-white mb-2">5.99%</div>
                    <div className="text-purple-200 mb-4">Starting APR</div>
                    <div className="text-sm text-purple-100">
                      For qualified borrowers
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
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose Our Personal Loans?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Experience lending that puts you first with competitive rates, flexible terms, and exceptional service.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="text-center shadow-lg hover:shadow-xl transition-shadow">
                  <CardHeader>
                    <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Icon className="h-8 w-8 text-purple-600" />
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
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Choose Your Loan Purpose</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Select the loan type that best matches your financial needs and goals.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {loanTypes.map((loan, index) => (
              <Card key={index} className={`relative shadow-lg hover:shadow-xl transition-shadow ${
                loan.popular ? 'border-2 border-purple-500' : ''
              }`}>
                {loan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-purple-500 text-white px-4 py-2 rounded-full text-sm font-medium">
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
                      <span className="font-semibold text-purple-600">{loan.rate}</span>
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
                    <h4 className="font-semibold text-gray-900 mb-2">Key Benefits:</h4>
                    <ul className="space-y-1">
                      {loan.benefits.map((benefit, benefitIndex) => (
                        <li key={benefitIndex} className="flex items-center text-sm text-gray-700">
                          <CheckCircle className="h-4 w-4 text-purple-500 mr-2 flex-shrink-0" />
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <Button 
                    className={`w-full ${
                      loan.popular 
                        ? 'bg-purple-600 hover:bg-purple-700' 
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
                To qualify for a personal loan, you'll need to meet these basic requirements:
              </p>
              <div className="space-y-3">
                {requirements.map((requirement, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-purple-500 flex-shrink-0" />
                    <span className="text-gray-700">{requirement}</span>
                  </div>
                ))}
              </div>
              <div className="mt-8">
                <Card className="bg-purple-50 border-purple-200">
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-purple-800 mb-2">Pre-qualification Available</h3>
                    <p className="text-purple-700 text-sm">
                      Check your rate without affecting your credit score. Get pre-qualified in just 2 minutes.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Additional Benefits */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Additional Benefits</h2>
              <p className="text-xl text-gray-600 mb-8">
                Enjoy these extra perks when you choose our personal loans:
              </p>
              <div className="space-y-6">
                {benefits.map((benefit, index) => {
                  const Icon = benefit.icon;
                  return (
                    <Card key={index} className="shadow-md">
                      <CardContent className="p-6">
                        <div className="flex items-start space-x-4">
                          <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <Icon className="h-6 w-6 text-purple-600" />
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
              Get your personal loan in just a few easy steps. The entire process can be completed online.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { step: '1', title: 'Apply Online', description: 'Complete our secure online application in minutes' },
              { step: '2', title: 'Get Approved', description: 'Receive an instant decision on your loan application' },
              { step: '3', title: 'Review Terms', description: 'Review and accept your loan terms and conditions' },
              { step: '4', title: 'Receive Funds', description: 'Get your money as soon as the next business day' }
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
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
      <div className="py-16 bg-purple-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Your Personal Loan?</h2>
          <p className="text-xl text-purple-100 mb-8 max-w-3xl mx-auto">
            Take the first step towards achieving your financial goals. Apply now and get an instant decision.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-white text-purple-900 hover:bg-gray-100"
              onClick={() => window.location.href = '/open-account'}
            >
              Apply Now
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-white text-white hover:bg-white hover:text-purple-900"
              onClick={() => window.location.href = '/contact'}
            >
              Speak to a Specialist
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
                    APR ranges from 5.99% to 24.99% based on creditworthiness. Loan terms from 2-7 years. 
                    Example: $10,000 loan at 12.99% APR for 5 years = $230.16/month. Total interest: $3,809.60. 
                    Your actual rate and terms may vary based on credit approval.
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
