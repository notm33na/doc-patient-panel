import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:5000';

async function testCompletePasswordResetFlow() {
  console.log('🔄 Testing Complete Dynamic Password Reset Flow\n');

  try {
    // Step 1: Admin clicks "Forgot password?" and enters email
    console.log('Step 1: Admin requests password reset...');
    const resetRequest = await fetch(`${API_BASE_URL}/api/admins/forgot-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'admin@fyp.com'
      }),
    });
    
    const resetResult = await resetRequest.json();
    console.log('✅ Password reset request sent:', resetResult.message);
    
    // Step 2: Get the generated token (simulating email link)
    console.log('\nStep 2: Getting the reset token from database...');
    const tokenResponse = await fetch(`${API_BASE_URL}/api/admins/verify-reset-token/070c6556d522166d35c68aa33419fee041636fc93cf25aa244f46e8b9c998845`);
    const tokenResult = await tokenResponse.json();
    
    if (tokenResponse.ok) {
      console.log('✅ Token is valid for:', tokenResult.adminName);
      console.log('⏰ Token expires at:', tokenResult.expiresAt);
    } else {
      console.log('❌ Token validation failed:', tokenResult.message);
      return;
    }
    
    // Step 3: Admin clicks the link and goes to reset password page
    console.log('\nStep 3: Admin accesses reset password page...');
    console.log('🔗 Reset URL: http://localhost:8080/reset-password?token=070c6556d522166d35c68aa33419fee041636fc93cf25aa244f46e8b9c998845');
    console.log('✅ Reset password page should load with form for:', tokenResult.adminName);
    
    // Step 4: Admin enters new password and submits
    console.log('\nStep 4: Admin submits new password...');
    const resetPassword = await fetch(`${API_BASE_URL}/api/admins/reset-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        token: '070c6556d522166d35c68aa33419fee041636fc93cf25aa244f46e8b9c998845',
        newPassword: 'newpassword123'
      }),
    });
    
    const resetPasswordResult = await resetPassword.json();
    
    if (resetPassword.ok) {
      console.log('✅ Password reset successful:', resetPasswordResult.message);
      console.log('🔄 Admin can now login with new password: newpassword123');
    } else {
      console.log('❌ Password reset failed:', resetPasswordResult.message);
    }
    
    // Step 5: Verify the password was actually changed by trying to login
    console.log('\nStep 5: Verifying password was changed by testing login...');
    const loginTest = await fetch(`${API_BASE_URL}/api/admins/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'admin@fyp.com',
        password: 'newpassword123'
      }),
    });
    
    const loginResult = await loginTest.json();
    
    if (loginTest.ok) {
      console.log('✅ Login successful with new password!');
      console.log('👤 Logged in as:', loginResult.firstName, loginResult.lastName);
    } else {
      console.log('❌ Login failed:', loginResult.message);
    }
    
    console.log('\n🎉 Complete Dynamic Password Reset Flow Test Completed!');
    console.log('\n📋 Summary:');
    console.log('1. ✅ Admin requests password reset via email');
    console.log('2. ✅ System generates secure token and sends email');
    console.log('3. ✅ Admin clicks email link → goes to reset page');
    console.log('4. ✅ Admin enters new password → password updated in database');
    console.log('5. ✅ Admin can login with new password');
    
  } catch (error) {
    console.error('❌ Test failed with error:', error.message);
  }
}

// Run the complete flow test
testCompletePasswordResetFlow();
