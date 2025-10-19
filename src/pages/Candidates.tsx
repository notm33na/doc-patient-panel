import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  Search,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  Download,
  User,
  GraduationCap,
  Award,
  Calendar,
  Loader2,
  RefreshCw
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { 
  fetchPendingCandidates, 
  fetchRejectedCandidates, 
  approveCandidate, 
  rejectCandidate,
  Candidate 
} from "@/services/candidateService";

export default function Candidates() {
  const navigate = useNavigate();

  const [pending, setPending] = useState<Candidate[]>([]);
  const [rejected, setRejected] = useState<Candidate[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState<string | null>(null);
  const [showApproveDialog, setShowApproveDialog] = useState<{id: string, name: string} | null>(null);
  const [showRejectDialog, setShowRejectDialog] = useState<{id: string, name: string} | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);

  // Load candidates data
  const loadCandidates = async () => {
    try {
      setLoading(true);
      setError(null);
      const [pendingData, rejectedData] = await Promise.all([
        fetchPendingCandidates(),
        fetchRejectedCandidates()
      ]);
      setPending(pendingData);
      setRejected(rejectedData);
      console.log("Candidates data received:", { pendingData, rejectedData });
      console.log("First candidate structure:", pendingData[0]);
      if (pendingData[0]) {
        console.log("Specialization type:", typeof pendingData[0].specialization, pendingData[0].specialization);
        console.log("Licenses type:", typeof pendingData[0].licenses, pendingData[0].licenses);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load candidates");
      console.error("Error loading candidates:", err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch current user
  const fetchCurrentUser = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const response = await axios.get('http://localhost:5000/api/admins/me', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        setCurrentUser(response.data);
      } else {
        console.log('No token found in localStorage');
        window.location.href = '/login';
      }
    } catch (error: any) {
      console.error('Error fetching current user:', error);
      if (error.response?.status === 401) {
        console.log('Token expired or invalid, redirecting to login');
        localStorage.removeItem('token');
        window.location.href = '/login';
      } else {
        console.error('Unexpected error:', error.response?.data || error.message);
        setCurrentUser({ role: 'Admin' });
      }
    }
  };

  // Load data on component mount
  useEffect(() => {
    fetchCurrentUser();
  }, []);

  useEffect(() => {
    if (currentUser) {
      loadCandidates();
    }
  }, [currentUser]);

  const handleApproveClick = (candidateId: string, candidateName: string) => {
    setShowApproveDialog({ id: candidateId, name: candidateName });
  };

  const handleRejectClick = (candidateId: string, candidateName: string) => {
    setShowRejectDialog({ id: candidateId, name: candidateName });
  };

  const handleApprove = async () => {
    if (!showApproveDialog) return;
    
    try {
      setProcessing(showApproveDialog.id);
      setError(null);
      await approveCandidate(showApproveDialog.id);
      // Remove from pending list - approved doctors will appear in main doctors screen
      setPending(prev => prev.filter(c => c._id !== showApproveDialog.id));
      setShowApproveDialog(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to approve candidate");
      console.error("Error approving candidate:", err);
    } finally {
      setProcessing(null);
    }
  };

  const handleReject = async () => {
    if (!showRejectDialog) return;
    
    try {
      setProcessing(showRejectDialog.id);
      setError(null);
      await rejectCandidate(showRejectDialog.id);
      // Move from pending to rejected
      const candidate = pending.find(c => c._id === showRejectDialog.id);
      if (candidate) {
        setRejected(prev => [...prev, candidate]);
        setPending(prev => prev.filter(c => c._id !== showRejectDialog.id));
      }
      setShowRejectDialog(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to reject candidate");
      console.error("Error rejecting candidate:", err);
    } finally {
      setProcessing(null);
    }
  };

  // Helper function to safely render array or string data
  const renderArrayOrString = (data: unknown, fallback: string = "Not provided") => {
    if (Array.isArray(data)) {
      return data.filter(item => item && item.toString().trim()).join(", ") || fallback;
    }
    if (typeof data === 'string' && data.trim()) {
      return data;
    }
    return fallback;
  };

  const filteredCandidates = pending.filter(candidate =>
    candidate.DoctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (Array.isArray(candidate.specialization) ? candidate.specialization.some(spec => spec.toLowerCase().includes(searchTerm.toLowerCase())) : false) ||
    candidate.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredRejected = rejected.filter(candidate =>
    candidate.DoctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (Array.isArray(candidate.specialization) ? candidate.specialization.some(spec => spec.toLowerCase().includes(searchTerm.toLowerCase())) : false) ||
    candidate.email.toLowerCase().includes(searchTerm.toLowerCase())
  );


  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Doctor Candidates</h1>
          <p className="text-muted-foreground">Review and manage doctor applications and verification process</p>
        </div>
        <div className="flex gap-2">
          {currentUser?.role === 'Super Admin' && (
            <Button variant="outline" className="gap-2" onClick={() => navigate("/export-list")}>
              <Download className="h-4 w-4" />
              Export List
            </Button>
          )}
          <Button className="gap-2" onClick={() => navigate("/add-candidate")}>
            <User className="h-4 w-4" />
            Add Candidate
          </Button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Search candidates..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 mb-4"
        />
      </div>

      {/* Loading and Error States */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2 text-muted-foreground">Loading candidates...</span>
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
              <Button variant="outline" size="sm" onClick={loadCandidates} className="ml-auto">
                <RefreshCw className="h-4 w-4 mr-2" />
                Retry
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tabs */}
      {!loading && (
      <Tabs defaultValue="pending" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="pending">Pending ({pending.length})</TabsTrigger>
          <TabsTrigger value="rejected">Rejected ({rejected.length})</TabsTrigger>
        </TabsList>

        {/* Pending */}
        <TabsContent value="pending" className="space-y-4">
          {filteredCandidates.length > 0 ? (
            filteredCandidates.map((candidate) => {
              try {
                return (
                  <Card key={candidate._id}>
                  <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-16 w-16">
                        <AvatarFallback>
                          {candidate.DoctorName.split(' ').map(n => n[0]).join('').toUpperCase()}
                        </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="text-lg font-semibold">{candidate.DoctorName || "Unknown Doctor"}</h3>
                        <p className="text-muted-foreground">{renderArrayOrString(candidate.specialization, "No specializations")}</p>
                      <div className="flex gap-2 mt-1">
                          <Badge className="bg-warning/10 text-warning border-warning/20">Pending Review</Badge>
                          <Badge className="bg-primary/10 text-primary border-primary/20">New Application</Badge>
                        </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => navigate(`/review/${candidate._id}`)}>
                      <Eye className="h-4 w-4" /> Review
                    </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => handleApproveClick(candidate._id, candidate.DoctorName)}
                        disabled={processing === candidate._id}
                      >
                        {processing === candidate._id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                      <CheckCircle className="h-4 w-4" />
                        )}
                    </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => handleRejectClick(candidate._id, candidate.DoctorName)}
                        disabled={processing === candidate._id}
                      >
                        {processing === candidate._id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                      <XCircle className="h-4 w-4" />
                        )}
                    </Button>
                  </div>
                </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Email:</span>
                      <p className="font-medium">{candidate.email || "No email"}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Phone:</span>
                      <p className="font-medium">{candidate.phone || "No phone"}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">License:</span>
                      <p className="font-medium">{renderArrayOrString(candidate.licenses, "No license")}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Applied:</span>
                      <p className="font-medium">{candidate.createdAt ? new Date(candidate.createdAt).toLocaleDateString() : "Unknown date"}</p>
                    </div>
                  </div>
              </CardContent>
            </Card>
                );
              } catch (error) {
                console.error("Error rendering candidate:", error, candidate);
                return (
                  <Card key={candidate._id} className="border-red-300">
                    <CardContent className="p-6">
                      <p className="text-red-600">Error rendering candidate: {candidate.DoctorName || candidate._id}</p>
                    </CardContent>
                  </Card>
                );
              }
            })
          ) : (
            <div className="text-center py-12">
              <div className="text-muted-foreground">
                <User className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-semibold mb-2">No pending candidates</h3>
                <p className="text-sm">
                  {searchTerm ? "No candidates match your search criteria." : "No candidates are currently pending review."}
                </p>
              </div>
            </div>
          )}
        </TabsContent>

        {/* Rejected */}
        <TabsContent value="rejected" className="space-y-4">
          {filteredRejected.length > 0 ? (
            filteredRejected.map((candidate) => {
              try {
                return (
                  <Card key={candidate._id} className="border border-red-300">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-16 w-16">
                        <AvatarFallback>
                          {candidate.DoctorName.split(' ').map(n => n[0]).join('').toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="text-lg font-semibold">{candidate.DoctorName || "Unknown Doctor"}</h3>
                        <p className="text-muted-foreground">{renderArrayOrString(candidate.specialization, "No specializations")}</p>
                        <div className="flex gap-2 mt-1">
                          <Badge className="bg-destructive/10 text-destructive border-destructive/20">Rejected</Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Email:</span>
                      <p className="font-medium">{candidate.email || "No email"}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Phone:</span>
                      <p className="font-medium">{candidate.phone || "No phone"}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">License:</span>
                      <p className="font-medium">{renderArrayOrString(candidate.licenses, "No license")}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Rejected:</span>
                      <p className="font-medium">{candidate.updatedAt ? new Date(candidate.updatedAt).toLocaleDateString() : "Unknown date"}</p>
                    </div>
                  </div>
              </CardContent>
            </Card>
                );
              } catch (error) {
                console.error("Error rendering rejected candidate:", error, candidate);
                return (
                  <Card key={candidate._id} className="border-red-300">
                    <CardContent className="p-6">
                      <p className="text-red-600">Error rendering candidate: {candidate.DoctorName || candidate._id}</p>
                    </CardContent>
                  </Card>
                );
              }
            })
          ) : (
            <div className="text-center py-12">
              <div className="text-muted-foreground">
                <XCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-semibold mb-2">No rejected candidates</h3>
                <p className="text-sm">
                  {searchTerm ? "No rejected candidates match your search criteria." : "No candidates have been rejected yet."}
                </p>
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>
      )}

      {/* Approve Confirmation Dialog */}
      <AlertDialog open={!!showApproveDialog} onOpenChange={() => setShowApproveDialog(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Approve Candidate</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to approve <strong>{showApproveDialog?.name}</strong>?
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
              disabled={processing === showApproveDialog?.id}
            >
              {processing === showApproveDialog?.id ? (
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
      <AlertDialog open={!!showRejectDialog} onOpenChange={() => setShowRejectDialog(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reject Candidate</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to reject <strong>{showRejectDialog?.name}</strong>?
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
              disabled={processing === showRejectDialog?.id}
            >
              {processing === showRejectDialog?.id ? (
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
