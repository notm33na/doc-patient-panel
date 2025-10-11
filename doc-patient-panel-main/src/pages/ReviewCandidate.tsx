import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function ReviewCandidate() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [doctor, setDoctor] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch doctor data from backend
  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/doctors/${id}`);
        setDoctor(res.data);
      } catch (error) {
        console.error("Error fetching doctor:", error);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchDoctor();
  }, [id]);

  // ✅ Approve doctor
  const handleApprove = async () => {
    try {
      await axios.put(`http://localhost:5000/api/doctors/${id}/approve`);
      navigate("/candidates");
    } catch (error) {
      console.error("Error approving doctor:", error);
    }
  };

  // ❌ Reject doctor
  const handleReject = async () => {
    try {
      await axios.put(`http://localhost:5000/api/doctors/${id}/reject`);
      navigate("/candidates");
    } catch (error) {
      console.error("Error rejecting doctor:", error);
    }
  };

  if (loading) return <p className="text-center py-10">Loading doctor details...</p>;
  if (!doctor) return <p className="text-center text-red-500 py-10">Doctor not found.</p>;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <Card>
        <CardContent className="p-6 space-y-4">
          <h1 className="text-2xl font-bold">{doctor.DoctorName}</h1>
          <p className="text-muted-foreground">{doctor.specialization || "N/A"}</p>

          <div className="space-y-1">
            <p><strong>Email:</strong> {doctor.email}</p>
            <p><strong>Phone:</strong> {doctor.phone || "N/A"}</p>
            <p><strong>Department:</strong> {doctor.department || "N/A"}</p>
            <p><strong>Sentiment:</strong> {doctor.sentiment || "N/A"}</p>
            <p><strong>No. of Patients:</strong> {doctor.no_of_patients ?? "N/A"}</p>
            <p><strong>About :</strong> {doctor.about ?? "N/A"}</p>
            <p><strong>medicalDegree :</strong> {doctor.medicalDegree ?? "N/A"}</p>
            <p><strong>residency: :</strong> {doctor.residency ?? "N/A"}</p>
            <p><strong>fellowship :</strong> {doctor.fellowship ?? "N/A"}</p>
            <p><strong>boardCertification :</strong> {doctor.boardCertification ?? "N/A"}</p>
            <p><strong>boardCertification :</strong> {doctor.boardCertification ?? "N/A"}</p>
            <p><strong>licenses :</strong> {doctor.licenses ?? "N/A"}</p>
            <p><strong>deaRegistration :</strong> {doctor.deaRegistration ?? "N/A"}</p>
            <p><strong>hospitalAffiliations :</strong> {doctor.hospitalAffiliations ?? "N/A"}</p>
            <p><strong>memberships :</strong> {doctor.memberships ?? "N/A"}</p>
            <p><strong>malpracticeInsurance :</strong> {doctor.malpracticeInsurance ?? "N/A"}</p>
            <p><strong>address :</strong> {doctor.address ?? "N/A"}</p>
            <p><strong>education :</strong> {doctor.education ?? "N/A"}</p>
            <p>
              <strong>Status:</strong>{" "}
              <Badge>{doctor.status}</Badge>
            </p>
            <p><strong>Joined:</strong> {new Date(doctor.createdAt).toLocaleDateString()}</p>
          </div>

          <div className="flex gap-3 pt-4">
            <Button onClick={handleApprove} className="bg-green-500 hover:bg-green-600">Approve</Button>
            <Button onClick={handleReject} variant="destructive">Reject</Button>
            <Button variant="outline" onClick={() => navigate("/candidates")}>Back</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
 