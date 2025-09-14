import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from "recharts";
import { Badge } from "@/components/ui/badge";

const patientData = [
  { month: "Jan", patients: 65 },
  { month: "Feb", patients: 59 },
  { month: "Mar", patients: 80 },
  { month: "Apr", patients: 81 },
  { month: "May", patients: 56 },
  { month: "Jun", patients: 55 },
  { month: "Jul", patients: 75 }
];

const treatmentData = [
  { month: "Jan", treatments: 45 },
  { month: "Feb", treatments: 52 },
  { month: "Mar", treatments: 48 },
  { month: "Apr", treatments: 61 },
  { month: "May", treatments: 55 },
  { month: "Jun", treatments: 67 },
  { month: "Jul", treatments: 58 }
];

export function PatientTrends() {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card className="shadow-soft">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">New Patient</CardTitle>
            <div className="flex gap-2">
              <Badge variant="outline" className="text-xs">Overall</Badge>
              <Badge variant="secondary" className="text-xs">Monthly</Badge>
              <Badge variant="secondary" className="text-xs">Day</Badge>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">Get Total This Last Month</p>
        </CardHeader>
        <CardContent>
          <div className="h-[150px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={patientData}>
                <XAxis 
                  dataKey="month" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10 }}
                />
                <YAxis hide />
                <Line 
                  type="monotone" 
                  dataKey="patients" 
                  stroke="hsl(var(--success))" 
                  strokeWidth={2}
                  dot={false}
                  fill="hsl(var(--success) / 0.1)"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-soft">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Medical Treatment</CardTitle>
            <div className="flex gap-2">
              <Badge variant="outline" className="text-xs">Overall</Badge>
              <Badge variant="secondary" className="text-xs">Monthly</Badge>
              <Badge variant="secondary" className="text-xs">Day</Badge>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">Get Total Treatment Month</p>
        </CardHeader>
        <CardContent>
          <div className="h-[150px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={treatmentData}>
                <XAxis 
                  dataKey="month" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10 }}
                />
                <YAxis hide />
                <Line 
                  type="monotone" 
                  dataKey="treatments" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={2}
                  dot={false}
                  fill="hsl(var(--primary) / 0.1)"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}