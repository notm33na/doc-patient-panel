import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const appointments = [
  {
    id: 1,
    patient: "Leslie Watson",
    location: "XYZ",
    checkIn: "09:27 AM",
    status: "Completed",
    avatar: "/placeholder-patient1.jpg"
  },
  {
    id: 2,
    patient: "Darlene Robertson", 
    location: "XYZ",
    checkIn: "10:15 AM",
    status: "Re-Scheduled",
    avatar: "/placeholder-patient2.jpg"
  },
  {
    id: 3,
    patient: "Jacob Jones",
    location: "XYZ", 
    checkIn: "10:24 AM",
    status: "Completed",
    avatar: "/placeholder-patient3.jpg"
  },
  {
    id: 4,
    patient: "Kathryn Murphy",
    location: "XYZ",
    checkIn: "09:10 AM", 
    status: "Completed",
    avatar: "/placeholder-patient4.jpg"
  },
  {
    id: 5,
    patient: "Leslie Alexander",
    location: "XYZ",
    checkIn: "09:15 AM",
    status: "Completed", 
    avatar: "/placeholder-patient5.jpg"
  },
  {
    id: 6,
    patient: "Ronald Richards",
    location: "XYZ",
    checkIn: "09:29 AM",
    status: "Completed",
    avatar: "/placeholder-patient6.jpg"
  },
  {
    id: 7,
    patient: "Jenny Wilson",
    location: "XYZ",
    checkIn: "11:50 AM",
    status: "Re-Scheduled",
    avatar: "/placeholder-patient7.jpg"
  }
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "Completed":
      return "bg-success/10 text-success border-success/20";
    case "Re-Scheduled":
      return "bg-warning/10 text-warning border-warning/20";
    case "Cancelled":
      return "bg-destructive/10 text-destructive border-destructive/20";
    default:
      return "bg-primary/10 text-primary border-primary/20";
  }
};

export function AppointmentOverview() {
    const navigate = useNavigate();
  
  return (
    <Card className="shadow-soft">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-base">Appointment Overview</CardTitle>
        <Button
        variant="ghost"
        size="sm"
        className="text-primary"
        onClick={() => navigate("/appointments")}
      >
        View All
      </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-1">
          {/* Header */}
          <div className="grid grid-cols-4 gap-4 py-2 text-xs font-medium text-muted-foreground border-b">
            <div>Patient Name</div>
            <div>Location</div>
            <div>Check In Time</div>
            <div>Status</div>
          </div>
          
          {/* Appointments */}
          {appointments.map((appointment) => (
            <div key={appointment.id} className="grid grid-cols-4 gap-4 py-3 items-center hover:bg-accent/50 rounded-lg transition-smooth">
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={appointment.avatar} />
                  <AvatarFallback className="bg-gradient-secondary text-xs">
                    {appointment.patient.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium">{appointment.patient}</span>
              </div>
              <div className="text-sm text-muted-foreground">{appointment.location}</div>
              <div className="text-sm text-muted-foreground">{appointment.checkIn}</div>
              <div>
                <Badge className={getStatusColor(appointment.status)}>
                  {appointment.status}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}