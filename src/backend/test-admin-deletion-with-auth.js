import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import axios from 'axios';
import Admin from './models/Admin.js';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

async function testAdminDeletionWithAuth() {
  try {
    await connectDB();
    
    console.log("🔍 Testing admin deletion with authentication...");
    
    // Clean up any existing test admins first
    console.log("🧹 Cleaning up existing test admins...");
    await Admin.deleteMany({ 
      email: { $in: ['superadmin@test.com', 'test-admin-delete@example.com'] }
    });
    console.log("✅ Existing test admins cleaned up");
    
    // Create a super admin for authentication
    const hashedPassword = await bcrypt.hash('superadmin123', 10);
    const superAdmin = new Admin({
      firstName: 'Super',
      lastName: 'Admin',
      email: 'superadmin@test.com',
      phone: '03001234567',
      password: hashedPassword,
      role: 'Super Admin',
      permissions: ['read', 'write', 'delete'],
      isActive: true
    });
    await superAdmin.save();
    console.log("✅ Super admin created:", superAdmin.email);
    
    // Create a test admin to delete
    const testAdminPassword = await bcrypt.hash('testpassword123', 10);
    const testAdmin = new Admin({
      firstName: 'Test',
      lastName: 'Admin',
      email: 'test-admin-delete@example.com',
      phone: '03001234568',
      password: testAdminPassword,
      role: 'Admin',
      permissions: ['read', 'write'],
      isActive: true
    });
    await testAdmin.save();
    console.log("✅ Test admin created:", testAdmin.email);
    
    // Wait a moment for the admins to be saved
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Login as super admin to get token
    console.log("\n🔐 Logging in as super admin...");
    const loginResponse = await axios.post('http://localhost:5000/api/admins/login', {
      email: 'superadmin@test.com',
      password: 'superadmin123'
    });
    
    const token = loginResponse.data.token;
    console.log("✅ Login successful, token received");
    
    // Make API call to delete the test admin
    console.log("\n🌐 Making API call to delete admin...");
    
    try {
      const response = await axios.delete(`http://localhost:5000/api/admins/${testAdmin._id}`, {
        data: { reason: 'Test deletion with authentication' },
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        timeout: 10000
      });
      
      console.log("✅ API Response Status:", response.status);
      console.log("✅ API Response Data:", response.data);
      
    } catch (apiError) {
      console.log("❌ API Error:", apiError.response?.status || apiError.code);
      console.log("❌ API Error Data:", apiError.response?.data || apiError.message);
      if (apiError.response?.data?.error) {
        console.log("❌ Detailed Error:", apiError.response.data.error);
      }
    }
    
    // Clean up test admins
    console.log("\n🧹 Cleaning up test admins...");
    await Admin.deleteOne({ email: 'superadmin@test.com' });
    await Admin.deleteOne({ email: 'test-admin-delete@example.com' });
    console.log("✅ Test admins cleaned up");
    
    console.log("\n✅ Admin deletion with auth test completed!");
    
  } catch (error) {
    console.error("❌ Error testing admin deletion with auth:", error);
  } finally {
    await mongoose.connection.close();
    console.log("🔌 Database connection closed");
  }
}

// Run the test
testAdminDeletionWithAuth();
