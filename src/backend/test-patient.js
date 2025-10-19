#!/usr/bin/env node

// Test script to upload dummy patient data to MongoDB Atlas
// Run this with: node test-patient.js

import dotenv from "dotenv";
import mongoose from "mongoose";
import Patient from "./models/Patient.js";

// Load environment variables
dotenv.config();

const dummyPatients = [
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
    symptoms: ["Headache", "Fever", "Cough"],
    medications: ["Paracetamol", "Ibuprofen", "Cough Syrup"],
    allergies: ["Penicillin", "Dust"],
    chronicConditions: ["Diabetes Type 2", "Hypertension"],
    vaccinations: ["COVID-19", "Flu", "Hepatitis B"],
    weight: "75 kg",
    height: "5'8\"",
    notes: "Regular checkup patient. Follows diabetic diet. Blood pressure under control.",
    createdBy: null,
    lastVisit: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
    nextAppointment: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days from now
  },
  {
    userRole: "Patient",
    firstName: "Fatima",
    lastName: "Ali",
    emailAddress: "fatima.ali@example.com",
    phone: "+92-301-2345678",
    password: "hashedpassword123",
    profileImage: "",
    gender: "Female",
    Age: "28",
    address: {
      street: "456 Oak Avenue",
      city: "Lahore",
      state: "Punjab",
      zipCode: "54000",
      country: "Pakistan"
    },
    isActive: "true",
    symptoms: ["Back pain", "Fatigue"],
    medications: ["Pain relievers", "Multivitamins"],
    allergies: ["None"],
    chronicConditions: ["Anemia"],
    vaccinations: ["COVID-19", "Tetanus"],
    weight: "55 kg",
    height: "5'4\"",
    notes: "Pregnant patient. Regular prenatal care. Iron supplements prescribed.",
    createdBy: null,
    lastVisit: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    nextAppointment: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000) // 14 days from now
  },
  {
    userRole: "Patient",
    firstName: "Muhammad",
    lastName: "Hassan",
    emailAddress: "muhammad.hassan@example.com",
    phone: "+92-302-3456789",
    password: "hashedpassword123",
    profileImage: "",
    gender: "Male",
    Age: "42",
    address: {
      street: "789 Pine Road",
      city: "Islamabad",
      state: "Federal",
      zipCode: "44000",
      country: "Pakistan"
    },
    isActive: "true",
    symptoms: ["Chest pain", "Shortness of breath"],
    medications: ["Aspirin", "Beta blockers", "ACE inhibitors"],
    allergies: ["Shellfish"],
    chronicConditions: ["Heart Disease", "High Cholesterol"],
    vaccinations: ["COVID-19", "Pneumonia"],
    weight: "85 kg",
    height: "5'10\"",
    notes: "Cardiac patient. Regular ECG monitoring. Low sodium diet recommended.",
    createdBy: null,
    lastVisit: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    nextAppointment: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days from now
  },
  {
    userRole: "Patient",
    firstName: "Ayesha",
    lastName: "Malik",
    emailAddress: "ayesha.malik@example.com",
    phone: "+92-303-4567890",
    password: "hashedpassword123",
    profileImage: "",
    gender: "Female",
    Age: "31",
    address: {
      street: "321 Elm Street",
      city: "Rawalpindi",
      state: "Punjab",
      zipCode: "46000",
      country: "Pakistan"
    },
    isActive: "true",
    symptoms: ["Joint pain", "Stiffness"],
    medications: ["Anti-inflammatory", "Pain relievers"],
    allergies: ["Latex"],
    chronicConditions: ["Arthritis", "Osteoporosis"],
    vaccinations: ["COVID-19", "Flu"],
    weight: "60 kg",
    height: "5'6\"",
    notes: "Rheumatoid arthritis patient. Physical therapy recommended. Calcium supplements.",
    createdBy: null,
    lastVisit: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
    nextAppointment: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000) // 21 days from now
  },
  {
    userRole: "Patient",
    firstName: "Usman",
    lastName: "Sheikh",
    emailAddress: "usman.sheikh@example.com",
    phone: "+92-304-5678901",
    password: "hashedpassword123",
    profileImage: "",
    gender: "Male",
    Age: "26",
    address: {
      street: "654 Maple Drive",
      city: "Faisalabad",
      state: "Punjab",
      zipCode: "38000",
      country: "Pakistan"
    },
    isActive: "true",
    symptoms: ["Anxiety", "Insomnia"],
    medications: ["Anti-anxiety", "Sleep aids"],
    allergies: ["None"],
    chronicConditions: ["Depression", "Anxiety Disorder"],
    vaccinations: ["COVID-19"],
    weight: "70 kg",
    height: "5'9\"",
    notes: "Mental health patient. Regular counseling sessions. Medication compliance good.",
    createdBy: null,
    lastVisit: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    nextAppointment: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000) // 14 days from now
  },
  {
    userRole: "Patient",
    firstName: "Sara",
    lastName: "Ahmed",
    emailAddress: "sara.ahmed@example.com",
    phone: "+92-305-6789012",
    password: "hashedpassword123",
    profileImage: "",
    gender: "Female",
    Age: "19",
    address: {
      street: "987 Cedar Lane",
      city: "Multan",
      state: "Punjab",
      zipCode: "60000",
      country: "Pakistan"
    },
    isActive: "true",
    symptoms: ["Skin rash", "Itching"],
    medications: ["Antihistamines", "Topical cream"],
    allergies: ["Pollen", "Pet dander"],
    chronicConditions: ["Eczema"],
    vaccinations: ["COVID-19", "Hepatitis A"],
    weight: "50 kg",
    height: "5'3\"",
    notes: "Dermatology patient. Avoid known allergens. Moisturizing routine recommended.",
    createdBy: null,
    lastVisit: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), // 4 days ago
    nextAppointment: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000) // 28 days from now
  },
  {
    userRole: "Patient",
    firstName: "Hassan",
    lastName: "Raza",
    emailAddress: "hassan.raza@example.com",
    phone: "+92-306-7890123",
    password: "hashedpassword123",
    profileImage: "",
    gender: "Male",
    Age: "55",
    address: {
      street: "147 Birch Street",
      city: "Peshawar",
      state: "KPK",
      zipCode: "25000",
      country: "Pakistan"
    },
    isActive: "true",
    symptoms: ["Memory loss", "Confusion"],
    medications: ["Memory enhancers", "Vitamin B12"],
    allergies: ["None"],
    chronicConditions: ["Alzheimer's Disease", "Vitamin B12 Deficiency"],
    vaccinations: ["COVID-19", "Pneumonia"],
    weight: "72 kg",
    height: "5'7\"",
    notes: "Geriatric patient. Family support available. Regular cognitive assessments.",
    createdBy: null,
    lastVisit: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000), // 6 days ago
    nextAppointment: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000) // 14 days from now
  },
  {
    userRole: "Patient",
    firstName: "Zainab",
    lastName: "Khan",
    emailAddress: "zainab.khan@example.com",
    phone: "+92-307-8901234",
    password: "hashedpassword123",
    profileImage: "",
    gender: "Female",
    Age: "33",
    address: {
      street: "258 Spruce Avenue",
      city: "Quetta",
      state: "Balochistan",
      zipCode: "87300",
      country: "Pakistan"
    },
    isActive: "true",
    symptoms: ["Abdominal pain", "Nausea"],
    medications: ["Antacids", "Pain relievers"],
    allergies: ["NSAIDs"],
    chronicConditions: ["GERD", "Gastritis"],
    vaccinations: ["COVID-19", "Hepatitis A"],
    weight: "58 kg",
    height: "5'5\"",
    notes: "Gastroenterology patient. Avoid spicy foods. Small frequent meals recommended.",
    createdBy: null,
    lastVisit: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000), // 8 days ago
    nextAppointment: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000) // 21 days from now
  }
];

const uploadDummyData = async () => {
  try {
    // Connect to MongoDB Atlas
    console.log("🔌 Connecting to MongoDB Atlas...");
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB Atlas");

    // Clear existing patients (optional - remove this if you want to keep existing data)
    console.log("🧹 Clearing existing patients...");
    await Patient.deleteMany({});
    console.log("✅ Existing patients cleared");

    // Upload dummy patients
    console.log(`📝 Uploading ${dummyPatients.length} dummy patients...`);
    
    const createdPatients = [];
    for (let i = 0; i < dummyPatients.length; i++) {
      const patientData = dummyPatients[i];
      const newPatient = new Patient(patientData);
      await newPatient.save();
      createdPatients.push(newPatient);
      console.log(`✅ Patient ${i + 1}/${dummyPatients.length} created: ${newPatient.firstName} ${newPatient.lastName}`);
    }

    console.log("\n🎉 All dummy patients uploaded successfully!");
    console.log(`📊 Total patients in database: ${createdPatients.length}`);
    
    // Display summary
    console.log("\n📋 Patient Summary:");
    createdPatients.forEach((patient, index) => {
      console.log(`${index + 1}. ${patient.firstName} ${patient.lastName} (${patient.gender}, Age: ${patient.Age})`);
      console.log(`   Email: ${patient.emailAddress}`);
      console.log(`   City: ${patient.address.city}, ${patient.address.state}`);
      console.log(`   Conditions: ${patient.chronicConditions.join(", ") || "None"}`);
      console.log(`   Next Appointment: ${patient.nextAppointment.toLocaleDateString()}`);
      console.log("");
    });

    // Verify collection exists and has data
    const totalCount = await Patient.countDocuments();
    console.log(`✅ Verification: ${totalCount} patients found in database`);
    console.log(`📁 Collection name: ${Patient.collection.name}`);

    // Test some queries
    console.log("\n🔍 Testing queries:");
    
    // Count by gender
    const maleCount = await Patient.countDocuments({ gender: "Male" });
    const femaleCount = await Patient.countDocuments({ gender: "Female" });
    console.log(`👨 Male patients: ${maleCount}`);
    console.log(`👩 Female patients: ${femaleCount}`);
    
    // Count by city
    const cities = await Patient.distinct("address.city");
    console.log(`🏙️ Cities represented: ${cities.join(", ")}`);
    
    // Count with chronic conditions
    const withConditions = await Patient.countDocuments({ 
      chronicConditions: { $exists: true, $not: { $size: 0 } } 
    });
    console.log(`🏥 Patients with chronic conditions: ${withConditions}`);

  } catch (error) {
    console.error("❌ Error:", error.message);
  } finally {
    // Close connection
    await mongoose.connection.close();
    console.log("\n🔌 Disconnected from MongoDB Atlas");
    process.exit(0);
  }
};

// Run the upload
uploadDummyData();
