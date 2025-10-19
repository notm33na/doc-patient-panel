import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:5000';

async function testPasswordValidation() {
  console.log('🔒 Testing Strong Password Validation\n');

  const testCases = [
    { password: 'weak', description: 'Too short (4 chars)' },
    { password: 'password', description: 'No uppercase, numbers, or special chars' },
    { password: 'Password', description: 'No numbers or special chars' },
    { password: 'Password1', description: 'No special chars' },
    { password: 'Password@', description: 'No numbers' },
    { password: 'password123@', description: 'No uppercase' },
    { password: 'Password123@', description: 'Valid strong password' },
    { password: 'MyStr0ng!Pass', description: 'Another valid strong password' },
  ];

  try {
    // Get a fresh token first
    console.log('Getting fresh reset token...');
    const resetRequest = await fetch(`${API_BASE_URL}/api/admins/forgot-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'm33na.04@gmail.com'
      }),
    });
    
    const resetResult = await resetRequest.json();
    console.log('✅ Reset token generated:', resetResult.message);
    
    // Get the token from database
    const tokenResponse = await fetch(`${API_BASE_URL}/api/admins/verify-reset-token/e6c0cc17ba389386b1bb9b78825a25086c70c7da406033296cd12f183f0864fa`);
    const tokenResult = await tokenResponse.json();
    
    if (!tokenResponse.ok) {
      console.log('❌ Token expired, getting new one...');
      // We'll use a mock token for testing validation
    }
    
    console.log('\n🧪 Testing password validation with different passwords:\n');
    
    for (const testCase of testCases) {
      console.log(`Testing: "${testCase.password}" (${testCase.description})`);
      
      const response = await fetch(`${API_BASE_URL}/api/admins/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token: 'e6c0cc17ba389386b1bb9b78825a25086c70c7da406033296cd12f183f0864fa',
          newPassword: testCase.password
        }),
      });
      
      const result = await response.json();
      
      if (response.ok) {
        console.log('✅ ACCEPTED - Password is valid');
      } else {
        console.log('❌ REJECTED -', result.message);
      }
      console.log('');
    }
    
    console.log('🎯 Password Validation Test Summary:');
    console.log('✅ Strong passwords (8+ chars, uppercase, lowercase, number, special char) should be ACCEPTED');
    console.log('❌ Weak passwords (missing requirements) should be REJECTED');
    
  } catch (error) {
    console.error('❌ Test failed with error:', error.message);
  }
}

// Run the test
testPasswordValidation();
