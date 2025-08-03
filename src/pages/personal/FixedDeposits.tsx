import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  TrendingUp,
  Shield,
  Clock,
  Calculator,
  CheckCircle,
  ArrowRight,
  DollarSign,
  Lock,
  Calendar,
  AlertCircle,
  Target,
  Award
} from 'lucide-react';

export default function FixedDeposits() {
  const features = [
    {
      icon: TrendingUp,
      title: 'Guaranteed Returns',
      description: 'Fixed interest rates up to 5.5% APY with guaranteed returns on your investment'
    },
    {
      icon: Shield,
      title: 'FDIC Insured',
      description: 'Your deposits are protected up to $250,000 by FDIC insurance'
    },
    {
      icon: Lock,
      title: 'Secure Investment',
      description: 'Principal protection with no risk of losing your initial investment'
    },
    {
      icon: Calendar,
      title: 'Flexible Terms',
      description: 'Choose from terms ranging from 3 months to 5 years'
    },
    {
      icon: Calculator,
      title: 'Compound Interest',
      description: 'Earn interest on your interest with our compound interest options'
    },
    {
      icon: Target,
      title: 'Goal-Based Saving',
      description: 'Perfect for specific financial goals with predictable returns'
    }
  ];

  const cdRates = [
    {
      term: '3 Months',
      rate: '3.5%',
      minimum: '$1,000',
      features: ['Short-term commitment', 'Quick access to funds', 'Competitive rate'],
      popular: false
    },
    {
      term: '6 Months',
      rate: '4.0%',
      minimum: '$1,000',
      features: ['Balanced term length', 'Higher rate than savings', 'Semi-annual option'],
      popular: false
    },
    {
      term: '12 Months',
      rate: '4.5%',
      minimum: '$1,000',
      features: ['Annual commitment', 'Excellent rate', 'Popular choice'],
      popular: true
    },
    {
      term: '24 Months',
      rate: '5.0%',
      minimum: '$2,500',
      features: ['Higher minimum deposit', 'Premium rate', 'Medium-term growth'],
      popular: false
    },
    {
      term: '36 Months',
      rate: '5.25%',
      minimum: '$5,000',
      features: ['3-year commitment', 'Excellent returns', 'Long-term planning'],
      popular: false
    },
    {
      term: '60 Months',
      rate: '5.5%',
      minimum: '$10,000',
      features: ['Highest rate available', 'Maximum returns', '5-year commitment'],
      popular: false
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
                <h1 className="text-4xl md:text-5xl font-bold">Fixed Deposits</h1>
              </div>
              <p className="text-xl text-emerald-100 mb-8">
                Secure your financial future with guaranteed returns. Our fixed deposits offer
                competitive rates with the safety and security of FDIC insurance.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  className="bg-white text-emerald-900 hover:bg-gray-100"
                  onClick={() => window.location.href = '/open-account'}
                >
                  Open CD Account
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white hover:text-emerald-900"
                >
                  <Calculator className="h-5 w-5 mr-2" />
                  Calculate Returns
                </Button>
              </div>
            </div>
            <div className="relative">
              <Card className="bg-white/10 backdrop-blur border-white/20">
                <CardContent className="p-8">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-white mb-2">5.5%</div>
                    <div className="text-emerald-200 mb-4">Annual Percentage Yield</div>
                    <div className="text-sm text-emerald-100">
                      On 5-Year Fixed Deposit
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
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose Our Fixed Deposits?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Experience the security and growth potential of fixed deposits with competitive rates and flexible terms.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="text-center shadow-lg hover:shadow-xl transition-shadow">
                  <CardHeader>
                    <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Icon className="h-8 w-8 text-emerald-600" />
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

      {/* CD Rates */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Current CD Rates</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Choose the term that best fits your financial goals and timeline.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {cdRates.map((cd, index) => (
              <Card key={index} className={`relative shadow-lg hover:shadow-xl transition-shadow ${
                cd.popular ? 'border-2 border-emerald-500' : ''
              }`}>
                {cd.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-emerald-500 text-white px-4 py-2 rounded-full text-sm font-medium">
                      Most Popular
                    </span>
                  </div>
                )}
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl text-gray-900">{cd.term}</CardTitle>
                  <div className="text-4xl font-bold text-emerald-600 my-4">{cd.rate}</div>
                  <CardDescription className="text-lg">
                    Minimum: {cd.minimum}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 mb-6">
                    {cd.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center text-gray-700">
                        <CheckCircle className="h-5 w-5 text-emerald-500 mr-3 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button
                    className={`w-full ${
                      cd.popular
                        ? 'bg-emerald-600 hover:bg-emerald-700'
                        : 'bg-gray-600 hover:bg-gray-700'
                    }`}
                    onClick={() => window.location.href = '/open-account'}
                  >
                    Open {cd.term} CD
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
