import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { kycAPI } from '@/lib/api';
import { 
  Upload, 
  FileText, 
  Camera, 
  CheckCircle, 
  AlertCircle,
  User,
  MapPin,
  Briefcase,
  Shield,
  ArrowRight,
  ArrowLeft,
  Eye,
  Download
} from 'lucide-react';

interface KYCVerificationFlowProps {
  onComplete: () => void;
  onCancel: () => void;
}

interface PersonalInfo {
  firstName: string;
  middleName: string;
  lastName: string;
  dateOfBirth: string;
  nationality: string;
  idType: string;
  idNumber: string;
  phoneNumber: string;
  email: string;
}

interface AddressInfo {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  residencyStatus: string;
  yearsAtAddress: string;
}

interface EmploymentInfo {
  employmentStatus: string;
  employerName: string;
  jobTitle: string;
  workAddress: string;
  monthlyIncome: string;
  sourceOfFunds: string;
  industryType: string;
}

interface DocumentInfo {
  primaryId: File | null;
  secondaryId: File | null;
  addressProof: File | null;
  incomeProof: File | null;
  selfie: File | null;
}

export function KYCVerificationFlow({ onComplete, onCancel }: KYCVerificationFlowProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const totalSteps = 5;

  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>({
    firstName: '',
    middleName: '',
    lastName: '',
    dateOfBirth: '',
    nationality: '',
    idType: '',
    idNumber: '',
    phoneNumber: '',
    email: ''
  });

  const [addressInfo, setAddressInfo] = useState<AddressInfo>({
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    residencyStatus: '',
    yearsAtAddress: ''
  });

  const [employmentInfo, setEmploymentInfo] = useState<EmploymentInfo>({
    employmentStatus: '',
    employerName: '',
    jobTitle: '',
    workAddress: '',
    monthlyIncome: '',
    sourceOfFunds: '',
    industryType: ''
  });

  const [documents, setDocuments] = useState<DocumentInfo>({
    primaryId: null,
    secondaryId: null,
    addressProof: null,
    incomeProof: null,
    selfie: null
  });

  const [agreements, setAgreements] = useState({
    termsAndConditions: false,
    privacyPolicy: false,
    dataProcessing: false,
    marketingConsent: false
  });

  const steps = [
    { id: 1, title: 'Personal Information', icon: User },
    { id: 2, title: 'Address Details', icon: MapPin },
    { id: 3, title: 'Employment & Income', icon: Briefcase },
    { id: 4, title: 'Document Upload', icon: Upload },
    { id: 5, title: 'Review & Submit', icon: CheckCircle }
  ];

  const handleFileUpload = (field: keyof DocumentInfo, file: File | null) => {
    setDocuments(prev => ({ ...prev, [field]: file }));
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!(personalInfo.firstName && personalInfo.lastName && personalInfo.dateOfBirth && 
                 personalInfo.nationality && personalInfo.idType && personalInfo.idNumber);
      case 2:
        return !!(addressInfo.street && addressInfo.city && addressInfo.state && 
                 addressInfo.zipCode && addressInfo.residencyStatus);
      case 3:
        return !!(employmentInfo.employmentStatus && employmentInfo.monthlyIncome && 
                 employmentInfo.sourceOfFunds);
      case 4:
        return !!(documents.primaryId && documents.addressProof && documents.selfie);
      case 5:
        return !!(agreements.termsAndConditions && agreements.privacyPolicy && agreements.dataProcessing);
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
      // Create FormData for file uploads
      const formData = new FormData();
      
      // Add personal information
      Object.entries(personalInfo).forEach(([key, value]) => {
        formData.append(`personal_${key}`, value);
      });
      
      // Add address information
      Object.entries(addressInfo).forEach(([key, value]) => {
        formData.append(`address_${key}`, value);
      });
      
      // Add employment information
      Object.entries(employmentInfo).forEach(([key, value]) => {
        formData.append(`employment_${key}`, value);
      });
      
      // Add documents
      Object.entries(documents).forEach(([key, file]) => {
        if (file) {
          formData.append(`document_${key}`, file);
        }
      });
      
      // Add agreements
      Object.entries(agreements).forEach(([key, value]) => {
        formData.append(`agreement_${key}`, value.toString());
      });

      // Submit to API using our kycAPI
      const response = await kycAPI.submit({
        personalInfo: {
          firstName: personalInfo.firstName,
          lastName: personalInfo.lastName,
          dateOfBirth: personalInfo.dateOfBirth,
          nationality: personalInfo.nationality,
        },
        addressInfo: {
          street: addressInfo.street,
          city: addressInfo.city,
          state: addressInfo.state,
          country: addressInfo.country,
        },
        employmentInfo: {
          employmentStatus: employmentInfo.employmentStatus,
          monthlyIncome: employmentInfo.monthlyIncome,
        },
        documents: {
          primaryId: documents.primaryId,
          proofOfAddress: documents.addressProof,
          incomeProof: documents.incomeProof,
          selfie: documents.selfie,
        },
        agreements: {
          termsAndConditions: agreements.termsAndConditions,
          privacyPolicy: agreements.privacyPolicy,
        },
      });

      if (response.success) {
        toast({
          title: 'KYC Application Submitted',
          description: 'Your verification documents have been submitted successfully. We will review them within 24-48 hours.',
        });
        onComplete();
      } else {
        throw new Error(response.message || 'Submission failed');
      }
    } catch (error) {
      console.error('KYC submission error:', error);
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
            <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">First Name *</Label>
                <Input
                  id="firstName"
                  value={personalInfo.firstName}
                  onChange={(e) => setPersonalInfo(prev => ({ ...prev, firstName: e.target.value }))}
                  placeholder="Enter your first name"
                />
              </div>
              <div>
                <Label htmlFor="lastName">Last Name *</Label>
                <Input
                  id="lastName"
                  value={personalInfo.lastName}
                  onChange={(e) => setPersonalInfo(prev => ({ ...prev, lastName: e.target.value }))}
                  placeholder="Enter your last name"
                />
              </div>
              <div>
                <Label htmlFor="middleName">Middle Name</Label>
                <Input
                  id="middleName"
                  value={personalInfo.middleName}
                  onChange={(e) => setPersonalInfo(prev => ({ ...prev, middleName: e.target.value }))}
                  placeholder="Enter your middle name"
                />
              </div>
              <div>
                <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={personalInfo.dateOfBirth}
                  onChange={(e) => setPersonalInfo(prev => ({ ...prev, dateOfBirth: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="nationality">Nationality *</Label>
        <Select value={personalInfo.nationality} onValueChange={(value) => setPersonalInfo(prev => ({ ...prev, nationality: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select nationality" />
                  </SelectTrigger>
                  <SelectContent>
          <SelectItem value="american">American</SelectItem>
          <SelectItem value="british">British</SelectItem>
          <SelectItem value="canadian">Canadian</SelectItem>
          <SelectItem value="indian">Indian</SelectItem>
          <SelectItem value="nigerian">Nigerian</SelectItem>
          <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="idType">ID Type *</Label>
                <Select value={personalInfo.idType} onValueChange={(value) => setPersonalInfo(prev => ({ ...prev, idType: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select ID type" />
                  </SelectTrigger>
                  <SelectContent>
          <SelectItem value="passport">Passport</SelectItem>
          <SelectItem value="drivers_license">Driver's License</SelectItem>
          <SelectItem value="national_id">National ID</SelectItem>
          <SelectItem value="residence_permit">Residence Permit</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="idNumber">ID Number *</Label>
                <Input
                  id="idNumber"
                  value={personalInfo.idNumber}
                  onChange={(e) => setPersonalInfo(prev => ({ ...prev, idNumber: e.target.value }))}
                  placeholder="Enter your ID number"
                />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">Address Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <Label htmlFor="street">Street Address *</Label>
                <Input
                  id="street"
                  value={addressInfo.street}
                  onChange={(e) => setAddressInfo(prev => ({ ...prev, street: e.target.value }))}
                  placeholder="Enter your street address"
                />
              </div>
              <div>
                <Label htmlFor="city">City *</Label>
                <Input
                  id="city"
                  value={addressInfo.city}
                  onChange={(e) => setAddressInfo(prev => ({ ...prev, city: e.target.value }))}
                  placeholder="Enter your city"
                />
              </div>
              <div>
                <Label htmlFor="state">State *</Label>
                <Input
                  id="state"
                  value={addressInfo.state}
                  onChange={(e) => setAddressInfo(prev => ({ ...prev, state: e.target.value }))}
                  placeholder="Enter your state"
                />
              </div>
              <div>
                <Label htmlFor="zipCode">ZIP/Postal Code *</Label>
                <Input
                  id="zipCode"
                  value={addressInfo.zipCode}
                  onChange={(e) => setAddressInfo(prev => ({ ...prev, zipCode: e.target.value }))}
                  placeholder="Enter ZIP code"
                />
              </div>
              <div>
                <Label htmlFor="residencyStatus">Residency Status *</Label>
                <Select value={addressInfo.residencyStatus} onValueChange={(value) => setAddressInfo(prev => ({ ...prev, residencyStatus: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="owner">Property Owner</SelectItem>
                    <SelectItem value="tenant">Tenant</SelectItem>
                    <SelectItem value="family">Living with Family</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">Employment & Income Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="employmentStatus">Employment Status *</Label>
                <Select value={employmentInfo.employmentStatus} onValueChange={(value) => setEmploymentInfo(prev => ({ ...prev, employmentStatus: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select employment status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="employed">Employed</SelectItem>
                    <SelectItem value="self_employed">Self Employed</SelectItem>
                    <SelectItem value="business_owner">Business Owner</SelectItem>
                    <SelectItem value="retired">Retired</SelectItem>
                    <SelectItem value="student">Student</SelectItem>
                    <SelectItem value="unemployed">Unemployed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="monthlyIncome">Monthly Income (USD) *</Label>
                <Select value={employmentInfo.monthlyIncome} onValueChange={(value) => setEmploymentInfo(prev => ({ ...prev, monthlyIncome: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select income range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0-2000">$0 - $2,000</SelectItem>
                    <SelectItem value="2000-5000">$2,000 - $5,000</SelectItem>
                    <SelectItem value="5000-10000">$5,000 - $10,000</SelectItem>
                    <SelectItem value="10000-25000">$10,000 - $25,000</SelectItem>
                    <SelectItem value="25000+">$25,000+</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="employerName">Employer Name</Label>
                <Input
                  id="employerName"
                  value={employmentInfo.employerName}
                  onChange={(e) => setEmploymentInfo(prev => ({ ...prev, employerName: e.target.value }))}
                  placeholder="Enter employer name"
                />
              </div>
              <div>
                <Label htmlFor="sourceOfFunds">Source of Funds *</Label>
                <Select value={employmentInfo.sourceOfFunds} onValueChange={(value) => setEmploymentInfo(prev => ({ ...prev, sourceOfFunds: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select source of funds" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="salary">Salary</SelectItem>
                    <SelectItem value="business">Business Income</SelectItem>
                    <SelectItem value="investments">Investment Returns</SelectItem>
                    <SelectItem value="inheritance">Inheritance</SelectItem>
                    <SelectItem value="savings">Personal Savings</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">Document Upload</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="primaryId">Primary ID Document *</Label>
                  <div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">Upload your primary ID (Passport, National ID, Driver's License)</p>
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => handleFileUpload('primaryId', e.target.files?.[0] || null)}
                      className="mt-2"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="addressProof">Address Proof *</Label>
                  <div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">Upload address proof (Utility bill, Bank statement)</p>
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => handleFileUpload('addressProof', e.target.files?.[0] || null)}
                      className="mt-2"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="selfie">Selfie Verification *</Label>
                  <div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <Camera className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">Upload a clear selfie holding your ID</p>
                    <input
                      type="file"
                      accept=".jpg,.jpeg,.png"
                      onChange={(e) => handleFileUpload('selfie', e.target.files?.[0] || null)}
                      className="mt-2"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="incomeProof">Income Proof (Optional)</Label>
                  <div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">Upload salary slip or income statement</p>
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => handleFileUpload('incomeProof', e.target.files?.[0] || null)}
                      className="mt-2"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">Review & Submit</h3>
            <div className="space-y-6">
              <div className="bg-gray-50 p-6 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-4">Application Summary</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div><strong>Name:</strong> {personalInfo.firstName} {personalInfo.lastName}</div>
                  <div><strong>Email:</strong> {personalInfo.email}</div>
                  <div><strong>Phone:</strong> {personalInfo.phoneNumber}</div>
                  <div><strong>Address:</strong> {addressInfo.city}, {addressInfo.state}</div>
                  <div><strong>Employment:</strong> {employmentInfo.employmentStatus}</div>
                  <div><strong>Income:</strong> {employmentInfo.monthlyIncome}</div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    id="terms"
                    checked={agreements.termsAndConditions}
                    onChange={(e) => setAgreements(prev => ({ ...prev, termsAndConditions: e.target.checked }))}
                    className="mt-1"
                  />
                  <Label htmlFor="terms" className="text-sm">
                    I agree to the <a href="/terms" className="text-blue-600 hover:underline">Terms and Conditions</a> *
                  </Label>
                </div>

                <div className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    id="privacy"
                    checked={agreements.privacyPolicy}
                    onChange={(e) => setAgreements(prev => ({ ...prev, privacyPolicy: e.target.checked }))}
                    className="mt-1"
                  />
                  <Label htmlFor="privacy" className="text-sm">
                    I agree to the <a href="/privacy" className="text-blue-600 hover:underline">Privacy Policy</a> *
                  </Label>
                </div>

                <div className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    id="dataProcessing"
                    checked={agreements.dataProcessing}
                    onChange={(e) => setAgreements(prev => ({ ...prev, dataProcessing: e.target.checked }))}
                    className="mt-1"
                  />
                  <Label htmlFor="dataProcessing" className="text-sm">
                    I consent to data processing for KYC verification purposes *
                  </Label>
                </div>

                <div className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    id="marketing"
                    checked={agreements.marketingConsent}
                    onChange={(e) => setAgreements(prev => ({ ...prev, marketingConsent: e.target.checked }))}
                    className="mt-1"
                  />
                  <Label htmlFor="marketing" className="text-sm">
                    I consent to receive marketing communications (optional)
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

  const progress = (currentStep / totalSteps) * 100;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">KYC Verification</CardTitle>
          <CardDescription className="text-center">
            Complete your identity verification to unlock all banking features
          </CardDescription>
          
          <div className="mt-6">
            <div className="flex justify-between text-sm text-gray-500 mb-2">
              <span>Step {currentStep} of {totalSteps}</span>
              <span>{Math.round(progress)}% Complete</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          <div className="flex justify-center space-x-4 mt-4">
            {steps.map((step) => (
              <div
                key={step.id}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg ${
                  step.id === currentStep
                    ? 'bg-blue-100 text-blue-700'
                    : step.id < currentStep
                    ? 'bg-green-100 text-green-700'
                    : 'bg-gray-100 text-gray-500'
                }`}
              >
                <step.icon className="h-4 w-4" />
                <span className="text-sm font-medium hidden md:inline">{step.title}</span>
              </div>
            ))}
          </div>
        </CardHeader>

        <CardContent className="px-8 pb-8">
          <div className="min-h-[400px]">
            {renderStepContent()}
          </div>

          <div className="flex justify-between mt-8">
            <Button
              variant="outline"
              onClick={currentStep === 1 ? onCancel : handlePrevious}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>{currentStep === 1 ? 'Cancel' : 'Previous'}</span>
            </Button>

            <Button
              onClick={currentStep === totalSteps ? handleSubmit : handleNext}
              disabled={isSubmitting}
              className="flex items-center space-x-2"
            >
              <span>
                {isSubmitting ? 'Submitting...' : currentStep === totalSteps ? 'Submit Application' : 'Next'}
              </span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
