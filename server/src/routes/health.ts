import { Router, Request, Response } from 'express';
import { healthCheck } from '../config/db';
import { redisClient } from '../config/redis';

const router = Router();

// Basic health check
router.get('/', async (req: Request, res: Response) => {
  try {
    const dbHealth = await healthCheck();
    
    let redisHealth = { status: 'healthy', timestamp: new Date() };
    try {
      await redisClient.ping();
    } catch (error) {
      redisHealth = { status: 'unhealthy', timestamp: new Date() };
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
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      version: process.env.npm_package_version || '1.0.0'
    });
  } catch (error) {
    res.status(503).json({
      success: false,
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: 'Health check failed'
    });
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
