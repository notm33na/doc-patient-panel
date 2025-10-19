import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:5000';

async function requestResetWithCorrectEmail() {
  console.log('📧 Requesting password reset with correct email...');

  try {
    const response = await fetch(`${API_BASE_URL}/api/admins/forgot-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'm33na.04@gmail.com'
      }),
    });
    
    const result = await response.json();
    console.log('Response:', result);
    console.log('Status:', response.status);
    
    if (response.ok) {
      console.log('✅ Password reset email sent successfully!');
      console.log('🔗 Now run: node get-reset-token.js');
    } else {
      console.log('❌ Failed to send password reset email');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

// Run the request
requestResetWithCorrectEmail();
