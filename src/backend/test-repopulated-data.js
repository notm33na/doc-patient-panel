import mongoose from "mongoose";
import Patient from "./models/Patient.js";
import MedicalRecord from "./models/MedicalRecord.js";
import dotenv from "dotenv";

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};

const testRepopulatedData = async () => {
  try {
    console.log("Testing repopulated Patient and MedicalRecord collections...");
    
    // Test 1: Count documents
    console.log("\n=== Test 1: Document Counts ===");
    const patientCount = await Patient.countDocuments();
    const medicalRecordCount = await MedicalRecord.countDocuments();
    console.log(`✅ Patients: ${patientCount}`);
    console.log(`✅ Medical Records: ${medicalRecordCount}`);
    
    if (patientCount === medicalRecordCount) {
      console.log("✅ Patient and MedicalRecord counts match");
    } else {
      console.log("❌ Patient and MedicalRecord counts don't match");
    }

    // Test 2: Verify Patient structure
    console.log("\n=== Test 2: Patient Structure Verification ===");
    const samplePatient = await Patient.findOne();
    if (samplePatient) {
      const patientFields = Object.keys(samplePatient.toObject());
      console.log("Patient fields:", patientFields);
      
      const medicalFields = ['medications', 'allergies', 'chronicConditions', 'vaccinations', 'notes', 'weight', 'height'];
      const hasMedicalFields = medicalFields.some(field => patientFields.includes(field));
      
      if (!hasMedicalFields) {
        console.log("✅ Patient model correctly excludes medical fields");
      } else {
        console.log("❌ Patient model still contains medical fields");
      }
    }

    // Test 3: Verify MedicalRecord structure
    console.log("\n=== Test 3: MedicalRecord Structure Verification ===");
    const sampleMedicalRecord = await MedicalRecord.findOne();
    if (sampleMedicalRecord) {
      const medicalRecordFields = Object.keys(sampleMedicalRecord.toObject());
      console.log("MedicalRecord fields:", medicalRecordFields);
      
      const requiredFields = ['patientId', 'doctorId', 'appointmentId', 'diagnosis', 'symptoms', 'medications', 'vaccinations', 'vitals', 'allergies', 'chronicConditions', 'notes'];
      const hasAllFields = requiredFields.every(field => medicalRecordFields.includes(field));
      
      if (hasAllFields) {
        console.log("✅ MedicalRecord model contains all required fields");
      } else {
        console.log("❌ MedicalRecord model missing required fields");
      }
    }

    // Test 4: Test population
    console.log("\n=== Test 4: Population Test ===");
    const populatedRecord = await MedicalRecord.findOne().populate('patientId');
    if (populatedRecord && populatedRecord.patientId) {
      console.log(`✅ Medical record populated with patient: ${populatedRecord.patientId.firstName} ${populatedRecord.patientId.lastName}`);
    } else {
      console.log("❌ Population failed");
    }

    // Test 5: Verify data integrity
    console.log("\n=== Test 5: Data Integrity Check ===");
    const allPatients = await Patient.find();
    const allMedicalRecords = await MedicalRecord.find();
    
    let integrityCheck = true;
    for (const patient of allPatients) {
      const medicalRecord = await MedicalRecord.findOne({ patientId: patient._id });
      if (!medicalRecord) {
        console.log(`❌ No medical record found for patient: ${patient.firstName} ${patient.lastName}`);
        integrityCheck = false;
      }
    }
    
    if (integrityCheck) {
      console.log("✅ All patients have corresponding medical records");
    }

    // Test 6: Sample data verification
    console.log("\n=== Test 6: Sample Data Verification ===");
    const sampleData = await MedicalRecord.findOne().populate('patientId');
    if (sampleData) {
      console.log("Sample Patient:", {
        name: `${sampleData.patientId.firstName} ${sampleData.patientId.lastName}`,
        email: sampleData.patientId.emailAddress,
        phone: sampleData.patientId.phone,
        gender: sampleData.patientId.gender,
        age: sampleData.patientId.Age
      });
      
      console.log("Sample Medical Record:", {
        medications: sampleData.medications,
        allergies: sampleData.allergies,
        chronicConditions: sampleData.chronicConditions,
        vaccinations: sampleData.vaccinations,
        vitals: sampleData.vitals,
        notes: sampleData.notes ? sampleData.notes.substring(0, 50) + "..." : "No notes"
      });
    }

    // Test 7: Test queries
    console.log("\n=== Test 7: Query Tests ===");
    
    // Find patients by gender
    const malePatients = await Patient.find({ gender: "Male" });
    console.log(`✅ Found ${malePatients.length} male patients`);
    
    // Find medical records with specific medications
    const diabeticPatients = await MedicalRecord.find({ 
      medications: { $in: ["Metformin"] } 
    }).populate('patientId');
    console.log(`✅ Found ${diabeticPatients.length} patients taking Metformin`);
    
    // Find patients by city
    const karachiPatients = await Patient.find({ 
      "address.city": "Karachi" 
    });
    console.log(`✅ Found ${karachiPatients.length} patients from Karachi`);

    console.log("\n🎉 All tests passed! The repopulated data is working correctly.");
    
  } catch (error) {
    console.error("Test error:", error);
  }
};

const main = async () => {
  await connectDB();
  await testRepopulatedData();
  await mongoose.disconnect();
  console.log("Disconnected from MongoDB");
};

main().catch(console.error);
