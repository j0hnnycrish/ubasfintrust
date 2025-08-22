import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useBankingStore } from '@/lib/bankingStore';
import { Eye, EyeOff, Lock, Mail, ArrowLeft, User, Shield } from 'lucide-react';
import { UBASLogo } from '@/components/ui/UBASLogo';

interface PersonalLoginProps {
  onBack: () => void;
  onSwitchToRegister: () => void;
}

export function PersonalLogin({ onBack, onSwitchToRegister }: PersonalLoginProps) {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const login = useBankingStore((state) => state.login);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
  const success = await login(identifier, password, 'personal');
      if (success) {
        toast({
          title: 'Welcome to Personal Banking',
          description: 'Successfully logged into your personal account.',
        });
      } else {
        toast({
          title: 'Login Failed',
          description: 'Invalid credentials. Please check your email and password.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'An unexpected error occurred.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl mx-auto grid lg:grid-cols-2 gap-8 items-center">
        {/* Left side - Branding */}
        <div className="hidden lg:flex flex-col justify-center space-y-8 text-blue-900">
          <div className="space-y-4">
            <Button
              variant="ghost"
              onClick={onBack}
              className="self-start text-blue-600 hover:text-blue-800"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
            
            <div className="flex items-center space-x-4">
              <UBASLogo variant="icon" width={64} height={64} className="shadow-lg rounded-lg" />
              <div>
                <h1 className="text-4xl font-bold">Personal Banking</h1>
                <p className="text-xl text-blue-600">Your financial partner for life</p>
              </div>
            </div>
            
            <div className="space-y-6">
              <h2 className="text-3xl font-bold">
                Banking Made Simple
              </h2>
              <p className="text-lg text-blue-700 leading-relaxed">
                Access your personal accounts, manage your finances, and achieve your 
                financial goals with our comprehensive personal banking solutions.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  <span>Savings & Current Accounts</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  <span>Personal Loans & Credit Cards</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  <span>Investment & Insurance Services</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  <span>24/7 Mobile & Internet Banking</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Login Form */}
        <div className="flex justify-center">
          <Card className="w-full max-w-md shadow-2xl border-blue-200 bg-white/95 backdrop-blur-sm">
            <CardHeader className="space-y-1 text-center">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-blue-100 rounded-full">
                  <User className="h-8 w-8 text-blue-600" />
                </div>
              </div>
              <CardTitle className="text-2xl font-bold text-blue-900">Personal Banking Login</CardTitle>
              <CardDescription className="text-blue-600">
                Access your personal banking account
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="identifier" className="text-blue-900 font-medium">
                    Username or Phone
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-blue-500" />
                    <Input
                      id="identifier"
                      type="text"
                      placeholder="Enter your username or phone number"
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      className="pl-9 border-blue-200 focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-blue-900 font-medium">
                    Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-blue-500" />
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-9 pr-9 border-blue-200 focus:border-blue-500 focus:ring-blue-500"
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
                        <EyeOff className="h-4 w-4 text-blue-500" />
                      ) : (
                        <Eye className="h-4 w-4 text-blue-500" />
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
                  {isLoading ? 'Signing In...' : 'Sign In to Personal Banking'}
                </Button>
              </form>

              <div className="space-y-4">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-blue-200" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-2 text-blue-600">Need Assistance?</span>
                  </div>
                </div>

                <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-xs text-blue-700 mb-2">Having trouble accessing your account?</p>
                  <div className="space-y-1 text-xs">
                    <p>• Call us at 1-800-UBAS-FIN</p>
                    <p>• Visit your nearest branch</p>
                    <p>• Use our online account recovery</p>
                  </div>
                </div>
              </div>

              <div className="text-center">
                <p className="text-sm text-blue-700">
                  Don't have an account?{' '}
                  <Button
                    variant="link"
                    className="p-0 h-auto font-medium text-blue-600 hover:text-blue-800"
                    onClick={onSwitchToRegister}
                  >
                    Open a personal account
                  </Button>
                </p>
              </div>

              <div className="flex items-center justify-center space-x-2 text-xs text-blue-600">
                <Shield className="h-3 w-3" />
                <span>Secured by 256-bit SSL encryption</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Mobile branding */}
        <div className="lg:hidden col-span-full text-center space-y-4">
          <Button
            variant="ghost"
            onClick={onBack}
            className="text-blue-600 hover:text-blue-800"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
}