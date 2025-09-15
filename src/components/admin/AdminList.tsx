import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MoreHorizontal, Shield, Users } from "lucide-react";

// Mock data for existing admins
const mockAdmins = [
  {
    id: 1,
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@healthcare.com",
    role: "Super Admin",
    department: "IT & Technology",
    status: "Active",
    createdAt: "2024-01-15"
  },
  {
    id: 2,
    firstName: "Sarah",
    lastName: "Johnson",
    email: "sarah.j@healthcare.com",
    role: "Admin",
    department: "Healthcare",
    status: "Active",
    createdAt: "2024-02-20"
  },
  {
    id: 3,
    firstName: "Mike",
    lastName: "Wilson",
    email: "m.wilson@healthcare.com",
    role: "Moderator",
    department: "Operations",
    status: "Active",
    createdAt: "2024-03-10"
  }
];

const getRoleBadgeColor = (role: string) => {
  switch (role) {
    case "Super Admin":
      return "bg-gradient-to-r from-red-500 to-red-600 text-white";
    case "Admin":
      return "bg-gradient-to-r from-primary to-primary-glow text-white";
    case "Moderator":
      return "bg-gradient-to-r from-yellow-500 to-yellow-600 text-white";
    default:
      return "bg-muted text-muted-foreground";
  }
};

export const AdminList = () => {
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
            {mockAdmins.length} Active
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
                <TableHead className="font-semibold">Department</TableHead>
                <TableHead className="font-semibold">Status</TableHead>
                <TableHead className="font-semibold w-16">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockAdmins.map((admin) => (
                <TableRow key={admin.id} className="hover:bg-muted/20 transition-colors">
                  <TableCell className="py-4">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary-glow/20 text-primary font-semibold">
                          {admin.firstName[0]}{admin.lastName[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-semibold text-card-foreground">
                          {admin.firstName} {admin.lastName}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Added {admin.createdAt}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {admin.email}
                  </TableCell>
                  <TableCell>
                    <Badge className={getRoleBadgeColor(admin.role)}>
                      <Shield className="h-3 w-3 mr-1" />
                      {admin.role}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {admin.department}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">
                      {admin.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 hover:bg-muted/50"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};