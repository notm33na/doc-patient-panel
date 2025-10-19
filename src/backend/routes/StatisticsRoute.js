import express from "express";
import { getDashboardStats, getTrafficStats, getPatientTrends, getAppointmentOverview } from "../controller/statisticsController.js";
import { protect as authMiddleware } from "../middleware/authmiddleware.js";

const router = express.Router();

// Statistics routes - require authentication
router.get("/dashboard", authMiddleware, getDashboardStats);
router.get("/traffic", authMiddleware, getTrafficStats);
router.get("/patient-trends", authMiddleware, getPatientTrends);
router.get("/appointments", authMiddleware, getAppointmentOverview);

export default router;
