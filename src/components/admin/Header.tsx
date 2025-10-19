import { Bell, Search, User, MessageCircle, Video, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  fetchNotifications, 
  markNotificationAsRead,
  formatNotificationDate,
  getNotificationTypeColor,
  type Notification
} from "@/services/notificationService";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

export function Header() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, logout } = useAuth();
  const currentTime = new Date().getHours();
  const greeting = currentTime < 12 ? "Good Morning" : currentTime < 17 ? "Good Afternoon" : "Good Evening";
  
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [userLoading, setUserLoading] = useState(true);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);

  // Load recent notifications
  const loadNotifications = async () => {
    try {
      setLoading(true);
      console.log('🔔 Header: Loading notifications...');
      const data = await fetchNotifications({ limit: 3 });
      console.log('🔔 Header: Notifications loaded:', data);
      setNotifications(data);
    } catch (error) {
      console.error("🔔 Header: Error loading notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch current user
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
        // Redirect to login if no token
        window.location.href = '/login';
      }
    } catch (error) {
      console.error('Error fetching current user:', error);
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    } finally {
      setUserLoading(false);
    }
  };

  // Load notifications on component mount
  useEffect(() => {
    fetchCurrentUser();
    loadNotifications();
  }, []);

  const handleNotificationClick = async (notification: Notification) => {
    if (!notification.read) {
      try {
        await markNotificationAsRead(notification._id);
        setNotifications(prev => 
          prev.map(n => n._id === notification._id ? { ...n, read: true } : n)
        );
      } catch (error) {
        console.error("Error marking notification as read:", error);
      }
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleLogout = () => {
    setShowLogoutDialog(true);
  };

  const confirmLogout = () => {
    logout();
    toast({
      title: "Logged out successfully",
      description: `Goodbye, ${user?.firstName || 'Admin'}! You have been logged out securely.`,
    });
    setShowLogoutDialog(false);
  };

  const cancelLogout = () => {
    setShowLogoutDialog(false);
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  return (
    <>
    <header className="bg-card border-b border-border px-6 py-4 shadow-soft">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 flex-1">
         
          
          <div className="flex items-center gap-4 flex-1">
  <div className="relative w-1/2 mx-auto">
    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
    <Input
      placeholder="Search..."
      className="pl-10 bg-background w-full"
    />
  </div>
</div>

        </div>

        <div className="flex items-center gap-4">
          {/* Quick Chat Access */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="relative hover:bg-accent"
            onClick={() => navigate('/chat')}
          >
            <MessageCircle className="h-5 w-5" />
            <Badge className="absolute -top-1 -right-1 h-4 w-4 bg-primary text-white text-xs rounded-full flex items-center justify-center">
              3
            </Badge>
          </Button>
          
          
          
          {/* Notifications Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-4 w-4 bg-destructive text-destructive-foreground text-xs rounded-full flex items-center justify-center">
                    {unreadCount}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel className="flex items-center justify-between">
                <span>Latest Notifications</span>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => navigate('/notifications')}
                  className="text-xs"
                >
                  View All
                </Button>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              
              {loading ? (
                <div className="p-4 text-center text-sm text-muted-foreground">
                  Loading notifications...
                </div>
              ) : notifications.length === 0 ? (
                <div className="p-4 text-center text-sm text-muted-foreground">
                  No notifications
                </div>
              ) : (
                notifications.map((notification) => (
                  <DropdownMenuItem 
                    key={notification._id}
                    className={`p-3 cursor-pointer ${!notification.read ? 'bg-accent/50' : ''}`}
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <div className="flex flex-col w-full">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="text-sm font-medium">{notification.title}</p>
                          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                            {notification.message}
                          </p>
                        </div>
                        {!notification.read && (
                          <div className="w-2 h-2 bg-primary rounded-full ml-2 mt-1 flex-shrink-0"></div>
                        )}
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <Badge className={`text-xs ${getNotificationTypeColor(notification.type)}`}>
                          {notification.type}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {formatNotificationDate(notification.createdAt)}
                        </span>
                      </div>
                    </div>
                  </DropdownMenuItem>
                ))
              )}
              
              {notifications.length > 0 && (
                <>
                  <DropdownMenuSeparator />
                  <div className="px-3 py-2 text-xs text-muted-foreground text-center">
                    Showing {notifications.length} of latest notifications
                  </div>
                  <DropdownMenuItem onClick={() => navigate('/notifications')}>
                    View All Notifications
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="gap-2 px-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={currentUser?.profileImage || "/placeholder-avatar.jpg"} />
                  <AvatarFallback className="bg-gradient-primary text-white">
                    {currentUser ? getInitials(currentUser.firstName, currentUser.lastName) : 'AD'}
                  </AvatarFallback>
                </Avatar>
                <div className="text-left">
                  <p className="text-sm font-medium">
                    {currentUser ? `${currentUser.firstName} ${currentUser.lastName}` : 'Loading...'}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {currentUser ? currentUser.email : 'admin@health.com'}
                  </p>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col">
                  <span className="font-medium">
                    {currentUser ? `${currentUser.firstName} ${currentUser.lastName}` : 'Admin User'}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {currentUser ? currentUser.role : 'Admin'}
                  </span>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate('/settings')}>
                <User className="mr-2 h-4 w-4" />
                Profile Settings
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/notifications')}>
                <Bell className="mr-2 h-4 w-4" />
                Notifications
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>

    {/* Logout Confirmation Dialog */}
    <AlertDialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirm Logout</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to log out? You will need to sign in again to access the admin panel.
            {currentUser && (
              <span className="block mt-2 text-sm font-medium">
                Logging out as: {currentUser.firstName} {currentUser.lastName} ({currentUser.role})
              </span>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={cancelLogout}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction 
            onClick={confirmLogout}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Log Out
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
    </>
  );
}