import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Crown, 
  Shield, 
  Star, 
  Gem, 
  Globe, 
  Award,
  Users,
  TrendingUp,
  Briefcase,
  Plane,
  Car,
  Home,
  Palette,
  Wine,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  Sparkles,
  Zap,
  Lock,
  Eye,
  Phone,
  Calendar,
  CreditCard,
  DollarSign
} from 'lucide-react';

interface PrivateBankingOnboardingProps {
  onComplete: () => void;
  userType: 'private';
}

export function PrivateBankingOnboarding({ onComplete }: PrivateBankingOnboardingProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 8;

  const steps = [
    {
      id: 1,
      title: 'Welcome to Private Banking Excellence',
      subtitle: 'Where wealth meets sophistication',
      icon: Crown,
      content: (
        <div className="space-y-8">
          <div className="text-center">
            <div className="w-24 h-24 bg-gradient-to-br from-yellow-400 via-gold-500 to-yellow-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl">
              <Crown className="h-12 w-12 text-white" />
            </div>
            <h3 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-4">
              Welcome to UBAS Private Banking
            </h3>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg leading-relaxed">
              You have joined an exclusive circle of ultra-high-net-worth individuals who demand nothing but excellence. 
              Experience banking redefined with unparalleled sophistication and personalized service.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-gold-50 to-yellow-50 p-6 rounded-xl border border-gold-200">
              <Shield className="h-8 w-8 text-gold-600 mb-4" />
              <h4 className="font-bold text-gray-900 mb-2">Swiss-Level Privacy</h4>
              <p className="text-sm text-gray-700">Military-grade security with absolute discretion and confidentiality</p>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-indigo-50 p-6 rounded-xl border border-purple-200">
              <Users className="h-8 w-8 text-purple-600 mb-4" />
              <h4 className="font-bold text-gray-900 mb-2">Dedicated Team</h4>
              <p className="text-sm text-gray-700">Personal relationship manager and specialized advisory team</p>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-6 rounded-xl border border-blue-200">
              <Globe className="h-8 w-8 text-blue-600 mb-4" />
              <h4 className="font-bold text-gray-900 mb-2">Global Access</h4>
              <p className="text-sm text-gray-700">Seamless banking across all major financial centers worldwide</p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 2,
      title: 'Exclusive Wealth Management',
      subtitle: 'Sophisticated investment solutions',
      icon: TrendingUp,
      content: (
        <div className="space-y-8">
          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <TrendingUp className="h-10 w-10 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Wealth Management Excellence</h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Access sophisticated investment strategies and alternative assets typically reserved for institutional investors.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                <Gem className="h-6 w-6 text-purple-600 mt-1" />
                <div>
                  <h4 className="font-semibold text-gray-900">Alternative Investments</h4>
                  <p className="text-sm text-gray-600">Private equity, hedge funds, real estate, commodities, and collectibles</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                <Star className="h-6 w-6 text-gold-600 mt-1" />
                <div>
                  <h4 className="font-semibold text-gray-900">Structured Products</h4>
                  <p className="text-sm text-gray-600">Bespoke investment solutions tailored to your risk profile</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                <Globe className="h-6 w-6 text-blue-600 mt-1" />
                <div>
                  <h4 className="font-semibold text-gray-900">Global Diversification</h4>
                  <p className="text-sm text-gray-600">Multi-currency portfolios across emerging and developed markets</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                <Award className="h-6 w-6 text-green-600 mt-1" />
                <div>
                  <h4 className="font-semibold text-gray-900">Tax Optimization</h4>
                  <p className="text-sm text-gray-600">Advanced tax planning and cross-border structuring</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                <Users className="h-6 w-6 text-indigo-600 mt-1" />
                <div>
                  <h4 className="font-semibold text-gray-900">Family Office Services</h4>
                  <p className="text-sm text-gray-600">Multi-generational wealth planning and governance</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                <Briefcase className="h-6 w-6 text-gray-600 mt-1" />
                <div>
                  <h4 className="font-semibold text-gray-900">Estate Planning</h4>
                  <p className="text-sm text-gray-600">Sophisticated succession and legacy planning strategies</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 3,
      title: 'Exclusive Lifestyle Banking',
      subtitle: 'Beyond traditional banking',
      icon: Sparkles,
      content: (
        <div className="space-y-8">
          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-pink-500 to-rose-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <Sparkles className="h-10 w-10 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Lifestyle Banking Services</h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Exclusive financing solutions for your luxury lifestyle and passion investments.
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl text-center">
              <Plane className="h-8 w-8 text-blue-600 mx-auto mb-3" />
              <h4 className="font-semibold text-gray-900 mb-2">Aircraft Financing</h4>
              <p className="text-xs text-gray-600">Private jets and helicopters</p>
            </div>
            
            <div className="bg-gradient-to-br from-green-50 to-emerald-100 p-6 rounded-xl text-center">
              <Car className="h-8 w-8 text-green-600 mx-auto mb-3" />
              <h4 className="font-semibold text-gray-900 mb-2">Luxury Vehicles</h4>
              <p className="text-xs text-gray-600">Supercars and collectibles</p>
            </div>
            
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl text-center">
              <Home className="h-8 w-8 text-purple-600 mx-auto mb-3" />
              <h4 className="font-semibold text-gray-900 mb-2">Real Estate</h4>
              <p className="text-xs text-gray-600">Luxury properties worldwide</p>
            </div>
            
            <div className="bg-gradient-to-br from-yellow-50 to-gold-100 p-6 rounded-xl text-center">
              <Palette className="h-8 w-8 text-gold-600 mx-auto mb-3" />
              <h4 className="font-semibold text-gray-900 mb-2">Art & Collectibles</h4>
              <p className="text-xs text-gray-600">Fine art and rare items</p>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-gray-900 to-black p-8 rounded-xl text-white">
            <div className="flex items-center space-x-4 mb-4">
              <Wine className="h-8 w-8 text-gold-400" />
              <h4 className="text-xl font-bold">Concierge Services</h4>
            </div>
            <p className="text-gray-300 mb-4">
              24/7 global concierge services for travel, dining, entertainment, and exclusive event access.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>• Private dining reservations</div>
              <div>• Exclusive event tickets</div>
              <div>• Luxury travel planning</div>
              <div>• Personal shopping services</div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 4,
      title: 'Your Dedicated Team',
      subtitle: 'Personal relationship management',
      icon: Users,
      content: (
        <div className="space-y-8">
          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <Users className="h-10 w-10 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Your Personal Banking Team</h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Meet your dedicated team of specialists committed to your financial success.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="h-8 w-8 text-white" />
              </div>
              <h4 className="font-bold text-gray-900 text-center mb-2">Relationship Manager</h4>
              <p className="text-sm text-gray-600 text-center mb-4">Your primary point of contact for all banking needs</p>
              <ul className="text-xs text-gray-600 space-y-1">
                <li>• Direct phone line and email</li>
                <li>• Available 24/7 globally</li>
                <li>• Quarterly portfolio reviews</li>
                <li>• Personal financial planning</li>
              </ul>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-8 w-8 text-white" />
              </div>
              <h4 className="font-bold text-gray-900 text-center mb-2">Investment Advisor</h4>
              <p className="text-sm text-gray-600 text-center mb-4">Expert guidance on investment strategies</p>
              <ul className="text-xs text-gray-600 space-y-1">
                <li>• Portfolio optimization</li>
                <li>• Alternative investments</li>
                <li>• Risk management</li>
                <li>• Market insights</li>
              </ul>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Briefcase className="h-8 w-8 text-white" />
              </div>
              <h4 className="font-bold text-gray-900 text-center mb-2">Wealth Planner</h4>
              <p className="text-sm text-gray-600 text-center mb-4">Strategic wealth and estate planning</p>
              <ul className="text-xs text-gray-600 space-y-1">
                <li>• Estate planning</li>
                <li>• Tax optimization</li>
                <li>• Trust services</li>
                <li>• Succession planning</li>
              </ul>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-gold-50 to-yellow-50 p-6 rounded-xl border border-gold-200">
            <div className="flex items-center space-x-3 mb-4">
              <Phone className="h-6 w-6 text-gold-600" />
              <h4 className="font-semibold text-gray-900">Direct Access</h4>
            </div>
            <p className="text-gray-700 mb-4">
              Your relationship manager will contact you within 24 hours to schedule your welcome meeting and discuss your financial objectives.
            </p>
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4" />
                <span>Flexible meeting times</span>
              </div>
              <div className="flex items-center space-x-2">
                <Globe className="h-4 w-4" />
                <span>Global availability</span>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 5,
      title: 'Premium Security & Privacy',
      subtitle: 'Uncompromising protection',
      icon: Shield,
      content: (
        <div className="space-y-8">
          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <Shield className="h-10 w-10 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Military-Grade Security</h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Your privacy and security are our highest priorities. Experience Swiss-level banking discretion.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Lock className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">End-to-End Encryption</h4>
                  <p className="text-sm text-gray-600">All communications and transactions protected with AES-256 encryption</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <Eye className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Biometric Authentication</h4>
                  <p className="text-sm text-gray-600">Advanced biometric security including facial recognition and fingerprint</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Shield className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">24/7 Fraud Monitoring</h4>
                  <p className="text-sm text-gray-600">AI-powered real-time monitoring and instant alerts</p>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-gray-900 to-black p-6 rounded-xl text-white">
              <h4 className="font-bold text-xl mb-4 text-gold-400">Privacy Guarantee</h4>
              <ul className="space-y-3 text-sm text-gray-300">
                <li className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-400" />
                  <span>Absolute confidentiality of all transactions</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-400" />
                  <span>No sharing of client information</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-400" />
                  <span>Secure communication channels</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-400" />
                  <span>Anonymous transaction options</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-400" />
                  <span>Offshore banking capabilities</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 6,
      title: 'Exclusive Access & Privileges',
      subtitle: 'Beyond banking',
      icon: Star,
      content: (
        <div className="space-y-8">
          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-gold-500 to-yellow-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <Star className="h-10 w-10 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Exclusive Member Privileges</h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Access to exclusive events, partnerships, and opportunities reserved for our private banking clients.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl">
              <Award className="h-8 w-8 text-blue-600 mb-4" />
              <h4 className="font-bold text-gray-900 mb-2">VIP Events</h4>
              <p className="text-sm text-gray-600">Exclusive access to private events, galas, and networking opportunities</p>
            </div>
            
            <div className="bg-gradient-to-br from-green-50 to-emerald-100 p-6 rounded-xl">
              <Gem className="h-8 w-8 text-green-600 mb-4" />
              <h4 className="font-bold text-gray-900 mb-2">Luxury Partnerships</h4>
              <p className="text-sm text-gray-600">Preferred rates with luxury hotels, resorts, and premium brands</p>
            </div>
            
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl">
              <Globe className="h-8 w-8 text-purple-600 mb-4" />
              <h4 className="font-bold text-gray-900 mb-2">Global Lounges</h4>
              <p className="text-sm text-gray-600">Access to exclusive airport lounges and private banking centers worldwide</p>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-gold-100 to-yellow-100 p-8 rounded-xl border border-gold-300">
            <h4 className="font-bold text-gray-900 mb-4 text-xl">Coming Soon: UBAS Elite Card</h4>
            <div className="flex items-center space-x-6">
              <div className="w-24 h-16 bg-gradient-to-br from-black to-gray-800 rounded-lg flex items-center justify-center">
                <CreditCard className="h-8 w-8 text-gold-400" />
              </div>
              <div className="flex-1">
                <p className="text-gray-700 mb-3">
                  An exclusive black card with unlimited spending, global concierge, and premium rewards.
                </p>
                <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                  <div>• No preset spending limit</div>
                  <div>• 24/7 global concierge</div>
                  <div>• Premium travel benefits</div>
                  <div>• Exclusive merchant offers</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 7,
      title: 'Digital Excellence',
      subtitle: 'Technology meets luxury',
      icon: Zap,
      content: (
        <div className="space-y-8">
          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <Zap className="h-10 w-10 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Premium Digital Experience</h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              State-of-the-art digital banking platform designed exclusively for private banking clients.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
                <h4 className="font-bold text-gray-900 mb-4">Private Banking App</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Real-time portfolio tracking</li>
                  <li>• Instant global transfers</li>
                  <li>• Investment research & insights</li>
                  <li>• Secure messaging with your team</li>
                  <li>• Biometric authentication</li>
                </ul>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
                <h4 className="font-bold text-gray-900 mb-4">Advanced Analytics</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Comprehensive wealth dashboard</li>
                  <li>• Performance attribution analysis</li>
                  <li>• Risk assessment tools</li>
                  <li>• Tax optimization insights</li>
                  <li>• Custom reporting</li>
                </ul>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-gray-900 to-black p-8 rounded-xl text-white">
              <h4 className="font-bold text-xl mb-6 text-gold-400">Exclusive Features</h4>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                    <DollarSign className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <h5 className="font-semibold">Multi-Currency Management</h5>
                    <p className="text-sm text-gray-300">Seamless management of 20+ currencies</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                    <TrendingUp className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <h5 className="font-semibold">AI Investment Insights</h5>
                    <p className="text-sm text-gray-300">Personalized investment recommendations</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
                    <Globe className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <h5 className="font-semibold">Global Market Access</h5>
                    <p className="text-sm text-gray-300">Trade in major markets worldwide</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 8,
      title: 'Welcome to Excellence',
      subtitle: 'Your journey begins now',
      icon: CheckCircle,
      content: (
        <div className="space-y-8 text-center">
          <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-2xl">
            <CheckCircle className="h-12 w-12 text-white" />
          </div>
          
          <div>
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Welcome to Private Banking Excellence</h3>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              You are now part of an exclusive circle. Your private banking journey begins with unparalleled service and sophistication.
            </p>
          </div>
          
          <div className="bg-gradient-to-r from-gold-50 via-yellow-50 to-gold-50 p-8 rounded-xl border-2 border-gold-200">
            <h4 className="font-bold text-gray-900 mb-4 text-xl">What Happens Next?</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">1</div>
                <div>
                  <h5 className="font-semibold text-gray-900">Enhanced KYC</h5>
                  <p className="text-sm text-gray-600">Complete your premium verification process</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white font-bold text-sm">2</div>
                <div>
                  <h5 className="font-semibold text-gray-900">Team Introduction</h5>
                  <p className="text-sm text-gray-600">Meet your dedicated relationship manager</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">3</div>
                <div>
                  <h5 className="font-semibold text-gray-900">Portfolio Setup</h5>
                  <p className="text-sm text-gray-600">Begin your wealth management journey</p>
                </div>
              </div>
            </div>
            
            <Button 
              onClick={onComplete}
              className="mt-8 bg-gradient-to-r from-gold-600 to-yellow-600 hover:from-gold-700 hover:to-yellow-700 text-white px-8 py-3 text-lg font-semibold"
            >
              Begin Private Banking Experience
              <Crown className="ml-2 h-5 w-5" />
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gold-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-6xl shadow-2xl border-gold-200">
        <CardHeader className="bg-gradient-to-r from-gray-900 via-black to-gray-900 text-white">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-gold-600 rounded-full flex items-center justify-center">
              <currentStepData.icon className="h-6 w-6 text-white" />
            </div>
            <div className="text-center">
              <CardTitle className="text-3xl font-bold bg-gradient-to-r from-gold-400 to-yellow-400 bg-clip-text text-transparent">
                {currentStepData?.title}
              </CardTitle>
              <CardDescription className="text-gray-300 text-lg">
                {currentStepData?.subtitle}
              </CardDescription>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex justify-between text-sm text-gray-300">
              <span>Step {currentStep} of {totalSteps}</span>
              <span>{Math.round(progress)}% Complete</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-gold-400 to-yellow-500 h-3 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-8">
          <div className="min-h-[600px] flex items-center justify-center">
            {currentStepData?.content}
          </div>

          <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 1}
              className="flex items-center space-x-2 border-gold-300 text-gold-700 hover:bg-gold-50"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Previous</span>
            </Button>

            <Button
              onClick={handleNext}
              className="flex items-center space-x-2 bg-gradient-to-r from-gold-600 to-yellow-600 hover:from-gold-700 hover:to-yellow-700 text-white px-8"
            >
              <span>{currentStep === totalSteps ? 'Complete Onboarding' : 'Continue'}</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
