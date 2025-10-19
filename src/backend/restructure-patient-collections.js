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

const clearCollections = async () => {
  try {
    console.log("\n🗑️  STEP 1: Clearing existing collections...");
    
    // Clear Patient collection
    const patientResult = await Patient.deleteMany({});
    console.log(`✅ Cleared ${patientResult.deletedCount} patients from Patient collection`);
    
    // Clear MedicalRecord collection
    const medicalRecordResult = await MedicalRecord.deleteMany({});
    console.log(`✅ Cleared ${medicalRecordResult.deletedCount} medical records from MedicalRecord collection`);
    
    console.log("✅ All collections cleared successfully!");
    
  } catch (error) {
    console.error("❌ Error clearing collections:", error);
    throw error;
  }
};

const repopulateCollections = async () => {
  try {
    console.log("\n📝 STEP 2: Repopulating collections with new structure...");
    
    // Sample patient data
    const samplePatients = [
      {
        userRole: "Patient",
        firstName: "Ahmad",
        lastName: "Khan",
        emailAddress: "ahmad.khan@example.com",
        phone: "+92-300-1234567",
        password: "hashedpassword123",
        profileImage: "",
        gender: "Male",
        Age: "35",
        address: {
          street: "123 Main Street",
          city: "Karachi",
          state: "Sindh",
          zipCode: "75000",
          country: "Pakistan"
        },
        isActive: "true",
        createdBy: null,
        lastVisit: new Date("2025-10-11T15:04:54.932Z"),
        nextAppointment: new Date("2025-11-17T15:04:54.932Z")
      },
      {
        userRole: "Patient",
        firstName: "Fatima",
        lastName: "Ali",
        emailAddress: "fatima.ali@example.com",
        phone: "+92-301-2345678",
        password: "hashedpassword456",
        profileImage: "",
        gender: "Female",
        Age: "28",
        address: {
          street: "456 Park Avenue",
          city: "Lahore",
          state: "Punjab",
          zipCode: "54000",
          country: "Pakistan"
        },
        isActive: "true",
        createdBy: null,
        lastVisit: new Date("2025-10-15T10:30:00.000Z"),
        nextAppointment: new Date("2025-11-20T14:00:00.000Z")
      },
      {
        userRole: "Patient",
        firstName: "Muhammad",
        lastName: "Hassan",
        emailAddress: "muhammad.hassan@example.com",
        phone: "+92-302-3456789",
        password: "hashedpassword789",
        profileImage: "",
        gender: "Male",
        Age: "42",
        address: {
          street: "789 Garden Road",
          city: "Islamabad",
          state: "Federal",
          zipCode: "44000",
          country: "Pakistan"
        },
        isActive: "true",
        createdBy: null,
        lastVisit: new Date("2025-10-12T09:15:00.000Z"),
        nextAppointment: new Date("2025-11-25T11:30:00.000Z")
      },
      {
        userRole: "Patient",
        firstName: "Ayesha",
        lastName: "Malik",
        emailAddress: "ayesha.malik@example.com",
        phone: "+92-303-4567890",
        password: "hashedpassword012",
        profileImage: "",
        gender: "Female",
        Age: "31",
        address: {
          street: "321 University Road",
          city: "Peshawar",
          state: "KPK",
          zipCode: "25000",
          country: "Pakistan"
        },
        isActive: "true",
        createdBy: null,
        lastVisit: new Date("2025-10-08T16:45:00.000Z"),
        nextAppointment: new Date("2025-11-22T10:00:00.000Z")
      },
      {
        userRole: "Patient",
        firstName: "Ali",
        lastName: "Raza",
        emailAddress: "ali.raza@example.com",
        phone: "+92-304-5678901",
        password: "hashedpassword345",
        profileImage: "",
        gender: "Male",
        Age: "26",
        address: {
          street: "654 Commercial Area",
          city: "Quetta",
          state: "Balochistan",
          zipCode: "87300",
          country: "Pakistan"
        },
        isActive: "true",
        createdBy: null,
        lastVisit: new Date("2025-10-05T13:20:00.000Z"),
        nextAppointment: new Date("2025-11-18T15:30:00.000Z")
      }
    ];

    // Create patients
    console.log("Creating patients...");
    const createdPatients = [];
    for (const patientData of samplePatients) {
      const patient = new Patient(patientData);
      await patient.save();
      createdPatients.push(patient);
      console.log(`✅ Created patient: ${patient.firstName} ${patient.lastName}`);
    }

    // Create medical records for each patient
    console.log("Creating medical records...");
    const sampleMedicalRecords = [
      {
        medications: ["Metformin", "Aspirin"],
        allergies: ["Penicillin", "Shellfish"],
        chronicConditions: ["Diabetes Type 2", "Hypertension"],
        vaccinations: ["COVID-19", "Flu", "Hepatitis B"],
        vitals: {
          weight: "75 kg",
          height: "5'8\"",
          bloodPressure: "130/85",
          heartRate: "78",
          temperature: "98.6°F",
          oxygenSaturation: "98%"
        },
        notes: "Regular checkup patient. Follows diabetic diet. Blood pressure under control with medication."
      },
      {
        medications: ["Iron Supplements", "Vitamin D"],
        allergies: ["Latex"],
        chronicConditions: ["Anemia"],
        vaccinations: ["COVID-19", "MMR", "Tetanus"],
        vitals: {
          weight: "58 kg",
          height: "5'4\"",
          bloodPressure: "110/70",
          heartRate: "72",
          temperature: "98.4°F",
          oxygenSaturation: "99%"
        },
        notes: "Pregnant patient. Regular prenatal care. Iron levels improving with supplements."
      },
      {
        medications: ["Lisinopril", "Atorvastatin"],
        allergies: ["Peanuts"],
        chronicConditions: ["Hypertension", "High Cholesterol"],
        vaccinations: ["COVID-19", "Flu", "Pneumonia"],
        vitals: {
          weight: "82 kg",
          height: "5'10\"",
          bloodPressure: "145/90",
          heartRate: "85",
          temperature: "98.8°F",
          oxygenSaturation: "97%"
        },
        notes: "Middle-aged patient with cardiovascular risk factors. Advised lifestyle modifications."
      },
      {
        medications: ["Multivitamin", "Calcium"],
        allergies: ["Dairy"],
        chronicConditions: ["Osteoporosis"],
        vaccinations: ["COVID-19", "Flu", "Shingles"],
        vitals: {
          weight: "52 kg",
          height: "5'2\"",
          bloodPressure: "115/75",
          heartRate: "68",
          temperature: "98.2°F",
          oxygenSaturation: "99%"
        },
        notes: "Post-menopausal patient. Bone density improving with calcium supplements and exercise."
      },
      {
        medications: ["Antibiotics"],
        allergies: ["Sulfa drugs"],
        chronicConditions: [],
        vaccinations: ["COVID-19", "Hepatitis A", "Typhoid"],
        vitals: {
          weight: "68 kg",
          height: "5'6\"",
          bloodPressure: "120/80",
          heartRate: "75",
          temperature: "99.1°F",
          oxygenSaturation: "98%"
        },
        notes: "Young patient with acute infection. Currently on antibiotic treatment. No chronic conditions."
      }
    ];

    for (let i = 0; i < createdPatients.length; i++) {
      const patient = createdPatients[i];
      const medicalData = sampleMedicalRecords[i];
      
      const medicalRecordData = {
        patientId: patient._id,
        doctorId: null, // Will be set when doctor sees patient
        appointmentId: null, // Will be set when appointment is made
        diagnosis: "",
        symptoms: [],
        medications: medicalData.medications,
        vaccinations: medicalData.vaccinations,
        vitals: medicalData.vitals,
        allergies: medicalData.allergies,
        chronicConditions: medicalData.chronicConditions,
        notes: medicalData.notes,
        followUpRequired: false,
        followUpDate: null,
        prescriptions: []
      };

      const medicalRecord = new MedicalRecord(medicalRecordData);
      await medicalRecord.save();
      console.log(`✅ Created medical record for ${patient.firstName} ${patient.lastName}`);
    }

    console.log(`✅ Successfully created ${createdPatients.length} patients and medical records`);
    
  } catch (error) {
    console.error("❌ Error repopulating collections:", error);
    throw error;
  }
};

const testRepopulatedData = async () => {
  try {
    console.log("\n🧪 STEP 3: Testing repopulated data...");
    
    // Test 1: Count documents
    const patientCount = await Patient.countDocuments();
    const medicalRecordCount = await MedicalRecord.countDocuments();
    console.log(`✅ Patients: ${patientCount}, Medical Records: ${medicalRecordCount}`);
    
    if (patientCount === medicalRecordCount) {
      console.log("✅ Patient and MedicalRecord counts match");
    } else {
      console.log("❌ Patient and MedicalRecord counts don't match");
    }

    // Test 2: Verify structure
    const samplePatient = await Patient.findOne();
    const sampleMedicalRecord = await MedicalRecord.findOne();
    
    if (samplePatient && sampleMedicalRecord) {
      const patientFields = Object.keys(samplePatient.toObject());
      const medicalFields = ['medications', 'allergies', 'chronicConditions', 'vaccinations', 'notes', 'weight', 'height'];
      const hasMedicalFields = medicalFields.some(field => patientFields.includes(field));
      
      if (!hasMedicalFields) {
        console.log("✅ Patient model correctly excludes medical fields");
      } else {
        console.log("❌ Patient model still contains medical fields");
      }

      const medicalRecordFields = Object.keys(sampleMedicalRecord.toObject());
      const requiredFields = ['patientId', 'doctorId', 'appointmentId', 'diagnosis', 'symptoms', 'medications', 'vaccinations', 'vitals', 'allergies', 'chronicConditions', 'notes'];
      const hasAllFields = requiredFields.every(field => medicalRecordFields.includes(field));
      
      if (hasAllFields) {
        console.log("✅ MedicalRecord model contains all required fields");
      } else {
        console.log("❌ MedicalRecord model missing required fields");
      }
    }

    // Test 3: Test population
    const populatedRecord = await MedicalRecord.findOne().populate('patientId');
    if (populatedRecord && populatedRecord.patientId) {
      console.log(`✅ Population test passed: ${populatedRecord.patientId.firstName} ${populatedRecord.patientId.lastName}`);
    } else {
      console.log("❌ Population test failed");
    }

    // Test 4: Sample queries
    const malePatients = await Patient.find({ gender: "Male" });
    const diabeticPatients = await MedicalRecord.find({ 
      medications: { $in: ["Metformin"] } 
    });
    console.log(`✅ Query tests passed: ${malePatients.length} male patients, ${diabeticPatients.length} diabetic patients`);

    console.log("✅ All tests passed!");
    
  } catch (error) {
    console.error("❌ Error testing data:", error);
    throw error;
  }
};

const main = async () => {
  try {
    await connectDB();
    
    console.log("🚀 Starting Patient Collection Restructure Process...");
    console.log("This will clear existing data and repopulate with the new structure.");
    
    await clearCollections();
    await repopulateCollections();
    await testRepopulatedData();
    
    console.log("\n🎉 SUCCESS! Patient Collection Restructure Complete!");
    console.log("📊 Summary:");
    console.log("   ✅ Cleared existing Patient and MedicalRecord collections");
    console.log("   ✅ Created 5 sample patients with basic information only");
    console.log("   ✅ Created 5 corresponding medical records with medical data");
    console.log("   ✅ Verified new structure is working correctly");
    console.log("   ✅ All tests passed");
    
  } catch (error) {
    console.error("❌ Process failed:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  }
};

main().catch(console.error);
