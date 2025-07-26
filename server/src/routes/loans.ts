import { Router, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { AuthMiddleware } from '@/middleware/auth';
import { db } from '@/config/db';
import { logger, logAudit } from '@/utils/logger';
import { AuthRequest } from '@/types';
import { v4 as uuidv4 } from 'uuid';

const router = Router();

// All routes require authentication
router.use(AuthMiddleware.verifyToken);

// Get user loans
router.get('/', async (req: AuthRequest, res: Response) => {
  try {
    const user = req.user!;
    
    const loans = await db('loans')
      .where({ user_id: user.id })
      .orderBy('created_at', 'desc');

    res.json({
      success: true,
      data: loans
    });
  } catch (error) {
    logger.error('Get loans error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get loans'
    });
  }
});

// Apply for loan
router.post('/apply', [
  body('loanType').isIn(['personal', 'mortgage', 'auto', 'business', 'student']),
  body('principalAmount').isFloat({ min: 10000, max: 50000000 }),
  body('termMonths').isInt({ min: 6, max: 360 }),
  body('purpose').isLength({ min: 10, max: 500 }),
  body('monthlyIncome').isFloat({ min: 50000 }),
  body('collateral').optional().isLength({ max: 500 })
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
    const { loanType, principalAmount, termMonths, purpose, monthlyIncome, collateral } = req.body;

    // Check if user has KYC approved
    if (user.kyc_status !== 'approved') {
      return res.status(400).json({
        success: false,
        message: 'KYC verification required before applying for loans'
      });
    }

    // Check for existing pending loans
    const existingPendingLoan = await db('loans')
      .where({ user_id: user.id, status: 'pending' })
      .first();

    if (existingPendingLoan) {
      return res.status(400).json({
        success: false,
        message: 'You already have a pending loan application'
      });
    }

    // Calculate interest rate based on loan type and amount
    let interestRate = 15; // Default 15%
    switch (loanType) {
      case 'personal':
        interestRate = 18;
        break;
      case 'mortgage':
        interestRate = 12;
        break;
      case 'auto':
        interestRate = 15;
        break;
      case 'business':
        interestRate = 20;
        break;
      case 'student':
        interestRate = 10;
        break;
    }

    // Calculate monthly payment using loan formula
    const monthlyRate = interestRate / 100 / 12;
    const monthlyPayment = principalAmount * 
      (monthlyRate * Math.pow(1 + monthlyRate, termMonths)) / 
      (Math.pow(1 + monthlyRate, termMonths) - 1);

    // Basic affordability check (monthly payment should not exceed 40% of income)
    if (monthlyPayment > monthlyIncome * 0.4) {
      return res.status(400).json({
        success: false,
        message: 'Loan amount exceeds affordability criteria'
      });
    }

    const loanId = uuidv4();
    const loan = {
      id: loanId,
      user_id: user.id,
      loan_type: loanType,
      principal_amount: principalAmount,
      interest_rate: interestRate,
      term_months: termMonths,
      monthly_payment: Math.round(monthlyPayment * 100) / 100,
      outstanding_balance: principalAmount,
      status: 'pending',
      purpose,
      collateral: collateral || null
    };

    await db('loans').insert(loan);

    logAudit('LOAN_APPLICATION_SUBMITTED', user.id, 'loan', {
      loanId,
      loanType,
      principalAmount,
      termMonths
    });

    res.status(201).json({
      success: true,
      message: 'Loan application submitted successfully',
      data: {
        loanId,
        monthlyPayment: loan.monthly_payment,
        interestRate,
        status: 'pending'
      }
    });
  } catch (error) {
    logger.error('Loan application error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit loan application'
    });
  }
});

// Get loan details
router.get('/:loanId', async (req: AuthRequest, res: Response) => {
  try {
    const user = req.user!;
    const { loanId } = req.params;

    const loan = await db('loans')
      .where({ id: loanId, user_id: user.id })
      .first();

    if (!loan) {
      return res.status(404).json({
        success: false,
        message: 'Loan not found'
      });
    }

    res.json({
      success: true,
      data: loan
    });
  } catch (error) {
    logger.error('Get loan error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get loan'
    });
  }
});

// Make loan payment
router.post('/:loanId/payment', [
  body('amount').isFloat({ min: 1 }),
  body('accountId').isUUID()
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
    const { loanId } = req.params;
    const { amount, accountId } = req.body;

    // Get loan details
    const loan = await db('loans')
      .where({ id: loanId, user_id: user.id, status: 'active' })
      .first();

    if (!loan) {
      return res.status(404).json({
        success: false,
        message: 'Active loan not found'
      });
    }

    // Verify account ownership
    const account = await db('accounts')
      .where({ id: accountId, user_id: user.id, status: 'active' })
      .first();

    if (!account) {
      return res.status(404).json({
        success: false,
        message: 'Account not found'
      });
    }

    // Check sufficient balance
    if (account.available_balance < amount) {
      return res.status(400).json({
        success: false,
        message: 'Insufficient funds'
      });
    }

    await db.transaction(async (trx) => {
      // Create payment transaction
      const transactionId = uuidv4();
      const reference = `LOAN${Date.now()}${Math.random().toString(36).substr(2, 5).toUpperCase()}`;
      
      const transaction = {
        id: transactionId,
        from_account_id: accountId,
        amount,
        currency: account.currency,
        type: 'loan_payment',
        status: 'completed',
        description: `Loan payment for ${loan.loan_type} loan`,
        reference,
        category: 'Loan Payment',
        metadata: {
          loan_id: loanId,
          loan_type: loan.loan_type
        },
        processed_at: new Date()
      };

      await trx('transactions').insert(transaction);

      // Update account balance
      await trx('accounts')
        .where({ id: accountId })
        .update({
          balance: account.balance - amount,
          available_balance: account.available_balance - amount,
          updated_at: new Date()
        });

      // Update loan outstanding balance
      const newOutstandingBalance = Math.max(0, loan.outstanding_balance - amount);
      const loanStatus = newOutstandingBalance === 0 ? 'paid_off' : 'active';

      await trx('loans')
        .where({ id: loanId })
        .update({
          outstanding_balance: newOutstandingBalance,
          status: loanStatus,
          updated_at: new Date()
        });

      logAudit('LOAN_PAYMENT_MADE', user.id, 'loan', {
        loanId,
        amount,
        newOutstandingBalance,
        transactionId
      });
    });

    res.json({
      success: true,
      message: 'Loan payment processed successfully',
      data: {
        amount,
        remainingBalance: Math.max(0, loan.outstanding_balance - amount)
      }
    });
  } catch (error) {
    logger.error('Loan payment error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process loan payment'
    });
  }
});

export default router;
