import { useState } from "react";
import { Link, useLocation, Outlet } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  LayoutDashboard, Users, GraduationCap, BookOpen, Calendar, ClipboardCheck,
  FileText, Settings, Bell, Menu, X, LogOut, UserPlus, CreditCard,
  BarChart3, Award, Briefcase, Palette, Code, Music, Wrench,
} from "lucide-react";
import { notifications, type UserRole } from "@/data/schoolData";

interface NavItem {
  title: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
}

const navByRole: Record<UserRole, NavItem[]> = {
  Admin: [
    { title: "Dashboard", path: "/Admin", icon: LayoutDashboard },
    { title: "Students", path: "/Admin/students", icon: GraduationCap },
    { title: "Teachers", path: "/Admin/teachers", icon: Briefcase },
    { title: "Courses", path: "/Admin/courses", icon: BookOpen },
    { title: "Classrooms", path: "/Admin/classrooms", icon: Users },
    { title: "Enrollment", path: "/Admin/enrollment", icon: UserPlus },
    { title: "Fee Collection", path: "/Admin/fees", icon: CreditCard },
    { title: "Reports", path: "/Admin/reports", icon: BarChart3 },
    { title: "Settings", path: "/Admin/settings", icon: Settings },
  ],
  teacher: [
    { title: "Dashboard", path: "/teacher", icon: LayoutDashboard },
    { title: "Attendance", path: "/teacher/attendance", icon: ClipboardCheck },
    { title: "Marks Entry", path: "/teacher/marks", icon: FileText },
    { title: "Assignments", path: "/teacher/assignments", icon: BookOpen },
    { title: "Timetable", path: "/teacher/timetable", icon: Calendar },
    { title: "My Classes", path: "/teacher/classes", icon: Users },
  ],
  student: [
    { title: "Dashboard", path: "/student", icon: LayoutDashboard },
    { title: "Timetable", path: "/student/timetable", icon: Calendar },
    { title: "Attendance", path: "/student/attendance", icon: ClipboardCheck },
    { title: "Marks & Grades", path: "/student/marks", icon: Award },
    { title: "Assignments", path: "/student/assignments", icon: BookOpen },
    { title: "Electives", path: "/student/electives", icon: Palette },
  ],
  parent: [
    { title: "Dashboard", path: "/parent", icon: LayoutDashboard },
    { title: "Children Progress", path: "/parent/progress", icon: BarChart3 },
    { title: "Fee Payment", path: "/parent/fees", icon: CreditCard },
    { title: "Notifications", path: "/parent/notifications", icon: Bell },
  ],
};

const roleLabels: Record<UserRole, string> = {
  Admin: "Admin",
  teacher: "Teacher Portal",
  student: "Student Portal",
  parent: "Parent Portal",
};

const roleColors: Record<UserRole, string> = {
  Admin: "bg-primary",
  teacher: "bg-emerald-600",
  student: "bg-blue-600",
  parent: "bg-amber-600",
};

export default function SMSLayout() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showNotifs, setShowNotifs] = useState(false);

  if (!user) return null;

  const items = navByRole[user.role];
  const userNotifs = notifications.filter(n => n.targetRole === user.role && (!n.targetId || n.targetId === user.personId));
  const unread = userNotifs.filter(n => !n.read).length;

  return (
    <div className="flex min-h-screen">
      <aside className={`${sidebarOpen ? "w-64" : "w-0 overflow-hidden"} transition-all duration-300 bg-sidebar border-r border-sidebar-border flex flex-col`}>
        <div className="p-5 border-b border-sidebar-border">
          <h1 className="text-lg font-bold text-foreground">Akili Hub Solutions</h1>
          <div className={`inline-block mt-1 text-[10px] font-semibold px-2 py-0.5 rounded text-white ${roleColors[user.role]}`}>
            {roleLabels[user.role]}
          </div>
        </div>
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {items.map(item => {
            const active = location.pathname === item.path;
            return (
              <Link key={item.path} to={item.path} className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm transition-colors ${active ? "bg-primary text-primary-foreground" : "text-sidebar-foreground hover:bg-sidebar-accent"}`}>
                <item.icon className="h-4 w-4 shrink-0" />
                <span>{item.title}</span>
              </Link>
            );
          })}
        </nav>
        <div className="p-3 border-t border-sidebar-border">
          <button onClick={logout} className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm text-destructive hover:bg-destructive/10 w-full">
            <LogOut className="h-4 w-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-14 border-b border-border bg-card flex items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-muted-foreground hover:text-foreground">
              {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
            <h2 className="text-sm font-semibold">{roleLabels[user.role]}</h2>
            <span className="text-xs text-muted-foreground hidden sm:inline">Welcome, {user.name}</span>
          </div>
          <div className="relative">
            <button onClick={() => setShowNotifs(!showNotifs)} className="relative text-muted-foreground hover:text-foreground">
              <Bell className="h-5 w-5" />
              {unread > 0 && <span className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground text-[10px] rounded-full h-4 w-4 flex items-center justify-center">{unread}</span>}
            </button>
            {showNotifs && (
              <div className="absolute right-0 top-8 w-80 bg-card border border-border rounded-lg shadow-lg z-50 p-3 max-h-80 overflow-y-auto">
                <h4 className="text-sm font-semibold mb-2">Notifications</h4>
                {userNotifs.length === 0 ? <p className="text-xs text-muted-foreground">No notifications</p> : userNotifs.map(n => (
                  <div key={n.id} className={`text-xs p-2 rounded mb-1 ${n.read ? "text-muted-foreground" : "bg-secondary text-foreground"}`}>
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
