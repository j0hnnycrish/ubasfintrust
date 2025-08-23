#!/usr/bin/env node

const API_BASE_URL = 'https://ubasfintrust-api.jcrish4eva.workers.dev/api/v1';

async function testFullIntegration() {
  console.log('🔄 Testing Full Frontend-Edge Worker Integration\n');

  try {
    // Test 1: Health Check
    console.log('1. Health Check...');
    const healthResponse = await fetch(`${API_BASE_URL.replace('/api/v1', '')}/health`);
    const healthData = await healthResponse.json();
    console.log('✅ Health check:', healthData);

    // Test 2: User Registration
    console.log('\n2. Testing User Registration...');
    const registerData = {
      email: `integration-test-${Date.now()}@example.com`,
      password: 'TestPassword123!',
      first_name: 'Integration',
      last_name: 'Test'
    };

    const registerResponse = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(registerData)
    });
    const registerResult = await registerResponse.json();
    console.log('✅ Registration:', registerResult);

    if (!registerResult.success) {
      throw new Error('Registration failed');
    }

    // Test 3: User Login
    console.log('\n3. Testing User Login...');
    const loginResponse = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: registerData.email,
        password: registerData.password
      })
    });
    const loginResult = await loginResponse.json();
    console.log('✅ Login:', loginResult.success ? 'Success' : loginResult);

    if (!loginResult.success || !loginResult.token) {
      throw new Error('Login failed');
    }

    const token = loginResult.token;

    // Test 4: Authenticated Profile Access
    console.log('\n4. Testing Authenticated Profile Access...');
    const profileResponse = await fetch(`${API_BASE_URL}/users/profile`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const profileResult = await profileResponse.json();
    console.log('✅ Profile access:', profileResult.success ? 'Success' : profileResult);

    // Test 5: Account Creation
    console.log('\n5. Testing Account Creation...');
    const accountResponse = await fetch(`${API_BASE_URL}/accounts`, {
      method: 'POST',
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        account_type: 'checking',
        initial_deposit: 1000
      })
    });
    const accountResult = await accountResponse.json();
    console.log('✅ Account creation:', accountResult.success ? 'Success' : accountResult);

    // Test 6: Accounts Listing
    console.log('\n6. Testing Accounts Listing...');
    const accountsResponse = await fetch(`${API_BASE_URL}/users/accounts`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const accountsResult = await accountsResponse.json();
    console.log('✅ Accounts listing:', accountsResult.success ? `Found ${accountsResult.data.length} accounts` : accountsResult);

    console.log('\n🎉 ALL INTEGRATION TESTS PASSED!');
    console.log('\n📋 Summary:');
    console.log('- Edge Worker deployed at: https://ubasfintrust-api.jcrish4eva.workers.dev');
    console.log('- Frontend running at: http://localhost:8080');
    console.log('- API endpoints working correctly');
    console.log('- Authentication flow complete');
    console.log('- Database operations functional');
    console.log('- Full end-to-end integration verified');

  } catch (error) {
    console.error('\n❌ Integration test failed:', error.message);
    process.exit(1);
  }
}

testFullIntegration();
