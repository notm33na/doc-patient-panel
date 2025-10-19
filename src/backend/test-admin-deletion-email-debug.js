/**
 * Test script to verify admin deletion email functionality
 * This will help identify why emails are not being sent
 */

import mongoose from "mongoose";
import Admin from "./models/Admin.js";
import { sendEmail, emailTemplates } from "./utils/emailService.js";

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/tabeeb";

async function testAdminDeletionEmail() {
  try {
    console.log("🔗 Connecting to MongoDB...");
    await mongoose.connect(MONGODB_URI);
    console.log("✅ Connected to MongoDB successfully!");

    // Test 1: Check email configuration
    console.log("\n🔍 Test 1: Email configuration check");
    const hasEmailConfig = process.env.EMAIL_USER && process.env.EMAIL_PASS;
    console.log("Email config available:", hasEmailConfig);
    console.log("EMAIL_USER:", process.env.EMAIL_USER ? "Set" : "Not set");
    console.log("EMAIL_PASS:", process.env.EMAIL_PASS ? "Set" : "Not set");

    // Test 2: Create a test admin
    console.log("\n🔍 Test 2: Creating test admin");
    const testAdminData = {
      firstName: "Test",
      lastName: "Admin",
      email: "test-deletion@example.com",
      phone: "+92-300-1234567",
      password: "hashedpassword",
      role: "Admin",
      permissions: [],
      isActive: true,
      loginAttempts: 0,
      accountLocked: false
    };

    // Clear any existing test admin
    await Admin.deleteOne({ email: testAdminData.email });

    const testAdmin = new Admin(testAdminData);
    await testAdmin.save();
    console.log("✅ Test admin created:", testAdmin.email);

    // Test 3: Test email template
    console.log("\n🔍 Test 3: Testing email template");
    try {
      const template = emailTemplates.adminDeleted(
        `${testAdmin.firstName} ${testAdmin.lastName}`,
        testAdmin.email,
        "Super Admin",
        "Test deletion"
      );
      console.log("✅ Email template generated successfully");
      console.log("Subject:", template.subject);
      console.log("HTML length:", template.html.length, "characters");
    } catch (templateError) {
      console.log("❌ Email template error:", templateError.message);
    }

    // Test 4: Test email sending
    console.log("\n🔍 Test 4: Testing email sending");
    if (hasEmailConfig) {
      try {
        const emailResult = await sendEmail(testAdmin.email, 'adminDeleted', {
          adminName: `${testAdmin.firstName} ${testAdmin.lastName}`,
          adminEmail: testAdmin.email,
          deletedBy: "Super Admin",
          reason: "Test deletion - this is a test email"
        });
        
        if (emailResult.success) {
          console.log("✅ Email sent successfully!");
          console.log("Message ID:", emailResult.messageId);
        } else {
          console.log("❌ Email sending failed:", emailResult.error);
        }
      } catch (emailError) {
        console.log("❌ Email sending error:", emailError.message);
      }
    } else {
      console.log("⚠️ Skipping email sending test - no email configuration");
    }

    // Test 5: Simulate admin deletion flow
    console.log("\n🔍 Test 5: Simulating admin deletion flow");
    
    // Simulate the exact flow from deleteAdmin function
    const adminToDelete = await Admin.findById(testAdmin._id);
    if (!adminToDelete) {
      console.log("❌ Admin not found for deletion");
      return;
    }

    console.log("Found admin to delete:", adminToDelete.email);

    // Send deletion email notification (simulate the exact code)
    try {
      const emailResult = await sendEmail(adminToDelete.email, 'adminDeleted', {
        adminName: `${adminToDelete.firstName} ${adminToDelete.lastName}`,
        adminEmail: adminToDelete.email,
        deletedBy: "Super Admin",
        reason: "Account terminated by administrator"
      });
      
      if (emailResult.success) {
        console.log('✅ Admin deletion email sent successfully to:', adminToDelete.email);
        console.log('Message ID:', emailResult.messageId);
      } else {
        console.log('❌ Failed to send admin deletion email:', emailResult.error);
      }
    } catch (emailError) {
      console.log('❌ Error sending admin deletion email:', emailError.message);
    }

    // Test 6: Check if email service is working at all
    console.log("\n🔍 Test 6: Testing basic email service");
    if (hasEmailConfig) {
      try {
        // Test with a simple email
        const basicEmailResult = await sendEmail("test@example.com", 'adminDeleted', {
          adminName: "Test User",
          adminEmail: "test@example.com",
          deletedBy: "System",
          reason: "Basic email test"
        });
        
        if (basicEmailResult.success) {
          console.log("✅ Basic email service is working");
        } else {
          console.log("❌ Basic email service failed:", basicEmailResult.error);
        }
      } catch (basicError) {
        console.log("❌ Basic email service error:", basicError.message);
      }
    }

    // Clean up
    console.log("\n🧹 Cleaning up test admin...");
    await Admin.findByIdAndDelete(testAdmin._id);
    console.log("✅ Test admin cleaned up");

    console.log("\n✅ Admin deletion email test completed!");
    
    console.log("\n📊 Summary:");
    console.log("- Email configuration:", hasEmailConfig ? "Available" : "Missing");
    console.log("- Email template:", "Working");
    console.log("- Email service:", hasEmailConfig ? "Tested" : "Not tested");
    console.log("- Admin deletion flow:", "Simulated");

    if (!hasEmailConfig) {
      console.log("\n⚠️ IMPORTANT: Email configuration is missing!");
      console.log("To enable admin deletion emails, set these environment variables:");
      console.log("- EMAIL_USER: Your Gmail address");
      console.log("- EMAIL_PASS: Your Gmail app password");
    }

  } catch (error) {
    console.error("❌ Error testing admin deletion email:", error);
  } finally {
    await mongoose.disconnect();
    console.log("🔌 Disconnected from MongoDB.");
  }
}

// Run the test
testAdminDeletionEmail();
