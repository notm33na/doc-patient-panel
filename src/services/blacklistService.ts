// Blacklist service for API calls
const API_BASE_URL = "http://localhost:5000/api/blacklist";

export interface BlacklistEntry {
  _id: string;
  email?: string;
  phone?: string;
  licenses?: string[];
  reason: "doctor_deleted" | "candidate_rejected_multiple" | "license_conflict" | "manual";
  originalEntityType: "Doctor" | "PendingDoctor";
  originalEntityId?: string;
  originalEntityName?: string;
  description?: string;
  rejectionCount?: number;
  isActive: boolean;
  createdBy?: string;
  blacklistedAt: string;
  expiresAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface BlacklistStats {
  total: number;
  active: number;
  inactive: number;
  byReason: Array<{
    _id: string;
    count: number;
    activeCount: number;
  }>;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  pagination?: {
    current: number;
    pages: number;
    total: number;
    limit: number;
  };
  message?: string;
  error?: string;
}

// Fetch all blacklist entries
export const fetchBlacklistEntries = async (params?: {
  page?: number;
  limit?: number;
  reason?: string;
  isActive?: boolean;
}): Promise<BlacklistEntry[]> => {
  try {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.reason) queryParams.append('reason', params.reason);
    if (params?.isActive !== undefined) queryParams.append('isActive', params.isActive.toString());

    const response = await fetch(`${API_BASE_URL}?${queryParams}`);
    const result: ApiResponse<BlacklistEntry[]> = await response.json();
    
    if (!result.success) {
      throw new Error(result.message || "Failed to fetch blacklist entries");
    }
    
    return result.data;
  } catch (error) {
    console.error("Error fetching blacklist entries:", error);
    throw error;
  }
};

// Fetch single blacklist entry by ID
export const fetchBlacklistEntry = async (id: string): Promise<BlacklistEntry> => {
  try {
    const response = await fetch(`${API_BASE_URL}/${id}`);
    const result: ApiResponse<BlacklistEntry> = await response.json();
    
    if (!result.success) {
      throw new Error(result.message || "Failed to fetch blacklist entry");
    }
    
    return result.data;
  } catch (error) {
    console.error("Error fetching blacklist entry:", error);
    throw error;
  }
};

// Check if credentials are blacklisted
export const checkBlacklist = async (credentials: {
  email?: string;
  phone?: string;
  licenses?: string[];
}): Promise<{ isBlacklisted: boolean; blacklistEntry?: BlacklistEntry }> => {
  try {
    const response = await fetch(`${API_BASE_URL}/check`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });
    
    const result: ApiResponse<{ isBlacklisted: boolean; blacklistEntry?: BlacklistEntry }> = await response.json();
    
    if (!result.success) {
      throw new Error(result.message || "Failed to check blacklist");
    }
    
    return result.data;
  } catch (error) {
    console.error("Error checking blacklist:", error);
    throw error;
  }
};

// Add entry to blacklist
export const addToBlacklist = async (blacklistData: Partial<BlacklistEntry>): Promise<BlacklistEntry> => {
  try {
    const response = await fetch(`${API_BASE_URL}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(blacklistData),
    });
    
    const result: ApiResponse<BlacklistEntry> = await response.json();
    
    if (!result.success) {
      throw new Error(result.message || "Failed to add blacklist entry");
    }
    
    return result.data;
  } catch (error) {
    console.error("Error adding blacklist entry:", error);
    throw error;
  }
};

// Update blacklist entry
export const updateBlacklistEntry = async (id: string, updateData: Partial<BlacklistEntry>): Promise<BlacklistEntry> => {
  try {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updateData),
    });
    
    const result: ApiResponse<BlacklistEntry> = await response.json();
    
    if (!result.success) {
      throw new Error(result.message || "Failed to update blacklist entry");
    }
    
    return result.data;
  } catch (error) {
    console.error("Error updating blacklist entry:", error);
    throw error;
  }
};

// Remove from blacklist (deactivate or permanently delete)
export const removeFromBlacklist = async (id: string, permanent: boolean = false): Promise<{ message: string; data?: any }> => {
  try {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ permanent }),
    });
    
    const result: ApiResponse<any> = await response.json();
    
    if (!result.success) {
      throw new Error(result.message || "Failed to remove blacklist entry");
    }
    
    return { message: result.message, data: result.data };
  } catch (error) {
    console.error("Error removing blacklist entry:", error);
    throw error;
  }
};

// Get blacklist statistics
export const fetchBlacklistStats = async (): Promise<BlacklistStats> => {
  try {
    const response = await fetch(`${API_BASE_URL}/stats/overview`);
    const result: ApiResponse<BlacklistStats> = await response.json();
    
    if (!result.success) {
      throw new Error(result.message || "Failed to fetch blacklist statistics");
    }
    
    return result.data;
  } catch (error) {
    console.error("Error fetching blacklist statistics:", error);
    throw error;
  }
};

// Search blacklist entries
export const searchBlacklistEntries = async (query: string, params?: {
  page?: number;
  limit?: number;
}): Promise<BlacklistEntry[]> => {
  try {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());

    const response = await fetch(`${API_BASE_URL}/search/${encodeURIComponent(query)}?${queryParams}`);
    const result: ApiResponse<BlacklistEntry[]> = await response.json();
    
    if (!result.success) {
      throw new Error(result.message || "Failed to search blacklist entries");
    }
    
    return result.data;
  } catch (error) {
    console.error("Error searching blacklist entries:", error);
    throw error;
  }
};

// Helper function to get reason display text
export const getReasonDisplayText = (reason: string): string => {
  switch (reason) {
    case "doctor_deleted":
      return "Doctor Deleted";
    case "candidate_rejected_multiple":
      return "Candidate Rejected Multiple Times";
    case "license_conflict":
      return "License Conflict";
    case "manual":
      return "Manually Added";
    default:
      return reason;
  }
};

// Helper function to get reason color
export const getReasonColor = (reason: string): string => {
  switch (reason) {
    case "doctor_deleted":
      return "bg-red-100 text-red-800 border-red-200";
    case "candidate_rejected_multiple":
      return "bg-orange-100 text-orange-800 border-orange-200";
    case "license_conflict":
      return "bg-purple-100 text-purple-800 border-purple-200";
    case "manual":
      return "bg-blue-100 text-blue-800 border-blue-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

// Helper function to format date
export const formatBlacklistDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};
