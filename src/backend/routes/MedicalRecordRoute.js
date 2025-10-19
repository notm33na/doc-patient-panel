import express from "express";
import {
  getMedicalRecords,
  getMedicalRecord,
  addMedicalRecord,
  updateMedicalRecord,
  deleteMedicalRecord,
  getMedicalRecordsByPatient
} from "../controller/medicalRecordController.js";

const router = express.Router();

// @route   GET /api/medical-records
// @desc    Get all medical records
router.get("/", getMedicalRecords);

// @route   GET /api/medical-records/:id
// @desc    Get single medical record by ID
router.get("/:id", getMedicalRecord);

// @route   GET /api/medical-records/patient/:patientId
// @desc    Get medical records by patient ID
router.get("/patient/:patientId", getMedicalRecordsByPatient);

// @route   POST /api/medical-records
// @desc    Add new medical record
router.post("/", addMedicalRecord);

// @route   PUT /api/medical-records/:id
// @desc    Update medical record
router.put("/:id", updateMedicalRecord);

// @route   DELETE /api/medical-records/:id
// @desc    Delete medical record
router.delete("/:id", deleteMedicalRecord);

export default router;
