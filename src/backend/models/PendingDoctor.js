import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const pendingDoctorSchema = new mongoose.Schema(
  {
    // Basic Information
    DoctorName: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    phone: { type: String, required: true },
    
    // Specializations (Array)
    specialization: [{ type: String }],
    
    // License Information
    licenses: [{ type: String }],
    
    // Professional Information
    experience: { type: String, default: "" },
    about: { type: String, default: "" },
    
    // Medical Credentials (Arrays)
    medicalDegree: [{ type: String }],
    residency: [{ type: String }],
    fellowship: [{ type: String }],
    boardCertification: [{ type: String }],
    
    // Other Information (Arrays)
    hospitalAffiliations: [{ type: String }],
    memberships: [{ type: String }],
    malpracticeInsurance: { type: String, default: "" },
    
    // Address
    address: { type: String, default: "" },
    
    // Education
    education: { type: String, default: "" },
    
    // Status
    status: { type: String, default: "pending" },
    
    // System Fields
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
  },
  {
    timestamps: true,
    collection: 'Pending_Doctors'
  }
);

// Hash password before saving
pendingDoctorSchema.pre('save', async function(next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) {
    this.updatedAt = new Date();
    return next();
  }

  try {
    // Check if password is already hashed (starts with $2a$ or $2b$)
    if (this.password.startsWith('$2a$') || this.password.startsWith('$2b$')) {
      // Password is already hashed, don't hash again
      this.updatedAt = new Date();
      return next();
    }

    // Generate salt and hash password
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    this.updatedAt = new Date();
    next();
  } catch (error) {
    next(error);
  }
});

const PendingDoctor = mongoose.model('PendingDoctor', pendingDoctorSchema, 'Pending_Doctors');

export default PendingDoctor;
