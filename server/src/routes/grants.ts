import { Router, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { AuthMiddleware } from '../middleware/auth';
import { db } from '../config/db';
import { logger, logAudit } from '../utils/logger';
import { AuthRequest } from '../types';
import { v4 as uuidv4 } from 'uuid';

const router = Router();
router.use(AuthMiddleware.verifyToken);

// List user grants
router.get('/', async (req: AuthRequest, res: Response) => {
  try {
    const user = req.user!;
    const grants = await db('grants').where({ user_id: user.id }).orderBy('created_at','desc');
    res.json({ success: true, data: grants });
  } catch (e) {
    logger.error('List grants error:', e);
    res.status(500).json({ success:false, message:'Failed to list grants' });
  }
});

// Apply for a grant (auto-approved simple simulation)
router.post('/apply', [
  body('accountId').isUUID(),
  body('amount').isFloat({ min: 100, max: 1000000 }),
  body('purpose').isLength({ min: 5, max: 500 })
], async (req: AuthRequest, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success:false, message:'Validation failed', errors: errors.array() });
    }
    const user = req.user!;
    const { accountId, amount, purpose } = req.body;
    const account = await db('accounts').where({ id: accountId, user_id: user.id }).first();
    if (!account) return res.status(404).json({ success:false, message:'Account not found' });

    const grantId = uuidv4();
    const now = new Date();
    await db('grants').insert({
      id: grantId,
      user_id: user.id,
      account_id: accountId,
      amount,
      currency: account.currency,
      purpose,
      status: 'approved',
      approved_at: now,
      metadata: { simulated: true }
    });

    // Credit account
    await db('accounts').where({ id: accountId }).update({
      balance: account.balance + amount,
      available_balance: account.available_balance + amount,
      updated_at: now
    });

    logAudit('GRANT_APPROVED', user.id, 'grant', { grantId, amount });
    res.status(201).json({ success:true, message:'Grant approved and credited', data:{ grantId } });
  } catch (e) {
    logger.error('Apply grant error:', e);
    res.status(500).json({ success:false, message:'Failed to apply for grant' });
  }
});

export default router;
