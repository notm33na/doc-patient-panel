import express from "express";
import {
  registerAdmin,
  loginAdmin,
  getAdmins,
  addAdmin,
  deleteAdmin,
  updateAdmin,
  getMe,
  updateMe,
  changePassword,
  checkEmailExists,
  checkPhoneExists,
} from "../controller/adminController.js";
import { protect as authMiddleware } from "../middleware/authmiddleware.js";

const router = express.Router();

router.post("/register", registerAdmin);
router.post("/login", loginAdmin);
router.get("/me", authMiddleware, getMe);
router.put("/me", authMiddleware, updateMe);
router.put("/change-password", authMiddleware, changePassword);
router.get("/", getAdmins);
router.post("/", addAdmin);
router.delete("/:id", deleteAdmin);
router.put("/:id", updateAdmin);
router.get("/check-email/:email", checkEmailExists);
router.get("/check-phone/:phone", checkPhoneExists);

export default router;
