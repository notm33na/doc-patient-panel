import mongoose from "mongoose";

const patientSchema = new mongoose.Schema(
  {
    userRole: { type: String, default: "Patient" },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    emailAddress: { type: String, required: true, unique: true },
    phone: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profileImage: { type: String, default: "" },
    gender: { type: String, enum: ['Male', 'Female', 'Other'], required: true },
    Age: { type: String, required: true },
    
    address: {
      street: { type: String },
      city: { type: String },
      state: { type: String },
      zipCode: { type: String },
      country: { type: String, default: 'Pakistan' }
    },
    
    isActive: { type: String, default: "true" },
    
    // System fields
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    lastVisit: { type: Date },
    nextAppointment: { type: Date }
  },
  { timestamps: true }
);

// Indexes for better performance
patientSchema.index({ emailAddress: 1 });
patientSchema.index({ phone: 1 });
patientSchema.index({ isActive: 1 });

export default mongoose.model("Patient", patientSchema, "Patient");
