import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  ArrowRight,
  Shield,
  TrendingUp,
  Users,
  Building,
  DollarSign,
  Globe,
  Award
} from 'lucide-react';

interface HeroSectionProps {
  onGetStarted: () => void;
}

export function HeroSection({ onGetStarted }: HeroSectionProps) {
  const navigate = useNavigate();

  return (
    <div className="relative bg-gradient-to-br from-red-600 via-red-700 to-red-800 min-h-screen flex items-center">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 right-20 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-white rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Content */}
          <div className="text-white space-y-8">
            <div className="space-y-6">
              <h1 className="text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight">
                <span className="block text-white mb-2">WELCOME TO UBAS FINANCIAL TRUST</span>
                <span className="text-red-100 text-4xl lg:text-5xl font-bold">Easier, Faster & Inclusive</span>
              </h1>
              <p className="text-xl lg:text-2xl text-red-100 max-w-xl">
                Experience banking that puts you first. Digital solutions for every financial need.
              </p>
            </div>



            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                onClick={onGetStarted}
                className="bg-white text-brand-700 hover:bg-brand-100 px-8 py-4 text-lg font-semibold rounded-lg"
              >
                Open Account Today
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-brand-700 px-8 py-4 text-lg font-semibold rounded-lg"
                onClick={() => onGetStarted?.() ?? window.location.assign('/about')}
              >
                Learn More
              </Button>
            </div>
          </div>

          {/* Right Content - Statistics/Features */}
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-white">
                <Users className="h-8 w-8 mb-3 text-red-200" />
                <div className="text-2xl font-bold">2.5M+</div>
                <div className="text-red-100">Global Customers</div>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-white">
                <Globe className="h-8 w-8 mb-3 text-red-200" />
                <div className="text-2xl font-bold">30+</div>
                <div className="text-red-100">Countries Served</div>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-white">
                <DollarSign className="h-8 w-8 mb-3 text-red-200" />
                <div className="text-2xl font-bold">$2.8T</div>
                <div className="text-red-100">Assets Under Management</div>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-white">
                <Award className="h-8 w-8 mb-3 text-red-200" />
                <div className="text-2xl font-bold">15+</div>
                <div className="text-red-100">Industry Awards</div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section - Service Cards */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-xl p-8 shadow-xl transform hover:scale-105 transition-transform duration-300">
            <div className="flex items-center space-x-4 mb-4">
              <div className="bg-red-100 p-3 rounded-lg">
                <Building className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-brand-800">NEWS & PUBLICATIONS</h3>
            </div>
            <p className="text-brand-600">Stay updated with our latest news, reports, and industry insights.</p>
          </div>

          <div className="bg-white rounded-xl p-8 shadow-xl transform hover:scale-105 transition-transform duration-300">
            <div className="flex items-center space-x-4 mb-4">
              <div className="bg-red-100 p-3 rounded-lg">
                <TrendingUp className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-brand-800">FINANCIAL REPORTS</h3>
            </div>
            <p className="text-brand-600">Access comprehensive financial reports and performance metrics.</p>
          </div>

          <div className="bg-white rounded-xl p-8 shadow-xl transform hover:scale-105 transition-transform duration-300">
            <div className="flex items-center space-x-4 mb-4">
              <div className="bg-red-100 p-3 rounded-lg">
                <Shield className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-brand-800">UBAS FOUNDATION</h3>
            </div>
            <p className="text-brand-600">Learn about our commitment to community development and social impact.</p>
          </div>
        </div>
      </div>
    </div>
  );
}