import { db } from '../config/db';
import { logger } from '../utils/logger';
import { logAudit } from '../utils/audit';
import { notificationService } from './notificationService';
import { externalBankingService } from './externalBankingService';
import { v4 as uuidv4 } from 'uuid';

export interface CreditScore {
  score: number;
  rating: 'Excellent' | 'Good' | 'Fair' | 'Poor';
  factors: string[];
}

export interface LoanEligibility {
  eligible: boolean;
  maxAmount: number;
  interestRate: number;
  term: number;
  reasons: string[];
}

export interface InvestmentOption {
  id: string;
  name: string;
  type: 'savings' | 'fixed_deposit' | 'mutual_fund' | 'stocks';
  minimumAmount: number;
  expectedReturn: number;
  riskLevel: 'Low' | 'Medium' | 'High';
  description: string;
}

export class ComprehensiveBankingService {
  private static instance: ComprehensiveBankingService;

  public static getInstance(): ComprehensiveBankingService {
    if (!ComprehensiveBankingService.instance) {
      ComprehensiveBankingService.instance = new ComprehensiveBankingService();
    }
    return ComprehensiveBankingService.instance;
  }

  // Credit Score Calculation
  async calculateCreditScore(userId: string): Promise<CreditScore> {
    try {
      const user = await db('users').where({ id: userId }).first();
      const accounts = await db('accounts').where({ user_id: userId });
      const transactions = await db('transactions')
        .where('from_account_id', 'in', accounts.map(a => a.id))
        .where('created_at', '>', new Date(Date.now() - 365 * 24 * 60 * 60 * 1000)); // Last year

      let score = 300; // Base score
      const factors: string[] = [];

      // Account age factor
      const accountAge = Date.now() - new Date(user.created_at).getTime();
      const daysSinceCreation = accountAge / (1000 * 60 * 60 * 24);
      
      if (daysSinceCreation > 365) {
        score += 100;
        factors.push('Long account history');
      } else if (daysSinceCreation > 180) {
        score += 50;
        factors.push('Moderate account history');
      }

      // Transaction history factor
      if (transactions.length > 100) {
        score += 80;
        factors.push('Extensive transaction history');
      } else if (transactions.length > 50) {
        score += 40;
        factors.push('Good transaction history');
      }

      // Balance maintenance
      const avgBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0) / accounts.length;
      if (avgBalance > 50000) {
        score += 100;
        factors.push('High average balance');
      } else if (avgBalance > 10000) {
        score += 50;
        factors.push('Good average balance');
      }

      // Regular deposits
      const deposits = transactions.filter(t => t.type === 'deposit');
      if (deposits.length > 12) {
        score += 60;
        factors.push('Regular deposit pattern');
      }

      // Loan repayment history
      const loans = await db('loans').where({ user_id: userId, status: 'completed' });
      if (loans.length > 0) {
        score += 80;
        factors.push('Good loan repayment history');
      }

      // Cap the score at 850
      score = Math.min(score, 850);

      let rating: 'Excellent' | 'Good' | 'Fair' | 'Poor';
      if (score >= 750) rating = 'Excellent';
      else if (score >= 650) rating = 'Good';
      else if (score >= 550) rating = 'Fair';
      else rating = 'Poor';

      return { score, rating, factors };

    } catch (error) {
      logger.error('Credit score calculation failed:', error);
      return { score: 300, rating: 'Poor', factors: ['Unable to calculate score'] };
    }
  }

  // Loan Eligibility Assessment
  async assessLoanEligibility(userId: string, requestedAmount: number): Promise<LoanEligibility> {
    try {
      const creditScore = await this.calculateCreditScore(userId);
      const user = await db('users').where({ id: userId }).first();
      const accounts = await db('accounts').where({ user_id: userId });
      
      const reasons: string[] = [];
      let eligible = true;
      let maxAmount = 0;
      let interestRate = 15; // Base rate

      // Credit score requirements
      if (creditScore.score < 500) {
        eligible = false;
        reasons.push('Credit score too low (minimum 500 required)');
      } else {
        maxAmount = creditScore.score * 100; // $100 per credit point
        
        if (creditScore.score >= 750) {
          interestRate = 8;
          reasons.push('Excellent credit score - premium rate');
        } else if (creditScore.score >= 650) {
          interestRate = 12;
          reasons.push('Good credit score - standard rate');
        } else {
          interestRate = 18;
          reasons.push('Fair credit score - higher rate');
        }
      }

      // Account balance requirements
      const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);
      if (totalBalance < requestedAmount * 0.1) {
        eligible = false;
        reasons.push('Insufficient account balance (minimum 10% of loan amount required)');
      }

      // KYC verification
      if (user.kyc_status !== 'approved') {
        eligible = false;
        reasons.push('KYC verification required');
      }

      // Existing loan check
      const existingLoans = await db('loans')
        .where({ user_id: userId })
        .whereIn('status', ['pending', 'approved', 'active']);
      
      if (existingLoans.length > 0) {
        eligible = false;
        reasons.push('Existing loan must be cleared first');
      }

      // Final amount check
      if (requestedAmount > maxAmount) {
        eligible = false;
        reasons.push(`Requested amount exceeds maximum eligible amount of $${maxAmount}`);
      }

      return {
        eligible,
        maxAmount,
        interestRate,
        term: 12, // 12 months default
        reasons
      };

    } catch (error) {
      logger.error('Loan eligibility assessment failed:', error);
      return {
        eligible: false,
        maxAmount: 0,
        interestRate: 0,
        term: 0,
        reasons: ['Assessment failed']
      };
    }
  }

  // Investment Options
  getInvestmentOptions(): InvestmentOption[] {
    return [
      {
        id: 'savings_plus',
        name: 'High Yield Savings',
        type: 'savings',
        minimumAmount: 1000,
        expectedReturn: 4.5,
        riskLevel: 'Low',
        description: 'Earn higher interest on your savings with guaranteed returns'
      },
      {
        id: 'fixed_deposit_6m',
        name: '6-Month Fixed Deposit',
        type: 'fixed_deposit',
        minimumAmount: 5000,
        expectedReturn: 6.2,
        riskLevel: 'Low',
        description: 'Lock in your funds for 6 months with guaranteed returns'
      },
      {
        id: 'fixed_deposit_12m',
        name: '12-Month Fixed Deposit',
        type: 'fixed_deposit',
        minimumAmount: 5000,
        expectedReturn: 7.8,
        riskLevel: 'Low',
        description: 'Lock in your funds for 12 months with higher guaranteed returns'
      },
      {
        id: 'balanced_fund',
        name: 'Balanced Mutual Fund',
        type: 'mutual_fund',
        minimumAmount: 2500,
        expectedReturn: 9.5,
        riskLevel: 'Medium',
        description: 'Diversified portfolio of stocks and bonds for balanced growth'
      },
      {
        id: 'growth_fund',
        name: 'Growth Mutual Fund',
        type: 'mutual_fund',
        minimumAmount: 2500,
        expectedReturn: 12.3,
        riskLevel: 'Medium',
        description: 'Focus on growth stocks for higher potential returns'
      },
      {
        id: 'tech_stocks',
        name: 'Technology Stocks Portfolio',
        type: 'stocks',
        minimumAmount: 10000,
        expectedReturn: 15.7,
        riskLevel: 'High',
        description: 'Invest in leading technology companies for high growth potential'
      }
    ];
  }

  // Create Investment
  async createInvestment(userId: string, optionId: string, amount: number, accountId: string): Promise<{
    success: boolean;
    investmentId?: string;
    message: string;
  }> {
    try {
      const option = this.getInvestmentOptions().find(opt => opt.id === optionId);
      if (!option) {
        return { success: false, message: 'Investment option not found' };
      }

      if (amount < option.minimumAmount) {
        return { 
          success: false, 
          message: `Minimum investment amount is $${option.minimumAmount}` 
        };
      }

      // Check account balance
      const account = await db('accounts').where({ id: accountId, user_id: userId }).first();
      if (!account || account.available_balance < amount) {
        return { success: false, message: 'Insufficient funds' };
      }

      // Create investment record
      const investmentId = uuidv4();
      await db('investments').insert({
        id: investmentId,
        user_id: userId,
        account_id: accountId,
        option_id: optionId,
        option_name: option.name,
        amount,
        expected_return: option.expectedReturn,
        risk_level: option.riskLevel,
        status: 'active',
        start_date: new Date(),
        created_at: new Date()
      });

      // Deduct amount from account
      await db('accounts').where({ id: accountId }).decrement('balance', amount);
      await db('accounts').where({ id: accountId }).decrement('available_balance', amount);

      // Create transaction record
      await db('transactions').insert({
        id: uuidv4(),
        from_account_id: accountId,
        amount,
        currency: account.currency,
        type: 'investment',
        status: 'completed',
        description: `Investment in ${option.name}`,
        reference: `INV${Date.now()}`,
        category: 'Investment',
        metadata: { investmentId, optionId }
      });

      // Send notification
      await notificationService.sendNotification({
        userId,
        type: 'investment_created',
        title: 'Investment Created',
        message: `Your investment of $${amount} in ${option.name} has been created successfully.`,
        priority: 'medium',
        channels: ['email', 'in_app'],
        metadata: { investmentId, amount, optionName: option.name }
      });

      logAudit('INVESTMENT_CREATED', userId, 'investment', {
        investmentId,
        optionId,
        amount
      });

      return {
        success: true,
        investmentId,
        message: 'Investment created successfully'
      };

    } catch (error) {
      logger.error('Investment creation failed:', error);
      return { success: false, message: 'Investment creation failed' };
    }
  }

  // Bill Payment Services
  async payBill(userId: string, billData: {
    accountId: string;
    billType: string;
    amount: number;
    billerId: string;
    billerName: string;
    accountNumber: string;
  }): Promise<{ success: boolean; reference?: string; message: string }> {
    try {
      const { accountId, billType, amount, billerId, billerName, accountNumber } = billData;

      // Verify account and balance
      const account = await db('accounts').where({ id: accountId, user_id: userId }).first();
      if (!account || account.available_balance < amount) {
        return { success: false, message: 'Insufficient funds' };
      }

      // Simulate bill payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));

      const reference = `BILL${Date.now()}${Math.random().toString(36).substr(2, 6).toUpperCase()}`;

      // Deduct amount from account
      await db('accounts').where({ id: accountId }).decrement('balance', amount);
      await db('accounts').where({ id: accountId }).decrement('available_balance', amount);

      // Create transaction record
      await db('transactions').insert({
        id: uuidv4(),
        from_account_id: accountId,
        amount,
        currency: account.currency,
        type: 'bill_payment',
        status: 'completed',
        description: `${billType} payment to ${billerName}`,
        reference,
        category: 'Bill Payment',
        metadata: { billType, billerId, billerName, accountNumber }
      });

      // Send notification
      await notificationService.sendNotification({
        userId,
        type: 'bill_payment_completed',
        title: 'Bill Payment Successful',
        message: `Your ${billType} payment of $${amount} to ${billerName} has been processed successfully.`,
        priority: 'medium',
        channels: ['email', 'sms', 'in_app'],
        metadata: { reference, amount, billerName }
      });

      return {
        success: true,
        reference,
        message: 'Bill payment completed successfully'
      };

    } catch (error) {
      logger.error('Bill payment failed:', error);
      return { success: false, message: 'Bill payment failed' };
    }
  }
}

export const comprehensiveBankingService = ComprehensiveBankingService.getInstance();
