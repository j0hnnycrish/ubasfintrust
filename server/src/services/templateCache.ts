import crypto from 'crypto';
import { TemplateCacheService } from '../config/redis';

// In-memory fallback cache when Redis is unavailable
class MemoryCache {
  private cache = new Map<string, { value: any; expires: number }>();

  get<T>(key: string): T | null {
    const item = this.cache.get(key);
    if (!item) return null;
    if (Date.now() > item.expires) {
      this.cache.delete(key);
      return null;
    }
    return item.value;
  }

  set(key: string, value: any, ttlSeconds: number): boolean {
    const expires = Date.now() + (ttlSeconds * 1000);
    this.cache.set(key, { value, expires });
    return true;
  }

  del(key: string): boolean {
    return this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  keys(pattern: string): string[] {
    // Simple pattern matching for memory cache
    const regex = new RegExp(pattern.replace(/\*/g, '.*'));
    return Array.from(this.cache.keys()).filter(k => regex.test(k));
  }
}

const memoryCache = new MemoryCache();

export class TemplateCache {
  // Generate hash for cache keys
  static hash(input: string | object): string {
    const str = typeof input === 'string' ? input : JSON.stringify(input);
    return crypto.createHash('md5').update(str).digest('hex').substring(0, 12);
  }

  // Template list caching
  static async getTemplateList(locale?: string): Promise<any[] | null> {
    try {
      return await TemplateCacheService.getTemplateList(locale);
    } catch {
      // Fallback to memory cache
      const key = `templates:list:${locale || 'all'}`;
      return memoryCache.get<any[]>(key);
    }
  }

  static async setTemplateList(templates: any[], locale?: string, ttl = 1800): Promise<boolean> {
    try {
      const success = await TemplateCacheService.setTemplateList(templates, locale, ttl);
      if (success) return true;
    } catch {}
    // Fallback to memory cache
    const key = `templates:list:${locale || 'all'}`;
    return memoryCache.set(key, templates, ttl);
  }

  // Render result caching
  static async getRenderResult(template: string, data: object, options: object = {}): Promise<any | null> {
    const templateHash = this.hash(template);
    const dataHash = this.hash({ data, options });
    try {
      return await TemplateCacheService.getRenderResult(templateHash, dataHash);
    } catch {
      // Fallback to memory cache
      const key = `templates:render:${templateHash}:${dataHash}`;
      return memoryCache.get<any>(key);
    }
  }

  static async setRenderResult(template: string, data: object, options: object, result: any, ttl = 3600): Promise<boolean> {
    const templateHash = this.hash(template);
    const dataHash = this.hash({ data, options });
    try {
      const success = await TemplateCacheService.setRenderResult(templateHash, dataHash, result, ttl);
      if (success) return true;
    } catch {}
    // Fallback to memory cache
    const key = `templates:render:${templateHash}:${dataHash}`;
    return memoryCache.set(key, result, ttl);
  }

  // Cache invalidation
  static async invalidateTemplateCache(templateId?: string): Promise<boolean> {
    try {
      const success = await TemplateCacheService.invalidateTemplateCache(templateId);
      if (success) {
        // Also clear memory cache
        const listKeys = memoryCache.keys('templates:list:*');
        const renderKeys = memoryCache.keys('templates:render:*');
        [...listKeys, ...renderKeys].forEach(k => memoryCache.del(k));
        return true;
      }
    } catch {}
    // Fallback: clear memory cache only
    memoryCache.clear();
    return true;
  }
}
