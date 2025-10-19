import mongoose from "mongoose";
import dotenv from "dotenv";
import Doctor from "./models/Doctor.js";
import DoctorSuspension from "./models/DoctorSuspension.js";

dotenv.config();

const testSuspensionFunctionality = async () => {
  try {
    console.log("🔗 Testing Doctor Suspension Functionality...");
    
    // Use the same environment variable as the main app
    const MONGO_URI = process.env.MONGO_URI;
    
    if (!MONGO_URI) {
      console.log("❌ MONGO_URI environment variable is not set");
      console.log("📝 Please create a .env file in the backend folder with:");
      console.log("   MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/Tabeeb?retryWrites=true&w=majority");
      return;
    }
    
    // Connect to MongoDB
    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected to MongoDB Atlas");
    
    // Test 1: Find a doctor to suspend
    const doctor = await Doctor.findOne({ status: { $ne: "suspended" } });
    if (!doctor) {
      console.log("❌ No available doctor found to test suspension");
      return;
    }
    
    console.log(`👨‍⚕️ Found doctor: ${doctor.DoctorName} (${doctor._id})`);
    console.log(`📊 Current status: ${doctor.status}`);
    
    // Test 2: Create a suspension record
    console.log("\n--- Creating suspension record ---");
    const suspensionRecord = new DoctorSuspension({
      doctorId: doctor._id,
      suspensionType: "temporary",
      status: "active",
      severity: "major",
      reasons: ["Test suspension for functionality verification"],
      suspensionPeriod: {
        startDate: new Date(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        duration: 30
      },
      impact: {
        patientAccess: false,
        appointmentScheduling: false,
        prescriptionWriting: false,
        systemAccess: false
      },
      suspendedBy: "000000000000000000000000", // Default admin ID
      appealStatus: "none",
      appealNotes: "",
      notificationSent: true,
      doctorNotified: true,
      patientsNotified: false,
      publiclyVisible: false
    });
    
    await suspensionRecord.save();
    console.log("✅ Suspension record created:", suspensionRecord._id);
    
    // Test 3: Update doctor status to suspended
    console.log("\n--- Updating doctor status to suspended ---");
    const updatedDoctor = await Doctor.findByIdAndUpdate(
      doctor._id,
      { status: "suspended" },
      { new: true }
    );
    
    console.log("✅ Doctor status updated to:", updatedDoctor.status);
    
    // Test 4: Verify suspension record exists
    console.log("\n--- Verifying suspension record ---");
    const foundSuspension = await DoctorSuspension.findOne({ doctorId: doctor._id });
    if (foundSuspension) {
      console.log("✅ Suspension record found:");
      console.log(`   - Type: ${foundSuspension.suspensionType}`);
      console.log(`   - Status: ${foundSuspension.status}`);
      console.log(`   - Severity: ${foundSuspension.severity}`);
      console.log(`   - Reasons: ${foundSuspension.reasons.join(", ")}`);
      console.log(`   - Duration: ${foundSuspension.suspensionPeriod.duration} days`);
    } else {
      console.log("❌ Suspension record not found");
    }
    
    // Test 5: Test unsuspending (revoke suspension)
    console.log("\n--- Testing unsuspension ---");
    await DoctorSuspension.updateMany(
      { doctorId: doctor._id, status: "active" },
      { status: "revoked", updatedAt: new Date() }
    );
    
    const unsuspendedDoctor = await Doctor.findByIdAndUpdate(
      doctor._id,
      { status: "approved" },
      { new: true }
    );
    
    console.log("✅ Doctor unsuspended, status:", unsuspendedDoctor.status);
    
    // Test 6: Verify suspension record is revoked
    const revokedSuspension = await DoctorSuspension.findOne({ doctorId: doctor._id });
    if (revokedSuspension) {
      console.log("✅ Suspension record revoked:", revokedSuspension.status);
    }
    
    // Clean up - delete test suspension record
    console.log("\n--- Cleaning up test data ---");
    await DoctorSuspension.findByIdAndDelete(suspensionRecord._id);
    console.log("✅ Test suspension record deleted");
    
    console.log("\n🎉 All suspension functionality tests passed!");
    
  } catch (error) {
    console.error("❌ Error during suspension functionality test:", error);
  } finally {
    await mongoose.disconnect();
    console.log("🔌 MongoDB Disconnected.");
  }
};

testSuspensionFunctionality();
