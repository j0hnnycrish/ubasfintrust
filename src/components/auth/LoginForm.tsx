import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useBankingStore } from '@/lib/bankingStore';
import { Eye, EyeOff, Lock, Mail } from 'lucide-react';

interface LoginFormProps {
  onSwitchToRegister: () => void;
}

export function LoginForm({ onSwitchToRegister }: LoginFormProps) {
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
      const success = await login(email, password);
      if (success) {
        toast({
          title: 'Login Successful',
          description: 'Welcome back to UBAS Financial Trust!',
        });
      } else {
        toast({
          title: 'Login Failed',
          description: 'Invalid email or password. Please check your credentials.',
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
    <Card className="w-full max-w-md mx-auto shadow-elegant bg-gradient-card">
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="text-2xl font-bold text-banking-dark">Welcome Back</CardTitle>
        <CardDescription className="text-banking-gray">
          Sign in to your Providus Bank account
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-banking-dark font-medium">
              Email Address
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-banking-gray" />
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-9 border-banking-gold/20 focus:border-banking-gold"
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password" className="text-banking-dark font-medium">
              Password
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-banking-gray" />
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-9 pr-9 border-banking-gold/20 focus:border-banking-gold"
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
                  <EyeOff className="h-4 w-4 text-banking-gray" />
                ) : (
                  <Eye className="h-4 w-4 text-banking-gray" />
                )}
              </Button>
            </div>
          </div>

          <Button 
            type="submit" 
            variant="banking" 
            className="w-full" 
            disabled={isLoading}
          >
            {isLoading ? 'Signing In...' : 'Sign In'}
          </Button>
        </form>

        <div className="space-y-3">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-banking-gold/20" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-banking-gray">Need Help?</span>
            </div>
          </div>

          <div className="text-center space-y-2">
            <p className="text-sm text-banking-gray">
              Forgot your login credentials?
            </p>
            <Button
              variant="banking-outline"
              size="sm"
              className="w-full text-xs"
            >
              Contact Customer Support
            </Button>
          </div>
        </div>

        <div className="text-center">
          <p className="text-sm text-banking-gray">
            Don't have an account?{' '}
            <Button
              variant="link"
              className="p-0 h-auto font-medium text-banking-gold hover:text-banking-gold/80"
              onClick={onSwitchToRegister}
            >
              Sign up here
            </Button>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}