import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  Crown, 
  Shield, 
  Star, 
  Gem, 
  Globe, 
  Award,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  AlertTriangle,
  DollarSign,
  TrendingUp,
  Users,
  Briefcase
} from 'lucide-react';

interface PrivateBankingRegistrationProps {
  onComplete: (data: any) => void;
  onBack: () => void;
}

interface PrivateBankingFormData {
  // Personal Information
  title: string;
  firstName: string;
  middleName: string;
  lastName: string;
  dateOfBirth: string;
  nationality: string;
  residenceCountry: string;
  
  // Contact Information
  email: string;
  phoneNumber: string;
  alternatePhone: string;
  preferredLanguage: string;
  
  // Wealth Information
  netWorth: string;
  liquidAssets: string;
  annualIncome: string;
  sourceOfWealth: string;
  investmentExperience: string;
  riskTolerance: string;
  
  // Banking Preferences
  primaryCurrency: string;
  additionalCurrencies: string[];
  bankingRegions: string[];
  servicesRequired: string[];
  
  // Professional Information
  occupation: string;
  companyName: string;
  position: string;
  industryType: string;
  
  // Referral & Relationship
  referralSource: string;
  existingRelationships: string;
  familyOfficeServices: boolean;
  
  // Security & Privacy
  password: string;
  confirmPassword: string;
  twoFactorAuth: boolean;
  privacyLevel: string;
  
  // Agreements
  termsAccepted: boolean;
  privacyAccepted: boolean;
  wealthDeclaration: boolean;
  complianceAgreement: boolean;
}

export function PrivateBankingRegistration({ onComplete, onBack }: PrivateBankingRegistrationProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<PrivateBankingFormData>({
    title: '',
    firstName: '',
    middleName: '',
    lastName: '',
    dateOfBirth: '',
    nationality: '',
    residenceCountry: '',
    email: '',
    phoneNumber: '',
    alternatePhone: '',
    preferredLanguage: 'English',
    netWorth: '',
    liquidAssets: '',
    annualIncome: '',
    sourceOfWealth: '',
    investmentExperience: '',
    riskTolerance: '',
    primaryCurrency: 'USD',
    additionalCurrencies: [],
    bankingRegions: [],
    servicesRequired: [],
    occupation: '',
    companyName: '',
    position: '',
    industryType: '',
    referralSource: '',
    existingRelationships: '',
    familyOfficeServices: false,
    password: '',
    confirmPassword: '',
    twoFactorAuth: true,
    privacyLevel: 'maximum',
    termsAccepted: false,
    privacyAccepted: false,
    wealthDeclaration: false,
    complianceAgreement: false
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const totalSteps = 5;
  const progress = (currentStep / totalSteps) * 100;

  const handleInputChange = (field: keyof PrivateBankingFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleArrayChange = (field: keyof PrivateBankingFormData, value: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: checked 
        ? [...(prev[field] as string[]), value]
        : (prev[field] as string[]).filter(item => item !== value)
    }));
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!(formData.firstName && formData.lastName && formData.email && formData.phoneNumber);
      case 2:
        return !!(formData.netWorth && formData.liquidAssets && formData.sourceOfWealth);
      case 3:
        return !!(formData.primaryCurrency && formData.servicesRequired.length > 0);
      case 4:
        return !!(formData.password && formData.confirmPassword && formData.password === formData.confirmPassword);
      case 5:
        return !!(formData.termsAccepted && formData.privacyAccepted && formData.wealthDeclaration && formData.complianceAgreement);
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (!validateStep(currentStep)) {
      toast({
        title: 'Incomplete Information',
        description: 'Please fill in all required fields before proceeding.',
        variant: 'destructive',
      });
      return;
    }

    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    if (!validateStep(5)) {
      toast({
        title: 'Incomplete Application',
        description: 'Please complete all required fields and accept all agreements.',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: 'Application Submitted Successfully',
        description: 'Your private banking application is under review. Our relationship manager will contact you within 24 hours.',
      });
      
      onComplete(formData);
    } catch (error) {
      toast({
        title: 'Submission Failed',
        description: 'There was an error submitting your application. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Crown className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Personal Information</h3>
              <p className="text-gray-600">Exclusive private banking requires detailed personal information</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="title">Title</Label>
                <Select value={formData.title} onValueChange={(value) => handleInputChange('title', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select title" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mr">Mr.</SelectItem>
                    <SelectItem value="mrs">Mrs.</SelectItem>
                    <SelectItem value="ms">Ms.</SelectItem>
                    <SelectItem value="dr">Dr.</SelectItem>
                    <SelectItem value="prof">Prof.</SelectItem>
                    <SelectItem value="sir">Sir</SelectItem>
                    <SelectItem value="lord">Lord</SelectItem>
                    <SelectItem value="lady">Lady</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="firstName">First Name *</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  placeholder="Enter your first name"
                  className="border-gold-200 focus:border-gold-400"
                />
              </div>

              <div>
                <Label htmlFor="middleName">Middle Name</Label>
                <Input
                  id="middleName"
                  value={formData.middleName}
                  onChange={(e) => handleInputChange('middleName', e.target.value)}
                  placeholder="Enter your middle name"
                  className="border-gold-200 focus:border-gold-400"
                />
              </div>

              <div>
                <Label htmlFor="lastName">Last Name *</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  placeholder="Enter your last name"
                  className="border-gold-200 focus:border-gold-400"
                />
              </div>

              <div>
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="Enter your email address"
                  className="border-gold-200 focus:border-gold-400"
                />
              </div>

              <div>
                <Label htmlFor="phoneNumber">Primary Phone *</Label>
                <Input
                  id="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                  placeholder="+1 (555) 123-4567"
                  className="border-gold-200 focus:border-gold-400"
                />
              </div>

              <div>
                <Label htmlFor="nationality">Nationality *</Label>
                <Select value={formData.nationality} onValueChange={(value) => handleInputChange('nationality', value)}>
                  <SelectTrigger className="border-gold-200 focus:border-gold-400">
                    <SelectValue placeholder="Select nationality" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="us">United States</SelectItem>
                    <SelectItem value="uk">United Kingdom</SelectItem>
                    <SelectItem value="ca">Canada</SelectItem>
                    <SelectItem value="au">Australia</SelectItem>
                    <SelectItem value="ch">Switzerland</SelectItem>
                    <SelectItem value="sg">Singapore</SelectItem>
                    <SelectItem value="ae">UAE</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="preferredLanguage">Preferred Language</Label>
                <Select value={formData.preferredLanguage} onValueChange={(value) => handleInputChange('preferredLanguage', value)}>
                  <SelectTrigger className="border-gold-200 focus:border-gold-400">
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="English">English</SelectItem>
                    <SelectItem value="French">French</SelectItem>
                    <SelectItem value="German">German</SelectItem>
                    <SelectItem value="Spanish">Spanish</SelectItem>
                    <SelectItem value="Italian">Italian</SelectItem>
                    <SelectItem value="Mandarin">Mandarin</SelectItem>
                    <SelectItem value="Arabic">Arabic</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <DollarSign className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Wealth Information</h3>
              <p className="text-gray-600">Private banking requires minimum assets of $10M USD</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="netWorth">Total Net Worth (USD) *</Label>
                <Select value={formData.netWorth} onValueChange={(value) => handleInputChange('netWorth', value)}>
                  <SelectTrigger className="border-gold-200 focus:border-gold-400">
                    <SelectValue placeholder="Select net worth range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10-25M">$10M - $25M</SelectItem>
                    <SelectItem value="25-50M">$25M - $50M</SelectItem>
                    <SelectItem value="50-100M">$50M - $100M</SelectItem>
                    <SelectItem value="100-250M">$100M - $250M</SelectItem>
                    <SelectItem value="250M+">$250M+</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="liquidAssets">Liquid Assets (USD) *</Label>
                <Select value={formData.liquidAssets} onValueChange={(value) => handleInputChange('liquidAssets', value)}>
                  <SelectTrigger className="border-gold-200 focus:border-gold-400">
                    <SelectValue placeholder="Select liquid assets range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5-10M">$5M - $10M</SelectItem>
                    <SelectItem value="10-25M">$10M - $25M</SelectItem>
                    <SelectItem value="25-50M">$25M - $50M</SelectItem>
                    <SelectItem value="50M+">$50M+</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="sourceOfWealth">Primary Source of Wealth *</Label>
                <Select value={formData.sourceOfWealth} onValueChange={(value) => handleInputChange('sourceOfWealth', value)}>
                  <SelectTrigger className="border-gold-200 focus:border-gold-400">
                    <SelectValue placeholder="Select source of wealth" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="business_ownership">Business Ownership</SelectItem>
                    <SelectItem value="inheritance">Inheritance</SelectItem>
                    <SelectItem value="investments">Investment Returns</SelectItem>
                    <SelectItem value="real_estate">Real Estate</SelectItem>
                    <SelectItem value="professional_services">Professional Services</SelectItem>
                    <SelectItem value="technology">Technology/Innovation</SelectItem>
                    <SelectItem value="finance">Financial Services</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="investmentExperience">Investment Experience</Label>
                <Select value={formData.investmentExperience} onValueChange={(value) => handleInputChange('investmentExperience', value)}>
                  <SelectTrigger className="border-gold-200 focus:border-gold-400">
                    <SelectValue placeholder="Select experience level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sophisticated">Sophisticated Investor</SelectItem>
                    <SelectItem value="experienced">Experienced</SelectItem>
                    <SelectItem value="moderate">Moderate</SelectItem>
                    <SelectItem value="conservative">Conservative</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="riskTolerance">Risk Tolerance</Label>
                <Select value={formData.riskTolerance} onValueChange={(value) => handleInputChange('riskTolerance', value)}>
                  <SelectTrigger className="border-gold-200 focus:border-gold-400">
                    <SelectValue placeholder="Select risk tolerance" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="aggressive">Aggressive</SelectItem>
                    <SelectItem value="moderate_aggressive">Moderate Aggressive</SelectItem>
                    <SelectItem value="moderate">Moderate</SelectItem>
                    <SelectItem value="conservative">Conservative</SelectItem>
                    <SelectItem value="very_conservative">Very Conservative</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="bg-gradient-to-r from-yellow-50 to-gold-50 p-6 rounded-lg border border-gold-200">
              <div className="flex items-start space-x-3">
                <Shield className="h-6 w-6 text-gold-600 mt-1" />
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Wealth Verification</h4>
                  <p className="text-sm text-gray-700">
                    All wealth information will be verified through our compliance process. 
                    Documentation will be required during the KYC verification stage.
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Globe className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Banking Preferences</h3>
              <p className="text-gray-600">Configure your global banking and investment preferences</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="primaryCurrency">Primary Currency *</Label>
                <Select value={formData.primaryCurrency} onValueChange={(value) => handleInputChange('primaryCurrency', value)}>
                  <SelectTrigger className="border-gold-200 focus:border-gold-400">
                    <SelectValue placeholder="Select primary currency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USD">USD - US Dollar</SelectItem>
                    <SelectItem value="EUR">EUR - Euro</SelectItem>
                    <SelectItem value="GBP">GBP - British Pound</SelectItem>
                    <SelectItem value="CHF">CHF - Swiss Franc</SelectItem>
                    <SelectItem value="JPY">JPY - Japanese Yen</SelectItem>
                    <SelectItem value="SGD">SGD - Singapore Dollar</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="investmentExperience">Investment Experience</Label>
                <Select value={formData.investmentExperience} onValueChange={(value) => handleInputChange('investmentExperience', value)}>
                  <SelectTrigger className="border-gold-200 focus:border-gold-400">
                    <SelectValue placeholder="Select experience level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sophisticated">Sophisticated Investor</SelectItem>
                    <SelectItem value="experienced">Experienced</SelectItem>
                    <SelectItem value="moderate">Moderate</SelectItem>
                    <SelectItem value="conservative">Conservative</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="md:col-span-2">
                <Label>Services Required *</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2">
                  {[
                    'Wealth Management',
                    'Investment Advisory',
                    'Estate Planning',
                    'Tax Planning',
                    'Family Office',
                    'Concierge Services',
                    'Art & Collectibles',
                    'Real Estate Finance',
                    'Aircraft Financing'
                  ].map((service) => (
                    <div key={service} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={service}
                        checked={formData.servicesRequired.includes(service)}
                        onChange={(e) => handleArrayChange('servicesRequired', service, e.target.checked)}
                        className="rounded border-gold-300"
                      />
                      <Label htmlFor={service} className="text-sm">{service}</Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Security & Access</h3>
              <p className="text-gray-600">Set up your secure access credentials</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="password">Password *</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    placeholder="Create a strong password"
                    className="border-gold-200 focus:border-gold-400 pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <div>
                <Label htmlFor="confirmPassword">Confirm Password *</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  placeholder="Confirm your password"
                  className="border-gold-200 focus:border-gold-400"
                />
              </div>

              <div>
                <Label htmlFor="privacyLevel">Privacy Level</Label>
                <Select value={formData.privacyLevel} onValueChange={(value) => handleInputChange('privacyLevel', value)}>
                  <SelectTrigger className="border-gold-200 focus:border-gold-400">
                    <SelectValue placeholder="Select privacy level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="maximum">Maximum Privacy</SelectItem>
                    <SelectItem value="high">High Privacy</SelectItem>
                    <SelectItem value="standard">Standard Privacy</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="twoFactorAuth"
                  checked={formData.twoFactorAuth}
                  onChange={(e) => handleInputChange('twoFactorAuth', e.target.checked)}
                  className="rounded border-gold-300"
                />
                <Label htmlFor="twoFactorAuth">Enable Two-Factor Authentication (Recommended)</Label>
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Terms & Agreements</h3>
              <p className="text-gray-600">Review and accept our terms to complete your application</p>
            </div>

            <div className="space-y-6">
              <div className="bg-gray-50 p-6 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-4">Application Summary</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div><strong>Name:</strong> {formData.firstName} {formData.lastName}</div>
                  <div><strong>Email:</strong> {formData.email}</div>
                  <div><strong>Net Worth:</strong> {formData.netWorth}</div>
                  <div><strong>Primary Currency:</strong> {formData.primaryCurrency}</div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    id="termsAccepted"
                    checked={formData.termsAccepted}
                    onChange={(e) => handleInputChange('termsAccepted', e.target.checked)}
                    className="mt-1 rounded border-gold-300"
                  />
                  <Label htmlFor="termsAccepted" className="text-sm">
                    I agree to the <a href="/terms" className="text-gold-600 hover:underline">Private Banking Terms and Conditions</a> *
                  </Label>
                </div>

                <div className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    id="privacyAccepted"
                    checked={formData.privacyAccepted}
                    onChange={(e) => handleInputChange('privacyAccepted', e.target.checked)}
                    className="mt-1 rounded border-gold-300"
                  />
                  <Label htmlFor="privacyAccepted" className="text-sm">
                    I agree to the <a href="/privacy" className="text-gold-600 hover:underline">Privacy Policy</a> *
                  </Label>
                </div>

                <div className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    id="wealthDeclaration"
                    checked={formData.wealthDeclaration}
                    onChange={(e) => handleInputChange('wealthDeclaration', e.target.checked)}
                    className="mt-1 rounded border-gold-300"
                  />
                  <Label htmlFor="wealthDeclaration" className="text-sm">
                    I declare that all wealth information provided is accurate and verifiable *
                  </Label>
                </div>

                <div className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    id="complianceAgreement"
                    checked={formData.complianceAgreement}
                    onChange={(e) => handleInputChange('complianceAgreement', e.target.checked)}
                    className="mt-1 rounded border-gold-300"
                  />
                  <Label htmlFor="complianceAgreement" className="text-sm">
                    I agree to comply with all regulatory requirements and enhanced due diligence *
                  </Label>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return <div>Step content not implemented</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gold-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl shadow-2xl border-gold-200">
        <CardHeader className="bg-gradient-to-r from-gray-900 via-gray-800 to-black text-white">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-gold-600 rounded-full flex items-center justify-center">
              <Crown className="h-6 w-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-3xl font-bold">Private Banking Application</CardTitle>
              <CardDescription className="text-gray-300 text-lg">
                Exclusive wealth management for ultra-high-net-worth individuals
              </CardDescription>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex justify-between text-sm text-gray-300">
              <span>Step {currentStep} of {totalSteps}</span>
              <span>{Math.round(progress)}% Complete</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-yellow-400 to-gold-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>

          <div className="flex justify-center space-x-6 mt-6">
            <Badge variant="outline" className="bg-gold-100 text-gold-800 border-gold-300">
              <Star className="h-3 w-3 mr-1" />
              Minimum $10M Assets
            </Badge>
            <Badge variant="outline" className="bg-purple-100 text-purple-800 border-purple-300">
              <Shield className="h-3 w-3 mr-1" />
              Swiss-Level Privacy
            </Badge>
            <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-300">
              <Globe className="h-3 w-3 mr-1" />
              Global Access
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="p-8">
          <div className="min-h-[500px]">
            {renderStepContent()}
          </div>

          <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
            <Button
              variant="outline"
              onClick={currentStep === 1 ? onBack : handlePrevious}
              className="flex items-center space-x-2 border-gold-300 text-gold-700 hover:bg-gold-50"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>{currentStep === 1 ? 'Back to Options' : 'Previous'}</span>
            </Button>

            <Button
              onClick={currentStep === totalSteps ? handleSubmit : handleNext}
              disabled={isSubmitting}
              className="flex items-center space-x-2 bg-gradient-to-r from-gold-600 to-yellow-600 hover:from-gold-700 hover:to-yellow-700 text-white"
            >
              <span>
                {isSubmitting ? 'Submitting Application...' : currentStep === totalSteps ? 'Submit Application' : 'Next Step'}
              </span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
