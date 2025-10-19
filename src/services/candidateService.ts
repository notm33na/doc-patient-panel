// Candidate service for API calls
const API_BASE_URL = "http://localhost:5000/api/pending-doctors";

export interface Candidate {
  _id: string;
  DoctorName: string;
  email: string;
  password: string;
  phone: string;
  
  // Specializations (Array)
  specialization: string[];
  
  // License Information
  licenses: string[];
  
  // Professional Information
  experience: string;
  about: string;
  
  // Medical Credentials (Arrays)
  medicalDegree: string[];
  residency: string[];
  fellowship: string[];
  boardCertification: string[];
  
  // Other Information (Arrays)
  hospitalAffiliations: string[];
  memberships: string[];
  malpracticeInsurance: string;
  address: string;
  education: string;
  status: string;
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

// Fetch pending candidates
export const fetchPendingCandidates = async (): Promise<Candidate[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}`);
    const result: ApiResponse<Candidate[]> = await response.json();
    
    if (!result.success) {
      throw new Error(result.message || "Failed to fetch pending candidates");
    }
    
    return result.data;
  } catch (error) {
    console.error("Error fetching pending candidates:", error);
    throw error;
  }
};

// Fetch rejected candidates (empty for now since rejected are removed from pending)
export const fetchRejectedCandidates = async (): Promise<Candidate[]> => {
  // For now, return empty array since rejected candidates are removed from pending collection
  // In a real implementation, you might want to create a separate RejectedDoctors collection
  return [];
};

// Approve candidate (move to main Doctor collection)
export const approveCandidate = async (candidateId: string): Promise<any> => {
  try {
    const response = await fetch(`${API_BASE_URL}/${candidateId}/approve`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
    
    const result: ApiResponse<any> = await response.json();
    
    if (!result.success) {
      throw new Error(result.message || "Failed to approve candidate");
    }
    
    return result.data;
  } catch (error) {
    console.error("Error approving candidate:", error);
    throw error;
  }
};

// Reject candidate (remove from pending collection)
export const rejectCandidate = async (candidateId: string, reason?: string): Promise<any> => {
  try {
    const response = await fetch(`${API_BASE_URL}/${candidateId}/reject`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
    
    const result: ApiResponse<any> = await response.json();
    
    if (!result.success) {
      throw new Error(result.message || "Failed to reject candidate");
    }
    
    return result.data;
  } catch (error) {
    console.error("Error rejecting candidate:", error);
    throw error;
  }
};

// Search candidates
export const searchCandidates = async (query: string): Promise<Candidate[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/search/${encodeURIComponent(query)}`);
    const result: ApiResponse<Candidate[]> = await response.json();
    
    if (!result.success) {
      throw new Error(result.message || "Failed to search candidates");
    }
    
    return result.data;
  } catch (error) {
    console.error("Error searching candidates:", error);
    throw error;
  }
};

// Fetch single candidate by ID
export const fetchCandidateById = async (id: string): Promise<Candidate> => {
  try {
    const response = await fetch(`${API_BASE_URL}/${id}`);
    const result: ApiResponse<Candidate> = await response.json();
    
    if (!result.success) {
      throw new Error(result.message || "Failed to fetch candidate");
    }
    
    return result.data;
  } catch (error) {
    console.error("Error fetching candidate:", error);
    throw error;
  }
};

// Create new candidate
export const createCandidate = async (candidateData: Partial<Candidate>): Promise<Candidate> => {
  try {
    const response = await fetch(`${API_BASE_URL}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(candidateData),
    });
    
    const result: ApiResponse<Candidate> = await response.json();
    
    if (!result.success) {
      throw new Error(result.message || "Failed to create candidate");
    }
    
    return result.data;
  } catch (error) {
    console.error("Error creating candidate:", error);
    throw error;
  }
};
