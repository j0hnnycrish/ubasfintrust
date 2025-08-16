import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { useBankingStore } from '@/lib/bankingStore';
import { Eye, EyeOff, Lock, User, CreditCard, ArrowLeft, Shield, Building } from 'lucide-react';
const bankingLogo = '/placeholder.svg';

interface ProfessionalLoginProps {
  onBack: () => void;
  onSwitchToRegister: () => void;
}

export function ProfessionalLogin({ onBack, onSwitchToRegister }: ProfessionalLoginProps) {
  const [loginMethod, setLoginMethod] = useState<'username' | 'account'>('username');
  const [username, setUsername] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const login = useBankingStore((state) => state.login);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const identifier = loginMethod === 'username' ? username : accountNumber;
      
      if (!identifier || !password) {
        toast({
          title: 'Missing Information',
          description: 'Please enter your login credentials.',
          variant: 'destructive',
        });
        return;
      }

      // Simulate professional authentication
      const success = await authenticateUser(identifier, password, loginMethod);
      
      if (success) {
        toast({
          title: 'Authentication Successful',
          description: 'Welcome to UBAS Financial Trust.',
        });
      } else {
        toast({
          title: 'Authentication Failed',
          description: 'Invalid credentials. Please check your information and try again.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Authentication Error',
        description: 'An error occurred during authentication. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const authenticateUser = async (identifier: string, password: string, method: 'username' | 'account'): Promise<boolean> => {
    // Simulate authentication delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Professional validation logic
    if (method === 'username') {
      // Username format validation
      if (identifier.length < 6 || identifier.length > 20) {
        return false;
      }
    } else {
      // Account number format validation (UBAS-XXXX-XXXX-XXXX)
      const accountPattern = /^UBAS-\d{4}-\d{4}-\d{4}$/;
      if (!accountPattern.test(identifier)) {
        return false;
      }
    }

    // Password validation
    if (password.length < 8) {
      return false;
    }

    // Simulate successful authentication for valid formats
    return true;
  };

  const formatAccountNumber = (value: string) => {
    // Remove all non-digits
    const digits = value.replace(/\D/g, '');
    
    // Limit to 12 digits (4-4-4 format)
    const limitedDigits = digits.slice(0, 12);
    
    // Format as UBAS-XXXX-XXXX-XXXX
    if (limitedDigits.length <= 4) {
      return limitedDigits ? `UBAS-${limitedDigits}` : '';
    } else if (limitedDigits.length <= 8) {
      return `UBAS-${limitedDigits.slice(0, 4)}-${limitedDigits.slice(4)}`;
    } else {
      return `UBAS-${limitedDigits.slice(0, 4)}-${limitedDigits.slice(4, 8)}-${limitedDigits.slice(8)}`;
    }
  };

  const handleAccountNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatAccountNumber(e.target.value);
    setAccountNumber(formatted);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-2xl border-red-200 bg-white/95 backdrop-blur-sm">
        <CardHeader className="space-y-1 text-center">
          <Button variant="ghost" onClick={onBack} className="absolute top-4 left-4 p-2">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          
          <div className="flex justify-center mb-4">
            <img 
              src={bankingLogo} 
              alt="UBAS Financial Trust" 
              className="w-16 h-16 rounded-full shadow-md"
            />
          </div>
          
          <CardTitle className="text-2xl font-bold text-red-900">
            Secure Access
          </CardTitle>
          <CardDescription className="text-red-600">
            Sign in to your UBAS Financial Trust account
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <Tabs value={loginMethod} onValueChange={(value) => setLoginMethod(value as 'username' | 'account')}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="username" className="flex items-center space-x-2">
                <User className="h-4 w-4" />
                <span>Username</span>
              </TabsTrigger>
              <TabsTrigger value="account" className="flex items-center space-x-2">
                <CreditCard className="h-4 w-4" />
                <span>Account Number</span>
              </TabsTrigger>
            </TabsList>

            <form onSubmit={handleSubmit} className="space-y-4 mt-6">
              <TabsContent value="username" className="space-y-4 mt-0">
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                    <Input
                      id="username"
                      type="text"
                      placeholder="Enter your username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="pl-9 border-red-200 focus:border-red-500 focus:ring-red-500"
                      required
                    />
                  </div>
                  <p className="text-xs text-gray-600">
                    Username must be 6-20 characters (letters, numbers, underscore, hyphen)
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="account" className="space-y-4 mt-0">
                <div className="space-y-2">
                  <Label htmlFor="accountNumber">Account Number</Label>
                  <div className="relative">
                    <CreditCard className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                    <Input
                      id="accountNumber"
                      type="text"
                      placeholder="UBAS-XXXX-XXXX-XXXX"
                      value={accountNumber}
                      onChange={handleAccountNumberChange}
                      className="pl-9 border-red-200 focus:border-red-500 focus:ring-red-500 font-mono"
                      maxLength={19}
                      required
                    />
                  </div>
                  <p className="text-xs text-gray-600">
                    Enter your 16-digit account number
                  </p>
                </div>
              </TabsContent>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-9 pr-9 border-red-200 focus:border-red-500 focus:ring-red-500"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-500" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-500" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center space-x-2 text-blue-700">
                  <input type="checkbox" className="rounded border-blue-300" />
                  <span>Remember me</span>
                </label>
                <a href="#" className="text-blue-600 hover:text-blue-800 font-medium">
                  Forgot password?
                </a>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                disabled={isLoading}
              >
                {isLoading ? 'Authenticating...' : 'Sign In'}
              </Button>
            </form>
          </Tabs>

          <div className="space-y-4">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-blue-200" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-blue-600">New to UBAS Financial Trust?</span>
              </div>
            </div>
            
            <Button
              variant="outline"
              className="w-full border-blue-200 text-blue-700 hover:bg-blue-50"
              onClick={onSwitchToRegister}
            >
              Open New Account
            </Button>
          </div>

          <div className="space-y-3 pt-4 border-t border-blue-200">
            <div className="flex items-center justify-center space-x-2 text-xs text-blue-600">
              <Shield className="h-3 w-3" />
              <span>256-bit SSL encryption</span>
            </div>
            <div className="flex items-center justify-center space-x-2 text-xs text-blue-600">
              <Building className="h-3 w-3" />
              <span>FDIC Insured • Equal Housing Lender</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
