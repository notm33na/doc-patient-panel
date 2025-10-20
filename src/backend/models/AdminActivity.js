import mongoose from "mongoose";

const adminActivitySchema = new mongoose.Schema(
  {
    adminId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Admin', 
      required: true 
    },
    adminName: { 
      type: String, 
      required: true 
    },
    adminRole: { 
      type: String, 
      required: true 
    },
    action: { 
      type: String, 
      required: true,
      enum: [
        'LOGIN',
        'LOGOUT', 
        'CREATE_ADMIN',
        'UPDATE_ADMIN',
        'DELETE_ADMIN',
        'APPROVE_DOCTOR',
        'REJECT_DOCTOR',
        'SUSPEND_DOCTOR',
        'UNSUSPEND_DOCTOR',
        'ADD_PATIENT',
        'UPDATE_PATIENT',
        'ANONYMIZE_PATIENT',
        'DELETE_PATIENT',
        'ADD_BLACKLIST',
        'UPDATE_BLACKLIST',
        'DELETE_BLACKLIST',
        'SEND_NOTIFICATION',
        'UPDATE_SETTINGS',
        'VIEW_DASHBOARD',
        'EXPORT_DATA',
        'SYSTEM_MAINTENANCE',
        'PASSWORD_RESET_REQUEST',
        'PASSWORD_RESET_COMPLETE',
        'VIEW_ADMIN_ACTIVITIES',
        'VIEW_STATISTICS',
        'VIEW_BLACKLIST',
        'VIEW_DOCTORS',
        'VIEW_PATIENTS',
        'VIEW_NOTIFICATIONS'
      ]
    },
    details: { 
      type: String, 
      required: true 
    },
    ipAddress: { 
      type: String, 
      required: true 
    },
    userAgent: { 
      type: String, 
      required: true 
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    }
  },
  { timestamps: true }
);

// Indexes for better performance
adminActivitySchema.index({ adminId: 1 });
adminActivitySchema.index({ action: 1 });
adminActivitySchema.index({ timestamp: -1 });
adminActivitySchema.index({ createdAt: -1 });

// Use "AdminActivity" collection
export default mongoose.model("AdminActivity", adminActivitySchema, "AdminActivity");
