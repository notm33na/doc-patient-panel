import mongoose from 'mongoose';
import PasswordResetToken from './models/PasswordResetToken.js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

async function cleanupExpiredTokens() {
  try {
    console.log('🧹 Starting cleanup of expired password reset tokens...');
    
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Clean up expired tokens
    const deletedCount = await PasswordResetToken.cleanupExpiredTokens();
    
    console.log(`✅ Cleanup completed. Removed ${deletedCount} expired tokens.`);
    
    // Close connection
    await mongoose.connection.close();
    console.log('✅ Database connection closed');
    
  } catch (error) {
    console.error('❌ Cleanup failed:', error.message);
    process.exit(1);
  }
}

// Run cleanup
cleanupExpiredTokens();
