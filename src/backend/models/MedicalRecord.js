import mongoose from "mongoose";

const medicalRecordSchema = new mongoose.Schema(
  {
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
    doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    appointmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Appointment', default: null },
    diagnosis: { type: String, default: "" },
    
    symptoms: [{ type: String }],
    medications: [{ type: String }],
    vaccinations: [{ type: String }],
    
    vitals: {
      bloodPressure: { type: String },
      heartRate: { type: String },
      temperature: { type: String },
      weight: { type: String },
      height: { type: String },
      oxygenSaturation: { type: String }
    },
    
    allergies: [{ type: String }],
    chronicConditions: [{ type: String }],
    
    // Additional fields that might be useful
    notes: { type: String },
    followUpRequired: { type: Boolean, default: false },
    followUpDate: { type: Date },
    prescriptions: [{
      medicationName: { type: String },
      dosage: { type: String },
      frequency: { type: String },
      duration: { type: String },
      instructions: { type: String }
    }]
  },
  { timestamps: true }
);

// Indexes for better performance
medicalRecordSchema.index({ patientId: 1 });
medicalRecordSchema.index({ doctorId: 1 });
medicalRecordSchema.index({ appointmentId: 1 });
medicalRecordSchema.index({ createdAt: -1 });

export default mongoose.model("MedicalRecord", medicalRecordSchema, "Patient Medical Record");
