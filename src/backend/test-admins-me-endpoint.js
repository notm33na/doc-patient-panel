import axios from 'axios';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const API_BASE_URL = 'http://localhost:5000/api';

// Test credentials
const superAdminCredentials = {
  email: "superadmin@tabeeb.com",
  password: "SuperAdmin123!"
};

async function testAdminsMeEndpoint() {
  console.log('🧪 Testing /api/admins/me endpoint\n');

  try {
    // Test 1: Login as Super Admin
    console.log('📝 Test 1: Logging in as Super Admin...');
    const superAdminLogin = await axios.post(`${API_BASE_URL}/admins/login`, superAdminCredentials);
    const superAdminToken = superAdminLogin.data.token;
    const superAdminUser = superAdminLogin.data;
    
    console.log('✅ Super Admin login successful!');
    console.log('   Role:', superAdminUser.role);
    console.log('   Name:', `${superAdminUser.firstName} ${superAdminUser.lastName}`);
    console.log('   Token:', superAdminToken ? 'Present' : 'Missing');
    console.log('');

    // Test 2: Test /api/admins/me endpoint
    console.log('📝 Test 2: Testing /api/admins/me endpoint...');
    try {
      const meResponse = await axios.get(`${API_BASE_URL}/admins/me`, {
        headers: {
          'Authorization': `Bearer ${superAdminToken}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('✅ /api/admins/me endpoint working!');
      console.log('   Response status:', meResponse.status);
      console.log('   Admin data:', {
        id: meResponse.data._id,
        firstName: meResponse.data.firstName,
        lastName: meResponse.data.lastName,
        email: meResponse.data.email,
        role: meResponse.data.role
      });
      
    } catch (error) {
      console.log('❌ /api/admins/me endpoint failed!');
      console.log('   Status:', error.response?.status);
      console.log('   Error:', error.response?.data || error.message);
      
      if (error.response?.status === 401) {
        console.log('   Issue: Authentication failed - token may be invalid');
      } else if (error.response?.status === 500) {
        console.log('   Issue: Internal server error - check server logs');
      }
    }
    console.log('');

    // Test 3: Test without token
    console.log('📝 Test 3: Testing /api/admins/me without token...');
    try {
      const meResponseNoToken = await axios.get(`${API_BASE_URL}/admins/me`);
      console.log('⚠️ Request succeeded without token (should fail)');
    } catch (error) {
      console.log('✅ Request correctly failed without token');
      console.log('   Status:', error.response?.status);
      console.log('   Error:', error.response?.data?.message || error.message);
    }
    console.log('');

    // Test 4: Test with invalid token
    console.log('📝 Test 4: Testing /api/admins/me with invalid token...');
    try {
      const meResponseInvalidToken = await axios.get(`${API_BASE_URL}/admins/me`, {
        headers: {
          'Authorization': 'Bearer invalid_token_here',
          'Content-Type': 'application/json'
        }
      });
      console.log('⚠️ Request succeeded with invalid token (should fail)');
    } catch (error) {
      console.log('✅ Request correctly failed with invalid token');
      console.log('   Status:', error.response?.status);
      console.log('   Error:', error.response?.data?.message || error.message);
    }
    console.log('');

    // Test 5: Check server status
    console.log('📝 Test 5: Checking server status...');
    try {
      const serverResponse = await axios.get(`${API_BASE_URL}/admins`);
      console.log('✅ Server is running and responding');
      console.log('   Status:', serverResponse.status);
    } catch (error) {
      console.log('❌ Server is not responding properly');
      console.log('   Error:', error.message);
    }

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
    if (error.response?.data) {
      console.error('   Response data:', error.response.data);
    }
    if (error.response?.status) {
      console.error('   Status code:', error.response.status);
    }
  }
}

// Run the test
testAdminsMeEndpoint();
