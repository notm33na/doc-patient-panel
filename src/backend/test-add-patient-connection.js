#!/usr/bin/env node

// Test script to verify AddPatient frontend-backend connection
// Run this with: node test-add-patient-connection.js

import dotenv from "dotenv";
import mongoose from "mongoose";
import Patient from "./models/Patient.js";

// Load environment variables
dotenv.config();

const testAddPatientConnection = async () => {
  try {
    // Connect to MongoDB Atlas
    console.log("🔌 Connecting to MongoDB Atlas...");
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB Atlas");

    // Test data that matches the AddPatient form
    const testPatientData = {
      firstName: "Test",
      lastName: "Patient",
      emailAddress: "test.patient@example.com",
      phone: "+92-300-0000000",
      password: "testpassword123",
      profileImage: "",
      gender: "Male",
      Age: "30",
      
      // Address (flattened structure as sent by frontend)
      street: "123 Test Street",
      city: "Karachi",
      state: "Sindh",
      zipCode: "75000",
      country: "Pakistan",
      
      isActive: "true",
      
      // Medical Information Arrays
      symptoms: ["Test symptom"],
      medications: ["Test medication"],
      allergies: ["Test allergy"],
      chronicConditions: ["Test condition"],
      vaccinations: ["Test vaccination"],
      
      // Vitals
      weight: "70 kg",
      height: "5'10\"",
      
      // Additional Medical Information
      notes: "Test patient created via API connection test"
    };

    console.log("📝 Testing Patient API endpoint...");
    
    // Test the API endpoint directly
    const response = await fetch('http://localhost:5000/api/patients', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testPatientData)
    });

    if (response.ok) {
      const newPatient = await response.json();
      console.log("✅ Patient API endpoint working!");
      console.log("Patient ID:", newPatient._id);
      console.log("Patient Name:", `${newPatient.firstName} ${newPatient.lastName}`);
      console.log("Email:", newPatient.emailAddress);
      
      // Verify the patient was saved in database
      const savedPatient = await Patient.findById(newPatient._id);
      if (savedPatient) {
        console.log("✅ Patient verified in database");
        console.log("Collection name:", Patient.collection.name);
        
        // Clean up test patient
        console.log("🧹 Cleaning up test patient...");
        await Patient.findByIdAndDelete(newPatient._id);
        console.log("✅ Test patient removed");
      }
      
    } else {
      const errorData = await response.json();
      console.error("❌ API endpoint error:", errorData);
    }

    // Test GET endpoint
    console.log("\n📋 Testing GET /api/patients endpoint...");
    const getResponse = await fetch('http://localhost:5000/api/patients');
    
    if (getResponse.ok) {
      const patients = await getResponse.json();
      console.log(`✅ GET endpoint working! Found ${patients.length} patients`);
    } else {
      console.error("❌ GET endpoint error:", getResponse.status);
    }

  } catch (error) {
    console.error("❌ Error:", error.message);
    console.log("\n💡 Make sure your backend server is running:");
    console.log("   cd src/backend && npm start");
  } finally {
    // Close connection
    await mongoose.connection.close();
    console.log("\n🔌 Disconnected from MongoDB Atlas");
    process.exit(0);
  }
};

// Run the test
testAddPatientConnection();
