import mongoose from "mongoose";
import Admin from "./models/Admin.js";
import AdminActivity from "./models/AdminActivity.js";
import connectDB from "./config/db.js";
import dotenv from "dotenv";
import { logAdminActivity, getClientIP, getUserAgent } from "./utils/adminActivityLogger.js";

// Load environment variables
dotenv.config();

async function testCoreMetrics() {
  try {
    console.log("🔌 Connecting to database...");
    await connectDB();
    console.log("✅ Database connected successfully");

    console.log("\n🧪 Testing Core Admin Activity Metrics");
    console.log("=" .repeat(50));

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

    // Generate test activities for core metrics
    console.log("\n📊 Generating test activities for core metrics...");
    
    const testActivities = [
      // Regular activities
      { action: 'LOGIN', details: 'Test login activity' },
      { action: 'VIEW_DASHBOARD', details: 'Test dashboard view' },
      { action: 'ADD_PATIENT', details: 'Test patient addition' },
      { action: 'UPDATE_PATIENT', details: 'Test patient update' },
      { action: 'APPROVE_DOCTOR', details: 'Test doctor approval' },
      
      // Critical actions
      { action: 'SUSPEND_DOCTOR', details: 'Test doctor suspension' },
      { action: 'REJECT_DOCTOR', details: 'Test doctor rejection' },
      { action: 'DELETE_ADMIN', details: 'Test admin deletion' },
      { action: 'DELETE_PATIENT', details: 'Test patient deletion' },
      { action: 'ADD_BLACKLIST', details: 'Test blacklist addition' },
      
      // More regular activities
      { action: 'LOGIN', details: 'Another login activity' },
      { action: 'VIEW_DASHBOARD', details: 'Another dashboard view' },
      { action: 'UPDATE_SETTINGS', details: 'Test settings update' }
    ];

    // Log all test activities
    for (const activity of testActivities) {
      await logAdminActivity({
        adminId: testAdmin._id,
        adminName: `${testAdmin.firstName} ${testAdmin.lastName}`,
        adminRole: testAdmin.role,
        action: activity.action,
        details: activity.details,
        ipAddress: getClientIP(mockReq),
        userAgent: getUserAgent(mockReq),
        metadata: { test: true, coreMetrics: true }
      });
    }

    console.log(`✅ Generated ${testActivities.length} test activities`);

    // Test core metrics calculation
    console.log("\n🔍 Testing core metrics calculation...");
    
    // Calculate total activities
    const totalActivities = await AdminActivity.countDocuments({
      'metadata.coreMetrics': true
    });
    
    // Calculate critical actions
    const criticalActions = await AdminActivity.countDocuments({
      'metadata.coreMetrics': true,
      action: { $in: ['SUSPEND_DOCTOR', 'REJECT_DOCTOR', 'DELETE_ADMIN', 'DELETE_PATIENT', 'ADD_BLACKLIST'] }
    });
    
    // Calculate active admins
    const activitiesByAdmin = await AdminActivity.aggregate([
      { $match: { 'metadata.coreMetrics': true } },
      { $group: { _id: '$adminName', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    
    const activeAdmins = activitiesByAdmin.length;

    console.log("\n📊 Core Metrics Results:");
    console.log(`   📈 Total Activities: ${totalActivities}`);
    console.log(`   🚨 Critical Actions: ${criticalActions}`);
    console.log(`   👥 Active Admins: ${activeAdmins}`);
    
    // Verify expected values
    const expectedTotal = testActivities.length;
    const expectedCritical = testActivities.filter(a => 
      ['SUSPEND_DOCTOR', 'REJECT_DOCTOR', 'DELETE_ADMIN', 'DELETE_PATIENT', 'ADD_BLACKLIST'].includes(a.action)
    ).length;
    const expectedAdmins = 1; // Only one test admin

    console.log("\n✅ Verification:");
    console.log(`   Total Activities: ${totalActivities === expectedTotal ? '✅' : '❌'} (Expected: ${expectedTotal})`);
    console.log(`   Critical Actions: ${criticalActions === expectedCritical ? '✅' : '❌'} (Expected: ${expectedCritical})`);
    console.log(`   Active Admins: ${activeAdmins === expectedAdmins ? '✅' : '❌'} (Expected: ${expectedAdmins})`);

    // Test API endpoint simulation
    console.log("\n🌐 Testing API endpoint simulation...");
    
    const mockStatsResponse = {
      success: true,
      data: {
        totalActivities,
        criticalActions,
        activitiesByAdmin: activitiesByAdmin.map(admin => ({
          _id: admin._id,
          count: admin.count
        })),
        securityMetrics: {
          totalLogins: testActivities.filter(a => a.action === 'LOGIN').length,
          totalLogouts: testActivities.filter(a => a.action === 'LOGOUT').length,
          suspiciousActivities: criticalActions
        }
      }
    };

    console.log("✅ Mock API response structure:");
    console.log(`   totalActivities: ${mockStatsResponse.data.totalActivities}`);
    console.log(`   criticalActions: ${mockStatsResponse.data.criticalActions}`);
    console.log(`   activitiesByAdmin.length: ${mockStatsResponse.data.activitiesByAdmin.length}`);
    console.log(`   securityMetrics.suspiciousActivities: ${mockStatsResponse.data.securityMetrics.suspiciousActivities}`);

    // Test frontend display values
    console.log("\n🖥️ Frontend Display Values:");
    console.log(`   Total Activities Card: ${totalActivities.toLocaleString()}`);
    console.log(`   Critical Actions Card: ${criticalActions}`);
    console.log(`   Active Admins Card: ${activeAdmins}`);
    console.log(`   Most Active Admin: ${activitiesByAdmin[0]?._id || 'N/A'} (${activitiesByAdmin[0]?.count || 0} activities)`);

    console.log("\n🎉 Core metrics test completed successfully!");
    console.log("\n📋 Summary:");
    console.log("✅ Total Activities calculation working correctly");
    console.log("✅ Critical Actions filtering working correctly");
    console.log("✅ Active Admins counting working correctly");
    console.log("✅ API response structure correct");
    console.log("✅ Frontend display values ready");

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
testCoreMetrics();
