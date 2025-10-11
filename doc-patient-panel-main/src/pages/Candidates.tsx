import { useState, useEffect } from "react";
import axios from "axios";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Search,
  CheckCircle,
  XCircle,
  Eye,
  Download,
  User,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Candidates() {
  const navigate = useNavigate();

  const [pending, setPending] = useState<any[]>([]);
  const [approved, setApproved] = useState<any[]>([]);
  const [rejected, setRejected] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch doctors and categorize
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/doctors");
        const data = res.data;

        setPending(data.filter((d: any) => d.status === "pending"));
        setApproved(data.filter((d: any) => d.status === "approved"));
        setRejected(data.filter((d: any) => d.status === "rejected"));
      } catch (err) {
        console.error("Error fetching doctors:", err);
      }
    };

    fetchDoctors();
  }, []);

  // Approve Doctor
  const handleApprove = async (id: string) => {
    try {
      const res = await axios.put(`http://localhost:5000/api/doctors/${id}/approve`);
      const updatedDoctor = res.data.doctor;

      // Ensure approvalDate exists
      const doctorWithDate = {
        ...updatedDoctor,
        approvalDate: updatedDoctor.approvalDate ? new Date(updatedDoctor.approvalDate) : new Date(),
      };

      setApproved((prev) => [...prev, doctorWithDate]);
      setPending((prev) => prev.filter((d) => d._id !== id));
    } catch (error) {
      console.error("Error approving doctor:", error);
    }
  };

  // Reject Doctor
  const handleReject = async (id: string) => {
    try {
      const res = await axios.put(`http://localhost:5000/api/doctors/${id}/reject`);
      const updatedDoctor = res.data.doctor;

      // Ensure rejectionDate exists
      const doctorWithDate = {
        ...updatedDoctor,
        rejectionDate: updatedDoctor.rejectionDate ? new Date(updatedDoctor.rejectionDate) : new Date(),
      };

      setRejected((prev) => [...prev, doctorWithDate]);
      setPending((prev) => prev.filter((d) => d._id !== id));
    } catch (error) {
      console.error("Error rejecting doctor:", error);
    }
  };

  // Filter pending doctors by search
  const filteredPending = pending.filter(
    (candidate) =>
      candidate.DoctorName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidate.specialization?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidate.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Badge color helpers
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending review":
        return "bg-yellow-100 text-yellow-800";
      case "approved":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case "high":
        return "bg-red-100 text-red-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Doctor Candidates</h1>
          <p className="text-muted-foreground">
            Review and manage doctor applications and verification process
          </p>
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

        {/* Pending Doctors */}
        <TabsContent value="pending" className="space-y-4">
          {filteredPending.map((doctor) => (
            <Card key={doctor._id}>
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-16 w-16">
                      <AvatarFallback>
                        {doctor.DoctorName?.split(" ")
                          .map((n: string) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="text-lg font-semibold">{doctor.DoctorName}</h3>
                      <p className="text-muted-foreground">{doctor.specialization}</p>
                      <div className="flex gap-2 mt-1">
                        <Badge className={getStatusColor("pending review")}>
                          Pending Review
                        </Badge>
                        <Badge className={getPriorityColor("medium")}>
                          Medium Priority
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => navigate(`/review/${doctor._id}`)}
                    >
                      <Eye className="h-4 w-4" /> Review
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-green-600"
                      onClick={() => handleApprove(doctor._id)}
                    >
                      <CheckCircle className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-red-600"
                      onClick={() => handleReject(doctor._id)}
                    >
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
            <Card key={c._id} className="border border-green-300">
              <CardContent className="p-4">
                <h3 className="font-semibold">{c.DoctorName}</h3>
                <p className="text-sm text-muted-foreground">{c.specialization}</p>
                <p className="text-xs text-muted-foreground">
                  Approved: {c.approvalDate ? new Date(c.approvalDate).toLocaleDateString() : "Pending"}
                </p>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* Rejected */}
        <TabsContent value="rejected" className="space-y-4">
          {rejected.map((c) => (
            <Card key={c._id} className="border border-red-300">
              <CardContent className="p-4">
                <h3 className="font-semibold">{c.DoctorName}</h3>
                <p className="text-sm text-muted-foreground">{c.specialization}</p>
                <p className="text-xs text-destructive">
                  Rejected: {c.rejectionDate ? new Date(c.rejectionDate).toLocaleDateString() : "Pending"}
                </p>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
