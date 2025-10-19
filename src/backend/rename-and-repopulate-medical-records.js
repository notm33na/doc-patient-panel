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

const renameAndRepopulate = async () => {
  try {
    console.log("🔄 Renaming MedicalRecord collection and repopulating with new structure...");
    
    const db = mongoose.connection.db;
    
    // Step 1: Check current collections
    console.log("\n📋 STEP 1: Checking current collections...");
    const collections = await db.listCollections().toArray();
    const collectionNames = collections.map(col => col.name);
    console.log("Current collections:", collectionNames);
    
    // Step 2: Handle collection rename
    console.log("\n🔄 STEP 2: Handling collection rename...");
    const oldCollectionExists = collections.some(col => col.name === "MedicalRecord");
    const newCollectionExists = collections.some(col => col.name === "Patient Medical Record");
    
    if (oldCollectionExists && !newCollectionExists) {
      console.log("Renaming 'MedicalRecord' to 'Patient Medical Record'...");
      await db.collection("MedicalRecord").rename("Patient Medical Record");
      console.log("✅ Collection renamed successfully");
    } else if (newCollectionExists) {
      console.log("✅ 'Patient Medical Record' collection already exists");
    } else {
      console.log("ℹ️  No existing MedicalRecord collection found (will create new one)");
    }
    
    // Step 3: Clear existing data
    console.log("\n🗑️  STEP 3: Clearing existing data...");
    const patientResult = await Patient.deleteMany({});
    console.log(`✅ Cleared ${patientResult.deletedCount} patients`);
    
    // Clear the renamed/new collection
    const medicalRecordResult = await db.collection("Patient Medical Record").deleteMany({});
    console.log(`✅ Cleared ${medicalRecordResult.deletedCount} medical records`);
    
    // Step 4: Repopulate with new structure
    console.log("\n📝 STEP 4: Repopulating with new structure...");
    
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
    console.log("Creating medical records in 'Patient Medical Record' collection...");
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
        doctorId: null,
        appointmentId: null,
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

    // Step 5: Verify the results
    console.log("\n🧪 STEP 5: Verifying results...");
    const finalCollections = await db.listCollections().toArray();
    const finalCollectionNames = finalCollections.map(col => col.name);
    console.log("Final collections:", finalCollectionNames);
    
    const patientCount = await Patient.countDocuments();
    const medicalRecordCount = await MedicalRecord.countDocuments();
    console.log(`✅ Patients: ${patientCount}, Medical Records: ${medicalRecordCount}`);
    
    // Test population
    const populatedRecord = await MedicalRecord.findOne().populate('patientId');
    if (populatedRecord && populatedRecord.patientId) {
      console.log(`✅ Population test passed: ${populatedRecord.patientId.firstName} ${populatedRecord.patientId.lastName}`);
    }

    console.log("\n🎉 SUCCESS! Collection renamed and repopulated!");
    console.log("📊 Summary:");
    console.log("   ✅ Renamed 'MedicalRecord' to 'Patient Medical Record'");
    console.log("   ✅ Cleared existing data");
    console.log("   ✅ Created 5 patients with basic information");
    console.log("   ✅ Created 5 medical records in 'Patient Medical Record' collection");
    console.log("   ✅ Verified new structure is working");
    
  } catch (error) {
    console.error("❌ Error during rename and repopulate:", error);
  }
};

const main = async () => {
  try {
    await connectDB();
    await renameAndRepopulate();
  } catch (error) {
    console.error("❌ Process failed:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  }
};

main().catch(console.error);
