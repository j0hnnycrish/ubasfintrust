import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import { ChevronDown, Menu, X, Phone, Mail, MapPin } from 'lucide-react';
import { ACCOUNT_TYPES, BANKING_PRODUCTS, BANKING_SERVICES } from '@/types/accountTypes';
import bankingLogo from '@/assets/banking-logo.jpg';

interface NavigationProps {
  onAccountLogin: (accountType: string) => void;
}

export function Navigation({ onAccountLogin }: NavigationProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-white border-b border-banking-gold/20 shadow-sm relative z-50">
      {/* Top Bar */}
      <div className="bg-banking-dark text-white py-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <Phone className="h-3 w-3" />
                <span>+234-700-PROVIDUS</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-3 w-3" />
                <span>info@providusbank.com</span>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <MapPin className="h-3 w-3" />
                <span>Find a Branch</span>
              </div>
              <span>•</span>
              <span>24/7 Customer Support</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-4">
            <img 
              src={bankingLogo} 
              alt="Providus Bank" 
              className="w-10 h-10 rounded-full shadow-md"
            />
            <div>
              <h1 className="text-xl font-bold text-banking-dark">PROVIDUS BANK</h1>
              <p className="text-xs text-banking-gray">Future Forward Banking</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            <NavigationMenu>
              <NavigationMenuList className="space-x-6">
                {/* Personal Banking */}
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="text-banking-dark hover:text-banking-gold">
                    Personal
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="grid gap-3 p-6 w-[500px] grid-cols-2">
                      <div className="space-y-3">
                        <h4 className="font-medium text-banking-dark">Accounts</h4>
                        {BANKING_PRODUCTS[0].items.map((product) => (
                          <NavigationMenuLink key={product.name} className="block space-y-1 p-3 rounded-md hover:bg-banking-gold/10">
                            <div className="text-sm font-medium text-banking-dark">{product.name}</div>
                            <p className="text-xs text-banking-gray">{product.description}</p>
                          </NavigationMenuLink>
                        ))}
                      </div>
                      <div className="space-y-3">
                        <h4 className="font-medium text-banking-dark">Cards & Loans</h4>
                        {BANKING_PRODUCTS[1].items.concat(BANKING_PRODUCTS[2].items.slice(0, 2)).map((product) => (
                          <NavigationMenuLink key={product.name} className="block space-y-1 p-3 rounded-md hover:bg-banking-gold/10">
                            <div className="text-sm font-medium text-banking-dark">{product.name}</div>
                            <p className="text-xs text-banking-gray">{product.description}</p>
                          </NavigationMenuLink>
                        ))}
                      </div>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                {/* Business Banking */}
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="text-banking-dark hover:text-banking-gold">
                    Business
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="grid gap-3 p-6 w-[400px]">
                      <div className="space-y-3">
                        <h4 className="font-medium text-banking-dark">Business Solutions</h4>
                        {BANKING_SERVICES[1].items.map((service) => (
                          <NavigationMenuLink key={service} className="block p-3 rounded-md hover:bg-banking-gold/10">
                            <div className="text-sm font-medium text-banking-dark">{service}</div>
                          </NavigationMenuLink>
                        ))}
                      </div>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                {/* Corporate Banking */}
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="text-banking-dark hover:text-banking-gold">
                    Corporate
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="grid gap-3 p-6 w-[300px]">
                      <div className="space-y-3">
                        <h4 className="font-medium text-banking-dark">Corporate Services</h4>
                        {ACCOUNT_TYPES.corporate.features.map((feature) => (
                          <NavigationMenuLink key={feature} className="block p-3 rounded-md hover:bg-banking-gold/10">
                            <div className="text-sm font-medium text-banking-dark">{feature}</div>
                          </NavigationMenuLink>
                        ))}
                      </div>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                {/* Digital Banking */}
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="text-banking-dark hover:text-banking-gold">
                    Digital
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="grid gap-3 p-6 w-[300px]">
                      <div className="space-y-3">
                        <h4 className="font-medium text-banking-dark">Digital Services</h4>
                        {BANKING_SERVICES[2].items.map((service) => (
                          <NavigationMenuLink key={service} className="block p-3 rounded-md hover:bg-banking-gold/10">
                            <div className="text-sm font-medium text-banking-dark">{service}</div>
                          </NavigationMenuLink>
                        ))}
                      </div>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                {/* About */}
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="text-banking-dark hover:text-banking-gold">
                    About
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="grid gap-3 p-6 w-[200px]">
                      <div className="space-y-3">
                        {['Our Story', 'Leadership', 'Careers', 'News & Media', 'Investor Relations'].map((item) => (
                          <NavigationMenuLink key={item} className="block p-3 rounded-md hover:bg-banking-gold/10">
                            <div className="text-sm font-medium text-banking-dark">{item}</div>
                          </NavigationMenuLink>
                        ))}
                      </div>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {/* Login Dropdown */}
            <div className="relative group">
              <Button
                variant="banking-outline"
                className="flex items-center space-x-2"
              >
                <span>Internet Banking</span>
                <ChevronDown className="h-4 w-4" />
              </Button>
              
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-elegant border border-banking-gold/20 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="p-4 space-y-3">
                  <h4 className="font-medium text-banking-dark border-b border-banking-gold/20 pb-2">Login to Your Account</h4>
                  {Object.values(ACCOUNT_TYPES).map((accountType) => (
                    <button
                      key={accountType.id}
                      onClick={() => onAccountLogin(accountType.id)}
                      className="w-full text-left p-3 rounded-md hover:bg-banking-gold/10 transition-colors"
                    >
                      <div className="font-medium text-sm" style={{ color: accountType.mainColor }}>
                        {accountType.name}
                      </div>
                      <div className="text-xs text-banking-gray">{accountType.description}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <Button variant="banking">
              Open Account
            </Button>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 bg-white border-b border-banking-gold/20 shadow-lg z-40">
          <div className="px-4 py-6 space-y-4">
            <div className="space-y-2">
              <h4 className="font-medium text-banking-dark">Banking Solutions</h4>
              {Object.values(ACCOUNT_TYPES).map((accountType) => (
                <button
                  key={accountType.id}
                  onClick={() => {
                    onAccountLogin(accountType.id);
                    setIsMobileMenuOpen(false);
                  }}
                  className="block w-full text-left p-2 rounded-md hover:bg-banking-gold/10"
                >
                  <div className="font-medium text-sm" style={{ color: accountType.mainColor }}>
                    {accountType.name}
                  </div>
                </button>
              ))}
            </div>
            <div className="pt-4 border-t border-banking-gold/20">
              <Button variant="banking" className="w-full">
                Open Account
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}