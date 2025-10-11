import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema(
  {
    DoctorName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    specialization: { type: String },
    phone: { type: String },
    department: { type: String },
    sentiment: { type: String },
    sentiment_score: { type: Number },
    no_of_patients: { type: Number },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

//export default mongoose.model("Doctor", doctorSchema);
// Use "User" collection
export default mongoose.model("Doctor", doctorSchema, "Doctor");
