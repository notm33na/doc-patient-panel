import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ["info", "warning", "alert", "success"],
    default: "info"
  },
  category: {
    type: String,
    enum: ["doctors", "patients", "system", "feedback", "appointments", "reports", "security", "approvals", "candidates", "suspensions", "blacklist"],
    default: "system"
  },
  read: {
    type: Boolean,
    default: false
  },
  priority: {
    type: String,
    enum: ["low", "medium", "high", "critical"],
    default: "medium"
  },
  recipients: {
    type: String,
    enum: ["all", "admin", "doctors", "patients", "staff"],
    default: "admin"
  },
  relatedEntity: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: "relatedEntityType"
  },
  relatedEntityType: {
    type: String,
    enum: ["Doctor", "Patient", "PendingDoctor", "User"]
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  }
}, {
  timestamps: true
});

// Index for efficient querying
notificationSchema.index({ read: 1, createdAt: -1 });
notificationSchema.index({ category: 1, createdAt: -1 });
notificationSchema.index({ recipients: 1, createdAt: -1 });

const Notification = mongoose.model("Notification", notificationSchema, "Admin_Notifications");

export default Notification;
