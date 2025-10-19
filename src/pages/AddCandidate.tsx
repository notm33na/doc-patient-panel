import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { createCandidate } from "@/services/candidateService";
import { Loader2, ArrowLeft, Plus, X, Upload, Eye, EyeOff, Check, X as XIcon } from "lucide-react";

export default function AddCandidate() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [passwordRequirements, setPasswordRequirements] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false
  });
  const [form, setForm] = useState({
    // Basic Information
    DoctorName: "",
    email: "",
    phone: "",
    password: "",
    
    // Specializations (Array)
    specialization: [""],
    
    // License Information
    licenses: [""],
    
    // Professional Information
    experience: "",
    about: "",
    
    // Medical Credentials (Arrays)
    medicalDegree: [""],
    residency: [""],
    fellowship: [""],
    boardCertification: [""],
    
    // Other Information (Arrays)
    hospitalAffiliations: [""],
    memberships: [""],
    malpracticeInsurance: "",
    address: "",
    education: "",
    status: "pending"
  });

  const handleChange = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
    
    // Validate password when password field changes
    if (field === "password") {
      validatePassword(value);
    }
  };

  const validatePassword = (password: string) => {
    const requirements = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /\d/.test(password),
      special: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)
    };
    
    setPasswordRequirements(requirements);
    
    // Check if all requirements are met
    const allMet = Object.values(requirements).every(req => req);
    
    if (!allMet) {
      const unmetRequirements = [];
      if (!requirements.length) unmetRequirements.push("at least 8 characters");
      if (!requirements.uppercase) unmetRequirements.push("at least one uppercase letter");
      if (!requirements.lowercase) unmetRequirements.push("at least one lowercase letter");
      if (!requirements.number) unmetRequirements.push("at least one number");
      if (!requirements.special) unmetRequirements.push("at least one special character");
      
      setPasswordError(`Password must contain ${unmetRequirements.join(", ")}`);
    } else {
      setPasswordError(null);
    }
  };

  // Generic array handling functions
  const handleArrayChange = (field: 'specialization' | 'hospitalAffiliations' | 'memberships' | 'licenses' | 'medicalDegree' | 'residency' | 'fellowship' | 'boardCertification', index: number, value: string) => {
    setForm(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }));
  };

  const addArrayItem = (field: 'specialization' | 'hospitalAffiliations' | 'memberships' | 'licenses' | 'medicalDegree' | 'residency' | 'fellowship' | 'boardCertification') => {
    setForm(prev => ({
      ...prev,
      [field]: [...prev[field], ""]
    }));
  };

  const removeArrayItem = (field: 'specialization' | 'hospitalAffiliations' | 'memberships' | 'licenses' | 'medicalDegree' | 'residency' | 'fellowship' | 'boardCertification', index: number) => {
    setForm(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const resetForm = () => {
    setForm({
      // Basic Information
      DoctorName: "",
      email: "",
      phone: "",
      password: "",
      
      // Specializations (Array)
      specialization: [""],
      
      // License Information
      licenses: [""],
      
      // Professional Information
      experience: "",
      about: "",
      
      // Medical Credentials (Arrays)
      medicalDegree: [""],
      residency: [""],
      fellowship: [""],
      boardCertification: [""],
      
      // Other Information (Arrays)
      hospitalAffiliations: [""],
      memberships: [""],
      malpracticeInsurance: "",
      address: "",
      education: "",
      status: "pending"
    });
    setError(null);
    setSuccess(null);
    setPasswordError(null);
    setPasswordRequirements({
      length: false,
      uppercase: false,
      lowercase: false,
      number: false,
      special: false
    });
  };

  const validateForm = () => {
    const errors: string[] = [];
    
    if (!form.DoctorName.trim()) errors.push("Full name is required");
    if (!form.email.trim()) errors.push("Email is required");
    if (!form.phone.trim()) errors.push("Phone number is required");
    if (!form.password.trim()) errors.push("Password is required");
    if (passwordError) errors.push(passwordError);
    // Note: specialization is optional, so we don't validate it
    if (form.licenses.every(l => !l.trim())) errors.push("At least one license is required");
    
    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
      setError(validationErrors.join(", "));
      return;
    }
    
    // Show confirmation dialog
    setShowConfirmDialog(true);
  };

  const handleConfirmSubmit = async () => {
    try {
      setLoading(true);
      setError(null);
      setShowConfirmDialog(false);
      
      // Prepare form data with array handling
      const formData = {
        ...form,
        // Filter out empty values
        specialization: form.specialization.filter(s => s.trim() !== ""),
        licenses: form.licenses.filter(l => l.trim() !== ""),
        medicalDegree: form.medicalDegree.filter(d => d.trim() !== ""),
        residency: form.residency.filter(r => r.trim() !== ""),
        fellowship: form.fellowship.filter(f => f.trim() !== ""),
        boardCertification: form.boardCertification.filter(b => b.trim() !== ""),
        hospitalAffiliations: form.hospitalAffiliations.filter(h => h.trim() !== ""),
        memberships: form.memberships.filter(m => m.trim() !== "")
      };
      
      // Create candidate in Pending_Doctors collection
      await createCandidate(formData);
      
      setSuccess("Candidate added successfully and is now pending review!");
      
      // Don't auto-navigate, let user choose to add another or view candidates
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add candidate");
      console.error("Error adding candidate:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <Card className="shadow-soft">
        <CardHeader>
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={() => navigate("/candidates")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Candidates
            </Button>
            <div>
              <CardTitle className="text-2xl">Add New Doctor Candidate</CardTitle>
              <p className="text-muted-foreground">Add a new doctor candidate to the pending review list</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          {error && (
            <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-md">
              <p className="text-destructive">{error}</p>
            </div>
          )}
          
          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-md">
              <p className="text-green-800">{success}</p>
              <div className="mt-3 flex gap-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={resetForm}
                  className="text-green-800 border-green-300 hover:bg-green-100"
                >
                  Add Another Candidate
                </Button>
                <Button 
                  type="button" 
                  onClick={() => navigate("/candidates")}
                  className="bg-green-600 hover:bg-green-700"
                >
                  View Candidates
                </Button>
              </div>
            </div>
          )}
          
          <form className="space-y-6" onSubmit={handleSubmit}>
            
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">Basic Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Full Name *</Label>
                  <Input 
                    value={form.DoctorName} 
                    onChange={(e) => handleChange("DoctorName", e.target.value)} 
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
                  <Label>Password *</Label>
                  <div className="relative">
                    <Input 
                      type={showPassword ? "text" : "password"}
                      value={form.password} 
                      onChange={(e) => handleChange("password", e.target.value)} 
                      required 
                      placeholder="Enter password"
                      className={passwordError ? "border-destructive" : ""}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      )}
                    </Button>
                  </div>
                  
                  {/* Password Requirements Checklist */}
                  <div className="mt-3 space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">Password Requirements:</p>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        {passwordRequirements.length ? (
                          <Check className="h-4 w-4 text-green-600" />
                        ) : (
                          <XIcon className="h-4 w-4 text-muted-foreground" />
                        )}
                        <span className={`text-sm ${passwordRequirements.length ? 'text-green-600' : 'text-muted-foreground'}`}>
                          At least 8 characters
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        {passwordRequirements.uppercase ? (
                          <Check className="h-4 w-4 text-green-600" />
                        ) : (
                          <XIcon className="h-4 w-4 text-muted-foreground" />
                        )}
                        <span className={`text-sm ${passwordRequirements.uppercase ? 'text-green-600' : 'text-muted-foreground'}`}>
                          At least one uppercase letter
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        {passwordRequirements.lowercase ? (
                          <Check className="h-4 w-4 text-green-600" />
                        ) : (
                          <XIcon className="h-4 w-4 text-muted-foreground" />
                        )}
                        <span className={`text-sm ${passwordRequirements.lowercase ? 'text-green-600' : 'text-muted-foreground'}`}>
                          At least one lowercase letter
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        {passwordRequirements.number ? (
                          <Check className="h-4 w-4 text-green-600" />
                        ) : (
                          <XIcon className="h-4 w-4 text-muted-foreground" />
                        )}
                        <span className={`text-sm ${passwordRequirements.number ? 'text-green-600' : 'text-muted-foreground'}`}>
                          At least one number
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        {passwordRequirements.special ? (
                          <Check className="h-4 w-4 text-green-600" />
                        ) : (
                          <XIcon className="h-4 w-4 text-muted-foreground" />
                        )}
                        <span className={`text-sm ${passwordRequirements.special ? 'text-green-600' : 'text-muted-foreground'}`}>
                          At least one special character
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {passwordError && (
                    <p className="text-sm text-destructive mt-2">{passwordError}</p>
                  )}
                </div>
              </div>
              
              {/* License Information */}
              <div>
                <Label>Licenses *</Label>
                <div className="space-y-3">
                  {form.licenses.map((license, index) => (
                    <div key={index} className="flex gap-3 items-end">
                      <div className="flex-1">
                        <Label>License</Label>
                        <Input 
                          value={license} 
                          onChange={(e) => handleArrayChange("licenses", index, e.target.value)} 
                          required 
                          placeholder="e.g. State Medical License - MD12345"
                        />
                      </div>
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
                    Add Another License
                  </Button>
                </div>
              </div>
              {/* Specializations */}
                <div>
                <Label>Specializations (Optional)</Label>
                <div className="space-y-3">
                  {form.specialization.map((specialization, index) => (
                    <div key={index} className="flex gap-3 items-end">
                      <div className="flex-1">
                  <Input 
                          value={specialization} 
                          onChange={(e) => handleArrayChange("specialization", index, e.target.value)} 
                    required 
                          placeholder="e.g. Cardiology, Neurology"
                        />
                      </div>
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
                    Add Another Specialization
                  </Button>
                </div>
              </div>
            </div>

            {/* Professional Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">Professional Information</h3>
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
                    placeholder="e.g. Harvard Medical School"
                  />
                </div>
              </div>
              <div>
                <Label>About</Label>
                <Textarea 
                  value={form.about} 
                  onChange={(e) => handleChange("about", e.target.value)} 
                  placeholder="Brief description about the doctor"
                  rows={3}
                />
              </div>
            </div>

            {/* Medical Credentials */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">Medical Credentials</h3>
              
              {/* Medical Degrees */}
              <div className="space-y-3">
                <Label>Medical Degrees</Label>
                {form.medicalDegree.map((degree, index) => (
                  <div key={index} className="flex gap-3 items-end">
                    <div className="flex-1">
                      <Input 
                        value={degree} 
                        onChange={(e) => handleArrayChange("medicalDegree", index, e.target.value)} 
                        placeholder="e.g. MD, MBBS"
                      />
                    </div>
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
                  Add Another Medical Degree
                </Button>
              </div>

              {/* Residencies */}
              <div className="space-y-3">
                <Label>Residencies</Label>
                {form.residency.map((residency, index) => (
                  <div key={index} className="flex gap-3 items-end">
                    <div className="flex-1">
                      <Input 
                        value={residency} 
                        onChange={(e) => handleArrayChange("residency", index, e.target.value)} 
                        placeholder="e.g. Internal Medicine Residency"
                      />
                    </div>
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
                  Add Another Residency
                </Button>
              </div>

              {/* Fellowships */}
              <div className="space-y-3">
                <Label>Fellowships</Label>
                {form.fellowship.map((fellowship, index) => (
                  <div key={index} className="flex gap-3 items-end">
                    <div className="flex-1">
                      <Input 
                        value={fellowship} 
                        onChange={(e) => handleArrayChange("fellowship", index, e.target.value)} 
                        placeholder="e.g. Cardiology Fellowship"
                      />
                    </div>
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
                  Add Another Fellowship
                </Button>
              </div>

              {/* Board Certifications */}
              <div className="space-y-3">
                <Label>Board Certifications</Label>
                {form.boardCertification.map((certification, index) => (
                  <div key={index} className="flex gap-3 items-end">
                    <div className="flex-1">
                      <Input 
                        value={certification} 
                        onChange={(e) => handleArrayChange("boardCertification", index, e.target.value)} 
                        placeholder="e.g. American Board of Internal Medicine"
                      />
                    </div>
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
                  Add Another Board Certification
                </Button>
              </div>
            </div>

            {/* Other Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">Other Information</h3>
                <div>
                <Label>Malpractice Insurance</Label>
                  <Input 
                  value={form.malpracticeInsurance} 
                  onChange={(e) => handleChange("malpracticeInsurance", e.target.value)} 
                  placeholder="e.g. Coverage details"
                />
              </div>
            </div>

            {/* Affiliations */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">Affiliations & Memberships</h3>
              
              {/* Hospital Affiliations */}
              <div className="space-y-3">
                <Label>Hospital Affiliations</Label>
                {form.hospitalAffiliations.map((affiliation, index) => (
                  <div key={index} className="flex gap-3 items-end">
                    <div className="flex-1">
                      <Input 
                        value={affiliation} 
                        onChange={(e) => handleArrayChange("hospitalAffiliations", index, e.target.value)} 
                        placeholder="e.g. Johns Hopkins Hospital"
                      />
                    </div>
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
                  Add Another Hospital Affiliation
                </Button>
              </div>

              {/* Professional Memberships */}
              <div className="space-y-3">
                <Label>Professional Memberships</Label>
                {form.memberships.map((membership, index) => (
                  <div key={index} className="flex gap-3 items-end">
                    <div className="flex-1">
                      <Input 
                        value={membership} 
                        onChange={(e) => handleArrayChange("memberships", index, e.target.value)} 
                        placeholder="e.g. American Medical Association"
                      />
                </div>
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
                  Add Another Membership
                </Button>
              </div>
            </div>

            {/* Address */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">Address</h3>
              <div>
                <Label>Address</Label>
                <Textarea 
                  value={form.address} 
                  onChange={(e) => handleChange("address", e.target.value)} 
                  placeholder="Enter full address"
                  rows={3}
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end gap-4 pt-6">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => navigate("/candidates")}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={loading}
                className="bg-primary hover:bg-primary/90"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Adding Candidate...
                  </>
                ) : (
                  "Add Candidate"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Confirmation Dialog */}
      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Add Candidate</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to add <strong>{form.DoctorName}</strong> as a new doctor candidate? 
              This will create a pending application that will need to be reviewed before approval.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleConfirmSubmit}
              disabled={loading}
              className="bg-primary hover:bg-primary/90"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Adding Candidate...
                </>
              ) : (
                "Add Candidate"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}