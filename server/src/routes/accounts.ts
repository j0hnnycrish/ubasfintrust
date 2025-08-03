import { Router, Response } from 'express';
import { AuthMiddleware } from '../middleware/auth';
import { db } from '../config/db';
import { logger } from '../utils/logger';
import { AuthRequest } from '../types';

const router = Router();

// All routes require authentication
router.use(AuthMiddleware.verifyToken);

// Get account details
router.get('/:accountId', async (req: AuthRequest, res: Response) => {
  try {
    const user = req.user!;
    const { accountId } = req.params;

    const account = await db('accounts')
      .where({ id: accountId, user_id: user.id })
      .first();

    if (!account) {
      return res.status(404).json({
        success: false,
        message: 'Account not found'
      });
    }

    res.json({
      success: true,
      data: account
    });
  } catch (error) {
    logger.error('Get account error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get account'
    });
  }
});

// Get account balance
router.get('/:accountId/balance', async (req: AuthRequest, res: Response) => {
  try {
    const user = req.user!;
    const { accountId } = req.params;

    const account = await db('accounts')
      .where({ id: accountId, user_id: user.id })
      .select('balance', 'available_balance', 'currency')
      .first();

    if (!account) {
      return res.status(404).json({
        success: false,
        message: 'Account not found'
      });
    }

    res.json({
      success: true,
      data: account
    });
  } catch (error) {
    logger.error('Get balance error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get balance'
    });
  }
});

// Get account transactions
router.get('/:accountId/transactions', async (req: AuthRequest, res: Response) => {
  try {
    const user = req.user!;
    const { accountId } = req.params;
    const { page = 1, limit = 20, type, status } = req.query;

    // Verify account ownership
    const account = await db('accounts')
      .where({ id: accountId, user_id: user.id })
      .first();

    if (!account) {
      return res.status(404).json({
        success: false,
        message: 'Account not found'
      });
    }

    const offset = (Number(page) - 1) * Number(limit);

    let query = db('transactions')
      .where('from_account_id', accountId)
      .orWhere('to_account_id', accountId);

    if (type) {
      query = query.andWhere('type', type);
    }

    if (status) {
      query = query.andWhere('status', status);
    }

    const transactions = await query
      .orderBy('created_at', 'desc')
      .limit(Number(limit))
      .offset(offset);

    const total = await query.clone().count('* as count').first();

    res.json({
      success: true,
      data: transactions,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total: Number(total?.count || 0),
        totalPages: Math.ceil(Number(total?.count || 0) / Number(limit))
      }
    });
  } catch (error) {
    logger.error('Get account transactions error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get transactions'
    });
  }
});

export default router;
