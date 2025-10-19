/**
 * Test script to simulate admin deletion and email sending
 * This will help debug why admin deletion emails aren't being sent
 */

import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Admin from './models/Admin.js';
import { sendEmail } from './utils/emailService.js';

// Load environment variables
dotenv.config({ path: './.env' });

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

async function testAdminDeletionEmail() {
  try {
    await connectDB();
    
    console.log("🔍 Testing admin deletion email process...");
    
    // Find an admin to test with (or create a test admin)
    let testAdmin = await Admin.findOne({ email: 'test-admin@example.com' });
    
    if (!testAdmin) {
      console.log("📝 Creating test admin for deletion test...");
      testAdmin = new Admin({
        firstName: 'Test',
        lastName: 'Admin',
        email: 'test-admin@example.com',
        phone: '03001234567',
        password: 'hashedpassword',
        role: 'Admin',
        permissions: ['read', 'write'],
        isActive: true
      });
      await testAdmin.save();
      console.log("✅ Test admin created");
    }
    
    console.log("📧 Testing email sending for admin:", testAdmin.email);
    
    // Simulate the exact email sending logic from deleteAdmin
    try {
      const emailResult = await sendEmail(testAdmin.email, 'adminDeleted', {
        adminName: `${testAdmin.firstName} ${testAdmin.lastName}`,
        adminEmail: testAdmin.email,
        deletedBy: 'Super Admin',
        reason: 'Test deletion - this is a test email'
      });
      
      if (emailResult.success) {
        console.log('✅ Admin deletion email sent successfully!');
        console.log('Message ID:', emailResult.messageId);
      } else {
        console.log('❌ Failed to send admin deletion email:', emailResult.error);
      }
    } catch (emailError) {
      console.log('❌ Error sending admin deletion email:', emailError.message);
    }
    
    // Clean up test admin
    await Admin.findByIdAndDelete(testAdmin._id);
    console.log("🧹 Test admin cleaned up");
    
    console.log("\n✅ Admin deletion email test completed!");
    
  } catch (error) {
    console.error("❌ Error testing admin deletion email:", error);
  } finally {
    await mongoose.connection.close();
    console.log("🔌 Database connection closed");
  }
}

// Run the test
testAdminDeletionEmail();