// Professional Security Service for UBAS Financial Trust
// Implements DevSecOps best practices and banking security standards

export interface SecurityValidation {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  strength?: 'weak' | 'medium' | 'strong' | 'very_strong';
}

export interface AuditLog {
  id: string;
  timestamp: Date;
  userId?: string;
  action: string;
  resource: string;
  ipAddress: string;
  userAgent: string;
  success: boolean;
  details?: Record<string, any>;
}

export class SecurityService {
  private static auditLogs: AuditLog[] = [];

  /**
   * Validate password strength according to banking standards
   */
  static validatePassword(password: string): SecurityValidation {
    const errors: string[] = [];
    const warnings: string[] = [];
    let strength: SecurityValidation['strength'] = 'weak';

    // Minimum length requirement
    if (password.length < 12) {
      errors.push('Password must be at least 12 characters long');
    }

    // Character requirements
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChars = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);

    if (!hasUppercase) errors.push('Password must contain at least one uppercase letter');
    if (!hasLowercase) errors.push('Password must contain at least one lowercase letter');
    if (!hasNumbers) errors.push('Password must contain at least one number');
    if (!hasSpecialChars) errors.push('Password must contain at least one special character');

    // Common patterns to avoid
    const commonPatterns = [
      /123456/,
      /password/i,
      /qwerty/i,
      /admin/i,
      /ubas/i,
      /bank/i
    ];

    commonPatterns.forEach(pattern => {
      if (pattern.test(password)) {
        warnings.push('Password contains common patterns that should be avoided');
      }
    });

    // Sequential characters
    if (/(.)\1{2,}/.test(password)) {
      warnings.push('Password contains repeated characters');
    }

    // Calculate strength
    let strengthScore = 0;
    if (password.length >= 12) strengthScore += 1;
    if (password.length >= 16) strengthScore += 1;
    if (hasUppercase && hasLowercase) strengthScore += 1;
    if (hasNumbers) strengthScore += 1;
    if (hasSpecialChars) strengthScore += 1;
    if (password.length >= 20) strengthScore += 1;

    if (strengthScore >= 5) strength = 'very_strong';
    else if (strengthScore >= 4) strength = 'strong';
    else if (strengthScore >= 3) strength = 'medium';
    else strength = 'weak';

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      strength
    };
  }

  /**
   * Validate Social Security Number format
   */
  static validateSSN(ssn: string): SecurityValidation {
    const errors: string[] = [];
    const cleanSSN = ssn.replace(/\D/g, '');

    if (cleanSSN.length !== 9) {
      errors.push('SSN must be 9 digits');
    }

    // Invalid SSN patterns
    const invalidPatterns = [
      /^000/, // Area number 000
      /^666/, // Area number 666
      /^9[0-9]{2}/, // Area numbers 900-999
      /^[0-9]{3}00/, // Group number 00
      /^[0-9]{5}0000/, // Serial number 0000
    ];

    invalidPatterns.forEach(pattern => {
      if (pattern.test(cleanSSN)) {
        errors.push('Invalid SSN format');
      }
    });

    return {
      isValid: errors.length === 0,
      errors,
      warnings: []
    };
  }

  /**
   * Validate phone number format
   */
  static validatePhoneNumber(phone: string): SecurityValidation {
    const errors: string[] = [];
    const cleanPhone = phone.replace(/\D/g, '');

    if (cleanPhone.length !== 10 && cleanPhone.length !== 11) {
      errors.push('Phone number must be 10 or 11 digits');
    }

    if (cleanPhone.length === 11 && !cleanPhone.startsWith('1')) {
      errors.push('11-digit phone number must start with 1');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings: []
    };
  }

  /**
   * Validate email address
   */
  static validateEmail(email: string): SecurityValidation {
    const errors: string[] = [];
    const warnings: string[] = [];

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      errors.push('Invalid email format');
    }

    // Check for disposable email domains
    const disposableDomains = [
      '10minutemail.com',
      'tempmail.org',
      'guerrillamail.com',
      'mailinator.com'
    ];

    const domain = email.split('@')[1]?.toLowerCase();
    if (domain && disposableDomains.includes(domain)) {
      warnings.push('Disposable email addresses are not recommended for banking');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  /**
   * Sanitize input to prevent XSS attacks
   */
  static sanitizeInput(input: string): string {
    return input
      .replace(/[<>]/g, '') // Remove angle brackets
      .replace(/javascript:/gi, '') // Remove javascript: protocol
      .replace(/on\w+=/gi, '') // Remove event handlers
      .trim();
  }

  /**
   * Generate secure random token
   */
  static generateSecureToken(length: number = 32): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  /**
   * Log security events for audit trail
   */
  static logSecurityEvent(
    action: string,
    resource: string,
    success: boolean,
    userId?: string,
    details?: Record<string, any>
  ): void {
    const auditLog: AuditLog = {
      id: this.generateSecureToken(16),
      timestamp: new Date(),
      userId,
      action,
      resource,
      ipAddress: this.getClientIP(),
      userAgent: navigator.userAgent,
      success,
      details
    };

    this.auditLogs.push(auditLog);

    // In production, this would be sent to a secure logging service
    console.log('Security Event:', auditLog);
  }

  /**
   * Check for suspicious activity patterns
   */
  static detectSuspiciousActivity(userId: string): boolean {
    const recentLogs = this.auditLogs
      .filter(log => log.userId === userId)
      .filter(log => Date.now() - log.timestamp.getTime() < 3600000); // Last hour

    // Multiple failed login attempts
    const failedLogins = recentLogs.filter(
      log => log.action === 'login' && !log.success
    ).length;

    if (failedLogins >= 5) {
      this.logSecurityEvent('SUSPICIOUS_ACTIVITY', 'login', false, userId, {
        reason: 'Multiple failed login attempts',
        count: failedLogins
      });
      return true;
    }

    // Rapid transaction attempts
    const transactions = recentLogs.filter(
      log => log.action === 'transaction'
    ).length;

    if (transactions >= 10) {
      this.logSecurityEvent('SUSPICIOUS_ACTIVITY', 'transaction', false, userId, {
        reason: 'Rapid transaction attempts',
        count: transactions
      });
      return true;
    }

    return false;
  }

  /**
   * Validate file upload security
   */
  static validateFileUpload(file: File): SecurityValidation {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Allowed file types for KYC documents
    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'image/gif',
      'application/pdf'
    ];

    if (!allowedTypes.includes(file.type)) {
      errors.push('File type not allowed. Please upload JPEG, PNG, GIF, or PDF files only.');
    }

    // File size limit (5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      errors.push('File size must be less than 5MB');
    }

    // Check for suspicious file names
    const suspiciousPatterns = [
      /\.exe$/i,
      /\.bat$/i,
      /\.cmd$/i,
      /\.scr$/i,
      /\.js$/i,
      /\.vbs$/i
    ];

    suspiciousPatterns.forEach(pattern => {
      if (pattern.test(file.name)) {
        errors.push('Suspicious file type detected');
      }
    });

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  /**
   * Get client IP address (simplified for demo)
   */
  private static getClientIP(): string {
    // In production, this would get the real client IP
    return '192.168.1.100';
  }

  /**
   * Get audit logs for compliance reporting
   */
  static getAuditLogs(userId?: string, startDate?: Date, endDate?: Date): AuditLog[] {
    let logs = [...this.auditLogs];

    if (userId) {
      logs = logs.filter(log => log.userId === userId);
    }

    if (startDate) {
      logs = logs.filter(log => log.timestamp >= startDate);
    }

    if (endDate) {
      logs = logs.filter(log => log.timestamp <= endDate);
    }

    return logs.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }
}

export default SecurityService;
