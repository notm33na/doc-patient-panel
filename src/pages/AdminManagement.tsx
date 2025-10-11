import { Link } from "react-router-dom";
import { AddAdminForm } from "@/components/admin/AddAdminForm";
import { AdminList } from "@/components/admin/AdminList";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Shield } from "lucide-react";

const AdminManagement = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-background shadow-soft border-b border-border/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link to="/">
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="hover:bg-muted/50 transition-colors"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
              <div className="flex items-center space-x-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary-glow shadow-medium">
                  <Shield className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-card-foreground">
                    Admin Management
                  </h1>
                  <p className="text-muted-foreground">
                    Manage system administrators and their permissions
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Add Admin Section */}
          <section>
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-card-foreground mb-2">
                Add New Administrator
              </h2>
              <p className="text-muted-foreground">
                Create a new admin account with appropriate permissions and access levels.
              </p>
            </div>
            <div className="flex justify-center">
              <AddAdminForm />
            </div>
          </section>

          {/* Admin List Section */}
          <section>
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-card-foreground mb-2">
                Current Administrators
              </h2>
              <p className="text-muted-foreground">
                View and manage existing admin accounts in the system.
              </p>
            </div>
            <AdminList />
          </section>
        </div>
      </main>
    </div>
  );
};

export default AdminManagement;