interface PaymentMethod {
  id: string;
  type: string;
  name: string;
  enabled: boolean;
  description: string;
}

interface BankInfo {
  code: string;
  name: string;
}

interface AccountVerification {
  accountNumber: string;
  accountName: string;
  bankCode: string;
  bankName: string;
}

export class PaymentService {
  static getPaymentMethods(): PaymentMethod[] {
    return [
      {
        id: 'card',
        type: 'credit_card',
        name: 'Credit/Debit Card',
        enabled: true,
        description: 'Visa, Mastercard, American Express'
      },
      {
        id: 'bank_transfer',
        type: 'bank_transfer',
        name: 'Bank Transfer',
        enabled: true,
        description: 'Direct bank account transfer'
      },
      {
        id: 'wire',
        type: 'wire_transfer',
        name: 'Wire Transfer',
        enabled: true,
        description: 'International wire transfers'
      }
    ];
  }

  static getBanks(): BankInfo[] {
    return [
      { code: 'CHB', name: 'Chase Bank' },
      { code: 'BOA', name: 'Bank of America' },
      { code: 'WFC', name: 'Wells Fargo' },
      { code: 'USB', name: 'US Bank' },
      { code: 'PNC', name: 'PNC Bank' }
    ];
  }

  static async verifyBankAccount(
    accountNumber: string,
    routingNumber: string,
    bankCode: string
  ): Promise<AccountVerification> {
    // Simulate bank verification API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const banks = this.getBanks();
    const bank = banks.find(b => b.code === bankCode);
    
    return {
      accountNumber: accountNumber.slice(-4).padStart(accountNumber.length, '*'),
      accountName: 'John Doe', // Would come from actual verification
      bankCode,
      bankName: bank?.name || 'Unknown Bank'
    };
  }

  static async processPayment(
    method: string,
    amount: number,
    currency: string = 'USD',
    details: any
  ): Promise<{ success: boolean; transactionId?: string; error?: string }> {
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate random failure for demo
      if (Math.random() < 0.1) {
        throw new Error('Payment failed due to insufficient funds');
      }
      
      return {
        success: true,
        transactionId: `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Payment processing failed'
      };
    }
  }

  static async getPaymentHistory(userId: string, limit: number = 10): Promise<any[]> {
    // Simulate payment history retrieval
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return Array.from({ length: Math.min(limit, 20) }, (_, i) => ({
      id: `pay_${Date.now() - i * 86400000}`,
      amount: Math.floor(Math.random() * 1000) + 50,
      currency: 'USD',
      method: ['card', 'bank_transfer', 'wire'][Math.floor(Math.random() * 3)],
      status: ['completed', 'pending', 'failed'][Math.floor(Math.random() * 3)],
      description: `Payment ${i + 1}`,
      createdAt: new Date(Date.now() - i * 86400000).toISOString()
    }));
  }
}
