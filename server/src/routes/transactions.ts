import { Router, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { AuthMiddleware } from '../middleware/auth';
import { transferRateLimit } from '../middleware/security';
import { db } from '../config/db';
import { CacheService } from '../config/redis';
import { logger, logTransaction, logAudit } from '../utils/logger';
import { AuthRequest } from '../types';
import { v4 as uuidv4 } from 'uuid';
import { io } from '../server';
import { notificationService } from '../services/notificationService';
import { fraudDetectionService } from '../services/fraudDetectionService';

const router = Router();

// All routes require authentication
router.use(AuthMiddleware.verifyToken);

// Transfer funds
router.post('/transfer', transferRateLimit, [
  body('fromAccountId').isUUID(),
  body('toAccountNumber').isLength({ min: 10, max: 10 }),
  body('amount').isFloat({ min: 0.01 }),
  body('description').isLength({ min: 1, max: 255 }),
  body('recipientName').optional().isLength({ min: 1, max: 100 })
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
    const { fromAccountId, toAccountNumber, amount, description, recipientName } = req.body;

    // Acquire lock for this transfer to prevent double spending
    const lockKey = `transfer_lock:${fromAccountId}`;
    const lockAcquired = await CacheService.acquireLock(lockKey, 30);

    if (!lockAcquired) {
      return res.status(409).json({
        success: false,
        message: 'Another transaction is in progress for this account'
      });
    }

    let reference: string = '';

    try {
      // Start transaction
      await db.transaction(async (trx) => {
        // Verify source account ownership and get details
        const fromAccount = await trx('accounts')
          .where({ id: fromAccountId, user_id: user.id, status: 'active' })
          .first();

        if (!fromAccount) {
          throw new Error('Source account not found or inactive');
        }

        // Find destination account
        const toAccount = await trx('accounts')
          .where({ account_number: toAccountNumber, status: 'active' })
          .first();

        if (!toAccount) {
          throw new Error('Destination account not found or inactive');
        }

        // Check if trying to transfer to same account
        if (fromAccount.id === toAccount.id) {
          throw new Error('Cannot transfer to the same account');
        }

        // Check sufficient balance
        if (fromAccount.available_balance < amount) {
          throw new Error('Insufficient funds');
        }

        // Check minimum balance requirement
        const newBalance = fromAccount.balance - amount;
        if (newBalance < fromAccount.minimum_balance) {
          throw new Error('Transfer would violate minimum balance requirement');
        }

  // Calculate fee (example: 0.1% with minimum of 10 in account currency units)
        const feeAmount = Math.max(amount * 0.001, 10);
        const totalDeduction = amount + feeAmount;

        if (fromAccount.available_balance < totalDeduction) {
          throw new Error('Insufficient funds including fees');
        }

        // Fraud detection analysis
        const fraudAnalysis = await fraudDetectionService.analyzeTransaction({
          userId: user.id,
          amount,
          currency: fromAccount.currency,
          type: 'transfer',
          fromAccountId: fromAccount.id,
          toAccountNumber,
          ipAddress: req.ip || 'unknown',
          userAgent: req.headers['user-agent'] || 'unknown',
          timestamp: new Date()
        });

        // Block transaction if high risk
        if (fraudAnalysis.shouldBlock) {
          throw new Error(`Transaction blocked due to security concerns: ${fraudAnalysis.reasons.join(', ')}`);
        }

        // Generate transaction reference
        const reference = `TXN${Date.now()}${Math.random().toString(36).substr(2, 5).toUpperCase()}`;

        // Create transaction record
        const transactionId = uuidv4();
        const transaction = {
          id: transactionId,
          from_account_id: fromAccount.id,
          to_account_id: toAccount.id,
          amount,
          currency: fromAccount.currency,
          type: 'transfer',
          status: 'processing',
          description,
          reference,
          category: 'Transfer',
          fee_amount: feeAmount,
          metadata: {
            recipient_name: recipientName,
            recipient_account: toAccountNumber
          }
        };

        await trx('transactions').insert(transaction);

        // Update account balances
        await trx('accounts')
          .where({ id: fromAccount.id })
          .update({
            balance: fromAccount.balance - totalDeduction,
            available_balance: fromAccount.available_balance - totalDeduction,
            updated_at: new Date()
          });

        await trx('accounts')
          .where({ id: toAccount.id })
          .update({
            balance: toAccount.balance + amount,
            available_balance: toAccount.available_balance + amount,
            updated_at: new Date()
          });

        // Create fee transaction if applicable
        if (feeAmount > 0) {
          const feeTransaction = {
            id: uuidv4(),
            from_account_id: fromAccount.id,
            amount: feeAmount,
            currency: fromAccount.currency,
            type: 'fee',
            status: 'completed',
            description: 'Transfer fee',
            reference: `FEE${reference}`,
            category: 'Fee'
          };

          await trx('transactions').insert(feeTransaction);
        }

        // Update transaction status to completed
        await trx('transactions')
          .where({ id: transactionId })
          .update({
            status: 'completed',
            processed_at: new Date()
          });

        // Log transaction
        logTransaction(
          transactionId,
          'transfer',
          amount,
          fromAccount.id,
          toAccount.id,
          'completed',
          { fee: feeAmount, reference }
        );

        logAudit('TRANSFER_COMPLETED', user.id, 'transaction', {
          transactionId,
          amount,
          fromAccount: fromAccount.account_number,
          toAccount: toAccountNumber
        });

        // Send real-time notification
        io.to(`user_${user.id}`).emit('transaction_completed', {
          transactionId,
          type: 'transfer',
          amount,
          status: 'completed',
          reference
        });

        // Send notification event for sender
        try {
            notificationService.emit('transaction:completed', {
            userId: user.id,
            type: 'transfer',
            amount,
              currency: fromAccount.currency,
            reference,
            toAccountNumber,
            transactionId
          });
        } catch (error) {
          console.error('Failed to send transaction notification:', error);
        }

        // Send notification to recipient if they're online
        const recipientUser = await trx('users')
          .join('accounts', 'users.id', 'accounts.user_id')
          .where('accounts.id', toAccount.id)
          .select('users.id')
          .first();

        if (recipientUser) {
          io.to(`user_${recipientUser.id}`).emit('transaction_received', {
            transactionId,
            type: 'transfer',
            amount,
            status: 'completed',
            reference,
            from: `${user.first_name} ${user.last_name}`
          });

          // Send notification event for recipient
          try {
              notificationService.emit('transaction:completed', {
              userId: recipientUser.id,
              type: 'transfer_received',
              amount,
                currency: toAccount.currency || fromAccount.currency,
              reference,
              fromUser: `${user.first_name} ${user.last_name}`,
              transactionId
            });
          } catch (error) {
            console.error('Failed to send recipient notification:', error);
          }
        }

        return transaction;
      });

      res.json({
        success: true,
        message: 'Transfer completed successfully',
        data: {
          reference,
          amount,
          fee: Math.max(amount * 0.001, 10)
        }
      });
    } finally {
      // Release lock
      await CacheService.releaseLock(lockKey);
    }
  } catch (error) {
    logger.error('Transfer error:', error);

    let message = 'Transfer failed';
    if (error instanceof Error) {
      message = error.message;
    }

    res.status(400).json({
      success: false,
      message
    });
  }
});

// Get transaction details
router.get('/:transactionId', async (req: AuthRequest, res: Response) => {
  try {
    const user = req.user!;
    const { transactionId } = req.params;

    // Get user account IDs
    const userAccounts = await db('accounts')
      .where({ user_id: user.id })
      .select('id');

    const accountIds = userAccounts.map(acc => acc.id);

    const transaction = await db('transactions')
      .where('id', transactionId)
      .andWhere(function() {
        this.whereIn('from_account_id', accountIds)
            .orWhereIn('to_account_id', accountIds);
      })
      .first();

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found'
      });
    }

    res.json({
      success: true,
      data: transaction
    });
  } catch (error) {
    logger.error('Get transaction error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get transaction'
    });
  }
});

export default router;
