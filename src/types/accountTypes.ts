export type AccountType = 'personal' | 'business' | 'corporate' | 'private';

export interface AccountTypeConfig {
  id: AccountType;
  name: string;
  description: string;
  features: string[];
  minimumBalance: {
    USD: number;
    EUR: number;
    GBP: number;
    JPY: number;
    CAD: number;
    AUD: number;
    CHF: number;
    SGD: number;
  };
  supportedCurrencies: string[];
  interestRate?: number;
  mainColor: string;
  loginPath: string;
  tier: 'standard' | 'premium' | 'platinum' | 'diamond';
}

export const ACCOUNT_TYPES: Record<AccountType, AccountTypeConfig> = {
  personal: {
    id: 'personal',
    name: 'Global Personal Banking',
    description: 'Multi-currency banking solutions for global individuals',
    features: [
      'Multi-Currency Wallets (8 Major Currencies)',
      'Global Debit & Credit Cards',
      'International Wire Transfers',
      'Personal Investment Portfolio',
      'Mobile & Web Banking',
      '24/7 Global Customer Support',
      'Real-time Exchange Rates',
      'Contactless Payments Worldwide'
    ],
    minimumBalance: {
      USD: 1000,
      EUR: 900,
      GBP: 800,
      JPY: 150000,
      CAD: 1300,
      AUD: 1500,
      CHF: 950,
      SGD: 1400
    },
    supportedCurrencies: ['USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD', 'CHF', 'SGD'],
    interestRate: 5.5,
    mainColor: '#E53935',
    loginPath: '/login/personal',
    tier: 'standard'
  },
  business: {
    id: 'business',
    name: 'Global Business Banking',
    description: 'Comprehensive multi-currency solutions for growing businesses worldwide',
    features: [
      'Multi-Currency Business Accounts',
      'International Trade Finance',
      'Global Equipment Financing',
      'Cross-Border Cash Management',
      'International Payroll Services',
      'Corporate Credit Cards',
      'FX Risk Management',
      'API Banking Integration',
      'Bulk Payment Processing'
    ],
    minimumBalance: {
      USD: 50000,
      EUR: 45000,
      GBP: 40000,
      JPY: 7500000,
      CAD: 65000,
      AUD: 75000,
      CHF: 47500,
      SGD: 70000
    },
    supportedCurrencies: ['USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD', 'CHF', 'SGD'],
    interestRate: 6.0,
    mainColor: '#D32F2F',
    loginPath: '/login/business',
    tier: 'premium'
  },
  corporate: {
    id: 'corporate',
    name: 'Global Corporate Banking',
    description: 'Advanced multi-currency financial solutions for multinational enterprises',
    features: [
      'Global Corporate Accounts',
      'Multi-Currency Treasury Management',
      'International Foreign Exchange',
      'Structured Finance Solutions',
      'Corporate Advisory Services',
      'Capital Markets Access',
      'Global Cash Pooling',
      'Trade Finance & Letters of Credit',
      'Derivatives & Hedging',
      'ESG Financing Solutions'
    ],
    minimumBalance: {
      USD: 5000000,
      EUR: 4500000,
      GBP: 4000000,
      JPY: 750000000,
      CAD: 6500000,
      AUD: 7500000,
      CHF: 4750000,
      SGD: 7000000
    },
    supportedCurrencies: ['USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD', 'CHF', 'SGD'],
    interestRate: 7.0,
    mainColor: '#C62828',
    loginPath: '/login/corporate',
    tier: 'platinum'
  },
  private: {
    id: 'private',
    name: 'Global Private Banking',
    description: 'Exclusive multi-currency wealth management for ultra-high-net-worth individuals',
    features: [
      'Global Private Wealth Management',
      'Multi-Currency Investment Advisory',
      'International Estate Planning',
      'Exclusive Concierge Banking Services',
      'Dedicated Global Relationship Manager',
      'Premium Alternative Investments',
      'Art & Collectibles Financing',
      'Yacht & Aircraft Financing',
      'Family Office Services',
      'Cross-Border Tax Planning',
      'Philanthropic Advisory'
    ],
    minimumBalance: {
      USD: 10000000,
      EUR: 9000000,
      GBP: 8000000,
      JPY: 1500000000,
      CAD: 13000000,
      AUD: 15000000,
      CHF: 9500000,
      SGD: 14000000
    },
    supportedCurrencies: ['USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD', 'CHF', 'SGD'],
    interestRate: 8.0,
    mainColor: '#D4AF37',
    loginPath: '/login/private',
    tier: 'diamond'
  }
};

export const BANKING_PRODUCTS = [
  {
    category: 'Global Accounts',
    items: [
      { name: 'Multi-Currency Savings', description: 'High-yield savings in 8 major currencies' },
      { name: 'Global Current Account', description: 'Seamless worldwide transactions' },
      { name: 'International Fixed Deposits', description: 'Competitive rates across currencies' },
      { name: 'Currency Exchange Wallets', description: 'Real-time FX with optimal rates' }
    ]
  },
  {
    category: 'Global Cards',
    items: [
      { name: 'World Elite Debit Cards', description: 'Global access with premium benefits' },
      { name: 'International Credit Cards', description: 'Multi-currency spending worldwide' },
      { name: 'Travel Prepaid Cards', description: 'Secure international travel companion' },
      { name: 'Corporate Cards', description: 'Global business expense management' }
    ]
  },
  {
    category: 'International Financing',
    items: [
      { name: 'Global Personal Loans', description: 'Flexible financing in multiple currencies' },
      { name: 'International Auto Finance', description: 'Vehicle financing worldwide' },
      { name: 'Global Mortgage Solutions', description: 'International property financing' },
      { name: 'Cross-Border Business Loans', description: 'Fuel international business growth' }
    ]
  },
  {
    category: 'Digital Banking Excellence',
    items: [
      { name: 'Global Mobile Banking', description: 'Award-winning app with multi-currency support' },
      { name: 'Web Banking Platform', description: 'Secure online banking with real-time FX' },
      { name: 'API Banking Solutions', description: 'Enterprise-grade banking integration' },
      { name: 'Instant Global Transfers', description: 'Real-time international money movement' }
    ]
  }
];

export const BANKING_SERVICES = [
  {
    category: 'Global Personal Services',
    items: [
      'Multi-Currency Account Opening',
      'International Wire Transfers',
      'Global Bill Payment Solutions',
      'Cross-Border Investment Advisory',
      'International Financial Planning',
      'Global Insurance & Protection',
      'Currency Exchange Services',
      'Travel Banking Solutions'
    ]
  },
  {
    category: 'International Business Services',
    items: [
      'Global Cash Management',
      'International Payroll Services',
      'Cross-Border Trade Finance',
      'Global Equipment Financing',
      'Multi-Currency Working Capital',
      'International Business Advisory',
      'FX Risk Management',
      'Supply Chain Financing'
    ]
  },
  {
    category: 'Digital Excellence Services',
    items: [
      'Global Mobile Banking Platform',
      'Multi-Currency Internet Banking',
      'Enterprise API Banking',
      'International Bulk Payments',
      'Global Collection Services',
      'Worldwide Point of Sale',
      'Real-Time FX Trading',
      'Blockchain Settlement Services'
    ]
  }
];