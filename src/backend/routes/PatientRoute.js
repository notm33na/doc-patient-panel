import express from "express";
import {
  getPatients,
  getPatient,
  addPatient,
  updatePatient,
  deletePatient,
  getPatientsByStatus,
  searchPatients
} from "../controller/patientController.js";
import { protect as authMiddleware } from "../middleware/authmiddleware.js";

const router = express.Router();

// Patient routes
router.get("/", getPatients);
router.get("/search/:query", searchPatients);
router.get("/status/:status", getPatientsByStatus);
router.get("/:id", getPatient);
router.post("/", addPatient);
router.put("/:id", updatePatient);
router.delete("/:id", deletePatient);

export default router;
