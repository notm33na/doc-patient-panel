import mongoose from "mongoose";
import dotenv from "dotenv";
import Doctor from "./models/Doctor.js";

dotenv.config();

const quickDoctorTest = async () => {
  try {
    console.log("🔗 Testing Doctor Model Connection...");
    
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
    
    // Quick test - get doctor count
    const count = await Doctor.countDocuments();
    console.log(`📊 Total doctors: ${count}`);
    
    // Quick test - find one doctor
    const oneDoctor = await Doctor.findOne();
    if (oneDoctor) {
      console.log(`👨‍⚕️ Sample doctor: ${oneDoctor.DoctorName}`);
      console.log(`📧 Email: ${oneDoctor.email}`);
      console.log(`🏥 Department: ${oneDoctor.department}`);
      console.log(`📊 Patient count: ${oneDoctor.no_of_patients}`);
    }
    
    console.log("✅ Doctor model is working correctly!");
    
  } catch (error) {
    console.error("❌ Error:", error.message);
  } finally {
    await mongoose.disconnect();
    console.log("🔌 Disconnected");
  }
};

quickDoctorTest();
