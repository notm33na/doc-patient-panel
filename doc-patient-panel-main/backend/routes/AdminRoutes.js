import express from "express";
import {
  getAdmins,
  addAdmin,
  deleteAdmin,
  updateAdmin,
} from "../controllers/adminController.js";

const router = express.Router();

router.get("/", getAdmins);
router.post("/", addAdmin);
router.delete("/:id", deleteAdmin);
router.put("/:id", updateAdmin);

export default router;
