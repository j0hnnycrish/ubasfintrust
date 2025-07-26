-- UBAS Financial Trust Database Schema
-- Production-ready database structure for live deployment

-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(20) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    middle_name VARCHAR(100),
    last_name VARCHAR(100) NOT NULL,
    date_of_birth DATE NOT NULL,
    ssn_encrypted VARCHAR(255) NOT NULL,
    phone_number VARCHAR(20) NOT NULL,
    citizenship VARCHAR(50) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending_verification',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP,
    failed_login_attempts INTEGER DEFAULT 0,
    account_locked_until TIMESTAMP,
    two_factor_enabled BOOLEAN DEFAULT false,
    kyc_status VARCHAR(20) DEFAULT 'pending',
    kyc_completed_at TIMESTAMP,
    risk_score INTEGER DEFAULT 0,
    is_pep BOOLEAN DEFAULT false
);

-- Accounts table
CREATE TABLE accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    account_number VARCHAR(19) UNIQUE NOT NULL, -- UBAS-XXXX-XXXX-XXXX
    account_type VARCHAR(50) NOT NULL,
    account_name VARCHAR(255) NOT NULL,
    balance DECIMAL(15,2) DEFAULT 0.00,
    available_balance DECIMAL(15,2) DEFAULT 0.00,
    currency VARCHAR(3) DEFAULT 'USD',
    status VARCHAR(20) DEFAULT 'active',
    routing_number VARCHAR(9) DEFAULT '021000021',
    iban VARCHAR(34),
    swift_code VARCHAR(11) DEFAULT 'UBASFINTRUST',
    interest_rate DECIMAL(5,4) DEFAULT 0.0000,
    minimum_balance DECIMAL(15,2) DEFAULT 0.00,
    overdraft_limit DECIMAL(15,2) DEFAULT 0.00,
    daily_transfer_limit DECIMAL(15,2) DEFAULT 50000.00,
    monthly_transfer_limit DECIMAL(15,2) DEFAULT 500000.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    closed_at TIMESTAMP
);

-- Transactions table
CREATE TABLE transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    from_account_id UUID REFERENCES accounts(id),
    to_account_id UUID REFERENCES accounts(id),
    transaction_type VARCHAR(50) NOT NULL,
    amount DECIMAL(15,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    status VARCHAR(20) DEFAULT 'pending',
    description TEXT,
    reference VARCHAR(100),
    category VARCHAR(50),
    external_reference VARCHAR(255),
    fee_amount DECIMAL(15,2) DEFAULT 0.00,
    exchange_rate DECIMAL(10,6),
    processed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    metadata JSONB
);

-- KYC Documents table
CREATE TABLE kyc_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    document_type VARCHAR(50) NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_size INTEGER NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    verification_status VARCHAR(20) DEFAULT 'pending',
    verified_at TIMESTAMP,
    verified_by UUID,
    rejection_reason TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Address Information table
CREATE TABLE addresses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    address_type VARCHAR(20) NOT NULL, -- current, previous, mailing
    street_address TEXT NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(50) NOT NULL,
    zip_code VARCHAR(20) NOT NULL,
    country VARCHAR(100) NOT NULL,
    verified BOOLEAN DEFAULT false,
    verification_date TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Employment Information table
CREATE TABLE employment_info (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    employment_status VARCHAR(50) NOT NULL,
    employer_name VARCHAR(255),
    job_title VARCHAR(255),
    work_address TEXT,
    annual_income DECIMAL(15,2),
    source_of_funds VARCHAR(255),
    employment_start_date DATE,
    verified BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Security Events / Audit Log table
CREATE TABLE security_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    event_type VARCHAR(100) NOT NULL,
    resource VARCHAR(100) NOT NULL,
    action VARCHAR(100) NOT NULL,
    success BOOLEAN NOT NULL,
    ip_address INET,
    user_agent TEXT,
    session_id VARCHAR(255),
    details JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Notifications table
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL,
    priority VARCHAR(20) DEFAULT 'medium',
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    read BOOLEAN DEFAULT false,
    action_url VARCHAR(500),
    metadata JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    read_at TIMESTAMP
);

-- Bill Payments table
CREATE TABLE bill_payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id),
    account_id UUID NOT NULL REFERENCES accounts(id),
    payee_name VARCHAR(255) NOT NULL,
    payee_account VARCHAR(255) NOT NULL,
    amount DECIMAL(15,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    payment_date DATE NOT NULL,
    status VARCHAR(20) DEFAULT 'scheduled',
    category VARCHAR(50),
    recurring BOOLEAN DEFAULT false,
    recurring_frequency VARCHAR(20),
    confirmation_number VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Investment Portfolios table
CREATE TABLE investment_portfolios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id),
    account_id UUID NOT NULL REFERENCES accounts(id),
    portfolio_name VARCHAR(255) NOT NULL,
    total_value DECIMAL(15,2) DEFAULT 0.00,
    total_gain_loss DECIMAL(15,2) DEFAULT 0.00,
    risk_tolerance VARCHAR(20) DEFAULT 'moderate',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Investment Holdings table
CREATE TABLE investment_holdings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    portfolio_id UUID NOT NULL REFERENCES investment_portfolios(id),
    symbol VARCHAR(20) NOT NULL,
    name VARCHAR(255) NOT NULL,
    asset_type VARCHAR(50) NOT NULL, -- stock, bond, fund, crypto, commodity
    quantity DECIMAL(15,6) NOT NULL,
    average_price DECIMAL(15,4) NOT NULL,
    current_price DECIMAL(15,4) NOT NULL,
    market_value DECIMAL(15,2) NOT NULL,
    gain_loss DECIMAL(15,2) NOT NULL,
    gain_loss_percent DECIMAL(8,4) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Admin Users table
CREATE TABLE admin_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    role VARCHAR(50) NOT NULL, -- super_admin, admin, support, compliance
    permissions JSONB,
    status VARCHAR(20) DEFAULT 'active',
    last_login TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- System Settings table
CREATE TABLE system_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    setting_key VARCHAR(100) UNIQUE NOT NULL,
    setting_value TEXT NOT NULL,
    setting_type VARCHAR(50) NOT NULL, -- string, number, boolean, json
    description TEXT,
    category VARCHAR(50),
    updated_by UUID REFERENCES admin_users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_status ON users(status);
CREATE INDEX idx_accounts_user_id ON accounts(user_id);
CREATE INDEX idx_accounts_account_number ON accounts(account_number);
CREATE INDEX idx_accounts_status ON accounts(status);
CREATE INDEX idx_transactions_from_account ON transactions(from_account_id);
CREATE INDEX idx_transactions_to_account ON transactions(to_account_id);
CREATE INDEX idx_transactions_status ON transactions(status);
CREATE INDEX idx_transactions_created_at ON transactions(created_at);
CREATE INDEX idx_security_events_user_id ON security_events(user_id);
CREATE INDEX idx_security_events_created_at ON security_events(created_at);
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(read);

-- Insert default admin user
INSERT INTO admin_users (username, email, password_hash, first_name, last_name, role, permissions) VALUES 
('admin', 'admin@ubasfintrust.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VcSAg9S6O', 'System', 'Administrator', 'super_admin', '{"all": true}');

-- Insert default system settings
INSERT INTO system_settings (setting_key, setting_value, setting_type, description, category) VALUES 
('bank_name', 'UBAS Financial Trust', 'string', 'Official bank name', 'general'),
('routing_number', '021000021', 'string', 'Bank routing number', 'general'),
('swift_code', 'UBASFINTRUST', 'string', 'SWIFT/BIC code', 'general'),
('minimum_deposit', '100', 'number', 'Minimum deposit amount in USD', 'limits'),
('maximum_daily_transfer', '50000', 'number', 'Maximum daily transfer limit in USD', 'limits'),
('kyc_required', 'true', 'boolean', 'Whether KYC verification is required', 'compliance'),
('two_factor_required', 'true', 'boolean', 'Whether 2FA is required for all users', 'security');
