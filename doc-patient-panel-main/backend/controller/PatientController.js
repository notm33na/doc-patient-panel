import Patient from "../models/Patient.js";

// Create a new patient
export const createPatient = async (req, res) => {
  try {
    const patient = new Patient(req.body);
    await patient.save();
    res.status(201).json({ success: true, patient });
  } catch (error) {
    console.error("Error creating patient:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Get all patients
export const getAllPatients = async (req, res) => {
  try {
    const patients = await Patient.find().populate("doctorId", "DoctorName specialization");
    res.status(200).json({ success: true, patients });
  } catch (error) {
    console.error("Error fetching patients:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Get a single patient by ID
export const getPatientById = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id).populate("doctorId", "DoctorName specialization");
    if (!patient) return res.status(404).json({ success: false, message: "Patient not found" });
    res.status(200).json({ success: true, patient });
  } catch (error) {
    console.error("Error fetching patient:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Update patient by ID
export const updatePatient = async (req, res) => {
  try {
    const patient = await Patient.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!patient) return res.status(404).json({ success: false, message: "Patient not found" });
    res.status(200).json({ success: true, patient });
  } catch (error) {
    console.error("Error updating patient:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Delete patient by ID
export const deletePatient = async (req, res) => {
  try {
    const patient = await Patient.findByIdAndDelete(req.params.id);
    if (!patient) return res.status(404).json({ success: false, message: "Patient not found" });
    res.status(200).json({ success: true, message: "Patient deleted" });
  } catch (error) {
    console.error("Error deleting patient:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
