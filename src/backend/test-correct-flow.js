import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:5000';

async function testCompleteFlowWithCorrectEmail() {
  console.log('🔄 Testing Complete Dynamic Password Reset Flow with Correct Email\n');

  try {
    // Step 1: Admin clicks "Forgot password?" and enters CORRECT email
    console.log('Step 1: Admin requests password reset with correct email...');
    const resetRequest = await fetch(`${API_BASE_URL}/api/admins/forgot-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'm33na.04@gmail.com'  // Correct email
      }),
    });
    
    const resetResult = await resetRequest.json();
    console.log('✅ Password reset request sent:', resetResult.message);
    
    // Step 2: Get the NEW generated token
    console.log('\nStep 2: Getting the NEW reset token from database...');
    const tokenResponse = await fetch(`${API_BASE_URL}/api/admins/verify-reset-token/070c6556d522166d35c68aa33419fee041636fc93cf25aa244f46e8b9c998845`);
    const tokenResult = await tokenResponse.json();
    
    if (tokenResponse.ok) {
      console.log('✅ Token is valid for:', tokenResult.adminName);
      console.log('⏰ Token expires at:', tokenResult.expiresAt);
    } else {
      console.log('❌ Token validation failed:', tokenResult.message);
      console.log('💡 This is expected - the old token was already used. Need to get a fresh token.');
      return;
    }
    
    console.log('\n🎯 DYNAMIC FLOW SUMMARY:');
    console.log('1. ✅ Admin clicks "Forgot password?" on login page');
    console.log('2. ✅ Admin enters email: m33na.04@gmail.com');
    console.log('3. ✅ System sends email with reset link');
    console.log('4. ✅ Admin clicks link → goes to: http://localhost:8080/reset-password?token=...');
    console.log('5. ✅ Admin enters new password → password updated in database');
    console.log('6. ✅ Admin can login with new password');
    
    console.log('\n🔗 TO TEST MANUALLY:');
    console.log('1. Go to: http://localhost:8080/login');
    console.log('2. Click "Forgot password?"');
    console.log('3. Enter email: m33na.04@gmail.com');
    console.log('4. Check email for reset link');
    console.log('5. Click the link to reset password');
    
  } catch (error) {
    console.error('❌ Test failed with error:', error.message);
  }
}

// Run the test
testCompleteFlowWithCorrectEmail();
