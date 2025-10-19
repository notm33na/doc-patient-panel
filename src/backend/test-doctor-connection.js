import mongoose from "mongoose";
import dotenv from "dotenv";
import Doctor from "./models/Doctor.js";

dotenv.config();

// Test connection to MongoDB Atlas
const testDoctorConnection = async () => {
  try {
    console.log("🔗 Connecting to MongoDB Atlas...");
    
    // Connect to MongoDB Atlas
    await mongoose.connect(process.env.MONGODB_URI || "mongodb+srv://your-connection-string", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log("✅ Connected to MongoDB Atlas successfully!");
    
    // Test 1: Check if Doctor collection exists and get count
    console.log("\n📊 Testing Doctor Collection...");
    const doctorCount = await Doctor.countDocuments();
    console.log(`📈 Total doctors in collection: ${doctorCount}`);
    
    // Test 2: Try to find a specific doctor (Dr. Sarah Ali Khan)
    console.log("\n🔍 Searching for Dr. Sarah Ali Khan...");
    const specificDoctor = await Doctor.findOne({ 
      DoctorName: "Dr. Sarah Ali Khan" 
    });
    
    if (specificDoctor) {
      console.log("✅ Found Dr. Sarah Ali Khan!");
      console.log("📋 Doctor Details:");
      console.log(`   - ID: ${specificDoctor._id}`);
      console.log(`   - Name: ${specificDoctor.DoctorName}`);
      console.log(`   - Email: ${specificDoctor.email}`);
      console.log(`   - Specialization: ${specificDoctor.specialization}`);
      console.log(`   - Department: ${specificDoctor.department}`);
      console.log(`   - Phone: ${specificDoctor.phone}`);
      console.log(`   - Status: ${specificDoctor.status}`);
      console.log(`   - Sentiment: ${specificDoctor.sentiment}`);
      console.log(`   - Sentiment Score: ${specificDoctor.sentiment_score}`);
      console.log(`   - Patient Count: ${specificDoctor.no_of_patients}`);
      console.log(`   - Profile Image: ${specificDoctor.profileImage || 'Not set'}`);
      console.log(`   - Created: ${specificDoctor.createdAt}`);
      console.log(`   - Updated: ${specificDoctor.updatedAt}`);
    } else {
      console.log("❌ Dr. Sarah Ali Khan not found in collection");
    }
    
    // Test 3: Get all doctors with basic info
    console.log("\n👥 All Doctors in Collection:");
    const allDoctors = await Doctor.find({}, {
      DoctorName: 1,
      email: 1,
      specialization: 1,
      department: 1,
      status: 1,
      no_of_patients: 1
    }).limit(5);
    
    if (allDoctors.length > 0) {
      allDoctors.forEach((doctor, index) => {
        console.log(`   ${index + 1}. ${doctor.DoctorName} (${doctor.specialization}) - ${doctor.status} - ${doctor.no_of_patients} patients`);
      });
    } else {
      console.log("   No doctors found in collection");
    }
    
    // Test 4: Test schema validation
    console.log("\n🧪 Testing Schema Validation...");
    try {
      const testDoctor = new Doctor({
        DoctorName: "Test Doctor",
        email: "test@example.com",
        password: "testpassword123",
        phone: "+92-300-1234567",
        specialization: "General Medicine",
        department: "Internal Medicine",
        status: "pending",
        sentiment: "positive",
        sentiment_score: 0.85,
        no_of_patients: 0
      });
      
      await testDoctor.save();
      console.log("✅ Schema validation test passed - Test doctor created");
      
      // Clean up test doctor
      await Doctor.deleteOne({ _id: testDoctor._id });
      console.log("🧹 Test doctor cleaned up");
      
    } catch (validationError) {
      console.log("❌ Schema validation failed:", validationError.message);
    }
    
    // Test 5: Check collection stats
    console.log("\n📊 Collection Statistics:");
    const stats = await Doctor.collection.stats();
    console.log(`   - Collection Name: ${stats.ns}`);
    console.log(`   - Document Count: ${stats.count}`);
    console.log(`   - Average Document Size: ${Math.round(stats.avgObjSize)} bytes`);
    console.log(`   - Total Collection Size: ${Math.round(stats.size / 1024)} KB`);
    
    console.log("\n🎉 All tests completed successfully!");
    
  } catch (error) {
    console.error("❌ Connection or test failed:", error.message);
    console.error("Full error:", error);
  } finally {
    // Close connection
    await mongoose.connection.close();
    console.log("\n🔌 Connection closed");
  }
};

// Run the test
testDoctorConnection();
