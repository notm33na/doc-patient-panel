import express from "express";
import Doctor from "../models/Doctor.js";
import DoctorSuspension from "../models/DoctorSuspension.js";
import Blacklist from "../models/Blacklist.js";
import Notification from "../models/Notification.js";

const router = express.Router();

// Get all doctors (only approved doctors)
router.get("/", async (req, res) => {
  try {
    const doctors = await Doctor.find({ status: "approved" }).select("-password");
    res.json({
      success: true,
      data: doctors,
      count: doctors.length
    });
  } catch (error) {
    console.error("Error fetching doctors:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch doctors",
      error: error.message
    });
  }
});

// Get all doctors for admin (including all statuses)
router.get("/admin/all", async (req, res) => {
  try {
    const doctors = await Doctor.find({}).select("-password");
    res.json({
      success: true,
      data: doctors,
      count: doctors.length
    });
  } catch (error) {
    console.error("Error fetching all doctors:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch all doctors",
      error: error.message
    });
  }
});

// Create new doctor (admin only)
router.post("/", async (req, res) => {
  try {
    const doctorData = req.body;
    
    // Validate required fields
    if (!doctorData.DoctorName || !doctorData.email || !doctorData.password || !doctorData.phone || !doctorData.specialization) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: DoctorName, email, password, phone, specialization"
      });
    }
    
    // Check if doctor with same email already exists
    const existingDoctor = await Doctor.findOne({ email: doctorData.email });
    if (existingDoctor) {
      return res.status(400).json({
        success: false,
        message: "Doctor with this email already exists"
      });
    }
    
    const newDoctor = new Doctor(doctorData);
    await newDoctor.save();
    
    // Return doctor without password
    const doctorResponse = await Doctor.findById(newDoctor._id).select("-password");
    
    res.status(201).json({
      success: true,
      data: doctorResponse,
      message: "Doctor created successfully"
    });
  } catch (error) {
    console.error("Error creating doctor:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create doctor",
      error: error.message
    });
  }
});

// Get doctor by ID
router.get("/:id", async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id).select("-password");
    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found"
      });
    }
    res.json({
      success: true,
      data: doctor
    });
  } catch (error) {
    console.error("Error fetching doctor:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch doctor",
      error: error.message
    });
  }
});

// Search doctors (only approved doctors)
router.get("/search/:query", async (req, res) => {
  try {
    const query = req.params.query;
    const doctors = await Doctor.find({
      status: "approved",
      $or: [
        { DoctorName: { $regex: query, $options: "i" } },
        { specialization: { $regex: query, $options: "i" } },
        { department: { $regex: query, $options: "i" } },
        { email: { $regex: query, $options: "i" } },
        { medicalDegree: { $regex: query, $options: "i" } },
        { hospitalAffiliations: { $regex: query, $options: "i" } },
        { address: { $regex: query, $options: "i" } }
      ]
    }).select("-password");
    
    res.json({
      success: true,
      data: doctors,
      count: doctors.length
    });
  } catch (error) {
    console.error("Error searching doctors:", error);
    res.status(500).json({
      success: false,
      message: "Failed to search doctors",
      error: error.message
    });
  }
});

// Filter doctors by status
router.get("/status/:status", async (req, res) => {
  try {
    const status = req.params.status;
    const doctors = await Doctor.find({ status }).select("-password");
    
    res.json({
      success: true,
      data: doctors,
      count: doctors.length
    });
  } catch (error) {
    console.error("Error filtering doctors by status:", error);
    res.status(500).json({
      success: false,
      message: "Failed to filter doctors",
      error: error.message
    });
  }
});

// Filter doctors by specialization (only approved doctors)
router.get("/specialization/:specialization", async (req, res) => {
  try {
    const specialization = req.params.specialization;
    const doctors = await Doctor.find({ 
      specialization: { $in: [specialization] }, // Search in specialization array
      status: "approved" 
    }).select("-password");
    
    res.json({
      success: true,
      data: doctors,
      count: doctors.length
    });
  } catch (error) {
    console.error("Error filtering doctors by specialization:", error);
    res.status(500).json({
      success: false,
      message: "Failed to filter doctors",
      error: error.message
    });
  }
});

// Filter doctors by sentiment (only approved doctors)
router.get("/sentiment/:sentiment", async (req, res) => {
  try {
    const sentiment = req.params.sentiment;
    const doctors = await Doctor.find({ sentiment, status: "approved" }).select("-password");
    
    res.json({
      success: true,
      data: doctors,
      count: doctors.length
    });
  } catch (error) {
    console.error("Error filtering doctors by sentiment:", error);
    res.status(500).json({
      success: false,
      message: "Failed to filter doctors",
      error: error.message
    });
  }
});

// Get recent doctors (for dashboard - only approved doctors)
router.get("/recent/:limit", async (req, res) => {
  try {
    const limit = parseInt(req.params.limit) || 5;
    const doctors = await Doctor.find({ status: "approved" })
      .select("-password")
      .sort({ createdAt: -1 })
      .limit(limit);
    
    res.json({
      success: true,
      data: doctors,
      count: doctors.length
    });
  } catch (error) {
    console.error("Error fetching recent doctors:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch recent doctors",
      error: error.message
    });
  }
});

// Update doctor status (specific route - must come before general /:id)
router.patch("/:id/status", async (req, res) => {
  try {
    const { status, suspensionData } = req.body;
    const doctorId = req.params.id;
    
    console.log("Updating doctor status:", { doctorId, status, suspensionData });
    
    const doctor = await Doctor.findByIdAndUpdate(
      doctorId,
      { status },
      { new: true }
    ).select("-password");
    
    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found"
      });
    }
    
    // If suspending, create a suspension record
    if (status === "suspended" && suspensionData) {
      try {
        // Check suspension count
        const suspensionCount = await DoctorSuspension.countDocuments({ doctorId: doctorId });
        
        if (suspensionCount >= 5) {
          console.log(`Doctor ${doctor.DoctorName} has ${suspensionCount} suspensions. This is suspension #${suspensionCount + 1}`);
          
          if (suspensionCount === 5) {
            console.log(`WARNING: Doctor ${doctor.DoctorName} is being suspended for the 6th time. This will result in automatic deletion.`);
          }
        }
        
        const suspensionRecord = new DoctorSuspension({
          doctorId: doctorId,
          suspensionType: suspensionData.suspensionType || "temporary",
          status: "active",
          severity: suspensionData.severity || "major",
          reasons: suspensionData.reasons || ["Administrative suspension"],
          suspensionPeriod: {
            startDate: new Date(),
            endDate: suspensionData.duration === -1 ? null : (suspensionData.endDate ? new Date(suspensionData.endDate) : new Date(Date.now() + (suspensionData.duration || 30) * 24 * 60 * 60 * 1000)),
            duration: suspensionData.duration === -1 ? null : (suspensionData.duration || 30)
          },
          impact: {
            patientAccess: suspensionData.impact?.patientAccess || false,
            appointmentScheduling: suspensionData.impact?.appointmentScheduling || false,
            prescriptionWriting: suspensionData.impact?.prescriptionWriting || false,
            systemAccess: suspensionData.impact?.systemAccess || false
          },
          suspendedBy: suspensionData.suspendedBy || "000000000000000000000000", // Default admin ID
          appealStatus: "none",
          appealNotes: "",
          notificationSent: true,
          doctorNotified: true,
          patientsNotified: false,
          publiclyVisible: false
        });
        
    await suspensionRecord.save();
    console.log("Suspension record created:", suspensionRecord._id);
    
    // Create notification for doctor suspension
    try {
      const suspensionNotification = new Notification({
        title: "Doctor Suspended",
        message: `Doctor ${doctor.DoctorName} has been suspended. Type: ${suspensionData.suspensionType || 'temporary'}, Duration: ${suspensionData.duration || 30} days. Reasons: ${(suspensionData.reasons || ['Administrative suspension']).join(', ')}`,
        type: "warning",
        category: "suspensions",
        priority: "high",
        recipients: "admin",
        relatedEntity: doctor._id,
        relatedEntityType: "Doctor",
        metadata: {
          doctorName: doctor.DoctorName,
          doctorEmail: doctor.email,
          suspensionType: suspensionData.suspensionType || "temporary",
          duration: suspensionData.duration || 30,
          reasons: suspensionData.reasons || ["Administrative suspension"],
          suspensionCount: suspensionCount + 1,
          action: "doctor_suspended",
          suspendedBy: suspensionData.suspendedBy || "system"
        }
      });
      
      await suspensionNotification.save();
      console.log('Suspension notification created successfully');
    } catch (notificationError) {
      console.error('Error creating suspension notification:', notificationError);
      // Don't fail the suspension process if notification fails
    }
    
    // If this is the 6th suspension, delete the doctor
        if (suspensionCount === 5) {
          console.log(`Deleting doctor ${doctor.DoctorName} due to 6th suspension`);
          
          // Add doctor credentials to blacklist before deletion
          try {
            await Blacklist.addToBlacklist({
              email: doctor.email,
              phone: doctor.phone,
              licenses: doctor.licenses || [],
              reason: "doctor_deleted",
              originalEntityType: "Doctor",
              originalEntityId: doctor._id,
              originalEntityName: doctor.DoctorName,
              description: `Doctor automatically deleted due to 6th suspension. Suspension count: ${suspensionCount + 1}`
            });
            
            console.log(`Doctor ${doctor.DoctorName} credentials blacklisted due to 6th suspension`);
            
            // Create notification for admin about blacklisting
            const blacklistNotification = new Notification({
              title: "Doctor Blacklisted - 6th Suspension",
              message: `Doctor ${doctor.DoctorName} has been automatically deleted and blacklisted due to 6th suspension. Email: ${doctor.email}`,
              type: "alert",
              category: "security",
              priority: "high",
              recipients: "admin",
              metadata: {
                doctorName: doctor.DoctorName,
                doctorEmail: doctor.email,
                suspensionCount: suspensionCount + 1,
                action: "doctor_blacklisted_deleted"
              }
            });
            
            await blacklistNotification.save();
            
          } catch (blacklistError) {
            console.error("Error adding deleted doctor to blacklist:", blacklistError);
          }
          
          await Doctor.findByIdAndDelete(doctorId);
          await DoctorSuspension.deleteMany({ doctorId: doctorId });
          
          return res.json({
            success: true,
            data: null,
            message: `Doctor ${doctor.DoctorName} has been automatically deleted due to 6th suspension`,
            deleted: true
          });
        }
        
      } catch (suspensionError) {
        console.error("Error creating suspension record:", suspensionError);
        // Don't fail the main operation if suspension record creation fails
      }
    }
    
    // If unsuspending, update any active suspension records
    if (status === "approved") {
      try {
        await DoctorSuspension.updateMany(
          { 
            doctorId: doctorId, 
            status: "active" 
          },
          { 
            status: "revoked",
            updatedAt: new Date()
          }
        );
        console.log("Suspension records revoked for doctor:", doctorId);
        
        // Create notification for doctor unsuspension
        try {
          const unsuspensionNotification = new Notification({
            title: "Doctor Unsuspended",
            message: `Doctor ${doctor.DoctorName} has been unsuspended and is now active again. Email: ${doctor.email}`,
            type: "success",
            category: "suspensions",
            priority: "medium",
            recipients: "admin",
            relatedEntity: doctor._id,
            relatedEntityType: "Doctor",
            metadata: {
              doctorName: doctor.DoctorName,
              doctorEmail: doctor.email,
              action: "doctor_unsuspended",
              unsuspendedBy: req.user?.id || "system"
            }
          });
          
          await unsuspensionNotification.save();
          console.log('Unsuspension notification created successfully');
        } catch (notificationError) {
          console.error('Error creating unsuspension notification:', notificationError);
          // Don't fail the unsuspension process if notification fails
        }
      } catch (revokeError) {
        console.error("Error revoking suspension records:", revokeError);
        // Don't fail the main operation if suspension record update fails
      }
    }
    
    res.json({
      success: true,
      data: doctor,
      message: "Doctor status updated successfully"
    });
  } catch (error) {
    console.error("Error updating doctor status:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update doctor status",
      error: error.message
    });
  }
});

// Update doctor sentiment (specific route - must come before general /:id)
router.patch("/:id/sentiment", async (req, res) => {
  try {
    const { sentiment, sentiment_score } = req.body;
    const doctor = await Doctor.findByIdAndUpdate(
      req.params.id,
      { sentiment, sentiment_score },
      { new: true }
    ).select("-password");
    
    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found"
      });
    }
    
    res.json({
      success: true,
      data: doctor,
      message: "Doctor sentiment updated successfully"
    });
  } catch (error) {
    console.error("Error updating doctor sentiment:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update doctor sentiment",
      error: error.message
    });
  }
});

// Update doctor basic information (general route - must come last)
router.patch("/:id", async (req, res) => {
  try {
    console.log("PATCH /:id route hit");
    console.log("Doctor ID:", req.params.id);
    console.log("Request body:", req.body);
    
    const updateData = req.body;
    
    // Remove password from update data if present (for security)
    delete updateData.password;
    
    console.log("Update data after password removal:", updateData);
    
    const doctor = await Doctor.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true, runValidators: true }
    ).select("-password");
    
    console.log("Updated doctor:", doctor);
    
    if (!doctor) {
      console.log("Doctor not found");
      return res.status(404).json({
        success: false,
        message: "Doctor not found"
      });
    }
    
    res.json({
      success: true,
      data: doctor,
      message: "Doctor updated successfully"
    });
  } catch (error) {
    console.error("Error updating doctor:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update doctor",
      error: error.message
    });
  }
});

// Delete doctor
router.delete("/:id", async (req, res) => {
  try {
    console.log("DELETE /:id route hit");
    console.log("Doctor ID:", req.params.id);
    
    const doctor = await Doctor.findById(req.params.id);
    
    if (!doctor) {
      console.log("Doctor not found for deletion");
      return res.status(404).json({
        success: false,
        message: "Doctor not found"
      });
    }
    
    // Add doctor credentials to blacklist before deletion
    try {
      await Blacklist.addToBlacklist({
        email: doctor.email,
        phone: doctor.phone,
        licenses: doctor.licenses || [],
        reason: "doctor_deleted",
        originalEntityType: "Doctor",
        originalEntityId: doctor._id,
        originalEntityName: doctor.DoctorName,
        description: `Doctor manually deleted by admin`
      });
      
      console.log(`Doctor ${doctor.DoctorName} credentials blacklisted due to manual deletion`);
      
      // Create notification for admin about blacklisting
      const blacklistNotification = new Notification({
        title: "Doctor Blacklisted - Manual Deletion",
        message: `Doctor ${doctor.DoctorName} has been manually deleted and blacklisted. Email: ${doctor.email}`,
        type: "alert",
        category: "security",
        priority: "high",
        recipients: "admin",
        metadata: {
          doctorName: doctor.DoctorName,
          doctorEmail: doctor.email,
          action: "doctor_blacklisted_manual_deletion"
        }
      });
      
      await blacklistNotification.save();
      
    } catch (blacklistError) {
      console.error("Error adding deleted doctor to blacklist:", blacklistError);
    }
    
    await Doctor.findByIdAndDelete(req.params.id);
    console.log("Doctor deleted successfully:", doctor.DoctorName);
    
    res.json({
      success: true,
      message: "Doctor deleted successfully",
      data: { id: req.params.id, name: doctor.DoctorName }
    });
  } catch (error) {
    console.error("Error deleting doctor:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete doctor",
      error: error.message
    });
  }
});

// Get doctor suspension records
router.get("/:id/suspensions", async (req, res) => {
  try {
    const doctorId = req.params.id;
    const suspensions = await DoctorSuspension.find({ doctorId })
      .populate('suspendedBy', 'name email')
      .populate('reviewedBy', 'name email')
      .sort({ createdAt: -1 });
    
    res.json({
      success: true,
      data: suspensions,
      count: suspensions.length
    });
  } catch (error) {
    console.error("Error fetching doctor suspensions:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch doctor suspensions",
      error: error.message
    });
  }
});

// Create suspension record manually
router.post("/:id/suspend", async (req, res) => {
  try {
    const doctorId = req.params.id;
    const suspensionData = req.body;
    
    // First update doctor status
    const doctor = await Doctor.findByIdAndUpdate(
      doctorId,
      { status: "suspended" },
      { new: true }
    ).select("-password");
    
    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found"
      });
    }
    
    // Create suspension record
    // Check suspension count
    const suspensionCount = await DoctorSuspension.countDocuments({ doctorId: doctorId });
    
    if (suspensionCount >= 5) {
      console.log(`Doctor ${doctor.DoctorName} has ${suspensionCount} suspensions. This is suspension #${suspensionCount + 1}`);
      
      if (suspensionCount === 5) {
        console.log(`WARNING: Doctor ${doctor.DoctorName} is being suspended for the 6th time. This will result in automatic deletion.`);
      }
    }
    
    const suspensionRecord = new DoctorSuspension({
      doctorId: doctorId,
      suspensionType: suspensionData.suspensionType || "temporary",
      status: "active",
      severity: suspensionData.severity || "major",
      reasons: suspensionData.reasons || ["Administrative suspension"],
      suspensionPeriod: {
        startDate: new Date(),
        endDate: suspensionData.duration === -1 ? null : (suspensionData.endDate ? new Date(suspensionData.endDate) : new Date(Date.now() + (suspensionData.duration || 30) * 24 * 60 * 60 * 1000)),
        duration: suspensionData.duration === -1 ? null : (suspensionData.duration || 30)
      },
      impact: {
        patientAccess: suspensionData.impact?.patientAccess || false,
        appointmentScheduling: suspensionData.impact?.appointmentScheduling || false,
        prescriptionWriting: suspensionData.impact?.prescriptionWriting || false,
        systemAccess: suspensionData.impact?.systemAccess || false
      },
      suspendedBy: suspensionData.suspendedBy || "000000000000000000000000",
      appealStatus: "none",
      appealNotes: "",
      notificationSent: true,
      doctorNotified: true,
      patientsNotified: false,
      publiclyVisible: false
    });
    
    await suspensionRecord.save();
    
    // Create notification for doctor suspension
    try {
      const suspensionNotification = new Notification({
        title: "Doctor Suspended",
        message: `Doctor ${doctor.DoctorName} has been suspended. Type: ${suspensionData.suspensionType || 'temporary'}, Duration: ${suspensionData.duration || 30} days. Reasons: ${(suspensionData.reasons || ['Administrative suspension']).join(', ')}`,
        type: "warning",
        category: "suspensions",
        priority: "high",
        recipients: "admin",
        relatedEntity: doctor._id,
        relatedEntityType: "Doctor",
        metadata: {
          doctorName: doctor.DoctorName,
          doctorEmail: doctor.email,
          suspensionType: suspensionData.suspensionType || "temporary",
          duration: suspensionData.duration || 30,
          reasons: suspensionData.reasons || ["Administrative suspension"],
          suspensionCount: suspensionCount + 1,
          action: "doctor_suspended",
          suspendedBy: suspensionData.suspendedBy || "system"
        }
      });
      
      await suspensionNotification.save();
      console.log('Suspension notification created successfully');
    } catch (notificationError) {
      console.error('Error creating suspension notification:', notificationError);
      // Don't fail the suspension process if notification fails
    }
    
    // If this is the 6th suspension, delete the doctor
    if (suspensionCount === 5) {
      console.log(`Deleting doctor ${doctor.DoctorName} due to 6th suspension`);
      
      // Add doctor credentials to blacklist before deletion
      try {
        await Blacklist.addToBlacklist({
          email: doctor.email,
          phone: doctor.phone,
          licenses: doctor.licenses || [],
          reason: "doctor_deleted",
          originalEntityType: "Doctor",
          originalEntityId: doctor._id,
          originalEntityName: doctor.DoctorName,
          description: `Doctor automatically deleted due to 6th suspension. Suspension count: ${suspensionCount + 1}`
        });
        
        console.log(`Doctor ${doctor.DoctorName} credentials blacklisted due to 6th suspension`);
        
        // Create notification for admin about blacklisting
        const blacklistNotification = new Notification({
          title: "Doctor Blacklisted - 6th Suspension",
          message: `Doctor ${doctor.DoctorName} has been automatically deleted and blacklisted due to 6th suspension. Email: ${doctor.email}`,
          type: "alert",
          category: "security",
          priority: "high",
          recipients: "admin",
          metadata: {
            doctorName: doctor.DoctorName,
            doctorEmail: doctor.email,
            suspensionCount: suspensionCount + 1,
            action: "doctor_blacklisted_deleted"
          }
        });
        
        await blacklistNotification.save();
        
      } catch (blacklistError) {
        console.error("Error adding deleted doctor to blacklist:", blacklistError);
      }
      
      await Doctor.findByIdAndDelete(doctorId);
      await DoctorSuspension.deleteMany({ doctorId: doctorId });
      
      return res.json({
        success: true,
        data: null,
        message: `Doctor ${doctor.DoctorName} has been automatically deleted due to 6th suspension`,
        deleted: true
      });
    }
    
    res.json({
      success: true,
      data: {
        doctor,
        suspension: suspensionRecord
      },
      message: "Doctor suspended and suspension record created successfully"
    });
  } catch (error) {
    console.error("Error suspending doctor:", error);
    res.status(500).json({
      success: false,
      message: "Failed to suspend doctor",
      error: error.message
    });
  }
});

// Get doctor suspension count
router.get("/:id/suspension-count", async (req, res) => {
  try {
    const doctorId = req.params.id;
    
    // Verify doctor exists
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found"
      });
    }
    
    const suspensionCount = await DoctorSuspension.countDocuments({ doctorId });
    
    res.json({
      success: true,
      data: {
        doctorId,
        doctorName: doctor.DoctorName,
        suspensionCount,
        warningThreshold: 5,
        deletionThreshold: 6,
        isAtWarningThreshold: suspensionCount >= 5,
        nextSuspensionWillDelete: suspensionCount === 5
      }
    });
  } catch (error) {
    console.error("Error fetching doctor suspension count:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch doctor suspension count",
      error: error.message
    });
  }
});

export default router;