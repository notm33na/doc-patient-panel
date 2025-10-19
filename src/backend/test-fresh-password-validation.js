import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:5000';

async function testPasswordValidationWithFreshToken() {
  console.log('🔒 Testing Strong Password Validation with Fresh Token\n');

  const testCases = [
    { password: 'weak', description: 'Too short (4 chars)', shouldPass: false },
    { password: 'password', description: 'No uppercase, numbers, or special chars', shouldPass: false },
    { password: 'Password', description: 'No numbers or special chars', shouldPass: false },
    { password: 'Password1', description: 'No special chars', shouldPass: false },
    { password: 'Password@', description: 'No numbers', shouldPass: false },
    { password: 'password123@', description: 'No uppercase', shouldPass: false },
    { password: 'Password123@', description: 'Valid strong password', shouldPass: true },
    { password: 'MyStr0ng!Pass', description: 'Another valid strong password', shouldPass: true },
  ];

  const token = '4c37927cf0fb1afdbbfe15b5aecd1c27587f3ec80e779748e76979e8a102dcde';

  try {
    console.log('🧪 Testing password validation with different passwords:\n');
    
    for (const testCase of testCases) {
      console.log(`Testing: "${testCase.password}" (${testCase.description})`);
      
      const response = await fetch(`${API_BASE_URL}/api/admins/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token: token,
          newPassword: testCase.password
        }),
      });
      
      const result = await response.json();
      
      if (response.ok) {
        console.log('✅ ACCEPTED - Password is valid');
        if (!testCase.shouldPass) {
          console.log('⚠️  WARNING: This password should have been rejected!');
        }
      } else {
        console.log('❌ REJECTED -', result.message);
        if (testCase.shouldPass) {
          console.log('⚠️  WARNING: This password should have been accepted!');
        }
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
testPasswordValidationWithFreshToken();
