const API_BASE_URL = 'http://localhost:5000/api';

export interface Patient {
  _id: string;
  userRole: string;
  firstName: string;
  lastName: string;
  emailAddress: string;
  phone: string;
  password?: string;
  gender: string;
  Age: string;
  profileImage?: string;
  isActive: string | boolean;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
  createdBy?: string;
  lastVisit?: string;
  nextAppointment?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PatientResponse {
  success: boolean;
  data?: Patient[];
  error?: string;
}

// Fetch all patients
export const fetchPatients = async (): Promise<Patient[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/patients`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const patients = await response.json();
    return patients;
  } catch (error) {
    console.error('Error fetching patients:', error);
    throw error;
  }
};

// Search patients
export const searchPatients = async (query: string): Promise<Patient[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/patients/search/${encodeURIComponent(query)}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const patients = await response.json();
    return patients;
  } catch (error) {
    console.error('Error searching patients:', error);
    throw error;
  }
};

// Get patients by status
export const fetchPatientsByStatus = async (status: string): Promise<Patient[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/patients/status/${status}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const patients = await response.json();
    return patients;
  } catch (error) {
    console.error('Error fetching patients by status:', error);
    throw error;
  }
};

// Get single patient
export const fetchPatient = async (id: string): Promise<Patient> => {
  try {
    const response = await fetch(`${API_BASE_URL}/patients/${id}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const patient = await response.json();
    return patient;
  } catch (error) {
    console.error('Error fetching patient:', error);
    throw error;
  }
};

// Add new patient
export const addPatient = async (patientData: Partial<Patient>): Promise<Patient> => {
  try {
    const response = await fetch(`${API_BASE_URL}/patients`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(patientData),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const patient = await response.json();
    return patient;
  } catch (error) {
    console.error('Error adding patient:', error);
    throw error;
  }
};

// Update patient
export const updatePatient = async (id: string, patientData: Partial<Patient>): Promise<Patient> => {
  try {
    const response = await fetch(`${API_BASE_URL}/patients/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(patientData),
    });
    
    if (!response.ok) {
      let errorMessage = `HTTP error! status: ${response.status}`;
      try {
        const errorData = await response.json();
        if (errorData.error) {
          errorMessage = errorData.error;
        }
      } catch {
        // If response is not JSON, use the default error message
      }
      throw new Error(errorMessage);
    }
    
    const patient = await response.json();
    return patient;
  } catch (error) {
    console.error('Error updating patient:', error);
    throw error;
  }
};

// Delete patient
export const deletePatient = async (id: string): Promise<void> => {
  try {
    const response = await fetch(`${API_BASE_URL}/patients/${id}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  } catch (error) {
    console.error('Error deleting patient:', error);
    throw error;
  }
};
