import { Hono } from 'hono'
import type { Context } from 'hono'
import { cors } from 'hono/cors'
import { verifyBearer, getBearer } from './auth'
import { getNeonClient } from './neon'
import bcrypt from 'bcryptjs'

export interface Env {
  DB: D1Database
  R2: R2Bucket
  APP_KV: KVNamespace
  JWT_AUD: string
  // Secrets (set via `wrangler secret put`):
  // JWT_SECRET: string
  // DATABASE_URL: string (Neon Postgres)
}

type AppEnv = { Bindings: Env }
const app = new Hono<AppEnv>()

app.use('*', cors())

// Simple fixed-window rate limiter using KV
async function rateLimit(c: Context<AppEnv>, next: () => Promise<Response>) {
  // Bypass for health endpoints
  const path = new URL(c.req.url).pathname
  if (path.startsWith('/health')) return next()
  // Only protect API routes
  if (!path.startsWith('/api/')) return next()
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
  return next()
}

// Apply rate limiting to API routes except dev mint
app.use('/api/*', rateLimit)

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

app.get('/api/items', async (c: Context<AppEnv>) => {
  try {
    const { results } = await c.env.DB.prepare('SELECT id, name FROM items ORDER BY id DESC').all()
    return c.json(results ?? [])
  } catch (e) {
    // table may not exist yet
    return c.json([], 200)
  }
})

app.post('/api/items', async (c: Context<AppEnv>) => {
  const body = (await c.req.json()) as { name?: string }
  const name = body?.name?.trim()
  if (!name) return c.json({ error: 'name required' }, 400)
  await c.env.DB.prepare('INSERT INTO items (name) VALUES (?)').bind(name).run()
  return c.json({ ok: true })
})

app.post('/api/upload', async (c: Context<AppEnv>) => {
  const form = await c.req.parseBody()
  const file = form['file'] as File | undefined
  if (!file) return c.json({ error: 'file required' }, 400)
  const key = `u/${crypto.randomUUID()}-${file.name}`
  await c.env.R2.put(key, await file.arrayBuffer(), {
    httpMetadata: { contentType: file.type || 'application/octet-stream' },
  })
  return c.json({ key })
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
    const ok = await bcrypt.compare(password, user.password_hash)
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
    } catch {
      return c.json({ success: false, message: 'Transfer failed' }, 500)
    }
  } catch {
    return c.json({ success: false, message: 'Unauthorized' }, 401)
  }
})
