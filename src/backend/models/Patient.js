import mongoose from "mongoose";
import bcrypt from "bcryptjs";

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

// Hash password before saving
patientSchema.pre('save', async function(next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) {
    return next();
  }

  try {
    // Check if password is already hashed (starts with $2a$ or $2b$)
    if (this.password && (this.password.startsWith('$2a$') || this.password.startsWith('$2b$'))) {
      // Password is already hashed, don't hash again
      return next();
    }

    // Skip hashing for empty passwords or anonymized passwords
    if (!this.password || this.password === 'anonymous_password') {
      return next();
    }

    // Generate salt and hash password
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    console.error('Password hashing error:', error);
    next(error);
  }
});

// Indexes for better performance
patientSchema.index({ emailAddress: 1 });
patientSchema.index({ phone: 1 });
patientSchema.index({ isActive: 1 });

export default mongoose.model("Patient", patientSchema, "Patient");
