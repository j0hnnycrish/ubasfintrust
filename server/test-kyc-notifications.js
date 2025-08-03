#!/usr/bin/env node

/**
 * UBAS Financial Trust - KYC & Notifications Test Script
 * Tests the complete KYC workflow and notification system
 */

require('dotenv').config();
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

const API_BASE = process.env.API_URL || 'http://localhost:5000/api/v1';

class KYCNotificationTester {
  constructor() {
    this.testUser = null;
    this.authToken = null;
    this.kycApplicationId = null;
  }

  async log(message, type = 'info') {
    const timestamp = new Date().toISOString();
    const prefix = type === 'error' ? '❌' : type === 'success' ? '✅' : 'ℹ️';
    console.log(`${prefix} [${timestamp}] ${message}`);
  }

  async createTestUser() {
    try {
      this.log('Creating test user...');
      
      const userData = {
        email: `test.kyc.${Date.now()}@ubasfintrust.com`,
        password: 'TestPassword123!',
        firstName: 'John',
        lastName: 'Doe',
        phone: '+1234567890',
        dateOfBirth: '1990-01-01',
        accountType: 'personal'
      };

      const response = await axios.post(`${API_BASE}/auth/register`, userData);
      
      if (response.data.success) {
        this.testUser = userData;
        this.log(`Test user created: ${userData.email}`, 'success');
        return true;
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      this.log(`Failed to create test user: ${error.message}`, 'error');
      return false;
    }
  }

  async loginTestUser() {
    try {
      this.log('Logging in test user...');
      
      const response = await axios.post(`${API_BASE}/auth/login`, {
        email: this.testUser.email,
        password: this.testUser.password
      });

      if (response.data.success && response.data.data.token) {
        this.authToken = response.data.data.token;
        this.log('Test user logged in successfully', 'success');
        return true;
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      this.log(`Failed to login test user: ${error.message}`, 'error');
      return false;
    }
  }

  async createTestDocuments() {
    try {
      this.log('Creating test documents...');
      
      const uploadsDir = path.join(__dirname, 'test-uploads');
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }

      // Create dummy PDF content
      const pdfContent = Buffer.from('%PDF-1.4\n1 0 obj\n<<\n/Type /Catalog\n/Pages 2 0 R\n>>\nendobj\n2 0 obj\n<<\n/Type /Pages\n/Kids [3 0 R]\n/Count 1\n>>\nendobj\n3 0 obj\n<<\n/Type /Page\n/Parent 2 0 R\n/MediaBox [0 0 612 792]\n>>\nendobj\nxref\n0 4\n0000000000 65535 f \n0000000009 00000 n \n0000000074 00000 n \n0000000120 00000 n \ntrailer\n<<\n/Size 4\n/Root 1 0 R\n>>\nstartxref\n179\n%%EOF');
      
      const documents = {
        'test-id.pdf': pdfContent,
        'test-address.pdf': pdfContent,
        'test-income.pdf': pdfContent,
        'test-statement.pdf': pdfContent,
        'test-selfie.jpg': Buffer.from('fake-image-data')
      };

      for (const [filename, content] of Object.entries(documents)) {
        const filepath = path.join(uploadsDir, filename);
        fs.writeFileSync(filepath, content);
      }

      this.log('Test documents created', 'success');
      return uploadsDir;
    } catch (error) {
      this.log(`Failed to create test documents: ${error.message}`, 'error');
      return null;
    }
  }

  async submitKYCApplication() {
    try {
      this.log('Submitting KYC application...');
      
      const uploadsDir = await this.createTestDocuments();
      if (!uploadsDir) return false;

      const formData = new FormData();
      
      // Add form fields
      formData.append('personal_firstName', 'John');
      formData.append('personal_lastName', 'Doe');
      formData.append('personal_dateOfBirth', '1990-01-01');
      formData.append('personal_nationality', 'US');
      formData.append('personal_gender', 'male');
      formData.append('personal_maritalStatus', 'single');
      
      formData.append('address_street', '123 Main St');
      formData.append('address_city', 'New York');
      formData.append('address_state', 'NY');
      formData.append('address_country', 'US');
      formData.append('address_postalCode', '10001');
      
      formData.append('employment_status', 'employed');
      formData.append('employment_monthlyIncome', '5000');
      formData.append('employment_employer', 'Tech Corp');
      
      formData.append('agreement_terms', 'true');
      formData.append('agreement_privacy', 'true');

      // Add document files
      const documents = {
        'document_primaryId': 'test-id.pdf',
        'document_proofOfAddress': 'test-address.pdf',
        'document_incomeProof': 'test-income.pdf',
        'document_bankStatement': 'test-statement.pdf',
        'document_selfie': 'test-selfie.jpg'
      };

      for (const [fieldName, filename] of Object.entries(documents)) {
        const filepath = path.join(uploadsDir, filename);
        if (fs.existsSync(filepath)) {
          formData.append(fieldName, fs.createReadStream(filepath));
        }
      }

      const response = await axios.post(`${API_BASE}/kyc/submit`, formData, {
        headers: {
          ...formData.getHeaders(),
          'Authorization': `Bearer ${this.authToken}`
        }
      });

      if (response.data.success) {
        this.kycApplicationId = response.data.data.kycId;
        this.log(`KYC application submitted: ${this.kycApplicationId}`, 'success');
        return true;
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      this.log(`Failed to submit KYC application: ${error.message}`, 'error');
      return false;
    }
  }

  async checkKYCStatus() {
    try {
      this.log('Checking KYC status...');
      
      const response = await axios.get(`${API_BASE}/kyc/status`, {
        headers: {
          'Authorization': `Bearer ${this.authToken}`
        }
      });

      if (response.data.success) {
        const status = response.data.data;
        this.log(`KYC Status: ${status.status}`, 'success');
        this.log(`Documents uploaded: ${status.documents.length}`);
        return true;
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      this.log(`Failed to check KYC status: ${error.message}`, 'error');
      return false;
    }
  }

  async testNotificationSystem() {
    try {
      this.log('Testing notification system...');
      
      // Import notification service
      const { notificationService } = require('./src/services/notificationService');

      // Test email notification
      await notificationService.sendNotification({
        userId: 'test-user-id',
        type: 'kyc_submitted',
        title: 'KYC Test Notification',
        message: 'This is a test notification from the KYC system.',
        priority: 'medium',
        channels: ['email'],
        metadata: { test: true }
      });

      this.log('Notification system test completed', 'success');
      return true;
    } catch (error) {
      this.log(`Notification system test failed: ${error.message}`, 'error');
      return false;
    }
  }

  async cleanup() {
    try {
      this.log('Cleaning up test data...');
      
      // Remove test uploads directory
      const uploadsDir = path.join(__dirname, 'test-uploads');
      if (fs.existsSync(uploadsDir)) {
        fs.rmSync(uploadsDir, { recursive: true, force: true });
      }

      this.log('Cleanup completed', 'success');
    } catch (error) {
      this.log(`Cleanup failed: ${error.message}`, 'error');
    }
  }

  async runFullTest() {
    console.log('🏦 UBAS FINANCIAL TRUST - KYC & NOTIFICATIONS TEST');
    console.log('==================================================');
    
    try {
      // Test sequence
      const steps = [
        () => this.createTestUser(),
        () => this.loginTestUser(),
        () => this.submitKYCApplication(),
        () => this.checkKYCStatus(),
        () => this.testNotificationSystem()
      ];

      for (let i = 0; i < steps.length; i++) {
        this.log(`Step ${i + 1}/${steps.length}: Running...`);
        const success = await steps[i]();
        if (!success) {
          this.log(`Test failed at step ${i + 1}`, 'error');
          return false;
        }
        await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second between steps
      }

      this.log('🎉 All tests passed successfully!', 'success');
      this.log('✅ KYC system is working correctly');
      this.log('✅ Notification system is working correctly');
      return true;

    } catch (error) {
      this.log(`Test suite failed: ${error.message}`, 'error');
      return false;
    } finally {
      await this.cleanup();
    }
  }
}

// Run the test if this script is executed directly
if (require.main === module) {
  const tester = new KYCNotificationTester();
  tester.runFullTest().then(success => {
    process.exit(success ? 0 : 1);
  });
}

module.exports = KYCNotificationTester;
