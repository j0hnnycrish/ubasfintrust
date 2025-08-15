import { Router, Response, Request } from 'express';
import { body, validationResult } from 'express-validator';
import { AuthMiddleware } from '../middleware/auth';
import { ipWhitelist } from '../middleware/security';
import { db } from '../config/db';
import { logger, logAudit } from '../utils/logger';
import { v4 as uuidv4 } from 'uuid';
import { AuthRequest } from '../types';

const router = Router();

// All admin routes require authentication and admin role
router.use(AuthMiddleware.verifyToken);
router.use(AuthMiddleware.requireRole(['corporate'])); // Only corporate users can access admin functions

// Create new user (admin initiated)
router.post('/users', [
  body('email').isEmail().withMessage('Valid email required'),
  body('password').isLength({ min: 8 }).withMessage('Password min length 8'),
  body('firstName').isLength({ min: 2 }).withMessage('First name required'),
  body('lastName').isLength({ min: 2 }).withMessage('Last name required'),
  body('phone').isMobilePhone('any').withMessage('Valid phone required'),
  body('dateOfBirth').isISO8601().withMessage('Valid date of birth required'),
  body('accountType').isIn(['personal','business','corporate','private']).withMessage('Invalid account type')
], async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: 'Validation failed', errors: errors.array() });
    }

    const { email, password, firstName, lastName, phone, dateOfBirth, accountType } = req.body;

    const existing = await db('users').where({ email }).first();
    if (existing) {
      return res.status(409).json({ success: false, message: 'Email already in use' });
    }

    const phoneExists = await db('users').where({ phone }).first();
    if (phoneExists) {
      return res.status(409).json({ success: false, message: 'Phone already in use' });
    }

    const userId = uuidv4();
    const passwordHash = await AuthMiddleware.hashPassword(password);

    const user = {
      id: userId,
      email,
      password_hash: passwordHash,
      first_name: firstName,
      last_name: lastName,
      phone,
      date_of_birth: dateOfBirth,
      account_type: accountType,
      kyc_status: 'pending',
      is_active: true,
      is_verified: false,
      two_factor_enabled: false,
      failed_login_attempts: 0
    };

    await db('users').insert(user);

    // Create default account
    const accountNumber = Math.random().toString().slice(2, 12);
    const account = {
      id: uuidv4(),
      user_id: userId,
      account_number: accountNumber,
      account_type: accountType === 'personal' ? 'checking' : 'business',
      balance: 0,
      available_balance: 0,
      currency: 'USD',
      status: 'active',
      minimum_balance: accountType === 'personal' ? 0 : 0
    };
    await db('accounts').insert(account);

    logAudit('ADMIN_CREATED_USER', (req as any).user?.id, 'user', { userId, email, accountType });

    // Optional welcome notifications
    const { sendWelcomeEmail, sendWelcomeSms, welcomeEmailTemplateId, welcomeSmsTemplateId } = req.body;
    try {
      if (sendWelcomeEmail || sendWelcomeSms) {
        const { notificationService } = require('../services/notificationService');
        let title = 'Welcome to UBAS Financial Trust';
        let message = 'Your account has been created. Login to get started.';
        if (welcomeEmailTemplateId || welcomeSmsTemplateId) {
          const tplRows = await db('message_templates')
            .whereIn('id', [welcomeEmailTemplateId, welcomeSmsTemplateId].filter(Boolean));
          const emailTpl = tplRows.find((t:any)=>t.id===welcomeEmailTemplateId);
            const smsTpl = tplRows.find((t:any)=>t.id===welcomeSmsTemplateId);
          if (emailTpl?.subject) title = emailTpl.subject;
          if (emailTpl?.body) message = emailTpl.body;
          if (smsTpl?.body) message = smsTpl.body;
        }
        await notificationService.sendNotification({
          id: require('uuid').v4(),
          userId,
          type: 'registration',
          priority: 'medium',
          title,
          message,
          channels: [
            ...(sendWelcomeEmail ? ['email'] : []),
            ...(sendWelcomeSms ? ['sms'] : []),
            'in_app'
          ]
        });
      }
    } catch (notifyErr) {
      logger.warn('Failed to send welcome notifications for admin-created user', notifyErr);
    }

    return res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: {
        userId,
        email,
        accountNumber
      }
    });
  } catch (error) {
    logger.error('Admin create user error:', error);
    return res.status(500).json({ success: false, message: 'Failed to create user' });
  }
});

// Create an additional account for a user
router.post('/users/:userId/accounts', [
  body('accountType').isIn(['checking','savings','business','investment','loan']).withMessage('Invalid account type'),
  body('currency').optional().isLength({ min: 3, max: 3 }),
  body('initialBalance').optional().isFloat({ min: 0 })
], async (req: AuthRequest, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: 'Validation failed', errors: errors.array() });
    }
    const { userId } = req.params;
    const { accountType, currency = 'USD', initialBalance = 0 } = req.body;
    const user = await db('users').where({ id: userId }).first();
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    const accountId = uuidv4();
    const accountNumber = Math.random().toString().slice(2, 12);
    await db('accounts').insert({
      id: accountId,
      user_id: userId,
      account_number: accountNumber,
      account_type: accountType,
      balance: initialBalance,
      available_balance: initialBalance,
      currency,
      status: 'active',
      minimum_balance: 0
    });
    logAudit('ADMIN_CREATED_ACCOUNT', (req as any).user?.id, 'account', { accountId, userId, accountType });
    return res.status(201).json({ success: true, message: 'Account created', data: { accountId, accountNumber } });
  } catch (error) {
    logger.error('Admin create account error:', error);
    return res.status(500).json({ success: false, message: 'Failed to create account' });
  }
});

// Seed (generate) synthetic transactions for a user's account
router.post('/accounts/:accountId/transactions/seed', [
  body('count').optional().isInt({ min: 1, max: 200 }),
  body('type').optional().isIn(['transfer','deposit','withdrawal','payment','fee','interest']),
], async (req: AuthRequest, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: 'Validation failed', errors: errors.array() });
    }
    const { accountId } = req.params;
    const { count = 10, type } = req.body;
    const account = await db('accounts').where({ id: accountId }).first();
    if (!account) return res.status(404).json({ success: false, message: 'Account not found' });
    const txs: any[] = [];
    for (let i=0;i<count;i++) {
      const amt = Number((Math.random()*500 + 5).toFixed(2));
      const isDebit = Math.random() > 0.5;
      const tType = type || (isDebit ? 'payment' : 'deposit');
      txs.push({
        id: uuidv4(),
        from_account_id: isDebit ? accountId : null,
        to_account_id: !isDebit ? accountId : null,
        amount: amt,
        currency: account.currency,
        type: tType,
        status: 'completed',
        description: `${tType} seed ${i+1}`,
        reference: `SEED${Date.now()}${i}${Math.random().toString(36).slice(2,6).toUpperCase()}`,
        category: 'Seed',
        processed_at: new Date(),
        created_at: new Date(),
        updated_at: new Date()
      });
    }
    await db('transactions').insert(txs);
    // Update balance roughly
    const net = txs.reduce((sum, t) => sum + (t.to_account_id ? t.amount : -t.amount), 0);
    await db('accounts').where({ id: accountId }).update({ balance: account.balance + net, available_balance: account.available_balance + net, updated_at: new Date() });
    logAudit('ADMIN_SEEDED_TRANSACTIONS', (req as any).user?.id, 'account', { accountId, count });
    return res.json({ success: true, message: 'Transactions seeded', data: { inserted: txs.length, netChange: net } });
  } catch (error) {
    logger.error('Admin seed transactions error:', error);
    return res.status(500).json({ success: false, message: 'Failed to seed transactions' });
  }
});

// List accounts for a specific user (admin)
router.get('/users/:userId/accounts', async (req: AuthRequest, res: Response) => {
  try {
    const { userId } = req.params;
    const user = await db('users').where({ id: userId }).first();
    if (!user) return res.status(404).json({ success:false, message:'User not found' });
    const accounts = await db('accounts').where({ user_id: userId }).orderBy('created_at','desc');
    return res.json({ success:true, data: accounts });
  } catch (error) {
    logger.error('Admin list user accounts error:', error);
    return res.status(500).json({ success:false, message:'Failed to get accounts' });
  }
});

// List transactions for an account (admin)
router.get('/accounts/:accountId/transactions', async (req: AuthRequest, res: Response) => {
  try {
    const { accountId } = req.params;
    const account = await db('accounts').where({ id: accountId }).first();
    if (!account) return res.status(404).json({ success:false, message:'Account not found' });
    const { page = 1, limit = 50 } = req.query as any;
    const offset = (Number(page)-1)*Number(limit);
    const txs = await db('transactions')
      .where('from_account_id', accountId)
      .orWhere('to_account_id', accountId)
      .orderBy('created_at','desc')
      .limit(Number(limit))
      .offset(offset);
    return res.json({ success:true, data: txs, pagination:{ page:Number(page), limit:Number(limit) }});
  } catch (error) {
    logger.error('Admin list account transactions error:', error);
    return res.status(500).json({ success:false, message:'Failed to get transactions' });
  }
});

// Send a direct test email (admin tool) to any target address to verify provider chain
router.post('/email/test', async (req: AuthRequest, res: Response) => {
  try {
    const { to, subject, message } = req.body;
    if (!to || !subject || !message) {
      return res.status(400).json({ success: false, message: 'to, subject, message required' });
    }
    const emailServiceModule = require('../services/emailService');
    const emailService = new emailServiceModule.EmailService();
    const conversationalHtml = `<!DOCTYPE html><html><body style="font-family:Arial,sans-serif;line-height:1.5;color:#111">
      <h2 style="margin:0 0 12px;font-size:20px">Hi there 👋</h2>
      <p style="margin:0 0 12px">${message}</p>
      <p style="margin:0 0 12px">If you were expecting a super formal template – this is intentionally conversational so you can gauge tone.&nbsp;Feel free to tweak variables and resend.</p>
      <hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0" />
      <p style="font-size:12px;color:#555;margin:0">Sent via UBAS multi‑provider relay (Resend → SMTP fallback). Time: ${new Date().toISOString()}</p>
    </body></html>`;
    const result = await emailService.sendEmail({ to, subject, text: message, html: conversationalHtml });
    return res.json({ success: result.success, provider: result.provider, messageId: result.messageId, error: result.error });
  } catch (err:any) {
    logger.error('Test email failed', err);
    return res.status(500).json({ success: false, message: 'Test email failed', error: err.message });
  }
});

// Credit a grant (admin) to a user's account
router.post('/accounts/:accountId/grants', [
  body('amount').isFloat({ min: 1 }).withMessage('Amount required'),
  body('purpose').isLength({ min: 3 }).withMessage('Purpose required'),
  body('currency').optional().isLength({ min:3, max:3 })
], async (req: AuthRequest, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success:false, message:'Validation failed', errors: errors.array() });
    }
    const { accountId } = req.params;
    const { amount, purpose, currency } = req.body;
    const account = await db('accounts').where({ id: accountId }).first();
    if (!account) return res.status(404).json({ success:false, message:'Account not found' });
    const grantId = uuidv4();
    const now = new Date();
    await db('grants').insert({
      id: grantId,
      user_id: account.user_id,
      account_id: accountId,
      amount,
      currency: currency || account.currency,
      purpose,
      status: 'approved',
      approved_at: now,
      metadata: { adminCredit: true }
    });
    await db('accounts').where({ id: accountId }).update({
      balance: Number(account.balance) + Number(amount),
      available_balance: Number(account.available_balance) + Number(amount),
      updated_at: now
    });
    logAudit('ADMIN_GRANTED_FUNDS', (req as any).user?.id, 'grant', { grantId, accountId, amount });
    return res.status(201).json({ success:true, message:'Grant credited', data:{ grantId } });
  } catch (error) {
    logger.error('Admin grant credit error:', error);
    return res.status(500).json({ success:false, message:'Failed to credit grant' });
  }
});

// Optional IP whitelist for admin endpoints (uncomment and configure as needed)
// router.use(ipWhitelist(['127.0.0.1', '::1']));

// Get system statistics
router.get('/stats', async (req: AuthRequest, res: Response) => {
  try {
    const [
      totalUsers,
      totalAccounts,
      totalTransactions,
      totalLoans,
      activeUsers,
      pendingKyc
    ] = await Promise.all([
      db('users').count('* as count').first(),
      db('accounts').count('* as count').first(),
      db('transactions').count('* as count').first(),
      db('loans').count('* as count').first(),
      db('users').where('is_active', true).count('* as count').first(),
      db('users').where('kyc_status', 'pending').count('* as count').first()
    ]);

    const stats = {
      users: {
        total: Number(totalUsers?.count || 0),
        active: Number(activeUsers?.count || 0)
      },
      accounts: {
        total: Number(totalAccounts?.count || 0)
      },
      transactions: {
        total: Number(totalTransactions?.count || 0)
      },
      loans: {
        total: Number(totalLoans?.count || 0)
      },
      kyc: {
        pending: Number(pendingKyc?.count || 0)
      }
    };

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    logger.error('Get admin stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get statistics'
    });
  }
});

// Get all users with pagination
router.get('/users', async (req: AuthRequest, res: Response) => {
  try {
    const { page = 1, limit = 20, search, status } = req.query;
    const offset = (Number(page) - 1) * Number(limit);

    let query = db('users').select(
      'id', 'email', 'first_name', 'last_name', 'phone', 
      'account_type', 'kyc_status', 'is_active', 'is_verified',
      'two_factor_enabled', 'last_login', 'created_at'
    );

    if (search) {
      query = query.where(function() {
        this.where('email', 'ilike', `%${search}%`)
            .orWhere('first_name', 'ilike', `%${search}%`)
            .orWhere('last_name', 'ilike', `%${search}%`);
      });
    }

    if (status) {
      query = query.where('kyc_status', status);
    }

    const users = await query
      .orderBy('created_at', 'desc')
      .limit(Number(limit))
      .offset(offset);

    const total = await query.clone().count('* as count').first();

    res.json({
      success: true,
      data: users,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total: Number(total?.count || 0),
        totalPages: Math.ceil(Number(total?.count || 0) / Number(limit))
      }
    });
  } catch (error) {
    logger.error('Get admin users error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get users'
    });
  }
});

// Update user KYC status
router.patch('/users/:userId/kyc', async (req: AuthRequest, res: Response) => {
  try {
    const admin = req.user!;
    const { userId } = req.params;
    const { status, reason } = req.body;

    if (!['pending', 'in_progress', 'approved', 'rejected'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid KYC status'
      });
    }

    const user = await db('users').where({ id: userId }).first();
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const updateData: any = {
      kyc_status: status,
      updated_at: new Date()
    };

    if (status === 'approved') {
      updateData.is_verified = true;
    }

    await db('users').where({ id: userId }).update(updateData);

    logAudit('KYC_STATUS_UPDATED', admin.id, 'user', {
      targetUserId: userId,
      oldStatus: user.kyc_status,
      newStatus: status,
      reason
    });

    res.json({
      success: true,
      message: `KYC status updated to ${status}`
    });
  } catch (error) {
    logger.error('Update KYC status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update KYC status'
    });
  }
});

// Get pending loan applications
router.get('/loans/pending', async (req: AuthRequest, res: Response) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const offset = (Number(page) - 1) * Number(limit);

    const loans = await db('loans')
      .join('users', 'loans.user_id', 'users.id')
      .where('loans.status', 'pending')
      .select(
        'loans.*',
        'users.email',
        'users.first_name',
        'users.last_name',
        'users.kyc_status'
      )
      .orderBy('loans.created_at', 'desc')
      .limit(Number(limit))
      .offset(offset);

    const total = await db('loans')
      .where('status', 'pending')
      .count('* as count')
      .first();

    res.json({
      success: true,
      data: loans,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total: Number(total?.count || 0),
        totalPages: Math.ceil(Number(total?.count || 0) / Number(limit))
      }
    });
  } catch (error) {
    logger.error('Get pending loans error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get pending loans'
    });
  }
});

// Approve/Reject loan application
router.patch('/loans/:loanId/status', async (req: AuthRequest, res: Response) => {
  try {
    const admin = req.user!;
    const { loanId } = req.params;
    const { status, reason } = req.body;

    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid loan status. Must be "approved" or "rejected"'
      });
    }

    const loan = await db('loans').where({ id: loanId, status: 'pending' }).first();
    if (!loan) {
      return res.status(404).json({
        success: false,
        message: 'Pending loan not found'
      });
    }

    const updateData: any = {
      status,
      updated_at: new Date()
    };

    if (status === 'approved') {
      updateData.approved_at = new Date();
    }

    await db('loans').where({ id: loanId }).update(updateData);

    logAudit('LOAN_STATUS_UPDATED', admin.id, 'loan', {
      loanId,
      userId: loan.user_id,
      oldStatus: 'pending',
      newStatus: status,
      reason
    });

    res.json({
      success: true,
      message: `Loan ${status} successfully`
    });
  } catch (error) {
    logger.error('Update loan status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update loan status'
    });
  }
});

// Get pending KYC applications
router.get('/kyc/pending', async (req: AuthRequest, res: Response) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const offset = (Number(page) - 1) * Number(limit);

    const applications = await db('kyc_applications')
      .join('users', 'kyc_applications.user_id', 'users.id')
      .where('kyc_applications.status', 'pending')
      .select(
        'kyc_applications.*',
        'users.email',
        'users.first_name',
        'users.last_name',
        'users.phone'
      )
      .orderBy('kyc_applications.submitted_at', 'desc')
      .limit(Number(limit))
      .offset(offset);

    const total = await db('kyc_applications')
      .where('status', 'pending')
      .count('* as count')
      .first();

    res.json({
      success: true,
      data: {
        applications,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total: Number(total?.count || 0),
          pages: Math.ceil(Number(total?.count || 0) / Number(limit))
        }
      }
    });
  } catch (error) {
    logger.error('Get pending KYC applications error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get pending KYC applications'
    });
  }
});

// Approve/Reject KYC application
router.patch('/kyc/:kycId/review', [
  body('action').isIn(['approve', 'reject']).withMessage('Action must be approve or reject'),
  body('notes').optional().isString()
], async (req: AuthRequest, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const admin = req.user!;
    const { kycId } = req.params;
    const { action, notes } = req.body;

    const application = await db('kyc_applications').where({ id: kycId }).first();
    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'KYC application not found'
      });
    }

    const newStatus = action === 'approve' ? 'approved' : 'rejected';

    // Update KYC application
    await db('kyc_applications').where({ id: kycId }).update({
      status: newStatus,
      reviewed_at: new Date(),
      reviewed_by: admin.id,
      admin_notes: notes
    });

    // Update user KYC status
    const updateData: any = {
      kyc_status: newStatus,
      updated_at: new Date()
    };

    if (action === 'approve') {
      updateData.is_verified = true;
    }

    await db('users').where({ id: application.user_id }).update(updateData);

    // Send notification to user
    const notificationService = require('../services/notificationService').notificationService;
    await notificationService.sendNotification({
      userId: application.user_id,
      type: `kyc_${action}d`,
      title: `KYC ${action === 'approve' ? 'Approved' : 'Rejected'}`,
      message: action === 'approve'
        ? 'Your KYC verification has been approved. You now have full access to all banking features.'
        : `Your KYC verification has been rejected. ${notes || 'Please contact support for more information.'}`,
      priority: 'high',
      channels: ['email', 'in_app'],
      metadata: { kycId, action, notes }
    });

    logAudit('KYC_REVIEWED', admin.id, 'kyc', {
      kycId,
      userId: application.user_id,
      action,
      notes
    });

    res.json({
      success: true,
      message: `KYC application ${action}d successfully`
    });

  } catch (error) {
    logger.error('KYC review error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to review KYC application'
    });
  }
});

export default router;
// --- Appended admin utilities ---
// Email provider health check
router.get('/email/health', async (_req: Request, res: Response) => {
  try {
    const { EmailService } = require('../services/emailService');
    const svc = new EmailService();
    const status = await svc.getProviderStatus();
    res.json({ success: true, providers: status });
  } catch (e:any) {
    res.status(500).json({ success: false, error: e.message });
  }
});

// Admin: send a test notification to a user (requires auth + admin role)
router.post('/notifications/test', async (req: any, res: Response) => {
  try {
    const { userId, channel = 'email' } = req.body || {};
    if (!userId) return res.status(400).json({ success: false, message: 'userId required' });
    const { notificationService } = require('../services/notificationService');
    await notificationService.sendNotification({
      id: require('uuid').v4(),
      userId,
      type: 'system',
      priority: 'low',
      title: 'Test notification',
      message: 'This is a test notification from the admin panel.',
      channels: [channel]
    });
    res.json({ success: true });
  } catch (e:any) {
    res.status(500).json({ success: false, message: e.message });
  }
});
