// Notification service for API calls
const API_BASE_URL = "http://localhost:5000/api/notifications";

export interface Notification {
  _id: string;
  title: string;
  message: string;
  type: "info" | "warning" | "alert" | "success";
  category: "doctors" | "patients" | "system" | "feedback" | "appointments" | "reports" | "security" | "approvals" | "candidates" | "suspensions" | "blacklist";
  read: boolean;
  priority: "low" | "medium" | "high" | "critical";
  recipients: "all" | "admin" | "doctors" | "patients" | "staff";
  relatedEntity?: string;
  relatedEntityType?: "Doctor" | "Patient" | "PendingDoctor" | "User";
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationStats {
  total: number;
  unread: number;
  byCategory: Array<{
    _id: string;
    count: number;
    unreadCount: number;
  }>;
  byPriority: Array<{
    _id: string;
    count: number;
    unreadCount: number;
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

// Fetch all notifications
export const fetchNotifications = async (params?: {
  page?: number;
  limit?: number;
  category?: string;
  priority?: string;
  read?: boolean;
}): Promise<Notification[]> => {
  try {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.category) queryParams.append('category', params.category);
    if (params?.priority) queryParams.append('priority', params.priority);
    if (params?.read !== undefined) queryParams.append('read', params.read.toString());

    const url = `${API_BASE_URL}?${queryParams}`;
    console.log('🔍 Fetching notifications from:', url);
    
    const response = await fetch(url);
    console.log('📊 Response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ API Error:', errorText);
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const result: ApiResponse<Notification[]> = await response.json();
    console.log('✅ Notifications fetched:', result);
    
    if (!result.success) {
      throw new Error(result.message || "Failed to fetch notifications");
    }
    
    return result.data;
  } catch (error) {
    console.error("Error fetching notifications:", error);
    throw error;
  }
};

// Fetch single notification by ID
export const fetchNotification = async (id: string): Promise<Notification> => {
  try {
    const response = await fetch(`${API_BASE_URL}/${id}`);
    const result: ApiResponse<Notification> = await response.json();
    
    if (!result.success) {
      throw new Error(result.message || "Failed to fetch notification");
    }
    
    return result.data;
  } catch (error) {
    console.error("Error fetching notification:", error);
    throw error;
  }
};

// Mark notification as read
export const markNotificationAsRead = async (id: string, autoDelete: boolean = false): Promise<Notification | null> => {
  try {
    const response = await fetch(`${API_BASE_URL}/${id}/read`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ autoDelete }),
    });
    
    const result: ApiResponse<Notification> = await response.json();
    
    if (!result.success) {
      throw new Error(result.message || "Failed to mark notification as read");
    }
    
    return result.data;
  } catch (error) {
    console.error("Error marking notification as read:", error);
    throw error;
  }
};

// Mark all notifications as read
export const markAllNotificationsAsRead = async (autoDelete: boolean = false): Promise<{ message: string }> => {
  try {
    const response = await fetch(`${API_BASE_URL}/read-all`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ autoDelete }),
    });
    
    const result: ApiResponse<{ message: string }> = await response.json();
    
    if (!result.success) {
      throw new Error(result.message || "Failed to mark all notifications as read");
    }
    
    return result.data;
  } catch (error) {
    console.error("Error marking all notifications as read:", error);
    throw error;
  }
};

// Create new notification
export const createNotification = async (notificationData: Partial<Notification>): Promise<Notification> => {
  try {
    const response = await fetch(`${API_BASE_URL}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(notificationData),
    });
    
    const result: ApiResponse<Notification> = await response.json();
    
    if (!result.success) {
      throw new Error(result.message || "Failed to create notification");
    }
    
    return result.data;
  } catch (error) {
    console.error("Error creating notification:", error);
    throw error;
  }
};

// Delete notification
export const deleteNotification = async (id: string): Promise<{ message: string }> => {
  try {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: "DELETE",
    });
    
    const result: ApiResponse<{ message: string }> = await response.json();
    
    if (!result.success) {
      throw new Error(result.message || "Failed to delete notification");
    }
    
    return result.data;
  } catch (error) {
    console.error("Error deleting notification:", error);
    throw error;
  }
};

// Get notification statistics
export const fetchNotificationStats = async (): Promise<NotificationStats> => {
  try {
    const response = await fetch(`${API_BASE_URL}/stats`);
    const result: ApiResponse<NotificationStats> = await response.json();
    
    if (!result.success) {
      throw new Error(result.message || "Failed to fetch notification statistics");
    }
    
    return result.data;
  } catch (error) {
    console.error("Error fetching notification statistics:", error);
    throw error;
  }
};

// Search notifications
export const searchNotifications = async (query: string, params?: {
  page?: number;
  limit?: number;
}): Promise<Notification[]> => {
  try {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());

    const response = await fetch(`${API_BASE_URL}/search/${encodeURIComponent(query)}?${queryParams}`);
    const result: ApiResponse<Notification[]> = await response.json();
    
    if (!result.success) {
      throw new Error(result.message || "Failed to search notifications");
    }
    
    return result.data;
  } catch (error) {
    console.error("Error searching notifications:", error);
    throw error;
  }
};

// Helper function to get notification type color
export const getNotificationTypeColor = (type: string): string => {
  switch (type) {
    case "warning":
      return "bg-warning/10 text-warning border-warning/20";
    case "alert":
      return "bg-destructive/10 text-destructive border-destructive/20";
    case "success":
      return "bg-success/10 text-success border-success/20";
    default:
      return "bg-primary/10 text-primary border-primary/20";
  }
};

// Helper function to get priority color
export const getPriorityColor = (priority: string): string => {
  switch (priority) {
    case "critical":
      return "bg-red-100 text-red-800 border-red-200";
    case "high":
      return "bg-orange-100 text-orange-800 border-orange-200";
    case "medium":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

// Helper function to format notification date
export const formatNotificationDate = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
  
  if (diffInMinutes < 1) {
    return "Just now";
  } else if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
  } else if (diffInMinutes < 1440) {
    const hours = Math.floor(diffInMinutes / 60);
    return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  } else {
    const days = Math.floor(diffInMinutes / 1440);
    return `${days} day${days > 1 ? 's' : ''} ago`;
  }
};

// Clean up old read notifications
export const cleanupOldNotifications = async (daysOld: number = 7): Promise<{ message: string; deletedCount: number }> => {
  try {
    const response = await fetch(`${API_BASE_URL}/cleanup`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ daysOld }),
    });
    
    const result: ApiResponse<{ message: string; deletedCount: number }> = await response.json();
    
    if (!result.success) {
      throw new Error(result.message || "Failed to clean up old notifications");
    }
    
    return result.data;
  } catch (error) {
    console.error("Error cleaning up old notifications:", error);
    throw error;
  }
};
