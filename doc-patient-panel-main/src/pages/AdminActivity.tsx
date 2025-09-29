import { useState } from "react";
import { Link } from "react-router-dom"; 
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
  Filter
} from "lucide-react";

const activities = [
  {
    id: 1,
    admin: "Robert Johnson",
    action: "Approved Doctor Application",
    target: "Dr. Sarah Wilson",
    timestamp: "2024-01-15 10:30 AM",
    type: "Approval",
    details: "Approved cardiology specialist application after document review",
    avatar: "RJ",
    severity: "success"
  },
  {
    id: 2,
    admin: "Robert Johnson", 
    action: "Suspended Doctor Account",
    target: "Dr. James Brown",
    timestamp: "2024-01-15 9:45 AM",
    type: "Suspension",
    details: "30-day suspension due to multiple patient complaints",
    avatar: "RJ",
    severity: "warning"
  },
  {
    id: 3,
    admin: "Sarah Admin",
    action: "Updated System Settings",
    target: "Notification Preferences", 
    timestamp: "2024-01-15 9:15 AM",
    type: "Configuration",
    details: "Modified email notification frequency for patient alerts",
    avatar: "SA",
    severity: "info"
  },
  {
    id: 4,
    admin: "Robert Johnson",
    action: "Reviewed Flagged Comment",
    target: "Patient Feedback #FC-001",
    timestamp: "2024-01-15 8:30 AM", 
    type: "Review",
    details: "Investigated high-priority complaint and escalated to medical board",
    avatar: "RJ",
    severity: "warning"
  },
  {
    id: 5,
    admin: "Mike Admin",
    action: "Created New Patient Record",
    target: "Patient ID: P-2024-001",
    timestamp: "2024-01-14 4:20 PM",
    type: "Creation", 
    details: "Added new patient with complete medical history",
    avatar: "MA",
    severity: "success"
  },
  {
    id: 6,
    admin: "Robert Johnson",
    action: "Deleted Appointment",
    target: "Appointment #APT-456",
    timestamp: "2024-01-14 3:45 PM",
    type: "Deletion",
    details: "Cancelled appointment due to doctor unavailability",
    avatar: "RJ", 
    severity: "destructive"
  },
  {
    id: 7,
    admin: "Sarah Admin",
    action: "Updated Doctor Profile",
    target: "Dr. Emily Davis",
    timestamp: "2024-01-14 2:15 PM",
    type: "Update",
    details: "Updated contact information and availability schedule",
    avatar: "SA",
    severity: "info"
  },
  {
    id: 8,
    admin: "Robert Johnson",
    action: "Processed Payment Transaction",
    target: "Transaction #TXN-789",
    timestamp: "2024-01-14 1:30 PM",
    type: "Transaction",
    details: "Verified and processed $250 payment for consultation",
    avatar: "RJ",
    severity: "success"
  }
];

const activityTypes = [
  { value: "all", label: "All Activities" },
  { value: "approval", label: "Approvals" },
  { value: "suspension", label: "Suspensions" },
  { value: "configuration", label: "System Changes" },
  { value: "review", label: "Reviews" },
  { value: "creation", label: "Creations" },
  { value: "deletion", label: "Deletions" },
  { value: "update", label: "Updates" },
  { value: "transaction", label: "Transactions" }
];

const admins = [
  { value: "all", label: "All Admins" },
  { value: "robert", label: "Robert Johnson" },
  { value: "sarah", label: "Sarah Admin" },
  { value: "mike", label: "Mike Admin" }
];

export default function AdminActivity() {
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [adminFilter, setAdminFilter] = useState("all");

  const filteredActivities = activities.filter(activity => {
    const matchesSearch = 
      activity.admin.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activity.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activity.target.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activity.details.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = typeFilter === "all" || activity.type.toLowerCase() === typeFilter;
    const matchesAdmin = adminFilter === "all" || 
      activity.admin.toLowerCase().includes(adminFilter === "robert" ? "robert" : 
                                          adminFilter === "sarah" ? "sarah" : 
                                          adminFilter === "mike" ? "mike" : "");
    
    return matchesSearch && matchesType && matchesAdmin;
  });

  const getActivityIcon = (type: string) => {
    switch(type.toLowerCase()) {
      case "approval": return UserPlus;
      case "suspension": return UserMinus;
      case "configuration": return Settings;
      case "review": return Eye;
      case "creation": return FileText;
      case "deletion": return Trash2;
      case "update": return Edit;
      case "transaction": return Activity;
      default: return Activity;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch(severity) {
      case "success": return "bg-success/10 text-success border-success/20";
      case "warning": return "bg-warning/10 text-warning border-warning/20";
      case "destructive": return "bg-destructive/10 text-destructive border-destructive/20";
      case "info": return "bg-primary/10 text-primary border-primary/20";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getTypeBadgeColor = (type: string) => {
    switch(type.toLowerCase()) {
      case "approval": return "bg-success/10 text-success";
      case "suspension": return "bg-warning/10 text-warning";
      case "deletion": return "bg-destructive/10 text-destructive";
      case "configuration": return "bg-primary/10 text-primary";
      default: return "bg-muted/10 text-muted-foreground";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Admin Activity Log</h1>
          <p className="text-muted-foreground">Monitor all administrative actions and system changes</p>
        </div>
        <div className="flex gap-2">
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
</div>

      </div>

      {/* Activity Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border border-border shadow-soft">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Total Activities</p>
                <p className="text-2xl font-bold text-foreground">{activities.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border border-border shadow-soft">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-success" />
              <div>
                <p className="text-sm text-muted-foreground">Today</p>
                <p className="text-2xl font-bold text-foreground">
                  {activities.filter(a => a.timestamp.includes("2024-01-15")).length}
                </p>
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
                <p className="text-2xl font-bold text-foreground">3</p>
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
                  {activities.filter(a => a.severity === "warning" || a.severity === "destructive").length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

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
                placeholder="Search activities, admins, or targets..."
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
            <Select value={adminFilter} onValueChange={setAdminFilter}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Filter by admin" />
              </SelectTrigger>
              <SelectContent>
                {admins.map((admin) => (
                  <SelectItem key={admin.value} value={admin.value}>
                    {admin.label}
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
            Showing {filteredActivities.length} of {activities.length} activities
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredActivities.map((activity) => {
              const IconComponent = getActivityIcon(activity.type);
              return (
                <div key={activity.id} className="flex gap-4 p-4 border border-border rounded-lg bg-gradient-to-r from-card to-card/80 hover:shadow-soft transition-all">
                  <div className="flex-shrink-0">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback className="bg-gradient-primary text-white">
                        {activity.avatar}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-foreground">{activity.admin}</h3>
                        <Badge className={getTypeBadgeColor(activity.type)}>
                          <IconComponent className="h-3 w-3 mr-1" />
                          {activity.type}
                        </Badge>
                        <Badge className={getSeverityColor(activity.severity)}>
                          {activity.severity}
                        </Badge>
                      </div>
                      <span className="text-sm text-muted-foreground whitespace-nowrap">
                        {activity.timestamp}
                      </span>
                    </div>
                    
                    <div className="mb-2">
                      <p className="text-sm font-medium text-foreground">
                        {activity.action}: <span className="text-primary">{activity.target}</span>
                      </p>
                    </div>
                    
                    <p className="text-sm text-muted-foreground">
                      {activity.details}
                    </p>
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
        </CardContent>
      </Card>
    </div>
  );
}