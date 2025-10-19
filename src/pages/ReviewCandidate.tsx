import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
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
import {
  ArrowLeft,
  CheckCircle,
  XCircle,
  Loader2,
  User,
  Mail,
  Phone,
  MapPin,
  GraduationCap,
  Award,
  FileText,
  Shield,
  Building,
  Users,
  Calendar
} from "lucide-react";
import { fetchCandidateById, approveCandidate, rejectCandidate, Candidate } from "@/services/candidateService";

export default function ReviewCandidate() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [candidate, setCandidate] = useState<Candidate | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState<string | null>(null);
  const [showApproveDialog, setShowApproveDialog] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);

  useEffect(() => {
    if (id) {
      loadCandidate();
    }
  }, [id]);

  const loadCandidate = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchCandidateById(id!);
      setCandidate(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load candidate details");
      console.error("Error loading candidate:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleApproveClick = () => {
    setShowApproveDialog(true);
  };

  const handleRejectClick = () => {
    setShowRejectDialog(true);
  };

  const handleApprove = async () => {
    if (!candidate) return;
    
    try {
      setProcessing("approve");
      setError(null);
      await approveCandidate(candidate._id);
      setShowApproveDialog(false);
      navigate("/candidates", { state: { message: "Candidate approved successfully" } });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to approve candidate");
      console.error("Error approving candidate:", err);
    } finally {
      setProcessing(null);
    }
  };

  const handleReject = async () => {
    if (!candidate) return;
    
    try {
      setProcessing("reject");
      setError(null);
      await rejectCandidate(candidate._id);
      setShowRejectDialog(false);
      navigate("/candidates", { state: { message: "Candidate rejected successfully" } });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to reject candidate");
      console.error("Error rejecting candidate:", err);
    } finally {
      setProcessing(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading candidate details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="max-w-md">
          <CardContent className="p-6 text-center">
            <div className="text-destructive mb-4">
              <XCircle className="h-12 w-12 mx-auto mb-2" />
              <p>{error}</p>
            </div>
            <Button onClick={() => navigate("/candidates")} variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Candidates
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!candidate) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="max-w-md">
          <CardContent className="p-6 text-center">
            <div className="text-muted-foreground mb-4">
              <User className="h-12 w-12 mx-auto mb-2" />
              <p>Candidate not found</p>
            </div>
            <Button onClick={() => navigate("/candidates")} variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Candidates
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => navigate("/candidates")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Candidates
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Review Candidate</h1>
            <p className="text-muted-foreground">Review candidate details and make a decision</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={handleRejectClick}
            disabled={processing !== null}
            className="text-destructive hover:text-destructive"
          >
            {processing === "reject" ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <XCircle className="h-4 w-4 mr-2" />
            )}
            Reject
          </Button>
          <Button 
            onClick={handleApproveClick}
            disabled={processing !== null}
            className="bg-green-600 hover:bg-green-700"
          >
            {processing === "approve" ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <CheckCircle className="h-4 w-4 mr-2" />
            )}
            Approve
          </Button>
        </div>
      </div>

      {/* Candidate Overview */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20">
              <AvatarFallback className="text-lg">
                {candidate.DoctorName.split(' ').map(n => n[0]).join('').toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <CardTitle className="text-2xl">{candidate.DoctorName}</CardTitle>
              <p className="text-muted-foreground text-lg">{Array.isArray(candidate.specialization) ? candidate.specialization.join(", ") : (candidate.specialization || "No specializations") || "No specializations"}</p>
              <div className="flex gap-2 mt-2">
                <Badge className="bg-warning/10 text-warning border-warning/20">Pending Review</Badge>
                <Badge className="bg-primary/10 text-primary border-primary/20">New Application</Badge>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Contact Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Contact Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">{candidate.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Phone</p>
                <p className="font-medium">{candidate.phone}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Address</p>
                <p className="font-medium">{candidate.address || "Not provided"}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Applied</p>
                <p className="font-medium">{new Date(candidate.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Professional Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5" />
            Professional Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* About */}
          {candidate.about && (
            <div>
              <h4 className="font-semibold mb-2">About</h4>
              <p className="text-muted-foreground">{candidate.about}</p>
            </div>
          )}

          {/* Experience */}
          {candidate.experience && (
            <div>
              <h4 className="font-semibold mb-2">Experience</h4>
              <p className="text-muted-foreground">{candidate.experience}</p>
            </div>
          )}

          {/* Education */}
          {candidate.education && (
            <div>
              <h4 className="font-semibold mb-2">Education</h4>
              <p className="text-muted-foreground">{candidate.education}</p>
            </div>
          )}

          <Separator />

          {/* Medical Degrees */}
          {Array.isArray(candidate.medicalDegree) && candidate.medicalDegree.length > 0 && (
            <div>
              <h4 className="font-semibold mb-2">Medical Degrees</h4>
              <div className="space-y-2">
                {candidate.medicalDegree.map((degree, index) => (
                  <p key={index} className="text-muted-foreground">{degree}</p>
                ))}
              </div>
            </div>
          )}

          {/* Residencies */}
          {Array.isArray(candidate.residency) && candidate.residency.length > 0 && (
            <div>
              <h4 className="font-semibold mb-2">Residencies</h4>
              <div className="space-y-2">
                {candidate.residency.map((residency, index) => (
                  <p key={index} className="text-muted-foreground">{residency}</p>
                ))}
              </div>
            </div>
          )}

          {/* Fellowships */}
          {Array.isArray(candidate.fellowship) && candidate.fellowship.length > 0 && (
            <div>
              <h4 className="font-semibold mb-2">Fellowships</h4>
              <div className="space-y-2">
                {candidate.fellowship.map((fellowship, index) => (
                  <p key={index} className="text-muted-foreground">{fellowship}</p>
                ))}
              </div>
            </div>
          )}

          {/* Board Certifications */}
          {Array.isArray(candidate.boardCertification) && candidate.boardCertification.length > 0 && (
            <div>
              <h4 className="font-semibold mb-2">Board Certifications</h4>
              <div className="space-y-2">
                {candidate.boardCertification.map((certification, index) => (
                  <p key={index} className="text-muted-foreground">{certification}</p>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Licenses and Certifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Licenses & Certifications
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {Array.isArray(candidate.licenses) && candidate.licenses.length > 0 && (
            <div>
              <h4 className="font-semibold mb-2">Licenses</h4>
              <div className="space-y-2">
                {candidate.licenses.map((license, index) => (
                  <p key={index} className="text-muted-foreground">{license}</p>
                ))}
              </div>
            </div>
          )}

          {candidate.deaRegistration && (
            <div>
              <h4 className="font-semibold mb-2">DEA Registration</h4>
              <p className="text-muted-foreground">{candidate.deaRegistration}</p>
            </div>
          )}

          {candidate.malpracticeInsurance && (
            <div>
              <h4 className="font-semibold mb-2">Malpractice Insurance</h4>
              <p className="text-muted-foreground">{candidate.malpracticeInsurance}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Affiliations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="h-5 w-5" />
            Affiliations & Memberships
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {Array.isArray(candidate.hospitalAffiliations) && candidate.hospitalAffiliations.length > 0 && (
            <div>
              <h4 className="font-semibold mb-2">Hospital Affiliations</h4>
              <div className="space-y-2">
                {candidate.hospitalAffiliations.map((affiliation, index) => (
                  <p key={index} className="text-muted-foreground">{affiliation}</p>
                ))}
              </div>
            </div>
          )}

          {Array.isArray(candidate.memberships) && candidate.memberships.length > 0 && (
            <div>
              <h4 className="font-semibold mb-2">Professional Memberships</h4>
              <div className="space-y-2">
                {candidate.memberships.map((membership, index) => (
                  <p key={index} className="text-muted-foreground">{membership}</p>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Approve Confirmation Dialog */}
      <AlertDialog open={showApproveDialog} onOpenChange={setShowApproveDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Approve Candidate</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to approve <strong>{candidate?.name}</strong>?
              <br /><br />
              This will move the candidate to the main doctors list and they will be able to access the system and accept patients.
              <br /><br />
              <strong>This action cannot be undone.</strong>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleApprove}
              className="bg-green-600 hover:bg-green-700"
              disabled={processing === "approve"}
            >
              {processing === "approve" ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Approving...
                </>
              ) : (
                "Approve Candidate"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Reject Confirmation Dialog */}
      <AlertDialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reject Candidate</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to reject <strong>{candidate?.name}</strong>?
              <br /><br />
              This will remove the candidate from the pending list and they will not be able to access the system.
              <br /><br />
              <strong>This action cannot be undone.</strong>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleReject}
              className="bg-red-600 hover:bg-red-700"
              disabled={processing === "reject"}
            >
              {processing === "reject" ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Rejecting...
                </>
              ) : (
                "Reject Candidate"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}