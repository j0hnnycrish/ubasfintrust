import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ACCOUNT_TYPES } from '@/types/accountTypes';
import {
  ArrowRight,
  Users,
  Briefcase,
  Building,
  Award,
  CreditCard,
  PiggyBank,
  TrendingUp,
  Shield,
  Globe,
  Smartphone,
  HeadphonesIcon,
  LineChart,
  DollarSign,
  Lock,
  Zap,
  Clock,
  Target,
  Calculator,
  FileText,
  CheckCircle,
  Star
} from 'lucide-react';

interface ServicesSectionProps {
  onSelectService: (accountType: string) => void;
}

export function ServicesSection({ onSelectService }: ServicesSectionProps) {
  const navigate = useNavigate();
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const section = document.getElementById('services-section');
    if (section) observer.observe(section);

    return () => observer.disconnect();
  }, []);

  const getAccountIcon = (accountId: string) => {
    switch (accountId) {
      case 'personal': return Users;
      case 'business': return Briefcase;
      case 'corporate': return Building;
      case 'private': return Award;
      default: return CreditCard;
    }
  };

  const handleLearnMore = (accountType: string, feature: string) => {
    // Navigate to appropriate pages based on account type and feature
    switch (accountType) {
      case 'personal':
        navigate('/personal');
        break;
      case 'business':
        navigate('/business');
        break;
      case 'corporate':
        navigate('/corporate');
        break;
      case 'private':
        navigate('/private');
        break;
      case 'specialized':
        if (feature.toLowerCase().includes('contact') || feature.toLowerCase().includes('advisor')) {
          navigate('/contact');
        } else {
          navigate('/about');
        }
        break;
      case 'general':
        if (feature === 'contact') {
          navigate('/contact');
        } else {
          navigate('/about');
        }
        break;
      default:
        navigate('/about');
    }
  };
  return (
    <section id="services-section" className="py-24 bg-gradient-to-br from-banking-bg to-white relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-banking-gold/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Enhanced Section Header */}
        <div className={`text-center mb-20 ${isVisible ? 'animate-fade-in' : 'opacity-0'}`}>
          <div className="inline-flex items-center space-x-2 bg-banking-gold/10 backdrop-blur-sm border border-banking-gold/20 rounded-full px-6 py-2 text-banking-gold mb-6 animate-scale-in">
            <Star className="h-4 w-4" />
            <span className="text-sm font-medium">Comprehensive Banking Solutions</span>
          </div>

          <h2 className="text-5xl lg:text-6xl font-bold text-banking-dark mb-6 animate-slide-up">
            Banking Solutions for
            <span className="block text-gradient-gold">Every Need</span>
          </h2>

          <p className="text-xl text-banking-gray max-w-4xl mx-auto leading-relaxed animate-fade-in" style={{ animationDelay: '0.3s' }}>
            From personal savings to corporate treasury management, we provide comprehensive
            financial solutions tailored to your unique requirements. Experience banking excellence
            with our award-winning services and global reach.
          </p>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-12 animate-fade-in" style={{ animationDelay: '0.5s' }}>
            {[
              { icon: Users, value: '2.5M+', label: 'Happy Customers' },
              { icon: Globe, value: '150+', label: 'Countries' },
              { icon: Shield, value: '99.9%', label: 'Uptime' },
              { icon: Award, value: '50+', label: 'Awards' }
            ].map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="text-center group">
                  <div className="w-12 h-12 bg-banking-gold/10 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:bg-banking-gold/20 transition-colors">
                    <Icon className="h-6 w-6 text-banking-gold" />
                  </div>
                  <div className="text-2xl font-bold text-banking-dark">{stat.value}</div>
                  <div className="text-sm text-banking-gray">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Enhanced Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {Object.values(ACCOUNT_TYPES).map((accountType, index) => {
            const Icon = getAccountIcon(accountType.id);
            const isHovered = hoveredCard === accountType.id;

            return (
              <Card
                key={accountType.id}
                className={`card-banking group hover-lift cursor-pointer relative overflow-hidden ${
                  isVisible ? 'animate-scale-in' : 'opacity-0'
                }`}
                style={{ animationDelay: `${0.7 + index * 0.1}s` }}
                onMouseEnter={() => setHoveredCard(accountType.id)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                {/* Hover Overlay */}
                <div className={`absolute inset-0 bg-gradient-to-br from-banking-gold/10 to-transparent transition-opacity duration-300 ${
                  isHovered ? 'opacity-100' : 'opacity-0'
                }`}></div>

                <CardHeader className="text-center space-y-6 relative z-10">
                  {/* Enhanced Icon */}
                  <div className="relative">
                    <div
                      className={`w-20 h-20 rounded-2xl mx-auto flex items-center justify-center transition-all duration-300 ${
                        isHovered ? 'scale-110 shadow-lg' : ''
                      }`}
                      style={{ backgroundColor: `${accountType.mainColor}20` }}
                    >
                      <Icon
                        className="h-10 w-10 transition-all duration-300"
                        style={{ color: accountType.mainColor }}
                      />
                    </div>
                    {/* Floating Badge */}
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-banking-gold rounded-full flex items-center justify-center">
                      <CheckCircle className="h-3 w-3 text-white" />
                    </div>
                  </div>

                  <div>
                    <CardTitle className="text-xl font-bold text-banking-dark group-hover:text-banking-gold transition-colors">
                      {accountType.name}
                    </CardTitle>
                    <div className="flex items-center justify-center space-x-1 mt-2">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-3 w-3 fill-banking-gold text-banking-gold" />
                      ))}
                      <span className="text-xs text-banking-gray ml-2">5.0 Rating</span>
                    </div>
                  </div>
                </CardHeader>
              
              <CardContent className="space-y-6 relative z-10">
                <p className="text-banking-gray text-center leading-relaxed">
                  {accountType.description}
                </p>

                {/* Enhanced Features List */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-banking-dark text-sm flex items-center">
                    <Target className="h-4 w-4 mr-2 text-banking-gold" />
                    Key Features:
                  </h4>
                  <ul className="space-y-3">
                    {accountType.features.slice(0, 3).map((feature, featureIndex) => (
                      <li
                        key={featureIndex}
                        className="flex items-start text-sm text-banking-gray group cursor-pointer hover:text-banking-dark transition-colors"
                        onClick={() => handleLearnMore(accountType.id, feature)}
                      >
                        <div className="flex-shrink-0 w-5 h-5 rounded-full mr-3 mt-0.5 flex items-center justify-center group-hover:scale-110 transition-transform"
                             style={{ backgroundColor: `${accountType.mainColor}20` }}>
                          <CheckCircle
                            className="w-3 h-3"
                            style={{ color: accountType.mainColor }}
                          />
                        </div>
                        <span className="group-hover:font-medium transition-all">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Show More Features */}
                  {accountType.features.length > 3 && (
                    <button
                      className="text-xs text-banking-gold hover:text-banking-dark transition-colors flex items-center"
                      onClick={() => handleLearnMore(accountType.id, 'all-features')}
                    >
                      <span>+{accountType.features.length - 3} more features</span>
                      <ArrowRight className="h-3 w-3 ml-1" />
                    </button>
                  )}
                </div>

                {/* Enhanced Pricing Section */}
                <div className="pt-4 space-y-4 border-t border-gray-100">
                  <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-banking-gray flex items-center">
                        <DollarSign className="h-4 w-4 mr-1" />
                        Minimum Balance:
                      </span>
                      <span className="font-bold text-banking-dark">
                        ${accountType.minimumBalance.USD?.toLocaleString() || '1,000'}
                      </span>
                    </div>
                    {accountType.interestRate && (
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-banking-gray flex items-center">
                          <TrendingUp className="h-4 w-4 mr-1" />
                          Interest Rate:
                        </span>
                        <span className="font-bold text-green-600 flex items-center">
                          {accountType.interestRate}% p.a.
                          <LineChart className="h-3 w-3 ml-1" />
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-banking-gray flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        Setup Time:
                      </span>
                      <span className="font-bold text-blue-600">5 minutes</span>
                    </div>
                  </div>
                </div>

                {/* Enhanced Action Buttons */}
                <div className="space-y-3">
                  <Button
                    className="w-full btn-banking-gold hover-glow group"
                    onClick={() => onSelectService(accountType.id)}
                  >
                    <CreditCard className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" />
                    Open Account Now
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>

                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs hover:bg-banking-gold/10 hover:border-banking-gold/30"
                      onClick={() => handleLearnMore(accountType.id, 'details')}
                    >
                      <FileText className="h-3 w-3 mr-1" />
                      Learn More
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs hover:bg-banking-gold/10 hover:border-banking-gold/30"
                      onClick={() => handleLearnMore(accountType.id, 'calculator')}
                    >
                      <Calculator className="h-3 w-3 mr-1" />
                      Calculate
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
            );
          })}
        </div>

        {/* Enhanced Additional Services */}
        <div className="mt-24">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold text-banking-dark mb-4">
              Specialized Financial Services
            </h3>
            <p className="text-xl text-banking-gray max-w-3xl mx-auto">
              Comprehensive financial solutions designed for sophisticated banking needs
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: 'Fixed Deposits',
                description: 'Earn up to 16% per annum with our high-yield fixed deposit accounts. Flexible terms from 30 days to 5 years.',
                rate: 'Up to 16% p.a.',
                color: '#F59E0B',
                icon: PiggyBank,
                features: ['Flexible Terms', 'Auto-Renewal', 'Premature Withdrawal'],
                minAmount: '$100,000'
              },
              {
                title: 'Investment Banking',
                description: 'Professional investment advisory and portfolio management services with global market access.',
                rate: 'Tailored Solutions',
                color: '#8B5CF6',
                icon: TrendingUp,
                features: ['Portfolio Management', 'Risk Assessment', 'Global Markets'],
                minAmount: '$5,000,000'
              },
              {
                title: 'Trade Finance',
                description: 'Comprehensive trade finance solutions for import and export businesses with competitive rates.',
                rate: 'Competitive Rates',
                color: '#10B981',
                icon: Globe,
                features: ['Letters of Credit', 'Trade Guarantees', 'Export Financing'],
                minAmount: '$1,000,000'
              }
            ].map((service, index) => {
              const Icon = service.icon;
              return (
                <Card
                  key={index}
                  className={`card-banking-premium text-center hover-lift cursor-pointer group ${
                    isVisible ? 'animate-scale-in' : 'opacity-0'
                  }`}
                  style={{ animationDelay: `${1.5 + index * 0.2}s` }}
                  onClick={() => handleLearnMore('specialized', service.title)}
                >
                  <CardContent className="p-8 space-y-6">
                    {/* Enhanced Icon */}
                    <div className="relative">
                      <div
                        className="w-16 h-16 rounded-2xl mx-auto flex items-center justify-center text-white font-bold transition-all duration-300 group-hover:scale-110 group-hover:rotate-3"
                        style={{ backgroundColor: service.color }}
                      >
                        <Icon className="h-8 w-8" />
                      </div>
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-banking-gold rounded-full flex items-center justify-center">
                        <Star className="h-3 w-3 text-white" />
                      </div>
                    </div>

                    <div>
                      <h4 className="text-xl font-bold text-banking-dark group-hover:text-banking-gold transition-colors mb-2">
                        {service.title}
                      </h4>
                      <p className="text-banking-gray leading-relaxed">{service.description}</p>
                    </div>

                    {/* Features */}
                    <div className="space-y-3">
                      <h5 className="font-semibold text-banking-dark text-sm">Key Benefits:</h5>
                      <ul className="space-y-2">
                        {service.features.map((feature, featureIndex) => (
                          <li key={featureIndex} className="flex items-center text-sm text-banking-gray">
                            <CheckCircle className="h-3 w-3 mr-2" style={{ color: service.color }} />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Pricing Info */}
                    <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-banking-gray">Returns:</span>
                        <span className="font-bold" style={{ color: service.color }}>
                          {service.rate}
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-banking-gray">Minimum:</span>
                        <span className="font-bold text-banking-dark">{service.minAmount}</span>
                      </div>
                    </div>

                    {/* Action Button */}
                    <Button
                      className="w-full hover-glow group"
                      style={{ backgroundColor: service.color }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleLearnMore('specialized', service.title);
                      }}
                    >
                      Learn More
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Call to Action Section */}
        <div className="mt-24 text-center">
          <div className="bg-gradient-to-r from-banking-dark to-banking-dark-light rounded-3xl p-12 text-white relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-banking-gold/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl"></div>

            <div className="relative z-10 max-w-3xl mx-auto">
              <h3 className="text-3xl lg:text-4xl font-bold mb-4">
                Ready to Experience Banking Excellence?
              </h3>
              <p className="text-xl text-gray-300 mb-8">
                Join over 2.5 million customers who trust UBAS Financial Trust for their financial needs.
                Open your account today and discover the difference.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  className="btn-banking-gold text-lg px-8 py-4 hover-glow"
                  onClick={() => onSelectService('personal')}
                >
                  <CreditCard className="mr-2 h-5 w-5" />
                  Open Account Now
                </Button>
                <Button
                  variant="outline"
                  className="text-lg px-8 py-4 border-white text-white hover:bg-white hover:text-banking-dark"
                  onClick={() => handleLearnMore('general', 'contact')}
                >
                  <HeadphonesIcon className="mr-2 h-5 w-5" />
                  Talk to an Advisor
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}