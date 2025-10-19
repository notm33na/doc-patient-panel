import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function ExportLog() {
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
          <h1 className="text-2xl font-bold">Export Logs</h1>
          <p className="text-muted-foreground">
            Download system activity logs in different formats
          </p>
        </div>
      </div>

      <Card className="border shadow-soft">
        <CardHeader>
          <CardTitle>Export Options</CardTitle>
          <CardDescription>Select the date range and format for export</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Date range */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="text-sm font-medium">From</label>
              <Input type="date" />
            </div>
            <div className="flex-1">
              <label className="text-sm font-medium">To</label>
              <Input type="date" />
            </div>
          </div>

          {/* Export format */}
          <div>
            <label className="text-sm font-medium">Format</label>
            <div className="flex gap-3 mt-2">
              <Button variant="outline">CSV</Button>
              <Button variant="outline">PDF</Button>
              <Button variant="outline">JSON</Button>
            </div>
          </div>

          {/* Export button */}
          <div className="pt-4">
            <Button className="w-full gap-2">
              <Calendar className="h-4 w-4" />
              Export Log
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
