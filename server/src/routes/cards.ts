import { Router, Response } from 'express';
import { AuthMiddleware } from '@/middleware/auth';
import { db } from '@/config/db';
import { logger } from '@/utils/logger';
import { AuthRequest } from '@/types';

const router = Router();

// All routes require authentication
router.use(AuthMiddleware.verifyToken);

// Get user cards
router.get('/', async (req: AuthRequest, res: Response) => {
  try {
    const user = req.user!;
    
    const cards = await db('cards')
      .join('accounts', 'cards.account_id', 'accounts.id')
      .where('accounts.user_id', user.id)
      .select(
        'cards.id',
        'cards.card_number',
        'cards.card_type',
        'cards.status',
        'cards.expiry_date',
        'cards.daily_limit',
        'cards.monthly_limit',
        'cards.is_contactless',
        'cards.created_at',
        'accounts.account_number',
        'accounts.account_type'
      );

    // Mask card numbers for security
    const maskedCards = cards.map(card => ({
      ...card,
      card_number: `****-****-****-${card.card_number.slice(-4)}`
    }));

    res.json({
      success: true,
      data: maskedCards
    });
  } catch (error) {
    logger.error('Get cards error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get cards'
    });
  }
});

// Get card details
router.get('/:cardId', async (req: AuthRequest, res: Response) => {
  try {
    const user = req.user!;
    const { cardId } = req.params;

    const card = await db('cards')
      .join('accounts', 'cards.account_id', 'accounts.id')
      .where('cards.id', cardId)
      .andWhere('accounts.user_id', user.id)
      .select(
        'cards.id',
        'cards.card_number',
        'cards.card_type',
        'cards.status',
        'cards.expiry_date',
        'cards.daily_limit',
        'cards.monthly_limit',
        'cards.is_contactless',
        'cards.created_at',
        'accounts.account_number',
        'accounts.account_type',
        'accounts.balance'
      )
      .first();

    if (!card) {
      return res.status(404).json({
        success: false,
        message: 'Card not found'
      });
    }

    // Mask card number for security
    card.card_number = `****-****-****-${card.card_number.slice(-4)}`;

    res.json({
      success: true,
      data: card
    });
  } catch (error) {
    logger.error('Get card error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get card'
    });
  }
});

// Block/Unblock card
router.patch('/:cardId/status', async (req: AuthRequest, res: Response) => {
  try {
    const user = req.user!;
    const { cardId } = req.params;
    const { status } = req.body;

    if (!['active', 'blocked'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be "active" or "blocked"'
      });
    }

    // Verify card ownership
    const card = await db('cards')
      .join('accounts', 'cards.account_id', 'accounts.id')
      .where('cards.id', cardId)
      .andWhere('accounts.user_id', user.id)
      .select('cards.id', 'cards.status')
      .first();

    if (!card) {
      return res.status(404).json({
        success: false,
        message: 'Card not found'
      });
    }

    if (card.status === 'expired') {
      return res.status(400).json({
        success: false,
        message: 'Cannot change status of expired card'
      });
    }

    await db('cards')
      .where({ id: cardId })
      .update({
        status,
        updated_at: new Date()
      });

    res.json({
      success: true,
      message: `Card ${status === 'blocked' ? 'blocked' : 'activated'} successfully`
    });
  } catch (error) {
    logger.error('Update card status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update card status'
    });
  }
});

// Update card limits
router.patch('/:cardId/limits', async (req: AuthRequest, res: Response) => {
  try {
    const user = req.user!;
    const { cardId } = req.params;
    const { dailyLimit, monthlyLimit } = req.body;

    // Verify card ownership
    const card = await db('cards')
      .join('accounts', 'cards.account_id', 'accounts.id')
      .where('cards.id', cardId)
      .andWhere('accounts.user_id', user.id)
      .select('cards.id')
      .first();

    if (!card) {
      return res.status(404).json({
        success: false,
        message: 'Card not found'
      });
    }

    const updateData: any = {};
    if (dailyLimit !== undefined) {
      if (dailyLimit < 1000 || dailyLimit > 1000000) {
        return res.status(400).json({
          success: false,
          message: 'Daily limit must be between 1,000 and 1,000,000'
        });
      }
      updateData.daily_limit = dailyLimit;
    }

    if (monthlyLimit !== undefined) {
      if (monthlyLimit < 10000 || monthlyLimit > 10000000) {
        return res.status(400).json({
          success: false,
          message: 'Monthly limit must be between 10,000 and 10,000,000'
        });
      }
      updateData.monthly_limit = monthlyLimit;
    }

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No valid limits provided'
      });
    }

    updateData.updated_at = new Date();

    await db('cards').where({ id: cardId }).update(updateData);

    res.json({
      success: true,
      message: 'Card limits updated successfully'
    });
  } catch (error) {
    logger.error('Update card limits error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update card limits'
    });
  }
});

export default router;
