import mongoose from "mongoose";
import Patient from "./models/Patient.js";
import MedicalRecord from "./models/MedicalRecord.js";
import dotenv from "dotenv";

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};

const migratePatientData = async () => {
  try {
    console.log("Starting patient data migration...");
    
    // Find all patients that have medical data in the old structure
    const patients = await Patient.find({
      $or: [
        { medications: { $exists: true, $ne: [] } },
        { allergies: { $exists: true, $ne: [] } },
        { chronicConditions: { $exists: true, $ne: [] } },
        { vaccinations: { $exists: true, $ne: [] } },
        { notes: { $exists: true, $ne: "" } },
        { weight: { $exists: true, $ne: "" } },
        { height: { $exists: true, $ne: "" } }
      ]
    });

    console.log(`Found ${patients.length} patients with medical data to migrate`);

    for (const patient of patients) {
      console.log(`Migrating patient: ${patient.firstName} ${patient.lastName} (${patient._id})`);
      
      // Check if patient already has a medical record
      const existingRecord = await MedicalRecord.findOne({ patientId: patient._id });
      
      if (existingRecord) {
        console.log(`Medical record already exists for patient ${patient._id}, skipping...`);
        continue;
      }

      // Create a new medical record with the patient's existing medical data
      const medicalRecordData = {
        patientId: patient._id,
        doctorId: null, // Will be set when a doctor sees the patient
        appointmentId: null, // Will be set when an appointment is made
        diagnosis: "",
        symptoms: [],
        medications: patient.medications || [],
        vaccinations: patient.vaccinations || [],
        vitals: {
          weight: patient.weight || "",
          height: patient.height || "",
          bloodPressure: "",
          heartRate: "",
          temperature: "",
          oxygenSaturation: ""
        },
        allergies: patient.allergies || [],
        chronicConditions: patient.chronicConditions || [],
        notes: patient.notes || "",
        followUpRequired: false,
        followUpDate: null,
        prescriptions: []
      };

      const newMedicalRecord = new MedicalRecord(medicalRecordData);
      await newMedicalRecord.save();
      
      console.log(`Created medical record for patient ${patient._id}`);
    }

    console.log("Migration completed successfully!");
    
    // Now remove the medical fields from all patients
    console.log("Removing medical fields from Patient collection...");
    
    const updateResult = await Patient.updateMany(
      {},
      {
        $unset: {
          medications: "",
          allergies: "",
          chronicConditions: "",
          vaccinations: "",
          weight: "",
          height: "",
          notes: ""
        }
      }
    );

    console.log(`Updated ${updateResult.modifiedCount} patients to remove medical fields`);
    
  } catch (error) {
    console.error("Migration error:", error);
  }
};

const main = async () => {
  await connectDB();
  await migratePatientData();
  await mongoose.disconnect();
  console.log("Disconnected from MongoDB");
};

main().catch(console.error);
