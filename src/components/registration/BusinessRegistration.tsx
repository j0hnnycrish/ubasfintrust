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
  Building,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  Upload,
  FileText,
  Loader2,
  AlertCircle,
  Shield,
  Briefcase,
  Home
} from 'lucide-react';

interface BusinessRegistrationProps {
  onComplete: (customerData: any) => void;
  onBack: () => void;
}

export function BusinessRegistration({ onComplete, onBack }: BusinessRegistrationProps) {
  const navigate = useNavigate();
  const { createCustomer, createAccount } = useAdmin();
  const [currentStep, setCurrentStep] = useState(1); // 1: Business Info, 2: Documents, 3: Account Setup, 4: Success
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [uploadedDocuments, setUploadedDocuments] = useState({
    businessLicense: null as File | null,
    articlesOfIncorporation: null as File | null,
    taxId: null as File | null,
    ownershipStructure: null as File | null,
    financialStatements: null as File | null
  });

  const [formData, setFormData] = useState({
    // Business Information
    businessName: '',
    legalBusinessName: '',
    businessType: '',
    industryType: '',
    yearEstablished: '',
    taxId: '',
    businessLicense: '',
    registrationNumber: '',
    
    // Business Address
    businessAddress: '',
    businessCity: '',
    businessState: '',
    businessZipCode: '',
    businessCountry: '',
    
    // Contact Information
    businessPhone: '',
    businessEmail: '',
    businessWebsite: '',
    
    // Authorized Representative
    repFirstName: '',
    repLastName: '',
    repTitle: '',
    repEmail: '',
    repPhone: '',
    repDateOfBirth: '',
    repNationality: '',
    
    // Business Details
    numberOfEmployees: '',
    annualRevenue: '',
    monthlyTransactionVolume: '',
    businessPurpose: '',
    
    // Account Setup
    initialDeposit: '',
    currency: 'USD',
    username: '',
    password: '',
    confirmPassword: ''
  });

  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [agreedToPrivacy, setAgreedToPrivacy] = useState(false);

  const businessTypes = [
    'Corporation', 'LLC', 'Partnership', 'Sole Proprietorship', 
    'Non-Profit', 'Trust', 'Other'
  ];

  const industryTypes = [
    'Technology', 'Healthcare', 'Finance', 'Retail', 'Manufacturing',
    'Real Estate', 'Education', 'Consulting', 'Import/Export',
    'E-commerce', 'Professional Services', 'Other'
  ];

  const employeeRanges = [
    '1-10', '11-50', '51-200', '201-500', '501-1000', '1000+'
  ];

  const revenueRanges = [
    'Under $100K', '$100K - $500K', '$500K - $1M', '$1M - $5M', 
    '$5M - $10M', '$10M - $50M', 'Over $50M'
  ];

  const countries = [
    'United States', 'United Kingdom', 'Canada', 'Australia', 'Germany', 
    'France', 'Japan', 'Singapore', 'Switzerland', 'Netherlands'
  ];

  const currencies = ['USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD', 'CHF', 'SGD'];

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
        return !!(formData.businessName && formData.businessType && formData.industryType && 
                 formData.businessAddress && formData.businessCountry && formData.businessEmail &&
                 formData.repFirstName && formData.repLastName && formData.repEmail);
      case 2:
        return !!(uploadedDocuments.businessLicense && uploadedDocuments.articlesOfIncorporation && 
                 uploadedDocuments.taxId);
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
        email: formData.businessEmail,
        fullName: formData.businessName,
        phoneNumber: formData.businessPhone,
        accountType: 'business',
        password: formData.password,
        address: formData.businessAddress,
        businessInfo: {
          legalName: formData.legalBusinessName,
          businessType: formData.businessType,
          industryType: formData.industryType,
          taxId: formData.taxId,
          yearEstablished: formData.yearEstablished,
          numberOfEmployees: formData.numberOfEmployees,
          annualRevenue: formData.annualRevenue
        },
        authorizedRep: {
          name: `${formData.repFirstName} ${formData.repLastName}`,
          title: formData.repTitle,
          email: formData.repEmail,
          phone: formData.repPhone
        },
        isVerified: false,
        kycStatus: 'pending',
        documents: {
          businessLicense: uploadedDocuments.businessLicense?.name,
          articlesOfIncorporation: uploadedDocuments.articlesOfIncorporation?.name,
          taxId: uploadedDocuments.taxId?.name,
          ownershipStructure: uploadedDocuments.ownershipStructure?.name,
          financialStatements: uploadedDocuments.financialStatements?.name
        }
      });

      if (customerResult.success) {
        // Create initial business account
        const accountResult = await createAccount(customerResult.customer.id, {
          name: 'Business Operating Account',
          type: 'business',
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

  const renderBusinessInfoStep = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-gray-900">Business Information</h3>
        <p className="text-gray-600">Please provide your business details</p>
      </div>

      <div className="space-y-6">
        {/* Business Details */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h4 className="font-medium text-gray-900 mb-4">Business Details</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="businessName">Business Name *</Label>
              <Input
                id="businessName"
                value={formData.businessName}
                onChange={(e) => handleInputChange('businessName', e.target.value)}
                placeholder="Enter business name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="legalBusinessName">Legal Business Name</Label>
              <Input
                id="legalBusinessName"
                value={formData.legalBusinessName}
                onChange={(e) => handleInputChange('legalBusinessName', e.target.value)}
                placeholder="Enter legal business name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="businessType">Business Type *</Label>
              <Select value={formData.businessType} onValueChange={(value) => handleInputChange('businessType', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select business type" />
                </SelectTrigger>
                <SelectContent>
                  {businessTypes.map((type) => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="industryType">Industry *</Label>
              <Select value={formData.industryType} onValueChange={(value) => handleInputChange('industryType', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select industry" />
                </SelectTrigger>
                <SelectContent>
                  {industryTypes.map((industry) => (
                    <SelectItem key={industry} value={industry}>{industry}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="yearEstablished">Year Established</Label>
              <Input
                id="yearEstablished"
                type="number"
                min="1900"
                max={new Date().getFullYear()}
                value={formData.yearEstablished}
                onChange={(e) => handleInputChange('yearEstablished', e.target.value)}
                placeholder="Enter year"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="taxId">Tax ID / EIN</Label>
              <Input
                id="taxId"
                value={formData.taxId}
                onChange={(e) => handleInputChange('taxId', e.target.value)}
                placeholder="Enter tax ID"
              />
            </div>
          </div>
        </div>

        {/* Business Address */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h4 className="font-medium text-gray-900 mb-4">Business Address</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="businessAddress">Business Address *</Label>
              <Input
                id="businessAddress"
                value={formData.businessAddress}
                onChange={(e) => handleInputChange('businessAddress', e.target.value)}
                placeholder="Enter business address"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="businessCity">City *</Label>
              <Input
                id="businessCity"
                value={formData.businessCity}
                onChange={(e) => handleInputChange('businessCity', e.target.value)}
                placeholder="Enter city"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="businessCountry">Country *</Label>
              <Select value={formData.businessCountry} onValueChange={(value) => handleInputChange('businessCountry', value)}>
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
              <Label htmlFor="businessEmail">Business Email *</Label>
              <Input
                id="businessEmail"
                type="email"
                value={formData.businessEmail}
                onChange={(e) => handleInputChange('businessEmail', e.target.value)}
                placeholder="Enter business email"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="businessPhone">Business Phone</Label>
              <Input
                id="businessPhone"
                value={formData.businessPhone}
                onChange={(e) => handleInputChange('businessPhone', e.target.value)}
                placeholder="Enter business phone"
              />
            </div>
          </div>
        </div>

        {/* Authorized Representative */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h4 className="font-medium text-gray-900 mb-4">Authorized Representative</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="repFirstName">First Name *</Label>
              <Input
                id="repFirstName"
                value={formData.repFirstName}
                onChange={(e) => handleInputChange('repFirstName', e.target.value)}
                placeholder="Enter first name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="repLastName">Last Name *</Label>
              <Input
                id="repLastName"
                value={formData.repLastName}
                onChange={(e) => handleInputChange('repLastName', e.target.value)}
                placeholder="Enter last name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="repTitle">Title</Label>
              <Input
                id="repTitle"
                value={formData.repTitle}
                onChange={(e) => handleInputChange('repTitle', e.target.value)}
                placeholder="e.g., CEO, President"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="repEmail">Email *</Label>
              <Input
                id="repEmail"
                type="email"
                value={formData.repEmail}
                onChange={(e) => handleInputChange('repEmail', e.target.value)}
                placeholder="Enter email"
              />
            </div>
          </div>
        </div>

        {/* Business Metrics */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h4 className="font-medium text-gray-900 mb-4">Business Metrics</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="numberOfEmployees">Number of Employees</Label>
              <Select value={formData.numberOfEmployees} onValueChange={(value) => handleInputChange('numberOfEmployees', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select range" />
                </SelectTrigger>
                <SelectContent>
                  {employeeRanges.map((range) => (
                    <SelectItem key={range} value={range}>{range}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="annualRevenue">Annual Revenue</Label>
              <Select value={formData.annualRevenue} onValueChange={(value) => handleInputChange('annualRevenue', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select range" />
                </SelectTrigger>
                <SelectContent>
                  {revenueRanges.map((range) => (
                    <SelectItem key={range} value={range}>{range}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderDocumentsStep = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-gray-900">Business Documentation</h3>
        <p className="text-gray-600">Please upload the required business documents</p>
      </div>

      <div className="space-y-6">
        {/* Business License */}
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
          <div className="text-center">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h4 className="font-medium text-gray-900 mb-2">Business License *</h4>
            <p className="text-sm text-gray-600 mb-4">Upload your current business license or permit</p>
            <input
              type="file"
              accept="image/*,.pdf"
              onChange={(e) => handleFileUpload('businessLicense', e.target.files?.[0] || null)}
              className="hidden"
              id="businessLicense"
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => document.getElementById('businessLicense')?.click()}
            >
              <Upload className="h-4 w-4 mr-2" />
              {uploadedDocuments.businessLicense ? 'Change Document' : 'Upload Document'}
            </Button>
            {uploadedDocuments.businessLicense && (
              <p className="text-sm text-green-600 mt-2">✓ {uploadedDocuments.businessLicense.name}</p>
            )}
          </div>
        </div>

        {/* Articles of Incorporation */}
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
          <div className="text-center">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h4 className="font-medium text-gray-900 mb-2">Articles of Incorporation *</h4>
            <p className="text-sm text-gray-600 mb-4">Upload your articles of incorporation or formation documents</p>
            <input
              type="file"
              accept="image/*,.pdf"
              onChange={(e) => handleFileUpload('articlesOfIncorporation', e.target.files?.[0] || null)}
              className="hidden"
              id="articlesOfIncorporation"
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => document.getElementById('articlesOfIncorporation')?.click()}
            >
              <Upload className="h-4 w-4 mr-2" />
              {uploadedDocuments.articlesOfIncorporation ? 'Change Document' : 'Upload Document'}
            </Button>
            {uploadedDocuments.articlesOfIncorporation && (
              <p className="text-sm text-green-600 mt-2">✓ {uploadedDocuments.articlesOfIncorporation.name}</p>
            )}
          </div>
        </div>

        {/* Tax ID Document */}
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
          <div className="text-center">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h4 className="font-medium text-gray-900 mb-2">Tax ID Document *</h4>
            <p className="text-sm text-gray-600 mb-4">Upload your EIN letter or tax registration document</p>
            <input
              type="file"
              accept="image/*,.pdf"
              onChange={(e) => handleFileUpload('taxId', e.target.files?.[0] || null)}
              className="hidden"
              id="taxIdDoc"
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => document.getElementById('taxIdDoc')?.click()}
            >
              <Upload className="h-4 w-4 mr-2" />
              {uploadedDocuments.taxId ? 'Change Document' : 'Upload Document'}
            </Button>
            {uploadedDocuments.taxId && (
              <p className="text-sm text-green-600 mt-2">✓ {uploadedDocuments.taxId.name}</p>
            )}
          </div>
        </div>

        {/* Optional Documents */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border-2 border-dashed border-gray-200 rounded-lg p-6">
            <div className="text-center">
              <FileText className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <h4 className="font-medium text-gray-900 mb-1">Ownership Structure</h4>
              <p className="text-xs text-gray-600 mb-3">Optional: Ownership/partnership agreements</p>
              <input
                type="file"
                accept="image/*,.pdf"
                onChange={(e) => handleFileUpload('ownershipStructure', e.target.files?.[0] || null)}
                className="hidden"
                id="ownershipStructure"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => document.getElementById('ownershipStructure')?.click()}
              >
                <Upload className="h-3 w-3 mr-1" />
                Upload
              </Button>
              {uploadedDocuments.ownershipStructure && (
                <p className="text-xs text-green-600 mt-1">✓ Uploaded</p>
              )}
            </div>
          </div>

          <div className="border-2 border-dashed border-gray-200 rounded-lg p-6">
            <div className="text-center">
              <FileText className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <h4 className="font-medium text-gray-900 mb-1">Financial Statements</h4>
              <p className="text-xs text-gray-600 mb-3">Optional: Recent financial statements</p>
              <input
                type="file"
                accept="image/*,.pdf"
                onChange={(e) => handleFileUpload('financialStatements', e.target.files?.[0] || null)}
                className="hidden"
                id="financialStatements"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => document.getElementById('financialStatements')?.click()}
              >
                <Upload className="h-3 w-3 mr-1" />
                Upload
              </Button>
              {uploadedDocuments.financialStatements && (
                <p className="text-xs text-green-600 mt-1">✓ Uploaded</p>
              )}
            </div>
          </div>
        </div>
      </div>

      <Alert className="bg-blue-50 border-blue-200">
        <Shield className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-blue-800">
          All business documents are encrypted and stored securely. We comply with all data protection regulations.
        </AlertDescription>
      </Alert>
    </div>
  );

  const renderAccountSetupStep = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-gray-900">Account Setup</h3>
        <p className="text-gray-600">Create your business banking credentials</p>
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
          <Label htmlFor="initialDeposit">Initial Deposit (Minimum $50,000) *</Label>
          <Input
            id="initialDeposit"
            type="number"
            min="50000"
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
            I agree to the <a href="/business-terms" className="text-blue-600 hover:underline">Business Terms of Service</a> and 
            <a href="/business-conditions" className="text-blue-600 hover:underline"> Business Account Conditions</a> *
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
            consent to business data processing *
          </Label>
        </div>
      </div>

      <Alert className="bg-yellow-50 border-yellow-200">
        <AlertCircle className="h-4 w-4 text-yellow-600" />
        <AlertDescription className="text-yellow-800">
          Business accounts require enhanced verification. Our compliance team will review your application within 2-3 business days.
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
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Business Application Submitted!</h3>
        <p className="text-gray-600">
          Thank you for choosing UBAS Financial Trust for your business banking needs. Your application has been submitted successfully.
        </p>
      </div>
      <div className="bg-gray-50 rounded-lg p-6">
        <h4 className="font-medium text-gray-900 mb-4">Next Steps for Business Verification</h4>
        <div className="space-y-3 text-sm text-gray-600">
          <div className="flex items-center space-x-3">
            <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-xs font-medium text-blue-600">1</span>
            </div>
            <span>Document verification and compliance review (2-3 business days)</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-xs font-medium text-blue-600">2</span>
            </div>
            <span>Business verification call with our team</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-xs font-medium text-blue-600">3</span>
            </div>
            <span>Account activation and business banking setup</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-xs font-medium text-blue-600">4</span>
            </div>
            <span>Access to full business banking services</span>
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
              <Building className="h-8 w-8 text-green-600" />
              <CardTitle className="text-3xl font-bold text-gray-900">Business Banking</CardTitle>
            </div>
            <CardDescription>
              Open your business banking account with UBAS Financial Trust
            </CardDescription>
            
            {/* Progress Indicator */}
            <div className="flex items-center justify-center space-x-4 mt-6">
              {[1, 2, 3, 4].map((step) => (
                <div key={step} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    currentStep >= step 
                      ? 'bg-green-600 text-white' 
                      : 'bg-gray-200 text-gray-600'
                  }`}>
                    {step}
                  </div>
                  {step < 4 && (
                    <div className={`w-12 h-1 mx-2 ${
                      currentStep > step ? 'bg-green-600' : 'bg-gray-200'
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

            {currentStep === 1 && renderBusinessInfoStep()}
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
                    className="bg-green-600 hover:bg-green-700 flex items-center"
                  >
                    Next
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                ) : (
                  <Button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="bg-green-600 hover:bg-green-700 flex items-center"
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
