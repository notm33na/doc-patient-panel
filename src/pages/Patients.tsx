import { useState, useEffect } from "react";
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
  Calendar,
  User,
  FileText,
  Loader2,
  AlertCircle,
  Trash2
} from "lucide-react";
import { fetchPatients, searchPatients, fetchPatientsByStatus, deletePatient, updatePatient, Patient } from "@/services/patientService";

// Helper function to get patient display name
const getPatientName = (patient: Patient) => {
  return `${patient.firstName} ${patient.lastName}`.trim();
};

// Helper function to get primary condition
const getPrimaryCondition = (patient: Patient) => {
  // Since medical data is now in Patient Medical Record collection,
  // we'll use a default value or derive from other available fields
  return "General Checkup";
};

// Helper function to check if patient is already anonymized
const isAnonymized = (patient: Patient) => {
  return patient.firstName === "Anonymous" && patient.lastName === "Patient";
};

// Helper function to format date
const formatDate = (dateString?: string) => {
  if (!dateString) return "N/A";
  try {
    return new Date(dateString).toLocaleDateString();
  } catch {
    return "N/A";
  }
};

const getStatusColor = (status: string | boolean) => {
  const statusStr = String(status);
  switch (statusStr) {
    case "true":
      return "bg-success/10 text-success border-success/20";
    case "false":
      return "bg-destructive/10 text-destructive border-destructive/20";
    default:
      return "bg-muted/10 text-muted-foreground border-muted/20";
  }
};

const getStatusText = (status: string | boolean) => {
  const statusStr = String(status);
  switch (statusStr) {
    case "true":
      return "Active";
    case "false":
      return "Inactive";
    default:
      return "Unknown";
  }
};

export default function Patients() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [patients, setPatients] = useState<Patient[]>([]);
  const [filteredPatients, setFilteredPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  // Filter States
  const [filterOpen, setFilterOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterGender, setFilterGender] = useState<string>("all");
  const [filterAgeRange, setFilterAgeRange] = useState<string>("all");
  const [filterCity, setFilterCity] = useState<string>("all");

  // Fetch patients on component mount
  useEffect(() => {
    loadPatients();
  }, []);

  // Apply filters when they change
  useEffect(() => {
    try {
      console.log("Applying filters:", { patients: patients.length, searchTerm, filterStatus, filterGender, filterAgeRange, filterCity });
      
      let filtered = patients;

      // Apply search filter
      if (searchTerm) {
        filtered = filtered.filter((patient) =>
          getPatientName(patient).toLowerCase().includes(searchTerm.toLowerCase()) ||
          getPrimaryCondition(patient).toLowerCase().includes(searchTerm.toLowerCase()) ||
          patient.emailAddress.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      // Apply status filter
      if (filterStatus !== "all") {
        filtered = filtered.filter((patient) => patient.isActive === filterStatus);
      }

      // Apply gender filter
      if (filterGender !== "all") {
        filtered = filtered.filter((patient) => patient.gender === filterGender);
      }

      // Apply age range filter
      if (filterAgeRange !== "all") {
        filtered = filtered.filter((patient) => {
          const age = parseInt(patient.Age);
          if (isNaN(age)) return false; // Skip patients with invalid age
          
          switch (filterAgeRange) {
            case "0-18":
              return age >= 0 && age <= 18;
            case "19-35":
              return age >= 19 && age <= 35;
            case "36-50":
              return age >= 36 && age <= 50;
            case "51-65":
              return age >= 51 && age <= 65;
            case "65+":
              return age > 65;
            default:
              return true;
          }
        });
      }

      // Apply city filter
      if (filterCity !== "all") {
        filtered = filtered.filter((patient) => 
          patient.address?.city?.toLowerCase() === filterCity.toLowerCase()
        );
      }

      console.log("Filtered patients:", filtered.length);
      setFilteredPatients(filtered);
    } catch (error) {
      console.error("Error applying filters:", error);
      setFilteredPatients(patients); // Fallback to all patients
    }
  }, [patients, searchTerm, filterStatus, filterGender, filterAgeRange, filterCity]);

  const loadPatients = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchPatients();
      setPatients(data);
      setFilteredPatients(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load patients');
      console.error('Error loading patients:', err);
    } finally {
      setLoading(false);
    }
  };

  // Handle search
  const handleSearch = async (query: string) => {
    try {
      if (query.trim()) {
        const data = await searchPatients(query);
        setFilteredPatients(data);
      } else {
        setFilteredPatients(patients);
      }
    } catch (err) {
      console.error("Error searching patients:", err);
      setFilteredPatients(patients);
    }
  };

  // Get unique cities for filter dropdown
  const getUniqueCities = () => {
    const cities = patients
      .map(patient => patient.address?.city)
      .filter(city => city && city.trim() !== "")
      .filter((city, index, arr) => arr.indexOf(city) === index)
      .sort();
    return cities;
  };

  const handleDeletePatient = async (patientId: string) => {
    try {
      setDeleting(patientId);
      setError(null);
      await deletePatient(patientId);
      // Refresh the patients list
      await loadPatients();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete patient');
      console.error('Error deleting patient:', err);
    } finally {
      setDeleting(null);
    }
  };

  const handleAnonymizePatient = async (patient: Patient) => {
    try {
      setDeleting(patient._id);
      setError(null);
      
      // Anonymize personal data but keep medical info
      const anonymizedData = {
        firstName: "Anonymous",
        lastName: "Patient",
        emailAddress: `anonymous_${patient._id}@example.com`,
        phone: "000-000-0000",
        isActive: false, // Make anonymized patients permanently inactive
        // Keep medical data: gender, Age, weight, height, medications, allergies, chronicConditions, vaccinations, notes
      } as Partial<Patient>;

      // Add password if needed
      if (patient.password) {
        anonymizedData.password = "anonymous_password";
      }

      console.log("Anonymizing patient with data:", anonymizedData);
      const updatedPatient = await updatePatient(patient._id, anonymizedData);
      console.log("Updated patient:", updatedPatient);
      
      // Refresh the patients list
      await loadPatients();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to anonymize patient');
      console.error('Error anonymizing patient:', err);
    } finally {
      setDeleting(null);
    }
  };


  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Patients Management</h1>
          <p className="text-muted-foreground">Manage patient profiles and medical records</p>
        </div>
        <Button variant="gradient" onClick={() => navigate("/add-patient")}>
          <User className="h-4 w-4" />
          Add New Patient
        </Button>
      </div>

      {/* Search + Filter */}
      <Card className="shadow-soft">
        <CardContent className="p-6">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search patients by name, condition, or email..."
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

      {/* Filter Summary */}
      {(filterStatus !== "all" || filterGender !== "all" || filterAgeRange !== "all" || filterCity !== "all") && (
        <Card className="shadow-soft">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm text-muted-foreground">Active filters:</span>
              {filterStatus !== "all" && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Status: {filterStatus === "true" ? "Active" : "Inactive"}
                  <span 
                    className="h-3 w-3 cursor-pointer text-xs" 
                    onClick={() => setFilterStatus("all")}
                  >
                    ×
                  </span>
                </Badge>
              )}
              {filterGender !== "all" && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Gender: {filterGender}
                  <span 
                    className="h-3 w-3 cursor-pointer text-xs" 
                    onClick={() => setFilterGender("all")}
                  >
                    ×
                  </span>
                </Badge>
              )}
              {filterAgeRange !== "all" && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Age: {filterAgeRange}
                  <span 
                    className="h-3 w-3 cursor-pointer text-xs" 
                    onClick={() => setFilterAgeRange("all")}
                  >
                    ×
                  </span>
                </Badge>
              )}
              {filterCity !== "all" && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  City: {filterCity}
                  <span 
                    className="h-3 w-3 cursor-pointer text-xs" 
                    onClick={() => setFilterCity("all")}
                  >
                    ×
                  </span>
                </Badge>
              )}
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => {
                  setFilterStatus("all");
                  setFilterGender("all");
                  setFilterAgeRange("all");
                  setFilterCity("all");
                }}
                className="text-xs"
              >
                Clear all
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Results Count */}
      {!loading && !error && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {filteredPatients.length} of {patients.length} patients
            {searchTerm && ` matching "${searchTerm}"`}
          </p>
          {(filterStatus !== "all" || filterGender !== "all" || filterAgeRange !== "all" || filterCity !== "all") && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                setFilterStatus("all");
                setFilterGender("all");
                setFilterAgeRange("all");
                setFilterCity("all");
              }}
            >
              Clear Filters
            </Button>
          )}
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <Card className="shadow-soft">
          <CardContent className="p-12 text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
            <p className="text-muted-foreground">Loading patients...</p>
          </CardContent>
        </Card>
      )}

      {/* Error State */}
      {error && (
        <Card className="shadow-soft border-destructive/20">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 text-destructive">
              <AlertCircle className="h-5 w-5" />
              <div>
                <p className="font-medium">Error loading patients</p>
                <p className="text-sm text-muted-foreground">{error}</p>
              </div>
            </div>
            <Button 
              variant="outline" 
              className="mt-4" 
              onClick={loadPatients}
            >
              Try Again
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Patients Grid */}
      {!loading && !error && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredPatients.length === 0 ? (
            <Card className="col-span-full shadow-soft">
              <CardContent className="p-12 text-center">
                <User className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">No patients found</h3>
                <p className="text-muted-foreground mb-4">
                  {searchTerm ? "No patients match your search criteria." : "No patients have been added yet."}
                </p>
                {!searchTerm && (
                  <Button variant="gradient" onClick={() => navigate("/add-patient")}>
                    <User className="h-4 w-4" />
                    Add First Patient
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            filteredPatients.map((patient) => {
              console.log(`Patient ${patient.firstName} ${patient.lastName} - isActive: ${patient.isActive}`);
              return (
              <Card key={patient._id} className="shadow-soft hover:shadow-medium transition-smooth">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={patient.profileImage || ""} />
                          <AvatarFallback className="bg-gradient-secondary">
                            <User className="h-6 w-6" />
                          </AvatarFallback>
                        </Avatar>
                        <div className={`absolute -bottom-1 -right-1 h-4 w-4 rounded-full ${getStatusColor(patient.isActive)}`}>
                          <div className="h-2 w-2 rounded-full bg-current mx-auto mt-1" />
                        </div>
                      </div>
                      <div>
                        <h3 className="font-semibold">{getPatientName(patient)}</h3>
                        <p className="text-sm text-muted-foreground">Age: {patient.Age}</p>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Email:</span>
                      <span className="font-medium text-right max-w-[60%] truncate" title={patient.emailAddress}>
                        {patient.emailAddress}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Phone:</span>
                      <span className="font-medium">{patient.phone}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Gender:</span>
                      <span className="font-medium">{patient.gender}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Last Visit:</span>
                      <span className="font-medium">{formatDate(patient.lastVisit)}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-foreground">{getPrimaryCondition(patient)}</span>
                    <div className="flex gap-2">
                      {isAnonymized(patient) && (
                        <Badge className="bg-orange-100 text-orange-800 border-orange-200">
                          Anonymized
                        </Badge>
                      )}
                      <Badge className={getStatusColor(patient.isActive)}>
                        {getStatusText(patient.isActive)}
                      </Badge>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1" onClick={() => navigate(`/edit-patient/${patient._id}`)}>
                      <Edit className="h-3 w-3" />
                      Edit
                    </Button>
                    
                    {/* Delete Options */}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm" disabled={deleting === patient._id}>
                          {deleting === patient._id ? (
                            <Loader2 className="h-3 w-3 animate-spin" />
                          ) : (
                            <MoreVertical className="h-3 w-3" />
                          )}
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {!isAnonymized(patient) && (
                          <DropdownMenuItem 
                            onClick={() => {
                              const trigger = document.getElementById(`anonymize-trigger-${patient._id}`);
                              if (trigger) trigger.click();
                            }}
                            disabled={deleting === patient._id}
                            className="text-orange-600"
                          >
                            <UserX className="h-4 w-4 mr-2" />
                            Anonymize
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem 
                          onClick={() => {
                            const trigger = document.getElementById(`delete-trigger-${patient._id}`);
                            if (trigger) trigger.click();
                          }}
                          disabled={deleting === patient._id}
                          className="text-red-600"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardContent>
              </Card>
              );
            })
          )}
        </div>
      )}

      {/* Filter Dialog */}
      <Dialog open={filterOpen} onOpenChange={setFilterOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Filter Patients</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Status</Label>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="true">Active</SelectItem>
                  <SelectItem value="false">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label>Gender</Label>
              <Select value={filterGender} onValueChange={setFilterGender}>
                <SelectTrigger>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="Male">Male</SelectItem>
                  <SelectItem value="Female">Female</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Age Range</Label>
              <Select value={filterAgeRange} onValueChange={setFilterAgeRange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select age range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="0-18">0-18 years</SelectItem>
                  <SelectItem value="19-35">19-35 years</SelectItem>
                  <SelectItem value="36-50">36-50 years</SelectItem>
                  <SelectItem value="51-65">51-65 years</SelectItem>
                  <SelectItem value="65+">65+ years</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>City</Label>
              <Select value={filterCity} onValueChange={setFilterCity}>
                <SelectTrigger>
                  <SelectValue placeholder="Select city" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Cities</SelectItem>
                  {getUniqueCities().map((city) => (
                    <SelectItem key={city} value={city}>
                      {city}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setFilterStatus("all");
              setFilterGender("all");
              setFilterAgeRange("all");
              setFilterCity("all");
            }}>Reset</Button>
            <Button onClick={() => setFilterOpen(false)}>Apply</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialogs */}
      {patients.map((patient) => (
        <div key={`delete-${patient._id}`}>
          {/* Anonymize Confirmation - Only for non-anonymized patients */}
          {!isAnonymized(patient) && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <div style={{ display: 'none' }} id={`anonymize-trigger-${patient._id}`} />
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Anonymize Patient Data</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will remove personal information (name, email, phone) but keep medical data (age, gender, weight, medical history, conditions, medications, allergies, vaccinations).
                    <br /><br />
                    The patient will become "Anonymous Patient" with a generic email and phone number, and will be marked as permanently inactive.
                    <br /><br />
                    <strong>This action cannot be undone.</strong>
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction 
                    onClick={() => handleAnonymizePatient(patient)}
                    className="bg-orange-600 hover:bg-orange-700"
                    disabled={deleting === patient._id}
                  >
                    {deleting === patient._id ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        Anonymizing...
                      </>
                    ) : (
                      "Anonymize Patient"
                    )}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}

          {/* Delete Confirmation */}
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <div style={{ display: 'none' }} id={`delete-trigger-${patient._id}`} />
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Patient</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete all patient data including medical records, appointments, and personal information.
                  <br /><br />
                  <strong>This action cannot be undone.</strong>
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction 
                  onClick={() => handleDeletePatient(patient._id)}
                  className="bg-red-600 hover:bg-red-700"
                  disabled={deleting === patient._id}
                >
                  {deleting === patient._id ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Deleting...
                    </>
                  ) : (
                    "Delete Patient"
                  )}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      ))}
    </div>
  );
}
