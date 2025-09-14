import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Calendar, Clock, MapPin, Phone, Video } from "lucide-react";

const appointments = [
  {
    id: 1,
    patientName: "Louise Watson",
    doctorName: "Dr. Smith",
    date: "2024-01-25",
    time: "09:27 AM",
    location: "XYZ",
    status: "Completed",
    type: "In-person",
    avatar: "/placeholder-avatar.jpg"
  },
  {
    id: 2,
    patientName: "Darlene Robertson",
    doctorName: "Dr. Johnson",
    date: "2024-01-25",
    time: "10:15 AM",
    location: "XYZ",
    status: "Re-Scheduled",
    type: "Video Call",
    avatar: "/placeholder-avatar.jpg"
  },
  {
    id: 3,
    patientName: "Jacob Jones",
    doctorName: "Dr. Wilson",
    date: "2024-01-25",
    time: "10:24 AM",
    location: "XYZ",
    status: "Completed",
    type: "In-person",
    avatar: "/placeholder-avatar.jpg"
  },
  {
    id: 4,
    patientName: "Kathryn Murphy",
    doctorName: "Dr. Brown",
    date: "2024-01-25",
    time: "09:10 AM",
    location: "XYZ",
    status: "Completed",
    type: "Phone Call",
    avatar: "/placeholder-avatar.jpg"
  },
  {
    id: 5,
    patientName: "Leslie Alexander",
    doctorName: "Dr. Davis",
    date: "2024-01-25",
    time: "09:15 AM",
    location: "XYZ",
    status: "Completed",
    type: "Video Call",
    avatar: "/placeholder-avatar.jpg"
  },
  {
    id: 6,
    patientName: "Ronald Richards",
    doctorName: "Dr. Miller",
    date: "2024-01-25",
    time: "09:20 AM",
    location: "XYZ",
    status: "Completed",
    type: "In-person",
    avatar: "/placeholder-avatar.jpg"
  },
  {
    id: 7,
    patientName: "Jenny Wilson",
    doctorName: "Dr. Garcia",
    date: "2024-01-25",
    time: "11:30 AM",
    location: "XYZ",
    status: "Cancelled",
    type: "Video Call",
    avatar: "/placeholder-avatar.jpg"
  }
];

export default function AppointmentsList() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredAppointments = appointments.filter(appointment =>
    appointment.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    appointment.doctorName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Completed":
        return <Badge className="bg-success/10 text-success border-success/20">Completed</Badge>;
      case "Re-Scheduled":
        return <Badge className="bg-warning/10 text-warning border-warning/20">Re-Scheduled</Badge>;
      case "Cancelled":
        return <Badge variant="destructive" className="bg-destructive/10 text-destructive">Cancelled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "Video Call":
        return <Video className="h-4 w-4" />;
      case "Phone Call":
        return <Phone className="h-4 w-4" />;
      default:
        return <MapPin className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">All Appointments</h1>
          <p className="text-muted-foreground">Manage and monitor all appointments</p>
        </div>
        <Button className="bg-gradient-primary">
          <Calendar className="h-4 w-4 mr-2" />
          Schedule New
        </Button>
      </div>

      <Card className="shadow-soft">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Appointment Overview</CardTitle>
            <div className="relative w-72">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search appointments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Patient Name</TableHead>
                  <TableHead>Doctor</TableHead>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAppointments.map((appointment) => (
                  <TableRow key={appointment.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center text-white text-sm font-medium">
                          {appointment.patientName.split(' ').map(n => n[0]).join('')}
                        </div>
                        <span className="font-medium">{appointment.patientName}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{appointment.doctorName}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        {appointment.time}
                      </div>
                      <div className="text-sm text-muted-foreground">{appointment.date}</div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{appointment.location}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        {getTypeIcon(appointment.type)}
                        <span className="text-sm">{appointment.type}</span>
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(appointment.status)}</TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button variant="outline" size="sm">
                          View
                        </Button>
                        <Button variant="outline" size="sm">
                          Edit
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}