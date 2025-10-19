import express from "express";
import Notification from "../models/Notification.js";

const router = express.Router();

// Get all notifications
router.get("/", async (req, res) => {
  try {
    const { page = 1, limit = 10, category, priority, read } = req.query;
    const skip = (page - 1) * limit;

    // Check if current user is Super Admin
    const currentUser = req.admin;
    const isSuperAdmin = currentUser && currentUser.role === 'Super Admin';

    // Define sensitive categories that regular admins shouldn't see
    const sensitiveCategories = [
      'security',
      'system'
    ];

    const query = {};
    if (category) query.category = category;
    if (priority) query.priority = priority;
    if (read !== undefined) query.read = read === 'true';

    // Filter out sensitive categories for regular admins
    if (!isSuperAdmin) {
      query.category = { $nin: sensitiveCategories };
    }

    const notifications = await Notification.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Notification.countDocuments(query);

    res.json({
      success: true,
      data: notifications,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total,
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch notifications",
      error: error.message
    });
  }
});

// Get notification by ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const notification = await Notification.findById(id);

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found"
      });
    }

    res.json({
      success: true,
      data: notification
    });
  } catch (error) {
    console.error("Error fetching notification:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch notification",
      error: error.message
    });
  }
});

// Create new notification
router.post("/", async (req, res) => {
  try {
    const notificationData = req.body;
    
    // Validate required fields
    if (!notificationData.title || !notificationData.message || !notificationData.type) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: title, message, and type"
      });
    }

    const newNotification = new Notification(notificationData);
    await newNotification.save();

    res.status(201).json({
      success: true,
      data: newNotification,
      message: "Notification created successfully"
    });
  } catch (error) {
    console.error("Error creating notification:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create notification",
      error: error.message
    });
  }
});

// Mark notification as read
router.patch("/:id/read", async (req, res) => {
  try {
    const { id } = req.params;
    const { autoDelete = false } = req.body;
    
    const notification = await Notification.findByIdAndUpdate(
      id,
      { read: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found"
      });
    }

    // Auto-delete if requested
    if (autoDelete) {
      await Notification.findByIdAndDelete(id);
      return res.json({
        success: true,
        data: null,
        message: "Notification marked as read and deleted"
      });
    }

    res.json({
      success: true,
      data: notification,
      message: "Notification marked as read"
    });
  } catch (error) {
    console.error("Error marking notification as read:", error);
    res.status(500).json({
      success: false,
      message: "Failed to mark notification as read",
      error: error.message
    });
  }
});

// Mark all notifications as read
router.patch("/read-all", async (req, res) => {
  try {
    const { autoDelete = false } = req.body;
    
    if (autoDelete) {
      const deleteResult = await Notification.deleteMany({ read: true });
      return res.json({
        success: true,
        message: `All read notifications deleted (${deleteResult.deletedCount} notifications)`
      });
    }
    
    await Notification.updateMany({}, { read: true });

    res.json({
      success: true,
      message: "All notifications marked as read"
    });
  } catch (error) {
    console.error("Error marking all notifications as read:", error);
    res.status(500).json({
      success: false,
      message: "Failed to mark all notifications as read",
      error: error.message
    });
  }
});

// Delete old read notifications (older than specified days)
router.delete("/cleanup", async (req, res) => {
  try {
    const { daysOld = 7 } = req.body;
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysOld);
    
    const deleteResult = await Notification.deleteMany({
      read: true,
      updatedAt: { $lt: cutoffDate }
    });

    res.json({
      success: true,
      message: `Deleted ${deleteResult.deletedCount} old read notifications`,
      deletedCount: deleteResult.deletedCount
    });
  } catch (error) {
    console.error("Error cleaning up old notifications:", error);
    res.status(500).json({
      success: false,
      message: "Failed to clean up old notifications",
      error: error.message
    });
  }
});

// Delete notification
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedNotification = await Notification.findByIdAndDelete(id);

    if (!deletedNotification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found"
      });
    }

    res.json({
      success: true,
      message: "Notification deleted successfully",
      data: { id, title: deletedNotification.title }
    });
  } catch (error) {
    console.error("Error deleting notification:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete notification",
      error: error.message
    });
  }
});

// Get notification statistics
router.get("/stats", async (req, res) => {
  try {
    // Check if current user is Super Admin
    const currentUser = req.admin;
    const isSuperAdmin = currentUser && currentUser.role === 'Super Admin';

    // Define sensitive categories that regular admins shouldn't see
    const sensitiveCategories = [
      'security',
      'system'
    ];

    // Build base query
    const baseQuery = {};
    if (!isSuperAdmin) {
      baseQuery.category = { $nin: sensitiveCategories };
    }

    const total = await Notification.countDocuments(baseQuery);
    const unread = await Notification.countDocuments({ ...baseQuery, read: false });

    const byCategory = await Notification.aggregate([
      { $match: baseQuery },
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 },
          unreadCount: { $sum: { $cond: [{ $eq: ["$read", false] }, 1, 0] } }
        }
      },
      { $sort: { count: -1 } }
    ]);

    const byPriority = await Notification.aggregate([
      { $match: baseQuery },
      {
        $group: {
          _id: "$priority",
          count: { $sum: 1 },
          unreadCount: { $sum: { $cond: [{ $eq: ["$read", false] }, 1, 0] } }
        }
      },
      { $sort: { count: -1 } }
    ]);

    res.json({
      success: true,
      data: {
        total,
        unread,
        byCategory,
        byPriority
      }
    });
  } catch (error) {
    console.error("Error fetching notification statistics:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch notification statistics",
      error: error.message
    });
  }
});

// Search notifications
router.get("/search/:query", async (req, res) => {
  try {
    const { query } = req.params;
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    // Check if current user is Super Admin
    const currentUser = req.admin;
    const isSuperAdmin = currentUser && currentUser.role === 'Super Admin';

    // Define sensitive categories that regular admins shouldn't see
    const sensitiveCategories = [
      'security',
      'system'
    ];

    const searchRegex = new RegExp(query, 'i');
    const searchQuery = {
      $or: [
        { title: searchRegex },
        { message: searchRegex },
        { category: searchRegex }
      ]
    };

    // Add role-based filtering
    if (!isSuperAdmin) {
      searchQuery.category = { $nin: sensitiveCategories };
    }

    const notifications = await Notification.find(searchQuery)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Notification.countDocuments(searchQuery);

    res.json({
      success: true,
      data: notifications,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total,
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    console.error("Error searching notifications:", error);
    res.status(500).json({
      success: false,
      message: "Failed to search notifications",
      error: error.message
    });
  }
});

export default router;
