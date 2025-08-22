import React, { useState } from 'react'
import { kycAPI } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Progress } from '@/components/ui/progress'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, ArrowRight, Camera, Upload, User, Home, Briefcase, CheckCircle } from 'lucide-react'
import { toast } from 'sonner'

type Props = {
  onComplete?: () => void
  onCancel?: () => void
}

type Step = { id: number; title: string; icon: React.ComponentType<{ className?: string }> }

export function KYCVerificationFlow({ onComplete = () => {}, onCancel = () => {} }: Props) {
  const steps: Step[] = [
    { id: 1, title: 'Personal', icon: User },
    { id: 2, title: 'Address', icon: Home },
    { id: 3, title: 'Employment', icon: Briefcase },
    { id: 4, title: 'Documents', icon: Upload },
    { id: 5, title: 'Review', icon: CheckCircle },
  ]
  const totalSteps = steps.length
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [personalInfo, setPersonalInfo] = useState({
    firstName: '',
    lastName: '',
    middleName: '',
    dateOfBirth: '',
    nationality: '',
    idType: '',
    idNumber: '',
    // Optional display-only fields
    email: '',
    phoneNumber: '',
  })

  const [addressInfo, setAddressInfo] = useState({
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'USA',
    residencyStatus: '',
  })

  const [employmentInfo, setEmploymentInfo] = useState({
    employmentStatus: '',
    monthlyIncome: '',
    employerName: '',
    sourceOfFunds: '',
  })

  const [documents, setDocuments] = useState<{ [k: string]: File | null }>(
    {
      primaryId: null,
      proofOfAddress: null,
      incomeProof: null,
      bankStatement: null,
      selfie: null,
    }
  )

  const [agreements, setAgreements] = useState({
    termsAndConditions: false,
    privacyPolicy: false,
    dataProcessing: false,
    marketingConsent: false,
  })

  const handleFileUpload = (key: keyof typeof documents, file: File | null) => {
    setDocuments((prev) => ({ ...prev, [key]: file }))
  }

  const validateStep = (step: number): boolean => {
    if (step === 1) {
      return Boolean(personalInfo.firstName && personalInfo.lastName && personalInfo.dateOfBirth && personalInfo.nationality)
    }
    if (step === 2) {
      return Boolean(addressInfo.street && addressInfo.city && addressInfo.state && addressInfo.country)
    }
    if (step === 3) {
      return Boolean(employmentInfo.employmentStatus && employmentInfo.monthlyIncome)
    }
    if (step === 4) {
      return Boolean(documents.primaryId && documents.selfie && documents.proofOfAddress)
    }
    if (step === 5) {
      return agreements.termsAndConditions && agreements.privacyPolicy && agreements.dataProcessing
    }
    return true
  }

  const handleNext = () => {
    if (!validateStep(currentStep)) {
      toast.error('Please complete all required fields before continuing')
      return
    }
    setCurrentStep((s) => Math.min(s + 1, totalSteps))
  }

  const handlePrevious = () => setCurrentStep((s) => Math.max(1, s - 1))

  const handleSubmit = async () => {
    if (!validateStep(5)) {
      toast.error('Please accept the required agreements')
      return
    }
    setIsSubmitting(true)
    try {
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
          primaryId: documents.primaryId || undefined,
          proofOfAddress: documents.proofOfAddress || undefined,
          incomeProof: documents.incomeProof || undefined,
          bankStatement: documents.bankStatement || undefined,
          selfie: documents.selfie || undefined,
        },
        agreements: {
          termsAndConditions: agreements.termsAndConditions,
          privacyPolicy: agreements.privacyPolicy,
        },
      })
      if (response.success) {
        toast.success('KYC submitted successfully. We will review within 24–48 hours.')
        onComplete()
      } else {
        throw new Error(response.message || 'Submission failed')
      }
    } catch (e: any) {
      toast.error(e?.message || 'There was an error submitting your application')
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">First Name *</Label>
                <Input id="firstName" value={personalInfo.firstName} onChange={(e) => setPersonalInfo({ ...personalInfo, firstName: e.target.value })} placeholder="Enter your first name" />
              </div>
              <div>
                <Label htmlFor="lastName">Last Name *</Label>
                <Input id="lastName" value={personalInfo.lastName} onChange={(e) => setPersonalInfo({ ...personalInfo, lastName: e.target.value })} placeholder="Enter your last name" />
              </div>
              <div>
                <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                <Input id="dateOfBirth" type="date" value={personalInfo.dateOfBirth} onChange={(e) => setPersonalInfo({ ...personalInfo, dateOfBirth: e.target.value })} />
              </div>
              <div>
                <Label htmlFor="nationality">Nationality *</Label>
                <Select value={personalInfo.nationality} onValueChange={(value) => setPersonalInfo({ ...personalInfo, nationality: value })}>
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
                <Label htmlFor="idType">ID Type</Label>
                <Select value={personalInfo.idType} onValueChange={(value) => setPersonalInfo({ ...personalInfo, idType: value })}>
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
              <div>
                <Label htmlFor="idNumber">ID Number</Label>
                <Input id="idNumber" value={personalInfo.idNumber} onChange={(e) => setPersonalInfo({ ...personalInfo, idNumber: e.target.value })} placeholder="Enter your ID number" />
              </div>
            </div>
          </div>
        )
      case 2:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">Address Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <Label htmlFor="street">Street Address *</Label>
                <Input id="street" value={addressInfo.street} onChange={(e) => setAddressInfo({ ...addressInfo, street: e.target.value })} placeholder="Enter your street address" />
              </div>
              <div>
                <Label htmlFor="city">City *</Label>
                <Input id="city" value={addressInfo.city} onChange={(e) => setAddressInfo({ ...addressInfo, city: e.target.value })} placeholder="Enter your city" />
              </div>
              <div>
                <Label htmlFor="state">State *</Label>
                <Input id="state" value={addressInfo.state} onChange={(e) => setAddressInfo({ ...addressInfo, state: e.target.value })} placeholder="Enter your state" />
              </div>
              <div>
                <Label htmlFor="zip">ZIP/Postal Code</Label>
                <Input id="zip" value={addressInfo.zipCode} onChange={(e) => setAddressInfo({ ...addressInfo, zipCode: e.target.value })} placeholder="Enter ZIP code" />
              </div>
              <div>
                <Label htmlFor="country">Country *</Label>
                <Input id="country" value={addressInfo.country} onChange={(e) => setAddressInfo({ ...addressInfo, country: e.target.value })} placeholder="Enter country" />
              </div>
            </div>
          </div>
        )
      case 3:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">Employment & Income</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="employmentStatus">Employment Status *</Label>
                <Select value={employmentInfo.employmentStatus} onValueChange={(value) => setEmploymentInfo({ ...employmentInfo, employmentStatus: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
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
                <Select value={employmentInfo.monthlyIncome} onValueChange={(value) => setEmploymentInfo({ ...employmentInfo, monthlyIncome: value })}>
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
                <Input id="employerName" value={employmentInfo.employerName} onChange={(e) => setEmploymentInfo({ ...employmentInfo, employerName: e.target.value })} placeholder="Enter employer name" />
              </div>
              <div>
                <Label htmlFor="sourceOfFunds">Source of Funds</Label>
                <Select value={employmentInfo.sourceOfFunds} onValueChange={(value) => setEmploymentInfo({ ...employmentInfo, sourceOfFunds: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select source" />
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
        )
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
                    <p className="text-sm text-gray-600">Passport, National ID, or Driver's License</p>
                    <input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={(e) => handleFileUpload('primaryId', e.target.files?.[0] || null)} className="mt-2" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="proofOfAddress">Address Proof *</Label>
                  <div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">Utility bill or bank statement</p>
                    <input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={(e) => handleFileUpload('proofOfAddress', e.target.files?.[0] || null)} className="mt-2" />
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="selfie">Selfie Verification *</Label>
                  <div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <Camera className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">Upload a clear selfie holding your ID</p>
                    <input type="file" accept=".jpg,.jpeg,.png" onChange={(e) => handleFileUpload('selfie', e.target.files?.[0] || null)} className="mt-2" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="incomeProof">Income Proof (Optional)</Label>
                  <div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">Salary slip or income statement</p>
                    <input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={(e) => handleFileUpload('incomeProof', e.target.files?.[0] || null)} className="mt-2" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      case 5:
        const progress = (currentStep / totalSteps) * 100
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">Review & Submit</h3>
            <div className="bg-gray-50 p-6 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-4">Application Summary</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><strong>Name:</strong> {personalInfo.firstName} {personalInfo.lastName}</div>
                <div><strong>Phone:</strong> {personalInfo.phoneNumber || '—'}</div>
                <div><strong>Address:</strong> {addressInfo.city}, {addressInfo.state}</div>
                <div><strong>Employment:</strong> {employmentInfo.employmentStatus || '—'}</div>
                <div><strong>Income:</strong> {employmentInfo.monthlyIncome || '—'}</div>
              </div>
              <div className="flex justify-between text-sm text-gray-500 mt-4">
                <span>Step {currentStep} of {totalSteps}</span>
                <span>{Math.round(progress)}% Complete</span>
              </div>
              <Progress value={progress} className="h-2 mt-2" />
            </div>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <input type="checkbox" id="terms" checked={agreements.termsAndConditions} onChange={(e) => setAgreements({ ...agreements, termsAndConditions: e.target.checked })} className="mt-1" />
                <Label htmlFor="terms" className="text-sm">I agree to the <a href="/terms" className="text-blue-600 hover:underline">Terms and Conditions</a> *</Label>
              </div>
              <div className="flex items-start space-x-3">
                <input type="checkbox" id="privacy" checked={agreements.privacyPolicy} onChange={(e) => setAgreements({ ...agreements, privacyPolicy: e.target.checked })} className="mt-1" />
                <Label htmlFor="privacy" className="text-sm">I agree to the <a href="/privacy" className="text-blue-600 hover:underline">Privacy Policy</a> *</Label>
              </div>
              <div className="flex items-start space-x-3">
                <input type="checkbox" id="dataProcessing" checked={agreements.dataProcessing} onChange={(e) => setAgreements({ ...agreements, dataProcessing: e.target.checked })} className="mt-1" />
                <Label htmlFor="dataProcessing" className="text-sm">I consent to data processing for KYC verification purposes *</Label>
              </div>
              <div className="flex items-start space-x-3">
                <input type="checkbox" id="marketing" checked={agreements.marketingConsent} onChange={(e) => setAgreements({ ...agreements, marketingConsent: e.target.checked })} className="mt-1" />
                <Label htmlFor="marketing" className="text-sm">I consent to receive marketing communications (optional)</Label>
              </div>
            </div>
          </div>
        )
      default:
        return <div />
    }
  }

  const overallProgress = (currentStep / totalSteps) * 100

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">KYC Verification</CardTitle>
          <CardDescription className="text-center">Complete your identity verification to unlock all banking features</CardDescription>
          <div className="mt-6">
            <div className="flex justify-between text-sm text-gray-500 mb-2">
              <span>Step {currentStep} of {totalSteps}</span>
              <span>{Math.round(overallProgress)}% Complete</span>
            </div>
            <Progress value={overallProgress} className="h-2" />
          </div>
          <div className="flex justify-center space-x-4 mt-4">
            {steps.map((step) => (
              <div key={step.id} className={`flex items-center space-x-2 px-3 py-2 rounded-lg ${step.id === currentStep ? 'bg-blue-100 text-blue-700' : step.id < currentStep ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                <step.icon className="h-4 w-4" />
                <span className="text-sm font-medium hidden md:inline">{step.title}</span>
              </div>
            ))}
          </div>
        </CardHeader>
        <CardContent className="px-8 pb-8">
          <div className="min-h-[400px]">{renderStepContent()}</div>
          <div className="flex justify-between mt-8">
            <Button variant="outline" onClick={currentStep === 1 ? onCancel : handlePrevious} className="flex items-center space-x-2">
              <ArrowLeft className="h-4 w-4" />
              <span>{currentStep === 1 ? 'Cancel' : 'Previous'}</span>
            </Button>
            <Button onClick={currentStep === totalSteps ? handleSubmit : handleNext} disabled={isSubmitting} className="flex items-center space-x-2">
              <span>{isSubmitting ? 'Submitting...' : currentStep === totalSteps ? 'Submit Application' : 'Next'}</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default KYCVerificationFlow
