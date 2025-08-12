import express from 'express';
import cors from 'cors';
import compression from 'compression';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';

// Load environment variables
dotenv.config();

// Import configurations and middleware
import { testConnection, closeConnection } from './config/db';
import { config as appConfig } from './config/env';
import { connectRedis, disconnectRedis } from './config/redis';
import { logger, logInfo, logError } from './utils/logger';
import {
  securityHeaders,
  generalRateLimit,
  sanitizeInput,
  requestLogger,
  corsOptions,
  securityAudit
} from './middleware/security';
import {
  botBlockingMiddleware,
  noIndexMiddleware,
  advancedBotDetection
} from './middleware/botBlocking';

// Import routes
import authRoutes from './routes/auth';
import userRoutes from './routes/users';
import accountRoutes from './routes/accounts';
import transactionRoutes from './routes/transactions';
import cardRoutes from './routes/cards';
import loanRoutes from './routes/loans';
import adminRoutes from './routes/admin';
import healthRoutes from './routes/health';
import paymentRoutes from './routes/payments';
import notificationRoutes from './routes/notifications';
import kycRoutes from './routes/kyc';
import bankingRoutes from './routes/banking';
import supportRoutes from './routes/support';
import templateRoutes from './routes/templates';
import userOnboardingRoutes from './routes/userOnboarding';
import grantRoutes from './routes/grants';
import { notificationService } from './services/notificationService';
import { redisClient } from './config/redis';
import { db } from './config/db';

const app = express();
const server = createServer(app);
const io = new SocketIOServer(server, {
  cors: {
    origin: process.env.SOCKET_IO_CORS_ORIGIN || "http://localhost:8080",
    methods: ["GET", "POST"]
  }
});

const PORT = appConfig.PORT || 5000;
const API_VERSION = appConfig.API_VERSION || 'v1';

// Trust proxy for accurate IP addresses
app.set('trust proxy', 1);

// Security middleware
app.use(securityHeaders);
app.use(cors(corsOptions));
// Basic config sanity header for diagnostics (non-sensitive)
app.use((req, _res, next) => { (req as any).appVersion = API_VERSION; next(); });
app.use(compression());
app.use(`/api/${API_VERSION}/support`, supportRoutes);

// Bot blocking and no-index middleware
app.use(noIndexMiddleware);
app.use(botBlockingMiddleware);
app.use(advancedBotDetection);

// Request parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Security and logging middleware
app.use(sanitizeInput);
app.use(securityAudit);
app.use(requestLogger);

// HTTP request logging
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('combined', {
    stream: {
      write: (message: string) => {
        logger.info(message.trim());
      }
    }
  }));
}

// Rate limiting
app.use(generalRateLimit);

// Health check endpoint (before other routes)
app.use('/health', healthRoutes);

// API routes
app.use(`/api/${API_VERSION}/auth`, authRoutes);
app.use(`/api/${API_VERSION}/users`, userRoutes);
app.use(`/api/${API_VERSION}/accounts`, accountRoutes);
app.use(`/api/${API_VERSION}/transactions`, transactionRoutes);
app.use(`/api/${API_VERSION}/cards`, cardRoutes);
app.use(`/api/${API_VERSION}/loans`, loanRoutes);
app.use(`/api/${API_VERSION}/payments`, paymentRoutes);
app.use(`/api/${API_VERSION}/notifications`, notificationRoutes);
app.use(`/api/${API_VERSION}/kyc`, kycRoutes);
app.use(`/api/${API_VERSION}/banking`, bankingRoutes);
app.use(`/api/${API_VERSION}/admin`, adminRoutes);
app.use(`/api/${API_VERSION}/templates`, templateRoutes);
app.use(`/api/${API_VERSION}/users/onboarding`, userOnboardingRoutes);
app.use(`/api/${API_VERSION}/grants`, grantRoutes);

// Diagnostics (lightweight status) - protected by optional header token if DIAGNOSTICS_TOKEN set
app.get(`/api/${API_VERSION}/_diagnostics`, async (req, res) => {
  try {
    if (process.env.DIAGNOSTICS_TOKEN) {
      if (req.headers['x-diagnostics-token'] !== process.env.DIAGNOSTICS_TOKEN) {
        return res.status(403).json({ success: false, message: 'Forbidden' });
      }
    }
    const uptimeSeconds = Math.round(process.uptime());
    const mem = process.memoryUsage();
    // DB ping
    let dbOk = false; let dbLatency: number|undefined;
    try { const t0 = Date.now(); await db.raw('select 1'); dbLatency = Date.now()-t0; dbOk = true; } catch {}
    // Redis ping
    let redisOk = false; let redisLatency: number|undefined;
    try { const t1 = Date.now(); await redisClient.ping(); redisLatency = Date.now()-t1; redisOk = true; } catch {}
    // Provider health (email + sms capability flags)
    let providerHealth: any = null;
    try {
      const { EmailService } = await import('./services/emailService');
      const emailService = new EmailService();
      const email = await emailService.getProviderStatus();
      const sms = [
        { name: 'textbelt', healthy: !!process.env.TEXTBELT_API_KEY },
        { name: 'twilio', healthy: !!process.env.TWILIO_ACCOUNT_SID && !!process.env.TWILIO_AUTH_TOKEN },
        { name: 'vonage', healthy: !!process.env.VONAGE_API_KEY && !!process.env.VONAGE_API_SECRET },
        { name: 'messagebird', healthy: !!process.env.MESSAGEBIRD_API_KEY },
        { name: 'plivo', healthy: !!process.env.PLIVO_AUTH_ID && !!process.env.PLIVO_AUTH_TOKEN }
      ];
      providerHealth = { email, sms };
    } catch (e) {
      providerHealth = { error: (e as any)?.message };
    }
    res.json({ success: true, data: {
      uptimeSeconds,
      timestamp: new Date().toISOString(),
      memory: { rss: mem.rss, heapUsed: mem.heapUsed, heapTotal: mem.heapTotal },
      db: { ok: dbOk, latencyMs: dbLatency },
      redis: { ok: redisOk, latencyMs: redisLatency },
      env: { node: process.version },
      providerHealth,
      overall: (dbOk && redisOk) ? 'healthy' : (dbOk || redisOk) ? 'degraded' : 'down'
    }});
  } catch (e:any) {
    res.status(500).json({ success:false, message:'Diagnostics error', error: e.message });
  }
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'UBAS Financial Trust Banking API Server',
    version: API_VERSION,
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint not found'
  });
});

// Global error handler
app.use((error: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  logError('Unhandled error:', error, {
    url: req.url,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent')
  });

  // Don't leak error details in production
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  res.status(error.status || 500).json({
    success: false,
    message: isDevelopment ? error.message : 'Internal server error',
    ...(isDevelopment && { stack: error.stack })
  });
});

// Socket.IO connection handling
io.on('connection', (socket) => {
  logInfo('User connected to WebSocket', { socketId: socket.id });

  socket.on('join_user_room', (userId: string) => {
    socket.join(`user_${userId}`);
    logInfo('User joined room', { userId, socketId: socket.id });
  });

  socket.on('disconnect', () => {
    logInfo('User disconnected from WebSocket', { socketId: socket.id });
  });
});

// Make io available globally for other modules
export { io };

// Graceful shutdown
const gracefulShutdown = async (signal: string) => {
  logInfo(`Received ${signal}. Starting graceful shutdown...`);
  
  server.close(async () => {
    logInfo('HTTP server closed');
    
    try {
      await closeConnection();
      await disconnectRedis();
      logInfo('All connections closed. Exiting process.');
      process.exit(0);
    } catch (error: any) {
      logError('Error during graceful shutdown:', error as any);
      process.exit(1);
    }
  });

  // Force close after 30 seconds
  setTimeout(() => {
    logError('Could not close connections in time, forcefully shutting down');
    process.exit(1);
  }, 30000);
};

// Handle shutdown signals
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Handle uncaught exceptions
process.on('uncaughtException', (error: any) => {
  logError('Uncaught Exception:', error as any);
  gracefulShutdown('uncaughtException');
});

process.on('unhandledRejection', (reason: any, promise) => {
  logError('Unhandled Rejection at:', reason as any, { promise });
  gracefulShutdown('unhandledRejection');
});

// Start server
const startServer = async () => {
  try {
    // Test database connection
    const dbConnected = await testConnection();
    if (!dbConnected) {
      throw new Error('Failed to connect to database');
    }

    // Connect to Redis
    await connectRedis();

    // Seed default corporate admin user if configured and missing
    try {
      const adminEmail = process.env.ADMIN_EMAIL;
      const adminPassword = process.env.ADMIN_PASSWORD;
      if (adminEmail && adminPassword) {
        const existing = await (await import('./config/db')).db('users').where({ email: adminEmail }).first();
        if (!existing) {
          const { v4: uuidv4 } = require('uuid');
          const { AuthMiddleware } = require('./middleware/auth');
          const password_hash = await AuthMiddleware.hashPassword(adminPassword);
          const userId = uuidv4();
          await (await import('./config/db')).db('users').insert({
            id: userId,
            email: adminEmail,
            password_hash,
            first_name: process.env.ADMIN_FIRST_NAME || 'Platform',
            last_name: process.env.ADMIN_LAST_NAME || 'Administrator',
            phone: process.env.ADMIN_PHONE || '+10000000000',
            date_of_birth: '1990-01-01',
            account_type: 'corporate',
            kyc_status: 'approved',
            is_active: true,
            is_verified: true,
            two_factor_enabled: false,
            failed_login_attempts: 0
          });
          // Create a primary corporate operating account
          await (await import('./config/db')).db('accounts').insert({
            id: uuidv4(),
            user_id: userId,
            account_number: Math.random().toString().slice(2,12),
            account_type: 'checking',
            balance: 0,
            available_balance: 0,
            currency: 'USD',
            status: 'active',
            minimum_balance: 0
          });
          logger.info('Seeded default corporate admin user', { adminEmail });
        } else {
          logger.info('Admin user already exists', { adminEmail });
        }
      } else {
        logger.warn('ADMIN_EMAIL / ADMIN_PASSWORD not set – skipping admin seed');
      }
    } catch (seedErr) {
      logger.error('Admin seed error', seedErr as any);
    }

    // Start HTTP server
    server.listen(PORT, () => {
      logInfo(`Server running on port ${PORT}`, {
        environment: process.env.NODE_ENV,
        apiVersion: API_VERSION,
        port: PORT
      });
    });
  } catch (error: any) {
    logError('Failed to start server:', error as any);
    process.exit(1);
  }
};

// Start the server only if this file is run directly
if (require.main === module) {
  startServer();
}

export default app;
