/**
 * Test script to verify email service configuration
 * This will help debug email issues
 */

import dotenv from 'dotenv';
import { sendEmail, emailTemplates } from './utils/emailService.js';

// Load environment variables
dotenv.config();

async function testEmailConfiguration() {
  try {
    console.log("🔍 Testing email configuration...");
    
    // Check environment variables
    console.log("\n📋 Environment Variables:");
    console.log("EMAIL_USER:", process.env.EMAIL_USER ? "Set" : "Not set");
    console.log("EMAIL_PASS:", process.env.EMAIL_PASS ? "Set" : "Not set");
    console.log("FRONTEND_URL:", process.env.FRONTEND_URL || "Not set");
    
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.log("\n❌ Email configuration is missing!");
      console.log("Please create a .env file in src/backend/ with:");
      console.log("EMAIL_USER=your-email@gmail.com");
      console.log("EMAIL_PASS=your-app-password");
      return;
    }
    
    console.log("\n✅ Email configuration found!");
    
    // Test email template
    console.log("\n🔍 Testing email template...");
    try {
      const template = emailTemplates.adminDeleted(
        "Test Admin",
        "test@example.com",
        "Super Admin",
        "Test deletion"
      );
      console.log("✅ Email template generated successfully");
      console.log("Subject:", template.subject);
      console.log("HTML length:", template.html.length, "characters");
    } catch (templateError) {
      console.log("❌ Email template error:", templateError.message);
      return;
    }
    
    // Test email sending
    console.log("\n🔍 Testing email sending...");
    try {
      const emailResult = await sendEmail("test@example.com", 'adminDeleted', {
        adminName: "Test Admin",
        adminEmail: "test@example.com",
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
    
    console.log("\n✅ Email configuration test completed!");
    
  } catch (error) {
    console.error("❌ Error testing email configuration:", error);
  }
}

// Run the test
testEmailConfiguration();
