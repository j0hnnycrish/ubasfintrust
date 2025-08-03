import { logger } from '../utils/logger';
import { db } from '../config/db';

export interface BankAccount {
  accountNumber: string;
  accountName: string;
  bankCode: string;
  bankName: string;
}

export interface TransferRequest {
  fromAccount: string;
  toAccount: BankAccount;
  amount: number;
  currency: string;
  reference: string;
  narration: string;
}

export interface TransferResult {
  success: boolean;
  reference: string;
  externalReference?: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  message: string;
  fee?: number;
}

export interface BankVerificationResult {
  success: boolean;
  accountName?: string;
  bankName?: string;
  message: string;
}

export class ExternalBankingService {
  private static instance: ExternalBankingService;
  private bankDatabase: Map<string, BankAccount[]>;

  constructor() {
    this.initializeBankDatabase();
  }

  public static getInstance(): ExternalBankingService {
    if (!ExternalBankingService.instance) {
      ExternalBankingService.instance = new ExternalBankingService();
    }
    return ExternalBankingService.instance;
  }

  private initializeBankDatabase() {
    // Initialize comprehensive bank database with realistic accounts
    this.bankDatabase = new Map();

    // Major Global Banks
    this.bankDatabase.set('001', [ // Chase Bank
      { accountNumber: '1234567890', accountName: 'John Smith', bankCode: '001', bankName: 'Chase Bank' },
      { accountNumber: '2345678901', accountName: 'Sarah Johnson', bankCode: '001', bankName: 'Chase Bank' },
      { accountNumber: '3456789012', accountName: 'Michael Brown', bankCode: '001', bankName: 'Chase Bank' },
    ]);

    this.bankDatabase.set('002', [ // Bank of America
      { accountNumber: '4567890123', accountName: 'Emily Davis', bankCode: '002', bankName: 'Bank of America' },
      { accountNumber: '5678901234', accountName: 'David Wilson', bankCode: '002', bankName: 'Bank of America' },
      { accountNumber: '6789012345', accountName: 'Lisa Anderson', bankCode: '002', bankName: 'Bank of America' },
    ]);

    this.bankDatabase.set('003', [ // Wells Fargo
      { accountNumber: '7890123456', accountName: 'Robert Taylor', bankCode: '003', bankName: 'Wells Fargo' },
      { accountNumber: '8901234567', accountName: 'Jennifer Martinez', bankCode: '003', bankName: 'Wells Fargo' },
      { accountNumber: '9012345678', accountName: 'Christopher Lee', bankCode: '003', bankName: 'Wells Fargo' },
    ]);

    this.bankDatabase.set('004', [ // Citibank
      { accountNumber: '0123456789', accountName: 'Amanda White', bankCode: '004', bankName: 'Citibank' },
      { accountNumber: '1357924680', accountName: 'James Garcia', bankCode: '004', bankName: 'Citibank' },
      { accountNumber: '2468013579', accountName: 'Michelle Rodriguez', bankCode: '004', bankName: 'Citibank' },
    ]);

    // Add more banks for comprehensive coverage
    this.addMoreBanks();
  }

  private addMoreBanks() {
    // European Banks
    this.bankDatabase.set('101', [
      { accountNumber: '1111222233', accountName: 'Hans Mueller', bankCode: '101', bankName: 'Deutsche Bank' },
      { accountNumber: '2222333344', accountName: 'Marie Dubois', bankCode: '101', bankName: 'Deutsche Bank' },
    ]);

    this.bankDatabase.set('102', [
      { accountNumber: '3333444455', accountName: 'Giovanni Rossi', bankCode: '102', bankName: 'UniCredit' },
      { accountNumber: '4444555566', accountName: 'Carlos Silva', bankCode: '102', bankName: 'UniCredit' },
    ]);

    // Asian Banks
    this.bankDatabase.set('201', [
      { accountNumber: '5555666677', accountName: 'Hiroshi Tanaka', bankCode: '201', bankName: 'Mitsubishi UFJ' },
      { accountNumber: '6666777788', accountName: 'Li Wei', bankCode: '201', bankName: 'Mitsubishi UFJ' },
    ]);

    // African Banks
    this.bankDatabase.set('301', [
      { accountNumber: '7777888899', accountName: 'Kwame Asante', bankCode: '301', bankName: 'Standard Bank' },
      { accountNumber: '8888999900', accountName: 'Fatima Al-Rashid', bankCode: '301', bankName: 'Standard Bank' },
    ]);
  }

  async verifyBankAccount(accountNumber: string, bankCode: string): Promise<BankVerificationResult> {
    try {
      // Simulate network delay for realism
      await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

      const bankAccounts = this.bankDatabase.get(bankCode);

      if (!bankAccounts) {
        return {
          success: false,
          message: 'Bank not found or not supported'
        };
      }

      const account = bankAccounts.find(acc => acc.accountNumber === accountNumber);

      if (account) {
        return {
          success: true,
          accountName: account.accountName,
          bankName: account.bankName,
          message: 'Account verified successfully'
        };
      }

      return {
        success: false,
        message: 'Account number not found'
      };

    } catch (error) {
      logger.error('Bank account verification failed:', error);
      return {
        success: false,
        message: 'Account verification failed'
      };
    }
  }

  async initiateTransfer(transferData: TransferRequest): Promise<TransferResult> {
    try {
      // Simulate realistic transfer processing
      await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 3000));

      // Verify the destination account exists
      const verification = await this.verifyBankAccount(
        transferData.toAccount.accountNumber,
        transferData.toAccount.bankCode
      );

      if (!verification.success) {
        return {
          success: false,
          reference: transferData.reference,
          status: 'failed',
          message: 'Destination account verification failed'
        };
      }

      // Simulate realistic success/failure rates (95% success)
      const shouldSucceed = Math.random() > 0.05;

      if (shouldSucceed) {
        // Calculate realistic transfer fee based on amount and destination
        const baseFee = Math.max(transferData.amount * 0.005, 5); // 0.5% with $5 minimum
        const crossBorderFee = transferData.toAccount.bankCode.startsWith('1') ? 0 : 15; // $15 for international
        const totalFee = baseFee + crossBorderFee;

        return {
          success: true,
          reference: transferData.reference,
          externalReference: `EXT${Date.now()}${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
          status: 'completed',
          message: `Transfer completed successfully to ${verification.accountName} at ${verification.bankName}`,
          fee: totalFee
        };
      } else {
        // Simulate realistic failure reasons
        const failureReasons = [
          'Insufficient funds in correspondent account',
          'Temporary network connectivity issue',
          'Destination bank maintenance window',
          'Transfer limit exceeded for today'
        ];

        return {
          success: false,
          reference: transferData.reference,
          status: 'failed',
          message: failureReasons[Math.floor(Math.random() * failureReasons.length)]
        };
      }

    } catch (error) {
      logger.error('External transfer failed:', error);
      return {
        success: false,
        reference: transferData.reference,
        status: 'failed',
        message: 'Transfer processing failed'
      };
    }
  }

  // Get list of supported banks
  getSupportedBanks(): Array<{code: string, name: string, country: string}> {
    return [
      // US Banks
      { code: '001', name: 'Chase Bank', country: 'United States' },
      { code: '002', name: 'Bank of America', country: 'United States' },
      { code: '003', name: 'Wells Fargo', country: 'United States' },
      { code: '004', name: 'Citibank', country: 'United States' },

      // European Banks
      { code: '101', name: 'Deutsche Bank', country: 'Germany' },
      { code: '102', name: 'UniCredit', country: 'Italy' },

      // Asian Banks
      { code: '201', name: 'Mitsubishi UFJ', country: 'Japan' },

      // African Banks
      { code: '301', name: 'Standard Bank', country: 'South Africa' },
    ];
  }

  // Generate realistic transaction reference
  generateTransactionReference(): string {
    const timestamp = Date.now().toString();
    const random = Math.random().toString(36).substr(2, 8).toUpperCase();
    return `UBAS${timestamp.slice(-6)}${random}`;
  }

  // Calculate transfer fees based on amount and destination
  calculateTransferFee(amount: number, bankCode: string, currency: string): number {
    const baseFee = Math.max(amount * 0.005, 5); // 0.5% with minimum $5

    // International transfer fee
    const isInternational = !bankCode.startsWith('0'); // US banks start with 0
    const internationalFee = isInternational ? 15 : 0;

    // Currency conversion fee
    const currencyFee = currency !== 'USD' ? amount * 0.002 : 0;

    return Math.round((baseFee + internationalFee + currencyFee) * 100) / 100;
  }

  // Get transfer status (for tracking)
  async getTransferStatus(reference: string): Promise<{
    status: 'pending' | 'processing' | 'completed' | 'failed';
    message: string;
    completedAt?: Date;
  }> {
    // Simulate realistic transfer processing times
    await new Promise(resolve => setTimeout(resolve, 500));

    // Most transfers complete successfully after processing
    const statuses = [
      { status: 'completed' as const, weight: 85, message: 'Transfer completed successfully' },
      { status: 'processing' as const, weight: 10, message: 'Transfer is being processed' },
      { status: 'failed' as const, weight: 5, message: 'Transfer failed due to technical issues' }
    ];

    const random = Math.random() * 100;
    let cumulative = 0;

    for (const statusOption of statuses) {
      cumulative += statusOption.weight;
      if (random <= cumulative) {
        return {
          status: statusOption.status,
          message: statusOption.message,
          completedAt: statusOption.status === 'completed' ? new Date() : undefined
        };
      }
    }

    return { status: 'completed', message: 'Transfer completed successfully', completedAt: new Date() };
  }

  // Add more accounts dynamically (for testing)
  addTestAccount(bankCode: string, accountNumber: string, accountName: string): void {
    const bankAccounts = this.bankDatabase.get(bankCode) || [];
    const bankName = this.getSupportedBanks().find(b => b.code === bankCode)?.name || 'Unknown Bank';

    bankAccounts.push({
      accountNumber,
      accountName,
      bankCode,
      bankName
    });

    this.bankDatabase.set(bankCode, bankAccounts);
    logger.info(`Added test account: ${accountNumber} - ${accountName} at ${bankName}`);
  }

  // Get all accounts for a specific bank (for testing/admin purposes)
  getBankAccounts(bankCode: string): BankAccount[] {
    return this.bankDatabase.get(bankCode) || [];
  }
}

export const externalBankingService = ExternalBankingService.getInstance();
