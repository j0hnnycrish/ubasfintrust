// Test script for standalone notification system
const axios = require('axios');

const BASE_URL = 'http://localhost:3001';

async function testNotificationSystem() {
  console.log('🚀 Testing Standalone Notification System\n');

  try {
    // Test 1: Health check
    console.log('=== Test 1: Health Check ===');
    const healthResponse = await axios.get(`${BASE_URL}/health`);
    console.log('✅ Health check passed:', healthResponse.data);
    console.log();

    // Test 2: Provider status
    console.log('=== Test 2: Provider Status ===');
    const statusResponse = await axios.get(`${BASE_URL}/api/notifications/providers/status`);
    console.log('✅ Provider status:', statusResponse.data);
    console.log();

    // Test 3: Send transaction completed notification
    console.log('=== Test 3: Transaction Completed Notification ===');
    await axios.post(`${BASE_URL}/api/notifications/send`, {
      event: 'transaction:completed',
      userId: 'user-123',
      type: 'transfer',
      amount: 50000,
      currency: 'NGN',
      reference: 'TXN123456'
    });
    console.log('✅ Transaction completed notification sent');
    console.log();

    // Test 4: Send security login notification
    console.log('=== Test 4: Security Login Notification ===');
    await axios.post(`${BASE_URL}/api/notifications/send`, {
      event: 'security:login',
      userId: 'user-123',
      success: false,
      device: 'Chrome on Windows',
      location: 'Lagos, Nigeria',
      failedAttempts: 3
    });
    console.log('✅ Security login notification sent');
    console.log();

    // Test 5: Send custom notification
    console.log('=== Test 5: Custom Notification ===');
    await axios.post(`${BASE_URL}/api/notifications/send`, {
      userId: 'user-123',
      type: 'account',
      priority: 'high',
      title: 'Account Verification Required',
      message: 'Please verify your account to continue using our services.',
      channels: ['email', 'sms', 'in_app'],
      data: { verificationUrl: 'https://example.com/verify' }
    });
    console.log('✅ Custom notification sent');
    console.log();

    // Test 6: Get user notifications
    console.log('=== Test 6: Get User Notifications ===');
    const notificationsResponse = await axios.get(`${BASE_URL}/api/notifications/user-123`);
    console.log('✅ User notifications retrieved:', notificationsResponse.data.data.length, 'notifications');
    console.log('Recent notifications:');
    notificationsResponse.data.data.slice(0, 3).forEach((notif, index) => {
      console.log(`  ${index + 1}. ${notif.title} (${notif.type}, ${notif.priority})`);
    });
    console.log();

    // Test 7: Mark notification as read
    if (notificationsResponse.data.data.length > 0) {
      console.log('=== Test 7: Mark Notification as Read ===');
      const firstNotification = notificationsResponse.data.data[0];
      await axios.patch(`${BASE_URL}/api/notifications/${firstNotification.id}/read`);
      console.log('✅ Notification marked as read');
      console.log();
    }

    console.log('🎉 All tests passed! Notification system is working correctly.');

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
}

// Run tests with delay to allow server startup
setTimeout(testNotificationSystem, 2000);
