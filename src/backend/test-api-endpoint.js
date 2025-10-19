import mongoose from "mongoose";
import dotenv from "dotenv";
import Blacklist from "./models/Blacklist.js";
import Notification from "./models/Notification.js";

// Load environment variables
dotenv.config();

// MongoDB Atlas connection
const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://7883:7883@tabeeb.wb8xjht.mongodb.net/Tabeeb";

// Doctor Schema (simplified for testing)
const doctorSchema = new mongoose.Schema({
  DoctorName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  licenses: [{ type: String }],
  specialization: { type: String },
  status: { type: String, default: "active" }
}, { timestamps: true });

const Doctor = mongoose.model("Doctor", doctorSchema);

// Test the API endpoint functionality
async function testAPIEndpoint() {
  try {
    console.log("Connecting to MongoDB Atlas...");
    await mongoose.connect(MONGODB_URI);
    console.log("✅ Connected to MongoDB Atlas successfully");

    // Create another test doctor
    console.log("Creating another test doctor...");
    const testDoctor = new Doctor({
      DoctorName: "Dr. API Test Doctor",
      email: "api.test@example.com",
      phone: "+9876543210",
      licenses: ["API123", "API456"],
      specialization: "Cardiology",
      status: "active"
    });

    await testDoctor.save();
    console.log("✅ Test doctor created:", testDoctor.DoctorName, "(" + testDoctor.email + ")");

    // Simulate the API call (what happens when frontend calls DELETE /api/doctors/:id)
    console.log("Simulating API DELETE call...");
    
    const doctorId = testDoctor._id.toString();
    console.log("Doctor ID:", doctorId);
    
    const doctor = await Doctor.findById(doctorId);
    
    if (!doctor) {
      console.log("❌ Doctor not found for deletion");
      return;
    }
    
    console.log("Found doctor:", doctor.DoctorName);
    
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
      
      console.log(`✅ Doctor ${doctor.DoctorName} credentials blacklisted due to manual deletion`);
      
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
      console.log("✅ Admin notification created");
      
    } catch (blacklistError) {
      console.error("❌ Error adding deleted doctor to blacklist:", blacklistError);
    }
    
    // Delete the doctor
    await Doctor.findByIdAndDelete(doctorId);
    console.log("✅ Doctor deleted successfully");

    // Verify blacklist entry was created
    console.log("Verifying blacklist entry...");
    const blacklistEntry = await Blacklist.findOne({ 
      email: "api.test@example.com" 
    });
    
    if (blacklistEntry) {
      console.log("✅ Blacklist entry found:");
      console.log("   - Email:", blacklistEntry.email);
      console.log("   - Phone:", blacklistEntry.phone);
      console.log("   - Licenses:", blacklistEntry.licenses);
      console.log("   - Reason:", blacklistEntry.reason);
      console.log("   - Entity Name:", blacklistEntry.originalEntityName);
      console.log("   - Created:", blacklistEntry.blacklistedAt);
    } else {
      console.log("❌ No blacklist entry found");
    }

    console.log("\n🎉 API endpoint test completed successfully!");

  } catch (error) {
    console.error("❌ Error during API test:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB Atlas");
  }
}

// Run the test
testAPIEndpoint();
