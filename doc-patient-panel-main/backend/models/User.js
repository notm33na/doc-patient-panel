import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {type: String,required: true,enum: ["Super Admin", "Admin", "Moderator", "Viewer"]},
    department: { type: String },
  },
  { timestamps: true }
);

// Use "User" collection
export default mongoose.model("User", userSchema, "Admin");
