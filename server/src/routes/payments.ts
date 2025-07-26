import { Router, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { AuthMiddleware } from '@/middleware/auth';
import { transferRateLimit } from '@/middleware/security';
import { PaymentService } from '@/services/paymentService';
import { logger, logAudit } from '@/utils/logger';
import { AuthRequest } from '@/types';

const router = Router();

// All routes require authentication
router.use(AuthMiddleware.verifyToken);

// Create deposit payment intent
router.post('/deposit/create-intent', [
  body('accountId').isUUID(),
  body('amount').isFloat({ min: 100 }), // Minimum ₦100
  body('currency').optional().isIn(['NGN', 'USD', 'EUR', 'GBP'])
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
    const { accountId, amount, currency = 'NGN' } = req.body;

    // Convert amount to kobo for Stripe (NGN)
    const amountInKobo = Math.round(amount * 100);

    const paymentIntent = await PaymentService.createDepositIntent(
      user.id,
      accountId,
      amountInKobo,
      currency
    );

    logAudit('DEPOSIT_INTENT_CREATED', user.id, 'payment', {
      accountId,
      amount,
      currency,
      paymentIntentId: paymentIntent.id
    });

    res.json({
      success: true,
      data: paymentIntent
    });
  } catch (error: any) {
    logger.error('Create deposit intent error:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to create deposit intent'
    });
  }
});

// Create withdrawal request
router.post('/withdraw', transferRateLimit, [
  body('accountId').isUUID(),
  body('amount').isFloat({ min: 100 }),
  body('bankDetails.accountNumber').isLength({ min: 10, max: 10 }),
  body('bankDetails.bankCode').isLength({ min: 3, max: 3 }),
  body('bankDetails.accountName').isLength({ min: 2, max: 100 })
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
    const { accountId, amount, bankDetails } = req.body;

    const withdrawal = await PaymentService.createWithdrawal(
      user.id,
      accountId,
      amount,
      bankDetails
    );

    logAudit('WITHDRAWAL_INITIATED', user.id, 'payment', {
      accountId,
      amount,
      transferId: withdrawal.transferId,
      bankDetails: {
        accountNumber: bankDetails.accountNumber,
        bankCode: bankDetails.bankCode,
        accountName: bankDetails.accountName
      }
    });

    res.json({
      success: true,
      data: withdrawal
    });
  } catch (error: any) {
    logger.error('Withdrawal error:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to process withdrawal'
    });
  }
});

// Real bank transfer (external)
router.post('/transfer/external', transferRateLimit, [
  body('fromAccountId').isUUID(),
  body('toAccountNumber').isLength({ min: 10, max: 10 }),
  body('amount').isFloat({ min: 1 }),
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
    const { fromAccountId, toAccountNumber, amount, description } = req.body;

    const transfer = await PaymentService.processRealBankTransfer(
      fromAccountId,
      toAccountNumber,
      amount,
      description,
      user.id
    );

    logAudit('EXTERNAL_TRANSFER_INITIATED', user.id, 'payment', {
      fromAccountId,
      toAccountNumber,
      amount,
      transferId: transfer.id
    });

    res.json({
      success: true,
      data: transfer,
      message: transfer.status === 'completed' 
        ? 'Transfer completed successfully'
        : 'Transfer is being processed'
    });
  } catch (error: any) {
    logger.error('External transfer error:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to process transfer'
    });
  }
});

// Simulate payment completion endpoint (replaces Stripe webhook)
router.post('/simulate-completion', async (req: Request, res: Response) => {
  try {
    const { simulationId, success = true } = req.body;

    if (!simulationId) {
      return res.status(400).json({
        success: false,
        message: 'Simulation ID required'
      });
    }

    await PaymentService.simulatePaymentCompletion(
      simulationId,
      success
    );

    res.json({
      success: true,
      message: `Payment ${success ? 'completed' : 'failed'} successfully`
    });
  } catch (error: any) {
    logger.error('Payment simulation error:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Payment simulation failed'
    });
  }
});

// Get payment methods for user
router.get('/methods', async (req: AuthRequest, res: Response) => {
  try {
    const user = req.user!;

    // In a real implementation, you would fetch saved payment methods
    // from Stripe or other payment providers
    const paymentMethods = [
      {
        id: 'card',
        type: 'card',
        name: 'Credit/Debit Card',
        enabled: true,
        description: 'Pay with Visa, Mastercard, or Verve'
      },
      {
        id: 'bank_transfer',
        type: 'bank_transfer',
        name: 'Bank Transfer',
        enabled: true,
        description: 'Direct bank transfer'
      },
      {
        id: 'ussd',
        type: 'ussd',
        name: 'USSD',
        enabled: true,
        description: 'Pay with USSD code'
      }
    ];

    res.json({
      success: true,
      data: paymentMethods
    });
  } catch (error) {
    logger.error('Get payment methods error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get payment methods'
    });
  }
});

// Get supported banks for withdrawals
router.get('/banks', async (req: AuthRequest, res: Response) => {
  try {
    // Nigerian banks list (in a real app, this would come from an API)
    const banks = [
      { code: '044', name: 'Access Bank' },
      { code: '014', name: 'Afribank Nigeria Plc' },
      { code: '023', name: 'Citibank Nigeria Limited' },
      { code: '050', name: 'Ecobank Nigeria Plc' },
      { code: '011', name: 'First Bank of Nigeria Limited' },
      { code: '214', name: 'First City Monument Bank Limited' },
      { code: '070', name: 'Fidelity Bank Plc' },
      { code: '058', name: 'Guaranty Trust Bank Plc' },
      { code: '030', name: 'Heritage Banking Company Limited' },
      { code: '082', name: 'Keystone Bank Limited' },
      { code: '076', name: 'Polaris Bank Limited' },
      { code: '221', name: 'Stanbic IBTC Bank Limited' },
      { code: '068', name: 'Standard Chartered Bank Nigeria Limited' },
      { code: '232', name: 'Sterling Bank Plc' },
      { code: '033', name: 'United Bank for Africa Plc' },
      { code: '032', name: 'Union Bank of Nigeria Plc' },
      { code: '035', name: 'Wema Bank Plc' },
      { code: '057', name: 'Zenith Bank Plc' }
    ];

    res.json({
      success: true,
      data: banks
    });
  } catch (error) {
    logger.error('Get banks error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get banks list'
    });
  }
});

// Verify bank account details
router.post('/verify-account', [
  body('accountNumber').isLength({ min: 10, max: 10 }),
  body('bankCode').isLength({ min: 3, max: 3 })
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

    const { accountNumber, bankCode } = req.body;

    // In a real implementation, you would call bank verification APIs
    // like Paystack's resolve account endpoint
    
    // Simulated response
    const accountDetails = {
      accountNumber,
      accountName: 'John Doe', // This would come from the bank API
      bankCode,
      bankName: 'Access Bank' // This would be resolved from bankCode
    };

    res.json({
      success: true,
      data: accountDetails
    });
  } catch (error) {
    logger.error('Account verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to verify account'
    });
  }
});

export default router;
