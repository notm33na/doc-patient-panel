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

const verifyDataStorage = async () => {
  try {
    console.log("🔍 Verifying data storage in Patient and Patient Medical Record collections...");
    
    const db = mongoose.connection.db;
    
    // Step 1: Check collections exist
    console.log("\n📋 STEP 1: Checking collections...");
    const collections = await db.listCollections().toArray();
    const collectionNames = collections.map(col => col.name);
    console.log("Available collections:", collectionNames);
    
    const hasPatientCollection = collectionNames.includes("Patient");
    const hasMedicalRecordCollection = collectionNames.includes("Patient Medical Record");
    
    if (hasPatientCollection) {
      console.log("✅ Patient collection exists");
    } else {
      console.log("❌ Patient collection not found");
    }
    
    if (hasMedicalRecordCollection) {
      console.log("✅ Patient Medical Record collection exists");
    } else {
      console.log("❌ Patient Medical Record collection not found");
    }

    // Step 2: Count documents
    console.log("\n📊 STEP 2: Document counts...");
    const patientCount = await Patient.countDocuments();
    const medicalRecordCount = await MedicalRecord.countDocuments();
    console.log(`Patient documents: ${patientCount}`);
    console.log(`Medical Record documents: ${medicalRecordCount}`);
    
    if (patientCount === medicalRecordCount) {
      console.log("✅ Document counts match");
    } else {
      console.log("⚠️  Document counts don't match - some patients may not have medical records");
    }

    // Step 3: Verify Patient collection structure
    console.log("\n🏥 STEP 3: Verifying Patient collection structure...");
    const samplePatient = await Patient.findOne();
    
    if (samplePatient) {
      const patientFields = Object.keys(samplePatient.toObject());
      console.log("Patient fields:", patientFields);
      
      // Check for medical fields that should NOT be in Patient collection
      const medicalFields = ['medications', 'allergies', 'chronicConditions', 'vaccinations', 'notes', 'weight', 'height'];
      const hasMedicalFields = medicalFields.some(field => patientFields.includes(field));
      
      if (!hasMedicalFields) {
        console.log("✅ Patient collection correctly excludes medical fields");
      } else {
        console.log("❌ Patient collection still contains medical fields:", medicalFields.filter(field => patientFields.includes(field)));
      }
      
      // Check for required basic fields
      const requiredBasicFields = ['userRole', 'firstName', 'lastName', 'emailAddress', 'phone', 'gender', 'Age', 'address', 'isActive'];
      const hasRequiredFields = requiredBasicFields.every(field => patientFields.includes(field));
      
      if (hasRequiredFields) {
        console.log("✅ Patient collection contains all required basic fields");
      } else {
        console.log("❌ Patient collection missing required fields:", requiredBasicFields.filter(field => !patientFields.includes(field)));
      }
      
      // Display sample patient data
      console.log("\n📄 Sample Patient Data:");
      console.log({
        _id: samplePatient._id,
        userRole: samplePatient.userRole,
        firstName: samplePatient.firstName,
        lastName: samplePatient.lastName,
        emailAddress: samplePatient.emailAddress,
        phone: samplePatient.phone,
        gender: samplePatient.gender,
        Age: samplePatient.Age,
        address: samplePatient.address,
        isActive: samplePatient.isActive,
        createdAt: samplePatient.createdAt
      });
    } else {
      console.log("❌ No patients found in Patient collection");
    }

    // Step 4: Verify Patient Medical Record collection structure
    console.log("\n🏥 STEP 4: Verifying Patient Medical Record collection structure...");
    const sampleMedicalRecord = await MedicalRecord.findOne();
    
    if (sampleMedicalRecord) {
      const medicalRecordFields = Object.keys(sampleMedicalRecord.toObject());
      console.log("Medical Record fields:", medicalRecordFields);
      
      // Check for required medical fields
      const requiredMedicalFields = ['patientId', 'doctorId', 'appointmentId', 'diagnosis', 'symptoms', 'medications', 'vaccinations', 'vitals', 'allergies', 'chronicConditions', 'notes'];
      const hasRequiredMedicalFields = requiredMedicalFields.every(field => medicalRecordFields.includes(field));
      
      if (hasRequiredMedicalFields) {
        console.log("✅ Medical Record collection contains all required fields");
      } else {
        console.log("❌ Medical Record collection missing required fields:", requiredMedicalFields.filter(field => !medicalRecordFields.includes(field)));
      }
      
      // Display sample medical record data
      console.log("\n📄 Sample Medical Record Data:");
      console.log({
        _id: sampleMedicalRecord._id,
        patientId: sampleMedicalRecord.patientId,
        doctorId: sampleMedicalRecord.doctorId,
        appointmentId: sampleMedicalRecord.appointmentId,
        diagnosis: sampleMedicalRecord.diagnosis,
        symptoms: sampleMedicalRecord.symptoms,
        medications: sampleMedicalRecord.medications,
        vaccinations: sampleMedicalRecord.vaccinations,
        vitals: sampleMedicalRecord.vitals,
        allergies: sampleMedicalRecord.allergies,
        chronicConditions: sampleMedicalRecord.chronicConditions,
        notes: sampleMedicalRecord.notes,
        createdAt: sampleMedicalRecord.createdAt
      });
    } else {
      console.log("❌ No medical records found in Patient Medical Record collection");
    }

    // Step 5: Verify data relationships
    console.log("\n🔗 STEP 5: Verifying data relationships...");
    
    if (samplePatient && sampleMedicalRecord) {
      // Check if medical record references the patient
      const medicalRecordForPatient = await MedicalRecord.findOne({ patientId: samplePatient._id });
      
      if (medicalRecordForPatient) {
        console.log("✅ Medical record correctly references patient");
        console.log(`Patient ID: ${samplePatient._id}`);
        console.log(`Medical Record Patient ID: ${medicalRecordForPatient.patientId}`);
      } else {
        console.log("❌ No medical record found for sample patient");
      }
      
      // Test population
      const populatedRecord = await MedicalRecord.findById(sampleMedicalRecord._id).populate('patientId');
      if (populatedRecord && populatedRecord.patientId) {
        console.log("✅ Population working correctly");
        console.log(`Populated patient: ${populatedRecord.patientId.firstName} ${populatedRecord.patientId.lastName}`);
      } else {
        console.log("❌ Population failed");
      }
    }

    // Step 6: Verify data integrity across all records
    console.log("\n🔍 STEP 6: Verifying data integrity...");
    
    const allPatients = await Patient.find();
    const allMedicalRecords = await MedicalRecord.find();
    
    let integrityIssues = [];
    
    // Check if all patients have medical records
    for (const patient of allPatients) {
      const medicalRecord = await MedicalRecord.findOne({ patientId: patient._id });
      if (!medicalRecord) {
        integrityIssues.push(`Patient ${patient.firstName} ${patient.lastName} (${patient._id}) has no medical record`);
      }
    }
    
    // Check if all medical records reference valid patients
    for (const medicalRecord of allMedicalRecords) {
      const patient = await Patient.findById(medicalRecord.patientId);
      if (!patient) {
        integrityIssues.push(`Medical record ${medicalRecord._id} references non-existent patient ${medicalRecord.patientId}`);
      }
    }
    
    if (integrityIssues.length === 0) {
      console.log("✅ Data integrity verified - all patients have medical records and all medical records reference valid patients");
    } else {
      console.log("❌ Data integrity issues found:");
      integrityIssues.forEach(issue => console.log(`   - ${issue}`));
    }

    // Step 7: Test queries
    console.log("\n🔍 STEP 7: Testing queries...");
    
    // Test finding patients by gender
    const malePatients = await Patient.find({ gender: "Male" });
    console.log(`✅ Found ${malePatients.length} male patients`);
    
    // Test finding medical records with medications
    const patientsWithMedications = await MedicalRecord.find({ 
      medications: { $exists: true, $ne: [] } 
    });
    console.log(`✅ Found ${patientsWithMedications.length} medical records with medications`);
    
    // Test finding patients by city
    const karachiPatients = await Patient.find({ 
      "address.city": "Karachi" 
    });
    console.log(`✅ Found ${karachiPatients.length} patients from Karachi`);

    // Step 8: Summary
    console.log("\n📊 SUMMARY:");
    console.log(`   Collections: ${hasPatientCollection ? '✅' : '❌'} Patient, ${hasMedicalRecordCollection ? '✅' : '❌'} Patient Medical Record`);
    console.log(`   Document counts: ${patientCount} patients, ${medicalRecordCount} medical records`);
    console.log(`   Data separation: ${status.structure ? '✅' : '❌'} Medical fields excluded from Patient collection`);
    console.log(`   Data integrity: ${integrityIssues.length === 0 ? '✅' : '❌'} All relationships valid`);
    console.log(`   Population: ${populatedRecord && populatedRecord.patientId ? '✅' : '❌'} Working correctly`);
    
    if (hasPatientCollection && hasMedicalRecordCollection && patientCount > 0 && medicalRecordCount > 0 && integrityIssues.length === 0) {
      console.log("\n🎉 VERIFICATION PASSED! Data is being stored correctly in both collections.");
    } else {
      console.log("\n⚠️  VERIFICATION ISSUES FOUND! Please review the issues above.");
    }
    
  } catch (error) {
    console.error("Verification error:", error);
  }
};

const main = async () => {
  await connectDB();
  await verifyDataStorage();
  await mongoose.disconnect();
  console.log("Disconnected from MongoDB");
};

main().catch(console.error);
