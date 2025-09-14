import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from "recharts";

const trafficData = [
  { day: "Mon", visitors: 80, returning: 20 },
  { day: "Tue", visitors: 90, returning: 30 },
  { day: "Wed", visitors: 85, returning: 25 },
  { day: "Thu", visitors: 95, returning: 35 },
  { day: "Fri", visitors: 88, returning: 28 },
  { day: "Sat", visitors: 92, returning: 32 },
  { day: "Sun", visitors: 87, returning: 27 }
];

export function TrafficOverview() {
  return (
    <Card className="shadow-soft">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Traffic Overview</CardTitle>
        <span className="text-sm text-muted-foreground">Today</span>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={trafficData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <XAxis 
                dataKey="day" 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                domain={[0, 100]}
              />
              <Bar 
                dataKey="visitors" 
                stackId="a"
                fill="hsl(var(--primary))" 
                radius={[0, 0, 4, 4]}
              />
              <Bar 
                dataKey="returning" 
                stackId="a"
                fill="hsl(var(--warning))" 
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}