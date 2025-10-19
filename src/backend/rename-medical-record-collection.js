import mongoose from "mongoose";
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

const renameCollection = async () => {
  try {
    console.log("Renaming MedicalRecord collection to 'Patient Medical Record'...");
    
    const db = mongoose.connection.db;
    
    // Check if the old collection exists
    const collections = await db.listCollections().toArray();
    const oldCollectionExists = collections.some(col => col.name === "MedicalRecord");
    const newCollectionExists = collections.some(col => col.name === "Patient Medical Record");
    
    if (!oldCollectionExists) {
      console.log("❌ MedicalRecord collection not found");
      if (newCollectionExists) {
        console.log("✅ 'Patient Medical Record' collection already exists");
        console.log("The collection may have already been renamed.");
      }
      return;
    }
    
    if (newCollectionExists) {
      console.log("❌ 'Patient Medical Record' collection already exists");
      console.log("Please manually resolve this conflict in MongoDB Atlas.");
      return;
    }
    
    // Rename the collection
    await db.collection("MedicalRecord").rename("Patient Medical Record");
    console.log("✅ Successfully renamed 'MedicalRecord' to 'Patient Medical Record'");
    
    // Verify the rename
    const updatedCollections = await db.listCollections().toArray();
    const renamedExists = updatedCollections.some(col => col.name === "Patient Medical Record");
    const oldExists = updatedCollections.some(col => col.name === "MedicalRecord");
    
    if (renamedExists && !oldExists) {
      console.log("✅ Verification successful: Collection renamed correctly");
    } else {
      console.log("❌ Verification failed: Collection rename may not have completed properly");
    }
    
  } catch (error) {
    console.error("Error renaming collection:", error);
  }
};

const main = async () => {
  await connectDB();
  await renameCollection();
  await mongoose.disconnect();
  console.log("Disconnected from MongoDB");
};

main().catch(console.error);
