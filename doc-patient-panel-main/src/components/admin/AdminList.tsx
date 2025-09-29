import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "@/components/ui/use-toast";

interface Admin {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  department: string;
  status: string;
}

const roles = ["admin", "superadmin", "moderator"];
const departments = ["IT", "HR", "Finance", "Marketing"];

export const AdminList = () => {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(true);

  // Editing state
  const [editingAdmin, setEditingAdmin] = useState<Admin | null>(null);
  const [formData, setFormData] = useState<Partial<Admin>>({});

  // Fetch admins
  const fetchAdmins = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/admins");
      if (!res.ok) throw new Error("Failed to fetch admins");

      const data = await res.json();
      setAdmins(data);
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  // Delete admin
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this admin?")) return;

    try {
      const res = await fetch(`http://localhost:5000/api/admins/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to delete admin");
      }

      setAdmins((prev) => prev.filter((admin) => admin._id !== id));

      toast({
        title: "Admin Deleted",
        description: "The admin has been removed successfully.",
      });
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      });
    }
  };

  // Open edit modal
  const handleEdit = (admin: Admin) => {
    setEditingAdmin(admin);
    setFormData(admin);
  };

  // Save update
  const handleUpdate = async () => {
    if (!editingAdmin) return;

    try {
      const res = await fetch(`http://localhost:5000/api/admins/${editingAdmin._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Failed to update admin");
      const updatedAdmin = await res.json();

      setAdmins((prev) =>
        prev.map((a) => (a._id === updatedAdmin._id ? updatedAdmin : a))
      );

      setEditingAdmin(null);
      toast({ title: "Admin Updated", description: "Changes saved successfully." });
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Admin List</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p>Loading admins...</p>
        ) : admins.length === 0 ? (
          <p>No admins found.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {admins.map((admin) => (
                <TableRow key={admin._id}>
                  <TableCell>
                    {admin.firstName} {admin.lastName}
                  </TableCell>
                  <TableCell>{admin.email}</TableCell>
                  <TableCell>{admin.role}</TableCell>
                  <TableCell>{admin.department}</TableCell>
                  <TableCell>{admin.status}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      {/* Edit button */}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(admin)}
                      >
                        Edit
                      </Button>

                      {/* Delete button */}
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(admin._id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}

        {/* Edit Modal */}
        {editingAdmin && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg w-96">
              <h2 className="text-xl font-bold mb-4">Edit Admin</h2>

              <input
                className="border p-2 w-full mb-2"
                placeholder="First Name"
                value={formData.firstName || ""}
                onChange={(e) =>
                  setFormData({ ...formData, firstName: e.target.value })
                }
              />
              <input
                className="border p-2 w-full mb-2"
                placeholder="Last Name"
                value={formData.lastName || ""}
                onChange={(e) =>
                  setFormData({ ...formData, lastName: e.target.value })
                }
              />
              <input
                className="border p-2 w-full mb-2"
                placeholder="Email"
                value={formData.email || ""}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />

              {/* Role dropdown */}
              <select
                className="border p-2 w-full mb-2"
                value={formData.role || ""}
                onChange={(e) =>
                  setFormData({ ...formData, role: e.target.value })
                }
              >
                <option value="">Select Role</option>
                {roles.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>

              {/* Department dropdown */}
              <select
                className="border p-2 w-full mb-2"
                value={formData.department || ""}
                onChange={(e) =>
                  setFormData({ ...formData, department: e.target.value })
                }
              >
                <option value="">Select Department</option>
                {departments.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>

              <div className="flex justify-end gap-2 mt-4">
                <Button variant="outline" onClick={() => setEditingAdmin(null)}>
                  Cancel
                </Button>
                <Button onClick={handleUpdate}>Save</Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
