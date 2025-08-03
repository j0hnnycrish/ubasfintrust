import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Smartphone, 
  Shield, 
  Zap, 
  Camera,
  CheckCircle,
  ArrowRight,
  Download,
  CreditCard,
  Users,
  AlertCircle,
  Star,
  Globe
} from 'lucide-react';

export default function MobileBanking() {
  const features = [
    {
      icon: Shield,
      title: 'Biometric Security',
      description: 'Login with fingerprint, face ID, or voice recognition for maximum security'
    },
    {
      icon: Camera,
      title: 'Mobile Check Deposit',
      description: 'Deposit checks instantly by taking a photo with your smartphone'
    },
    {
      icon: Zap,
      title: 'Instant Transfers',
      description: 'Send money to friends and family instantly with Zelle and P2P payments'
    },
    {
      icon: CreditCard,
      title: 'Digital Wallet',
      description: 'Add cards to Apple Pay, Google Pay, and Samsung Pay for contactless payments'
    },
    {
      icon: Users,
      title: 'Account Management',
      description: 'Manage all your accounts, view balances, and track transactions in real-time'
    },
    {
      icon: Globe,
      title: 'Global Access',
      description: 'Access your accounts securely from anywhere in the world, 24/7'
    }
  ];

  const appFeatures = [
    'Real-time account balances and transactions',
    'Mobile check deposit with instant availability',
    'Bill pay and scheduled payments',
    'Money transfers and P2P payments',
    'ATM and branch locator with GPS',
    'Account alerts and notifications',
    'Budgeting and spending analytics',
    'Investment portfolio tracking',
    'Customer support chat',
    'Secure messaging center'
  ];

  const securityFeatures = [
    {
      icon: Shield,
      title: 'Multi-Factor Authentication',
      description: 'Multiple layers of security including biometrics and device recognition'
    },
    {
      icon: Zap,
      title: 'Real-time Fraud Monitoring',
      description: 'Advanced AI monitors transactions for suspicious activity 24/7'
    },
    {
      icon: CreditCard,
      title: 'Instant Card Controls',
      description: 'Lock/unlock cards, set spending limits, and control usage instantly'
    },
    {
      icon: Users,
      title: 'Secure Communication',
      description: 'Encrypted messaging and secure document sharing within the app'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-purple-900 to-purple-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <Smartphone className="h-12 w-12 text-purple-300" />
                <h1 className="text-4xl md:text-5xl font-bold">Mobile Banking</h1>
              </div>
              <p className="text-xl text-purple-100 mb-8">
                Bank on the go with our award-winning mobile app. Enjoy full banking functionality 
                with industry-leading security, right at your fingertips.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg" 
                  className="bg-white text-purple-900 hover:bg-gray-100"
                  onClick={() => window.open('https://apps.apple.com', '_blank')}
                >
                  <Download className="h-5 w-5 mr-2" />
                  Download App
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-white text-white hover:bg-white hover:text-purple-900"
                  onClick={() => window.location.href = '/contact'}
                >
                  Learn More
                </Button>
              </div>
            </div>
            <div className="relative">
              <Card className="bg-white/10 backdrop-blur border-white/20">
                <CardContent className="p-8">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-white mb-2">4.8★</div>
                    <div className="text-purple-200 mb-4">App Store Rating</div>
                    <div className="text-sm text-purple-100">
                      Over 100,000+ downloads
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Mobile Banking Features</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Experience banking that fits your lifestyle with our comprehensive mobile banking solution.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="text-center shadow-lg hover:shadow-xl transition-shadow">
                  <CardHeader>
                    <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Icon className="h-8 w-8 text-purple-600" />
                    </div>
                    <CardTitle className="text-xl text-gray-900">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">{feature.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>

      {/* App Features */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Everything You Need</h2>
              <p className="text-xl text-gray-600 mb-8">
                Our mobile app puts the full power of banking in your pocket with features designed for modern life.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {appFeatures.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-purple-500 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-8 text-white">
                <div className="text-center">
                  <Smartphone className="h-24 w-24 mx-auto mb-6 text-white/80" />
                  <h3 className="text-2xl font-bold mb-4">Download Today</h3>
                  <p className="text-purple-100 mb-6">
                    Available for iOS and Android devices
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button 
                      className="bg-white text-purple-600 hover:bg-gray-100"
                      onClick={() => window.open('https://apps.apple.com', '_blank')}
                    >
                      App Store
                    </Button>
                    <Button 
                      className="bg-white text-purple-600 hover:bg-gray-100"
                      onClick={() => window.open('https://play.google.com', '_blank')}
                    >
                      Google Play
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Security Features */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Bank-Level Security</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Your security is our priority. Our mobile app uses advanced security measures to protect your financial information.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {securityFeatures.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="text-center shadow-lg hover:shadow-xl transition-shadow">
                  <CardHeader>
                    <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Icon className="h-8 w-8 text-white" />
                    </div>
                    <CardTitle className="text-lg text-gray-900">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 text-sm">{feature.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">What Our Users Say</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Join thousands of satisfied customers who love our mobile banking experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: 'Sarah Johnson',
                rating: 5,
                review: 'The mobile check deposit feature is a game-changer. I can deposit checks instantly without visiting a branch.',
                title: 'Small Business Owner'
              },
              {
                name: 'Michael Chen',
                rating: 5,
                review: 'Love the biometric login and real-time notifications. The app is fast, secure, and incredibly user-friendly.',
                title: 'Software Engineer'
              },
              {
                name: 'Emily Rodriguez',
                rating: 5,
                review: 'The budgeting tools and spending analytics help me stay on top of my finances. Best banking app I\'ve used.',
                title: 'Marketing Manager'
              }
            ].map((review, index) => (
              <Card key={index} className="shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-700 mb-4 italic">"{review.review}"</p>
                  <div>
                    <p className="font-semibold text-gray-900">{review.name}</p>
                    <p className="text-sm text-gray-600">{review.title}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Getting Started */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Get Started in Minutes</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Setting up mobile banking is quick and easy. Follow these simple steps to get started.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { step: '1', title: 'Download App', description: 'Download the UBAS Financial Trust app from your app store' },
              { step: '2', title: 'Create Account', description: 'Sign up with your account number and personal information' },
              { step: '3', title: 'Verify Identity', description: 'Complete identity verification with your ID and selfie' },
              { step: '4', title: 'Start Banking', description: 'Begin using all mobile banking features immediately' }
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-white">{item.step}</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 bg-purple-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Bank on the Go?</h2>
          <p className="text-xl text-purple-100 mb-8 max-w-3xl mx-auto">
            Download our award-winning mobile app today and experience the future of banking. 
            Available for iOS and Android devices.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-white text-purple-900 hover:bg-gray-100"
              onClick={() => window.open('https://apps.apple.com', '_blank')}
            >
              <Download className="h-5 w-5 mr-2" />
              Download for iOS
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-white text-white hover:bg-white hover:text-purple-900"
              onClick={() => window.open('https://play.google.com', '_blank')}
            >
              <Download className="h-5 w-5 mr-2" />
              Download for Android
            </Button>
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="py-8 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="bg-yellow-50 border-yellow-200">
            <CardContent className="p-6">
              <div className="flex items-start space-x-3">
                <AlertCircle className="h-6 w-6 text-yellow-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-yellow-800 mb-2">Mobile Banking Information</h3>
                  <p className="text-yellow-700 text-sm">
                    Mobile banking requires a compatible smartphone and internet connection. Standard data rates may apply. 
                    Biometric features require compatible device hardware. Some features may not be available on all devices.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
