import { Request } from 'express';
import { db } from '../config/db';
import { logger } from '../utils/logger';
import { v4 as uuidv4 } from 'uuid';
import crypto from 'crypto';

export interface SecurityEvent {
  id?: string;
  userId?: string;
  ipAddress: string;
  userAgent?: string;
  eventType: string;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  eventData?: any;
  blocked?: boolean;
  blockReason?: string;
}

export interface DeviceFingerprint {
  id?: string;
  userId?: string;
  fingerprintHash: string;
  deviceData: any;
  userAgent?: string;
  isTrusted: boolean;
  firstSeen: Date;
  lastSeen: Date;
  usageCount: number;
}

export interface RateLimit {
  identifier: string;
  action: string;
  attempts: number;
  maxAttempts: number;
  windowStart: Date;
  windowEnd: Date;
  blocked: boolean;
}

export class SecurityService {
  private static instance: SecurityService;
  private ipBlacklist: Set<string> = new Set();
  private ipWhitelist: Set<string> = new Set();
  private suspiciousPatterns: RegExp[] = [
    /bot|crawler|spider|scraper/i,
    /curl|wget|python|java|go-http/i,
    /automated|script|headless/i,
  ];

  public static getInstance(): SecurityService {
    if (!SecurityService.instance) {
      SecurityService.instance = new SecurityService();
    }
    return SecurityService.instance;
  }

  constructor() {
    this.loadSecurityData();
  }

  private async loadSecurityData(): Promise<void> {
    try {
      // Load IP blacklist/whitelist from database
      const ipSecurityData = await db('ip_security')
        .where('is_active', true)
        .select('ip_address', 'status');

      ipSecurityData.forEach(item => {
        if (item.status === 'blacklist') {
          this.ipBlacklist.add(item.ip_address);
        } else if (item.status === 'whitelist') {
          this.ipWhitelist.add(item.ip_address);
        }
      });

      logger.info(`Loaded ${this.ipBlacklist.size} blacklisted IPs and ${this.ipWhitelist.size} whitelisted IPs`);
    } catch (error) {
      logger.error('Failed to load security data:', error);
    }
  }

  public async analyzeRequest(req: Request, userId?: string): Promise<{
    allowed: boolean;
    riskLevel: 'low' | 'medium' | 'high' | 'critical';
    reasons: string[];
    fingerprint?: string;
  }> {
    const ipAddress = this.getClientIP(req);
    const userAgent = req.headers['user-agent'] || '';
    const reasons: string[] = [];
    let riskLevel: 'low' | 'medium' | 'high' | 'critical' = 'low';
    let allowed = true;

    // Check IP whitelist first
    if (this.ipWhitelist.has(ipAddress)) {
      return { allowed: true, riskLevel: 'low', reasons: ['Whitelisted IP'], fingerprint: undefined };
    }

    // Check IP blacklist
    if (this.ipBlacklist.has(ipAddress)) {
      reasons.push('Blacklisted IP');
      riskLevel = 'critical';
      allowed = false;
    }

    // Analyze user agent
    const userAgentRisk = this.analyzeUserAgent(userAgent);
    if (userAgentRisk.risk > 0) {
      reasons.push(...userAgentRisk.reasons);
      riskLevel = this.escalateRiskLevel(riskLevel, userAgentRisk.level);
      if (userAgentRisk.risk >= 80) {
        allowed = false;
      }
    }

    // Check rate limiting
    const rateLimitResult = await this.checkRateLimit(ipAddress, 'general', 100, 3600); // 100 requests per hour
    if (rateLimitResult.blocked) {
      reasons.push('Rate limit exceeded');
      riskLevel = 'high';
      allowed = false;
    }

    // Generate device fingerprint
    const fingerprint = this.generateDeviceFingerprint(req);
    const fingerprintRisk = await this.analyzeDeviceFingerprint(fingerprint, userId);
    if (fingerprintRisk.risk > 0) {
      reasons.push(...fingerprintRisk.reasons);
      riskLevel = this.escalateRiskLevel(riskLevel, fingerprintRisk.level);
    }

    // Check for suspicious patterns
    const patternRisk = this.checkSuspiciousPatterns(req);
    if (patternRisk.risk > 0) {
      reasons.push(...patternRisk.reasons);
      riskLevel = this.escalateRiskLevel(riskLevel, patternRisk.level);
      if (patternRisk.risk >= 70) {
        allowed = false;
      }
    }

    // Log security event
    await this.logSecurityEvent({
      userId,
      ipAddress,
      userAgent,
      eventType: 'request_analysis',
      riskLevel,
      eventData: {
        path: req.path,
        method: req.method,
        reasons,
        fingerprint
      },
      blocked: !allowed,
      blockReason: allowed ? undefined : reasons.join(', ')
    });

    return { allowed, riskLevel, reasons, fingerprint };
  }

  private analyzeUserAgent(userAgent: string): {
    risk: number;
    level: 'low' | 'medium' | 'high' | 'critical';
    reasons: string[];
  } {
    const reasons: string[] = [];
    let risk = 0;

    // Check for bot patterns
    for (const pattern of this.suspiciousPatterns) {
      if (pattern.test(userAgent)) {
        reasons.push('Suspicious user agent pattern detected');
        risk += 30;
      }
    }

    // Check for missing or suspicious user agent
    if (!userAgent || userAgent.length < 10) {
      reasons.push('Missing or too short user agent');
      risk += 40;
    }

    // Check for common bot user agents
    const botUserAgents = [
      'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
      'Mozilla/5.0 (compatible; bingbot/2.0; +http://www.bing.com/bingbot.htm)',
      'facebookexternalhit/1.1',
      'Twitterbot/1.0'
    ];

    if (botUserAgents.some(bot => userAgent.includes(bot))) {
      reasons.push('Known bot user agent');
      risk += 50;
    }

    // Determine risk level
    let level: 'low' | 'medium' | 'high' | 'critical' = 'low';
    if (risk >= 80) level = 'critical';
    else if (risk >= 60) level = 'high';
    else if (risk >= 30) level = 'medium';

    return { risk, level, reasons };
  }

  private generateDeviceFingerprint(req: Request): string {
    const fingerprintData = {
      userAgent: req.headers['user-agent'],
      acceptLanguage: req.headers['accept-language'],
      acceptEncoding: req.headers['accept-encoding'],
      connection: req.headers['connection'],
      dnt: req.headers['dnt'],
      upgradeInsecureRequests: req.headers['upgrade-insecure-requests'],
    };

    return crypto
      .createHash('sha256')
      .update(JSON.stringify(fingerprintData))
      .digest('hex');
  }

  private async analyzeDeviceFingerprint(fingerprint: string, userId?: string): Promise<{
    risk: number;
    level: 'low' | 'medium' | 'high' | 'critical';
    reasons: string[];
  }> {
    const reasons: string[] = [];
    let risk = 0;

    try {
      // Check if fingerprint exists
      const existingFingerprint = await db('device_fingerprints')
        .where('fingerprint_hash', fingerprint)
        .first();

      if (existingFingerprint) {
        // Update usage count and last seen
        await db('device_fingerprints')
          .where('fingerprint_hash', fingerprint)
          .update({
            last_seen: new Date(),
            usage_count: db.raw('usage_count + 1')
          });

        // Check if device is trusted
        if (existingFingerprint.is_trusted) {
          return { risk: 0, level: 'low', reasons: ['Trusted device'] };
        }

        // Check for suspicious usage patterns
        if (existingFingerprint.usage_count > 1000) {
          reasons.push('High usage count for device');
          risk += 20;
        }

        // Check if device is associated with different users
        const userCount = await db('device_fingerprints')
          .where('fingerprint_hash', fingerprint)
          .whereNotNull('user_id')
          .countDistinct('user_id as count')
          .first();

        const countVal = Number((userCount as any)?.count || 0);
        if (countVal > 5) {
          reasons.push('Device used by multiple users');
          risk += 40;
        }
      } else {
        // New device - moderate risk
        reasons.push('New device fingerprint');
        risk += 10;

        // Store new fingerprint
        await db('device_fingerprints').insert({
          id: uuidv4(),
          user_id: userId,
          fingerprint_hash: fingerprint,
          device_data: {},
          first_seen: new Date(),
          last_seen: new Date(),
          usage_count: 1,
          is_trusted: false
        });
      }
    } catch (error) {
      logger.error('Error analyzing device fingerprint:', error);
      risk += 20;
      reasons.push('Fingerprint analysis error');
    }

    // Determine risk level
    let level: 'low' | 'medium' | 'high' | 'critical' = 'low';
    if (risk >= 80) level = 'critical';
    else if (risk >= 60) level = 'high';
    else if (risk >= 30) level = 'medium';

    return { risk, level, reasons };
  }

  private checkSuspiciousPatterns(req: Request): {
    risk: number;
    level: 'low' | 'medium' | 'high' | 'critical';
    reasons: string[];
  } {
    const reasons: string[] = [];
    let risk = 0;

    // Check for SQL injection patterns
    const sqlPatterns = [
      /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER)\b)/i,
      /(UNION|OR|AND)\s+\d+\s*=\s*\d+/i,
      /['"]\s*(OR|AND)\s*['"]\s*=\s*['"]?/i
    ];

    const requestData = JSON.stringify({
      query: req.query,
      body: req.body,
      params: req.params
    });

    for (const pattern of sqlPatterns) {
      if (pattern.test(requestData)) {
        reasons.push('SQL injection pattern detected');
        risk += 60;
        break;
      }
    }

    // Check for XSS patterns
    const xssPatterns = [
      /<script[^>]*>.*?<\/script>/gi,
      /javascript:/gi,
      /on\w+\s*=/gi
    ];

    for (const pattern of xssPatterns) {
      if (pattern.test(requestData)) {
        reasons.push('XSS pattern detected');
        risk += 50;
        break;
      }
    }

    // Check for path traversal
    if (/\.\.\/|\.\.\\/.test(req.path)) {
      reasons.push('Path traversal attempt');
      risk += 70;
    }

    // Check for suspicious headers
    const suspiciousHeaders = ['x-forwarded-for', 'x-real-ip', 'x-originating-ip'];
    for (const header of suspiciousHeaders) {
      if (req.headers[header] && typeof req.headers[header] === 'string') {
        const headerValue = req.headers[header] as string;
        if (headerValue.split(',').length > 3) {
          reasons.push('Suspicious proxy chain detected');
          risk += 30;
        }
      }
    }

    // Determine risk level
    let level: 'low' | 'medium' | 'high' | 'critical' = 'low';
    if (risk >= 80) level = 'critical';
    else if (risk >= 60) level = 'high';
    else if (risk >= 30) level = 'medium';

    return { risk, level, reasons };
  }

  public async checkRateLimit(
    identifier: string,
    action: string,
    maxAttempts: number,
    windowSeconds: number
  ): Promise<{ allowed: boolean; blocked: boolean; remaining: number }> {
    const now = new Date();
    const windowStart = new Date(now.getTime() - windowSeconds * 1000);

    try {
      // Clean up old rate limit records
      await db('rate_limits')
        .where('window_end', '<', now)
        .del();

      // Check existing rate limit
      const existing = await db('rate_limits')
        .where('identifier', identifier)
        .where('action', action)
        .where('window_end', '>', now)
        .first();

      if (existing) {
        if (existing.blocked) {
          return { allowed: false, blocked: true, remaining: 0 };
        }

        if (existing.attempts >= maxAttempts) {
          // Block the identifier
          await db('rate_limits')
            .where('id', existing.id)
            .update({ blocked: true });

          return { allowed: false, blocked: true, remaining: 0 };
        }

        // Increment attempts
        await db('rate_limits')
          .where('id', existing.id)
          .update({ attempts: existing.attempts + 1 });

        return {
          allowed: true,
          blocked: false,
          remaining: maxAttempts - existing.attempts - 1
        };
      } else {
        // Create new rate limit record
        await db('rate_limits').insert({
          id: uuidv4(),
          identifier,
          action,
          attempts: 1,
          max_attempts: maxAttempts,
          window_start: windowStart,
          window_end: new Date(now.getTime() + windowSeconds * 1000),
          blocked: false
        });

        return { allowed: true, blocked: false, remaining: maxAttempts - 1 };
      }
    } catch (error) {
      logger.error('Rate limit check error:', error);
      return { allowed: true, blocked: false, remaining: maxAttempts };
    }
  }

  public async logSecurityEvent(event: SecurityEvent): Promise<void> {
    try {
      await db('security_events').insert({
        id: uuidv4(),
        user_id: event.userId,
        ip_address: event.ipAddress,
        user_agent: event.userAgent,
        event_type: event.eventType,
        risk_level: event.riskLevel,
        event_data: JSON.stringify(event.eventData || {}),
        blocked: event.blocked || false,
        block_reason: event.blockReason
      });
    } catch (error) {
      logger.error('Failed to log security event:', error);
    }
  }

  public async blockIP(ipAddress: string, reason: string, duration?: number): Promise<void> {
    try {
      const expiresAt = duration ? new Date(Date.now() + duration * 1000) : null;

      await db('ip_security').insert({
        id: uuidv4(),
        ip_address: ipAddress,
        status: 'blacklist',
        reason,
        threat_score: 100,
        expires_at: expiresAt,
        is_active: true
      }).onConflict('ip_address').merge({
        status: 'blacklist',
        reason,
        threat_score: 100,
        expires_at: expiresAt,
        is_active: true,
        updated_at: new Date()
      });

      this.ipBlacklist.add(ipAddress);
      logger.info(`IP ${ipAddress} blocked: ${reason}`);
    } catch (error) {
      logger.error('Failed to block IP:', error);
    }
  }

  public async unblockIP(ipAddress: string): Promise<void> {
    try {
      await db('ip_security')
        .where('ip_address', ipAddress)
        .update({ is_active: false });

      this.ipBlacklist.delete(ipAddress);
      logger.info(`IP ${ipAddress} unblocked`);
    } catch (error) {
      logger.error('Failed to unblock IP:', error);
    }
  }

  private getClientIP(req: Request): string {
    return (
      (req.headers['x-forwarded-for'] as string)?.split(',')[0] ||
      (req.headers['x-real-ip'] as string) ||
      req.connection.remoteAddress ||
      req.socket.remoteAddress ||
      '127.0.0.1'
    );
  }

  private escalateRiskLevel(
    current: 'low' | 'medium' | 'high' | 'critical',
    new_level: 'low' | 'medium' | 'high' | 'critical'
  ): 'low' | 'medium' | 'high' | 'critical' {
    const levels = { low: 1, medium: 2, high: 3, critical: 4 };
    const currentLevel = levels[current];
    const newLevel = levels[new_level];
    
    if (newLevel > currentLevel) {
      return new_level;
    }
    return current;
  }

  public async getSecurityStats(): Promise<{
    totalEvents: number;
    blockedRequests: number;
    topThreats: Array<{ type: string; count: number }>;
    riskDistribution: Record<string, number>;
  }> {
    try {
      const [totalEvents, blockedRequests, topThreats, riskDistribution] = await Promise.all([
        db('security_events').count('* as count').first(),
        db('security_events').where('blocked', true).count('* as count').first(),
        db('security_events')
          .select('event_type')
          .count('* as count')
          .groupBy('event_type')
          .orderBy('count', 'desc')
          .limit(5),
        db('security_events')
          .select('risk_level')
          .count('* as count')
          .groupBy('risk_level')
      ]);

      const riskDist: Record<string, number> = {};
      riskDistribution.forEach((item: any) => {
        riskDist[item.risk_level] = parseInt(item.count);
      });

      return {
        totalEvents: parseInt(String((totalEvents as any)?.count || '0')),
        blockedRequests: parseInt(String((blockedRequests as any)?.count || '0')),
        topThreats: topThreats.map((item: any) => ({
          type: item.event_type,
          count: parseInt(String(item.count))
        })),
        riskDistribution: riskDist
      };
    } catch (error) {
      logger.error('Failed to get security stats:', error);
      return {
        totalEvents: 0,
        blockedRequests: 0,
        topThreats: [],
        riskDistribution: {}
      };
    }
  }
}

export const securityService = SecurityService.getInstance();
