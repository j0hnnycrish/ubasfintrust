import { Router, Request, Response } from 'express';
import { healthCheck } from '../config/db';
import { redisClient } from '../config/redis';

const router = Router();

// Liveness probe (fast, no external dependencies)
router.get('/liveness', (req: Request, res: Response) => {
  res.json({
    success: true,
    status: 'alive',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: process.env.npm_package_version || '1.0.0'
  });
});

// Readiness probe (checks dependencies: DB + Redis)
router.get('/readiness', async (req: Request, res: Response) => {
  try {
    const dbHealth = await healthCheck();

    // Only enforce Redis if configured; otherwise mark as skipped
    const hasRedisCfg = Boolean(
      process.env['REDIS_URL'] || process.env['REDIS_HOST'] || process.env['REDIS_PORT']
    );

    let redisHealth: { status: string; timestamp: Date } = { status: 'skipped', timestamp: new Date() };
    if (hasRedisCfg) {
      redisHealth = { status: 'healthy', timestamp: new Date() };
      try {
        await redisClient.ping();
      } catch {
        redisHealth = { status: 'unhealthy', timestamp: new Date() };
      }
    }

    const depsHealthy = dbHealth.status === 'healthy' && (!hasRedisCfg || redisHealth.status === 'healthy');
    const overallStatus = depsHealthy ? 'ready' : 'degraded';
    const httpStatus = depsHealthy ? 200 : 503;

    res.status(httpStatus).json({
      success: true,
      status: overallStatus,
      timestamp: new Date().toISOString(),
      services: { database: dbHealth, redis: redisHealth },
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      version: process.env.npm_package_version || '1.0.0'
    });
  } catch (e) {
    res.status(503).json({ success: false, status: 'unready', timestamp: new Date().toISOString(), error: 'Readiness failed' });
  }
});

// Root health: return a fast 200 OK for platform health checks (no redirects)
// Optional query "type" can request liveness or readiness detail
router.get('/', async (req: Request, res: Response) => {
  try {
    const type = String(req.query.type || '').toLowerCase();
    if (type === 'liveness') {
      return res.json({ success: true, status: 'alive', timestamp: new Date().toISOString(), uptime: process.uptime() });
    }
    if (type === 'readiness') {
      const dbHealth = await healthCheck();
      const hasRedisCfg = Boolean(
        process.env['REDIS_URL'] || process.env['REDIS_HOST'] || process.env['REDIS_PORT']
      );
      let redisStatus: 'healthy' | 'unhealthy' | 'skipped' = 'skipped';
      if (hasRedisCfg) {
        try { await redisClient.ping(); redisStatus = 'healthy'; } catch { redisStatus = 'unhealthy'; }
      }
      const depsHealthy = dbHealth.status === 'healthy' && (!hasRedisCfg || redisStatus === 'healthy');
      return res.status(depsHealthy ? 200 : 503).json({
        success: true,
        status: depsHealthy ? 'ready' : 'degraded',
        timestamp: new Date().toISOString(),
        services: { database: dbHealth, redis: { status: redisStatus } }
      });
    }
    // Default minimal OK payload
    return res.json({ success: true, status: 'ok', timestamp: new Date().toISOString() });
  } catch {
    return res.status(200).json({ success: true, status: 'ok', timestamp: new Date().toISOString() });
  }
});

// Detailed health check
router.get('/detailed', async (req: Request, res: Response) => {
  try {
    const dbHealth = await healthCheck();
    
    let redisHealth = { status: 'healthy', timestamp: new Date(), latency: 0 };
    try {
      const start = Date.now();
      await redisClient.ping();
      redisHealth.latency = Date.now() - start;
    } catch (error) {
      redisHealth = { status: 'unhealthy', timestamp: new Date(), latency: -1 };
    }

    const overallStatus = dbHealth.status === 'healthy' && redisHealth.status === 'healthy' 
      ? 'healthy' : 'unhealthy';

    res.status(overallStatus === 'healthy' ? 200 : 503).json({
      success: true,
      status: overallStatus,
      timestamp: new Date().toISOString(),
      services: {
        database: dbHealth,
        redis: redisHealth
      },
      system: {
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        cpu: process.cpuUsage(),
        platform: process.platform,
        nodeVersion: process.version,
        pid: process.pid
      },
      environment: process.env.NODE_ENV,
      version: process.env.npm_package_version || '1.0.0'
    });
  } catch (error) {
    res.status(503).json({
      success: false,
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: 'Detailed health check failed'
    });
  }
});

export default router;
