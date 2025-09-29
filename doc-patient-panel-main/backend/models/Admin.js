import mongoose from "mongoose";

const adminSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    role: { type: String, required: true },
    department: { type: String, required: true },
  },
  { timestamps: true }
);

// Explicitly use "Admin" collection in "Tabeeb" database
export default mongoose.model("Admin", adminSchema, "Admin");
