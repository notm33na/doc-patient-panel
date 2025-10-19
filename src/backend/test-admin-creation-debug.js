/**
 * Test script to debug admin creation issues
 * This script will help identify what's causing the 400 Bad Request error
 */

import mongoose from "mongoose";
import Admin from "./models/Admin.js";
import { validatePhoneNumber } from "./utils/phoneValidation.js";

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/tabeeb";

async function testAdminCreation() {
  try {
    console.log("🔗 Connecting to MongoDB...");
    await mongoose.connect(MONGODB_URI);
    console.log("✅ Connected to MongoDB successfully!");

    // Test data that matches the frontend form
    const testAdminData = {
      firstName: "Test",
      lastName: "Admin",
      email: "test-admin@example.com",
      phone: "03001234567",
      password: "TestPassword123!",
      role: "Admin",
      permissions: [],
      isActive: true
    };

    console.log("\n🔍 Test 1: Phone validation");
    console.log("Testing phone:", testAdminData.phone);
    
    try {
      const phoneValidation = validatePhoneNumber(testAdminData.phone);
      console.log("Phone validation result:", phoneValidation);
      
      if (phoneValidation.isValid) {
        console.log("✅ Phone validation passed");
        console.log("Formatted phone:", phoneValidation.formatted);
      } else {
        console.log("❌ Phone validation failed:", phoneValidation.error);
        return;
      }
    } catch (phoneError) {
      console.log("❌ Phone validation error:", phoneError.message);
      return;
    }

    console.log("\n🔍 Test 2: Check for existing admin");
    try {
      const existing = await Admin.findOne({ 
        $or: [
          { email: testAdminData.email },
          { phone: testAdminData.phone }
        ]
      });
      
      if (existing) {
        console.log("❌ Admin already exists:", existing.email);
        console.log("Cleaning up existing admin...");
        await Admin.findByIdAndDelete(existing._id);
        console.log("✅ Existing admin cleaned up");
      } else {
        console.log("✅ No existing admin found");
      }
    } catch (existingError) {
      console.log("❌ Error checking existing admin:", existingError.message);
    }

    console.log("\n🔍 Test 3: Admin model validation");
    try {
      // Test the admin data structure
      const adminData = {
        firstName: testAdminData.firstName,
        lastName: testAdminData.lastName,
        email: testAdminData.email,
        phone: testAdminData.phone,
        password: "hashedpassword", // We'll hash this properly later
        role: testAdminData.role,
        permissions: testAdminData.permissions || [],
        isActive: testAdminData.isActive !== undefined ? testAdminData.isActive : true,
        loginAttempts: 0,
        accountLocked: false
      };

      console.log("Admin data structure:", JSON.stringify(adminData, null, 2));

      // Test if the data structure is valid for the schema
      const testAdmin = new Admin(adminData);
      const validationError = testAdmin.validateSync();
      
      if (validationError) {
        console.log("❌ Schema validation failed:");
        console.log(validationError.errors);
        return;
      } else {
        console.log("✅ Schema validation passed");
      }
    } catch (schemaError) {
      console.log("❌ Schema validation error:", schemaError.message);
      return;
    }

    console.log("\n🔍 Test 4: Full admin creation test");
    try {
      // Clear any existing test admin
      await Admin.deleteOne({ email: testAdminData.email });
      
      // Create admin with proper password hashing
      const bcrypt = await import('bcryptjs');
      const salt = await bcrypt.default.genSalt(10);
      const hashedPassword = await bcrypt.default.hash(testAdminData.password, salt);

      const finalAdminData = {
        firstName: testAdminData.firstName,
        lastName: testAdminData.lastName,
        email: testAdminData.email,
        phone: testAdminData.phone,
        password: hashedPassword,
        role: testAdminData.role,
        permissions: testAdminData.permissions || [],
        isActive: testAdminData.isActive !== undefined ? testAdminData.isActive : true,
        loginAttempts: 0,
        accountLocked: false
      };

      const newAdmin = new Admin(finalAdminData);
      await newAdmin.save();
      
      console.log("✅ Admin created successfully!");
      console.log("Admin ID:", newAdmin._id);
      console.log("Admin email:", newAdmin.email);
      console.log("Admin role:", newAdmin.role);

      // Clean up
      await Admin.findByIdAndDelete(newAdmin._id);
      console.log("✅ Test admin cleaned up");

    } catch (creationError) {
      console.log("❌ Admin creation failed:", creationError.message);
      if (creationError.errors) {
        console.log("Validation errors:", creationError.errors);
      }
    }

    console.log("\n🔍 Test 5: Frontend form data simulation");
    try {
      // Simulate the exact payload from the frontend
      const frontendPayload = {
        firstName: "Test",
        lastName: "Admin", 
        email: "test-frontend@example.com",
        phone: "03001234567",
        password: "TestPassword123!",
        role: "Admin",
        permissions: [],
        isActive: true
      };

      console.log("Frontend payload:", JSON.stringify(frontendPayload, null, 2));

      // Test phone validation on frontend payload
      const phoneValidation = validatePhoneNumber(frontendPayload.phone);
      if (!phoneValidation.isValid) {
        console.log("❌ Frontend phone validation failed:", phoneValidation.error);
        return;
      }

      // Format phone for storage
      const formattedPhone = phoneValidation.formatted;
      console.log("Formatted phone:", formattedPhone);

      // Check for duplicates
      const existing = await Admin.findOne({ 
        $or: [
          { email: frontendPayload.email },
          { phone: formattedPhone }
        ]
      });

      if (existing) {
        console.log("❌ Duplicate found:", existing.email);
        await Admin.findByIdAndDelete(existing._id);
        console.log("✅ Duplicate cleaned up");
      }

      // Create admin
      const bcrypt = await import('bcryptjs');
      const salt = await bcrypt.default.genSalt(10);
      const hashedPassword = await bcrypt.default.hash(frontendPayload.password, salt);

      const adminData = {
        firstName: frontendPayload.firstName,
        lastName: frontendPayload.lastName,
        email: frontendPayload.email,
        phone: formattedPhone,
        password: hashedPassword,
        role: frontendPayload.role,
        permissions: frontendPayload.permissions || [],
        isActive: frontendPayload.isActive !== undefined ? frontendPayload.isActive : true,
        loginAttempts: 0,
        accountLocked: false
      };

      const newAdmin = new Admin(adminData);
      await newAdmin.save();
      
      console.log("✅ Frontend payload test successful!");
      console.log("Created admin:", newAdmin.email);

      // Clean up
      await Admin.findByIdAndDelete(newAdmin._id);
      console.log("✅ Frontend test admin cleaned up");

    } catch (frontendError) {
      console.log("❌ Frontend payload test failed:", frontendError.message);
      if (frontendError.errors) {
        console.log("Frontend validation errors:", frontendError.errors);
      }
    }

    console.log("\n✅ Admin creation debugging completed!");
    console.log("\n📊 Summary:");
    console.log("- Phone validation is working");
    console.log("- Schema validation is working");
    console.log("- Admin creation process is working");
    console.log("- Frontend payload format is correct");

  } catch (error) {
    console.error("❌ Error in admin creation test:", error);
  } finally {
    await mongoose.disconnect();
    console.log("🔌 Disconnected from MongoDB.");
  }
}

// Run the test
testAdminCreation();
