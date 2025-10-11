import { useParams } from "react-router-dom";
import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const appointments = [ /* same data */ ];

export default function EditAppointment() {
  const { id } = useParams();
  const appointment = appointments.find((a) => a.id === Number(id));
  const [form, setForm] = useState(appointment);

  if (!appointment) {
    return <div>Appointment not found</div>;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    console.log("Updated appointment:", form);
    // Save logic here (API call, etc.)
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <Card>
        <CardHeader>
          <CardTitle>Edit Appointment</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Input name="patientName" value={form.patientName} onChange={handleChange} placeholder="Patient Name" />
          <Input name="doctorName" value={form.doctorName} onChange={handleChange} placeholder="Doctor Name" />
          <Input name="date" value={form.date} onChange={handleChange} placeholder="Date" />
          <Input name="time" value={form.time} onChange={handleChange} placeholder="Time" />
          <Input name="location" value={form.location} onChange={handleChange} placeholder="Location" />
          <Input name="type" value={form.type} onChange={handleChange} placeholder="Type" />
          <Input name="status" value={form.status} onChange={handleChange} placeholder="Status" />

          <Button onClick={handleSave} className="mt-4">Save</Button>
        </CardContent>
      </Card>
    </div>
  );
}
