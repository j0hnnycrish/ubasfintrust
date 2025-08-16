import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { LoginModal } from '@/components/auth/LoginModal';
import { RegisterModal } from '@/components/auth/RegisterModal';
import { PasswordResetModal } from '@/components/auth/PasswordResetModal';

import {
  Search,
  User,
  Menu,
  X,
  ChevronDown,
  Shield,
  CreditCard,
  Building,
  Users,
  Crown,
  Globe,
  Phone,
  Mail,
  LogOut,
  Settings
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
// Use a public asset to avoid bundling missing file issues
const bankingLogoUrl = '/placeholder.svg';

export function ProfessionalNavigation() {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showPasswordResetModal, setShowPasswordResetModal] = useState(false);
  const [selectedAccountType, setSelectedAccountType] = useState('personal');

  const navigationItems = [
    {
      label: 'Personal',
      href: '/personal',
      description: 'Personal Banking Services',
      icon: User,
      subItems: [
        { name: 'Savings Account', href: '/personal/savings' },
        { name: 'Current Account', href: '/personal/current' },
        { name: 'Fixed Deposits', href: '/personal/fixed-deposits' },
        { name: 'Loans', href: '/personal/loans' },
        { name: 'Credit Cards', href: '/personal/credit-cards' }
      ]
    },
    {
      label: 'Business',
      href: '/business',
      description: 'Business Banking Solutions',
      icon: Building,
      subItems: [
        { name: 'Business Account', href: '/business/accounts' },
        { name: 'Business Loans', href: '/business/loans' },
        { name: 'Trade Finance', href: '/business/trade-finance' },
        { name: 'Cash Management', href: '/business/cash-management' }
      ]
    },
    {
      label: 'Corporate',
      href: '/corporate',
      description: 'Corporate Banking Services',
      icon: Building,
      subItems: [
        { name: 'Corporate Accounts', href: '/corporate/accounts' },
        { name: 'Treasury Services', href: '/corporate/treasury' },
        { name: 'Investment Banking', href: '/corporate/investment' },
        { name: 'Risk Management', href: '/corporate/risk' }
      ]
    },
    {
      label: 'Private',
      href: '/private',
      description: 'Private Wealth Management',
      icon: Crown,
      subItems: [
        { name: 'Wealth Management', href: '/private/wealth' },
        { name: 'Investment Advisory', href: '/private/advisory' },
        { name: 'Estate Planning', href: '/private/estate' },
        { name: 'Private Banking', href: '/private/banking' }
      ]
    },
    {
      label: 'Digital Banking',
      href: '/digital',
      description: 'Digital Banking Solutions',
      icon: Globe
    },
    {
      label: 'About',
      href: '/about',
      description: 'About UBAS Financial Trust',
      icon: Users
    },
    {
      label: 'Contact',
      href: '/contact',
      description: 'Get in Touch',
      icon: Phone
    }
  ];

  const handleNavigation = (href: string) => {
    navigate(href);
    setIsMobileMenuOpen(false);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleLoginClick = (accountType: string) => {
    setSelectedAccountType(accountType);
    setShowLoginModal(true);
  };

  const handleRegisterClick = () => {
    setShowRegisterModal(true);
  };

  const handleLoginSuccess = () => {
    // Redirect to dashboard after successful login
    navigate('/dashboard');
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      {/* Top Bar */}
      <div className="bg-red-600 text-white py-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Shield className="h-4 w-4" />
                <span>UBAS INTERNET BANKING</span>
              </div>
            </div>
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4" />
                <span>24/7 Customer Care</span>
              </div>
              <button className="flex items-center space-x-2 hover:underline" onClick={() => navigate('/contact')}>
                <Mail className="h-4 w-4" />
                <span>Contact Support</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
  <div className="bg-white border-b border-brand-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Logo */}
            <div className="flex items-center cursor-pointer" onClick={() => navigate('/')}>
              <img
                src={bankingLogoUrl}
                alt="UBAS Financial Trust"
                className="w-12 h-12 rounded-full"
              />
              <div className="ml-3">
                <h1 className="text-2xl font-bold text-red-600">UBAS</h1>
                <p className="text-xs text-brand-600 -mt-1">UBAS FINANCIAL TRUST</p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-8">
              <div className="relative group">
                <button className="flex items-center space-x-1 text-brand-700 hover:text-brand-600 font-medium">
                  <span>BANKING</span>
                  <ChevronDown className="h-4 w-4" />
                </button>
                <div className="absolute top-full left-0 w-64 bg-white shadow-lg border rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="p-4">
                    <div className="space-y-2">
                      <a href="/personal" className="block px-3 py-2 text-sm text-brand-700 hover:bg-brand-50 hover:text-brand-600 rounded">Personal Banking</a>
                      <a href="/business" className="block px-3 py-2 text-sm text-brand-700 hover:bg-brand-50 hover:text-brand-600 rounded">Business Banking</a>
                      <a href="/corporate" className="block px-3 py-2 text-sm text-brand-700 hover:bg-brand-50 hover:text-brand-600 rounded">Corporate Banking</a>
                      <a href="/private" className="block px-3 py-2 text-sm text-brand-700 hover:bg-brand-50 hover:text-brand-600 rounded">Private Banking</a>
                    </div>
                  </div>
                </div>
              </div>

              <div className="relative group">
                <button className="flex items-center space-x-1 text-brand-700 hover:text-brand-600 font-medium">
                  <span>ABOUT</span>
                  <ChevronDown className="h-4 w-4" />
                </button>
                <div className="absolute top-full left-0 w-64 bg-white shadow-lg border rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="p-4">
                    <div className="space-y-2">
                      <a href="/about" className="block px-3 py-2 text-sm text-brand-700 hover:bg-brand-50 hover:text-brand-600 rounded">About Us</a>
                      <a href="/leadership" className="block px-3 py-2 text-sm text-brand-700 hover:bg-brand-50 hover:text-brand-600 rounded">Leadership</a>
                      <a href="/careers" className="block px-3 py-2 text-sm text-brand-700 hover:bg-brand-50 hover:text-brand-600 rounded">Careers</a>
                      <a href="/awards" className="block px-3 py-2 text-sm text-brand-700 hover:bg-brand-50 hover:text-brand-600 rounded">Awards</a>
                    </div>
                  </div>
                </div>
              </div>

              <div className="relative group">
                <button className="flex items-center space-x-1 text-brand-700 hover:text-brand-600 font-medium">
                  <span>INVESTORS</span>
                  <ChevronDown className="h-4 w-4" />
                </button>
                <div className="absolute top-full left-0 w-72 bg-white shadow-lg border rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="p-4">
                    <div className="space-y-2">
                      <a href="/investors" className="block px-3 py-2 text-sm text-brand-700 hover:bg-brand-50 hover:text-brand-600 rounded">Overview</a>
                      <a href="/investors/reports" className="block px-3 py-2 text-sm text-brand-700 hover:bg-brand-50 hover:text-brand-600 rounded">Financial Reports</a>
                      <a href="/investors/governance" className="block px-3 py-2 text-sm text-brand-700 hover:bg-brand-50 hover:text-brand-600 rounded">Corporate Governance</a>
                      <a href="/investors/announcements" className="block px-3 py-2 text-sm text-brand-700 hover:bg-brand-50 hover:text-brand-600 rounded">Announcements</a>
                      <a href="/investors/shareholder" className="block px-3 py-2 text-sm text-brand-700 hover:bg-brand-50 hover:text-brand-600 rounded">Shareholder Services</a>
                    </div>
                  </div>
                </div>
              </div>

              <div className="relative group">
                <button className="flex items-center space-x-1 text-brand-700 hover:text-brand-600 font-medium">
                  <span>MEDIA</span>
                  <ChevronDown className="h-4 w-4" />
                </button>
                <div className="absolute top-full left-0 w-72 bg-white shadow-lg border rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="p-4">
                    <div className="space-y-2">
                      <a href="/media" className="block px-3 py-2 text-sm text-brand-700 hover:bg-brand-50 hover:text-brand-600 rounded">Overview</a>
                      <a href="/media/press" className="block px-3 py-2 text-sm text-brand-700 hover:bg-brand-50 hover:text-brand-600 rounded">Press Releases</a>
                      <a href="/media/news" className="block px-3 py-2 text-sm text-brand-700 hover:bg-brand-50 hover:text-brand-600 rounded">News</a>
                      <a href="/media/brand" className="block px-3 py-2 text-sm text-brand-700 hover:bg-brand-50 hover:text-brand-600 rounded">Brand Assets</a>
                      <a href="/media/contacts" className="block px-3 py-2 text-sm text-brand-700 hover:bg-brand-50 hover:text-brand-600 rounded">Media Contacts</a>
                    </div>
                  </div>
                </div>
              </div>

              <div className="relative group">
                <button className="flex items-center space-x-1 text-brand-700 hover:text-brand-600 font-medium">
                  <span>CSR</span>
                  <ChevronDown className="h-4 w-4" />
                </button>
                <div className="absolute top-full left-0 w-72 bg-white shadow-lg border rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="p-4">
                    <div className="space-y-2">
                      <a href="/csr" className="block px-3 py-2 text-sm text-brand-700 hover:bg-brand-50 hover:text-brand-600 rounded">Overview</a>
                      <a href="/csr/initiatives" className="block px-3 py-2 text-sm text-brand-700 hover:bg-brand-50 hover:text-brand-600 rounded">Initiatives</a>
                      <a href="/csr/reports" className="block px-3 py-2 text-sm text-brand-700 hover:bg-brand-50 hover:text-brand-600 rounded">Reports</a>
                      <a href="/csr/partnerships" className="block px-3 py-2 text-sm text-brand-700 hover:bg-brand-50 hover:text-brand-600 rounded">Partnerships</a>
                      <a href="/csr/volunteering" className="block px-3 py-2 text-sm text-brand-700 hover:bg-brand-50 hover:text-brand-600 rounded">Volunteering</a>
                    </div>
                  </div>
                </div>
              </div>

              <div className="relative group">
                <button className="flex items-center space-x-1 text-brand-700 hover:text-brand-600 font-medium">
                  <span>SUSTAINABILITY</span>
                  <ChevronDown className="h-4 w-4" />
                </button>
                <div className="absolute top-full left-0 w-80 bg-white shadow-lg border rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="p-4">
                    <div className="space-y-2">
                      <a href="/sustainability" className="block px-3 py-2 text-sm text-brand-700 hover:bg-brand-50 hover:text-brand-600 rounded">Overview</a>
                      <a href="/sustainability/strategy" className="block px-3 py-2 text-sm text-brand-700 hover:bg-brand-50 hover:text-brand-600 rounded">ESG Strategy</a>
                      <a href="/sustainability/policies" className="block px-3 py-2 text-sm text-brand-700 hover:bg-brand-50 hover:text-brand-600 rounded">Policies & Standards</a>
                      <a href="/sustainability/reports" className="block px-3 py-2 text-sm text-brand-700 hover:bg-brand-50 hover:text-brand-600 rounded">Reports & Disclosures</a>
                      <a href="/sustainability/impact" className="block px-3 py-2 text-sm text-brand-700 hover:bg-brand-50 hover:text-brand-600 rounded">Impact</a>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-64 pl-10 pr-4 py-2 text-sm border border-brand-300 rounded-md focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-brand-500" />
              </div>

              <Button 
                onClick={() => setShowLoginModal(true)}
                className="bg-red-600 hover:bg-red-700 text-white font-medium px-6 py-2"
              >
                LOGIN
              </Button>

              {/* Mobile menu button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 rounded-md text-brand-700 hover:text-brand-600"
              >
                {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-white border-t border-brand-200/60">
            <div className="px-4 py-4 space-y-4">
              <div className="space-y-2">
                <button className="block w-full text-left text-brand-700 hover:text-brand-600 font-medium">BANKING</button>
                <button className="block w-full text-left text-brand-700 hover:text-brand-600 font-medium">ABOUT</button>
                <div>
                  <button onClick={() => handleNavigation('/investors')} className="block w-full text-left text-brand-700 hover:text-brand-600 font-medium">INVESTORS</button>
                  <div className="pl-4 mt-1 space-y-1 text-sm">
                    <button onClick={() => handleNavigation('/investors/reports')} className="block w-full text-left text-brand-600 hover:text-brand-700">Financial Reports</button>
                    <button onClick={() => handleNavigation('/investors/governance')} className="block w-full text-left text-brand-600 hover:text-brand-700">Corporate Governance</button>
                    <button onClick={() => handleNavigation('/investors/announcements')} className="block w-full text-left text-brand-600 hover:text-brand-700">Announcements</button>
                    <button onClick={() => handleNavigation('/investors/shareholder')} className="block w-full text-left text-brand-600 hover:text-brand-700">Shareholder Services</button>
                  </div>
                </div>
                <div>
                  <button onClick={() => handleNavigation('/media')} className="block w-full text-left text-brand-700 hover:text-brand-600 font-medium">MEDIA</button>
                  <div className="pl-4 mt-1 space-y-1 text-sm">
                    <button onClick={() => handleNavigation('/media/press')} className="block w-full text-left text-brand-600 hover:text-brand-700">Press Releases</button>
                    <button onClick={() => handleNavigation('/media/news')} className="block w-full text-left text-brand-600 hover:text-brand-700">News</button>
                    <button onClick={() => handleNavigation('/media/brand')} className="block w-full text-left text-brand-600 hover:text-brand-700">Brand Assets</button>
                    <button onClick={() => handleNavigation('/media/contacts')} className="block w-full text-left text-brand-600 hover:text-brand-700">Media Contacts</button>
                  </div>
                </div>
                <div>
                  <button onClick={() => handleNavigation('/csr')} className="block w-full text-left text-brand-700 hover:text-brand-600 font-medium">CSR</button>
                  <div className="pl-4 mt-1 space-y-1 text-sm">
                    <button onClick={() => handleNavigation('/csr/initiatives')} className="block w-full text-left text-brand-600 hover:text-brand-700">Initiatives</button>
                    <button onClick={() => handleNavigation('/csr/reports')} className="block w-full text-left text-brand-600 hover:text-brand-700">Reports</button>
                    <button onClick={() => handleNavigation('/csr/partnerships')} className="block w-full text-left text-brand-600 hover:text-brand-700">Partnerships</button>
                    <button onClick={() => handleNavigation('/csr/volunteering')} className="block w-full text-left text-brand-600 hover:text-brand-700">Volunteering</button>
                  </div>
                </div>
                <div>
                  <button onClick={() => handleNavigation('/sustainability')} className="block w-full text-left text-brand-700 hover:text-brand-600 font-medium">SUSTAINABILITY</button>
                  <div className="pl-4 mt-1 space-y-1 text-sm">
                    <button onClick={() => handleNavigation('/sustainability/strategy')} className="block w-full text-left text-brand-600 hover:text-brand-700">ESG Strategy</button>
                    <button onClick={() => handleNavigation('/sustainability/policies')} className="block w-full text-left text-brand-600 hover:text-brand-700">Policies & Standards</button>
                    <button onClick={() => handleNavigation('/sustainability/reports')} className="block w-full text-left text-brand-600 hover:text-brand-700">Reports & Disclosures</button>
                    <button onClick={() => handleNavigation('/sustainability/impact')} className="block w-full text-left text-brand-600 hover:text-brand-700">Impact</button>
                  </div>
                </div>
              </div>
              <Button 
                onClick={() => setShowLoginModal(true)}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-medium"
              >
                LOGIN
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Authentication Modals */}
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onSuccess={handleLoginSuccess}
        onSwitchToRegister={() => {
          setShowLoginModal(false);
          setShowRegisterModal(true);
        }}
        onSwitchToPasswordReset={() => {
          setShowLoginModal(false);
          setShowPasswordResetModal(true);
        }}
        defaultAccountType={selectedAccountType}
      />

      <RegisterModal
        isOpen={showRegisterModal}
        onClose={() => setShowRegisterModal(false)}
        onSuccess={handleLoginSuccess}
        onSwitchToLogin={() => {
          setShowRegisterModal(false);
          setShowLoginModal(true);
        }}
        defaultAccountType={selectedAccountType}
      />

      <PasswordResetModal
        isOpen={showPasswordResetModal}
        onClose={() => setShowPasswordResetModal(false)}
        onBackToLogin={() => {
          setShowPasswordResetModal(false);
          setShowLoginModal(true);
        }}
      />
    </nav>
  );
}
