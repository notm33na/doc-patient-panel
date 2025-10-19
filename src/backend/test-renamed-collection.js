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

const testRenamedCollection = async () => {
  try {
    console.log("🧪 Testing renamed 'Patient Medical Record' collection...");
    
    const db = mongoose.connection.db;
    
    // Test 1: Check collections
    console.log("\n=== Test 1: Collection Verification ===");
    const collections = await db.listCollections().toArray();
    const collectionNames = collections.map(col => col.name);
    console.log("Available collections:", collectionNames);
    
    const hasOldCollection = collectionNames.includes("MedicalRecord");
    const hasNewCollection = collectionNames.includes("Patient Medical Record");
    
    if (hasNewCollection && !hasOldCollection) {
      console.log("✅ Collection successfully renamed to 'Patient Medical Record'");
    } else if (hasOldCollection && !hasNewCollection) {
      console.log("❌ Collection still named 'MedicalRecord'");
    } else if (hasOldCollection && hasNewCollection) {
      console.log("⚠️  Both collections exist - manual cleanup may be needed");
    } else {
      console.log("❌ Neither collection found");
    }

    // Test 2: Count documents
    console.log("\n=== Test 2: Document Counts ===");
    const patientCount = await Patient.countDocuments();
    const medicalRecordCount = await MedicalRecord.countDocuments();
    console.log(`✅ Patients: ${patientCount}`);
    console.log(`✅ Medical Records: ${medicalRecordCount}`);
    
    if (patientCount === medicalRecordCount) {
      console.log("✅ Patient and Medical Record counts match");
    } else {
      console.log("❌ Patient and Medical Record counts don't match");
    }

    // Test 3: Verify structure
    console.log("\n=== Test 3: Structure Verification ===");
    const samplePatient = await Patient.findOne();
    const sampleMedicalRecord = await MedicalRecord.findOne();
    
    if (samplePatient) {
      const patientFields = Object.keys(samplePatient.toObject());
      const medicalFields = ['medications', 'allergies', 'chronicConditions', 'vaccinations', 'notes', 'weight', 'height'];
      const hasMedicalFields = medicalFields.some(field => patientFields.includes(field));
      
      if (!hasMedicalFields) {
        console.log("✅ Patient model correctly excludes medical fields");
      } else {
        console.log("❌ Patient model still contains medical fields");
      }
    }

    if (sampleMedicalRecord) {
      const medicalRecordFields = Object.keys(sampleMedicalRecord.toObject());
      const requiredFields = ['patientId', 'doctorId', 'appointmentId', 'diagnosis', 'symptoms', 'medications', 'vaccinations', 'vitals', 'allergies', 'chronicConditions', 'notes'];
      const hasAllFields = requiredFields.every(field => medicalRecordFields.includes(field));
      
      if (hasAllFields) {
        console.log("✅ Medical Record model contains all required fields");
      } else {
        console.log("❌ Medical Record model missing required fields");
      }
    }

    // Test 4: Test population
    console.log("\n=== Test 4: Population Test ===");
    const populatedRecord = await MedicalRecord.findOne().populate('patientId');
    if (populatedRecord && populatedRecord.patientId) {
      console.log(`✅ Population test passed: ${populatedRecord.patientId.firstName} ${populatedRecord.patientId.lastName}`);
    } else {
      console.log("❌ Population test failed");
    }

    // Test 5: Test queries
    console.log("\n=== Test 5: Query Tests ===");
    
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

    // Test 6: Collection name verification
    console.log("\n=== Test 6: Collection Name Verification ===");
    const medicalRecordModel = mongoose.model('MedicalRecord');
    const collectionName = medicalRecordModel.collection.name;
    console.log(`✅ MedicalRecord model is using collection: '${collectionName}'`);
    
    if (collectionName === "Patient Medical Record") {
      console.log("✅ Model is correctly pointing to renamed collection");
    } else {
      console.log(`❌ Model is pointing to wrong collection: '${collectionName}'`);
    }

    console.log("\n🎉 All tests completed!");
    
    // Summary
    console.log("\n📊 Test Summary:");
    console.log(`   - Collection renamed: ${hasNewCollection && !hasOldCollection ? '✅' : '❌'}`);
    console.log(`   - Document counts match: ${patientCount === medicalRecordCount ? '✅' : '❌'}`);
    console.log(`   - Patient structure correct: ${samplePatient && !Object.keys(samplePatient.toObject()).some(field => ['medications', 'allergies', 'chronicConditions', 'vaccinations', 'notes', 'weight', 'height'].includes(field)) ? '✅' : '❌'}`);
    console.log(`   - Medical Record structure correct: ${sampleMedicalRecord && ['patientId', 'doctorId', 'appointmentId', 'diagnosis', 'symptoms', 'medications', 'vaccinations', 'vitals', 'allergies', 'chronicConditions', 'notes'].every(field => Object.keys(sampleMedicalRecord.toObject()).includes(field)) ? '✅' : '❌'}`);
    console.log(`   - Population working: ${populatedRecord && populatedRecord.patientId ? '✅' : '❌'}`);
    console.log(`   - Model pointing to correct collection: ${collectionName === "Patient Medical Record" ? '✅' : '❌'}`);
    
  } catch (error) {
    console.error("Test error:", error);
  }
};

const main = async () => {
  await connectDB();
  await testRenamedCollection();
  await mongoose.disconnect();
  console.log("Disconnected from MongoDB");
};

main().catch(console.error);
