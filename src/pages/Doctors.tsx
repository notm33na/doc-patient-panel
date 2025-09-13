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
  Star, 
  MessageCircle,
  Heart,
  Brain,
  Eye,
  Stethoscope
} from "lucide-react";

const doctors = [
  {
    id: 1,
    name: "Dr. Sarah Johnson",
    specialty: "Cardiology",
    email: "sarah.johnson@hospital.com",
    phone: "+1 (555) 123-4567",
    rating: 4.8,
    reviews: 124,
    patients: 340,
    status: "active",
    sentiment: "positive",
    avatar: "/placeholder-doctor1.jpg",
    icon: Heart
  },
  {
    id: 2,
    name: "Dr. Michael Chen",
    specialty: "Neurology",
    email: "michael.chen@hospital.com",
    phone: "+1 (555) 234-5678",
    rating: 4.9,
    reviews: 89,
    patients: 267,
    status: "active",
    sentiment: "positive",
    avatar: "/placeholder-doctor2.jpg",
    icon: Brain
  },
  {
    id: 3,
    name: "Dr. Emily Rodriguez",
    specialty: "Ophthalmology",
    email: "emily.rodriguez@hospital.com",
    phone: "+1 (555) 345-6789",
    rating: 4.7,
    reviews: 156,
    patients: 423,
    status: "active",
    sentiment: "neutral",
    avatar: "/placeholder-doctor3.jpg",
    icon: Eye
  },
  {
    id: 4,
    name: "Dr. James Wilson",
    specialty: "General Medicine",
    email: "james.wilson@hospital.com",
    phone: "+1 (555) 456-7890",
    rating: 4.6,
    reviews: 203,
    patients: 578,
    status: "busy",
    sentiment: "positive",
    avatar: "/placeholder-doctor4.jpg",
    icon: Stethoscope
  }
];

const getSentimentColor = (sentiment: string) => {
  switch (sentiment) {
    case "positive":
      return "bg-success/10 text-success border-success/20";
    case "neutral":
      return "bg-warning/10 text-warning border-warning/20";
    case "negative":
      return "bg-destructive/10 text-destructive border-destructive/20";
    default:
      return "bg-muted/10 text-muted-foreground border-muted/20";
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "active":
      return "bg-success/10 text-success border-success/20";
    case "busy":
      return "bg-warning/10 text-warning border-warning/20";
    case "suspended":
      return "bg-destructive/10 text-destructive border-destructive/20";
    default:
      return "bg-muted/10 text-muted-foreground border-muted/20";
  }
};

export default function Doctors() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredDoctors = doctors.filter(doctor =>
    doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Doctors Management</h1>
          <p className="text-muted-foreground">Manage doctor profiles, feedback, and status</p>
        </div>
        <Button variant="gradient">
          <Edit className="h-4 w-4" />
          Add New Doctor
        </Button>
      </div>

      {/* Search and Filter */}
      <Card className="shadow-soft">
        <CardContent className="p-6">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search doctors by name or specialty..."
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

      {/* Doctors Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredDoctors.map((doctor) => (
          <Card key={doctor.id} className="shadow-soft hover:shadow-medium transition-smooth">
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={doctor.avatar} />
                      <AvatarFallback className="bg-gradient-secondary">
                        <doctor.icon className="h-6 w-6" />
                      </AvatarFallback>
                    </Avatar>
                    <div className={`absolute -bottom-1 -right-1 h-4 w-4 rounded-full ${getStatusColor(doctor.status)}`}>
                      <div className="h-2 w-2 rounded-full bg-current mx-auto mt-1" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold">{doctor.name}</h3>
                    <p className="text-sm text-muted-foreground">{doctor.specialty}</p>
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
                      <MessageCircle className="mr-2 h-4 w-4" />
                      View Feedback
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
                  <span className="font-medium">{doctor.email}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Phone:</span>
                  <span className="font-medium">{doctor.phone}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Patients:</span>
                  <span className="font-medium">{doctor.patients}</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 text-warning fill-current" />
                  <span className="font-medium">{doctor.rating}</span>
                  <span className="text-sm text-muted-foreground">({doctor.reviews})</span>
                </div>
                <Badge className={getSentimentColor(doctor.sentiment)}>
                  {doctor.sentiment} sentiment
                </Badge>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1">
                  <Edit className="h-3 w-3" />
                  Edit
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  <MessageCircle className="h-3 w-3" />
                  Feedback
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}