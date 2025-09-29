import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, RotateCcw, Ban } from "lucide-react";

const suspendedUsers = [
  {
    id: 1,
    name: "Dr. Marcus Johnson",
    email: "marcus.johnson@health.com",
    type: "Doctor",
    suspendedDate: "2024-01-15",
    reason: "Policy Violation",
    avatar: "/placeholder-avatar.jpg"
  },
  {
    id: 2,
    name: "Sarah Wilson",
    email: "sarah.wilson@email.com",
    type: "Patient",
    suspendedDate: "2024-01-18",
    reason: "Inappropriate Behavior",
    avatar: "/placeholder-avatar.jpg"
  },
  {
    id: 3,
    name: "Dr. Emily Chen",
    email: "emily.chen@health.com",
    type: "Doctor",
    suspendedDate: "2024-01-20",
    reason: "Multiple Complaints",
    avatar: "/placeholder-avatar.jpg"
  },
  {
    id: 4,
    name: "Michael Davis",
    email: "michael.davis@email.com",
    type: "Patient",
    suspendedDate: "2024-01-22",
    reason: "Fraudulent Activity",
    avatar: "/placeholder-avatar.jpg"
  }
];

export default function SuspendedUsers() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredUsers = suspendedUsers.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Suspended Users</h1>
          <p className="text-muted-foreground">Manage and review suspended user accounts</p>
        </div>
      </div>

      <Card className="shadow-soft">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Suspended User List</CardTitle>
            <div className="relative w-72">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Suspended Date</TableHead>
                  <TableHead>Reason</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center text-white font-medium">
                          {user.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <p className="font-medium">{user.name}</p>
                          <p className="text-sm text-muted-foreground">{user.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={user.type === "Doctor" ? "default" : "secondary"}>
                        {user.type}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{user.suspendedDate}</TableCell>
                    <TableCell>
                      <Badge variant="destructive" className="bg-destructive/10 text-destructive">
                        {user.reason}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <RotateCcw className="h-4 w-4 mr-1" />
                          Restore
                        </Button>
                        <Button variant="destructive" size="sm">
                          <Ban className="h-4 w-4 mr-1" />
                          Permanent Ban
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}