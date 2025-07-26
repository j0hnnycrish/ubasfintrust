-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enable pgcrypto for additional encryption functions
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create indexes for better performance
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_users_phone ON users(phone);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_users_account_type ON users(account_type);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_users_kyc_status ON users(kyc_status);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_accounts_user_id ON accounts(user_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_accounts_account_number ON accounts(account_number);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_accounts_status ON accounts(status);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_transactions_from_account ON transactions(from_account_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_transactions_to_account ON transactions(to_account_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_transactions_reference ON transactions(reference);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_transactions_status ON transactions(status);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_transactions_created_at ON transactions(created_at);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_cards_account_id ON cards(account_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_cards_card_number ON cards(card_number);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_loans_user_id ON loans(user_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_loans_status ON loans(status);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_audit_logs_action ON audit_logs(action);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at);
