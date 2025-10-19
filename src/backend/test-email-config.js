import dotenv from "dotenv";
import { sendEmail, emailTemplates } from "./utils/emailService.js";

// Load environment variables
dotenv.config();

// Test email configuration
const testEmailConfiguration = async () => {
  console.log("🔧 Testing Email Configuration...");
  
  // Check environment variables
  console.log("\n📋 Environment Variables:");
  console.log(`EMAIL_USER: ${process.env.EMAIL_USER ? '✅ Set' : '❌ Not set'}`);
  console.log(`EMAIL_PASS: ${process.env.EMAIL_PASS ? '✅ Set' : '❌ Not set'}`);
  console.log(`FRONTEND_URL: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`);
  
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.log("\n❌ Email configuration incomplete!");
    console.log("Please set the following environment variables:");
    console.log("EMAIL_USER=your-email@gmail.com");
    console.log("EMAIL_PASS=your-gmail-app-password");
    return;
  }
  
  console.log("\n📧 Testing Email Templates...");
  
  // Test approval email template
  console.log("\n✅ Approval Email Template:");
  const approvalTemplate = emailTemplates.approval("Dr. Test Doctor");
  console.log(`Subject: ${approvalTemplate.subject}`);
  console.log("HTML preview: Email template generated successfully");
  
  // Test rejection email template
  console.log("\n✅ Rejection Email Template:");
  const rejectionTemplate = emailTemplates.rejection("Dr. Test Doctor", "Incomplete documentation");
  console.log(`Subject: ${rejectionTemplate.subject}`);
  console.log("HTML preview: Email template generated successfully");
  
  console.log("\n🎉 Email templates are working correctly!");
  console.log("\n📝 Next Steps:");
  console.log("1. Set up your Gmail app password");
  console.log("2. Update EMAIL_USER and EMAIL_PASS in your environment");
  console.log("3. Test sending actual emails");
};

// Test sending actual email
const testSendEmail = async () => {
  console.log("\n📤 Testing Email Sending...");
  
  const testEmail = "m33na.04@gmail.com"; // Test email address
  
  try {
    // Test approval email
    console.log("Sending test approval email...");
    const approvalResult = await sendEmail(testEmail, 'approval', {
      candidateName: "Dr. Test Doctor"
    });
    
    if (approvalResult.success) {
      console.log("✅ Approval email sent successfully!");
    } else {
      console.log("❌ Approval email failed:", approvalResult.error);
    }
    
    // Test rejection email
    console.log("Sending test rejection email...");
    const rejectionResult = await sendEmail(testEmail, 'rejection', {
      candidateName: "Dr. Test Doctor",
      reason: "Test rejection reason"
    });
    
    if (rejectionResult.success) {
      console.log("✅ Rejection email sent successfully!");
    } else {
      console.log("❌ Rejection email failed:", rejectionResult.error);
    }
    
  } catch (error) {
    console.error("❌ Email test failed:", error);
  }
};

// Run the test
testEmailConfiguration();

// Test actual email sending
testSendEmail();
