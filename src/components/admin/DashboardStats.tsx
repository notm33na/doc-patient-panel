import { Users, UserCheck, Calendar, FileText, TrendingUp, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const stats = [
  {
    title: "Total Doctors",
    value: "124",
    change: "+12%",
    trend: "up",
    icon: UserCheck,
    color: "text-primary"
  },
  {
    title: "Total Patients",
    value: "2,847",
    change: "+8%",
    trend: "up",
    icon: Users,
    color: "text-success"
  },
  {
    title: "Today's Appointments",
    value: "68",
    change: "+5%",
    trend: "up",
    icon: Calendar,
    color: "text-warning"
  },
  {
    title: "Pending Articles",
    value: "12",
    change: "-3%",
    trend: "down",
    icon: FileText,
    color: "text-destructive"
  }
];

export function DashboardStats() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title} className="shadow-soft hover:shadow-medium transition-smooth">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {stat.title}
            </CardTitle>
            <stat.icon className={`h-4 w-4 ${stat.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <div className="flex items-center gap-1 text-xs">
              {stat.trend === "up" ? (
                <TrendingUp className="h-3 w-3 text-success" />
              ) : (
                <AlertTriangle className="h-3 w-3 text-destructive" />
              )}
              <span className={stat.trend === "up" ? "text-success" : "text-destructive"}>
                {stat.change}
              </span>
              <span className="text-muted-foreground">from last month</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}