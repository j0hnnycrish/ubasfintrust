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
import bankingLogo from '@/assets/banking-logo.jpg';

export function Footer() {
  const footerSections = [
    {
      title: 'Personal Banking',
      links: [
        'Savings Account',
        'Current Account',
        'Fixed Deposits',
        'Personal Loans',
        'Credit Cards',
        'Investment Services'
      ]
    },
    {
      title: 'Business Banking',
      links: [
        'Business Accounts',
        'Cash Management',
        'Trade Finance',
        'Equipment Financing',
        'Working Capital',
        'Business Cards'
      ]
    },
    {
      title: 'Digital Banking',
      links: [
        'Mobile Banking',
        'Internet Banking',
        'USSD Banking',
        'API Banking',
        'Bulk Payments',
        'POS Services'
      ]
    },
    {
      title: 'Support',
      links: [
        'Customer Care',
        'Find a Branch',
        'ATM Locator',
        'Security Center',
        'Terms & Conditions',
        'Privacy Policy'
      ]
    }
  ];

  return (
    <footer className="bg-banking-dark text-white">
      {/* Newsletter Section */}
      <div className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-bold mb-2">Stay Updated</h3>
              <p className="text-gray-300">
                Get the latest news, updates, and exclusive offers from Providus Bank.
              </p>
            </div>
            <div className="flex space-x-2">
              <Input
                placeholder="Enter your email address"
                className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
              />
              <Button variant="banking">
                Subscribe
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-6 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center space-x-4">
              <img 
                src={bankingLogo} 
                alt="Providus Bank" 
                className="w-12 h-12 rounded-full shadow-md"
              />
              <div>
                <h3 className="text-xl font-bold">PROVIDUS BANK</h3>
                <p className="text-banking-gold text-sm">Future Forward Banking</p>
              </div>
            </div>
            
            <p className="text-gray-300 leading-relaxed">
              Nigeria's leading digital bank, providing innovative financial solutions 
              that empower individuals and businesses to achieve their financial goals.
            </p>

            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-banking-gold" />
                <span className="text-sm">+234-700-PROVIDUS (776-8438)</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-banking-gold" />
                <span className="text-sm">info@providusbank.com</span>
              </div>
              <div className="flex items-start space-x-3">
                <MapPin className="h-4 w-4 text-banking-gold mt-0.5" />
                <span className="text-sm">
                  Plot 794 Mohammadu Buhari Way,<br />
                  Central Business District, Abuja
                </span>
              </div>
            </div>
          </div>

          {/* Footer Links */}
          {footerSections.map((section, index) => (
            <div key={index} className="space-y-4">
              <h4 className="font-semibold text-lg">{section.title}</h4>
              <ul className="space-y-2">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <a 
                      href="#" 
                      className="text-gray-300 hover:text-banking-gold transition-colors text-sm"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Mobile Apps Section */}
        <div className="mt-12 pt-8 border-t border-white/10">
          <div className="text-center space-y-6">
            <h4 className="text-xl font-semibold">Download Our Mobile App</h4>
            <p className="text-gray-300">Bank on the go with our award-winning mobile app</p>
            <div className="flex justify-center space-x-4">
              <Button 
                variant="banking-outline" 
                className="border-white text-white hover:bg-white hover:text-banking-dark"
              >
                <Download className="h-4 w-4 mr-2" />
                App Store
              </Button>
              <Button 
                variant="banking-outline"
                className="border-white text-white hover:bg-white hover:text-banking-dark"
              >
                <Download className="h-4 w-4 mr-2" />
                Google Play
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-sm text-gray-300">
              © 2024 Providus Bank. All rights reserved. Licensed by the Central Bank of Nigeria.
            </div>
            
            {/* Social Links */}
            <div className="flex space-x-4">
              {[
                { icon: Facebook, href: '#' },
                { icon: Twitter, href: '#' },
                { icon: Instagram, href: '#' },
                { icon: Linkedin, href: '#' }
              ].map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  className="p-2 bg-white/10 rounded-full hover:bg-banking-gold/20 transition-colors"
                >
                  <social.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}