// ...existing code...

// Robust CORS middleware: handles all requests and preflight
app.use('*', async (c, next) => {
  if (c.req.method === 'OPTIONS') {
    c.header('Access-Control-Allow-Origin', '*');
    c.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    c.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  return new Response('', { status: 204 });
  }
  await next();
  c.header('Access-Control-Allow-Origin', '*');
  c.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  c.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
});

// ...existing code...

// Admin seed endpoint: ensures default admin user exists
app.post('/api/v1/auth/admin/seed', async (c: Context<{ Bindings: Env }>) => {
  try {
    const env = c.env as Env;
    const email = 'admin@ubasfintrust.com';
    const username = 'admin';
    const password = 'Admin25@@';
  const salt = bcryptjs.genSaltSync(12);
  const password_hash = bcryptjs.hashSync(password, salt);
    const role = 'super_admin';
    const first_name = 'System';
    const last_name = 'Administrator';
    // Check if admin user exists
    const existing = await env.DB.prepare(
      `SELECT id FROM admin_users WHERE email = ? LIMIT 1`
    ).bind(email).first();
    if (existing) {
      // Update password and role if needed
      await env.DB.prepare(
        `UPDATE admin_users SET password_hash = ?, role = ?, status = 'active' WHERE email = ?`
      ).bind(password_hash, role, email).run();
      return c.json({ success: true, message: 'Admin user updated.' });
    } else {
      // Insert new admin user
      await env.DB.prepare(
        `INSERT INTO admin_users (username, email, password_hash, first_name, last_name, role, status) VALUES (?, ?, ?, ?, ?, ?, 'active')`
      ).bind(username, email, password_hash, first_name, last_name, role).run();
      return c.json({ success: true, message: 'Admin user created.' });
    }
  } catch (e) {
    return c.json({ success: false, message: 'Admin seed failed', error: (e as Error).message }, 500);
  }
});

import { Hono, Context } from 'hono';
import type { Env } from './app-env';
import { ExternalBankingService } from './services/externalBankingService';
import { CreditScoreService } from './services/creditScoreService';
import { InvestmentService } from './services/investmentService';
import { initializeNotificationServices } from './services/notificationService';
import { getBearer, verifyBearer } from './auth';
import * as bcryptjs from 'bcryptjs';

const app = new Hono<{ Bindings: Env }>();
const externalBankingService = new ExternalBankingService();
const creditScoreService = new CreditScoreService();
const investmentService = new InvestmentService();


// Change password: requires auth, verifies current password
app.post('/api/v1/auth/change-password', async (c: Context<{ Bindings: Env }>) => {
  try {
  const notificationService = initializeNotificationServices(c.env);
    const token = getBearer(c.req.raw)
    if (!token) return c.json({ success: false, message: 'Unauthorized' }, 401)
  const jwtSecret = c.env.JWT_SECRET as string | undefined
    if (!jwtSecret) return c.json({ success: false, message: 'JWT secret not configured' }, 500)
  const payload = await verifyBearer(token, jwtSecret, c.env.JWT_AUD)
    const userId = (payload as any).id as string
    if (!userId) return c.json({ success: false, message: 'Unauthorized' }, 401)

    const { currentPassword, newPassword } = await c.req.json().catch(() => ({}))
    if (!currentPassword || !newPassword) return c.json({ success: false, message: 'currentPassword and newPassword required' }, 400)

    // D1 only
    const { results } = await c.env.DB.prepare(
      `SELECT password_hash FROM users WHERE id = ? LIMIT 1`
    ).bind(userId).all()
    const rec = results?.[0]
    if (!rec || !rec.password_hash) return c.json({ success: false, message: 'No password set' }, 400)
    const ok = await bcryptjs.compare(currentPassword, rec.password_hash)
    if (!ok) return c.json({ success: false, message: 'Invalid current password' }, 401)
    const salt = bcryptjs.genSaltSync(10)
    const hash = bcryptjs.hashSync(newPassword, salt)
    await c.env.DB.prepare(
      `UPDATE users SET password_hash = ? WHERE id = ?`
    ).bind(hash, userId).run()
  notificationService.sendSecurityNotification(userId, 'Password Changed', 'Your account password has been successfully updated')
    return c.json({ success: true })
  } catch (e) {
    return c.json({ success: false, message: 'Change password failed' }, 500)



  }

});





// Users: profile (mapped from server/src/routes/users.ts GET /profile)
app.get('/api/v1/users/profile', async (c: Context<{ Bindings: Env }>) => {
  try {
    const token = getBearer(c.req.raw)
    if (!token) return c.json({ success: false, message: 'Unauthorized' }, 401)
  const jwtSecret = c.env.JWT_SECRET as string | undefined
    if (!jwtSecret) return c.json({ success: false, message: 'JWT secret not configured' }, 500)
  const payload = await verifyBearer(token, jwtSecret, c.env.JWT_AUD)
    const userId = (payload.id as string) || ''
    if (!userId) return c.json({ success: false, message: 'Invalid token' }, 401)

  // D1 only

    // Fallback to D1 if table exists (SQLite schema must match)
    try {
  const { results } = await c.env.DB.prepare(
        `SELECT id, email, first_name, last_name, phone, date_of_birth, account_type, kyc_status, is_verified, two_factor_enabled, created_at FROM users WHERE id = ? LIMIT 1`
      ).bind(userId).all()
      const userProfile = results?.[0]
      if (!userProfile) {
        return c.json({ success: false, message: 'User not found' }, 404)
      }
      return c.json({ success: true, data: userProfile })
    } catch {
      return c.json({ success: false, message: 'DB not configured' }, 501)
    }
  } catch (err) {
    return c.json({ success: false, message: 'Unauthorized' }, 401)
  }



// Update user profile
app.put('/api/v1/users/profile', async (c: Context<{ Bindings: Env }>) => {
  try {
    const token = getBearer(c.req.raw)
    if (!token) return c.json({ success: false, message: 'Unauthorized' }, 401)
  const jwtSecret = c.env.JWT_SECRET as string | undefined
    if (!jwtSecret) return c.json({ success: false, message: 'JWT secret not configured' }, 500)
  const payload = await verifyBearer(token, jwtSecret, c.env.JWT_AUD)
    const userId = (payload as any).id as string

    const { first_name, last_name, phone, date_of_birth } = await c.req.json().catch(() => ({}))
    
    // Build update query dynamically
    const updates: string[] = []
    const params: any[] = []
    
    if (first_name !== undefined) { updates.push('first_name = ?'); params.push(first_name) }
    if (last_name !== undefined) { updates.push('last_name = ?'); params.push(last_name) }
    if (phone !== undefined) { updates.push('phone = ?'); params.push(phone) }
  } catch (e) {
    const error = e instanceof Error ? e.message : 'Unknown error'
  return c.json({ success: false, message: 'Failed to withdraw', error }, 500)
}

// ... endpoints continue ...
  try {
    // Auth check
    const kycToken = getBearer(c.req.raw)
    if (!kycToken) return c.json({ success: false, message: 'Unauthorized' }, 401)
    const kycJwtSecret = (c.env as any).JWT_SECRET as string | undefined
    if (!kycJwtSecret) return c.json({ success: false, message: 'JWT secret not configured' }, 500)
    const kycPayload = await verifyBearer(kycToken, kycJwtSecret, c.env.JWT_AUD)
    const kycUserId = kycPayload?.id as string | undefined
    if (!kycUserId) return c.json({ success: false, message: 'Invalid token' }, 401)

    const form = await c.req.parseBody()
    // Validate required fields
    const requiredFields = [
      'personal_firstName', 'personal_lastName', 'personal_dateOfBirth', 'personal_nationality',
      'address_street', 'address_city', 'address_state', 'address_country',
      'employment_status', 'employment_monthlyIncome',
      'agreement_terms', 'agreement_privacy'
    ]
    // Simulate KYC ID and uploadedDocs for demo
    const kycId = crypto.randomUUID()
    const uploadedDocs: string[] = []

    // ...existing code for storing KYC...

    return c.json({
      success: true,
      message: 'KYC application submitted successfully'
    })
  } catch {
    return c.json({ success: false, message: 'Unauthorized' }, 401)
  }
})

// Admin: list users with optional search and pagination
app.get('/api/v1/admin/users', async (c: Context<{ Bindings: Env }>) => {
  try {
    const token = getBearer(c.req.raw)
    if (!token) return c.json({ success: false, message: 'Unauthorized' }, 401)
    const jwtSecret = (c.env as any).JWT_SECRET as string | undefined
    if (!jwtSecret) return c.json({ success: false, message: 'JWT secret not configured' }, 500)
    const payload = await verifyBearer(token, jwtSecret, c.env.JWT_AUD)
  { const role = (payload as any).role; if (role !== 'admin' && role !== 'super_admin') return c.json({ success: false, message: 'Forbidden' }, 403) }

    const url = new URL(c.req.url)
    const page = Math.max(1, Number(url.searchParams.get('page') || '1'))
    const limit = Math.min(100, Math.max(1, Number(url.searchParams.get('limit') || '20')))
    const q = (url.searchParams.get('q') || '').trim()
    const offset = (page - 1) * limit

    // Use D1 database for admin operations
    let whereClause = ''
    let params: string[] = []
    if (q) {
      whereClause = `WHERE email LIKE ? OR first_name LIKE ? OR last_name LIKE ?`
      params = [`%${q}%`, `%${q}%`, `%${q}%`]
    }
    // ...existing code...
  } catch (e) {
    const error = e instanceof Error ? e.message : 'Unknown error';
    return c.json({ success: false, message: 'Failed to list users', error }, 500);
// ===== BANKING OPERATIONS =====

// Create new account for user
app.get('/api/v1/accounts/:id/transactions', async (c: Context<{ Bindings: Env }>) => {
  try {
    const token = getBearer(c.req.raw)
    if (!token) return c.json({ success: false, message: 'Unauthorized' }, 401)
    const jwtSecret = (c.env as any).JWT_SECRET as string | undefined
    if (!jwtSecret) return c.json({ success: false, message: 'JWT secret not configured' }, 500)
  const env = c.env as Env;
  const payload = await verifyBearer(token, jwtSecret, env.JWT_AUD)
    const userId = (payload as any).id as string
    const accountId = c.req.param('id')

    // Verify user owns the account
  const account = await env.DB.prepare(`
      SELECT id FROM accounts WHERE id = ? AND user_id = ?
    `).bind(accountId, userId).first()
    
    if (!account) {
      return c.json({ success: false, message: 'Account not found' }, 404)
    }

    const url = new URL(c.req.url)
    const page = Math.max(1, Number(url.searchParams.get('page') || '1'))
    const limit = Math.min(100, Math.max(1, Number(url.searchParams.get('limit') || '20')))
    const offset = (page - 1) * limit

  const transactions = await env.DB.prepare(`
      SELECT * FROM transactions 
      WHERE from_account_id = ? OR to_account_id = ?
      ORDER BY created_at DESC
      LIMIT ? OFFSET ?
    `).bind(accountId, accountId, limit, offset).all()

  const totalResult = await env.DB.prepare(`
      SELECT COUNT(*) as count FROM transactions 
      WHERE from_account_id = ? OR to_account_id = ?
    `).bind(accountId, accountId).first()
    
    const total = Number((totalResult as any)?.count || 0)
    
    return c.json({
      success: true,
      data: transactions.results,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) }
    })
  } catch (e) {
    const error = e instanceof Error ? e.message : 'Unknown error'
    return c.json({ success: false, message: 'Failed to get transactions', error }, 500)
  }
})

// Deposit money (simulated)
app.post('/api/v1/accounts/:id/deposit', async (c: Context<{ Bindings: Env }>) => {
  try {
    const token = getBearer(c.req.raw)
    if (!token) return c.json({ success: false, message: 'Unauthorized' }, 401)
    const jwtSecret = (c.env as any).JWT_SECRET as string | undefined
    if (!jwtSecret) return c.json({ success: false, message: 'JWT secret not configured' }, 500)
  const env = c.env as Env;
  const payload = await verifyBearer(token, jwtSecret, env.JWT_AUD)
    const userId = (payload as any).id as string
    const accountId = c.req.param('id')

    const { amount, description = 'Deposit' } = await c.req.json().catch(() => ({}))
    
    if (!amount || amount <= 0) {
      return c.json({ success: false, message: 'Valid amount required' }, 400)
    }

    // Verify user owns the account
  const account = await env.DB.prepare(`
      SELECT * FROM accounts WHERE id = ? AND user_id = ?
    `).bind(accountId, userId).first()
    
    if (!account) {
      return c.json({ success: false, message: 'Account not found' }, 404)
    }

    const txId = crypto.randomUUID()
    
    // Update account balance
  await env.DB.prepare(`
      UPDATE accounts 
      SET balance = balance + ?, available_balance = available_balance + ?
      WHERE id = ?
    `).bind(amount, amount, accountId).run()
    
    // Record transaction
  await env.DB.prepare(`
      INSERT INTO transactions (id, to_account_id, amount, currency, type, status, created_at)
      VALUES (?, ?, ?, ?, 'deposit', 'completed', datetime('now'))
    `).bind(txId, accountId, amount, (account as any).currency).run()
    
    return c.json({ 
      success: true, 
      transaction_id: txId,
      new_balance: Number((account as any).balance) + Number(amount)
    })
  } catch (e) {
    const error = e instanceof Error ? e.message : 'Unknown error'
    return c.json({ success: false, message: 'Failed to deposit', error }, 500)
  }
})

// Withdraw money (simulated)
app.post('/api/v1/accounts/:id/withdraw', async (c: Context<{ Bindings: Env }>) => {
  try {
    const token = getBearer(c.req.raw)
    if (!token) return c.json({ success: false, message: 'Unauthorized' }, 401)
  const env = c.env as Env;
  const jwtSecret = env.JWT_SECRET;
  if (!jwtSecret) return c.json({ success: false, message: 'JWT secret not configured' }, 500)
  const payload = await verifyBearer(token, jwtSecret, env.JWT_AUD)
    const userId = (payload as any).id as string
    const accountId = c.req.param('id')

    const { amount, description = 'Withdrawal' } = await c.req.json().catch(() => ({}))
    
    if (!amount || amount <= 0) {
      return c.json({ success: false, message: 'Valid amount required' }, 400)
    }

    // Verify user owns the account and has sufficient balance
  const account = await env.DB.prepare(`
      SELECT * FROM accounts WHERE id = ? AND user_id = ?
    `).bind(accountId, userId).first()
    
    if (!account) {
      return c.json({ success: false, message: 'Account not found' }, 404)
    }

    if (Number((account as any).available_balance) < amount) {
      return c.json({ success: false, message: 'Insufficient funds' }, 400)
    }

    const txId = crypto.randomUUID()
    
    // Update account balance
  await env.DB.prepare(`
      UPDATE accounts 
      SET balance = balance - ?, available_balance = available_balance - ?
      WHERE id = ?
    `).bind(amount, amount, accountId).run()
    
    // Record transaction
  await env.DB.prepare(`
      INSERT INTO transactions (id, from_account_id, amount, currency, type, status, created_at)
      VALUES (?, ?, ?, ?, 'withdrawal', 'completed', datetime('now'))
    `).bind(txId, accountId, amount, (account as any).currency).run()
    
    return c.json({ 
      success: true, 
      transaction_id: txId,
      new_balance: Number((account as any).balance) - Number(amount)
    })
  } catch (e) {
    const error = e instanceof Error ? e.message : 'Unknown error'
    return c.json({ success: false, message: 'Failed to withdraw', error }, 500)
  }
})

// ===== USER PROFILE MANAGEMENT =====

// Update user profile
app.put('/api/v1/users/profile', async (c: Context<{ Bindings: Env }>) => {
  try {
    const token = getBearer(c.req.raw)
    if (!token) return c.json({ success: false, message: 'Unauthorized' }, 401)
  const env = c.env as Env;
  const jwtSecret = env.JWT_SECRET;
  if (!jwtSecret) return c.json({ success: false, message: 'JWT secret not configured' }, 500)
  const payload = await verifyBearer(token, jwtSecret, env.JWT_AUD)
    const userId = (payload as any).id as string

    const { first_name, last_name, phone, date_of_birth } = await c.req.json().catch(() => ({}))
    
    // Build update query dynamically
    const updates: string[] = []
    const params: any[] = []
    
    if (first_name !== undefined) { updates.push('first_name = ?'); params.push(first_name) }
    if (last_name !== undefined) { updates.push('last_name = ?'); params.push(last_name) }
    if (phone !== undefined) { updates.push('phone = ?'); params.push(phone) }
    if (date_of_birth !== undefined) { updates.push('date_of_birth = ?'); params.push(date_of_birth) }
    
    if (updates.length === 0) {
      return c.json({ success: false, message: 'No fields to update' }, 400)
    }
    
  await env.DB.prepare(`
      UPDATE users 
      SET ${updates.join(', ')} 
      WHERE id = ?
    `).bind(...params, userId).run()
    
    return c.json({ success: true, message: 'Profile updated successfully' })
  } catch (e) {
    const error = e instanceof Error ? e.message : 'Unknown error'
    return c.json({ success: false, message: 'Failed to update profile', error }, 500)
  }
})

// Get KYC status
app.get('/api/v1/kyc/status', async (c: Context<{ Bindings: Env }>) => {
  try {
    const token = getBearer(c.req.raw)
    if (!token) return c.json({ success: false, message: 'Unauthorized' }, 401)
    const jwtSecret = (c.env as any).JWT_SECRET as string | undefined
    if (!jwtSecret) return c.json({ success: false, message: 'JWT secret not configured' }, 500)
  const env = c.env as Env;
  const payload = await verifyBearer(token, jwtSecret, env.JWT_AUD)
    const userId = (payload as any).id as string

  const kycApplication = await env.DB.prepare(`
      SELECT status, submitted_at, reviewed_at, rejection_reason
      FROM kyc_applications 
      WHERE user_id = ? 
      ORDER BY submitted_at DESC 
      LIMIT 1
    `).bind(userId).first()
    
  const documents = await env.DB.prepare(`
      SELECT document_type, verification_status, file_name
      FROM kyc_documents 
      WHERE user_id = ?
      ORDER BY created_at DESC
    `).bind(userId).all()
    
    return c.json({ 
      success: true, 
      kyc_status: kycApplication ? (kycApplication as any).status : 'not_submitted',
      application: kycApplication,
      documents: documents.results
    })
  } catch (e) {
    const error = e instanceof Error ? e.message : 'Unknown error'
    return c.json({ success: false, message: 'Failed to get KYC status', error }, 500)
  }
})

// Admin: Update KYC status
app.put('/api/v1/admin/kyc/:id/status', async (c: Context<{ Bindings: Env }>) => {
  try {
    const token = getBearer(c.req.raw)
    if (!token) return c.json({ success: false, message: 'Unauthorized' }, 401)
    const jwtSecret = (c.env as any).JWT_SECRET as string | undefined
    if (!jwtSecret) return c.json({ success: false, message: 'JWT secret not configured' }, 500)
  const env = c.env as Env;
  const payload = await verifyBearer(token, jwtSecret, env.JWT_AUD)
  { const role = (payload as any).role; if (role !== 'admin' && role !== 'super_admin') return c.json({ success: false, message: 'Forbidden' }, 403) }

    const kycId = c.req.param('id')
    const { status, rejection_reason } = await c.req.json().catch(() => ({}))
    
    if (!['pending', 'approved', 'rejected'].includes(status)) {
      return c.json({ success: false, message: 'Invalid status' }, 400)
    }

    const updates = ['status = ?', 'reviewed_at = datetime(\'now\')', 'reviewed_by = ?']
    const params = [status, (payload as any).id]
    
    if (status === 'rejected' && rejection_reason) {
      updates.push('rejection_reason = ?')
      params.push(rejection_reason)
    }
    
  const result = await env.DB.prepare(`
      UPDATE kyc_applications 
      SET ${updates.join(', ')}
      WHERE id = ?
    `).bind(...params, kycId).run()
    
    if (result.meta.changes === 0) {
      return c.json({ success: false, message: 'KYC application not found' }, 404)
    }
    
    // Update user KYC status
    if (status === 'approved') {
  const kycApp = await env.DB.prepare('SELECT user_id FROM kyc_applications WHERE id = ?').bind(kycId).first()
      if (kycApp) {
  await env.DB.prepare(`
          UPDATE users SET kyc_status = 'verified' WHERE id = ?
        `).bind((kycApp as any).user_id).run()
      }
    }
    
    return c.json({ success: true, message: 'KYC status updated successfully' })
  } catch (e) {
    const error = e instanceof Error ? e.message : 'Unknown error'
    return c.json({ success: false, message: 'Failed to update KYC status', error }, 500)
  }
})

// Admin: Get all KYC applications
app.get('/api/v1/admin/kyc', async (c: Context<{ Bindings: Env }>) => {
  try {
    const token = getBearer(c.req.raw)
    if (!token) return c.json({ success: false, message: 'Unauthorized' }, 401)
    const jwtSecret = (c.env as any).JWT_SECRET as string | undefined
    if (!jwtSecret) return c.json({ success: false, message: 'JWT secret not configured' }, 500)
  const env = c.env as Env;
  const payload = await verifyBearer(token, jwtSecret, env.JWT_AUD)
    if ((payload as any).role !== 'admin') return c.json({ success: false, message: 'Forbidden' }, 403)

    const url = new URL(c.req.url)
    const page = Math.max(1, Number(url.searchParams.get('page') || '1'))
    const limit = Math.min(100, Math.max(1, Number(url.searchParams.get('limit') || '20')))
    const status = url.searchParams.get('status')
    const offset = (page - 1) * limit

    let whereClause = ''
    let params: string[] = []
    if (status) {
      whereClause = 'WHERE k.status = ?'
      params = [status]
    }

  const applications = await env.DB.prepare(`
      SELECT k.*, u.email, u.first_name, u.last_name
      FROM kyc_applications k
      JOIN users u ON k.user_id = u.id
      ${whereClause}
      ORDER BY k.submitted_at DESC
      LIMIT ? OFFSET ?
    `).bind(...params, limit, offset).all()

  const totalResult = await env.DB.prepare(`
      SELECT COUNT(*) as count FROM kyc_applications k ${whereClause}
    `).bind(...params).first()
    
    const total = Number((totalResult as any)?.count || 0)
    
    return c.json({
      success: true,
      data: applications.results,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) }
    })
  } catch (e) {
    const error = e instanceof Error ? e.message : 'Unknown error'
    return c.json({ success: false, message: 'Failed to get KYC applications', error }, 500)
  }
})

// ===== TRANSFERS AND TRANSACTIONS =====

// Users: transactions with pagination and optional type/status filters
app.get('/api/v1/users/transactions', async (c: Context<{ Bindings: Env }>) => {
  try {
    const token = getBearer(c.req.raw)
    if (!token) return c.json({ success: false, message: 'Unauthorized' }, 401)
    const jwtSecret = (c.env as any).JWT_SECRET as string | undefined
    if (!jwtSecret) return c.json({ success: false, message: 'JWT secret not configured' }, 500)
  const env = c.env as Env;
  const payload = await verifyBearer(token, jwtSecret, env.JWT_AUD)
    const userId = (payload.id as string) || ''
    if (!userId) return c.json({ success: false, message: 'Invalid token' }, 401)

    const url = new URL(c.req.url)
    const page = Math.max(1, Number(url.searchParams.get('page') || '1'))
    const limit = Math.min(100, Math.max(1, Number(url.searchParams.get('limit') || '20')))
    const type = url.searchParams.get('type') || undefined
    const status = url.searchParams.get('status') || undefined
    const offset = (page - 1) * limit

  // Neon/Postgres logic removed. Only D1 logic remains.
    // Neon/Postgres logic removed. Only D1 logic remains.

    // D1 fallback
    try {
      const accRes = await c.env.DB.prepare(`SELECT id FROM accounts WHERE user_id = ?`).bind(userId).all()
      const ids = (accRes.results || []).map((r: any) => r.id)
      if (ids.length === 0) return c.json({ success: true, data: [], pagination: { page, limit, total: 0, totalPages: 0 } })
      // dynamic IN clause
      const placeholders = ids.map(() => '?').join(',')
      let q = `SELECT id, from_account_id, to_account_id, amount, currency, type, status, created_at FROM transactions
               WHERE (from_account_id IN (${placeholders}) OR to_account_id IN (${placeholders}))`
      const binds: any[] = [...ids, ...ids]
      if (type) { q += ` AND type = ?`; binds.push(type) }
      if (status) { q += ` AND status = ?`; binds.push(status) }
      q += ` ORDER BY created_at DESC LIMIT ? OFFSET ?`
      binds.push(limit, offset)
      const rows = await c.env.DB.prepare(q).bind(...binds).all()
      // For total count (approximate): omit for simplicity in D1 sample
      return c.json({ success: true, data: rows.results || [], pagination: { page, limit, total: 0, totalPages: 0 } })
    } catch {
      return c.json({ success: true, data: [], pagination: { page, limit, total: 0, totalPages: 0 } })
    }
  } catch {
    return c.json({ success: false, message: 'Unauthorized' }, 401)
  }
})

// Transfers: create transfer with idempotency

// ===== EXTERNAL BANKING =====

// Get supported banks for external transfers
app.get('/api/v1/banking/external-banks', async (c: Context<{ Bindings: Env }>) => {
  try {
  // Removed initializeServices
    const token = getBearer(c.req.raw)
    if (!token) return c.json({ success: false, message: 'Unauthorized' }, 401)
    const jwtSecret = (c.env as any).JWT_SECRET as string | undefined
    if (!jwtSecret) return c.json({ success: false, message: 'JWT secret not configured' }, 500)
  const env = c.env as Env;
  await verifyBearer(token, jwtSecret, env.JWT_AUD)

  const banks = externalBankingService.getSupportedBanks()
    
    return c.json({
      success: true,
      data: banks
    })
  } catch (error) {
    return c.json({
      success: false,
      message: 'Failed to get supported banks'
    }, 500)
  }
})

// Verify external bank account
app.post('/api/v1/banking/external-banks/verify', async (c: Context<{ Bindings: Env }>) => {
  try {
  // Removed initializeServices
    const token = getBearer(c.req.raw)
    if (!token) return c.json({ success: false, message: 'Unauthorized' }, 401)
    const jwtSecret = (c.env as any).JWT_SECRET as string | undefined
    if (!jwtSecret) return c.json({ success: false, message: 'JWT secret not configured' }, 500)
  const env = c.env as Env;
  await verifyBearer(token, jwtSecret, env.JWT_AUD)

    const { accountNumber, bankCode } = await c.req.json().catch(() => ({}))
    
    if (!accountNumber || !bankCode) {
      return c.json({ 
        success: false, 
        message: 'Account number and bank code are required' 
      }, 400)
    }
    
  const result = await externalBankingService.verifyBankAccount(accountNumber, bankCode)
    
    return c.json({
      success: result.success,
      message: result.success ? 'Bank account verified successfully' : result.message || 'Verification failed',
      data: result.success ? {
        accountName: result.accountName,
        bankName: result.bankName,
        status: result.status
      } : undefined
    })
  } catch (error) {
    return c.json({
      success: false,
      message: 'Failed to verify bank account'
    }, 500)
  }
})

// External bank transfer
app.post('/api/v1/banking/external-transfer', async (c: Context<{ Bindings: Env }>) => {
  try {
  // Removed initializeServices
    const token = getBearer(c.req.raw)
    if (!token) return c.json({ success: false, message: 'Unauthorized' }, 401)
    const jwtSecret = (c.env as any).JWT_SECRET as string | undefined
    if (!jwtSecret) return c.json({ success: false, message: 'JWT secret not configured' }, 500)
  const env = c.env as Env;
  const payload = await verifyBearer(token, jwtSecret, env.JWT_AUD)
    const userId = (payload as any).id as string

    const { fromAccountId, toAccountNumber, toBankCode, amount, description, recipientName } = await c.req.json().catch(() => ({}))
    
    if (!fromAccountId || !toAccountNumber || !toBankCode || !amount || !description || !recipientName) {
      return c.json({
        success: false,
        message: 'Missing required fields'
      }, 400)
    }
    
    // Verify the destination account first
  const verification = await externalBankingService.verifyBankAccount(toAccountNumber, toBankCode)
    if (!verification.success) {
      return c.json({
        success: false,
        message: verification.message || 'Account verification failed'
      }, 400)
    }
    
    // Calculate transfer fee
  const fee = externalBankingService.calculateTransferFee(amount, toBankCode, 'USD')
    
    // Initiate the transfer
    const transferData = {
      fromAccount: fromAccountId,
      toAccount: {
        accountNumber: toAccountNumber,
        accountName: verification.accountName || '',
        bankCode: toBankCode,
        bankName: verification.bankName || ''
      },
      amount,
      currency: 'USD',
      reference: externalBankingService.generateTransactionReference(),
      narration: description
    }
    
  const result = await externalBankingService.initiateTransfer(transferData)
    
    if (result.status === 'pending') {
      // Send notification
      const notificationService = initializeNotificationServices(c.env);
      if (notificationService) {
        await notificationService.sendNotification({
          userId,
          type: 'transaction',
          priority: 'medium',
          title: 'External Transfer Initiated',
          message: `External transfer of $${amount.toLocaleString()} to ${verification.bankName} has been initiated. Reference: ${result.reference}`,
          channels: ['email', 'sms', 'in_app'],
          data: {
            reference: result.reference,
            amount,
            toBank: verification.bankName,
            toAccount: toAccountNumber,
            fee: result.fee
          }
        })
      }
    }
    
    return c.json({
      success: result.status === 'pending',
      message: result.status === 'pending' ? 'External transfer initiated successfully' : 'Transfer failed',
      data: {
        reference: result.reference,
        status: result.status,
        fee: result.fee,
        externalReference: result.externalReference
      }
    })
  } catch (error) {
    return c.json({
      success: false,
      message: 'Failed to process external transfer'
    }, 500)
  }
})

// ===== CREDIT SCORE AND BANKING SERVICES =====

// Get credit score
app.get('/api/v1/banking/credit-score', async (c: Context<{ Bindings: Env }>) => {
  try {
  // Removed initializeServices
    const token = getBearer(c.req.raw)
    if (!token) return c.json({ success: false, message: 'Unauthorized' }, 401)
    const jwtSecret = (c.env as any).JWT_SECRET as string | undefined
    if (!jwtSecret) return c.json({ success: false, message: 'JWT secret not configured' }, 500)
  const env = c.env as Env;
  const payload = await verifyBearer(token, jwtSecret, env.JWT_AUD)
    const userId = (payload as any).id as string
    
  const creditScore = await creditScoreService.calculateCreditScore(userId)
    
    return c.json({
      success: true,
      data: creditScore
    })
  } catch (error) {
    return c.json({
      success: false,
      message: 'Failed to get credit score'
    }, 500)
  }
})

// Assess loan eligibility
app.post('/api/v1/banking/loan-eligibility', async (c: Context<{ Bindings: Env }>) => {
  try {
  // Removed initializeServices
    const token = getBearer(c.req.raw)
    if (!token) return c.json({ success: false, message: 'Unauthorized' }, 401)
    const jwtSecret = (c.env as any).JWT_SECRET as string | undefined
    if (!jwtSecret) return c.json({ success: false, message: 'JWT secret not configured' }, 500)
  const env = c.env as Env;
  const payload = await verifyBearer(token, jwtSecret, env.JWT_AUD)
    const userId = (payload as any).id as string

    const { amount } = await c.req.json().catch(() => ({}))
    
    if (!amount || amount < 1000) {
      return c.json({
        success: false,
        message: 'Minimum loan amount is $1,000'
      }, 400)
    }
    
  const eligibility = await creditScoreService.assessLoanEligibility(userId, amount)
    
    return c.json({
      success: true,
      data: eligibility
    })
  } catch (error) {
    return c.json({
      success: false,
      message: 'Failed to assess loan eligibility'
    }, 500)
  }
})

// ===== INVESTMENT SERVICES =====

// Get investment options
app.get('/api/v1/banking/investments/options', async (c: Context<{ Bindings: Env }>) => {
  try {
  // Removed initializeServices
    const token = getBearer(c.req.raw)
    if (!token) return c.json({ success: false, message: 'Unauthorized' }, 401)
    const jwtSecret = (c.env as any).JWT_SECRET as string | undefined
    if (!jwtSecret) return c.json({ success: false, message: 'JWT secret not configured' }, 500)
  const env = c.env as Env;
  await verifyBearer(token, jwtSecret, env.JWT_AUD)
    
  const options = investmentService.getInvestmentOptions()
    
    return c.json({
      success: true,
      data: options
    })
  } catch (error) {
    return c.json({
      success: false,
      message: 'Failed to get investment options'
    }, 500)
  }
})

// Create investment
app.post('/api/v1/banking/investments', async (c: Context<{ Bindings: Env }>) => {
  try {
  // Removed initializeServices
    const token = getBearer(c.req.raw)
    if (!token) return c.json({ success: false, message: 'Unauthorized' }, 401)
    const jwtSecret = (c.env as any).JWT_SECRET as string | undefined
    if (!jwtSecret) return c.json({ success: false, message: 'JWT secret not configured' }, 500)
  const env = c.env as Env;
  const payload = await verifyBearer(token, jwtSecret, env.JWT_AUD)
    const userId = (payload as any).id as string

    const { optionId, amount, accountId } = await c.req.json().catch(() => ({}))
    
    if (!optionId || !amount || !accountId) {
      return c.json({
        success: false,
        message: 'Investment option, amount, and account ID are required'
      }, 400)
    }
    
    if (amount < 100) {
      return c.json({
        success: false,
        message: 'Minimum investment amount is $100'
      }, 400)
    }
    
  const result = await investmentService.createInvestment(userId, optionId, amount, accountId)
    
    if (result.investmentId) {
      // Send notification
      const notificationService = initializeNotificationServices(c.env);
      if (notificationService) {
        await notificationService.sendNotification({
          userId,
          type: 'account',
          priority: 'medium',
          title: 'Investment Created',
          message: `Your investment of $${amount.toLocaleString()} has been created successfully.`,
          channels: ['email', 'in_app'],
          data: {
            investmentId: result.investmentId,
            optionId,
            amount
          }
        })
      }
    }
    
    return c.json({
      success: !!result.investmentId,
      message: result.investmentId ? 'Investment created successfully' : 'Failed to create investment',
      data: result
    })
  } catch (error) {
    return c.json({
      success: false,
      message: 'Failed to create investment'
    }, 500)
  }
})

// Get user investment portfolio
app.get('/api/v1/banking/investments/portfolio', async (c: Context<{ Bindings: Env }>) => {
  try {
  // Removed initializeServices
    const token = getBearer(c.req.raw)
    if (!token) return c.json({ success: false, message: 'Unauthorized' }, 401)
    const jwtSecret = (c.env as any).JWT_SECRET as string | undefined
    if (!jwtSecret) return c.json({ success: false, message: 'JWT secret not configured' }, 500)
  const env = c.env as Env;
  const payload = await verifyBearer(token, jwtSecret, env.JWT_AUD)
    const userId = (payload as any).id as string

  const portfolio = await investmentService.getUserPortfolio(userId)
    
    return c.json({
      success: true,
      data: portfolio
    })
  } catch (error) {
    return c.json({
      success: false,
      message: 'Failed to get investment portfolio'
    }, 500)
  }
})

// Get market summary
app.get('/api/v1/banking/investments/market', async (c: Context<{ Bindings: Env }>) => {
  try {
  // Removed initializeServices
    const token = getBearer(c.req.raw)
    if (!token) return c.json({ success: false, message: 'Unauthorized' }, 401)
    const jwtSecret = (c.env as any).JWT_SECRET as string | undefined
    if (!jwtSecret) return c.json({ success: false, message: 'JWT secret not configured' }, 500)
  const env = c.env as Env;
  await verifyBearer(token, jwtSecret, env.JWT_AUD)

  const marketSummary = investmentService.getMarketSummary()
    
    return c.json({
      success: true,
      data: marketSummary
    })
  } catch (error) {
    return c.json({
      success: false,
      message: 'Failed to get market summary'
    }, 500)
  }
})

// ===== NOTIFICATIONS =====

// Get user notifications (in-app)
app.get('/api/v1/notifications', async (c: Context<{ Bindings: Env }>) => {
  try {
    const token = getBearer(c.req.raw)
    if (!token) return c.json({ success: false, message: 'Unauthorized' }, 401)
    const jwtSecret = (c.env as any).JWT_SECRET as string | undefined
    if (!jwtSecret) return c.json({ success: false, message: 'JWT secret not configured' }, 500)
  const env = c.env as Env;
  const payload = await verifyBearer(token, jwtSecret, env.JWT_AUD)
    const userId = (payload as any).id as string

    const url = new URL(c.req.url)
    const page = Math.max(1, Number(url.searchParams.get('page') || '1'))
    const limit = Math.min(100, Math.max(1, Number(url.searchParams.get('limit') || '20')))
    const type = url.searchParams.get('type')
    const read = url.searchParams.get('read')
    const offset = (page - 1) * limit

    let query = `
      SELECT * FROM notifications
      WHERE user_id = ?
    `
    const params: any[] = [userId]

    if (type) {
      query += ` AND type = ?`
      params.push(type)
    }

    if (read !== null) {
      query += ` AND read = ?`
      params.push(read === 'true')
    }

    query += ` ORDER BY created_at DESC LIMIT ? OFFSET ?`
    params.push(limit, offset)

  const notifications = await env.DB.prepare(query).bind(...params).all()

  const totalResult = await env.DB.prepare(`
      SELECT COUNT(*) as count FROM notifications WHERE user_id = ?
      ${type ? 'AND type = ?' : ''}
      ${read !== null ? 'AND read = ?' : ''}
    `).bind(userId, ...(type ? [type] : []), ...(read !== null ? [read === 'true'] : [])).first()

  const unreadResult = await env.DB.prepare(`
      SELECT COUNT(*) as count FROM notifications WHERE user_id = ? AND read = false
    `).bind(userId).first()

    return c.json({
      success: true,
      data: {
        notifications: notifications.results,
        pagination: {
          page,
          limit,
          total: Number((totalResult as any)?.count || 0),
          pages: Math.ceil(Number((totalResult as any)?.count || 0) / limit)
        },
        unreadCount: Number((unreadResult as any)?.count || 0)
      }
    })
  } catch (error) {
    return c.json({
      success: false,
      message: 'Failed to get notifications'
    }, 500)
  }
})

// Mark notification as read
app.patch('/api/v1/notifications/:id/read', async (c: Context<{ Bindings: Env }>) => {
  try {
    const token = getBearer(c.req.raw)
    if (!token) return c.json({ success: false, message: 'Unauthorized' }, 401)
    const jwtSecret = (c.env as any).JWT_SECRET as string | undefined
    if (!jwtSecret) return c.json({ success: false, message: 'JWT secret not configured' }, 500)
  const env = c.env as Env;
  const payload = await verifyBearer(token, jwtSecret, env.JWT_AUD)
    const userId = (payload as any).id as string
    const notificationId = c.req.param('id')

  const notification = await env.DB.prepare(`
      SELECT id FROM notifications WHERE id = ? AND user_id = ?
    `).bind(notificationId, userId).first()

    if (!notification) {
      return c.json({
        success: false,
        message: 'Notification not found'
      }, 404)
    }

  await env.DB.prepare(`
      UPDATE notifications 
      SET read = true, read_at = datetime('now')
      WHERE id = ?
    `).bind(notificationId).run()

    return c.json({
      success: true,
      message: 'Notification marked as read'
    })
  } catch (error) {
    return c.json({
      success: false,
      message: 'Failed to mark notification as read'
    }, 500)
  }
})

// Mark all notifications as read
app.patch('/api/v1/notifications/read-all', async (c: Context<{ Bindings: Env }>) => {
  try {
    const token = getBearer(c.req.raw)
    if (!token) return c.json({ success: false, message: 'Unauthorized' }, 401)
    const jwtSecret = (c.env as any).JWT_SECRET as string | undefined
    if (!jwtSecret) return c.json({ success: false, message: 'JWT secret not configured' }, 500)
  const env = c.env as Env;
  const payload = await verifyBearer(token, jwtSecret, env.JWT_AUD)
    const userId = (payload as any).id as string

  await env.DB.prepare(`
      UPDATE notifications 
      SET read = true, read_at = datetime('now')
      WHERE user_id = ? AND read = false
    `).bind(userId).run()

    return c.json({
      success: true,
      message: 'All notifications marked as read'
    })
  } catch (error) {
    return c.json({
      success: false,
      message: 'Failed to mark all notifications as read'
    }, 500)
  }
})

// Test notification endpoint (for testing purposes)
app.post('/api/v1/notifications/test', async (c: Context<{ Bindings: Env }>) => {
  try {
  // Removed initializeServices
    const token = getBearer(c.req.raw)
    if (!token) return c.json({ success: false, message: 'Unauthorized' }, 401)
    const jwtSecret = (c.env as any).JWT_SECRET as string | undefined
    if (!jwtSecret) return c.json({ success: false, message: 'JWT secret not configured' }, 500)
  const env = c.env as Env;
  const payload = await verifyBearer(token, jwtSecret, env.JWT_AUD)
    const userId = (payload as any).id as string

    const { type, priority, title, message, channels, data } = await c.req.json().catch(() => ({}))

    if (!type || !priority || !title || !message || !channels) {
      return c.json({
        success: false,
        message: 'Missing required fields'
      }, 400)
    }

    // Send test notification
  const notificationService = initializeNotificationServices(c.env);
  await notificationService.sendNotification({
      userId,
      type,
      priority,
      title,
      message,
      channels,
      data
    })

    return c.json({
      success: true,
      message: 'Test notification sent'
    })
  } catch (error) {
    return c.json({
      success: false,
      message: 'Failed to send test notification'
    }, 500)
  }
})

// Get notification provider health status
app.get('/api/v1/notifications/providers/health', async (c: Context<{ Bindings: Env }>) => {
  try {
  // Removed initializeServices
    const token = getBearer(c.req.raw)
    if (!token) return c.json({ success: false, message: 'Unauthorized' }, 401)
    const jwtSecret = (c.env as any).JWT_SECRET as string | undefined
    if (!jwtSecret) return c.json({ success: false, message: 'JWT secret not configured' }, 500)
  const env = c.env as Env;
  await verifyBearer(token, jwtSecret, env.JWT_AUD)

  const notificationService = initializeNotificationServices(c.env);
  const providerStatus = notificationService.getProviderStatus()

    return c.json({
      success: true,
      data: providerStatus
    })
  } catch (error) {
    return c.json({
      success: false,
      message: 'Failed to get provider health status'
    }, 500)
  }
})

// ===== ADMIN ENDPOINTS =====
// Admin login endpoint
app.post('/api/v1/auth/admin/login', async (c: Context<{ Bindings: Env }>) => {
  try {
    const { identifier, password } = await c.req.json().catch(() => ({}))
    if (!identifier || !password) {
      return c.json({ success: false, message: 'Identifier and password required' }, 400)
    }

    // Find user by username or phone, must be admin/super_admin
  const env = c.env as Env;
  const user = await env.DB.prepare(
      `SELECT * FROM admin_users WHERE (username = ? OR email = ?) AND (role = 'admin' OR role = 'super_admin') LIMIT 1`
    ).bind(identifier, identifier).first()
    if (!user) {
      return c.json({ success: false, message: 'Admin user not found or not authorized' }, 404)
    }

    // Verify password
    const ok = await bcryptjs.compare(password, (user as any).password_hash)
    if (!ok) {
      return c.json({ success: false, message: 'Invalid password' }, 401)
    }

    // Issue JWT
  const jwtSecret = env.JWT_SECRET as string | undefined
    if (!jwtSecret) {
      return c.json({ success: false, message: 'JWT secret not configured' }, 500)
    }
    const { SignJWT } = await import('jose')
    const key = new TextEncoder().encode(jwtSecret)
    const token = await new SignJWT({
      id: (user as any).id,
      role: (user as any).role,
      username: (user as any).username,
      phone: (user as any).phone,
  aud: env.JWT_AUD
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('7d')
      .sign(key)

    return c.json({
      success: true,
      token,
      user: {
        id: (user as any).id,
        username: (user as any).username,
        phone: (user as any).phone,
        role: (user as any).role,
        first_name: (user as any).first_name,
        last_name: (user as any).last_name
      }
    })
  } catch (e) {
    const error = e instanceof Error ? e.message : 'Unknown error'
    return c.json({ success: false, message: 'Admin login failed', error }, 500)
  }
})

// Admin: reset another user's password
app.post('/api/v1/auth/admin/reset-password', async (c: Context<{ Bindings: Env }>) => {
  try {
    const token = getBearer(c.req.raw)
    if (!token) return c.json({ success: false, message: 'Unauthorized' }, 401)
    const jwtSecret = (c.env as any).JWT_SECRET as string | undefined
    if (!jwtSecret) return c.json({ success: false, message: 'JWT secret not configured' }, 500)
  const env = c.env as Env;
  const payload = await verifyBearer(token, jwtSecret, env.JWT_AUD)
    if ((payload as any).role !== 'admin') return c.json({ success: false, message: 'Forbidden' }, 403)

    const { userId, newPassword } = await c.req.json().catch(() => ({}))
    if (!userId || !newPassword) return c.json({ success: false, message: 'userId and newPassword required' }, 400)

    const databaseUrl = (c.env as any).DATABASE_URL as string | undefined
  // Neon/Postgres logic removed. Only D1 logic remains.
  } catch (e) {
    return c.json({ success: false, message: 'Reset failed' }, 500)
  }
})

// Admin-only example route
app.get('/api/v1/admin/ping', async (c: Context<{ Bindings: Env }>) => {
  try {
    const token = getBearer(c.req.raw)
    if (!token) return c.json({ success: false, message: 'Unauthorized' }, 401)
    const jwtSecret = (c.env as any).JWT_SECRET as string | undefined
    if (!jwtSecret) return c.json({ success: false, message: 'JWT secret not configured' }, 500)
  const env = c.env as Env;
  const payload = await verifyBearer(token, jwtSecret, env.JWT_AUD)
    if ((payload as any).role !== 'admin') return c.json({ success: false, message: 'Forbidden' }, 403)
    return c.json({ success: true, message: 'admin-ok' })
  } catch {
    return c.json({ success: false, message: 'Unauthorized' }, 401)
  }
})

// Admin: list users with optional search and pagination
app.get('/api/v1/admin/users', async (c: Context<{ Bindings: Env }>) => {
  try {
    const token = getBearer(c.req.raw)
    if (!token) return c.json({ success: false, message: 'Unauthorized' }, 401)
    const jwtSecret = (c.env as any).JWT_SECRET as string | undefined
    if (!jwtSecret) return c.json({ success: false, message: 'JWT secret not configured' }, 500)
  const env = c.env as Env;
  const payload = await verifyBearer(token, jwtSecret, env.JWT_AUD)
    if ((payload as any).role !== 'admin') return c.json({ success: false, message: 'Forbidden' }, 403)

    const url = new URL(c.req.url)
    const page = Math.max(1, Number(url.searchParams.get('page') || '1'))
    const limit = Math.min(100, Math.max(1, Number(url.searchParams.get('limit') || '20')))
    const q = (url.searchParams.get('q') || '').trim()
    const offset = (page - 1) * limit

    // Use D1 database for admin operations
    let whereClause = ''
    let params: string[] = []
    if (q) {
      whereClause = `WHERE email LIKE ? OR first_name LIKE ? OR last_name LIKE ?`
      params = [`%${q}%`, `%${q}%`, `%${q}%`]
    }

  const rows = await env.DB.prepare(`
      SELECT id, email, first_name, last_name, account_type, kyc_status, is_verified, created_at
      FROM users
      ${whereClause}
      ORDER BY created_at DESC
      LIMIT ? OFFSET ?
    `).bind(...params, limit, offset).all()

  const totalResult = await env.DB.prepare(`
      SELECT COUNT(*) as count FROM users ${whereClause}
    `).bind(...params).first()
    
    const total = Number((totalResult as any)?.count || 0)
    return c.json({ 
      success: true, 
      data: rows.results, 
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } 
    })
  } catch (e) {
    const error = e instanceof Error ? e.message : 'Unknown error'
    return c.json({ success: false, message: 'Failed to list users', error }, 500)

// Dev-only: mint token (guard with DEV_MINT)
app.post('/dev/mint-token', async (c: Context<{ Bindings: Env }>) => {
  const allow = (c.env as any).DEV_MINT === 'true'
  if (!allow) return c.json({ error: 'disabled' }, 403)
  try {
    const { email = 'demo@example.com', id = crypto.randomUUID(), expiresIn = '7d' } = await c.req.json().catch(() => ({}))
    const jwtSecret = (c.env as any).JWT_SECRET as string | undefined
    if (!jwtSecret) return c.json({ error: 'JWT secret not configured' }, 500)
    const key = new TextEncoder().encode(jwtSecret)
    // dynamic import to avoid increasing cold path if unused
    const { SignJWT } = await import('jose')
  const env = c.env as Env;
  const token = await new SignJWT({ id, email, aud: env.JWT_AUD })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime(expiresIn)
      .sign(key)
    return c.json({ token, id, email })
  } catch (e) {
    return c.json({ error: 'failed to mint' }, 500)
  }
});
  }
});

// Admin seed endpoint: ensures default admin user exists
app.post('/api/v1/auth/admin/seed', async (c: Context<{ Bindings: Env }>) => {
  try {
    const env = c.env as Env;
    const email = 'admin@ubasfintrust.com';
    const username = 'admin';
    const password = 'Admin25@@';
    const salt = bcryptjs.genSaltSync(12);
    const password_hash = bcryptjs.hashSync(password, salt);
    const role = 'super_admin';
    const first_name = 'System';
    const last_name = 'Administrator';
    // Check if admin user exists
    const existing = await env.DB.prepare(
      `SELECT id FROM admin_users WHERE email = ? LIMIT 1`
    ).bind(email).first();
    if (existing) {
      // Update password and role if needed
      await env.DB.prepare(
        `UPDATE admin_users SET password_hash = ?, role = ?, status = 'active' WHERE email = ?`
      ).bind(password_hash, role, email).run();
      return c.json({ success: true, message: 'Admin user updated.' });
    } else {
      // Insert new admin user
      await env.DB.prepare(
        `INSERT INTO admin_users (username, email, password_hash, first_name, last_name, role, status) VALUES (?, ?, ?, ?, ?, ?, 'active')`
      ).bind(username, email, password_hash, first_name, last_name, role).run();
      return c.json({ success: true, message: 'Admin user created.' });
    }
  } catch (e) {
    return c.json({ success: false, message: 'Admin seed failed', error: (e as Error).message }, 500);
  }
});

export default app;
