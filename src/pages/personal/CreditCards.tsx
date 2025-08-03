import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  CreditCard, 
  Gift, 
  Shield, 
  Plane,
  CheckCircle,
  ArrowRight,
  Star,
  Percent,
  Zap,
  AlertCircle,
  Globe,
  Smartphone
} from 'lucide-react';

export default function CreditCards() {
  const features = [
    {
      icon: Percent,
      title: 'Competitive APR',
      description: 'Low interest rates starting from 13.99% APR for qualified applicants'
    },
    {
      icon: Gift,
      title: 'Rewards Program',
      description: 'Earn points, cash back, or miles on every purchase you make'
    },
    {
      icon: Shield,
      title: 'Fraud Protection',
      description: 'Zero liability protection and 24/7 fraud monitoring'
    },
    {
      icon: Globe,
      title: 'Global Acceptance',
      description: 'Use your card anywhere Visa or Mastercard is accepted worldwide'
    },
    {
      icon: Smartphone,
      title: 'Mobile Payments',
      description: 'Compatible with Apple Pay, Google Pay, and Samsung Pay'
    },
    {
      icon: Zap,
      title: 'Instant Approval',
      description: 'Get approved instantly and start using your card right away'
    }
  ];

  const creditCards = [
    {
      name: 'UBAS Cashback Card',
      type: 'Cash Back',
      annualFee: '$0',
      apr: '13.99% - 23.99%',
      introOffer: '0% APR for 15 months',
      rewards: '2% cash back on all purchases',
      features: [
        '2% cash back on all purchases',
        'No annual fee',
        '0% intro APR for 15 months',
        'No foreign transaction fees',
        'Free credit score monitoring'
      ],
      recommended: true,
      color: 'bg-blue-600'
    },
    {
      name: 'UBAS Travel Rewards',
      type: 'Travel',
      annualFee: '$95',
      apr: '15.99% - 24.99%',
      introOffer: '60,000 bonus miles',
      rewards: '3x miles on travel & dining',
      features: [
        '3x miles on travel and dining',
        '1x miles on all other purchases',
        '60,000 bonus miles after spending $3,000',
        'No foreign transaction fees',
        'Travel insurance included'
      ],
      recommended: false,
      color: 'bg-purple-600'
    },
    {
      name: 'UBAS Premium Card',
      type: 'Premium',
      annualFee: '$450',
      apr: '16.99% - 24.99%',
      introOffer: '$200 travel credit',
      rewards: '5x points on travel',
      features: [
        '5x points on travel booked through portal',
        '3x points on dining and travel',
        '$200 annual travel credit',
        'Airport lounge access',
        'Concierge service'
      ],
      recommended: false,
      color: 'bg-gold-600'
    }
  ];

  const benefits = [
    {
      icon: Shield,
      title: 'Security Features',
      description: 'EMV chip technology, contactless payments, and real-time fraud alerts'
    },
    {
      icon: Star,
      title: 'Exclusive Perks',
      description: 'Access to special events, discounts, and member-only benefits'
    },
    {
      icon: Plane,
      title: 'Travel Benefits',
      description: 'No foreign transaction fees, travel insurance, and emergency assistance'
    },
    {
      icon: Smartphone,
      title: 'Digital Tools',
      description: 'Mobile app with spending insights, payment reminders, and account management'
    }
  ];

  const requirements = [
    'Minimum age of 18 years',
    'Valid Social Security number',
    'Verifiable income source',
    'Good to excellent credit score (650+)',
    'U.S. citizenship or permanent residency',
    'Valid government-issued ID',
    'Active checking account',
    'Stable employment history'
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-indigo-900 to-indigo-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <CreditCard className="h-12 w-12 text-indigo-300" />
                <h1 className="text-4xl md:text-5xl font-bold">Credit Cards</h1>
              </div>
              <p className="text-xl text-indigo-100 mb-8">
                Discover credit cards that reward your lifestyle. From cash back to travel rewards, 
                find the perfect card to maximize your spending power.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg" 
                  className="bg-white text-indigo-900 hover:bg-gray-100"
                  onClick={() => window.location.href = '/open-account'}
                >
                  Apply Now
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-white text-white hover:bg-white hover:text-indigo-900"
                  onClick={() => window.location.href = '/contact'}
                >
                  Compare Cards
                </Button>
              </div>
            </div>
            <div className="relative">
              <Card className="bg-white/10 backdrop-blur border-white/20">
                <CardContent className="p-8">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-white mb-2">2%</div>
                    <div className="text-indigo-200 mb-4">Cash Back</div>
                    <div className="text-sm text-indigo-100">
                      On all purchases with our Cashback Card
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
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose Our Credit Cards?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Experience credit cards designed with your financial success in mind, featuring competitive rates and valuable rewards.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="text-center shadow-lg hover:shadow-xl transition-shadow">
                  <CardHeader>
                    <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Icon className="h-8 w-8 text-indigo-600" />
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

      {/* Credit Cards */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Choose Your Perfect Credit Card</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Select the credit card that best matches your spending habits and financial goals.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {creditCards.map((card, index) => (
              <Card key={index} className={`relative shadow-lg hover:shadow-xl transition-shadow ${
                card.recommended ? 'border-2 border-indigo-500' : ''
              }`}>
                {card.recommended && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-indigo-500 text-white px-4 py-2 rounded-full text-sm font-medium">
                      Most Popular
                    </span>
                  </div>
                )}
                <CardHeader>
                  <div className={`w-full h-32 ${card.color} rounded-lg mb-4 flex items-center justify-center`}>
                    <div className="text-center text-white">
                      <CreditCard className="h-8 w-8 mx-auto mb-2" />
                      <div className="font-bold">{card.name}</div>
                    </div>
                  </div>
                  <CardTitle className="text-2xl text-gray-900">{card.name}</CardTitle>
                  <CardDescription className="text-lg font-semibold text-indigo-600">
                    {card.rewards}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Annual Fee:</span>
                      <span className="font-semibold">{card.annualFee}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">APR:</span>
                      <span className="font-semibold">{card.apr}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Intro Offer:</span>
                      <span className="font-semibold text-green-600">{card.introOffer}</span>
                    </div>
                  </div>
                  
                  <div className="border-t pt-4">
                    <h4 className="font-semibold text-gray-900 mb-2">Key Features:</h4>
                    <ul className="space-y-1">
                      {card.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-start text-sm text-gray-700">
                          <CheckCircle className="h-4 w-4 text-indigo-500 mr-2 flex-shrink-0 mt-0.5" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <Button 
                    className={`w-full ${
                      card.recommended 
                        ? 'bg-indigo-600 hover:bg-indigo-700' 
                        : 'bg-gray-600 hover:bg-gray-700'
                    }`}
                    onClick={() => window.location.href = '/open-account'}
                  >
                    Apply for {card.name}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Benefits & Requirements */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Additional Benefits */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Additional Benefits</h2>
              <p className="text-xl text-gray-600 mb-8">
                Enjoy these exclusive perks and benefits with every UBAS credit card:
              </p>
              <div className="space-y-6">
                {benefits.map((benefit, index) => {
                  const Icon = benefit.icon;
                  return (
                    <Card key={index} className="shadow-md">
                      <CardContent className="p-6">
                        <div className="flex items-start space-x-4">
                          <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <Icon className="h-6 w-6 text-indigo-600" />
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

            {/* Requirements */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Application Requirements</h2>
              <p className="text-xl text-gray-600 mb-8">
                To apply for a credit card, you'll need to meet these requirements:
              </p>
              <div className="space-y-3">
                {requirements.map((requirement, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-indigo-500 flex-shrink-0" />
                    <span className="text-gray-700">{requirement}</span>
                  </div>
                ))}
              </div>
              <div className="mt-8 space-y-4">
                <Card className="bg-indigo-50 border-indigo-200">
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-indigo-800 mb-2">Pre-qualification Available</h3>
                    <p className="text-indigo-700 text-sm">
                      Check if you pre-qualify without affecting your credit score. Get an instant decision.
                    </p>
                  </CardContent>
                </Card>
                <Card className="bg-green-50 border-green-200">
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-green-800 mb-2">Build Your Credit</h3>
                    <p className="text-green-700 text-sm">
                      Use your credit card responsibly to build and improve your credit score over time.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Application Process */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Easy Application Process</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Apply for your credit card in just a few simple steps. Get an instant decision and start using your card right away.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { step: '1', title: 'Choose Your Card', description: 'Select the credit card that best fits your needs' },
              { step: '2', title: 'Apply Online', description: 'Complete our secure online application in minutes' },
              { step: '3', title: 'Get Instant Decision', description: 'Receive an immediate approval decision' },
              { step: '4', title: 'Start Using', description: 'Receive your card and start earning rewards' }
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
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
      <div className="py-16 bg-indigo-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Apply for Your Credit Card?</h2>
          <p className="text-xl text-indigo-100 mb-8 max-w-3xl mx-auto">
            Choose the credit card that matches your lifestyle and start earning rewards on every purchase. 
            Apply now and get an instant decision.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-white text-indigo-900 hover:bg-gray-100"
              onClick={() => window.location.href = '/open-account'}
            >
              Apply Now
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-white text-white hover:bg-white hover:text-indigo-900"
              onClick={() => window.location.href = '/contact'}
            >
              Compare All Cards
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
                  <h3 className="font-semibold text-yellow-800 mb-2">Important Credit Card Information</h3>
                  <p className="text-yellow-700 text-sm">
                    APR, fees, and terms are subject to credit approval. Promotional rates are introductory and subject to change. 
                    Regular APR applies after promotional period. Credit limit and available credit are subject to credit approval. 
                    Rewards points/cash back may have restrictions and expiration dates.
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
