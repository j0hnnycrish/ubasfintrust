import { db } from '../config/database';
import { logger } from '../utils/logger';
import { logAudit } from '../utils/audit';
import { notificationService } from './notificationService';

export interface FraudAlert {
  userId: string;
  transactionId?: string;
  riskScore: number;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  reasons: string[];
  metadata: Record<string, any>;
}

export interface TransactionRisk {
  transactionId: string;
  riskScore: number;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  shouldBlock: boolean;
  reasons: string[];
}

export class FraudDetectionService {
  private static instance: FraudDetectionService;
  private riskThresholds = {
    low: 30,
    medium: 60,
    high: 80,
    critical: 95
  };

  public static getInstance(): FraudDetectionService {
    if (!FraudDetectionService.instance) {
      FraudDetectionService.instance = new FraudDetectionService();
    }
    return FraudDetectionService.instance;
  }

  async analyzeTransaction(transactionData: {
    userId: string;
    amount: number;
    currency: string;
    type: string;
    fromAccountId: string;
    toAccountId?: string;
    toAccountNumber?: string;
    ipAddress: string;
    userAgent: string;
    timestamp: Date;
  }): Promise<TransactionRisk> {
    let riskScore = 0;
    const reasons: string[] = [];

    try {
      // 1. Amount-based risk analysis
      const amountRisk = await this.analyzeAmount(transactionData.userId, transactionData.amount);
      riskScore += amountRisk.score;
      reasons.push(...amountRisk.reasons);

      // 2. Frequency analysis
      const frequencyRisk = await this.analyzeFrequency(transactionData.userId, transactionData.timestamp);
      riskScore += frequencyRisk.score;
      reasons.push(...frequencyRisk.reasons);

      // 3. Time-based analysis
      const timeRisk = this.analyzeTime(transactionData.timestamp);
      riskScore += timeRisk.score;
      reasons.push(...timeRisk.reasons);

      // 4. Location/IP analysis
      const locationRisk = await this.analyzeLocation(transactionData.userId, transactionData.ipAddress);
      riskScore += locationRisk.score;
      reasons.push(...locationRisk.reasons);

      // 5. Account behavior analysis
      const behaviorRisk = await this.analyzeBehavior(transactionData.userId, transactionData.amount, transactionData.type);
      riskScore += behaviorRisk.score;
      reasons.push(...behaviorRisk.reasons);

      // 6. Velocity checks
      const velocityRisk = await this.analyzeVelocity(transactionData.userId, transactionData.amount);
      riskScore += velocityRisk.score;
      reasons.push(...velocityRisk.reasons);

      // Determine risk level and action
      const riskLevel = this.getRiskLevel(riskScore);
      const shouldBlock = riskScore >= this.riskThresholds.high;

      const result: TransactionRisk = {
        transactionId: `temp_${Date.now()}`,
        riskScore,
        riskLevel,
        shouldBlock,
        reasons: reasons.filter(r => r.length > 0)
      };

      // Log high-risk transactions
      if (riskLevel === 'high' || riskLevel === 'critical') {
        await this.logFraudAlert({
          userId: transactionData.userId,
          riskScore,
          riskLevel,
          reasons: result.reasons,
          metadata: {
            amount: transactionData.amount,
            type: transactionData.type,
            ipAddress: transactionData.ipAddress
          }
        });
      }

      return result;

    } catch (error) {
      logger.error('Fraud detection analysis failed:', error);
      return {
        transactionId: `temp_${Date.now()}`,
        riskScore: 0,
        riskLevel: 'low',
        shouldBlock: false,
        reasons: ['Analysis failed - proceeding with caution']
      };
    }
  }

  private async analyzeAmount(userId: string, amount: number): Promise<{ score: number; reasons: string[] }> {
    const reasons: string[] = [];
    let score = 0;

    // Get user's transaction history for the last 30 days
    const recentTransactions = await db('transactions')
      .where('from_account_id', 'in', 
        db('accounts').select('id').where('user_id', userId)
      )
      .where('created_at', '>', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000))
      .where('status', 'completed');

    if (recentTransactions.length > 0) {
      const amounts = recentTransactions.map(t => t.amount);
      const avgAmount = amounts.reduce((a, b) => a + b, 0) / amounts.length;
      const maxAmount = Math.max(...amounts);

      // Check if amount is significantly higher than usual
      if (amount > avgAmount * 5) {
        score += 25;
        reasons.push('Transaction amount significantly higher than usual');
      }

      if (amount > maxAmount * 2) {
        score += 20;
        reasons.push('Transaction amount exceeds previous maximum by 100%');
      }
    }

    // Large amount thresholds
    if (amount > 1000000) { // 1M
      score += 30;
      reasons.push('Very large transaction amount');
    } else if (amount > 500000) { // 500K
      score += 20;
      reasons.push('Large transaction amount');
    } else if (amount > 100000) { // 100K
      score += 10;
      reasons.push('Above-average transaction amount');
    }

    return { score, reasons };
  }

  private async analyzeFrequency(userId: string, timestamp: Date): Promise<{ score: number; reasons: string[] }> {
    const reasons: string[] = [];
    let score = 0;

    const now = timestamp;
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    // Count transactions in the last hour
    const hourlyCount = await db('transactions')
      .where('from_account_id', 'in', 
        db('accounts').select('id').where('user_id', userId)
      )
      .where('created_at', '>', oneHourAgo)
      .count('* as count')
      .first();

    // Count transactions in the last day
    const dailyCount = await db('transactions')
      .where('from_account_id', 'in', 
        db('accounts').select('id').where('user_id', userId)
      )
      .where('created_at', '>', oneDayAgo)
      .count('* as count')
      .first();

    const hourly = Number(hourlyCount?.count || 0);
    const daily = Number(dailyCount?.count || 0);

    if (hourly > 10) {
      score += 40;
      reasons.push('Excessive transaction frequency (>10 per hour)');
    } else if (hourly > 5) {
      score += 25;
      reasons.push('High transaction frequency (>5 per hour)');
    }

    if (daily > 50) {
      score += 30;
      reasons.push('Very high daily transaction count');
    } else if (daily > 20) {
      score += 15;
      reasons.push('High daily transaction count');
    }

    return { score, reasons };
  }

  private analyzeTime(timestamp: Date): { score: number; reasons: string[] } {
    const reasons: string[] = [];
    let score = 0;

    const hour = timestamp.getHours();
    const day = timestamp.getDay(); // 0 = Sunday, 6 = Saturday

    // Late night/early morning transactions (11 PM - 5 AM)
    if (hour >= 23 || hour <= 5) {
      score += 15;
      reasons.push('Transaction during unusual hours');
    }

    // Weekend transactions
    if (day === 0 || day === 6) {
      score += 5;
      reasons.push('Weekend transaction');
    }

    return { score, reasons };
  }

  private async analyzeLocation(userId: string, ipAddress: string): Promise<{ score: number; reasons: string[] }> {
    const reasons: string[] = [];
    let score = 0;

    try {
      // Get user's recent IP addresses
      const recentIPs = await db('audit_logs')
        .where('user_id', userId)
        .where('created_at', '>', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000))
        .distinct('metadata->ip_address as ip')
        .limit(10);

      const knownIPs = recentIPs.map(r => r.ip).filter(Boolean);

      if (knownIPs.length > 0 && !knownIPs.includes(ipAddress)) {
        score += 20;
        reasons.push('Transaction from new IP address');
      }

      // Check for suspicious IP patterns (basic implementation)
      if (this.isSuspiciousIP(ipAddress)) {
        score += 25;
        reasons.push('Transaction from suspicious IP address');
      }

    } catch (error) {
      logger.warn('Location analysis failed:', error);
    }

    return { score, reasons };
  }

  private async analyzeBehavior(userId: string, amount: number, type: string): Promise<{ score: number; reasons: string[] }> {
    const reasons: string[] = [];
    let score = 0;

    // Get user account age
    const user = await db('users').where('id', userId).first();
    if (user) {
      const accountAge = Date.now() - new Date(user.created_at).getTime();
      const daysSinceCreation = accountAge / (1000 * 60 * 60 * 24);

      // New account with large transaction
      if (daysSinceCreation < 7 && amount > 50000) {
        score += 35;
        reasons.push('Large transaction from new account');
      } else if (daysSinceCreation < 1 && amount > 10000) {
        score += 25;
        reasons.push('Significant transaction from very new account');
      }
    }

    return { score, reasons };
  }

  private async analyzeVelocity(userId: string, amount: number): Promise<{ score: number; reasons: string[] }> {
    const reasons: string[] = [];
    let score = 0;

    // Check total amount in last 24 hours
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const dailyTotal = await db('transactions')
      .where('from_account_id', 'in', 
        db('accounts').select('id').where('user_id', userId)
      )
      .where('created_at', '>', oneDayAgo)
      .where('status', 'completed')
      .sum('amount as total')
      .first();

    const total = Number(dailyTotal?.total || 0) + amount;

    if (total > 2000000) { // 2M daily
      score += 40;
      reasons.push('Daily transaction velocity exceeds 2M');
    } else if (total > 1000000) { // 1M daily
      score += 25;
      reasons.push('Daily transaction velocity exceeds 1M');
    } else if (total > 500000) { // 500K daily
      score += 15;
      reasons.push('High daily transaction velocity');
    }

    return { score, reasons };
  }

  private getRiskLevel(score: number): 'low' | 'medium' | 'high' | 'critical' {
    if (score >= this.riskThresholds.critical) return 'critical';
    if (score >= this.riskThresholds.high) return 'high';
    if (score >= this.riskThresholds.medium) return 'medium';
    return 'low';
  }

  private isSuspiciousIP(ip: string): boolean {
    // Basic suspicious IP detection
    // In production, you'd use a proper IP reputation service
    const suspiciousPatterns = [
      /^10\./, // Private IP ranges (shouldn't be external)
      /^192\.168\./, // Private IP ranges
      /^172\.(1[6-9]|2[0-9]|3[0-1])\./, // Private IP ranges
      /^127\./, // Loopback
      /^0\./, // Invalid
    ];

    return suspiciousPatterns.some(pattern => pattern.test(ip));
  }

  private async logFraudAlert(alert: FraudAlert): Promise<void> {
    try {
      // Store fraud alert in database
      await db('fraud_alerts').insert({
        id: require('uuid').v4(),
        user_id: alert.userId,
        transaction_id: alert.transactionId,
        risk_score: alert.riskScore,
        risk_level: alert.riskLevel,
        reasons: JSON.stringify(alert.reasons),
        metadata: JSON.stringify(alert.metadata),
        status: 'pending',
        created_at: new Date()
      });

      // Log audit trail
      logAudit('FRAUD_ALERT_GENERATED', alert.userId, 'security', {
        riskScore: alert.riskScore,
        riskLevel: alert.riskLevel,
        reasons: alert.reasons
      });

      // Notify security team
      const admins = await db('users').where({ account_type: 'admin' }).select('id');
      for (const admin of admins) {
        await notificationService.sendNotification({
          userId: admin.id,
          type: 'fraud_alert',
          title: `Fraud Alert - ${alert.riskLevel.toUpperCase()} Risk`,
          message: `High-risk transaction detected for user ${alert.userId}. Risk score: ${alert.riskScore}`,
          priority: alert.riskLevel === 'critical' ? 'critical' : 'high',
          channels: ['email', 'in_app'],
          metadata: alert.metadata
        });
      }

      logger.warn('Fraud alert generated', {
        userId: alert.userId,
        riskScore: alert.riskScore,
        riskLevel: alert.riskLevel,
        reasons: alert.reasons
      });

    } catch (error) {
      logger.error('Failed to log fraud alert:', error);
    }
  }
}

export const fraudDetectionService = FraudDetectionService.getInstance();
