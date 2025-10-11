import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Card, CardContent, CardHeader
} from "@/components/ui/card";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  Stethoscope,
} from "lucide-react";

// Utility color functions
const getSentimentColor = (sentiment: string) => {
  switch (sentiment) {
    case "positive":
      return "bg-green-100 text-green-700 border-green-300";
    case "neutral":
      return "bg-yellow-100 text-yellow-700 border-yellow-300";
    case "negative":
      return "bg-red-100 text-red-700 border-red-300";
    default:
      return "bg-gray-100 text-gray-600 border-gray-300";
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "active":
      return "bg-green-100 text-green-700 border-green-300";
    case "busy":
      return "bg-yellow-100 text-yellow-700 border-yellow-300";
    case "suspended":
      return "bg-red-100 text-red-700 border-red-300";
    default:
      return "bg-gray-100 text-gray-600 border-gray-300";
  }
};

export default function Doctors() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [doctors, setDoctors] = useState<any[]>([]);
  const [filterOpen, setFilterOpen] = useState(false);
  const [filterSpecialty, setFilterSpecialty] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterSentiment, setFilterSentiment] = useState("all");
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    doctorId: string | null;
  }>({ open: false, doctorId: null });

  // Fetch approved doctors
  const fetchDoctors = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/doctors");
      const approved = res.data.filter((doc: any) => doc.status === "approved");
      setDoctors(approved);
    } catch (err) {
      console.error("Error fetching doctors:", err);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  // Suspend doctor
  const suspendDoctor = async (id: string) => {
    try {
      await axios.put(`http://localhost:5000/api/doctors/${id}/suspend`);
      setConfirmDialog({ open: false, doctorId: null });
      fetchDoctors(); // refresh list
    } catch (err) {
      console.error("Error suspending doctor:", err);
    }
  };

  // Filters
  const filteredDoctors = doctors.filter((doctor) => {
    const matchesSearch =
      doctor.DoctorName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.specialization?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpecialty =
      filterSpecialty === "all" ||
      doctor.specialization?.toLowerCase() === filterSpecialty;
    const matchesStatus =
      filterStatus === "all" || doctor.status === filterStatus;
    const matchesSentiment =
      filterSentiment === "all" || doctor.sentiment === filterSentiment;
    return (
      matchesSearch && matchesSpecialty && matchesStatus && matchesSentiment
    );
  });

  const iconMap: Record<string, any> = {
    cardiology: Heart,
    neurology: Brain,
    ophthalmology: Eye,
    "general medicine": Stethoscope,
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Doctors Management
          </h1>
          <p className="text-muted-foreground">
            Manage doctor profiles, feedback, and status
          </p>
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
          filteredDoctors.map((doctor) => {
            const Icon =
              iconMap[doctor.specialization?.toLowerCase()] || Stethoscope;
            return (
              <Card
                key={doctor._id}
                className="shadow-soft hover:shadow-medium transition-smooth"
              >
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src="/placeholder-doctor.jpg" />
                          <AvatarFallback className="bg-gradient-secondary">
                            <Icon className="h-6 w-6" />
                          </AvatarFallback>
                        </Avatar>
                        <div
                          className={`absolute -bottom-1 -right-1 h-4 w-4 rounded-full ${getStatusColor(
                            doctor.status
                          )}`}
                        >
                          <div className="h-2 w-2 rounded-full bg-current mx-auto mt-1" />
                        </div>
                      </div>
                      <div>
                        <h3 className="font-semibold">{doctor.DoctorName}</h3>
                        <p className="text-sm text-muted-foreground">
                          {doctor.specialization}
                        </p>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => navigate(`/edit-doctor/${doctor._id}`)}
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          Edit Profile
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => navigate(`/feedback/${doctor._id}`)}
                        >
                          <MessageCircle className="mr-2 h-4 w-4" />
                          View Feedback
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() =>
                            setConfirmDialog({ open: true, doctorId: doctor._id })
                          }
                        >
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
                      <span className="font-medium">
                        {doctor.no_of_patients || 0}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      <span className="font-medium">
                        {doctor.sentiment_score || "N/A"}
                      </span>
                    </div>
                    <Badge
                      className={getSentimentColor(doctor.sentiment || "neutral")}
                    >
                      {doctor.sentiment || "neutral"} sentiment
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            );
          })
        ) : (
          <p className="text-muted-foreground">No approved doctors found.</p>
        )}
      </div>

      {/* Suspend Confirmation Dialog */}
      <Dialog open={confirmDialog.open} onOpenChange={(open) => setConfirmDialog({ ...confirmDialog, open })}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Suspension</DialogTitle>
          </DialogHeader>
          <p>Are you sure you want to suspend this doctor's account?</p>
          <DialogFooter className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setConfirmDialog({ open: false, doctorId: null })}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => suspendDoctor(confirmDialog.doctorId!)}
            >
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
