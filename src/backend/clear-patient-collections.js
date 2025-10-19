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
    console.log("Clearing Patient and MedicalRecord collections...");
    
    // Clear Patient collection
    const patientResult = await Patient.deleteMany({});
    console.log(`✅ Cleared ${patientResult.deletedCount} patients from Patient collection`);
    
    // Clear MedicalRecord collection
    const medicalRecordResult = await MedicalRecord.deleteMany({});
    console.log(`✅ Cleared ${medicalRecordResult.deletedCount} medical records from MedicalRecord collection`);
    
    console.log("🎉 All collections cleared successfully!");
    
  } catch (error) {
    console.error("Error clearing collections:", error);
  }
};

const main = async () => {
  await connectDB();
  await clearCollections();
  await mongoose.disconnect();
  console.log("Disconnected from MongoDB");
};

main().catch(console.error);
