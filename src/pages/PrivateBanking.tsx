//
import { useNavigate } from 'react-router-dom';
import { ProfessionalNavigation } from '@/components/homepage/ProfessionalNavigation';
import { ScrollingBackground, privateBankingImages } from '@/components/ui/ScrollingBackground';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import PageHeader from '@/components/navigation/PageHeader';
import {
  Crown,
  TrendingUp,
  Globe,
  CheckCircle,
  Shield,
  Star,
  Gem,
  Award,
  Users,
  Heart,
  
} from 'lucide-react';

export default function PrivateBanking() {
  const navigate = useNavigate();
  

  const privateServices = [
    {
      id: 'wealth',
      name: 'Wealth Management',
      description: 'Comprehensive portfolio management and investment advisory',
      features: ['Personalized Investment Strategy', 'Alternative Investments', 'Tax Optimization', 'Performance Reporting'],
      minBalance: '$10,000,000',
      icon: TrendingUp,
      color: 'bg-gradient-to-br from-gold-500 to-gold-600'
    },
    {
      id: 'estate',
      name: 'Estate Planning',
      description: 'Sophisticated wealth transfer and succession planning',
      features: ['Trust Services', 'Succession Planning', 'Tax Structuring', 'Legacy Management'],
      minBalance: '$25,000,000',
      icon: Crown,
  color: 'bg-gradient-to-br from-red-700 to-red-800'
    },
    {
      id: 'family',
      name: 'Family Office Services',
      description: 'Comprehensive family wealth coordination',
      features: ['Multi-Generational Planning', 'Governance Advisory', 'Philanthropy', 'Concierge Services'],
      minBalance: '$50,000,000',
      icon: Users,
      color: 'bg-gradient-to-br from-red-600 to-red-700'
    },
    {
      id: 'exclusive',
      name: 'Exclusive Banking',
      description: 'Ultra-premium banking services and access',
      features: ['Dedicated Relationship Team', 'Priority Access', 'Exclusive Events', 'Global Privileges'],
      minBalance: '$100,000,000',
      icon: Gem,
  color: 'bg-gradient-to-br from-red-600 to-red-700'
    }
  ];

  const exclusiveServices = [
    {
      icon: Shield,
      title: 'Confidentiality & Security',
      description: 'Swiss-level privacy with military-grade security protocols'
    },
    {
      icon: Globe,
      title: 'Global Access',
      description: 'Seamless banking across all major financial centers worldwide'
    },
    {
      icon: Star,
      title: 'Bespoke Solutions',
      description: 'Tailored financial products designed specifically for your needs'
    },
    {
      icon: Award,
      title: 'Expert Advisory',
      description: 'Access to world-class investment professionals and specialists'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <ProfessionalNavigation />
  <PageHeader title="Private Banking" subtitle="Elite services with easy navigation" />

      {/* Hero Section with Scrolling Background */}
      <section className="relative bg-gradient-to-br from-red-700 via-red-800 to-red-900 overflow-hidden">
        <ScrollingBackground
          images={privateBankingImages}
          speed={50}
          opacity={0.15}
          overlay={true}
        />

        <div className="relative py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="inline-flex items-center space-x-2 bg-yellow-500/20 backdrop-blur-sm border border-yellow-500/30 rounded-full px-6 py-2 text-yellow-400 mb-6">
                <Crown className="h-4 w-4" />
                <span className="text-sm font-medium">Private Banking Excellence</span>
              </div>
              
              <h1 className="text-5xl lg:text-6xl font-bold text-white mb-6">
                Private Banking
                <span className="block text-yellow-400">For Elite Clients</span>
              </h1>
              
              <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
                Exclusive wealth management services for ultra-high-net-worth individuals and families. 
                Experience unparalleled sophistication, discretion, and personalized attention.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  onClick={() => navigate('/open-account')}
                  className="bg-yellow-600 hover:bg-yellow-700 text-white px-8 py-3 text-lg font-semibold"
                >
                  Explore Private Banking
                  <Crown className="ml-2 h-5 w-5" />
                </Button>
                <Button variant="outline" className="border-white text-white hover:bg-white hover:text-red-900 px-8 py-3 text-lg" onClick={() => navigate('/private/banking')}>
                  Learn More
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
  <section className="py-24 bg-red-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Exclusive Private Banking Services
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Sophisticated financial solutions crafted for the world's most discerning clients
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {exclusiveServices.map((service, index) => {
              const Icon = service.icon;
              return (
                <Card key={index} className="text-center hover:shadow-lg transition-shadow duration-300">
                  <CardHeader>
                    <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <Icon className="h-6 w-6 text-red-600" />
                    </div>
                    <CardTitle className="text-xl">{service.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">{service.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Private Services */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Premium Service Tiers
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Choose the level of service that matches your wealth management needs
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {privateServices.map((service) => {
              const Icon = service.icon;
              return (
                <Card key={service.id} className="hover:shadow-xl transition-all duration-300 border-2 hover:border-red-200">
                  <CardHeader>
                    <div className={`w-12 h-12 ${service.color} rounded-lg flex items-center justify-center mb-4`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <CardTitle className="text-xl">{service.name}</CardTitle>
                    <CardDescription>{service.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="text-sm text-gray-500">
                        <strong>Minimum Balance:</strong> {service.minBalance}
                      </div>
                      <ul className="space-y-2">
                        {service.features.map((feature, index) => (
                          <li key={index} className="flex items-center text-sm">
                            <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                      <Button
                        onClick={() => navigate('/open-account')}
                        className="w-full bg-red-700 hover:bg-red-800 text-white"
                      >
                        Learn More
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
  <section className="bg-gradient-to-r from-red-900 via-red-800 to-red-900 py-24">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center">
              <Crown className="h-10 w-10 text-white" />
            </div>
          </div>
          <h2 className="text-4xl font-bold text-white mb-6">
            Join the Elite Circle of Private Banking
          </h2>
          <p className="text-xl text-gray-300 mb-10">
            Experience the ultimate in wealth management with UBAS Private Banking. 
            Your financial legacy deserves nothing less than excellence.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => navigate('/open-account')}
              className="bg-yellow-600 hover:bg-yellow-700 text-white px-8 py-3 text-lg font-semibold"
            >
              <Crown className="h-6 w-6 mr-2" />
              Begin Your Journey
            </Button>
            <Button variant="outline" className="border-white text-white hover:bg-white hover:text-red-900 text-lg px-8 py-3">
              <Heart className="h-6 w-6 mr-2" />
              Private Consultation
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
