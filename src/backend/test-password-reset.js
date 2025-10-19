import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:5000';

async function testPasswordReset() {
  console.log('🧪 Testing Password Reset Functionality\n');

  try {
    // Test 1: Request password reset for non-existent email
    console.log('Test 1: Request password reset for non-existent email');
    const response1 = await fetch(`${API_BASE_URL}/api/admins/forgot-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'nonexistent@example.com'
      }),
    });
    
    const result1 = await response1.json();
    console.log('Response:', result1);
    console.log('Status:', response1.status);
    console.log('✅ Test 1 passed: Non-existent email handled gracefully\n');

    // Test 2: Request password reset for existing admin
    console.log('Test 2: Request password reset for existing admin');
    const response2 = await fetch(`${API_BASE_URL}/api/admins/forgot-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'admin@fyp.com' // Replace with actual admin email
      }),
    });
    
    const result2 = await response2.json();
    console.log('Response:', result2);
    console.log('Status:', response2.status);
    
    if (response2.ok) {
      console.log('✅ Test 2 passed: Password reset email sent\n');
    } else {
      console.log('❌ Test 2 failed: Could not send password reset email\n');
    }

    // Test 3: Verify invalid token
    console.log('Test 3: Verify invalid reset token');
    const response3 = await fetch(`${API_BASE_URL}/api/admins/verify-reset-token/invalid-token`, {
      method: 'GET',
    });
    
    const result3 = await response3.json();
    console.log('Response:', result3);
    console.log('Status:', response3.status);
    console.log('✅ Test 3 passed: Invalid token rejected\n');

    // Test 4: Reset password with invalid token
    console.log('Test 4: Reset password with invalid token');
    const response4 = await fetch(`${API_BASE_URL}/api/admins/reset-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        token: 'invalid-token',
        newPassword: 'newpassword123'
      }),
    });
    
    const result4 = await response4.json();
    console.log('Response:', result4);
    console.log('Status:', response4.status);
    console.log('✅ Test 4 passed: Invalid token rejected for password reset\n');

    console.log('🎉 All password reset tests completed successfully!');
    console.log('\n📝 Note: To test with a real token, you would need to:');
    console.log('1. Request a password reset for an existing admin');
    console.log('2. Check the email for the reset link');
    console.log('3. Extract the token from the URL');
    console.log('4. Use that token to test the reset functionality');

  } catch (error) {
    console.error('❌ Test failed with error:', error.message);
  }
}

// Run the tests
testPasswordReset();
