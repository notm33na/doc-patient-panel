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
  UserPlus,
  MessageCircle,
  Video,
  ShieldCheck
} from "lucide-react";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "All Doctors", href: "/doctors", icon: UserCheck },
  { name: "All Patients", href: "/patients", icon: Users },
  { name: "All Appointments", href: "/appointments", icon: Calendar },
  { name: "Chat", href: "/chat", icon: MessageCircle },
  { name: "Candidates", href: "/candidates", icon: UserPlus },
  { name: "Feedback Analysis", href: "/feedback", icon: BarChart3 },
  { name: "Transaction Log", href: "/transactions", icon: CreditCard },
  { name: "Publications", href: "/articles", icon: FileText },
  { name: "Admin Management", href: "/admin-management", icon: ShieldCheck },
  { name: "Admin Activity", href: "/activity", icon: Activity },
  { name: "Settings", href: "/settings", icon: Settings },
];



export function Sidebar() {
  return (
    <div className="fixed top-0 left-0 h-screen w-64 bg-card border-r border-border shadow-soft">
      <div className="p-6 overflow-y-auto h-full">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2 bg-gradient-primary rounded-lg">
            <Heart className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">Tabeeb</h1>
            <p className="text-xs text-muted-foreground">Admin Dashboard</p>
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
    </div>
  );
}
