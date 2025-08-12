import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PersonalRegistration } from '@/components/registration/PersonalRegistration';
import { BusinessRegistration } from '@/components/registration/BusinessRegistration';
import {
  Users,
  Building,
  Crown,
  ArrowRight,
  CheckCircle,
  Shield,
  Globe,
  Clock,
  Star,
  Home
} from 'lucide-react';

export default function OpenAccount() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [selectedAccountType, setSelectedAccountType] = useState<string>('');
  const [showRegistration, setShowRegistration] = useState(false);

  // Check for account type in URL parameters
  useEffect(() => {
    const accountType = searchParams.get('type');
    if (accountType && ['personal', 'business', 'corporate', 'private'].includes(accountType)) {
      setSelectedAccountType(accountType);
      setShowRegistration(true);
    }
  }, [searchParams]);

  const handleAccountTypeSelect = (accountType: string) => {
    setSelectedAccountType(accountType);
    setShowRegistration(true);
  };

  const handleRegistrationComplete = (customerData: Record<string, unknown>) => {
    // Handle successful registration
    console.log('Registration completed:', customerData);
  };

  const handleBackToSelection = () => {
    setShowRegistration(false);
    setSelectedAccountType('');
  };

  // Show specific registration component based on account type
  if (showRegistration) {
    switch (selectedAccountType) {
      case 'personal':
        return (
          <PersonalRegistration
            onComplete={handleRegistrationComplete}
            onBack={handleBackToSelection}
          />
        );
      case 'business':
        return (
          <BusinessRegistration
            onComplete={handleRegistrationComplete}
            onBack={handleBackToSelection}
          />
        );
      case 'corporate':
        // For now, redirect to business registration (can be customized later)
        return (
          <BusinessRegistration
            onComplete={handleRegistrationComplete}
            onBack={handleBackToSelection}
          />
        );
      case 'private':
        // For now, redirect to personal registration (can be customized later)
        return (
          <PersonalRegistration
            onComplete={handleRegistrationComplete}
            onBack={handleBackToSelection}
          />
        );
      default:
        setShowRegistration(false);
        return null;
    }
  }

  const accountTypes = [
    {
      id: 'personal',
      name: 'Personal Banking',
      description: 'Global everyday banking',
      icon: Users,
      minBalance: '$1,000',
      features: ['Multi-Currency Wallet', 'Global Debit Card', 'Mobile & Web Banking', '24/7 Support'],
      color: 'border-brand-200 hover:border-brand-400 bg-brand-50',
      benefits: ['No monthly fees', 'Instant transfers', 'Priority digital support']
    },
    {
      id: 'business',
      name: 'Business Banking',
      description: 'Scaling businesses worldwide',
      icon: Building,
      minBalance: '$50,000',
      features: ['Business Accounts', 'Global Payments', 'Cash Management', 'API Integration'],
      color: 'border-brand-200 hover:border-brand-400 bg-brand-50',
      benefits: ['Dedicated manager', 'Working capital lines', 'Advanced reporting']
    },
    {
      id: 'corporate',
      name: 'Corporate Banking',
      description: 'Enterprise financial solutions',
      icon: Building,
      minBalance: '$5,000,000',
      features: ['Treasury', 'Capital Markets', 'Advisory', 'Global Reach'],
      color: 'border-brand-200 hover:border-brand-400 bg-brand-50',
      benefits: ['Custom structuring', 'Cross-border network', 'Strategic advisory']
    },
    {
      id: 'private',
      name: 'Private Banking',
      description: 'Exclusive global wealth',
      icon: Crown,
      minBalance: '$10,000,000',
      features: ['Wealth Management', 'Estate Planning', 'Family Office', 'Concierge'],
      color: 'border-brand-200 hover:border-brand-400 bg-brand-50',
      benefits: ['Personal banker', 'Exclusive deals', 'Lifestyle services']
    }
  ];

  return (
  <div className="min-h-screen bg-gradient-to-b from-brand-50 via-white to-brand-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back to Homepage Button */}
        <div className="mb-8">
          <Button
            onClick={() => navigate('/')}
            variant="outline"
            className="flex items-center space-x-2 hover:bg-brand-100"
          >
            <Home className="h-4 w-4" />
            <span>Back to Homepage</span>
          </Button>
        </div>

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-brand-800 mb-4">
            Open Your Account
          </h1>
          <p className="text-xl text-brand-600 max-w-3xl mx-auto">
            Choose a global account tier. Scalable, secure and borderless banking for individuals, businesses and institutions.
          </p>
        </div>

        {/* Account Type Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {accountTypes.map((accountType) => {
            const Icon = accountType.icon;
            return (
              <Card
                key={accountType.id}
                className={`relative overflow-hidden transition-all duration-300 hover:shadow-xl cursor-pointer ${accountType.color}`}
                onClick={() => handleAccountTypeSelect(accountType.id)}
              >
                <CardHeader className="text-center pb-4">
                  <div className="w-16 h-16 mx-auto mb-4 bg-white rounded-full flex items-center justify-center shadow-lg">
                    <Icon className="h-8 w-8 text-brand-600" />
                  </div>
                  <CardTitle className="text-xl font-bold text-brand-800">
                    {accountType.name}
                  </CardTitle>
                  <CardDescription className="text-brand-600">
                    {accountType.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-6">
                  {/* Minimum Balance */}
                  <div className="text-center">
                    <p className="text-sm text-brand-500 mb-1">Minimum Balance</p>
                    <p className="text-2xl font-bold text-brand-800">{accountType.minBalance}</p>
                  </div>

                  {/* Features */}
                  <div>
                    <h4 className="font-semibold text-brand-800 mb-3">Key Features</h4>
                    <ul className="space-y-2">
                      {accountType.features.map((feature, index) => (
                        <li key={index} className="flex items-center text-sm text-brand-600">
                          <CheckCircle className="h-4 w-4 text-brand-600 mr-2 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Benefits */}
                  <div>
                    <h4 className="font-semibold text-brand-800 mb-3">Benefits</h4>
                    <ul className="space-y-2">
                      {accountType.benefits.map((benefit, index) => (
                        <li key={index} className="flex items-center text-sm text-brand-600">
                          <Star className="h-4 w-4 text-brand-500 mr-2 flex-shrink-0" />
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* CTA Button */}
                  <Button
                    className="w-full bg-red-600 hover:bg-red-700 text-white"
                    onClick={() => handleAccountTypeSelect(accountType.id)}
                  >
                    Open {accountType.name}
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </CardContent>

                {/* Popular Badge for Personal */}
        {accountType.id === 'personal' && (
                  <div className="absolute top-4 right-4">
          <span className="bg-red-600 text-white text-xs font-medium px-2 py-1 rounded-full">Most Popular</span>
                  </div>
                )}

                {/* Premium Badge for Private */}
        {accountType.id === 'private' && (
                  <div className="absolute top-4 right-4">
          <span className="bg-red-700 text-white text-xs font-medium px-2 py-1 rounded-full">Premium</span>
                  </div>
                )}
              </Card>
            );
          })}
        </div>

        {/* Additional Information */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-12 h-12 bg-brand-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="h-6 w-6 text-brand-600" />
            </div>
            <h3 className="text-lg font-semibold text-brand-800 mb-2">Bank-Level Security</h3>
            <p className="text-brand-600">
              Your funds are protected with advanced encryption and FDIC insurance up to $250,000.
            </p>
          </div>

          <div className="text-center">
            <div className="w-12 h-12 bg-brand-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Globe className="h-6 w-6 text-brand-600" />
            </div>
            <h3 className="text-lg font-semibold text-brand-800 mb-2">Global Access</h3>
            <p className="text-brand-600">
              Access your accounts from anywhere in the world with our mobile app and online banking.
            </p>
          </div>

          <div className="text-center">
            <div className="w-12 h-12 bg-brand-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="h-6 w-6 text-brand-600" />
            </div>
            <h3 className="text-lg font-semibold text-brand-800 mb-2">Quick Setup</h3>
            <p className="text-brand-600">
              Open your account in minutes with our streamlined digital application process.
            </p>
          </div>
        </div>

        {/* Contact Information */}
        <div className="mt-16 text-center">
          <h3 className="text-2xl font-bold text-brand-800 mb-4">Need Help Choosing?</h3>
          <p className="text-brand-600 mb-6">
            Our global specialists can guide your selection. Reach out anytime.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="outline" className="flex items-center border-brand-300 text-brand-700 hover:bg-brand-50">
              <span>Call (555) 123-4567</span>
            </Button>
            <Button variant="outline" className="flex items-center border-brand-300 text-brand-700 hover:bg-brand-50">
              <span>Schedule a Consultation</span>
            </Button>
            <Button variant="outline" className="flex items-center border-brand-300 text-brand-700 hover:bg-brand-50">
              <span>Live Chat Support</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
