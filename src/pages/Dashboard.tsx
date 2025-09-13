import { DashboardStats } from "@/components/admin/DashboardStats";
import { RecentActivity } from "@/components/admin/RecentActivity";
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
        {/* Quick Actions */}
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full justify-start" variant="gradient">
              <UserPlus className="h-4 w-4" />
              Add New Doctor
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <Users className="h-4 w-4" />
              Manage Patients
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <FileText className="h-4 w-4" />
              Review Articles
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <Calendar className="h-4 w-4" />
              Schedule Appointment
            </Button>
          </CardContent>
        </Card>

        {/* System Overview */}
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              System Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm">Server Health</span>
                <span className="text-sm font-medium text-success">98.5%</span>
              </div>
              <div className="w-full bg-secondary rounded-full h-2">
                <div className="bg-gradient-primary h-2 rounded-full w-[98.5%]"></div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm">Database Usage</span>
                <span className="text-sm font-medium text-primary">72.3%</span>
              </div>
              <div className="w-full bg-secondary rounded-full h-2">
                <div className="bg-gradient-primary h-2 rounded-full w-[72.3%]"></div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm">Active Sessions</span>
                <span className="text-sm font-medium text-warning">1,247</span>
              </div>
              <div className="w-full bg-secondary rounded-full h-2">
                <div className="bg-warning h-2 rounded-full w-[65%]"></div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <RecentActivity />
      </div>
    </div>
  );
}