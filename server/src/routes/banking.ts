import { Router, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { AuthMiddleware } from '../middleware/auth';
import { transferRateLimit } from '../middleware/security';
import { logger, logAudit } from '../utils/logger';
import { AuthRequest } from '../types';
import { comprehensiveBankingService } from '../services/comprehensiveBankingService';
import { externalBankingService } from '../services/externalBankingService';

const router = Router();

// Apply authentication middleware to all routes
router.use(AuthMiddleware.verifyToken);

// Get credit score
router.get('/credit-score', async (req: AuthRequest, res: Response) => {
  try {
    const user = req.user!;
    const creditScore = await comprehensiveBankingService.calculateCreditScore(user.id);
    
    res.json({
      success: true,
      data: creditScore
    });
  } catch (error) {
    logger.error('Get credit score error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get credit score'
    });
  }
});

// Assess loan eligibility
router.post('/loan-eligibility', [
  body('amount').isFloat({ min: 1000 }).withMessage('Minimum loan amount is $1,000')
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
    const { amount } = req.body;
    
    const eligibility = await comprehensiveBankingService.assessLoanEligibility(user.id, amount);
    
    res.json({
      success: true,
      data: eligibility
    });
  } catch (error) {
    logger.error('Loan eligibility assessment error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to assess loan eligibility'
    });
  }
});

// Get investment options
router.get('/investments/options', async (req: AuthRequest, res: Response) => {
  try {
    const options = comprehensiveBankingService.getInvestmentOptions();
    
    res.json({
      success: true,
      data: options
    });
  } catch (error) {
    logger.error('Get investment options error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get investment options'
    });
  }
});

// Create investment
router.post('/investments', [
  body('optionId').notEmpty().withMessage('Investment option is required'),
  body('amount').isFloat({ min: 100 }).withMessage('Minimum investment amount is $100'),
  body('accountId').isUUID().withMessage('Valid account ID is required')
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
    const { optionId, amount, accountId } = req.body;
    
    const result = await comprehensiveBankingService.createInvestment(
      user.id, 
      optionId, 
      amount, 
      accountId
    );
    
    if (result.success) {
      logAudit('INVESTMENT_CREATED', user.id, 'investment', {
        investmentId: result.investmentId,
        optionId,
        amount
      });
    }
    
    res.json({
      success: result.success,
      message: result.message,
      data: result.investmentId ? { investmentId: result.investmentId } : undefined
    });
  } catch (error) {
    logger.error('Create investment error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create investment'
    });
  }
});

// Pay bill
router.post('/bills/pay', transferRateLimit, [
  body('accountId').isUUID().withMessage('Valid account ID is required'),
  body('billType').notEmpty().withMessage('Bill type is required'),
  body('amount').isFloat({ min: 1 }).withMessage('Amount must be greater than 0'),
  body('billerId').notEmpty().withMessage('Biller ID is required'),
  body('billerName').notEmpty().withMessage('Biller name is required'),
  body('accountNumber').notEmpty().withMessage('Account number is required')
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
    const billData = req.body;
    
    const result = await comprehensiveBankingService.payBill(user.id, billData);
    
    if (result.success) {
      logAudit('BILL_PAYMENT', user.id, 'payment', {
        reference: result.reference,
        billType: billData.billType,
        amount: billData.amount,
        billerName: billData.billerName
      });
    }
    
    res.json({
      success: result.success,
      message: result.message,
      data: result.reference ? { reference: result.reference } : undefined
    });
  } catch (error) {
    logger.error('Bill payment error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process bill payment'
    });
  }
});

// Get supported banks for external transfers
router.get('/external-banks', async (req: AuthRequest, res: Response) => {
  try {
    const banks = externalBankingService.getSupportedBanks();
    
    res.json({
      success: true,
      data: banks
    });
  } catch (error) {
    logger.error('Get supported banks error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get supported banks'
    });
  }
});

// Verify external bank account
router.post('/external-banks/verify', [
  body('accountNumber').isLength({ min: 10, max: 20 }).withMessage('Valid account number is required'),
  body('bankCode').isLength({ min: 3, max: 3 }).withMessage('Valid bank code is required')
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
    
    const result = await externalBankingService.verifyBankAccount(accountNumber, bankCode);
    
    res.json({
      success: result.success,
      message: result.message,
      data: result.success ? {
        accountName: result.accountName,
        bankName: result.bankName
      } : undefined
    });
  } catch (error) {
    logger.error('Bank account verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to verify bank account'
    });
  }
});

// External bank transfer
router.post('/external-transfer', transferRateLimit, [
  body('fromAccountId').isUUID().withMessage('Valid from account ID is required'),
  body('toAccountNumber').isLength({ min: 10, max: 20 }).withMessage('Valid account number is required'),
  body('toBankCode').isLength({ min: 3, max: 3 }).withMessage('Valid bank code is required'),
  body('amount').isFloat({ min: 1 }).withMessage('Amount must be greater than 0'),
  body('description').isLength({ min: 1, max: 200 }).withMessage('Description is required'),
  body('recipientName').isLength({ min: 2, max: 100 }).withMessage('Recipient name is required')
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
    const { fromAccountId, toAccountNumber, toBankCode, amount, description, recipientName } = req.body;
    
    // Verify the destination account first
    const verification = await externalBankingService.verifyBankAccount(toAccountNumber, toBankCode);
    if (!verification.success) {
      return res.status(400).json({
        success: false,
        message: verification.message
      });
    }
    
    // Calculate transfer fee
    const fee = externalBankingService.calculateTransferFee(amount, toBankCode, 'USD');
    
    // Initiate the transfer
    const transferData = {
      fromAccount: fromAccountId,
      toAccount: {
        accountNumber: toAccountNumber,
        accountName: verification.accountName!,
        bankCode: toBankCode,
        bankName: verification.bankName!
      },
      amount,
      currency: 'USD',
      reference: externalBankingService.generateTransactionReference(),
      narration: description
    };
    
    const result = await externalBankingService.initiateTransfer(transferData);
    
    if (result.success) {
      logAudit('EXTERNAL_TRANSFER', user.id, 'transfer', {
        reference: result.reference,
        amount,
        toBank: verification.bankName,
        toAccount: toAccountNumber,
        fee
      });
    }
    
    res.json({
      success: result.success,
      message: result.message,
      data: {
        reference: result.reference,
        externalReference: result.externalReference,
        status: result.status,
        fee: result.fee || fee
      }
    });
  } catch (error) {
    logger.error('External transfer error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process external transfer'
    });
  }
});

export default router;
