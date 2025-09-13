import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Search, 
  Filter, 
  MoreVertical, 
  Edit, 
  UserX, 
  Calendar,
  User,
  FileText
} from "lucide-react";

const patients = [
  {
    id: 1,
    name: "John Doe",
    age: 45,
    email: "john.doe@email.com",
    phone: "+1 (555) 111-2222",
    lastVisit: "2024-01-15",
    doctor: "Dr. Sarah Johnson",
    condition: "Hypertension",
    status: "active",
    avatar: "/placeholder-patient1.jpg"
  },
  {
    id: 2,
    name: "Jane Smith",
    age: 32,
    email: "jane.smith@email.com",
    phone: "+1 (555) 222-3333",
    lastVisit: "2024-01-20",
    doctor: "Dr. Michael Chen",
    condition: "Migraine",
    status: "active",
    avatar: "/placeholder-patient2.jpg"
  },
  {
    id: 3,
    name: "Robert Johnson",
    age: 58,
    email: "robert.johnson@email.com",
    phone: "+1 (555) 333-4444",
    lastVisit: "2024-01-18",
    doctor: "Dr. Emily Rodriguez",
    condition: "Diabetes",
    status: "follow-up",
    avatar: "/placeholder-patient3.jpg"
  },
  {
    id: 4,
    name: "Maria Garcia",
    age: 28,
    email: "maria.garcia@email.com",
    phone: "+1 (555) 444-5555",
    lastVisit: "2024-01-22",
    doctor: "Dr. James Wilson",
    condition: "Annual Checkup",
    status: "completed",
    avatar: "/placeholder-patient4.jpg"
  }
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "active":
      return "bg-success/10 text-success border-success/20";
    case "follow-up":
      return "bg-warning/10 text-warning border-warning/20";
    case "completed":
      return "bg-primary/10 text-primary border-primary/20";
    case "suspended":
      return "bg-destructive/10 text-destructive border-destructive/20";
    default:
      return "bg-muted/10 text-muted-foreground border-muted/20";
  }
};

export default function Patients() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.condition.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Patients Management</h1>
          <p className="text-muted-foreground">Manage patient profiles and medical records</p>
        </div>
        <Button variant="gradient">
          <User className="h-4 w-4" />
          Add New Patient
        </Button>
      </div>

      {/* Search and Filter */}
      <Card className="shadow-soft">
        <CardContent className="p-6">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search patients by name or condition..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline">
              <Filter className="h-4 w-4" />
              Filter
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Patients Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredPatients.map((patient) => (
          <Card key={patient.id} className="shadow-soft hover:shadow-medium transition-smooth">
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={patient.avatar} />
                      <AvatarFallback className="bg-gradient-secondary">
                        <User className="h-6 w-6" />
                      </AvatarFallback>
                    </Avatar>
                    <div className={`absolute -bottom-1 -right-1 h-4 w-4 rounded-full ${getStatusColor(patient.status)}`}>
                      <div className="h-2 w-2 rounded-full bg-current mx-auto mt-1" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold">{patient.name}</h3>
                    <p className="text-sm text-muted-foreground">Age: {patient.age}</p>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <FileText className="mr-2 h-4 w-4" />
                      Medical Records
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Calendar className="mr-2 h-4 w-4" />
                      Schedule Appointment
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive">
                      <UserX className="mr-2 h-4 w-4" />
                      Suspend Account
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Email:</span>
                  <span className="font-medium">{patient.email}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Phone:</span>
                  <span className="font-medium">{patient.phone}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Doctor:</span>
                  <span className="font-medium">{patient.doctor}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Last Visit:</span>
                  <span className="font-medium">{patient.lastVisit}</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-foreground">{patient.condition}</span>
                <Badge className={getStatusColor(patient.status)}>
                  {patient.status}
                </Badge>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1">
                  <Edit className="h-3 w-3" />
                  Edit
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  <Calendar className="h-3 w-3" />
                  Schedule
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}