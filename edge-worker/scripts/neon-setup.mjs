#!/usr/bin/env node
import { neon } from '@neondatabase/serverless'
import bcrypt from 'bcryptjs'

const url = process.env.DATABASE_URL
if (!url) {
  console.error('DATABASE_URL is required')
  process.exit(1)
}
const sql = neon(url)

async function main() {
  await sql`CREATE TABLE IF NOT EXISTS users (
    id uuid PRIMARY KEY,
    email text UNIQUE NOT NULL,
    first_name text,
    last_name text,
    phone text,
    date_of_birth date,
    account_type text,
    kyc_status text DEFAULT 'pending',
    is_verified boolean DEFAULT false,
    two_factor_enabled boolean DEFAULT false,
    password_hash text,
    role text DEFAULT 'user',
    created_at timestamptz DEFAULT now()
  )`

  // Ensure role column exists (for older schema versions)
  await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS role text DEFAULT 'user'`

  await sql`CREATE TABLE IF NOT EXISTS accounts (
    id uuid PRIMARY KEY,
    user_id uuid REFERENCES users(id) ON DELETE CASCADE,
    account_number text UNIQUE NOT NULL,
    account_type text NOT NULL,
    balance numeric(18,2) DEFAULT 0,
    available_balance numeric(18,2) DEFAULT 0,
    currency text DEFAULT 'USD',
    status text DEFAULT 'active',
    created_at timestamptz DEFAULT now()
  )`

  await sql`CREATE TABLE IF NOT EXISTS transactions (
    id uuid PRIMARY KEY,
    from_account_id uuid,
    to_account_id uuid,
    amount numeric(18,2) NOT NULL,
    currency text DEFAULT 'USD',
    type text NOT NULL,
    status text DEFAULT 'completed',
    created_at timestamptz DEFAULT now()
  )`

  // Seed one user, account, and a transaction
  const userId = crypto.randomUUID()
  const acctId = crypto.randomUUID()
  await sql`INSERT INTO users (id, email, first_name, last_name, is_verified) VALUES (${userId}, 'demo@example.com', 'Demo', 'User', true)
            ON CONFLICT (email) DO NOTHING`
  await sql`INSERT INTO accounts (id, user_id, account_number, account_type, balance, available_balance)
            VALUES (${acctId}, ${userId}, '10000001', 'checking', 1000, 1000)
            ON CONFLICT (account_number) DO NOTHING`
  const txId = crypto.randomUUID()
  await sql`INSERT INTO transactions (id, from_account_id, to_account_id, amount, type)
            VALUES (${txId}, ${acctId}, ${acctId}, 0, 'self')`

  // Seed default admin (configurable via env)
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@ubasfintrust.local'
  const adminPassword = process.env.ADMIN_PASSWORD || 'ChangeMe123!'
  const adminId = crypto.randomUUID()
  const salt = bcrypt.genSaltSync(10)
  const hash = bcrypt.hashSync(adminPassword, salt)
  await sql`INSERT INTO users (id, email, first_name, last_name, is_verified, role, password_hash)
            VALUES (${adminId}, ${adminEmail}, 'Admin', 'User', true, 'admin', ${hash})
            ON CONFLICT (email) DO UPDATE SET role = EXCLUDED.role, password_hash = EXCLUDED.password_hash`

  console.log('Neon setup complete.')
}

main().catch((e) => { console.error(e); process.exit(1) })
