import { createClient } from 'redis';
import { logger } from '../utils/logger';

function sanitizeRedisUrl(raw?: string): { url?: string; tls: boolean } {
  if (!raw) return { url: undefined, tls: false };
  // Extract the first redis/rediss URL from the string (handles values like `redis-cli --tls -u rediss://...`)
  const match = raw.match(/(rediss?:\/\/\S+)/i);
  const url = match ? match[1] : undefined;
  const tls = /--tls/i.test(raw) || /^rediss:\/\//i.test(url || '');
  return { url, tls };
}

const { url: sanitizedUrl, tls } = sanitizeRedisUrl(process.env['REDIS_URL']);

const clientOptions: Parameters<typeof createClient>[0] = sanitizedUrl
  ? {
      url: sanitizedUrl,
      socket: { tls },
    }
  : {
      socket: {
        host: process.env['REDIS_HOST'] || 'localhost',
        port: parseInt(process.env['REDIS_PORT'] || '6379'),
        tls,
      },
      password: process.env['REDIS_PASSWORD'] || undefined,
      database: parseInt(process.env['REDIS_DB'] || '0'),
    };

// Avoid explicit RedisClientType annotation to prevent TS module augmentation mismatches on some builders
const redisClient = createClient(clientOptions);

// Keep error noise low; Redis is optional. Warn instead of error.
redisClient.on('error', (err) => {
  const msg = (err && (err as any).message) ? (err as any).message : String(err);
  logger.warn(`Redis client error: ${msg}`);
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

export const isRedisConfigured = (): boolean => {
  return Boolean(sanitizedUrl || process.env['REDIS_HOST'] || process.env['REDIS_PORT']);
};

export const isRedisReady = (): boolean => {
  try {
    // isOpen is true when the client is connected and ready to send commands
    // @ts-ignore - property exists at runtime on redis v4 client
    return !!(redisClient as any).isOpen;
  } catch {
    return false;
  }
};

export const connectRedis = async (): Promise<void> => {
  if (!isRedisConfigured()) {
    logger.info('Redis not configured; skipping Redis connection');
    return;
  }
  try {
    await redisClient.connect();
  } catch (error) {
  logger.warn('Failed to connect to Redis (continuing without it)');
  // Do not throw; allow app to run degraded without Redis
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
    if (!isRedisConfigured() || !isRedisReady()) {
      return null;
    }
    try {
      const value = await redisClient.get(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      // Keep quiet when Redis is unavailable
      logger.warn(`Cache get error for key ${key}`);
      return null;
    }
  }

  static async set(key: string, value: any, ttl: number = 3600): Promise<boolean> {
    if (!isRedisConfigured() || !isRedisReady()) {
      return false;
    }
    try {
      await redisClient.setEx(key, ttl, JSON.stringify(value));
      return true;
    } catch (error) {
      logger.warn(`Cache set error for key ${key}`);
      return false;
    }
  }

  static async del(key: string): Promise<boolean> {
    if (!isRedisConfigured() || !isRedisReady()) {
      return false;
    }
    try {
      await redisClient.del(key);
      return true;
    } catch (error) {
      logger.warn(`Cache delete error for key ${key}`);
      return false;
    }
  }

  static async exists(key: string): Promise<boolean> {
    if (!isRedisConfigured() || !isRedisReady()) {
      return false;
    }
    try {
      const result = await redisClient.exists(key);
      return result === 1;
    } catch (error) {
      logger.warn(`Cache exists error for key ${key}`);
      return false;
    }
  }

  static async flushAll(): Promise<boolean> {
    if (!isRedisConfigured() || !isRedisReady()) {
      return false;
    }
    try {
      await redisClient.flushAll();
      return true;
    } catch (error) {
      logger.warn('Cache flush all error');
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
    if (!isRedisConfigured() || !isRedisReady()) {
      // Fallback: allow the request (return 1)
      return 1;
    }
    try {
      const current = await redisClient.incr(`rate_limit:${key}`);
      if (current === 1) {
        await redisClient.expire(`rate_limit:${key}`, window);
      }
      return current;
    } catch (error) {
      logger.warn(`Rate limit increment error for key ${key}`);
      return 0;
    }
  }

  // Lock mechanism for critical operations
  static async acquireLock(key: string, ttl: number = 30): Promise<boolean> {
    if (!isRedisConfigured() || !isRedisReady()) {
      // Without Redis, do not block operations
      return true;
    }
    try {
      const result = await redisClient.set(`lock:${key}`, '1', {
        NX: true,
        EX: ttl,
      });
      return result === 'OK';
    } catch (error) {
      logger.warn(`Lock acquire error for key ${key}`);
      return false;
    }
  }

  static async releaseLock(key: string): Promise<boolean> {
    return this.del(`lock:${key}`);
  }
}

// Template cache helpers that compose CacheService
export class TemplateCacheService {
  static async getTemplateList(locale?: string): Promise<any[] | null> {
    const key = `templates:list:${locale || 'all'}`;
    return CacheService.get<any[]>(key);
  }

  static async setTemplateList(templates: any[], locale?: string, ttl: number = 1800): Promise<boolean> {
    const key = `templates:list:${locale || 'all'}`;
    return CacheService.set(key, templates, ttl);
  }

  static async getRenderResult(templateHash: string, dataHash: string): Promise<any | null> {
    const key = `templates:render:${templateHash}:${dataHash}`;
    return CacheService.get<any>(key);
  }

  static async setRenderResult(templateHash: string, dataHash: string, result: any, ttl: number = 3600): Promise<boolean> {
    const key = `templates:render:${templateHash}:${dataHash}`;
    return CacheService.set(key, result, ttl);
  }

  static async invalidateTemplateCache(templateId?: string): Promise<boolean> {
    if (!isRedisConfigured() || !isRedisReady()) {
      return false;
    }
    try {
      // Clear template list cache for all locales
      const listKeys = await redisClient.keys('templates:list:*');
      if (listKeys.length > 0) await redisClient.del(listKeys);

      // Clear render cache (all or specific template)
      const renderKeys = templateId
        ? await redisClient.keys(`templates:render:*${templateId}*`)
        : await redisClient.keys('templates:render:*');
      if (renderKeys.length > 0) await redisClient.del(renderKeys);

      return true;
    } catch (error) {
      logger.warn('Template cache invalidation error');
      return false;
    }
  }
}

// NOTE: The methods below were previously inside CacheService by mistake.
// They remain for backward-compatibility but delegate to TemplateCacheService.
export class CacheTemplatesCompat {
  static async getTemplateList(locale?: string) { return TemplateCacheService.getTemplateList(locale); }
  static async setTemplateList(templates: any[], locale?: string, ttl: number = 1800) { return TemplateCacheService.setTemplateList(templates, locale, ttl); }
  static async getRenderResult(templateHash: string, dataHash: string) { return TemplateCacheService.getRenderResult(templateHash, dataHash); }
  static async setRenderResult(templateHash: string, dataHash: string, result: any, ttl: number = 3600) { return TemplateCacheService.setRenderResult(templateHash, dataHash, result, ttl); }
  static async invalidateTemplateCache(templateId?: string) { return TemplateCacheService.invalidateTemplateCache(templateId); }
}

