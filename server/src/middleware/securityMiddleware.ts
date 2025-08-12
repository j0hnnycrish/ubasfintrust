import { Request, Response, NextFunction } from 'express';
import { securityService } from '../services/securityService';
import { notificationService } from '../services/notificationService';
import { logger } from '../utils/logger';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import { body, validationResult } from 'express-validator';

// Enhanced request interface
interface SecurityRequest extends Request {
  security?: {
    riskLevel: 'low' | 'medium' | 'high' | 'critical';
    fingerprint?: string;
    reasons: string[];
    allowed: boolean;
  };
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

// Security middleware for bot detection and threat analysis
export const securityAnalysis = async (
  req: SecurityRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.id;
    const analysis = await securityService.analyzeRequest(req, userId);

    // Add security info to request
    req.security = analysis;

    // Block high-risk requests
    if (!analysis.allowed) {
      logger.warn('Request blocked by security analysis', {
        ip: req.ip,
        userAgent: req.headers['user-agent'],
        path: req.path,
        reasons: analysis.reasons,
        riskLevel: analysis.riskLevel
      });

      // Send security notification for critical threats
      if (analysis.riskLevel === 'critical' && userId) {
        try {
          notificationService.emit('security:suspicious', {
            userId,
            description: `Critical security threat detected: ${analysis.reasons.join(', ')}`,
            ipAddress: req.ip,
            device: req.headers['user-agent'],
            location: 'Unknown',
            riskLevel: analysis.riskLevel
          });
        } catch (error) {
          logger.error('Failed to send security notification:', error);
        }
      }

      res.status(403).json({
        success: false,
        error: 'Request blocked for security reasons',
        code: 'SECURITY_BLOCK',
        riskLevel: analysis.riskLevel
      });
      return;
    }

    // Log high-risk but allowed requests
    if (analysis.riskLevel === 'high' || analysis.riskLevel === 'critical') {
      logger.warn('High-risk request allowed', {
        ip: req.ip,
        userAgent: req.headers['user-agent'],
        path: req.path,
        reasons: analysis.reasons,
        riskLevel: analysis.riskLevel
      });
    }

    next();
  } catch (error) {
    logger.error('Security analysis error:', error);
    // Continue on error to avoid blocking legitimate requests
    next();
  }
};

// Rate limiting configurations
export const createRateLimit = (options: {
  windowMs: number;
  max: number;
  message?: string;
  skipSuccessfulRequests?: boolean;
}) => {
  return rateLimit({
    windowMs: options.windowMs,
    max: options.max,
    message: {
      success: false,
      error: options.message || 'Too many requests, please try again later',
      code: 'RATE_LIMIT_EXCEEDED'
    },
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: options.skipSuccessfulRequests || false,
    handler: (req, res) => {
      logger.warn('Rate limit exceeded', {
        ip: req.ip,
        userAgent: req.headers['user-agent'],
        path: req.path
      });

      res.status(429).json({
        success: false,
        error: options.message || 'Too many requests, please try again later',
        code: 'RATE_LIMIT_EXCEEDED'
      });
    }
  });
};

// Specific rate limits for different endpoints
export const authRateLimit = createRateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts per window
  message: 'Too many authentication attempts, please try again in 15 minutes'
});

export const transactionRateLimit = createRateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // 10 transactions per minute
  message: 'Too many transaction requests, please wait a moment'
});

export const apiRateLimit = createRateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // 1000 requests per window
  message: 'API rate limit exceeded'
});

// Input validation and sanitization
export const validateInput = (validations: any[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    // Run all validations
    await Promise.all(validations.map(validation => validation.run(req)));

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      logger.warn('Input validation failed', {
        ip: req.ip,
        path: req.path,
        errors: errors.array()
      });

      return res.status(400).json({
        success: false,
        error: 'Invalid input data',
        code: 'VALIDATION_ERROR',
        details: errors.array()
      });
    }

    next();
  };
};

// Common validation rules
export const commonValidations = {
  email: body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Valid email is required'),
  
  password: body('password')
    .isLength({ min: 8 })
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage('Password must be at least 8 characters with uppercase, lowercase, number and special character'),
  
  amount: body('amount')
    .isFloat({ min: 0.01 })
    .withMessage('Amount must be a positive number'),
  
  accountNumber: body('accountNumber')
    .isLength({ min: 10, max: 10 })
    .isNumeric()
    .withMessage('Account number must be exactly 10 digits'),
  
  phone: body('phone')
    .isMobilePhone('any')
    .withMessage('Valid phone number is required'),
  
  pin: body('pin')
    .isLength({ min: 4, max: 6 })
    .isNumeric()
    .withMessage('PIN must be 4-6 digits'),
  
  otp: body('otp')
    .isLength({ min: 6, max: 6 })
    .isNumeric()
    .withMessage('OTP must be exactly 6 digits')
};

// Security headers middleware
export const securityHeaders = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:"],
      scriptSrc: ["'self'"],
      connectSrc: ["'self'", "https://api.ubasfintrust.com"],
      frameSrc: ["'none'"],
      objectSrc: ["'none'"],
      baseUri: ["'self'"],
      formAction: ["'self'"],
      upgradeInsecureRequests: [],
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  },
  noSniff: true,
  frameguard: { action: 'deny' },
  xssFilter: true,
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' }
});

// CORS configuration
export const corsOptions = {
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    const allowedOrigins = [
      'http://localhost:8080',
      'http://localhost:3000',
      'https://ubasfintrust.com',
      'https://app.ubasfintrust.com'
    ];

    // Allow requests with no origin (mobile apps, etc.)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      logger.warn('CORS blocked origin:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'X-Device-ID'],
  maxAge: 86400 // 24 hours
};

// Device fingerprinting middleware
export const deviceFingerprinting = (req: SecurityRequest, res: Response, next: NextFunction) => {
  const deviceId = req.headers['x-device-id'] as string;
  const userAgent = req.headers['user-agent'] as string;
  
  if (!deviceId && userAgent) {
    // Generate device ID based on user agent and other headers
    const crypto = require('crypto');
    const deviceData = {
      userAgent,
      acceptLanguage: req.headers['accept-language'],
      acceptEncoding: req.headers['accept-encoding']
    };
    
    const generatedDeviceId = crypto
      .createHash('sha256')
      .update(JSON.stringify(deviceData))
      .digest('hex')
      .substring(0, 16);
    
    req.headers['x-device-id'] = generatedDeviceId;
  }
  
  next();
};

// Suspicious activity detection
export const suspiciousActivityDetection = async (
  req: SecurityRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.id;
    const path = req.path;
    const method = req.method;
    
    // Check for suspicious patterns
    const suspiciousPatterns = [
      { pattern: /\/admin/, reason: 'Admin endpoint access attempt' },
      { pattern: /\.\.\//, reason: 'Path traversal attempt' },
      { pattern: /\.(php|asp|jsp)$/, reason: 'Suspicious file extension' },
      { pattern: /union.*select/i, reason: 'SQL injection attempt' },
      { pattern: /<script/i, reason: 'XSS attempt' }
    ];
    
    for (const { pattern, reason } of suspiciousPatterns) {
      if (pattern.test(path) || pattern.test(JSON.stringify(req.body))) {
        logger.warn('Suspicious activity detected', {
          ip: req.ip,
          userId,
          path,
          method,
          reason,
          userAgent: req.headers['user-agent']
        });
        
        // Log security event
        await securityService.logSecurityEvent({
          userId,
          ipAddress: req.ip || '127.0.0.1',
          userAgent: req.headers['user-agent'],
          eventType: 'suspicious_activity',
          riskLevel: 'high',
          eventData: { path, method, reason },
          blocked: false
        });
        
        // Send notification for critical patterns
        if ((/union.*select|<script/i).test(String(path)) || (/union.*select|<script/i).test(JSON.stringify(req.body))) {
          if (userId) {
            try {
              notificationService.emit('security:suspicious', {
                userId,
                description: `Suspicious activity detected: ${reason}`,
                ipAddress: req.ip,
                device: req.headers['user-agent'],
                location: 'Unknown'
              });
            } catch (error) {
              logger.error('Failed to send suspicious activity notification:', error);
            }
          }
        }
        
        break;
      }
    }
    
    next();
  } catch (error) {
    logger.error('Suspicious activity detection error:', error);
    next();
  }
};

// IP geolocation and blocking
export const geoBlocking = (blockedCountries: string[] = []) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // This would integrate with a geolocation service
      // For now, we'll skip the actual geolocation lookup
      // In production, you'd use services like MaxMind GeoIP2
      
      const clientIP = req.ip;
      
      // Example: Block requests from certain countries
      // const country = await getCountryFromIP(clientIP);
      // if (blockedCountries.includes(country)) {
      //   return res.status(403).json({
      //     success: false,
      //     error: 'Access denied from your location',
      //     code: 'GEO_BLOCKED'
      //   });
      // }
      
      next();
    } catch (error) {
      logger.error('Geo-blocking error:', error);
      next();
    }
  };
};

// Export all middleware
export {
  SecurityRequest,
  securityAnalysis as default
};
