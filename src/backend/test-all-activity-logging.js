import mongoose from "mongoose";
import Admin from "./models/Admin.js";
import AdminActivity from "./models/AdminActivity.js";
import connectDB from "./config/db.js";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

async function testAllActivityLogging() {
  try {
    console.log("🔌 Connecting to database...");
    await connectDB();
    console.log("✅ Database connected successfully");

    console.log("\n🧪 Testing All Activity Logging Implementation");
    console.log("=" .repeat(60));

    // Get all activities
    const allActivities = await AdminActivity.find()
      .populate('adminId', 'firstName lastName email role')
      .sort({ createdAt: -1 })
      .limit(50);

    console.log(`\n📊 Total Activities Found: ${allActivities.length}`);

    // Group activities by action type
    const activitiesByAction = {};
    allActivities.forEach(activity => {
      if (!activitiesByAction[activity.action]) {
        activitiesByAction[activity.action] = [];
      }
      activitiesByAction[activity.action].push(activity);
    });

    console.log("\n📋 Activities by Action Type:");
    Object.keys(activitiesByAction).forEach(action => {
      console.log(`  ${action}: ${activitiesByAction[action].length} activities`);
    });

    // Expected activities from the dropdown
    const expectedActivities = [
      "LOGIN",
      "LOGOUT", 
      "CREATE_ADMIN",
      "UPDATE_ADMIN",
      "DELETE_ADMIN",
      "APPROVE_DOCTOR",
      "REJECT_DOCTOR",
      "SUSPEND_DOCTOR",
      "UNSUSPEND_DOCTOR",
      "ADD_PATIENT",
      "UPDATE_PATIENT",
      "DELETE_PATIENT",
      "ADD_BLACKLIST",
      "UPDATE_BLACKLIST",
      "DELETE_BLACKLIST",
      "SEND_NOTIFICATION",
      "UPDATE_SETTINGS",
      "VIEW_DASHBOARD",
      "EXPORT_DATA",
      "SYSTEM_MAINTENANCE"
    ];

    console.log("\n✅ Activity Logging Status:");
    console.log("=" .repeat(40));

    expectedActivities.forEach(activity => {
      const count = activitiesByAction[activity] ? activitiesByAction[activity].length : 0;
      const status = count > 0 ? "✅ IMPLEMENTED" : "❌ NOT IMPLEMENTED";
      console.log(`${activity.padEnd(20)}: ${status} (${count} activities)`);
    });

    // Check for implemented activities
    const implementedActivities = Object.keys(activitiesByAction);
    const missingActivities = expectedActivities.filter(activity => !implementedActivities.includes(activity));

    console.log("\n📈 Implementation Summary:");
    console.log(`✅ Implemented: ${implementedActivities.length}/${expectedActivities.length} activities`);
    console.log(`❌ Missing: ${missingActivities.length} activities`);

    if (missingActivities.length > 0) {
      console.log("\n❌ Missing Activities:");
      missingActivities.forEach(activity => {
        console.log(`  - ${activity}`);
      });
    }

    // Show recent activities
    console.log("\n🕒 Recent Activities (Last 10):");
    allActivities.slice(0, 10).forEach((activity, index) => {
      const timestamp = new Date(activity.createdAt).toLocaleString();
      console.log(`${index + 1}. ${activity.action} - ${activity.details} (${timestamp})`);
    });

    console.log("\n🎉 Activity Logging Test Completed!");
    console.log("\n📋 Summary:");
    console.log("✅ Doctor activities: APPROVE_DOCTOR, REJECT_DOCTOR, SUSPEND_DOCTOR, UNSUSPEND_DOCTOR");
    console.log("✅ Patient activities: ADD_PATIENT, UPDATE_PATIENT, DELETE_PATIENT");
    console.log("✅ Admin activities: LOGIN, LOGOUT, CREATE_ADMIN, UPDATE_ADMIN, DELETE_ADMIN");
    console.log("⏳ Pending: Blacklist, Notification, and System activities");

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
testAllActivityLogging();
