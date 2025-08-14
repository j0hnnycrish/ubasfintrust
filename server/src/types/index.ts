export interface User {
  id: string;
  email: string;
  password_hash: string;
  first_name: string;
  last_name: string;
  phone: string;
  date_of_birth: Date;
  account_type: AccountType;
  kyc_status: KYCStatus;
  is_active: boolean;
  is_verified: boolean;
  two_factor_enabled: boolean;
  two_factor_secret?: string;
  last_login?: Date;
  failed_login_attempts: number;
  locked_until?: Date;
  created_at: Date;
  updated_at: Date;
  onboarding_completed?: boolean;
  onboarding_completed_at?: Date;
  onboarding_version?: number;
}

export interface Account {
  id: string;
  user_id: string;
  account_number: string;
  account_type: BankAccountType;
  balance: number;
  available_balance: number;
  currency: string;
  status: AccountStatus;
  interest_rate?: number;
  overdraft_limit?: number;
  minimum_balance: number;
  created_at: Date;
  updated_at: Date;
}

export interface Transaction {
  id: string;
  from_account_id?: string;
  to_account_id?: string;
  amount: number;
  currency: string;
  type: TransactionType;
  status: TransactionStatus;
  description: string;
  reference: string;
  category: string;
  metadata?: Record<string, any>;
  fee_amount?: number;
  exchange_rate?: number;
  external_reference?: string;
  processed_at?: Date;
  created_at: Date;
  updated_at: Date;
}

export interface Card {
  id: string;
  account_id: string;
  card_number: string;
  card_type: CardType;
  status: CardStatus;
  expiry_date: Date;
  cvv_hash: string;
  daily_limit: number;
  monthly_limit: number;
  is_contactless: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface Loan {
  id: string;
  user_id: string;
  loan_type: LoanType;
  principal_amount: number;
  interest_rate: number;
  term_months: number;
  monthly_payment: number;
  outstanding_balance: number;
  status: LoanStatus;
  purpose: string;
  collateral?: string;
  approved_at?: Date;
  disbursed_at?: Date;
  created_at: Date;
  updated_at: Date;
}

export type AccountType = 'personal' | 'business' | 'corporate' | 'private';
export type BankAccountType = 'checking' | 'savings' | 'business' | 'investment' | 'loan';
export type KYCStatus = 'pending' | 'in_progress' | 'approved' | 'rejected' | 'expired';
export type AccountStatus = 'active' | 'inactive' | 'suspended' | 'closed';
export type TransactionType = 'transfer' | 'deposit' | 'withdrawal' | 'payment' | 'fee' | 'interest' | 'loan_payment' | 'card_payment';
export type TransactionStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled' | 'reversed';
export type CardType = 'debit' | 'credit' | 'prepaid';
export type CardStatus = 'active' | 'inactive' | 'blocked' | 'expired';
export type LoanType = 'personal' | 'mortgage' | 'auto' | 'business' | 'student';
export type LoanStatus = 'pending' | 'approved' | 'disbursed' | 'active' | 'paid_off' | 'defaulted';

import type { Request } from 'express';
// AuthRequest is an alias of Express Request; extra fields are added via module augmentation
export type AuthRequest = Request;

export interface JWTPayload {
  userId: string;
  email: string;
  accountType: AccountType;
  iat: number;
  exp: number;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: string[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface PaginationOptions {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface TransferRequest {
  from_account_id: string;
  to_account_number: string;
  amount: number;
  currency: string;
  description: string;
  recipient_name?: string;
  reference?: string;
}

export interface PaymentRequest {
  account_id: string;
  amount: number;
  currency: string;
  payment_method: 'card' | 'bank_transfer' | 'wallet';
  description: string;
  metadata?: Record<string, any>;
}

export interface KYCDocument {
  id: string;
  user_id: string;
  document_type: string;
  document_number: string;
  file_path: string;
  verification_status: 'pending' | 'verified' | 'rejected';
  verified_at?: Date;
  created_at: Date;
}

export interface AuditLog {
  id: string;
  user_id?: string;
  action: string;
  resource_type: string;
  resource_id?: string;
  old_values?: Record<string, any>;
  new_values?: Record<string, any>;
  ip_address: string;
  user_agent: string;
  created_at: Date;
}

// Module augmentation for Express to include our custom properties on Request
declare module 'express-serve-static-core' {
  interface Request {
    user?: User;
    account?: Account;
    security?: {
      riskLevel: 'low' | 'medium' | 'high' | 'critical';
      fingerprint?: string;
      reasons: string[];
      allowed: boolean;
    };
  }
}
