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
import { testConnection, closeConnection } from '@/config/db';
import { connectRedis, disconnectRedis } from '@/config/redis';
import { logger, logInfo, logError } from '@/utils/logger';
import {
  securityHeaders,
  generalRateLimit,
  sanitizeInput,
  requestLogger,
  corsOptions,
  securityAudit
} from '@/middleware/security';
import {
  botBlockingMiddleware,
  noIndexMiddleware,
  advancedBotDetection
} from '@/middleware/botBlocking';

// Import routes
import authRoutes from '@/routes/auth';
import userRoutes from '@/routes/users';
import accountRoutes from '@/routes/accounts';
import transactionRoutes from '@/routes/transactions';
import cardRoutes from '@/routes/cards';
import loanRoutes from '@/routes/loans';
import adminRoutes from '@/routes/admin';
import healthRoutes from '@/routes/health';
import paymentRoutes from '@/routes/payments';

const app = express();
const server = createServer(app);
const io = new SocketIOServer(server, {
  cors: {
    origin: process.env.SOCKET_IO_CORS_ORIGIN || "http://localhost:8080",
    methods: ["GET", "POST"]
  }
});

const PORT = process.env.PORT || 5000;
const API_VERSION = process.env.API_VERSION || 'v1';

// Trust proxy for accurate IP addresses
app.set('trust proxy', 1);

// Security middleware
app.use(securityHeaders);
app.use(cors(corsOptions));
app.use(compression());

// Bot blocking and no-index middleware (DISABLED FOR DEMO)
// app.use(noIndexMiddleware);
// app.use(botBlockingMiddleware);
// app.use(advancedBotDetection);

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
app.use(`/api/${API_VERSION}/admin`, adminRoutes);

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
    } catch (error) {
      logError('Error during graceful shutdown:', error);
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
process.on('uncaughtException', (error) => {
  logError('Uncaught Exception:', error);
  gracefulShutdown('uncaughtException');
});

process.on('unhandledRejection', (reason, promise) => {
  logError('Unhandled Rejection at:', reason, { promise });
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

    // Start HTTP server
    server.listen(PORT, () => {
      logInfo(`Server running on port ${PORT}`, {
        environment: process.env.NODE_ENV,
        apiVersion: API_VERSION,
        port: PORT
      });
    });
  } catch (error) {
    logError('Failed to start server:', error);
    process.exit(1);
  }
};

// Start the server only if this file is run directly
if (require.main === module) {
  startServer();
}

export default app;
