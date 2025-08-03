import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  CheckCircle, 
  ArrowRight, 
  ArrowLeft,
  Shield,
  CreditCard,
  Smartphone,
  Globe,
  Users,
  FileText,
  Lock,
  Eye,
  DollarSign,
  TrendingUp,
  PiggyBank,
  Zap
} from 'lucide-react';

interface OnboardingFlowProps {
  onComplete: () => void;
  userType: 'personal' | 'business' | 'corporate' | 'private';
}

export function OnboardingFlow({ onComplete, userType }: OnboardingFlowProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 6;

  const steps = [
    {
      id: 1,
      title: 'Welcome to UBAS Financial Trust',
      subtitle: 'Your journey to financial excellence begins here',
      icon: Shield,
      content: (
        <div className="space-y-6">
          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="h-10 w-10 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Welcome to UBAS Financial Trust</h3>
            <p className="text-gray-600 max-w-md mx-auto">
              We're excited to have you join our family of satisfied customers. Let's get you started with a quick tour of our banking features.
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <Lock className="h-6 w-6 text-blue-600 mb-2" />
              <h4 className="font-semibold text-gray-900">Bank-Grade Security</h4>
              <p className="text-sm text-gray-600">256-bit encryption and multi-factor authentication</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <Zap className="h-6 w-6 text-green-600 mb-2" />
              <h4 className="font-semibold text-gray-900">Instant Transfers</h4>
              <p className="text-sm text-gray-600">Real-time money transfers 24/7</p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 2,
      title: 'Account Features',
      subtitle: 'Discover what your account can do',
      icon: CreditCard,
      content: (
        <div className="space-y-6">
          <h3 className="text-xl font-bold text-gray-900 text-center">Your Account Features</h3>
          
          <div className="space-y-4">
            <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
              <DollarSign className="h-6 w-6 text-green-600 mt-1" />
              <div>
                <h4 className="font-semibold text-gray-900">Multiple Account Types</h4>
                <p className="text-sm text-gray-600">Checking, Savings, Investment accounts with competitive rates</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
              <CreditCard className="h-6 w-6 text-blue-600 mt-1" />
              <div>
                <h4 className="font-semibold text-gray-900">Debit & Credit Cards</h4>
                <p className="text-sm text-gray-600">Contactless payments, online shopping, and ATM access worldwide</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
              <TrendingUp className="h-6 w-6 text-purple-600 mt-1" />
              <div>
                <h4 className="font-semibold text-gray-900">Investment Options</h4>
                <p className="text-sm text-gray-600">Grow your wealth with our investment and savings products</p>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 3,
      title: 'Digital Banking',
      subtitle: 'Banking at your fingertips',
      icon: Smartphone,
      content: (
        <div className="space-y-6">
          <h3 className="text-xl font-bold text-gray-900 text-center">Digital Banking Features</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-lg">
              <Smartphone className="h-8 w-8 text-blue-600 mb-3" />
              <h4 className="font-semibold text-gray-900 mb-2">Mobile Banking</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Check balances instantly</li>
                <li>• Transfer money on the go</li>
                <li>• Pay bills and utilities</li>
                <li>• Deposit checks with camera</li>
              </ul>
            </div>
            
            <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-lg">
              <Globe className="h-8 w-8 text-green-600 mb-3" />
              <h4 className="font-semibold text-gray-900 mb-2">Online Banking</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• 24/7 account access</li>
                <li>• Download statements</li>
                <li>• Set up automatic payments</li>
                <li>• Manage cards and limits</li>
              </ul>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 4,
      title: 'Security & Protection',
      subtitle: 'Your money is safe with us',
      icon: Shield,
      content: (
        <div className="space-y-6">
          <h3 className="text-xl font-bold text-gray-900 text-center">Security Features</h3>
          
          <div className="space-y-4">
            <div className="flex items-center space-x-4 p-4 border border-green-200 bg-green-50 rounded-lg">
              <CheckCircle className="h-6 w-6 text-green-600" />
              <div>
                <h4 className="font-semibold text-gray-900">Two-Factor Authentication</h4>
                <p className="text-sm text-gray-600">Extra layer of security for your account</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4 p-4 border border-blue-200 bg-blue-50 rounded-lg">
              <CheckCircle className="h-6 w-6 text-blue-600" />
              <div>
                <h4 className="font-semibold text-gray-900">Real-time Fraud Monitoring</h4>
                <p className="text-sm text-gray-600">AI-powered protection against suspicious activities</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4 p-4 border border-purple-200 bg-purple-50 rounded-lg">
              <CheckCircle className="h-6 w-6 text-purple-600" />
              <div>
                <h4 className="font-semibold text-gray-900">FDIC Insured</h4>
                <p className="text-sm text-gray-600">Your deposits are protected up to $250,000</p>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 5,
      title: 'Next Steps',
      subtitle: 'Complete your account setup',
      icon: FileText,
      content: (
        <div className="space-y-6">
          <h3 className="text-xl font-bold text-gray-900 text-center">Complete Your Setup</h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-center space-x-3">
                <FileText className="h-6 w-6 text-yellow-600" />
                <div>
                  <h4 className="font-semibold text-gray-900">KYC Verification</h4>
                  <p className="text-sm text-gray-600">Upload your documents for account verification</p>
                </div>
              </div>
              <Badge variant="outline" className="bg-yellow-100 text-yellow-800">Required</Badge>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center space-x-3">
                <Shield className="h-6 w-6 text-blue-600" />
                <div>
                  <h4 className="font-semibold text-gray-900">Security Setup</h4>
                  <p className="text-sm text-gray-600">Enable two-factor authentication</p>
                </div>
              </div>
              <Badge variant="outline" className="bg-blue-100 text-blue-800">Recommended</Badge>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center space-x-3">
                <CreditCard className="h-6 w-6 text-green-600" />
                <div>
                  <h4 className="font-semibold text-gray-900">Order Your Card</h4>
                  <p className="text-sm text-gray-600">Get your debit card delivered to your address</p>
                </div>
              </div>
              <Badge variant="outline" className="bg-green-100 text-green-800">Optional</Badge>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 6,
      title: 'Ready to Start',
      subtitle: 'Your account is ready for use',
      icon: CheckCircle,
      content: (
        <div className="space-y-6 text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle className="h-10 w-10 text-white" />
          </div>
          
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">You're All Set!</h3>
            <p className="text-gray-600 max-w-md mx-auto">
              Your UBAS Financial Trust account is ready. You can now access all banking features and start managing your finances.
            </p>
          </div>
          
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg">
            <h4 className="font-semibold text-gray-900 mb-2">What's Next?</h4>
            <p className="text-sm text-gray-600 mb-4">
              Complete your KYC verification to unlock all features and higher transaction limits.
            </p>
            <Button 
              onClick={onComplete}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              Start Banking
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      )
    }
  ];

  const currentStepData = steps.find(step => step.id === currentStep);
  const progress = (currentStep / totalSteps) * 100;

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl shadow-xl">
        <CardHeader className="text-center pb-4">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
              <currentStepData.icon className="h-4 w-4 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {currentStepData?.title}
            </CardTitle>
          </div>
          <CardDescription className="text-lg">
            {currentStepData?.subtitle}
          </CardDescription>
          
          <div className="mt-6">
            <div className="flex justify-between text-sm text-gray-500 mb-2">
              <span>Step {currentStep} of {totalSteps}</span>
              <span>{Math.round(progress)}% Complete</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </CardHeader>

        <CardContent className="px-8 pb-8">
          <div className="min-h-[400px] flex items-center justify-center">
            {currentStepData?.content}
          </div>

          <div className="flex justify-between mt-8">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 1}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Previous</span>
            </Button>

            <Button
              onClick={handleNext}
              className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              <span>{currentStep === totalSteps ? 'Complete Setup' : 'Next'}</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
