import mongoose from 'mongoose';
import PasswordResetToken from './models/PasswordResetToken.js';
import Admin from './models/Admin.js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

async function getValidResetToken() {
  try {
    console.log('🔍 Looking for valid reset tokens...');
    
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Find a valid (non-expired, unused) token
    const validToken = await PasswordResetToken.findOne({
      used: false,
      expiresAt: { $gt: new Date() }
    }).populate('adminId');

    if (validToken) {
      console.log('🎯 Found valid reset token!');
      console.log('Admin:', `${validToken.adminId.firstName} ${validToken.adminId.lastName}`);
      console.log('Email:', validToken.adminId.email);
      console.log('Expires at:', validToken.expiresAt);
      console.log('\n🔗 Reset URL:');
      console.log(`http://localhost:8080/reset-password?token=${validToken.token}`);
      console.log('\n⏰ Token expires in:', Math.round((validToken.expiresAt - new Date()) / 1000 / 60), 'minutes');
    } else {
      console.log('❌ No valid reset tokens found.');
      console.log('💡 You need to request a password reset first.');
    }
    
    // Close connection
    await mongoose.connection.close();
    console.log('✅ Database connection closed');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

// Run the function
getValidResetToken();
