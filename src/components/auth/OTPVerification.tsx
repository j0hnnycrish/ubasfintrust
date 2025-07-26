import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Shield, Smartphone, Mail, Clock, RefreshCw } from 'lucide-react';

interface OTPVerificationProps {
  email: string;
  phone: string;
  onVerificationSuccess: () => void;
  onBack: () => void;
  verificationType: 'login' | 'transaction' | 'registration';
}

export function OTPVerification({ 
  email, 
  phone, 
  onVerificationSuccess, 
  onBack, 
  verificationType 
}: OTPVerificationProps) {
  const [otpCode, setOtpCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const [canResend, setCanResend] = useState(false);
  const [verificationMethod, setVerificationMethod] = useState<'sms' | 'email'>('sms');
  const { toast } = useToast();

  // Countdown timer
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Simulate OTP verification
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Validate OTP code format and simulate verification
      if (otpCode.length === 6 && /^\d{6}$/.test(otpCode)) {
        toast({
          title: 'Verification Successful',
          description: `OTP verified successfully via ${verificationMethod.toUpperCase()}.`,
        });
        onVerificationSuccess();
      } else {
        toast({
          title: 'Invalid OTP',
          description: 'Please enter a valid 6-digit OTP code.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Verification Failed',
        description: 'An error occurred during verification. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setIsLoading(true);
    try {
      // Simulate sending OTP
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: 'OTP Sent',
        description: `A new OTP has been sent to your ${verificationMethod === 'sms' ? 'phone' : 'email'}.`,
      });
      
      setTimeLeft(300);
      setCanResend(false);
      setOtpCode('');
    } catch (error) {
      toast({
        title: 'Failed to Send OTP',
        description: 'Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getVerificationTitle = () => {
    switch (verificationType) {
      case 'login':
        return 'Secure Login Verification';
      case 'transaction':
        return 'Transaction Authorization';
      case 'registration':
        return 'Account Registration Verification';
      default:
        return 'Security Verification';
    }
  };

  const getVerificationDescription = () => {
    switch (verificationType) {
      case 'login':
        return 'Please verify your identity to complete the login process';
      case 'transaction':
        return 'Please authorize this transaction with your OTP code';
      case 'registration':
        return 'Please verify your contact information to complete registration';
      default:
        return 'Please enter the verification code to continue';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-2xl border-blue-200 bg-white/95 backdrop-blur-sm">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-blue-100 rounded-full">
              <Shield className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-blue-900">
            {getVerificationTitle()}
          </CardTitle>
          <CardDescription className="text-blue-600">
            {getVerificationDescription()}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Verification Method Selection */}
          <div className="space-y-3">
            <Label className="text-blue-900 font-medium">Choose verification method:</Label>
            <div className="grid grid-cols-2 gap-3">
              <Button
                type="button"
                variant={verificationMethod === 'sms' ? 'default' : 'outline'}
                className={`flex items-center space-x-2 ${
                  verificationMethod === 'sms' 
                    ? 'bg-blue-600 hover:bg-blue-700' 
                    : 'border-blue-200 text-blue-700 hover:bg-blue-50'
                }`}
                onClick={() => setVerificationMethod('sms')}
              >
                <Smartphone className="h-4 w-4" />
                <span>SMS</span>
              </Button>
              <Button
                type="button"
                variant={verificationMethod === 'email' ? 'default' : 'outline'}
                className={`flex items-center space-x-2 ${
                  verificationMethod === 'email' 
                    ? 'bg-blue-600 hover:bg-blue-700' 
                    : 'border-blue-200 text-blue-700 hover:bg-blue-50'
                }`}
                onClick={() => setVerificationMethod('email')}
              >
                <Mail className="h-4 w-4" />
                <span>Email</span>
              </Button>
            </div>
          </div>

          {/* Contact Information Display */}
          <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-700 mb-2">
              OTP sent to your {verificationMethod === 'sms' ? 'phone' : 'email'}:
            </p>
            <p className="font-medium text-blue-900">
              {verificationMethod === 'sms' 
                ? `${phone.slice(0, -4)}****` 
                : `${email.split('@')[0].slice(0, -2)}**@${email.split('@')[1]}`
              }
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="otp" className="text-blue-900 font-medium">
                Enter 6-digit OTP Code
              </Label>
              <Input
                id="otp"
                type="text"
                placeholder="000000"
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                className="text-center text-2xl tracking-widest border-blue-200 focus:border-blue-500 focus:ring-blue-500"
                maxLength={6}
                required
              />
            </div>

            {/* Timer and Resend */}
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-2 text-blue-700">
                <Clock className="h-4 w-4" />
                <span>Code expires in {formatTime(timeLeft)}</span>
              </div>
              {canResend && (
                <Button
                  type="button"
                  variant="link"
                  className="p-0 h-auto text-blue-600 hover:text-blue-800"
                  onClick={handleResendOTP}
                  disabled={isLoading}
                >
                  <RefreshCw className="h-3 w-3 mr-1" />
                  Resend OTP
                </Button>
              )}
            </div>

            <Button 
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              disabled={isLoading || otpCode.length !== 6}
            >
              {isLoading ? 'Verifying...' : 'Verify & Continue'}
            </Button>
          </form>



          <div className="flex justify-center">
            <Button
              variant="ghost"
              onClick={onBack}
              className="text-blue-600 hover:text-blue-800"
            >
              Back to Login
            </Button>
          </div>

          <div className="flex items-center justify-center space-x-2 text-xs text-blue-600">
            <Shield className="h-3 w-3" />
            <span>Your security is our priority</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
