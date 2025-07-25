import { Button } from '@/components/ui/button';
import { ArrowRight, Shield, TrendingUp, Users, Zap } from 'lucide-react';

interface HeroSectionProps {
  onGetStarted: () => void;
}

export function HeroSection({ onGetStarted }: HeroSectionProps) {
  return (
    <section className="relative bg-gradient-hero overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj4KPGcgZmlsbD0iIzAwMCIgZmlsbC1vcGFjaXR5PSIwLjAzIj4KPHBhdGggZD0ibTM2IDE0IDggOEgtNTBWMTRoMzZ6Ii8+CjwvZz4KPC9nPgo8L3N2Zz4=')] opacity-10"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight">
                Experience
                <span className="block text-banking-gold">Future Forward</span>
                Banking
              </h1>
              <p className="text-xl text-gray-300 leading-relaxed">
                Join over 2 million customers who trust Providus Bank for their financial journey. 
                From personal banking to corporate solutions, we deliver excellence at every touchpoint.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                variant="banking" 
                size="lg" 
                className="text-lg px-8 py-4"
                onClick={onGetStarted}
              >
                Open Account Today
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button 
                variant="banking-outline" 
                size="lg"
                className="text-lg px-8 py-4 border-white text-white hover:bg-white hover:text-banking-dark"
              >
                Learn More
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 pt-8">
              <div className="text-center">
                <div className="flex justify-center mb-2">
                  <Users className="h-8 w-8 text-banking-gold" />
                </div>
                <div className="text-2xl font-bold text-white">2M+</div>
                <div className="text-sm text-gray-300">Customers</div>
              </div>
              <div className="text-center">
                <div className="flex justify-center mb-2">
                  <TrendingUp className="h-8 w-8 text-banking-gold" />
                </div>
                <div className="text-2xl font-bold text-white">₦2.5T</div>
                <div className="text-sm text-gray-300">Assets</div>
              </div>
              <div className="text-center">
                <div className="flex justify-center mb-2">
                  <Shield className="h-8 w-8 text-banking-gold" />
                </div>
                <div className="text-2xl font-bold text-white">100%</div>
                <div className="text-sm text-gray-300">Secure</div>
              </div>
              <div className="text-center">
                <div className="flex justify-center mb-2">
                  <Zap className="h-8 w-8 text-banking-gold" />
                </div>
                <div className="text-2xl font-bold text-white">24/7</div>
                <div className="text-sm text-gray-300">Support</div>
              </div>
            </div>
          </div>

          {/* Right Content - Features */}
          <div className="relative">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
              <h3 className="text-2xl font-bold text-white mb-6">Why Choose Providus Bank?</h3>
              <div className="space-y-4">
                {[
                  {
                    icon: <Shield className="h-6 w-6" />,
                    title: 'Bank-Grade Security',
                    description: 'Your funds are protected with military-grade encryption and fraud monitoring.'
                  },
                  {
                    icon: <TrendingUp className="h-6 w-6" />,
                    title: 'High Returns',
                    description: 'Earn up to 16% per annum on fixed deposits and competitive rates on savings.'
                  },
                  {
                    icon: <Zap className="h-6 w-6" />,
                    title: 'Instant Transfers',
                    description: 'Send money anywhere in Nigeria instantly with our advanced payment infrastructure.'
                  }
                ].map((feature, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="p-2 bg-banking-gold/20 rounded-lg text-banking-gold">
                      {feature.icon}
                    </div>
                    <div>
                      <h4 className="font-semibold text-white">{feature.title}</h4>
                      <p className="text-sm text-gray-300">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
            fill="white"
          />
        </svg>
      </div>
    </section>
  );
}