import bcrypt from "bcryptjs";
import Patient from "../models/Patient.js";
import MedicalRecord from "../models/MedicalRecord.js";

// @desc   Get all patients
// @route  GET /api/patients
export const getPatients = async (req, res) => {
  try {
    const patients = await Patient.find().sort({ createdAt: -1 });
    res.json(patients);
  } catch (err) {
    console.error("Error fetching patients:", err);
    res.status(500).json({ error: "Failed to fetch patients" });
  }
};

// @desc   Get single patient by ID
// @route  GET /api/patients/:id
export const getPatient = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);
    if (!patient) {
      return res.status(404).json({ error: "Patient not found" });
    }
    res.json(patient);
  } catch (err) {
    console.error("Error fetching patient:", err);
    res.status(500).json({ error: "Failed to fetch patient" });
  }
};

// @desc   Add new patient
// @route  POST /api/patients
export const addPatient = async (req, res) => {
  try {
    const { 
      // Basic Information
      firstName, lastName, emailAddress, phone, password, profileImage, gender, Age,
      // Address
      street, city, state, zipCode, country,
      // Status
      isActive,
      // System fields
      createdBy, lastVisit, nextAppointment,
      // Medical Information (will be saved to MedicalRecord collection)
      symptoms, medications, allergies, chronicConditions, vaccinations, weight, height, notes
    } = req.body;

    console.log("Incoming Patient Data:", req.body);

    // Check for existing patient by emailAddress or phone
    const existingByEmail = await Patient.findOne({ emailAddress });
    if (existingByEmail) {
      return res.status(400).json({ error: "A user with similar credentials exist" });
    }

    const existingByPhone = await Patient.findOne({ phone });
    if (existingByPhone) {
      return res.status(400).json({ error: "A user with similar credentials exist" });
    }

    // Hash password if provided
    let hashedPassword = password;
    if (password) {
      const salt = await bcrypt.genSalt(10);
      hashedPassword = await bcrypt.hash(password, salt);
    }

    // Prepare patient data (basic information only)
    const patientData = {
      userRole: "Patient",
      firstName: firstName || "",
      lastName: lastName || "",
      emailAddress: emailAddress || "",
      phone: phone || "",
      password: hashedPassword || "",
      profileImage: profileImage || "",
      gender: gender || "",
      Age: Age || "",
      
      address: {
        street: street || "",
        city: city || "",
        state: state || "",
        zipCode: zipCode || "",
        country: country || "Pakistan"
      },
      
      isActive: isActive || "true",
      
      // System fields
      createdBy: createdBy || null,
      lastVisit: lastVisit || null,
      nextAppointment: nextAppointment || null
    };

    // Create patient first
    const newPatient = new Patient(patientData);
    await newPatient.save();
    
    console.log("Patient saved successfully:", newPatient);

    // Create medical record for the patient
    const medicalRecordData = {
      patientId: newPatient._id,
      doctorId: null, // Will be set when doctor sees patient
      appointmentId: null, // Will be set when appointment is made
      diagnosis: "",
      symptoms: symptoms ? symptoms.filter(s => s.trim() !== "") : [],
      medications: medications ? medications.filter(m => m.trim() !== "") : [],
      vaccinations: vaccinations ? vaccinations.filter(v => v.trim() !== "") : [],
      vitals: {
        weight: weight || "",
        height: height || "",
        bloodPressure: "",
        heartRate: "",
        temperature: "",
        oxygenSaturation: ""
      },
      allergies: allergies ? allergies.filter(a => a.trim() !== "") : [],
      chronicConditions: chronicConditions ? chronicConditions.filter(c => c.trim() !== "") : [],
      notes: notes || "",
      followUpRequired: false,
      followUpDate: null,
      prescriptions: []
    };

    const newMedicalRecord = new MedicalRecord(medicalRecordData);
    await newMedicalRecord.save();
    
    console.log("Medical record saved successfully:", newMedicalRecord);

    // Return both patient and medical record data
    res.status(201).json({
      patient: newPatient,
      medicalRecord: newMedicalRecord,
      message: "Patient and medical record created successfully"
    });
  } catch (err) {
    console.error("Error saving patient:", err);
    
    // Handle MongoDB unique constraint errors
    if (err.code === 11000) {
      if (err.keyPattern?.emailAddress) {
        return res.status(400).json({ error: "A user with similar credentials exist" });
      }
      if (err.keyPattern?.phone) {
        return res.status(400).json({ error: "A user with similar credentials exist" });
      }
    }
    
    res.status(400).json({ error: err.message });
  }
};

// @desc   Update a patient
// @route  PUT /api/patients/:id
export const updatePatient = async (req, res) => {
  try {
    const { id } = req.params;
    
    // If password is being updated, hash it
    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      req.body.password = await bcrypt.hash(req.body.password, salt);
    }
    
    const updated = await Patient.findByIdAndUpdate(id, req.body, { new: true });
    if (!updated) {
      return res.status(404).json({ error: "Patient not found" });
    }

    res.json(updated);
  } catch (err) {
    console.error("Error updating patient:", err);
    res.status(500).json({ error: "Failed to update patient" });
  }
};

// @desc   Delete a patient
// @route  DELETE /api/patients/:id
export const deletePatient = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Patient.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ error: "Patient not found" });
    }

    res.json({ message: "Patient deleted successfully" });
  } catch (err) {
    console.error("Error deleting patient:", err);
    res.status(500).json({ error: "Failed to delete patient" });
  }
};

// @desc   Get patients by status
// @route  GET /api/patients/status/:status
export const getPatientsByStatus = async (req, res) => {
  try {
    const { status } = req.params;
    const patients = await Patient.find({ isActive: status }).sort({ createdAt: -1 });
    res.json(patients);
  } catch (err) {
    console.error("Error fetching patients by status:", err);
    res.status(500).json({ error: "Failed to fetch patients" });
  }
};

// @desc   Search patients
// @route  GET /api/patients/search/:query
export const searchPatients = async (req, res) => {
  try {
    const { query } = req.params;
    const patients = await Patient.find({
      $or: [
        { firstName: { $regex: query, $options: 'i' } },
        { lastName: { $regex: query, $options: 'i' } },
        { emailAddress: { $regex: query, $options: 'i' } },
        { phone: { $regex: query, $options: 'i' } }
      ]
    }).sort({ createdAt: -1 });
    
    res.json(patients);
  } catch (err) {
    console.error("Error searching patients:", err);
    res.status(500).json({ error: "Failed to search patients" });
  }
};
