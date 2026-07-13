import { useState } from "react";
import { Link, useLocation, Outlet } from "react-router-dom";
import {
  LayoutDashboard,
  Building2,
  GraduationCap,
  UserPlus,
  Calendar,
  Settings,
  FileText,
  Menu,
  X,
  Bell,
} from "lucide-react";
import { initialNotifications } from "@/data/demoData";

const navItems = [
  { title: "Dashboard", path: "/", icon: LayoutDashboard },
  { title: "Department Management", path: "/departments", icon: Building2 },
  { title: "Class & Stream Management", path: "/classes", icon: GraduationCap },
  { title: "Admission Pipeline", path: "/admissions", icon: UserPlus },
  { title: "Timetable Management", path: "/timetable", icon: Calendar },
  { title: "System Settings", path: "/settings", icon: Settings },
  { title: "Audit Logs", path: "/audit-logs", icon: FileText },
];

export default function AdminLayout() {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showNotifications, setShowNotifications] = useState(false);
  const unreadCount = initialNotifications.filter((n) => !n.read).length;

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? "w-64" : "w-0 overflow-hidden"
        } transition-all duration-300 bg-sidebar border-r border-sidebar-border flex flex-col`}
      >
        <div className="p-5 border-b border-sidebar-border">
          <h1 className="text-xl font-bold text-primary"></h1>
          <p className="text-xs text-muted-foreground mt-1">Institution Control Center</p>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {navItems.map((item) => {
            const active = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm transition-colors ${
                  active
                    ? "bg-primary text-primary-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent"
                }`}
              >
                <item.icon className="h-4 w-4" />
                <span>{item.title}</span>
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="h-14 border-b border-border bg-card flex items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-muted-foreground hover:text-foreground">
              {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
            <h2 className="text-sm font-semibold">Admin Dashboard</h2>
            <span className="text-xs text-muted-foreground">Welcome, Admin</span>
          </div>
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative text-muted-foreground hover:text-foreground"
            >
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground text-[10px] rounded-full h-4 w-4 flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>
            {showNotifications && (
              <div className="absolute right-0 top-8 w-80 bg-card border border-border rounded-lg shadow-lg z-50 p-3">
                <h4 className="text-sm font-semibold mb-2">Notifications</h4>
                {initialNotifications.map((n) => (
                  <div
                    key={n.id}
                    className={`text-xs p-2 rounded mb-1 ${n.read ? "text-muted-foreground" : "bg-secondary text-foreground"}`}
                  >
                    <p>{n.message}</p>
                    <span className="text-muted-foreground">{n.time}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </header>

        <main className="flex-1 p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
