import mongoose from "mongoose";

const adminSchema = new mongoose.Schema(
  {
    // Basic Information
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['Super Admin', 'Admin'], default: 'Admin' },
    isActive: { type: Boolean, default: true },
    profileImage: { type: String, default: "" },
    phone: { type: String, required: true },
    
    // Admin-specific fields
    permissions: [{ type: String }],
    loginAttempts: { type: Number, default: 0 },
    accountLocked: { type: Boolean, default: false },
    
    // System fields
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
    lastLogin: { type: Date },
    lastActivity: { type: Date }
  },
  { timestamps: true }
);

// Indexes for better performance
adminSchema.index({ email: 1 });
adminSchema.index({ phone: 1 });
adminSchema.index({ isActive: 1 });
adminSchema.index({ role: 1 });
adminSchema.index({ accountLocked: 1 });

// Use "Admin" collection
export default mongoose.model("Admin", adminSchema, "Admin");
