import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function EditPatient() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    doctor: "",
    disease: "",
    status: "active",
  });

  // Fetch patient data
  useEffect(() => {
    const fetchPatient = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/patients/${id}`);
        const patient = res.data.patient;
        setForm({
          name: patient.name || "",
          email: patient.email || "",
          phone: patient.phone || "",
          doctor: patient.doctorId?._id || "",
          disease: patient.disease || "",
          status: patient.status || "active",
        });
      } catch (err) {
        console.error(err);
      }
    };
    fetchPatient();
  }, [id]);

  const handleChange = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    try {
      await axios.put(`http://localhost:5000/api/patients/${id}`, form);
      navigate(-1); // go back to patients list
    } catch (err) {
      console.error("Failed to update patient:", err);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      <h1 className="text-3xl font-bold">Edit Patient</h1>
      <Card>
        <CardContent className="space-y-4 p-6">
          <div>
            <Label>Name</Label>
            <Input value={form.name} onChange={(e) => handleChange("name", e.target.value)} />
          </div>
          <div>
            <Label>Email</Label>
            <Input value={form.email} onChange={(e) => handleChange("email", e.target.value)} />
          </div>
          <div>
            <Label>Phone</Label>
            <Input value={form.phone} onChange={(e) => handleChange("phone", e.target.value)} />
          </div>
          <div>
            <Label>Condition</Label>
            <Input value={form.disease} onChange={(e) => handleChange("disease", e.target.value)} />
          </div>
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => navigate(-1)}>Cancel</Button>
            <Button onClick={handleSave}>Save</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
