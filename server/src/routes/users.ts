import { Router, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { AuthMiddleware } from '../middleware/auth';
import { db } from '../config/db';
import { logger, logAudit } from '../utils/logger';
import { AuthRequest } from '../types';

const router = Router();

// All routes require authentication
router.use(AuthMiddleware.verifyToken);

// Get current user profile
router.get('/profile', async (req: AuthRequest, res: Response) => {
  try {
    const user = req.user!;
    
    const userProfile = await db('users')
      .select('id', 'email', 'first_name', 'last_name', 'phone', 'date_of_birth', 
              'account_type', 'kyc_status', 'is_verified', 'two_factor_enabled', 'created_at')
      .where({ id: user.id })
      .first();

    if (!userProfile) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      data: userProfile
    });
  } catch (error) {
    logger.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get profile'
    });
  }
});

// Update user profile
router.put('/profile', [
  body('firstName').optional().isLength({ min: 2 }).trim(),
  body('lastName').optional().isLength({ min: 2 }).trim(),
  body('phone').optional().isMobilePhone('any'),
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

    const user = req.user!;
    const { firstName, lastName, phone } = req.body;

    const updateData: any = {};
    if (firstName) updateData.first_name = firstName;
    if (lastName) updateData.last_name = lastName;
    if (phone) updateData.phone = phone;

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No valid fields to update'
      });
    }

    updateData.updated_at = new Date();

    await db('users').where({ id: user.id }).update(updateData);

    logAudit('USER_PROFILE_UPDATED', user.id, 'user', updateData);

    // Notify user about profile update (email + in-app)
    try {
      const { notificationService } = require('../services/notificationService');
      await notificationService.sendNotification({
        id: require('uuid').v4(),
        userId: user.id,
        type: 'profile_update',
        priority: 'medium',
        title: 'Your profile was updated',
        message: 'Your account profile details were updated successfully.',
        channels: ['email','in_app']
      });
    } catch (notifErr) {
      logger.warn('Failed to send profile update notification', notifErr);
    }

    res.json({
      success: true,
      message: 'Profile updated successfully'
    });
  } catch (error) {
    logger.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update profile'
    });
  }
});

// Change password
router.put('/password', [
  body('currentPassword').notEmpty(),
  body('newPassword').isLength({ min: 8 }).matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
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

    const user = req.user!;
    const { currentPassword, newPassword } = req.body;

    // Verify current password
    const isValidPassword = await AuthMiddleware.verifyPassword(currentPassword, user.password_hash);
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    // Hash new password
    const newPasswordHash = await AuthMiddleware.hashPassword(newPassword);

    await db('users').where({ id: user.id }).update({
      password_hash: newPasswordHash,
      updated_at: new Date()
    });

    logAudit('PASSWORD_CHANGED', user.id, 'user');

    res.json({
      success: true,
      message: 'Password changed successfully'
    });
  } catch (error) {
    logger.error('Change password error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to change password'
    });
  }
});

// Get user accounts
router.get('/accounts', async (req: AuthRequest, res: Response) => {
  try {
    const user = req.user!;
    
    const accounts = await db('accounts')
      .where({ user_id: user.id, status: 'active' })
      .select('id', 'account_number', 'account_type', 'balance', 'available_balance', 
              'currency', 'status', 'created_at');

    res.json({
      success: true,
      data: accounts
    });
  } catch (error) {
    logger.error('Get accounts error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get accounts'
    });
  }
});

// Get user transactions
router.get('/transactions', async (req: AuthRequest, res: Response) => {
  try {
    const user = req.user!;
    const { page = 1, limit = 20, type, status } = req.query;
    
    const offset = (Number(page) - 1) * Number(limit);

    // Get user account IDs
    const userAccounts = await db('accounts')
      .where({ user_id: user.id })
      .select('id');
    
    const accountIds = userAccounts.map(acc => acc.id);

    let query = db('transactions')
      .whereIn('from_account_id', accountIds)
      .orWhereIn('to_account_id', accountIds);

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
    logger.error('Get transactions error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get transactions'
    });
  }
});

export default router;
