import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useBankingStore } from '@/lib/bankingStore';
import { Eye, EyeOff, Lock, ArrowLeft, Building2, Shield, Globe, Award } from 'lucide-react';
import { UBASLogo } from '@/components/ui/UBASLogo';

interface CorporateLoginProps {
  onBack: () => void;
  onSwitchToRegister: () => void;
}

export function CorporateLogin({ onBack, onSwitchToRegister }: CorporateLoginProps) {
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
  const success = await login(identifier, password, 'corporate');
      if (success) {
        toast({
          title: 'Welcome to Corporate Banking',
          description: 'Successfully logged into your corporate account.',
        });
      } else {
        toast({
          title: 'Login Failed',
           description: 'Invalid credentials. Please check your username/phone and password.',
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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-violet-100 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl mx-auto grid lg:grid-cols-2 gap-8 items-center">
        {/* Left side - Branding */}
        <div className="hidden lg:flex flex-col justify-center space-y-8 text-purple-900">
          <div className="space-y-4">
            <Button
              variant="ghost"
              onClick={onBack}
              className="self-start text-purple-600 hover:text-purple-800"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
            
            <div className="flex items-center space-x-4">
              <UBASLogo variant="icon" width={64} height={64} className="shadow-lg rounded-lg" />
              <div>
                <h1 className="text-4xl font-bold">Corporate Banking</h1>
                <p className="text-xl text-purple-600">Enterprise financial solutions</p>
              </div>
            </div>
            
            <div className="space-y-6">
              <h2 className="text-3xl font-bold">
                Powering Enterprise Success
              </h2>
              <p className="text-lg text-purple-700 leading-relaxed">
                Advanced financial solutions for large enterprises. From treasury management 
                to structured finance, we provide the sophisticated tools and expertise your 
                corporation needs to thrive in the global marketplace.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                  <span>Corporate Treasury Management</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                  <span>Foreign Exchange & Trade Finance</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                  <span>Structured Finance & Capital Markets</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                  <span>Corporate Advisory Services</span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-purple-100 rounded-lg p-4 border border-purple-200">
                  <div className="flex items-center space-x-2 mb-2">
                    <Globe className="h-5 w-5 text-purple-600" />
                    <h3 className="font-semibold text-purple-900">Global Reach</h3>
                  </div>
                  <p className="text-sm text-purple-700">Presence in 15+ countries</p>
                </div>
                <div className="bg-purple-100 rounded-lg p-4 border border-purple-200">
                  <div className="flex items-center space-x-2 mb-2">
                    <Award className="h-5 w-5 text-purple-600" />
                    <h3 className="font-semibold text-purple-900">Awards</h3>
                  </div>
                  <p className="text-sm text-purple-700">Best Corporate Bank 2024</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Login Form */}
        <div className="flex justify-center">
          <Card className="w-full max-w-md shadow-2xl border-purple-200 bg-white/95 backdrop-blur-sm">
            <CardHeader className="space-y-1 text-center">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-purple-100 rounded-full">
                  <Building2 className="h-8 w-8 text-purple-600" />
                </div>
              </div>
              <CardTitle className="text-2xl font-bold text-purple-900">Corporate Banking Login</CardTitle>
              <CardDescription className="text-purple-600">
                Access your corporate banking platform
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="identifier" className="text-purple-900 font-medium">
                      Username or Phone
                    </Label>
                    <div className="relative">
                      <Input
                        id="identifier"
                        type="text"
                        placeholder="Enter your username or phone number"
                        value={identifier}
                        onChange={(e) => setIdentifier(e.target.value)}
                        className="pl-9 border-purple-200 focus:border-purple-500 focus:ring-purple-500"
                        required
                      />
                    </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-purple-900 font-medium">
                    Secure Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-purple-500" />
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-9 pr-9 border-purple-200 focus:border-purple-500 focus:ring-purple-500"
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
                        <EyeOff className="h-4 w-4 text-purple-500" />
                      ) : (
                        <Eye className="h-4 w-4 text-purple-500" />
                      )}
                    </Button>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <label className="flex items-center space-x-2 text-purple-700">
                      <input type="checkbox" className="rounded border-purple-300" />
                      <span>Remember this device</span>
                    </label>
                    <a href="#" className="text-purple-600 hover:text-purple-800 font-medium">
                      Reset access?
                    </a>
                  </div>
                  
                  <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                    <div className="flex items-start space-x-2">
                      <Shield className="h-4 w-4 text-purple-600 mt-0.5" />
                      <div>
                        <p className="text-xs text-purple-700 font-medium">Enhanced Security</p>
                        <p className="text-xs text-purple-600">Two-factor authentication may be required</p>
                      </div>
                    </div>
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                  disabled={isLoading}
                >
                  {isLoading ? 'Authenticating...' : 'Access Corporate Portal'}
                </Button>
              </form>



              <div className="text-center">
                <p className="text-sm text-purple-700">
                  Need corporate banking services?{' '}
                  <Button
                    variant="link"
                    className="p-0 h-auto font-medium text-purple-600 hover:text-purple-800"
                    onClick={onSwitchToRegister}
                  >
                    Contact our corporate team
                  </Button>
                </p>
              </div>

              <div className="flex items-center justify-center space-x-2 text-xs text-purple-600">
                <Shield className="h-3 w-3" />
                <span>Military-grade encryption & compliance</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Mobile branding */}
        <div className="lg:hidden col-span-full text-center space-y-4">
          <Button
            variant="ghost"
            onClick={onBack}
            className="text-purple-600 hover:text-purple-800"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
}