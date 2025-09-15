// components/admin/AdminLayout.tsx
import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";

export function AdminLayout() {
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
