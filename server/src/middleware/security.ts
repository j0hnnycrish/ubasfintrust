import { Request, Response, NextFunction } from 'express';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { logger, logSecurity } from '../utils/logger';

// Security headers middleware
export const securityHeaders = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'"],
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"],
    },
  },
  crossOriginEmbedderPolicy: false,
});

// Rate limiting configurations
export const generalRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
  // Don't rate limit platform health checks
  skip: (req) => req.path.startsWith('/health'),
  handler: (req, res) => {
    logSecurity('RATE_LIMIT_EXCEEDED', undefined, req.ip, {
      endpoint: req.path,
      method: req.method
    });
    res.status(429).json({
      success: false,
      message: 'Too many requests from this IP, please try again later.'
    });
  }
});

export const authRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 auth requests per windowMs
  message: {
    success: false,
    message: 'Too many authentication attempts, please try again later.'
  },
  skipSuccessfulRequests: true,
  handler: (req, res) => {
    logSecurity('AUTH_RATE_LIMIT_EXCEEDED', undefined, req.ip, {
      endpoint: req.path,
      method: req.method
    });
    res.status(429).json({
      success: false,
      message: 'Too many authentication attempts, please try again later.'
    });
  }
});

export const transferRateLimit = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // limit each IP to 10 transfer requests per minute
  message: {
    success: false,
    message: 'Too many transfer requests, please try again later.'
  },
  handler: (req, res) => {
    logSecurity('TRANSFER_RATE_LIMIT_EXCEEDED', undefined, req.ip, {
      endpoint: req.path,
      method: req.method
    });
    res.status(429).json({
      success: false,
      message: 'Too many transfer requests, please try again later.'
    });
  }
});

// Request sanitization
export const sanitizeInput = (req: Request, res: Response, next: NextFunction) => {
  // Remove any potential XSS attempts
  const sanitize = (obj: any): any => {
    if (typeof obj === 'string') {
      return obj.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
    }
    if (typeof obj === 'object' && obj !== null) {
      for (const key in obj) {
        obj[key] = sanitize(obj[key]);
      }
    }
    return obj;
  };

  req.body = sanitize(req.body);
  req.query = sanitize(req.query);
  req.params = sanitize(req.params);
  
  next();
};

// IP whitelist middleware (for admin endpoints)
export const ipWhitelist = (allowedIPs: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const clientIP = req.ip || req.connection.remoteAddress;
    
    if (!allowedIPs.includes(clientIP!)) {
      logSecurity('UNAUTHORIZED_IP_ACCESS', undefined, clientIP, {
        endpoint: req.path,
        method: req.method
      });
      return res.status(403).json({
        success: false,
        message: 'Access denied from this IP address'
      });
    }
    
    next();
  };
};

// Request logging middleware
export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    const logData = {
      method: req.method,
      url: req.url,
      status: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      contentLength: res.get('Content-Length')
    };
    
    if (res.statusCode >= 400) {
      logger.warn('HTTP Request', logData);
    } else {
      logger.info('HTTP Request', logData);
    }
  });
  
  next();
};

// CORS configuration
export const corsOptions = {
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    const defaultOrigins = ['http://localhost:5173','http://localhost:3000','http://localhost:8080'];
    const raw = process.env.ALLOWED_ORIGINS?.split(',').map(s => s.trim()).filter(Boolean) || defaultOrigins;

    // Support simple wildcard entries like https://*.netlify.app or https://*.example.com
    const isAllowed = (orig?: string): boolean => {
      if (!orig) return true; // allow non-browser/SSR
      for (const entry of raw) {
        if (entry.includes('*')) {
          // escape regex special chars except '*', then replace '*' with a safe wildcard for one or more non-slash chars
          const regex = new RegExp('^' + entry
            .replace(/[.+?^${}()|[\]\\]/g, '\\$&')
            .replace(/\*/g, '[^.]+') + '$');
          if (regex.test(orig)) return true;
        } else if (entry === orig) {
          return true;
        }
      }
      return false;
    };

    if (isAllowed(origin)) {
      callback(null, true);
    } else {
      logSecurity('CORS_VIOLATION', undefined, undefined, { origin });
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
};

// Security audit middleware
export const securityAudit = (req: Request, res: Response, next: NextFunction) => {
  // Check for suspicious patterns
  const suspiciousPatterns = [
    /(\<|\%3C)script(\>|\%3E)/i,
    /javascript:/i,
    /vbscript:/i,
    /onload=/i,
    /onerror=/i,
    /eval\(/i,
    /expression\(/i
  ];
  
  const checkForSuspiciousContent = (obj: any): boolean => {
    if (typeof obj === 'string') {
      return suspiciousPatterns.some(pattern => pattern.test(obj));
    }
    if (typeof obj === 'object' && obj !== null) {
      return Object.values(obj).some(value => checkForSuspiciousContent(value));
    }
    return false;
  };
  
  if (checkForSuspiciousContent(req.body) || 
      checkForSuspiciousContent(req.query) || 
      checkForSuspiciousContent(req.params)) {
    logSecurity('SUSPICIOUS_REQUEST_DETECTED', undefined, req.ip, {
      endpoint: req.path,
      method: req.method,
      body: req.body,
      query: req.query,
      params: req.params
    });
    
    return res.status(400).json({
      success: false,
      message: 'Suspicious content detected'
    });
  }
  
  next();
};
