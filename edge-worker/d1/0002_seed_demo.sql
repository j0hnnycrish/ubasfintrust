-- Seed demo data for D1 so user endpoints are demonstrable
-- Ids are deterministic text values for simplicity

INSERT INTO users (id, email, first_name, last_name, is_verified)
SELECT 'demo-user-0001', 'demo@example.com', 'Demo', 'User', 1
WHERE NOT EXISTS (SELECT 1 FROM users WHERE id = 'demo-user-0001');

INSERT INTO accounts (id, user_id, account_number, account_type, balance, available_balance)
SELECT 'demo-acct-0001', 'demo-user-0001', '10000001', 'checking', 1000, 1000
WHERE NOT EXISTS (SELECT 1 FROM accounts WHERE id = 'demo-acct-0001');

INSERT INTO transactions (id, from_account_id, to_account_id, amount, currency, type, status)
SELECT 'demo-tx-0001', 'demo-acct-0001', 'demo-acct-0001', 0, 'USD', 'self', 'completed'
WHERE NOT EXISTS (SELECT 1 FROM transactions WHERE id = 'demo-tx-0001');
