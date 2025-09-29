import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function EditDoctor() {
  const { id } = useParams();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Edit Doctor Profile</h1>
      <Card>
        <CardHeader>
          <CardTitle>Doctor Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input placeholder="Doctor Name" defaultValue={`Dr. Example ${id}`} />
          <Input placeholder="Specialty" defaultValue="Cardiology" />
          <Input placeholder="Email" defaultValue="doctor@example.com" />
          <Input placeholder="Phone" defaultValue="+1 (555) 123-4567" />
          <Button className="w-full">Save Changes</Button>
        </CardContent>
      </Card>
    </div>
  );
}
