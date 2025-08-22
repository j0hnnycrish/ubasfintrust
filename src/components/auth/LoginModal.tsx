import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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
  Eye, 
  EyeOff, 
  Loader2, 
  User, 
  Building, 
  Crown,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { UBASLogo } from '@/components/ui/UBASLogo';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  onSwitchToRegister: () => void;
  onSwitchToPasswordReset: () => void;
  defaultAccountType?: string;
}

export function LoginModal({
  isOpen,
  onClose,
  onSuccess,
  onSwitchToRegister,
  onSwitchToPasswordReset,
  defaultAccountType = 'personal'
}: LoginModalProps) {
  const { login, isLoading } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    accountType: defaultAccountType
  });
  const [showPassword, setShowPassword] = useState(false);
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
    setIsSubmitting(true);

    // Validation
    if (!formData.username.trim()) {
      setError('Username is required');
      setIsSubmitting(false);
      return;
    }

    if (!formData.password) {
      setError('Password is required');
      setIsSubmitting(false);
      return;
    }

    try {
      const result = await login(formData);
      
      if (result.success) {
        onSuccess();
        onClose();
      } else {
        setError(result.error || 'Login failed');
      }
    } catch (error) {
      setError('An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (error) setError(''); // Clear error when user starts typing
  };

  const selectedAccountType = accountTypes.find(type => type.value === formData.accountType);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center">
          <div className="flex justify-center mb-4">
            <UBASLogo variant="icon" width={64} height={64} className="shadow-md rounded-lg" />
          </div>
          <DialogTitle className="text-2xl font-bold text-gray-900">
            Secure Login
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            Access your UBAS Financial Trust account
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Account Type Selection */}
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

          {/* Username */}
          <div className="space-y-2">
            <Label htmlFor="username">Username / Account Number</Label>
            <Input
              id="username"
              type="text"
              placeholder="Enter your username or account number"
              value={formData.username}
              onChange={(e) => handleInputChange('username', e.target.value)}
              className="w-full"
              disabled={isSubmitting}
            />
          </div>

          {/* Password */}
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                className="w-full pr-10"
                disabled={isSubmitting}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isSubmitting}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 text-gray-400" />
                ) : (
                  <Eye className="h-4 w-4 text-gray-400" />
                )}
              </Button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}



          {/* Submit Button */}
          <Button 
            type="submit" 
            className="w-full bg-yellow-600 hover:bg-yellow-700 text-white font-semibold py-3"
            disabled={isSubmitting || isLoading}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing In...
              </>
            ) : (
              <>
                <Shield className="mr-2 h-4 w-4" />
                Sign In Securely
              </>
            )}
          </Button>

          {/* Register Link */}
          <div className="text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <button
                type="button"
                onClick={onSwitchToRegister}
                className="text-yellow-600 hover:text-yellow-700 font-medium"
                disabled={isSubmitting}
              >
                Open Account
              </button>
            </p>
          </div>

          {/* Forgot Password */}
          <div className="text-center">
            <button
              type="button"
              onClick={onSwitchToPasswordReset}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              disabled={isSubmitting}
            >
              Forgot your password?
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
