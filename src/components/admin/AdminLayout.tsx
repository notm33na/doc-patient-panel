// components/admin/AdminLayout.tsx
import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";

export function AdminLayout() {
  const { loading, isAuthenticated } = useAuth();

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // If not authenticated, this component shouldn't render
  // The AuthProvider will handle redirecting to login
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="flex">
      {/* Sidebar stays fixed */}
      <Sidebar />

      {/* Main content shifted right */}
      <div className="flex-1 ml-64 min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 p-6 bg-background overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
