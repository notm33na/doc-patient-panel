import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, RefreshCw } from "lucide-react";
import { fetchPatientTrends, type PatientTrendsData } from "@/services/dashboardService";

export function PatientTrends() {
  const [trendsData, setTrendsData] = useState<PatientTrendsData[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overall' | 'monthly' | 'day'>('overall');

  useEffect(() => {
    loadTrendsData();
  }, []);

  const loadTrendsData = async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    
    try {
      setError(null);
      const data = await fetchPatientTrends();
      setTrendsData(data);
    } catch (error) {
      console.error('Error loading patient trends:', error);
      setError('Failed to load patient trends data');
    } finally {
      setLoading(false);
      if (isRefresh) {
        setRefreshing(false);
      }
    }
  };

  const handleRefresh = () => {
    loadTrendsData(true);
  };

  if (loading) {
    return (
      <div className="grid gap-6 lg:grid-cols-2">
        {[1, 2].map((i) => (
          <Card key={i} className="shadow-soft">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="h-4 w-24 bg-muted animate-pulse rounded"></div>
                <div className="flex gap-2">
                  <div className="h-6 w-16 bg-muted animate-pulse rounded"></div>
                  <div className="h-6 w-16 bg-muted animate-pulse rounded"></div>
                  <div className="h-6 w-12 bg-muted animate-pulse rounded"></div>
                </div>
              </div>
              <div className="h-3 w-32 bg-muted animate-pulse rounded"></div>
            </CardHeader>
            <CardContent>
              <div className="h-[150px] w-full flex items-center justify-center">
                <div className="flex items-center gap-2">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span className="text-sm text-muted-foreground">Loading...</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="shadow-soft lg:col-span-2">
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
    <div className="grid gap-6 lg:grid-cols-2">
      <Card className="shadow-soft">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">New Patient</CardTitle>
            <div className="flex gap-2">
              <Badge 
                variant={activeTab === 'overall' ? 'outline' : 'secondary'} 
                className="text-xs cursor-pointer"
                onClick={() => setActiveTab('overall')}
              >
                Overall
              </Badge>
              <Badge 
                variant={activeTab === 'monthly' ? 'outline' : 'secondary'} 
                className="text-xs cursor-pointer"
                onClick={() => setActiveTab('monthly')}
              >
                Monthly
              </Badge>
              <Badge 
                variant={activeTab === 'day' ? 'outline' : 'secondary'} 
                className="text-xs cursor-pointer"
                onClick={() => setActiveTab('day')}
              >
                Day
              </Badge>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Get Total This Last Month</p>
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
          <div className="h-[150px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendsData}>
                <XAxis 
                  dataKey="month" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10 }}
                />
                <YAxis hide />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '6px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                  }}
                  labelStyle={{ color: 'hsl(var(--foreground))' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="patients" 
                  stroke="hsl(var(--success))" 
                  strokeWidth={2}
                  dot={false}
                  fill="hsl(var(--success) / 0.1)"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-soft">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Medical Treatment</CardTitle>
            <div className="flex gap-2">
              <Badge 
                variant={activeTab === 'overall' ? 'outline' : 'secondary'} 
                className="text-xs cursor-pointer"
                onClick={() => setActiveTab('overall')}
              >
                Overall
              </Badge>
              <Badge 
                variant={activeTab === 'monthly' ? 'outline' : 'secondary'} 
                className="text-xs cursor-pointer"
                onClick={() => setActiveTab('monthly')}
              >
                Monthly
              </Badge>
              <Badge 
                variant={activeTab === 'day' ? 'outline' : 'secondary'} 
                className="text-xs cursor-pointer"
                onClick={() => setActiveTab('day')}
              >
                Day
              </Badge>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Get Total Treatment Month</p>
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
          <div className="h-[150px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendsData}>
                <XAxis 
                  dataKey="month" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10 }}
                />
                <YAxis hide />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '6px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                  }}
                  labelStyle={{ color: 'hsl(var(--foreground))' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="treatments" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={2}
                  dot={false}
                  fill="hsl(var(--primary) / 0.1)"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}