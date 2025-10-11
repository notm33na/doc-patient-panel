import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function ExportList() {
  const candidates = [
    { name: "Dr. Jessica Martinez", specialty: "Cardiology", status: "Pending Review" },
    { name: "Dr. Ahmed Hassan", specialty: "Neurology", status: "Documents Review" }
  ];

  const exportCSV = () => {
    const csvRows = [
      ["Name", "Specialty", "Status"],
      ...candidates.map(c => [c.name, c.specialty, c.status])
    ];
    const csv = csvRows.map(row => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "candidates.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <Card className="shadow-soft">
        <CardContent className="p-6">
          <h1 className="text-2xl font-bold mb-4">Export Candidates</h1>
          <p className="text-muted-foreground mb-4">Download candidate list as CSV file.</p>
          <Button onClick={exportCSV}>Download CSV</Button>
        </CardContent>
      </Card>
    </div>
  );
}
