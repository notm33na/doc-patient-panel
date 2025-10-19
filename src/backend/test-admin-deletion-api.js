/**
 * Test script to check admin deletion through actual API endpoint
 * This will test the complete HTTP request flow
 */

import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Admin from './models/Admin.js';
import bcrypt from 'bcryptjs';
import axios from 'axios';

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

async function testAdminDeletionAPI() {
  try {
    await connectDB();
    
    console.log("🔍 Testing admin deletion through API...");
    
    // Create a test admin to delete
    const hashedPassword = await bcrypt.hash('testpassword123', 10);
    const testAdmin = new Admin({
      firstName: 'Test',
      lastName: 'AdminAPI',
      email: 'test-admin-api@example.com',
      phone: '03001234569',
      password: hashedPassword,
      role: 'Admin',
      permissions: ['read', 'write'],
      isActive: true
    });
    await testAdmin.save();
    console.log("✅ Test admin created:", testAdmin.email);
    
    // Wait a moment for the admin to be saved
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Make API call to delete the admin
    console.log("\n🌐 Making API call to delete admin...");
    
    try {
      const response = await axios.delete(`http://localhost:5000/api/admins/${testAdmin._id}`, {
        data: { reason: 'Test deletion via API call' },
        timeout: 10000
      });
      
      console.log("✅ API Response Status:", response.status);
      console.log("✅ API Response Data:", response.data);
      
    } catch (apiError) {
      console.log("❌ API Error:", apiError.response?.status || apiError.code);
      console.log("❌ API Error Data:", apiError.response?.data || apiError.message);
    }
    
    console.log("\n✅ Admin deletion API test completed!");
    
  } catch (error) {
    console.error("❌ Error testing admin deletion API:", error);
  } finally {
    await mongoose.connection.close();
    console.log("🔌 Database connection closed");
  }
}

// Run the test
testAdminDeletionAPI();
