import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { fetchRecentDoctors, Doctor } from "@/services/doctorService";
import { Loader2, RefreshCw } from "lucide-react";

export function NewDoctors() {
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadRecentDoctors = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchRecentDoctors(5);
      setDoctors(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load recent doctors");
      console.error("Error loading recent doctors:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRecentDoctors();
  }, []);

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} days ago`;
  };

  return (
    <Card className="shadow-soft">
      <CardHeader>
        <CardTitle className="text-base flex items-center justify-between">
          New Doctors
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          {error && (
            <Button variant="ghost" size="sm" onClick={loadRecentDoctors}>
              <RefreshCw className="h-4 w-4" />
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
            <span className="ml-2 text-sm text-muted-foreground">Loading...</span>
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <p className="text-sm text-destructive mb-2">{error}</p>
            <Button variant="outline" size="sm" onClick={loadRecentDoctors}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
          </div>
        ) : doctors.length > 0 ? (
          doctors.map((doctor) => (
            <div key={doctor._id} className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={doctor.profileImage || ""} />
                <AvatarFallback className="bg-gradient-secondary text-xs">
                  {doctor.DoctorName.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">{doctor.DoctorName}</p>
                <p className="text-xs text-muted-foreground">{doctor.specialization}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground">{formatTimeAgo(doctor.createdAt)}</p>
                <Badge 
                  variant="outline" 
                  className={`text-xs ${
                    doctor.status === 'approved' ? 'border-green-200 text-green-800' :
                    doctor.status === 'pending' ? 'border-yellow-200 text-yellow-800' :
                    'border-red-200 text-red-800'
                  }`}
                >
                  {doctor.status}
                </Badge>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8">
            <p className="text-sm text-muted-foreground">No recent doctors found</p>
          </div>
        )}
        
        <Button
          variant="outline"
          className="w-full mt-4"
          size="sm"
          onClick={() => navigate("/doctors")}
        >
          View All
        </Button>
      </CardContent>
    </Card>
  );
}