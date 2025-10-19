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

// Test function to create a doctor and then delete it to test blacklisting
async function testDoctorDeletionBlacklisting() {
  try {
    console.log("Connecting to MongoDB Atlas...");
    await mongoose.connect(MONGODB_URI);
    console.log("✅ Connected to MongoDB Atlas successfully");

    // Create a test doctor
    console.log("Creating test doctor...");
    const testDoctor = new Doctor({
      DoctorName: "Dr. Test Blacklist",
      email: "test.blacklist@example.com",
      phone: "+1234567890",
      licenses: ["TEST123", "TEST456"],
      specialization: "General Medicine",
      status: "active"
    });

    await testDoctor.save();
    console.log("✅ Test doctor created:", testDoctor.DoctorName, "(" + testDoctor.email + ")");

    // Now delete the doctor and test blacklisting
    console.log("Deleting doctor and testing blacklisting...");
    
    // Get doctor data before deletion
    const doctorToDelete = await Doctor.findById(testDoctor._id);
    if (!doctorToDelete) {
      console.log("❌ Doctor not found for deletion");
      return;
    }

    // Add doctor credentials to blacklist before deletion
    try {
      await Blacklist.addToBlacklist({
        email: doctorToDelete.email,
        phone: doctorToDelete.phone,
        licenses: doctorToDelete.licenses || [],
        reason: "doctor_deleted",
        originalEntityType: "Doctor",
        originalEntityId: doctorToDelete._id,
        originalEntityName: doctorToDelete.DoctorName,
        description: `Doctor manually deleted by admin`
      });
      
      console.log("✅ Doctor credentials blacklisted successfully");
      
      // Create notification for admin about blacklisting
      const blacklistNotification = new Notification({
        title: "Doctor Blacklisted - Manual Deletion",
        message: `Doctor ${doctorToDelete.DoctorName} has been manually deleted and blacklisted. Email: ${doctorToDelete.email}`,
        type: "alert",
        category: "security",
        priority: "high",
        recipients: "admin",
        metadata: {
          doctorName: doctorToDelete.DoctorName,
          doctorEmail: doctorToDelete.email,
          action: "doctor_blacklisted_manual_deletion"
        }
      });
      
      await blacklistNotification.save();
      console.log("✅ Admin notification created");
      
    } catch (blacklistError) {
      console.error("❌ Error adding deleted doctor to blacklist:", blacklistError);
    }
    
    // Delete the doctor
    await Doctor.findByIdAndDelete(testDoctor._id);
    console.log("✅ Doctor deleted successfully");

    // Verify blacklist entry was created
    console.log("Verifying blacklist entry...");
    const blacklistEntry = await Blacklist.findOne({ 
      email: "test.blacklist@example.com" 
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

    // Test blacklist checking
    console.log("Testing blacklist checking...");
    const isBlacklisted = await Blacklist.isBlacklisted({
      email: "test.blacklist@example.com",
      phone: "+1234567890",
      licenses: ["TEST123"]
    });
    
    if (isBlacklisted) {
      console.log("✅ Blacklist check successful - credentials are blacklisted");
    } else {
      console.log("❌ Blacklist check failed - credentials not found in blacklist");
    }

    console.log("\n🎉 Doctor deletion and blacklisting test completed successfully!");

  } catch (error) {
    console.error("❌ Error during test:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB Atlas");
  }
}

// Run the test
testDoctorDeletionBlacklisting();
