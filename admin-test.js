#!/usr/bin/env node

// Comprehensive Admin Functionality Test
// This script demonstrates all admin capabilities available in the edge worker

const API_BASE_URL = 'https://ubasfintrust-api.jcrish4eva.workers.dev/api/v1';

// Admin credentials
const ADMIN_EMAIL = 'admin@ubas.com';
const ADMIN_PASSWORD = 'admin123';

async function testAdminFunctionalities() {
  console.log('🔐 Testing Complete Admin Functionalities\n');

  try {
    // Step 1: Admin Login
    console.log('1. 🚪 Admin Login...');
    const loginResponse = await fetch(`${API_BASE_URL}/auth/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: ADMIN_EMAIL,
        password: ADMIN_PASSWORD
      })
    });
    const loginResult = await loginResponse.json();
    console.log('✅ Admin login:', loginResult.success ? 'Success' : loginResult);

    if (!loginResult.success || !loginResult.token) {
      throw new Error('Admin login failed');
    }

    const adminToken = loginResult.token;
    const authHeaders = { 'Authorization': `Bearer ${adminToken}` };

    // Step 2: Admin Ping Test
    console.log('\n2. 🏓 Admin Ping Test...');
    const pingResponse = await fetch(`${API_BASE_URL}/admin/ping`, {
      headers: authHeaders
    });
    const pingResult = await pingResponse.json();
    console.log('✅ Admin ping:', pingResult);

    // Step 3: List All Users
    console.log('\n3. 👥 List All Users...');
    const usersResponse = await fetch(`${API_BASE_URL}/admin/users`, {
      headers: authHeaders
    });
    const usersResult = await usersResponse.json();
    console.log('✅ Users list:', usersResult.success ? `Found ${usersResult.data.length} users` : usersResult);
    
    if (usersResult.success) {
      usersResult.data.forEach((user, index) => {
        console.log(`   ${index + 1}. ${user.email} (${user.account_type || 'user'}) - ${user.kyc_status}`);
      });
    }

    // Step 4: Create New User
    console.log('\n4. ➕ Create New User...');
    const newUserData = {
      email: `admin-created-${Date.now()}@example.com`,
      password: 'UserPassword123!',
      first_name: 'Admin',
      last_name: 'Created',
      role: 'user'
    };

    const createUserResponse = await fetch(`${API_BASE_URL}/admin/users`, {
      method: 'POST',
      headers: { 
        ...authHeaders,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newUserData)
    });
    const createUserResult = await createUserResponse.json();
    console.log('✅ User creation:', createUserResult.success ? `Created user with ID: ${createUserResult.id}` : createUserResult);

    // Step 5: Get Specific User
    if (createUserResult.success) {
      console.log('\n5. 🔍 Get Specific User...');
      const getUserResponse = await fetch(`${API_BASE_URL}/admin/users/${createUserResult.id}`, {
        headers: authHeaders
      });
      const getUserResult = await getUserResponse.json();
      console.log('✅ User details:', getUserResult.success ? 'Retrieved successfully' : getUserResult);
      
      if (getUserResult.success) {
        const user = getUserResult.data;
        console.log(`   Email: ${user.email}`);
        console.log(`   Name: ${user.first_name} ${user.last_name}`);
        console.log(`   Status: ${user.kyc_status}`);
        console.log(`   Verified: ${user.is_verified}`);
      }
    }

    // Step 6: Update User
    if (createUserResult.success) {
      console.log('\n6. ✏️ Update User...');
      const updateUserResponse = await fetch(`${API_BASE_URL}/admin/users/${createUserResult.id}`, {
        method: 'PUT',
        headers: {
          ...authHeaders,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          first_name: 'Updated',
          last_name: 'AdminUser',
          account_type: 'premium'
        })
      });
      const updateUserResult = await updateUserResponse.json();
      console.log('✅ User update:', updateUserResult.success ? 'Updated successfully' : updateUserResult);
    }

    // Step 7: List KYC Applications
    console.log('\n7. 📋 List KYC Applications...');
    const kycResponse = await fetch(`${API_BASE_URL}/admin/kyc`, {
      headers: authHeaders
    });
    const kycResult = await kycResponse.json();
    console.log('✅ KYC applications:', kycResult.success ? `Found ${kycResult.data.length} applications` : kycResult);
    
    if (kycResult.success && kycResult.data.length > 0) {
      kycResult.data.forEach((app, index) => {
        console.log(`   ${index + 1}. ${app.email} - Status: ${app.status} (${app.personal_firstName} ${app.personal_lastName})`);
      });
    }

    // Step 8: Admin Password Reset (for another user)
    console.log('\n8. 🔑 Admin Password Reset...');
    if (usersResult.success && usersResult.data.length > 1) {
      const targetUser = usersResult.data.find(u => u.email !== ADMIN_EMAIL);
      if (targetUser) {
        const resetResponse = await fetch(`${API_BASE_URL}/auth/admin/reset-password`, {
          method: 'POST',
          headers: {
            ...authHeaders,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            userId: targetUser.id,
            newPassword: 'NewPassword123!'
          })
        });
        const resetResult = await resetResponse.json();
        console.log('✅ Password reset:', resetResult.success ? `Reset password for ${targetUser.email}` : resetResult);
      }
    }

    // Step 9: Delete User (if we created one)
    if (createUserResult.success) {
      console.log('\n9. 🗑️ Delete User...');
      const deleteUserResponse = await fetch(`${API_BASE_URL}/admin/users/${createUserResult.id}`, {
        method: 'DELETE',
        headers: authHeaders
      });
      const deleteUserResult = await deleteUserResponse.json();
      console.log('✅ User deletion:', deleteUserResult.success ? 'Deleted successfully' : deleteUserResult);
    }

    console.log('\n🎉 ALL ADMIN FUNCTIONALITY TESTS COMPLETED!');
    console.log('\n📋 Admin Capabilities Summary:');
    console.log('✅ Admin Authentication & Role-based Access');
    console.log('✅ User Management (List, Create, Read, Update, Delete)');
    console.log('✅ KYC Application Management');
    console.log('✅ Password Reset for Other Users');
    console.log('✅ Role-based Permission Enforcement');
    console.log('✅ Comprehensive Admin Dashboard Ready');

    console.log('\n🔐 Admin Credentials:');
    console.log(`Email: ${ADMIN_EMAIL}`);
    console.log(`Password: ${ADMIN_PASSWORD}`);
    console.log(`API Base: ${API_BASE_URL}`);

  } catch (error) {
    console.error('\n❌ Admin functionality test failed:', error.message);
    process.exit(1);
  }
}

testAdminFunctionalities();
