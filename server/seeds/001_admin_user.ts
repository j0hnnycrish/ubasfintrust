import { Knex } from 'knex';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';

export async function seed(knex: Knex): Promise<void> {
  // Check if an admin (corporate) user already exists
  const existing = await knex('users').where({ account_type: 'corporate', email: process.env.ADMIN_EMAIL || 'admin@ubasfintrust.com' }).first();
  if (existing) {
    return; // Seed already applied
  }

  const id = uuidv4();
  const password = process.env.ADMIN_PASSWORD || 'Admin#12345';
  const saltRounds = parseInt(process.env.BCRYPT_ROUNDS || '12', 10);
  const passwordHash = await bcrypt.hash(password, saltRounds);

  const now = new Date();

  await knex('users').insert({
    id,
    email: process.env.ADMIN_EMAIL || 'admin@ubasfintrust.com',
    password_hash: passwordHash,
    first_name: 'Platform',
    last_name: 'Admin',
    phone: process.env.ADMIN_PHONE || '+10000000000',
    date_of_birth: '1990-01-01',
    account_type: 'corporate',
    kyc_status: 'approved',
    is_active: true,
    is_verified: true,
    two_factor_enabled: false,
    failed_login_attempts: 0,
    created_at: now,
    updated_at: now,
    last_login: now
  });

  // Create a default corporate operating account
  await knex('accounts').insert({
    id: uuidv4(),
    user_id: id,
    account_number: Math.random().toString().slice(2,12),
    account_type: 'business',
    balance: 0,
    available_balance: 0,
    currency: 'USD',
    status: 'active',
    minimum_balance: 0,
    created_at: now,
    updated_at: now
  });

  // eslint-disable-next-line no-console
  console.log('\n[seed] Corporate admin user created:', process.env.ADMIN_EMAIL || 'admin@ubasfintrust.com');
  // eslint-disable-next-line no-console
  console.log('[seed] Admin password:', password, '\n');
}
