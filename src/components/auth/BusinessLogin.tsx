import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useBankingStore } from '@/lib/bankingStore';
import { Eye, EyeOff, Lock, Mail, ArrowLeft, Building, Shield, TrendingUp } from 'lucide-react';
import { UBASLogo } from '@/components/ui/UBASLogo';

interface BusinessLoginProps {
  onBack: () => void;
  onSwitchToRegister: () => void;
}

export function BusinessLogin({ onBack, onSwitchToRegister }: BusinessLoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const login = useBankingStore((state) => state.login);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const success = await login(email, password, 'business');
      if (success) {
        toast({
          title: 'Welcome to Business Banking',
          description: 'Successfully logged into your business account.',
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
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl mx-auto grid lg:grid-cols-2 gap-8 items-center">
        {/* Left side - Branding */}
        <div className="hidden lg:flex flex-col justify-center space-y-8 text-green-900">
          <div className="space-y-4">
            <Button
              variant="ghost"
              onClick={onBack}
              className="self-start text-green-600 hover:text-green-800"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
            
            <div className="flex items-center space-x-4">
              <UBASLogo variant="icon" width={64} height={64} className="shadow-lg rounded-lg" />
              <div>
                <h1 className="text-4xl font-bold">Business Banking</h1>
                <p className="text-xl text-green-600">Grow your business with us</p>
              </div>
            </div>
            
            <div className="space-y-6">
              <h2 className="text-3xl font-bold">
                Empowering Business Success
              </h2>
              <p className="text-lg text-green-700 leading-relaxed">
                Access comprehensive business banking solutions designed to streamline 
                your operations, manage cash flow, and fuel your business growth.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                  <span>Business Current & Savings Accounts</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                  <span>Trade Finance & Equipment Financing</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                  <span>Cash Management Solutions</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                  <span>Payroll & Business Card Services</span>
                </div>
              </div>
              
              <div className="bg-green-100 rounded-lg p-6 border border-green-200">
                <div className="flex items-center space-x-3 mb-3">
                  <TrendingUp className="h-6 w-6 text-green-600" />
                  <h3 className="font-semibold text-green-900">Business Growth Stats</h3>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-2xl font-bold text-green-700">85%</div>
                    <div className="text-green-600">Revenue Growth</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-700">50K+</div>
                    <div className="text-green-600">SME Clients</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Login Form */}
        <div className="flex justify-center">
          <Card className="w-full max-w-md shadow-2xl border-green-200 bg-white/95 backdrop-blur-sm">
            <CardHeader className="space-y-1 text-center">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-green-100 rounded-full">
                  <Building className="h-8 w-8 text-green-600" />
                </div>
              </div>
              <CardTitle className="text-2xl font-bold text-green-900">Business Banking Login</CardTitle>
              <CardDescription className="text-green-600">
                Access your business banking portal
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-green-900 font-medium">
                    Business Email Address
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-green-500" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your business email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-9 border-green-200 focus:border-green-500 focus:ring-green-500"
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-green-900 font-medium">
                    Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-green-500" />
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-9 pr-9 border-green-200 focus:border-green-500 focus:ring-green-500"
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
                        <EyeOff className="h-4 w-4 text-green-500" />
                      ) : (
                        <Eye className="h-4 w-4 text-green-500" />
                      )}
                    </Button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center space-x-2 text-green-700">
                    <input type="checkbox" className="rounded border-green-300" />
                    <span>Remember me</span>
                  </label>
                  <a href="#" className="text-green-600 hover:text-green-800 font-medium">
                    Forgot password?
                  </a>
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-green-600 hover:bg-green-700 text-white"
                  disabled={isLoading}
                >
                  {isLoading ? 'Signing In...' : 'Sign In to Business Banking'}
                </Button>
              </form>

              <div className="space-y-4">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-green-200" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-2 text-green-600">Business Support</span>
                  </div>
                </div>

                <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                  <p className="text-xs text-green-700 mb-2">Business Banking Support:</p>
                  <div className="space-y-1 text-xs">
                    <p>• Dedicated business relationship manager</p>
                    <p>• 24/7 business support hotline</p>
                    <p>• Secure business account recovery</p>
                  </div>
                </div>
              </div>

              <div className="text-center">
                <p className="text-sm text-green-700">
                  Need a business account?{' '}
                  <Button
                    variant="link"
                    className="p-0 h-auto font-medium text-green-600 hover:text-green-800"
                    onClick={onSwitchToRegister}
                  >
                    Open a business account
                  </Button>
                </p>
              </div>

              <div className="flex items-center justify-center space-x-2 text-xs text-green-600">
                <Shield className="h-3 w-3" />
                <span>Enterprise-grade security & compliance</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Mobile branding */}
        <div className="lg:hidden col-span-full text-center space-y-4">
          <Button
            variant="ghost"
            onClick={onBack}
            className="text-green-600 hover:text-green-800"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
}