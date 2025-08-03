#!/usr/bin/env node

/**
 * UBAS Financial Trust - Security Keys Generator
 * Generates secure JWT secrets and encryption keys for production deployment
 */

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

function generateSecureKey(length = 64) {
  return crypto.randomBytes(length).toString('base64');
}

function generateEncryptionKey() {
  return crypto.randomBytes(32).toString('hex');
}

function generateSecrets() {
  console.log('🔐 UBAS FINANCIAL TRUST - SECURITY KEYS GENERATOR');
  console.log('=================================================');
  console.log('');
  
  const secrets = {
    JWT_SECRET: generateSecureKey(64),
    JWT_REFRESH_SECRET: generateSecureKey(64),
    ENCRYPTION_KEY: generateEncryptionKey(),
    SESSION_SECRET: generateSecureKey(32)
  };

  console.log('✅ Generated secure keys:');
  console.log('');
  
  Object.entries(secrets).forEach(([key, value]) => {
    console.log(`${key}=${value}`);
  });

  console.log('');
  console.log('📋 Copy these to your .env file or deployment environment variables');
  console.log('');

  // Save to a file for easy copying
  const envContent = Object.entries(secrets)
    .map(([key, value]) => `${key}=${value}`)
    .join('\n');

  const secretsFile = path.join(__dirname, 'generated-secrets.txt');
  fs.writeFileSync(secretsFile, envContent);
  
  console.log(`💾 Secrets saved to: ${secretsFile}`);
  console.log('');
  console.log('⚠️  IMPORTANT SECURITY NOTES:');
  console.log('   • Keep these secrets secure and never commit them to version control');
  console.log('   • Use different secrets for development, staging, and production');
  console.log('   • Store production secrets in your deployment platform\'s environment variables');
  console.log('   • Delete the generated-secrets.txt file after copying the values');
  console.log('');

  return secrets;
}

function createEnvTemplate() {
  const envTemplate = `# UBAS Financial Trust - Environment Configuration
# Generated on ${new Date().toISOString()}

# ============================================
# SECURITY KEYS (REPLACE WITH GENERATED VALUES)
# ============================================
JWT_SECRET=REPLACE_WITH_GENERATED_JWT_SECRET
JWT_REFRESH_SECRET=REPLACE_WITH_GENERATED_JWT_REFRESH_SECRET
ENCRYPTION_KEY=REPLACE_WITH_GENERATED_ENCRYPTION_KEY
SESSION_SECRET=REPLACE_WITH_GENERATED_SESSION_SECRET

# JWT Configuration
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
BCRYPT_ROUNDS=12

# ============================================
# DATABASE CONFIGURATION
# ============================================
# Choose one of the following database options:

# Option 1: Supabase (Recommended)
DATABASE_URL=postgresql://postgres:[password]@[host]:5432/postgres

# Option 2: Railway PostgreSQL
# DATABASE_URL=postgresql://postgres:[password]@[host]:[port]/railway

# Option 3: Render PostgreSQL
# DATABASE_URL=postgresql://[user]:[password]@[host]:[port]/[database]

# Option 4: Local PostgreSQL (Development)
# DB_HOST=localhost
# DB_PORT=5432
# DB_NAME=ubas_banking
# DB_USER=postgres
# DB_PASSWORD=your_password

# ============================================
# EMAIL NOTIFICATIONS (Choose One)
# ============================================

# Option 1: SendGrid (Recommended - 100 emails/day free)
SENDGRID_API_KEY=SG.your_sendgrid_api_key_here
FROM_EMAIL=noreply@yourdomain.com

# Option 2: Gmail SMTP (Free alternative)
# SMTP_HOST=smtp.gmail.com
# SMTP_PORT=587
# SMTP_USER=your_email@gmail.com
# SMTP_PASS=your_16_character_app_password
# FROM_EMAIL=your_email@gmail.com

# Option 3: Mailgun
# MAILGUN_API_KEY=your_mailgun_api_key
# MAILGUN_DOMAIN=your_mailgun_domain

# ============================================
# SMS NOTIFICATIONS (Choose One)
# ============================================

# Option 1: Twilio (Recommended - $15 trial credit)
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=+1234567890

# Option 2: TextBelt (Free - 1 SMS per day)
# TEXTBELT_API_KEY=textbelt

# Option 3: Vonage
# VONAGE_API_KEY=your_vonage_api_key
# VONAGE_API_SECRET=your_vonage_api_secret
# VONAGE_FROM_NUMBER=UBAS Bank

# ============================================
# APPLICATION CONFIGURATION
# ============================================
NODE_ENV=production
PORT=5000
API_VERSION=v1

# CORS Configuration (Update with your domain)
ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com

# File Upload Configuration
UPLOAD_PATH=uploads/kyc
MAX_FILE_SIZE=5242880
ALLOWED_FILE_TYPES=jpg,jpeg,png,pdf

# ============================================
# OPTIONAL SERVICES
# ============================================

# Redis (Optional - for session storage and caching)
# REDIS_HOST=localhost
# REDIS_PORT=6379
# REDIS_PASSWORD=your_redis_password

# Logging
LOG_LEVEL=info

# Socket.IO Configuration
SOCKET_IO_CORS_ORIGIN=https://yourdomain.com

# ============================================
# EXTERNAL INTEGRATIONS (Optional)
# ============================================

# Google Services
# GOOGLE_CLIENT_ID=your_google_client_id
# GOOGLE_MAPS_API_KEY=your_google_maps_api_key

# Analytics
# GOOGLE_ANALYTICS_ID=your_ga_id

# Error Tracking
# SENTRY_DSN=your_sentry_dsn

# ============================================
# BANKING CONFIGURATION
# ============================================
MINIMUM_DEPOSIT=100
MINIMUM_WITHDRAWAL=20
MAXIMUM_DAILY_TRANSFER=50000
DEMO_MODE=false
`;

  const envFile = path.join(__dirname, '.env.template');
  fs.writeFileSync(envFile, envTemplate);
  
  console.log(`📝 Environment template created: ${envFile}`);
  console.log('   Copy this to .env and fill in your values');
}

function main() {
  const secrets = generateSecrets();
  createEnvTemplate();
  
  console.log('🎯 NEXT STEPS:');
  console.log('   1. Copy the generated secrets to your .env file');
  console.log('   2. Configure your database connection');
  console.log('   3. Set up email and SMS providers');
  console.log('   4. Run: npm run test:simple');
  console.log('   5. Deploy to your chosen platform');
  console.log('');
  console.log('🚀 Your UBAS Financial Trust banking app is ready for deployment!');
}

if (require.main === module) {
  main();
}

module.exports = { generateSecrets, generateSecureKey, generateEncryptionKey };
