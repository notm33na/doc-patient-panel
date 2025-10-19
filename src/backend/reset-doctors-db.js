import mongoose from "mongoose";
import dotenv from "dotenv";
import Doctor from "./models/Doctor.js";
import bcrypt from "bcryptjs";

dotenv.config();

const resetDoctorsDatabase = async () => {
  try {
    console.log("🔗 Connecting to MongoDB Atlas...");
    
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB Atlas");
    
    // Step 1: Delete all existing doctors
    console.log("\n🗑️ Deleting all existing doctors...");
    const deleteResult = await Doctor.deleteMany({});
    console.log(`✅ Deleted ${deleteResult.deletedCount} doctors`);
    
    // Step 2: Create new doctors
    console.log("\n👨‍⚕️ Creating new doctors...");
    
    // Hash passwords
    const salt = await bcrypt.genSalt(10);
    const hashedPassword1 = await bcrypt.hash("password123", salt);
    const hashedPassword2 = await bcrypt.hash("password123", salt);
    const hashedPassword3 = await bcrypt.hash("password123", salt);
    const hashedPassword4 = await bcrypt.hash("password123", salt);
    const hashedPassword5 = await bcrypt.hash("password123", salt);
    
    const newDoctors = [
      {
        DoctorName: "Dr. Sarah Ali Khan",
        email: "sarah.ahmed@healthplus.com",
        password: hashedPassword1,
        phone: "+92-312-5678910",
        specialization: "Cardiology",
        department: "Heart & Vascular",
        profileImage: "",
        sentiment: "positive",
        sentiment_score: 0.92,
        no_of_patients: 134,
        status: "approved",
        bio: "Experienced cardiologist with 15 years of practice in interventional cardiology.",
        experience: "15 years",
        education: "MBBS, FCPS Cardiology",
        qualifications: ["MBBS", "FCPS Cardiology", "Fellowship in Interventional Cardiology"],
        languages: ["English", "Urdu", "Punjabi"],
        consultationFee: 5000,
        address: {
          street: "123 Medical Plaza",
          city: "Karachi",
          state: "Sindh",
          zipCode: "75000",
          country: "Pakistan"
        },
        workingHours: {
          monday: { start: "09:00", end: "17:00" },
          tuesday: { start: "09:00", end: "17:00" },
          wednesday: { start: "09:00", end: "17:00" },
          thursday: { start: "09:00", end: "17:00" },
          friday: { start: "09:00", end: "17:00" },
          saturday: { start: "10:00", end: "14:00" },
          sunday: { start: "10:00", end: "14:00" }
        }
      },
      {
        DoctorName: "Dr. Ahmed Hassan",
        email: "ahmed.hassan@healthplus.com",
        password: hashedPassword2,
        phone: "+92-321-9876543",
        specialization: "Neurology",
        department: "Neurological Sciences",
        profileImage: "",
        sentiment: "positive",
        sentiment_score: 0.88,
        no_of_patients: 89,
        status: "approved",
        bio: "Specialist in neurological disorders and brain surgery with extensive research background.",
        experience: "12 years",
        education: "MBBS, FCPS Neurology",
        qualifications: ["MBBS", "FCPS Neurology", "PhD in Neuroscience"],
        languages: ["English", "Urdu", "Arabic"],
        consultationFee: 4500,
        address: {
          street: "456 Neuro Center",
          city: "Lahore",
          state: "Punjab",
          zipCode: "54000",
          country: "Pakistan"
        },
        workingHours: {
          monday: { start: "08:00", end: "16:00" },
          tuesday: { start: "08:00", end: "16:00" },
          wednesday: { start: "08:00", end: "16:00" },
          thursday: { start: "08:00", end: "16:00" },
          friday: { start: "08:00", end: "16:00" },
          saturday: { start: "09:00", end: "13:00" },
          sunday: { start: "09:00", end: "13:00" }
        }
      },
      {
        DoctorName: "Dr. Fatima Zahra",
        email: "fatima.zahra@healthplus.com",
        password: hashedPassword3,
        phone: "+92-333-1234567",
        specialization: "Pediatrics",
        department: "Child Health",
        profileImage: "",
        sentiment: "positive",
        sentiment_score: 0.95,
        no_of_patients: 156,
        status: "approved",
        bio: "Dedicated pediatrician specializing in child development and preventive care.",
        experience: "10 years",
        education: "MBBS, FCPS Pediatrics",
        qualifications: ["MBBS", "FCPS Pediatrics", "Certificate in Child Psychology"],
        languages: ["English", "Urdu", "Sindhi"],
        consultationFee: 3500,
        address: {
          street: "789 Children's Hospital",
          city: "Islamabad",
          state: "Federal",
          zipCode: "44000",
          country: "Pakistan"
        },
        workingHours: {
          monday: { start: "09:00", end: "18:00" },
          tuesday: { start: "09:00", end: "18:00" },
          wednesday: { start: "09:00", end: "18:00" },
          thursday: { start: "09:00", end: "18:00" },
          friday: { start: "09:00", end: "18:00" },
          saturday: { start: "10:00", end: "15:00" },
          sunday: { start: "10:00", end: "15:00" }
        }
      },
      {
        DoctorName: "Dr. Muhammad Usman",
        email: "muhammad.usman@healthplus.com",
        password: hashedPassword4,
        phone: "+92-345-6789012",
        specialization: "Orthopedics",
        department: "Bone & Joint Surgery",
        profileImage: "",
        sentiment: "positive",
        sentiment_score: 0.87,
        no_of_patients: 98,
        status: "approved",
        bio: "Expert orthopedic surgeon specializing in joint replacement and sports medicine.",
        experience: "18 years",
        education: "MBBS, FCPS Orthopedics",
        qualifications: ["MBBS", "FCPS Orthopedics", "Fellowship in Joint Replacement"],
        languages: ["English", "Urdu", "Punjabi"],
        consultationFee: 6000,
        address: {
          street: "321 Orthopedic Center",
          city: "Rawalpindi",
          state: "Punjab",
          zipCode: "46000",
          country: "Pakistan"
        },
        workingHours: {
          monday: { start: "08:30", end: "17:30" },
          tuesday: { start: "08:30", end: "17:30" },
          wednesday: { start: "08:30", end: "17:30" },
          thursday: { start: "08:30", end: "17:30" },
          friday: { start: "08:30", end: "17:30" },
          saturday: { start: "09:00", end: "14:00" },
          sunday: { start: "09:00", end: "14:00" }
        }
      },
      {
        DoctorName: "Dr. Ayesha Malik",
        email: "ayesha.malik@healthplus.com",
        password: hashedPassword5,
        phone: "+92-300-9876543",
        specialization: "Dermatology",
        department: "Skin & Hair Care",
        profileImage: "",
        sentiment: "positive",
        sentiment_score: 0.91,
        no_of_patients: 112,
        status: "approved",
        bio: "Board-certified dermatologist with expertise in cosmetic and medical dermatology.",
        experience: "8 years",
        education: "MBBS, FCPS Dermatology",
        qualifications: ["MBBS", "FCPS Dermatology", "Diploma in Cosmetic Dermatology"],
        languages: ["English", "Urdu", "Punjabi"],
        consultationFee: 4000,
        address: {
          street: "654 Skin Care Clinic",
          city: "Faisalabad",
          state: "Punjab",
          zipCode: "38000",
          country: "Pakistan"
        },
        workingHours: {
          monday: { start: "10:00", end: "19:00" },
          tuesday: { start: "10:00", end: "19:00" },
          wednesday: { start: "10:00", end: "19:00" },
          thursday: { start: "10:00", end: "19:00" },
          friday: { start: "10:00", end: "19:00" },
          saturday: { start: "11:00", end: "16:00" },
          sunday: { start: "11:00", end: "16:00" }
        }
      }
    ];
    
    // Insert new doctors
    const createdDoctors = await Doctor.insertMany(newDoctors);
    console.log(`✅ Created ${createdDoctors.length} new doctors`);
    
    // Step 3: Verify the data
    console.log("\n📊 Verifying database...");
    const totalDoctors = await Doctor.countDocuments();
    console.log(`📈 Total doctors in database: ${totalDoctors}`);
    
    // Show all doctors
    console.log("\n👥 All Doctors in Database:");
    const allDoctors = await Doctor.find({}, {
      DoctorName: 1,
      email: 1,
      specialization: 1,
      department: 1,
      status: 1,
      no_of_patients: 1,
      sentiment: 1,
      sentiment_score: 1
    });
    
    allDoctors.forEach((doctor, index) => {
      console.log(`   ${index + 1}. ${doctor.DoctorName}`);
      console.log(`      📧 ${doctor.email}`);
      console.log(`      🏥 ${doctor.specialization} - ${doctor.department}`);
      console.log(`      📊 ${doctor.no_of_patients} patients | ${doctor.status} | ${doctor.sentiment} (${doctor.sentiment_score})`);
      console.log("");
    });
    
    console.log("🎉 Database reset completed successfully!");
    
  } catch (error) {
    console.error("❌ Error resetting database:", error.message);
    console.error("Full error:", error);
  } finally {
    // Close connection
    await mongoose.connection.close();
    console.log("\n🔌 Connection closed");
  }
};

// Run the reset
resetDoctorsDatabase();
