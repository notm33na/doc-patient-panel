import mongoose from "mongoose";
import crypto from "crypto";

const passwordResetTokenSchema = new mongoose.Schema(
  {
    adminId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Admin', 
      required: true 
    },
    token: { 
      type: String, 
      required: true,
      unique: true 
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
    createdAt: { 
      type: Date, 
      default: Date.now 
    }
  },
  { timestamps: true }
);

// Indexes for better performance
passwordResetTokenSchema.index({ token: 1 });
passwordResetTokenSchema.index({ adminId: 1 });
passwordResetTokenSchema.index({ expiresAt: 1 });
passwordResetTokenSchema.index({ used: 1 });

// Static method to generate a secure token
passwordResetTokenSchema.statics.generateToken = function() {
  return crypto.randomBytes(32).toString('hex');
};

// Static method to clean up expired tokens
passwordResetTokenSchema.statics.cleanupExpiredTokens = async function() {
  try {
    const result = await this.deleteMany({
      $or: [
        { expiresAt: { $lt: new Date() } },
        { used: true }
      ]
    });
    console.log(`Cleaned up ${result.deletedCount} expired password reset tokens`);
    return result.deletedCount;
  } catch (error) {
    console.error('Error cleaning up expired tokens:', error);
    return 0;
  }
};

// Instance method to check if token is valid
passwordResetTokenSchema.methods.isValid = function() {
  return !this.used && this.expiresAt > new Date();
};

// Instance method to mark token as used
passwordResetTokenSchema.methods.markAsUsed = function() {
  this.used = true;
  return this.save();
};

// Pre-save middleware to ensure token uniqueness
passwordResetTokenSchema.pre('save', async function(next) {
  if (this.isNew && this.token) {
    // Check if token already exists
    const existingToken = await this.constructor.findOne({ token: this.token });
    if (existingToken) {
      // Generate a new token if collision occurs
      this.token = this.constructor.generateToken();
    }
  }
  next();
});

export default mongoose.model("PasswordResetToken", passwordResetTokenSchema, "PasswordResetToken");
