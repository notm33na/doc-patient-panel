import MedicalRecord from "../models/MedicalRecord.js";

// @desc   Get all medical records
// @route  GET /api/medical-records
export const getMedicalRecords = async (req, res) => {
  try {
    const medicalRecords = await MedicalRecord.find()
      .populate('patientId', 'firstName lastName emailAddress')
      .populate('doctorId', 'DoctorName email')
      .sort({ createdAt: -1 });
    res.json(medicalRecords);
  } catch (err) {
    console.error("Error fetching medical records:", err);
    res.status(500).json({ error: "Failed to fetch medical records" });
  }
};

// @desc   Get single medical record by ID
// @route  GET /api/medical-records/:id
export const getMedicalRecord = async (req, res) => {
  try {
    const medicalRecord = await MedicalRecord.findById(req.params.id)
      .populate('patientId', 'firstName lastName emailAddress')
      .populate('doctorId', 'DoctorName email');
    
    if (!medicalRecord) {
      return res.status(404).json({ error: "Medical record not found" });
    }
    res.json(medicalRecord);
  } catch (err) {
    console.error("Error fetching medical record:", err);
    res.status(500).json({ error: "Failed to fetch medical record" });
  }
};

// @desc   Get medical records by patient ID
// @route  GET /api/medical-records/patient/:patientId
export const getMedicalRecordsByPatient = async (req, res) => {
  try {
    const { patientId } = req.params;
    const medicalRecords = await MedicalRecord.find({ patientId })
      .populate('doctorId', 'DoctorName email')
      .sort({ createdAt: -1 });
    res.json(medicalRecords);
  } catch (err) {
    console.error("Error fetching medical records by patient:", err);
    res.status(500).json({ error: "Failed to fetch medical records" });
  }
};

// @desc   Add new medical record
// @route  POST /api/medical-records
export const addMedicalRecord = async (req, res) => {
  try {
    const {
      patientId,
      doctorId,
      appointmentId,
      diagnosis,
      symptoms,
      medications,
      vaccinations,
      vitals,
      allergies,
      chronicConditions,
      notes,
      followUpRequired,
      followUpDate,
      prescriptions
    } = req.body;

    console.log("Incoming Medical Record Data:", req.body);

    const medicalRecordData = {
      patientId: patientId || null,
      doctorId: doctorId || null,
      appointmentId: appointmentId || null,
      diagnosis: diagnosis || "",
      symptoms: symptoms || [],
      medications: medications || [],
      vaccinations: vaccinations || [],
      vitals: vitals || {
        bloodPressure: "",
        heartRate: "",
        temperature: "",
        weight: "",
        height: "",
        oxygenSaturation: ""
      },
      allergies: allergies || [],
      chronicConditions: chronicConditions || [],
      notes: notes || "",
      followUpRequired: followUpRequired || false,
      followUpDate: followUpDate || null,
      prescriptions: prescriptions || []
    };

    const newMedicalRecord = new MedicalRecord(medicalRecordData);
    await newMedicalRecord.save();
    
    console.log("Medical record saved successfully:", newMedicalRecord);
    res.status(201).json(newMedicalRecord);
  } catch (err) {
    console.error("Error saving medical record:", err);
    res.status(400).json({ error: err.message });
  }
};

// @desc   Update medical record
// @route  PUT /api/medical-records/:id
export const updateMedicalRecord = async (req, res) => {
  try {
    const { id } = req.params;
    
    const updated = await MedicalRecord.findByIdAndUpdate(id, req.body, { new: true })
      .populate('patientId', 'firstName lastName emailAddress')
      .populate('doctorId', 'DoctorName email');
    
    if (!updated) {
      return res.status(404).json({ error: "Medical record not found" });
    }

    res.json(updated);
  } catch (err) {
    console.error("Error updating medical record:", err);
    res.status(500).json({ error: "Failed to update medical record" });
  }
};

// @desc   Delete medical record
// @route  DELETE /api/medical-records/:id
export const deleteMedicalRecord = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await MedicalRecord.findByIdAndDelete(id);
    
    if (!deleted) {
      return res.status(404).json({ error: "Medical record not found" });
    }

    res.json({ message: "Medical record deleted successfully" });
  } catch (err) {
    console.error("Error deleting medical record:", err);
    res.status(500).json({ error: "Failed to delete medical record" });
  }
};
