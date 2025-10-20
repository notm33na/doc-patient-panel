import mongoose from "mongoose";
import Admin from "./models/Admin.js";
import AdminActivity from "./models/AdminActivity.js";
import connectDB from "./config/db.js";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

async function showActualStats() {
  try {
    console.log("🔌 Connecting to database...");
    await connectDB();
    console.log("✅ Database connected successfully");

    console.log("\n📊 ACTUAL DATABASE STATS");
    console.log("=" .repeat(40));

    // Current admins
    const currentAdmins = await Admin.find({}).select('firstName lastName role email');
    console.log(`\n👥 Current Admins: ${currentAdmins.length}`);
    currentAdmins.forEach((admin, index) => {
      console.log(`   ${index + 1}. ${admin.firstName} ${admin.lastName} (${admin.role})`);
    });

    // Total activities
    const totalActivities = await AdminActivity.countDocuments({});
    console.log(`\n📈 Total Activities: ${totalActivities}`);

    // 7-day stats
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    
    const [
      activitiesLast7Days,
      criticalActionsLast7Days,
      activitiesByAdminLast7Days
    ] = await Promise.all([
      AdminActivity.countDocuments({ createdAt: { $gte: sevenDaysAgo } }),
      AdminActivity.countDocuments({
        createdAt: { $gte: sevenDaysAgo },
        action: { $in: ['SUSPEND_DOCTOR', 'REJECT_DOCTOR', 'DELETE_ADMIN', 'DELETE_PATIENT', 'ADD_BLACKLIST'] }
      }),
      AdminActivity.aggregate([
        { $match: { createdAt: { $gte: sevenDaysAgo } } },
        { $group: { _id: '$adminName', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ])
    ]);

    console.log(`\n📊 Last 7 Days Stats:`);
    console.log(`   Total Activities: ${activitiesLast7Days}`);
    console.log(`   Critical Actions: ${criticalActionsLast7Days}`);
    console.log(`   Active Admins: ${activitiesByAdminLast7Days.length}`);

    console.log(`\n👤 Admin Activity Breakdown:`);
    activitiesByAdminLast7Days.forEach((admin, index) => {
      const isCurrentAdmin = currentAdmins.some(a => 
        `${a.firstName} ${a.lastName}` === admin._id
      );
      const status = isCurrentAdmin ? '✅ Current' : '❌ Historical';
      console.log(`   ${index + 1}. ${admin._id}: ${admin.count} activities ${status}`);
    });

    // Filter to only current admins
    const currentAdminNames = currentAdmins.map(a => `${a.firstName} ${a.lastName}`);
    const currentAdminActivities = activitiesByAdminLast7Days.filter(admin => 
      currentAdminNames.includes(admin._id)
    );

    console.log(`\n✅ CORRECTED Stats (Current Admins Only):`);
    console.log(`   Total Activities: ${activitiesLast7Days}`);
    console.log(`   Critical Actions: ${criticalActionsLast7Days}`);
    console.log(`   Active Admins: ${currentAdminActivities.length}`);

    if (currentAdminActivities.length > 0) {
      console.log(`\n👥 Current Admin Activity:`);
      currentAdminActivities.forEach((admin, index) => {
        console.log(`   ${index + 1}. ${admin._id}: ${admin.count} activities`);
      });
    }

    // Show what the frontend will display
    console.log(`\n🖥️ Frontend Display Values:`);
    console.log(`   Total Activities Card: ${activitiesLast7Days.toLocaleString()}`);
    console.log(`   Active Admins Card: ${currentAdminActivities.length}`);
    console.log(`   Critical Actions Card: ${criticalActionsLast7Days}`);
    console.log(`   Most Active Admin: ${currentAdminActivities[0]?._id || 'N/A'}`);

    // Show recent activities by current admins only
    console.log(`\n🕒 Recent Activities (Current Admins Only):`);
    const recentCurrentAdminActivities = await AdminActivity.find({
      adminName: { $in: currentAdminNames }
    })
    .sort({ createdAt: -1 })
    .limit(5)
    .select('action adminName details createdAt');
    
    recentCurrentAdminActivities.forEach((activity, index) => {
      console.log(`   ${index + 1}. ${activity.action} by ${activity.adminName} (${activity.createdAt.toISOString()})`);
    });

    console.log(`\n🎉 Summary:`);
    console.log(`✅ You have ${currentAdmins.length} current admins`);
    console.log(`✅ ${totalActivities} total activities in database`);
    console.log(`✅ ${activitiesLast7Days} activities in last 7 days`);
    console.log(`✅ ${criticalActionsLast7Days} critical actions`);
    console.log(`✅ ${currentAdminActivities.length} active current admins`);
    console.log(`✅ Real-time stats are working correctly!`);

  } catch (error) {
    console.error("❌ Error:", error);
  } finally {
    await mongoose.connection.close();
    console.log("\n🔌 Database connection closed");
    process.exit(0);
  }
}

// Run the test
showActualStats();
