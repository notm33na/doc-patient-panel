import mongoose from "mongoose";
import Doctor from "./models/Doctor.js";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// MongoDB Atlas connection string
const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://7883:7883@tabeeb.wb8xjht.mongodb.net/Tabeeb";

// Sample doctor data
const sampleDoctors = [
  {
    DoctorName: "Dr. Ahmed Hassan",
    email: "ahmed.hassan@tabeeb.com",
    password: "Doctor@123",
    phone: "+92-300-1234567",
    specialization: "Cardiology",
    about: "Experienced cardiologist with 15+ years of practice in treating heart conditions and performing cardiac procedures.",
    medicalDegree: "MBBS, FCPS (Cardiology)",
    residency: "Cardiology Residency at Aga Khan Hospital",
    fellowship: "Interventional Cardiology Fellowship",
    boardCertification: "Pakistan Medical Commission",
    licenses: "PMC-12345, PMC-67890",
    deaRegistration: "DEA-ABC123",
    hospitalAffiliations: "Aga Khan Hospital, Shifa International Hospital",
    memberships: "Pakistan Cardiac Society, American College of Cardiology",
    malpracticeInsurance: "Active - Coverage: $2M",
    address: "House 123, Street 45, F-8/3, Islamabad",
    education: "Aga Khan University Medical College",
    status: "approved",
    verified: true,
    verificationDate: new Date(),
    profileImage: "",
    sentiment: "positive",
    sentiment_score: 0.85,
    no_of_patients: 1250,
    department: "Cardiology",
    bio: "Dr. Ahmed Hassan is a renowned cardiologist specializing in interventional cardiology and cardiac surgery.",
    experience: "15 years",
    qualifications: ["MBBS", "FCPS (Cardiology)", "Interventional Cardiology"],
    languages: ["English", "Urdu", "Arabic"],
    consultationFee: 5000,
    addressStructured: {
      street: "House 123, Street 45, F-8/3",
      city: "Islamabad",
      state: "Federal",
      zipCode: "44000",
      country: "Pakistan"
    },
    workingHours: {
      monday: { start: "09:00", end: "17:00" },
      tuesday: { start: "09:00", end: "17:00" },
      wednesday: { start: "09:00", end: "17:00" },
      thursday: { start: "09:00", end: "17:00" },
      friday: { start: "09:00", end: "15:00" },
      saturday: { start: "10:00", end: "14:00" },
      sunday: { start: "10:00", end: "14:00" }
    }
  },
  {
    DoctorName: "Dr. Fatima Khan",
    email: "fatima.khan@tabeeb.com",
    password: "Doctor@123",
    phone: "+92-301-2345678",
    specialization: "Pediatrics",
    about: "Dedicated pediatrician with expertise in child healthcare, vaccination programs, and developmental disorders.",
    medicalDegree: "MBBS, FCPS (Pediatrics)",
    residency: "Pediatrics Residency at Children's Hospital",
    fellowship: "Pediatric Neurology Fellowship",
    boardCertification: "Pakistan Medical Commission",
    licenses: "PMC-23456, PMC-78901",
    deaRegistration: "DEA-DEF456",
    hospitalAffiliations: "Children's Hospital, Shifa International Hospital",
    memberships: "Pakistan Pediatric Association, International Pediatric Association",
    malpracticeInsurance: "Active - Coverage: $1.5M",
    address: "Apartment 456, Block C, DHA Phase 2, Karachi",
    education: "Dow University of Health Sciences",
    status: "approved",
    verified: true,
    verificationDate: new Date(),
    profileImage: "",
    sentiment: "positive",
    sentiment_score: 0.92,
    no_of_patients: 2100,
    department: "Pediatrics",
    bio: "Dr. Fatima Khan is a compassionate pediatrician with special interest in child development and neurology.",
    experience: "12 years",
    qualifications: ["MBBS", "FCPS (Pediatrics)", "Pediatric Neurology"],
    languages: ["English", "Urdu", "Sindhi"],
    consultationFee: 3500,
    addressStructured: {
      street: "Apartment 456, Block C, DHA Phase 2",
      city: "Karachi",
      state: "Sindh",
      zipCode: "75500",
      country: "Pakistan"
    },
    workingHours: {
      monday: { start: "08:00", end: "16:00" },
      tuesday: { start: "08:00", end: "16:00" },
      wednesday: { start: "08:00", end: "16:00" },
      thursday: { start: "08:00", end: "16:00" },
      friday: { start: "08:00", end: "14:00" },
      saturday: { start: "09:00", end: "13:00" },
      sunday: { start: "09:00", end: "13:00" }
    }
  },
  {
    DoctorName: "Dr. Muhammad Ali",
    email: "muhammad.ali@tabeeb.com",
    password: "Doctor@123",
    phone: "+92-302-3456789",
    specialization: "Orthopedics",
    about: "Orthopedic surgeon specializing in joint replacement, sports medicine, and trauma surgery.",
    medicalDegree: "MBBS, FCPS (Orthopedics)",
    residency: "Orthopedics Residency at Jinnah Hospital",
    fellowship: "Sports Medicine Fellowship",
    boardCertification: "Pakistan Medical Commission",
    licenses: "PMC-34567, PMC-89012",
    deaRegistration: "DEA-GHI789",
    hospitalAffiliations: "Jinnah Hospital, Shaukat Khanum Memorial Hospital",
    memberships: "Pakistan Orthopedic Association, International Society of Arthroscopy",
    malpracticeInsurance: "Active - Coverage: $2.5M",
    address: "Villa 789, Street 12, Gulberg, Lahore",
    education: "King Edward Medical University",
    status: "approved",
    verified: true,
    verificationDate: new Date(),
    profileImage: "",
    sentiment: "positive",
    sentiment_score: 0.88,
    no_of_patients: 1800,
    department: "Orthopedics",
    bio: "Dr. Muhammad Ali is a skilled orthopedic surgeon with expertise in minimally invasive procedures.",
    experience: "18 years",
    qualifications: ["MBBS", "FCPS (Orthopedics)", "Sports Medicine"],
    languages: ["English", "Urdu", "Punjabi"],
    consultationFee: 6000,
    addressStructured: {
      street: "Villa 789, Street 12, Gulberg",
      city: "Lahore",
      state: "Punjab",
      zipCode: "54000",
      country: "Pakistan"
    },
    workingHours: {
      monday: { start: "10:00", end: "18:00" },
      tuesday: { start: "10:00", end: "18:00" },
      wednesday: { start: "10:00", end: "18:00" },
      thursday: { start: "10:00", end: "18:00" },
      friday: { start: "10:00", end: "16:00" },
      saturday: { start: "11:00", end: "15:00" },
      sunday: { start: "11:00", end: "15:00" }
    }
  },
  {
    DoctorName: "Dr. Ayesha Malik",
    email: "ayesha.malik@tabeeb.com",
    password: "Doctor@123",
    phone: "+92-303-4567890",
    specialization: "Gynecology",
    about: "Gynecologist and obstetrician with expertise in women's health, pregnancy care, and reproductive medicine.",
    medicalDegree: "MBBS, FCPS (Gynecology)",
    residency: "Gynecology Residency at Lady Reading Hospital",
    fellowship: "Reproductive Medicine Fellowship",
    boardCertification: "Pakistan Medical Commission",
    licenses: "PMC-45678, PMC-90123",
    deaRegistration: "DEA-JKL012",
    hospitalAffiliations: "Lady Reading Hospital, Shifa International Hospital",
    memberships: "Pakistan Society of Obstetricians and Gynecologists",
    malpracticeInsurance: "Active - Coverage: $1.8M",
    address: "House 321, Sector F-7, Islamabad",
    education: "Rawalpindi Medical University",
    status: "approved",
    verified: true,
    verificationDate: new Date(),
    profileImage: "",
    sentiment: "positive",
    sentiment_score: 0.90,
    no_of_patients: 1650,
    department: "Gynecology",
    bio: "Dr. Ayesha Malik is a compassionate gynecologist specializing in women's reproductive health.",
    experience: "14 years",
    qualifications: ["MBBS", "FCPS (Gynecology)", "Reproductive Medicine"],
    languages: ["English", "Urdu", "Pashto"],
    consultationFee: 4000,
    addressStructured: {
      street: "House 321, Sector F-7",
      city: "Islamabad",
      state: "Federal",
      zipCode: "44000",
      country: "Pakistan"
    },
    workingHours: {
      monday: { start: "09:00", end: "17:00" },
      tuesday: { start: "09:00", end: "17:00" },
      wednesday: { start: "09:00", end: "17:00" },
      thursday: { start: "09:00", end: "17:00" },
      friday: { start: "09:00", end: "15:00" },
      saturday: { start: "10:00", end: "14:00" },
      sunday: { start: "10:00", end: "14:00" }
    }
  },
  {
    DoctorName: "Dr. Hassan Raza",
    email: "hassan.raza@tabeeb.com",
    password: "Doctor@123",
    phone: "+92-304-5678901",
    specialization: "Neurology",
    about: "Neurologist specializing in stroke treatment, epilepsy management, and movement disorders.",
    medicalDegree: "MBBS, FCPS (Neurology)",
    residency: "Neurology Residency at Aga Khan Hospital",
    fellowship: "Epilepsy Fellowship",
    boardCertification: "Pakistan Medical Commission",
    licenses: "PMC-56789, PMC-01234",
    deaRegistration: "DEA-MNO345",
    hospitalAffiliations: "Aga Khan Hospital, Shifa International Hospital",
    memberships: "Pakistan Neurological Society, International League Against Epilepsy",
    malpracticeInsurance: "Active - Coverage: $2.2M",
    address: "Apartment 654, Block D, Clifton, Karachi",
    education: "Aga Khan University Medical College",
    status: "approved",
    verified: true,
    verificationDate: new Date(),
    profileImage: "",
    sentiment: "positive",
    sentiment_score: 0.87,
    no_of_patients: 1950,
    department: "Neurology",
    bio: "Dr. Hassan Raza is a leading neurologist with expertise in complex neurological conditions.",
    experience: "16 years",
    qualifications: ["MBBS", "FCPS (Neurology)", "Epilepsy Specialist"],
    languages: ["English", "Urdu", "Sindhi"],
    consultationFee: 5500,
    addressStructured: {
      street: "Apartment 654, Block D, Clifton",
      city: "Karachi",
      state: "Sindh",
      zipCode: "75600",
      country: "Pakistan"
    },
    workingHours: {
      monday: { start: "09:00", end: "17:00" },
      tuesday: { start: "09:00", end: "17:00" },
      wednesday: { start: "09:00", end: "17:00" },
      thursday: { start: "09:00", end: "17:00" },
      friday: { start: "09:00", end: "15:00" },
      saturday: { start: "10:00", end: "14:00" },
      sunday: { start: "10:00", end: "14:00" }
    }
  },
  {
    DoctorName: "Dr. Saima Ahmed",
    email: "saima.ahmed@tabeeb.com",
    password: "Doctor@123",
    phone: "+92-305-6789012",
    specialization: "Dermatology",
    about: "Dermatologist specializing in cosmetic dermatology, skin cancer treatment, and aesthetic procedures.",
    medicalDegree: "MBBS, FCPS (Dermatology)",
    residency: "Dermatology Residency at Jinnah Hospital",
    fellowship: "Cosmetic Dermatology Fellowship",
    boardCertification: "Pakistan Medical Commission",
    licenses: "PMC-67890, PMC-12345",
    deaRegistration: "DEA-PQR678",
    hospitalAffiliations: "Jinnah Hospital, Shaukat Khanum Memorial Hospital",
    memberships: "Pakistan Association of Dermatologists, International Society of Dermatology",
    malpracticeInsurance: "Active - Coverage: $1.2M",
    address: "House 987, Model Town, Lahore",
    education: "King Edward Medical University",
    status: "approved",
    verified: true,
    verificationDate: new Date(),
    profileImage: "",
    sentiment: "positive",
    sentiment_score: 0.91,
    no_of_patients: 1400,
    department: "Dermatology",
    bio: "Dr. Saima Ahmed is a skilled dermatologist with expertise in both medical and cosmetic dermatology.",
    experience: "11 years",
    qualifications: ["MBBS", "FCPS (Dermatology)", "Cosmetic Dermatology"],
    languages: ["English", "Urdu", "Punjabi"],
    consultationFee: 4500,
    addressStructured: {
      street: "House 987, Model Town",
      city: "Lahore",
      state: "Punjab",
      zipCode: "54000",
      country: "Pakistan"
    },
    workingHours: {
      monday: { start: "10:00", end: "18:00" },
      tuesday: { start: "10:00", end: "18:00" },
      wednesday: { start: "10:00", end: "18:00" },
      thursday: { start: "10:00", end: "18:00" },
      friday: { start: "10:00", end: "16:00" },
      saturday: { start: "11:00", end: "15:00" },
      sunday: { start: "11:00", end: "15:00" }
    }
  },
  {
    DoctorName: "Dr. Usman Sheikh",
    email: "usman.sheikh@tabeeb.com",
    password: "Doctor@123",
    phone: "+92-306-7890123",
    specialization: "Psychiatry",
    about: "Psychiatrist specializing in mood disorders, anxiety treatment, and cognitive behavioral therapy.",
    medicalDegree: "MBBS, FCPS (Psychiatry)",
    residency: "Psychiatry Residency at Institute of Psychiatry",
    fellowship: "Child and Adolescent Psychiatry Fellowship",
    boardCertification: "Pakistan Medical Commission",
    licenses: "PMC-78901, PMC-23456",
    deaRegistration: "DEA-STU901",
    hospitalAffiliations: "Institute of Psychiatry, Shifa International Hospital",
    memberships: "Pakistan Psychiatric Society, American Psychiatric Association",
    malpracticeInsurance: "Active - Coverage: $1.5M",
    address: "Apartment 147, Sector G-8, Islamabad",
    education: "Rawalpindi Medical University",
    status: "approved",
    verified: true,
    verificationDate: new Date(),
    profileImage: "",
    sentiment: "positive",
    sentiment_score: 0.89,
    no_of_patients: 1200,
    department: "Psychiatry",
    bio: "Dr. Usman Sheikh is a compassionate psychiatrist with expertise in mental health treatment.",
    experience: "13 years",
    qualifications: ["MBBS", "FCPS (Psychiatry)", "Child Psychiatry"],
    languages: ["English", "Urdu", "Pashto"],
    consultationFee: 3800,
    addressStructured: {
      street: "Apartment 147, Sector G-8",
      city: "Islamabad",
      state: "Federal",
      zipCode: "44000",
      country: "Pakistan"
    },
    workingHours: {
      monday: { start: "09:00", end: "17:00" },
      tuesday: { start: "09:00", end: "17:00" },
      wednesday: { start: "09:00", end: "17:00" },
      thursday: { start: "09:00", end: "17:00" },
      friday: { start: "09:00", end: "15:00" },
      saturday: { start: "10:00", end: "14:00" },
      sunday: { start: "10:00", end: "14:00" }
    }
  }
];

async function populateDoctors() {
  try {
    console.log("Connecting to MongoDB Atlas...");
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB Atlas successfully!");

    // Clear existing doctors (optional - remove this if you want to keep existing data)
    console.log("Clearing existing doctors...");
    await Doctor.deleteMany({});
    console.log("Existing doctors cleared.");

    // Insert sample doctors
    console.log("Inserting sample doctors...");
    const insertedDoctors = await Doctor.insertMany(sampleDoctors);
    console.log(`Successfully inserted ${insertedDoctors.length} doctors!`);

    // Display inserted doctors
    console.log("\nInserted Doctors:");
    insertedDoctors.forEach((doctor, index) => {
      console.log(`${index + 1}. ${doctor.DoctorName} - ${doctor.specialization} - ${doctor.email}`);
    });

    console.log("\n✅ Doctor collection populated successfully!");
    
  } catch (error) {
    console.error("❌ Error populating doctors:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB Atlas.");
  }
}

// Run the population script
populateDoctors();
