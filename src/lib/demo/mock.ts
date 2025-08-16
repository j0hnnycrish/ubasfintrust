// Frontend-only demo mode: in-memory mock data and helpers
export type DemoUser = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  accountType: 'personal' | 'business' | 'corporate' | 'private';
  phone?: string;
  isVerified?: boolean;
  kycStatus?: 'pending' | 'approved' | 'rejected';
};

export type DemoAccount = {
  id: string;
  userId: string;
  accountNumber: string;
  accountType: 'checking' | 'savings' | 'business' | 'investment' | 'loan';
  balance: number;
  availableBalance: number;
  currency: string;
  status: 'active' | 'inactive' | 'suspended' | 'closed';
  createdAt: string;
};

export type DemoTransaction = {
  id: string;
  fromAccountId?: string;
  toAccountId?: string;
  amount: number;
  currency: string;
  type: 'transfer' | 'deposit' | 'withdrawal' | 'payment' | 'fee' | 'interest';
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled' | 'reversed';
  description?: string;
  reference: string;
  createdAt: string;
  processedAt?: string;
};

const uid = () => Math.random().toString(36).slice(2);
const now = () => new Date().toISOString();

type DB = {
  users: Record<string, DemoUser & { password: string }>;
  accounts: Record<string, DemoAccount>;
  transactions: Record<string, DemoTransaction>;
};

const seedUserId = uid();

const demoDB: DB = {
  users: {
    [seedUserId]: {
      id: seedUserId,
      email: 'demo.user@example.com',
      firstName: 'Demo',
      lastName: 'User',
      accountType: 'personal',
      phone: '+10000000000',
      isVerified: true,
      kycStatus: 'approved',
      password: 'Demo@12345'
    }
  },
  accounts: {},
  transactions: {}
};

// Seed an initial account
(() => {
  const accId = uid();
  demoDB.accounts[accId] = {
    id: accId,
    userId: seedUserId,
    accountNumber: '100' + String(Math.floor(Math.random() * 1e9)).padStart(9, '0'),
    accountType: 'checking',
    balance: 52340.5,
    availableBalance: 51875.5,
    currency: 'USD',
    status: 'active',
    createdAt: now()
  };
})();

export const DemoStore = {
  createUser(email: string, password: string, firstName: string, lastName: string, accountType: DemoUser['accountType']): DemoUser {
    const id = uid();
    (demoDB.users as any)[id] = { id, email, firstName, lastName, accountType, password } as any;
    // Auto-create an account
    const accId = uid();
    demoDB.accounts[accId] = {
      id: accId,
      userId: id,
      accountNumber: '100' + String(Math.floor(Math.random() * 1e9)).padStart(9, '0'),
      accountType: accountType === 'business' ? 'business' : 'checking',
      balance: 1000,
      availableBalance: 1000,
      currency: 'USD',
      status: 'active',
      createdAt: now()
    };
    return (demoDB.users as any)[id];
  },

  login(email: string, password: string): DemoUser | null {
    const user = Object.values(demoDB.users).find((u: any) => u.email === email && u.password === password) as any;
    if (!user) return null;
    const { password: _p, ...safe } = user as any;
    return safe as DemoUser;
  },

  getUserByEmail(email: string): DemoUser | null {
    const user = Object.values(demoDB.users).find((u: any) => u.email === email) as any;
    if (!user) return null;
    const { password: _p, ...safe } = user as any;
    return safe as DemoUser;
  },

  getAccounts(userId: string): DemoAccount[] {
    return Object.values(demoDB.accounts).filter(a => a.userId === userId);
  },

  getTransactions(accountId: string, limit = 20): DemoTransaction[] {
    return Object.values(demoDB.transactions)
      .filter(t => t.fromAccountId === accountId || t.toAccountId === accountId)
      .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))
      .slice(0, limit);
  },

  transfer(fromAccountId: string, toAccountNumber: string, amount: number, description?: string) {
    const from = demoDB.accounts[fromAccountId];
    if (!from) throw new Error('Source account not found');
    if (from.availableBalance < amount) throw new Error('Insufficient funds');
    // find destination
    const to = Object.values(demoDB.accounts).find(a => a.accountNumber === toAccountNumber);
    const txId = uid();
    const ref = 'TX' + Math.random().toString().slice(2, 10);
    from.balance -= amount;
    from.availableBalance -= amount;
    if (to) {
      (to as any).balance += amount;
      (to as any).availableBalance += amount;
    }
    demoDB.transactions[txId] = {
      id: txId,
      fromAccountId,
      toAccountId: (to as any)?.id,
      amount,
      currency: 'USD',
      type: 'transfer',
      status: 'completed',
      description: description || 'Demo transfer',
      reference: ref,
      createdAt: now(),
      processedAt: now()
    };
    return { reference: ref, amount, fee: 0 };
  }
};
