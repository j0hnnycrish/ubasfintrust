import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  UserPlus, 
  Eye, 
  EyeOff, 
  Loader2, 
  User, 
  Building, 
  Crown,
  AlertCircle,
  CheckCircle,
  Mail,
  Phone,
  Calendar
} from 'lucide-react';
const bankingLogo = '/placeholder.svg';

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  onSwitchToLogin: () => void;
  defaultAccountType?: string;
}

export function RegisterModal({ 
  isOpen, 
  onClose, 
  onSuccess, 
  onSwitchToLogin,
  defaultAccountType = 'personal' 
}: RegisterModalProps) {
  const { register, isLoading } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Basic Info
    accountType: defaultAccountType,
    fullName: '',
    email: '',
    phoneNumber: '',
    dateOfBirth: '',
    
    // Account Info
    username: '',
    password: '',
    confirmPassword: '',
    
    // Additional Info
    address: '',
    occupation: '',
    annualIncome: '',
    
    // Business Info (if applicable)
    businessName: '',
    businessType: '',
    companySize: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const accountTypes = [
    { value: 'personal', label: 'Personal Banking', icon: User, description: 'Individual accounts' },
    { value: 'business', label: 'Business Banking', icon: Building, description: 'Small to medium business' },
    { value: 'corporate', label: 'Corporate Banking', icon: Building, description: 'Large enterprises' },
    { value: 'private', label: 'Private Banking', icon: Crown, description: 'Wealth management' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (currentStep < 3) {
      // Validate current step and move to next
      if (validateStep(currentStep)) {
        setCurrentStep(currentStep + 1);
      }
      return;
    }

    // Final submission
    setIsSubmitting(true);

    try {
      const result = await register(formData);
      
      if (result.success) {
        onSuccess();
        onClose();
      } else {
        setError(result.error || 'Registration failed');
      }
    } catch (error) {
      setError('An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        if (!formData.fullName.trim()) {
          setError('Full name is required');
          return false;
        }
        if (!formData.email.trim() || !formData.email.includes('@')) {
          setError('Valid email is required');
          return false;
        }
        if (!formData.phoneNumber.trim()) {
          setError('Phone number is required');
          return false;
        }
        break;
      case 2:
        if (!formData.username.trim()) {
          setError('Username is required');
          return false;
        }
        if (formData.password.length < 8) {
          setError('Password must be at least 8 characters long');
          return false;
        }
        if (formData.password !== formData.confirmPassword) {
          setError('Passwords do not match');
          return false;
        }
        break;
    }
    setError('');
    return true;
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (error) setError('');
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setError('');
    }
  };

  const renderStep1 = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="accountType">Account Type</Label>
        <Select 
          value={formData.accountType} 
          onValueChange={(value) => handleInputChange('accountType', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select account type" />
          </SelectTrigger>
          <SelectContent>
            {accountTypes.map((type) => {
              const Icon = type.icon;
              return (
                <SelectItem key={type.value} value={type.value}>
                  <div className="flex items-center space-x-2">
                    <Icon className="h-4 w-4" />
                    <div>
                      <div className="font-medium">{type.label}</div>
                      <div className="text-xs text-gray-500">{type.description}</div>
                    </div>
                  </div>
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="fullName">Full Name</Label>
        <Input
          id="fullName"
          type="text"
          placeholder="Enter your full name"
          value={formData.fullName}
          onChange={(e) => handleInputChange('fullName', e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email Address</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            id="email"
            type="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="phoneNumber">Phone Number</Label>
        <div className="relative">
          <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            id="phoneNumber"
            type="tel"
            placeholder="Enter your phone number"
            value={formData.phoneNumber}
            onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="dateOfBirth">Date of Birth</Label>
        <div className="relative">
          <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            id="dateOfBirth"
            type="date"
            value={formData.dateOfBirth}
            onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
            className="pl-10"
          />
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="username">Username</Label>
        <Input
          id="username"
          type="text"
          placeholder="Choose a username"
          value={formData.username}
          onChange={(e) => handleInputChange('username', e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Create a strong password"
            value={formData.password}
            onChange={(e) => handleInputChange('password', e.target.value)}
            className="pr-10"
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

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm Password</Label>
        <div className="relative">
          <Input
            id="confirmPassword"
            type={showConfirmPassword ? 'text' : 'password'}
            placeholder="Confirm your password"
            value={formData.confirmPassword}
            onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
            className="pr-10"
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      <Alert>
        <CheckCircle className="h-4 w-4" />
        <AlertDescription>
          Password must be at least 8 characters long and include a mix of letters, numbers, and symbols.
        </AlertDescription>
      </Alert>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="address">Address</Label>
        <Input
          id="address"
          type="text"
          placeholder="Enter your address"
          value={formData.address}
          onChange={(e) => handleInputChange('address', e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="occupation">Occupation</Label>
        <Input
          id="occupation"
          type="text"
          placeholder="Enter your occupation"
          value={formData.occupation}
          onChange={(e) => handleInputChange('occupation', e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="annualIncome">Annual Income</Label>
        <Select 
          value={formData.annualIncome} 
          onValueChange={(value) => handleInputChange('annualIncome', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select income range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="under-25k">Under $25,000</SelectItem>
            <SelectItem value="25k-50k">$25,000 - $50,000</SelectItem>
            <SelectItem value="50k-100k">$50,000 - $100,000</SelectItem>
            <SelectItem value="100k-250k">$100,000 - $250,000</SelectItem>
            <SelectItem value="250k-500k">$250,000 - $500,000</SelectItem>
            <SelectItem value="over-500k">Over $500,000</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {(formData.accountType === 'business' || formData.accountType === 'corporate') && (
        <>
          <div className="space-y-2">
            <Label htmlFor="businessName">Business Name</Label>
            <Input
              id="businessName"
              type="text"
              placeholder="Enter business name"
              value={formData.businessName}
              onChange={(e) => handleInputChange('businessName', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="businessType">Business Type</Label>
            <Input
              id="businessType"
              type="text"
              placeholder="e.g., Technology, Retail, Manufacturing"
              value={formData.businessType}
              onChange={(e) => handleInputChange('businessType', e.target.value)}
            />
          </div>
        </>
      )}
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center">
          <div className="flex justify-center mb-4">
            <img 
              src={bankingLogo} 
              alt="UBAS Financial Trust" 
              className="w-16 h-16 rounded-full shadow-md"
            />
          </div>
          <DialogTitle className="text-2xl font-bold text-gray-900">
            Open Your Account
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            Step {currentStep} of 3: {currentStep === 1 ? 'Personal Information' : currentStep === 2 ? 'Account Setup' : 'Additional Details'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="flex space-x-4">
            {currentStep > 1 && (
              <Button 
                type="button" 
                variant="outline" 
                onClick={handleBack}
                className="flex-1"
                disabled={isSubmitting}
              >
                Back
              </Button>
            )}
            
            <Button 
              type="submit" 
              className="flex-1 bg-yellow-600 hover:bg-yellow-700 text-white font-semibold"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Account...
                </>
              ) : currentStep < 3 ? (
                'Next Step'
              ) : (
                <>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Create Account
                </>
              )}
            </Button>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <button
                type="button"
                onClick={onSwitchToLogin}
                className="text-yellow-600 hover:text-yellow-700 font-medium"
                disabled={isSubmitting}
              >
                Sign In
              </button>
            </p>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
