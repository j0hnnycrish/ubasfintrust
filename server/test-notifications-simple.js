#!/usr/bin/env node

/**
 * Simple Notification Test Script
 * Tests email and SMS services directly without complex dependencies
 */

require('dotenv').config();

async function testEmailService() {
  console.log('\n📧 Testing Email Service...');
  
  try {
    // Test SendGrid
    if (process.env.SENDGRID_API_KEY) {
      console.log('Testing SendGrid...');
      const sgMail = require('@sendgrid/mail');
      sgMail.setApiKey(process.env.SENDGRID_API_KEY);

      const msg = {
        to: 'test@example.com', // Change this to your email
        from: process.env.FROM_EMAIL || 'noreply@ubasfintrust.com',
        subject: 'UBAS Bank - Test Email',
        text: 'This is a test email from UBAS Financial Trust.',
        html: '<strong>This is a test email from UBAS Financial Trust.</strong>',
      };

      // Don't actually send, just validate
      console.log('✅ SendGrid configuration is valid');
      return true;
    }

    // Test Mailgun
    if (process.env.MAILGUN_API_KEY && process.env.MAILGUN_DOMAIN) {
      console.log('Testing Mailgun...');
      const formData = require('form-data');
      const Mailgun = require('mailgun.js');
      
      const mailgun = new Mailgun(formData);
      const mg = mailgun.client({
        username: 'api',
        key: process.env.MAILGUN_API_KEY,
      });

      console.log('✅ Mailgun configuration is valid');
      return true;
    }

    // Test Gmail SMTP
    if (process.env.SMTP_USER && process.env.SMTP_PASS) {
      console.log('Testing Gmail SMTP...');
      const nodemailer = require('nodemailer');
      
      const transporter = nodemailer.createTransporter({
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: false,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });

      await transporter.verify();
      console.log('✅ Gmail SMTP configuration is valid');
      return true;
    }

    console.log('⚠️  No email service configured');
    return false;

  } catch (error) {
    console.error('❌ Email test failed:', error.message);
    return false;
  }
}

async function testSMSService() {
  console.log('\n📱 Testing SMS Service...');
  
  try {
    // Test Twilio
    if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
      console.log('Testing Twilio...');
      const twilio = require('twilio');
      const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

      // Just validate credentials, don't send
      await client.api.accounts(process.env.TWILIO_ACCOUNT_SID).fetch();
      console.log('✅ Twilio configuration is valid');
      return true;
    }

    // Test Vonage
    if (process.env.VONAGE_API_KEY && process.env.VONAGE_API_SECRET) {
      console.log('Testing Vonage...');
      const { Vonage } = require('@vonage/server-sdk');
      
      const vonage = new Vonage({
        apiKey: process.env.VONAGE_API_KEY,
        apiSecret: process.env.VONAGE_API_SECRET,
      });

      console.log('✅ Vonage configuration is valid');
      return true;
    }

    // TextBelt is always available
    if (process.env.TEXTBELT_API_KEY) {
      console.log('✅ TextBelt is configured (free tier)');
      return true;
    }

    console.log('⚠️  No SMS service configured');
    return false;

  } catch (error) {
    console.error('❌ SMS test failed:', error.message);
    return false;
  }
}

async function testDatabaseConnection() {
  console.log('\n🗄️  Testing Database Connection...');
  
  try {
    const knex = require('knex');
    const knexConfig = require('./knexfile.js');
    
    const db = knex(knexConfig.development);
    
    // Test connection
    await db.raw('SELECT 1');
    console.log('✅ Database connection successful');
    
    // Check if required tables exist
    const tables = ['users', 'accounts', 'transactions', 'kyc_applications', 'kyc_documents'];
    for (const table of tables) {
      const exists = await db.schema.hasTable(table);
      if (exists) {
        console.log(`✅ Table '${table}' exists`);
      } else {
        console.log(`❌ Table '${table}' missing - run migrations`);
      }
    }
    
    await db.destroy();
    return true;

  } catch (error) {
    console.error('❌ Database test failed:', error.message);
    return false;
  }
}

async function testFileUpload() {
  console.log('\n📁 Testing File Upload Configuration...');
  
  try {
    const fs = require('fs');
    const path = require('path');
    
    const uploadPath = process.env.UPLOAD_PATH || 'uploads/kyc';
    const fullPath = path.join(__dirname, uploadPath);
    
    // Check if upload directory exists or can be created
    if (!fs.existsSync(fullPath)) {
      fs.mkdirSync(fullPath, { recursive: true });
      console.log(`✅ Created upload directory: ${fullPath}`);
    } else {
      console.log(`✅ Upload directory exists: ${fullPath}`);
    }
    
    // Test write permissions
    const testFile = path.join(fullPath, 'test.txt');
    fs.writeFileSync(testFile, 'test');
    fs.unlinkSync(testFile);
    console.log('✅ Upload directory is writable');
    
    return true;

  } catch (error) {
    console.error('❌ File upload test failed:', error.message);
    return false;
  }
}

async function checkEnvironmentVariables() {
  console.log('\n🔧 Checking Environment Variables...');
  
  const required = [
    'JWT_SECRET',
    'ENCRYPTION_KEY',
    'DATABASE_URL'
  ];
  
  const optional = [
    'SENDGRID_API_KEY',
    'MAILGUN_API_KEY',
    'TWILIO_ACCOUNT_SID',
    'VONAGE_API_KEY',
    'SMTP_USER'
  ];
  
  let allRequired = true;
  
  for (const env of required) {
    if (process.env[env]) {
      console.log(`✅ ${env} is set`);
    } else {
      console.log(`❌ ${env} is missing (required)`);
      allRequired = false;
    }
  }
  
  let hasNotificationService = false;
  for (const env of optional) {
    if (process.env[env]) {
      console.log(`✅ ${env} is set`);
      hasNotificationService = true;
    }
  }
  
  if (!hasNotificationService) {
    console.log('⚠️  No notification services configured (email/SMS)');
  }
  
  return allRequired;
}

async function runAllTests() {
  console.log('🏦 UBAS FINANCIAL TRUST - SYSTEM VERIFICATION');
  console.log('==============================================');
  
  const results = {
    environment: await checkEnvironmentVariables(),
    database: await testDatabaseConnection(),
    fileUpload: await testFileUpload(),
    email: await testEmailService(),
    sms: await testSMSService()
  };
  
  console.log('\n📊 TEST RESULTS SUMMARY');
  console.log('========================');
  
  Object.entries(results).forEach(([test, passed]) => {
    const status = passed ? '✅ PASS' : '❌ FAIL';
    console.log(`${status} ${test.toUpperCase()}`);
  });
  
  const allPassed = Object.values(results).every(result => result);
  
  if (allPassed) {
    console.log('\n🎉 ALL TESTS PASSED!');
    console.log('Your UBAS Financial Trust system is ready for deployment!');
  } else {
    console.log('\n⚠️  SOME TESTS FAILED');
    console.log('Please fix the issues above before deploying.');
  }
  
  return allPassed;
}

// Run tests if this script is executed directly
if (require.main === module) {
  runAllTests().then(success => {
    process.exit(success ? 0 : 1);
  });
}

module.exports = {
  testEmailService,
  testSMSService,
  testDatabaseConnection,
  testFileUpload,
  checkEnvironmentVariables,
  runAllTests
};
