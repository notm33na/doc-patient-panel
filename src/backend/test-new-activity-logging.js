import mongoose from "mongoose";
import Admin from "./models/Admin.js";
import AdminActivity from "./models/AdminActivity.js";
import Doctor from "./models/Doctor.js";
import Patient from "./models/Patient.js";
import Blacklist from "./models/Blacklist.js";
import connectDB from "./config/db.js";
import dotenv from "dotenv";
import { logAdminActivity, getClientIP, getUserAgent } from "./utils/adminActivityLogger.js";

// Load environment variables
dotenv.config();

async function testNewActivityLogging() {
  try {
    console.log("🔌 Connecting to database...");
    await connectDB();
    console.log("✅ Database connected successfully");

    console.log("\n🧪 Testing New Activity Logging Implementation");
    console.log("=" .repeat(60));

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

    // Test LOGOUT activity
    console.log("\n🔓 Testing LOGOUT activity...");
    await logAdminActivity({
      adminId: testAdmin._id,
      adminName: `${testAdmin.firstName} ${testAdmin.lastName}`,
      adminRole: testAdmin.role,
      action: 'LOGOUT',
      details: 'Test logout activity',
      ipAddress: getClientIP(mockReq),
      userAgent: getUserAgent(mockReq),
      metadata: { test: true }
    });
    console.log("✅ LOGOUT activity logged");

    // Test VIEW_DASHBOARD activity
    console.log("\n📊 Testing VIEW_DASHBOARD activity...");
    await logAdminActivity({
      adminId: testAdmin._id,
      adminName: `${testAdmin.firstName} ${testAdmin.lastName}`,
      adminRole: testAdmin.role,
      action: 'VIEW_DASHBOARD',
      details: 'Test dashboard view activity',
      ipAddress: getClientIP(mockReq),
      userAgent: getUserAgent(mockReq),
      metadata: { test: true, statsType: 'dashboard' }
    });
    console.log("✅ VIEW_DASHBOARD activity logged");

    // Test VIEW_ADMIN_ACTIVITIES activity
    console.log("\n📋 Testing VIEW_ADMIN_ACTIVITIES activity...");
    await logAdminActivity({
      adminId: testAdmin._id,
      adminName: `${testAdmin.firstName} ${testAdmin.lastName}`,
      adminRole: testAdmin.role,
      action: 'VIEW_ADMIN_ACTIVITIES',
      details: 'Test admin activities view activity',
      ipAddress: getClientIP(mockReq),
      userAgent: getUserAgent(mockReq),
      metadata: { test: true, page: 1, limit: 50 }
    });
    console.log("✅ VIEW_ADMIN_ACTIVITIES activity logged");

    // Test VIEW_DOCTORS activity
    console.log("\n👨‍⚕️ Testing VIEW_DOCTORS activity...");
    await logAdminActivity({
      adminId: testAdmin._id,
      adminName: `${testAdmin.firstName} ${testAdmin.lastName}`,
      adminRole: testAdmin.role,
      action: 'VIEW_DOCTORS',
      details: 'Test doctors view activity',
      ipAddress: getClientIP(mockReq),
      userAgent: getUserAgent(mockReq),
      metadata: { test: true, doctorCount: 5 }
    });
    console.log("✅ VIEW_DOCTORS activity logged");

    // Test VIEW_PATIENTS activity
    console.log("\n👥 Testing VIEW_PATIENTS activity...");
    await logAdminActivity({
      adminId: testAdmin._id,
      adminName: `${testAdmin.firstName} ${testAdmin.lastName}`,
      adminRole: testAdmin.role,
      action: 'VIEW_PATIENTS',
      details: 'Test patients view activity',
      ipAddress: getClientIP(mockReq),
      userAgent: getUserAgent(mockReq),
      metadata: { test: true, patientCount: 10 }
    });
    console.log("✅ VIEW_PATIENTS activity logged");

    // Test VIEW_BLACKLIST activity
    console.log("\n🚫 Testing VIEW_BLACKLIST activity...");
    await logAdminActivity({
      adminId: testAdmin._id,
      adminName: `${testAdmin.firstName} ${testAdmin.lastName}`,
      adminRole: testAdmin.role,
      action: 'VIEW_BLACKLIST',
      details: 'Test blacklist view activity',
      ipAddress: getClientIP(mockReq),
      userAgent: getUserAgent(mockReq),
      metadata: { test: true, blacklistCount: 3 }
    });
    console.log("✅ VIEW_BLACKLIST activity logged");

    // Test VIEW_NOTIFICATIONS activity
    console.log("\n🔔 Testing VIEW_NOTIFICATIONS activity...");
    await logAdminActivity({
      adminId: testAdmin._id,
      adminName: `${testAdmin.firstName} ${testAdmin.lastName}`,
      adminRole: testAdmin.role,
      action: 'VIEW_NOTIFICATIONS',
      details: 'Test notifications view activity',
      ipAddress: getClientIP(mockReq),
      userAgent: getUserAgent(mockReq),
      metadata: { test: true, notificationCount: 7 }
    });
    console.log("✅ VIEW_NOTIFICATIONS activity logged");

    // Test ADD_PATIENT activity
    console.log("\n👥 Testing ADD_PATIENT activity...");
    await logAdminActivity({
      adminId: testAdmin._id,
      adminName: `${testAdmin.firstName} ${testAdmin.lastName}`,
      adminRole: testAdmin.role,
      action: 'ADD_PATIENT',
      details: 'Test patient addition activity',
      ipAddress: getClientIP(mockReq),
      userAgent: getUserAgent(mockReq),
      metadata: { test: true, patientEmail: 'test-patient@example.com' }
    });
    console.log("✅ ADD_PATIENT activity logged");

    // Test UPDATE_PATIENT activity
    console.log("\n👥 Testing UPDATE_PATIENT activity...");
    await logAdminActivity({
      adminId: testAdmin._id,
      adminName: `${testAdmin.firstName} ${testAdmin.lastName}`,
      adminRole: testAdmin.role,
      action: 'UPDATE_PATIENT',
      details: 'Test patient update activity',
      ipAddress: getClientIP(mockReq),
      userAgent: getUserAgent(mockReq),
      metadata: { test: true, patientEmail: 'test-patient@example.com' }
    });
    console.log("✅ UPDATE_PATIENT activity logged");

    // Test DELETE_PATIENT activity
    console.log("\n👥 Testing DELETE_PATIENT activity...");
    await logAdminActivity({
      adminId: testAdmin._id,
      adminName: `${testAdmin.firstName} ${testAdmin.lastName}`,
      adminRole: testAdmin.role,
      action: 'DELETE_PATIENT',
      details: 'Test patient deletion activity',
      ipAddress: getClientIP(mockReq),
      userAgent: getUserAgent(mockReq),
      metadata: { test: true, patientEmail: 'deleted-patient@example.com' }
    });
    console.log("✅ DELETE_PATIENT activity logged");

    // Test APPROVE_DOCTOR activity
    console.log("\n👨‍⚕️ Testing APPROVE_DOCTOR activity...");
    await logAdminActivity({
      adminId: testAdmin._id,
      adminName: `${testAdmin.firstName} ${testAdmin.lastName}`,
      adminRole: testAdmin.role,
      action: 'APPROVE_DOCTOR',
      details: 'Test doctor approval activity',
      ipAddress: getClientIP(mockReq),
      userAgent: getUserAgent(mockReq),
      metadata: { test: true, doctorEmail: 'approved-doctor@example.com' }
    });
    console.log("✅ APPROVE_DOCTOR activity logged");

    // Test REJECT_DOCTOR activity
    console.log("\n👨‍⚕️ Testing REJECT_DOCTOR activity...");
    await logAdminActivity({
      adminId: testAdmin._id,
      adminName: `${testAdmin.firstName} ${testAdmin.lastName}`,
      adminRole: testAdmin.role,
      action: 'REJECT_DOCTOR',
      details: 'Test doctor rejection activity',
      ipAddress: getClientIP(mockReq),
      userAgent: getUserAgent(mockReq),
      metadata: { test: true, doctorEmail: 'rejected-doctor@example.com' }
    });
    console.log("✅ REJECT_DOCTOR activity logged");

    // Test SUSPEND_DOCTOR activity
    console.log("\n👨‍⚕️ Testing SUSPEND_DOCTOR activity...");
    await logAdminActivity({
      adminId: testAdmin._id,
      adminName: `${testAdmin.firstName} ${testAdmin.lastName}`,
      adminRole: testAdmin.role,
      action: 'SUSPEND_DOCTOR',
      details: 'Test doctor suspension activity',
      ipAddress: getClientIP(mockReq),
      userAgent: getUserAgent(mockReq),
      metadata: { test: true, doctorEmail: 'suspended-doctor@example.com' }
    });
    console.log("✅ SUSPEND_DOCTOR activity logged");

    // Test UNSUSPEND_DOCTOR activity
    console.log("\n👨‍⚕️ Testing UNSUSPEND_DOCTOR activity...");
    await logAdminActivity({
      adminId: testAdmin._id,
      adminName: `${testAdmin.firstName} ${testAdmin.lastName}`,
      adminRole: testAdmin.role,
      action: 'UNSUSPEND_DOCTOR',
      details: 'Test doctor unsuspension activity',
      ipAddress: getClientIP(mockReq),
      userAgent: getUserAgent(mockReq),
      metadata: { test: true, doctorEmail: 'unsuspended-doctor@example.com' }
    });
    console.log("✅ UNSUSPEND_DOCTOR activity logged");

    // Test ADD_BLACKLIST activity
    console.log("\n🚫 Testing ADD_BLACKLIST activity...");
    await logAdminActivity({
      adminId: testAdmin._id,
      adminName: `${testAdmin.firstName} ${testAdmin.lastName}`,
      adminRole: testAdmin.role,
      action: 'ADD_BLACKLIST',
      details: 'Test blacklist addition activity',
      ipAddress: getClientIP(mockReq),
      userAgent: getUserAgent(mockReq),
      metadata: { test: true, email: 'blacklisted@example.com' }
    });
    console.log("✅ ADD_BLACKLIST activity logged");

    // Test UPDATE_BLACKLIST activity
    console.log("\n🚫 Testing UPDATE_BLACKLIST activity...");
    await logAdminActivity({
      adminId: testAdmin._id,
      adminName: `${testAdmin.firstName} ${testAdmin.lastName}`,
      adminRole: testAdmin.role,
      action: 'UPDATE_BLACKLIST',
      details: 'Test blacklist update activity',
      ipAddress: getClientIP(mockReq),
      userAgent: getUserAgent(mockReq),
      metadata: { test: true, blacklistId: '507f1f77bcf86cd799439012' }
    });
    console.log("✅ UPDATE_BLACKLIST activity logged");

    // Test DELETE_BLACKLIST activity
    console.log("\n🚫 Testing DELETE_BLACKLIST activity...");
    await logAdminActivity({
      adminId: testAdmin._id,
      adminName: `${testAdmin.firstName} ${testAdmin.lastName}`,
      adminRole: testAdmin.role,
      action: 'DELETE_BLACKLIST',
      details: 'Test blacklist deletion activity',
      ipAddress: getClientIP(mockReq),
      userAgent: getUserAgent(mockReq),
      metadata: { test: true, blacklistId: '507f1f77bcf86cd799439013' }
    });
    console.log("✅ DELETE_BLACKLIST activity logged");

    // Test EXPORT_DATA activity
    console.log("\n📤 Testing EXPORT_DATA activity...");
    await logAdminActivity({
      adminId: testAdmin._id,
      adminName: `${testAdmin.firstName} ${testAdmin.lastName}`,
      adminRole: testAdmin.role,
      action: 'EXPORT_DATA',
      details: 'Test data export activity',
      ipAddress: getClientIP(mockReq),
      userAgent: getUserAgent(mockReq),
      metadata: { test: true, exportType: 'patients', format: 'csv' }
    });
    console.log("✅ EXPORT_DATA activity logged");

    // Test SYSTEM_MAINTENANCE activity
    console.log("\n🔧 Testing SYSTEM_MAINTENANCE activity...");
    await logAdminActivity({
      adminId: testAdmin._id,
      adminName: `${testAdmin.firstName} ${testAdmin.lastName}`,
      adminRole: testAdmin.role,
      action: 'SYSTEM_MAINTENANCE',
      details: 'Test system maintenance activity',
      ipAddress: getClientIP(mockReq),
      userAgent: getUserAgent(mockReq),
      metadata: { test: true, maintenanceType: 'database_cleanup' }
    });
    console.log("✅ SYSTEM_MAINTENANCE activity logged");

    // Now verify all activities were logged
    console.log("\n🔍 Verifying all activities were logged...");
    
    const testActivities = await AdminActivity.find({ 'metadata.test': true })
      .sort({ createdAt: -1 });

    console.log(`\n📊 Test Activities Found: ${testActivities.length}`);

    // Group by action
    const activitiesByAction = {};
    testActivities.forEach(activity => {
      if (!activitiesByAction[activity.action]) {
        activitiesByAction[activity.action] = [];
      }
      activitiesByAction[activity.action].push(activity);
    });

    console.log("\n📋 Test Activities by Action:");
    Object.keys(activitiesByAction).forEach(action => {
      console.log(`  ${action}: ${activitiesByAction[action].length} activities`);
    });

    // Expected activities
    const expectedActivities = [
      'LOGOUT', 'VIEW_DASHBOARD', 'VIEW_ADMIN_ACTIVITIES', 'VIEW_DOCTORS', 'VIEW_PATIENTS',
      'VIEW_BLACKLIST', 'VIEW_NOTIFICATIONS', 'ADD_PATIENT', 'UPDATE_PATIENT', 'DELETE_PATIENT',
      'APPROVE_DOCTOR', 'REJECT_DOCTOR', 'SUSPEND_DOCTOR', 'UNSUSPEND_DOCTOR',
      'ADD_BLACKLIST', 'UPDATE_BLACKLIST', 'DELETE_BLACKLIST', 'EXPORT_DATA', 'SYSTEM_MAINTENANCE'
    ];

    console.log("\n✅ Activity Verification:");
    expectedActivities.forEach(activity => {
      const count = activitiesByAction[activity] ? activitiesByAction[activity].length : 0;
      const status = count > 0 ? "✅ LOGGED" : "❌ MISSING";
      console.log(`${activity.padEnd(25)}: ${status}`);
    });

    const loggedCount = expectedActivities.filter(activity => 
      activitiesByAction[activity] && activitiesByAction[activity].length > 0
    ).length;

    console.log(`\n📈 Summary: ${loggedCount}/${expectedActivities.length} activities successfully logged`);

    if (loggedCount === expectedActivities.length) {
      console.log("\n🎉 All activities successfully logged! Admin activity tracking is working perfectly.");
    } else {
      console.log("\n⚠️  Some activities were not logged. Please check the implementation.");
    }

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
testNewActivityLogging();
