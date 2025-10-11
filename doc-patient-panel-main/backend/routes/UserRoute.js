import express from "express";
import {
  registerUser,
  loginUser,
  getUsers,
  addUser,
  deleteUser,
  updateUser,
  getMe,
  updateMe,
} from "../controller/userController.js";
import User from "../models/User.js"; 

import { protect as authMiddleware } from "../middleware/authmiddleware.js"; 

const router = express.Router();

// ============================
// AUTH ROUTES
// ============================

router.post("/signup", registerUser);
router.post("/login", loginUser);

// ============================
// USER MANAGEMENT ROUTES
// ============================

// ✅ Get all admins
router.get("/admins", async (req, res) => {
  try {
    const admins = await User.find({
      role: { $in: ["Admin", "Super Admin", "Moderator", "Viewer"] },
    })
      .select("-password")
      .sort({ createdAt: -1 });

    res.status(200).json(admins);
  } catch (error) {
    console.error("Error fetching admins:", error);
    res.status(500).json({ message: "Error fetching admins" });
  }
});

// Get current user
router.get("/me", getMe);

// Update current user
router.put("/me", updateMe);

// Get all users
router.get("/", getUsers);

// Add a new user
router.post("/", addUser);

// Delete a user
router.delete("/:id", deleteUser);

// Update a user
router.put("/:id", updateUser);

export default router;
