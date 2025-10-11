import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { format } from "timeago.js";

export function NewDoctors() {
  const [doctors, setDoctors] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/doctors");
        const data = await response.json();
        setDoctors(data);
      } catch (error) {
        console.error("Error fetching doctors:", error);
      }
    };

    fetchDoctors();
  }, []);

  return (
    <Card className="shadow-soft">
      <CardHeader>
        <CardTitle className="text-base">New Doctors</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {doctors.length === 0 ? (
          <p className="text-sm text-muted-foreground">No doctors found.</p>
        ) : (
          doctors.slice(-5).map((doctor) => (
            <div key={doctor._id} className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src="/placeholder-doctor.jpg" alt={doctor.DoctorName} />
                <AvatarFallback className="bg-gradient-secondary text-xs">
                  {doctor.DoctorName?.split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">
                  {doctor.DoctorName}
                </p>
                <p className="text-xs text-muted-foreground">
                  {doctor.specialization} — {doctor.department}
                </p>
              </div>

              <div className="text-right">
                <p className="text-xs text-muted-foreground">
                  {format(doctor.createdAt)}
                </p>
              </div>
            </div>
          ))
        )}

        <Button
          variant="outline"
          className="w-full mt-4"
          size="sm"
          onClick={() => navigate("/doctors")}
        >
          View All
        </Button>
      </CardContent>
    </Card>
  );
}
