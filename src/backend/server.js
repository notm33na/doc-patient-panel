import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import adminRoutes from "./routes/AdminRoute.js";
import adminActivityRoutes from "./routes/AdminActivityRoute.js";
import patientRoutes from "./routes/PatientRoute.js";
import doctorRoutes from "./routes/DoctorRoute.js";
import pendingDoctorRoutes from "./routes/PendingDoctorRoute.js";
import blacklistRoutes from "./routes/BlacklistRoute.js";
import notificationRoutes from "./routes/NotificationRoute.js";
import medicalRecordRoutes from "./routes/MedicalRecordRoute.js";

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to database
connectDB();

// Routes
app.use("/api/admins", adminRoutes);
app.use("/api/admin-activities", adminActivityRoutes);
app.use("/api/patients", patientRoutes);
app.use("/api/doctors", doctorRoutes);
app.use("/api/pending-doctors", pendingDoctorRoutes);
app.use("/api/blacklist", blacklistRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/medical-records", medicalRecordRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
