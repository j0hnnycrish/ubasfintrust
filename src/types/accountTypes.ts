export type AccountType = 'personal' | 'business' | 'corporate' | 'private';

export interface AccountTypeConfig {
  id: AccountType;
  name: string;
  description: string;
  features: string[];
  minimumBalance: number;
  currency: string;
  interestRate?: number;
  mainColor: string;
  loginPath: string;
}

export const ACCOUNT_TYPES: Record<AccountType, AccountTypeConfig> = {
  personal: {
    id: 'personal',
    name: 'Personal Banking',
    description: 'Individual banking solutions for your everyday needs',
    features: [
      'Savings & Current Accounts',
      'Debit & Credit Cards',
      'Personal Loans',
      'Investment Products',
      'Mobile Banking',
      '24/7 Customer Support'
    ],
    minimumBalance: 1000,
    currency: 'NGN',
    interestRate: 5.5,
    mainColor: '#3B82F6',
    loginPath: '/login/personal'
  },
  business: {
    id: 'business',
    name: 'Business Banking',
    description: 'Comprehensive banking solutions for growing businesses',
    features: [
      'Business Current Accounts',
      'Trade Finance',
      'Equipment Financing',
      'Cash Management',
      'Payroll Services',
      'Business Credit Cards'
    ],
    minimumBalance: 50000,
    currency: 'NGN',
    interestRate: 6.0,
    mainColor: '#10B981',
    loginPath: '/login/business'
  },
  corporate: {
    id: 'corporate',
    name: 'Corporate Banking',
    description: 'Advanced financial solutions for large enterprises',
    features: [
      'Corporate Accounts',
      'Treasury Management',
      'Foreign Exchange',
      'Structured Finance',
      'Corporate Advisory',
      'Capital Markets'
    ],
    minimumBalance: 5000000,
    currency: 'NGN',
    interestRate: 7.0,
    mainColor: '#8B5CF6',
    loginPath: '/login/corporate'
  },
  private: {
    id: 'private',
    name: 'Private Banking',
    description: 'Exclusive wealth management for high-net-worth individuals',
    features: [
      'Private Wealth Management',
      'Investment Advisory',
      'Estate Planning',
      'Exclusive Banking Services',
      'Dedicated Relationship Manager',
      'Premium Investment Products'
    ],
    minimumBalance: 10000000,
    currency: 'NGN',
    interestRate: 8.0,
    mainColor: '#D4AF37',
    loginPath: '/login/private'
  }
};

export const BANKING_PRODUCTS = [
  {
    category: 'Accounts',
    items: [
      { name: 'Savings Account', description: 'High-yield savings with competitive rates' },
      { name: 'Current Account', description: 'Perfect for everyday transactions' },
      { name: 'Fixed Deposit', description: 'Earn up to 16% per annum' },
      { name: 'Domiciliary Account', description: 'Multi-currency account solutions' }
    ]
  },
  {
    category: 'Cards',
    items: [
      { name: 'Debit Cards', description: 'Global access to your funds' },
      { name: 'Credit Cards', description: 'Flexible payment solutions' },
      { name: 'Prepaid Cards', description: 'Convenient spending control' }
    ]
  },
  {
    category: 'Loans',
    items: [
      { name: 'Personal Loans', description: 'Quick access to funds' },
      { name: 'Auto Loans', description: 'Drive your dream car today' },
      { name: 'Mortgage', description: 'Own your home with ease' },
      { name: 'Business Loans', description: 'Fuel your business growth' }
    ]
  },
  {
    category: 'Digital Banking',
    items: [
      { name: 'Mobile Banking', description: 'Bank on the go' },
      { name: 'Internet Banking', description: 'Secure online banking' },
      { name: 'USSD Banking', description: 'Banking via phone codes' }
    ]
  }
];

export const BANKING_SERVICES = [
  {
    category: 'Personal Services',
    items: [
      'Account Opening',
      'Fund Transfers',
      'Bill Payments',
      'Investment Advisory',
      'Financial Planning',
      'Insurance Services'
    ]
  },
  {
    category: 'Business Services',
    items: [
      'Cash Management',
      'Payroll Services',
      'Trade Finance',
      'Equipment Financing',
      'Working Capital',
      'Business Advisory'
    ]
  },
  {
    category: 'Digital Services',
    items: [
      'Mobile Banking',
      'Internet Banking',
      'API Banking',
      'Bulk Payments',
      'Collection Services',
      'Point of Sale'
    ]
  }
];