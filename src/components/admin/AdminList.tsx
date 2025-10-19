import { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  MoreHorizontal, 
  Shield, 
  Users, 
  Crown, 
  Trash2, 
  AlertTriangle,
  Loader2
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
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

interface Admin {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  status?: string; // optional if not in DB
  createdAt: string;
}

const getRoleBadgeColor = (role: string) => {
  switch (role) {
    case "Super Admin":
      return "bg-gradient-to-r from-purple-500 to-purple-600 text-white";
    case "Admin":
      return "bg-gradient-to-r from-blue-500 to-blue-600 text-white";
    default:
      return "bg-muted text-muted-foreground";
  }
};

export const AdminList = () => {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [promoteDialog, setPromoteDialog] = useState<{ open: boolean; admin: Admin | null }>({ open: false, admin: null });
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; admin: Admin | null; reason: string }>({ open: false, admin: null, reason: '' });
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Fetch data only once on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        
        // Fetch both current user and admins in parallel
        const [userResponse, adminsResponse] = await Promise.all([
          axios.get("http://localhost:5000/api/admins/me", {
            headers: { 'Authorization': `Bearer ${token}` }
          }),
          axios.get("http://localhost:5000/api/admins", {
            headers: { 'Authorization': `Bearer ${token}` }
          })
        ]);
        
        setCurrentUser(userResponse.data);
        setAdmins(adminsResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handlePromoteToSuperAdmin = async () => {
    if (!promoteDialog.admin) return;
    
    setActionLoading('promote');
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:5000/api/admins/${promoteDialog.admin._id}`, {
        role: 'Super Admin'
      }, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      // Update local state immediately (optimistic update)
      setAdmins(prev => prev.map(admin => 
        admin._id === promoteDialog.admin!._id 
          ? { ...admin, role: 'Super Admin' }
          : admin
      ));
      
      setPromoteDialog({ open: false, admin: null });
    } catch (error) {
      console.error("Error promoting admin:", error);
      // Could add toast notification here
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteAdmin = async () => {
    if (!deleteDialog.admin) return;
    
    setActionLoading('delete');
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/admins/${deleteDialog.admin._id}`, {
        data: { reason: deleteDialog.reason || 'Account terminated by administrator' },
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      // Update local state immediately (optimistic update)
      setAdmins(prev => prev.filter(admin => admin._id !== deleteDialog.admin!._id));
      
      setDeleteDialog({ open: false, admin: null, reason: '' });
    } catch (error) {
      console.error("Error deleting admin:", error);
      // Could add toast notification here
    } finally {
      setActionLoading(null);
    }
  };

  const canPromoteAdmin = (admin: Admin) => {
    return currentUser?.role === 'Super Admin' && admin.role === 'Admin';
  };

  const canDeleteAdmin = (admin: Admin) => {
    if (currentUser?.role !== 'Super Admin') return false;
    if (admin.role === 'Super Admin') return true; // Super admin can delete other super admins
    return true; // Super admin can delete regular admins
  };

  const isCurrentUser = (admin: Admin) => {
    return currentUser?._id === admin._id;
  };

  if (loading) {
    return (
      <Card className="w-full p-8 text-center">
        <p className="text-muted-foreground">Loading admins...</p>
      </Card>
    );
  }

  return (
    <Card className="w-full border border-border/20 shadow-medium bg-card">
      <CardHeader className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary-glow shadow-medium">
              <Users className="h-5 w-5 text-white" />
            </div>
            <CardTitle className="text-xl font-semibold text-card-foreground">
              Current Admins
            </CardTitle>
          </div>
          <Badge variant="secondary" className="px-3 py-1">
            {admins.length} Active
          </Badge>
        </div>
      </CardHeader>

      <CardContent>
        <div className="rounded-lg border border-border/20 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30">
                <TableHead className="font-semibold">Admin</TableHead>
                <TableHead className="font-semibold">Email</TableHead>
                <TableHead className="font-semibold">Role</TableHead>
                <TableHead className="font-semibold">Status</TableHead>
                <TableHead className="font-semibold w-16">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {admins.map((admin) => (
                <TableRow key={admin._id} className="hover:bg-muted/20 transition-colors">
                  <TableCell className="py-4">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary-glow/20 text-primary font-semibold">
                          {admin.firstName[0]}{admin.lastName[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-semibold text-card-foreground flex items-center gap-2">
                          {admin.firstName} {admin.lastName}
                          {isCurrentUser(admin) && (
                            <Badge variant="outline" className="text-xs">You</Badge>
                          )}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Added {new Date(admin.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{admin.email}</TableCell>
                  <TableCell>
                    <Badge className={getRoleBadgeColor(admin.role)}>
                      {admin.role === 'Super Admin' ? (
                        <Crown className="h-3 w-3 mr-1" />
                      ) : (
                        <Shield className="h-3 w-3 mr-1" />
                      )}
                      {admin.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">
                      {admin.status || "Active"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {/* Only show actions for non-super-admin users, or if current user is super admin */}
                    {admin.role !== 'Super Admin' || currentUser?.role === 'Super Admin' ? (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-muted/50">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {canPromoteAdmin(admin) && (
                            <DropdownMenuItem 
                              onClick={() => setPromoteDialog({ open: true, admin })}
                              className="text-purple-600"
                              disabled={actionLoading === 'promote'}
                            >
                              {actionLoading === 'promote' ? (
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              ) : (
                                <Crown className="h-4 w-4 mr-2" />
                              )}
                              Promote to Super Admin
                            </DropdownMenuItem>
                          )}
                          {canPromoteAdmin(admin) && <DropdownMenuSeparator />}
                          {canDeleteAdmin(admin) && !isCurrentUser(admin) && (
                            <DropdownMenuItem 
                              onClick={() => setDeleteDialog({ open: true, admin, reason: '' })}
                              className="text-destructive"
                              disabled={actionLoading === 'delete'}
                            >
                              {actionLoading === 'delete' ? (
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              ) : (
                                <Trash2 className="h-4 w-4 mr-2" />
                              )}
                              Delete Admin
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    ) : (
                      <span className="text-muted-foreground text-sm">No actions</span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>

      {/* Promotion Confirmation Dialog */}
      <AlertDialog open={promoteDialog.open} onOpenChange={(open) => setPromoteDialog({ open, admin: null })}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <Crown className="h-5 w-5 text-purple-600" />
              Promote to Super Admin
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to promote <strong>{promoteDialog.admin?.firstName} {promoteDialog.admin?.lastName}</strong> to Super Admin?
              <br /><br />
              This will give them full administrative privileges including the ability to manage other admins.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handlePromoteToSuperAdmin}
              className="bg-purple-600 hover:bg-purple-700"
              disabled={actionLoading === 'promote'}
            >
              {actionLoading === 'promote' ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Promoting...
                </>
              ) : (
                'Promote to Super Admin'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialog.open} onOpenChange={(open) => setDeleteDialog({ open, admin: null, reason: '' })}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              Delete Admin
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete <strong>{deleteDialog.admin?.firstName} {deleteDialog.admin?.lastName}</strong>?
              <br /><br />
              This action cannot be undone and will permanently remove their access to the system.
              <br /><br />
              <strong>Note:</strong> The admin will receive an email notification about this deletion.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="px-6 py-4">
            <label htmlFor="delete-reason" className="block text-sm font-medium text-gray-700 mb-2">
              Reason for deletion (optional)
            </label>
            <textarea
              id="delete-reason"
              value={deleteDialog.reason}
              onChange={(e) => setDeleteDialog(prev => ({ ...prev, reason: e.target.value }))}
              placeholder="Enter reason for admin deletion..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
              rows={3}
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteAdmin}
              className="bg-destructive hover:bg-destructive/90"
              disabled={actionLoading === 'delete'}
            >
              {actionLoading === 'delete' ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                'Delete Admin'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
};
