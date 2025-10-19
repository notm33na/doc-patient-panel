import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema(
  {
    // Basic Information (matching existing MongoDB collection)
    DoctorName: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    phone: { type: String, required: true },
    
    // Professional Information
    specialization: [{ type: String }], // Changed from String to Array to match PendingDoctor (not required)
    about: { type: String, default: "" },
    medicalDegree: [{ type: String }], // Changed from String to Array to match PendingDoctor
    residency: [{ type: String }], // Changed from String to Array to match PendingDoctor
    fellowship: [{ type: String }], // Changed from String to Array to match PendingDoctor
    boardCertification: [{ type: String }], // Changed from String to Array to match PendingDoctor
    licenses: [{ type: String }], // Changed from String to Array to match PendingDoctor
    deaRegistration: { type: String, default: "" },
    hospitalAffiliations: [{ type: String }], // Changed from String to Array to match PendingDoctor
    memberships: [{ type: String }], // Changed from String to Array to match PendingDoctor
    malpracticeInsurance: { type: String, default: "" },
    address: { type: String, default: "" },
    education: { type: String, default: "" },
    
    // Status
    status: { 
      type: String, 
      enum: ['approved', 'pending', 'rejected', 'suspended'], 
      default: 'pending' 
    },
    
    // System Fields
    verified: { type: Boolean, default: false },
    verificationDate: { type: Date },
    
    // Additional fields for enhanced functionality (optional)
    profileImage: { type: String, default: "" },
    sentiment: { 
      type: String, 
      enum: ['positive', 'negative', 'neutral'], 
      default: 'positive' 
    },
    sentiment_score: { type: Number, default: 0, min: 0, max: 1 },
    no_of_patients: { type: Number, default: 0 },
    department: { type: String, default: "" },
    bio: { type: String },
    experience: { type: String },
    qualifications: [String],
    languages: [String],
    consultationFee: { type: Number },
    
    // Address (structured format for compatibility)
    addressStructured: {
      street: { type: String },
      city: { type: String },
      state: { type: String },
      zipCode: { type: String },
      country: { type: String, default: 'Pakistan' }
    },
    
    // Working Hours
    workingHours: {
      monday: { start: String, end: String },
      tuesday: { start: String, end: String },
      wednesday: { start: String, end: String },
      thursday: { start: String, end: String },
      friday: { start: String, end: String },
      saturday: { start: String, end: String },
      sunday: { start: String, end: String }
    },
    
    // System Fields
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    
    // Documents
    documents: [{
      type: { type: String }, // 'license', 'certificate', 'degree'
      fileName: { type: String },
      filePath: { type: String },
      uploadedAt: { type: Date, default: Date.now },
      verified: { type: Boolean, default: false }
    }]
  },
  { timestamps: true }
);

// Indexes for better performance
doctorSchema.index({ email: 1 });
doctorSchema.index({ DoctorName: 1 });
doctorSchema.index({ specialization: 1 });
doctorSchema.index({ department: 1 });
doctorSchema.index({ status: 1 });
doctorSchema.index({ sentiment: 1 });
doctorSchema.index({ no_of_patients: 1 });

export default mongoose.model("Doctor", doctorSchema, "Doctor");
