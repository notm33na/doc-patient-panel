import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, AlertTriangle, UserX, FileWarning, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const stats = [
  { label: "Failed Login Attempts", value: 12, icon: UserX, color: "text-destructive" },
  { label: "Suspicious Actions", value: 5, icon: AlertTriangle, color: "text-warning" },
  { label: "Critical Config Changes", value: 3, icon: FileWarning, color: "text-primary" },
  { label: "Total Security Alerts", value: 20, icon: Shield, color: "text-success" },
];

const dummyReports = [
  {
    id: 1,
    admin: "Robert Johnson",
    action: "Multiple failed logins",
    severity: "High",
    timestamp: "2024-01-15 08:10 AM",
  },
  {
    id: 2,
    admin: "Sarah Admin",
    action: "Changed password policy",
    severity: "Critical",
    timestamp: "2024-01-15 09:00 AM",
  },
  {
    id: 3,
    admin: "Mike Admin",
    action: "Suspicious account suspension",
    severity: "Medium",
    timestamp: "2024-01-14 07:45 PM",
  },
];

export default function SecurityReport() {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1); // Go back to previous page
  };

  return (
    <div className="space-y-6">
      {/* Header with Back Button */}
      <div className="flex items-center gap-4">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleGoBack}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Security Report</h1>
          <p className="text-muted-foreground">
            Review security-related events, failed logins, and critical changes
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <Card key={i} className="shadow-soft border">
              <CardContent className="p-4 flex items-center gap-3">
                <Icon className={`h-6 w-6 ${stat.color}`} />
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Report Table */}
      <Card className="border shadow-soft">
        <CardHeader>
          <CardTitle>Detailed Logs</CardTitle>
          <CardDescription>Latest security-related activities</CardDescription>
        </CardHeader>
        <CardContent>
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b text-muted-foreground">
                <th className="text-left p-2">Admin</th>
                <th className="text-left p-2">Action</th>
                <th className="text-left p-2">Severity</th>
                <th className="text-left p-2">Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {dummyReports.map((r) => (
                <tr key={r.id} className="border-b hover:bg-muted/50">
                  <td className="p-2">{r.admin}</td>
                  <td className="p-2">{r.action}</td>
                  <td className="p-2">
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        r.severity === "Critical"
                          ? "bg-destructive/10 text-destructive"
                          : r.severity === "High"
                          ? "bg-warning/10 text-warning"
                          : "bg-primary/10 text-primary"
                      }`}
                    >
                      {r.severity}
                    </span>
                  </td>
                  <td className="p-2">{r.timestamp}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
