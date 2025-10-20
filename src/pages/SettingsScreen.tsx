import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import axios from "axios";
import EmailVerificationDialog from "@/components/EmailVerificationDialog";
import PasswordChangeDialog from "@/components/PasswordChangeDialog";
import { 
  User, 
  Shield, 
  Bell, 
  Database, 
  Mail,
  Phone,
  MapPin,
  Edit,
  Save,
  Key,
  Download,
  Trash2,
  AlertCircle,
  Loader2,
  Eye,
  EyeOff,
  CheckCircle
} from "lucide-react";

// Validation schemas
const profileSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(1, "Phone number is required"),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export default function SettingsScreen() {
  const { toast } = useToast();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Email verification dialog state
  const [showEmailVerification, setShowEmailVerification] = useState(false);
  const [pendingEmailChange, setPendingEmailChange] = useState<{
    newEmail: string;
    currentEmail: string;
  } | null>(null);
  
  // Password change dialog state
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  

  // Form instances
  const profileForm = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
  });

  // Fetch current user data
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
        
        // Set form values
        profileForm.setValue('firstName', response.data.firstName);
        profileForm.setValue('lastName', response.data.lastName);
        profileForm.setValue('email', response.data.email);
        profileForm.setValue('phone', response.data.phone);
      } else {
        window.location.href = '/login';
      }
    } catch (error: any) {
      console.error('Error fetching current user:', error);
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
      setError('Failed to load user data');
    } finally {
      setLoading(false);
    }
  };

  // Handle profile update
  const onProfileSubmit = async (data: ProfileFormData) => {
    try {
      setError(null);
      const token = localStorage.getItem('token');
      
      const response = await axios.put('http://localhost:5000/api/admins/me', data, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      // Check if email verification is required
      if (response.data.requiresEmailVerification) {
        setPendingEmailChange({
          newEmail: response.data.newEmail,
          currentEmail: response.data.currentEmail
        });
        setShowEmailVerification(true);
        return;
      }

      setCurrentUser(response.data);
      setIsEditing(false);
      
      toast({
        title: "Profile updated successfully",
        description: "Your profile information has been updated.",
      });
    } catch (error: any) {
      console.error('Error updating profile:', error);
      const errorMessage = error.response?.data?.message || 'Failed to update profile';
      setError(errorMessage);
      toast({
        title: "Update failed",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  // Handle email verification success
  const handleEmailVerificationSuccess = (updatedAdmin: any) => {
    setCurrentUser(updatedAdmin);
    setIsEditing(false);
    setShowEmailVerification(false);
    setPendingEmailChange(null);
    
    // Update form values
    profileForm.setValue('email', updatedAdmin.email);
    
    toast({
      title: "Email Changed Successfully",
      description: `Your email has been updated to ${updatedAdmin.email}`,
    });
  };

  // Handle email verification close
  const handleEmailVerificationClose = () => {
    setShowEmailVerification(false);
    setPendingEmailChange(null);
    // Reset form to current user data
    if (currentUser) {
      profileForm.setValue('email', currentUser.email);
    }
  };

  // Handle password change success
  const handlePasswordChangeSuccess = () => {
    toast({
      title: "Password Changed Successfully",
      description: "Your password has been updated successfully.",
    });
  };

  // Load user data on component mount
  useEffect(() => {
    fetchCurrentUser();
  }, []);

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Settings</h1>
          <p className="text-muted-foreground">Manage your account and system preferences</p>
        </div>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className={`grid w-full ${currentUser?.role === 'Super Admin' ? 'grid-cols-4' : 'grid-cols-3'}`}>
          <TabsTrigger value="profile">
            <User className="h-4 w-4 mr-2" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="security">
            <Shield className="h-4 w-4 mr-2" />
            Security
          </TabsTrigger>
          <TabsTrigger value="notifications">
            <Bell className="h-4 w-4 mr-2" />
            Notifications
          </TabsTrigger>
          {currentUser?.role === 'Super Admin' && (
            <TabsTrigger value="system">
              <Database className="h-4 w-4 mr-2" />
              System
            </TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="profile" className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <Card className="shadow-soft">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Profile Information</CardTitle>
                <Button
                  variant="outline"
                  onClick={() => setIsEditing(!isEditing)}
                >
                  {isEditing ? <Save className="h-4 w-4 mr-2" /> : <Edit className="h-4 w-4 mr-2" />}
                  {isEditing ? "Save Changes" : "Edit Profile"}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-6">
                <Avatar className="w-24 h-24">
                  <AvatarImage src={currentUser?.profileImage || "/placeholder-avatar.jpg"} />
                  <AvatarFallback className="bg-gradient-primary text-white text-2xl">
                    {currentUser ? getInitials(currentUser.firstName, currentUser.lastName) : 'AD'}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-2">
                  <Button variant="outline" size="sm">Change Photo</Button>
                  <p className="text-sm text-muted-foreground">JPG, PNG max 2MB</p>
                </div>
              </div>

              <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      {...profileForm.register("firstName")}
                      disabled={!isEditing}
                    />
                    {profileForm.formState.errors.firstName && (
                      <p className="text-sm text-destructive">{profileForm.formState.errors.firstName.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      {...profileForm.register("lastName")}
                      disabled={!isEditing}
                    />
                    {profileForm.formState.errors.lastName && (
                      <p className="text-sm text-destructive">{profileForm.formState.errors.lastName.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      {...profileForm.register("email")}
                      disabled={!isEditing}
                    />
                    {profileForm.formState.errors.email && (
                      <p className="text-sm text-destructive">{profileForm.formState.errors.email.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      {...profileForm.register("phone")}
                      disabled={!isEditing}
                    />
                    {profileForm.formState.errors.phone && (
                      <p className="text-sm text-destructive">{profileForm.formState.errors.phone.message}</p>
                    )}
                  </div>
                </div>

                {/* Password Section */}
                <div className="space-y-4 border-t pt-6">
                  <div className="space-y-2">
                    <Label>Password</Label>
                    <div className="space-y-4">
                      {/* Current Password Display */}
                      <div className="space-y-2">
                        <Label htmlFor="currentPasswordDisplay">Current Password</Label>
                        <div className="relative">
                          <Input 
                            id="currentPasswordDisplay"
                            type="password"
                            value="••••••••••••"
                            readOnly
                            className="bg-muted"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                            disabled
                          >
                            <EyeOff className="h-4 w-4" />
                          </Button>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Your password is hidden for security reasons
                        </p>
                      </div>

                      {/* Change Password Button */}
                      <Button 
                        type="button"
                        onClick={() => setShowPasswordChange(true)}
                        className="gap-2"
                      >
                        <Key className="h-4 w-4" />
                        Change Password
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Role</Label>
                  <Input
                    value={currentUser?.role || 'Admin'}
                    disabled
                    className="bg-muted"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Account Status</Label>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm text-green-600">Active</span>
                  </div>
                </div>

                {isEditing && (
                  <div className="flex gap-2">
                    <Button type="submit" className="gap-2">
                      <Save className="h-4 w-4" />
                      Save Changes
                    </Button>
                    <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>
                      Cancel
                    </Button>
                  </div>
                )}
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <h4 className="font-medium">Two-Factor Authentication</h4>
                    <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
                  </div>
                  <Switch />
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium">Session Management</h4>
                  <p className="text-sm text-muted-foreground">Manage your active sessions</p>
                  <div className="space-y-2 p-3 border rounded-lg">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">Current Session</p>
                        <p className="text-sm text-muted-foreground">Chrome on Windows • {currentUser?.email}</p>
                      </div>
                      <span className="text-sm text-success">Active now</span>
                    </div>
                  </div>
                  <Button variant="outline" className="text-destructive">
                    Sign out all devices
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <h4 className="font-medium">Email Notifications</h4>
                    <p className="text-sm text-muted-foreground">Receive updates via email</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <h4 className="font-medium">Desktop Notifications</h4>
                    <p className="text-sm text-muted-foreground">Show browser notifications</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <h4 className="font-medium">Doctor Approval Notifications</h4>
                    <p className="text-sm text-muted-foreground">Get notified when doctors need approval</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <h4 className="font-medium">Patient Registration Alerts</h4>
                    <p className="text-sm text-muted-foreground">Notifications for new patient registrations</p>
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
                    <h4 className="font-medium">Weekly Reports</h4>
                    <p className="text-sm text-muted-foreground">Receive weekly analytics reports</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <h4 className="font-medium">Admin Activity Notifications</h4>
                    <p className="text-sm text-muted-foreground">Notifications for admin actions and changes</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system" className="space-y-4">
          {currentUser?.role === 'Super Admin' ? (
            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle>System Configuration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>System Timezone</Label>
                    <select className="w-full px-3 py-2 border border-input bg-background rounded-md">
                      <option>Eastern Time (ET)</option>
                      <option>Central Time (CT)</option>
                      <option>Mountain Time (MT)</option>
                      <option>Pacific Time (PT)</option>
                      <option>UTC</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label>Date Format</Label>
                    <select className="w-full px-3 py-2 border border-input bg-background rounded-md">
                      <option>MM/DD/YYYY</option>
                      <option>DD/MM/YYYY</option>
                      <option>YYYY-MM-DD</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <h4 className="font-medium">Maintenance Mode</h4>
                      <p className="text-sm text-muted-foreground">Enable system maintenance mode</p>
                    </div>
                    <Switch />
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-medium">Data Export</h4>
                    <p className="text-sm text-muted-foreground">Download system data for backup</p>
                    <div className="flex gap-2">
                      <Button variant="outline">
                        <Download className="h-4 w-4 mr-2" />
                        Export Doctors
                      </Button>
                      <Button variant="outline">
                        <Download className="h-4 w-4 mr-2" />
                        Export Patients
                      </Button>
                      <Button variant="outline">
                        <Download className="h-4 w-4 mr-2" />
                        Export Admins
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-medium">Database Management</h4>
                    <p className="text-sm text-muted-foreground">Manage database operations</p>
                    <div className="flex gap-2">
                      <Button variant="outline">
                        <Database className="h-4 w-4 mr-2" />
                        Backup Database
                      </Button>
                      <Button variant="outline" className="text-destructive">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Clear Cache
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-medium">System Information</h4>
                    <div className="p-3 border rounded-lg space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Admin Role:</span>
                        <span className="text-sm font-medium">{currentUser?.role || 'Admin'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Last Login:</span>
                        <span className="text-sm font-medium">
                          {currentUser?.lastLogin ? new Date(currentUser.lastLogin).toLocaleDateString() : 'Never'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Account Created:</span>
                        <span className="text-sm font-medium">
                          {currentUser?.createdAt ? new Date(currentUser.createdAt).toLocaleDateString() : 'Unknown'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Login Attempts:</span>
                        <span className="text-sm font-medium">{currentUser?.loginAttempts || 0}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="shadow-soft">
              <CardContent className="p-8 text-center">
                <Shield className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">Access Restricted</h3>
                <p className="text-muted-foreground">
                  System configuration is only available to Super Admin users.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

      </Tabs>

      {/* Email Verification Dialog */}
      {pendingEmailChange && (
        <EmailVerificationDialog
          isOpen={showEmailVerification}
          onClose={handleEmailVerificationClose}
          onSuccess={handleEmailVerificationSuccess}
          newEmail={pendingEmailChange.newEmail}
          currentEmail={pendingEmailChange.currentEmail}
        />
      )}

      {/* Password Change Dialog */}
      <PasswordChangeDialog
        isOpen={showPasswordChange}
        onClose={() => setShowPasswordChange(false)}
        onSuccess={handlePasswordChangeSuccess}
      />
    </div>
  );
}