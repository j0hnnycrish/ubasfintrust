import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
// import { CurrencySelector } from '@/components/global/CurrencySelector';
// import { useCurrency } from '@/contexts/CurrencyContext';
import {
  ChevronDown,
  Menu,
  X,
  Phone,
  Mail,
  MapPin,
  Search,
  Globe,
  Clock,
  Shield,
  Award,
  Building,
  CreditCard,
  TrendingUp,
  Users,
  Briefcase,
  PiggyBank,
  LineChart,
  HeadphonesIcon,
  FileText,
  Calendar,
  MessageCircle,
  Download,
  Smartphone,
  Crown
} from 'lucide-react';
import { ACCOUNT_TYPES, BANKING_PRODUCTS, BANKING_SERVICES } from '@/types/accountTypes';
import { UBASLogoCompact } from '@/components/ui/UBASLogo';

interface NavigationProps {
  onAccountLogin: (accountType: string) => void;
}

export function Navigation({ onAccountLogin }: NavigationProps) {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);

  // const { selectedCurrency, setSelectedCurrency } = useCurrency();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLinkClick = (href: string, label: string) => {
    console.log(`Navigating to: ${href} (${label})`);

    // Handle anchor links for same-page navigation
    if (href.startsWith('#')) {
      const element = document.querySelector(href);
      element?.scrollIntoView({ behavior: 'smooth' });
      return;
    }

    // Handle main navigation routes
    if (href === '/personal' || href === '/business' || href === '/corporate' || href === '/private' || href === '/open-account' ||
        href === '/about' || href === '/contact' || href === '/digital' || href === '/terms' || href === '/privacy' ||
        href.startsWith('/personal/') || href.startsWith('/business/') || href.startsWith('/digital/')) {
      navigate(href);
      return;
    }

    // Handle other common routes
    if (href === '/locations' || href === '/rates' || href === '/support' || href === '/careers') {
      navigate('/contact'); // Redirect to contact page for now
      return;
    }

    // For unimplemented links, redirect to about page
    navigate('/about');
  };

  return (
  <nav className={`bg-white border-b border-brand-500/20 shadow-sm relative z-50 transition-all duration-300 ${isScrolled ? 'shadow-lg' : ''}`}>
      {/* Enhanced Top Bar */}
  <div className="bg-gradient-to-r from-brand-800 to-brand-700 text-white py-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2 hover:text-brand-500 transition-colors cursor-pointer">
                <Phone className="h-3 w-3" />
                <span>+1-800-UBAS-FIN</span>
              </div>
              <div className="flex items-center space-x-2 hover:text-brand-500 transition-colors cursor-pointer">
                <Mail className="h-3 w-3" />
                <span>info@ubasfintrust.com</span>
              </div>
              <div className="hidden lg:flex items-center space-x-2 hover:text-brand-500 transition-colors cursor-pointer">
                <Clock className="h-3 w-3" />
                <span>Markets: Open</span>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              <button
                onClick={() => handleLinkClick('/locations', 'Find a Branch')}
                className="flex items-center space-x-2 hover:text-brand-500 transition-colors"
              >
                <MapPin className="h-3 w-3" />
                <span>Find a Branch</span>
              </button>
              <span className="text-brand-500">•</span>
              <button
                onClick={() => handleLinkClick('/support', '24/7 Support')}
                className="flex items-center space-x-2 hover:text-brand-500 transition-colors"
              >
                <HeadphonesIcon className="h-3 w-3" />
                <span>24/7 Support</span>
              </button>
              <span className="text-brand-500">•</span>
              <button
                onClick={() => handleLinkClick('/careers', 'Careers')}
                className="hover:text-brand-500 transition-colors"
              >
                Careers
              </button>
              <button
                onClick={() => setShowSearch(!showSearch)}
                className="hover:text-brand-500 transition-colors p-1"
              >
                <Search className="h-3 w-3" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Left Side - Logo & Branding */}
          <div className="flex items-center space-x-3 flex-shrink-0">
            <UBASLogoCompact width={140} height={36} className="hover:opacity-90 transition-opacity" />
          </div>

          {/* Center - Navigation Menu (Desktop Only) */}
          <div className="hidden lg:flex items-center justify-center flex-1 px-4 xl:px-8">
            <div className="flex items-center space-x-6 xl:space-x-8">
            <NavigationMenu>
              <NavigationMenuList className="flex items-center space-x-4 xl:space-x-6">
                {/* Personal Banking */}
                <NavigationMenuItem>
                  <NavigationMenuTrigger
                    className="text-brand-800 hover:text-brand-500 cursor-pointer"
                    onClick={() => handleLinkClick('/personal', 'Personal Banking')}
                  >
                    Personal
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="grid gap-3 p-6 w-[500px] grid-cols-2">
                      <div className="space-y-3">
                        <h4 className="font-medium text-brand-800">Accounts</h4>
                        {BANKING_PRODUCTS[0].items.map((product) => (
                          <NavigationMenuLink
                            key={product.name}
                            className="block space-y-1 p-3 rounded-md hover:bg-brand-500/10 transition-all duration-300 cursor-pointer group hover-lift"
                            onClick={() => handleLinkClick(`/personal/${product.name.toLowerCase().replace(/\s+/g, '-')}`, product.name)}
                          >
                            <div className="flex items-center space-x-2">
                              <CreditCard className="h-4 w-4 text-brand-600 group-hover:scale-110 transition-transform" />
                              <div className="text-sm font-medium text-brand-800 group-hover:text-brand-600 transition-colors">{product.name}</div>
                            </div>
                            <p className="text-xs text-brand-700/70 ml-6">{product.description}</p>
                          </NavigationMenuLink>
                        ))}
                      </div>
                      <div className="space-y-3">
                        <h4 className="font-medium text-brand-800">Cards & Loans</h4>
                        {BANKING_PRODUCTS[1].items.concat(BANKING_PRODUCTS[2].items.slice(0, 2)).map((product) => (
                          <NavigationMenuLink
                            key={product.name}
                            className="block space-y-1 p-3 rounded-md hover:bg-brand-500/10 transition-all duration-300 cursor-pointer group hover-lift"
                            onClick={() => handleLinkClick(`/personal/${product.name.toLowerCase().replace(/\s+/g, '-')}`, product.name)}
                          >
                            <div className="flex items-center space-x-2">
                              <PiggyBank className="h-4 w-4 text-brand-600 group-hover:scale-110 transition-transform" />
                              <div className="text-sm font-medium text-brand-800 group-hover:text-brand-600 transition-colors">{product.name}</div>
                            </div>
                            <p className="text-xs text-brand-700/70 ml-6">{product.description}</p>
                          </NavigationMenuLink>
                        ))}
                      </div>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                {/* Business Banking */}
                <NavigationMenuItem>
                  <NavigationMenuTrigger
                    className="text-brand-800 hover:text-brand-500 cursor-pointer"
                    onClick={() => handleLinkClick('/business', 'Business Banking')}
                  >
                    Business
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="grid gap-3 p-6 w-[400px]">
                      <div className="space-y-3">
                        <h4 className="font-medium text-brand-800">Business Solutions</h4>
                        {BANKING_SERVICES[1].items.map((service) => (
                          <NavigationMenuLink
                            key={service}
                            className="block p-3 rounded-md hover:bg-brand-500/10 transition-all duration-300 cursor-pointer group hover-lift"
                            onClick={() => handleLinkClick(`/business/${service.toLowerCase().replace(/\s+/g, '-')}`, service)}
                          >
                            <div className="flex items-center space-x-2">
                              <Briefcase className="h-4 w-4 text-brand-600 group-hover:scale-110 transition-transform" />
                              <div className="text-sm font-medium text-brand-800 group-hover:text-brand-600 transition-colors">{service}</div>
                            </div>
                          </NavigationMenuLink>
                        ))}
                      </div>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                {/* Corporate Banking */}
                <NavigationMenuItem>
                  <NavigationMenuTrigger
                    className="text-brand-800 hover:text-brand-500 cursor-pointer"
                    onClick={() => handleLinkClick('/corporate', 'Corporate Banking')}
                  >
                    Corporate
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="grid gap-3 p-6 w-[300px]">
                      <div className="space-y-3">
                        <h4 className="font-medium text-brand-800">Corporate Services</h4>
                        {ACCOUNT_TYPES.corporate.features.map((feature) => (
                          <NavigationMenuLink
                            key={feature}
                            className="block p-3 rounded-md hover:bg-brand-500/10 transition-all duration-300 cursor-pointer group hover-lift"
                            onClick={() => handleLinkClick(`/corporate/${feature.toLowerCase().replace(/\s+/g, '-')}`, feature)}
                          >
                            <div className="flex items-center space-x-2">
                              <Building className="h-4 w-4 text-brand-600 group-hover:scale-110 transition-transform" />
                              <div className="text-sm font-medium text-brand-800 group-hover:text-brand-600 transition-colors">{feature}</div>
                            </div>
                          </NavigationMenuLink>
                        ))}
                      </div>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                {/* Investments & Wealth */}
                <NavigationMenuItem>
                  <NavigationMenuTrigger
                    className="text-brand-800 hover:text-brand-500 cursor-pointer"
                    onClick={() => handleLinkClick('/private', 'Private Banking')}
                  >
                    Private Banking
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="grid gap-3 p-6 w-[450px] grid-cols-2">
                      <div className="space-y-3">
                        <h4 className="font-medium text-brand-800">Investment Services</h4>
                        {['Portfolio Management', 'Retirement Planning', 'Wealth Advisory'].map((service) => (
                          <NavigationMenuLink
                            key={service}
                            className="block p-3 rounded-md hover:bg-brand-500/10 transition-all duration-300 cursor-pointer group hover-lift"
                            onClick={() => handleLinkClick(`/investments/${service.toLowerCase().replace(/\s+/g, '-')}`, service)}
                          >
                            <div className="flex items-center space-x-2">
                              <TrendingUp className="h-4 w-4 text-brand-600 group-hover:scale-110 transition-transform" />
                              <div className="text-sm font-medium text-brand-800 group-hover:text-brand-600 transition-colors">{service}</div>
                            </div>
                          </NavigationMenuLink>
                        ))}
                        <NavigationMenuLink
                          className="block p-3 rounded-md hover:bg-brand-500/10 transition-all duration-300 cursor-pointer group hover-lift"
                          onClick={() => handleLinkClick('/private', 'Private Banking')}
                        >
                          <div className="flex items-center space-x-2">
                            <Crown className="h-4 w-4 text-brand-600 group-hover:scale-110 transition-transform" />
                            <div className="text-sm font-medium text-brand-800 group-hover:text-brand-600 transition-colors">Private Banking</div>
                          </div>
                        </NavigationMenuLink>
                      </div>
                      <div className="space-y-3">
                        <h4 className="font-medium text-brand-800">Market Access</h4>
                        {['Global Markets', 'Forex Trading', 'Commodities', 'Cryptocurrency'].map((service) => (
                          <NavigationMenuLink
                            key={service}
                            className="block p-3 rounded-md hover:bg-brand-500/10 transition-all duration-300 cursor-pointer group hover-lift"
                            onClick={() => handleLinkClick(`/markets/${service.toLowerCase().replace(/\s+/g, '-')}`, service)}
                          >
                            <div className="flex items-center space-x-2">
                              <LineChart className="h-4 w-4 text-brand-600 group-hover:scale-110 transition-transform" />
                              <div className="text-sm font-medium text-brand-800 group-hover:text-brand-600 transition-colors">{service}</div>
                            </div>
                          </NavigationMenuLink>
                        ))}
                      </div>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                {/* Digital Banking */}
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="text-brand-800 hover:text-brand-500">
                    Digital
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="grid gap-3 p-6 w-[350px]">
                      <div className="space-y-3">
                        <h4 className="font-medium text-brand-800">Digital Services</h4>
                        {BANKING_SERVICES[2].items.map((service) => (
                          <NavigationMenuLink
                            key={service}
                            className="block p-3 rounded-md hover:bg-brand-500/10 transition-all duration-300 cursor-pointer group hover-lift"
                            onClick={() => handleLinkClick(`/digital/${service.toLowerCase().replace(/\s+/g, '-')}`, service)}
                          >
                            <div className="flex items-center space-x-2">
                              <Smartphone className="h-4 w-4 text-brand-600 group-hover:scale-110 transition-transform" />
                              <div className="text-sm font-medium text-brand-800 group-hover:text-brand-600 transition-colors">{service}</div>
                            </div>
                          </NavigationMenuLink>
                        ))}
                        <NavigationMenuLink
                          className="block p-3 rounded-md hover:bg-brand-500/10 transition-all duration-300 cursor-pointer group hover-lift"
                          onClick={() => handleLinkClick('/digital/api', 'Banking APIs')}
                        >
                          <div className="flex items-center space-x-2">
                            <Globe className="h-4 w-4 text-brand-600 group-hover:scale-110 transition-transform" />
                            <div className="text-sm font-medium text-brand-800 group-hover:text-brand-600 transition-colors">Banking APIs</div>
                          </div>
                        </NavigationMenuLink>
                      </div>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                {/* Resources */}
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="text-brand-800 hover:text-brand-500">
                    Resources
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="grid gap-3 p-6 w-[400px] grid-cols-2">
                      <div className="space-y-3">
                        <h4 className="font-medium text-brand-800">Learning Center</h4>
                        {['Financial Education', 'Market Insights', 'Economic Reports', 'Webinars'].map((item) => (
                          <NavigationMenuLink
                            key={item}
                            className="block p-3 rounded-md hover:bg-brand-500/10 transition-all duration-300 cursor-pointer group hover-lift"
                            onClick={() => handleLinkClick(`/resources/${item.toLowerCase().replace(/\s+/g, '-')}`, item)}
                          >
                            <div className="flex items-center space-x-2">
                              <FileText className="h-4 w-4 text-brand-600 group-hover:scale-110 transition-transform" />
                              <div className="text-sm font-medium text-brand-800 group-hover:text-brand-600 transition-colors">{item}</div>
                            </div>
                          </NavigationMenuLink>
                        ))}
                      </div>
                      <div className="space-y-3">
                        <h4 className="font-medium text-brand-800">Support</h4>
                        {['Help Center', 'Contact Us', 'Security Center', 'Forms & Documents'].map((item) => (
                          <NavigationMenuLink
                            key={item}
                            className="block p-3 rounded-md hover:bg-brand-500/10 transition-all duration-300 cursor-pointer group hover-lift"
                            onClick={() => handleLinkClick(`/support/${item.toLowerCase().replace(/\s+/g, '-')}`, item)}
                          >
                            <div className="flex items-center space-x-2">
                              <HeadphonesIcon className="h-4 w-4 text-brand-600 group-hover:scale-110 transition-transform" />
                              <div className="text-sm font-medium text-brand-800 group-hover:text-brand-600 transition-colors">{item}</div>
                            </div>
                          </NavigationMenuLink>
                        ))}
                      </div>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                {/* About */}
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="text-brand-800 hover:text-brand-500">
                    About
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="grid gap-3 p-6 w-[300px]">
                      <div className="space-y-3">
                        <h4 className="font-medium text-brand-800">Company</h4>
                        {['Our Story', 'Leadership Team', 'Global Presence', 'Awards & Recognition'].map((item) => (
                          <NavigationMenuLink
                            key={item}
                            className="block p-3 rounded-md hover:bg-brand-500/10 transition-all duration-300 cursor-pointer group hover-lift"
                            onClick={() => handleLinkClick(`/about/${item.toLowerCase().replace(/\s+/g, '-')}`, item)}
                          >
                            <div className="flex items-center space-x-2">
                              <Award className="h-4 w-4 text-brand-600 group-hover:scale-110 transition-transform" />
                              <div className="text-sm font-medium text-brand-800 group-hover:text-brand-600 transition-colors">{item}</div>
                            </div>
                          </NavigationMenuLink>
                        ))}
                        <NavigationMenuLink
                          className="block p-3 rounded-md hover:bg-brand-500/10 transition-all duration-300 cursor-pointer group hover-lift"
                          onClick={() => handleLinkClick('/careers', 'Careers')}
                        >
                          <div className="flex items-center space-x-2">
                            <Users className="h-4 w-4 text-brand-600 group-hover:scale-110 transition-transform" />
                            <div className="text-sm font-medium text-brand-800 group-hover:text-brand-600 transition-colors">Careers</div>
                          </div>
                        </NavigationMenuLink>
                        <NavigationMenuLink
                          className="block p-3 rounded-md hover:bg-brand-500/10 transition-all duration-300 cursor-pointer group hover-lift"
                          onClick={() => handleLinkClick('/investor-relations', 'Investor Relations')}
                        >
                          <div className="flex items-center space-x-2">
                            <TrendingUp className="h-4 w-4 text-brand-600 group-hover:scale-110 transition-transform" />
                            <div className="text-sm font-medium text-brand-800 group-hover:text-brand-600 transition-colors">Investor Relations</div>
                          </div>
                        </NavigationMenuLink>
                      </div>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                {/* Dashboard - New Item */}
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="text-brand-800 hover:text-brand-500">
                    Dashboard
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="p-4 w-[220px]">
                      <NavigationMenuLink
                        className="block p-3 rounded-md hover:bg-brand-500/10 transition-all duration-300 cursor-pointer group hover-lift"
                        onClick={() => handleLinkClick('/dashboard', 'Dashboard')}
                      >
                        <div className="flex items-center space-x-2">
                          <LineChart className="h-4 w-4 text-brand-600 group-hover:scale-110 transition-transform" />
                          <div className="text-sm font-medium text-brand-800 group-hover:text-brand-600 transition-colors">Main Dashboard</div>
                        </div>
                      </NavigationMenuLink>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
            </div>
          </div>

          {/* Right Side - Action Buttons */}
          <div className="flex items-center space-x-4 flex-shrink-0">
            {/* Search Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowSearch(!showSearch)}
              className="text-brand-800 hover:text-brand-500 hidden md:flex"
            >
              <Search className="h-4 w-4" />
            </Button>

            {/* Currency Selector */}
            <div className="hidden lg:flex items-center space-x-2 px-3 py-2 rounded-lg border border-brand-500/20 bg-white text-sm">
              <Globe className="h-4 w-4 text-brand-600" />
              <span className="font-medium text-brand-800">🇺🇸 USD</span>
            </div>

            {/* Login Button */}
            <div className="relative group">
              <Button
                className="btn-banking-gold flex items-center space-x-2 hover-glow text-sm px-4 py-2"
              >
                <Shield className="h-4 w-4" />
                <span className="hidden sm:inline">Secure Login</span>
                <span className="sm:hidden">Login</span>
                <ChevronDown className="h-4 w-4" />
              </Button>

              <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-floating border border-brand-500/20 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 card-banking">
                <div className="p-6 space-y-4">
                  <div className="text-center border-b border-brand-500/20 pb-4">
                    <h4 className="font-semibold text-brand-800 text-lg">Access Your Account</h4>
                    <p className="text-sm text-brand-700/70 mt-1">Choose your banking platform</p>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    {Object.values(ACCOUNT_TYPES).map((accountType) => (
                      <button
                        key={accountType.id}
                        onClick={() => onAccountLogin(accountType.id)}
                        className="p-4 rounded-lg hover:bg-brand-500/10 transition-all duration-300 text-left group hover-lift border border-transparent hover:border-brand-500/30"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: `${accountType.mainColor}20` }}>
                            {accountType.id === 'personal' && <Users className="h-4 w-4" style={{ color: accountType.mainColor }} />}
                            {accountType.id === 'business' && <Briefcase className="h-4 w-4" style={{ color: accountType.mainColor }} />}
                            {accountType.id === 'corporate' && <Building className="h-4 w-4" style={{ color: accountType.mainColor }} />}
                            {accountType.id === 'private' && <Award className="h-4 w-4" style={{ color: accountType.mainColor }} />}
                          </div>
                          <div>
                            <div className="font-medium text-sm text-brand-800 group-hover:text-brand-600 transition-colors">
                              {accountType.name}
                            </div>
                            <div className="text-xs text-brand-700/70">{accountType.description}</div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>

                  <div className="border-t border-brand-500/20 pt-4 space-y-2">
                    <button
                      onClick={() => handleLinkClick('/demo', 'Request Demo')}
                      className="w-full text-center py-2 text-sm text-brand-600 hover:text-brand-800 transition-colors"
                    >
                      Request Demo Account
                    </button>
                    <button
                      onClick={() => handleLinkClick('/help', 'Need Help')}
                      className="w-full text-center py-2 text-sm text-brand-700/70 hover:text-brand-600 transition-colors"
                    >
                      Need Help Logging In?
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Open Account Button */}
            <Button
              className="btn-banking hover-glow animate-pulse-gold"
              onClick={() => handleLinkClick('/open-account', 'Open Account')}
            >
              <CreditCard className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Open Account</span>
              <span className="sm:hidden">Account</span>
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

        {/* Search Bar - Appears when search button is clicked */}
        {showSearch && (
          <div className="absolute top-full left-0 right-0 bg-white border-b border-brand-500/20 shadow-lg z-50 animate-slide-down">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
              <div className="relative max-w-md mx-auto">
                <input
                  type="text"
                  placeholder="Search banking services, products, or help..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-3 pl-10 border border-brand-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500"
                  autoFocus
                />
                <Search className="absolute left-3 top-3.5 h-4 w-4 text-brand-700/70" />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowSearch(false)}
                  className="absolute right-2 top-2"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Enhanced Mobile Menu */}
      {isMobileMenuOpen && (
  <div className="lg:hidden absolute top-full left-0 right-0 bg-white border-b border-brand-500/20 shadow-floating z-40 animate-slide-up">
          <div className="px-4 py-6 space-y-6">
            {/* Search in Mobile */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search banking services..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 border border-brand-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500"
              />
              <Search className="absolute right-3 top-3.5 h-4 w-4 text-banking-gray" />
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold text-brand-800 text-lg border-b border-brand-500/20 pb-2">Banking Solutions</h4>
              <div className="grid grid-cols-2 gap-3">
                {Object.values(ACCOUNT_TYPES).map((accountType) => (
                  <button
                    key={accountType.id}
                    onClick={() => {
                      onAccountLogin(accountType.id);
                      setIsMobileMenuOpen(false);
                    }}
                    className="p-3 rounded-lg hover:bg-banking-gold/10 transition-all duration-300 text-left border border-transparent hover:border-banking-gold/30 hover-lift"
                  >
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ backgroundColor: `${accountType.mainColor}20` }}>
                        {accountType.id === 'personal' && <Users className="h-3 w-3" style={{ color: accountType.mainColor }} />}
                        {accountType.id === 'business' && <Briefcase className="h-3 w-3" style={{ color: accountType.mainColor }} />}
                        {accountType.id === 'corporate' && <Building className="h-3 w-3" style={{ color: accountType.mainColor }} />}
                        {accountType.id === 'private' && <Award className="h-3 w-3" style={{ color: accountType.mainColor }} />}
                      </div>
                      <div className="font-medium text-sm text-banking-dark">
                        {accountType.name}
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              {/* Corporate Banking Features Dropdown */}
              <div className="space-y-2">
                <h4 className="font-semibold text-brand-800">Corporate Banking Features</h4>
                <div className="grid grid-cols-1 gap-1">
                  {ACCOUNT_TYPES.corporate.features.map((feature) => (
                    <button
                      key={feature}
                      onClick={() => {
                        handleLinkClick(`/corporate/${feature.toLowerCase().replace(/\s+/g, '-')}`, feature);
                        setIsMobileMenuOpen(false);
                      }}
                      className="flex items-center space-x-2 p-2 rounded-md hover:bg-brand-500/10 transition-colors"
                    >
                      <Building className="h-4 w-4 text-brand-600" />
                      <span className="text-sm text-brand-800">{feature}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Private Banking Features Dropdown */}
              <div className="space-y-2">
                <h4 className="font-semibold text-brand-800">Private Banking Features</h4>
                <div className="grid grid-cols-1 gap-1">
                  {ACCOUNT_TYPES.private.features.map((feature) => (
                    <button
                      key={feature}
                      onClick={() => {
                        handleLinkClick(`/private/${feature.toLowerCase().replace(/\s+/g, '-')}`, feature);
                        setIsMobileMenuOpen(false);
                      }}
                      className="flex items-center space-x-2 p-2 rounded-md hover:bg-brand-500/10 transition-colors"
                    >
                      <Award className="h-4 w-4 text-brand-600" />
                      <span className="text-sm text-brand-800">{feature}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Quick Links */}
              <div className="space-y-3">
                <h4 className="font-semibold text-brand-800">Quick Links</h4>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { name: 'ATM Locator', icon: MapPin, href: '/locations' },
                    { name: 'Rates', icon: TrendingUp, href: '/rates' },
                    { name: 'Support', icon: HeadphonesIcon, href: '/support' },
                    { name: 'Careers', icon: Users, href: '/careers' }
                  ].map((link) => (
                    <button
                      key={link.name}
                      onClick={() => {
                        handleLinkClick(link.href, link.name);
                        setIsMobileMenuOpen(false);
                      }}
                      className="flex items-center space-x-2 p-2 rounded-md hover:bg-brand-500/10 transition-colors"
                    >
                      <link.icon className="h-4 w-4 text-brand-600" />
                      <span className="text-sm text-brand-800">{link.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-brand-500/20 space-y-3">
              <Button
                className="btn-banking w-full hover-glow"
                onClick={() => {
                  handleLinkClick('/open-account', 'Open Account');
                  setIsMobileMenuOpen(false);
                }}
              >
                <CreditCard className="h-4 w-4 mr-2" />
                Open Account
              </Button>
              <div className="text-center">
                <button
                  onClick={() => {
                    handleLinkClick('/demo', 'Request Demo');
                    setIsMobileMenuOpen(false);
                  }}
                  className="text-sm text-brand-600 hover:text-brand-800 transition-colors"
                >
                  Request Demo Account
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

