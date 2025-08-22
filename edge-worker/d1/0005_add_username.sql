-- Add username support for D1 users and backfill from email prefix
-- Safe to apply once; ALTER TABLE will fail if column exists, so guard via pragma

-- Try adding username column (will error if already exists, so use a transaction-safe approach)
-- D1/SQLite supports adding columns directly
ALTER TABLE users ADD username TEXT;

-- Create a unique index on username (NULLs allowed; SQLite treats NULL as distinct)
CREATE UNIQUE INDEX idx_users_username ON users(username);

-- Backfill username for existing users from email local-part when possible
UPDATE users
SET username = lower(substr(email, 1, instr(email, '@') - 1))
WHERE (username IS NULL OR username = '')
  AND instr(email, '@') > 1;
