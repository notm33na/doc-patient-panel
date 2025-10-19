import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:5000';

async function testResetLinkGeneration() {
  console.log('🔗 Testing Reset Link Generation\n');

  try {
    // Test with a real admin email to see the generated link
    console.log('Requesting password reset for admin@fyp.com...');
    const response = await fetch(`${API_BASE_URL}/api/admins/forgot-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'admin@fyp.com'
      }),
    });
    
    const result = await response.json();
    console.log('Response:', result);
    console.log('Status:', response.status);
    
    if (response.ok) {
      console.log('✅ Password reset email sent successfully!');
      console.log('📧 Check your email for the reset link.');
      console.log('🔗 The reset link should now point to: http://localhost:8080/reset-password?token=...');
      console.log('\n💡 If you see the email, the link should work now!');
    } else {
      console.log('❌ Failed to send password reset email');
    }

  } catch (error) {
    console.error('❌ Test failed with error:', error.message);
  }
}

// Run the test
testResetLinkGeneration();
