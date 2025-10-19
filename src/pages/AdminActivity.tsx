import { useState, useEffect } from "react";
import { Link } from "react-router-dom"; 
import axios from "axios";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Search, 
  Activity, 
  User, 
  Settings, 
  Eye, 
  Edit, 
  Trash2,
  UserPlus,
  UserMinus,
  FileText,
  Shield,
  Calendar,
  Filter,
  LogIn,
  LogOut,
  Bell,
  Database,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock
} from "lucide-react";

interface AdminActivity {
  _id: string;
  adminId: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
  };
  adminName: string;
  adminRole: string;
  action: string;
  details: string;
  ipAddress: string;
  userAgent: string;
  metadata: any;
  createdAt: string;
  updatedAt: string;
}

interface ActivityStats {
  totalActivities: number;
  activitiesByAction: Array<{ _id: string; count: number }>;
  activitiesByAdmin: Array<{ _id: string; count: number }>;
  recentActivities: AdminActivity[];
}

const activityTypes = [
  { value: "all", label: "All Activities" },
  { value: "LOGIN", label: "Login" },
  { value: "LOGOUT", label: "Logout" },
  { value: "CREATE_ADMIN", label: "Create Admin" },
  { value: "UPDATE_ADMIN", label: "Update Admin" },
  { value: "DELETE_ADMIN", label: "Delete Admin" },
  { value: "APPROVE_DOCTOR", label: "Approve Doctor" },
  { value: "REJECT_DOCTOR", label: "Reject Doctor" },
  { value: "SUSPEND_DOCTOR", label: "Suspend Doctor" },
  { value: "UNSUSPEND_DOCTOR", label: "Unsuspend Doctor" },
  { value: "ADD_PATIENT", label: "Add Patient" },
  { value: "UPDATE_PATIENT", label: "Update Patient" },
  { value: "DELETE_PATIENT", label: "Delete Patient" },
  { value: "ADD_BLACKLIST", label: "Add Blacklist" },
  { value: "UPDATE_BLACKLIST", label: "Update Blacklist" },
  { value: "DELETE_BLACKLIST", label: "Delete Blacklist" },
  { value: "SEND_NOTIFICATION", label: "Send Notification" },
  { value: "UPDATE_SETTINGS", label: "Update Settings" },
  { value: "VIEW_DASHBOARD", label: "View Dashboard" },
  { value: "EXPORT_DATA", label: "Export Data" },
  { value: "SYSTEM_MAINTENANCE", label: "System Maintenance" }
];

export default function AdminActivity() {
  const [activities, setActivities] = useState<AdminActivity[]>([]);
  const [stats, setStats] = useState<ActivityStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [adminFilter, setAdminFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  useEffect(() => {
    if (currentUser) {
      fetchActivities();
      if (currentUser.role === 'Super Admin') {
        fetchStats();
      }
    }
  }, [currentPage, typeFilter, adminFilter, currentUser]);

  const fetchCurrentUser = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const response = await axios.get('http://localhost:5000/api/admins/me', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        setCurrentUser(response.data);
      } else {
        console.log('No token found in localStorage');
        // Redirect to login if no token
        window.location.href = '/login';
      }
    } catch (error: any) {
      console.error('Error fetching current user:', error);
      if (error.response?.status === 401) {
        console.log('Token expired or invalid, redirecting to login');
        localStorage.removeItem('token');
        window.location.href = '/login';
      } else {
        console.error('Unexpected error:', error.response?.data || error.message);
        // Set a default user to prevent infinite loading
        setCurrentUser({ role: 'Admin' });
      }
    }
  };

  const fetchActivities = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        console.log('No token available for fetching activities');
        setLoading(false);
        return;
      }
      
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '20'
      });
      
      if (typeFilter !== 'all') {
        params.append('action', typeFilter);
      }
      
      if (adminFilter !== 'all') {
        params.append('adminId', adminFilter);
      }

      const response = await axios.get(`http://localhost:5000/api/admin-activities?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.data.success) {
        setActivities(response.data.data.activities);
        setTotalPages(response.data.data.pagination.totalPages);
      }
    } catch (error: any) {
      console.error("Error fetching activities:", error);
      if (error.response?.status === 401) {
        console.error("Authentication failed - token may be invalid or expired");
        localStorage.removeItem('token');
        window.location.href = '/login';
      } else if (error.response?.status === 404) {
        console.error("Admin activities endpoint not found - check server routes");
      } else {
        console.error("Unexpected error:", error.response?.data || error.message);
      }
      // Set empty activities to prevent infinite loading
      setActivities([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        console.log('No token available for fetching stats');
        return;
      }
      
      const response = await axios.get('http://localhost:5000/api/admin-activities/stats?period=7d', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (response.data.success) {
        setStats(response.data.data);
      }
    } catch (error: any) {
      console.error("Error fetching stats:", error);
      if (error.response?.status === 401) {
        console.error("Authentication failed for stats - token may be invalid or expired");
        localStorage.removeItem('token');
        window.location.href = '/login';
      } else if (error.response?.status === 404) {
        console.error("Admin activities stats endpoint not found - check server routes");
      } else {
        console.error("Unexpected error:", error.response?.data || error.message);
      }
      // Set null stats to prevent issues
      setStats(null);
    }
  };

  const filteredActivities = activities.filter(activity => {
    const matchesSearch = 
      activity.adminName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activity.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activity.details.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesSearch;
  });

  const getActivityIcon = (action: string) => {
    switch(action) {
      case "LOGIN": return LogIn;
      case "LOGOUT": return LogOut;
      case "CREATE_ADMIN": return UserPlus;
      case "UPDATE_ADMIN": return Edit;
      case "DELETE_ADMIN": return UserMinus;
      case "APPROVE_DOCTOR": return CheckCircle;
      case "REJECT_DOCTOR": return XCircle;
      case "SUSPEND_DOCTOR": return AlertTriangle;
      case "UNSUSPEND_DOCTOR": return CheckCircle;
      case "ADD_PATIENT": return UserPlus;
      case "UPDATE_PATIENT": return Edit;
      case "DELETE_PATIENT": return Trash2;
      case "ADD_BLACKLIST": return AlertTriangle;
      case "UPDATE_BLACKLIST": return Edit;
      case "DELETE_BLACKLIST": return Trash2;
      case "SEND_NOTIFICATION": return Bell;
      case "UPDATE_SETTINGS": return Settings;
      case "VIEW_DASHBOARD": return Eye;
      case "EXPORT_DATA": return Database;
      case "SYSTEM_MAINTENANCE": return Settings;
      default: return Activity;
    }
  };

  const getSeverityColor = (action: string) => {
    switch(action) {
      case "LOGIN":
      case "APPROVE_DOCTOR":
      case "UNSUSPEND_DOCTOR":
      case "ADD_PATIENT":
      case "VIEW_DASHBOARD":
        return "bg-success/10 text-success border-success/20";
      case "SUSPEND_DOCTOR":
      case "REJECT_DOCTOR":
      case "ADD_BLACKLIST":
        return "bg-warning/10 text-warning border-warning/20";
      case "DELETE_ADMIN":
      case "DELETE_PATIENT":
      case "DELETE_BLACKLIST":
        return "bg-destructive/10 text-destructive border-destructive/20";
      case "CREATE_ADMIN":
      case "UPDATE_ADMIN":
      case "UPDATE_PATIENT":
      case "UPDATE_BLACKLIST":
      case "UPDATE_SETTINGS":
      case "SEND_NOTIFICATION":
      case "EXPORT_DATA":
      case "SYSTEM_MAINTENANCE":
        return "bg-primary/10 text-primary border-primary/20";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getActionBadgeColor = (action: string) => {
    switch(action) {
      case "LOGIN":
      case "APPROVE_DOCTOR":
      case "UNSUSPEND_DOCTOR":
        return "bg-success/10 text-success";
      case "SUSPEND_DOCTOR":
      case "REJECT_DOCTOR":
        return "bg-warning/10 text-warning";
      case "DELETE_ADMIN":
      case "DELETE_PATIENT":
      case "DELETE_BLACKLIST":
        return "bg-destructive/10 text-destructive";
      default: return "bg-primary/10 text-primary";
    }
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Admin Activity Log</h1>
          <p className="text-muted-foreground">Monitor all administrative actions and system changes</p>
        </div>
        <div className="flex gap-2">
          {currentUser?.role === 'Super Admin' && (
            <>
              <Link to="/export-log">
                <Button variant="outline" className="gap-2">
                  <Filter className="h-4 w-4" />
                  Export Log
                </Button>
              </Link>
              <Link to="/security-report">
                <Button className="gap-2">
                  <Shield className="h-4 w-4" />
                  Security Report
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Activity Stats - Only visible to Super Admins */}
      {stats && currentUser?.role === 'Super Admin' && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="border border-border shadow-soft">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Total Activities</p>
                  <p className="text-2xl font-bold text-foreground">{stats.totalActivities}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border border-border shadow-soft">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-success" />
                <div>
                  <p className="text-sm text-muted-foreground">Last 7 Days</p>
                  <p className="text-2xl font-bold text-foreground">{stats.totalActivities}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border border-border shadow-soft">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <User className="h-5 w-5 text-warning" />
                <div>
                  <p className="text-sm text-muted-foreground">Active Admins</p>
                  <p className="text-2xl font-bold text-foreground">{stats.activitiesByAdmin.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border border-border shadow-soft">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-destructive" />
                <div>
                  <p className="text-sm text-muted-foreground">Critical Actions</p>
                  <p className="text-2xl font-bold text-foreground">
                    {stats.activitiesByAction.filter(a => 
                      ['SUSPEND_DOCTOR', 'REJECT_DOCTOR', 'DELETE_ADMIN', 'DELETE_PATIENT'].includes(a._id)
                    ).reduce((sum, a) => sum + a.count, 0)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters */}
      <Card className="border border-border shadow-soft">
        <CardHeader>
          <CardTitle>Activity Filters</CardTitle>
          <CardDescription>Filter activities by search, type, and admin</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search activities, admins, or details..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                {activityTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Activity Timeline */}
      <Card className="border border-border shadow-soft">
        <CardHeader>
          <CardTitle>Activity Timeline</CardTitle>
          <CardDescription>
            Showing {filteredActivities.length} activities
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredActivities.map((activity) => {
              const IconComponent = getActivityIcon(activity.action);
              return (
                <div key={activity._id} className="flex gap-4 p-4 border border-border rounded-lg bg-gradient-to-r from-card to-card/80 hover:shadow-soft transition-all">
                  <div className="flex-shrink-0">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback className="bg-gradient-primary text-white">
                        {getInitials(activity.adminName)}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-foreground">{activity.adminName}</h3>
                        <Badge className={getActionBadgeColor(activity.action)}>
                          <IconComponent className="h-3 w-3 mr-1" />
                          {activity.action.replace('_', ' ')}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {formatTimestamp(activity.createdAt)}
                      </div>
                    </div>
                    
                    <div className="mb-2">
                      <p className="text-sm font-medium text-foreground">
                        {activity.details}
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>IP: {activity.ipAddress}</span>
                      <span>Agent: {activity.userAgent.split(' ')[0]}...</span>
                    </div>
                  </div>
                  
                  <div className="flex-shrink-0">
                    <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-6">
              <Button 
                variant="outline" 
                size="sm"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
              >
                Previous
              </Button>
              <span className="text-sm text-muted-foreground">
                Page {currentPage} of {totalPages}
              </span>
              <Button 
                variant="outline" 
                size="sm"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
              >
                Next
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}