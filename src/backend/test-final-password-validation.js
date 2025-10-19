import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:5000';

async function testPasswordValidationFinal() {
  console.log('🔒 Final Password Validation Test\n');

  try {
    // Step 1: Request password reset with correct email
    console.log('Step 1: Requesting password reset for m33na.04@gmail.com...');
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
    console.log('✅ Password reset request sent:', resetResult.message);
    
    // Step 2: Get the fresh token
    console.log('\nStep 2: Getting fresh token...');
    const tokenResponse = await fetch(`${API_BASE_URL}/api/admins/verify-reset-token/4c37927cf0fb1afdbbfe15b5aecd1c27587f3ec80e779748e76979e8a102dcde`);
    const tokenResult = await tokenResponse.json();
    
    if (!tokenResponse.ok) {
      console.log('❌ Old token expired. Need to get fresh token from database.');
      console.log('💡 Please run: node get-reset-token.js');
      return;
    }
    
    console.log('✅ Token is valid for:', tokenResult.adminName);
    
    // Step 3: Test password validation
    console.log('\nStep 3: Testing password validation...');
    
    const testPasswords = [
      { password: 'weak', shouldPass: false },
      { password: 'password', shouldPass: false },
      { password: 'Password', shouldPass: false },
      { password: 'Password1', shouldPass: false },
      { password: 'Password@', shouldPass: false },
      { password: 'password123@', shouldPass: false },
      { password: 'Password123@', shouldPass: true },
      { password: 'MyStr0ng!Pass', shouldPass: true },
    ];
    
    for (const test of testPasswords) {
      console.log(`\nTesting: "${test.password}"`);
      
      const response = await fetch(`${API_BASE_URL}/api/admins/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token: '4c37927cf0fb1afdbbfe15b5aecd1c27587f3ec80e779748e76979e8a102dcde',
          newPassword: test.password
        }),
      });
      
      const result = await response.json();
      
      if (response.ok) {
        console.log('✅ ACCEPTED');
        if (!test.shouldPass) {
          console.log('⚠️  WARNING: Should have been rejected!');
        }
      } else {
        console.log('❌ REJECTED -', result.message);
        if (test.shouldPass) {
          console.log('⚠️  WARNING: Should have been accepted!');
        }
      }
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run the test
testPasswordValidationFinal();
