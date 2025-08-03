import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ScrollingBackground, bankingImages } from '@/components/ui/ScrollingBackground';
import {
  ArrowRight,
  Shield,
  TrendingUp,
  Users,
  Zap,
  Globe,
  Award,
  Building,
  CreditCard,
  Play,
  CheckCircle,
  Star,
  Lock,
  Clock,
  DollarSign,
  PiggyBank,
  LineChart,
  Smartphone,
  HeadphonesIcon
} from 'lucide-react';

interface HeroSectionProps {
  onGetStarted: () => void;
}

export function HeroSection({ onGetStarted }: HeroSectionProps) {
  const navigate = useNavigate();
  const [currentStat, setCurrentStat] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  const stats = [
    { icon: Users, value: '2.5M+', label: 'Global Customers', color: 'text-banking-gold' },
    { icon: Globe, value: '150+', label: 'Countries Served', color: 'text-blue-400' },
    { icon: DollarSign, value: '$2.8T', label: 'Assets Under Management', color: 'text-green-400' },
    { icon: Award, value: '50+', label: 'Industry Awards', color: 'text-purple-400' }
  ];

  const features = [
    { icon: Shield, title: 'Bank-Grade Security', desc: '256-bit SSL encryption' },
    { icon: Clock, title: '24/7 Support', desc: 'Global customer service' },
    { icon: Smartphone, title: 'Digital First', desc: 'Award-winning mobile app' },
    { icon: Lock, title: 'FDIC Insured', desc: 'Up to $250,000 protection' }
  ];

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setCurrentStat((prev) => (prev + 1) % stats.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleWatchDemo = () => {
    navigate('/about');
  };

  const handleLearnMore = () => {
    navigate('/about');
  };
  return (
    <section className="relative bg-gradient-hero overflow-hidden min-h-screen flex items-center">
      {/* Scrolling Background Images */}
      <ScrollingBackground
        images={bankingImages}
        speed={40}
        opacity={0.15}
        overlay={true}
      />

      {/* Advanced Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj4KPGcgZmlsbD0iIzAwMCIgZmlsbC1vcGFjaXR5PSIwLjAzIj4KPHBhdGggZD0ibTM2IDE0IDggOEgtNTBWMTRoMzZ6Ii8+CjwvZz4KPC9nPgo8L3N2Zz4=')] opacity-10"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-banking-gold/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32 w-full">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div className={`space-y-8 ${isVisible ? 'animate-fade-in' : 'opacity-0'}`}>
            {/* Badge */}
            <div className="inline-flex items-center space-x-2 bg-banking-gold/20 backdrop-blur-sm border border-banking-gold/30 rounded-full px-4 py-2 text-banking-gold animate-scale-in">
              <Award className="h-4 w-4" />
              <span className="text-sm font-medium">World's Most Trusted Bank 2024</span>
            </div>

            <div className="space-y-6">
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-tight">
                <span className="block animate-slide-up">Experience</span>
                <span className="block text-gradient-gold animate-slide-up" style={{ animationDelay: '0.2s' }}>Global Excellence</span>
                <span className="block animate-slide-up" style={{ animationDelay: '0.4s' }}>in Banking</span>
              </h1>
              <p className="text-xl text-gray-300 leading-relaxed max-w-lg animate-fade-in" style={{ animationDelay: '0.6s' }}>
                Join over 2.5 million customers worldwide who trust UBAS Financial Trust for their financial journey.
                From personal banking to private wealth management, we deliver excellence at every touchpoint.
              </p>
            </div>

            {/* Enhanced CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 animate-fade-in" style={{ animationDelay: '0.8s' }}>
              <Button
                className="btn-banking-gold text-lg px-10 py-5 hover-glow animate-pulse-gold group"
                onClick={onGetStarted}
              >
                <CreditCard className="mr-3 h-5 w-5 group-hover:scale-110 transition-transform" />
                Open Account Today
                <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                className="btn-banking-outline text-lg px-10 py-5 border-2 border-white text-white hover:bg-white hover:text-banking-dark group"
                onClick={handleWatchDemo}
              >
                <Play className="mr-3 h-5 w-5 group-hover:scale-110 transition-transform" />
                Watch Demo
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap items-center gap-8 pt-8 animate-fade-in" style={{ animationDelay: '1s' }}>
              <div className="flex items-center space-x-2 text-gray-300">
                <Shield className="h-5 w-5 text-banking-gold" />
                <span className="text-sm">FDIC Insured</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-300">
                <Lock className="h-5 w-5 text-banking-gold" />
                <span className="text-sm">256-bit SSL</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-300">
                <Award className="h-5 w-5 text-banking-gold" />
                <span className="text-sm">ISO 27001 Certified</span>
              </div>
            </div>

            {/* Dynamic Statistics */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 pt-8 animate-fade-in" style={{ animationDelay: '1.2s' }}>
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div
                    key={index}
                    className={`text-center p-4 rounded-lg transition-all duration-500 hover-lift ${
                      currentStat === index ? 'bg-banking-gold/20 scale-105' : 'hover:bg-white/10'
                    }`}
                  >
                    <div className="flex justify-center mb-3">
                      <Icon className={`h-8 w-8 ${stat.color} animate-pulse`} />
                    </div>
                    <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                    <div className="text-sm text-gray-300">{stat.label}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Content - Advanced Features Dashboard */}
          <div className={`relative ${isVisible ? 'animate-scale-in' : 'opacity-0'}`} style={{ animationDelay: '1.4s' }}>
            {/* Floating Elements */}
            <div className="absolute -top-4 -right-4 w-20 h-20 bg-banking-gold/20 rounded-full blur-xl animate-float"></div>
            <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-blue-500/20 rounded-full blur-xl animate-float" style={{ animationDelay: '1s' }}></div>

            <div className="glass-morphism-dark rounded-3xl p-8 border border-banking-gold/30 hover-lift">
              <div className="text-center mb-8">
                <h3 className="text-3xl font-bold text-white mb-2">Why Choose UBAS?</h3>
                <p className="text-gray-300">Experience banking reimagined</p>
              </div>

              <div className="space-y-6">
                {features.map((feature, index) => {
                  const Icon = feature.icon;
                  return (
                    <div
                      key={index}
                      className="flex items-start space-x-4 p-4 rounded-xl hover:bg-banking-gold/10 transition-all duration-300 group cursor-pointer hover-lift"
                      style={{ animationDelay: `${1.6 + index * 0.2}s` }}
                    >
                      <div className="flex-shrink-0 w-12 h-12 bg-banking-gold/20 rounded-xl flex items-center justify-center group-hover:bg-banking-gold/30 transition-colors">
                        <Icon className="h-6 w-6 text-banking-gold group-hover:scale-110 transition-transform" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-white group-hover:text-banking-gold transition-colors">{feature.title}</h4>
                        <p className="text-sm text-gray-300 mt-1">{feature.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Quick Actions */}
              <div className="mt-8 pt-6 border-t border-banking-gold/20">
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={handleLearnMore}
                    className="flex items-center justify-center space-x-2 p-3 bg-banking-gold/20 rounded-lg hover:bg-banking-gold/30 transition-all duration-300 text-white hover-lift group"
                  >
                    <LineChart className="h-4 w-4 group-hover:scale-110 transition-transform" />
                    <span className="text-sm font-medium">Learn More</span>
                  </button>
                  <button
                    onClick={() => navigate('/contact')}
                    className="flex items-center justify-center space-x-2 p-3 bg-blue-500/20 rounded-lg hover:bg-blue-500/30 transition-all duration-300 text-white hover-lift group"
                  >
                    <HeadphonesIcon className="h-4 w-4 group-hover:scale-110 transition-transform" />
                    <span className="text-sm font-medium">Talk to Advisor</span>
                  </button>
                </div>
              </div>

              {/* Live Market Indicator */}
              <div className="mt-6 p-4 bg-green-500/10 rounded-lg border border-green-500/20">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm text-green-400 font-medium">Markets Open</span>
                  </div>
                  <div className="text-sm text-white">
                    <span className="text-green-400">+2.4%</span> Today
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Bottom Wave with Animation */}
      <div className="absolute bottom-0 left-0 right-0 overflow-hidden">
        <svg
          viewBox="0 0 1440 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-auto animate-float"
        >
          <defs>
            <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="white" stopOpacity="0.8" />
              <stop offset="50%" stopColor="white" stopOpacity="1" />
              <stop offset="100%" stopColor="white" stopOpacity="0.8" />
            </linearGradient>
          </defs>
          <path
            d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
            fill="url(#waveGradient)"
          />
        </svg>
      </div>

      {/* Floating Action Button */}
      <div className="absolute bottom-8 right-8 animate-bounce">
        <button
          onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
          className="w-12 h-12 bg-banking-gold rounded-full flex items-center justify-center shadow-floating hover:scale-110 transition-transform"
        >
          <ArrowRight className="h-5 w-5 text-white rotate-90" />
        </button>
      </div>
    </section>
  );
}