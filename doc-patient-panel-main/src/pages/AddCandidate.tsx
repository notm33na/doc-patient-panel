import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function AddCandidate() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    specialty: "",
    email: "",
    phone: "",
    experience: "",
    education: "",
    status: "Pending Review",
    priority: "Medium"
  });

  const handleChange = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // ✅ Ideally send this to API or update global state
    console.log("New candidate:", form);
    navigate("/candidates"); // go back to list after save
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <Card className="shadow-soft">
        <CardContent className="p-6">
          <h1 className="text-2xl font-bold mb-4">Add Candidate</h1>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <Label>Name</Label>
              <Input value={form.name} onChange={(e) => handleChange("name", e.target.value)} required />
            </div>
            <div>
              <Label>Specialty</Label>
              <Input value={form.specialty} onChange={(e) => handleChange("specialty", e.target.value)} required />
            </div>
            <div>
              <Label>Email</Label>
              <Input type="email" value={form.email} onChange={(e) => handleChange("email", e.target.value)} required />
            </div>
            <div>
              <Label>Phone</Label>
              <Input value={form.phone} onChange={(e) => handleChange("phone", e.target.value)} required />
            </div>
            <div>
              <Label>Experience</Label>
              <Input placeholder="e.g. 8 years" value={form.experience} onChange={(e) => handleChange("experience", e.target.value)} />
            </div>
            <div>
              <Label>Education</Label>
              <Input value={form.education} onChange={(e) => handleChange("education", e.target.value)} />
            </div>
            <div>
              <Label>Priority</Label>
              <Select value={form.priority} onValueChange={(value) => handleChange("priority", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" type="button" onClick={() => navigate("/candidates")}>
                Cancel
              </Button>
              <Button type="submit">Save Candidate</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
