import mongoose from "mongoose";

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

// Update the updatedAt field before saving
pendingDoctorSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

const PendingDoctor = mongoose.model('PendingDoctor', pendingDoctorSchema, 'Pending_Doctors');

export default PendingDoctor;
