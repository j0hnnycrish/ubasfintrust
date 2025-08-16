import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin, 
  Mail, 
  Phone, 
  MapPin,
  Download
} from 'lucide-react';
const bankingLogo = '/placeholder.svg';

export function Footer() {
  const navigate = useNavigate();

  const handleLinkClick = (linkName: string) => {
    const linkLower = linkName.toLowerCase();

    // Personal Banking Links
    if (linkLower.includes('savings account')) navigate('/personal/savings');
    else if (linkLower.includes('current account')) navigate('/personal/current');
    else if (linkLower.includes('fixed deposits')) navigate('/personal/fixed-deposits');
    else if (linkLower.includes('personal loans')) navigate('/personal/loans');
    else if (linkLower.includes('credit cards')) navigate('/personal/credit-cards');
    else if (linkLower.includes('investment services')) navigate('/personal');

    // Business Banking Links
    else if (linkLower.includes('business accounts')) navigate('/business/accounts');
    else if (linkLower.includes('cash management')) navigate('/business/cash-management');
    else if (linkLower.includes('trade finance')) navigate('/business/trade-finance');
    else if (linkLower.includes('equipment financing')) navigate('/business/loans');
    else if (linkLower.includes('working capital')) navigate('/business/loans');
    else if (linkLower.includes('business cards')) navigate('/business');

    // Support Links
    else if (linkLower.includes('customer care')) navigate('/contact');
    else if (linkLower.includes('find a branch')) navigate('/contact');
    else if (linkLower.includes('atm locator')) navigate('/contact');
    else if (linkLower.includes('security center')) navigate('/about');

    // General Links
    else if (linkLower.includes('about')) navigate('/about');
    else if (linkLower.includes('contact')) navigate('/contact');
    else if (linkLower.includes('privacy')) navigate('/privacy');
    else if (linkLower.includes('terms')) navigate('/terms');
  };

  return (
    <footer className="bg-red-600 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Company Info */}
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <img
                src={bankingLogo}
                alt="UBAS Financial Trust"
                className="w-12 h-12 rounded-full"
              />
              <div>
                <h3 className="text-2xl font-bold">UBAS</h3>
                <p className="text-red-100 text-sm">UBAS FINANCIAL TRUST</p>
              </div>
            </div>
            <p className="text-red-100 leading-relaxed">
              A global financial platform delivering secure, innovative banking and wealth solutions across the Americas, Europe & Asia.
            </p>
            <div className="flex space-x-4">
              <div className="bg-red-500 hover:bg-red-400 p-2 rounded-full cursor-pointer transition-colors">
                <Facebook className="h-5 w-5" />
              </div>
              <div className="bg-red-500 hover:bg-red-400 p-2 rounded-full cursor-pointer transition-colors">
                <Twitter className="h-5 w-5" />
              </div>
              <div className="bg-red-500 hover:bg-red-400 p-2 rounded-full cursor-pointer transition-colors">
                <Instagram className="h-5 w-5" />
              </div>
              <div className="bg-red-500 hover:bg-red-400 p-2 rounded-full cursor-pointer transition-colors">
                <Linkedin className="h-5 w-5" />
              </div>
            </div>
          </div>

          {/* Personal Banking */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Personal Banking</h4>
            <ul className="space-y-2 text-red-100">
              <li><button onClick={() => handleLinkClick('Savings Account')} className="hover:text-white transition-colors">Savings Account</button></li>
              <li><button onClick={() => handleLinkClick('Current Account')} className="hover:text-white transition-colors">Current Account</button></li>
              <li><button onClick={() => handleLinkClick('Fixed Deposits')} className="hover:text-white transition-colors">Fixed Deposits</button></li>
              <li><button onClick={() => handleLinkClick('Personal Loans')} className="hover:text-white transition-colors">Personal Loans</button></li>
              <li><button onClick={() => handleLinkClick('Credit Cards')} className="hover:text-white transition-colors">Credit Cards</button></li>
              <li><button onClick={() => handleLinkClick('Investment Services')} className="hover:text-white transition-colors">Investment Services</button></li>
            </ul>
          </div>

          {/* Business Banking */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Business Banking</h4>
            <ul className="space-y-2 text-red-100">
              <li><button onClick={() => handleLinkClick('Business Accounts')} className="hover:text-white transition-colors">Business Accounts</button></li>
              <li><button onClick={() => handleLinkClick('Cash Management')} className="hover:text-white transition-colors">Cash Management</button></li>
              <li><button onClick={() => handleLinkClick('Trade Finance')} className="hover:text-white transition-colors">Trade Finance</button></li>
              <li><button onClick={() => handleLinkClick('Equipment Financing')} className="hover:text-white transition-colors">Equipment Financing</button></li>
              <li><button onClick={() => handleLinkClick('Working Capital')} className="hover:text-white transition-colors">Working Capital</button></li>
              <li><button onClick={() => handleLinkClick('Business Cards')} className="hover:text-white transition-colors">Business Cards</button></li>
            </ul>
          </div>

          {/* Contact & Support */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Contact & Support</h4>
            <div className="space-y-3 text-red-100">
              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4" />
                <span>+1 (800) 123-4567</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4" />
                <span>info@ubasfintrust.com</span>
              </div>
              <div className="flex items-start space-x-3">
                <MapPin className="h-4 w-4 mt-1" />
                <span>Global Offices: New York | London | Singapore | Dubai | Toronto</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <h5 className="font-medium">Customer Care</h5>
              <ul className="space-y-1 text-red-100 text-sm">
                <li><button onClick={() => handleLinkClick('Customer Care')} className="hover:text-white transition-colors">24/7 Support</button></li>
                <li><button onClick={() => handleLinkClick('Find a Branch')} className="hover:text-white transition-colors">Find a Branch</button></li>
                <li><button onClick={() => handleLinkClick('ATM Locator')} className="hover:text-white transition-colors">ATM Locator</button></li>
                <li><button onClick={() => handleLinkClick('Security Center')} className="hover:text-white transition-colors">Security Center</button></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-red-500 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-red-100 text-sm">
              © 2024 UBAS Financial Trust. All rights reserved.
            </div>
            <div className="flex space-x-6 text-red-100 text-sm">
              <button onClick={() => navigate('/privacy')} className="hover:text-white transition-colors">Privacy Policy</button>
              <button onClick={() => navigate('/terms')} className="hover:text-white transition-colors">Terms & Conditions</button>
              <button onClick={() => handleLinkClick('Security Center')} className="hover:text-white transition-colors">Security</button>
              <button onClick={() => navigate('/contact')} className="hover:text-white transition-colors">Contact</button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
