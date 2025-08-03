import { createClient } from 'redis';
import { logger } from '../utils/logger';

const redisClient = createClient({
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  password: process.env.REDIS_PASSWORD || undefined,
  database: parseInt(process.env.REDIS_DB || '0'),
});

redisClient.on('error', (err) => {
  logger.error('Redis Client Error:', err);
});

redisClient.on('connect', () => {
  logger.info('Connected to Redis');
});

redisClient.on('ready', () => {
  logger.info('Redis client ready');
});

redisClient.on('end', () => {
  logger.info('Redis connection ended');
});

export const connectRedis = async (): Promise<void> => {
  try {
    await redisClient.connect();
  } catch (error) {
    logger.error('Failed to connect to Redis:', error);
    throw error;
  }
};

export const disconnectRedis = async (): Promise<void> => {
  try {
    await redisClient.disconnect();
  } catch (error) {
    logger.error('Failed to disconnect from Redis:', error);
  }
};

export { redisClient };

// Cache utility functions
export class CacheService {
  static async get<T>(key: string): Promise<T | null> {
    try {
      const value = await redisClient.get(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      logger.error(`Cache get error for key ${key}:`, error);
      return null;
    }
  }

  static async set(key: string, value: any, ttl: number = 3600): Promise<boolean> {
    try {
      await redisClient.setEx(key, ttl, JSON.stringify(value));
      return true;
    } catch (error) {
      logger.error(`Cache set error for key ${key}:`, error);
      return false;
    }
  }

  static async del(key: string): Promise<boolean> {
    try {
      await redisClient.del(key);
      return true;
    } catch (error) {
      logger.error(`Cache delete error for key ${key}:`, error);
      return false;
    }
  }

  static async exists(key: string): Promise<boolean> {
    try {
      const result = await redisClient.exists(key);
      return result === 1;
    } catch (error) {
      logger.error(`Cache exists error for key ${key}:`, error);
      return false;
    }
  }

  static async flushAll(): Promise<boolean> {
    try {
      await redisClient.flushAll();
      return true;
    } catch (error) {
      logger.error('Cache flush all error:', error);
      return false;
    }
  }

  // Session management
  static async setSession(sessionId: string, data: any, ttl: number = 86400): Promise<boolean> {
    return this.set(`session:${sessionId}`, data, ttl);
  }

  static async getSession<T>(sessionId: string): Promise<T | null> {
    return this.get<T>(`session:${sessionId}`);
  }

  static async deleteSession(sessionId: string): Promise<boolean> {
    return this.del(`session:${sessionId}`);
  }

  // Rate limiting
  static async incrementRateLimit(key: string, window: number): Promise<number> {
    try {
      const current = await redisClient.incr(`rate_limit:${key}`);
      if (current === 1) {
        await redisClient.expire(`rate_limit:${key}`, window);
      }
      return current;
    } catch (error) {
      logger.error(`Rate limit increment error for key ${key}:`, error);
      return 0;
    }
  }

  // Lock mechanism for critical operations
  static async acquireLock(key: string, ttl: number = 30): Promise<boolean> {
    try {
      const result = await redisClient.set(`lock:${key}`, '1', {
        NX: true,
        EX: ttl,
      });
      return result === 'OK';
    } catch (error) {
      logger.error(`Lock acquire error for key ${key}:`, error);
      return false;
    }
  }

  static async releaseLock(key: string): Promise<boolean> {
    return this.del(`lock:${key}`);
  }
}
