import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, RefreshCw } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { fetchAppointmentOverview, type AppointmentData } from "@/services/dashboardService";

const getStatusColor = (status: string) => {
  switch (status) {
    case "Completed":
      return "bg-success/10 text-success border-success/20";
    case "Re-Scheduled":
      return "bg-warning/10 text-warning border-warning/20";
    case "Cancelled":
      return "bg-destructive/10 text-destructive border-destructive/20";
    default:
      return "bg-primary/10 text-primary border-primary/20";
  }
};

export function AppointmentOverview() {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState<AppointmentData[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadAppointments();
  }, []);

  const loadAppointments = async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    
    try {
      setError(null);
      const data = await fetchAppointmentOverview();
      setAppointments(data);
    } catch (error) {
      console.error('Error loading appointments:', error);
      setError('Failed to load appointment data');
    } finally {
      setLoading(false);
      if (isRefresh) {
        setRefreshing(false);
      }
    }
  };

  const handleRefresh = () => {
    loadAppointments(true);
  };
  
  if (loading) {
    return (
      <Card className="shadow-soft">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base">Appointment Overview</CardTitle>
          <div className="flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="text-sm text-muted-foreground">Loading...</span>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-1">
            {/* Header */}
            <div className="grid grid-cols-4 gap-4 py-2 text-xs font-medium text-muted-foreground border-b">
              <div>Patient Name</div>
              <div>Location</div>
              <div>Check In Time</div>
              <div>Status</div>
            </div>
            
            {/* Loading skeleton */}
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="grid grid-cols-4 gap-4 py-3 items-center">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 bg-muted animate-pulse rounded-full"></div>
                  <div className="h-4 w-24 bg-muted animate-pulse rounded"></div>
                </div>
                <div className="h-4 w-16 bg-muted animate-pulse rounded"></div>
                <div className="h-4 w-20 bg-muted animate-pulse rounded"></div>
                <div className="h-6 w-20 bg-muted animate-pulse rounded"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="shadow-soft">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base">Appointment Overview</CardTitle>
          <Button onClick={handleRefresh} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry
          </Button>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <p className="text-destructive mb-2">{error}</p>
              <Button onClick={handleRefresh} variant="outline" size="sm">
                <RefreshCw className="h-4 w-4 mr-2" />
                Retry
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="shadow-soft">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-base">Appointment Overview</CardTitle>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="text-primary"
            onClick={() => navigate("/appointments")}
          >
            View All
          </Button>
          <Button 
            onClick={handleRefresh} 
            variant="ghost" 
            size="sm"
            disabled={refreshing}
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-1">
          {/* Header */}
          <div className="grid grid-cols-4 gap-4 py-2 text-xs font-medium text-muted-foreground border-b">
            <div>Patient Name</div>
            <div>Location</div>
            <div>Check In Time</div>
            <div>Status</div>
          </div>
          
          {/* Appointments */}
          {appointments.map((appointment) => (
            <div key={appointment.id} className="grid grid-cols-4 gap-4 py-3 items-center hover:bg-accent/50 rounded-lg transition-smooth">
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={appointment.avatar} />
                  <AvatarFallback className="bg-gradient-secondary text-xs">
                    {appointment.patient.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium">{appointment.patient}</span>
              </div>
              <div className="text-sm text-muted-foreground">{appointment.location}</div>
              <div className="text-sm text-muted-foreground">{appointment.checkIn}</div>
              <div>
                <Badge className={getStatusColor(appointment.status)}>
                  {appointment.status}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}