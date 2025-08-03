import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from '@/contexts/AdminContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Users,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  Upload,
  Camera,
  FileText,
  Loader2,
  AlertCircle,
  Shield,
  User,
  Home
} from 'lucide-react';

interface PersonalRegistrationProps {
  onComplete: (customerData: any) => void;
  onBack: () => void;
}

export function PersonalRegistration({ onComplete, onBack }: PersonalRegistrationProps) {
  const navigate = useNavigate();
  const { createCustomer, createAccount } = useAdmin();
  const [currentStep, setCurrentStep] = useState(1); // 1: Personal Info, 2: Documents, 3: Account Setup, 4: Success
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [uploadedDocuments, setUploadedDocuments] = useState({
    idDocument: null as File | null,
    proofOfAddress: null as File | null,
    selfie: null as File | null
  });

  const [formData, setFormData] = useState({
    // Personal Information
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    nationality: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    
    // Employment Information
    occupation: '',
    employer: '',
    annualIncome: '',
    sourceOfFunds: '',
    
    // Account Setup
    initialDeposit: '',
    currency: 'USD',
    username: '',
    password: '',
    confirmPassword: '',
    
    // Preferences
    accountPurpose: '',
    monthlyTransactionVolume: '',
    preferredLanguage: 'English'
  });

  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [agreedToPrivacy, setAgreedToPrivacy] = useState(false);

  const countries = [
    'United States', 'United Kingdom', 'Canada', 'Australia', 'Germany', 
    'France', 'Japan', 'Singapore', 'Switzerland', 'Netherlands', 'Italy',
    'Spain', 'Brazil', 'Mexico', 'India', 'China', 'South Korea'
  ];

  const currencies = ['USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD', 'CHF', 'SGD'];

  const occupations = [
    'Employed', 'Self-Employed', 'Business Owner', 'Student', 'Retired', 
    'Unemployed', 'Professional', 'Executive', 'Other'
  ];

  const incomeRanges = [
    'Under $25,000', '$25,000 - $50,000', '$50,000 - $100,000', 
    '$100,000 - $250,000', '$250,000 - $500,000', 'Over $500,000'
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (error) setError('');
  };

  const handleFileUpload = (documentType: keyof typeof uploadedDocuments, file: File | null) => {
    setUploadedDocuments(prev => ({ ...prev, [documentType]: file }));
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!(formData.firstName && formData.lastName && formData.email && 
                 formData.phone && formData.dateOfBirth && formData.address && 
                 formData.country && formData.occupation);
      case 2:
        return !!(uploadedDocuments.idDocument && uploadedDocuments.proofOfAddress && 
                 uploadedDocuments.selfie);
      case 3:
        return !!(formData.username && formData.password && formData.confirmPassword && 
                 formData.initialDeposit && agreedToTerms && agreedToPrivacy &&
                 formData.password === formData.confirmPassword);
      default:
        return false;
    }
  };

  const handleNextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1);
      setError('');
    } else {
      setError('Please fill in all required fields');
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
      setError('');
    } else {
      onBack();
    }
  };

  const handleSubmit = async () => {
    if (!validateStep(3)) {
      setError('Please complete all required fields');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      // Create customer
      const customerResult = await createCustomer({
        username: formData.username,
        email: formData.email,
        fullName: `${formData.firstName} ${formData.lastName}`,
        phoneNumber: formData.phone,
        accountType: 'personal',
        password: formData.password,
        address: formData.address,
        dateOfBirth: formData.dateOfBirth,
        nationality: formData.nationality,
        occupation: formData.occupation,
        annualIncome: formData.annualIncome,
        isVerified: false, // Requires admin verification
        kycStatus: 'pending',
        documents: {
          idDocument: uploadedDocuments.idDocument?.name,
          proofOfAddress: uploadedDocuments.proofOfAddress?.name,
          selfie: uploadedDocuments.selfie?.name
        }
      });

      if (customerResult.success) {
        // Create initial account
        const accountResult = await createAccount(customerResult.customer.id, {
          name: 'Primary Checking',
          type: 'checking',
          balance: parseFloat(formData.initialDeposit),
          currency: formData.currency
        });

        if (accountResult.success) {
          setCurrentStep(4);
          onComplete({
            customer: customerResult.customer,
            account: accountResult.account
          });
        } else {
          setError(accountResult.error || 'Failed to create account');
        }
      } else {
        setError(customerResult.error || 'Failed to create customer');
      }
    } catch (error) {
      setError('Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderPersonalInfoStep = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-gray-900">Personal Information</h3>
        <p className="text-gray-600">Please provide your personal details</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="firstName">First Name *</Label>
          <Input
            id="firstName"
            value={formData.firstName}
            onChange={(e) => handleInputChange('firstName', e.target.value)}
            placeholder="Enter your first name"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="lastName">Last Name *</Label>
          <Input
            id="lastName"
            value={formData.lastName}
            onChange={(e) => handleInputChange('lastName', e.target.value)}
            placeholder="Enter your last name"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="dateOfBirth">Date of Birth *</Label>
          <Input
            id="dateOfBirth"
            type="date"
            value={formData.dateOfBirth}
            onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="nationality">Nationality *</Label>
          <Select value={formData.nationality} onValueChange={(value) => handleInputChange('nationality', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select nationality" />
            </SelectTrigger>
            <SelectContent>
              {countries.map((country) => (
                <SelectItem key={country} value={country}>{country}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email Address *</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            placeholder="Enter your email"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number *</Label>
          <Input
            id="phone"
            value={formData.phone}
            onChange={(e) => handleInputChange('phone', e.target.value)}
            placeholder="Enter your phone number"
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="address">Address *</Label>
          <Input
            id="address"
            value={formData.address}
            onChange={(e) => handleInputChange('address', e.target.value)}
            placeholder="Enter your full address"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="city">City *</Label>
          <Input
            id="city"
            value={formData.city}
            onChange={(e) => handleInputChange('city', e.target.value)}
            placeholder="Enter your city"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="country">Country *</Label>
          <Select value={formData.country} onValueChange={(value) => handleInputChange('country', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select country" />
            </SelectTrigger>
            <SelectContent>
              {countries.map((country) => (
                <SelectItem key={country} value={country}>{country}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="occupation">Occupation *</Label>
          <Select value={formData.occupation} onValueChange={(value) => handleInputChange('occupation', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select occupation" />
            </SelectTrigger>
            <SelectContent>
              {occupations.map((occupation) => (
                <SelectItem key={occupation} value={occupation}>{occupation}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="annualIncome">Annual Income</Label>
          <Select value={formData.annualIncome} onValueChange={(value) => handleInputChange('annualIncome', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select income range" />
            </SelectTrigger>
            <SelectContent>
              {incomeRanges.map((range) => (
                <SelectItem key={range} value={range}>{range}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );

  const renderDocumentsStep = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-gray-900">Document Verification</h3>
        <p className="text-gray-600">Please upload the required documents for verification</p>
      </div>

      <div className="space-y-6">
        {/* ID Document */}
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
          <div className="text-center">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h4 className="font-medium text-gray-900 mb-2">Government-Issued ID *</h4>
            <p className="text-sm text-gray-600 mb-4">Upload a clear photo of your passport, driver's license, or national ID</p>
            <input
              type="file"
              accept="image/*,.pdf"
              onChange={(e) => handleFileUpload('idDocument', e.target.files?.[0] || null)}
              className="hidden"
              id="idDocument"
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => document.getElementById('idDocument')?.click()}
            >
              <Upload className="h-4 w-4 mr-2" />
              {uploadedDocuments.idDocument ? 'Change Document' : 'Upload Document'}
            </Button>
            {uploadedDocuments.idDocument && (
              <p className="text-sm text-green-600 mt-2">✓ {uploadedDocuments.idDocument.name}</p>
            )}
          </div>
        </div>

        {/* Proof of Address */}
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
          <div className="text-center">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h4 className="font-medium text-gray-900 mb-2">Proof of Address *</h4>
            <p className="text-sm text-gray-600 mb-4">Upload a utility bill, bank statement, or lease agreement (not older than 3 months)</p>
            <input
              type="file"
              accept="image/*,.pdf"
              onChange={(e) => handleFileUpload('proofOfAddress', e.target.files?.[0] || null)}
              className="hidden"
              id="proofOfAddress"
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => document.getElementById('proofOfAddress')?.click()}
            >
              <Upload className="h-4 w-4 mr-2" />
              {uploadedDocuments.proofOfAddress ? 'Change Document' : 'Upload Document'}
            </Button>
            {uploadedDocuments.proofOfAddress && (
              <p className="text-sm text-green-600 mt-2">✓ {uploadedDocuments.proofOfAddress.name}</p>
            )}
          </div>
        </div>

        {/* Selfie */}
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
          <div className="text-center">
            <Camera className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h4 className="font-medium text-gray-900 mb-2">Selfie Verification *</h4>
            <p className="text-sm text-gray-600 mb-4">Take a clear selfie holding your ID document</p>
            <input
              type="file"
              accept="image/*"
              capture="user"
              onChange={(e) => handleFileUpload('selfie', e.target.files?.[0] || null)}
              className="hidden"
              id="selfie"
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => document.getElementById('selfie')?.click()}
            >
              <Camera className="h-4 w-4 mr-2" />
              {uploadedDocuments.selfie ? 'Retake Selfie' : 'Take Selfie'}
            </Button>
            {uploadedDocuments.selfie && (
              <p className="text-sm text-green-600 mt-2">✓ {uploadedDocuments.selfie.name}</p>
            )}
          </div>
        </div>
      </div>

      <Alert className="bg-blue-50 border-blue-200">
        <Shield className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-blue-800">
          Your documents are encrypted and stored securely. We use bank-level security to protect your information.
        </AlertDescription>
      </Alert>
    </div>
  );

  const renderAccountSetupStep = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-gray-900">Account Setup</h3>
        <p className="text-gray-600">Create your login credentials and make your initial deposit</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="username">Username *</Label>
          <Input
            id="username"
            value={formData.username}
            onChange={(e) => handleInputChange('username', e.target.value)}
            placeholder="Choose a username"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="currency">Account Currency *</Label>
          <Select value={formData.currency} onValueChange={(value) => handleInputChange('currency', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select currency" />
            </SelectTrigger>
            <SelectContent>
              {currencies.map((currency) => (
                <SelectItem key={currency} value={currency}>{currency}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password *</Label>
          <Input
            id="password"
            type="password"
            value={formData.password}
            onChange={(e) => handleInputChange('password', e.target.value)}
            placeholder="Create a strong password"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirm Password *</Label>
          <Input
            id="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
            placeholder="Confirm your password"
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="initialDeposit">Initial Deposit (Minimum $1,000) *</Label>
          <Input
            id="initialDeposit"
            type="number"
            min="1000"
            value={formData.initialDeposit}
            onChange={(e) => handleInputChange('initialDeposit', e.target.value)}
            placeholder="Enter initial deposit amount"
          />
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-start space-x-3">
          <Checkbox
            id="terms"
            checked={agreedToTerms}
            onCheckedChange={setAgreedToTerms}
          />
          <Label htmlFor="terms" className="text-sm">
            I agree to the <a href="/terms" className="text-blue-600 hover:underline">Terms of Service</a> and 
            <a href="/conditions" className="text-blue-600 hover:underline"> Account Conditions</a> *
          </Label>
        </div>

        <div className="flex items-start space-x-3">
          <Checkbox
            id="privacy"
            checked={agreedToPrivacy}
            onCheckedChange={setAgreedToPrivacy}
          />
          <Label htmlFor="privacy" className="text-sm">
            I agree to the <a href="/privacy" className="text-blue-600 hover:underline">Privacy Policy</a> and 
            consent to data processing *
          </Label>
        </div>
      </div>

      <Alert className="bg-yellow-50 border-yellow-200">
        <AlertCircle className="h-4 w-4 text-yellow-600" />
        <AlertDescription className="text-yellow-800">
          Your account will be pending verification until our team reviews your documents. This typically takes 1-2 business days.
        </AlertDescription>
      </Alert>
    </div>
  );

  const renderSuccessStep = () => (
    <div className="text-center space-y-6">
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
        <CheckCircle className="h-8 w-8 text-green-600" />
      </div>
      <div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Application Submitted!</h3>
        <p className="text-gray-600">
          Thank you for choosing UBAS Financial Trust. Your personal banking application has been submitted successfully.
        </p>
      </div>
      <div className="bg-gray-50 rounded-lg p-6">
        <h4 className="font-medium text-gray-900 mb-4">What happens next?</h4>
        <div className="space-y-3 text-sm text-gray-600">
          <div className="flex items-center space-x-3">
            <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-xs font-medium text-blue-600">1</span>
            </div>
            <span>Document verification (1-2 business days)</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-xs font-medium text-blue-600">2</span>
            </div>
            <span>Account activation and welcome package</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-xs font-medium text-blue-600">3</span>
            </div>
            <span>Access to full banking services</span>
          </div>
        </div>
      </div>
      <Button onClick={() => navigate('/')} className="bg-blue-600 hover:bg-blue-700">
        Return to Homepage
      </Button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back to Homepage Button */}
        <div className="mb-8">
          <Button
            onClick={() => navigate('/')}
            variant="outline"
            className="flex items-center space-x-2 hover:bg-gray-100"
          >
            <Home className="h-4 w-4" />
            <span>Back to Homepage</span>
          </Button>
        </div>

        <Card>
          <CardHeader className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Users className="h-8 w-8 text-blue-600" />
              <CardTitle className="text-3xl font-bold text-gray-900">Personal Banking</CardTitle>
            </div>
            <CardDescription>
              Open your personal banking account with UBAS Financial Trust
            </CardDescription>
            
            {/* Progress Indicator */}
            <div className="flex items-center justify-center space-x-4 mt-6">
              {[1, 2, 3, 4].map((step) => (
                <div key={step} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    currentStep >= step 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-200 text-gray-600'
                  }`}>
                    {step}
                  </div>
                  {step < 4 && (
                    <div className={`w-12 h-1 mx-2 ${
                      currentStep > step ? 'bg-blue-600' : 'bg-gray-200'
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </CardHeader>
          
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {currentStep === 1 && renderPersonalInfoStep()}
            {currentStep === 2 && renderDocumentsStep()}
            {currentStep === 3 && renderAccountSetupStep()}
            {currentStep === 4 && renderSuccessStep()}

            {currentStep < 4 && (
              <div className="flex justify-between mt-8">
                <Button
                  variant="outline"
                  onClick={handlePrevStep}
                  className="flex items-center"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  {currentStep === 1 ? 'Back to Account Types' : 'Previous'}
                </Button>

                {currentStep < 3 ? (
                  <Button
                    onClick={handleNextStep}
                    className="bg-blue-600 hover:bg-blue-700 flex items-center"
                  >
                    Next
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                ) : (
                  <Button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="bg-blue-600 hover:bg-blue-700 flex items-center"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        Submit Application
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </>
                    )}
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
