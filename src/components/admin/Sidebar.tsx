import { NavLink } from "react-router-dom";
import { 
  LayoutDashboard, 
  Users, 
  UserCheck, 
  FileText, 
  Calendar, 
  Settings, 
  Heart,
  Activity,
  CreditCard,
  BarChart3,
  UserPlus
} from "lucide-react";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "All Doctors", href: "/doctors", icon: UserCheck },
  { name: "All Patients", href: "/patients", icon: Users },
  { name: "All Appointments", href: "/appointments", icon: Calendar },
  { name: "Payroll", href: "/payroll", icon: CreditCard },
  { name: "Feedback Analysis", href: "/feedback", icon: BarChart3 },
  { name: "Candidates", href: "/candidates", icon: UserPlus },
  { name: "Publications", href: "/articles", icon: FileText },
  { name: "Admin Activity", href: "/activity", icon: Activity },
  { name: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar() {
  return (
    <div className="w-64 bg-card border-r border-border shadow-soft min-h-screen">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2 bg-gradient-primary rounded-lg">
            <Heart className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">HealthAdmin</h1>
            <p className="text-xs text-muted-foreground">Healthcare Management</p>
          </div>
        </div>

        <nav className="space-y-2">
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-smooth",
                  isActive
                    ? "bg-gradient-primary text-white shadow-soft"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent"
                )
              }
            >
              <item.icon className="h-4 w-4" />
              {item.name}
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="absolute bottom-6 left-6 right-6">
        <div className="p-4 bg-gradient-secondary rounded-lg border border-border">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary rounded-full">
              <Activity className="h-4 w-4 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium">System Health</p>
              <p className="text-xs text-muted-foreground">All systems operational</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}