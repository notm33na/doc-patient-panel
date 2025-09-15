import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Search, 
  Star, 
  TrendingUp, 
  AlertTriangle, 
  UserX,
  Filter,
  Eye,
  Flag
} from "lucide-react";

const topRankedDoctors = [
  {
    id: 1,
    name: "Dr. Sarah Wilson",
    specialty: "Cardiology",
    rating: 4.9,
    totalReviews: 342,
    avatar: "SW",
    recentFeedback: "Excellent bedside manner and expertise",
    trend: "+0.2"
  },
  {
    id: 2,
    name: "Dr. Michael Chen",
    specialty: "Neurology", 
    rating: 4.8,
    totalReviews: 298,
    avatar: "MC",
    recentFeedback: "Very thorough and knowledgeable",
    trend: "+0.1"
  },
  {
    id: 3,
    name: "Dr. Emily Davis",
    specialty: "Pediatrics",
    rating: 4.7,
    totalReviews: 256,
    avatar: "ED",
    recentFeedback: "Great with children, very patient",
    trend: "+0.3"
  },
  {
    id: 4,
    name: "Dr. Robert Kim",
    specialty: "Orthopedics",
    rating: 4.6,
    totalReviews: 189,
    avatar: "RK",
    recentFeedback: "Professional and effective treatment",
    trend: "-0.1"
  }
];

const flaggedComments = [
  {
    id: 1,
    patientName: "Anonymous",
    doctorName: "Dr. James Brown",
    comment: "Terrible experience, doctor was very rude and dismissive. Would not recommend.",
    severity: "High",
    date: "2024-01-15",
    status: "Under Review",
    flags: ["Inappropriate Language", "Service Complaint"]
  },
  {
    id: 2,
    patientName: "Mary Johnson",
    doctorName: "Dr. Lisa Anderson",
    comment: "Doctor seemed unprepared and kept me waiting for 2 hours without explanation.",
    severity: "Medium",
    date: "2024-01-14", 
    status: "Investigating",
    flags: ["Wait Time Complaint", "Professionalism"]
  },
  {
    id: 3,
    patientName: "Anonymous",
    doctorName: "Dr. David Wilson",
    comment: "Misdiagnosed my condition twice. I had to seek a second opinion elsewhere.",
    severity: "High",
    date: "2024-01-13",
    status: "Escalated",
    flags: ["Medical Concern", "Misdiagnosis"]
  }
];

const suspendedDoctors = [
  {
    id: 1,
    name: "Dr. James Brown",
    specialty: "General Medicine",
    suspensionDate: "2024-01-10",
    reason: "Multiple patient complaints",
    duration: "30 days",
    avatar: "JB",
    status: "Active Suspension",
    reviewDate: "2024-02-09"
  },
  {
    id: 2,
    name: "Dr. Mark Thompson",
    specialty: "Surgery",
    suspensionDate: "2024-01-05",
    reason: "License verification pending",
    duration: "Indefinite",
    avatar: "MT",
    status: "Under Investigation",
    reviewDate: "2024-01-20"
  }
];

export default function FeedbackAnalysis() {
  const [searchTerm, setSearchTerm] = useState("");

  const getSeverityColor = (severity: string) => {
    switch(severity.toLowerCase()) {
      case "high": return "bg-destructive/10 text-destructive border-destructive/20";
      case "medium": return "bg-warning/10 text-warning border-warning/20";
      case "low": return "bg-muted text-muted-foreground border-border";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getStatusColor = (status: string) => {
    switch(status.toLowerCase()) {
      case "under review": return "bg-primary/10 text-primary border-primary/20";
      case "investigating": return "bg-warning/10 text-warning border-warning/20";
      case "escalated": return "bg-destructive/10 text-destructive border-destructive/20";
      case "active suspension": return "bg-destructive/10 text-destructive border-destructive/20";
      case "under investigation": return "bg-warning/10 text-warning border-warning/20";
      default: return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Feedback Analysis</h1>
          <p className="text-muted-foreground">Monitor doctor performance, flagged comments, and suspended accounts</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Filter className="h-4 w-4" />
            Filter
          </Button>
          <Button className="gap-2">
            <TrendingUp className="h-4 w-4" />
            Generate Report
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Search doctors, comments, or issues..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Tabs */}
      <Tabs defaultValue="top-ranked" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="top-ranked" className="gap-2">
            <Star className="h-4 w-4" />
            Top Ranked Doctors
          </TabsTrigger>
          <TabsTrigger value="flagged" className="gap-2">
            <Flag className="h-4 w-4" />
            Flagged Comments
          </TabsTrigger>
          <TabsTrigger value="suspended" className="gap-2">
            <UserX className="h-4 w-4" />
            Suspended Doctors
          </TabsTrigger>
        </TabsList>

        {/* Top Ranked Doctors */}
        <TabsContent value="top-ranked" className="space-y-4">
          <Card className="border border-border shadow-soft">
            <CardHeader>
              <CardTitle>Top Performing Doctors</CardTitle>
              <CardDescription>Doctors with highest ratings and positive feedback</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topRankedDoctors.map((doctor, index) => (
                  <div key={doctor.id} className="flex items-center justify-between p-4 border border-border rounded-lg bg-gradient-to-r from-card to-card/80">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-bold text-primary">#{index + 1}</span>
                        <Avatar className="h-12 w-12">
                          <AvatarFallback className="bg-gradient-primary text-white">
                            {doctor.avatar}
                          </AvatarFallback>
                        </Avatar>
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">{doctor.name}</h3>
                        <p className="text-sm text-muted-foreground">{doctor.specialty}</p>
                        <p className="text-xs text-muted-foreground italic">"{doctor.recentFeedback}"</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1 mb-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-semibold">{doctor.rating}</span>
                        <span className={`text-xs ${doctor.trend.startsWith('+') ? 'text-success' : 'text-destructive'}`}>
                          ({doctor.trend})
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">{doctor.totalReviews} reviews</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Flagged Comments */}
        <TabsContent value="flagged" className="space-y-4">
          <Card className="border border-border shadow-soft">
            <CardHeader>
              <CardTitle>Flagged Comments</CardTitle>
              <CardDescription>Comments requiring attention or investigation</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {flaggedComments.map((comment) => (
                  <div key={comment.id} className="p-4 border border-border rounded-lg bg-gradient-to-r from-card to-card/80">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-2">
                        <Badge className={getSeverityColor(comment.severity)}>
                          <AlertTriangle className="h-3 w-3 mr-1" />
                          {comment.severity} Priority
                        </Badge>
                        <Badge className={getStatusColor(comment.status)}>
                          {comment.status}
                        </Badge>
                      </div>
                      <span className="text-sm text-muted-foreground">{comment.date}</span>
                    </div>
                    
                    <div className="mb-3">
                      <p className="text-sm font-medium text-foreground mb-1">
                        Patient: {comment.patientName} → Doctor: {comment.doctorName}
                      </p>
                      <p className="text-sm text-muted-foreground italic">"{comment.comment}"</p>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div className="flex gap-2">
                        {comment.flags.map((flag, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {flag}
                          </Badge>
                        ))}
                      </div>
                      <Button size="sm" variant="outline" className="gap-2">
                        <Eye className="h-3 w-3" />
                        Review
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Suspended Doctors */}
        <TabsContent value="suspended" className="space-y-4">
          <Card className="border border-border shadow-soft">
            <CardHeader>
              <CardTitle>Suspended Doctors</CardTitle>
              <CardDescription>Doctors currently under suspension or investigation</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {suspendedDoctors.map((doctor) => (
                  <div key={doctor.id} className="p-4 border border-border rounded-lg bg-gradient-to-r from-destructive/5 to-card">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-4">
                        <Avatar className="h-12 w-12">
                          <AvatarFallback className="bg-destructive text-white">
                            {doctor.avatar}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold text-foreground">{doctor.name}</h3>
                          <p className="text-sm text-muted-foreground">{doctor.specialty}</p>
                          <p className="text-sm text-destructive">{doctor.reason}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge className={getStatusColor(doctor.status)}>
                          {doctor.status}
                        </Badge>
                        <div className="mt-2 text-sm text-muted-foreground">
                          <p>Suspended: {doctor.suspensionDate}</p>
                          <p>Duration: {doctor.duration}</p>
                          <p>Review: {doctor.reviewDate}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}