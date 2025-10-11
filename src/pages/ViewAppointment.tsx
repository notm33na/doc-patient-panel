import { useParams, useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const appointments = [ /* same data as before */ ];

export default function ViewAppointment() {
  const { id } = useParams();
  const navigate = useNavigate();
  const appointment = appointments.find((a) => a.id === Number(id));

  if (!appointment) {
    return <div>Appointment not found</div>;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <Card>
        <CardHeader>
          <CardTitle>Appointment Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p><strong>Patient:</strong> {appointment.patientName}</p>
          <p><strong>Doctor:</strong> {appointment.doctorName}</p>
          <p><strong>Date:</strong> {appointment.date}</p>
          <p><strong>Time:</strong> {appointment.time}</p>
          <p><strong>Location:</strong> {appointment.location}</p>
          <p><strong>Type:</strong> {appointment.type}</p>
          <p><strong>Status:</strong> {appointment.status}</p>

          <Button onClick={() => navigate(`/appointments/${appointment.id}/edit`)} className="mt-4">
            Edit
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
