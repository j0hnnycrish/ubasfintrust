import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ProfessionalNavigation } from '@/components/homepage/ProfessionalNavigation';
import { ScrollingBackground, corporateBankingImages } from '@/components/ui/ScrollingBackground';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Building2,
  TrendingUp,
  Globe,
  ArrowRight,
  CheckCircle,
  BarChart3,
  Shield,
  Zap,
  Target,
  Award,
  DollarSign,
  Users
} from 'lucide-react';

export default function CorporateBanking() {
  const navigate = useNavigate();
  const [selectedService, setSelectedService] = useState<string | null>(null);

  const corporateServices = [
    {
      id: 'treasury',
      name: 'Treasury Management',
      description: 'Sophisticated cash and liquidity management',
      features: ['Global Cash Pooling', 'Liquidity Optimization', 'Risk Management', 'Real-time Reporting'],
      minBalance: '$5,000,000',
      icon: BarChart3,
      color: 'bg-red-700'
    },
    {
      id: 'capital',
      name: 'Capital Markets',
      description: 'Access to global capital markets',
      features: ['Debt Capital Markets', 'Equity Solutions', 'Structured Products', 'Market Making'],
      minBalance: '$10,000,000',
      icon: TrendingUp,
      color: 'bg-green-700'
    },
    {
      id: 'advisory',
      name: 'Corporate Advisory',
      description: 'Strategic financial advisory services',
      features: ['M&A Advisory', 'Restructuring', 'Valuation Services', 'Strategic Planning'],
      minBalance: '$25,000,000',
      icon: Target,
      color: 'bg-purple-700'
    },
    {
      id: 'trade',
      name: 'Global Trade Finance',
      description: 'Comprehensive trade financing solutions',
      features: ['Documentary Credits', 'Trade Guarantees', 'Supply Chain Finance', 'Export Credit'],
      minBalance: '$15,000,000',
      icon: Globe,
      color: 'bg-orange-700'
    }
  ];

  const capabilities = [
    {
      icon: Shield,
      title: 'Risk Management',
      description: 'Advanced hedging and risk mitigation strategies'
    },
    {
      icon: Zap,
      title: 'Digital Innovation',
      description: 'Cutting-edge fintech solutions and APIs'
    },
    {
      icon: Award,
      title: 'Industry Expertise',
      description: 'Specialized knowledge across all sectors'
    },
    {
      icon: Users,
      title: 'Relationship Banking',
      description: 'Dedicated senior relationship managers'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <ProfessionalNavigation />

      {/* Hero Section with Scrolling Background */}
      <section className="relative bg-gradient-to-br from-red-700 via-red-800 to-red-900 overflow-hidden">
        <ScrollingBackground
          images={corporateBankingImages}
          speed={45}
          opacity={0.2}
          overlay={true}
        />

        <div className="relative py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Global Corporate Banking
            </h1>
            <p className="text-xl text-banking-light max-w-4xl mx-auto mb-8">
              Sophisticated financial solutions for multinational corporations. 
              From treasury management to capital markets, we provide the expertise 
              and global reach your enterprise demands.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="btn-banking-gold hover-glow text-lg px-8 py-3">
                <Building2 className="h-6 w-6 mr-2" />
                Explore Solutions
              </Button>
              <Button variant="outline" className="border-white text-white hover:bg-white hover:text-red-900 text-lg px-8 py-3" onClick={() => navigate('/leadership')}>
                <Users className="h-6 w-6 mr-2" />
                Meet Our Team
              </Button>
            </div>
          </div>
        </div>
        </div>
      </section>

      {/* Services Section */}
      <div className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-banking-dark mb-6">
              Corporate Banking Services
            </h2>
            <p className="text-xl text-banking-gray max-w-3xl mx-auto">
              Comprehensive financial services designed for large enterprises and multinational corporations
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {corporateServices.map((service) => {
              const IconComponent = service.icon;
              return (
                <Card 
                  key={service.id}
                  className={`cursor-pointer transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 ${
                    selectedService === service.id ? 'ring-2 ring-banking-gold shadow-2xl' : ''
                  }`}
                  onClick={() => setSelectedService(service.id)}
                >
                  <CardHeader className="text-center pb-6">
                    <div className={`w-20 h-20 ${service.color} rounded-full flex items-center justify-center mx-auto mb-6`}>
                      <IconComponent className="h-10 w-10 text-white" />
                    </div>
                    <CardTitle className="text-2xl text-banking-dark mb-2">{service.name}</CardTitle>
                    <CardDescription className="text-lg text-banking-gray">
                      {service.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="text-center border-t border-banking-gold/20 pt-4">
                        <span className="text-sm text-banking-gray">Minimum Relationship</span>
                        <div className="text-3xl font-bold text-banking-gold">{service.minBalance}</div>
                      </div>
                      <ul className="space-y-3">
                        {service.features.map((feature, index) => (
                          <li key={index} className="flex items-center">
                            <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                            <span className="text-banking-gray">{feature}</span>
                          </li>
                        ))}
                      </ul>
                      <Button className="w-full btn-banking-gold mt-6 text-lg py-3">
                        Learn More
                        <ArrowRight className="h-5 w-5 ml-2" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>

      {/* Capabilities Section */}
      <div className="bg-banking-light py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-banking-dark mb-6">
              Our Corporate Banking Capabilities
            </h2>
            <p className="text-xl text-banking-gray max-w-3xl mx-auto">
              Leveraging global expertise and cutting-edge technology to deliver exceptional results
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {capabilities.map((capability, index) => {
              const IconComponent = capability.icon;
              return (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 bg-banking-gold rounded-full flex items-center justify-center mx-auto mb-6">
                    <IconComponent className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-banking-dark mb-3">{capability.title}</h3>
                  <p className="text-banking-gray">{capability.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl shadow-2xl p-12">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-banking-dark mb-4">
                Trusted by Global Leaders
              </h2>
              <p className="text-lg text-banking-gray">
                Our corporate banking division serves Fortune 500 companies worldwide
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-4xl font-bold text-banking-gold mb-2">$2.5T</div>
                <div className="text-banking-gray">Assets Under Management</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-banking-gold mb-2">500+</div>
                <div className="text-banking-gray">Fortune 500 Clients</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-banking-gold mb-2">150+</div>
                <div className="text-banking-gray">Countries Served</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-banking-gold mb-2">24/7</div>
                <div className="text-banking-gray">Global Support</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-banking-gold to-banking-gold/80 py-20">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white mb-6">
            Partner with Global Banking Excellence
          </h2>
          <p className="text-xl text-white/90 mb-10">
            Join the world's leading corporations who trust UBAS Financial Trust 
            for their most complex financial needs
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button className="bg-white text-banking-gold hover:bg-banking-light text-lg px-8 py-3">
              <Building2 className="h-6 w-6 mr-2" />
              Schedule Consultation
            </Button>
            <Button variant="outline" className="border-white text-white hover:bg-white hover:text-banking-gold text-lg px-8 py-3">
              <DollarSign className="h-6 w-6 mr-2" />
              Request Proposal
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
