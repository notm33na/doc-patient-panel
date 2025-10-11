import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

// JWT Helper
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1d" });
};

// Format user response (hide password)
const formatUser = (user) => {
  if (!user) return null;
  const { _id, firstName, lastName, email, role,  department, createdAt, updatedAt } = user;
  return { _id, firstName, lastName, email, role,  department, createdAt, updatedAt };
};

// ===================================================
// AUTH CONTROLLERS
// ===================================================

// @desc   Register new user
// @route  POST /api/signup
export const registerUser = async (req, res) => {
  const { firstName, lastName, email, password, role, department } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role,
      department,
    });

    res.status(201).json({
      user: formatUser(user),
      token: generateToken(user.id),
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc   Login user
// @route  POST /api/login
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password || "");
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    res.json({
      user: formatUser(user),
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
  res.json({ user: formatUser(req.user) });
};

// @desc   Update profile of logged-in user
// @route  PUT /api/users/me
export const updateMe = async (req, res) => {
  try {
    const updated = await User.findByIdAndUpdate(req.user._id, req.body, { new: true });
    if (!updated) return res.status(404).json({ error: "User not found" });

    res.json({ user: formatUser(updated) });
  } catch (err) {
    console.error("Error updating user:", err);
    res.status(500).json({ error: "Failed to update user" });
  }
};

// ===================================================
// USER MANAGEMENT CONTROLLERS (Admin)
// ===================================================

// @desc   Get all users
// @route  GET /api/users
export const getUsers = async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.json(users.map((u) => formatUser(u)));
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ error: "Failed to fetch users" });
  }
};

// @desc   Add new user (admin only)
// @route  POST /api/users
export const addUser = async (req, res) => {
  try {
    const { firstName, lastName, email, role, department, password } = req.body;

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ error: "Email already exists" });
    }

    // Use given password or a default
    const plainPassword = password || "default123";
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(plainPassword, salt);

    const newUser = new User({
      firstName,
      lastName,
      email,
      role,
      department,
      password: hashedPassword,
    });

    await newUser.save();
    res.status(201).json({ user: formatUser(newUser) });
  } catch (err) {
    console.error("Error saving user:", err);
    res.status(400).json({ error: err.message });
  }
};

// @desc   Delete a user
// @route  DELETE /api/users/:id
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await User.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ error: "User not found" });

    res.json({ message: "User deleted successfully" });
  } catch (err) {
    console.error("Error deleting user:", err);
    res.status(500).json({ error: "Failed to delete user" });
  }
};

// @desc   Update a user (admin only)
// @route  PUT /api/users/:id
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;

    // If updating password, hash it
    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      req.body.password = await bcrypt.hash(req.body.password, salt);
    }

    const updated = await User.findByIdAndUpdate(id, req.body, { new: true });
    if (!updated) return res.status(404).json({ error: "User not found" });

    res.json({ user: formatUser(updated) });
  } catch (err) {
    console.error("Error updating user:", err);
    res.status(500).json({ error: "Failed to update user" });
  }
};
