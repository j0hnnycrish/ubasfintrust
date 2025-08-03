#!/usr/bin/env node

/**
 * UBAS Financial Trust - Notification Services Setup
 * This script helps you configure and test email/SMS notification services
 */

const readline = require('readline');
const fs = require('fs');
const path = require('path');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

async function setupEmailService() {
  console.log('\n🔧 EMAIL SERVICE SETUP');
  console.log('Choose an email service provider:');
  console.log('1. SendGrid (Recommended - 100 emails/day free)');
  console.log('2. Mailgun (5000 emails/month free)');
  console.log('3. Resend (3000 emails/month free)');
  console.log('4. Gmail SMTP (Use your Gmail account)');
  console.log('5. Skip email setup');

  const choice = await question('\nEnter your choice (1-5): ');

  switch (choice) {
    case '1':
      console.log('\n📧 SENDGRID SETUP');
      console.log('1. Go to https://sendgrid.com/');
      console.log('2. Sign up for a free account');
      console.log('3. Go to Settings > API Keys');
      console.log('4. Create a new API key with "Full Access"');
      const sendgridKey = await question('Enter your SendGrid API key: ');
      return { SENDGRID_API_KEY: sendgridKey };

    case '2':
      console.log('\n📧 MAILGUN SETUP');
      console.log('1. Go to https://www.mailgun.com/');
      console.log('2. Sign up for a free account');
      console.log('3. Go to Sending > Domains');
      console.log('4. Use the sandbox domain or add your own');
      const mailgunKey = await question('Enter your Mailgun API key: ');
      const mailgunDomain = await question('Enter your Mailgun domain: ');
      return { 
        MAILGUN_API_KEY: mailgunKey,
        MAILGUN_DOMAIN: mailgunDomain
      };

    case '3':
      console.log('\n📧 RESEND SETUP');
      console.log('1. Go to https://resend.com/');
      console.log('2. Sign up for a free account');
      console.log('3. Go to API Keys');
      console.log('4. Create a new API key');
      const resendKey = await question('Enter your Resend API key: ');
      return { RESEND_API_KEY: resendKey };

    case '4':
      console.log('\n📧 GMAIL SMTP SETUP');
      console.log('1. Enable 2-factor authentication on your Gmail account');
      console.log('2. Go to Google Account settings > Security > App passwords');
      console.log('3. Generate an app password for "Mail"');
      const gmailUser = await question('Enter your Gmail address: ');
      const gmailPass = await question('Enter your Gmail app password: ');
      return {
        SMTP_HOST: 'smtp.gmail.com',
        SMTP_PORT: '587',
        SMTP_USER: gmailUser,
        SMTP_PASS: gmailPass,
        FROM_EMAIL: gmailUser
      };

    case '5':
      console.log('⏭️  Skipping email setup');
      return {};

    default:
      console.log('❌ Invalid choice');
      return await setupEmailService();
  }
}

async function setupSMSService() {
  console.log('\n🔧 SMS SERVICE SETUP');
  console.log('Choose an SMS service provider:');
  console.log('1. Twilio (Recommended - $15 trial credit)');
  console.log('2. Vonage (€2 trial credit)');
  console.log('3. TextBelt (Free - 1 SMS/day)');
  console.log('4. Skip SMS setup');

  const choice = await question('\nEnter your choice (1-4): ');

  switch (choice) {
    case '1':
      console.log('\n📱 TWILIO SETUP');
      console.log('1. Go to https://www.twilio.com/');
      console.log('2. Sign up for a free account');
      console.log('3. Go to Console Dashboard');
      console.log('4. Get your Account SID and Auth Token');
      console.log('5. Get a phone number from Phone Numbers > Manage > Buy a number');
      const twilioSid = await question('Enter your Twilio Account SID: ');
      const twilioToken = await question('Enter your Twilio Auth Token: ');
      const twilioPhone = await question('Enter your Twilio phone number (with +): ');
      return {
        TWILIO_ACCOUNT_SID: twilioSid,
        TWILIO_AUTH_TOKEN: twilioToken,
        TWILIO_PHONE_NUMBER: twilioPhone
      };

    case '2':
      console.log('\n📱 VONAGE SETUP');
      console.log('1. Go to https://www.vonage.com/');
      console.log('2. Sign up for a free account');
      console.log('3. Go to API Settings');
      console.log('4. Get your API Key and Secret');
      const vonageKey = await question('Enter your Vonage API Key: ');
      const vonageSecret = await question('Enter your Vonage API Secret: ');
      const vonageFrom = await question('Enter sender name/number: ');
      return {
        VONAGE_API_KEY: vonageKey,
        VONAGE_API_SECRET: vonageSecret,
        VONAGE_FROM_NUMBER: vonageFrom
      };

    case '3':
      console.log('\n📱 TEXTBELT SETUP (FREE)');
      console.log('TextBelt provides 1 free SMS per day per IP address');
      console.log('No API key required for free tier');
      return { TEXTBELT_API_KEY: 'textbelt' };

    case '4':
      console.log('⏭️  Skipping SMS setup');
      return {};

    default:
      console.log('❌ Invalid choice');
      return await setupSMSService();
  }
}

async function updateEnvFile(config) {
  const envPath = path.join(__dirname, '.env');
  const envExamplePath = path.join(__dirname, '.env.example');
  
  let envContent = '';
  
  if (fs.existsSync(envPath)) {
    envContent = fs.readFileSync(envPath, 'utf8');
  } else if (fs.existsSync(envExamplePath)) {
    envContent = fs.readFileSync(envExamplePath, 'utf8');
  }

  // Update or add configuration values
  Object.entries(config).forEach(([key, value]) => {
    const regex = new RegExp(`^${key}=.*$`, 'm');
    if (regex.test(envContent)) {
      envContent = envContent.replace(regex, `${key}=${value}`);
    } else {
      envContent += `\n${key}=${value}`;
    }
  });

  fs.writeFileSync(envPath, envContent);
  console.log(`✅ Configuration saved to ${envPath}`);
}

async function testNotifications() {
  console.log('\n🧪 TESTING NOTIFICATIONS');
  const testEmail = await question('Enter an email address to test: ');
  const testPhone = await question('Enter a phone number to test (with country code, e.g., +1234567890): ');

  console.log('\n🚀 Starting notification test...');
  
  try {
    // Import and test the notification service
    require('dotenv').config();

    // Set up module alias for TypeScript paths
    const moduleAlias = require('module-alias');
    moduleAlias.addAlias('@', path.join(__dirname, 'src'));

    const { notificationService } = require('./src/services/notificationService');

    // Test email
    if (testEmail) {
      console.log('📧 Testing email notification...');
      await notificationService.sendNotification({
        userId: 'test-user',
        type: 'system',
        title: 'UBAS Bank - Test Email',
        message: 'This is a test email from your UBAS Financial Trust banking system. Email notifications are working correctly!',
        priority: 'medium',
        channels: ['email'],
        metadata: { test: true, email: testEmail }
      });
      console.log('✅ Email test completed');
    }

    // Test SMS
    if (testPhone) {
      console.log('📱 Testing SMS notification...');
      await notificationService.sendNotification({
        userId: 'test-user',
        type: 'system',
        title: 'UBAS Bank Test',
        message: 'Test SMS from UBAS Financial Trust. SMS notifications are working!',
        priority: 'medium',
        channels: ['sms'],
        metadata: { test: true, phone: testPhone }
      });
      console.log('✅ SMS test completed');
    }

    console.log('\n🎉 Notification testing completed!');
    console.log('Check your email and phone for test messages.');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.log('Please check your configuration and try again.');
  }
}

async function main() {
  console.log('🏦 UBAS FINANCIAL TRUST - NOTIFICATION SETUP');
  console.log('==============================================');
  console.log('This script will help you configure email and SMS notifications.');
  console.log('');

  try {
    const emailConfig = await setupEmailService();
    const smsConfig = await setupSMSService();
    
    const allConfig = { ...emailConfig, ...smsConfig };
    
    if (Object.keys(allConfig).length > 0) {
      await updateEnvFile(allConfig);
      
      const testNow = await question('\nWould you like to test the notifications now? (y/n): ');
      if (testNow.toLowerCase() === 'y') {
        await testNotifications();
      }
    }

    console.log('\n✅ Setup completed!');
    console.log('Your notification services are now configured.');
    console.log('Restart your server to apply the changes.');

  } catch (error) {
    console.error('❌ Setup failed:', error.message);
  } finally {
    rl.close();
  }
}

if (require.main === module) {
  main();
}

module.exports = { setupEmailService, setupSMSService, updateEnvFile, testNotifications };
