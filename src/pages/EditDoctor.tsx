import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { SuspensionForm } from "@/components/SuspensionForm";
import { SuspensionData } from "@/services/doctorService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
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
import { Loader2, AlertCircle, Trash2, Save, UserCheck, UserX, Plus, X } from "lucide-react";
import { fetchDoctor, updateDoctor, updateDoctorStatus, updateDoctorSentiment, deleteDoctor, Doctor } from "@/services/doctorService";

export default function EditDoctor() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showSuspensionForm, setShowSuspensionForm] = useState(false);

  const [form, setForm] = useState({
    DoctorName: "",
    email: "",
    phone: "",
    specialization: [""], // Changed from string to array
    department: "",
    about: "",
    medicalDegree: [""], // Changed from string to array
    residency: [""], // Changed from string to array
    fellowship: [""], // Changed from string to array
    boardCertification: [""], // Changed from string to array
    licenses: [""], // Changed from string to array
    deaRegistration: "",
    hospitalAffiliations: [""], // Changed from string to array
    memberships: [""], // Changed from string to array
    malpracticeInsurance: "",
    address: "",
    education: "",
    bio: "",
    experience: "",
    consultationFee: "",
    status: "",
    sentiment: "",
    sentiment_score: "",
  });

  const loadDoctor = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchDoctor(id!);
      setDoctor(data);
      setForm({
        DoctorName: data.DoctorName || "",
        email: data.email || "",
        phone: data.phone || "",
        specialization: Array.isArray(data.specialization) ? data.specialization : (data.specialization ? [data.specialization] : [""]),
        department: data.department || "",
        about: data.about || "",
        medicalDegree: Array.isArray(data.medicalDegree) ? data.medicalDegree : (data.medicalDegree ? [data.medicalDegree] : [""]),
        residency: Array.isArray(data.residency) ? data.residency : (data.residency ? [data.residency] : [""]),
        fellowship: Array.isArray(data.fellowship) ? data.fellowship : (data.fellowship ? [data.fellowship] : [""]),
        boardCertification: Array.isArray(data.boardCertification) ? data.boardCertification : (data.boardCertification ? [data.boardCertification] : [""]),
        licenses: Array.isArray(data.licenses) ? data.licenses : (data.licenses ? [data.licenses] : [""]),
        deaRegistration: data.deaRegistration || "",
        hospitalAffiliations: Array.isArray(data.hospitalAffiliations) ? data.hospitalAffiliations : (data.hospitalAffiliations ? [data.hospitalAffiliations] : [""]),
        memberships: Array.isArray(data.memberships) ? data.memberships : (data.memberships ? [data.memberships] : [""]),
        malpracticeInsurance: data.malpracticeInsurance || "",
        address: data.address || "",
        education: data.education || "",
        bio: data.bio || "",
        experience: data.experience || "",
        consultationFee: data.consultationFee?.toString() || "",
        status: data.status || "",
        sentiment: data.sentiment || "",
        sentiment_score: data.sentiment_score?.toString() || "",
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load doctor');
      console.error('Error loading doctor:', err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  // Fetch doctor data on component mount
  useEffect(() => {
    if (id) {
      loadDoctor();
    }
  }, [id, loadDoctor]);

  const handleChange = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    
    // Auto-calculate sentiment based on sentiment_score
    if (key === 'sentiment_score') {
      const score = parseFloat(value);
      if (!isNaN(score)) {
        let autoSentiment: "positive" | "negative" | "neutral";
        if (score <= 0.3) {
          autoSentiment = "negative";
        } else if (score <= 0.6) {
          autoSentiment = "neutral";
        } else {
          autoSentiment = "positive";
        }
        
        setForm(prev => ({ 
          ...prev, 
          [key]: value,
          sentiment: autoSentiment 
        }));
      }
    }
    
    // Auto-calculate sentiment_score based on sentiment
    if (key === 'sentiment') {
      let autoScore: number;
      switch (value) {
        case 'negative':
          autoScore = 0.3; // Highest value for negative range
          break;
        case 'neutral':
          autoScore = 0.6; // Highest value for neutral range
          break;
        case 'positive':
          autoScore = 1.0; // Highest value for positive range
          break;
        default:
          autoScore = parseFloat(form.sentiment_score) || 0.5;
      }
      
      setForm(prev => ({ 
        ...prev, 
        [key]: value,
        sentiment_score: autoScore.toString()
      }));
    }
  };

  // Array handling functions
  const handleArrayChange = (field: string, index: number, value: string) => {
    setForm(prev => ({
      ...prev,
      [field]: prev[field as keyof typeof prev].map((item: any, i: number) => 
        i === index ? value : item
      )
    }));
  };

  const addArrayItem = (field: string) => {
    setForm(prev => ({
      ...prev,
      [field]: [...(prev[field as keyof typeof prev] as string[]), ""]
    }));
  };

  const removeArrayItem = (field: string, index: number) => {
    setForm(prev => ({
      ...prev,
      [field]: (prev[field as keyof typeof prev] as string[]).filter((_, i) => i !== index)
    }));
  };

  const handleSave = async () => {
    if (!doctor) return;

    try {
      setSaving(true);
      setError(null);
      setSuccess(null);

      // Update basic information
      const updateData = {
        DoctorName: form.DoctorName,
        email: form.email,
        phone: form.phone,
        specialization: form.specialization.filter(item => item.trim()),
        department: form.department,
        bio: form.bio,
        experience: form.experience,
        education: form.education,
        consultationFee: form.consultationFee ? parseFloat(form.consultationFee) : 0,
        status: form.status as "approved" | "pending" | "rejected" | "suspended",
        sentiment: form.sentiment as "positive" | "negative" | "neutral",
        sentiment_score: parseFloat(form.sentiment_score),
        about: form.about,
        medicalDegree: form.medicalDegree.filter(item => item.trim()),
        residency: form.residency.filter(item => item.trim()),
        fellowship: form.fellowship.filter(item => item.trim()),
        boardCertification: form.boardCertification.filter(item => item.trim()),
        licenses: form.licenses.filter(item => item.trim()),
        deaRegistration: form.deaRegistration,
        hospitalAffiliations: form.hospitalAffiliations.filter(item => item.trim()),
        memberships: form.memberships.filter(item => item.trim()),
        malpracticeInsurance: form.malpracticeInsurance,
        address: form.address,
      };

      console.log("Updating doctor with data:", updateData);
      console.log("Doctor ID:", doctor._id);

      await updateDoctor(doctor._id, updateData);
      setSuccess("Doctor updated successfully!");
      
      // Refresh doctor data
      await loadDoctor();
    } catch (err) {
      console.error("Error updating doctor:", err);
      setError(err instanceof Error ? err.message : 'Failed to update doctor');
    } finally {
      setSaving(false);
    }
  };

  // Handle doctor deletion notification
  const handleDoctorDeleted = (message: string) => {
    setSuccess(message);
    setShowSuspensionForm(false);
    // Navigate back to doctors list since doctor was deleted
    setTimeout(() => {
      navigate('/doctors');
    }, 2000);
  };

  const handleSuspendDoctor = async () => {
    if (!doctor) return;
    setShowSuspensionForm(true);
  };

  const handleSuspensionSubmit = async (suspensionData: SuspensionData) => {
    if (!doctor) return;

    try {
      setSaving(true);
      setError(null);
      
      const result = await updateDoctorStatus(doctor._id, "suspended", suspensionData);
      
      // Check if doctor was deleted due to 6th suspension
      if ('deleted' in result && result.deleted) {
        setSuccess(result.message);
        setShowSuspensionForm(false);
        // Navigate back to doctors list since doctor was deleted
        setTimeout(() => {
          navigate('/doctors');
        }, 2000);
        return;
      }
      
      setSuccess("Doctor suspended successfully!");
      setShowSuspensionForm(false);
      await loadDoctor();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to suspend doctor');
      console.error('Error suspending doctor:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleApproveDoctor = async () => {
    if (!doctor) return;

    try {
      setSaving(true);
      setError(null);
      await updateDoctorStatus(doctor._id, "approved");
      setSuccess("Doctor approved successfully!");
      await loadDoctor();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to approve doctor');
      console.error('Error approving doctor:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteDoctor = async () => {
    if (!doctor) return;

    try {
      setSaving(true);
      setError(null);
      await deleteDoctor(doctor._id);
      navigate('/doctors');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete doctor');
      console.error('Error deleting doctor:', err);
    } finally {
      setSaving(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800 border-green-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "rejected":
        return "bg-red-100 text-red-800 border-red-200";
      case "suspended":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case "positive":
        return "bg-green-100 text-green-800 border-green-200";
      case "neutral":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "negative":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
        <div className="flex items-center justify-center p-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2">Loading doctor data...</span>
        </div>
      </div>
    );
  }

  if (error && !doctor) {
    return (
      <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <Button onClick={() => navigate('/doctors')}>Back to Doctors</Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Edit Doctor</h1>
        <Button variant="outline" onClick={() => navigate('/doctors')}>
          Back to Doctors
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

      {/* Doctor Information Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Doctor Information
            {doctor && (
              <div className="flex gap-2">
                <Badge className={getStatusColor(doctor.status)}>
                  {doctor.status}
                </Badge>
                <Badge className={getSentimentColor(doctor.sentiment)}>
                  {doctor.sentiment} ({doctor.sentiment_score})
                </Badge>
              </div>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Basic Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="DoctorName">Doctor Name</Label>
                <Input 
                  id="DoctorName"
                  value={form.DoctorName} 
                  onChange={(e) => handleChange("DoctorName", e.target.value)}
                  placeholder="Enter doctor name"
                />
              </div>
              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input 
                  id="email"
                  type="email"
                  value={form.email} 
                  onChange={(e) => handleChange("email", e.target.value)}
                  placeholder="Enter email address"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
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
                <Label htmlFor="consultationFee">Consultation Fee</Label>
                <Input 
                  id="consultationFee"
                  type="number"
                  value={form.consultationFee} 
                  onChange={(e) => handleChange("consultationFee", e.target.value)}
                  placeholder="Enter consultation fee"
                />
              </div>
            </div>
          </div>

          {/* Professional Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Professional Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="specialization">Specialization (Optional)</Label>
                <div className="space-y-2">
                  {form.specialization.map((spec, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        value={spec}
                        onChange={(e) => handleArrayChange("specialization", index, e.target.value)}
                        placeholder="Enter specialization (optional)"
                        className="flex-1"
                      />
                      {form.specialization.length > 1 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeArrayItem("specialization", index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => addArrayItem("specialization")}
                    className="w-full"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Specialization
                  </Button>
                </div>
              </div>
              <div>
                <Label htmlFor="department">Department</Label>
                <Input 
                  id="department"
                  value={form.department} 
                  onChange={(e) => handleChange("department", e.target.value)}
                  placeholder="Enter department"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="experience">Experience</Label>
                <Input 
                  id="experience"
                  value={form.experience} 
                  onChange={(e) => handleChange("experience", e.target.value)}
                  placeholder="e.g., 10 years"
                />
              </div>
              <div>
                <Label htmlFor="education">Education</Label>
                <Input 
                  id="education"
                  value={form.education} 
                  onChange={(e) => handleChange("education", e.target.value)}
                  placeholder="e.g., MBBS, FCPS"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="bio">Bio</Label>
              <Input 
                id="bio"
                value={form.bio} 
                onChange={(e) => handleChange("bio", e.target.value)}
                placeholder="Enter doctor bio"
              />
            </div>
          </div>

          {/* Medical Credentials */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Medical Credentials</h3>
            
            {/* Medical Degrees */}
            <div>
              <Label>Medical Degrees</Label>
              <div className="space-y-2">
                {form.medicalDegree.map((degree, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={degree}
                      onChange={(e) => handleArrayChange("medicalDegree", index, e.target.value)}
                      placeholder="e.g., MBBS, FCPS"
                      className="flex-1"
                    />
                    {form.medicalDegree.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeArrayItem("medicalDegree", index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => addArrayItem("medicalDegree")}
                  className="w-full"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Medical Degree
                </Button>
              </div>
            </div>

            {/* Licenses */}
            <div>
              <Label>Licenses</Label>
              <div className="space-y-2">
                {form.licenses.map((license, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={license}
                      onChange={(e) => handleArrayChange("licenses", index, e.target.value)}
                      placeholder="e.g., PMC-12345"
                      className="flex-1"
                    />
                    {form.licenses.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeArrayItem("licenses", index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => addArrayItem("licenses")}
                  className="w-full"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add License
                </Button>
              </div>
            </div>

            {/* Residency */}
            <div>
              <Label>Residency Programs</Label>
              <div className="space-y-2">
                {form.residency.map((residency, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={residency}
                      onChange={(e) => handleArrayChange("residency", index, e.target.value)}
                      placeholder="e.g., Internal Medicine Residency"
                      className="flex-1"
                    />
                    {form.residency.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeArrayItem("residency", index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => addArrayItem("residency")}
                  className="w-full"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Residency
                </Button>
              </div>
            </div>

            {/* Fellowship */}
            <div>
              <Label>Fellowship Programs</Label>
              <div className="space-y-2">
                {form.fellowship.map((fellowship, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={fellowship}
                      onChange={(e) => handleArrayChange("fellowship", index, e.target.value)}
                      placeholder="e.g., Cardiology Fellowship"
                      className="flex-1"
                    />
                    {form.fellowship.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeArrayItem("fellowship", index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => addArrayItem("fellowship")}
                  className="w-full"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Fellowship
                </Button>
              </div>
            </div>

            {/* Board Certifications */}
            <div>
              <Label>Board Certifications</Label>
              <div className="space-y-2">
                {form.boardCertification.map((cert, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={cert}
                      onChange={(e) => handleArrayChange("boardCertification", index, e.target.value)}
                      placeholder="e.g., American Board of Internal Medicine"
                      className="flex-1"
                    />
                    {form.boardCertification.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeArrayItem("boardCertification", index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => addArrayItem("boardCertification")}
                  className="w-full"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Board Certification
                </Button>
              </div>
            </div>

            {/* Hospital Affiliations */}
            <div>
              <Label>Hospital Affiliations</Label>
              <div className="space-y-2">
                {form.hospitalAffiliations.map((affiliation, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={affiliation}
                      onChange={(e) => handleArrayChange("hospitalAffiliations", index, e.target.value)}
                      placeholder="e.g., Aga Khan Hospital"
                      className="flex-1"
                    />
                    {form.hospitalAffiliations.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeArrayItem("hospitalAffiliations", index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => addArrayItem("hospitalAffiliations")}
                  className="w-full"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Hospital Affiliation
                </Button>
              </div>
            </div>

            {/* Memberships */}
            <div>
              <Label>Professional Memberships</Label>
              <div className="space-y-2">
                {form.memberships.map((membership, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={membership}
                      onChange={(e) => handleArrayChange("memberships", index, e.target.value)}
                      placeholder="e.g., Pakistan Medical Association"
                      className="flex-1"
                    />
                    {form.memberships.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeArrayItem("memberships", index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => addArrayItem("memberships")}
                  className="w-full"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Membership
                </Button>
              </div>
            </div>
          </div>

          {/* Status and Sentiment */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Status & Sentiment</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="status">Status</Label>
                <Select value={form.status} onValueChange={(value) => handleChange("status", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                    <SelectItem value="suspended">Suspended</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="sentiment">Sentiment (Auto-calculated)</Label>
                <Select value={form.sentiment} onValueChange={(value) => handleChange("sentiment", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select sentiment" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="positive">Positive</SelectItem>
                    <SelectItem value="neutral">Neutral</SelectItem>
                    <SelectItem value="negative">Negative</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground mt-1">
                  This field automatically updates the sentiment score to the highest value in the selected range
                </p>
              </div>
            </div>
            
            <div>
              <Label htmlFor="sentiment_score">Sentiment Score (0-1)</Label>
              <Input 
                id="sentiment_score"
                type="number"
                min="0"
                max="1"
                step="0.1"
                value={form.sentiment_score} 
                onChange={(e) => handleChange("sentiment_score", e.target.value)}
                placeholder="Enter sentiment score"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Sentiment and score are automatically synchronized: ≤0.3 = negative (0.3), 0.3-0.6 = neutral (0.6), &gt;0.6 = positive (1.0)
              </p>
              {form.sentiment_score && !isNaN(parseFloat(form.sentiment_score)) && (
                <div className="mt-2">
                  <div className="text-xs text-muted-foreground">Current calculation:</div>
                  <div className={`text-sm font-medium ${
                    parseFloat(form.sentiment_score) <= 0.3 ? 'text-red-600' :
                    parseFloat(form.sentiment_score) <= 0.6 ? 'text-yellow-600' :
                    'text-green-600'
                  }`}>
                    Score {form.sentiment_score} → {form.sentiment}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-2 justify-end pt-4">
            <Button 
              variant="outline" 
              onClick={() => navigate('/doctors')}
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

      {/* Quick Actions Card */}
      <Card className="border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-600">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2 flex-wrap">
            {/* Approve Doctor */}
            {doctor && doctor.status !== "approved" && doctor.status !== "suspended" && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" className="border-green-200 text-green-600 hover:bg-green-50">
                    <UserCheck className="h-4 w-4 mr-2" />
                    Approve Doctor
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Approve Doctor</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will approve the doctor and allow them to start accepting patients.
                      <br /><br />
                      The doctor will be able to access the system and manage their profile.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction 
                      onClick={handleApproveDoctor}
                      className="bg-green-600 hover:bg-green-700"
                      disabled={saving}
                    >
                      {saving ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                          Approving...
                        </>
                      ) : (
                        "Approve Doctor"
                      )}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}

            {/* Conditional Suspend/Unsuspend */}
            {doctor && doctor.status === "suspended" ? (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" className="border-green-200 text-green-600 hover:bg-green-50">
                    <UserCheck className="h-4 w-4 mr-2" />
                    Unsuspend Doctor
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Unsuspend Doctor</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will restore the doctor's account and allow them to access the system and accept new patients.
                      <br /><br />
                      <strong>Are you sure you want to unsuspend this doctor?</strong>
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction 
                      onClick={handleApproveDoctor}
                      className="bg-green-600 hover:bg-green-700"
                      disabled={saving}
                    >
                      {saving ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                          Unsuspending...
                        </>
                      ) : (
                        "Unsuspend Doctor"
                      )}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            ) : doctor && doctor.status !== "suspended" ? (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" className="border-orange-200 text-orange-600 hover:bg-orange-50">
                    <UserX className="h-4 w-4 mr-2" />
                    Suspend Doctor
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Suspend Doctor</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will suspend the doctor's account, preventing them from accessing the system or accepting new patients.
                      <br /><br />
                      Existing appointments may need to be rescheduled.
                      <br /><br />
                      <strong>Are you sure you want to suspend this doctor?</strong>
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction 
                      onClick={handleSuspendDoctor}
                      className="bg-orange-600 hover:bg-orange-700"
                      disabled={saving}
                    >
                      {saving ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                          Suspending...
                        </>
                      ) : (
                        "Suspend Doctor"
                      )}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            ) : null}

            {/* Delete Doctor */}
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Doctor
                </Button>
              </AlertDialogTrigger>
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
                    onClick={handleDeleteDoctor}
                    className="bg-red-600 hover:bg-red-700"
                    disabled={saving}
                  >
                    {saving ? (
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
          </div>
        </CardContent>
      </Card>

      {/* Doctor Statistics Card */}
      {doctor && (
        <Card>
          <CardHeader>
            <CardTitle>Doctor Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{doctor.no_of_patients}</div>
                <div className="text-sm text-muted-foreground">Total Patients</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{doctor.sentiment_score.toFixed(2)}</div>
                <div className="text-sm text-muted-foreground">Sentiment Score</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{doctor.consultationFee || 0}</div>
                <div className="text-sm text-muted-foreground">Consultation Fee</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {new Date(doctor.createdAt).toLocaleDateString()}
                </div>
                <div className="text-sm text-muted-foreground">Joined Date</div>
              </div>
            </div>
        </CardContent>
      </Card>
      )}

      {/* Suspension Form Dialog */}
      <Dialog open={showSuspensionForm} onOpenChange={() => setShowSuspensionForm(false)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Suspend Doctor</DialogTitle>
          </DialogHeader>
          {doctor && (
            <SuspensionForm
              doctorId={doctor._id}
              doctorName={doctor.DoctorName}
              onSubmit={handleSuspensionSubmit}
              onCancel={() => setShowSuspensionForm(false)}
              onDoctorDeleted={handleDoctorDeleted}
              loading={saving}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
