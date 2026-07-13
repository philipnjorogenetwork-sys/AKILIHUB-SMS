import { useState } from "react";
import { Link, useLocation, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useNotifications } from "@/contexts/NotificationContext";
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
  Key,
  User,
  ChevronDown,
  LogOut,
} from "lucide-react";

const navItems = [
  { title: "Dashboard", path: "/Admin", icon: LayoutDashboard },
  { title: "Credential Generator", path: "/Admin/credentials", icon: Key },
  { title: "Department Management", path: "/departments", icon: Building2 },
  { title: "Class & Stream Management", path: "/classes", icon: GraduationCap },
  { title: "Admission Pipeline", path: "/admissions", icon: UserPlus },
  { title: "Timetable Management", path: "/timetable", icon: Calendar },
  { title: "System Settings", path: "/settings", icon: Settings },
  { title: "Audit Logs", path: "/audit-logs", icon: FileText },
];

export default function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { notifications, unreadCount, markAsRead } = useNotifications();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showAccountMenu, setShowAccountMenu] = useState(false);

  // Filter notifications for admin user
  const userNotifs = notifications.filter(n => n.targetRole === "Admin" && (!n.targetId || n.targetId === "Admin"));

  if (!user) return null;

  const handleLogout = () => {
    setShowNotifications(false);
    setShowAccountMenu(false);
    logout();
  };

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
            <span className="text-xs text-muted-foreground">Welcome, {user.name}</span>
          </div>
          <div className="flex items-center gap-4">
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
                <div className="absolute right-0 top-8 w-80 bg-card border border-border rounded-lg shadow-lg z-50 p-3 max-h-80 overflow-y-auto">
                  <h4 className="text-sm font-semibold mb-2">Notifications</h4>
                  {userNotifs.length === 0 ? (
                    <p className="text-xs text-muted-foreground text-center py-4">No notifications</p>
                  ) : (
                    userNotifs.map((n) => (
                      <button
                        key={n.id}
                        onClick={() => markAsRead(n.id)}
                        className={`w-full text-left text-xs p-2 rounded mb-1 transition-colors hover:bg-secondary ${n.read ? "text-muted-foreground" : "bg-secondary text-foreground font-medium"}`}
                      >
                        <p>{n.message}</p>
                        <span className="text-muted-foreground text-[10px]">{n.time}</span>
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>

            {/* Account Menu */}
            <div 
              className="relative"
              onMouseLeave={() => setShowAccountMenu(false)}
            >
              <button
                onClick={() => setShowAccountMenu(!showAccountMenu)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-secondary transition-colors text-foreground font-medium text-sm"
              >
                <div className="w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center font-bold text-sm">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span className="hidden sm:inline text-xs truncate max-w-[100px]">{user.name.split(' ')[0]}</span>
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              </button>

              {showAccountMenu && (
                <div className="absolute right-0 top-12 w-64 bg-card border border-border rounded-lg shadow-lg z-50 p-2">
                  {/* User Info Header */}
                  <div className="px-4 py-3 border-b border-border mb-2">
                    <p className="text-sm font-semibold text-foreground">{user.name}</p>
                    <p className="text-xs text-muted-foreground mt-1 capitalize">{user.role} • {user.email}</p>
                  </div>

                  {/* Menu Items */}
                  <button
                    onClick={() => {
                      navigate("/account/profile");
                      setShowAccountMenu(false);
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm text-sidebar-foreground hover:bg-sidebar-accent transition-colors"
                  >
                    <User className="h-4 w-4" />
                    <span>My Profile</span>
                  </button>

                  <button
                    onClick={() => {
                      navigate("/account/settings");
                      setShowAccountMenu(false);
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm text-sidebar-foreground hover:bg-sidebar-accent transition-colors"
                  >
                    <Settings className="h-4 w-4" />
                    <span>Settings</span>
                  </button>

                  <div className="border-t border-border my-2" />

                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm text-orange-600 hover:bg-orange-50 transition-colors font-medium"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="flex-1 p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
