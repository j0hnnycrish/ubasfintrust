import { Hono } from 'hono'
import type { Context } from 'hono'
import { cors } from 'hono/cors'
import { verifyBearer, getBearer } from './auth'
import { getNeonClient } from './neon'
import bcryptjs from 'bcryptjs'
import { initializeNotificationServices } from './services/notificationService'

export interface Env {
  DB: D1Database
  R2: R2Bucket
  APP_KV: KVNamespace
  JWT_AUD: string
  // Secrets (set via `wrangler secret put`):
  // JWT_SECRET: string
  // DATABASE_URL: string (Neon Postgres)
  // Notification service secrets
  // SENDGRID_API_KEY: string
  // MAILGUN_API_KEY: string
  // MAILGUN_DOMAIN: string
  // RESEND_API_KEY: string
  // VONAGE_API_KEY: string
  // VONAGE_API_SECRET: string
  // TEXTBELT_API_KEY: string
}

type AppEnv = { Bindings: Env }
const app = new Hono<AppEnv>()

// External Banking Service
class ExternalBankingService {
  static banks = [
    { id: 'chase', name: 'JPMorgan Chase', accountTypes: ['checking', 'savings'] },
    { id: 'bofa', name: 'Bank of America', accountTypes: ['checking', 'savings', 'credit'] },
    { id: 'wells', name: 'Wells Fargo', accountTypes: ['checking', 'savings'] },
    { id: 'citi', name: 'Citibank', accountTypes: ['checking', 'savings', 'credit'] }
  ]

  static getSupportedBanks() {
    return this.banks
  }

  static async verifyBankAccount(accountNumber: string, bankCode: string, routingNumber?: string) {
    // Simulate bank verification
    await new Promise(resolve => setTimeout(resolve, 1000))
    const bank = this.banks.find(b => b.id === bankCode)
    if (!bank) return { verified: false, error: 'Bank not supported' }
    return { verified: true, accountType: 'checking', bankName: bank.name }
  }

  static calculateTransferFee(amount: number, bankCode: string, currency: string) {
    return amount * 0.001 // 0.1% fee
  }

  static generateTransactionReference() {
    return `ext_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  static async initiateTransfer(transferData: any) {
    // Simulate transfer processing
    await new Promise(resolve => setTimeout(resolve, 2000))
    const fee = this.calculateTransferFee(transferData.amount, transferData.toBankCode, 'USD')
    return {
      transferId: this.generateTransactionReference(),
      status: 'pending',
      estimatedCompletion: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
      fee
    }
  }
}

// Credit Score Service
class CreditScoreService {
  static async calculateCreditScore(userId: string, db?: any) {
    // Simulate credit score calculation based on user activity
    const baseScore = 650
    let score = baseScore
    
    if (db) {
      try {
        const transactions = await db.prepare('SELECT * FROM transactions WHERE user_id = ?').bind(userId).all()
        const accounts = await db.prepare('SELECT * FROM accounts WHERE user_id = ?').bind(userId).all()
        
        if (accounts.results.length > 1) score += 25
        if (transactions.results.length > 10) score += 30
        
        const avgBalance = accounts.results.reduce((sum: number, acc: any) => sum + parseFloat(acc.balance), 0) / accounts.results.length
        if (avgBalance > 5000) score += 50
      } catch (e) {
        // Fallback to base score if DB query fails
      }
    }
    
    return Math.min(850, Math.max(300, score))
  }

  static generateCreditReport(score: number) {
    return {
      score,
      factors: score > 700 ? ['Good payment history', 'Low credit utilization'] : ['Limited credit history', 'Consider building savings'],
      recommendations: score > 700 ? ['Maintain current habits'] : ['Build emergency fund', 'Make consistent payments']
    }
  }

  static async assessLoanEligibility(userId: string, amount: number, db?: any) {
    const creditScore = await this.calculateCreditScore(userId, db)
    const maxLoanAmount = Math.floor(creditScore * 100) // Simple calculation
    return {
      eligible: creditScore >= 600 && amount <= maxLoanAmount,
      maxAmount: maxLoanAmount,
      creditScore,
      interestRate: creditScore > 750 ? 0.05 : creditScore > 650 ? 0.08 : 0.12
    }
  }
}

// Investment Service
class InvestmentService {
  static investmentOptions = [
    { id: 'sp500', name: 'S&P 500 Index Fund', risk: 'Medium', expectedReturn: 0.08 },
    { id: 'bonds', name: 'Government Bonds', risk: 'Low', expectedReturn: 0.03 },
    { id: 'tech', name: 'Technology ETF', risk: 'High', expectedReturn: 0.12 }
  ]

  static getInvestmentOptions() {
    return this.investmentOptions
  }

  static async createInvestment(userId: string, optionId: string, amount: number, accountId: string, db?: any) {
    const option = this.investmentOptions.find(opt => opt.id === optionId)
    if (!option) throw new Error('Invalid investment option')
    
    return {
      investmentId: `inv_${Date.now()}`,
      userId,
      optionId,
      amount,
      accountId,
      shares: amount / 100, // Simplified share calculation
      createdAt: new Date().toISOString()
    }
  }

  static async getUserPortfolio(userId: string, db?: any) {
    // Simulate portfolio retrieval
    return {
      totalValue: 10000,
      investments: [
        { id: 'inv_1', optionId: 'sp500', amount: 5000, shares: 50, currentValue: 5200 },
        { id: 'inv_2', optionId: 'bonds', amount: 3000, shares: 30, currentValue: 3090 },
        { id: 'inv_3', optionId: 'tech', amount: 2000, shares: 20, currentValue: 2240 }
      ]
    }
  }

  static calculatePortfolioValue(investments: any[]) {
    return investments.reduce((total, inv) => total + parseFloat(inv.amount), 0)
  }

  static getMarketSummary() {
    return {
      sp500: { price: 4500, change: 1.2 },
      nasdaq: { price: 15000, change: -0.8 },
      dow: { price: 35000, change: 0.5 }
    }
  }
}

app.use('*', cors({
  origin: [
    'https://ubasfintrust.vercel.app', 
    'https://ubasfintrust.netlify.app', 
    'http://localhost:3000', 
    'http://localhost:5173',
    'http://localhost:8080',
    'https://9a56a946.ubasfintrust.pages.dev',
    'https://9ce0638c.ubasfintrust.pages.dev',
    /.*\.ubasfintrust\.pages\.dev$/
  ],
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization', 'Idempotency-Key'],
  credentials: true
}))

// Initialize services
let notificationService: any

const initializeServices = (env: Env) => {
  if (!notificationService) {
    notificationService = initializeNotificationServices(env)
  }
}

// Simple fixed-window rate limiter using KV
async function rateLimit(c: Context<AppEnv>, next: () => Promise<void>) {
  // Bypass for health endpoints
  const path = new URL(c.req.url).pathname
  if (path.startsWith('/health')) {
    await next()
    return
  }
  // Only protect API routes
  if (!path.startsWith('/api/')) {
    await next()
    return
  }
  try {
    const windowSec = Number((c.env as any).RATE_LIMIT_WINDOW_SEC || '60')
    const max = Number((c.env as any).RATE_LIMIT_MAX || '60')
    const now = Math.floor(Date.now() / 1000)
    const windowStart = now - (now % windowSec)
    // Basic key: ip + path window; for Workers, use cf-connecting-ip header as best-effort
    const ip = c.req.header('cf-connecting-ip') || c.req.header('x-forwarded-for') || 'anon'
    const key = `rl:${ip}:${path}:${windowStart}`
    const current = await c.env.APP_KV.get(key)
    let count = current ? Number(current) : 0
    if (count >= max) {
      // Too Many Requests
      return c.json({ success: false, message: 'Rate limit exceeded' }, 429)
    }
    count += 1
    const ttl = windowStart + windowSec - now
    await c.env.APP_KV.put(key, String(count), { expirationTtl: Math.max(1, ttl) })
  } catch {
    // Fail-open on KV issues
  }
  await next()
}

// Apply rate limiting to API routes except dev mint
app.use('/api/*', rateLimit)

// ===== HEALTH ENDPOINTS =====
app.get('/health', (c: Context<AppEnv>) => c.json({ ok: true }))
app.get('/health/readiness', async (c: Context<AppEnv>) => {
  try {
    // lightweight readiness check: read a simple key from KV
    await c.env.APP_KV.get('readiness_probe')
    return c.json({ ok: true })
  } catch (e) {
    return c.json({ ok: false, error: String(e) }, 500)
  }
})

// ===== AUTHENTICATION ENDPOINTS =====

// Whoami: decode token and return minimal identity (no DB)
app.get('/api/v1/auth/whoami', async (c: Context<AppEnv>) => {
  try {
    const token = getBearer(c.req.raw)
    if (!token) return c.json({ authenticated: false }, 200)
    const jwtSecret = (c.env as any).JWT_SECRET as string | undefined
    if (!jwtSecret) return c.json({ authenticated: false }, 200)
    const payload = await verifyBearer(token, jwtSecret, c.env.JWT_AUD)
    const { id, email, aud } = payload as any
    return c.json({ authenticated: true, id, email, aud })
  } catch {
    return c.json({ authenticated: false }, 200)
  }
})

// Password login → issues JWT on success
app.post('/api/v1/auth/login', async (c: Context<AppEnv>) => {
  try {
    const { email, password } = await c.req.json().catch(() => ({}))
    if (!email || !password) return c.json({ success: false, message: 'email and password required' }, 400)
    const jwtSecret = (c.env as any).JWT_SECRET as string | undefined
    if (!jwtSecret) return c.json({ success: false, message: 'JWT secret not configured' }, 500)
    const databaseUrl = (c.env as any).DATABASE_URL as string | undefined
    const sql = getNeonClient(databaseUrl)
    if (!sql) return c.json({ success: false, message: 'DB not configured' }, 500)

    const rows = await sql`
      SELECT id, email, password_hash, COALESCE(role, 'user') AS role
      FROM users
      WHERE email = ${email}
      LIMIT 1
    `
    const user = (rows as any)[0]
    if (!user || !user.password_hash) return c.json({ success: false, message: 'Invalid credentials' }, 401)
    const ok = await bcryptjs.compare(password, user.password_hash)
    if (!ok) return c.json({ success: false, message: 'Invalid credentials' }, 401)

    const key = new TextEncoder().encode(jwtSecret)
    const { SignJWT } = await import('jose')
    const token = await new SignJWT({ id: user.id, email: user.email, role: user.role, aud: c.env.JWT_AUD })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('7d')
      .sign(key)
    return c.json({ success: true, token })
  } catch (e) {
    return c.json({ success: false, message: 'Login failed' }, 500)
  }
})

// Admin login endpoint (same as regular login but explicit for frontend)
app.post('/api/v1/auth/admin/login', async (c: Context<AppEnv>) => {
  try {
    const { email, password } = await c.req.json().catch(() => ({}))
    if (!email || !password) return c.json({ success: false, message: 'email and password required' }, 400)
    const jwtSecret = (c.env as any).JWT_SECRET as string | undefined
    if (!jwtSecret) return c.json({ success: false, message: 'JWT secret not configured' }, 500)
    const databaseUrl = (c.env as any).DATABASE_URL as string | undefined
    const sql = getNeonClient(databaseUrl)
    if (!sql) return c.json({ success: false, message: 'DB not configured' }, 500)

    const rows = await sql`
      SELECT id, email, password_hash, COALESCE(role, 'user') AS role
      FROM users
      WHERE email = ${email}
      LIMIT 1
    `
    const user = (rows as any)[0]
    if (!user || !user.password_hash) return c.json({ success: false, message: 'Invalid credentials' }, 401)
    
    // Check if user has admin role
    if (user.role !== 'admin') return c.json({ success: false, message: 'Access denied - admin role required' }, 403)
    
    const ok = await bcryptjs.compare(password, user.password_hash)
    if (!ok) return c.json({ success: false, message: 'Invalid credentials' }, 401)

    const key = new TextEncoder().encode(jwtSecret)
    const { SignJWT } = await import('jose')
    const token = await new SignJWT({ id: user.id, email: user.email, role: user.role, aud: c.env.JWT_AUD })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('7d')
      .sign(key)
    return c.json({ success: true, token, user: { id: user.id, email: user.email, role: user.role } })
  } catch (e) {
    return c.json({ success: false, message: 'Admin login failed' }, 500)
  }
})

// Register: create user with hashed password (Neon only)
app.post('/api/v1/auth/register', async (c: Context<AppEnv>) => {
  try {
    initializeServices(c.env)
    const { email, password, first_name = null, last_name = null } = await c.req.json().catch(() => ({}))
    if (!email || !password) return c.json({ success: false, message: 'email and password required' }, 400)
    const databaseUrl = (c.env as any).DATABASE_URL as string | undefined
    const sql = getNeonClient(databaseUrl)
    if (!sql) return c.json({ success: false, message: 'DB not configured' }, 500)
    // Check exists
    const exists = await sql`SELECT 1 FROM users WHERE email = ${email} LIMIT 1`
    if ((exists as any[])[0]) return c.json({ success: false, message: 'email already registered' }, 409)
    // Hash and insert
    const salt = bcryptjs.genSaltSync(10)
    const hash = bcryptjs.hashSync(password, salt)
    const id = crypto.randomUUID()
    await sql`INSERT INTO users (id, email, first_name, last_name, password_hash, role, is_verified)
              VALUES (${id}, ${email}, ${first_name}, ${last_name}, ${hash}, 'user', true)`
    
    // Send welcome notification
    notificationService.sendNotification({
      userId: id,
      type: 'account',
      priority: 'medium',
      title: 'Welcome to UBAS Financial Trust',
      message: 'Your account has been created successfully. Welcome to our banking platform!',
      channels: ['email', 'in_app']
    })
    
    return c.json({ success: true })
  } catch (e) {
    return c.json({ success: false, message: 'Registration failed' }, 500)
  }
})

// Change password: requires auth, verifies current password
app.post('/api/v1/auth/change-password', async (c: Context<AppEnv>) => {
  try {
    initializeServices(c.env)
    const token = getBearer(c.req.raw)
    if (!token) return c.json({ success: false, message: 'Unauthorized' }, 401)
    const jwtSecret = (c.env as any).JWT_SECRET as string | undefined
    if (!jwtSecret) return c.json({ success: false, message: 'JWT secret not configured' }, 500)
    const payload = await verifyBearer(token, jwtSecret, c.env.JWT_AUD)
    const userId = (payload as any).id as string
    if (!userId) return c.json({ success: false, message: 'Unauthorized' }, 401)

    const { currentPassword, newPassword } = await c.req.json().catch(() => ({}))
    if (!currentPassword || !newPassword) return c.json({ success: false, message: 'currentPassword and newPassword required' }, 400)

    const databaseUrl = (c.env as any).DATABASE_URL as string | undefined
    const sql = getNeonClient(databaseUrl)
    if (!sql) return c.json({ success: false, message: 'DB not configured' }, 500)
    const rows = await sql`SELECT password_hash FROM users WHERE id = ${userId} LIMIT 1`
    const rec = (rows as any)[0]
    if (!rec || !rec.password_hash) return c.json({ success: false, message: 'No password set' }, 400)
    const ok = await bcryptjs.compare(currentPassword, rec.password_hash)
    if (!ok) return c.json({ success: false, message: 'Invalid current password' }, 401)
    const salt = bcryptjs.genSaltSync(10)
    const hash = bcryptjs.hashSync(newPassword, salt)
    await sql`UPDATE users SET password_hash = ${hash} WHERE id = ${userId}`
    
    // Send security notification
    notificationService.sendSecurityNotification(userId, 'Password Changed', 'Your account password has been successfully updated')
    
    return c.json({ success: true })
  } catch (e) {
    return c.json({ success: false, message: 'Change password failed' }, 500)
  }
})

// ===== USER PROFILE AND ACCOUNT MANAGEMENT =====

// Users: profile (mapped from server/src/routes/users.ts GET /profile)
app.get('/api/v1/users/profile', async (c: Context<AppEnv>) => {
  try {
    const token = getBearer(c.req.raw)
    if (!token) return c.json({ success: false, message: 'Unauthorized' }, 401)
    const jwtSecret = (c.env as any).JWT_SECRET as string | undefined
    if (!jwtSecret) return c.json({ success: false, message: 'JWT secret not configured' }, 500)
    const payload = await verifyBearer(token, jwtSecret, c.env.JWT_AUD)
    const userId = (payload.id as string) || ''
    if (!userId) return c.json({ success: false, message: 'Invalid token' }, 401)

    // Prefer Neon Postgres if available
   const databaseUrl = (c.env as any).DATABASE_URL as string | undefined
   const sql = getNeonClient(databaseUrl)
   if (sql) {
    const rows = await sql`SELECT id, email, first_name, last_name, phone, date_of_birth, account_type, kyc_status, is_verified, two_factor_enabled, created_at
      FROM users WHERE id = ${userId} LIMIT 1`
    const userProfile = Array.isArray(rows) ? (rows as any)[0] : (rows as any)[0]
      if (!userProfile) {
        return c.json({ success: false, message: 'User not found' }, 404)
      }
      return c.json({ success: true, data: userProfile })
    }

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
})

// Update user profile
app.put('/api/v1/users/profile', async (c: Context<AppEnv>) => {
  try {
    const token = getBearer(c.req.raw)
    if (!token) return c.json({ success: false, message: 'Unauthorized' }, 401)
    const jwtSecret = (c.env as any).JWT_SECRET as string | undefined
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
    if (date_of_birth !== undefined) { updates.push('date_of_birth = ?'); params.push(date_of_birth) }
    
    if (updates.length === 0) {
      return c.json({ success: false, message: 'No fields to update' }, 400)
    }
    
    await c.env.DB.prepare(`
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

// Users: accounts (subset of GET /accounts logic from server)
app.get('/api/v1/users/accounts', async (c: Context<AppEnv>) => {
  try {
    const token = getBearer(c.req.raw)
    if (!token) return c.json({ success: false, message: 'Unauthorized' }, 401)
    const jwtSecret = (c.env as any).JWT_SECRET as string | undefined
    if (!jwtSecret) return c.json({ success: false, message: 'JWT secret not configured' }, 500)
    const payload = await verifyBearer(token, jwtSecret, c.env.JWT_AUD)
    const userId = (payload.id as string) || ''
    if (!userId) return c.json({ success: false, message: 'Invalid token' }, 401)

   const databaseUrl = (c.env as any).DATABASE_URL as string | undefined
   const sql = getNeonClient(databaseUrl)
   if (sql) {
    const rows = await sql`SELECT id, account_number, account_type, balance, available_balance, currency, status, created_at
      FROM accounts WHERE user_id = ${userId} AND status = 'active' ORDER BY created_at DESC`
    return c.json({ success: true, data: (rows as any) || [] })
    }

    try {
      const { results } = await c.env.DB.prepare(
        `SELECT id, account_number, account_type, balance, available_balance, currency, status, created_at
         FROM accounts WHERE user_id = ? AND status = 'active' ORDER BY created_at DESC`
      ).bind(userId).all()
      return c.json({ success: true, data: results || [] })
    } catch {
      return c.json({ success: true, data: [] })
    }
  } catch (err) {
    return c.json({ success: false, message: 'Unauthorized' }, 401)
  }
})

// ===== BANKING OPERATIONS =====

// Create new account for user
app.post('/api/v1/accounts', async (c: Context<AppEnv>) => {
  try {
    initializeServices(c.env)
    const token = getBearer(c.req.raw)
    if (!token) return c.json({ success: false, message: 'Unauthorized' }, 401)
    const jwtSecret = (c.env as any).JWT_SECRET as string | undefined
    if (!jwtSecret) return c.json({ success: false, message: 'JWT secret not configured' }, 500)
    const payload = await verifyBearer(token, jwtSecret, c.env.JWT_AUD)
    const userId = (payload as any).id as string

    const { account_type = 'savings', currency = 'USD', initial_balance = 10000 } = await c.req.json().catch(() => ({}))
    
    // Generate account number
    const accountNumber = `${account_type.toUpperCase()}${Date.now()}${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`
    const accountId = crypto.randomUUID()
    
    // Create account in D1
    await c.env.DB.prepare(`
      INSERT INTO accounts (id, user_id, account_number, account_type, balance, available_balance, currency, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, 'active')
    `).bind(accountId, userId, accountNumber, account_type, initial_balance, initial_balance, currency).run()
    
    // Send notification
    notificationService.sendNotification({
      userId,
      type: 'account',
      priority: 'medium',
      title: 'New Account Created',
      message: `Your ${account_type} account ${accountNumber} has been created successfully with initial balance of ${currency} ${initial_balance.toLocaleString()}.`,
      channels: ['email', 'sms', 'in_app'],
      data: { accountId, accountNumber, account_type, initial_balance }
    })
    
    return c.json({ 
      success: true, 
      account: {
        id: accountId,
        account_number: accountNumber,
        account_type,
        balance: initial_balance,
        currency,
        status: 'active'
      }
    })
  } catch (e) {
    const error = e instanceof Error ? e.message : 'Unknown error'
    return c.json({ success: false, message: 'Failed to create account', error }, 500)
  }
})

// Get account details
app.get('/api/v1/accounts/:id', async (c: Context<AppEnv>) => {
  try {
    const token = getBearer(c.req.raw)
    if (!token) return c.json({ success: false, message: 'Unauthorized' }, 401)
    const jwtSecret = (c.env as any).JWT_SECRET as string | undefined
    if (!jwtSecret) return c.json({ success: false, message: 'JWT secret not configured' }, 500)
    const payload = await verifyBearer(token, jwtSecret, c.env.JWT_AUD)
    const userId = (payload as any).id as string
    const accountId = c.req.param('id')

    const account = await c.env.DB.prepare(`
      SELECT * FROM accounts WHERE id = ? AND user_id = ?
    `).bind(accountId, userId).first()
    
    if (!account) {
      return c.json({ success: false, message: 'Account not found' }, 404)
    }
    
    return c.json({ success: true, account })
  } catch (e) {
    const error = e instanceof Error ? e.message : 'Unknown error'
    return c.json({ success: false, message: 'Failed to get account', error }, 500)
  }
})

// Deposit money (simulated)
app.post('/api/v1/accounts/:id/deposit', async (c: Context<AppEnv>) => {
  try {
    initializeServices(c.env)
    const token = getBearer(c.req.raw)
    if (!token) return c.json({ success: false, message: 'Unauthorized' }, 401)
    const jwtSecret = (c.env as any).JWT_SECRET as string | undefined
    if (!jwtSecret) return c.json({ success: false, message: 'JWT secret not configured' }, 500)
    const payload = await verifyBearer(token, jwtSecret, c.env.JWT_AUD)
    const userId = (payload as any).id as string
    const accountId = c.req.param('id')

    const { amount, description = 'Deposit' } = await c.req.json().catch(() => ({}))
    
    if (!amount || amount <= 0) {
      return c.json({ success: false, message: 'Valid amount required' }, 400)
    }

    // Verify user owns the account
    const account = await c.env.DB.prepare(`
      SELECT * FROM accounts WHERE id = ? AND user_id = ?
    `).bind(accountId, userId).first()
    
    if (!account) {
      return c.json({ success: false, message: 'Account not found' }, 404)
    }

    const txId = crypto.randomUUID()
    
    // Update account balance
    await c.env.DB.prepare(`
      UPDATE accounts 
      SET balance = balance + ?, available_balance = available_balance + ?
      WHERE id = ?
    `).bind(amount, amount, accountId).run()
    
    // Record transaction
    await c.env.DB.prepare(`
      INSERT INTO transactions (id, to_account_id, amount, currency, type, status, created_at)
      VALUES (?, ?, ?, ?, 'deposit', 'completed', datetime('now'))
    `).bind(txId, accountId, amount, (account as any).currency).run()
    
    // Send notification
    notificationService.sendTransactionNotification(userId, 'deposit', amount, (account as any).currency)
    
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
app.post('/api/v1/accounts/:id/withdraw', async (c: Context<AppEnv>) => {
  try {
    initializeServices(c.env)
    const token = getBearer(c.req.raw)
    if (!token) return c.json({ success: false, message: 'Unauthorized' }, 401)
    const jwtSecret = (c.env as any).JWT_SECRET as string | undefined
    if (!jwtSecret) return c.json({ success: false, message: 'JWT secret not configured' }, 500)
    const payload = await verifyBearer(token, jwtSecret, c.env.JWT_AUD)
    const userId = (payload as any).id as string
    const accountId = c.req.param('id')

    const { amount, description = 'Withdrawal' } = await c.req.json().catch(() => ({}))
    
    if (!amount || amount <= 0) {
      return c.json({ success: false, message: 'Valid amount required' }, 400)
    }

    // Verify user owns the account and has sufficient balance
    const account = await c.env.DB.prepare(`
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
    await c.env.DB.prepare(`
      UPDATE accounts 
      SET balance = balance - ?, available_balance = available_balance - ?
      WHERE id = ?
    `).bind(amount, amount, accountId).run()
    
    // Record transaction
    await c.env.DB.prepare(`
      INSERT INTO transactions (id, from_account_id, amount, currency, type, status, created_at)
      VALUES (?, ?, ?, ?, 'withdrawal', 'completed', datetime('now'))
    `).bind(txId, accountId, amount, (account as any).currency).run()
    
    // Send notification
    notificationService.sendTransactionNotification(userId, 'withdrawal', amount, (account as any).currency)
    
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

// KYC submission endpoint - handles multipart form with documents
app.post('/api/v1/kyc/submit', async (c: Context<AppEnv>) => {
  try {
    // Auth check
    const token = getBearer(c.req.raw)
    if (!token) return c.json({ success: false, message: 'Unauthorized' }, 401)
    const jwtSecret = (c.env as any).JWT_SECRET as string | undefined
    if (!jwtSecret) return c.json({ success: false, message: 'JWT secret not configured' }, 500)
    const payload = await verifyBearer(token, jwtSecret, c.env.JWT_AUD)
    const userId = payload?.id as string | undefined
    if (!userId) return c.json({ success: false, message: 'Invalid token' }, 401)

    const form = await c.req.parseBody()
    
    // Validate required fields
    const requiredFields = [
      'personal_firstName', 'personal_lastName', 'personal_dateOfBirth', 'personal_nationality',
      'address_street', 'address_city', 'address_state', 'address_country',
      'employment_status', 'employment_monthlyIncome',
      'agreement_terms', 'agreement_privacy'
    ]
    
    for (const field of requiredFields) {
      if (!form[field]) {
        return c.json({ 
          success: false, 
          error: `${field.replace('_', ' ')} is required` 
        }, 400)
      }
    }
    
    // Check agreements
    if (form['agreement_terms'] !== 'true' || form['agreement_privacy'] !== 'true') {
      return c.json({ 
        success: false, 
        error: 'You must accept the terms and privacy policy' 
      }, 400)
    }

    const kycId = crypto.randomUUID()
    const uploadedDocs: string[] = []

    // Handle document uploads to R2
    const docTypes = ['document_primaryId', 'document_proofOfAddress', 'document_incomeProof', 'document_bankStatement', 'document_selfie']
    
    for (const docType of docTypes) {
      const file = form[docType] as File | undefined
      if (file) {
        // Validate file type and size
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf']
        if (!allowedTypes.includes(file.type)) {
          return c.json({ 
            success: false, 
            error: `Invalid file type for ${docType}. Only JPEG, PNG, GIF, and PDF are allowed.` 
          }, 400)
        }
        
        if (file.size > 5 * 1024 * 1024) { // 5MB limit
          return c.json({ 
            success: false, 
            error: `File size for ${docType} must be less than 5MB` 
          }, 400)
        }

        // Upload to R2 (if available)
        if (c.env.R2) {
          const key = `kyc/${userId}/${kycId}/${docType}-${Date.now()}-${file.name}`
          await c.env.R2.put(key, await file.arrayBuffer(), {
            httpMetadata: { contentType: file.type },
          })
          uploadedDocs.push(docType)
          
          // Store document record in database (D1 only for now)
          await c.env.DB.prepare(`
            INSERT INTO kyc_documents (id, user_id, kyc_application_id, document_type, file_path, file_name, file_size, mime_type, verification_status, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'pending', ?)
          `).bind(crypto.randomUUID(), userId, kycId, docType, key, file.name, file.size, file.type, new Date().toISOString()).run()
        } else {
          // For now, just log that we received the file (R2 not enabled)
          console.log(`Received ${docType}: ${file.name} (${file.size} bytes)`)
          uploadedDocs.push(docType)
        }
      }
    }

    // Create KYC application record
    const kycData = {
      id: kycId,
      user_id: userId,
      personal_firstName: form['personal_firstName'],
      personal_lastName: form['personal_lastName'],
      personal_dateOfBirth: form['personal_dateOfBirth'],
      personal_nationality: form['personal_nationality'],
      address_street: form['address_street'],
      address_city: form['address_city'],
      address_state: form['address_state'],
      address_country: form['address_country'],
      employment_status: form['employment_status'],
      employment_monthlyIncome: parseFloat(form['employment_monthlyIncome'] as string),
      status: 'in_progress',
      submitted_at: new Date().toISOString(),
      created_at: new Date().toISOString()
    }

    // Store in D1 database
    await c.env.DB.prepare(`
      INSERT INTO kyc_applications (
        id, user_id, personal_firstName, personal_lastName, personal_dateOfBirth, personal_nationality,
        address_street, address_city, address_state, address_country,
        employment_status, employment_monthlyIncome, status, submitted_at, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      kycData.id, kycData.user_id, kycData.personal_firstName, kycData.personal_lastName,
      kycData.personal_dateOfBirth, kycData.personal_nationality,
      kycData.address_street, kycData.address_city, kycData.address_state, kycData.address_country,
      kycData.employment_status, kycData.employment_monthlyIncome, kycData.status, kycData.submitted_at, kycData.created_at
    ).run()

    // Update user KYC status
    await c.env.DB.prepare('UPDATE users SET kyc_status = ?, updated_at = ? WHERE id = ?')
      .bind('in_progress', new Date().toISOString(), userId).run()

    return c.json({
      success: true,
      message: 'KYC application submitted successfully',
      data: {
        kycId,
        status: 'in_progress',
        documentsUploaded: uploadedDocs
      }
    })

  } catch (error) {
    console.error('KYC submission error:', error)
    return c.json({
      success: false,
      error: 'Failed to submit KYC application'
    }, 500)
  }
})

// Alternative endpoint for legacy frontend calls
app.post('/kyc/submit', async (c: Context<AppEnv>) => {
  // Duplicate the logic here for simplicity
  try {
    // Auth check
    const token = getBearer(c.req.raw)
    if (!token) return c.json({ success: false, message: 'Unauthorized' }, 401)
    const jwtSecret = (c.env as any).JWT_SECRET as string | undefined
    if (!jwtSecret) return c.json({ success: false, message: 'JWT secret not configured' }, 500)
    const payload = await verifyBearer(token, jwtSecret, c.env.JWT_AUD)
    const userId = payload?.id as string | undefined
    if (!userId) return c.json({ success: false, message: 'Invalid token' }, 401)

    const form = await c.req.parseBody()
    
    // Validate required fields
    const requiredFields = [
      'personal_firstName', 'personal_lastName', 'personal_dateOfBirth', 'personal_nationality',
      'address_street', 'address_city', 'address_state', 'address_country',
      'employment_status', 'employment_monthlyIncome',
      'agreement_terms', 'agreement_privacy'
    ]
    
    for (const field of requiredFields) {
      if (!form[field]) {
        return c.json({ 
          success: false, 
          error: `${field.replace('_', ' ')} is required` 
        }, 400)
      }
    }
    
    // Check agreements
    if (form['agreement_terms'] !== 'true' || form['agreement_privacy'] !== 'true') {
      return c.json({ 
        success: false, 
        error: 'You must accept the terms and privacy policy' 
      }, 400)
    }

    const kycId = crypto.randomUUID()
    const uploadedDocs: string[] = []

    // Handle document uploads to R2
    const docTypes = ['document_primaryId', 'document_proofOfAddress', 'document_incomeProof', 'document_bankStatement', 'document_selfie']
    
    for (const docType of docTypes) {
      const file = form[docType] as File | undefined
      if (file) {
        // Validate file type and size
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf']
        if (!allowedTypes.includes(file.type)) {
          return c.json({ 
            success: false, 
            error: `Invalid file type for ${docType}. Only JPEG, PNG, GIF, and PDF are allowed.` 
          }, 400)
        }
        
        if (file.size > 5 * 1024 * 1024) { // 5MB limit
          return c.json({ 
            success: false, 
            error: `File size for ${docType} must be less than 5MB` 
          }, 400)
        }

        // Upload to R2 (if available)
        if (c.env.R2) {
          const key = `kyc/${userId}/${kycId}/${docType}-${Date.now()}-${file.name}`
          await c.env.R2.put(key, await file.arrayBuffer(), {
            httpMetadata: { contentType: file.type },
          })
          uploadedDocs.push(docType)
          
          // Store document record in database (D1 only for now)
          await c.env.DB.prepare(`
            INSERT INTO kyc_documents (id, user_id, kyc_application_id, document_type, file_path, file_name, file_size, mime_type, verification_status, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'pending', ?)
          `).bind(crypto.randomUUID(), userId, kycId, docType, key, file.name, file.size, file.type, new Date().toISOString()).run()
        } else {
          // For now, just log that we received the file (R2 not enabled)
          console.log(`Received ${docType}: ${file.name} (${file.size} bytes)`)
          uploadedDocs.push(docType)
        }
      }
    }

    // Create KYC application record
    const kycData = {
      id: kycId,
      user_id: userId,
      personal_firstName: form['personal_firstName'],
      personal_lastName: form['personal_lastName'],
      personal_dateOfBirth: form['personal_dateOfBirth'],
      personal_nationality: form['personal_nationality'],
      address_street: form['address_street'],
      address_city: form['address_city'],
      address_state: form['address_state'],
      address_country: form['address_country'],
      employment_status: form['employment_status'],
      employment_monthlyIncome: parseFloat(form['employment_monthlyIncome'] as string),
      status: 'in_progress',
      submitted_at: new Date().toISOString(),
      created_at: new Date().toISOString()
    }

    // Store in D1 database
    await c.env.DB.prepare(`
      INSERT INTO kyc_applications (
        id, user_id, personal_firstName, personal_lastName, personal_dateOfBirth, personal_nationality,
        address_street, address_city, address_state, address_country,
        employment_status, employment_monthlyIncome, status, submitted_at, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      kycData.id, kycData.user_id, kycData.personal_firstName, kycData.personal_lastName,
      kycData.personal_dateOfBirth, kycData.personal_nationality,
      kycData.address_street, kycData.address_city, kycData.address_state, kycData.address_country,
      kycData.employment_status, kycData.employment_monthlyIncome, kycData.status, kycData.submitted_at, kycData.created_at
    ).run()

    // Update user KYC status
    await c.env.DB.prepare('UPDATE users SET kyc_status = ?, updated_at = ? WHERE id = ?')
      .bind('in_progress', new Date().toISOString(), userId).run()

    return c.json({
      success: true,
      message: 'KYC application submitted successfully',
      data: {
        kycId,
        status: 'in_progress',
        documentsUploaded: uploadedDocs
      }
    })

  } catch (error) {
    console.error('KYC submission error:', error)
    return c.json({
      success: false,
      error: 'Failed to submit KYC application'
    }, 500)
  }
})

// Debug endpoint to check database schema
app.get('/api/v1/debug/schema', async (c: Context<AppEnv>) => {
  try {
    const databaseUrl = (c.env as any).DATABASE_URL as string | undefined
    const sql = getNeonClient(databaseUrl)
    if (!sql) return c.json({ error: 'DB not configured' }, 500)
    
    const schema = await sql`
      SELECT column_name, data_type, column_default 
      FROM information_schema.columns 
      WHERE table_name = 'users' 
      ORDER BY ordinal_position
    `
    
    const users = await sql`SELECT id, email, role, is_verified FROM users LIMIT 5`
    
    return c.json({ schema, users })
  } catch (e) {
    return c.json({ error: String(e) }, 500)
  }
})

// Bootstrap admin user (only works if no admin exists)
app.post('/api/v1/auth/bootstrap-admin', async (c: Context<AppEnv>) => {
  try {
    const { email = 'admin@ubasfintrust.com', password = 'AdminBootstrap123!' } = await c.req.json().catch(() => ({}))
    const databaseUrl = (c.env as any).DATABASE_URL as string | undefined
    const sql = getNeonClient(databaseUrl)
    if (!sql) return c.json({ success: false, message: 'DB not configured' }, 500)
    
    // Check if any admin already exists
    const existingAdmin = await sql`SELECT 1 FROM users WHERE role = 'admin' LIMIT 1`
    if ((existingAdmin as any[])[0]) {
      return c.json({ success: false, message: 'Admin user already exists' }, 403)
    }
    
    // Create first admin user
    const salt = bcryptjs.genSaltSync(10)
    const hash = bcryptjs.hashSync(password, salt)
    const id = crypto.randomUUID()
    await sql`INSERT INTO users (id, email, first_name, last_name, password_hash, role, is_verified)
              VALUES (${id}, ${email}, 'System', 'Administrator', ${hash}, 'admin', true)`
    
    return c.json({ success: true, message: 'Admin user created successfully', email })
  } catch (e) {
    return c.json({ success: false, message: 'Failed to create admin user' }, 500)
  }
})

export default app

// Users: profile (mapped from server/src/routes/users.ts GET /profile)
app.get('/api/v1/users/profile', async (c: Context<AppEnv>) => {
  try {
    const token = getBearer(c.req.raw)
    if (!token) return c.json({ success: false, message: 'Unauthorized' }, 401)
    const jwtSecret = (c.env as any).JWT_SECRET as string | undefined
    if (!jwtSecret) return c.json({ success: false, message: 'JWT secret not configured' }, 500)
    const payload = await verifyBearer(token, jwtSecret, c.env.JWT_AUD)
    const userId = (payload.id as string) || ''
    if (!userId) return c.json({ success: false, message: 'Invalid token' }, 401)

    // Prefer Neon Postgres if available
   const databaseUrl = (c.env as any).DATABASE_URL as string | undefined
   const sql = getNeonClient(databaseUrl)
   if (sql) {
    const rows = await sql`SELECT id, email, first_name, last_name, phone, date_of_birth, account_type, kyc_status, is_verified, two_factor_enabled, created_at
      FROM users WHERE id = ${userId} LIMIT 1`
    const userProfile = Array.isArray(rows) ? (rows as any)[0] : (rows as any)[0]
      if (!userProfile) {
        return c.json({ success: false, message: 'User not found' }, 404)
      }
      return c.json({ success: true, data: userProfile })
    }

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
})

// Users: accounts (subset of GET /accounts logic from server)
app.get('/api/v1/users/accounts', async (c: Context<AppEnv>) => {
  try {
    const token = getBearer(c.req.raw)
    if (!token) return c.json({ success: false, message: 'Unauthorized' }, 401)
    const jwtSecret = (c.env as any).JWT_SECRET as string | undefined
    if (!jwtSecret) return c.json({ success: false, message: 'JWT secret not configured' }, 500)
    const payload = await verifyBearer(token, jwtSecret, c.env.JWT_AUD)
    const userId = (payload.id as string) || ''
    if (!userId) return c.json({ success: false, message: 'Invalid token' }, 401)

   const databaseUrl = (c.env as any).DATABASE_URL as string | undefined
   const sql = getNeonClient(databaseUrl)
   if (sql) {
    const rows = await sql`SELECT id, account_number, account_type, balance, available_balance, currency, status, created_at
      FROM accounts WHERE user_id = ${userId} AND status = 'active' ORDER BY created_at DESC`
    return c.json({ success: true, data: (rows as any) || [] })
    }

    try {
      const { results } = await c.env.DB.prepare(
        `SELECT id, account_number, account_type, balance, available_balance, currency, status, created_at
         FROM accounts WHERE user_id = ? AND status = 'active' ORDER BY created_at DESC`
      ).bind(userId).all()
      return c.json({ success: true, data: results || [] })
    } catch {
      return c.json({ success: true, data: [] })
    }
  } catch (err) {
    return c.json({ success: false, message: 'Unauthorized' }, 401)
  }
})

// Whoami: decode token and return minimal identity (no DB)
app.get('/api/v1/auth/whoami', async (c: Context<AppEnv>) => {
  try {
    const token = getBearer(c.req.raw)
    if (!token) return c.json({ authenticated: false }, 200)
    const jwtSecret = (c.env as any).JWT_SECRET as string | undefined
    if (!jwtSecret) return c.json({ authenticated: false }, 200)
    const payload = await verifyBearer(token, jwtSecret, c.env.JWT_AUD)
    const { id, email, aud } = payload as any
    return c.json({ authenticated: true, id, email, aud })
  } catch {
    return c.json({ authenticated: false }, 200)
  }
})

// Password login → issues JWT on success
app.post('/api/v1/auth/login', async (c: Context<AppEnv>) => {
  try {
    const { email, password } = await c.req.json().catch(() => ({}))
    if (!email || !password) return c.json({ success: false, message: 'email and password required' }, 400)
    const jwtSecret = (c.env as any).JWT_SECRET as string | undefined
    if (!jwtSecret) return c.json({ success: false, message: 'JWT secret not configured' }, 500)
    const databaseUrl = (c.env as any).DATABASE_URL as string | undefined
    const sql = getNeonClient(databaseUrl)
    if (!sql) return c.json({ success: false, message: 'DB not configured' }, 500)

    const rows = await sql`
      SELECT id, email, password_hash, COALESCE(role, 'user') AS role
      FROM users
      WHERE email = ${email}
      LIMIT 1
    `
    const user = (rows as any)[0]
    if (!user || !user.password_hash) return c.json({ success: false, message: 'Invalid credentials' }, 401)
    const ok = await bcryptjs.compare(password, user.password_hash)
    if (!ok) return c.json({ success: false, message: 'Invalid credentials' }, 401)

    const key = new TextEncoder().encode(jwtSecret)
    const { SignJWT } = await import('jose')
    const token = await new SignJWT({ id: user.id, email: user.email, role: user.role, aud: c.env.JWT_AUD })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('7d')
      .sign(key)
    return c.json({ success: true, token })
  } catch (e) {
    return c.json({ success: false, message: 'Login failed' }, 500)
  }
})

// Register: create user with hashed password (Neon only)
app.post('/api/v1/auth/register', async (c: Context<AppEnv>) => {
  try {
    const { email, password, first_name = null, last_name = null } = await c.req.json().catch(() => ({}))
    if (!email || !password) return c.json({ success: false, message: 'email and password required' }, 400)
    const databaseUrl = (c.env as any).DATABASE_URL as string | undefined
    const sql = getNeonClient(databaseUrl)
    if (!sql) return c.json({ success: false, message: 'DB not configured' }, 500)
    // Check exists
    const exists = await sql`SELECT 1 FROM users WHERE email = ${email} LIMIT 1`
    if ((exists as any[])[0]) return c.json({ success: false, message: 'email already registered' }, 409)
    // Hash and insert
    const salt = bcryptjs.genSaltSync(10)
    const hash = bcryptjs.hashSync(password, salt)
    const id = crypto.randomUUID()
    await sql`INSERT INTO users (id, email, first_name, last_name, password_hash, role, is_verified)
              VALUES (${id}, ${email}, ${first_name}, ${last_name}, ${hash}, 'user', true)`
    return c.json({ success: true })
  } catch (e) {
    return c.json({ success: false, message: 'Registration failed' }, 500)
  }
})

// Change password: requires auth, verifies current password
app.post('/api/v1/auth/change-password', async (c: Context<AppEnv>) => {
  try {
    const token = getBearer(c.req.raw)
    if (!token) return c.json({ success: false, message: 'Unauthorized' }, 401)
    const jwtSecret = (c.env as any).JWT_SECRET as string | undefined
    if (!jwtSecret) return c.json({ success: false, message: 'JWT secret not configured' }, 500)
    const payload = await verifyBearer(token, jwtSecret, c.env.JWT_AUD)
    const userId = (payload as any).id as string
    if (!userId) return c.json({ success: false, message: 'Unauthorized' }, 401)

    const { currentPassword, newPassword } = await c.req.json().catch(() => ({}))
    if (!currentPassword || !newPassword) return c.json({ success: false, message: 'currentPassword and newPassword required' }, 400)

    const databaseUrl = (c.env as any).DATABASE_URL as string | undefined
    const sql = getNeonClient(databaseUrl)
    if (!sql) return c.json({ success: false, message: 'DB not configured' }, 500)
    const rows = await sql`SELECT password_hash FROM users WHERE id = ${userId} LIMIT 1`
    const rec = (rows as any)[0]
    if (!rec || !rec.password_hash) return c.json({ success: false, message: 'No password set' }, 400)
    const ok = await bcryptjs.compare(currentPassword, rec.password_hash)
    if (!ok) return c.json({ success: false, message: 'Invalid current password' }, 401)
    const salt = bcryptjs.genSaltSync(10)
    const hash = bcryptjs.hashSync(newPassword, salt)
    await sql`UPDATE users SET password_hash = ${hash} WHERE id = ${userId}`
    return c.json({ success: true })
  } catch (e) {
    return c.json({ success: false, message: 'Change password failed' }, 500)
  }
})

// Admin: reset another user's password
app.post('/api/v1/auth/admin/reset-password', async (c: Context<AppEnv>) => {
  try {
    const token = getBearer(c.req.raw)
    if (!token) return c.json({ success: false, message: 'Unauthorized' }, 401)
    const jwtSecret = (c.env as any).JWT_SECRET as string | undefined
    if (!jwtSecret) return c.json({ success: false, message: 'JWT secret not configured' }, 500)
    const payload = await verifyBearer(token, jwtSecret, c.env.JWT_AUD)
    if ((payload as any).role !== 'admin') return c.json({ success: false, message: 'Forbidden' }, 403)

    const { userId, newPassword } = await c.req.json().catch(() => ({}))
    if (!userId || !newPassword) return c.json({ success: false, message: 'userId and newPassword required' }, 400)

    const databaseUrl = (c.env as any).DATABASE_URL as string | undefined
    const sql = getNeonClient(databaseUrl)
    if (!sql) return c.json({ success: false, message: 'DB not configured' }, 500)
    const salt = bcryptjs.genSaltSync(10)
    const hash = bcryptjs.hashSync(newPassword, salt)
    await sql`UPDATE users SET password_hash = ${hash} WHERE id = ${userId}`
    return c.json({ success: true })
  } catch (e) {
    return c.json({ success: false, message: 'Reset failed' }, 500)
  }
})
// Admin-only example route
app.get('/api/v1/admin/ping', async (c: Context<AppEnv>) => {
  try {
    const token = getBearer(c.req.raw)
    if (!token) return c.json({ success: false, message: 'Unauthorized' }, 401)
    const jwtSecret = (c.env as any).JWT_SECRET as string | undefined
    if (!jwtSecret) return c.json({ success: false, message: 'JWT secret not configured' }, 500)
    const payload = await verifyBearer(token, jwtSecret, c.env.JWT_AUD)
    if ((payload as any).role !== 'admin') return c.json({ success: false, message: 'Forbidden' }, 403)
    return c.json({ success: true, message: 'admin-ok' })
  } catch {
    return c.json({ success: false, message: 'Unauthorized' }, 401)
  }
})

// Admin: list users with optional search and pagination
app.get('/api/v1/admin/users', async (c: Context<AppEnv>) => {
  try {
    const token = getBearer(c.req.raw)
    if (!token) return c.json({ success: false, message: 'Unauthorized' }, 401)
    const jwtSecret = (c.env as any).JWT_SECRET as string | undefined
    if (!jwtSecret) return c.json({ success: false, message: 'JWT secret not configured' }, 500)
    const payload = await verifyBearer(token, jwtSecret, c.env.JWT_AUD)
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

    const rows = await c.env.DB.prepare(`
      SELECT id, email, first_name, last_name, account_type, kyc_status, is_verified, created_at
      FROM users
      ${whereClause}
      ORDER BY created_at DESC
      LIMIT ? OFFSET ?
    `).bind(...params, limit, offset).all()

    const totalResult = await c.env.DB.prepare(`
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
  }
})

// Admin: create user (optionally set role), with initial password
app.post('/api/v1/admin/users', async (c: Context<AppEnv>) => {
  try {
    const token = getBearer(c.req.raw)
    if (!token) return c.json({ success: false, message: 'Unauthorized' }, 401)
    const jwtSecret = (c.env as any).JWT_SECRET as string | undefined
    if (!jwtSecret) return c.json({ success: false, message: 'JWT secret not configured' }, 500)
    const payload = await verifyBearer(token, jwtSecret, c.env.JWT_AUD)
    if ((payload as any).role !== 'admin') return c.json({ success: false, message: 'Forbidden' }, 403)

    const { email, password, first_name = null, last_name = null, role = 'user', is_verified = true } = await c.req.json().catch(() => ({}))
    if (!email || !password) return c.json({ success: false, message: 'email and password required' }, 400)
    const databaseUrl = (c.env as any).DATABASE_URL as string | undefined
    const sql = getNeonClient(databaseUrl)
    if (!sql) return c.json({ success: false, message: 'DB not configured' }, 500)
    // Check exists
    const exists = await sql`SELECT 1 FROM users WHERE email = ${email} LIMIT 1`
    if ((exists as any[])[0]) return c.json({ success: false, message: 'email already exists' }, 409)
    const salt = bcryptjs.genSaltSync(10)
    const hash = bcryptjs.hashSync(password, salt)
    const id = crypto.randomUUID()
    await sql`INSERT INTO users (id, email, first_name, last_name, password_hash, role, is_verified)
              VALUES (${id}, ${email}, ${first_name}, ${last_name}, ${hash}, ${role}, ${is_verified})`
    return c.json({ success: true, id })
  } catch (e) {
    return c.json({ success: false, message: 'Failed to create user' }, 500)
  }
})

// Admin: update user by ID
app.put('/api/v1/admin/users/:id', async (c: Context<AppEnv>) => {
  try {
    const token = getBearer(c.req.raw)
    if (!token) return c.json({ success: false, message: 'Unauthorized' }, 401)
    const jwtSecret = (c.env as any).JWT_SECRET as string | undefined
    if (!jwtSecret) return c.json({ success: false, message: 'JWT secret not configured' }, 500)
    const payload = await verifyBearer(token, jwtSecret, c.env.JWT_AUD)
    if ((payload as any).role !== 'admin') return c.json({ success: false, message: 'Forbidden' }, 403)

    const userId = c.req.param('id')
    const { email, first_name, last_name, account_type, kyc_status, is_verified } = await c.req.json().catch(() => ({}))
    
    if (!userId) return c.json({ success: false, message: 'User ID required' }, 400)
    
    // Build update query dynamically
    const updates: string[] = []
    const params: any[] = []
    
    if (email !== undefined) { updates.push('email = ?'); params.push(email) }
    if (first_name !== undefined) { updates.push('first_name = ?'); params.push(first_name) }
    if (last_name !== undefined) { updates.push('last_name = ?'); params.push(last_name) }
    if (account_type !== undefined) { updates.push('account_type = ?'); params.push(account_type) }
    if (kyc_status !== undefined) { updates.push('kyc_status = ?'); params.push(kyc_status) }
    if (is_verified !== undefined) { updates.push('is_verified = ?'); params.push(is_verified) }
    
    if (updates.length === 0) {
      return c.json({ success: false, message: 'No fields to update' }, 400)
    }
    
    const result = await c.env.DB.prepare(`
      UPDATE users 
      SET ${updates.join(', ')} 
      WHERE id = ?
    `).bind(...params, userId).run()
    
    if (result.meta.changes === 0) {
      return c.json({ success: false, message: 'User not found' }, 404)
    }
    
    return c.json({ success: true, message: 'User updated successfully' })
  } catch (e) {
    const error = e instanceof Error ? e.message : 'Unknown error'
    return c.json({ success: false, message: 'Failed to update user', error }, 500)
  }
})

// Admin: delete user by ID
app.delete('/api/v1/admin/users/:id', async (c: Context<AppEnv>) => {
  try {
    const token = getBearer(c.req.raw)
    if (!token) return c.json({ success: false, message: 'Unauthorized' }, 401)
    const jwtSecret = (c.env as any).JWT_SECRET as string | undefined
    if (!jwtSecret) return c.json({ success: false, message: 'JWT secret not configured' }, 500)
    const payload = await verifyBearer(token, jwtSecret, c.env.JWT_AUD)
    if ((payload as any).role !== 'admin') return c.json({ success: false, message: 'Forbidden' }, 403)

    const userId = c.req.param('id')
    if (!userId) return c.json({ success: false, message: 'User ID required' }, 400)
    
    // Check if user exists first
    const user = await c.env.DB.prepare('SELECT id FROM users WHERE id = ?').bind(userId).first()
    if (!user) {
      return c.json({ success: false, message: 'User not found' }, 404)
    }
    
    // Delete user (cascading will handle related records)
    await c.env.DB.prepare('DELETE FROM users WHERE id = ?').bind(userId).run()
    
    return c.json({ success: true, message: 'User deleted successfully' })
  } catch (e) {
    const error = e instanceof Error ? e.message : 'Unknown error'
    return c.json({ success: false, message: 'Failed to delete user', error }, 500)
  }
})

// Admin: get specific user by ID
app.get('/api/v1/admin/users/:id', async (c: Context<AppEnv>) => {
  try {
    const token = getBearer(c.req.raw)
    if (!token) return c.json({ success: false, message: 'Unauthorized' }, 401)
    const jwtSecret = (c.env as any).JWT_SECRET as string | undefined
    if (!jwtSecret) return c.json({ success: false, message: 'JWT secret not configured' }, 500)
    const payload = await verifyBearer(token, jwtSecret, c.env.JWT_AUD)
    if ((payload as any).role !== 'admin') return c.json({ success: false, message: 'Forbidden' }, 403)

    const userId = c.req.param('id')
    if (!userId) return c.json({ success: false, message: 'User ID required' }, 400)
    
    const user = await c.env.DB.prepare(`
      SELECT id, email, first_name, last_name, account_type, kyc_status, is_verified, created_at
      FROM users WHERE id = ?
    `).bind(userId).first()
    
    if (!user) {
      return c.json({ success: false, message: 'User not found' }, 404)
    }
    
    return c.json({ success: true, data: user })
  } catch (e) {
    const error = e instanceof Error ? e.message : 'Unknown error'
    return c.json({ success: false, message: 'Failed to get user', error }, 500)
  }
})

// Dev-only: mint token (guard with DEV_MINT)
app.post('/dev/mint-token', async (c: Context<AppEnv>) => {
  const allow = (c.env as any).DEV_MINT === 'true'
  if (!allow) return c.json({ error: 'disabled' }, 403)
  try {
    const { email = 'demo@example.com', id = crypto.randomUUID(), expiresIn = '7d' } = await c.req.json().catch(() => ({}))
    const jwtSecret = (c.env as any).JWT_SECRET as string | undefined
    if (!jwtSecret) return c.json({ error: 'JWT secret not configured' }, 500)
    const key = new TextEncoder().encode(jwtSecret)
    // dynamic import to avoid increasing cold path if unused
    const { SignJWT } = await import('jose')
    const token = await new SignJWT({ id, email, aud: c.env.JWT_AUD })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime(expiresIn)
      .sign(key)
    return c.json({ token, id, email })
  } catch (e) {
    return c.json({ error: 'failed to mint' }, 500)
  }
})

// Users: transactions with pagination and optional type/status filters
app.get('/api/v1/users/transactions', async (c: Context<AppEnv>) => {
  try {
    const token = getBearer(c.req.raw)
    if (!token) return c.json({ success: false, message: 'Unauthorized' }, 401)
    const jwtSecret = (c.env as any).JWT_SECRET as string | undefined
    if (!jwtSecret) return c.json({ success: false, message: 'JWT secret not configured' }, 500)
    const payload = await verifyBearer(token, jwtSecret, c.env.JWT_AUD)
    const userId = (payload.id as string) || ''
    if (!userId) return c.json({ success: false, message: 'Invalid token' }, 401)

    const url = new URL(c.req.url)
    const page = Math.max(1, Number(url.searchParams.get('page') || '1'))
    const limit = Math.min(100, Math.max(1, Number(url.searchParams.get('limit') || '20')))
    const type = url.searchParams.get('type') || undefined
    const status = url.searchParams.get('status') || undefined
    const offset = (page - 1) * limit

    const databaseUrl = (c.env as any).DATABASE_URL as string | undefined
    const sql = getNeonClient(databaseUrl)
    if (sql) {
      // 1) get user account ids
      const accounts = await sql`SELECT id FROM accounts WHERE user_id = ${userId}`
      const accountIds = (accounts as any[]).map((a: any) => a.id)
      if (accountIds.length === 0) {
        return c.json({ success: true, data: [], pagination: { page, limit, total: 0, totalPages: 0 } })
      }

      // 2) build base query
      const whereParts: string[] = []
      const params: any[] = []
      whereParts.push(`(from_account_id = ANY($1) OR to_account_id = ANY($1))`)
      params.push(accountIds)
      if (type) { whereParts.push(`type = $2`); params.push(type) }
      if (status) { whereParts.push(`status = $${params.length + 1}`); params.push(status) }
      const whereSql = whereParts.length ? `WHERE ${whereParts.join(' AND ')}` : ''

      // Compose safe conditions
      const rows = await sql`
        SELECT id, from_account_id, to_account_id, amount, currency, type, status, created_at
        FROM transactions
        WHERE (from_account_id = ANY(${accountIds}) OR to_account_id = ANY(${accountIds}))
        ${type ? sql`AND type = ${type}` : sql``}
        ${status ? sql`AND status = ${status}` : sql``}
        ORDER BY created_at DESC
        LIMIT ${limit} OFFSET ${offset}
      `
      const totalRow = await sql`
        SELECT COUNT(*)::int AS count FROM transactions
        WHERE (from_account_id = ANY(${accountIds}) OR to_account_id = ANY(${accountIds}))
        ${type ? sql`AND type = ${type}` : sql``}
        ${status ? sql`AND status = ${status}` : sql``}
      `
      const total = Number((totalRow as any)[0]?.count || 0)
      return c.json({ success: true, data: rows, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } })
    }

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
app.post('/api/v1/transfers', async (c: Context<AppEnv>) => {
  try {
    const token = getBearer(c.req.raw)
    if (!token) return c.json({ success: false, message: 'Unauthorized' }, 401)
    const jwtSecret = (c.env as any).JWT_SECRET as string | undefined
    if (!jwtSecret) return c.json({ success: false, message: 'JWT secret not configured' }, 500)
    const payload = await verifyBearer(token, jwtSecret, c.env.JWT_AUD)
    const userId = (payload.id as string) || ''
    if (!userId) return c.json({ success: false, message: 'Invalid token' }, 401)

    // Idempotency key from header
    const idemKey = c.req.header('Idempotency-Key') || ''
    if (!idemKey) return c.json({ success: false, message: 'Idempotency-Key required' }, 400)

    const existed = await c.env.APP_KV.get(`idem:${idemKey}`)
    if (existed) return c.json(JSON.parse(existed))

    const body = (await c.req.json().catch(() => ({}))) as { fromAccountId?: string; toAccountId?: string; amount?: number; currency?: string }
    const fromId = body.fromAccountId?.trim()
    const toId = body.toAccountId?.trim()
    const amount = Number(body.amount)
    const currency = (body.currency || 'USD').toUpperCase()
    if (!fromId || !toId || !Number.isFinite(amount) || amount <= 0) {
      return c.json({ success: false, message: 'Invalid transfer payload' }, 400)
    }

    const databaseUrl = (c.env as any).DATABASE_URL as string | undefined
    const sql = getNeonClient(databaseUrl)
    if (sql) {
      // Basic authorization: ensure from account belongs to user
      const owner = await sql`SELECT 1 FROM accounts WHERE id = ${fromId} AND user_id = ${userId}`
      if (!(owner as any[])[0]) return c.json({ success: false, message: 'Forbidden' }, 403)

      // Transfer in a transaction
      const txId = crypto.randomUUID()
      await sql`BEGIN`
      try {
        await sql`UPDATE accounts SET balance = balance - ${amount}, available_balance = available_balance - ${amount} WHERE id = ${fromId}`
        await sql`UPDATE accounts SET balance = balance + ${amount}, available_balance = available_balance + ${amount} WHERE id = ${toId}`
        await sql`INSERT INTO transactions (id, from_account_id, to_account_id, amount, currency, type, status)
                  VALUES (${txId}, ${fromId}, ${toId}, ${amount}, ${currency}, 'transfer', 'completed')`
        await sql`COMMIT`
      } catch (e) {
        await sql`ROLLBACK`
        return c.json({ success: false, message: 'Transfer failed' }, 500)
      }
      const res = { success: true, id: txId }
      await c.env.APP_KV.put(`idem:${idemKey}`, JSON.stringify(res), { expirationTtl: 24 * 60 * 60 })
      return c.json(res)
    }

    // D1 fallback (no real transaction guarantees)
    try {
      const txId = crypto.randomUUID()
      await c.env.DB.prepare(`UPDATE accounts SET balance = balance - ?, available_balance = available_balance - ? WHERE id = ?`).bind(amount, amount, fromId).run()
      await c.env.DB.prepare(`UPDATE accounts SET balance = balance + ?, available_balance = available_balance + ? WHERE id = ?`).bind(amount, amount, toId).run()
      await c.env.DB.prepare(`INSERT INTO transactions (id, from_account_id, to_account_id, amount, currency, type, status) VALUES (?, ?, ?, ?, ?, 'transfer', 'completed')`).bind(txId, fromId, toId, amount, currency).run()
      const res = { success: true, id: txId }
      await c.env.APP_KV.put(`idem:${idemKey}`, JSON.stringify(res), { expirationTtl: 24 * 60 * 60 })
      return c.json(res)
    } catch (e) {
      return c.json({ success: false, message: 'Transfer failed' }, 500)
    }
  } catch (e) {
    return c.json({ success: false, message: 'Unauthorized' }, 401)
  }
})

// ===== BANKING OPERATIONS =====

// Create new account for user
app.post('/api/v1/accounts', async (c: Context<AppEnv>) => {
  try {
    const token = getBearer(c.req.raw)
    if (!token) return c.json({ success: false, message: 'Unauthorized' }, 401)
    const jwtSecret = (c.env as any).JWT_SECRET as string | undefined
    if (!jwtSecret) return c.json({ success: false, message: 'JWT secret not configured' }, 500)
    const payload = await verifyBearer(token, jwtSecret, c.env.JWT_AUD)
    const userId = (payload as any).id as string

    const { account_type = 'savings', currency = 'USD', initial_balance = 10000 } = await c.req.json().catch(() => ({}))
    
    // Generate account number
    const accountNumber = `${account_type.toUpperCase()}${Date.now()}${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`
    const accountId = crypto.randomUUID()
    
    // Create account in D1
    await c.env.DB.prepare(`
      INSERT INTO accounts (id, user_id, account_number, account_type, balance, available_balance, currency, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, 'active')
    `).bind(accountId, userId, accountNumber, account_type, initial_balance, initial_balance, currency).run()
    
    return c.json({ 
      success: true, 
      account: {
        id: accountId,
        account_number: accountNumber,
        account_type,
        balance: initial_balance,
        currency,
        status: 'active'
      }
    })
  } catch (e) {
    const error = e instanceof Error ? e.message : 'Unknown error'
    return c.json({ success: false, message: 'Failed to create account', error }, 500)
  }
})

// Get account details
app.get('/api/v1/accounts/:id', async (c: Context<AppEnv>) => {
  try {
    const token = getBearer(c.req.raw)
    if (!token) return c.json({ success: false, message: 'Unauthorized' }, 401)
    const jwtSecret = (c.env as any).JWT_SECRET as string | undefined
    if (!jwtSecret) return c.json({ success: false, message: 'JWT secret not configured' }, 500)
    const payload = await verifyBearer(token, jwtSecret, c.env.JWT_AUD)
    const userId = (payload as any).id as string
    const accountId = c.req.param('id')

    const account = await c.env.DB.prepare(`
      SELECT * FROM accounts WHERE id = ? AND user_id = ?
    `).bind(accountId, userId).first()
    
    if (!account) {
      return c.json({ success: false, message: 'Account not found' }, 404)
    }
    
    return c.json({ success: true, account })
  } catch (e) {
    const error = e instanceof Error ? e.message : 'Unknown error'
    return c.json({ success: false, message: 'Failed to get account', error }, 500)
  }
})

// Get account transactions
app.get('/api/v1/accounts/:id/transactions', async (c: Context<AppEnv>) => {
  try {
    const token = getBearer(c.req.raw)
    if (!token) return c.json({ success: false, message: 'Unauthorized' }, 401)
    const jwtSecret = (c.env as any).JWT_SECRET as string | undefined
    if (!jwtSecret) return c.json({ success: false, message: 'JWT secret not configured' }, 500)
    const payload = await verifyBearer(token, jwtSecret, c.env.JWT_AUD)
    const userId = (payload as any).id as string
    const accountId = c.req.param('id')

    // Verify user owns the account
    const account = await c.env.DB.prepare(`
      SELECT id FROM accounts WHERE id = ? AND user_id = ?
    `).bind(accountId, userId).first()
    
    if (!account) {
      return c.json({ success: false, message: 'Account not found' }, 404)
    }

    const url = new URL(c.req.url)
    const page = Math.max(1, Number(url.searchParams.get('page') || '1'))
    const limit = Math.min(100, Math.max(1, Number(url.searchParams.get('limit') || '20')))
    const offset = (page - 1) * limit

    const transactions = await c.env.DB.prepare(`
      SELECT * FROM transactions 
      WHERE from_account_id = ? OR to_account_id = ?
      ORDER BY created_at DESC
      LIMIT ? OFFSET ?
    `).bind(accountId, accountId, limit, offset).all()

    const totalResult = await c.env.DB.prepare(`
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
app.post('/api/v1/accounts/:id/deposit', async (c: Context<AppEnv>) => {
  try {
    const token = getBearer(c.req.raw)
    if (!token) return c.json({ success: false, message: 'Unauthorized' }, 401)
    const jwtSecret = (c.env as any).JWT_SECRET as string | undefined
    if (!jwtSecret) return c.json({ success: false, message: 'JWT secret not configured' }, 500)
    const payload = await verifyBearer(token, jwtSecret, c.env.JWT_AUD)
    const userId = (payload as any).id as string
    const accountId = c.req.param('id')

    const { amount, description = 'Deposit' } = await c.req.json().catch(() => ({}))
    
    if (!amount || amount <= 0) {
      return c.json({ success: false, message: 'Valid amount required' }, 400)
    }

    // Verify user owns the account
    const account = await c.env.DB.prepare(`
      SELECT * FROM accounts WHERE id = ? AND user_id = ?
    `).bind(accountId, userId).first()
    
    if (!account) {
      return c.json({ success: false, message: 'Account not found' }, 404)
    }

    const txId = crypto.randomUUID()
    
    // Update account balance
    await c.env.DB.prepare(`
      UPDATE accounts 
      SET balance = balance + ?, available_balance = available_balance + ?
      WHERE id = ?
    `).bind(amount, amount, accountId).run()
    
    // Record transaction
    await c.env.DB.prepare(`
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
app.post('/api/v1/accounts/:id/withdraw', async (c: Context<AppEnv>) => {
  try {
    const token = getBearer(c.req.raw)
    if (!token) return c.json({ success: false, message: 'Unauthorized' }, 401)
    const jwtSecret = (c.env as any).JWT_SECRET as string | undefined
    if (!jwtSecret) return c.json({ success: false, message: 'JWT secret not configured' }, 500)
    const payload = await verifyBearer(token, jwtSecret, c.env.JWT_AUD)
    const userId = (payload as any).id as string
    const accountId = c.req.param('id')

    const { amount, description = 'Withdrawal' } = await c.req.json().catch(() => ({}))
    
    if (!amount || amount <= 0) {
      return c.json({ success: false, message: 'Valid amount required' }, 400)
    }

    // Verify user owns the account and has sufficient balance
    const account = await c.env.DB.prepare(`
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
    await c.env.DB.prepare(`
      UPDATE accounts 
      SET balance = balance - ?, available_balance = available_balance - ?
      WHERE id = ?
    `).bind(amount, amount, accountId).run()
    
    // Record transaction
    await c.env.DB.prepare(`
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
app.put('/api/v1/users/profile', async (c: Context<AppEnv>) => {
  try {
    const token = getBearer(c.req.raw)
    if (!token) return c.json({ success: false, message: 'Unauthorized' }, 401)
    const jwtSecret = (c.env as any).JWT_SECRET as string | undefined
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
    if (date_of_birth !== undefined) { updates.push('date_of_birth = ?'); params.push(date_of_birth) }
    
    if (updates.length === 0) {
      return c.json({ success: false, message: 'No fields to update' }, 400)
    }
    
    await c.env.DB.prepare(`
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
app.get('/api/v1/kyc/status', async (c: Context<AppEnv>) => {
  try {
    const token = getBearer(c.req.raw)
    if (!token) return c.json({ success: false, message: 'Unauthorized' }, 401)
    const jwtSecret = (c.env as any).JWT_SECRET as string | undefined
    if (!jwtSecret) return c.json({ success: false, message: 'JWT secret not configured' }, 500)
    const payload = await verifyBearer(token, jwtSecret, c.env.JWT_AUD)
    const userId = (payload as any).id as string

    const kycApplication = await c.env.DB.prepare(`
      SELECT status, submitted_at, reviewed_at, rejection_reason
      FROM kyc_applications 
      WHERE user_id = ? 
      ORDER BY submitted_at DESC 
      LIMIT 1
    `).bind(userId).first()
    
    const documents = await c.env.DB.prepare(`
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
app.put('/api/v1/admin/kyc/:id/status', async (c: Context<AppEnv>) => {
  try {
    const token = getBearer(c.req.raw)
    if (!token) return c.json({ success: false, message: 'Unauthorized' }, 401)
    const jwtSecret = (c.env as any).JWT_SECRET as string | undefined
    if (!jwtSecret) return c.json({ success: false, message: 'JWT secret not configured' }, 500)
    const payload = await verifyBearer(token, jwtSecret, c.env.JWT_AUD)
    if ((payload as any).role !== 'admin') return c.json({ success: false, message: 'Forbidden' }, 403)

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
    
    const result = await c.env.DB.prepare(`
      UPDATE kyc_applications 
      SET ${updates.join(', ')}
      WHERE id = ?
    `).bind(...params, kycId).run()
    
    if (result.meta.changes === 0) {
      return c.json({ success: false, message: 'KYC application not found' }, 404)
    }
    
    // Update user KYC status
    if (status === 'approved') {
      const kycApp = await c.env.DB.prepare('SELECT user_id FROM kyc_applications WHERE id = ?').bind(kycId).first()
      if (kycApp) {
        await c.env.DB.prepare(`
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
app.get('/api/v1/admin/kyc', async (c: Context<AppEnv>) => {
  try {
    const token = getBearer(c.req.raw)
    if (!token) return c.json({ success: false, message: 'Unauthorized' }, 401)
    const jwtSecret = (c.env as any).JWT_SECRET as string | undefined
    if (!jwtSecret) return c.json({ success: false, message: 'JWT secret not configured' }, 500)
    const payload = await verifyBearer(token, jwtSecret, c.env.JWT_AUD)
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

    const applications = await c.env.DB.prepare(`
      SELECT k.*, u.email, u.first_name, u.last_name
      FROM kyc_applications k
      JOIN users u ON k.user_id = u.id
      ${whereClause}
      ORDER BY k.submitted_at DESC
      LIMIT ? OFFSET ?
    `).bind(...params, limit, offset).all()

    const totalResult = await c.env.DB.prepare(`
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
app.get('/api/v1/users/transactions', async (c: Context<AppEnv>) => {
  try {
    const token = getBearer(c.req.raw)
    if (!token) return c.json({ success: false, message: 'Unauthorized' }, 401)
    const jwtSecret = (c.env as any).JWT_SECRET as string | undefined
    if (!jwtSecret) return c.json({ success: false, message: 'JWT secret not configured' }, 500)
    const payload = await verifyBearer(token, jwtSecret, c.env.JWT_AUD)
    const userId = (payload.id as string) || ''
    if (!userId) return c.json({ success: false, message: 'Invalid token' }, 401)

    const url = new URL(c.req.url)
    const page = Math.max(1, Number(url.searchParams.get('page') || '1'))
    const limit = Math.min(100, Math.max(1, Number(url.searchParams.get('limit') || '20')))
    const type = url.searchParams.get('type') || undefined
    const status = url.searchParams.get('status') || undefined
    const offset = (page - 1) * limit

    const databaseUrl = (c.env as any).DATABASE_URL as string | undefined
    const sql = getNeonClient(databaseUrl)
    if (sql) {
      // 1) get user account ids
      const accounts = await sql`SELECT id FROM accounts WHERE user_id = ${userId}`
      const accountIds = (accounts as any[]).map((a: any) => a.id)
      if (accountIds.length === 0) {
        return c.json({ success: true, data: [], pagination: { page, limit, total: 0, totalPages: 0 } })
      }

      // Compose safe conditions with proper SQL handling
      let baseQuery = sql`
        SELECT id, from_account_id, to_account_id, amount, currency, type, status, created_at
        FROM transactions
        WHERE (from_account_id = ANY(${accountIds}) OR to_account_id = ANY(${accountIds}))
      `
      
      if (type) {
        baseQuery = sql`${baseQuery} AND type = ${type}`
      }
      
      if (status) {
        baseQuery = sql`${baseQuery} AND status = ${status}`
      }
      
      const rows = await sql`
        ${baseQuery}
        ORDER BY created_at DESC
        LIMIT ${limit} OFFSET ${offset}
      `
      
      let countQuery = sql`
        SELECT COUNT(*)::int AS count FROM transactions
        WHERE (from_account_id = ANY(${accountIds}) OR to_account_id = ANY(${accountIds}))
      `
      
      if (type) {
        countQuery = sql`${countQuery} AND type = ${type}`
      }
      
      if (status) {
        countQuery = sql`${countQuery} AND status = ${status}`
      }
      
      const totalRow = await countQuery
      const total = Number((totalRow as any)[0]?.count || 0)
      return c.json({ success: true, data: rows, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } })
    }

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
app.post('/api/v1/transfers', async (c: Context<AppEnv>) => {
  try {
    initializeServices(c.env)
    const token = getBearer(c.req.raw)
    if (!token) return c.json({ success: false, message: 'Unauthorized' }, 401)
    const jwtSecret = (c.env as any).JWT_SECRET as string | undefined
    if (!jwtSecret) return c.json({ success: false, message: 'JWT secret not configured' }, 500)
    const payload = await verifyBearer(token, jwtSecret, c.env.JWT_AUD)
    const userId = (payload.id as string) || ''
    if (!userId) return c.json({ success: false, message: 'Invalid token' }, 401)

    // Idempotency key from header
    const idemKey = c.req.header('Idempotency-Key') || ''
    if (!idemKey) return c.json({ success: false, message: 'Idempotency-Key required' }, 400)

    const existed = await c.env.APP_KV.get(`idem:${idemKey}`)
    if (existed) return c.json(JSON.parse(existed))

    const body = (await c.req.json().catch(() => ({}))) as { fromAccountId?: string; toAccountId?: string; amount?: number; currency?: string }
    const fromId = body.fromAccountId?.trim()
    const toId = body.toAccountId?.trim()
    const amount = Number(body.amount)
    const currency = (body.currency || 'USD').toUpperCase()
    if (!fromId || !toId || !Number.isFinite(amount) || amount <= 0) {
      return c.json({ success: false, message: 'Invalid transfer payload' }, 400)
    }

    const databaseUrl = (c.env as any).DATABASE_URL as string | undefined
    const sql = getNeonClient(databaseUrl)
    if (sql) {
      // Basic authorization: ensure from account belongs to user
      const owner = await sql`SELECT 1 FROM accounts WHERE id = ${fromId} AND user_id = ${userId}`
      if (!(owner as any[])[0]) return c.json({ success: false, message: 'Forbidden' }, 403)

      // Transfer in a transaction
      const txId = crypto.randomUUID()
      await sql`BEGIN`
      try {
        await sql`UPDATE accounts SET balance = balance - ${amount}, available_balance = available_balance - ${amount} WHERE id = ${fromId}`
        await sql`UPDATE accounts SET balance = balance + ${amount}, available_balance = available_balance + ${amount} WHERE id = ${toId}`
        await sql`INSERT INTO transactions (id, from_account_id, to_account_id, amount, currency, type, status)
                  VALUES (${txId}, ${fromId}, ${toId}, ${amount}, ${currency}, 'transfer', 'completed')`
        await sql`COMMIT`
        
        // Send notification
        notificationService.sendTransactionNotification(userId, 'transfer', amount, currency)
        
      } catch (e) {
        await sql`ROLLBACK`
        return c.json({ success: false, message: 'Transfer failed' }, 500)
      }
      const res = { success: true, id: txId }
      await c.env.APP_KV.put(`idem:${idemKey}`, JSON.stringify(res), { expirationTtl: 24 * 60 * 60 })
      return c.json(res)
    }

    // D1 fallback (no real transaction guarantees)
    try {
      const txId = crypto.randomUUID()
      await c.env.DB.prepare(`UPDATE accounts SET balance = balance - ?, available_balance = available_balance - ? WHERE id = ?`).bind(amount, amount, fromId).run()
      await c.env.DB.prepare(`UPDATE accounts SET balance = balance + ?, available_balance = available_balance + ? WHERE id = ?`).bind(amount, amount, toId).run()
      await c.env.DB.prepare(`INSERT INTO transactions (id, from_account_id, to_account_id, amount, currency, type, status) VALUES (?, ?, ?, ?, ?, 'transfer', 'completed')`).bind(txId, fromId, toId, amount, currency).run()
      
      // Send notification
      notificationService.sendTransactionNotification(userId, 'transfer', amount, currency)
      
      const res = { success: true, id: txId }
      await c.env.APP_KV.put(`idem:${idemKey}`, JSON.stringify(res), { expirationTtl: 24 * 60 * 60 })
      return c.json(res)
    } catch (e) {
      return c.json({ success: false, message: 'Transfer failed' }, 500)
    }
  } catch (e) {
    return c.json({ success: false, message: 'Unauthorized' }, 401)
  }
})

// ===== EXTERNAL BANKING =====

// Get supported banks for external transfers
app.get('/api/v1/banking/external-banks', async (c: Context<AppEnv>) => {
  try {
    initializeServices(c.env)
    const token = getBearer(c.req.raw)
    if (!token) return c.json({ success: false, message: 'Unauthorized' }, 401)
    const jwtSecret = (c.env as any).JWT_SECRET as string | undefined
    if (!jwtSecret) return c.json({ success: false, message: 'JWT secret not configured' }, 500)
    await verifyBearer(token, jwtSecret, c.env.JWT_AUD)

    const banks = ExternalBankingService.getSupportedBanks()
    
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
app.post('/api/v1/banking/external-banks/verify', async (c: Context<AppEnv>) => {
  try {
    initializeServices(c.env)
    const token = getBearer(c.req.raw)
    if (!token) return c.json({ success: false, message: 'Unauthorized' }, 401)
    const jwtSecret = (c.env as any).JWT_SECRET as string | undefined
    if (!jwtSecret) return c.json({ success: false, message: 'JWT secret not configured' }, 500)
    await verifyBearer(token, jwtSecret, c.env.JWT_AUD)

    const { accountNumber, bankCode } = await c.req.json().catch(() => ({}))
    
    if (!accountNumber || !bankCode) {
      return c.json({ 
        success: false, 
        message: 'Account number and bank code are required' 
      }, 400)
    }
    
    const result = await ExternalBankingService.verifyBankAccount(accountNumber, bankCode)
    
    return c.json({
      success: result.verified,
      message: result.verified ? 'Bank account verified successfully' : result.error || 'Verification failed',
      data: result.verified ? {
        accountType: result.accountType,
        bankName: result.bankName
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
app.post('/api/v1/banking/external-transfer', async (c: Context<AppEnv>) => {
  try {
    initializeServices(c.env)
    const token = getBearer(c.req.raw)
    if (!token) return c.json({ success: false, message: 'Unauthorized' }, 401)
    const jwtSecret = (c.env as any).JWT_SECRET as string | undefined
    if (!jwtSecret) return c.json({ success: false, message: 'JWT secret not configured' }, 500)
    const payload = await verifyBearer(token, jwtSecret, c.env.JWT_AUD)
    const userId = (payload as any).id as string

    const { fromAccountId, toAccountNumber, toBankCode, amount, description, recipientName } = await c.req.json().catch(() => ({}))
    
    if (!fromAccountId || !toAccountNumber || !toBankCode || !amount || !description || !recipientName) {
      return c.json({
        success: false,
        message: 'Missing required fields'
      }, 400)
    }
    
    // Verify the destination account first
    const verification = await ExternalBankingService.verifyBankAccount(toAccountNumber, toBankCode)
    if (!verification.verified) {
      return c.json({
        success: false,
        message: verification.error || 'Account verification failed'
      }, 400)
    }
    
    // Calculate transfer fee
    const fee = ExternalBankingService.calculateTransferFee(amount, toBankCode, 'USD')
    
    // Initiate the transfer
    const transferData = {
      fromAccount: fromAccountId,
      toAccount: {
        accountNumber: toAccountNumber,
        bankCode: toBankCode,
        bankName: verification.bankName!
      },
      amount,
      currency: 'USD',
      reference: ExternalBankingService.generateTransactionReference(),
      narration: description
    }
    
    const result = await ExternalBankingService.initiateTransfer(transferData)
    
    if (result.status === 'pending') {
      // Send notification
      if (notificationService) {
        await notificationService.sendNotification({
          userId,
          type: 'transaction',
          priority: 'medium',
          title: 'External Transfer Initiated',
          message: `External transfer of $${amount.toLocaleString()} to ${verification.bankName} has been initiated. Reference: ${result.transferId}`,
          channels: ['email', 'sms', 'in_app'],
          data: {
            reference: result.transferId,
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
        transferId: result.transferId,
        status: result.status,
        estimatedCompletion: result.estimatedCompletion,
        fee: result.fee
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
app.get('/api/v1/banking/credit-score', async (c: Context<AppEnv>) => {
  try {
    initializeServices(c.env)
    const token = getBearer(c.req.raw)
    if (!token) return c.json({ success: false, message: 'Unauthorized' }, 401)
    const jwtSecret = (c.env as any).JWT_SECRET as string | undefined
    if (!jwtSecret) return c.json({ success: false, message: 'JWT secret not configured' }, 500)
    const payload = await verifyBearer(token, jwtSecret, c.env.JWT_AUD)
    const userId = (payload as any).id as string
    
    const creditScore = await CreditScoreService.calculateCreditScore(userId)
    
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
app.post('/api/v1/banking/loan-eligibility', async (c: Context<AppEnv>) => {
  try {
    initializeServices(c.env)
    const token = getBearer(c.req.raw)
    if (!token) return c.json({ success: false, message: 'Unauthorized' }, 401)
    const jwtSecret = (c.env as any).JWT_SECRET as string | undefined
    if (!jwtSecret) return c.json({ success: false, message: 'JWT secret not configured' }, 500)
    const payload = await verifyBearer(token, jwtSecret, c.env.JWT_AUD)
    const userId = (payload as any).id as string

    const { amount } = await c.req.json().catch(() => ({}))
    
    if (!amount || amount < 1000) {
      return c.json({
        success: false,
        message: 'Minimum loan amount is $1,000'
      }, 400)
    }
    
    const eligibility = await CreditScoreService.assessLoanEligibility(userId, amount)
    
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
app.get('/api/v1/banking/investments/options', async (c: Context<AppEnv>) => {
  try {
    initializeServices(c.env)
    const token = getBearer(c.req.raw)
    if (!token) return c.json({ success: false, message: 'Unauthorized' }, 401)
    const jwtSecret = (c.env as any).JWT_SECRET as string | undefined
    if (!jwtSecret) return c.json({ success: false, message: 'JWT secret not configured' }, 500)
    await verifyBearer(token, jwtSecret, c.env.JWT_AUD)
    
    const options = InvestmentService.getInvestmentOptions()
    
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
app.post('/api/v1/banking/investments', async (c: Context<AppEnv>) => {
  try {
    initializeServices(c.env)
    const token = getBearer(c.req.raw)
    if (!token) return c.json({ success: false, message: 'Unauthorized' }, 401)
    const jwtSecret = (c.env as any).JWT_SECRET as string | undefined
    if (!jwtSecret) return c.json({ success: false, message: 'JWT secret not configured' }, 500)
    const payload = await verifyBearer(token, jwtSecret, c.env.JWT_AUD)
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
    
    const result = await InvestmentService.createInvestment(userId, optionId, amount, accountId)
    
    if (result.investmentId) {
      // Send notification
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
app.get('/api/v1/banking/investments/portfolio', async (c: Context<AppEnv>) => {
  try {
    initializeServices(c.env)
    const token = getBearer(c.req.raw)
    if (!token) return c.json({ success: false, message: 'Unauthorized' }, 401)
    const jwtSecret = (c.env as any).JWT_SECRET as string | undefined
    if (!jwtSecret) return c.json({ success: false, message: 'JWT secret not configured' }, 500)
    const payload = await verifyBearer(token, jwtSecret, c.env.JWT_AUD)
    const userId = (payload as any).id as string

    const portfolio = await InvestmentService.getUserPortfolio(userId)
    
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
app.get('/api/v1/banking/investments/market', async (c: Context<AppEnv>) => {
  try {
    initializeServices(c.env)
    const token = getBearer(c.req.raw)
    if (!token) return c.json({ success: false, message: 'Unauthorized' }, 401)
    const jwtSecret = (c.env as any).JWT_SECRET as string | undefined
    if (!jwtSecret) return c.json({ success: false, message: 'JWT secret not configured' }, 500)
    await verifyBearer(token, jwtSecret, c.env.JWT_AUD)

    const marketSummary = InvestmentService.getMarketSummary()
    
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
app.get('/api/v1/notifications', async (c: Context<AppEnv>) => {
  try {
    const token = getBearer(c.req.raw)
    if (!token) return c.json({ success: false, message: 'Unauthorized' }, 401)
    const jwtSecret = (c.env as any).JWT_SECRET as string | undefined
    if (!jwtSecret) return c.json({ success: false, message: 'JWT secret not configured' }, 500)
    const payload = await verifyBearer(token, jwtSecret, c.env.JWT_AUD)
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

    const notifications = await c.env.DB.prepare(query).bind(...params).all()

    const totalResult = await c.env.DB.prepare(`
      SELECT COUNT(*) as count FROM notifications WHERE user_id = ?
      ${type ? 'AND type = ?' : ''}
      ${read !== null ? 'AND read = ?' : ''}
    `).bind(userId, ...(type ? [type] : []), ...(read !== null ? [read === 'true'] : [])).first()

    const unreadResult = await c.env.DB.prepare(`
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
app.patch('/api/v1/notifications/:id/read', async (c: Context<AppEnv>) => {
  try {
    const token = getBearer(c.req.raw)
    if (!token) return c.json({ success: false, message: 'Unauthorized' }, 401)
    const jwtSecret = (c.env as any).JWT_SECRET as string | undefined
    if (!jwtSecret) return c.json({ success: false, message: 'JWT secret not configured' }, 500)
    const payload = await verifyBearer(token, jwtSecret, c.env.JWT_AUD)
    const userId = (payload as any).id as string
    const notificationId = c.req.param('id')

    const notification = await c.env.DB.prepare(`
      SELECT id FROM notifications WHERE id = ? AND user_id = ?
    `).bind(notificationId, userId).first()

    if (!notification) {
      return c.json({
        success: false,
        message: 'Notification not found'
      }, 404)
    }

    await c.env.DB.prepare(`
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
app.patch('/api/v1/notifications/read-all', async (c: Context<AppEnv>) => {
  try {
    const token = getBearer(c.req.raw)
    if (!token) return c.json({ success: false, message: 'Unauthorized' }, 401)
    const jwtSecret = (c.env as any).JWT_SECRET as string | undefined
    if (!jwtSecret) return c.json({ success: false, message: 'JWT secret not configured' }, 500)
    const payload = await verifyBearer(token, jwtSecret, c.env.JWT_AUD)
    const userId = (payload as any).id as string

    await c.env.DB.prepare(`
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
app.post('/api/v1/notifications/test', async (c: Context<AppEnv>) => {
  try {
    initializeServices(c.env)
    const token = getBearer(c.req.raw)
    if (!token) return c.json({ success: false, message: 'Unauthorized' }, 401)
    const jwtSecret = (c.env as any).JWT_SECRET as string | undefined
    if (!jwtSecret) return c.json({ success: false, message: 'JWT secret not configured' }, 500)
    const payload = await verifyBearer(token, jwtSecret, c.env.JWT_AUD)
    const userId = (payload as any).id as string

    const { type, priority, title, message, channels, data } = await c.req.json().catch(() => ({}))

    if (!type || !priority || !title || !message || !channels) {
      return c.json({
        success: false,
        message: 'Missing required fields'
      }, 400)
    }

    // Send test notification
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
app.get('/api/v1/notifications/providers/health', async (c: Context<AppEnv>) => {
  try {
    initializeServices(c.env)
    const token = getBearer(c.req.raw)
    if (!token) return c.json({ success: false, message: 'Unauthorized' }, 401)
    const jwtSecret = (c.env as any).JWT_SECRET as string | undefined
    if (!jwtSecret) return c.json({ success: false, message: 'JWT secret not configured' }, 500)
    await verifyBearer(token, jwtSecret, c.env.JWT_AUD)

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

// Admin: reset another user's password
app.post('/api/v1/auth/admin/reset-password', async (c: Context<AppEnv>) => {
  try {
    const token = getBearer(c.req.raw)
    if (!token) return c.json({ success: false, message: 'Unauthorized' }, 401)
    const jwtSecret = (c.env as any).JWT_SECRET as string | undefined
    if (!jwtSecret) return c.json({ success: false, message: 'JWT secret not configured' }, 500)
    const payload = await verifyBearer(token, jwtSecret, c.env.JWT_AUD)
    if ((payload as any).role !== 'admin') return c.json({ success: false, message: 'Forbidden' }, 403)

    const { userId, newPassword } = await c.req.json().catch(() => ({}))
    if (!userId || !newPassword) return c.json({ success: false, message: 'userId and newPassword required' }, 400)

    const databaseUrl = (c.env as any).DATABASE_URL as string | undefined
    const sql = getNeonClient(databaseUrl)
    if (!sql) return c.json({ success: false, message: 'DB not configured' }, 500)
    const salt = bcryptjs.genSaltSync(10)
    const hash = bcryptjs.hashSync(newPassword, salt)
    await sql`UPDATE users SET password_hash = ${hash} WHERE id = ${userId}`
    return c.json({ success: true })
  } catch (e) {
    return c.json({ success: false, message: 'Reset failed' }, 500)
  }
})

// Admin-only example route
app.get('/api/v1/admin/ping', async (c: Context<AppEnv>) => {
  try {
    const token = getBearer(c.req.raw)
    if (!token) return c.json({ success: false, message: 'Unauthorized' }, 401)
    const jwtSecret = (c.env as any).JWT_SECRET as string | undefined
    if (!jwtSecret) return c.json({ success: false, message: 'JWT secret not configured' }, 500)
    const payload = await verifyBearer(token, jwtSecret, c.env.JWT_AUD)
    if ((payload as any).role !== 'admin') return c.json({ success: false, message: 'Forbidden' }, 403)
    return c.json({ success: true, message: 'admin-ok' })
  } catch {
    return c.json({ success: false, message: 'Unauthorized' }, 401)
  }
})

// Admin: list users with optional search and pagination
app.get('/api/v1/admin/users', async (c: Context<AppEnv>) => {
  try {
    const token = getBearer(c.req.raw)
    if (!token) return c.json({ success: false, message: 'Unauthorized' }, 401)
    const jwtSecret = (c.env as any).JWT_SECRET as string | undefined
    if (!jwtSecret) return c.json({ success: false, message: 'JWT secret not configured' }, 500)
    const payload = await verifyBearer(token, jwtSecret, c.env.JWT_AUD)
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

    const rows = await c.env.DB.prepare(`
      SELECT id, email, first_name, last_name, account_type, kyc_status, is_verified, created_at
      FROM users
      ${whereClause}
      ORDER BY created_at DESC
      LIMIT ? OFFSET ?
    `).bind(...params, limit, offset).all()

    const totalResult = await c.env.DB.prepare(`
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
  }
})

// Dev-only: mint token (guard with DEV_MINT)
app.post('/dev/mint-token', async (c: Context<AppEnv>) => {
  const allow = (c.env as any).DEV_MINT === 'true'
  if (!allow) return c.json({ error: 'disabled' }, 403)
  try {
    const { email = 'demo@example.com', id = crypto.randomUUID(), expiresIn = '7d' } = await c.req.json().catch(() => ({}))
    const jwtSecret = (c.env as any).JWT_SECRET as string | undefined
    if (!jwtSecret) return c.json({ error: 'JWT secret not configured' }, 500)
    const key = new TextEncoder().encode(jwtSecret)
    // dynamic import to avoid increasing cold path if unused
    const { SignJWT } = await import('jose')
    const token = await new SignJWT({ id, email, aud: c.env.JWT_AUD })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime(expiresIn)
      .sign(key)
    return c.json({ token, id, email })
  } catch (e) {
    return c.json({ error: 'failed to mint' }, 500)
  }
})
