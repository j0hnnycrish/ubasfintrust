import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ProfessionalNavigation } from '@/components/homepage/ProfessionalNavigation';
import { ScrollingBackground, personalBankingImages } from '@/components/ui/ScrollingBackground';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  CreditCard,
  PiggyBank,
  TrendingUp,
  Shield,
  Globe,
  ArrowRight,
  CheckCircle,
  Star,
  Award,
  Clock,
  Smartphone,
  DollarSign
} from 'lucide-react';

export default function PersonalBanking() {
  const navigate = useNavigate();
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);

  const personalProducts = [
    {
      id: 'savings',
      name: 'Global Savings Account',
      description: 'High-yield savings with multi-currency support',
      features: ['5.5% Annual Interest', 'Multi-Currency Wallets', 'No Monthly Fees', 'Global ATM Access'],
      minBalance: '$1,000',
      icon: PiggyBank,
      color: 'bg-red-500'
    },
    {
      id: 'current',
      name: 'Global Current Account',
      description: 'Perfect for everyday international transactions',
      features: ['Unlimited Transactions', 'Free International Transfers', 'Mobile Banking', 'Contactless Cards'],
      minBalance: '$500',
      icon: CreditCard,
      color: 'bg-green-500'
    },
    {
      id: 'investment',
      name: 'Investment Portfolio',
      description: 'Grow your wealth with global investment opportunities',
      features: ['Professional Management', 'Diversified Portfolio', 'Real-time Tracking', 'Tax Optimization'],
      minBalance: '$10,000',
      icon: TrendingUp,
      color: 'bg-purple-500'
    },
    {
      id: 'premium',
      name: 'Premium Banking',
      description: 'Exclusive services for high-value clients',
      features: ['Dedicated Relationship Manager', 'Priority Support', 'Exclusive Events', 'Premium Cards'],
      minBalance: '$100,000',
      icon: Star,
      color: 'bg-gold-500'
    }
  ];

  const benefits = [
    'Global banking with local expertise',
    '24/7 customer support in multiple languages',
    'Advanced security with biometric authentication',
    'Real-time notifications and alerts',
    'Comprehensive mobile and web banking',
    'Competitive exchange rates'
  ];

  return (
    <div className="min-h-screen bg-white">
      <ProfessionalNavigation />

      {/* Hero Section with Scrolling Background */}
      <section className="relative bg-gradient-to-br from-red-700 via-red-800 to-red-900 overflow-hidden">
        <ScrollingBackground
          images={personalBankingImages}
          speed={35}
          opacity={0.2}
          overlay={true}
        />

        <div className="relative py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="inline-flex items-center space-x-2 bg-yellow-500/20 backdrop-blur-sm border border-yellow-500/30 rounded-full px-6 py-2 text-yellow-400 mb-6">
                <Award className="h-4 w-4" />
                <span className="text-sm font-medium">Personal Banking Excellence</span>
              </div>

              <h1 className="text-5xl lg:text-6xl font-bold text-white mb-6">
                Personal Banking
                <span className="block text-yellow-400">Made Simple</span>
              </h1>

              <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
                Experience personalized banking solutions designed to help you achieve your financial goals.
                From everyday banking to long-term savings, we're here to support your journey.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  onClick={() => navigate('/open-account')}
                  className="bg-yellow-600 hover:bg-yellow-700 text-white px-8 py-3 text-lg font-semibold"
                >
                  Open Account
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button variant="outline" className="border-white text-white hover:bg-white hover:text-red-900 px-8 py-3 text-lg" onClick={() => navigate('/about')}>
                  Learn More
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-banking-dark mb-4">
              Choose Your Banking Solution
            </h2>
            <p className="text-lg text-banking-gray max-w-2xl mx-auto">
              Select from our range of personal banking products designed to meet your unique needs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {personalProducts.map((product) => {
              const IconComponent = product.icon;
              return (
                <Card 
                  key={product.id}
                  className={`cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${
                    selectedProduct === product.id ? 'ring-2 ring-banking-gold shadow-xl' : ''
                  }`}
                  onClick={() => setSelectedProduct(product.id)}
                >
                  <CardHeader className="text-center">
                    <div className={`w-16 h-16 ${product.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
                      <IconComponent className="h-8 w-8 text-white" />
                    </div>
                    <CardTitle className="text-xl text-banking-dark">{product.name}</CardTitle>
                    <CardDescription className="text-banking-gray">
                      {product.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="text-center">
                        <span className="text-sm text-banking-gray">Minimum Balance</span>
                        <div className="text-2xl font-bold text-banking-gold">{product.minBalance}</div>
                      </div>
                      <ul className="space-y-2">
                        {product.features.map((feature, index) => (
                          <li key={index} className="flex items-center text-sm">
                            <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                            <span className="text-banking-gray">{feature}</span>
                          </li>
                        ))}
                      </ul>
                      <Button className="w-full btn-banking-gold mt-4">
                        Get Started
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

      {/* Benefits Section */}
      <div className="bg-banking-light py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-banking-dark mb-6">
                Why Choose UBAS Personal Banking?
              </h2>
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start">
                    <CheckCircle className="h-6 w-6 text-banking-gold mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-banking-gray text-lg">{benefit}</span>
                  </div>
                ))}
              </div>
              <div className="mt-8">
                <Button className="btn-banking-gold hover-glow">
                  <Globe className="h-5 w-5 mr-2" />
                  Start Your Global Banking Journey
                </Button>
              </div>
            </div>
            <div className="relative">
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <div className="text-center">
                  <div className="text-4xl font-bold text-banking-gold mb-2">2M+</div>
                  <div className="text-banking-gray mb-6">Satisfied Customers Worldwide</div>
                  
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-banking-dark">150+</div>
                      <div className="text-sm text-banking-gray">Countries Served</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-banking-dark">24/7</div>
                      <div className="text-sm text-banking-gray">Customer Support</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-banking-dark">8</div>
                      <div className="text-sm text-banking-gray">Major Currencies</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-banking-dark">99.9%</div>
                      <div className="text-sm text-banking-gray">Uptime</div>
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
            Ready to Experience Global Banking Excellence?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Join millions of customers who trust UBAS Financial Trust for their personal banking needs
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="bg-white text-banking-gold hover:bg-banking-light">
              <CreditCard className="h-5 w-5 mr-2" />
              Open Account Now
            </Button>
            <Button variant="outline" className="border-white text-white hover:bg-white hover:text-banking-gold">
              Schedule Consultation
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
