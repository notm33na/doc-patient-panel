import mongoose from "mongoose";

const doctorSuspensionSchema = new mongoose.Schema(
  {
    doctorId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Doctor', 
      required: true 
    },
    suspensionType: { 
      type: String, 
      enum: ['temporary', 'permanent', 'investigation'], 
      default: 'temporary' 
    },
    status: { 
      type: String, 
      enum: ['active', 'expired', 'revoked', 'under_review'], 
      default: 'active' 
    },
    severity: { 
      type: String, 
      enum: ['minor', 'moderate', 'major', 'critical'], 
      default: 'major' 
    },
    reasons: [{ 
      type: String, 
      required: true 
    }],
    suspensionPeriod: {
      startDate: { 
        type: Date, 
        default: Date.now 
      },
      endDate: { 
        type: Date,
        default: null // null for indefinite suspensions
      },
      duration: { 
        type: Number, // Duration in days, null for indefinite
        default: 30 
      }
    },
    impact: {
      patientAccess: { 
        type: Boolean, 
        default: false 
      },
      appointmentScheduling: { 
        type: Boolean, 
        default: false 
      },
      prescriptionWriting: { 
        type: Boolean, 
        default: false 
      },
      systemAccess: { 
        type: Boolean, 
        default: false 
      }
    },
    suspendedBy: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User', 
      required: true 
    },
    reviewedBy: [{ 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User' 
    }],
    appealStatus: { 
      type: String, 
      enum: ['none', 'submitted', 'under_review', 'approved', 'rejected'], 
      default: 'none' 
    },
    appealNotes: { 
      type: String, 
      default: "" 
    },
    notificationSent: { 
      type: Boolean, 
      default: true 
    },
    doctorNotified: { 
      type: Boolean, 
      default: true 
    },
    patientsNotified: { 
      type: Boolean, 
      default: false 
    },
    publiclyVisible: { 
      type: Boolean, 
      default: false 
    }
  },
  { 
    timestamps: true 
  }
);

// Indexes for better query performance
doctorSuspensionSchema.index({ doctorId: 1 });
doctorSuspensionSchema.index({ status: 1 });
doctorSuspensionSchema.index({ suspensionType: 1 });
doctorSuspensionSchema.index({ severity: 1 });
doctorSuspensionSchema.index({ suspendedBy: 1 });
doctorSuspensionSchema.index({ createdAt: -1 });

const DoctorSuspension = mongoose.model('Doctor_Suspension', doctorSuspensionSchema, 'Doctor_Suspension');

export default DoctorSuspension;
