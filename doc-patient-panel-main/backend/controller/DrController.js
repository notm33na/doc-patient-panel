import Doctor from "../models/Doctor.js";
import Suspension from "../models/SuspendedDrs.js";

// ➕ Add New Doctor
export const addDoctor = async (req, res) => {
  try {
    const {
      DoctorName,
      email,
      password,
      specialization,
      phone,
      department,
      sentiment,
      sentiment_score,
      no_of_patients,
    } = req.body;

    const existingDoctor = await Doctor.findOne({ email });
    if (existingDoctor) {
      return res.status(400).json({ message: "Doctor already exists with this email." });
    }

    const newDoctor = new Doctor({
      DoctorName,
      email,
      password,
      specialization,
      phone,
      department,
      sentiment,
      sentiment_score,
      no_of_patients,
      status: "pending",
    });

    await newDoctor.save();

    res.status(201).json({
      message: "Doctor added successfully.",
      doctor: newDoctor,
    });
  } catch (error) {
    console.error("Error adding doctor:", error);
    res.status(500).json({ message: "Server error while adding doctor." });
  }
};

// 📋 Get All Doctors
export const getAllDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find().sort({ createdAt: -1 });
    res.status(200).json(doctors);
  } catch (error) {
    console.error("Error fetching doctors:", error);
    res.status(500).json({ message: "Error fetching doctors." });
  }
};

// 🔍 Get Doctor by ID
export const getDoctorById = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) return res.status(404).json({ message: "Doctor not found." });
    res.status(200).json(doctor);
  } catch (error) {
    console.error("Error fetching doctor:", error);
    res.status(500).json({ message: "Error fetching doctor." });
  }
};

// ✏️ Update Doctor Info
export const updateDoctor = async (req, res) => {
  try {
    const updatedDoctor = await Doctor.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedDoctor) return res.status(404).json({ message: "Doctor not found." });

    res.status(200).json({
      message: "Doctor updated successfully.",
      doctor: updatedDoctor,
    });
  } catch (error) {
    console.error("Error updating doctor:", error);
    res.status(500).json({ message: "Error updating doctor." });
  }
};

// 🗑️ Delete Doctor
export const deleteDoctor = async (req, res) => {
  try {
    const deletedDoctor = await Doctor.findByIdAndDelete(req.params.id);
    if (!deletedDoctor) return res.status(404).json({ message: "Doctor not found." });

    res.status(200).json({ message: "Doctor deleted successfully." });
  } catch (error) {
    console.error("Error deleting doctor:", error);
    res.status(500).json({ message: "Error deleting doctor." });
  }
};

// 🔄 Update Doctor Status
export const updateDoctorStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["approved", "rejected", "pending", "suspended"].includes(status)) {
      return res.status(400).json({ message: "Invalid status value." });
    }

    const updatedDoctor = await Doctor.findByIdAndUpdate(id, { status }, { new: true });
    if (!updatedDoctor) return res.status(404).json({ message: "Doctor not found." });

    res.status(200).json({
      message: `Doctor status updated to ${status}.`,
      doctor: updatedDoctor,
    });
  } catch (error) {
    console.error("Error updating doctor status:", error);
    res.status(500).json({ message: "Error updating doctor status." });
  }
};

// ✅ Approve Doctor
export const approveDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findByIdAndUpdate(
      req.params.id,
      { status: "approved", approvalDate: new Date() },
      { new: true }
    );

    if (!doctor) return res.status(404).json({ message: "Doctor not found." });

    res.status(200).json({
      message: "Doctor approved successfully.",
      doctor,
    });
  } catch (error) {
    console.error("Error approving doctor:", error);
    res.status(500).json({ message: "Error approving doctor." });
  }
};

// ❌ Reject Doctor
export const rejectDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findByIdAndUpdate(
      req.params.id,
      { status: "rejected", rejectionDate: new Date() },
      { new: true }
    );

    if (!doctor) return res.status(404).json({ message: "Doctor not found." });

    res.status(200).json({
      message: "Doctor rejected successfully.",
      doctor,
    });
  } catch (error) {
    console.error("Error rejecting doctor:", error);
    res.status(500).json({ message: "Error rejecting doctor." });
  }
};

// 🚫 Suspend Doctor
export const suspendDoctor = async (req, res) => {
  try {
    const { suspensionType, status, severity, reasons, suspensionPeriod, impact, appealStatus, appealNotes } = req.body;

    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) return res.status(404).json({ message: "Doctor not found." });

    // Update Doctor’s Status
    doctor.status = "suspended";
    await doctor.save();

    // Create a Suspension Record aligned with your schema
    const suspension = new Suspension({
      doctorId: doctor._id,
      suspensionType: suspensionType || "temporary",
      status: status || "active",
      severity: severity || "major",
      reasons: reasons || [
        {
          category: "unspecified",
          description: "No specific reason provided",
          severity: "medium",
        },
      ],
      suspensionPeriod: suspensionPeriod || {
        startDate: new Date(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        duration: 30,
      },
      impact: impact || { affectedPatients: 0, cancelledAppointments: 0 },
      suspendedBy: req.user?._id || null,
      reviewedBy: [],
      appealStatus: appealStatus || "none",
      appealNotes: appealNotes || "",
      notificationSent: true,
      doctorNotified: true,
      patientsNotified: false,
      publiclyVisible: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await suspension.save();

    res.status(200).json({
      message: "Doctor suspended successfully and record saved.",
      doctor,
      suspension,
    });
  } catch (error) {
    console.error("Error suspending doctor:", error);
    res.status(500).json({ message: "Error suspending doctor." });
  }
};
