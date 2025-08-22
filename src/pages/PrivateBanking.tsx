// import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Crown, Shield, TrendingUp, Users, Briefcase, Globe } from 'lucide-react';

export default function PrivateBanking() {
  const services = [
    {
      icon: Crown,
      title: "Wealth Management",
      description: "Comprehensive portfolio management and investment advisory services tailored to your financial goals.",
      features: ["Portfolio Analysis", "Risk Assessment", "Investment Strategy", "Performance Monitoring"]
    },
    {
      icon: Shield,
      title: "Estate Planning",
      description: "Strategic planning to preserve and transfer wealth across generations with tax efficiency.",
      features: ["Trust Services", "Will Preparation", "Tax Planning", "Legacy Management"]
    },
    {
      icon: TrendingUp,
      title: "Investment Services",
      description: "Access to exclusive investment opportunities and sophisticated financial instruments.",
      features: ["Private Equity", "Hedge Funds", "Alternative Investments", "IPO Access"]
    },
    {
      icon: Users,
      title: "Family Office Services",
      description: "Centralized management of all family financial affairs with dedicated relationship managers.",
      features: ["Financial Coordination", "Lifestyle Management", "Philanthropic Advisory", "Next-Gen Education"]
    },
    {
      icon: Briefcase,
      title: "Business Banking",
      description: "Sophisticated banking solutions for your business entities and corporate structures.",
      features: ["Corporate Accounts", "Trade Finance", "Cash Management", "Credit Solutions"]
    },
    {
      icon: Globe,
      title: "International Banking",
      description: "Global banking services for clients with international financial needs and interests.",
      features: ["Multi-Currency Accounts", "Foreign Exchange", "International Transfers", "Global Access"]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Crown className="h-12 w-12 text-amber-600 mr-3" />
            <h1 className="text-4xl font-bold text-gray-900">Private Banking</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Exclusive banking services designed for high-net-worth individuals and families,
            offering personalized financial solutions and dedicated relationship management.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {services.map((service, index) => {
            const IconComponent = service.icon;
            return (
              <Card key={index} className="group hover:shadow-lg transition-all duration-300 border-0 shadow-md bg-white/80 backdrop-blur-sm">
                <CardHeader className="text-center pb-4">
                  <div className="flex justify-center mb-4">
                    <div className="p-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white group-hover:scale-110 transition-transform duration-300">
                      <IconComponent className="h-8 w-8" />
                    </div>
                  </div>
                  <CardTitle className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                    {service.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {service.description}
                  </p>
                  <div className="space-y-2">
                    {service.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center justify-center text-sm text-gray-700">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                        {feature}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Call to Action */}
        <div className="text-center bg-white/60 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-gray-200">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Ready to Experience Private Banking Excellence?
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Schedule a consultation with our private banking specialists to discuss how we can serve your unique financial needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300">
              Schedule Consultation
            </Button>
            <Button variant="outline" size="lg" className="border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-3 rounded-full font-semibold">
              Learn More
            </Button>
          </div>
        </div>

        {/* Contact Information */}
        <div className="mt-12 text-center">
          <div className="bg-white/40 backdrop-blur-sm rounded-xl p-6 shadow-md border border-gray-200">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Private Banking Contact</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-gray-600">
              <div>
                <div className="font-medium text-gray-900">Dedicated Hotline</div>
                <div>+1 (555) 123-PRIVATE</div>
              </div>
              <div>
                <div className="font-medium text-gray-900">Email</div>
                <div>privatebanking@ubasfintrust.com</div>
              </div>
              <div>
                <div className="font-medium text-gray-900">Hours</div>
                <div>24/7 Concierge Service</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
