import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { 
  User, 
  MapPin, 
  FileText, 
  Briefcase, 
  Shield, 
  Upload,
  CheckCircle,
  ArrowLeft,
  ArrowRight,
  AlertTriangle
} from 'lucide-react';

interface KYCRegistrationProps {
  onBack: () => void;
  onComplete: () => void;
}

interface PersonalInfo {
  firstName: string;
  middleName: string;
  lastName: string;
  dateOfBirth: string;
  ssn: string;
  citizenship: string;
  phoneNumber: string;
  email: string;
}

interface AddressInfo {
  currentAddress: string;
  currentCity: string;
  currentState: string;
  currentZip: string;
  currentCountry: string;
  previousAddress?: string;
  previousCity?: string;
  previousState?: string;
  previousZip?: string;
  mailingAddress?: string;
  mailingCity?: string;
  mailingState?: string;
  mailingZip?: string;
}

interface EmploymentInfo {
  employmentStatus: string;
  employerName: string;
  jobTitle: string;
  workAddress: string;
  annualIncome: string;
  sourceOfFunds: string;
}

interface DocumentInfo {
  primaryId: File | null;
  secondaryId: File | null;
  addressProof: File | null;
  incomeProof: File | null;
}

export function KYCRegistration({ onBack, onComplete }: KYCRegistrationProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>({
    firstName: '',
    middleName: '',
    lastName: '',
    dateOfBirth: '',
    ssn: '',
    citizenship: '',
    phoneNumber: '',
    email: ''
  });

  const [addressInfo, setAddressInfo] = useState<AddressInfo>({
    currentAddress: '',
    currentCity: '',
    currentState: '',
    currentZip: '',
    currentCountry: 'United States'
  });

  const [employmentInfo, setEmploymentInfo] = useState<EmploymentInfo>({
    employmentStatus: '',
    employerName: '',
    jobTitle: '',
    workAddress: '',
    annualIncome: '',
    sourceOfFunds: ''
  });

  const [documents, setDocuments] = useState<DocumentInfo>({
    primaryId: null,
    secondaryId: null,
    addressProof: null,
    incomeProof: null
  });

  const [riskAssessment, setRiskAssessment] = useState({
    accountPurpose: '',
    expectedTransactionVolume: '',
    riskTolerance: '',
    isPEP: false,
    hasBusinessInterests: false
  });

  const [agreements, setAgreements] = useState({
    termsAndConditions: false,
    privacyPolicy: false,
    electronicCommunications: false,
    patriotAct: false
  });

  const steps = [
    { number: 1, title: 'Personal Information', icon: User },
    { number: 2, title: 'Address Verification', icon: MapPin },
    { number: 3, title: 'Employment & Income', icon: Briefcase },
    { number: 4, title: 'Document Upload', icon: Upload },
    { number: 5, title: 'Risk Assessment', icon: Shield },
    { number: 6, title: 'Review & Submit', icon: CheckCircle }
  ];

  const handleFileUpload = (field: keyof DocumentInfo, file: File | null) => {
    setDocuments(prev => ({ ...prev, [field]: file }));
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!(personalInfo.firstName && personalInfo.lastName && personalInfo.dateOfBirth && 
                 personalInfo.ssn && personalInfo.citizenship && personalInfo.phoneNumber && personalInfo.email);
      case 2:
        return !!(addressInfo.currentAddress && addressInfo.currentCity && 
                 addressInfo.currentState && addressInfo.currentZip);
      case 3:
        return !!(employmentInfo.employmentStatus && employmentInfo.annualIncome && employmentInfo.sourceOfFunds);
      case 4:
        return !!(documents.primaryId && documents.addressProof);
      case 5:
        return !!(riskAssessment.accountPurpose && riskAssessment.expectedTransactionVolume);
      case 6:
        return !!(agreements.termsAndConditions && agreements.privacyPolicy && 
                 agreements.electronicCommunications && agreements.patriotAct);
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 6));
    } else {
      toast({
        title: 'Incomplete Information',
        description: 'Please fill in all required fields before proceeding.',
        variant: 'destructive',
      });
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (!validateStep(6)) {
      toast({
        title: 'Incomplete Application',
        description: 'Please complete all required fields and accept all agreements.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    try {
      // Simulate application processing
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      toast({
        title: 'Application Submitted Successfully',
        description: 'Your account application is under review. You will receive an email with your account details within 24-48 hours.',
      });
      
      onComplete();
    } catch (error) {
      toast({
        title: 'Submission Failed',
        description: 'There was an error submitting your application. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name *</Label>
                <Input
                  id="firstName"
                  value={personalInfo.firstName}
                  onChange={(e) => setPersonalInfo(prev => ({ ...prev, firstName: e.target.value }))}
                  placeholder="Enter your first name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="middleName">Middle Name</Label>
                <Input
                  id="middleName"
                  value={personalInfo.middleName}
                  onChange={(e) => setPersonalInfo(prev => ({ ...prev, middleName: e.target.value }))}
                  placeholder="Enter your middle name"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name *</Label>
              <Input
                id="lastName"
                value={personalInfo.lastName}
                onChange={(e) => setPersonalInfo(prev => ({ ...prev, lastName: e.target.value }))}
                placeholder="Enter your last name"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={personalInfo.dateOfBirth}
                  onChange={(e) => setPersonalInfo(prev => ({ ...prev, dateOfBirth: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ssn">Social Security Number *</Label>
                <Input
                  id="ssn"
                  value={personalInfo.ssn}
                  onChange={(e) => setPersonalInfo(prev => ({ ...prev, ssn: e.target.value }))}
                  placeholder="XXX-XX-XXXX"
                  maxLength={11}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="citizenship">Citizenship Status *</Label>
              <Select value={personalInfo.citizenship} onValueChange={(value) => setPersonalInfo(prev => ({ ...prev, citizenship: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select citizenship status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="us-citizen">U.S. Citizen</SelectItem>
                  <SelectItem value="permanent-resident">Permanent Resident</SelectItem>
                  <SelectItem value="visa-holder">Visa Holder</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phoneNumber">Phone Number *</Label>
                <Input
                  id="phoneNumber"
                  value={personalInfo.phoneNumber}
                  onChange={(e) => setPersonalInfo(prev => ({ ...prev, phoneNumber: e.target.value }))}
                  placeholder="+1 (555) 123-4567"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  value={personalInfo.email}
                  onChange={(e) => setPersonalInfo(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="your.email@example.com"
                />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Current Residential Address</h3>
            <div className="space-y-2">
              <Label htmlFor="currentAddress">Street Address *</Label>
              <Input
                id="currentAddress"
                value={addressInfo.currentAddress}
                onChange={(e) => setAddressInfo(prev => ({ ...prev, currentAddress: e.target.value }))}
                placeholder="123 Main Street, Apt 4B"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="currentCity">City *</Label>
                <Input
                  id="currentCity"
                  value={addressInfo.currentCity}
                  onChange={(e) => setAddressInfo(prev => ({ ...prev, currentCity: e.target.value }))}
                  placeholder="New York"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="currentState">State *</Label>
                <Input
                  id="currentState"
                  value={addressInfo.currentState}
                  onChange={(e) => setAddressInfo(prev => ({ ...prev, currentState: e.target.value }))}
                  placeholder="NY"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="currentZip">ZIP Code *</Label>
                <Input
                  id="currentZip"
                  value={addressInfo.currentZip}
                  onChange={(e) => setAddressInfo(prev => ({ ...prev, currentZip: e.target.value }))}
                  placeholder="10001"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="currentCountry">Country *</Label>
              <Select value={addressInfo.currentCountry} onValueChange={(value) => setAddressInfo(prev => ({ ...prev, currentCountry: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="United States">United States</SelectItem>
                  <SelectItem value="Canada">Canada</SelectItem>
                  <SelectItem value="United Kingdom">United Kingdom</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      // Additional cases for steps 3-6 would continue here...
      default:
        return <div>Step content for step {currentStep}</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-4">
      <div className="max-w-4xl mx-auto">
        <Button variant="ghost" onClick={onBack} className="mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Login
        </Button>

        <Card className="shadow-2xl border-blue-200 bg-white/95 backdrop-blur-sm">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold text-blue-900">
              Account Application
            </CardTitle>
            <CardDescription className="text-blue-600">
              Complete your Know Your Customer (KYC) verification to open your UBAS Financial Trust account
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-8">
            {/* Progress Steps */}
            <div className="flex items-center justify-between">
              {steps.map((step, index) => (
                <div key={step.number} className="flex items-center">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                    currentStep >= step.number 
                      ? 'bg-blue-600 border-blue-600 text-white' 
                      : 'border-gray-300 text-gray-500'
                  }`}>
                    {currentStep > step.number ? (
                      <CheckCircle className="h-5 w-5" />
                    ) : (
                      <step.icon className="h-5 w-5" />
                    )}
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`w-16 h-0.5 mx-2 ${
                      currentStep > step.number ? 'bg-blue-600' : 'bg-gray-300'
                    }`} />
                  )}
                </div>
              ))}
            </div>

            {/* Step Content */}
            <div className="min-h-[400px]">
              <h2 className="text-xl font-semibold mb-6 text-center">
                Step {currentStep}: {steps[currentStep - 1].title}
              </h2>
              {renderStepContent()}
            </div>

            {/* Navigation */}
            <div className="flex justify-between pt-6 border-t">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentStep === 1}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Previous
              </Button>

              {currentStep < 6 ? (
                <Button onClick={handleNext}>
                  Next
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              ) : (
                <Button onClick={handleSubmit} disabled={isLoading}>
                  {isLoading ? 'Submitting...' : 'Submit Application'}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
