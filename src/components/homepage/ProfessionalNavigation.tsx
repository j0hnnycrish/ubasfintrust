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
import bankingLogo from '@/assets/banking-logo.jpg';

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
    <nav className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
      {/* Main Navigation */}
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-16 w-full">

          {/* Logo and Brand - Extreme Left */}
          <div className="flex items-center space-x-3 cursor-pointer flex-shrink-0" onClick={() => navigate('/')}>
            <img
              src={bankingLogo}
              alt="UBAS Financial Trust"
              className="w-10 h-10 rounded-full shadow-md"
            />
            <div className="hidden sm:block">
              <h1 className="text-lg font-bold text-gray-900">UBAS FINANCIAL TRUST</h1>
              <p className="text-xs text-gray-600">Future Forward Banking</p>
            </div>
          </div>

          {/* Desktop Navigation - Center */}
          <div className="hidden lg:flex items-center justify-center flex-1 mx-8">
            {navigationItems.map((item) => (
              <div key={item.label} className="relative group">
                {item.subItems ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button 
                        variant="ghost" 
                        className="text-gray-700 hover:text-yellow-600 font-medium flex items-center space-x-1"
                      >
                        <span>{item.label}</span>
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56">
                      <DropdownMenuLabel>{item.description}</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      {item.subItems.map((subItem) => (
                        <DropdownMenuItem 
                          key={subItem.name}
                          onClick={() => handleNavigation(subItem.href)}
                          className="cursor-pointer"
                        >
                          {subItem.name}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <Button 
                    variant="ghost" 
                    onClick={() => handleNavigation(item.href)}
                    className="text-gray-700 hover:text-yellow-600 font-medium"
                  >
                    {item.label}
                  </Button>
                )}
              </div>
            ))}
          </div>

          {/* Right Side Actions - Extreme Right */}
          <div className="flex items-center space-x-4 flex-shrink-0">
            
            {/* Search */}
            <form onSubmit={handleSearch} className="hidden md:flex items-center">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 w-64 border-gray-300 focus:border-yellow-500 focus:ring-yellow-500"
                />
              </div>
            </form>

            {/* Login/User Menu */}
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-2 rounded-lg shadow-md transition-all duration-200 flex items-center space-x-2">
                    <User className="h-4 w-4" />
                    <span className="hidden sm:inline">{user?.fullName}</span>
                    <span className="sm:hidden">Account</span>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                  <DropdownMenuLabel>
                    <div>
                      <div className="font-medium">{user?.fullName}</div>
                      <div className="text-xs text-gray-500">{user?.accountNumber}</div>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate('/dashboard')} className="cursor-pointer">
                    <User className="h-4 w-4 mr-2" />
                    Dashboard
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/profile')} className="cursor-pointer">
                    <Settings className="h-4 w-4 mr-2" />
                    Profile Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600">
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button className="bg-yellow-600 hover:bg-yellow-700 text-white font-semibold px-6 py-2 rounded-lg shadow-md transition-all duration-200 flex items-center space-x-2">
                    <Shield className="h-4 w-4" />
                    <span>Online Banking</span>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                  <DropdownMenuLabel>Secure Login</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => handleLoginClick('personal')} className="cursor-pointer">
                    <User className="h-4 w-4 mr-2" />
                    Personal Banking
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleLoginClick('business')} className="cursor-pointer">
                    <Building className="h-4 w-4 mr-2" />
                    Business Banking
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleLoginClick('corporate')} className="cursor-pointer">
                    <Building className="h-4 w-4 mr-2" />
                    Corporate Banking
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleLoginClick('private')} className="cursor-pointer">
                    <Crown className="h-4 w-4 mr-2" />
                    Private Banking
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {/* Open Account Button */}
            {!isAuthenticated && (
              <Button
                onClick={() => navigate('/open-account')}
                className="bg-gray-900 hover:bg-gray-800 text-white font-semibold px-6 py-2 rounded-lg shadow-md transition-all duration-200 flex items-center space-x-2"
              >
                <CreditCard className="h-4 w-4" />
                <span className="hidden sm:inline">Open Account</span>
              </Button>
            )}

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
        <div className="lg:hidden bg-white border-t border-gray-200 shadow-lg">
          <div className="px-4 py-6 space-y-4">
            
            {/* Mobile Search */}
            <form onSubmit={handleSearch} className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full border-gray-300 focus:border-yellow-500 focus:ring-yellow-500"
                />
              </div>
            </form>

            {/* Mobile Navigation Items */}
            {navigationItems.map((item) => (
              <div key={item.label} className="space-y-2">
                <Button 
                  variant="ghost" 
                  onClick={() => handleNavigation(item.href)}
                  className="w-full justify-start text-gray-700 hover:text-yellow-600 font-medium"
                >
                  <item.icon className="h-4 w-4 mr-3" />
                  {item.label}
                </Button>
                {item.subItems && (
                  <div className="ml-6 space-y-1">
                    {item.subItems.map((subItem) => (
                      <Button
                        key={subItem.name}
                        variant="ghost"
                        onClick={() => handleNavigation(subItem.href)}
                        className="w-full justify-start text-sm text-gray-600 hover:text-yellow-600"
                      >
                        {subItem.name}
                      </Button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {/* Mobile Login Options */}
            <div className="pt-4 border-t border-gray-200 space-y-2">
              <h4 className="font-semibold text-gray-900 mb-2">Online Banking</h4>
              <Button onClick={() => handleLoginClick('personal')} className="w-full justify-start bg-yellow-600 hover:bg-yellow-700 text-white">
                <User className="h-4 w-4 mr-2" />
                Personal Banking
              </Button>
              <Button onClick={() => handleLoginClick('business')} className="w-full justify-start bg-gray-100 hover:bg-gray-200 text-gray-900">
                <Building className="h-4 w-4 mr-2" />
                Business Banking
              </Button>
            </div>
          </div>
        </div>
      )}



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
