import { Users, UserCheck, Calendar, FileText, TrendingUp, TrendingDown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const stats = [
  {
    title: "Total Users",
    value: "500",
    change: "+1%",
    trend: "up",
    icon: Users,
    color: "text-primary",
    updateDate: "July 16, 2023"
  },
  {
    title: "Total Appointments", 
    value: "1050",
    change: "+4%",
    trend: "up",
    icon: Calendar,
    color: "text-success",
    updateDate: "July 16, 2023"
  },
  {
    title: "Total Doctors",
    value: "75",
    change: "-8%",
    trend: "down", 
    icon: UserCheck,
    color: "text-destructive",
    updateDate: "July 16, 2023"
  },
  {
    title: "Total Patients",
    value: "450",
    change: "+4%",
    trend: "up",
    icon: FileText,
    color: "text-warning",
    updateDate: "July 16, 2023"
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
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1 text-xs">
                {stat.trend === "up" ? (
                  <TrendingUp className="h-3 w-3 text-success" />
                ) : (
                  <TrendingDown className="h-3 w-3 text-destructive" />
                )}
                <span className={stat.trend === "up" ? "text-success" : "text-destructive"}>
                  {stat.change}
                </span>
              </div>
              <span className="text-xs text-muted-foreground">
                Update: {stat.updateDate}
              </span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}