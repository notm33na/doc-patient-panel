import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema(
  {
    DoctorName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    specialization: { type: String },
    experience: String,
    phone: { type: String },
    department: { type: String },
    sentiment: { type: String },
    sentiment_score: { type: Number },
    no_of_patients: { type: Number },
    about: String,
    medicalDegree: String,
    residency: String,
    fellowship: String,
    boardCertification: String,
    licenses: String,
    deaRegistration: String,
    hospitalAffiliations: String,
    memberships: String,
    malpracticeInsurance: String,
    address: String,
    education: String,
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
