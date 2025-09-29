import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function ReviewCandidate() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Normally you'd fetch candidate data from API here using id
  const candidate = {
    id,
    name: "Dr. Jessica Martinez",
    specialty: "Cardiology",
    email: "j.martinez@email.com",
    phone: "+1 (555) 0123",
    experience: "8 years",
    education: "Harvard Medical School",
    applicationDate: "2024-01-15"
  };

  const handleApprove = () => {
    console.log("Approved candidate", candidate.id);
    navigate("/candidates");
  };

  const handleReject = () => {
    console.log("Rejected candidate", candidate.id);
    navigate("/candidates");
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <Card>
        <CardContent className="p-6 space-y-4">
          <h1 className="text-2xl font-bold">{candidate.name}</h1>
          <p className="text-muted-foreground">{candidate.specialty}</p>
          <div>
            <p>Email: {candidate.email}</p>
            <p>Phone: {candidate.phone}</p>
            <p>Experience: {candidate.experience}</p>
            <p>Education: {candidate.education}</p>
            <p>Applied: {candidate.applicationDate}</p>
          </div>
          <div className="flex gap-2">
            <Button onClick={handleApprove} className="bg-green-500 hover:bg-green-600">Approve</Button>
            <Button onClick={handleReject} variant="destructive">Reject</Button>
            <Button variant="outline" onClick={() => navigate("/candidates")}>Back</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
