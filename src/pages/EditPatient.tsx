import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
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
import { Loader2, AlertCircle, Trash2, UserX, Save } from "lucide-react";
import { fetchPatient, updatePatient, deletePatient, Patient } from "@/services/patientService";

// Helper function to check if patient is already anonymized
const isAnonymized = (patient: Patient) => {
  return patient.firstName === "Anonymous" && patient.lastName === "Patient";
};

export default function EditPatient() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [patient, setPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    emailAddress: "",
    phone: "",
    password: "",
  });

  // Fetch patient data on component mount
  useEffect(() => {
    if (id) {
      loadPatient();
    }
  }, [id]);

  const loadPatient = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchPatient(id!);
      setPatient(data);
      setForm({
        firstName: data.firstName || "",
        lastName: data.lastName || "",
        emailAddress: data.emailAddress || "",
        phone: data.phone || "",
        password: "", // Don't pre-fill password for security
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load patient');
      console.error('Error loading patient:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    if (!patient) return;

    try {
      setSaving(true);
      setError(null);
      setSuccess(null);

      // Only include password if it's provided
      const updateData: Partial<Patient> = {
        firstName: form.firstName,
        lastName: form.lastName,
        emailAddress: form.emailAddress,
        phone: form.phone,
      };

      if (form.password.trim()) {
        updateData.password = form.password;
      }

      await updatePatient(patient._id, updateData);
      setSuccess("Patient updated successfully!");
      
      // Refresh patient data
      await loadPatient();
      
      // Clear password field
      setForm(prev => ({ ...prev, password: "" }));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update patient');
      console.error('Error updating patient:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleDeletePatient = async () => {
    if (!patient) return;

    try {
      setSaving(true);
      setError(null);
      await deletePatient(patient._id);
      navigate('/patients');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete patient');
      console.error('Error deleting patient:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleAnonymizePatient = async () => {
    if (!patient) return;

    try {
      setSaving(true);
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

      console.log("Anonymizing patient with data:", anonymizedData);
      const updatedPatient = await updatePatient(patient._id, anonymizedData);
      console.log("Updated patient:", updatedPatient);
      
      setSuccess("Patient data anonymized successfully!");
      
      // Refresh patient data
      await loadPatient();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to anonymize patient');
      console.error('Error anonymizing patient:', err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
        <div className="flex items-center justify-center p-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2">Loading patient data...</span>
        </div>
      </div>
    );
  }

  if (error && !patient) {
    return (
      <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <Button onClick={() => navigate('/patients')}>Back to Patients</Button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
      <h1 className="text-3xl font-bold">Edit Patient</h1>
        <Button variant="outline" onClick={() => navigate('/patients')}>
          Back to Patients
        </Button>
      </div>

      {/* Success/Error Messages */}
      {success && (
        <Alert className="border-green-200 bg-green-50">
          <AlertCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">{success}</AlertDescription>
        </Alert>
      )}

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Patient Information
            {patient && isAnonymized(patient) && (
              <Badge className="bg-orange-100 text-orange-800 border-orange-200">
                Anonymized
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName">First Name</Label>
              <Input 
                id="firstName"
                value={form.firstName} 
                onChange={(e) => handleChange("firstName", e.target.value)}
                placeholder="Enter first name"
              />
            </div>
          <div>
              <Label htmlFor="lastName">Last Name</Label>
              <Input 
                id="lastName"
                value={form.lastName} 
                onChange={(e) => handleChange("lastName", e.target.value)}
                placeholder="Enter last name"
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="emailAddress">Email Address</Label>
            <Input 
              id="emailAddress"
              type="email"
              value={form.emailAddress} 
              onChange={(e) => handleChange("emailAddress", e.target.value)}
              placeholder="Enter email address"
            />
          </div>
          
          <div>
            <Label htmlFor="phone">Phone Number</Label>
            <Input 
              id="phone"
              value={form.phone} 
              onChange={(e) => handleChange("phone", e.target.value)}
              placeholder="Enter phone number"
            />
          </div>
          
          <div>
            <Label htmlFor="password">New Password (optional)</Label>
            <Input 
              id="password"
              type="password"
              value={form.password} 
              onChange={(e) => handleChange("password", e.target.value)}
              placeholder="Enter new password (leave blank to keep current)"
            />
            <p className="text-sm text-muted-foreground mt-1">
              Leave blank to keep the current password
            </p>
          </div>

          <div className="flex gap-2 justify-end pt-4">
            <Button 
              variant="outline" 
              onClick={() => navigate('/patients')}
              disabled={saving}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Delete Patient Section */}
      <Card className="border-red-200">
        <CardHeader>
          <CardTitle className="text-red-600">Danger Zone</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            {/* Anonymize Patient - Only show if not already anonymized */}
            {patient && !isAnonymized(patient) && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" className="border-orange-200 text-orange-600 hover:bg-orange-50">
                    <UserX className="h-4 w-4 mr-2" />
                    Anonymize Patient
                  </Button>
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
                      onClick={handleAnonymizePatient}
                      className="bg-orange-600 hover:bg-orange-700"
                      disabled={saving}
                    >
                      {saving ? (
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

            {/* Delete Patient */}
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Patient
                </Button>
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
                    onClick={handleDeletePatient}
                    className="bg-red-600 hover:bg-red-700"
                    disabled={saving}
                  >
                    {saving ? (
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
        </CardContent>
      </Card>
    </div>
  );
}
