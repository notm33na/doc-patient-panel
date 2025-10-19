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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { 
  Upload, 
  X, 
  FileImage, 
  Eye, 
  Loader2,
  CheckCircle,
  AlertCircle,
  Plus,
  EyeOff
} from "lucide-react";

export default function AddPatient() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordValidation, setPasswordValidation] = useState({
    length: false,
    hasNumber: false,
    hasSpecialChar: false,
    hasCapitalLetter: false,
    isValid: false
  });
  const [emailError, setEmailError] = useState<string | null>(null);
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [form, setForm] = useState({
    // Basic Information (matching MongoDB Atlas schema)
    firstName: "",
    lastName: "",
    emailAddress: "",
    phone: "",
    password: "",
    profileImage: "",
    gender: "",
    Age: "",
    
    // Address
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "Pakistan",
    
    // Status
    isActive: "true",
    
    
    // Arrays for medical information
    symptoms: [""],
    medications: [""],
    allergies: [""],
    chronicConditions: [""],
    vaccinations:[""],
    
    // Vitals
    
    weight: "",
    height: "",
    
    // Additional medical fields
    notes: "",
    
  });

  // Image upload states
  const [prescriptionImages, setPrescriptionImages] = useState<File[]>([]);
  const [isProcessingOCR, setIsProcessingOCR] = useState(false);
  const [ocrResults, setOcrResults] = useState<{fileName: string, extractedText: string, status: 'processing' | 'success' | 'error'}[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [selectedOcrResult, setSelectedOcrResult] = useState<{fileName: string, extractedText: string} | null>(null);

  const handleChange = (field: string, value: string | boolean) => {
    setForm(prev => ({ ...prev, [field]: value }));
    
    // Validate password if password field is being changed
    if (field === "password") {
      validatePassword(value as string);
    }
    
    // Clear email error when email changes
    if (field === "emailAddress") {
      setEmailError(null);
    }
    
    // Clear phone error when phone changes
    if (field === "phone") {
      setPhoneError(null);
    }
  };

  // Password validation function
  const validatePassword = (password: string) => {
    const validation = {
      length: password.length >= 8,
      hasNumber: /\d/.test(password),
      hasSpecialChar: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password),
      hasCapitalLetter: /[A-Z]/.test(password),
      isValid: false
    };
    
    validation.isValid = validation.length && validation.hasNumber && 
                       validation.hasSpecialChar && validation.hasCapitalLetter;
    
    setPasswordValidation(validation);
  };

  // Check if email already exists
  const checkEmailExists = async (email: string) => {
    if (!email.trim()) return false;
    
    try {
      const response = await fetch(`/api/patients/search/${encodeURIComponent(email)}`);
      if (response.ok) {
        const patients = await response.json();
        const existingPatient = patients.find((p: any) => 
          p.emailAddress.toLowerCase() === email.toLowerCase()
        );
        if (existingPatient) {
          setEmailError("A user with similar credentials exist");
          return true;
        }
      }
    } catch (error) {
      console.error("Error checking email:", error);
    }
    return false;
  };

  // Check if phone already exists
  const checkPhoneExists = async (phone: string) => {
    if (!phone.trim()) return false;
    
    try {
      const response = await fetch(`/api/patients/search/${encodeURIComponent(phone)}`);
      if (response.ok) {
        const patients = await response.json();
        const existingPatient = patients.find((p: any) => 
          p.phone === phone
        );
        if (existingPatient) {
          setPhoneError("A user with similar credentials exist");
          return true;
        }
      }
    } catch (error) {
      console.error("Error checking phone:", error);
    }
    return false;
  };

  const handleArrayChange = (field: string, index: number, value: string) => {
    setForm(prev => ({
      ...prev,
      [field]: prev[field].map((item: string, i: number) => 
        i === index ? value : item
      )
    }));
  };

  const addArrayItem = (field: string) => {
    setForm(prev => ({
      ...prev,
      [field]: [...prev[field], ""]
    }));
  };

  const removeArrayItem = (field: string, index: number) => {
    setForm(prev => ({
      ...prev,
      [field]: prev[field].filter((_: string, i: number) => i !== index)
    }));
  };

  // Image upload handlers
  const handleImageUpload = (files: FileList | null) => {
    if (!files) return;
    
    const imageFiles = Array.from(files).filter(file => 
      file.type.startsWith('image/') && 
      ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'].includes(file.type)
    );
    
    setPrescriptionImages(prev => [...prev, ...imageFiles]);
    
    // Process OCR for new images
    processOCRForImages(imageFiles);
  };

  const processOCRForImages = async (files: File[]) => {
    setIsProcessingOCR(true);
    
    for (const file of files) {
      // Add to OCR results with processing status
      setOcrResults(prev => [...prev, {
        fileName: file.name,
        extractedText: '',
        status: 'processing' as const
      }]);

      try {
        // Simulate OCR processing (replace with actual OCR API call)
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Mock OCR result (replace with actual OCR service)
        const mockExtractedText = `Prescription Details:
        Patient: ${form.firstName || 'John'} ${form.lastName || 'Doe'}
        Medication: Amoxicillin 500mg
        Dosage: Take 1 tablet twice daily
        Duration: 7 days
        Doctor: Dr. Smith
        Date: ${new Date().toLocaleDateString()}`;

        setOcrResults(prev => 
          prev.map(result => 
            result.fileName === file.name 
              ? { ...result, extractedText: mockExtractedText, status: 'success' as const }
              : result
          )
        );
      } catch (error) {
        setOcrResults(prev => 
          prev.map(result => 
            result.fileName === file.name 
              ? { ...result, status: 'error' as const }
              : result
          )
        );
      }
    }
    
    setIsProcessingOCR(false);
  };

  const removeImage = (index: number) => {
    const fileName = prescriptionImages[index].name;
    setPrescriptionImages(prev => prev.filter((_, i) => i !== index));
    setOcrResults(prev => prev.filter(result => result.fileName !== fileName));
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
      handleImageUpload(e.dataTransfer.files);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check password validation before submitting
    if (!passwordValidation.isValid) {
      setSubmitError("Your password needs to be stronger. Please make sure it has at least 8 letters, includes a number, a special symbol like ! or @, and at least one capital letter.");
      return;
    }
    
    // Check for duplicate email and phone before submitting
    const emailExists = await checkEmailExists(form.emailAddress);
    const phoneExists = await checkPhoneExists(form.phone);
    
    if (emailExists || phoneExists) {
      return; // Stop submission if duplicates found
    }
    
    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(false);
    
    try {
      // Prepare patient data according to the Patient model
      const patientData = {
        // Basic Information
        firstName: form.firstName,
        lastName: form.lastName,
        emailAddress: form.emailAddress,
        phone: form.phone,
        password: form.password, // Note: This will be hashed on the backend
        profileImage: form.profileImage || "",
        gender: form.gender,
        Age: form.Age,
        
        // Address
        street: form.street,
        city: form.city,
        state: form.state,
        zipCode: form.zipCode,
        country: form.country,
        
        // Status
        isActive: form.isActive,
        
        // Medical Information Arrays
        symptoms: form.symptoms.filter(s => s.trim() !== ""),
        medications: form.medications.filter(m => m.trim() !== ""),
        allergies: form.allergies.filter(a => a.trim() !== ""),
        chronicConditions: form.chronicConditions.filter(c => c.trim() !== ""),
        vaccinations: form.vaccinations.filter(v => v.trim() !== ""),
        
        // Vitals
        weight: form.weight,
        height: form.height,
        
        // Additional Medical Information
        notes: form.notes
      };
      
      console.log("Creating patient with data:", patientData);
      
      // Send to Patient API endpoint
      const response = await fetch('/api/patients', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(patientData)
      });
      
      if (response.ok) {
        const result = await response.json();
        console.log("✅ Patient and medical record created successfully:", result);
        console.log("Patient:", result.patient);
        console.log("Medical Record:", result.medicalRecord);
        console.log("Prescription images:", prescriptionImages);
        console.log("OCR results:", ocrResults);
        
        setSubmitSuccess(true);
        
        // Show success message for 2 seconds, then navigate
        setTimeout(() => {
          navigate("/patients");
        }, 2000);
        
      } else {
        const errorData = await response.json();
        console.error("❌ Error creating patient:", errorData);
        setSubmitError(errorData.error || "We couldn't save the patient information. Please check all the details and try again.");
      }
      
    } catch (error) {
      console.error("❌ Error creating patient:", error);
      setSubmitError("We're having trouble connecting to our servers. Please check your internet connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <Card className="shadow-soft">
        <CardContent className="p-6">
          <h1 className="text-2xl font-bold mb-4">Add New Patient</h1>
          
          {/* Success Message */}
          {submitSuccess && (
            <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span className="text-green-800 font-medium">Patient and medical record created successfully! Redirecting...</span>
            </div>
          )}
          
          {/* Error Message */}
          {submitError && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-600" />
              <span className="text-red-800 font-medium">{submitError}</span>
            </div>
          )}
          
          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">Basic Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>First Name *</Label>
                  <Input 
                    value={form.firstName} 
                    onChange={(e) => handleChange("firstName", e.target.value)} 
                    required 
                    placeholder="Enter first name"
                  />
                </div>
                <div>
                  <Label>Last Name *</Label>
                  <Input 
                    value={form.lastName} 
                    onChange={(e) => handleChange("lastName", e.target.value)} 
                    required 
                    placeholder="Enter last name"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Email Address *</Label>
                  <Input 
                    type="email" 
                    value={form.emailAddress} 
                    onChange={(e) => handleChange("emailAddress", e.target.value)} 
                    required 
                    placeholder="Enter email address"
                  />
                  {emailError && (
                    <p className="text-sm text-red-600 mt-1">{emailError}</p>
                  )}
                </div>
                <div>
                  <Label>Phone Number *</Label>
                  <Input 
                    value={form.phone} 
                    onChange={(e) => handleChange("phone", e.target.value)} 
                    required 
                    placeholder="Enter phone number"
                  />
                  {phoneError && (
                    <p className="text-sm text-red-600 mt-1">{phoneError}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Password *</Label>
                  <div className="relative">
                    <Input 
                      type={showPassword ? "text" : "password"}
                      value={form.password} 
                      onChange={(e) => handleChange("password", e.target.value)} 
                      required 
                      placeholder="Enter password"
                      className={form.password && !passwordValidation.isValid ? "border-red-500" : ""}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  
                  {/* Password validation feedback */}
                  {form.password && (
                    <div className="mt-2 space-y-1">
                      <div className={`flex items-center gap-2 text-sm ${passwordValidation.length ? 'text-green-600' : 'text-red-600'}`}>
                        {passwordValidation.length ? <CheckCircle className="h-3 w-3" /> : <AlertCircle className="h-3 w-3" />}
                        At least 8 letters long
                      </div>
                      <div className={`flex items-center gap-2 text-sm ${passwordValidation.hasNumber ? 'text-green-600' : 'text-red-600'}`}>
                        {passwordValidation.hasNumber ? <CheckCircle className="h-3 w-3" /> : <AlertCircle className="h-3 w-3" />}
                        Has a number (0-9)
                      </div>
                      <div className={`flex items-center gap-2 text-sm ${passwordValidation.hasSpecialChar ? 'text-green-600' : 'text-red-600'}`}>
                        {passwordValidation.hasSpecialChar ? <CheckCircle className="h-3 w-3" /> : <AlertCircle className="h-3 w-3" />}
                        Has a special symbol (!@#$)
                      </div>
                      <div className={`flex items-center gap-2 text-sm ${passwordValidation.hasCapitalLetter ? 'text-green-600' : 'text-red-600'}`}>
                        {passwordValidation.hasCapitalLetter ? <CheckCircle className="h-3 w-3" /> : <AlertCircle className="h-3 w-3" />}
                        Has a capital letter (A-Z)
                      </div>
                      {passwordValidation.isValid && (
                        <div className="flex items-center gap-2 text-sm text-green-600 font-medium mt-2">
                          <CheckCircle className="h-4 w-4" />
                          Great! Your password is strong and secure.
                        </div>
                      )}
                    </div>
                  )}
                </div>
                <div>
                  <Label>Age *</Label>
                  <Input 
                    value={form.Age} 
                    onChange={(e) => handleChange("Age", e.target.value)} 
                    required 
                    placeholder="Enter age"
                  />
                </div>
              </div>

              <div>
                <Label>Gender *</Label>
                <Select value={form.gender} onValueChange={(value) => handleChange("gender", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
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

            {/* Medical Information */}
            

           
            {/* Medications */}
            

            {/* Vitals */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">Additional Informations</h3>
              <div className="grid grid-cols-3 gap-4">
                
               
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label>Weight</Label>
                  <Input 
                    value={form.weight} 
                    onChange={(e) => handleChange("weight", e.target.value)} 
                    placeholder="e.g. 70 kg"
                  />
                </div>
                <div>
                  <Label>Height</Label>
                  <Input 
                    value={form.height} 
                    onChange={(e) => handleChange("height", e.target.value)} 
                    placeholder="e.g. 5'10&quot;"
                  />
                </div>
                
              </div>
            </div>
<div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">Medications</h3>
              {form.medications.map((medication, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={medication}
                    onChange={(e) => handleArrayChange("medications", index, e.target.value)}
                    placeholder="Enter medication"
                  />
                  {form.medications.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeArrayItem("medications", index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                onClick={() => addArrayItem("medications")}
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Medication
              </Button>
            </div>
            {/* Allergies */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">Allergies</h3>
              {form.allergies.map((allergy, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={allergy}
                    onChange={(e) => handleArrayChange("allergies", index, e.target.value)}
                    placeholder="Enter allergy"
                  />
                  {form.allergies.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeArrayItem("allergies", index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                onClick={() => addArrayItem("allergies")}
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Allergy
              </Button>
            </div>

            {/* Vaccinations */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">Vaccinations</h3>
              {form.vaccinations.map((vaccination, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={vaccination}
                    onChange={(e) => handleArrayChange("vaccinations", index, e.target.value)}
                    placeholder="Enter vaccination"
                  />
                  {form.vaccinations.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeArrayItem("vaccinations", index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                onClick={() => addArrayItem("vaccinations")}
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Vaccination
              </Button>
            </div>

            {/* Additional Medical Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">Additional Medical Information</h3>
              <div>
                <Label>Notes</Label>
                <Textarea 
                  value={form.notes} 
                  onChange={(e) => handleChange("notes", e.target.value)} 
                  placeholder="Enter additional medical notes"
                  rows={4}
                />
              </div>
              
            </div>

            {/* Prescription Images Upload Section */}
            <div className="space-y-4">
              <Label className="text-base font-semibold">Prescription Images</Label>
              <p className="text-sm text-muted-foreground">
                Upload prescription images for OCR scanning and automatic data extraction
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
                  Drag & drop prescription images here, or click to browse
                </p>
                <Input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => handleImageUpload(e.target.files)}
                  className="hidden"
                  id="prescription-upload"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => document.getElementById('prescription-upload')?.click()}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Choose Images
                </Button>
                <p className="text-xs text-muted-foreground mt-2">
                  Supports: JPG, PNG, WebP (Max 10MB each)
                </p>
              </div>

              {/* Uploaded Images Preview */}
              {prescriptionImages.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-sm font-medium">Uploaded Prescriptions ({prescriptionImages.length})</h4>
                  <div className="grid gap-3">
                    {prescriptionImages.map((file, index) => {
                      const ocrResult = ocrResults.find(result => result.fileName === file.name);
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
                            {ocrResult && (
                              <div className="flex items-center gap-2 mt-1">
                                {ocrResult.status === 'processing' && (
                                  <>
                                    <Loader2 className="h-3 w-3 animate-spin text-blue-500" />
                                    <span className="text-xs text-blue-600">Reading text...</span>
                                  </>
                                )}
                                {ocrResult.status === 'success' && (
                                  <>
                                    <CheckCircle className="h-3 w-3 text-green-500" />
                                    <span className="text-xs text-green-600">Text extracted</span>
                                  </>
                                )}
                                {ocrResult.status === 'error' && (
                                  <>
                                    <AlertCircle className="h-3 w-3 text-red-500" />
                                    <span className="text-xs text-red-600">Couldn't read text</span>
                                  </>
                                )}
                              </div>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            {ocrResult?.status === 'success' && (
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => setSelectedOcrResult({
                                  fileName: file.name,
                                  extractedText: ocrResult.extractedText
                                })}
                              >
                                <Eye className="h-3 w-3" />
                              </Button>
                            )}
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => removeImage(index)}
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

              {/* OCR Processing Status */}
              {isProcessingOCR && (
                <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
                  <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
                  <span className="text-sm text-blue-700">
                    Processing prescription images with OCR...
                  </span>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button 
                variant="outline" 
                type="button" 
                onClick={() => navigate("/patients")}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={isSubmitting || (form.password && !passwordValidation.isValid)}
                className="min-w-[120px]"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Patient"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* OCR Results Modal */}
      <Dialog open={!!selectedOcrResult} onOpenChange={() => setSelectedOcrResult(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>OCR Results - {selectedOcrResult?.fileName}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="bg-muted/50 p-4 rounded-lg">
              <h4 className="font-medium mb-2">Extracted Text:</h4>
              <pre className="text-sm whitespace-pre-wrap font-mono">
                {selectedOcrResult?.extractedText}
              </pre>
            </div>
            <div className="flex justify-end">
              <Button onClick={() => setSelectedOcrResult(null)}>
                Close
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
