import express from "express";
import {
  getAllDoctors,
  addDoctor,
  getDoctorById,
  updateDoctor,
  deleteDoctor,
  approveDoctor,
  rejectDoctor,
  suspendDoctor,
  updateDoctorStatus,
} from "../controller/DrController.js";

const router = express.Router();

// Add a new doctor
router.post("/", addDoctor);

// Get all doctors
router.get("/", getAllDoctors);

// Get a single doctor by ID
router.get("/:id", getDoctorById);

// Update doctor information
router.put("/:id", updateDoctor);

// Delete a doctor
router.delete("/:id", deleteDoctor);

// Approve a doctor
router.put("/:id/approve", approveDoctor);

// Reject a doctor
router.put("/:id/reject", rejectDoctor);

// Suspend a doctor
router.put("/:id/suspend", suspendDoctor);

// Update doctor status (approved / rejected / pending / suspended)
router.put("/:id/status", updateDoctorStatus);

export default router;
