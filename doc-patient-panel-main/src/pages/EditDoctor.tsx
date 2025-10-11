import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import axios from "axios";

export default function EditDoctor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [doctor, setDoctor] = useState({
    DoctorName: "",
    specialization: "",
    email: "",
    phone: "",
    department: "",
    sentiment: "",
    sentiment_score: "",
    no_of_patients: "",
  });

  // ✅ Fetch doctor data by ID
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
    fetchDoctor();
  }, [id]);

  // ✅ Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDoctor({ ...doctor, [e.target.name]: e.target.value });
  };

  // ✅ Save changes to backend
  const handleSave = async () => {
    setSaving(true);
    try {
      await axios.put(`http://localhost:5000/api/doctors/${id}`, doctor);
      navigate("/doctors"); // redirect after saving
    } catch (error) {
      console.error("Error updating doctor:", error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <p>Loading doctor details...</p>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Edit Doctor Profile</h1>
      <Card>
        <CardHeader>
          <CardTitle>Doctor Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            name="DoctorName"
            placeholder="Doctor Name"
            value={doctor.DoctorName}
            onChange={handleChange}
          />
          <Input
            name="specialization"
            placeholder="Specialty"
            value={doctor.specialization}
            onChange={handleChange}
          />
          <Input
            name="email"
            placeholder="Email"
            value={doctor.email}
            onChange={handleChange}
          />
          <Input
            name="phone"
            placeholder="Phone"
            value={doctor.phone}
            onChange={handleChange}
          />
          <Input
            name="department"
            placeholder="Department"
            value={doctor.department}
            onChange={handleChange}
          />
          <Input
            name="sentiment"
            placeholder="Sentiment"
            value={doctor.sentiment}
            onChange={handleChange}
          />
          <Input
            name="sentiment_score"
            placeholder="Sentiment Score"
            value={doctor.sentiment_score}
            onChange={handleChange}
          />
          <Input
            name="no_of_patients"
            placeholder="No. of Patients"
            value={doctor.no_of_patients}
            onChange={handleChange}
          />

          <Button
            className="w-full"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
