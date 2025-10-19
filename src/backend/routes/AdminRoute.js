import express from "express";
import {
  registerAdmin,
  loginAdmin,
  logoutAdmin,
  getAdmins,
  addAdmin,
  deleteAdmin,
  updateAdmin,
  getMe,
  updateMe,
  changePassword,
  checkEmailExists,
  checkPhoneExists,
  forgotPassword,
  resetPassword,
  verifyResetToken,
} from "../controller/adminController.js";
import { protect as authMiddleware } from "../middleware/authmiddleware.js";

const router = express.Router();

router.post("/register", registerAdmin);
router.post("/login", loginAdmin);
router.post("/logout", authMiddleware, logoutAdmin);
router.get("/me", authMiddleware, getMe);
router.put("/me", authMiddleware, updateMe);
router.put("/change-password", authMiddleware, changePassword);
router.get("/", getAdmins);
router.post("/", authMiddleware, addAdmin);
router.delete("/:id", authMiddleware, deleteAdmin);
router.put("/:id", authMiddleware, updateAdmin);
router.get("/check-email/:email", checkEmailExists);
router.get("/check-phone/:phone", checkPhoneExists);

// Password reset routes (no authentication required)
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.get("/verify-reset-token/:token", verifyResetToken);

export default router;
