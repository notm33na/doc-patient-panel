import express from "express";
import PendingDoctor from "../models/PendingDoctor.js";
import Doctor from "../models/Doctor.js";
import Notification from "../models/Notification.js";
import Blacklist from "../models/Blacklist.js";
import { sendEmail } from "../utils/emailService.js";
import { validatePhoneNumber, formatPhoneForStorage } from "../utils/phoneValidation.js";
import { logAdminActivity, getClientIP, getUserAgent } from "../utils/adminActivityLogger.js";

const router = express.Router();

// Get all pending doctors
router.get("/", async (req, res) => {
  try {
    const pendingDoctors = await PendingDoctor.find({});
    res.json({
      success: true,
      data: pendingDoctors,
      count: pendingDoctors.length
    });
  } catch (error) {
    console.error("Error fetching pending doctors:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch pending doctors",
      error: error.message
    });
  }
});

// Get pending doctor by ID
router.get("/:id", async (req, res) => {
  try {
    const pendingDoctor = await PendingDoctor.findById(req.params.id);
    if (!pendingDoctor) {
      return res.status(404).json({
        success: false,
        message: "Pending doctor not found"
      });
    }
    res.json({
      success: true,
      data: pendingDoctor
    });
  } catch (error) {
    console.error("Error fetching pending doctor:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch pending doctor",
      error: error.message
    });
  }
});

// Create new pending doctor
router.post("/", async (req, res) => {
  try {
    const pendingDoctorData = req.body;
    
    // Validate phone number
    if (pendingDoctorData.phone) {
      const phoneValidation = validatePhoneNumber(pendingDoctorData.phone);
      if (!phoneValidation.isValid) {
        return res.status(400).json({
          success: false,
          message: phoneValidation.error,
          field: "phone"
        });
      }
      // Format phone number for storage
      pendingDoctorData.phone = phoneValidation.formatted;
    }
    
    // Check if credentials are blacklisted
    const blacklistedEntry = await Blacklist.isBlacklisted({
      email: pendingDoctorData.email,
      phone: pendingDoctorData.phone,
      licenses: pendingDoctorData.licenses || []
    });
    
    if (blacklistedEntry) {
      // Create notification for admin about blacklist attempt
      const notification = new Notification({
        title: "Blacklisted Credentials Registration Attempt",
        message: `A candidate attempted to register with blacklisted credentials. Reason: ${blacklistedEntry.reason}. Registration blocked.`,
        type: "alert",
        category: "security",
        priority: "high",
        recipients: "admin",
        metadata: {
          blacklistReason: blacklistedEntry.reason,
          candidateName: pendingDoctorData.DoctorName,
          candidateEmail: pendingDoctorData.email,
          action: "registration_blocked_blacklist"
        }
      });
      
      await notification.save();
      
      return res.status(403).json({
        success: false,
        message: "Registration blocked: These credentials have been blacklisted and cannot be used for registration."
      });
    }
    
    // Check for duplicate email in both pending and approved doctors
    const existingEmailPending = await PendingDoctor.findOne({ email: pendingDoctorData.email });
    const existingEmailApproved = await Doctor.findOne({ email: pendingDoctorData.email });
    
    if (existingEmailPending || existingEmailApproved) {
      // Create notification for admin about duplicate email attempt
      const notification = new Notification({
        title: "Duplicate Email Registration Attempt",
        message: `A new candidate attempted to register with an existing email address: ${pendingDoctorData.email}. Registration blocked.`,
        type: "warning",
        category: "security",
        priority: "medium",
        recipients: "admin",
        metadata: {
          duplicateEmail: pendingDoctorData.email,
          candidateName: pendingDoctorData.DoctorName,
          action: "registration_blocked"
        }
      });
      
      await notification.save();
      
      return res.status(400).json({
        success: false,
        message: "A user with similar credentials exists. Please use a different email address."
      });
    }
    
    // Check for duplicate phone in both pending and approved doctors
    const existingPhonePending = await PendingDoctor.findOne({ phone: pendingDoctorData.phone });
    const existingPhoneApproved = await Doctor.findOne({ phone: pendingDoctorData.phone });
    
    if (existingPhonePending || existingPhoneApproved) {
      // Create notification for admin about duplicate phone attempt
      const notification = new Notification({
        title: "Duplicate Phone Registration Attempt",
        message: `A new candidate attempted to register with an existing phone number: ${pendingDoctorData.phone}. Registration blocked.`,
        type: "warning",
        category: "security",
        priority: "medium",
        recipients: "admin",
        metadata: {
          duplicatePhone: pendingDoctorData.phone,
          candidateName: pendingDoctorData.DoctorName,
          action: "registration_blocked"
        }
      });
      
      await notification.save();
      
      return res.status(400).json({
        success: false,
        message: "A user with similar credentials exists. Please use a different phone number."
      });
    }
    
    // Check for duplicate license numbers
    if (pendingDoctorData.licenses && Array.isArray(pendingDoctorData.licenses)) {
      const licenseNumbers = pendingDoctorData.licenses.filter(license => license.trim() !== "");
      
      for (const license of licenseNumbers) {
        // Check in pending doctors
        const existingLicensePending = await PendingDoctor.findOne({ 
          licenses: { $in: [license] } 
        });
        
        // Check in approved doctors
        const existingLicenseApproved = await Doctor.findOne({ 
          licenses: { $in: [license] } 
        });
        
        if (existingLicensePending || existingLicenseApproved) {
          // Find the conflicting doctor
          const conflictingDoctor = existingLicensePending || existingLicenseApproved;
          const isApproved = !!existingLicenseApproved;
          
          // If it's an approved doctor, suspend them indefinitely
          if (isApproved) {
            try {
              // Update doctor status to suspended
              await Doctor.findByIdAndUpdate(conflictingDoctor._id, {
                status: "suspended",
                suspensionReason: `License number conflict detected: ${license}. Suspended due to duplicate license registration.`,
                suspensionDate: new Date(),
                suspensionType: "indefinite"
              });
              
              console.log(`Doctor ${conflictingDoctor.DoctorName} suspended due to license conflict: ${license}`);
              
              // Create notification for admin about the suspension
              const notification = new Notification({
                title: "Doctor Suspended - License Conflict",
                message: `Doctor ${conflictingDoctor.DoctorName} has been automatically suspended due to license number conflict. License: ${license}. New candidate attempted to register with the same license.`,
                type: "alert",
                category: "security",
                priority: "high",
                recipients: "admin",
                relatedEntity: conflictingDoctor._id,
                relatedEntityType: "Doctor",
                metadata: {
                  conflictingLicense: license,
                  suspendedDoctor: conflictingDoctor.DoctorName,
                  newCandidateEmail: pendingDoctorData.email,
                  action: "automatic_suspension"
                }
              });
              
              await notification.save();
              console.log("Admin notification created for license conflict suspension");
              
            } catch (suspendError) {
              console.error("Error suspending doctor with duplicate license:", suspendError);
            }
          }
          
          return res.status(400).json({
            success: false,
            message: `License number "${license}" is already registered to another doctor. ${isApproved ? 'The existing doctor has been suspended due to this conflict.' : 'Please use a different license number.'}`,
            conflictingLicense: license,
            conflictingDoctor: conflictingDoctor.DoctorName,
            actionTaken: isApproved ? "existing_doctor_suspended" : "license_conflict_detected"
          });
        }
      }
    }
    
    // Create new pending doctor
    const newPendingDoctor = new PendingDoctor(pendingDoctorData);
    await newPendingDoctor.save();

    res.status(201).json({
      success: true,
      data: newPendingDoctor,
      message: "Pending doctor created successfully"
    });
  } catch (error) {
    console.error("Error creating pending doctor:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create pending doctor",
      error: error.message
    });
  }
});

// Approve pending doctor (move to main Doctor collection)
router.post("/:id/approve", async (req, res) => {
  try {
    console.log("Approving pending doctor with ID:", req.params.id);
    
    const pendingDoctor = await PendingDoctor.findById(req.params.id);
    if (!pendingDoctor) {
      console.log("Pending doctor not found:", req.params.id);
      return res.status(404).json({
        success: false,
        message: "Pending doctor not found"
      });
    }

    console.log("Found pending doctor:", {
      DoctorName: pendingDoctor.DoctorName,
      email: pendingDoctor.email,
      specialization: pendingDoctor.specialization,
      licenses: pendingDoctor.licenses
    });

    // Validate required fields
    if (!pendingDoctor.DoctorName || !pendingDoctor.email || !pendingDoctor.password || !pendingDoctor.phone) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: DoctorName, email, password, or phone"
      });
    }

    // Ensure specialization is not empty (but it's optional)
    let specializationValue = "";
    if (Array.isArray(pendingDoctor.specialization) && pendingDoctor.specialization.length > 0) {
      specializationValue = pendingDoctor.specialization.join(", ");
    } else if (typeof pendingDoctor.specialization === 'string' && pendingDoctor.specialization.trim()) {
      specializationValue = pendingDoctor.specialization;
    }
    // Note: specialization is optional, so we don't return an error if it's empty

    // Check if doctor with this email already exists
    const existingDoctor = await Doctor.findOne({ email: pendingDoctor.email });
    if (existingDoctor) {
      return res.status(400).json({
        success: false,
        message: "A doctor with this email already exists"
      });
    }

    // Create new doctor in main collection
    const newDoctor = new Doctor({
      DoctorName: pendingDoctor.DoctorName,
      email: pendingDoctor.email,
      password: pendingDoctor.password,
      phone: pendingDoctor.phone,
      specialization: Array.isArray(pendingDoctor.specialization) ? pendingDoctor.specialization : (specializationValue ? [specializationValue] : []),
      about: pendingDoctor.about || "",
      medicalDegree: Array.isArray(pendingDoctor.medicalDegree) ? pendingDoctor.medicalDegree : [],
      residency: Array.isArray(pendingDoctor.residency) ? pendingDoctor.residency : [],
      fellowship: Array.isArray(pendingDoctor.fellowship) ? pendingDoctor.fellowship : [],
      boardCertification: Array.isArray(pendingDoctor.boardCertification) ? pendingDoctor.boardCertification : [],
      licenses: Array.isArray(pendingDoctor.licenses) ? pendingDoctor.licenses : [],
      deaRegistration: "", // Not in PendingDoctor schema
      hospitalAffiliations: Array.isArray(pendingDoctor.hospitalAffiliations) ? pendingDoctor.hospitalAffiliations : [],
      memberships: Array.isArray(pendingDoctor.memberships) ? pendingDoctor.memberships : [],
      malpracticeInsurance: pendingDoctor.malpracticeInsurance || "",
      address: pendingDoctor.address || "",
      education: pendingDoctor.education || "",
      status: "approved",
      verified: true,
      verificationDate: new Date(),
      // Additional fields for compatibility
      department: Array.isArray(pendingDoctor.specialization) && pendingDoctor.specialization.length > 0 
        ? pendingDoctor.specialization[0] 
        : (specializationValue || ""),
      bio: pendingDoctor.about || "",
      experience: pendingDoctor.experience || "",
      addressStructured: {
        street: pendingDoctor.address || "",
        city: "",
        state: "",
        zipCode: "",
        country: "Pakistan"
      },
      // Additional fields for enhanced functionality
      profileImage: "",
      sentiment: "positive",
      sentiment_score: 0.8,
      no_of_patients: 0,
      qualifications: Array.isArray(pendingDoctor.specialization) ? pendingDoctor.specialization : (specializationValue ? [specializationValue] : []),
      languages: ["English", "Urdu"],
      consultationFee: 0,
      workingHours: {
        monday: { start: "09:00", end: "17:00" },
        tuesday: { start: "09:00", end: "17:00" },
        wednesday: { start: "09:00", end: "17:00" },
        thursday: { start: "09:00", end: "17:00" },
        friday: { start: "09:00", end: "15:00" },
        saturday: { start: "10:00", end: "14:00" },
        sunday: { start: "10:00", end: "14:00" }
      }
    });

    console.log("Creating new doctor with data:", {
      DoctorName: newDoctor.DoctorName,
      email: newDoctor.email,
      specialization: newDoctor.specialization,
      status: newDoctor.status
    });

    await newDoctor.save();
    console.log("New doctor saved successfully:", newDoctor._id);

    // Send approval email to candidate
    try {
      const emailResult = await sendEmail(pendingDoctor.email, 'approval', {
        candidateName: pendingDoctor.DoctorName
      });
      
      if (emailResult.success) {
        console.log('Approval email sent successfully to:', pendingDoctor.email);
      } else {
        console.error('Failed to send approval email:', emailResult.error);
      }
    } catch (emailError) {
      console.error('Error sending approval email:', emailError);
      // Don't fail the approval process if email fails
    }

    // Create notification for doctor approval
    try {
      const approvalNotification = new Notification({
        title: "Doctor Application Approved",
        message: `Doctor ${pendingDoctor.DoctorName} has been approved and added to the system. Email: ${pendingDoctor.email}`,
        type: "success",
        category: "candidates",
        priority: "high",
        recipients: "admin",
        relatedEntity: newDoctor._id,
        relatedEntityType: "Doctor",
        metadata: {
          doctorName: pendingDoctor.DoctorName,
          doctorEmail: pendingDoctor.email,
          specialization: pendingDoctor.specialization,
          action: "doctor_approved",
          approvedBy: req.user?.id || "system"
        }
      });
      
      await approvalNotification.save();
      console.log('Approval notification created successfully');
    } catch (notificationError) {
      console.error('Error creating approval notification:', notificationError);
      // Don't fail the approval process if notification fails
    }

    // Remove from pending collection
    await PendingDoctor.findByIdAndDelete(req.params.id);
    console.log("Pending doctor removed successfully:", req.params.id);

    // Log doctor approval activity
    await logAdminActivity({
      adminId: req.admin?.id || 'system',
      adminName: req.admin ? `${req.admin.firstName} ${req.admin.lastName}` : 'System',
      adminRole: req.admin?.role || 'System',
      action: 'APPROVE_DOCTOR',
      details: `Approved doctor application for ${pendingDoctor.DoctorName}`,
      ipAddress: getClientIP(req),
      userAgent: getUserAgent(req),
      metadata: {
        doctorId: newDoctor._id,
        doctorName: pendingDoctor.DoctorName,
        doctorEmail: pendingDoctor.email,
        specialization: pendingDoctor.specialization,
        approvedFromPending: true
      }
    });

    res.json({
      success: true,
      data: newDoctor,
      message: "Doctor approved and moved to main collection"
    });
  } catch (error) {
    console.error("Error approving pending doctor:", error);
    console.error("Error details:", {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    
    res.status(500).json({
      success: false,
      message: "Failed to approve pending doctor",
      error: error.message
    });
  }
});

// Reject pending doctor (remove from pending collection)
router.post("/:id/reject", async (req, res) => {
  try {
    const pendingDoctor = await PendingDoctor.findById(req.params.id);
    if (!pendingDoctor) {
      return res.status(404).json({
        success: false,
        message: "Pending doctor not found"
      });
    }

    // Get rejection reason from request body
    const rejectionReason = req.body.reason || '';

    // Check if this is the 3rd rejection for this email
    const rejectionCount = await PendingDoctor.countDocuments({ 
      email: pendingDoctor.email,
      status: "rejected" 
    });
    
    // If this would be the 3rd rejection, add to blacklist
    if (rejectionCount >= 2) { // 0-indexed, so 2 means this is the 3rd
      try {
        await Blacklist.addToBlacklist({
          email: pendingDoctor.email,
          phone: pendingDoctor.phone,
          licenses: pendingDoctor.licenses || [],
          reason: "candidate_rejected_multiple",
          originalEntityType: "PendingDoctor",
          originalEntityId: pendingDoctor._id,
          originalEntityName: pendingDoctor.DoctorName,
          description: `Candidate rejected 3 times. Last rejection reason: ${rejectionReason}`,
          rejectionCount: 3
        });
        
        console.log(`Candidate ${pendingDoctor.DoctorName} (${pendingDoctor.email}) blacklisted after 3rd rejection`);
        
        // Create notification for admin about blacklisting
        const blacklistNotification = new Notification({
          title: "Candidate Blacklisted - Multiple Rejections",
          message: `Candidate ${pendingDoctor.DoctorName} has been blacklisted after 3 rejections. Email: ${pendingDoctor.email}`,
          type: "alert",
          category: "security",
          priority: "high",
          recipients: "admin",
          metadata: {
            candidateName: pendingDoctor.DoctorName,
            candidateEmail: pendingDoctor.email,
            rejectionCount: 3,
            lastRejectionReason: rejectionReason,
            action: "candidate_blacklisted"
          }
        });
        
        await blacklistNotification.save();
        
      } catch (blacklistError) {
        console.error("Error adding candidate to blacklist:", blacklistError);
      }
    }

    // Send rejection email to candidate
    try {
      const emailResult = await sendEmail(pendingDoctor.email, 'rejection', {
        candidateName: pendingDoctor.DoctorName,
        reason: rejectionReason
      });
      
      if (emailResult.success) {
        console.log('Rejection email sent successfully to:', pendingDoctor.email);
      } else {
        console.error('Failed to send rejection email:', emailResult.error);
      }
    } catch (emailError) {
      console.error('Error sending rejection email:', emailError);
      // Don't fail the rejection process if email fails
    }

    // Create notification for doctor rejection
    try {
      const rejectionNotification = new Notification({
        title: "Doctor Application Rejected",
        message: `Doctor application for ${pendingDoctor.DoctorName} has been rejected. Email: ${pendingDoctor.email}. Reason: ${rejectionReason || 'No reason provided'}`,
        type: "warning",
        category: "candidates",
        priority: "medium",
        recipients: "admin",
        relatedEntity: pendingDoctor._id,
        relatedEntityType: "PendingDoctor",
        metadata: {
          doctorName: pendingDoctor.DoctorName,
          doctorEmail: pendingDoctor.email,
          rejectionReason: rejectionReason,
          rejectionCount: rejectionCount + 1,
          action: "doctor_rejected",
          rejectedBy: req.user?.id || "system"
        }
      });
      
      await rejectionNotification.save();
      console.log('Rejection notification created successfully');
    } catch (notificationError) {
      console.error('Error creating rejection notification:', notificationError);
      // Don't fail the rejection process if notification fails
    }

    // Remove from pending collection
    await PendingDoctor.findByIdAndDelete(req.params.id);

    // Log doctor rejection activity
    await logAdminActivity({
      adminId: req.admin?.id || 'system',
      adminName: req.admin ? `${req.admin.firstName} ${req.admin.lastName}` : 'System',
      adminRole: req.admin?.role || 'System',
      action: 'REJECT_DOCTOR',
      details: `Rejected doctor application for ${pendingDoctor.DoctorName}`,
      ipAddress: getClientIP(req),
      userAgent: getUserAgent(req),
      metadata: {
        doctorId: pendingDoctor._id,
        doctorName: pendingDoctor.DoctorName,
        doctorEmail: pendingDoctor.email,
        rejectionReason: rejectionReason,
        rejectionCount: rejectionCount + 1,
        blacklisted: rejectionCount >= 2
      }
    });

    res.json({
      success: true,
      message: "Pending doctor rejected and removed",
      data: { id: req.params.id, name: pendingDoctor.DoctorName }
    });
  } catch (error) {
    console.error("Error rejecting pending doctor:", error);
    res.status(500).json({
      success: false,
      message: "Failed to reject pending doctor",
      error: error.message
    });
  }
});

// Search pending doctors
router.get("/search/:query", async (req, res) => {
  try {
    const query = req.params.query;
    const pendingDoctors = await PendingDoctor.find({
      $or: [
        { DoctorName: { $regex: query, $options: "i" } },
        { specialization: { $regex: query, $options: "i" } },
        { email: { $regex: query, $options: "i" } }
      ]
    });
    
    res.json({
      success: true,
      data: pendingDoctors,
      count: pendingDoctors.length
    });
  } catch (error) {
    console.error("Error searching pending doctors:", error);
    res.status(500).json({
      success: false,
      message: "Failed to search pending doctors",
      error: error.message
    });
  }
});

export default router;
