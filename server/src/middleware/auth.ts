import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import speakeasy from 'speakeasy';
import { User, JWTPayload, AuthRequest } from '../types';
import { CacheService } from '../config/redis';
import { logger, logSecurity } from '../utils/logger';
import { db } from '../config/db';

export class AuthMiddleware {
  // Verify JWT token
  static async verifyToken(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const authHeader = req.headers.authorization;
      
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({
          success: false,
          message: 'Access token required'
        });
        return;
      }

      const token = authHeader.substring(7);
      
      // Check if token is blacklisted
      const isBlacklisted = await CacheService.exists(`blacklist:${token}`);
      if (isBlacklisted) {
        res.status(401).json({
          success: false,
          message: 'Token has been revoked'
        });
        return;
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JWTPayload;
      
      // Get user from database
      const user = await db('users')
        .where({ id: decoded.userId, is_active: true })
        .first();

      if (!user) {
        res.status(401).json({
          success: false,
          message: 'User not found or inactive'
        });
        return;
      }

      // Check if user is locked
      if (user.locked_until && new Date(user.locked_until) > new Date()) {
        res.status(423).json({
          success: false,
          message: 'Account is temporarily locked'
        });
        return;
      }

      req.user = user;
      next();
    } catch (error) {
      if (error instanceof jwt.JsonWebTokenError) {
        res.status(401).json({
          success: false,
          message: 'Invalid token'
        });
        return;
      }
      
      logger.error('Auth middleware error:', error);
      res.status(500).json({
        success: false,
        message: 'Authentication error'
      });
      return;
    }
  }

  // Verify 2FA token
  static async verify2FA(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { twoFactorToken } = req.body;
      const user = req.user!;

      if (!user.two_factor_enabled) {
        return next();
      }

      if (!twoFactorToken) {
        res.status(400).json({
          success: false,
          message: '2FA token required'
        });
        return;
      }

      const verified = speakeasy.totp.verify({
        secret: user.two_factor_secret!,
        encoding: 'base32',
        token: twoFactorToken,
        window: 2
      });

      if (!verified) {
        logSecurity('2FA_VERIFICATION_FAILED', user.id, req.ip);
        res.status(400).json({
          success: false,
          message: 'Invalid 2FA token'
        });
        return;
      }

      next();
    } catch (error) {
      logger.error('2FA verification error:', error);
  res.status(500).json({
        success: false,
        message: '2FA verification error'
  });
  return;
    }
  }

  // Check user permissions
  static requireRole(roles: string[]) {
    return (req: AuthRequest, res: Response, next: NextFunction) => {
      const user = req.user!;
      
      if (!roles.includes(user.account_type)) {
        return res.status(403).json({
          success: false,
          message: 'Insufficient permissions'
        });
      }
      
      next();
    };
  }

  // Rate limiting for authentication attempts
  static async rateLimitAuth(req: Request, res: Response, next: NextFunction) {
    try {
      const key = `auth_attempts:${req.ip}`;
      const attempts = await CacheService.incrementRateLimit(key, 900); // 15 minutes

      if (attempts > 5) {
        logSecurity('RATE_LIMIT_EXCEEDED', undefined, req.ip, { attempts });
        return res.status(429).json({
          success: false,
          message: 'Too many authentication attempts. Please try again later.'
        });
      }

      next();
    } catch (error) {
      logger.error('Rate limit middleware error:', error);
      next();
    }
  }

  // Generate JWT tokens
  static generateTokens(user: User) {
    const payload: Omit<JWTPayload, 'iat' | 'exp'> = {
      userId: user.id,
      email: user.email,
      accountType: user.account_type
    };

    const accessToken = jwt.sign(payload as any, process.env['JWT_SECRET'] as any, {
      expiresIn: (process.env['JWT_EXPIRES_IN'] as any) || '15m'
    } as any);

    const refreshToken = jwt.sign(payload as any, process.env['JWT_REFRESH_SECRET'] as any, {
      expiresIn: (process.env['JWT_REFRESH_EXPIRES_IN'] as any) || '7d'
    } as any);

    return { accessToken, refreshToken };
  }

  // Refresh access token
  static async refreshToken(req: Request, res: Response): Promise<void> {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        res.status(400).json({
          success: false,
          message: 'Refresh token required'
        });
        return;
      }

      // Check if refresh token is blacklisted
      const isBlacklisted = await CacheService.exists(`blacklist:${refreshToken}`);
      if (isBlacklisted) {
        res.status(401).json({
          success: false,
          message: 'Refresh token has been revoked'
        });
        return;
      }

      const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET!) as JWTPayload;
      
      const user = await db('users')
        .where({ id: decoded.userId, is_active: true })
        .first();

      if (!user) {
        res.status(401).json({
          success: false,
          message: 'User not found'
        });
        return;
      }

      const tokens = AuthMiddleware.generateTokens(user);

      // Blacklist old refresh token
      await CacheService.set(`blacklist:${refreshToken}`, true, 7 * 24 * 60 * 60);

      res.json({
        success: true,
        data: tokens
      });
    } catch (error) {
      if (error instanceof jwt.JsonWebTokenError) {
        res.status(401).json({
          success: false,
          message: 'Invalid refresh token'
        });
        return;
      }
      
      logger.error('Token refresh error:', error);
      res.status(500).json({
        success: false,
        message: 'Token refresh error'
      });
      return;
    }
  }

  // Logout and blacklist tokens
  static async logout(req: AuthRequest, res: Response): Promise<void> {
    try {
      const authHeader = req.headers.authorization;
      const { refreshToken } = req.body;

      if (authHeader && authHeader.startsWith('Bearer ')) {
        const accessToken = authHeader.substring(7);
        await CacheService.set(`blacklist:${accessToken}`, true, 15 * 60); // 15 minutes
      }

      if (refreshToken) {
        await CacheService.set(`blacklist:${refreshToken}`, true, 7 * 24 * 60 * 60); // 7 days
      }

  res.json({
        success: true,
        message: 'Logged out successfully'
      });
    } catch (error) {
      logger.error('Logout error:', error);
  res.status(500).json({
        success: false,
        message: 'Logout error'
  });
  return;
    }
  }

  // Hash password
  static async hashPassword(password: string): Promise<string> {
    const saltRounds = parseInt(process.env.BCRYPT_ROUNDS || '12');
    return bcrypt.hash(password, saltRounds);
  }

  // Verify password
  static async verifyPassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }
}
