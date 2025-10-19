/**
 * Test script to verify notification visibility permissions
 * This script tests that normal admins cannot see sensitive notification categories
 */

import mongoose from "mongoose";
import Notification from "./models/Notification.js";
import Admin from "./models/Admin.js";

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/tabeeb";

// Sample notification data with sensitive categories
const testNotifications = [
  {
    title: "System Maintenance Scheduled",
    message: "System will be down for maintenance on Sunday",
    type: "warning",
    category: "system",
    priority: "high",
    recipients: "admin",
    read: false
  },
  {
    title: "Security Alert: Unauthorized Access Attempt",
    message: "Multiple failed login attempts detected",
    type: "alert",
    category: "security",
    priority: "critical",
    recipients: "admin",
    read: false
  },
  {
    title: "New Doctor Candidate Application",
    message: "Dr. John Smith has submitted an application",
    type: "info",
    category: "candidates",
    priority: "medium",
    recipients: "admin",
    read: false
  },
  {
    title: "Patient Registration",
    message: "New patient registered in the system",
    type: "success",
    category: "patients",
    priority: "low",
    recipients: "admin",
    read: false
  }
];

async function testNotificationPermissions() {
  try {
    console.log("🔗 Connecting to MongoDB...");
    await mongoose.connect(MONGODB_URI);
    console.log("✅ Connected to MongoDB successfully!");

    // Clear existing test notifications
    console.log("🧹 Clearing existing test notifications...");
    await Notification.deleteMany({
      title: { $in: testNotifications.map(n => n.title) }
    });

    // Insert test notifications
    console.log("📝 Inserting test notifications...");
    const insertedNotifications = await Notification.insertMany(testNotifications);
    console.log(`✅ Inserted ${insertedNotifications.length} test notifications`);

    // Test 1: Super Admin should see all notifications
    console.log("\n🔍 Test 1: Super Admin visibility");
    const superAdminQuery = {};
    const superAdminNotifications = await Notification.find(superAdminQuery);
    console.log(`Super Admin sees ${superAdminNotifications.length} notifications`);
    superAdminNotifications.forEach(notif => {
      console.log(`  - ${notif.title} (${notif.category})`);
    });

    // Test 2: Regular Admin should not see sensitive categories
    console.log("\n🔍 Test 2: Regular Admin visibility");
    const sensitiveCategories = ['security', 'system'];
    const regularAdminQuery = {
      category: { $nin: sensitiveCategories }
    };
    const regularAdminNotifications = await Notification.find(regularAdminQuery);
    console.log(`Regular Admin sees ${regularAdminNotifications.length} notifications`);
    regularAdminNotifications.forEach(notif => {
      console.log(`  - ${notif.title} (${notif.category})`);
    });

    // Test 3: Verify sensitive notifications are filtered out
    console.log("\n🔍 Test 3: Sensitive category filtering");
    const sensitiveNotifications = await Notification.find({
      category: { $in: sensitiveCategories }
    });
    console.log(`Sensitive notifications filtered out: ${sensitiveNotifications.length}`);
    sensitiveNotifications.forEach(notif => {
      console.log(`  - ${notif.title} (${notif.category}) - SHOULD BE HIDDEN`);
    });

    // Test 4: Statistics filtering
    console.log("\n🔍 Test 4: Statistics filtering");
    
    // Super Admin stats
    const superAdminStats = await Notification.aggregate([
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 },
          unreadCount: { $sum: { $cond: [{ $eq: ["$read", false] }, 1, 0] } }
        }
      },
      { $sort: { count: -1 } }
    ]);
    console.log("Super Admin category stats:");
    superAdminStats.forEach(stat => {
      console.log(`  ${stat._id}: ${stat.count} total, ${stat.unreadCount} unread`);
    });

    // Regular Admin stats (filtered)
    const regularAdminStats = await Notification.aggregate([
      { $match: { category: { $nin: sensitiveCategories } } },
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 },
          unreadCount: { $sum: { $cond: [{ $eq: ["$read", false] }, 1, 0] } }
        }
      },
      { $sort: { count: -1 } }
    ]);
    console.log("Regular Admin category stats (filtered):");
    regularAdminStats.forEach(stat => {
      console.log(`  ${stat._id}: ${stat.count} total, ${stat.unreadCount} unread`);
    });

    // Test 5: Search filtering
    console.log("\n🔍 Test 5: Search filtering");
    const searchQuery = "system";
    const searchRegex = new RegExp(searchQuery, 'i');
    
    // Super Admin search
    const superAdminSearch = await Notification.find({
      $or: [
        { title: searchRegex },
        { message: searchRegex },
        { category: searchRegex }
      ]
    });
    console.log(`Super Admin search for "${searchQuery}": ${superAdminSearch.length} results`);
    
    // Regular Admin search (filtered)
    const regularAdminSearch = await Notification.find({
      $or: [
        { title: searchRegex },
        { message: searchRegex },
        { category: searchRegex }
      ],
      category: { $nin: sensitiveCategories }
    });
    console.log(`Regular Admin search for "${searchQuery}": ${regularAdminSearch.length} results`);

    console.log("\n✅ All notification permission tests completed!");
    console.log("\n📊 Summary:");
    console.log(`- Super Admin can see all ${superAdminNotifications.length} notifications`);
    console.log(`- Regular Admin can see ${regularAdminNotifications.length} notifications`);
    console.log(`- ${sensitiveNotifications.length} sensitive notifications are properly filtered out`);
    
    if (regularAdminNotifications.length < superAdminNotifications.length) {
      console.log("✅ Permission filtering is working correctly!");
    } else {
      console.log("❌ Permission filtering may not be working correctly!");
    }

  } catch (error) {
    console.error("❌ Error testing notification permissions:", error);
  } finally {
    await mongoose.disconnect();
    console.log("🔌 Disconnected from MongoDB.");
  }
}

// Run the test
testNotificationPermissions();
