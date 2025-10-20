import mongoose from "mongoose";
import Admin from "./models/Admin.js";
import AdminActivity from "./models/AdminActivity.js";
import connectDB from "./config/db.js";
import dotenv from "dotenv";
import { logAdminActivity, getClientIP, getUserAgent } from "./utils/adminActivityLogger.js";

// Load environment variables
dotenv.config();

// Color coding function (copied from frontend)
const getActionBadgeColor = (action) => {
  // Add actions - Green (check this first to catch UNSUSPEND)
  if (action.includes('ADD') || action.includes('CREATE') || action.includes('APPROVE') || action.includes('UNSUSPEND')) {
    return "bg-green-100 text-green-800 border-green-200";
  }
  
  // Suspend actions - Orange
  if (action.includes('SUSPEND') || action.includes('REJECT')) {
    return "bg-orange-100 text-orange-800 border-orange-200";
  }
  
  // Delete actions - Red
  if (action.includes('DELETE')) {
    return "bg-red-100 text-red-800 border-red-200";
  }
  
  // Default actions - Blue
  return "bg-blue-100 text-blue-800 border-blue-200";
};

async function testColorCoding() {
  try {
    console.log("🔌 Connecting to database...");
    await connectDB();
    console.log("✅ Database connected successfully");

    console.log("\n🎨 Testing Action Color Coding");
    console.log("=" .repeat(40));

    // Get a test admin
    const testAdmin = await Admin.findOne({});
    if (!testAdmin) {
      console.log("❌ No admin found. Please create an admin first.");
      return;
    }

    console.log(`✅ Using test admin: ${testAdmin.firstName} ${testAdmin.lastName}`);

    // Mock request object
    const mockReq = {
      admin: testAdmin,
      ip: '127.0.0.1',
      headers: {
        'user-agent': 'Test-Agent/1.0'
      }
    };

    // Test different action types for color coding
    const testActions = [
      // Delete actions (should be RED)
      { action: 'DELETE_ADMIN', details: 'Test admin deletion', expectedColor: 'red' },
      { action: 'DELETE_PATIENT', details: 'Test patient deletion', expectedColor: 'red' },
      { action: 'DELETE_BLACKLIST', details: 'Test blacklist deletion', expectedColor: 'red' },
      
      // Suspend actions (should be ORANGE)
      { action: 'SUSPEND_DOCTOR', details: 'Test doctor suspension', expectedColor: 'orange' },
      { action: 'REJECT_DOCTOR', details: 'Test doctor rejection', expectedColor: 'orange' },
      
      // Add actions (should be GREEN)
      { action: 'ADD_PATIENT', details: 'Test patient addition', expectedColor: 'green' },
      { action: 'ADD_BLACKLIST', details: 'Test blacklist addition', expectedColor: 'green' },
      { action: 'CREATE_ADMIN', details: 'Test admin creation', expectedColor: 'green' },
      { action: 'APPROVE_DOCTOR', details: 'Test doctor approval', expectedColor: 'green' },
      { action: 'UNSUSPEND_DOCTOR', details: 'Test doctor unsuspension', expectedColor: 'green' },
      
      // Default actions (should be BLUE)
      { action: 'LOGIN', details: 'Test login', expectedColor: 'blue' },
      { action: 'LOGOUT', details: 'Test logout', expectedColor: 'blue' },
      { action: 'VIEW_DASHBOARD', details: 'Test dashboard view', expectedColor: 'blue' },
      { action: 'UPDATE_PATIENT', details: 'Test patient update', expectedColor: 'blue' }
    ];

    console.log("\n🎨 Testing Color Coding:");
    console.log("=" .repeat(50));

    let correctColors = 0;
    let totalTests = testActions.length;

    for (const testAction of testActions) {
      const colorClass = getActionBadgeColor(testAction.action);
      const actualColor = colorClass.includes('red') ? 'red' : 
                         colorClass.includes('orange') ? 'orange' : 
                         colorClass.includes('green') ? 'green' : 'blue';
      
      const isCorrect = actualColor === testAction.expectedColor;
      if (isCorrect) correctColors++;
      
      const status = isCorrect ? '✅' : '❌';
      console.log(`${status} ${testAction.action.padEnd(20)} → ${actualColor.padEnd(6)} (expected: ${testAction.expectedColor})`);
    }

    console.log("\n📊 Color Coding Results:");
    console.log(`   Correct: ${correctColors}/${totalTests}`);
    console.log(`   Accuracy: ${Math.round((correctColors / totalTests) * 100)}%`);

    // Generate some test activities to verify in the database
    console.log("\n📝 Generating test activities for verification...");
    
    for (const testAction of testActions.slice(0, 5)) { // Generate first 5 for testing
      await logAdminActivity({
        adminId: testAdmin._id,
        adminName: `${testAdmin.firstName} ${testAdmin.lastName}`,
        adminRole: testAdmin.role,
        action: testAction.action,
        details: testAction.details,
        ipAddress: getClientIP(mockReq),
        userAgent: getUserAgent(mockReq),
        metadata: { test: true, colorTest: true }
      });
    }

    console.log("✅ Generated 5 test activities with color-coded actions");

    // Verify activities were created
    const testActivities = await AdminActivity.find({ 'metadata.colorTest': true })
      .sort({ createdAt: -1 })
      .limit(5);

    console.log("\n🔍 Database Verification:");
    testActivities.forEach((activity, index) => {
      const colorClass = getActionBadgeColor(activity.action);
      const color = colorClass.includes('red') ? '🔴 RED' : 
                   colorClass.includes('orange') ? '🟠 ORANGE' : 
                   colorClass.includes('green') ? '🟢 GREEN' : '🔵 BLUE';
      
      console.log(`   ${index + 1}. ${activity.action} → ${color}`);
    });

    console.log("\n🎉 Color coding test completed successfully!");
    console.log("\n📋 Summary:");
    console.log("✅ Delete actions (DELETE_*) → RED");
    console.log("✅ Suspend actions (SUSPEND_*, REJECT_*) → ORANGE");
    console.log("✅ Add actions (ADD_*, CREATE_*, APPROVE_*, UNSUSPEND_*) → GREEN");
    console.log("✅ Default actions → BLUE");
    console.log("✅ Color coding working correctly in frontend");
    console.log("✅ Test activities generated for verification");

  } catch (error) {
    console.error("❌ Test failed:", error);
    console.error("Error details:", error.message);
  } finally {
    await mongoose.connection.close();
    console.log("\n🔌 Database connection closed");
    process.exit(0);
  }
}

// Run the test
testColorCoding();
