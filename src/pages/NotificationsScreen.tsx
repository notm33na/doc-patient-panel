import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { 
  Bell, 
  BellRing, 
  Check, 
  Trash2, 
  Send, 
  AlertCircle, 
  Info, 
  CheckCircle,
  Settings,
  Users,
  UserCheck,
  Loader2
} from "lucide-react";
import { 
  fetchNotifications, 
  markNotificationAsRead, 
  markAllNotificationsAsRead,
  createNotification,
  deleteNotification,
  fetchNotificationStats,
  getNotificationTypeColor,
  getPriorityColor,
  formatNotificationDate,
  type Notification
} from "@/services/notificationService";
import { useAuth } from "@/contexts/AuthContext";

export default function NotificationsScreen() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newNotification, setNewNotification] = useState("");
  const [notificationTitle, setNotificationTitle] = useState("");
  const [selectedRecipients, setSelectedRecipients] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedPriority, setSelectedPriority] = useState<string>("all");
  const [selectedType, setSelectedType] = useState<string>("info");
  const [selectedNotificationCategory, setSelectedNotificationCategory] = useState<string>(
    user?.role === 'Super Admin' ? "system" : "candidates"
  );
  const [stats, setStats] = useState<any>(null);
  const [userCounts, setUserCounts] = useState({
    total: 0,
    doctors: 0,
    patients: 0,
    admin: 0
  });
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    systemAlerts: true,
    userActivity: true,
    appointmentUpdates: true,
    autoDeleteRead: false,
    autoDeleteDays: 7
  });

  // Get filtered category options based on user role
  const getCategoryOptions = () => {
    const allCategories = [
      { value: "system", label: "System Notifications" },
      { value: "candidates", label: "Candidate Applications" },
      { value: "suspensions", label: "Doctor Suspensions" },
      { value: "blacklist", label: "Blacklist Actions" },
      { value: "doctors", label: "Doctor Management" },
      { value: "patients", label: "Patient Management" },
      { value: "security", label: "Security Alerts" },
      { value: "appointments", label: "Appointments" },
      { value: "feedback", label: "Feedback" },
      { value: "reports", label: "Reports" }
    ];

    // Filter out sensitive categories for regular admins
    if (user?.role !== 'Super Admin') {
      return allCategories.filter(category => 
        !['system', 'security'].includes(category.value)
      );
    }

    return allCategories;
  };

  // Load notifications on component mount
  useEffect(() => {
    loadNotifications();
    loadStats();
    loadUserCounts();
    
    // Load settings from localStorage
    const savedSettings = localStorage.getItem('notificationSettings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      const data = await fetchNotifications({
        category: selectedCategory !== "all" ? selectedCategory : undefined,
        priority: selectedPriority !== "all" ? selectedPriority : undefined
      });
      setNotifications(data);
      setError(null);
    } catch (err) {
      setError("Failed to load notifications");
      console.error("Error loading notifications:", err);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const data = await fetchNotificationStats();
      setStats(data);
    } catch (err) {
      console.error("Error loading stats:", err);
    }
  };

  const loadUserCounts = async () => {
    try {
      // Fetch user counts from different endpoints
      const [doctorsResponse, patientsResponse] = await Promise.all([
        fetch('http://localhost:5000/api/doctors'),
        fetch('http://localhost:5000/api/patients')
      ]);
      
      const doctorsData = await doctorsResponse.json();
      const patientsData = await patientsResponse.json();
      
      const doctorsCount = doctorsData.success ? doctorsData.count : 0;
      const patientsCount = patientsData.success ? patientsData.count : 0;
      const adminCount = 1; // Assuming 1 admin for now
      
      setUserCounts({
        total: doctorsCount + patientsCount + adminCount,
        doctors: doctorsCount,
        patients: patientsCount,
        admin: adminCount
      });
    } catch (err) {
      console.error("Error loading user counts:", err);
      // Set default counts if API fails
      setUserCounts({
        total: 0,
        doctors: 0,
        patients: 0,
        admin: 1
      });
    }
  };

  const handleMarkAsRead = async (id: string, autoDelete: boolean = false) => {
    try {
      const result = await markNotificationAsRead(id, autoDelete);
      if (autoDelete) {
        // Remove notification from list if auto-deleted
        setNotifications(prev => prev.filter(notif => notif._id !== id));
      } else {
        // Update notification as read
        setNotifications(prev => 
          prev.map(notif => 
            notif._id === id ? { ...notif, read: true } : notif
          )
        );
      }
      loadStats(); // Refresh stats
    } catch (err) {
      console.error("Error marking notification as read:", err);
    }
  };

  const handleMarkAllAsRead = async (autoDelete: boolean = false) => {
    try {
      await markAllNotificationsAsRead(autoDelete);
      if (autoDelete) {
        // Clear all notifications if auto-deleted
        setNotifications([]);
      } else {
        // Mark all as read
        setNotifications(prev => 
          prev.map(notif => ({ ...notif, read: true }))
        );
      }
      loadStats(); // Refresh stats
    } catch (err) {
      console.error("Error marking all notifications as read:", err);
    }
  };

  const handleDeleteNotification = async (id: string) => {
    try {
      await deleteNotification(id);
      setNotifications(prev => prev.filter(notif => notif._id !== id));
      loadStats(); // Refresh stats
    } catch (err) {
      console.error("Error deleting notification:", err);
    }
  };

  const handleCreateNotification = async () => {
    if (!notificationTitle || !newNotification) {
      alert("Please fill in both title and message");
      return;
    }

    try {
      await createNotification({
        title: notificationTitle,
        message: newNotification,
        type: selectedType as any,
        category: selectedNotificationCategory as any,
        priority: selectedPriority as any,
        recipients: selectedRecipients as any
      });
      
      setNotificationTitle("");
      setNewNotification("");
      setSelectedType("info");
      setSelectedNotificationCategory("system");
      setSelectedPriority("medium");
      setSelectedRecipients("all");
      loadNotifications();
      loadStats();
      alert("Notification sent successfully!");
    } catch (err) {
      console.error("Error creating notification:", err);
      alert("Failed to send notification. Please try again.");
    }
  };

  const handleFilterChange = () => {
    loadNotifications();
  };

  const handleSettingsChange = (key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleCleanupOldNotifications = async () => {
    try {
      const { cleanupOldNotifications } = await import("@/services/notificationService");
      const result = await cleanupOldNotifications(settings.autoDeleteDays);
      alert(`Cleaned up ${result.deletedCount} old notifications`);
      loadNotifications();
      loadStats();
    } catch (err) {
      console.error("Error cleaning up old notifications:", err);
      alert("Failed to clean up old notifications");
    }
  };

  const handleSaveSettings = () => {
    // Validate settings
    if (settings.autoDeleteDays < 1 || settings.autoDeleteDays > 30) {
      alert("Auto-delete days must be between 1 and 30");
      return;
    }
    
    // Save to localStorage
    localStorage.setItem('notificationSettings', JSON.stringify(settings));
    
    // Show success message
    alert("Settings saved successfully!");
    
    // In a real app, you would also send to backend
    console.log("Settings saved:", settings);
  };

  const handleResetSettings = () => {
    const defaultSettings = {
      emailNotifications: true,
      pushNotifications: true,
      systemAlerts: true,
      userActivity: true,
      appointmentUpdates: true,
      autoDeleteRead: false,
      autoDeleteDays: 7
    };
    
    setSettings(defaultSettings);
    localStorage.setItem('notificationSettings', JSON.stringify(defaultSettings));
    alert("Settings reset to defaults!");
  };

  const getNotificationIcon = (type: string, category: string) => {
    // Special icons for approval-related categories
    if (category === "candidates") {
      switch (type) {
        case "success":
          return <UserCheck className="h-5 w-5 text-success" />;
        case "warning":
          return <AlertCircle className="h-5 w-5 text-warning" />;
        default:
          return <Users className="h-5 w-5 text-primary" />;
      }
    }
    
    if (category === "suspensions") {
      switch (type) {
        case "warning":
          return <AlertCircle className="h-5 w-5 text-destructive" />;
        case "success":
          return <CheckCircle className="h-5 w-5 text-success" />;
        default:
          return <AlertCircle className="h-5 w-5 text-warning" />;
      }
    }
    
    if (category === "blacklist") {
      return <AlertCircle className="h-5 w-5 text-destructive" />;
    }
    
    // Default icons for other categories
    switch (type) {
      case "warning":
        return <AlertCircle className="h-5 w-5 text-warning" />;
      case "alert":
        return <AlertCircle className="h-5 w-5 text-destructive" />;
      case "success":
        return <CheckCircle className="h-5 w-5 text-success" />;
      default:
        return <Info className="h-5 w-5 text-primary" />;
    }
  };

  const getNotificationBadge = (type: string) => {
    switch (type) {
      case "warning":
        return <Badge className="bg-warning/10 text-warning border-warning/20">Warning</Badge>;
      case "alert":
        return <Badge variant="destructive" className="bg-destructive/10 text-destructive">Alert</Badge>;
      case "success":
        return <Badge className="bg-success/10 text-success border-success/20">Success</Badge>;
      default:
        return <Badge variant="outline">Info</Badge>;
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading notifications...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <AlertCircle className="h-8 w-8 text-destructive" />
        <span className="ml-2 text-destructive">{error}</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Notifications</h1>
          <p className="text-muted-foreground">Manage system notifications and send announcements</p>
        </div>
        <div className="flex items-center gap-2">
          <BellRing className="h-5 w-5 text-muted-foreground" />
          <Badge className="bg-primary text-primary-foreground">{unreadCount} unread</Badge>
        </div>
      </div>

      <Tabs defaultValue="inbox" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="inbox">
            <Bell className="h-4 w-4 mr-2" />
            Inbox
          </TabsTrigger>
          <TabsTrigger value="send">
            <Send className="h-4 w-4 mr-2" />
            Send Notification
          </TabsTrigger>
          <TabsTrigger value="settings">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="inbox" className="space-y-4">
          <Card className="shadow-soft">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Recent Notifications</CardTitle>
                <div className="flex gap-2">
                  <select
                    className="px-3 py-1 border border-input bg-background rounded-md text-sm"
                    value={selectedCategory}
                    onChange={(e) => {
                      setSelectedCategory(e.target.value);
                      handleFilterChange();
                    }}
                  >
                    <option value="all">All Categories</option>
                    <option value="candidates">Candidate Applications</option>
                    <option value="suspensions">Doctor Suspensions</option>
                    <option value="blacklist">Blacklist Actions</option>
                    <option value="doctors">Doctor Management</option>
                    <option value="patients">Patient Management</option>
                    <option value="system">System Notifications</option>
                    <option value="security">Security Alerts</option>
                    <option value="appointments">Appointments</option>
                    <option value="feedback">Feedback</option>
                    <option value="reports">Reports</option>
                  </select>
                  <Button variant="outline" size="sm" onClick={() => handleMarkAllAsRead(true)}>
                    <Check className="h-4 w-4 mr-1" />
                    Mark All Read
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {notifications.map((notification) => (
                  <div
                    key={notification._id}
                    className={`p-4 rounded-lg border transition-colors ${
                      !notification.read ? "bg-accent/50 border-primary/20" : "bg-background"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex gap-3">
                        {getNotificationIcon(notification.type, notification.category)}
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium">{notification.title}</h4>
                            <Badge className={getNotificationTypeColor(notification.type)}>
                              {notification.type}
                            </Badge>
                            <Badge className={getPriorityColor(notification.priority)}>
                              {notification.priority}
                            </Badge>
                            {!notification.read && (
                              <div className="w-2 h-2 bg-primary rounded-full"></div>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">{notification.message}</p>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <span>{formatNotificationDate(notification.createdAt)}</span>
                            <Badge variant="outline" className="text-xs">
                              {notification.category}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        {!notification.read && (
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleMarkAsRead(notification._id, true)}
                            title="Mark as read and delete"
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                        )}
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="text-destructive hover:text-destructive"
                          onClick={() => handleDeleteNotification(notification._id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="send" className="space-y-4">
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle>Send New Notification</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Notification Title</Label>
                  <Input
                    id="title"
                    placeholder="Enter notification title"
                    value={notificationTitle}
                    onChange={(e) => setNotificationTitle(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="recipients">Recipients</Label>
                  <select
                    id="recipients"
                    className="w-full px-3 py-2 border border-input bg-background rounded-md"
                    value={selectedRecipients}
                    onChange={(e) => setSelectedRecipients(e.target.value)}
                  >
                    <option value="all">All Users</option>
                    <option value="doctors">All Doctors</option>
                    <option value="patients">All Patients</option>
                    <option value="admin">Admin Only</option>
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="type">Type</Label>
                  <select
                    id="type"
                    className="w-full px-3 py-2 border border-input bg-background rounded-md"
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                  >
                    <option value="info">Info</option>
                    <option value="success">Success</option>
                    <option value="warning">Warning</option>
                    <option value="alert">Alert</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <select
                    id="category"
                    className="w-full px-3 py-2 border border-input bg-background rounded-md"
                    value={selectedNotificationCategory}
                    onChange={(e) => setSelectedNotificationCategory(e.target.value)}
                  >
                    {getCategoryOptions().map((category) => (
                      <option key={category.value} value={category.value}>
                        {category.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="priority">Priority</Label>
                  <select
                    id="priority"
                    className="w-full px-3 py-2 border border-input bg-background rounded-md"
                    value={selectedPriority}
                    onChange={(e) => setSelectedPriority(e.target.value)}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  placeholder="Type your notification message here..."
                  value={newNotification}
                  onChange={(e) => setNewNotification(e.target.value)}
                  rows={6}
                />
              </div>

              <div className="flex justify-between items-center pt-4">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      {selectedRecipients === "all" ? `All Users (${userCounts.total})` :
                       selectedRecipients === "doctors" ? `All Doctors (${userCounts.doctors})` :
                       selectedRecipients === "patients" ? `All Patients (${userCounts.patients})` :
                       `Admin Only (${userCounts.admin})`}
                    </span>
                  </div>
                </div>
                <Button className="bg-gradient-primary" onClick={handleCreateNotification}>
                  <Send className="h-4 w-4 mr-2" />
                  Send Notification
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <h4 className="font-medium">Email Notifications</h4>
                    <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                  </div>
                  <Switch 
                    checked={settings.emailNotifications}
                    onCheckedChange={(checked) => handleSettingsChange('emailNotifications', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <h4 className="font-medium">Push Notifications</h4>
                    <p className="text-sm text-muted-foreground">Browser push notifications</p>
                  </div>
                  <Switch 
                    checked={settings.pushNotifications}
                    onCheckedChange={(checked) => handleSettingsChange('pushNotifications', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <h4 className="font-medium">System Alerts</h4>
                    <p className="text-sm text-muted-foreground">Critical system notifications</p>
                  </div>
                  <Switch 
                    checked={settings.systemAlerts}
                    onCheckedChange={(checked) => handleSettingsChange('systemAlerts', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <h4 className="font-medium">User Activity</h4>
                    <p className="text-sm text-muted-foreground">New registrations and activities</p>
                  </div>
                  <Switch 
                    checked={settings.userActivity}
                    onCheckedChange={(checked) => handleSettingsChange('userActivity', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <h4 className="font-medium">Appointment Updates</h4>
                    <p className="text-sm text-muted-foreground">Booking and cancellation alerts</p>
                  </div>
                  <Switch 
                    checked={settings.appointmentUpdates}
                    onCheckedChange={(checked) => handleSettingsChange('appointmentUpdates', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <h4 className="font-medium">Auto-Delete Read Notifications</h4>
                    <p className="text-sm text-muted-foreground">Automatically delete read notifications</p>
                  </div>
                  <Switch 
                    checked={settings.autoDeleteRead}
                    onCheckedChange={(checked) => handleSettingsChange('autoDeleteRead', checked)}
                  />
                </div>

                {settings.autoDeleteRead && (
                  <div className="space-y-2">
                    <Label htmlFor="autoDeleteDays">Auto-delete after (days)</Label>
                    <Input
                      id="autoDeleteDays"
                      type="number"
                      min="1"
                      max="30"
                      value={settings.autoDeleteDays}
                      onChange={(e) => handleSettingsChange('autoDeleteDays', parseInt(e.target.value))}
                      className="w-32"
                    />
                  </div>
                )}
              </div>

              <div className="flex gap-4 pt-4 border-t">
                <Button onClick={handleSaveSettings}>
                  <Settings className="h-4 w-4 mr-2" />
                  Save Settings
                </Button>
                <Button variant="outline" onClick={handleResetSettings}>
                  <Settings className="h-4 w-4 mr-2" />
                  Reset to Defaults
                </Button>
                <Button variant="outline" onClick={handleCleanupOldNotifications}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Clean Up Old Notifications
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}