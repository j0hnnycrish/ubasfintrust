import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ProfessionalNavigation } from '@/components/homepage/ProfessionalNavigation';
import { ScrollingBackground, businessBankingImages } from '@/components/ui/ScrollingBackground';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import PageHeader from '@/components/navigation/PageHeader';
import {
  Briefcase,
  TrendingUp,
  Globe,
  ArrowRight,
  CheckCircle,
  Building,
  CreditCard,
  BarChart3,
  Users,
  Shield,
  Award
} from 'lucide-react';

export default function BusinessBanking() {
  const navigate = useNavigate();
  const [selectedSolution, setSelectedSolution] = useState<string | null>(null);

  const businessSolutions = [
    {
      id: 'accounts',
      name: 'Business Accounts',
      description: 'Multi-currency accounts for global operations',
      features: ['Multi-Currency Support', 'Real-time Reporting', 'API Integration', 'Bulk Payments'],
      minBalance: '$50,000',
      icon: Building,
      color: 'bg-red-600'
    },
    {
      id: 'trade',
      name: 'Trade Finance',
      description: 'International trade financing solutions',
      features: ['Letters of Credit', 'Trade Guarantees', 'Export Financing', 'Supply Chain Finance'],
      minBalance: '$100,000',
      icon: Globe,
      color: 'bg-red-700'
    },
    {
      id: 'cash',
      name: 'Cash Management',
      description: 'Optimize your business cash flow',
      features: ['Liquidity Management', 'Payment Processing', 'Collection Services', 'Treasury Solutions'],
      minBalance: '$250,000',
      icon: BarChart3,
      color: 'bg-red-800'
    },
    {
      id: 'lending',
      name: 'Business Lending',
      description: 'Flexible financing for growth',
      features: ['Working Capital', 'Equipment Finance', 'Commercial Real Estate', 'Credit Lines'],
      minBalance: '$75,000',
      icon: TrendingUp,
      color: 'bg-red-900'
    }
  ];

  const industries = [
    'Manufacturing & Industrial',
    'Technology & Software',
    'Healthcare & Pharmaceuticals',
    'Energy & Utilities',
    'Retail & E-commerce',
    'Financial Services',
    'Real Estate & Construction',
    'Transportation & Logistics'
  ];

  return (
    <div className="min-h-screen bg-white">
      <ProfessionalNavigation />
  <PageHeader title="Business Banking" subtitle="Back or return home quickly" />

      {/* Hero Section with Scrolling Background */}
      <section className="relative bg-gradient-to-br from-red-700 via-red-800 to-red-900 overflow-hidden">
        <ScrollingBackground
          images={businessBankingImages}
          speed={40}
          opacity={0.2}
          overlay={true}
        />

        <div className="relative py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="inline-flex items-center space-x-2 bg-red-500/20 backdrop-blur-sm border border-red-500/30 rounded-full px-6 py-2 text-red-300 mb-6">
                <Award className="h-4 w-4" />
                <span className="text-sm font-medium">Business Banking Excellence</span>
              </div>

              <h1 className="text-5xl lg:text-6xl font-bold text-white mb-6">
                Business Banking
                <span className="block text-red-300">For Growth</span>
              </h1>

              <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
                Empower your business with comprehensive financial solutions designed for growth.
                From cash management to international trade finance, we support your global ambitions.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  onClick={() => navigate('/open-account')}
                  className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 text-lg font-semibold"
                >
                  Open Business Account
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button variant="outline" className="border-white text-white hover:bg-white hover:text-red-900 px-8 py-3 text-lg" onClick={() => navigate('/contact')}>
                  Speak to Advisor
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Solutions Section */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-banking-dark mb-4">
              Business Banking Solutions
            </h2>
            <p className="text-lg text-banking-gray max-w-2xl mx-auto">
              Comprehensive financial services tailored to your business needs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {businessSolutions.map((solution) => {
              const IconComponent = solution.icon;
              return (
                <Card 
                  key={solution.id}
                  className={`cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${
                    selectedSolution === solution.id ? 'ring-2 ring-banking-gold shadow-xl' : ''
                  }`}
                  onClick={() => setSelectedSolution(solution.id)}
                >
                  <CardHeader className="text-center">
                    <div className={`w-16 h-16 ${solution.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
                      <IconComponent className="h-8 w-8 text-white" />
                    </div>
                    <CardTitle className="text-xl text-banking-dark">{solution.name}</CardTitle>
                    <CardDescription className="text-banking-gray">
                      {solution.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="text-center">
                        <span className="text-sm text-banking-gray">Starting From</span>
                        <div className="text-2xl font-bold text-banking-gold">{solution.minBalance}</div>
                      </div>
                      <ul className="space-y-2">
                        {solution.features.map((feature, index) => (
                          <li key={index} className="flex items-center text-sm">
                            <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                            <span className="text-banking-gray">{feature}</span>
                          </li>
                        ))}
                      </ul>
                      <Button className="w-full btn-banking-gold mt-4">
                        Learn More
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>

      {/* Industries Section */}
      <div className="bg-banking-light py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-banking-dark mb-6">
                Serving Businesses Across Industries
              </h2>
              <p className="text-lg text-banking-gray mb-8">
                Our specialized teams understand the unique challenges and opportunities 
                in your industry, providing tailored solutions that drive growth.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {industries.map((industry, index) => (
                  <div key={index} className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-banking-gold mr-3 flex-shrink-0" />
                    <span className="text-banking-gray">{industry}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-banking-dark mb-2">
                    Business Banking Benefits
                  </h3>
                </div>
                <div className="space-y-6">
                  <div className="flex items-start">
                    <Shield className="h-6 w-6 text-banking-gold mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-banking-dark">Enterprise Security</h4>
                      <p className="text-sm text-banking-gray">Bank-grade security with multi-factor authentication</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Globe className="h-6 w-6 text-banking-gold mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-banking-dark">Global Reach</h4>
                      <p className="text-sm text-banking-gray">Operate seamlessly across 150+ countries</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <BarChart3 className="h-6 w-6 text-banking-gold mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-banking-dark">Real-time Analytics</h4>
                      <p className="text-sm text-banking-gray">Advanced reporting and business intelligence</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Users className="h-6 w-6 text-banking-gold mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-banking-dark">Dedicated Support</h4>
                      <p className="text-sm text-banking-gray">Relationship managers and 24/7 support</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-banking-gold to-banking-gold/80 py-16">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Scale Your Business Globally?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Join thousands of businesses that trust UBAS Financial Trust for their growth journey
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="bg-white text-banking-gold hover:bg-banking-light">
              <Briefcase className="h-5 w-5 mr-2" />
              Open Business Account
            </Button>
            <Button variant="outline" className="border-white text-white hover:bg-white hover:text-banking-gold">
              Request Demo
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
