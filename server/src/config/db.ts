import knex from 'knex';
import config from './database';
import { logger } from '@/utils/logger';

const environment = process.env.NODE_ENV || 'development';
const dbConfig = config[environment];

export const db = knex(dbConfig);

// Test database connection
export const testConnection = async (): Promise<boolean> => {
  try {
    await db.raw('SELECT 1');
    logger.info('Database connection established successfully');
    return true;
  } catch (error) {
    logger.error('Failed to connect to database:', error);
    return false;
  }
};

// Graceful shutdown
export const closeConnection = async (): Promise<void> => {
  try {
    await db.destroy();
    logger.info('Database connection closed');
  } catch (error) {
    logger.error('Error closing database connection:', error);
  }
};

// Health check
export const healthCheck = async (): Promise<{ status: string; timestamp: Date }> => {
  try {
    await db.raw('SELECT 1');
    return {
      status: 'healthy',
      timestamp: new Date()
    };
  } catch (error) {
    return {
      status: 'unhealthy',
      timestamp: new Date()
    };
  }
};
