import mongoose from "mongoose";
import Notification from "./models/Notification.js";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// MongoDB Atlas connection string
const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://7883:7883@tabeeb.wb8xjht.mongodb.net/Tabeeb";

// Sample notification data
const sampleNotifications = [
  {
    title: "New Doctor Registration",
    message: "Dr. Sarah Ahmed has registered and is awaiting approval",
    type: "info",
    category: "doctors",
    priority: "medium",
    recipients: "admin",
    read: false,
    metadata: {
      doctorId: "507f1f77bcf86cd799439011",
      doctorName: "Dr. Sarah Ahmed",
      action: "doctor_registration"
    }
  },
  {
    title: "Patient Appointment Scheduled",
    message: "New appointment scheduled for tomorrow at 2:00 PM",
    type: "success",
    category: "appointments",
    priority: "low",
    recipients: "admin",
    read: false,
    metadata: {
      appointmentId: "507f1f77bcf86cd799439012",
      patientName: "John Doe",
      doctorName: "Dr. Ahmed Hassan",
      appointmentTime: "2024-01-15T14:00:00Z",
      action: "appointment_scheduled"
    }
  },
  {
    title: "System Maintenance Required",
    message: "Database backup completed successfully. System performance is optimal.",
    type: "info",
    category: "system",
    priority: "low",
    recipients: "admin",
    read: true,
    metadata: {
      maintenanceType: "backup",
      duration: "2 hours",
      action: "maintenance_completed"
    }
  },
  {
    title: "Security Alert - Suspicious Activity",
    message: "Multiple failed login attempts detected from IP address 192.168.1.100",
    type: "alert",
    category: "security",
    priority: "high",
    recipients: "admin",
    read: false,
    metadata: {
      ipAddress: "192.168.1.100",
      attempts: 5,
      lastAttempt: "2024-01-15T10:30:00Z",
      action: "security_alert"
    }
  },
  {
    title: "Doctor Suspension Warning",
    message: "Dr. Muhammad Ali has reached 4 suspensions. Next suspension will result in automatic deletion.",
    type: "warning",
    category: "doctors",
    priority: "high",
    recipients: "admin",
    read: false,
    metadata: {
      doctorId: "507f1f77bcf86cd799439013",
      doctorName: "Dr. Muhammad Ali",
      suspensionCount: 4,
      action: "suspension_warning"
    }
  },
  {
    title: "Patient Feedback Received",
    message: "New patient feedback received for Dr. Fatima Khan - Rating: 5 stars",
    type: "success",
    category: "feedback",
    priority: "medium",
    recipients: "admin",
    read: false,
    metadata: {
      feedbackId: "507f1f77bcf86cd799439014",
      patientName: "Ayesha Malik",
      doctorName: "Dr. Fatima Khan",
      rating: 5,
      action: "feedback_received"
    }
  },
  {
    title: "Monthly Report Generated",
    message: "Monthly statistics report has been generated successfully",
    type: "info",
    category: "reports",
    priority: "low",
    recipients: "admin",
    read: true,
    metadata: {
      reportType: "monthly_stats",
      period: "2024-01",
      action: "report_generated"
    }
  },
  {
    title: "License Expiration Warning",
    message: "Dr. Hassan Raza's medical license expires in 30 days",
    type: "warning",
    category: "doctors",
    priority: "medium",
    recipients: "admin",
    read: false,
    metadata: {
      doctorId: "507f1f77bcf86cd799439015",
      doctorName: "Dr. Hassan Raza",
      licenseNumber: "PMC-56789",
      expirationDate: "2024-02-15",
      action: "license_expiration_warning"
    }
  },
  {
    title: "New Patient Registration",
    message: "New patient registered: Ayesha Malik",
    type: "info",
    category: "patients",
    priority: "low",
    recipients: "admin",
    read: false,
    metadata: {
      patientId: "507f1f77bcf86cd799439016",
      patientName: "Ayesha Malik",
      registrationDate: "2024-01-15T09:00:00Z",
      action: "patient_registration"
    }
  },
  {
    title: "Critical System Error",
    message: "Database connection timeout detected. System automatically recovered.",
    type: "alert",
    category: "system",
    priority: "critical",
    recipients: "admin",
    read: false,
    metadata: {
      errorType: "database_timeout",
      recoveryTime: "30 seconds",
      action: "system_error_recovered"
    }
  }
];

async function populateNotifications() {
  try {
    console.log("Connecting to MongoDB Atlas...");
    await mongoose.connect(MONGODB_URI);
    console.log("✅ Connected to MongoDB Atlas successfully!");

    // Clear existing notifications (optional - remove this if you want to keep existing data)
    console.log("Clearing existing notifications...");
    await Notification.deleteMany({});
    console.log("Existing notifications cleared.");

    // Insert sample notifications
    console.log("Inserting sample notifications...");
    const insertedNotifications = await Notification.insertMany(sampleNotifications);
    console.log(`Successfully inserted ${insertedNotifications.length} notifications!`);

    // Display inserted notifications
    console.log("\nInserted Notifications:");
    insertedNotifications.forEach((notification, index) => {
      console.log(`${index + 1}. ${notification.title} - ${notification.type} - ${notification.category} - ${notification.priority}`);
    });

    // Show statistics
    console.log("\n📊 Notification Statistics:");
    const stats = await Notification.aggregate([
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 },
          unreadCount: { $sum: { $cond: [{ $eq: ["$read", false] }, 1, 0] } }
        }
      }
    ]);

    stats.forEach(stat => {
      console.log(`   ${stat._id}: ${stat.count} total, ${stat.unreadCount} unread`);
    });

    console.log("\n✅ Admin_Notifications collection populated successfully!");
    
  } catch (error) {
    console.error("❌ Error populating notifications:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB Atlas.");
  }
}

// Run the population script
populateNotifications();
