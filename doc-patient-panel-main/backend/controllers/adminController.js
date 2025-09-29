import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Admin from "../models/Admin.js";  

//JWT Helper
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1d" });
};


// New registration
export const registerUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const userExists = await Admin.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await Admin.create({
      email,
      password: hashedPassword,
      // Default role
      role: "admin", 
      firstName: "",
      lastName: "",
      department: "",
    });

    res.status(201).json({
      _id: user.id,
      email: user.email,
      token: generateToken(user.id),
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc   Login admin user
// @route  POST /api/auth/login
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await Admin.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password || "");
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    res.json({
      _id: user.id,
      email: user.email,
      token: generateToken(user.id),
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc   Get profile of logged-in user
// @route  GET /api/auth/me
export const getMe = async (req, res) => {
  res.json({ message: "User profile", user: req.user });
};

// ===================================================
// ADMIN MANAGEMENT CONTROLLERS
// ===================================================

// @desc   Get all admins
// @route  GET /api/admins
export const getAdmins = async (req, res) => {
  try {
    const admins = await Admin.find().sort({ createdAt: -1 });
    res.json(admins);
  } catch (err) {
    console.error("Error fetching admins:", err);
    res.status(500).json({ error: "Failed to fetch admins" });
  }
};

// @desc   Add new admin
// @route  POST /api/admins
export const addAdmin = async (req, res) => {
  try {
    const { firstName, lastName, email, role, department } = req.body;

    console.log("Incoming Admin Data:", req.body); // 👈 Debug log

    const existing = await Admin.findOne({ email });
    if (existing) {
      return res.status(400).json({ error: "Email already exists" });
    }

    const newAdmin = new Admin({
      firstName,
      lastName,
      email,
      role,
      department,
    });

    await newAdmin.save();
    console.log("Admin saved successfully:", newAdmin); // 👈 Debug log
    res.status(201).json(newAdmin);
  } catch (err) {
    console.error("Error saving admin:", err); // 👈 Debug log
    res.status(400).json({ error: err.message });
  }
};

// @desc   Delete an admin
// @route  DELETE /api/admins/:id
export const deleteAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Admin.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ error: "Admin not found" });

    res.json({ message: "Admin deleted successfully" });
  } catch (err) {
    console.error("Error deleting admin:", err);
    res.status(500).json({ error: "Failed to delete admin" });
  }
};

// @desc   Update an admin
// @route  PUT /api/admins/:id
export const updateAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await Admin.findByIdAndUpdate(id, req.body, { new: true });
    if (!updated) return res.status(404).json({ error: "Admin not found" });

    res.json(updated);
  } catch (err) {
    console.error("Error updating admin:", err);
    res.status(500).json({ error: "Failed to update admin" });
  }
};
