import AdminActivity from "../models/AdminActivity.js";
import Admin from "../models/Admin.js";
import { logAdminActivity, getClientIP, getUserAgent } from "../utils/adminActivityLogger.js";

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

    // Log admin activity viewing
    await logAdminActivity({
      adminId: req.admin?.id || 'system',
      adminName: req.admin ? `${req.admin.firstName} ${req.admin.lastName}` : 'System',
      adminRole: req.admin?.role || 'System',
      action: 'VIEW_ADMIN_ACTIVITIES',
      details: 'Viewed admin activities list',
      ipAddress: getClientIP(req),
      userAgent: getUserAgent(req),
      metadata: {
        page,
        limit,
        filter: { adminId, action, startDate, endDate }
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
      case '90d':
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
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

    // Get comprehensive activity statistics
    const [
      totalActivities,
      totalActivitiesAllTime,
      activitiesByAction,
      activitiesByAdmin,
      activitiesByDay,
      activitiesByHour,
      recentActivities,
      criticalActions,
      loginStats,
      adminStats
    ] = await Promise.all([
      // Total activities in period
      AdminActivity.countDocuments(filteredFilter),
      
      // Total activities all time
      AdminActivity.countDocuments(isSuperAdmin ? {} : { action: { $nin: sensitiveActions } }),
      
      // Activities by action type
      AdminActivity.aggregate([
        { $match: filteredFilter },
        { $group: { _id: '$action', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 20 }
      ]),
      
      // Activities by admin
      AdminActivity.aggregate([
        { $match: filteredFilter },
        { $group: { _id: '$adminName', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 }
      ]),
      
      // Activities by day (for chart)
      AdminActivity.aggregate([
        { $match: filteredFilter },
        {
          $group: {
            _id: {
              $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
            },
            count: { $sum: 1 }
          }
        },
        { $sort: { _id: 1 } }
      ]),
      
      // Activities by hour (for peak hours analysis)
      AdminActivity.aggregate([
        { $match: filteredFilter },
        {
          $group: {
            _id: { $hour: "$createdAt" },
            count: { $sum: 1 }
          }
        },
        { $sort: { _id: 1 } }
      ]),
      
      // Recent activities
      AdminActivity.find(filteredFilter)
        .populate('adminId', 'firstName lastName email role')
        .sort({ createdAt: -1 })
        .limit(10),
      
      // Critical actions count
      AdminActivity.countDocuments({
        ...filteredFilter,
        action: { $in: ['SUSPEND_DOCTOR', 'REJECT_DOCTOR', 'DELETE_ADMIN', 'DELETE_PATIENT', 'ADD_BLACKLIST'] }
      }),
      
      // Login statistics
      AdminActivity.aggregate([
        { $match: { ...filteredFilter, action: 'LOGIN' } },
        {
          $group: {
            _id: {
              $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
            },
            count: { $sum: 1 }
          }
        },
        { $sort: { _id: -1 } },
        { $limit: 7 }
      ]),
      
      // Admin activity stats
      AdminActivity.aggregate([
        { $match: filteredFilter },
        {
          $group: {
            _id: '$adminId',
            adminName: { $first: '$adminName' },
            adminRole: { $first: '$adminRole' },
            totalActions: { $sum: 1 },
            lastActivity: { $max: '$createdAt' },
            uniqueActions: { $addToSet: '$action' }
          }
        },
        { $sort: { totalActions: -1 } },
        { $limit: 10 }
      ])
    ]);

    // Get current admin names to filter out historical admins
    const currentAdmins = await Admin.find({}).select('firstName lastName');
    const currentAdminNames = currentAdmins.map(admin => `${admin.firstName} ${admin.lastName}`);
    
    // Filter activitiesByAdmin to only include current admins
    const currentAdminActivities = activitiesByAdmin.filter(admin => 
      currentAdminNames.includes(admin._id)
    );

    // Create a comprehensive admin list that includes all current admins
    // even if they don't have activities in the current period
    const allCurrentAdmins = currentAdmins.map(admin => {
      const adminName = `${admin.firstName} ${admin.lastName}`;
      const activityData = currentAdminActivities.find(a => a._id === adminName);
      return {
        _id: adminName,
        count: activityData ? activityData.count : 0
      };
    }).sort((a, b) => b.count - a.count);

    // Process data based on user role
    let processedActivitiesByAdmin = allCurrentAdmins;
    let processedRecentActivities = recentActivities;
    let processedTotalActivities = totalActivities;
    let processedAdminStats = adminStats;

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

      // Anonymize admin stats
      processedAdminStats = adminStats.map(stat => ({
        ...stat,
        _id: 'anonymous',
        adminName: 'Admin User',
        adminRole: 'Admin'
      }));

      // Recalculate total activities excluding sensitive actions
      processedTotalActivities = await AdminActivity.countDocuments({ 
        createdAt: { $gte: startDate },
        action: { $nin: sensitiveActions }
      });
    }

    // Calculate additional metrics
    const averageActivitiesPerDay = processedTotalActivities / Math.max(1, Math.ceil((now - startDate) / (24 * 60 * 60 * 1000)));
    const peakHour = activitiesByHour.length > 0 ? activitiesByHour.reduce((max, hour) => hour.count > max.count ? hour : max) : null;
    const mostActiveAdmin = processedActivitiesByAdmin.length > 0 ? processedActivitiesByAdmin[0] : null;
    const mostCommonAction = activitiesByAction.length > 0 ? activitiesByAction[0] : null;

    // Calculate growth metrics (compare with previous period)
    const previousPeriodStart = new Date(startDate.getTime() - (now.getTime() - startDate.getTime()));
    const previousPeriodActivities = await AdminActivity.countDocuments({
      ...filteredFilter,
      createdAt: { $gte: previousPeriodStart, $lt: startDate }
    });
    
    const growthRate = previousPeriodActivities > 0 
      ? ((processedTotalActivities - previousPeriodActivities) / previousPeriodActivities * 100)
      : 0;

    res.json({
      success: true,
      data: {
        period,
        periodStart: startDate,
        periodEnd: now,
        
        // Core metrics
        totalActivities: processedTotalActivities,
        totalActivitiesAllTime,
        criticalActions,
        
        // Growth metrics
        growthRate: Math.round(growthRate * 100) / 100,
        averageActivitiesPerDay: Math.round(averageActivitiesPerDay * 100) / 100,
        
        // Breakdowns
        activitiesByAction,
        activitiesByAdmin: processedActivitiesByAdmin,
        activitiesByDay,
        activitiesByHour,
        recentActivities: processedRecentActivities,
        
        // Insights
        peakHour: peakHour ? { hour: peakHour._id, count: peakHour.count } : null,
        mostActiveAdmin: processedActivitiesByAdmin.length > 0 ? { 
          name: processedActivitiesByAdmin[0]._id, 
          count: processedActivitiesByAdmin[0].count 
        } : null,
        mostCommonAction: mostCommonAction ? { action: mostCommonAction._id, count: mostCommonAction.count } : null,
        
        // Login analytics
        loginStats,
        
        // Admin performance
        adminStats: processedAdminStats,
        
        // Security metrics
        securityMetrics: {
          totalLogins: activitiesByAction.find(a => a._id === 'LOGIN')?.count || 0,
          totalLogouts: activitiesByAction.find(a => a._id === 'LOGOUT')?.count || 0,
          failedLogins: 0, // Could be implemented with failed login tracking
          suspiciousActivities: criticalActions
        }
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
