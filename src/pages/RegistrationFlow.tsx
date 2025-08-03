import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { RegisterForm } from '@/components/auth/RegisterForm';
import { OnboardingFlow } from '@/components/onboarding/OnboardingFlow';
import { PrivateBankingOnboarding } from '@/components/onboarding/PrivateBankingOnboarding';
import { KYCVerificationFlow } from '@/components/kyc/KYCVerificationFlow';
import { PrivateBankingRegistration } from '@/components/registration/PrivateBankingRegistration';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Crown, 
  Shield, 
  Star, 
  Users, 
  Building, 
  User,
  ArrowRight,
  CheckCircle
} from 'lucide-react';

type RegistrationStep = 'select-type' | 'register' | 'onboarding' | 'kyc' | 'complete';
type AccountType = 'personal' | 'business' | 'corporate' | 'private';

interface User {
  id: string;
  username: string;
  email: string;
  accountType: AccountType;
  fullName: string;
  phoneNumber: string;
}

export default function RegistrationFlow() {
  const [currentStep, setCurrentStep] = useState<RegistrationStep>('select-type');
  const [selectedAccountType, setSelectedAccountType] = useState<AccountType | null>(null);
  const [registeredUser, setRegisteredUser] = useState<User | null>(null);
  const navigate = useNavigate();
  const { login } = useAuth();

  const accountTypes = [
    {
      id: 'personal' as AccountType,
      name: 'Personal Banking',
      description: 'Individual banking services for personal financial needs',
      icon: User,
      features: ['Multi-currency accounts', 'Investment options', 'Mobile banking', '24/7 support'],
      minBalance: '$1,000',
      color: 'from-blue-500 to-blue-600',
      bgColor: 'from-blue-50 to-blue-100',
      borderColor: 'border-blue-200'
    },
    {
      id: 'business' as AccountType,
      name: 'Business Banking',
      description: 'Comprehensive banking solutions for small to medium businesses',
      icon: Building,
      features: ['Business accounts', 'Payroll services', 'Trade finance', 'Cash management'],
      minBalance: '$5,000',
      color: 'from-green-500 to-green-600',
      bgColor: 'from-green-50 to-green-100',
      borderColor: 'border-green-200'
    },
    {
      id: 'corporate' as AccountType,
      name: 'Corporate Banking',
      description: 'Advanced financial services for large corporations and institutions',
      icon: Users,
      features: ['Treasury services', 'Capital markets', 'Risk management', 'Global banking'],
      minBalance: '$100,000',
      color: 'from-purple-500 to-purple-600',
      bgColor: 'from-purple-50 to-purple-100',
      borderColor: 'border-purple-200'
    },
    {
      id: 'private' as AccountType,
      name: 'Private Banking',
      description: 'Exclusive wealth management for ultra-high-net-worth individuals',
      icon: Crown,
      features: ['Dedicated relationship manager', 'Alternative investments', 'Concierge services', 'Global access'],
      minBalance: '$10,000,000',
      color: 'from-gold-500 to-yellow-600',
      bgColor: 'from-gold-50 to-yellow-100',
      borderColor: 'border-gold-200',
      exclusive: true
    }
  ];

  const handleAccountTypeSelect = (accountType: AccountType) => {
    setSelectedAccountType(accountType);
    if (accountType === 'private') {
      setCurrentStep('register'); // Private banking has its own registration flow
    } else {
      setCurrentStep('register');
    }
  };

  const handleRegistrationComplete = (user: User) => {
    setRegisteredUser(user);
    setCurrentStep('onboarding');
  };

  const handleOnboardingComplete = () => {
    setCurrentStep('kyc');
  };

  const handleKYCComplete = () => {
    setCurrentStep('complete');
    // Redirect to appropriate dashboard based on account type
    setTimeout(() => {
      if (selectedAccountType === 'private') {
        navigate('/dashboard/private', { 
          state: { 
            message: 'Welcome to Private Banking! Your relationship manager will contact you within 24 hours.',
            type: 'success'
          }
        });
      } else {
        navigate('/dashboard', { 
          state: { 
            message: 'Registration completed! Please complete your KYC verification to unlock all features.',
            type: 'info'
          }
        });
      }
    }, 2000);
  };

  const handleKYCCancel = () => {
    // Allow user to skip KYC for now but with limited access
    navigate('/dashboard', { 
      state: { 
        message: 'You can complete KYC verification later from your account settings.',
        warning: 'Some features are limited until KYC verification is complete.'
      }
    });
  };

  const renderAccountTypeSelection = () => (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Choose Your Banking Experience</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Select the banking solution that best fits your financial needs and goals
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {accountTypes.map((type) => {
            const Icon = type.icon;
            return (
              <Card 
                key={type.id}
                className={`relative cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-105 ${type.borderColor} ${
                  type.exclusive ? 'ring-2 ring-gold-300 shadow-2xl' : ''
                }`}
                onClick={() => handleAccountTypeSelect(type.id)}
              >
                {type.exclusive && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-gradient-to-r from-gold-500 to-yellow-600 text-white px-4 py-1">
                      <Crown className="h-3 w-3 mr-1" />
                      Exclusive
                    </Badge>
                  </div>
                )}
                
                <CardHeader className={`bg-gradient-to-br ${type.bgColor} rounded-t-lg`}>
                  <div className={`w-12 h-12 bg-gradient-to-br ${type.color} rounded-lg flex items-center justify-center mb-4`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-xl font-bold text-gray-900">{type.name}</CardTitle>
                  <CardDescription className="text-gray-600">{type.description}</CardDescription>
                </CardHeader>
                
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="text-sm">
                      <span className="font-semibold text-gray-900">Minimum Balance: </span>
                      <span className="text-gray-600">{type.minBalance}</span>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Key Features:</h4>
                      <ul className="space-y-1">
                        {type.features.map((feature, index) => (
                          <li key={index} className="text-sm text-gray-600 flex items-center">
                            <CheckCircle className="h-3 w-3 text-green-500 mr-2 flex-shrink-0" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <Button 
                      className={`w-full bg-gradient-to-r ${type.color} hover:opacity-90 text-white`}
                      onClick={() => handleAccountTypeSelect(type.id)}
                    >
                      Get Started
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-600 mb-4">Already have an account?</p>
          <Button variant="outline" onClick={() => navigate('/')}>
            Sign In Instead
          </Button>
        </div>
      </div>
    </div>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'select-type':
        return renderAccountTypeSelection();
      
      case 'register':
        if (selectedAccountType === 'private') {
          return (
            <PrivateBankingRegistration 
              onComplete={handleRegistrationComplete}
              onBack={() => setCurrentStep('select-type')}
            />
          );
        } else {
          return (
            <RegisterForm 
              onSwitchToLogin={() => navigate('/')}
              onRegistrationComplete={handleRegistrationComplete}
              accountType={selectedAccountType}
            />
          );
        }
      
      case 'onboarding':
        if (selectedAccountType === 'private') {
          return (
            <PrivateBankingOnboarding 
              onComplete={handleOnboardingComplete}
              userType="private"
            />
          );
        } else {
          return (
            <OnboardingFlow 
              onComplete={handleOnboardingComplete}
              userType={selectedAccountType || 'personal'}
            />
          );
        }
      
      case 'kyc':
        return (
          <KYCVerificationFlow 
            onComplete={handleKYCComplete}
            onCancel={handleKYCCancel}
          />
        );
      
      case 'complete':
        return (
          <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center p-4">
            <div className="text-center space-y-6">
              <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="h-10 w-10 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {selectedAccountType === 'private' ? 'Welcome to Private Banking Excellence!' : 'Welcome to UBAS Financial Trust!'}
                </h1>
                <p className="text-gray-600 max-w-md mx-auto">
                  {selectedAccountType === 'private' 
                    ? 'Your exclusive banking experience is ready. You\'re being redirected to your private dashboard...'
                    : 'Your account has been created successfully. You\'re being redirected to your dashboard...'
                  }
                </p>
              </div>
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return renderCurrentStep();
}
