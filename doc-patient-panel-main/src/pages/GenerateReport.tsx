import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Filter, Download } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// ✅ Define a proper type for report data
type ReportRow = {
  id: string;
  patient: string;
  doctor: string;
  type: string;
  amount: number;
  status: string;
};

export default function GenerateReport() {
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [status, setStatus] = useState<string>("all");
  const [type, setType] = useState<string>("all");
  const [reportData, setReportData] = useState<ReportRow[]>([]); // ✅ Strongly typed array

  const generateReport = () => {
    // Dummy report data – replace with API call later
    const dummyData: ReportRow[] = [
      {
        id: "TXN100",
        patient: "Alice Walker",
        doctor: "Dr. Chen",
        type: "Consultation",
        amount: 120,
        status: "Completed",
      },
      {
        id: "TXN101",
        patient: "David Lee",
        doctor: "Dr. Mike",
        type: "Surgery",
        amount: 450,
        status: "Pending",
      },
    ];
    setReportData(dummyData);
  };

  const downloadPDF = () => {
    alert("📄 Report download feature coming soon!");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Generate Transaction Report
          </h1>
          <p className="text-muted-foreground">
            Choose filters and generate a detailed transaction report
          </p>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Report Filters</CardTitle>
          <CardDescription>Select the parameters for your report</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Start Date */}
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Start Date
              </label>
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>

            {/* End Date */}
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                End Date
              </label>
              <Input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>

            {/* Status */}
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Status
              </label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="refunded">Refunded</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Type */}
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Type
              </label>
              <Select value={type} onValueChange={setType}>
                <SelectTrigger>
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="consultation">Consultation</SelectItem>
                  <SelectItem value="surgery">Surgery</SelectItem>
                  <SelectItem value="check-up">Check-up</SelectItem>
                  <SelectItem value="procedure">Procedure</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Generate Button */}
          <div className="flex justify-end mt-6 gap-2">
            <Button variant="outline" onClick={generateReport} className="gap-2">
              <Filter className="h-4 w-4" /> Generate Report
            </Button>
            {reportData.length > 0 && (
              <Button onClick={downloadPDF} className="gap-2">
                <Download className="h-4 w-4" /> Download PDF
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Report Preview */}
      {reportData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Report Preview</CardTitle>
            <CardDescription>
              Showing {reportData.length} transactions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Patient</TableHead>
                  <TableHead>Doctor</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reportData.map((txn) => (
                  <TableRow key={txn.id}>
                    <TableCell>{txn.id}</TableCell>
                    <TableCell>{txn.patient}</TableCell>
                    <TableCell>{txn.doctor}</TableCell>
                    <TableCell>{txn.type}</TableCell>
                    <TableCell>${txn.amount}</TableCell>
                    <TableCell>{txn.status}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
