import AdminActivity from "../models/AdminActivity.js";

/**
 * Log admin activity to MongoDB Atlas
 * @param {Object} params - Activity parameters
 * @param {string} params.adminId - Admin ID
 * @param {string} params.adminName - Admin name
 * @param {string} params.adminRole - Admin role
 * @param {string} params.action - Action performed
 * @param {string} params.details - Action details
 * @param {string} params.ipAddress - IP address
 * @param {string} params.userAgent - User agent
 * @param {Object} params.metadata - Additional metadata
 */
export const logAdminActivity = async ({
  adminId,
  adminName,
  adminRole,
  action,
  details,
  ipAddress,
  userAgent,
  metadata = {}
}) => {
  try {
    const activity = new AdminActivity({
      adminId,
      adminName,
      adminRole,
      action,
      details,
      ipAddress,
      userAgent,
      metadata
    });

    await activity.save();
    console.log(`✅ Admin activity logged: ${action} by ${adminName}`);
  } catch (error) {
    console.error("❌ Failed to log admin activity:", error);
  }
};

/**
 * Get client IP address from request
 * @param {Object} req - Express request object
 * @returns {string} IP address
 */
export const getClientIP = (req) => {
  return req.ip || 
         req.connection.remoteAddress || 
         req.socket.remoteAddress ||
         (req.connection.socket ? req.connection.socket.remoteAddress : null) ||
         req.headers['x-forwarded-for']?.split(',')[0] ||
         '127.0.0.1';
};

/**
 * Get user agent from request
 * @param {Object} req - Express request object
 * @returns {string} User agent
 */
export const getUserAgent = (req) => {
  return req.headers['user-agent'] || 'Unknown';
};
