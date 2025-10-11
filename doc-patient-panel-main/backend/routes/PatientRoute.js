import express from "express";
import { createPatient, getAllPatients, getPatientById, updatePatient, deletePatient } from "../controller/PatientController.js";

const router = express.Router();

router.post("/", createPatient);
router.get("/", getAllPatients);
router.get("/:id", getPatientById);
router.put("/:id", updatePatient);
router.delete("/:id", deletePatient);

export default router;
