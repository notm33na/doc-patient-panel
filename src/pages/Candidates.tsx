import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  Calendar
} from "lucide-react";

const pendingCandidates = [
  {
    id: 1,
    name: "Dr. Jessica Martinez",
    specialty: "Cardiology",
    email: "j.martinez@email.com",
    phone: "+1 (555) 0123",
    experience: "8 years",
    education: "Harvard Medical School",
    applicationDate: "2024-01-15",
    status: "Pending Review",
    avatar: "JM",
    documents: ["CV", "License", "Certificates", "References"],
    priority: "High"
  },
  {
    id: 2,
    name: "Dr. Ahmed Hassan",
    specialty: "Neurology",
    email: "a.hassan@email.com", 
    phone: "+1 (555) 0124",
    experience: "12 years",
    education: "Johns Hopkins University",
    applicationDate: "2024-01-14",
    status: "Documents Review",
    avatar: "AH",
    documents: ["CV", "License", "Certificates"],
    priority: "Medium"
  },
  {
    id: 3,
    name: "Dr. Maria Rodriguez",
    specialty: "Pediatrics",
    email: "m.rodriguez@email.com",
    phone: "+1 (555) 0125", 
    experience: "6 years",
    education: "Stanford Medical School",
    applicationDate: "2024-01-13",
    status: "Interview Scheduled",
    avatar: "MR",
    documents: ["CV", "License", "Certificates", "References"],
    priority: "High"
  },
  {
    id: 4,
    name: "Dr. Ryan Thompson",
    specialty: "Orthopedics",
    email: "r.thompson@email.com",
    phone: "+1 (555) 0126",
    experience: "10 years", 
    education: "Mayo Clinic College",
    applicationDate: "2024-01-12",
    status: "Background Check",
    avatar: "RT",
    documents: ["CV", "License", "Certificates", "References"],
    priority: "Low"
  }
];

const recentlyApproved = [
  {
    id: 1,
    name: "Dr. Sarah Kim",
    specialty: "Dermatology",
    approvalDate: "2024-01-10",
    reviewer: "Admin John",
    avatar: "SK"
  },
  {
    id: 2,
    name: "Dr. Michael Foster",
    specialty: "Emergency Medicine", 
    approvalDate: "2024-01-09",
    reviewer: "Admin Sarah",
    avatar: "MF"
  }
];

const rejectedCandidates = [
  {
    id: 1,
    name: "Dr. James Wilson",
    specialty: "Surgery",
    rejectionDate: "2024-01-08",
    reason: "Incomplete documentation",
    reviewer: "Admin John",
    avatar: "JW"
  }
];

export default function Candidates() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredCandidates = pendingCandidates.filter(candidate =>
    candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    candidate.specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
    candidate.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch(status.toLowerCase()) {
      case "pending review": return "bg-warning/10 text-warning border-warning/20";
      case "documents review": return "bg-primary/10 text-primary border-primary/20";
      case "interview scheduled": return "bg-info/10 text-info border-info/20";
      case "background check": return "bg-secondary/10 text-secondary border-secondary/20";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch(priority.toLowerCase()) {
      case "high": return "bg-destructive/10 text-destructive border-destructive/20";
      case "medium": return "bg-warning/10 text-warning border-warning/20";
      case "low": return "bg-success/10 text-success border-success/20";
      default: return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Doctor Candidates</h1>
          <p className="text-muted-foreground">Review and manage doctor applications and verification process</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Export List
          </Button>
          <Button className="gap-2">
            <User className="h-4 w-4" />
            Add Candidate
          </Button>
        </div>
      </div>

      {/* Search and Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <div className="lg:col-span-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search candidates..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="border border-border shadow-soft">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-warning" />
                <div>
                  <p className="text-sm text-muted-foreground">Pending Review</p>
                  <p className="text-2xl font-bold text-foreground">{pendingCandidates.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border border-border shadow-soft">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-success" />
                <div>
                  <p className="text-sm text-muted-foreground">Recently Approved</p>
                  <p className="text-2xl font-bold text-foreground">{recentlyApproved.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border border-border shadow-soft">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <XCircle className="h-5 w-5 text-destructive" />
                <div>
                  <p className="text-sm text-muted-foreground">Rejected</p>
                  <p className="text-2xl font-bold text-foreground">{rejectedCandidates.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="pending" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="pending" className="gap-2">
            <Clock className="h-4 w-4" />
            Pending ({pendingCandidates.length})
          </TabsTrigger>
          <TabsTrigger value="approved" className="gap-2">
            <CheckCircle className="h-4 w-4" />
            Approved ({recentlyApproved.length})
          </TabsTrigger>
          <TabsTrigger value="rejected" className="gap-2">
            <XCircle className="h-4 w-4" />
            Rejected ({rejectedCandidates.length})
          </TabsTrigger>
        </TabsList>

        {/* Pending Candidates */}
        <TabsContent value="pending" className="space-y-4">
          {filteredCandidates.map((candidate) => (
            <Card key={candidate.id} className="border border-border shadow-soft">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-16 w-16">
                      <AvatarFallback className="bg-gradient-primary text-white text-lg">
                        {candidate.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="text-lg font-semibold text-foreground">{candidate.name}</h3>
                      <p className="text-muted-foreground">{candidate.specialty}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge className={getStatusColor(candidate.status)}>
                          {candidate.status}
                        </Badge>
                        <Badge className={getPriorityColor(candidate.priority)}>
                          {candidate.priority} Priority
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="gap-2">
                      <Eye className="h-4 w-4" />
                      Review
                    </Button>
                    <Button size="sm" variant="outline">
                      <CheckCircle className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline">
                      <XCircle className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Email:</span>
                      <span className="text-foreground">{candidate.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Phone:</span>
                      <span className="text-foreground">{candidate.phone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Award className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Experience:</span>
                      <span className="text-foreground">{candidate.experience}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <GraduationCap className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Education:</span>
                      <span className="text-foreground">{candidate.education}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Applied:</span>
                      <span className="text-foreground">{candidate.applicationDate}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground mb-2">Submitted Documents:</p>
                  <div className="flex flex-wrap gap-2">
                    {candidate.documents.map((doc, index) => (
                      <Badge key={index} variant="outline" className="gap-1">
                        <Download className="h-3 w-3" />
                        {doc}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* Approved Candidates */}
        <TabsContent value="approved" className="space-y-4">
          {recentlyApproved.map((candidate) => (
            <Card key={candidate.id} className="border border-success/20 shadow-soft bg-gradient-to-r from-success/5 to-card">
              <CardContent className="p-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback className="bg-success text-white">
                        {candidate.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold text-foreground">{candidate.name}</h3>
                      <p className="text-sm text-muted-foreground">{candidate.specialty}</p>
                    </div>
                  </div>
                  <div className="text-right text-sm text-muted-foreground">
                    <p>Approved: {candidate.approvalDate}</p>
                    <p>By: {candidate.reviewer}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* Rejected Candidates */}
        <TabsContent value="rejected" className="space-y-4">
          {rejectedCandidates.map((candidate) => (
            <Card key={candidate.id} className="border border-destructive/20 shadow-soft bg-gradient-to-r from-destructive/5 to-card">
              <CardContent className="p-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback className="bg-destructive text-white">
                        {candidate.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold text-foreground">{candidate.name}</h3>
                      <p className="text-sm text-muted-foreground">{candidate.specialty}</p>
                      <p className="text-sm text-destructive">{candidate.reason}</p>
                    </div>
                  </div>
                  <div className="text-right text-sm text-muted-foreground">
                    <p>Rejected: {candidate.rejectionDate}</p>
                    <p>By: {candidate.reviewer}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}