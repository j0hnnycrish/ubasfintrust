import Joi from 'joi';

// Define schema for required / optional environment variables
const schema = Joi.object({
  NODE_ENV: Joi.string().valid('development','production','test').default('development'),
  PORT: Joi.number().integer().min(1).max(65535).default(5000),
  API_VERSION: Joi.string().default('v1'),
  // Auth / Security
  JWT_SECRET: Joi.string().min(16).required(),
  JWT_REFRESH_SECRET: Joi.string().min(16).required(),
  SESSION_SECRET: Joi.string().min(16).required(),
  BCRYPT_ROUNDS: Joi.number().integer().min(4).max(15).default(12),
  // Admin seed
  ADMIN_EMAIL: Joi.string().email().optional(),
  ADMIN_PASSWORD: Joi.string().min(8).optional(),
  ADMIN_PHONE: Joi.string().optional(),
  // DB / Redis
  // Accept both 'postgres' and 'postgresql' schemes returned by providers (e.g., Render)
  DATABASE_URL: Joi.string().uri({ scheme: ['postgres', 'postgresql'] }).optional(),
  DB_HOST: Joi.string().optional(),
  DB_PORT: Joi.number().optional(),
  DB_NAME: Joi.string().optional(),
  DB_USER: Joi.string().optional(),
  DB_PASSWORD: Joi.string().optional(),
  REDIS_URL: Joi.string().optional(),
  REDIS_HOST: Joi.string().optional(),
  REDIS_PORT: Joi.number().optional(),
  REDIS_PASSWORD: Joi.string().allow('').optional(),
  // CORS / Socket
  ALLOWED_ORIGINS: Joi.string().optional(),
  SOCKET_IO_CORS_ORIGIN: Joi.string().optional(),
  // Diagnostics
  DIAGNOSTICS_TOKEN: Joi.string().optional(),
  // Email providers keys are optional
  RESEND_API_KEY: Joi.string().optional(),
  SENDGRID_API_KEY: Joi.string().optional(),
  MAILGUN_API_KEY: Joi.string().optional(),
  MAILGUN_DOMAIN: Joi.string().optional(),
  // Feature flags
  BANK_SIMULATION_MODE: Joi.boolean().truthy('true').falsy('false').default(false),
  ENABLE_REALISTIC_DELAYS: Joi.boolean().truthy('true').falsy('false').default(false),
}).unknown(true); // allow extra vars

export interface AppConfig {
  NODE_ENV: string;
  PORT: number;
  API_VERSION: string;
  JWT_SECRET: string;
  JWT_REFRESH_SECRET: string;
  SESSION_SECRET: string;
  BCRYPT_ROUNDS: number;
  ADMIN_EMAIL?: string;
  ADMIN_PASSWORD?: string;
  ADMIN_PHONE?: string;
  ALLOWED_ORIGINS?: string;
  SOCKET_IO_CORS_ORIGIN?: string;
  DIAGNOSTICS_TOKEN?: string;
  [k: string]: any;
}

const { value, error } = schema.validate(process.env, { abortEarly: false, convert: true });
if (error) {
  // Collate validation errors into a readable message
  const details = error.details.map(d => `${d.path.join('.')}: ${d.message}`).join('\n');
  // eslint-disable-next-line no-console
  console.error('\n[env] Configuration validation failed:\n' + details + '\n');
  throw new Error('Invalid environment configuration');
}

export const config = value as unknown as AppConfig;

export function requireEnv(key: keyof AppConfig): string {
  const v = config[key];
  if (!v) throw new Error(`Missing required environment variable: ${String(key)}`);
  return v as string;
}
// Environment configuration with proper typing
export const env = {
  // Database
  DB_HOST: process.env['DB_HOST'] || 'localhost',
  DB_PORT: parseInt(process.env['DB_PORT'] || '5432'),
  DB_NAME: process.env['DB_NAME'] || 'provi_banking',
  DB_USER: process.env['DB_USER'] || 'postgres',
  DB_PASSWORD: process.env['DB_PASSWORD'] || '',
  DATABASE_URL: process.env['DATABASE_URL'],

  // Redis
  REDIS_HOST: process.env['REDIS_HOST'] || 'localhost',
  REDIS_PORT: parseInt(process.env['REDIS_PORT'] || '6379'),
  REDIS_PASSWORD: process.env['REDIS_PASSWORD'],
  REDIS_DB: parseInt(process.env['REDIS_DB'] || '0'),

  // JWT
  JWT_SECRET: process.env['JWT_SECRET'] || 'your-secret-key',
  JWT_EXPIRES_IN: process.env['JWT_EXPIRES_IN'] || '15m',
  JWT_REFRESH_SECRET: process.env['JWT_REFRESH_SECRET'] || 'your-refresh-secret',
  JWT_REFRESH_EXPIRES_IN: process.env['JWT_REFRESH_EXPIRES_IN'] || '7d',

  // Encryption
  BCRYPT_ROUNDS: parseInt(process.env['BCRYPT_ROUNDS'] || '12'),

  // Email Configuration
  SMTP_HOST: process.env['SMTP_HOST'],
  SMTP_PORT: process.env['SMTP_PORT'] || '587',
  SMTP_USER: process.env['SMTP_USER'],
  SMTP_PASS: process.env['SMTP_PASS'],
  FROM_EMAIL: process.env['FROM_EMAIL'] || 'noreply@ubasfintrust.com',
  FROM_NAME: process.env['FROM_NAME'] || 'UBAS Financial Trust',

  // Email Service Providers
  SENDGRID_API_KEY: process.env['SENDGRID_API_KEY'],
  MAILGUN_API_KEY: process.env['MAILGUN_API_KEY'],
  MAILGUN_DOMAIN: process.env['MAILGUN_DOMAIN'],
  RESEND_API_KEY: process.env['RESEND_API_KEY'],
  AWS_ACCESS_KEY_ID: process.env['AWS_ACCESS_KEY_ID'],
  AWS_SECRET_ACCESS_KEY: process.env['AWS_SECRET_ACCESS_KEY'],
  AWS_REGION: process.env['AWS_REGION'] || 'us-east-1',

  // SMS Service Providers
  TWILIO_ACCOUNT_SID: process.env['TWILIO_ACCOUNT_SID'],
  TWILIO_AUTH_TOKEN: process.env['TWILIO_AUTH_TOKEN'],
  TWILIO_PHONE_NUMBER: process.env['TWILIO_PHONE_NUMBER'],
  VONAGE_API_KEY: process.env['VONAGE_API_KEY'],
  VONAGE_API_SECRET: process.env['VONAGE_API_SECRET'],
  VONAGE_FROM_NUMBER: process.env['VONAGE_FROM_NUMBER'],
  TEXTBELT_API_KEY: process.env['TEXTBELT_API_KEY'] || 'textbelt',
  SMSTO_API_KEY: process.env['SMSTO_API_KEY'],
  AFRICASTALKING_API_KEY: process.env['AFRICASTALKING_API_KEY'],
  AFRICASTALKING_USERNAME: process.env['AFRICASTALKING_USERNAME'],
  AFRICASTALKING_SENDER_ID: process.env['AFRICASTALKING_SENDER_ID'],
  TERMII_API_KEY: process.env['TERMII_API_KEY'],
  TERMII_SENDER_ID: process.env['TERMII_SENDER_ID'] || 'UBAS Bank',

  // General
  NODE_ENV: process.env['NODE_ENV'] || 'development',
  LOG_LEVEL: process.env['LOG_LEVEL'] || 'info',
  ALLOWED_ORIGINS: process.env['ALLOWED_ORIGINS']?.split(',') || ['http://localhost:8080'],
};
