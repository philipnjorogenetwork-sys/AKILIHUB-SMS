import { useState, useRef, useEffect } from "react";
import { Link, useLocation, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useNotifications } from "@/contexts/NotificationContext";
import {
  LayoutDashboard, Users, GraduationCap, BookOpen, Calendar, ClipboardCheck,
  FileText, Settings, Bell, Menu, X, LogOut, UserPlus, CreditCard,
  BarChart3, Award, Briefcase, Palette, Code, Music, Wrench, Wallet,
  FileCheck, Database, Activity, Receipt, Key, User, ChevronDown,
  BookMarked, Layers, MessageCircle, ShieldCheck,
} from "lucide-react";
import type { UserRole } from "@/data/schoolData";

interface NavSubItem {
  title: string;
  path: string;
}

interface NavItem {
  title: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
  subItems?: NavSubItem[];
}

const navByRole: Record<UserRole, NavItem[]> = {
  Admin: [
    { title: "Dashboard", path: "/Admin", icon: LayoutDashboard },
    { 
      title: "SIS", 
      path: "/Admin/sis", 
      icon: GraduationCap,
      subItems: [
        { title: "Admissions", path: "/Admin/sis/admissions" },
        { title: "Student Profiles", path: "/Admin/sis/profiles" },
        { title: "Documents", path: "/Admin/sis/documents" },
        { title: "Promotion", path: "/Admin/sis/promotion" },
        { title: "Alumni", path: "/Admin/sis/alumni" },
      ]
    },
    { title: "Credential Generator", path: "/Admin/credentials", icon: Key },
    {
      title: "System",
      path: "/Admin/system",
      icon: ShieldCheck,
      subItems: [
        { title: "Overview", path: "/Admin/system" },
        { title: "User Management", path: "/Admin/system/users" },
        { title: "Permissions", path: "/Admin/system/permissions" },
      ],
    },
    { title: "Students", path: "/Admin/students", icon: GraduationCap },
    { title: "Teachers", path: "/Admin/teachers", icon: Briefcase },
    { title: "Parents", path: "/Admin/parents", icon: Users },
    { title: "Courses", path: "/Admin/courses", icon: BookOpen },
    { title: "Classrooms", path: "/Admin/classrooms", icon: Users },
    { title: "Enrollment", path: "/Admin/enrollment", icon: UserPlus },
    { title: "Fee Collection", path: "/Admin/fees", icon: CreditCard },
    { title: "Financial Overview", path: "/Admin/financials", icon: Receipt },
    { title: "Academic Calendar", path: "/Admin/calendar", icon: Calendar },
    { title: "Grading Control", path: "/Admin/marks", icon: Award },
    { title: "Reports", path: "/Admin/reports", icon: BarChart3 },
    { title: "Messages", path: "/messages", icon: MessageCircle },
    { title: "Settings", path: "/Admin/settings", icon: Settings },
  ],
  teacher: [
    { title: "Dashboard", path: "/teacher", icon: LayoutDashboard },
    { title: "Attendance", path: "/teacher/attendance", icon: ClipboardCheck },
    { title: "Marks Entry", path: "/teacher/marks", icon: FileText },
    { title: "Academic Calendar", path: "/teacher/calendar", icon: Calendar },
    { title: "Assignments", path: "/teacher/assignments", icon: BookOpen },
    { title: "Timetable", path: "/teacher/timetable", icon: Calendar },
    { title: "My Classes", path: "/teacher/classes", icon: Users },
    { title: "Messages", path: "/messages", icon: MessageCircle },
  ],
  student: [
    { title: "Dashboard", path: "/student", icon: LayoutDashboard },
    { title: "Teachers", path: "/student/teachers", icon: Briefcase },
    { title: "Students", path: "/student/students", icon: Users },
    { title: "Subjects", path: "/student/subjects", icon: BookMarked },
    { title: "Classes", path: "/student/classes", icon: Layers },
    { title: "Lessons", path: "/student/lessons", icon: FileText },
    { title: "Exams", path: "/student/exams", icon: ClipboardCheck },
    { title: "Timetable", path: "/student/timetable", icon: Calendar },
    { title: "Attendance", path: "/student/attendance", icon: Activity },
    { title: "Marks & Grades", path: "/student/marks", icon: Award },
    { title: "Assignments", path: "/student/assignments", icon: BookOpen },
    { title: "Electives", path: "/student/electives", icon: Palette },
    { title: "Messages", path: "/messages", icon: MessageCircle },
  ],
  parent: [
    { title: "Dashboard", path: "/parent", icon: LayoutDashboard },
    { title: "Fee Payment", path: "/parent/fees", icon: CreditCard },
    { title: "Notifications", path: "/parent/notifications", icon: Bell },
    { title: "Messages", path: "/messages", icon: MessageCircle },
  ],
  finance: [
    { title: "Dashboard", path: "/finance", icon: LayoutDashboard },
    { title: "Financial Overview", path: "/finance/overview", icon: Receipt },
    { title: "Fee Payments", path: "/finance/payments", icon: Receipt },
    { title: "Financial Reports", path: "/finance/reports", icon: BarChart3 },
    { title: "Expenses", path: "/finance/expenses", icon: Wallet },
    { title: "Audit Logs", path: "/finance/audit", icon: Activity },
    { title: "Messages", path: "/messages", icon: MessageCircle },
  ],
  secretary: [
    { title: "Dashboard", path: "/secretary", icon: LayoutDashboard },
    { title: "Financial Overview", path: "/secretary/financials", icon: Receipt },
    { 
      title: "SIS", 
      path: "/secretary/sis", 
      icon: GraduationCap,
      subItems: [
        { title: "Admissions", path: "/secretary/sis/admissions" },
        { title: "Student Profiles", path: "/secretary/sis/profiles" },
        { title: "Documents", path: "/secretary/sis/documents" },
        { title: "Promotion", path: "/secretary/sis/promotion" },
        { title: "Alumni", path: "/secretary/sis/alumni" },
      ]
    },
    { title: "Student Records", path: "/secretary/students", icon: Database },
    { title: "Parent Records", path: "/secretary/parents", icon: Users },
    { title: "Fees Asst.", path: "/secretary/fees", icon: CreditCard },
    { title: "Messages", path: "/messages", icon: MessageCircle },
  ],
};

const roleLabels: Record<UserRole, string> = {
  Admin: "Admin",
  teacher: "Teacher Portal",
  student: "Student Portal",
  parent: "Parent Portal",
  finance: "Finance Portal",
  secretary: "Secretary Portal",
};

const roleColors: Record<UserRole, string> = {
  Admin: "bg-primary",
  teacher: "bg-success",
  student: "bg-accent",
  parent: "bg-warning",
  finance: "bg-amber-600",
  secretary: "bg-orange-500",
};

function SidebarItem({ item, location }: { item: NavItem, location: any }) {
  const hasSubItems = item.subItems && item.subItems.length > 0;
  const active = location.pathname === item.path || (hasSubItems && item.subItems?.some(si => location.pathname === si.path));
  const [isOpen, setIsOpen] = useState(active);

  return (
    <div>
      {hasSubItems ? (
        <>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-md text-sm transition-colors ${active ? "bg-primary/10 text-primary font-medium" : "text-sidebar-foreground hover:bg-sidebar-accent"}`}
          >
            <div className="flex items-center gap-3">
              {(() => {
                const Icon = item.icon;
                return <Icon className={`h-4 w-4 shrink-0 ${active ? "text-primary" : ""}`} />;
              })()}
              <span>{item.title}</span>
            </div>
            <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
          </button>
          {isOpen && (
            <div className="mt-1 ml-4 pl-3 border-l border-sidebar-border space-y-1">
              {item.subItems?.map(subItem => {
                const subActive = location.pathname === subItem.path;
                return (
                  <Link
                    key={subItem.path}
                    to={subItem.path}
                    className={`block px-3 py-2 rounded-md text-sm transition-colors ${subActive ? "text-primary font-medium bg-primary/5" : "text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent"}`}
                  >
                    {subItem.title}
                  </Link>
                );
              })}
            </div>
          )}
        </>
      ) : (
        <Link
          to={item.path}
          className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm transition-colors ${active ? "bg-primary text-primary-foreground" : "text-sidebar-foreground hover:bg-sidebar-accent"}`}
        >
          {(() => {
            const Icon = item.icon;
            return <Icon className="h-4 w-4 shrink-0" />;
          })()}
          <span>{item.title}</span>
        </Link>
      )}
    </div>
  );
}

export default function SMSLayout() {
  const { user, logout } = useAuth();
  const { notifications, unreadCount, markAsRead } = useNotifications();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showNotifs, setShowNotifs] = useState(false);
  const [showAccountMenu, setShowAccountMenu] = useState(false);
  const notificationsRef = useRef<HTMLDivElement>(null);

  if (!user) return null;

  const items = navByRole[user.role];
  const userNotifs = notifications.filter(n => n.targetRole === user.role && (!n.targetId || n.targetId === user.personId));

  const handleLogout = () => {
    setShowNotifs(false);
    setShowAccountMenu(false);
    logout();
  };

  const handleNotificationClick = (notifId: string) => {
    markAsRead(notifId);
    setShowNotifs(false);
  };

  // Close notifications and account menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notificationsRef.current && !notificationsRef.current.contains(e.target as Node)) {
        setShowNotifs(false);
      }
    };

    if (showNotifs) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [showNotifs]);

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sticky Sidebar */}
      <aside className={`${sidebarOpen ? "w-64" : "w-0 overflow-hidden"} transition-all duration-300 bg-sidebar border-r border-sidebar-border flex flex-col sticky top-0 h-screen z-40`}>
        <div className="p-5 border-b border-sidebar-border flex-shrink-0">
          <h1 className="text-lg font-bold text-foreground">Akili Hub Solutions</h1>
          <div className={`inline-block mt-1 text-[10px] font-semibold px-2 py-0.5 rounded text-white ${roleColors[user.role]}`}>
            {roleLabels[user.role]}
          </div>
        </div>
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {items.map(item => (
            <SidebarItem key={item.path || item.title} item={item} location={location} />
          ))}
        </nav>

        {/* Sign Out Button at Bottom of Sidebar */}
        <div className="p-3 border-t border-sidebar-border flex-shrink-0">
          <button 
            onClick={handleLogout} 
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold transition-all duration-200 hover:shadow-lg hover:shadow-orange-500/30 active:scale-95"
          >
            <LogOut className="h-4 w-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        {/* Sticky Header */}
        <header className="sticky top-0 z-40 h-16 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60 flex items-center justify-between px-4 shadow-sm">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-muted-foreground hover:text-foreground transition-colors p-1">
              {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
            <h2 className="text-base font-semibold text-foreground hidden sm:block">{roleLabels[user.role]}</h2>
            <span className="text-sm text-muted-foreground hidden sm:inline">Welcome, <span className="font-semibold text-foreground">{user.name}</span></span>
          </div>
          <div className="flex items-center gap-4">
            {/* Notifications */}
            <div className="relative" ref={notificationsRef}>
              <button 
                onClick={() => setShowNotifs(!showNotifs)} 
                className="relative text-muted-foreground hover:text-foreground transition-colors p-2 hover:bg-secondary rounded-lg"
              >
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 bg-orange-500 text-white text-[10px] font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>
              {showNotifs && (
                <div className="absolute right-0 top-12 w-80 bg-card border border-border rounded-lg shadow-lg z-50 p-3 max-h-80 overflow-y-auto">
                  <h4 className="text-sm font-semibold mb-3 text-foreground">Notifications</h4>
                  {userNotifs.length === 0 ? (
                    <p className="text-xs text-muted-foreground text-center py-4">No notifications</p>
                  ) : (
                    userNotifs.map(n => (
                      <button
                        key={n.id}
                        onClick={() => handleNotificationClick(n.id)}
                        className={`w-full text-left text-xs p-3 rounded-lg mb-2 transition-colors hover:bg-secondary ${n.read ? "text-muted-foreground bg-background" : "bg-orange-50 text-foreground border border-orange-200 hover:bg-orange-100"}`}
                      >
                        <p className="font-medium">{n.message}</p>
                        <span className="text-[10px] text-muted-foreground block mt-1">{n.time}</span>
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

        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          <div className="p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
