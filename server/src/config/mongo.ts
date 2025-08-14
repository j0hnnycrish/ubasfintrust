import { MongoClient, Db } from 'mongodb';
import { logger } from '../utils/logger';

let mongoClient: MongoClient | null = null;
let mongoDb: Db | null = null;

export const getMongoDb = async (): Promise<Db | null> => {
  const uri = process.env.MONGODB_URI;
  const dbName = process.env.MONGO_DB_NAME;
  if (!uri || !dbName) {
    return null; // Feature not enabled
  }
  if (mongoDb) return mongoDb;
  try {
    mongoClient = new MongoClient(uri, {
      maxPoolSize: 10,
    });
    await mongoClient.connect();
    mongoDb = mongoClient.db(dbName);
    logger.info('[mongo] Connected to MongoDB');
    return mongoDb;
  } catch (err) {
    logger.error('[mongo] Connection failed', err);
    return null;
  }
};

export const closeMongo = async (): Promise<void> => {
  try {
    if (mongoClient) {
      await mongoClient.close();
      logger.info('[mongo] Connection closed');
    }
  } catch (err) {
    logger.error('[mongo] Error closing connection', err);
  } finally {
    mongoClient = null;
    mongoDb = null;
  }
};

export const mongoHealth = async (): Promise<'healthy' | 'unhealthy' | 'disabled'> => {
  if (!process.env.MONGODB_URI || !process.env.MONGO_DB_NAME) return 'disabled';
  try {
    const db = await getMongoDb();
    if (!db) return 'unhealthy';
    await db.command({ ping: 1 });
    return 'healthy';
  } catch {
    return 'unhealthy';
  }
};
