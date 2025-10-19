import mongoose from "mongoose";
import Doctor from "./models/Doctor.js";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB Atlas connected successfully");
  } catch (error) {
    console.error("❌ MongoDB Atlas connection error:", error);
    process.exit(1);
  }
};

// Dummy doctor data
const dummyDoctors = [
  {
    DoctorName: "Dr. Sarah Ahmed",
    email: "sarah.ahmed@hospital.com",
    password: "Doctor@123",
    phone: "03001234567",
    specialization: "Cardiology",
    about: "Experienced cardiologist with 15 years of practice in interventional cardiology and heart disease management.",
    medicalDegree: "MBBS, MD Cardiology",
    residency: "Internal Medicine Residency - Aga Khan Hospital",
    fellowship: "Interventional Cardiology Fellowship - Mayo Clinic",
    boardCertification: "American Board of Internal Medicine, Pakistan Medical Council",
    licenses: "PMC Registered - PMC-12345, DEA License - DEA-67890",
    deaRegistration: "DEA-67890",
    hospitalAffiliations: "Aga Khan Hospital, Shifa International Hospital",
    memberships: "Pakistan Cardiology Society, American Heart Association",
    malpracticeInsurance: "Yes",
    address: "Block 6, PECHS, Karachi",
    education: "MBBS from Dow Medical College, MD from Aga Khan University",
    status: "approved",
    verified: true,
    verificationDate: new Date(),
    no_of_patients: 1250,
    department: "Cardiology",
    bio: "Dedicated cardiologist committed to providing comprehensive heart care.",
    experience: "15 years",
    qualifications: ["MBBS", "MD Cardiology", "Fellowship in Interventional Cardiology"],
    languages: ["English", "Urdu", "Arabic"],
    consultationFee: 5000,
    addressStructured: {
      street: "Block 6, PECHS",
      city: "Karachi",
      state: "Sindh",
      zipCode: "75400",
      country: "Pakistan"
    },
    workingHours: {
      monday: { start: "09:00", end: "17:00" },
      tuesday: { start: "09:00", end: "17:00" },
      wednesday: { start: "09:00", end: "17:00" },
      thursday: { start: "09:00", end: "17:00" },
      friday: { start: "09:00", end: "15:00" },
      saturday: { start: "10:00", end: "14:00" },
      sunday: { start: "", end: "" }
    }
  },
  {
    DoctorName: "Dr. Muhammad Hassan",
    email: "m.hassan@medical.com",
    password: "Doctor@123",
    phone: "03019876543",
    specialization: "Neurology",
    about: "Board-certified neurologist specializing in stroke treatment and neurological disorders.",
    medicalDegree: "MBBS, MD Neurology",
    residency: "Neurology Residency - Jinnah Hospital",
    fellowship: "Stroke Fellowship - Johns Hopkins",
    boardCertification: "Pakistan Medical Council, American Board of Psychiatry and Neurology",
    licenses: "PMC Registered - PMC-23456",
    deaRegistration: "DEA-78901",
    hospitalAffiliations: "Jinnah Hospital, Liaquat National Hospital",
    memberships: "Pakistan Neurological Society, World Federation of Neurology",
    malpracticeInsurance: "Yes",
    address: "Gulberg, Lahore",
    education: "MBBS from King Edward Medical University, MD from Aga Khan University",
    status: "approved",
    verified: true,
    verificationDate: new Date(),
    no_of_patients: 980,
    department: "Neurology",
    bio: "Passionate neurologist focused on improving patient outcomes through advanced treatments.",
    experience: "12 years",
    qualifications: ["MBBS", "MD Neurology", "Fellowship in Stroke Medicine"],
    languages: ["English", "Urdu", "Punjabi"],
    consultationFee: 4500,
    addressStructured: {
      street: "Gulberg",
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
      friday: { start: "08:00", end: "14:00" },
      saturday: { start: "09:00", end: "13:00" },
      sunday: { start: "", end: "" }
    }
  },
  {
    DoctorName: "Dr. Fatima Khan",
    email: "fatima.khan@clinic.com",
    password: "Doctor@123",
    phone: "03015556677",
    specialization: "Pediatrics",
    about: "Pediatrician with expertise in child development and infectious diseases.",
    medicalDegree: "MBBS, FCPS Pediatrics",
    residency: "Pediatrics Residency - Children Hospital",
    fellowship: "Pediatric Infectious Diseases - Boston Children's Hospital",
    boardCertification: "Pakistan Medical Council, American Board of Pediatrics",
    licenses: "PMC Registered - PMC-34567",
    deaRegistration: "DEA-89012",
    hospitalAffiliations: "Children Hospital, Shaukat Khanum Memorial Hospital",
    memberships: "Pakistan Pediatric Association, American Academy of Pediatrics",
    malpracticeInsurance: "Yes",
    address: "DHA Phase 2, Karachi",
    education: "MBBS from Sindh Medical College, FCPS from College of Physicians and Surgeons",
    status: "approved",
    verified: true,
    verificationDate: new Date(),
    no_of_patients: 2100,
    department: "Pediatrics",
    bio: "Compassionate pediatrician dedicated to children's health and well-being.",
    experience: "18 years",
    qualifications: ["MBBS", "FCPS Pediatrics", "Fellowship in Pediatric Infectious Diseases"],
    languages: ["English", "Urdu", "Sindhi"],
    consultationFee: 3500,
    addressStructured: {
      street: "DHA Phase 2",
      city: "Karachi",
      state: "Sindh",
      zipCode: "75500",
      country: "Pakistan"
    },
    workingHours: {
      monday: { start: "09:00", end: "18:00" },
      tuesday: { start: "09:00", end: "18:00" },
      wednesday: { start: "09:00", end: "18:00" },
      thursday: { start: "09:00", end: "18:00" },
      friday: { start: "09:00", end: "16:00" },
      saturday: { start: "10:00", end: "15:00" },
      sunday: { start: "", end: "" }
    }
  },
  {
    DoctorName: "Dr. Ali Raza",
    email: "ali.raza@ortho.com",
    password: "Doctor@123",
    phone: "03017778899",
    specialization: "Orthopedics",
    about: "Orthopedic surgeon specializing in joint replacement and sports medicine.",
    medicalDegree: "MBBS, MS Orthopedics",
    residency: "Orthopedic Surgery Residency - Mayo Hospital",
    fellowship: "Joint Replacement Fellowship - Cleveland Clinic",
    boardCertification: "Pakistan Medical Council, American Board of Orthopedic Surgery",
    licenses: "PMC Registered - PMC-45678",
    deaRegistration: "DEA-90123",
    hospitalAffiliations: "Mayo Hospital, Shifa International Hospital",
    memberships: "Pakistan Orthopedic Association, American Academy of Orthopedic Surgeons",
    malpracticeInsurance: "Yes",
    address: "Model Town, Lahore",
    education: "MBBS from Allama Iqbal Medical College, MS from King Edward Medical University",
    status: "approved",
    verified: true,
    verificationDate: new Date(),
    no_of_patients: 1650,
    department: "Orthopedics",
    bio: "Expert orthopedic surgeon with focus on minimally invasive procedures.",
    experience: "14 years",
    qualifications: ["MBBS", "MS Orthopedics", "Fellowship in Joint Replacement"],
    languages: ["English", "Urdu", "Punjabi"],
    consultationFee: 6000,
    addressStructured: {
      street: "Model Town",
      city: "Lahore",
      state: "Punjab",
      zipCode: "54700",
      country: "Pakistan"
    },
    workingHours: {
      monday: { start: "08:00", end: "17:00" },
      tuesday: { start: "08:00", end: "17:00" },
      wednesday: { start: "08:00", end: "17:00" },
      thursday: { start: "08:00", end: "17:00" },
      friday: { start: "08:00", end: "15:00" },
      saturday: { start: "09:00", end: "14:00" },
      sunday: { start: "", end: "" }
    }
  },
  {
    DoctorName: "Dr. Ayesha Malik",
    email: "ayesha.malik@derma.com",
    password: "Doctor@123",
    phone: "03019990011",
    specialization: "Dermatology",
    about: "Dermatologist specializing in cosmetic dermatology and skin cancer treatment.",
    medicalDegree: "MBBS, FCPS Dermatology",
    residency: "Dermatology Residency - Skin Center",
    fellowship: "Cosmetic Dermatology Fellowship - Harvard Medical School",
    boardCertification: "Pakistan Medical Council, American Board of Dermatology",
    licenses: "PMC Registered - PMC-56789",
    deaRegistration: "DEA-01234",
    hospitalAffiliations: "Skin Center, Aga Khan Hospital",
    memberships: "Pakistan Dermatology Society, American Academy of Dermatology",
    malpracticeInsurance: "Yes",
    address: "Clifton, Karachi",
    education: "MBBS from Dow Medical College, FCPS from College of Physicians and Surgeons",
    status: "approved",
    verified: true,
    verificationDate: new Date(),
    no_of_patients: 1800,
    department: "Dermatology",
    bio: "Innovative dermatologist committed to advanced skin care treatments.",
    experience: "16 years",
    qualifications: ["MBBS", "FCPS Dermatology", "Fellowship in Cosmetic Dermatology"],
    languages: ["English", "Urdu", "Sindhi"],
    consultationFee: 4000,
    addressStructured: {
      street: "Clifton",
      city: "Karachi",
      state: "Sindh",
      zipCode: "75600",
      country: "Pakistan"
    },
    workingHours: {
      monday: { start: "10:00", end: "19:00" },
      tuesday: { start: "10:00", end: "19:00" },
      wednesday: { start: "10:00", end: "19:00" },
      thursday: { start: "10:00", end: "19:00" },
      friday: { start: "10:00", end: "17:00" },
      saturday: { start: "11:00", end: "16:00" },
      sunday: { start: "", end: "" }
    }
  },
  {
    DoctorName: "Dr. Usman Sheikh",
    email: "usman.sheikh@general.com",
    password: "Doctor@123",
    phone: "03011112233",
    specialization: "General Medicine",
    about: "General physician with comprehensive approach to primary healthcare.",
    medicalDegree: "MBBS, FCPS Medicine",
    residency: "Internal Medicine Residency - Civil Hospital",
    fellowship: "Primary Care Fellowship - Johns Hopkins",
    boardCertification: "Pakistan Medical Council, American Board of Internal Medicine",
    licenses: "PMC Registered - PMC-67890",
    deaRegistration: "DEA-12345",
    hospitalAffiliations: "Civil Hospital, Jinnah Hospital",
    memberships: "Pakistan Medical Association, American College of Physicians",
    malpracticeInsurance: "Yes",
    address: "North Nazimabad, Karachi",
    education: "MBBS from Sindh Medical College, FCPS from College of Physicians and Surgeons",
    status: "approved",
    verified: true,
    verificationDate: new Date(),
    no_of_patients: 3200,
    department: "General Medicine",
    bio: "Dedicated general physician providing comprehensive primary care.",
    experience: "20 years",
    qualifications: ["MBBS", "FCPS Medicine", "Fellowship in Primary Care"],
    languages: ["English", "Urdu", "Sindhi"],
    consultationFee: 2500,
    addressStructured: {
      street: "North Nazimabad",
      city: "Karachi",
      state: "Sindh",
      zipCode: "74700",
      country: "Pakistan"
    },
    workingHours: {
      monday: { start: "08:00", end: "20:00" },
      tuesday: { start: "08:00", end: "20:00" },
      wednesday: { start: "08:00", end: "20:00" },
      thursday: { start: "08:00", end: "20:00" },
      friday: { start: "08:00", end: "18:00" },
      saturday: { start: "09:00", end: "17:00" },
      sunday: { start: "10:00", end: "16:00" }
    }
  },
  {
    DoctorName: "Dr. Zainab Abbas",
    email: "zainab.abbas@psych.com",
    password: "Doctor@123",
    phone: "03013334455",
    specialization: "Psychiatry",
    about: "Psychiatrist specializing in mood disorders and cognitive behavioral therapy.",
    medicalDegree: "MBBS, FCPS Psychiatry",
    residency: "Psychiatry Residency - Institute of Psychiatry",
    fellowship: "Mood Disorders Fellowship - Stanford University",
    boardCertification: "Pakistan Medical Council, American Board of Psychiatry and Neurology",
    licenses: "PMC Registered - PMC-78901",
    deaRegistration: "DEA-23456",
    hospitalAffiliations: "Institute of Psychiatry, Aga Khan Hospital",
    memberships: "Pakistan Psychiatric Society, American Psychiatric Association",
    malpracticeInsurance: "Yes",
    address: "Defence, Lahore",
    education: "MBBS from King Edward Medical University, FCPS from College of Physicians and Surgeons",
    status: "approved",
    verified: true,
    verificationDate: new Date(),
    no_of_patients: 850,
    department: "Psychiatry",
    bio: "Compassionate psychiatrist focused on mental health and well-being.",
    experience: "13 years",
    qualifications: ["MBBS", "FCPS Psychiatry", "Fellowship in Mood Disorders"],
    languages: ["English", "Urdu", "Punjabi"],
    consultationFee: 5500,
    addressStructured: {
      street: "Defence",
      city: "Lahore",
      state: "Punjab",
      zipCode: "54000",
      country: "Pakistan"
    },
    workingHours: {
      monday: { start: "09:00", end: "17:00" },
      tuesday: { start: "09:00", end: "17:00" },
      wednesday: { start: "09:00", end: "17:00" },
      thursday: { start: "09:00", end: "17:00" },
      friday: { start: "09:00", end: "15:00" },
      saturday: { start: "10:00", end: "14:00" },
      sunday: { start: "", end: "" }
    }
  },
  {
    DoctorName: "Dr. Hassan Ali",
    email: "hassan.ali@radiology.com",
    password: "Doctor@123",
    phone: "03015556677",
    specialization: "Radiology",
    about: "Radiologist specializing in diagnostic imaging and interventional radiology.",
    medicalDegree: "MBBS, FCPS Radiology",
    residency: "Radiology Residency - Radiology Department",
    fellowship: "Interventional Radiology Fellowship - Mount Sinai",
    boardCertification: "Pakistan Medical Council, American Board of Radiology",
    licenses: "PMC Registered - PMC-89012",
    deaRegistration: "DEA-34567",
    hospitalAffiliations: "Radiology Department, Shifa International Hospital",
    memberships: "Pakistan Radiological Society, American College of Radiology",
    malpracticeInsurance: "Yes",
    address: "F-8, Islamabad",
    education: "MBBS from Rawalpindi Medical College, FCPS from College of Physicians and Surgeons",
    status: "approved",
    verified: true,
    verificationDate: new Date(),
    no_of_patients: 0, // Radiologists typically don't have direct patients
    department: "Radiology",
    bio: "Expert radiologist providing accurate diagnostic imaging services.",
    experience: "11 years",
    qualifications: ["MBBS", "FCPS Radiology", "Fellowship in Interventional Radiology"],
    languages: ["English", "Urdu", "Punjabi"],
    consultationFee: 3000,
    addressStructured: {
      street: "F-8",
      city: "Islamabad",
      state: "Federal",
      zipCode: "44000",
      country: "Pakistan"
    },
    workingHours: {
      monday: { start: "08:00", end: "16:00" },
      tuesday: { start: "08:00", end: "16:00" },
      wednesday: { start: "08:00", end: "16:00" },
      thursday: { start: "08:00", end: "16:00" },
      friday: { start: "08:00", end: "14:00" },
      saturday: { start: "09:00", end: "13:00" },
      sunday: { start: "", end: "" }
    }
  },
  {
    DoctorName: "Dr. Mariam Khan",
    email: "mariam.khan@oncology.com",
    password: "Doctor@123",
    phone: "03017778899",
    specialization: "Oncology",
    about: "Medical oncologist specializing in cancer treatment and palliative care.",
    medicalDegree: "MBBS, FCPS Oncology",
    residency: "Internal Medicine Residency - Cancer Hospital",
    fellowship: "Medical Oncology Fellowship - MD Anderson",
    boardCertification: "Pakistan Medical Council, American Board of Internal Medicine",
    licenses: "PMC Registered - PMC-90123",
    deaRegistration: "DEA-45678",
    hospitalAffiliations: "Cancer Hospital, Shaukat Khanum Memorial Hospital",
    memberships: "Pakistan Oncology Society, American Society of Clinical Oncology",
    malpracticeInsurance: "Yes",
    address: "Gulshan-e-Iqbal, Karachi",
    education: "MBBS from Dow Medical College, FCPS from College of Physicians and Surgeons",
    status: "approved",
    verified: true,
    verificationDate: new Date(),
    no_of_patients: 750,
    department: "Oncology",
    bio: "Compassionate oncologist dedicated to cancer care and patient support.",
    experience: "17 years",
    qualifications: ["MBBS", "FCPS Oncology", "Fellowship in Medical Oncology"],
    languages: ["English", "Urdu", "Sindhi"],
    consultationFee: 7000,
    addressStructured: {
      street: "Gulshan-e-Iqbal",
      city: "Karachi",
      state: "Sindh",
      zipCode: "75300",
      country: "Pakistan"
    },
    workingHours: {
      monday: { start: "09:00", end: "17:00" },
      tuesday: { start: "09:00", end: "17:00" },
      wednesday: { start: "09:00", end: "17:00" },
      thursday: { start: "09:00", end: "17:00" },
      friday: { start: "09:00", end: "15:00" },
      saturday: { start: "10:00", end: "14:00" },
      sunday: { start: "", end: "" }
    }
  },
  {
    DoctorName: "Dr. Ahmed Raza",
    email: "ahmed.raza@surgery.com",
    password: "Doctor@123",
    phone: "03019990011",
    specialization: "General Surgery",
    about: "General surgeon with expertise in laparoscopic and minimally invasive procedures.",
    medicalDegree: "MBBS, FCPS Surgery",
    residency: "General Surgery Residency - Surgical Department",
    fellowship: "Minimally Invasive Surgery Fellowship - Cleveland Clinic",
    boardCertification: "Pakistan Medical Council, American Board of Surgery",
    licenses: "PMC Registered - PMC-01234",
    deaRegistration: "DEA-56789",
    hospitalAffiliations: "Surgical Department, Aga Khan Hospital",
    memberships: "Pakistan Surgical Society, American College of Surgeons",
    malpracticeInsurance: "Yes",
    address: "Bahadurabad, Karachi",
    education: "MBBS from Sindh Medical College, FCPS from College of Physicians and Surgeons",
    status: "approved",
    verified: true,
    verificationDate: new Date(),
    no_of_patients: 1400,
    department: "General Surgery",
    bio: "Skilled surgeon committed to advanced surgical techniques and patient care.",
    experience: "19 years",
    qualifications: ["MBBS", "FCPS Surgery", "Fellowship in Minimally Invasive Surgery"],
    languages: ["English", "Urdu", "Sindhi"],
    consultationFee: 6500,
    addressStructured: {
      street: "Bahadurabad",
      city: "Karachi",
      state: "Sindh",
      zipCode: "74800",
      country: "Pakistan"
    },
    workingHours: {
      monday: { start: "08:00", end: "17:00" },
      tuesday: { start: "08:00", end: "17:00" },
      wednesday: { start: "08:00", end: "17:00" },
      thursday: { start: "08:00", end: "17:00" },
      friday: { start: "08:00", end: "15:00" },
      saturday: { start: "09:00", end: "14:00" },
      sunday: { start: "", end: "" }
    }
  }
];

// Function to populate the database
const populateDatabase = async () => {
  try {
    console.log("Starting database population...");
    
    // Clear existing doctors (optional - remove this if you want to keep existing data)
    await Doctor.deleteMany({});
    console.log("Cleared existing doctor records");
    
    // Insert dummy doctors
    const insertedDoctors = await Doctor.insertMany(dummyDoctors);
    console.log(`Successfully inserted ${insertedDoctors.length} doctors`);
    
    // Display summary
    console.log("\n=== Database Population Summary ===");
    console.log(`Total doctors inserted: ${insertedDoctors.length}`);
    
    // Group by specialization
    const specializationCount = {};
    insertedDoctors.forEach(doctor => {
      specializationCount[doctor.specialization] = (specializationCount[doctor.specialization] || 0) + 1;
    });
    
    console.log("\nDoctors by specialization:");
    Object.entries(specializationCount).forEach(([spec, count]) => {
      console.log(`  ${spec}: ${count} doctors`);
    });
    
    console.log("\nDatabase population completed successfully!");
    
  } catch (error) {
    console.error("Error populating database:", error);
  } finally {
    // Close database connection
    await mongoose.connection.close();
    console.log("Database connection closed");
    process.exit(0);
  }
};

// Main execution
const main = async () => {
  await connectDB();
  await populateDatabase();
};

// Run the script
main().catch(console.error);
