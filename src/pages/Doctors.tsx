import { useState, useEffect } from "react";
import { SuspensionForm } from "@/components/SuspensionForm";
import { SuspensionData } from "@/services/doctorService";
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
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
  Stethoscope,
  Loader2,
  RefreshCw,
  Trash2,
  UserCheck,
  X
} from "lucide-react";

import { 
  fetchDoctors, 
  searchDoctors, 
  fetchDoctorsBySpecialization, 
  fetchDoctorsBySentiment,
  updateDoctorStatus,
  deleteDoctor,
  Doctor 
} from "@/services/doctorService";

// Helper function to get icon based on specialization
const getSpecializationIcon = (specialization: string | string[]) => {
  // Handle both string and array cases
  const spec = Array.isArray(specialization) 
    ? specialization[0] || "general medicine" 
    : specialization || "general medicine";
  
  switch (spec.toLowerCase()) {
    case "cardiology":
      return Heart;
    case "neurology":
      return Brain;
    case "ophthalmology":
      return Eye;
    case "general medicine":
      return Stethoscope;
    case "orthopedics":
      return Stethoscope;
    case "dermatology":
      return Stethoscope;
    case "pediatrics":
      return Stethoscope;
    default:
      return Stethoscope;
  }
};

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
    case "approved":
      return "bg-success/10 text-success border-success/20";
    case "pending":
      return "bg-warning/10 text-warning border-warning/20";
    case "rejected":
      return "bg-destructive/10 text-destructive border-destructive/20";
    case "suspended":
      return "bg-muted/10 text-muted-foreground border-muted/20";
    default:
      return "bg-muted/10 text-muted-foreground border-muted/20";
  }
};

const getStatusText = (status: string) => {
  switch (status) {
    case "approved":
      return "Active";
    case "pending":
      return "Pending";
    case "rejected":
      return "Rejected";
    case "suspended":
      return "Suspended";
    default:
      return "Unknown";
  }
};

export default function Doctors() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [filteredDoctors, setFilteredDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState<{id: string, name: string} | null>(null);
  const [showSuspendDialog, setShowSuspendDialog] = useState<{id: string, status: string} | null>(null);
  const [showSuspensionForm, setShowSuspensionForm] = useState<{id: string, name: string} | null>(null);

  // Filter states
  const [filterOpen, setFilterOpen] = useState(false);
  const [filterSpecialty, setFilterSpecialty] = useState<string>("all");
  const [filterSentiment, setFilterSentiment] = useState<string>("all");

  // Load doctors from API
  const loadDoctors = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchDoctors();
      setDoctors(data);
      setFilteredDoctors(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load doctors");
      console.error("Error loading doctors:", err);
    } finally {
      setLoading(false);
    }
  };

  // Handle search
  const handleSearch = async (query: string) => {
    try {
      if (query.trim()) {
        const data = await searchDoctors(query);
        setFilteredDoctors(data);
      } else {
        setFilteredDoctors(doctors);
      }
    } catch (err) {
      console.error("Error searching doctors:", err);
      setFilteredDoctors(doctors);
    }
  };

  // Handle specialization filter
  const handleSpecializationFilter = async (specialization: string) => {
    try {
      if (specialization === "all") {
        setFilteredDoctors(doctors);
      } else {
        const data = await fetchDoctorsBySpecialization(specialization);
        setFilteredDoctors(data);
      }
    } catch (err) {
      console.error("Error filtering by specialization:", err);
      setFilteredDoctors(doctors);
    }
  };

  // Handle sentiment filter
  const handleSentimentFilter = async (sentiment: string) => {
    try {
      if (sentiment === "all") {
        setFilteredDoctors(doctors);
      } else {
        const data = await fetchDoctorsBySentiment(sentiment);
        setFilteredDoctors(data);
      }
    } catch (err) {
      console.error("Error filtering by sentiment:", err);
      setFilteredDoctors(doctors);
    }
  };

  // Load doctors on component mount
  useEffect(() => {
    loadDoctors();
  }, []);

  // Apply filters when they change
  useEffect(() => {
    let filtered = doctors;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter((doctor) =>
        doctor.DoctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (Array.isArray(doctor.specialization) 
          ? doctor.specialization.some(spec => spec.toLowerCase().includes(searchTerm.toLowerCase()))
          : doctor.specialization?.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Apply specialization filter
    if (filterSpecialty !== "all") {
      filtered = filtered.filter((doctor) =>
        Array.isArray(doctor.specialization)
          ? doctor.specialization.some(spec => spec.toLowerCase() === filterSpecialty)
          : doctor.specialization?.toLowerCase() === filterSpecialty
      );
    }

    // Apply sentiment filter
    if (filterSentiment !== "all") {
      filtered = filtered.filter((doctor) => doctor.sentiment === filterSentiment);
    }

    setFilteredDoctors(filtered);
  }, [doctors, searchTerm, filterSpecialty, filterSentiment]);

  // Handle delete doctor
  const handleDeleteDoctor = async (doctorId: string, doctorName: string) => {
    console.log("handleDeleteDoctor called with:", { doctorId, doctorName });
    try {
      setDeleting(doctorId);
      setError(null);
      await deleteDoctor(doctorId);
      console.log("Doctor deleted successfully");
      setShowDeleteDialog(null);
      await loadDoctors(); // Refresh the list
    } catch (err) {
      console.error('Error deleting doctor:', err);
      setError(err instanceof Error ? err.message : 'Failed to delete doctor');
    } finally {
      setDeleting(null);
    }
  };

  // Handle suspend/unsuspend doctor
  const handleToggleSuspend = async (doctorId: string, currentStatus: string) => {
    console.log("handleToggleSuspend called with:", { doctorId, currentStatus });
    try {
      setDeleting(doctorId);
      setError(null);
      const newStatus = currentStatus === 'suspended' ? 'approved' : 'suspended';
      console.log("Updating status to:", newStatus);
      
      // If unsuspending, just update status (suspension records will be revoked by backend)
      if (newStatus === 'approved') {
        await updateDoctorStatus(doctorId, newStatus);
        console.log("Status updated successfully");
        setShowSuspendDialog(null);
        await loadDoctors(); // Refresh the list
      } else {
        // If suspending, show the suspension form
        const doctor = doctors.find(d => d._id === doctorId);
        if (doctor) {
          setShowSuspendDialog(null);
          setShowSuspensionForm({ id: doctorId, name: doctor.DoctorName });
        }
      }
    } catch (err) {
      console.error('Error updating doctor status:', err);
      setError(err instanceof Error ? err.message : 'Failed to update doctor status');
    } finally {
      setDeleting(null);
    }
  };

  // Handle doctor deletion notification
  const handleDoctorDeleted = (message: string) => {
    setSuccess(message);
    setShowSuspensionForm(null);
    loadDoctors(); // Refresh the list
  };

  // Handle suspension form submission
  const handleSuspensionSubmit = async (suspensionData: SuspensionData) => {
    if (!showSuspensionForm) return;
    
    try {
      setDeleting(showSuspensionForm.id);
      setError(null);
      
      const result = await updateDoctorStatus(showSuspensionForm.id, "suspended", suspensionData);
      
      // Check if doctor was deleted due to 6th suspension
      if ('deleted' in result && result.deleted) {
        setSuccess(result.message);
        setShowSuspensionForm(null);
        await loadDoctors(); // Refresh the list
        return;
      }
      
      console.log("Doctor suspended with detailed data");
      setShowSuspensionForm(null);
      await loadDoctors(); // Refresh the list
    } catch (err) {
      console.error('Error suspending doctor:', err);
      setError(err instanceof Error ? err.message : 'Failed to suspend doctor');
    } finally {
      setDeleting(null);
    }
  };

  // Get active filters
  const getActiveFilters = () => {
    const filters = [];
    if (searchTerm) filters.push({ type: 'search', label: `Search: "${searchTerm}"`, value: searchTerm });
    if (filterSpecialty !== 'all') filters.push({ type: 'specialty', label: `Specialty: ${filterSpecialty}`, value: filterSpecialty });
    if (filterSentiment !== 'all') filters.push({ type: 'sentiment', label: `Sentiment: ${filterSentiment}`, value: filterSentiment });
    return filters;
  };

  // Clear specific filter
  const clearFilter = (filterType: string) => {
    switch (filterType) {
      case 'search':
        setSearchTerm('');
        break;
      case 'specialty':
        setFilterSpecialty('all');
        break;
      case 'sentiment':
        setFilterSentiment('all');
        break;
    }
  };

  // Clear all filters
  const clearAllFilters = () => {
    setSearchTerm('');
    setFilterSpecialty('all');
    setFilterSentiment('all');
  };

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

      {/* Active Filters Display */}
      {getActiveFilters().length > 0 && (
        <Card className="shadow-soft">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-muted-foreground">Active Filters:</span>
                <div className="flex flex-wrap gap-2">
                  {getActiveFilters().map((filter, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                      {filter.label}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-4 w-4 p-0 hover:bg-transparent"
                        onClick={() => clearFilter(filter.type)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={clearAllFilters}
                className="text-muted-foreground hover:text-foreground"
              >
                Clear All
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Loading and Error States */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2 text-muted-foreground">Loading doctors...</span>
        </div>
      )}

      {error && (
        <Card className="shadow-soft border-destructive/20">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 text-destructive">
              <div className="h-4 w-4 rounded-full bg-destructive/20 flex items-center justify-center">
                <span className="text-xs">!</span>
              </div>
              <span>{error}</span>
              <Button variant="outline" size="sm" onClick={loadDoctors} className="ml-auto">
                <RefreshCw className="h-4 w-4 mr-2" />
                Retry
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Doctors Grid */}
      {!loading && !error && (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredDoctors.length > 0 ? (
            filteredDoctors.map((doctor) => {
              const IconComponent = getSpecializationIcon(doctor.specialization);
              return (
                <Card key={doctor._id} className="shadow-soft hover:shadow-medium transition-smooth">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Avatar className="h-12 w-12">
                            <AvatarImage src={doctor.profileImage || ""} />
                        <AvatarFallback className="bg-gradient-secondary">
                              <IconComponent className="h-6 w-6" />
                        </AvatarFallback>
                      </Avatar>
                      <div className={`absolute -bottom-1 -right-1 h-4 w-4 rounded-full ${getStatusColor(doctor.status)}`}>
                        <div className="h-2 w-2 rounded-full bg-current mx-auto mt-1" />
                      </div>
                    </div>
                    <div>
                          <h3 className="font-semibold">{doctor.DoctorName}</h3>
                          <p className="text-sm text-muted-foreground">
                            {Array.isArray(doctor.specialization) 
                              ? doctor.specialization.join(", ")
                              : doctor.specialization || "No specialization"}
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
                          <DropdownMenuItem onClick={() => navigate(`/edit-doctor/${doctor._id}`)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit Profile
                      </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => navigate(`/feedback/${doctor._id}`)}>
                        <MessageCircle className="mr-2 h-4 w-4" />
                        View Feedback
                      </DropdownMenuItem>
                          
                          {/* Conditional Suspend/Unsuspend */}
                          {doctor.status === 'suspended' ? (
                            <DropdownMenuItem 
                              onClick={() => setShowSuspendDialog({id: doctor._id, status: doctor.status})}
                              disabled={deleting === doctor._id}
                              className="text-green-600"
                            >
                              <UserCheck className="mr-2 h-4 w-4" />
                              Unsuspend Doctor
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem 
                              onClick={() => setShowSuspendDialog({id: doctor._id, status: doctor.status})}
                              disabled={deleting === doctor._id}
                              className="text-orange-600"
                            >
                        <UserX className="mr-2 h-4 w-4" />
                              Suspend Doctor
                            </DropdownMenuItem>
                          )}

                          {/* Delete Doctor */}
                          <DropdownMenuItem 
                            onClick={() => setShowDeleteDialog({id: doctor._id, name: doctor.DoctorName})}
                            disabled={deleting === doctor._id}
                            className="text-destructive"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete Doctor
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Email:</span>
                        <span className="font-medium text-right max-w-[60%] truncate" title={doctor.email}>
                          {doctor.email}
                        </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Phone:</span>
                    <span className="font-medium">{doctor.phone}</span>
                  </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Department:</span>
                        <span className="font-medium">{doctor.department}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Patients:</span>
                        <span className="font-medium">{doctor.no_of_patients}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-warning fill-current" />
                        <span className="font-medium">{doctor.sentiment_score.toFixed(1)}</span>
                        <span className="text-sm text-muted-foreground">({doctor.no_of_patients})</span>
                  </div>
                  <Badge className={getSentimentColor(doctor.sentiment)}>
                    {doctor.sentiment} sentiment
                  </Badge>
                </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-foreground">Status</span>
                      <Badge className={getStatusColor(doctor.status)}>
                        {getStatusText(doctor.status)}
                  </Badge>
                </div>

                <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1" onClick={() => navigate(`/edit-doctor/${doctor._id}`)}>
                    <Edit className="h-3 w-3" />
                    Edit
                  </Button>
                      <Button variant="outline" size="sm" className="flex-1" onClick={() => navigate(`/feedback/${doctor._id}`)}>
                    <MessageCircle className="h-3 w-3" />
                    Feedback
                  </Button>
                </div>
              </CardContent>
            </Card>
              );
            })
          ) : (
            <div className="col-span-full text-center py-12">
              <div className="text-muted-foreground">
                <UserX className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-semibold mb-2">No doctors found</h3>
                <p className="text-sm">
                  {searchTerm || filterSpecialty !== "all" || filterSentiment !== "all"
                    ? "Try adjusting your search or filter criteria."
                    : "No approved doctors have been added yet."}
                </p>
              </div>
            </div>
        )}
      </div>
      )}

      {/* Filter Dialog */}
      <Dialog open={filterOpen} onOpenChange={setFilterOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Filter Doctors</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="specialty">Specialty</Label>
              <Select value={filterSpecialty} onValueChange={setFilterSpecialty}>
                <SelectTrigger>
                  <SelectValue placeholder="Select specialty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Specialties</SelectItem>
                  <SelectItem value="cardiology">Cardiology</SelectItem>
                  <SelectItem value="neurology">Neurology</SelectItem>
                  <SelectItem value="orthopedics">Orthopedics</SelectItem>
                  <SelectItem value="dermatology">Dermatology</SelectItem>
                  <SelectItem value="pediatrics">Pediatrics</SelectItem>
                  <SelectItem value="general medicine">General Medicine</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="sentiment">Sentiment</Label>
              <Select value={filterSentiment} onValueChange={setFilterSentiment}>
                <SelectTrigger>
                  <SelectValue placeholder="Select sentiment" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sentiments</SelectItem>
                  <SelectItem value="positive">Positive</SelectItem>
                  <SelectItem value="neutral">Neutral</SelectItem>
                  <SelectItem value="negative">Negative</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setFilterOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setFilterOpen(false)}>
              Apply Filters
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Doctor Dialog */}
      <AlertDialog open={!!showDeleteDialog} onOpenChange={() => setShowDeleteDialog(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Doctor</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the doctor's account and all associated data including their profile, appointments, and patient records.
              <br /><br />
              <strong>This action cannot be undone.</strong>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => showDeleteDialog && handleDeleteDoctor(showDeleteDialog.id, showDeleteDialog.name)}
              className="bg-red-600 hover:bg-red-700"
              disabled={deleting === showDeleteDialog?.id}
            >
              {deleting === showDeleteDialog?.id ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Deleting...
                </>
              ) : (
                "Delete Doctor"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Suspend/Unsuspend Doctor Dialog */}
      <AlertDialog open={!!showSuspendDialog} onOpenChange={() => setShowSuspendDialog(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {showSuspendDialog?.status === 'suspended' ? 'Unsuspend Doctor' : 'Suspend Doctor'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {showSuspendDialog?.status === 'suspended' ? (
                <>
                  This will restore the doctor's account and allow them to access the system and accept new patients.
                  <br /><br />
                  <strong>Are you sure you want to unsuspend this doctor?</strong>
                </>
              ) : (
                <>
                  This will suspend the doctor's account, preventing them from accessing the system or accepting new patients.
                  <br /><br />
                  Existing appointments may need to be rescheduled.
                  <br /><br />
                  <strong>Are you sure you want to suspend this doctor?</strong>
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => showSuspendDialog && handleToggleSuspend(showSuspendDialog.id, showSuspendDialog.status)}
              className={showSuspendDialog?.status === 'suspended' ? "bg-green-600 hover:bg-green-700" : "bg-orange-600 hover:bg-orange-700"}
              disabled={deleting === showSuspendDialog?.id}
            >
              {deleting === showSuspendDialog?.id ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  {showSuspendDialog?.status === 'suspended' ? 'Unsuspending...' : 'Suspending...'}
                </>
              ) : (
                showSuspendDialog?.status === 'suspended' ? 'Unsuspend Doctor' : 'Suspend Doctor'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Suspension Form Dialog */}
      <Dialog open={!!showSuspensionForm} onOpenChange={() => setShowSuspensionForm(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Suspend Doctor</DialogTitle>
          </DialogHeader>
          {showSuspensionForm && (
            <SuspensionForm
              doctorId={showSuspensionForm.id}
              doctorName={showSuspensionForm.name}
              onSubmit={handleSuspensionSubmit}
              onCancel={() => setShowSuspensionForm(null)}
              onDoctorDeleted={handleDoctorDeleted}
              loading={deleting === showSuspensionForm.id}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}