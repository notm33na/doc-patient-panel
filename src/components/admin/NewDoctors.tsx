import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
const newDoctors = [
  {
    id: 1,
    name: "Theodore Handle",
    specialty: "Dentist - Specialist",
    time: "2 hours ago",
    avatar: "/placeholder-doctor1.jpg"
  },
  {
    id: 2,
    name: "Eric Widget",
    specialty: "Fever - Specialist",
    time: "2 hours ago",
    avatar: "/placeholder-doctor2.jpg"
  },
  {
    id: 3,
    name: "Pearce Margold",
    specialty: "Allergy - Specialist", 
    time: "4 hours ago",
    avatar: "/placeholder-doctor3.jpg"
  },
  {
    id: 4,
    name: "Eric Widget",
    specialty: "Fever - Specialist",
    time: "2 hours ago",
    avatar: "/placeholder-doctor2.jpg"
  },
  {
    id: 5,
    name: "Pearce Margold",
    specialty: "Allergy - Specialist", 
    time: "4 hours ago",
    avatar: "/placeholder-doctor3.jpg"
  }
];

export function NewDoctors() {
  const navigate = useNavigate();
  return (
    <Card className="shadow-soft">
      <CardHeader>
        <CardTitle className="text-base">New Doctors</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {newDoctors.map((doctor) => (
          <div key={doctor.id} className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={doctor.avatar} />
              <AvatarFallback className="bg-gradient-secondary text-xs">
                {doctor.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground">{doctor.name}</p>
              <p className="text-xs text-muted-foreground">{doctor.specialty}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground">{doctor.time}</p>
            </div>
          </div>
        ))}
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