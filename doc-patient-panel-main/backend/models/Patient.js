import mongoose from "mongoose";

const PatientSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    age: { type: Number, required: true },
    gender: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    doctorId: { type: mongoose.Schema.Types.ObjectId, ref: "Doctor", required: true },
    disease: { type: String, required: true },
    appointment: { type: Date, required: true },
    nextAppointment: { type: Date, required: true },
    address: { type: String, required: true },
    status: { type: String, required: true },
  },
  {
    timestamps: true, // adds createdAt and updatedAt
  }
);

export default mongoose.model("Patients_List", PatientSchema, "Patients_List");
