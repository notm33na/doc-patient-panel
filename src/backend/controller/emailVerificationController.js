import Admin from "../models/Admin.js";
import EmailVerificationToken from "../models/EmailVerificationToken.js";
import { sendEmail } from "../utils/emailService.js";
import { logAdminActivity, getClientIP, getUserAgent } from "../utils/adminActivityLogger.js";

// @desc   Request email verification OTP
// @route  POST /api/admins/request-email-verification
export const requestEmailVerification = async (req, res) => {
  try {
    const { newEmail } = req.body;
    const adminId = req.admin.id;

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newEmail)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    // Get current admin
    const admin = await Admin.findById(adminId);
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    // Check if new email is same as current email
    if (newEmail.toLowerCase() === admin.email.toLowerCase()) {
      return res.status(400).json({ message: "New email cannot be the same as current email" });
    }

    // Check if new email already exists
    const existingAdmin = await Admin.findOne({ email: newEmail.toLowerCase() });
    if (existingAdmin) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // Clean up any existing verification tokens for this admin
    await EmailVerificationToken.deleteMany({ adminId });

    // Generate OTP
    const otp = EmailVerificationToken.generateOTP();

    // Create verification token
    const verificationToken = new EmailVerificationToken({
      adminId,
      newEmail: newEmail.toLowerCase(),
      otp,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000) // 10 minutes
    });

    await verificationToken.save();

    // Send OTP email
    try {
      const emailResult = await sendEmail(newEmail, 'emailVerification', {
        adminName: `${admin.firstName} ${admin.lastName}`,
        otp: otp,
        currentEmail: admin.email,
        newEmail: newEmail
      });

      if (emailResult.success) {
        console.log('Email verification OTP sent successfully to:', newEmail);
      } else {
        console.error('Failed to send email verification OTP:', emailResult.error);
        return res.status(500).json({ message: "Failed to send verification email" });
      }
    } catch (emailError) {
      console.error('Error sending email verification OTP:', emailError);
      return res.status(500).json({ message: "Failed to send verification email" });
    }

    // Log email verification request activity
    await logAdminActivity({
      adminId: adminId,
      adminName: `${admin.firstName} ${admin.lastName}`,
      adminRole: admin.role,
      action: 'EMAIL_VERIFICATION_REQUEST',
      details: `Requested email verification for new email: ${newEmail}`,
      ipAddress: getClientIP(req),
      userAgent: getUserAgent(req),
      metadata: {
        currentEmail: admin.email,
        newEmail: newEmail,
        otpSent: true
      }
    });

    res.json({ 
      message: "Verification OTP sent to your new email address",
      expiresIn: "10 minutes"
    });

  } catch (error) {
    console.error("Request email verification error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc   Verify email with OTP
// @route  POST /api/admins/verify-email
export const verifyEmailWithOTP = async (req, res) => {
  try {
    const { otp } = req.body;
    const adminId = req.admin.id;

    if (!otp || otp.length !== 6) {
      return res.status(400).json({ message: "Valid 6-digit OTP is required" });
    }

    // Find verification token
    const verificationToken = await EmailVerificationToken.findOne({ 
      adminId,
      otp,
      used: false
    });

    if (!verificationToken) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // Check if token is valid and not expired
    if (!verificationToken.isValid()) {
      await verificationToken.incrementAttempts();
      return res.status(400).json({ message: "OTP has expired or exceeded maximum attempts" });
    }

    // Get admin
    const admin = await Admin.findById(adminId);
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    // Update admin email
    const oldEmail = admin.email;
    admin.email = verificationToken.newEmail;
    admin.lastActivity = new Date();
    await admin.save();

    // Mark token as used
    await verificationToken.markAsUsed();

    // Send confirmation email to new email
    try {
      const emailResult = await sendEmail(verificationToken.newEmail, 'emailChangeConfirmation', {
        adminName: `${admin.firstName} ${admin.lastName}`,
        newEmail: verificationToken.newEmail,
        oldEmail: oldEmail
      });

      if (emailResult.success) {
        console.log('Email change confirmation sent successfully to:', verificationToken.newEmail);
      } else {
        console.error('Failed to send email change confirmation:', emailResult.error);
      }
    } catch (emailError) {
      console.error('Error sending email change confirmation:', emailError);
      // Don't fail the process if confirmation email fails
    }

    // Send notification email to old email
    try {
      const emailResult = await sendEmail(oldEmail, 'emailChangeNotification', {
        adminName: `${admin.firstName} ${admin.lastName}`,
        newEmail: verificationToken.newEmail,
        oldEmail: oldEmail
      });

      if (emailResult.success) {
        console.log('Email change notification sent successfully to:', oldEmail);
      } else {
        console.error('Failed to send email change notification:', emailResult.error);
      }
    } catch (emailError) {
      console.error('Error sending email change notification:', emailError);
      // Don't fail the process if notification email fails
    }

    // Log email verification success activity
    await logAdminActivity({
      adminId: adminId,
      adminName: `${admin.firstName} ${admin.lastName}`,
      adminRole: admin.role,
      action: 'EMAIL_CHANGE_VERIFIED',
      details: `Successfully changed email from ${oldEmail} to ${verificationToken.newEmail}`,
      ipAddress: getClientIP(req),
      userAgent: getUserAgent(req),
      metadata: {
        oldEmail: oldEmail,
        newEmail: verificationToken.newEmail,
        verificationMethod: 'OTP'
      }
    });

    // Return admin without password
    const adminResponse = await Admin.findById(admin._id).select('-password');
    res.json({ 
      message: "Email successfully verified and updated",
      admin: adminResponse
    });

  } catch (error) {
    console.error("Verify email error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc   Resend email verification OTP
// @route  POST /api/admins/resend-email-verification
export const resendEmailVerification = async (req, res) => {
  try {
    const adminId = req.admin.id;

    // Find existing verification token
    const verificationToken = await EmailVerificationToken.findOne({ 
      adminId,
      used: false
    });

    if (!verificationToken) {
      return res.status(400).json({ message: "No pending email verification found" });
    }

    // Check if token is still valid
    if (!verificationToken.isValid()) {
      await verificationToken.deleteOne();
      return res.status(400).json({ message: "Verification token has expired. Please request a new one." });
    }

    // Get admin
    const admin = await Admin.findById(adminId);
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    // Generate new OTP
    const newOtp = EmailVerificationToken.generateOTP();
    verificationToken.otp = newOtp;
    verificationToken.expiresAt = new Date(Date.now() + 10 * 60 * 1000); // Reset expiration
    verificationToken.attempts = 0; // Reset attempts
    await verificationToken.save();

    // Send new OTP email
    try {
      const emailResult = await sendEmail(verificationToken.newEmail, 'emailVerification', {
        adminName: `${admin.firstName} ${admin.lastName}`,
        otp: newOtp,
        currentEmail: admin.email,
        newEmail: verificationToken.newEmail
      });

      if (emailResult.success) {
        console.log('Email verification OTP resent successfully to:', verificationToken.newEmail);
      } else {
        console.error('Failed to resend email verification OTP:', emailResult.error);
        return res.status(500).json({ message: "Failed to resend verification email" });
      }
    } catch (emailError) {
      console.error('Error resending email verification OTP:', emailError);
      return res.status(500).json({ message: "Failed to resend verification email" });
    }

    // Log resend activity
    await logAdminActivity({
      adminId: adminId,
      adminName: `${admin.firstName} ${admin.lastName}`,
      adminRole: admin.role,
      action: 'EMAIL_VERIFICATION_RESEND',
      details: `Resent email verification OTP for new email: ${verificationToken.newEmail}`,
      ipAddress: getClientIP(req),
      userAgent: getUserAgent(req),
      metadata: {
        newEmail: verificationToken.newEmail,
        otpResent: true
      }
    });

    res.json({ 
      message: "Verification OTP resent to your new email address",
      expiresIn: "10 minutes"
    });

  } catch (error) {
    console.error("Resend email verification error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc   Complete email change with OTP verification
// @route  POST /api/admins/complete-email-change
export const completeEmailChange = async (req, res) => {
  try {
    const { newEmail, otp } = req.body;
    const adminId = req.admin.id;

    if (!newEmail || !otp) {
      return res.status(400).json({ message: "New email and OTP are required" });
    }

    if (!otp || otp.length !== 6) {
      return res.status(400).json({ message: "Valid 6-digit OTP is required" });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newEmail)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    // Get admin
    const admin = await Admin.findById(adminId);
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    // Check if new email already exists
    const existingAdmin = await Admin.findOne({ email: newEmail.toLowerCase() });
    if (existingAdmin) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // Find verification token
    const verificationToken = await EmailVerificationToken.findOne({ 
      adminId,
      newEmail: newEmail.toLowerCase(),
      otp,
      used: false
    });

    if (!verificationToken) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // Check if token is valid and not expired
    if (!verificationToken.isValid()) {
      await verificationToken.incrementAttempts();
      return res.status(400).json({ message: "OTP has expired or exceeded maximum attempts" });
    }

    // Update admin email
    const oldEmail = admin.email;
    admin.email = newEmail.toLowerCase();
    admin.lastActivity = new Date();
    await admin.save();

    // Mark token as used
    await verificationToken.markAsUsed();

    // Send confirmation email to new email
    try {
      const emailResult = await sendEmail(newEmail, 'emailChangeConfirmation', {
        adminName: `${admin.firstName} ${admin.lastName}`,
        newEmail: newEmail,
        oldEmail: oldEmail
      });

      if (emailResult.success) {
        console.log('Email change confirmation sent successfully to:', newEmail);
      } else {
        console.error('Failed to send email change confirmation:', emailResult.error);
      }
    } catch (emailError) {
      console.error('Error sending email change confirmation:', emailError);
      // Don't fail the process if confirmation email fails
    }

    // Send notification email to old email
    try {
      const emailResult = await sendEmail(oldEmail, 'emailChangeNotification', {
        adminName: `${admin.firstName} ${admin.lastName}`,
        newEmail: newEmail,
        oldEmail: oldEmail
      });

      if (emailResult.success) {
        console.log('Email change notification sent successfully to:', oldEmail);
      } else {
        console.error('Failed to send email change notification:', emailResult.error);
      }
    } catch (emailError) {
      console.error('Error sending email change notification:', emailError);
      // Don't fail the process if notification email fails
    }

    // Log email verification success activity
    await logAdminActivity({
      adminId: adminId,
      adminName: `${admin.firstName} ${admin.lastName}`,
      adminRole: admin.role,
      action: 'EMAIL_CHANGE_VERIFIED',
      details: `Successfully changed email from ${oldEmail} to ${newEmail}`,
      ipAddress: getClientIP(req),
      userAgent: getUserAgent(req),
      metadata: {
        oldEmail: oldEmail,
        newEmail: newEmail,
        verificationMethod: 'OTP'
      }
    });

    // Return admin without password
    const adminResponse = await Admin.findById(admin._id).select('-password');
    res.json({ 
      message: "Email successfully verified and updated",
      admin: adminResponse
    });

  } catch (error) {
    console.error("Complete email change error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc   Cancel email verification
// @route  DELETE /api/admins/cancel-email-verification
export const cancelEmailVerification = async (req, res) => {
  try {
    const adminId = req.admin.id;

    // Find and delete verification token
    const verificationToken = await EmailVerificationToken.findOneAndDelete({ 
      adminId,
      used: false
    });

    if (!verificationToken) {
      return res.status(400).json({ message: "No pending email verification found" });
    }

    // Get admin
    const admin = await Admin.findById(adminId);
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    // Log cancellation activity
    await logAdminActivity({
      adminId: adminId,
      adminName: `${admin.firstName} ${admin.lastName}`,
      adminRole: admin.role,
      action: 'EMAIL_VERIFICATION_CANCELLED',
      details: `Cancelled email verification for new email: ${verificationToken.newEmail}`,
      ipAddress: getClientIP(req),
      userAgent: getUserAgent(req),
      metadata: {
        cancelledEmail: verificationToken.newEmail
      }
    });

    res.json({ message: "Email verification cancelled successfully" });

  } catch (error) {
    console.error("Cancel email verification error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
