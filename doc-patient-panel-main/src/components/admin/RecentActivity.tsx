import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Clock, User, Calendar, FileText } from "lucide-react";

const activities = [
  {
    id: 1,
    type: "doctor",
    title: "New doctor registration",
    description: "Dr. Sarah Johnson has completed registration",
    time: "2 hours ago",
    avatar: "/placeholder-doctor.jpg",
    status: "success"
  },
  {
    id: 2,
    type: "appointment",
    title: "Appointment scheduled",
    description: "Patient John Doe scheduled with Dr. Smith",
    time: "4 hours ago",
    avatar: "/placeholder-patient.jpg",
    status: "info"
  },
  {
    id: 3,
    type: "article",
    title: "Article submission",
    description: "Dr. Williams submitted article on heart disease",
    time: "6 hours ago",
    avatar: "/placeholder-doctor.jpg",
    status: "warning"
  },
  {
    id: 4,
    type: "feedback",
    title: "Patient feedback",
    description: "5-star rating received for Dr. Brown",
    time: "8 hours ago",
    avatar: "/placeholder-patient.jpg",
    status: "success"
  },
  {
    id: 5,
    type: "suspension",
    title: "Account suspended",
    description: "Dr. Davis account suspended due to policy violation",
    time: "1 day ago",
    avatar: "/placeholder-doctor.jpg",
    status: "destructive"
  }
];

const getIcon = (type: string) => {
  switch (type) {
    case "doctor":
    case "patient":
      return User;
    case "appointment":
      return Calendar;
    case "article":
    case "feedback":
      return FileText;
    default:
      return Clock;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "success":
      return "bg-success/10 text-success border-success/20";
    case "warning":
      return "bg-warning/10 text-warning border-warning/20";
    case "destructive":
      return "bg-destructive/10 text-destructive border-destructive/20";
    default:
      return "bg-primary/10 text-primary border-primary/20";
  }
};

export function RecentActivity() {
  return (
    <Card className="shadow-soft">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {activities.map((activity) => {
          const Icon = getIcon(activity.type);
          return (
            <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-accent/50 transition-smooth">
              <div className="relative">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={activity.avatar} />
                  <AvatarFallback className="bg-gradient-secondary">
                    <Icon className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
                <div className={`absolute -bottom-1 -right-1 h-4 w-4 rounded-full flex items-center justify-center ${getStatusColor(activity.status)}`}>
                  <div className="h-2 w-2 rounded-full bg-current" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">{activity.title}</p>
                <p className="text-xs text-muted-foreground">{activity.description}</p>
                <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}