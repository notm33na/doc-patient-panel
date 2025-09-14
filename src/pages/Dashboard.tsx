import { DashboardStats } from "@/components/admin/DashboardStats";
import { TrafficOverview } from "@/components/admin/TrafficOverview";
import { PatientTrends } from "@/components/admin/PatientTrends";
import { NewDoctors } from "@/components/admin/NewDoctors";
import { AppointmentOverview } from "@/components/admin/AppointmentOverview";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, UserPlus, FileText, Calendar, BarChart3, TrendingUp } from "lucide-react";
import heroImage from "@/assets/admin-hero.jpg";

export default function Dashboard() {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Hero Section */}
      <div 
        className="relative rounded-xl overflow-hidden bg-gradient-hero p-8 text-white shadow-strong"
        style={{
          backgroundImage: `linear-gradient(135deg, rgba(59, 130, 246, 0.9), rgba(16, 185, 129, 0.8)), url(${heroImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="relative z-10">
          <h1 className="text-3xl font-bold mb-2">Welcome back, Admin!</h1>
          <p className="text-white/90 mb-6">
            Monitor and manage your healthcare platform with ease. Check system health and user activities.
          </p>
          <div className="flex gap-4">
            <Button variant="secondary" className="bg-white/20 text-white border-white/30 hover:bg-white/30">
              <UserPlus className="h-4 w-4" />
              Add New Doctor
            </Button>
            <Button variant="outline" className="border-white/30 text-white hover:bg-white/10">
              <BarChart3 className="h-4 w-4" />
              View Analytics
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <DashboardStats />

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Traffic Overview - Full Width */}
        <div className="lg:col-span-2">
          <TrafficOverview />
        </div>

        {/* New Doctors */}
        <NewDoctors />
      </div>

      {/* Patient Trends */}
      <PatientTrends />

      {/* Appointment Overview */}
      <AppointmentOverview />
    </div>
  );
}