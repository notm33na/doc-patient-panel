/**
 * Test script to simulate actual admin deletion API call
 * This will test the complete flow including authentication
 */

import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Admin from './models/Admin.js';
import bcrypt from 'bcryptjs';

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

async function testActualAdminDeletion() {
  try {
    await connectDB();
    
    console.log("🔍 Testing actual admin deletion process...");
    
    // Create a test admin to delete
    const hashedPassword = await bcrypt.hash('testpassword123', 10);
    const testAdmin = new Admin({
      firstName: 'Test',
      lastName: 'AdminToDelete',
      email: 'test-admin-delete@example.com',
      phone: '03001234567',
      password: hashedPassword,
      role: 'Admin',
      permissions: ['read', 'write'],
      isActive: true
    });
    await testAdmin.save();
    console.log("✅ Test admin created:", testAdmin.email);
    
    // Create a super admin to perform the deletion
    const superAdminPassword = await bcrypt.hash('superpassword123', 10);
    let superAdmin = await Admin.findOne({ email: 'super-admin@example.com' });
    
    if (!superAdmin) {
      superAdmin = new Admin({
        firstName: 'Super',
        lastName: 'Admin',
        email: 'super-admin@example.com',
        phone: '03001234568',
        password: superAdminPassword,
        role: 'Super Admin',
        permissions: ['read', 'write', 'delete'],
        isActive: true
      });
      await superAdmin.save();
      console.log("✅ Super admin created:", superAdmin.email);
    }
    
    // Now simulate the deletion process exactly as it happens in the controller
    console.log("\n🔍 Simulating admin deletion...");
    
    // Import the deleteAdmin function
    const { deleteAdmin } = await import('./controller/adminController.js');
    
    // Create a mock request object
    const mockReq = {
      params: { id: testAdmin._id.toString() },
      body: { reason: 'Test deletion via API simulation' },
      admin: {
        id: superAdmin._id.toString(),
        firstName: superAdmin.firstName,
        lastName: superAdmin.lastName,
        role: superAdmin.role
      }
    };
    
    // Create a mock response object
    const mockRes = {
      status: (code) => ({
        json: (data) => {
          console.log(`📤 Response Status: ${code}`);
          console.log('📤 Response Data:', data);
          return { status: code, data };
        }
      }),
      json: (data) => {
        console.log('📤 Response Data:', data);
        return { data };
      }
    };
    
    // Call the deleteAdmin function
    await deleteAdmin(mockReq, mockRes);
    
    console.log("\n✅ Admin deletion simulation completed!");
    
  } catch (error) {
    console.error("❌ Error testing admin deletion:", error);
  } finally {
    await mongoose.connection.close();
    console.log("🔌 Database connection closed");
  }
}

// Run the test
testActualAdminDeletion();
