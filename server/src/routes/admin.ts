import { Router, Response } from 'express';
import { AuthMiddleware } from '../middleware/auth';
import { ipWhitelist } from '../middleware/security';
import { db } from '../config/db';
import { logger, logAudit } from '../utils/logger';
import { AuthRequest } from '../types';

const router = Router();

// All admin routes require authentication and admin role
router.use(AuthMiddleware.verifyToken);
router.use(AuthMiddleware.requireRole(['corporate'])); // Only corporate users can access admin functions

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
