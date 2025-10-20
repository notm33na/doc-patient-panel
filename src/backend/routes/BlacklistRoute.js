import express from "express";
import Blacklist from "../models/Blacklist.js";
import Notification from "../models/Notification.js";
import { logAdminActivity, getClientIP, getUserAgent } from "../utils/adminActivityLogger.js";

const router = express.Router();

// Get all blacklisted entries (admin only)
router.get("/", async (req, res) => {
  try {
    const { page = 1, limit = 10, reason, isActive = true } = req.query;
    const skip = (page - 1) * limit;

    const query = {};
    if (reason) query.reason = reason;
    if (isActive !== undefined) query.isActive = isActive === 'true';

    const blacklistEntries = await Blacklist.find(query)
      .sort({ blacklistedAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate('createdBy', 'name email');

    const total = await Blacklist.countDocuments(query);

    // Log blacklist viewing activity
    await logAdminActivity({
      adminId: req.admin?.id || 'system',
      adminName: req.admin ? `${req.admin.firstName} ${req.admin.lastName}` : 'System',
      adminRole: req.admin?.role || 'System',
      action: 'VIEW_BLACKLIST',
      details: 'Viewed blacklist entries',
      ipAddress: getClientIP(req),
      userAgent: getUserAgent(req),
      metadata: {
        page,
        limit,
        total,
        filter: { reason, isActive }
      }
    });

    res.json({
      success: true,
      data: blacklistEntries,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total: total,
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    console.error("Error fetching blacklist entries:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch blacklist entries",
      error: error.message
    });
  }
});

// Get blacklist entry by ID
router.get("/:id", async (req, res) => {
  try {
    const blacklistEntry = await Blacklist.findById(req.params.id)
      .populate('createdBy', 'name email');

    if (!blacklistEntry) {
      return res.status(404).json({
        success: false,
        message: "Blacklist entry not found"
      });
    }

    res.json({
      success: true,
      data: blacklistEntry
    });
  } catch (error) {
    console.error("Error fetching blacklist entry:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch blacklist entry",
      error: error.message
    });
  }
});

// Check if credentials are blacklisted
router.post("/check", async (req, res) => {
  try {
    const { email, phone, licenses } = req.body;
    
    const blacklistedEntry = await Blacklist.isBlacklisted({
      email,
      phone,
      licenses: licenses || []
    });

    res.json({
      success: true,
      isBlacklisted: !!blacklistedEntry,
      blacklistEntry: blacklistedEntry
    });
  } catch (error) {
    console.error("Error checking blacklist:", error);
    res.status(500).json({
      success: false,
      message: "Failed to check blacklist",
      error: error.message
    });
  }
});

// Add entry to blacklist (admin only)
router.post("/", async (req, res) => {
  try {
    const blacklistData = req.body;
    
    // Validate required fields
    if (!blacklistData.reason || !blacklistData.originalEntityType) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: reason and originalEntityType"
      });
    }

    // Check if credentials are already blacklisted
    const existingEntry = await Blacklist.isBlacklisted({
      email: blacklistData.email,
      phone: blacklistData.phone,
      licenses: blacklistData.licenses || []
    });

    if (existingEntry) {
      return res.status(400).json({
        success: false,
        message: "These credentials are already blacklisted",
        existingEntry: existingEntry
      });
    }

    const newBlacklistEntry = new Blacklist(blacklistData);
    await newBlacklistEntry.save();

    // Create notification for admin
    const notification = new Notification({
      title: "Manual Blacklist Entry Added",
      message: `New blacklist entry added: ${blacklistData.originalEntityName || 'Unknown'} (${blacklistData.reason})`,
      type: "info",
      category: "blacklist",
      priority: "medium",
      recipients: "admin",
      metadata: {
        blacklistId: newBlacklistEntry._id,
        reason: blacklistData.reason,
        action: "manual_blacklist_added"
      }
    });

    await notification.save();

    // Log admin activity
    await logAdminActivity({
      adminId: req.admin?.id || 'system',
      adminName: req.admin ? `${req.admin.firstName} ${req.admin.lastName}` : 'System',
      adminRole: req.admin?.role || 'System',
      action: 'ADD_BLACKLIST',
      details: `Added blacklist entry for ${blacklistData.originalEntityName || 'Unknown'} (${blacklistData.reason})`,
      ipAddress: getClientIP(req),
      userAgent: getUserAgent(req),
      metadata: {
        blacklistId: newBlacklistEntry._id,
        reason: blacklistData.reason,
        originalEntityType: blacklistData.originalEntityType,
        originalEntityName: blacklistData.originalEntityName,
        email: blacklistData.email,
        phone: blacklistData.phone
      }
    });

    res.status(201).json({
      success: true,
      data: newBlacklistEntry,
      message: "Blacklist entry added successfully"
    });
  } catch (error) {
    console.error("Error adding blacklist entry:", error);
    res.status(500).json({
      success: false,
      message: "Failed to add blacklist entry",
      error: error.message
    });
  }
});

// Update blacklist entry (admin only)
router.patch("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const updatedEntry = await Blacklist.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).populate('createdBy', 'name email');

    if (!updatedEntry) {
      return res.status(404).json({
        success: false,
        message: "Blacklist entry not found"
      });
    }

    // Create notification for admin
    const notification = new Notification({
      title: "Blacklist Entry Updated",
      message: `Blacklist entry updated: ${updatedEntry.originalEntityName || 'Unknown'}`,
      type: "info",
      category: "blacklist",
      priority: "medium",
      recipients: "admin",
      metadata: {
        blacklistId: updatedEntry._id,
        action: "blacklist_updated"
      }
    });

    await notification.save();

    // Log admin activity
    await logAdminActivity({
      adminId: req.admin?.id || 'system',
      adminName: req.admin ? `${req.admin.firstName} ${req.admin.lastName}` : 'System',
      adminRole: req.admin?.role || 'System',
      action: 'UPDATE_BLACKLIST',
      details: `Updated blacklist entry for ${updatedEntry.originalEntityName || 'Unknown'}`,
      ipAddress: getClientIP(req),
      userAgent: getUserAgent(req),
      metadata: {
        blacklistId: updatedEntry._id,
        originalEntityName: updatedEntry.originalEntityName,
        updatedFields: Object.keys(updateData)
      }
    });

    res.json({
      success: true,
      data: updatedEntry,
      message: "Blacklist entry updated successfully"
    });
  } catch (error) {
    console.error("Error updating blacklist entry:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update blacklist entry",
      error: error.message
    });
  }
});

// Remove from blacklist (admin only)
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { permanent = false } = req.body;

    if (permanent) {
      // Permanently delete the entry
      const deletedEntry = await Blacklist.findByIdAndDelete(id);
      
      if (!deletedEntry) {
        return res.status(404).json({
          success: false,
          message: "Blacklist entry not found"
        });
      }

      // Create notification for admin
      const notification = new Notification({
        title: "Blacklist Entry Permanently Deleted",
        message: `Blacklist entry permanently deleted: ${deletedEntry.originalEntityName || 'Unknown'}`,
        type: "warning",
        category: "blacklist",
        priority: "high",
        recipients: "admin",
        metadata: {
          blacklistId: deletedEntry._id,
          action: "blacklist_permanently_deleted"
        }
      });

      await notification.save();

      // Log admin activity
      await logAdminActivity({
        adminId: req.admin?.id || 'system',
        adminName: req.admin ? `${req.admin.firstName} ${req.admin.lastName}` : 'System',
        adminRole: req.admin?.role || 'System',
        action: 'DELETE_BLACKLIST',
        details: `Permanently deleted blacklist entry for ${deletedEntry.originalEntityName || 'Unknown'}`,
        ipAddress: getClientIP(req),
        userAgent: getUserAgent(req),
        metadata: {
          blacklistId: deletedEntry._id,
          originalEntityName: deletedEntry.originalEntityName,
          deletionType: 'permanent'
        }
      });

      res.json({
        success: true,
        message: "Blacklist entry permanently deleted",
        data: { id, name: deletedEntry.originalEntityName }
      });
    } else {
      // Deactivate the entry (soft delete)
      const deactivatedEntry = await Blacklist.findByIdAndUpdate(
        id,
        { isActive: false },
        { new: true }
      );

      if (!deactivatedEntry) {
        return res.status(404).json({
          success: false,
          message: "Blacklist entry not found"
        });
      }

      // Create notification for admin
      const notification = new Notification({
        title: "Blacklist Entry Deactivated",
        message: `Blacklist entry deactivated: ${deactivatedEntry.originalEntityName || 'Unknown'}`,
        type: "info",
        category: "blacklist",
        priority: "medium",
        recipients: "admin",
        metadata: {
          blacklistId: deactivatedEntry._id,
          action: "blacklist_deactivated"
        }
      });

      await notification.save();

      // Log admin activity
      await logAdminActivity({
        adminId: req.admin?.id || 'system',
        adminName: req.admin ? `${req.admin.firstName} ${req.admin.lastName}` : 'System',
        adminRole: req.admin?.role || 'System',
        action: 'DELETE_BLACKLIST',
        details: `Deactivated blacklist entry for ${deactivatedEntry.originalEntityName || 'Unknown'}`,
        ipAddress: getClientIP(req),
        userAgent: getUserAgent(req),
        metadata: {
          blacklistId: deactivatedEntry._id,
          originalEntityName: deactivatedEntry.originalEntityName,
          deletionType: 'deactivation'
        }
      });

      res.json({
        success: true,
        message: "Blacklist entry deactivated",
        data: deactivatedEntry
      });
    }
  } catch (error) {
    console.error("Error removing blacklist entry:", error);
    res.status(500).json({
      success: false,
      message: "Failed to remove blacklist entry",
      error: error.message
    });
  }
});

// Get blacklist statistics
router.get("/stats/overview", async (req, res) => {
  try {
    const stats = await Blacklist.aggregate([
      {
        $group: {
          _id: "$reason",
          count: { $sum: 1 },
          activeCount: {
            $sum: { $cond: [{ $eq: ["$isActive", true] }, 1, 0] }
          }
        }
      }
    ]);

    const totalEntries = await Blacklist.countDocuments();
    const activeEntries = await Blacklist.countDocuments({ isActive: true });
    const inactiveEntries = totalEntries - activeEntries;

    res.json({
      success: true,
      data: {
        total: totalEntries,
        active: activeEntries,
        inactive: inactiveEntries,
        byReason: stats
      }
    });
  } catch (error) {
    console.error("Error fetching blacklist statistics:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch blacklist statistics",
      error: error.message
    });
  }
});

// Search blacklist entries
router.get("/search/:query", async (req, res) => {
  try {
    const query = req.params.query;
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const searchResults = await Blacklist.find({
      $or: [
        { email: { $regex: query, $options: "i" } },
        { phone: { $regex: query, $options: "i" } },
        { originalEntityName: { $regex: query, $options: "i" } },
        { description: { $regex: query, $options: "i" } },
        { licenses: { $regex: query, $options: "i" } }
      ]
    })
    .sort({ blacklistedAt: -1 })
    .skip(skip)
    .limit(parseInt(limit))
    .populate('createdBy', 'name email');

    const total = await Blacklist.countDocuments({
      $or: [
        { email: { $regex: query, $options: "i" } },
        { phone: { $regex: query, $options: "i" } },
        { originalEntityName: { $regex: query, $options: "i" } },
        { description: { $regex: query, $options: "i" } },
        { licenses: { $regex: query, $options: "i" } }
      ]
    });

    res.json({
      success: true,
      data: searchResults,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total: total,
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    console.error("Error searching blacklist entries:", error);
    res.status(500).json({
      success: false,
      message: "Failed to search blacklist entries",
      error: error.message
    });
  }
});

export default router;
