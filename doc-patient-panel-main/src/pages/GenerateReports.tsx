import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Calendar } from "lucide-react";

export default function GenerateReports() {
  const navigate = useNavigate();
  const [reportType, setReportType] = useState("performance");
  const [timeRange, setTimeRange] = useState("last-30-days");

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      <h1 className="text-3xl font-bold">Generate Report</h1>
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle>Report Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Report Type</Label>
            <Select value={reportType} onValueChange={setReportType}>
              <SelectTrigger>
                <SelectValue placeholder="Select report type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="performance">Doctor Performance</SelectItem>
                <SelectItem value="flagged">Flagged Comments</SelectItem>
                <SelectItem value="suspensions">Suspensions Overview</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Time Range</Label>
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger>
                <SelectValue placeholder="Select time range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="last-7-days">Last 7 days</SelectItem>
                <SelectItem value="last-30-days">Last 30 days</SelectItem>
                <SelectItem value="last-90-days">Last 90 days</SelectItem>
                <SelectItem value="custom">Custom Range</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {timeRange === "custom" && (
            <div className="flex gap-4">
              <Button variant="outline" className="w-full">
                <Calendar className="h-4 w-4 mr-2" /> Start Date
              </Button>
              <Button variant="outline" className="w-full">
                <Calendar className="h-4 w-4 mr-2" /> End Date
              </Button>
            </div>
          )}

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => navigate(-1)}>Cancel</Button>
            <Button>Generate</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
