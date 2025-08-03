import { Router, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import speakeasy from 'speakeasy';
import QRCode from 'qrcode';
import { AuthMiddleware } from '../middleware/auth';
import { authRateLimit } from '../middleware/security';
import { db } from '../config/db';
import { CacheService } from '../config/redis';
import { logger, logSecurity, logAudit } from '../utils/logger';
import { AuthRequest, User } from '../types';
import { v4 as uuidv4 } from 'uuid';
import { notificationService } from '../services/notificationService';
import { securityService } from '../services/securityService';
import {
  authRateLimit,
  validateInput,
  commonValidations,
  securityAnalysis,
  suspiciousActivityDetection
} from '../middleware/securityMiddleware';

const router = Router();

// Validation rules
const registerValidation = [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 8 }).matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/),
  body('firstName').isLength({ min: 2 }).trim(),
  body('lastName').isLength({ min: 2 }).trim(),
  body('phone').isMobilePhone('any'),
  body('dateOfBirth').isISO8601(),
  body('accountType').isIn(['personal', 'business', 'corporate', 'private'])
];

const loginValidation = [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty()
];

// Register new user
router.post('/register', authRateLimit, registerValidation, async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { email, password, firstName, lastName, phone, dateOfBirth, accountType } = req.body;

    // Check if user already exists
    const existingUser = await db('users').where({ email }).first();
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'User already exists with this email'
      });
    }

    // Check if phone already exists
    const existingPhone = await db('users').where({ phone }).first();
    if (existingPhone) {
      return res.status(409).json({
        success: false,
        message: 'User already exists with this phone number'
      });
    }

    // Hash password
    const passwordHash = await AuthMiddleware.hashPassword(password);

    // Create user
    const userId = uuidv4();
    const user = {
      id: userId,
      email,
      password_hash: passwordHash,
      first_name: firstName,
      last_name: lastName,
      phone,
      date_of_birth: dateOfBirth,
      account_type: accountType,
      kyc_status: 'pending',
      is_active: true,
      is_verified: false,
      two_factor_enabled: false,
      failed_login_attempts: 0
    };

    await db('users').insert(user);

    // Create default account
    const accountNumber = Math.random().toString().slice(2, 12);
    const defaultAccount = {
      id: uuidv4(),
      user_id: userId,
      account_number: accountNumber,
      account_type: accountType === 'personal' ? 'checking' : 'business',
      balance: 0,
      available_balance: 0,
      currency: 'NGN',
      status: 'active',
      minimum_balance: accountType === 'personal' ? 1000 : 50000
    };

    await db('accounts').insert(defaultAccount);

    logAudit('USER_REGISTERED', userId, 'user', { email, accountType });
    logSecurity('USER_REGISTRATION', userId, req.ip, { email });

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        userId,
        email,
        accountNumber
      }
    });
  } catch (error) {
    logger.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Registration failed'
    });
  }
});

// Login user with enhanced security
router.post('/login',
  authRateLimit,
  securityAnalysis,
  suspiciousActivityDetection,
  loginValidation,
  async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { email, password, twoFactorToken } = req.body;

    // Get user
    const user = await db('users').where({ email }).first();
    if (!user) {
      logSecurity('LOGIN_ATTEMPT_INVALID_EMAIL', undefined, req.ip, { email });
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check if account is locked
    if (user.locked_until && new Date(user.locked_until) > new Date()) {
      logSecurity('LOGIN_ATTEMPT_LOCKED_ACCOUNT', user.id, req.ip);
      return res.status(423).json({
        success: false,
        message: 'Account is temporarily locked'
      });
    }

    // Verify password
    const isValidPassword = await AuthMiddleware.verifyPassword(password, user.password_hash);
    if (!isValidPassword) {
      // Increment failed attempts
      const failedAttempts = user.failed_login_attempts + 1;
      const updateData: any = { failed_login_attempts: failedAttempts };
      
      // Lock account after 5 failed attempts
      if (failedAttempts >= 5) {
        updateData.locked_until = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes
      }

      await db('users').where({ id: user.id }).update(updateData);

      logSecurity('LOGIN_ATTEMPT_INVALID_PASSWORD', user.id, req.ip, { failedAttempts });

      // Send failed login notification
      notificationService.emit('security:login', {
        userId: user.id,
        success: false,
        device: req.headers['user-agent'] || 'Unknown Device',
        location: req.ip,
        failedAttempts,
        timestamp: new Date()
      });
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check 2FA if enabled
    if (user.two_factor_enabled) {
      if (!twoFactorToken) {
        return res.status(200).json({
          success: true,
          requiresTwoFactor: true,
          message: '2FA token required'
        });
      }

      const verified = speakeasy.totp.verify({
        secret: user.two_factor_secret,
        encoding: 'base32',
        token: twoFactorToken,
        window: 2
      });

      if (!verified) {
        logSecurity('2FA_VERIFICATION_FAILED', user.id, req.ip);
        return res.status(400).json({
          success: false,
          message: 'Invalid 2FA token'
        });
      }
    }

    // Reset failed attempts and update last login
    await db('users').where({ id: user.id }).update({
      failed_login_attempts: 0,
      locked_until: null,
      last_login: new Date()
    });

    // Generate tokens
    const tokens = AuthMiddleware.generateTokens(user);

    logAudit('USER_LOGIN', user.id, 'user');
    logSecurity('USER_LOGIN_SUCCESS', user.id, req.ip);

    // Send login notification
    notificationService.emit('security:login', {
      userId: user.id,
      success: true,
      device: req.headers['user-agent'] || 'Unknown Device',
      location: req.ip,
      timestamp: new Date()
    });

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: user.id,
          email: user.email,
          firstName: user.first_name,
          lastName: user.last_name,
          accountType: user.account_type,
          kycStatus: user.kyc_status,
          twoFactorEnabled: user.two_factor_enabled
        },
        ...tokens
      }
    });
  } catch (error) {
    logger.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Login failed'
    });
  }
});

// Refresh token
router.post('/refresh', AuthMiddleware.refreshToken);

// Logout
router.post('/logout', AuthMiddleware.verifyToken, AuthMiddleware.logout);

// Setup 2FA
router.post('/setup-2fa', AuthMiddleware.verifyToken, async (req: AuthRequest, res: Response) => {
  try {
    const user = req.user!;

    if (user.two_factor_enabled) {
      return res.status(400).json({
        success: false,
        message: '2FA is already enabled'
      });
    }

    const secret = speakeasy.generateSecret({
      name: `Provi Bank (${user.email})`,
      issuer: 'Provi Bank'
    });

    // Generate QR code
    const qrCodeUrl = await QRCode.toDataURL(secret.otpauth_url!);

    // Store secret temporarily (not enabled yet)
    await CacheService.set(`2fa_setup:${user.id}`, secret.base32, 600); // 10 minutes

    res.json({
      success: true,
      data: {
        secret: secret.base32,
        qrCode: qrCodeUrl
      }
    });
  } catch (error) {
    logger.error('2FA setup error:', error);
    res.status(500).json({
      success: false,
      message: '2FA setup failed'
    });
  }
});

// Verify and enable 2FA
router.post('/verify-2fa', AuthMiddleware.verifyToken, async (req: AuthRequest, res: Response) => {
  try {
    const { token } = req.body;
    const user = req.user!;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: '2FA token required'
      });
    }

    // Get temporary secret
    const secret = await CacheService.get<string>(`2fa_setup:${user.id}`);
    if (!secret) {
      return res.status(400).json({
        success: false,
        message: '2FA setup session expired'
      });
    }

    // Verify token
    const verified = speakeasy.totp.verify({
      secret,
      encoding: 'base32',
      token,
      window: 2
    });

    if (!verified) {
      return res.status(400).json({
        success: false,
        message: 'Invalid 2FA token'
      });
    }

    // Enable 2FA
    await db('users').where({ id: user.id }).update({
      two_factor_enabled: true,
      two_factor_secret: secret
    });

    // Clean up temporary secret
    await CacheService.del(`2fa_setup:${user.id}`);

    logAudit('2FA_ENABLED', user.id, 'user');
    logSecurity('2FA_ENABLED', user.id, req.ip);

    res.json({
      success: true,
      message: '2FA enabled successfully'
    });
  } catch (error) {
    logger.error('2FA verification error:', error);
    res.status(500).json({
      success: false,
      message: '2FA verification failed'
    });
  }
});

// Disable 2FA
router.post('/disable-2fa', AuthMiddleware.verifyToken, async (req: AuthRequest, res: Response) => {
  try {
    const { password, twoFactorToken } = req.body;
    const user = req.user!;

    if (!user.two_factor_enabled) {
      return res.status(400).json({
        success: false,
        message: '2FA is not enabled'
      });
    }

    // Verify password
    const isValidPassword = await AuthMiddleware.verifyPassword(password, user.password_hash);
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: 'Invalid password'
      });
    }

    // Verify 2FA token
    const verified = speakeasy.totp.verify({
      secret: user.two_factor_secret!,
      encoding: 'base32',
      token: twoFactorToken,
      window: 2
    });

    if (!verified) {
      return res.status(400).json({
        success: false,
        message: 'Invalid 2FA token'
      });
    }

    // Disable 2FA
    await db('users').where({ id: user.id }).update({
      two_factor_enabled: false,
      two_factor_secret: null
    });

    logAudit('2FA_DISABLED', user.id, 'user');
    logSecurity('2FA_DISABLED', user.id, req.ip);

    res.json({
      success: true,
      message: '2FA disabled successfully'
    });
  } catch (error) {
    logger.error('2FA disable error:', error);
    res.status(500).json({
      success: false,
      message: '2FA disable failed'
    });
  }
});

export default router;
