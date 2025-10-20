import mongoose from "mongoose";
import crypto from "crypto";

const emailVerificationTokenSchema = new mongoose.Schema(
  {
    adminId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Admin', 
      required: true 
    },
    newEmail: { 
      type: String, 
      required: true,
      lowercase: true,
      trim: true
    },
    otp: { 
      type: String, 
      required: true,
      length: 6
    },
    expiresAt: { 
      type: Date, 
      required: true,
      default: () => new Date(Date.now() + 10 * 60 * 1000) // 10 minutes from now
    },
    used: { 
      type: Boolean, 
      default: false 
    },
    attempts: {
      type: Number,
      default: 0,
      max: 3
    },
    createdAt: { 
      type: Date, 
      default: Date.now 
    }
  },
  { timestamps: true }
);

// Indexes for better performance
emailVerificationTokenSchema.index({ adminId: 1 });
emailVerificationTokenSchema.index({ newEmail: 1 });
emailVerificationTokenSchema.index({ otp: 1 });
emailVerificationTokenSchema.index({ expiresAt: 1 });
emailVerificationTokenSchema.index({ used: 1 });

// Static method to generate a 6-digit OTP
emailVerificationTokenSchema.statics.generateOTP = function() {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Static method to clean up expired tokens
emailVerificationTokenSchema.statics.cleanupExpiredTokens = async function() {
  try {
    const result = await this.deleteMany({
      $or: [
        { expiresAt: { $lt: new Date() } },
        { used: true },
        { attempts: { $gte: 3 } }
      ]
    });
    console.log(`Cleaned up ${result.deletedCount} expired email verification tokens`);
    return result.deletedCount;
  } catch (error) {
    console.error('Error cleaning up expired email verification tokens:', error);
    return 0;
  }
};

// Instance method to check if token is valid
emailVerificationTokenSchema.methods.isValid = function() {
  return !this.used && this.expiresAt > new Date() && this.attempts < 3;
};

// Instance method to mark token as used
emailVerificationTokenSchema.methods.markAsUsed = function() {
  this.used = true;
  return this.save();
};

// Instance method to increment attempts
emailVerificationTokenSchema.methods.incrementAttempts = function() {
  this.attempts += 1;
  return this.save();
};

// Pre-save middleware to ensure OTP uniqueness
emailVerificationTokenSchema.pre('save', async function(next) {
  if (this.isNew && this.otp) {
    // Check if OTP already exists and is still valid
    const existingToken = await this.constructor.findOne({ 
      otp: this.otp, 
      used: false,
      expiresAt: { $gt: new Date() }
    });
    if (existingToken) {
      // Generate a new OTP if collision occurs
      this.otp = this.constructor.generateOTP();
    }
  }
  next();
});

export default mongoose.model("EmailVerificationToken", emailVerificationTokenSchema);
