import { logger, logTransaction, logAudit } from '../utils/logger';
import { db } from '../config/db';
import { v4 as uuidv4 } from 'uuid';

export interface PaymentIntent {
  id: string;
  amount: number;
  currency: string;
  status: string;
  clientSecret?: string;
  metadata?: Record<string, string>;
}

export interface BankTransfer {
  id: string;
  fromAccountId: string;
  toAccountId: string;
  amount: number;
  currency: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  simulationId?: string;
  metadata?: Record<string, any>;
}

export class PaymentService {
  // Create a simulated payment intent for deposits
  static async createDepositIntent(
    userId: string,
    accountId: string,
    amount: number,
    currency: string = 'usd'
  ): Promise<PaymentIntent> {
    try {
      // Validate minimum amount ($10)
      if (amount < 1000) { // $10 in cents
        throw new Error('Minimum deposit amount is $10');
      }

      // Create simulated payment intent
      const simulationId = `sim_${uuidv4()}`;
      const paymentIntent = {
        id: simulationId,
        amount: amount,
        currency: currency.toLowerCase(),
        status: 'requires_payment_method',
        clientSecret: `${simulationId}_secret_${Date.now()}`,
        metadata: {
          userId,
          accountId,
          type: 'deposit',
          timestamp: new Date().toISOString(),
        }
      };

      // Store payment intent in database
      const transactionId = uuidv4();
      await db('transactions').insert({
        id: transactionId,
        to_account_id: accountId,
        amount: amount / 100, // Convert to dollars
        currency: currency.toUpperCase(),
        type: 'deposit',
        status: 'pending',
        description: 'Simulated Deposit',
        reference: paymentIntent.id,
        category: 'Deposit',
        metadata: {
          simulationId: paymentIntent.id,
          paymentMethod: 'simulation',
        },
      });

      logTransaction(
        transactionId,
        'deposit',
        amount / 100,
        undefined,
        accountId,
        'pending',
        { simulationId: paymentIntent.id }
      );

      return {
        id: paymentIntent.id,
        amount: amount / 100,
        currency: currency.toUpperCase(),
        status: paymentIntent.status,
        clientSecret: paymentIntent.clientSecret || undefined,
        metadata: paymentIntent.metadata,
      };
    } catch (error) {
      logger.error('Failed to create deposit intent:', error);
      throw new Error('Failed to create payment intent');
    }
  }

  // Process simulated successful deposit
  static async processDeposit(simulationId: string): Promise<void> {
    try {
      // Retrieve transaction from database
      const transaction = await db('transactions')
        .where({ reference: simulationId })
        .first();

      if (!transaction) {
        throw new Error('Transaction not found');
      }

      if (transaction.status !== 'pending') {
        throw new Error('Transaction already processed');
      }

      const { to_account_id: accountId } = transaction;
      const amount = transaction.amount;

      await db.transaction(async (trx) => {
        // Update account balance
        const account = await trx('accounts')
          .where({ id: accountId })
          .first();

        if (!account) {
          throw new Error('Account not found');
        }

        await trx('accounts')
          .where({ id: accountId })
          .update({
            balance: account.balance + amount,
            available_balance: account.available_balance + amount,
            updated_at: new Date(),
          });

        // Update transaction status
        await trx('transactions')
          .where({ reference: simulationId })
          .update({
            status: 'completed',
            processed_at: new Date(),
          });

        logTransaction(
          simulationId,
          'deposit',
          amount,
          undefined,
          accountId,
          'completed',
          { simulationId }
        );

        logAudit('DEPOSIT_COMPLETED', account.user_id, 'transaction', {
          accountId,
          amount,
          simulationId,
        });
      });
    } catch (error) {
      logger.error('Failed to process deposit:', error);
      throw error;
    }
  }

  // Create withdrawal to bank account
  static async createWithdrawal(
    userId: string,
    accountId: string,
    amount: number,
    bankDetails: {
      accountNumber: string;
      bankCode: string;
      accountName: string;
    }
  ): Promise<{ transferId: string; status: string }> {
    try {
      // Validate account and balance
      const account = await db('accounts')
        .where({ id: accountId, user_id: userId })
        .first();

      if (!account) {
        throw new Error('Account not found');
      }

      if (account.available_balance < amount) {
        throw new Error('Insufficient funds');
      }

      // For Nigerian banks, we'll use Paystack or Flutterwave
      // For now, we'll simulate the withdrawal process
      const transferId = uuidv4();

      await db.transaction(async (trx) => {
        // Deduct from account balance
        await trx('accounts')
          .where({ id: accountId })
          .update({
            balance: account.balance - amount,
            available_balance: account.available_balance - amount,
            updated_at: new Date(),
          });

        // Create withdrawal transaction
        const transactionId = uuidv4();
        await trx('transactions').insert({
          id: transactionId,
          from_account_id: accountId,
          amount,
          currency: 'NGN',
          type: 'withdrawal',
          status: 'processing',
          description: `Withdrawal to ${bankDetails.accountName}`,
          reference: transferId,
          category: 'Withdrawal',
          metadata: {
            bankDetails,
            transferId,
          },
        });

        logTransaction(
          transactionId,
          'withdrawal',
          amount,
          accountId,
          undefined,
          'processing',
          { transferId, bankDetails }
        );
      });

      // In a real implementation, you would integrate with:
      // - Paystack Transfer API for Nigerian banks
      // - Flutterwave Transfer API
      // - Or other local payment processors

      return {
        transferId,
        status: 'processing',
      };
    } catch (error) {
      logger.error('Failed to create withdrawal:', error);
      throw error;
    }
  }

  // Process real bank transfer between accounts
  static async processRealBankTransfer(
    fromAccountId: string,
    toAccountNumber: string,
    amount: number,
    description: string,
    userId: string
  ): Promise<BankTransfer> {
    try {
      const transferId = uuidv4();

      // Check if it's an internal transfer (within our bank)
      const toAccount = await db('accounts')
        .where({ account_number: toAccountNumber })
        .first();

      if (toAccount) {
        // Internal transfer - instant
        return await this.processInternalTransfer(
          fromAccountId,
          toAccount.id,
          amount,
          description,
          userId
        );
      } else {
        // External transfer - use real banking APIs
        return await this.processExternalTransfer(
          fromAccountId,
          toAccountNumber,
          amount,
          description,
          userId
        );
      }
    } catch (error) {
      logger.error('Failed to process bank transfer:', error);
      throw error;
    }
  }

  // Internal transfer between accounts in our system
  private static async processInternalTransfer(
    fromAccountId: string,
    toAccountId: string,
    amount: number,
    description: string,
    userId: string
  ): Promise<BankTransfer> {
    const transferId = uuidv4();

    await db.transaction(async (trx) => {
      // Get source account
      const fromAccount = await trx('accounts')
        .where({ id: fromAccountId, user_id: userId })
        .first();

      if (!fromAccount || fromAccount.available_balance < amount) {
        throw new Error('Insufficient funds');
      }

      // Get destination account
      const toAccount = await trx('accounts')
        .where({ id: toAccountId })
        .first();

      if (!toAccount) {
        throw new Error('Destination account not found');
      }

      // Update balances
      await trx('accounts')
        .where({ id: fromAccountId })
        .update({
          balance: fromAccount.balance - amount,
          available_balance: fromAccount.available_balance - amount,
          updated_at: new Date(),
        });

      await trx('accounts')
        .where({ id: toAccountId })
        .update({
          balance: toAccount.balance + amount,
          available_balance: toAccount.available_balance + amount,
          updated_at: new Date(),
        });

      // Create transaction record
      const transactionId = uuidv4();
      await trx('transactions').insert({
        id: transactionId,
        from_account_id: fromAccountId,
        to_account_id: toAccountId,
        amount,
        currency: 'NGN',
        type: 'transfer',
        status: 'completed',
        description,
        reference: transferId,
        category: 'Transfer',
        processed_at: new Date(),
      });
    });

    return {
      id: transferId,
      fromAccountId,
      toAccountId,
      amount,
      currency: 'NGN',
      status: 'completed',
    };
  }

  // External transfer to other banks
  private static async processExternalTransfer(
    fromAccountId: string,
    toAccountNumber: string,
    amount: number,
    description: string,
    userId: string
  ): Promise<BankTransfer> {
    const transferId = uuidv4();

    // In a real implementation, integrate with:
    // 1. Central Bank of Nigeria (CBN) for interbank transfers
    // 2. Nigeria Inter-Bank Settlement System (NIBSS)
    // 3. Paystack Transfer API
    // 4. Flutterwave Transfer API

    await db.transaction(async (trx) => {
      // Deduct from source account
      const fromAccount = await trx('accounts')
        .where({ id: fromAccountId, user_id: userId })
        .first();

      if (!fromAccount || fromAccount.available_balance < amount) {
        throw new Error('Insufficient funds');
      }

      await trx('accounts')
        .where({ id: fromAccountId })
        .update({
          balance: fromAccount.balance - amount,
          available_balance: fromAccount.available_balance - amount,
          updated_at: new Date(),
        });

      // Create pending transaction
      const transactionId = uuidv4();
      await trx('transactions').insert({
        id: transactionId,
        from_account_id: fromAccountId,
        amount,
        currency: 'NGN',
        type: 'transfer',
        status: 'processing',
        description: `Transfer to ${toAccountNumber}`,
        reference: transferId,
        category: 'External Transfer',
        metadata: {
          toAccountNumber,
          transferType: 'external',
        },
      });
    });

    // Simulate external processing delay
    setTimeout(async () => {
      try {
        await db('transactions')
          .where({ reference: transferId })
          .update({
            status: 'completed',
            processed_at: new Date(),
          });

        logTransaction(
          transferId,
          'transfer',
          amount,
          fromAccountId,
          undefined,
          'completed',
          { toAccountNumber, transferType: 'external' }
        );
      } catch (error) {
        logger.error('Failed to complete external transfer:', error);
      }
    }, 5000); // 5 second delay to simulate processing

    return {
      id: transferId,
      fromAccountId,
      toAccountId: toAccountNumber,
      amount,
      currency: 'NGN',
      status: 'processing',
    };
  }

  // Simulate payment completion (replaces webhook)
  static async simulatePaymentCompletion(
    simulationId: string,
    success: boolean = true
  ): Promise<void> {
    try {
      if (success) {
        await this.processDeposit(simulationId);
      } else {
        await this.handleFailedPayment(simulationId);
      }

      logger.info(`Simulated payment ${success ? 'success' : 'failure'} for ${simulationId}`);
    } catch (error) {
      logger.error('Payment simulation error:', error);
      throw error;
    }
  }

  // Handle failed payments
  private static async handleFailedPayment(paymentIntentId: string): Promise<void> {
    try {
      await db('transactions')
        .where({ reference: paymentIntentId })
        .update({
          status: 'failed',
          updated_at: new Date(),
        });

      logger.info(`Payment failed: ${paymentIntentId}`);
    } catch (error) {
      logger.error('Failed to handle failed payment:', error);
    }
  }
}
