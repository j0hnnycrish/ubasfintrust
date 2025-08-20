interface SupportedBank {
  name: string
  code: string
  country: string
  currency: string
  transferFee: number
  processingTime: string
}

interface BankAccount {
  accountNumber: string
  accountName: string
  bankCode: string
  bankName: string
  balance: number
  currency: string
  status: 'active' | 'inactive' | 'blocked'
}

interface TransferRequest {
  fromAccount: string
  toAccount: {
    accountNumber: string
    accountName: string
    bankCode: string
    bankName: string
  }
  amount: number
  currency: string
  reference: string
  narration: string
}

interface TransferResult {
  success: boolean
  message: string
  reference?: string
  externalReference?: string
  status?: 'pending' | 'processing' | 'completed' | 'failed'
  fee?: number
}

export class ExternalBankingService {
  private supportedBanks: SupportedBank[] = [
    { name: 'Chase Bank', code: 'CHB', country: 'US', currency: 'USD', transferFee: 25.00, processingTime: '1-3 business days' },
    { name: 'Bank of America', code: 'BOA', country: 'US', currency: 'USD', transferFee: 30.00, processingTime: '1-3 business days' },
    { name: 'Wells Fargo', code: 'WFB', country: 'US', currency: 'USD', transferFee: 20.00, processingTime: '1-2 business days' },
    { name: 'Citibank', code: 'CTB', country: 'US', currency: 'USD', transferFee: 25.00, processingTime: '1-3 business days' },
    { name: 'TD Bank', code: 'TDB', country: 'US', currency: 'USD', transferFee: 15.00, processingTime: '1-2 business days' },
    { name: 'PNC Bank', code: 'PNC', country: 'US', currency: 'USD', transferFee: 25.00, processingTime: '2-3 business days' },
    { name: 'US Bank', code: 'USB', country: 'US', currency: 'USD', transferFee: 20.00, processingTime: '1-3 business days' },
    { name: 'Capital One', code: 'COB', country: 'US', currency: 'USD', transferFee: 0.00, processingTime: '1-2 business days' },
    { name: 'First National Bank', code: 'FNB', country: 'US', currency: 'USD', transferFee: 15.00, processingTime: '1-2 business days' },
    { name: 'Regions Bank', code: 'RGB', country: 'US', currency: 'USD', transferFee: 20.00, processingTime: '2-3 business days' }
  ]

  // Simulated external bank accounts database
  private externalAccounts: BankAccount[] = [
    // Chase Bank accounts
    { accountNumber: '1234567890123', accountName: 'John Smith', bankCode: 'CHB', bankName: 'Chase Bank', balance: 15000, currency: 'USD', status: 'active' },
    { accountNumber: '1234567890124', accountName: 'Sarah Johnson', bankCode: 'CHB', bankName: 'Chase Bank', balance: 25000, currency: 'USD', status: 'active' },
    { accountNumber: '1234567890125', accountName: 'Michael Brown', bankCode: 'CHB', bankName: 'Chase Bank', balance: 8500, currency: 'USD', status: 'active' },
    
    // Bank of America accounts
    { accountNumber: '2234567890123', accountName: 'Emily Davis', bankCode: 'BOA', bankName: 'Bank of America', balance: 32000, currency: 'USD', status: 'active' },
    { accountNumber: '2234567890124', accountName: 'David Wilson', bankCode: 'BOA', bankName: 'Bank of America', balance: 12500, currency: 'USD', status: 'active' },
    { accountNumber: '2234567890125', accountName: 'Lisa Anderson', bankCode: 'BOA', bankName: 'Bank of America', balance: 45000, currency: 'USD', status: 'active' },
    
    // Wells Fargo accounts
    { accountNumber: '3234567890123', accountName: 'Robert Taylor', bankCode: 'WFB', bankName: 'Wells Fargo', balance: 18000, currency: 'USD', status: 'active' },
    { accountNumber: '3234567890124', accountName: 'Jennifer Martinez', bankCode: 'WFB', bankName: 'Wells Fargo', balance: 22000, currency: 'USD', status: 'active' },
    { accountNumber: '3234567890125', accountName: 'Christopher Garcia', bankCode: 'WFB', bankName: 'Wells Fargo', balance: 35000, currency: 'USD', status: 'active' },
    
    // Citibank accounts
    { accountNumber: '4234567890123', accountName: 'Amanda Rodriguez', bankCode: 'CTB', bankName: 'Citibank', balance: 28000, currency: 'USD', status: 'active' },
    { accountNumber: '4234567890124', accountName: 'Matthew Hernandez', bankCode: 'CTB', bankName: 'Citibank', balance: 15500, currency: 'USD', status: 'active' },
    { accountNumber: '4234567890125', accountName: 'Jessica Lopez', bankCode: 'CTB', bankName: 'Citibank', balance: 40000, currency: 'USD', status: 'active' },
    
    // TD Bank accounts
    { accountNumber: '5234567890123', accountName: 'Daniel Gonzalez', bankCode: 'TDB', bankName: 'TD Bank', balance: 19000, currency: 'USD', status: 'active' },
    { accountNumber: '5234567890124', accountName: 'Ashley Wilson', bankCode: 'TDB', bankName: 'TD Bank', balance: 24000, currency: 'USD', status: 'active' },
    { accountNumber: '5234567890125', accountName: 'Joshua Lee', bankCode: 'TDB', bankName: 'TD Bank', balance: 12000, currency: 'USD', status: 'active' },
    
    // Other banks with various account statuses
    { accountNumber: '6234567890123', accountName: 'Megan Clark', bankCode: 'PNC', bankName: 'PNC Bank', balance: 33000, currency: 'USD', status: 'active' },
    { accountNumber: '7234567890123', accountName: 'Andrew Lewis', bankCode: 'USB', bankName: 'US Bank', balance: 27000, currency: 'USD', status: 'active' },
    { accountNumber: '8234567890123', accountName: 'Stephanie Walker', bankCode: 'COB', bankName: 'Capital One', balance: 16000, currency: 'USD', status: 'active' },
    { accountNumber: '9234567890123', accountName: 'Kevin Hall', bankCode: 'FNB', bankName: 'First National Bank', balance: 21000, currency: 'USD', status: 'active' },
    { accountNumber: '1034567890123', accountName: 'Rachel Young', bankCode: 'RGB', bankName: 'Regions Bank', balance: 29000, currency: 'USD', status: 'active' },
    
    // Some blocked/inactive accounts for testing
    { accountNumber: '1234567890126', accountName: 'Blocked Account', bankCode: 'CHB', bankName: 'Chase Bank', balance: 5000, currency: 'USD', status: 'blocked' },
    { accountNumber: '2234567890126', accountName: 'Inactive Account', bankCode: 'BOA', bankName: 'Bank of America', balance: 1000, currency: 'USD', status: 'inactive' }
  ]

  getSupportedBanks(): SupportedBank[] {
    return this.supportedBanks
  }

  async verifyBankAccount(accountNumber: string, bankCode: string): Promise<{
    success: boolean
    message: string
    accountName?: string
    bankName?: string
    status?: string
  }> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000))

    const account = this.externalAccounts.find(
      acc => acc.accountNumber === accountNumber && acc.bankCode === bankCode
    )

    if (!account) {
      return {
        success: false,
        message: 'Account not found or invalid bank code'
      }
    }

    if (account.status === 'blocked') {
      return {
        success: false,
        message: 'Account is blocked and cannot receive transfers'
      }
    }

    if (account.status === 'inactive') {
      return {
        success: false,
        message: 'Account is inactive'
      }
    }

    return {
      success: true,
      message: 'Account verified successfully',
      accountName: account.accountName,
      bankName: account.bankName,
      status: account.status
    }
  }

  calculateTransferFee(amount: number, bankCode: string, currency: string): number {
    const bank = this.supportedBanks.find(b => b.code === bankCode)
    if (!bank) return 50.00 // Default high fee for unsupported banks
    
    // Some banks have percentage-based fees for large amounts
    if (amount > 50000) {
      return Math.max(bank.transferFee, amount * 0.001) // 0.1% for large transfers
    }
    
    return bank.transferFee
  }

  generateTransactionReference(): string {
    const timestamp = Date.now().toString()
    const random = Math.random().toString(36).substring(2, 8).toUpperCase()
    return `EXT${timestamp}${random}`
  }

  async initiateTransfer(transferData: TransferRequest): Promise<TransferResult> {
    try {
      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 3000))

      const { toAccount, amount, currency } = transferData
      
      // Verify destination account one more time
      const verification = await this.verifyBankAccount(toAccount.accountNumber, toAccount.bankCode)
      if (!verification.success) {
        return {
          success: false,
          message: verification.message
        }
      }

      // Calculate fee
      const fee = this.calculateTransferFee(amount, toAccount.bankCode, currency)

      // Generate external reference (what the destination bank would provide)
      const externalReference = `${toAccount.bankCode}${Date.now()}${Math.random().toString(36).substring(2, 6).toUpperCase()}`

      // Simulate some transfer failures (5% failure rate)
      if (Math.random() < 0.05) {
        return {
          success: false,
          message: 'Transfer failed due to network timeout. Please try again.',
          reference: transferData.reference,
          status: 'failed'
        }
      }

      // Simulate some transfers going to pending status (20% chance)
      const status = Math.random() < 0.2 ? 'pending' : 'completed'

      return {
        success: true,
        message: status === 'completed' 
          ? 'Transfer completed successfully' 
          : 'Transfer initiated and is being processed',
        reference: transferData.reference,
        externalReference,
        status,
        fee
      }
    } catch (error) {
      return {
        success: false,
        message: 'Transfer processing failed due to system error'
      }
    }
  }

  async getTransferStatus(reference: string): Promise<{
    success: boolean
    status: 'pending' | 'processing' | 'completed' | 'failed'
    message: string
    externalReference?: string
  }> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1000))

    // Simulate status updates (in a real system, this would query the external bank's API)
    const statuses = ['pending', 'processing', 'completed', 'failed'] as const
    const randomStatus = statuses[Math.floor(Math.random() * statuses.length)]

    const messages: Record<typeof statuses[number], string> = {
      pending: 'Transfer is pending review',
      processing: 'Transfer is being processed',
      completed: 'Transfer completed successfully',
      failed: 'Transfer failed - insufficient funds at destination'
    }

    return {
      success: true,
      status: randomStatus,
      message: messages[randomStatus],
      externalReference: `EXT${Date.now()}`
    }
  }

  // Webhook simulation for status updates
  async simulateWebhookUpdate(reference: string): Promise<{
    reference: string
    status: string
    timestamp: string
    externalReference: string
  }> {
    return {
      reference,
      status: Math.random() > 0.1 ? 'completed' : 'failed',
      timestamp: new Date().toISOString(),
      externalReference: `EXT${Date.now()}`
    }
  }
}
