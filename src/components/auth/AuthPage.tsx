import { useState } from 'react';
import { LoginForm } from './LoginForm';
import { RegisterForm } from './RegisterForm';
import bankingLogo from '@/assets/banking-logo.jpg';

export function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-4">
      <div className="w-full max-w-6xl mx-auto grid lg:grid-cols-2 gap-8 items-center">
        {/* Left side - Branding */}
        <div className="hidden lg:flex flex-col justify-center space-y-8 text-white">
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <img 
                src={bankingLogo} 
                alt="Providus Bank" 
                className="w-16 h-16 rounded-full shadow-banking"
              />
              <div>
                <h1 className="text-4xl font-bold">Providus Bank</h1>
                <p className="text-xl text-banking-gold">AI Banking Simulation</p>
              </div>
            </div>
            
            <div className="space-y-6">
              <h2 className="text-3xl font-bold">
                Experience Future Forward Banking
              </h2>
              <p className="text-lg text-gray-300 leading-relaxed">
                Join the Providus Bank family and experience banking like never before. 
                Our AI-powered platform provides intelligent insights, seamless transactions, 
                and personalized financial guidance.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-banking-gold rounded-full"></div>
                  <span>AI-powered customer service</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-banking-gold rounded-full"></div>
                  <span>Real-time transaction monitoring</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-banking-gold rounded-full"></div>
                  <span>Secure and seamless transfers</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-banking-gold rounded-full"></div>
                  <span>24/7 intelligent banking assistance</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Auth Forms */}
        <div className="flex justify-center">
          {isLogin ? (
            <LoginForm onSwitchToRegister={() => setIsLogin(false)} />
          ) : (
            <RegisterForm onSwitchToLogin={() => setIsLogin(true)} />
          )}
        </div>

        {/* Mobile branding */}
        <div className="lg:hidden col-span-full text-center text-white space-y-4">
          <div className="flex items-center justify-center space-x-4">
            <img 
              src={bankingLogo} 
              alt="Providus Bank" 
              className="w-12 h-12 rounded-full shadow-banking"
            />
            <div>
              <h1 className="text-2xl font-bold">Providus Bank</h1>
              <p className="text-banking-gold">AI Banking Simulation</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}