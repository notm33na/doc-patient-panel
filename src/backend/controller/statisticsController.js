// Statistics controller for dashboard analytics
import Admin from "../models/Admin.js";
import Doctor from "../models/Doctor.js";
import Patient from "../models/Patient.js";
import AdminActivity from "../models/AdminActivity.js";
import { logAdminActivity, getClientIP, getUserAgent } from "../utils/adminActivityLogger.js";

// @desc   Get dashboard statistics
// @route  GET /api/stats/dashboard
export const getDashboardStats = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const thirtyDaysAgo = new Date(today);
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // Get total counts
    const [
      totalDoctors,
      totalPatients,
      totalAdmins
    ] = await Promise.all([
      Doctor.countDocuments({ status: "approved" }),
      Patient.countDocuments(),
      Admin.countDocuments({ isActive: true })
    ]);

    // Get today's new entries
    const [
      newDoctorsToday,
      newPatientsToday,
      newAdminsToday
    ] = await Promise.all([
      Doctor.countDocuments({ 
        status: "approved", 
        createdAt: { $gte: today } 
      }),
      Patient.countDocuments({ createdAt: { $gte: today } }),
      Admin.countDocuments({ 
        isActive: true,
        createdAt: { $gte: today } 
      })
    ]);

    // Get counts from 7 days ago for growth calculation
    const [
      doctorsSevenDaysAgo,
      patientsSevenDaysAgo,
      adminsSevenDaysAgo
    ] = await Promise.all([
      Doctor.countDocuments({ 
        status: "approved", 
        createdAt: { $lt: sevenDaysAgo } 
      }),
      Patient.countDocuments({ createdAt: { $lt: sevenDaysAgo } }),
      Admin.countDocuments({ 
        isActive: true,
        createdAt: { $lt: sevenDaysAgo } 
      })
    ]);

    // Calculate growth percentages
    const calculateGrowth = (current, previous) => {
      if (previous === 0) return current > 0 ? 100 : 0;
      return Math.round(((current - previous) / previous) * 100);
    };

    const doctorGrowth = calculateGrowth(totalDoctors, doctorsSevenDaysAgo);
    const patientGrowth = calculateGrowth(totalPatients, patientsSevenDaysAgo);
    const adminGrowth = calculateGrowth(totalAdmins, adminsSevenDaysAgo);

    // Get recent activities (last 10)
    const recentActivities = await AdminActivity.find()
      .populate('adminId', 'firstName lastName')
      .sort({ timestamp: -1 })
      .limit(10)
      .select('action adminName timestamp details');

    // Get activity statistics
    const activityStats = await AdminActivity.aggregate([
      {
        $group: {
          _id: '$action',
          count: { $sum: 1 },
          lastPerformed: { $max: '$timestamp' }
        }
      },
      {
        $sort: { count: -1 }
      },
      {
        $limit: 5
      }
    ]);

    // Get daily stats for the last 7 days
    const dailyStats = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      const nextDay = new Date(date);
      nextDay.setDate(nextDay.getDate() + 1);
      
      const [
        dailyDoctors,
        dailyPatients,
        dailyActivities
      ] = await Promise.all([
        Doctor.countDocuments({ 
          status: "approved",
          createdAt: { $gte: date, $lt: nextDay } 
        }),
        Patient.countDocuments({ 
          createdAt: { $gte: date, $lt: nextDay } 
        }),
        AdminActivity.countDocuments({ 
          timestamp: { $gte: date, $lt: nextDay } 
        })
      ]);

      dailyStats.push({
        date: date.toISOString().split('T')[0],
        day: date.toLocaleDateString('en-US', { weekday: 'short' }),
        doctors: dailyDoctors,
        patients: dailyPatients,
        activities: dailyActivities
      });
    }

    res.json({
      success: true,
      data: {
        totals: {
          doctors: totalDoctors,
          patients: totalPatients,
          admins: totalAdmins,
          appointments: 0 // TODO: Implement appointments
        },
        today: {
          doctors: newDoctorsToday,
          patients: newPatientsToday,
          admins: newAdminsToday,
          appointments: 0 // TODO: Implement appointments
        },
        growth: {
          doctors: doctorGrowth,
          patients: patientGrowth,
          admins: adminGrowth,
          appointments: 0 // TODO: Implement appointments
        },
        recentActivities: recentActivities.map(activity => ({
          _id: activity._id,
          action: activity.action,
          adminName: activity.adminName,
          timestamp: activity.timestamp,
          details: activity.details
        })),
        activityStats,
        dailyStats
      }
    });

    // Log dashboard view activity
    await logAdminActivity({
      adminId: req.admin?.id || 'system',
      adminName: req.admin ? `${req.admin.firstName} ${req.admin.lastName}` : 'System',
      adminRole: req.admin?.role || 'System',
      action: 'VIEW_DASHBOARD',
      details: 'Viewed dashboard statistics',
      ipAddress: getClientIP(req),
      userAgent: getUserAgent(req),
      metadata: {
        statsType: 'dashboard',
        totalDoctors,
        totalPatients,
        totalAdmins
      }
    });
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard statistics",
      error: error.message
    });
  }
};

// @desc   Get traffic analytics data
// @route  GET /api/stats/traffic
export const getTrafficStats = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Generate traffic data for the last 7 days
    const trafficData = [];
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      const nextDay = new Date(date);
      nextDay.setDate(nextDay.getDate() + 1);
      
      // Get actual data for this day
      const [
        returningUsers,
        totalVisitors,
        appointments
      ] = await Promise.all([
        // For returning users, we'll use a mock calculation
        // In a real implementation, you'd track user sessions
        Math.floor(Math.random() * 20) + 10,
        // Total visitors would come from analytics service
        Math.floor(Math.random() * 50) + 50,
        // TODO: Implement appointments
        0
      ]);
      
      trafficData.push({
        day: date.toLocaleDateString('en-US', { weekday: 'short' }),
        date: date.toISOString().split('T')[0],
        visitors: totalVisitors,
        returning: returningUsers,
        appointments: appointments
      });
    }
    
    res.json({
      success: true,
      data: trafficData
    });
  } catch (error) {
    console.error("Error fetching traffic stats:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch traffic statistics",
      error: error.message
    });
  }
};

// @desc   Get patient trends data
// @route  GET /api/stats/patient-trends
export const getPatientTrends = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Generate patient trends data for the last 7 months
    const trendsData = [];
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setMonth(date.getMonth() - i);
      
      const nextMonth = new Date(date);
      nextMonth.setMonth(nextMonth.getMonth() + 1);
      
      const monthName = date.toLocaleDateString('en-US', { month: 'short' });
      
      // Get actual patient counts for this month
      const [
        monthlyPatients,
        monthlyTreatments
      ] = await Promise.all([
        Patient.countDocuments({ 
          createdAt: { $gte: date, $lt: nextMonth } 
        }),
        // For treatments, we'll use a mock calculation based on patients
        // In a real implementation, you'd have a separate treatments collection
        Patient.countDocuments({ 
          createdAt: { $gte: date, $lt: nextMonth } 
        }).then(count => {
          // If no patients, return 0, otherwise calculate treatments realistically
          if (count === 0) return 0;
          return Math.floor(count * (0.6 + Math.random() * 0.3));
        })
      ]);
      
      // Add some debugging
      console.log(`Month ${monthName}: ${monthlyPatients} patients, ${monthlyTreatments} treatments`);
      
      trendsData.push({
        month: monthName,
        patients: monthlyPatients,
        treatments: monthlyTreatments
      });
    }
    
    res.json({
      success: true,
      data: trendsData
    });
  } catch (error) {
    console.error("Error fetching patient trends:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch patient trends",
      error: error.message
    });
  }
};

// @desc   Get appointment overview data
// @route  GET /api/stats/appointments
export const getAppointmentOverview = async (req, res) => {
  try {
    // For now, return mock data since we don't have an appointments collection yet
    // In a real implementation, you would query your appointments collection
    
    const appointments = [
      {
        id: "1",
        patient: "Leslie Watson",
        location: "Main Clinic",
        checkIn: "09:27 AM",
        status: "Completed"
      },
      {
        id: "2",
        patient: "Darlene Robertson",
        location: "Branch Office",
        checkIn: "10:15 AM",
        status: "Re-Scheduled"
      },
      {
        id: "3",
        patient: "Jacob Jones",
        location: "Main Clinic",
        checkIn: "10:24 AM",
        status: "Completed"
      },
      {
        id: "4",
        patient: "Kathryn Murphy",
        location: "Branch Office",
        checkIn: "09:10 AM",
        status: "Completed"
      },
      {
        id: "5",
        patient: "Leslie Alexander",
        location: "Main Clinic",
        checkIn: "09:15 AM",
        status: "Completed"
      },
      {
        id: "6",
        patient: "Ronald Richards",
        location: "Branch Office",
        checkIn: "09:29 AM",
        status: "Completed"
      },
      {
        id: "7",
        patient: "Jenny Wilson",
        location: "Main Clinic",
        checkIn: "11:50 AM",
        status: "Re-Scheduled"
      }
    ];
    
    res.json({
      success: true,
      data: appointments
    });
  } catch (error) {
    console.error("Error fetching appointment overview:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch appointment overview",
      error: error.message
    });
  }
};
