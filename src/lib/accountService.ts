// Professional Account Management Service for UBAS Financial Trust

export interface AccountInfo {
  accountNumber: string;
  accountType: AccountType;
  username: string;
  routingNumber: string;
  iban?: string;
  swiftCode?: string;
}

export enum AccountType {
  PERSONAL_CHECKING = 'personal_checking',
  PERSONAL_SAVINGS = 'personal_savings',
  BUSINESS_CHECKING = 'business_checking',
  BUSINESS_SAVINGS = 'business_savings',
  INVESTMENT = 'investment',
  CREDIT = 'credit',
  LOAN = 'loan',
  PRIVATE_BANKING = 'private_banking',
  CORPORATE_BANKING = 'corporate_banking'
}

export class AccountService {
  private static readonly ROUTING_NUMBER = '021000021'; // UBAS Financial Trust routing number
  private static readonly SWIFT_CODE = 'UBASFINTRUST';
  private static readonly BANK_CODE = 'UBAS';

  // Account type prefixes for account number generation
  private static readonly ACCOUNT_PREFIXES = {
    [AccountType.PERSONAL_CHECKING]: '1000',
    [AccountType.PERSONAL_SAVINGS]: '2000',
    [AccountType.BUSINESS_CHECKING]: '3000',
    [AccountType.BUSINESS_SAVINGS]: '4000',
    [AccountType.INVESTMENT]: '5000',
    [AccountType.CREDIT]: '6000',
    [AccountType.LOAN]: '7000',
    [AccountType.PRIVATE_BANKING]: '8000',
    [AccountType.CORPORATE_BANKING]: '9000'
  };

  /**
   * Generate a professional account number
   * Format: UBAS-XXXX-XXXX-XXXX
   */
  static generateAccountNumber(accountType: AccountType): string {
    const prefix = this.ACCOUNT_PREFIXES[accountType];
    const randomPart1 = this.generateRandomDigits(4);
    const randomPart2 = this.generateRandomDigits(4);
    
    return `${this.BANK_CODE}-${prefix}-${randomPart1}-${randomPart2}`;
  }

  /**
   * Generate a unique username suggestion
   */
  static generateUsername(firstName: string, lastName: string): string {
    const baseUsername = `${firstName.toLowerCase()}.${lastName.toLowerCase()}`;
    const randomSuffix = this.generateRandomDigits(3);
    
    return `${baseUsername}${randomSuffix}`;
  }

  /**
   * Generate IBAN for international accounts
   */
  static generateIBAN(accountNumber: string): string {
    // Extract the numeric part from account number
    const numericPart = accountNumber.replace(/\D/g, '');
    const checkDigits = this.calculateIBANCheckDigits(numericPart);
    
    return `US${checkDigits}${this.ROUTING_NUMBER}${numericPart}`;
  }

  /**
   * Validate account number format
   */
  static validateAccountNumber(accountNumber: string): boolean {
    const pattern = /^UBAS-\d{4}-\d{4}-\d{4}$/;
    return pattern.test(accountNumber);
  }

  /**
   * Validate username format
   */
  static validateUsername(username: string): boolean {
    // Username: 6-20 characters, alphanumeric, underscore, hyphen
    const pattern = /^[a-zA-Z0-9_-]{6,20}$/;
    return pattern.test(username);
  }

  /**
   * Get account type from account number
   */
  static getAccountTypeFromNumber(accountNumber: string): AccountType | null {
    if (!this.validateAccountNumber(accountNumber)) {
      return null;
    }

    const prefix = accountNumber.split('-')[1];
    
    for (const [type, typePrefix] of Object.entries(this.ACCOUNT_PREFIXES)) {
      if (prefix === typePrefix) {
        return type as AccountType;
      }
    }

    return null;
  }

  /**
   * Format account number for display
   */
  static formatAccountNumber(accountNumber: string, masked: boolean = false): string {
    if (!this.validateAccountNumber(accountNumber)) {
      return accountNumber;
    }

    if (masked) {
      const parts = accountNumber.split('-');
      return `${parts[0]}-****-****-${parts[3]}`;
    }

    return accountNumber;
  }

  /**
   * Generate account information package
   */
  static generateAccountInfo(
    accountType: AccountType,
    firstName: string,
    lastName: string
  ): AccountInfo {
    const accountNumber = this.generateAccountNumber(accountType);
    const username = this.generateUsername(firstName, lastName);
    const iban = this.generateIBAN(accountNumber);

    return {
      accountNumber,
      accountType,
      username,
      routingNumber: this.ROUTING_NUMBER,
      iban,
      swiftCode: this.SWIFT_CODE
    };
  }

  /**
   * Get account type display name
   */
  static getAccountTypeDisplayName(accountType: AccountType): string {
    const displayNames = {
      [AccountType.PERSONAL_CHECKING]: 'Personal Checking',
      [AccountType.PERSONAL_SAVINGS]: 'Personal Savings',
      [AccountType.BUSINESS_CHECKING]: 'Business Checking',
      [AccountType.BUSINESS_SAVINGS]: 'Business Savings',
      [AccountType.INVESTMENT]: 'Investment Account',
      [AccountType.CREDIT]: 'Credit Account',
      [AccountType.LOAN]: 'Loan Account',
      [AccountType.PRIVATE_BANKING]: 'Private Banking',
      [AccountType.CORPORATE_BANKING]: 'Corporate Banking'
    };

    return displayNames[accountType] || 'Unknown Account Type';
  }

  /**
   * Get account features based on type
   */
  static getAccountFeatures(accountType: AccountType): string[] {
    const features = {
      [AccountType.PERSONAL_CHECKING]: [
        'No monthly maintenance fee',
        'Free online and mobile banking',
        'Free debit card',
        'ATM fee reimbursement',
        'Overdraft protection available'
      ],
      [AccountType.PERSONAL_SAVINGS]: [
        'Competitive interest rates',
        'No minimum balance requirement',
        'Free transfers between accounts',
        'Automatic savings programs',
        'FDIC insured up to $250,000'
      ],
      [AccountType.BUSINESS_CHECKING]: [
        'Business debit card',
        'Cash management services',
        'ACH and wire transfers',
        'Business online banking',
        'Merchant services available'
      ],
      [AccountType.BUSINESS_SAVINGS]: [
        'Business savings rates',
        'Sweep account options',
        'Business money market',
        'Certificate of deposit options',
        'Treasury management services'
      ],
      [AccountType.INVESTMENT]: [
        'Investment advisory services',
        'Portfolio management',
        'Retirement planning',
        'Tax-advantaged accounts',
        'Global market access'
      ],
      [AccountType.PRIVATE_BANKING]: [
        'Dedicated relationship manager',
        'Concierge banking services',
        'Exclusive investment opportunities',
        'Estate planning services',
        'Global banking access'
      ],
      [AccountType.CORPORATE_BANKING]: [
        'Corporate treasury services',
        'Trade finance solutions',
        'Foreign exchange services',
        'Corporate lending',
        'Cash management solutions'
      ]
    };

    return features[accountType] || [];
  }

  // Private helper methods
  private static generateRandomDigits(length: number): string {
    let result = '';
    for (let i = 0; i < length; i++) {
      result += Math.floor(Math.random() * 10).toString();
    }
    return result;
  }

  private static calculateIBANCheckDigits(accountNumber: string): string {
    // Simplified IBAN check digit calculation
    const numericString = accountNumber + '2134'; // US country code converted to numbers
    const remainder = this.mod97(numericString);
    const checkDigits = 98 - remainder;
    
    return checkDigits.toString().padStart(2, '0');
  }

  private static mod97(numericString: string): number {
    let remainder = 0;
    for (let i = 0; i < numericString.length; i++) {
      remainder = (remainder * 10 + parseInt(numericString[i])) % 97;
    }
    return remainder;
  }
}

// Export for use in other components
export default AccountService;
