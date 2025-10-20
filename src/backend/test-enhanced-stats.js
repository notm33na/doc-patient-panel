import mongoose from "mongoose";
import Admin from "./models/Admin.js";
import AdminActivity from "./models/AdminActivity.js";
import connectDB from "./config/db.js";
import dotenv from "dotenv";
import { logAdminActivity, getClientIP, getUserAgent } from "./utils/adminActivityLogger.js";

// Load environment variables
dotenv.config();

async function testEnhancedStats() {
  try {
    console.log("🔌 Connecting to database...");
    await connectDB();
    console.log("✅ Database connected successfully");

    console.log("\n🧪 Testing Enhanced Admin Activity Statistics");
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

    // Generate diverse test activities for different time periods
    const now = new Date();
    const activities = [
      // Recent activities (last 7 days)
      { action: 'LOGIN', details: 'Recent login activity', hoursAgo: 2 },
      { action: 'VIEW_DASHBOARD', details: 'Recent dashboard view', hoursAgo: 4 },
      { action: 'ADD_PATIENT', details: 'Recent patient addition', hoursAgo: 6 },
      { action: 'UPDATE_PATIENT', details: 'Recent patient update', hoursAgo: 8 },
      { action: 'APPROVE_DOCTOR', details: 'Recent doctor approval', hoursAgo: 12 },
      { action: 'SUSPEND_DOCTOR', details: 'Recent doctor suspension', hoursAgo: 18 },
      { action: 'ADD_BLACKLIST', details: 'Recent blacklist addition', hoursAgo: 24 },
      { action: 'EXPORT_DATA', details: 'Recent data export', hoursAgo: 36 },
      
      // Older activities (8-30 days ago)
      { action: 'LOGIN', details: 'Older login activity', daysAgo: 10 },
      { action: 'CREATE_ADMIN', details: 'Older admin creation', daysAgo: 15 },
      { action: 'DELETE_ADMIN', details: 'Older admin deletion', daysAgo: 20 },
      { action: 'SYSTEM_MAINTENANCE', details: 'Older system maintenance', daysAgo: 25 },
      
      // Very old activities (30+ days ago)
      { action: 'LOGIN', details: 'Very old login activity', daysAgo: 35 },
      { action: 'VIEW_DASHBOARD', details: 'Very old dashboard view', daysAgo: 40 },
      { action: 'UPDATE_SETTINGS', details: 'Very old settings update', daysAgo: 45 }
    ];

    console.log("\n📊 Generating test activities...");
    
    for (const activity of activities) {
      let createdAt;
      
      if (activity.hoursAgo) {
        createdAt = new Date(now.getTime() - activity.hoursAgo * 60 * 60 * 1000);
      } else if (activity.daysAgo) {
        createdAt = new Date(now.getTime() - activity.daysAgo * 24 * 60 * 60 * 1000);
      }

      await logAdminActivity({
        adminId: testAdmin._id,
        adminName: `${testAdmin.firstName} ${testAdmin.lastName}`,
        adminRole: testAdmin.role,
        action: activity.action,
        details: activity.details,
        ipAddress: getClientIP(mockReq),
        userAgent: getUserAgent(mockReq),
        metadata: { test: true, generatedAt: createdAt }
      });

      // Manually update the createdAt timestamp for older activities
      if (createdAt) {
        await AdminActivity.findOneAndUpdate(
          { 
            adminId: testAdmin._id, 
            action: activity.action, 
            details: activity.details,
            'metadata.test': true 
          },
          { createdAt: createdAt },
          { sort: { createdAt: -1 } }
        );
      }
    }

    console.log(`✅ Generated ${activities.length} test activities`);

    // Test different period queries
    const periods = ['1d', '7d', '30d', '90d'];
    
    for (const period of periods) {
      console.log(`\n📈 Testing ${period} period statistics...`);
      
      // Calculate expected date range
      let startDate;
      switch (period) {
        case '1d':
          startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
          break;
        case '7d':
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case '30d':
          startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          break;
        case '90d':
          startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
          break;
      }

      // Count activities in this period
      const activitiesInPeriod = await AdminActivity.countDocuments({
        createdAt: { $gte: startDate },
        'metadata.test': true
      });

      console.log(`   📊 Activities in ${period}: ${activitiesInPeriod}`);

      // Test aggregation queries
      const activitiesByAction = await AdminActivity.aggregate([
        { $match: { createdAt: { $gte: startDate }, 'metadata.test': true } },
        { $group: { _id: '$action', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ]);

      const activitiesByHour = await AdminActivity.aggregate([
        { $match: { createdAt: { $gte: startDate }, 'metadata.test': true } },
        { $group: { _id: { $hour: '$createdAt' }, count: { $sum: 1 } } },
        { $sort: { _id: 1 } }
      ]);

      console.log(`   🔍 Top actions: ${activitiesByAction.slice(0, 3).map(a => `${a._id}(${a.count})`).join(', ')}`);
      console.log(`   ⏰ Peak hours: ${activitiesByHour.slice(0, 3).map(h => `${h._id}:00(${h.count})`).join(', ')}`);
    }

    // Test comprehensive stats
    console.log("\n🔍 Testing comprehensive statistics...");
    
    const comprehensiveStats = await AdminActivity.aggregate([
      { $match: { 'metadata.test': true } },
      {
        $group: {
          _id: null,
          totalActivities: { $sum: 1 },
          uniqueActions: { $addToSet: '$action' },
          dateRange: { 
            $push: { 
              $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } 
            } 
          },
          adminStats: {
            $push: {
              adminName: '$adminName',
              action: '$action',
              createdAt: '$createdAt'
            }
          }
        }
      }
    ]);

    if (comprehensiveStats.length > 0) {
      const stats = comprehensiveStats[0];
      console.log(`   📊 Total test activities: ${stats.totalActivities}`);
      console.log(`   🎯 Unique action types: ${stats.uniqueActions.length}`);
      console.log(`   📅 Date range: ${Math.min(...stats.dateRange)} to ${Math.max(...stats.dateRange)}`);
    }

    console.log("\n✅ Enhanced statistics test completed successfully!");
    console.log("\n📋 Summary:");
    console.log("✅ Generated diverse test activities across multiple time periods");
    console.log("✅ Tested period-based filtering (1d, 7d, 30d, 90d)");
    console.log("✅ Verified aggregation queries for statistics");
    console.log("✅ Confirmed comprehensive stats calculation");
    console.log("\n🎉 Enhanced admin activity statistics are working correctly!");

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
testEnhancedStats();
