import winston from 'winston';
import path from 'path';

const logDir = 'logs';

// Define log format
const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.json(),
  winston.format.prettyPrint()
);

// Define different log levels for different environments
const logLevel = process.env.LOG_LEVEL || 'info';

// Create logger instance
export const logger = winston.createLogger({
  level: logLevel,
  format: logFormat,
  defaultMeta: { service: 'provi-banking-api' },
  transports: [
    // Write all logs with level 'error' and below to error.log
    new winston.transports.File({
      filename: path.join(logDir, 'error.log'),
      level: 'error',
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
    
    // Write all logs with level 'info' and below to combined.log
    new winston.transports.File({
      filename: path.join(logDir, 'combined.log'),
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),

    // Write all logs to console in development
    ...(process.env.NODE_ENV !== 'production' ? [
      new winston.transports.Console({
        format: winston.format.combine(
          winston.format.colorize(),
          winston.format.simple()
        )
      })
    ] : []),
  ],
});

// Create audit logger for compliance
export const auditLogger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.json()
  ),
  defaultMeta: { service: 'provi-banking-audit' },
  transports: [
    new winston.transports.File({
      filename: path.join(logDir, 'audit.log'),
      maxsize: 10485760, // 10MB
      maxFiles: 10,
    }),
  ],
});

// Security logger for security events
export const securityLogger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.json()
  ),
  defaultMeta: { service: 'provi-banking-security' },
  transports: [
    new winston.transports.File({
      filename: path.join(logDir, 'security.log'),
      maxsize: 10485760, // 10MB
      maxFiles: 10,
    }),
  ],
});

// Transaction logger for financial transactions
export const transactionLogger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.json()
  ),
  defaultMeta: { service: 'provi-banking-transactions' },
  transports: [
    new winston.transports.File({
      filename: path.join(logDir, 'transactions.log'),
      maxsize: 20971520, // 20MB
      maxFiles: 20,
    }),
  ],
});

// Helper functions for structured logging
export const logInfo = (message: string, meta?: any) => {
  logger.info(message, meta);
};

export const logError = (message: string, error?: Error, meta?: any) => {
  logger.error(message, { error: error?.stack || error, ...meta });
};

export const logWarn = (message: string, meta?: any) => {
  logger.warn(message, meta);
};

export const logDebug = (message: string, meta?: any) => {
  logger.debug(message, meta);
};

// Audit logging functions
export const logAudit = (action: string, userId: string, resource: string, details?: any) => {
  auditLogger.info('Audit Event', {
    action,
    userId,
    resource,
    details,
    timestamp: new Date().toISOString(),
  });
};

// Security logging functions
export const logSecurity = (event: string, userId?: string, ip?: string, details?: any) => {
  securityLogger.info('Security Event', {
    event,
    userId,
    ip,
    details,
    timestamp: new Date().toISOString(),
  });
};

// Transaction logging functions
export const logTransaction = (
  transactionId: string,
  type: string,
  amount: number,
  fromAccount?: string,
  toAccount?: string,
  status?: string,
  details?: any
) => {
  transactionLogger.info('Transaction Event', {
    transactionId,
    type,
    amount,
    fromAccount,
    toAccount,
    status,
    details,
    timestamp: new Date().toISOString(),
  });
};

// Create logs directory if it doesn't exist
import fs from 'fs';
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}
