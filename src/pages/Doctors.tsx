import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  // Filter states
  const [filterOpen, setFilterOpen] = useState(false);
  const [filterSpecialty, setFilterSpecialty] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterSentiment, setFilterSentiment] = useState<string>("all");

  const filteredDoctors = doctors.filter((doctor) => {
    const matchesSearch =
      doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesSpecialty = filterSpecialty === "all" || doctor.specialty.toLowerCase() === filterSpecialty;
    const matchesStatus = filterStatus === "all" || doctor.status === filterStatus;
    const matchesSentiment = filterSentiment === "all" || doctor.sentiment === filterSentiment;

    return matchesSearch && matchesSpecialty && matchesStatus && matchesSentiment;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Doctors Management</h1>
          <p className="text-muted-foreground">Manage doctor profiles, feedback, and status</p>
        </div>
        <Button variant="gradient" onClick={() => navigate("/candidates")}>
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
            <Button variant="outline" onClick={() => setFilterOpen(true)}>
              <Filter className="h-4 w-4" />
              Filter
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Doctors Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredDoctors.length > 0 ? (
          filteredDoctors.map((doctor) => (
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
                      <DropdownMenuItem onClick={() => navigate(`/edit-doctor/${doctor.id}`)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit Profile
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate(`/feedback/${doctor.id}`)}>
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
                  <Button variant="outline" size="sm" className="flex-1" onClick={() => navigate(`/edit-doctor/${doctor.id}`)}>
                    <Edit className="h-3 w-3" />
                    Edit
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1" onClick={() => navigate(`/feedback/${doctor.id}`)}>
                    <MessageCircle className="h-3 w-3" />
                    Feedback
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <p className="text-muted-foreground">No doctors match your filters.</p>
        )}
      </div>

      {/* Filter Dialog */}
      <Dialog open={filterOpen} onOpenChange={setFilterOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Filter Doctors</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {/* Specialty Filter */}
            <div>
              <Label>Specialty</Label>
              <Select value={filterSpecialty} onValueChange={setFilterSpecialty}>
                <SelectTrigger>
                  <SelectValue placeholder="Select specialty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="cardiology">Cardiology</SelectItem>
                  <SelectItem value="neurology">Neurology</SelectItem>
                  <SelectItem value="ophthalmology">Ophthalmology</SelectItem>
                  <SelectItem value="general medicine">General Medicine</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Status Filter */}
            <div>
              <Label>Status</Label>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="busy">Busy</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Sentiment Filter */}
            <div>
              <Label>Sentiment</Label>
              <Select value={filterSentiment} onValueChange={setFilterSentiment}>
                <SelectTrigger>
                  <SelectValue placeholder="Select sentiment" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="positive">Positive</SelectItem>
                  <SelectItem value="neutral">Neutral</SelectItem>
                  <SelectItem value="negative">Negative</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => {
              setFilterSpecialty("all");
              setFilterStatus("all");
              setFilterSentiment("all");
              setFilterOpen(false);
            }}>
              Reset
            </Button>
            <Button onClick={() => setFilterOpen(false)}>Apply</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
