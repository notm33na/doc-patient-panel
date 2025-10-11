import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import axios from "axios";
import { toast } from "@/components/ui/use-toast";

export default function AddCandidate() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    DoctorName: "",
    email: "",
    password: "",
    specialization: "",
    phone: "",
    department: "",
    sentiment: "neutral",
    sentiment_score: "",
    no_of_patients: "",
  });

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const payload = {
        ...form,
        no_of_patients: Number(form.no_of_patients) || 0,
        sentiment_score: Number(form.sentiment_score) || 0,
      };

      const res = await axios.post("http://localhost:5000/api/doctors", payload);

      toast({
        title: "Doctor Added Successfully",
        description: `${form.DoctorName} has been registered successfully.`,
      });

      navigate("/candidates");
    } catch (error: any) {
      console.error("Error adding doctor:", error);
      toast({
        title: "Error Adding Doctor",
        description: error.response?.data?.message || error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <Card className="shadow-soft">
        <CardContent className="p-6">
          <h1 className="text-2xl font-bold mb-4">Add Doctor</h1>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <Label>Doctor Name</Label>
              <Input
                placeholder="Dr. Sarah Ahmed"
                value={form.DoctorName}
                onChange={(e) => handleChange("DoctorName", e.target.value)}
                required
              />
            </div>

            <div>
              <Label>Email</Label>
              <Input
                type="email"
                placeholder="doctor@example.com"
                value={form.email}
                onChange={(e) => handleChange("email", e.target.value)}
                required
              />
            </div>

            <div>
              <Label>Password</Label>
              <Input
                type="password"
                placeholder="Enter password"
                value={form.password}
                onChange={(e) => handleChange("password", e.target.value)}
                required
              />
            </div>

            <div>
              <Label>Phone</Label>
              <Input
                placeholder="+92-300-1234567"
                value={form.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
              />
            </div>

            <div>
              <Label>Specialization</Label>
              <Input
                placeholder="e.g. Cardiology"
                value={form.specialization}
                onChange={(e) => handleChange("specialization", e.target.value)}
              />
            </div>

            <div>
              <Label>Department</Label>
              <Select
                value={form.department}
                onValueChange={(value) => handleChange("department", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Heart & Vascular">Heart & Vascular</SelectItem>
                  <SelectItem value="Neurology">Neurology</SelectItem>
                  <SelectItem value="Orthopedics">Orthopedics</SelectItem>
                  <SelectItem value="Pediatrics">Pediatrics</SelectItem>
                  <SelectItem value="General Medicine">General Medicine</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Sentiment</Label>
              <Select
                value={form.sentiment}
                onValueChange={(value) => handleChange("sentiment", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Sentiment" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="positive">Positive</SelectItem>
                  <SelectItem value="neutral">Neutral</SelectItem>
                  <SelectItem value="negative">Negative</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Sentiment Score (0.0 - 1.0)</Label>
              <Input
                type="number"
                step="0.01"
                placeholder="0.92"
                value={form.sentiment_score}
                onChange={(e) => handleChange("sentiment_score", e.target.value)}
              />
            </div>

            <div>
              <Label>Number of Patients</Label>
              <Input
                type="number"
                placeholder="134"
                value={form.no_of_patients}
                onChange={(e) => handleChange("no_of_patients", e.target.value)}
              />
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button
                variant="outline"
                type="button"
                onClick={() => navigate("/candidates")}
              >
                Cancel
              </Button>
              <Button type="submit">Save Doctor</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
