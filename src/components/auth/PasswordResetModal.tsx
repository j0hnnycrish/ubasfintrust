import React, { useState } from 'react';
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
  Shield, 
  Mail, 
  Phone,
  Loader2, 
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  Key
} from 'lucide-react';
import bankingLogo from '@/assets/banking-logo.jpg';

interface PasswordResetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBackToLogin: () => void;
}

export function PasswordResetModal({ isOpen, onClose, onBackToLogin }: PasswordResetModalProps) {
  const [step, setStep] = useState(1); // 1: Email/Phone, 2: Verification, 3: New Password, 4: Success
  const [formData, setFormData] = useState({
    identifier: '',
    identifierType: 'email',
    verificationCode: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      if (step === 1) {
        // Send verification code
        if (!formData.identifier.trim()) {
          setError('Please enter your email or phone number');
          return;
        }
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        setStep(2);
        
      } else if (step === 2) {
        // Verify code
        if (!formData.verificationCode.trim()) {
          setError('Please enter the verification code');
          return;
        }
        
        if (formData.verificationCode !== '123456') {
          setError('Invalid verification code. Please try again.');
          return;
        }
        
        await new Promise(resolve => setTimeout(resolve, 1000));
        setStep(3);
        
      } else if (step === 3) {
        // Set new password
        if (!formData.newPassword || formData.newPassword.length < 8) {
          setError('Password must be at least 8 characters long');
          return;
        }
        
        if (formData.newPassword !== formData.confirmPassword) {
          setError('Passwords do not match');
          return;
        }
        
        await new Promise(resolve => setTimeout(resolve, 1500));
        setStep(4);
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (error) setError('');
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
      setError('');
    } else {
      onBackToLogin();
    }
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="identifierType">Recovery Method</Label>
        <Select 
          value={formData.identifierType} 
          onValueChange={(value) => handleInputChange('identifierType', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Choose recovery method" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="email">
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4" />
                <span>Email Address</span>
              </div>
            </SelectItem>
            <SelectItem value="phone">
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4" />
                <span>Phone Number</span>
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="identifier">
          {formData.identifierType === 'email' ? 'Email Address' : 'Phone Number'}
        </Label>
        <div className="relative">
          {formData.identifierType === 'email' ? (
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          ) : (
            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          )}
          <Input
            id="identifier"
            type={formData.identifierType === 'email' ? 'email' : 'tel'}
            placeholder={formData.identifierType === 'email' ? 'Enter your email address' : 'Enter your phone number'}
            value={formData.identifier}
            onChange={(e) => handleInputChange('identifier', e.target.value)}
            className="pl-10"
            disabled={isSubmitting}
          />
        </div>
      </div>

      <Alert>
        <Shield className="h-4 w-4" />
        <AlertDescription>
          We'll send a verification code to your {formData.identifierType === 'email' ? 'email' : 'phone'} to verify your identity.
        </AlertDescription>
      </Alert>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Mail className="h-8 w-8 text-blue-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Check Your {formData.identifierType === 'email' ? 'Email' : 'Phone'}</h3>
        <p className="text-gray-600">
          We've sent a verification code to {formData.identifier}
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="verificationCode">Verification Code</Label>
        <Input
          id="verificationCode"
          type="text"
          placeholder="Enter 6-digit code"
          value={formData.verificationCode}
          onChange={(e) => handleInputChange('verificationCode', e.target.value)}
          className="text-center text-lg tracking-widest"
          maxLength={6}
          disabled={isSubmitting}
        />
      </div>

      <Alert>
        <CheckCircle className="h-4 w-4" />
        <AlertDescription>
          <strong>Demo Code:</strong> Use <code className="bg-gray-100 px-1 rounded">123456</code> for testing
        </AlertDescription>
      </Alert>

      <div className="text-center">
        <button
          type="button"
          className="text-sm text-blue-600 hover:text-blue-700"
          disabled={isSubmitting}
        >
          Didn't receive the code? Resend
        </button>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Key className="h-8 w-8 text-green-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Create New Password</h3>
        <p className="text-gray-600">
          Choose a strong password for your account
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="newPassword">New Password</Label>
        <Input
          id="newPassword"
          type="password"
          placeholder="Enter new password"
          value={formData.newPassword}
          onChange={(e) => handleInputChange('newPassword', e.target.value)}
          disabled={isSubmitting}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm Password</Label>
        <Input
          id="confirmPassword"
          type="password"
          placeholder="Confirm new password"
          value={formData.confirmPassword}
          onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
          disabled={isSubmitting}
        />
      </div>

      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="font-medium text-gray-900 mb-2">Password Requirements:</h4>
        <ul className="text-sm text-gray-600 space-y-1">
          <li className="flex items-center">
            <CheckCircle className={`h-3 w-3 mr-2 ${formData.newPassword.length >= 8 ? 'text-green-500' : 'text-gray-300'}`} />
            At least 8 characters
          </li>
          <li className="flex items-center">
            <CheckCircle className={`h-3 w-3 mr-2 ${/[A-Z]/.test(formData.newPassword) ? 'text-green-500' : 'text-gray-300'}`} />
            One uppercase letter
          </li>
          <li className="flex items-center">
            <CheckCircle className={`h-3 w-3 mr-2 ${/[0-9]/.test(formData.newPassword) ? 'text-green-500' : 'text-gray-300'}`} />
            One number
          </li>
        </ul>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6 text-center">
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
        <CheckCircle className="h-8 w-8 text-green-600" />
      </div>
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Password Reset Successful!</h3>
        <p className="text-gray-600">
          Your password has been updated successfully. You can now sign in with your new password.
        </p>
      </div>
      <Button 
        onClick={onBackToLogin}
        className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold"
      >
        Continue to Sign In
      </Button>
    </div>
  );

  const getStepTitle = () => {
    switch (step) {
      case 1: return 'Reset Your Password';
      case 2: return 'Verify Your Identity';
      case 3: return 'Create New Password';
      case 4: return 'Password Reset Complete';
      default: return 'Reset Password';
    }
  };

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
            {getStepTitle()}
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            {step < 4 ? `Step ${step} of 3` : 'Complete'}
          </DialogDescription>
        </DialogHeader>

        {step < 4 ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            {step === 1 && renderStep1()}
            {step === 2 && renderStep2()}
            {step === 3 && renderStep3()}

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="flex space-x-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={handleBack}
                className="flex-1"
                disabled={isSubmitting}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
              
              <Button 
                type="submit" 
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : step === 1 ? (
                  'Send Code'
                ) : step === 2 ? (
                  'Verify Code'
                ) : (
                  'Reset Password'
                )}
              </Button>
            </div>
          </form>
        ) : (
          renderStep4()
        )}
      </DialogContent>
    </Dialog>
  );
}
