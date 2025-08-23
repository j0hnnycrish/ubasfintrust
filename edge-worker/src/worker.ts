// Define Env type for Cloudflare Worker bindings
type Env = {
  DB: any;
  APP_KV?: any;
  JWT_SECRET: string;
  JWT_AUD?: string;
  [key: string]: any;
};

import { Hono } from 'hono';
import type { Context } from 'hono';
// Import types only if needed, otherwise reference types.d.ts for type augmentation
import bcryptjs from 'bcryptjs';
import { verifyBearer, getBearer } from './auth';
import { ExternalBankingService } from './services/externalBankingService';
const externalBankingService = new ExternalBankingService();
import { CreditScoreService } from './services/creditScoreService';
const creditScoreService = new CreditScoreService();
import { InvestmentService } from './services/investmentService';
const investmentService = new InvestmentService();
import { initializeNotificationServices } from './services/notificationService';
// Import any other required modules/services here
// Example: import { verifyBearer, getBearer } from './auth';
// Example: import { externalBankingService, creditScoreService, investmentService, initializeNotificationServices } from './services';

const app = new Hono<{ Bindings: Env }>();

// ===== USERS =====
// Profile
app.get('/api/v1/users/profile', async (c: Context<{ Bindings: Env }>) => {
  try {
    const token = getBearer(c.req.raw)
    if (!token) return c.json({ success: false, message: 'Unauthorized' }, 401)
    const jwtSecret = (c.env as any).JWT_SECRET as string | undefined
    if (!jwtSecret) return c.json({ success: false, message: 'JWT secret not configured' }, 500)
    const env = c.env as Env
    const payload = await verifyBearer(token, jwtSecret, env.JWT_AUD)
    const userId = (payload as any).id as string
    if (!userId) return c.json({ success: false, message: 'Invalid token' }, 401)

    const user = await env.DB.prepare(
      `SELECT id, email, first_name, last_name, is_verified, created_at FROM users WHERE id = ? LIMIT 1`
    ).bind(userId).first()
    if (!user) return c.json({ success: false, message: 'User not found' }, 404)

    return c.json({ success: true, data: user })
  } catch {
    return c.json({ success: false, message: 'Unauthorized' }, 401)
  }
})

// Accounts list
app.get('/api/v1/users/accounts', async (c: Context<{ Bindings: Env }>) => {
  try {
    const token = getBearer(c.req.raw)
    if (!token) return c.json({ success: false, message: 'Unauthorized' }, 401)
    const jwtSecret = (c.env as any).JWT_SECRET as string | undefined
    if (!jwtSecret) return c.json({ success: false, message: 'JWT secret not configured' }, 500)
    const env = c.env as Env
    const payload = await verifyBearer(token, jwtSecret, env.JWT_AUD)
    const userId = (payload as any).id as string
    if (!userId) return c.json({ success: false, message: 'Invalid token' }, 401)

    const rows = await env.DB.prepare(
      `SELECT id, account_number, account_type, balance, currency, created_at FROM accounts WHERE user_id = ? ORDER BY created_at DESC`
    ).bind(userId).all()

    return c.json({ success: true, data: rows.results || [] })
  } catch {
    return c.json({ success: false, message: 'Unauthorized' }, 401)
  }
})

// Transactions with pagination and optional type/status filters
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

    try {
      const accRes = await c.env.DB.prepare(`SELECT id FROM accounts WHERE user_id = ?`).bind(userId).all()
      const ids = (accRes.results || []).map((r: any) => r.id)
      if (ids.length === 0) return c.json({ success: true, data: [], pagination: { page, limit, total: 0, totalPages: 0 } })
      const placeholders = ids.map(() => '?').join(',')
      let q = `SELECT id, from_account_id, to_account_id, amount, currency, type, status, created_at FROM transactions
               WHERE (from_account_id IN (${placeholders}) OR to_account_id IN (${placeholders}))`
      const binds: any[] = [...ids, ...ids]
      if (type) { q += ` AND type = ?`; binds.push(type) }
      if (status) { q += ` AND status = ?`; binds.push(status) }
      q += ` ORDER BY created_at DESC LIMIT ? OFFSET ?`
      binds.push(limit, offset)
      const rows = await c.env.DB.prepare(q).bind(...binds).all()
      return c.json({ success: true, data: rows.results || [], pagination: { page, limit, total: 0, totalPages: 0 } })
    } catch {
      return c.json({ success: true, data: [], pagination: { page, limit, total: 0, totalPages: 0 } })
    }
  } catch {
    return c.json({ success: false, message: 'Unauthorized' }, 401)
  }
});

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
});

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
});

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
});

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
});

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
});

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
});

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
});

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
});

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
});

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
});

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
});

// ===== USER AUTHENTICATION ENDPOINTS =====
// User register endpoint
app.post('/api/v1/auth/register', async (c: Context<{ Bindings: Env }>) => {
  try {
    const { email, password, first_name = '', last_name = '' } = await c.req.json().catch(() => ({}))
    if (!email || !password) {
      return c.json({ success: false, message: 'Email and password required' }, 400)
    }
    const env = c.env as Env
    const exists = await env.DB.prepare(`SELECT id FROM users WHERE email = ? LIMIT 1`).bind(email).first()
    if (exists) return c.json({ success: false, message: 'Email already registered' }, 409)

    const salt = bcryptjs.genSaltSync(12)
    const password_hash = bcryptjs.hashSync(password, salt)
    await env.DB.prepare(
      `INSERT INTO users (email, password_hash, first_name, last_name, is_verified) VALUES (?, ?, ?, ?, 1)`
    ).bind(email, password_hash, first_name, last_name).run()

    return c.json({ success: true, message: 'Registered' })
  } catch (e) {
    const error = e instanceof Error ? e.message : 'Unknown error'
    return c.json({ success: false, message: 'Register failed', error }, 500)
  }
});

// User login endpoint
app.post('/api/v1/auth/login', async (c: Context<{ Bindings: Env }>) => {
  try {
    const { identifier, password } = await c.req.json().catch(() => ({}))
    if (!identifier || !password) {
      return c.json({ success: false, message: 'Identifier and password required' }, 400)
    }

    const env = c.env as Env;
    const user = await env.DB.prepare(
      `SELECT * FROM users WHERE email = ? LIMIT 1`
    ).bind(identifier).first()
    if (!user) {
      return c.json({ success: false, message: 'User not found' }, 404)
    }

    const ok = await bcryptjs.compare(password, (user as any).password_hash)
    if (!ok) {
      return c.json({ success: false, message: 'Invalid password' }, 401)
    }

    const jwtSecret = env.JWT_SECRET || 'fallback-secret-for-development'
    if (!jwtSecret) {
      return c.json({ success: false, message: 'JWT secret not configured' }, 500)
    }
    const { SignJWT } = await import('jose')
    const key = new TextEncoder().encode(jwtSecret)
    const token = await new SignJWT({
      id: (user as any).id,
      email: (user as any).email,
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
        email: (user as any).email,
        first_name: (user as any).first_name,
        last_name: (user as any).last_name,
        is_verified: (user as any).is_verified
      }
    })
  } catch (e) {
    const error = e instanceof Error ? e.message : 'Unknown error'
    return c.json({ success: false, message: 'Login failed', error }, 500)
  }
});

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
});

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
  }
});

// Dev-only: mint token (guard with DEV_MINT)
app.post('/dev/mint-token', async (c: Context<{ Bindings: Env }>) => {
  const allow = (c.env as any).DEV_MINT === 'true';
  if (!allow) {
    return c.json({ error: 'disabled' }, 403);
  }
  try {
    const { email = 'demo@example.com', id = crypto.randomUUID(), expiresIn = '7d' } = await c.req.json().catch(() => ({}));
    const jwtSecret = (c.env as any).JWT_SECRET as string | undefined;
    if (!jwtSecret) {
      return c.json({ error: 'JWT secret not configured' }, 500);
    }
    const key = new TextEncoder().encode(jwtSecret);
    // dynamic import to avoid increasing cold path if unused
    const { SignJWT } = await import('jose');
    const env = c.env as Env;
    const token = await new SignJWT({ id, email, aud: env.JWT_AUD })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime(expiresIn)
      .sign(key);
    return c.json({ token, id, email });
  } catch (e) {
    return c.json({ error: 'failed to mint' }, 500);
  }
});

// Admin seed endpoint: ensures default admin user exists (DEV only)
app.post('/api/v1/auth/admin/seed', async (c: Context<{ Bindings: Env }>) => {
  try {
    const env = c.env as Env;
    const allow = (c.env as any).DEV_SEED === 'true';
    if (!allow) {
      return c.json({ success: false, message: 'disabled' }, 403);
    }

    const adminPassword = (c.env as any).ADMIN_INITIAL_PASSWORD as string | undefined;
    if (!adminPassword) {
      return c.json({ success: false, message: 'ADMIN_INITIAL_PASSWORD not configured' }, 500);
    }

    const email = 'admin@ubasfintrust.com';
    const username = 'admin';
    const salt = bcryptjs.genSaltSync(12);
    const password_hash = bcryptjs.hashSync(adminPassword, salt);
    const role = 'super_admin';
    const first_name = 'System';
    const last_name = 'Administrator';

    // Check if admin user exists
    const existing = await env.DB.prepare(
      `SELECT id FROM admin_users WHERE email = ? LIMIT 1`
    ).bind(email).first();

    if (existing) {
      await env.DB.prepare(
        `UPDATE admin_users SET password_hash = ?, role = ?, status = 'active' WHERE email = ?`
      ).bind(password_hash, role, email).run();
      return c.json({ success: true, message: 'Admin user updated.' });
    } else {
      await env.DB.prepare(
        `INSERT INTO admin_users (username, email, password_hash, first_name, last_name, role, status) VALUES (?, ?, ?, ?, ?, ?, 'active')`
      ).bind(username, email, password_hash, first_name, last_name, role).run();
      return c.json({ success: true, message: 'Admin user created.' });
    }
  } catch (e) {
    return c.json({ success: false, message: 'Admin seed failed', error: (e as Error).message }, 500);
  }
});
// END: admin seed endpoint

export default app;
