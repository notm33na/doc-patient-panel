import express from "express";
import {
  getAdminActivities,
  getAdminActivityStats,
  getAdminActivitiesByAdmin,
} from "../controller/adminActivityController.js";
import { protect as authMiddleware } from "../middleware/authmiddleware.js";

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

router.get("/", getAdminActivities);
router.get("/stats", getAdminActivityStats);
router.get("/admin/:adminId", getAdminActivitiesByAdmin);

export default router;
