import AdminActivity from "../models/AdminActivity.js";
import Admin from "../models/Admin.js";

// @desc   Get all admin activities
// @route  GET /api/admin-activities
export const getAdminActivities = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const skip = (page - 1) * limit;

    // Get filter parameters
    const { adminId, action, startDate, endDate } = req.query;

    // Build filter object
    const filter = {};
    if (adminId) filter.adminId = adminId;
    if (action) filter.action = action;
    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) filter.createdAt.$lte = new Date(endDate);
    }

    const activities = await AdminActivity.find(filter)
      .populate('adminId', 'firstName lastName email role')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // Check if current user is Super Admin
    const currentUser = req.admin;
    const isSuperAdmin = currentUser && currentUser.role === 'Super Admin';

    // Define sensitive actions that regular admins shouldn't see
    const sensitiveActions = [
      'CREATE_ADMIN',
      'DELETE_ADMIN',
      'PROMOTE_ADMIN',
      'DEMOTE_ADMIN',
      'EXPORT_DATA',
      'SYSTEM_MAINTENANCE'
    ];

    // Filter and process activities based on user role
    let processedActivities = activities;
    let total = await AdminActivity.countDocuments(filter);

    if (!isSuperAdmin) {
      // For regular admins: filter out sensitive actions and anonymize remaining data
      processedActivities = activities
        .filter(activity => {
          // Allow all activities except sensitive ones
          // But anonymize admin management activities
          return !sensitiveActions.includes(activity.action);
        })
        .map(activity => {
          // If it's an admin management activity (UPDATE_ADMIN), anonymize it
          if (activity.action === 'UPDATE_ADMIN') {
            return {
              ...activity.toObject(),
              adminId: {
                _id: 'anonymous',
                firstName: 'Admin',
                lastName: 'User',
                email: 'admin@system.com',
                role: 'Admin'
              },
              adminName: 'Admin User',
              adminRole: 'Admin',
              ipAddress: '***.***.***.***',
              userAgent: 'Anonymous Browser',
              metadata: {} // Remove sensitive metadata
            };
          }
          // For other activities, show them as-is
          return activity.toObject();
        });
      
      // Recalculate total count excluding sensitive actions
      const filterWithSensitiveExclusion = { ...filter, action: { $nin: sensitiveActions } };
      total = await AdminActivity.countDocuments(filterWithSensitiveExclusion);
    }

    res.json({
      success: true,
      data: {
        activities: processedActivities,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalItems: total,
          itemsPerPage: limit
        }
      }
    });
  } catch (error) {
    console.error("Error fetching admin activities:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch admin activities",
      error: error.message
    });
  }
};

// @desc   Get admin activity statistics
// @route  GET /api/admin-activities/stats
export const getAdminActivityStats = async (req, res) => {
  try {
    const { period = '7d' } = req.query;
    
    // Calculate date range
    const now = new Date();
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
      default:
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    }

    // Define sensitive actions that regular admins shouldn't see
    const sensitiveActions = [
      'CREATE_ADMIN',
      'DELETE_ADMIN',
      'PROMOTE_ADMIN',
      'DEMOTE_ADMIN',
      'EXPORT_DATA',
      'SYSTEM_MAINTENANCE'
    ];

    // Check if current user is Super Admin
    const currentUser = req.admin;
    const isSuperAdmin = currentUser && currentUser.role === 'Super Admin';

    // Build base filter
    const baseFilter = { createdAt: { $gte: startDate } };
    const filteredFilter = isSuperAdmin ? baseFilter : { 
      ...baseFilter, 
      action: { $nin: sensitiveActions } 
    };

    // Get activity statistics
    const [
      totalActivities,
      activitiesByAction,
      activitiesByAdmin,
      recentActivities
    ] = await Promise.all([
      AdminActivity.countDocuments(filteredFilter),
      AdminActivity.aggregate([
        { $match: filteredFilter },
        { $group: { _id: '$action', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ]),
      AdminActivity.aggregate([
        { $match: filteredFilter },
        { $group: { _id: '$adminName', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 }
      ]),
      AdminActivity.find(filteredFilter)
        .populate('adminId', 'firstName lastName email role')
        .sort({ createdAt: -1 })
        .limit(10)
    ]);

    // Process data based on user role
    let processedActivitiesByAdmin = activitiesByAdmin;
    let processedRecentActivities = recentActivities;
    let processedTotalActivities = totalActivities;

    if (!isSuperAdmin) {
      // For regular admins: filter out sensitive actions and anonymize data
      
      // Filter out sensitive actions from recent activities
      processedRecentActivities = recentActivities
        .filter(activity => !sensitiveActions.includes(activity.action))
        .map(activity => {
          // If it's an admin management activity (UPDATE_ADMIN), anonymize it
          if (activity.action === 'UPDATE_ADMIN') {
            return {
              ...activity.toObject(),
              adminId: {
                _id: 'anonymous',
                firstName: 'Admin',
                lastName: 'User',
                email: 'admin@system.com',
                role: 'Admin'
              },
              adminName: 'Admin User',
              adminRole: 'Admin',
              ipAddress: '***.***.***.***',
              userAgent: 'Anonymous Browser',
              metadata: {}
            };
          }
          // For other activities, show them as-is
          return activity.toObject();
        });

      // Anonymize admin names in statistics
      processedActivitiesByAdmin = activitiesByAdmin.map(item => ({
        _id: 'Admin User',
        count: item.count
      }));

      // Recalculate total activities excluding sensitive actions
      processedTotalActivities = await AdminActivity.countDocuments({ 
        createdAt: { $gte: startDate },
        action: { $nin: sensitiveActions }
      });
    }

    res.json({
      success: true,
      data: {
        period,
        totalActivities: processedTotalActivities,
        activitiesByAction,
        activitiesByAdmin: processedActivitiesByAdmin,
        recentActivities: processedRecentActivities
      }
    });
  } catch (error) {
    console.error("Error fetching admin activity stats:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch admin activity statistics",
      error: error.message
    });
  }
};

// @desc   Get activities for a specific admin
// @route  GET /api/admin-activities/admin/:adminId
export const getAdminActivitiesByAdmin = async (req, res) => {
  try {
    const { adminId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const skip = (page - 1) * limit;

    const activities = await AdminActivity.find({ adminId })
      .populate('adminId', 'firstName lastName email role')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // Check if current user is Super Admin
    const currentUser = req.admin;
    const isSuperAdmin = currentUser && currentUser.role === 'Super Admin';

    // Define sensitive actions that regular admins shouldn't see
    const sensitiveActions = [
      'CREATE_ADMIN',
      'DELETE_ADMIN',
      'PROMOTE_ADMIN',
      'DEMOTE_ADMIN',
      'EXPORT_DATA',
      'SYSTEM_MAINTENANCE'
    ];

    // Filter and process activities based on user role
    let processedActivities = activities;
    let total = await AdminActivity.countDocuments({ adminId });

    if (!isSuperAdmin) {
      // For regular admins: filter out sensitive actions and anonymize remaining data
      processedActivities = activities
        .filter(activity => {
          // Allow all activities except sensitive ones
          return !sensitiveActions.includes(activity.action);
        })
        .map(activity => {
          // If it's an admin management activity (UPDATE_ADMIN), anonymize it
          if (activity.action === 'UPDATE_ADMIN') {
            return {
              ...activity.toObject(),
              adminId: {
                _id: 'anonymous',
                firstName: 'Admin',
                lastName: 'User',
                email: 'admin@system.com',
                role: 'Admin'
              },
              adminName: 'Admin User',
              adminRole: 'Admin',
              ipAddress: '***.***.***.***',
              userAgent: 'Anonymous Browser',
              metadata: {} // Remove sensitive metadata
            };
          }
          // For other activities, show them as-is
          return activity.toObject();
        });
      
      // Recalculate total count excluding sensitive actions
      total = await AdminActivity.countDocuments({ 
        adminId, 
        action: { $nin: sensitiveActions } 
      });
    }

    res.json({
      success: true,
      data: {
        activities: processedActivities,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalItems: total,
          itemsPerPage: limit
        }
      }
    });
  } catch (error) {
    console.error("Error fetching admin activities by admin:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch admin activities",
      error: error.message
    });
  }
};
