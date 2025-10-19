// Doctor service for API calls
const API_BASE_URL = "http://localhost:5000/api/doctors";

export interface SuspensionData {
  suspensionType?: "temporary" | "investigation";
  severity?: "minor" | "moderate" | "major" | "critical";
  reasons?: string[];
  duration?: number; // -1 for indefinite
  endDate?: string;
  impact?: {
    patientAccess?: boolean;
    appointmentScheduling?: boolean;
    prescriptionWriting?: boolean;
    systemAccess?: boolean;
  };
  suspendedBy?: string;
}

export interface SuspensionRecord {
  _id: string;
  doctorId: string;
  suspensionType: string;
  status: string;
  severity: string;
  reasons: string[];
  suspensionPeriod: {
    startDate: string;
    endDate: string;
    duration: number;
  };
  impact: {
    patientAccess: boolean;
    appointmentScheduling: boolean;
    prescriptionWriting: boolean;
    systemAccess: boolean;
  };
  suspendedBy: string;
  reviewedBy: string[];
  appealStatus: string;
  appealNotes: string;
  notificationSent: boolean;
  doctorNotified: boolean;
  patientsNotified: boolean;
  publiclyVisible: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Doctor {
  _id: string;
  DoctorName: string;
  email: string;
  password?: string; // Optional for frontend display
  phone: string;
  specialization: string[]; // Changed from string to string[] to match PendingDoctor
  about?: string;
  medicalDegree?: string[]; // Changed from string to string[] to match PendingDoctor
  residency?: string[]; // Changed from string to string[] to match PendingDoctor
  fellowship?: string[]; // Changed from string to string[] to match PendingDoctor
  boardCertification?: string[]; // Changed from string to string[] to match PendingDoctor
  licenses?: string[]; // Changed from string to string[] to match PendingDoctor
  deaRegistration?: string;
  hospitalAffiliations?: string[]; // Changed from string to string[] to match PendingDoctor
  memberships?: string[]; // Changed from string to string[] to match PendingDoctor
  malpracticeInsurance?: string;
  address?: string;
  education?: string;
  status: "approved" | "pending" | "rejected" | "suspended";
  verified?: boolean;
  verificationDate?: string;
  profileImage?: string;
  sentiment: "positive" | "negative" | "neutral";
  sentiment_score: number;
  no_of_patients: number;
  department?: string;
  bio?: string;
  experience?: string;
  qualifications?: string[];
  languages?: string[];
  consultationFee?: number;
  addressStructured?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  workingHours?: {
    monday: { start: string; end: string };
    tuesday: { start: string; end: string };
    wednesday: { start: string; end: string };
    thursday: { start: string; end: string };
    friday: { start: string; end: string };
    saturday: { start: string; end: string };
    sunday: { start: string; end: string };
  };
  createdBy?: string;
  documents?: Array<{
    type: string;
    fileName: string;
    filePath: string;
    uploadedAt: string;
    verified: boolean;
  }>;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  count?: number;
  message?: string;
  error?: string;
}

// Fetch all doctors
export const fetchDoctors = async (): Promise<Doctor[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}`);
    const result: ApiResponse<Doctor[]> = await response.json();
    
    if (!result.success) {
      throw new Error(result.message || "Failed to fetch doctors");
    }
    
    return result.data;
  } catch (error) {
    console.error("Error fetching doctors:", error);
    throw error;
  }
};

// Fetch all doctors for admin (including all statuses)
export const fetchAllDoctors = async (): Promise<Doctor[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/all`);
    const result: ApiResponse<Doctor[]> = await response.json();
    
    if (!result.success) {
      throw new Error(result.message || "Failed to fetch all doctors");
    }
    
    return result.data;
  } catch (error) {
    console.error("Error fetching all doctors:", error);
    throw error;
  }
};

// Create new doctor
export const createDoctor = async (doctorData: Partial<Doctor>): Promise<Doctor> => {
  try {
    const response = await fetch(`${API_BASE_URL}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(doctorData),
    });
    
    const result: ApiResponse<Doctor> = await response.json();
    
    if (!result.success) {
      throw new Error(result.message || "Failed to create doctor");
    }
    
    return result.data;
  } catch (error) {
    console.error("Error creating doctor:", error);
    throw error;
  }
};

// Fetch doctor by ID
export const fetchDoctor = async (id: string): Promise<Doctor> => {
  try {
    const response = await fetch(`${API_BASE_URL}/${id}`);
    const result: ApiResponse<Doctor> = await response.json();
    
    if (!result.success) {
      throw new Error(result.message || "Failed to fetch doctor");
    }
    
    return result.data;
  } catch (error) {
    console.error("Error fetching doctor:", error);
    throw error;
  }
};

// Search doctors
export const searchDoctors = async (query: string): Promise<Doctor[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/search/${encodeURIComponent(query)}`);
    const result: ApiResponse<Doctor[]> = await response.json();
    
    if (!result.success) {
      throw new Error(result.message || "Failed to search doctors");
    }
    
    return result.data;
  } catch (error) {
    console.error("Error searching doctors:", error);
    throw error;
  }
};

// Filter doctors by status
export const fetchDoctorsByStatus = async (status: string): Promise<Doctor[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/status/${status}`);
    const result: ApiResponse<Doctor[]> = await response.json();
    
    if (!result.success) {
      throw new Error(result.message || "Failed to filter doctors by status");
    }
    
    return result.data;
  } catch (error) {
    console.error("Error filtering doctors by status:", error);
    throw error;
  }
};

// Filter doctors by specialization
export const fetchDoctorsBySpecialization = async (specialization: string): Promise<Doctor[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/specialization/${encodeURIComponent(specialization)}`);
    const result: ApiResponse<Doctor[]> = await response.json();
    
    if (!result.success) {
      throw new Error(result.message || "Failed to filter doctors by specialization");
    }
    
    return result.data;
  } catch (error) {
    console.error("Error filtering doctors by specialization:", error);
    throw error;
  }
};

// Filter doctors by sentiment
export const fetchDoctorsBySentiment = async (sentiment: string): Promise<Doctor[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/sentiment/${sentiment}`);
    const result: ApiResponse<Doctor[]> = await response.json();
    
    if (!result.success) {
      throw new Error(result.message || "Failed to filter doctors by sentiment");
    }
    
    return result.data;
  } catch (error) {
    console.error("Error filtering doctors by sentiment:", error);
    throw error;
  }
};

// Fetch recent doctors (for dashboard)
export const fetchRecentDoctors = async (limit: number = 5): Promise<Doctor[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/recent/${limit}`);
    const result: ApiResponse<Doctor[]> = await response.json();
    
    if (!result.success) {
      throw new Error(result.message || "Failed to fetch recent doctors");
    }
    
    return result.data;
  } catch (error) {
    console.error("Error fetching recent doctors:", error);
    throw error;
  }
};

// Update doctor status
export const updateDoctorStatus = async (id: string, status: string, suspensionData?: SuspensionData): Promise<Doctor | { deleted: true; message: string }> => {
  try {
    console.log("updateDoctorStatus called with:", { id, status, suspensionData });
    
    const response = await fetch(`${API_BASE_URL}/${id}/status`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status, suspensionData }),
    });
    
    console.log("Status update response status:", response.status);
    
    const result: ApiResponse<Doctor> & { deleted?: boolean } = await response.json();
    console.log("Status update response data:", result);
    
    if (!result.success) {
      throw new Error(result.message || "Failed to update doctor status");
    }
    
    // If doctor was deleted due to 6th suspension
    if (result.deleted) {
      return { deleted: true, message: result.message || "Doctor deleted due to 6th suspension" };
    }
    
    return result.data;
  } catch (error) {
    console.error("Error updating doctor status:", error);
    throw error;
  }
};

// Update doctor sentiment
export const updateDoctorSentiment = async (
  id: string, 
  sentiment: string, 
  sentiment_score: number
): Promise<Doctor> => {
  try {
    const response = await fetch(`${API_BASE_URL}/${id}/sentiment`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ sentiment, sentiment_score }),
    });
    
    const result: ApiResponse<Doctor> = await response.json();
    
    if (!result.success) {
      throw new Error(result.message || "Failed to update doctor sentiment");
    }
    
    return result.data;
  } catch (error) {
    console.error("Error updating doctor sentiment:", error);
    throw error;
  }
};

// Update doctor basic information
export const updateDoctor = async (id: string, data: Partial<Doctor>): Promise<Doctor> => {
  try {
    console.log("updateDoctor called with:", { id, data });
    
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    
    console.log("Response status:", response.status);
    console.log("Response headers:", response.headers);
    
    const result: ApiResponse<Doctor> = await response.json();
    console.log("Response data:", result);
    
    if (!result.success) {
      throw new Error(result.message || "Failed to update doctor");
    }
    
    return result.data;
  } catch (error) {
    console.error("Error updating doctor:", error);
    throw error;
  }
};

// Delete doctor
export const deleteDoctor = async (id: string): Promise<{ id: string; name: string }> => {
  try {
    console.log("deleteDoctor called with ID:", id);
    
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: "DELETE",
    });
    
    console.log("Delete response status:", response.status);
    
    const result: ApiResponse<{ id: string; name: string }> = await response.json();
    console.log("Delete response data:", result);
    
    if (!result.success) {
      throw new Error(result.message || "Failed to delete doctor");
    }
    
    return result.data;
  } catch (error) {
    console.error("Error deleting doctor:", error);
    throw error;
  }
};

// Get doctor suspension records
export const getDoctorSuspensions = async (id: string): Promise<SuspensionRecord[]> => {
  try {
    console.log("getDoctorSuspensions called with ID:", id);
    
    const response = await fetch(`${API_BASE_URL}/${id}/suspensions`);
    
    console.log("Suspensions response status:", response.status);
    
    const result: ApiResponse<SuspensionRecord[]> = await response.json();
    console.log("Suspensions response data:", result);
    
    if (!result.success) {
      throw new Error(result.message || "Failed to fetch doctor suspensions");
    }
    
    return result.data;
  } catch (error) {
    console.error("Error fetching doctor suspensions:", error);
    throw error;
  }
};

// Suspend doctor with detailed suspension data
export const suspendDoctor = async (id: string, suspensionData: SuspensionData): Promise<{doctor: Doctor, suspension: SuspensionRecord}> => {
  try {
    console.log("suspendDoctor called with:", { id, suspensionData });
    
    const response = await fetch(`${API_BASE_URL}/${id}/suspend`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(suspensionData),
    });
    
    console.log("Suspend response status:", response.status);
    
    const result: ApiResponse<{doctor: Doctor, suspension: SuspensionRecord}> = await response.json();
    console.log("Suspend response data:", result);
    
    if (!result.success) {
      throw new Error(result.message || "Failed to suspend doctor");
    }
    
    return result.data;
  } catch (error) {
    console.error("Error suspending doctor:", error);
    throw error;
  }
};

// Get doctor suspension count
export const getDoctorSuspensionCount = async (id: string): Promise<{
  doctorId: string;
  doctorName: string;
  suspensionCount: number;
  warningThreshold: number;
  deletionThreshold: number;
  isAtWarningThreshold: boolean;
  nextSuspensionWillDelete: boolean;
}> => {
  try {
    console.log("getDoctorSuspensionCount called with ID:", id);
    
    const response = await fetch(`${API_BASE_URL}/${id}/suspension-count`);
    
    console.log("Suspension count response status:", response.status);
    
    const result: ApiResponse<{
      doctorId: string;
      doctorName: string;
      suspensionCount: number;
      warningThreshold: number;
      deletionThreshold: number;
      isAtWarningThreshold: boolean;
      nextSuspensionWillDelete: boolean;
    }> = await response.json();
    
    console.log("Suspension count response data:", result);
    
    if (!result.success) {
      throw new Error(result.message || "Failed to fetch doctor suspension count");
    }
    
    return result.data;
  } catch (error) {
    console.error("Error fetching doctor suspension count:", error);
    throw error;
  }
};
