import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Globe, 
  Ship, 
  Shield, 
  Clock,
  CheckCircle,
  ArrowRight,
  FileText,
  DollarSign,
  TrendingUp,
  AlertCircle,
  Users,
  Building
} from 'lucide-react';

export default function TradeFinance() {
  const services = [
    {
      icon: FileText,
      title: 'Letters of Credit',
      description: 'Secure payment guarantees for international trade transactions'
    },
    {
      icon: Ship,
      title: 'Import/Export Financing',
      description: 'Working capital solutions for import and export operations'
    },
    {
      icon: Shield,
      title: 'Trade Guarantees',
      description: 'Performance and payment guarantees for trade contracts'
    },
    {
      icon: Globe,
      title: 'Foreign Exchange',
      description: 'Competitive FX rates and hedging solutions for currency risk'
    },
    {
      icon: Clock,
      title: 'Documentary Collections',
      description: 'Secure document handling for international payments'
    },
    {
      icon: Building,
      title: 'Supply Chain Finance',
      description: 'Optimize cash flow throughout your supply chain'
    }
  ];

  const solutions = [
    {
      name: 'Import Letters of Credit',
      description: 'Secure payment to overseas suppliers with guaranteed terms',
      features: [
        'Payment security for suppliers',
        'Flexible payment terms',
        'Document verification',
        'Risk mitigation'
      ],
      bestFor: 'Importers seeking payment security'
    },
    {
      name: 'Export Letters of Credit',
      description: 'Guarantee payment from international buyers',
      features: [
        'Payment guarantee from buyers',
        'Reduced credit risk',
        'Faster cash flow',
        'Global acceptance'
      ],
      bestFor: 'Exporters wanting payment assurance'
    },
    {
      name: 'Trade Loans',
      description: 'Short-term financing for trade transactions',
      features: [
        'Pre and post-shipment finance',
        'Competitive interest rates',
        'Flexible repayment terms',
        'Quick approval process'
      ],
      bestFor: 'Businesses needing working capital'
    }
  ];

  const benefits = [
    'Global network of correspondent banks',
    'Competitive pricing and terms',
    'Expert trade finance specialists',
    'Digital trade platforms',
    'Risk management solutions',
    'Regulatory compliance support',
    'Multi-currency capabilities',
    '24/7 trade support services'
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
              <div className="bg-gradient-to-r from-red-900 to-red-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <Globe className="h-12 w-12 text-red-300" />
                <h1 className="text-4xl md:text-5xl font-bold">Trade Finance</h1>
              </div>
              <p className="text-xl text-red-100 mb-8">
                Expand your business globally with comprehensive trade finance solutions. 
                From letters of credit to supply chain financing, we support your international growth.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg" 
                  className="bg-white text-red-900 hover:bg-gray-100"
                  onClick={() => window.location.href = '/contact'}
                >
                  Get Started
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-white text-white hover:bg-white hover:text-red-900"
                  onClick={() => window.location.href = '/contact'}
                >
                  Speak to Specialist
                </Button>
              </div>
            </div>
            <div className="relative">
              <Card className="bg-white/10 backdrop-blur border-white/20">
                <CardContent className="p-8">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-white mb-2">150+</div>
                    <div className="text-red-200 mb-4">Countries Served</div>
                    <div className="text-sm text-red-100">
                      Global trade finance network
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
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Trade Finance Services</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive solutions to support your international trade operations and mitigate risks.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <Card key={index} className="text-center shadow-lg hover:shadow-xl transition-shadow">
                  <CardHeader>
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Icon className="h-8 w-8 text-red-600" />
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
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Trade Finance Solutions</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Choose the right trade finance solution for your business needs.
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
                          <CheckCircle className="h-4 w-4 text-red-500 mr-2 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="bg-red-50 rounded-lg p-3">
                    <p className="text-red-800 text-xs font-medium">Best For:</p>
                    <p className="text-red-700 text-xs">{solution.bestFor}</p>
                  </div>
                  
                  <Button 
                    className="w-full bg-red-600 hover:bg-red-700"
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

      {/* Benefits */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Why Choose Our Trade Finance?</h2>
              <p className="text-xl text-gray-600 mb-8">
                Partner with a global leader in trade finance with the expertise and network to support your international business.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center space-x-3">
                                            <CheckCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
                    <span className="text-gray-700">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-6">
              <Card className="bg-red-50 border-red-200">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-3">
                    <Globe className="h-6 w-6 text-red-600 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-semibold text-red-800 mb-2">Global Network</h3>
                      <p className="text-red-700 text-sm">
                        Access to 150+ countries through our extensive correspondent banking network.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-green-50 border-green-200">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-3">
                    <Users className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-semibold text-green-800 mb-2">Expert Team</h3>
                      <p className="text-green-700 text-sm">
                        Dedicated trade finance specialists with deep industry knowledge and experience.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-purple-50 border-purple-200">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-3">
                    <TrendingUp className="h-6 w-6 text-purple-600 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-semibold text-purple-800 mb-2">Digital Solutions</h3>
                      <p className="text-purple-700 text-sm">
                        Modern digital platforms for efficient trade finance processing and tracking.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Process */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our streamlined process makes trade finance simple and efficient.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { step: '1', title: 'Consultation', description: 'Discuss your trade finance needs with our specialists' },
              { step: '2', title: 'Documentation', description: 'Prepare and submit required trade documents' },
              { step: '3', title: 'Processing', description: 'We process your trade finance application quickly' },
              { step: '4', title: 'Execution', description: 'Your trade finance solution is implemented' }
            ].map((item, index) => (
              <div key={index} className="text-center">
                                  <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
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
      <div className="py-16 bg-red-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Expand Globally?</h2>
          <p className="text-xl text-red-100 mb-8 max-w-3xl mx-auto">
            Take your business international with our comprehensive trade finance solutions. 
            Contact our specialists today to get started.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-white text-red-900 hover:bg-gray-100"
              onClick={() => window.location.href = '/contact'}
            >
              Contact Specialist
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-white text-white hover:bg-white hover:text-red-900"
              onClick={() => window.location.href = '/open-account'}
            >
              Open Business Account
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
                  <h3 className="font-semibold text-yellow-800 mb-2">Trade Finance Information</h3>
                  <p className="text-yellow-700 text-sm">
                    Trade finance products are subject to credit approval and documentation requirements. 
                    Fees and charges apply. Foreign exchange rates fluctuate and may affect transaction costs. 
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
