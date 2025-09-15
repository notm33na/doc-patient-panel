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
import { useNavigate } from "react-router-dom";

export default function Candidates() {
  const navigate = useNavigate();

  const [pending, setPending] = useState([
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
    }
  ]);
  const [approved, setApproved] = useState([]);
  const [rejected, setRejected] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");

  const handleApprove = (id: number) => {
    const candidate = pending.find(c => c.id === id);
    if (!candidate) return;
    setApproved(prev => [...prev, { ...candidate, approvalDate: new Date().toISOString().split("T")[0], reviewer: "Admin User" }]);
    setPending(prev => prev.filter(c => c.id !== id));
  };

  const handleReject = (id: number) => {
    const candidate = pending.find(c => c.id === id);
    if (!candidate) return;
    setRejected(prev => [...prev, { ...candidate, rejectionDate: new Date().toISOString().split("T")[0], reason: "Rejected by admin", reviewer: "Admin User" }]);
    setPending(prev => prev.filter(c => c.id !== id));
  };

  const filteredCandidates = pending.filter(candidate =>
    candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    candidate.specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
    candidate.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending review": return "bg-warning/10 text-warning border-warning/20";
      case "documents review": return "bg-primary/10 text-primary border-primary/20";
      case "interview scheduled": return "bg-info/10 text-info border-info/20";
      case "background check": return "bg-secondary/10 text-secondary border-secondary/20";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
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
          <Button variant="outline" className="gap-2" onClick={() => navigate("/export-list")}>
            <Download className="h-4 w-4" />
            Export List
          </Button>
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

      {/* Tabs */}
      <Tabs defaultValue="pending" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="pending">Pending ({pending.length})</TabsTrigger>
          <TabsTrigger value="approved">Approved ({approved.length})</TabsTrigger>
          <TabsTrigger value="rejected">Rejected ({rejected.length})</TabsTrigger>
        </TabsList>

        {/* Pending */}
        <TabsContent value="pending" className="space-y-4">
          {filteredCandidates.map((candidate) => (
            <Card key={candidate.id}>
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-16 w-16">
                      <AvatarFallback>{candidate.avatar}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="text-lg font-semibold">{candidate.name}</h3>
                      <p className="text-muted-foreground">{candidate.specialty}</p>
                      <div className="flex gap-2 mt-1">
                        <Badge className={getStatusColor(candidate.status)}>{candidate.status}</Badge>
                        <Badge className={getPriorityColor(candidate.priority)}>{candidate.priority} Priority</Badge>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => navigate(`/review/${candidate.id}`)}>
                      <Eye className="h-4 w-4" /> Review
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleApprove(candidate.id)}>
                      <CheckCircle className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleReject(candidate.id)}>
                      <XCircle className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* Approved */}
        <TabsContent value="approved" className="space-y-4">
          {approved.map((c) => (
            <Card key={c.id} className="border border-green-300">
              <CardContent className="p-4">
                <h3 className="font-semibold">{c.name}</h3>
                <p className="text-sm text-muted-foreground">{c.specialty}</p>
                <p className="text-xs text-muted-foreground">Approved: {c.approvalDate}</p>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* Rejected */}
        <TabsContent value="rejected" className="space-y-4">
          {rejected.map((c) => (
            <Card key={c.id} className="border border-red-300">
              <CardContent className="p-4">
                <h3 className="font-semibold">{c.name}</h3>
                <p className="text-sm text-muted-foreground">{c.specialty}</p>
                <p className="text-xs text-destructive">Rejected: {c.rejectionDate}</p>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
