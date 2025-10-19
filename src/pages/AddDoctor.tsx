import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  Upload, 
  X, 
  FileImage, 
  Eye, 
  Loader2,
  CheckCircle,
  AlertCircle
} from "lucide-react";

export default function AddDoctor() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    // Basic Information
    DoctorName: "",
    email: "",
    password: "",
    phone: "",
    
    // Professional Information
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
    experience: "",
    bio: "",
    
    // Professional Details
    qualifications: [""],
    languages: [""],
    consultationFee: "",
    
    // Status
    status: "approved",
    
    // Availability (simplified for now)
    workingHours: {
      monday: { start: "09:00", end: "17:00" },
      tuesday: { start: "09:00", end: "17:00" },
      wednesday: { start: "09:00", end: "17:00" },
      thursday: { start: "09:00", end: "17:00" },
      friday: { start: "09:00", end: "17:00" },
      saturday: { start: "09:00", end: "13:00" },
      sunday: { start: "", end: "" }
    },
    
    // Additional fields for compatibility
    verified: true,
    sentiment: "positive",
    sentiment_score: 0.8,
    no_of_patients: 0,
    
    // Additional Information
    bio: "",
    
    // Address
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "USA"
  });

  // Document upload states
  const [documents, setDocuments] = useState<File[]>([]);
  const [isProcessingDocs, setIsProcessingDocs] = useState(false);
  const [docResults, setDocResults] = useState<{fileName: string, docType: string, status: 'processing' | 'success' | 'error'}[]>([]);
  const [dragActive, setDragActive] = useState(false);

  const handleChange = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleWorkingHoursChange = (day: string, field: 'start' | 'end', value: string) => {
    setForm(prev => ({
      ...prev,
      workingHours: {
        ...prev.workingHours,
        [day]: {
          ...prev.workingHours[day as keyof typeof prev.workingHours],
          [field]: value
        }
      }
    }));
  };

  // Document upload handlers
  const handleDocumentUpload = (files: FileList | null) => {
    if (!files) return;
    
    const docFiles = Array.from(files).filter(file => 
      file.type === 'application/pdf' || 
      file.type.startsWith('image/') && 
      ['image/jpeg', 'image/png', 'image/jpg'].includes(file.type)
    );
    
    setDocuments(prev => [...prev, ...docFiles]);
    
    // Process documents
    processDocuments(docFiles);
  };

  const processDocuments = async (files: File[]) => {
    setIsProcessingDocs(true);
    
    for (const file of files) {
      // Determine document type based on filename or content
      const docType = determineDocumentType(file.name);
      
      setDocResults(prev => [...prev, {
        fileName: file.name,
        docType,
        status: 'processing' as const
      }]);

      try {
        // Simulate document processing
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        setDocResults(prev => 
          prev.map(result => 
            result.fileName === file.name 
              ? { ...result, status: 'success' as const }
              : result
          )
        );
      } catch (error) {
        setDocResults(prev => 
          prev.map(result => 
            result.fileName === file.name 
              ? { ...result, status: 'error' as const }
              : result
          )
        );
      }
    }
    
    setIsProcessingDocs(false);
  };

  const determineDocumentType = (fileName: string): string => {
    const name = fileName.toLowerCase();
    if (name.includes('license')) return 'license';
    if (name.includes('certificate') || name.includes('cert')) return 'certificate';
    if (name.includes('degree') || name.includes('diploma')) return 'degree';
    return 'other';
  };

  const removeDocument = (index: number) => {
    const fileName = documents[index].name;
    setDocuments(prev => prev.filter((_, i) => i !== index));
    setDocResults(prev => prev.filter(result => result.fileName !== fileName));
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleDocumentUpload(e.dataTransfer.files);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setSaving(true);
      
      // Prepare doctor data according to the new schema
      const doctorData = {
        // Basic Information
        DoctorName: form.DoctorName,
        email: form.email,
        password: form.password,
        phone: form.phone,
        
        // Professional Information
        specialization: form.specialization,
        department: form.department,
        about: form.about,
        medicalDegree: form.medicalDegree,
        residency: form.residency,
        fellowship: form.fellowship,
        boardCertification: form.boardCertification,
        licenses: form.licenses,
        deaRegistration: form.deaRegistration,
        hospitalAffiliations: form.hospitalAffiliations,
        memberships: form.memberships,
        malpracticeInsurance: form.malpracticeInsurance,
        address: form.address,
        education: form.education,
        experience: form.experience,
        bio: form.bio,
        
        // Professional Details
        qualifications: form.qualifications.filter(q => q.trim()),
        languages: form.languages.filter(l => l.trim()),
        consultationFee: parseFloat(form.consultationFee) || 0,
        
        // Status
        status: form.status,
        
        // Additional fields for compatibility
        verified: form.verified,
        sentiment: form.sentiment,
        sentiment_score: form.sentiment_score,
        no_of_patients: form.no_of_patients,
        
        // Availability
        workingHours: form.workingHours,
      
      // Documents
      documents: documents.map((file, index) => {
        const docResult = docResults.find(result => result.fileName === file.name);
        return {
          type: docResult?.docType || 'other',
          fileName: file.name,
          filePath: `uploads/doctors/${file.name}`, // This would be set by the backend
          uploadedAt: new Date(),
          verified: false
        };
      })
    };
    
      console.log("New doctor data:", doctorData);
      console.log("Documents:", documents);
      console.log("Document results:", docResults);
      
      // Import the createDoctor function
      const { createDoctor } = await import('@/services/doctorService');
      
      // Create the doctor
      const newDoctor = await createDoctor(doctorData);
      console.log('Doctor created successfully:', newDoctor);
      
      navigate("/doctors"); // go back to list after save
      
    } catch (error) {
      console.error('Error creating doctor:', error);
      setError(error instanceof Error ? error.message : 'Failed to create doctor');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <Card className="shadow-soft">
        <CardContent className="p-6">
          <h1 className="text-2xl font-bold mb-4">Add New Doctor</h1>
          <form className="space-y-6" onSubmit={handleSubmit}>
            
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">Basic Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Full Name *</Label>
                  <Input 
                    value={form.name} 
                    onChange={(e) => handleChange("name", e.target.value)} 
                    required 
                    placeholder="Enter full name"
                  />
                </div>
                <div>
                  <Label>Email Address *</Label>
                  <Input 
                    type="email" 
                    value={form.email} 
                    onChange={(e) => handleChange("email", e.target.value)} 
                    required 
                    placeholder="Enter email address"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Phone Number *</Label>
                  <Input 
                    value={form.phone} 
                    onChange={(e) => handleChange("phone", e.target.value)} 
                    required 
                    placeholder="Enter phone number"
                  />
                </div>
                <div>
                  <Label>License Number *</Label>
                  <Input 
                    value={form.licenseNumber} 
                    onChange={(e) => handleChange("licenseNumber", e.target.value)} 
                    required 
                    placeholder="Enter medical license number"
                  />
                </div>
              </div>
            </div>

            {/* Professional Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">Professional Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Specialty *</Label>
                  <Select value={form.specialty} onValueChange={(value) => handleChange("specialty", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select specialty" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Cardiology">Cardiology</SelectItem>
                      <SelectItem value="Dermatology">Dermatology</SelectItem>
                      <SelectItem value="Endocrinology">Endocrinology</SelectItem>
                      <SelectItem value="Gastroenterology">Gastroenterology</SelectItem>
                      <SelectItem value="General Practice">General Practice</SelectItem>
                      <SelectItem value="Neurology">Neurology</SelectItem>
                      <SelectItem value="Oncology">Oncology</SelectItem>
                      <SelectItem value="Pediatrics">Pediatrics</SelectItem>
                      <SelectItem value="Psychiatry">Psychiatry</SelectItem>
                      <SelectItem value="Radiology">Radiology</SelectItem>
                      <SelectItem value="Surgery">Surgery</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Department *</Label>
                  <Input 
                    value={form.department} 
                    onChange={(e) => handleChange("department", e.target.value)} 
                    required 
                    placeholder="Enter department"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Experience</Label>
                  <Input 
                    value={form.experience} 
                    onChange={(e) => handleChange("experience", e.target.value)} 
                    placeholder="e.g. 8 years"
                  />
                </div>
                <div>
                  <Label>Education</Label>
                  <Input 
                    value={form.education} 
                    onChange={(e) => handleChange("education", e.target.value)} 
                    placeholder="e.g. MD, PhD"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Qualifications</Label>
                  <Input 
                    value={form.qualifications} 
                    onChange={(e) => handleChange("qualifications", e.target.value)} 
                    placeholder="Comma-separated qualifications"
                  />
                </div>
                <div>
                  <Label>Languages</Label>
                  <Input 
                    value={form.languages} 
                    onChange={(e) => handleChange("languages", e.target.value)} 
                    placeholder="Comma-separated languages"
                  />
                </div>
              </div>
              <div>
                <Label>Consultation Fee</Label>
                <Input 
                  type="number" 
                  value={form.consultationFee} 
                  onChange={(e) => handleChange("consultationFee", e.target.value)} 
                  placeholder="Enter consultation fee"
                  min="0"
                  step="0.01"
                />
              </div>
            </div>

            {/* Working Hours */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">Working Hours</h3>
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(form.workingHours).map(([day, hours]) => (
                  <div key={day} className="space-y-2">
                    <Label className="capitalize">{day}</Label>
                    <div className="flex gap-2">
                      <Input
                        type="time"
                        value={hours.start}
                        onChange={(e) => handleWorkingHoursChange(day, 'start', e.target.value)}
                        placeholder="Start time"
                      />
                      <Input
                        type="time"
                        value={hours.end}
                        onChange={(e) => handleWorkingHoursChange(day, 'end', e.target.value)}
                        placeholder="End time"
                        disabled={!hours.start}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Address Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">Address Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Street Address</Label>
                  <Input 
                    value={form.street} 
                    onChange={(e) => handleChange("street", e.target.value)} 
                    placeholder="Enter street address"
                  />
                </div>
                <div>
                  <Label>City</Label>
                  <Input 
                    value={form.city} 
                    onChange={(e) => handleChange("city", e.target.value)} 
                    placeholder="Enter city"
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label>State</Label>
                  <Input 
                    value={form.state} 
                    onChange={(e) => handleChange("state", e.target.value)} 
                    placeholder="Enter state"
                  />
                </div>
                <div>
                  <Label>ZIP Code</Label>
                  <Input 
                    value={form.zipCode} 
                    onChange={(e) => handleChange("zipCode", e.target.value)} 
                    placeholder="Enter ZIP code"
                  />
                </div>
                <div>
                  <Label>Country</Label>
                  <Input 
                    value={form.country} 
                    onChange={(e) => handleChange("country", e.target.value)} 
                    placeholder="Enter country"
                  />
                </div>
              </div>
            </div>

            {/* Status and Priority */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">Status & Priority</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Status</Label>
                  <Select value={form.status} onValueChange={(value) => handleChange("status", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Inactive">Inactive</SelectItem>
                      <SelectItem value="On Leave">On Leave</SelectItem>
                      <SelectItem value="Suspended">Suspended</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Priority</Label>
                  <Select value={form.priority} onValueChange={(value) => handleChange("priority", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="High">High</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="Low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Bio */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">Professional Bio</h3>
              <div>
                <Label>Bio</Label>
                <Textarea 
                  value={form.bio} 
                  onChange={(e) => handleChange("bio", e.target.value)} 
                  placeholder="Enter professional bio and background"
                  rows={4}
                />
              </div>
            </div>

            {/* Document Upload Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">Professional Documents</h3>
              <p className="text-sm text-muted-foreground">
                Upload professional documents like medical license, certificates, degrees, etc.
              </p>
              
              {/* Drag & Drop Upload Area */}
              <div
                className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                  dragActive 
                    ? 'border-primary bg-primary/5' 
                    : 'border-muted-foreground/25 hover:border-primary/50'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <FileImage className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-sm text-muted-foreground mb-2">
                  Drag & drop documents here, or click to browse
                </p>
                <Input
                  type="file"
                  accept=".pdf,image/*"
                  multiple
                  onChange={(e) => handleDocumentUpload(e.target.files)}
                  className="hidden"
                  id="document-upload"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => document.getElementById('document-upload')?.click()}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Choose Documents
                </Button>
                <p className="text-xs text-muted-foreground mt-2">
                  Supports: PDF, JPG, PNG (Max 10MB each)
                </p>
              </div>

              {/* Uploaded Documents Preview */}
              {documents.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-sm font-medium">Uploaded Documents ({documents.length})</h4>
                  <div className="grid gap-3">
                    {documents.map((file, index) => {
                      const docResult = docResults.find(result => result.fileName === file.name);
                      return (
                        <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                          <div className="flex-shrink-0">
                            <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                              <FileImage className="h-6 w-6 text-muted-foreground" />
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{file.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {(file.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                            {docResult && (
                              <div className="flex items-center gap-2 mt-1">
                                <Badge variant="outline" className="text-xs">
                                  {docResult.docType}
                                </Badge>
                                {docResult.status === 'processing' && (
                                  <>
                                    <Loader2 className="h-3 w-3 animate-spin text-blue-500" />
                                    <span className="text-xs text-blue-600">Processing...</span>
                                  </>
                                )}
                                {docResult.status === 'success' && (
                                  <>
                                    <CheckCircle className="h-3 w-3 text-green-500" />
                                    <span className="text-xs text-green-600">Ready</span>
                                  </>
                                )}
                                {docResult.status === 'error' && (
                                  <>
                                    <AlertCircle className="h-3 w-3 text-red-500" />
                                    <span className="text-xs text-red-600">Error</span>
                                  </>
                                )}
                              </div>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => removeDocument(index)}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Document Processing Status */}
              {isProcessingDocs && (
                <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
                  <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
                  <span className="text-sm text-blue-700">
                    Processing documents...
                  </span>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" type="button" onClick={() => navigate("/doctors")}>
                Cancel
              </Button>
              <Button type="submit">Save Doctor</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
