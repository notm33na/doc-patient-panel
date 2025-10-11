import mongoose from "mongoose";

const suspensionSchema = new mongoose.Schema(
  {
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
      required: true,
    },

    suspensionType: {
      type: String,
      enum: ["temporary", "permanent"],
      required: true,
    },

    status: {
      type: String,
      enum: ["active", "lifted", "expired"],
      default: "active",
    },

    severity: {
      type: String,
      enum: ["minor", "moderate", "major", "critical"],
      default: "moderate",
    },

    reasons: [
      {
        category: { type: String, required: true },
        description: { type: String, required: true },
        severity: {
          type: String,
          enum: ["low", "medium", "high", "critical"],
          default: "medium",
        },
      },
    ],

    suspensionPeriod: {
      startDate: { type: Date },
      endDate: { type: Date },
      duration: { type: Number }, // in days
    },

    impact: {
      affectedPatients: { type: Number, default: 0 },
      cancelledAppointments: { type: Number, default: 0 },
    },

    suspendedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
    },

    reviewedBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Admin",
      },
    ],

    appealStatus: {
      type: String,
      enum: ["none", "under_review", "approved", "rejected"],
      default: "none",
    },

    appealNotes: { type: String },

    notificationSent: { type: Boolean, default: false },
    doctorNotified: { type: Boolean, default: false },
    patientsNotified: { type: Boolean, default: false },
    publiclyVisible: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

// export default mongoose.model("Suspension", suspensionSchema);
export default mongoose.model("Doctor_Suspension", suspensionSchema, "Doctor_Suspension");
