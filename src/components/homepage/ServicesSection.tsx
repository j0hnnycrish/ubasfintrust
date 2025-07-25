import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ACCOUNT_TYPES } from '@/types/accountTypes';
import { ArrowRight } from 'lucide-react';

interface ServicesSectionProps {
  onSelectService: (accountType: string) => void;
}

export function ServicesSection({ onSelectService }: ServicesSectionProps) {
  return (
    <section className="py-24 bg-banking-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-banking-dark mb-4">
            Banking Solutions for Every Need
          </h2>
          <p className="text-xl text-banking-gray max-w-3xl mx-auto">
            From personal savings to corporate treasury management, we provide comprehensive 
            financial solutions tailored to your unique requirements.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {Object.values(ACCOUNT_TYPES).map((accountType) => (
            <Card 
              key={accountType.id}
              className="group hover:shadow-elegant transition-all duration-300 border-2 border-transparent hover:border-banking-gold/30 bg-gradient-card"
            >
              <CardHeader className="text-center space-y-4">
                <div 
                  className="w-16 h-16 rounded-full mx-auto flex items-center justify-center text-white font-bold text-xl"
                  style={{ backgroundColor: accountType.mainColor }}
                >
                  {accountType.name.charAt(0)}
                </div>
                <CardTitle className="text-xl font-bold text-banking-dark">
                  {accountType.name}
                </CardTitle>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <p className="text-banking-gray text-center">
                  {accountType.description}
                </p>
                
                <div className="space-y-3">
                  <h4 className="font-semibold text-banking-dark text-sm">Key Features:</h4>
                  <ul className="space-y-2">
                    {accountType.features.slice(0, 3).map((feature, index) => (
                      <li key={index} className="flex items-center text-sm text-banking-gray">
                        <div 
                          className="w-2 h-2 rounded-full mr-3"
                          style={{ backgroundColor: accountType.mainColor }}
                        ></div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-4 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-banking-gray">Minimum Balance:</span>
                    <span className="font-semibold text-banking-dark">
                      ₦{accountType.minimumBalance.toLocaleString()}
                    </span>
                  </div>
                  {accountType.interestRate && (
                    <div className="flex justify-between text-sm">
                      <span className="text-banking-gray">Interest Rate:</span>
                      <span className="font-semibold text-green-600">
                        {accountType.interestRate}% p.a.
                      </span>
                    </div>
                  )}
                </div>

                <Button 
                  className="w-full group-hover:shadow-md transition-all"
                  style={{ backgroundColor: accountType.mainColor }}
                  onClick={() => onSelectService(accountType.id)}
                >
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Additional Services */}
        <div className="mt-20">
          <h3 className="text-2xl font-bold text-banking-dark text-center mb-12">
            Additional Services
          </h3>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: 'Fixed Deposits',
                description: 'Earn up to 16% per annum with our high-yield fixed deposit accounts.',
                rate: '16% p.a.',
                color: '#F59E0B'
              },
              {
                title: 'Investment Banking',
                description: 'Professional investment advisory and portfolio management services.',
                rate: 'Tailored',
                color: '#8B5CF6'
              },
              {
                title: 'Trade Finance',
                description: 'Comprehensive trade finance solutions for import and export businesses.',
                rate: 'Competitive',
                color: '#10B981'
              }
            ].map((service, index) => (
              <Card key={index} className="text-center hover:shadow-card-banking transition-shadow bg-gradient-card">
                <CardContent className="p-8 space-y-4">
                  <div 
                    className="w-12 h-12 rounded-full mx-auto flex items-center justify-center text-white font-bold"
                    style={{ backgroundColor: service.color }}
                  >
                    {service.title.charAt(0)}
                  </div>
                  <h4 className="text-lg font-bold text-banking-dark">{service.title}</h4>
                  <p className="text-banking-gray">{service.description}</p>
                  <div className="pt-2">
                    <span className="text-lg font-bold" style={{ color: service.color }}>
                      {service.rate}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}