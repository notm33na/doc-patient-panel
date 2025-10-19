import { useState, useEffect } from "react";
import { UserCheck, Calendar, FileText, TrendingUp, TrendingDown, Loader2, RefreshCw, LucideIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { fetchDashboardStats, type DashboardStats } from "@/services/dashboardService";

export function DashboardStats() {
  const [dashboardData, setDashboardData] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    
    try {
      setError(null);
      const data = await fetchDashboardStats();
      setDashboardData(data);
    } catch (error) {
      console.error('Error loading dashboard stats:', error);
      setError('Failed to load dashboard statistics');
    } finally {
      setLoading(false);
      if (isRefresh) {
        setRefreshing(false);
      }
    }
  };

  const handleRefresh = () => {
    loadStats(true);
  };

  // Create stats array from dashboard data (excluding Total Users)
  const stats = dashboardData ? [
    {
      title: "Total Doctors", 
      value: dashboardData.totalDoctors.toString(),
      change: `${dashboardData.doctorGrowth >= 0 ? '+' : ''}${dashboardData.doctorGrowth}%`,
      trend: dashboardData.doctorGrowth >= 0 ? "up" as const : "down" as const,
      icon: UserCheck,
      color: "text-destructive",
      updateDate: new Date().toLocaleDateString(),
      loading: false
    },
    {
      title: "Total Patients",
      value: dashboardData.totalPatients.toString(),
      change: `${dashboardData.patientGrowth >= 0 ? '+' : ''}${dashboardData.patientGrowth}%`,
      trend: dashboardData.patientGrowth >= 0 ? "up" as const : "down" as const,
      icon: FileText,
      color: "text-warning",
      updateDate: new Date().toLocaleDateString(),
      loading: false
    },
    {
      title: "Total Appointments",
      value: dashboardData.totalAppointments.toString(),
      change: `${dashboardData.appointmentGrowth >= 0 ? '+' : ''}${dashboardData.appointmentGrowth}%`,
      trend: dashboardData.appointmentGrowth >= 0 ? "up" as const : "down" as const,
      icon: Calendar,
      color: "text-success",
      updateDate: new Date().toLocaleDateString(),
      loading: false
    }
  ] : [];

  if (loading) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="shadow-soft">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="h-4 w-20 bg-muted animate-pulse rounded"></div>
              <div className="h-4 w-4 bg-muted animate-pulse rounded"></div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Loader2 className="h-5 w-5 animate-spin" />
                <span className="text-sm text-muted-foreground">Loading...</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="shadow-soft md:col-span-2 lg:col-span-3">
          <CardContent className="flex items-center justify-center py-8">
            <div className="text-center">
              <p className="text-destructive mb-2">{error}</p>
              <Button onClick={handleRefresh} variant="outline" size="sm">
                <RefreshCw className="h-4 w-4 mr-2" />
                Retry
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {stats.map((stat) => (
        <Card key={stat.title} className="shadow-soft hover:shadow-medium transition-smooth">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {stat.title}
            </CardTitle>
            <stat.icon className={`h-4 w-4 ${stat.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stat.value}
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1 text-xs">
                {stat.trend === "up" ? (
                  <TrendingUp className="h-3 w-3 text-success" />
                ) : (
                  <TrendingDown className="h-3 w-3 text-destructive" />
                )}
                <span className={stat.trend === "up" ? "text-success" : "text-destructive"}>
                  {stat.change}
                </span>
              </div>
              <span className="text-xs text-muted-foreground">
                Updated: {stat.updateDate}
              </span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}