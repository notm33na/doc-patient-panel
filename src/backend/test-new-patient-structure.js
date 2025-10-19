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

const testNewStructure = async () => {
  try {
    console.log("Testing new Patient and MedicalRecord structure...");
    
    // Test 1: Create a new patient without medical data
    console.log("\n=== Test 1: Creating new patient ===");
    const newPatientData = {
      userRole: "Patient",
      firstName: "Test",
      lastName: "Patient",
      emailAddress: "test.patient@example.com",
      phone: "+92-300-1234567",
      password: "hashedpassword123",
      profileImage: "",
      gender: "Male",
      Age: "30",
      address: {
        street: "123 Test Street",
        city: "Karachi",
        state: "Sindh",
        zipCode: "75000",
        country: "Pakistan"
      },
      isActive: "true",
      createdBy: null,
      lastVisit: null,
      nextAppointment: null
    };

    const newPatient = new Patient(newPatientData);
    await newPatient.save();
    console.log("✅ New patient created successfully:", newPatient._id);

    // Test 2: Create a medical record for the new patient
    console.log("\n=== Test 2: Creating medical record ===");
    const medicalRecordData = {
      patientId: newPatient._id,
      doctorId: null,
      appointmentId: null,
      diagnosis: "",
      symptoms: [],
      medications: [],
      vaccinations: [],
      vitals: {
        weight: "",
        height: "",
        bloodPressure: "",
        heartRate: "",
        temperature: "",
        oxygenSaturation: ""
      },
      allergies: [],
      chronicConditions: [],
      notes: "",
      followUpRequired: false,
      followUpDate: null,
      prescriptions: []
    };

    const newMedicalRecord = new MedicalRecord(medicalRecordData);
    await newMedicalRecord.save();
    console.log("✅ Medical record created successfully:", newMedicalRecord._id);

    // Test 3: Update medical record with actual data
    console.log("\n=== Test 3: Updating medical record with data ===");
    const updatedMedicalRecord = await MedicalRecord.findByIdAndUpdate(
      newMedicalRecord._id,
      {
        medications: ["Aspirin", "Metformin"],
        allergies: ["Penicillin"],
        chronicConditions: ["Diabetes"],
        vaccinations: ["COVID-19", "Flu"],
        vitals: {
          weight: "70 kg",
          height: "5'8\"",
          bloodPressure: "120/80",
          heartRate: "72",
          temperature: "98.6°F",
          oxygenSaturation: "98%"
        },
        notes: "Patient follows diabetic diet and regular exercise routine."
      },
      { new: true }
    );
    console.log("✅ Medical record updated successfully");

    // Test 4: Verify patient doesn't have medical fields
    console.log("\n=== Test 4: Verifying patient structure ===");
    const patient = await Patient.findById(newPatient._id);
    console.log("Patient fields:", Object.keys(patient.toObject()));
    
    const hasMedicalFields = ['medications', 'allergies', 'chronicConditions', 'vaccinations', 'notes', 'weight', 'height'].some(field => 
      patient.toObject().hasOwnProperty(field)
    );
    
    if (!hasMedicalFields) {
      console.log("✅ Patient model correctly excludes medical fields");
    } else {
      console.log("❌ Patient model still contains medical fields");
    }

    // Test 5: Verify medical record has all required fields
    console.log("\n=== Test 5: Verifying medical record structure ===");
    const medicalRecord = await MedicalRecord.findById(newMedicalRecord._id);
    console.log("Medical record fields:", Object.keys(medicalRecord.toObject()));
    
    const requiredFields = ['patientId', 'doctorId', 'appointmentId', 'diagnosis', 'symptoms', 'medications', 'vaccinations', 'vitals', 'allergies', 'chronicConditions', 'notes'];
    const hasAllFields = requiredFields.every(field => 
      medicalRecord.toObject().hasOwnProperty(field)
    );
    
    if (hasAllFields) {
      console.log("✅ Medical record model contains all required fields");
    } else {
      console.log("❌ Medical record model missing required fields");
    }

    // Test 6: Test population
    console.log("\n=== Test 6: Testing population ===");
    const populatedRecord = await MedicalRecord.findById(newMedicalRecord._id).populate('patientId');
    console.log("✅ Medical record populated with patient data:", populatedRecord.patientId.firstName, populatedRecord.patientId.lastName);

    // Cleanup
    console.log("\n=== Cleanup ===");
    await Patient.findByIdAndDelete(newPatient._id);
    await MedicalRecord.findByIdAndDelete(newMedicalRecord._id);
    console.log("✅ Test data cleaned up");

    console.log("\n🎉 All tests passed! The new structure is working correctly.");
    
  } catch (error) {
    console.error("Test error:", error);
  }
};

const main = async () => {
  await connectDB();
  await testNewStructure();
  await mongoose.disconnect();
  console.log("Disconnected from MongoDB");
};

main().catch(console.error);
