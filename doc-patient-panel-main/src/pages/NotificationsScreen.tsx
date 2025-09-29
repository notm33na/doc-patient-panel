import { useState } from "react";
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
  UserCheck
} from "lucide-react";

const notifications = [
  {
    id: 1,
    title: "New Doctor Registration",
    message: "Dr. Emily Rodriguez has submitted registration documents for review",
    type: "info",
    time: "2 minutes ago",
    read: false,
    category: "doctors"
  },
  {
    id: 2,
    title: "System Maintenance",
    message: "Scheduled maintenance will begin at 2:00 AM tomorrow. Expected downtime: 30 minutes",
    type: "warning",
    time: "1 hour ago",
    read: false,
    category: "system"
  },
  {
    id: 3,
    title: "Patient Feedback Alert",
    message: "Multiple negative reviews received for Dr. Smith. Immediate attention required",
    type: "alert",
    time: "3 hours ago",
    read: true,
    category: "feedback"
  },
  {
    id: 4,
    title: "Appointment Cancelled",
    message: "Patient John Doe cancelled appointment with Dr. Wilson scheduled for tomorrow",
    type: "info",
    time: "5 hours ago",
    read: true,
    category: "appointments"
  },
  {
    id: 5,
    title: "Monthly Report Ready",
    message: "Your monthly analytics report is now available for download",
    type: "success",
    time: "1 day ago",
    read: true,
    category: "reports"
  }
];

export default function NotificationsScreen() {
  const [newNotification, setNewNotification] = useState("");
  const [notificationTitle, setNotificationTitle] = useState("");
  const [selectedRecipients, setSelectedRecipients] = useState("all");

  const getNotificationIcon = (type: string) => {
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
                <Button variant="outline" size="sm">
                  <Check className="h-4 w-4 mr-1" />
                  Mark All Read
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 rounded-lg border transition-colors ${
                      !notification.read ? "bg-accent/50 border-primary/20" : "bg-background"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex gap-3">
                        {getNotificationIcon(notification.type)}
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium">{notification.title}</h4>
                            {getNotificationBadge(notification.type)}
                            {!notification.read && (
                              <div className="w-2 h-2 bg-primary rounded-full"></div>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">{notification.message}</p>
                          <p className="text-xs text-muted-foreground">{notification.time}</p>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        {!notification.read && (
                          <Button variant="ghost" size="sm">
                            <Check className="h-4 w-4" />
                          </Button>
                        )}
                        <Button variant="ghost" size="sm">
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
                    <option value="staff">Staff Only</option>
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
                      {selectedRecipients === "all" ? "All Users (525)" :
                       selectedRecipients === "doctors" ? "All Doctors (75)" :
                       selectedRecipients === "patients" ? "All Patients (450)" :
                       "Staff Members (12)"}
                    </span>
                  </div>
                </div>
                <Button className="bg-gradient-primary">
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
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <h4 className="font-medium">Push Notifications</h4>
                    <p className="text-sm text-muted-foreground">Browser push notifications</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <h4 className="font-medium">System Alerts</h4>
                    <p className="text-sm text-muted-foreground">Critical system notifications</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <h4 className="font-medium">User Activity</h4>
                    <p className="text-sm text-muted-foreground">New registrations and activities</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <h4 className="font-medium">Appointment Updates</h4>
                    <p className="text-sm text-muted-foreground">Booking and cancellation alerts</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}