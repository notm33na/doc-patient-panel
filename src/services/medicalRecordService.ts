const API_BASE_URL = 'http://localhost:5000/api';

export interface MedicalRecord {
  _id: string;
  patientId: string;
  doctorId: string | null;
  appointmentId: string | null;
  diagnosis: string;
  symptoms: string[];
  medications: string[];
  vaccinations: string[];
  vitals: {
    bloodPressure: string;
    heartRate: string;
    temperature: string;
    weight: string;
    height: string;
    oxygenSaturation: string;
  };
  allergies: string[];
  chronicConditions: string[];
  notes: string;
  followUpRequired: boolean;
  followUpDate: string | null;
  prescriptions: Array<{
    medicationName: string;
    dosage: string;
    frequency: string;
    duration: string;
    instructions: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

export interface MedicalRecordResponse {
  success: boolean;
  data?: MedicalRecord[];
  message?: string;
}

// Fetch all medical records
export const fetchMedicalRecords = async (): Promise<MedicalRecord[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/medical-records`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const result: MedicalRecordResponse = await response.json();
    return result.data || [];
  } catch (error) {
    console.error('Error fetching medical records:', error);
    throw error;
  }
};

// Fetch medical record by ID
export const fetchMedicalRecord = async (id: string): Promise<MedicalRecord> => {
  try {
    const response = await fetch(`${API_BASE_URL}/medical-records/${id}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const medicalRecord = await response.json();
    return medicalRecord;
  } catch (error) {
    console.error('Error fetching medical record:', error);
    throw error;
  }
};

// Fetch medical records by patient ID
export const fetchMedicalRecordsByPatient = async (patientId: string): Promise<MedicalRecord[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/medical-records/patient/${patientId}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const result: MedicalRecordResponse = await response.json();
    return result.data || [];
  } catch (error) {
    console.error('Error fetching medical records by patient:', error);
    throw error;
  }
};

// Add new medical record
export const addMedicalRecord = async (medicalRecordData: Partial<MedicalRecord>): Promise<MedicalRecord> => {
  try {
    const response = await fetch(`${API_BASE_URL}/medical-records`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(medicalRecordData),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const medicalRecord = await response.json();
    return medicalRecord;
  } catch (error) {
    console.error('Error adding medical record:', error);
    throw error;
  }
};

// Update medical record
export const updateMedicalRecord = async (id: string, medicalRecordData: Partial<MedicalRecord>): Promise<MedicalRecord> => {
  try {
    const response = await fetch(`${API_BASE_URL}/medical-records/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(medicalRecordData),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const medicalRecord = await response.json();
    return medicalRecord;
  } catch (error) {
    console.error('Error updating medical record:', error);
    throw error;
  }
};

// Delete medical record
export const deleteMedicalRecord = async (id: string): Promise<void> => {
  try {
    const response = await fetch(`${API_BASE_URL}/medical-records/${id}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  } catch (error) {
    console.error('Error deleting medical record:', error);
    throw error;
  }
};
