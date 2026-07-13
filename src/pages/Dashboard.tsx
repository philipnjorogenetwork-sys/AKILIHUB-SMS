import { Link } from "react-router-dom";
import {
  Users,
  Briefcase,
  DollarSign,
  AlertTriangle,
  TrendingUp,
  Bell,
  Building2,
  GraduationCap,
  UserPlus,
  Calendar,
  Settings,
  FileText,
  RotateCcw,
} from "lucide-react";
import { useDashboardData } from "@/contexts/DashboardDataContext";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function Dashboard() {
  const { currentTerm, setCurrentTerm, stats, resetStats } = useDashboardData();

  const handleClearAllData = () => {
    resetStats();
    toast.success("Dashboard reset to 0");
  };

  const statCards = [
    { label: "Total Students", value: stats.totalStudents.toLocaleString(), icon: Users, color: "bg-primary" },
    { label: "Total Staff", value: stats.totalStaff.toString(), icon: Briefcase, color: "bg-info" },
    { label: "Revenue (KES)", value: `${(stats.revenue / 1_000_000).toFixed(1)}M`, icon: DollarSign, color: "bg-success" },
    { label: "Outstanding Fees", value: `${(stats.outstandingFees / 1_000_000).toFixed(1)}M`, icon: AlertTriangle, color: "bg-warning" },
    { label: "Avg Performance", value: `${stats.avgPerformance}%`, icon: TrendingUp, color: "bg-accent" },
    { label: "Attendance Alerts", value: stats.attendanceAlerts.toString(), icon: Bell, color: "bg-destructive" },
  ];

  const quickLinks = [
    { label: "Departments", path: "/departments", icon: Building2 },
    { label: "Classes & Streams", path: "/classes", icon: GraduationCap },
    { label: "Admissions", path: "/admissions", icon: UserPlus },
    { label: "Timetable", path: "/timetable", icon: Calendar },
    { label: "Settings", path: "/settings", icon: Settings },
    { label: "Audit Logs", path: "/audit-logs", icon: FileText },
  ];

  return (
    <div className="space-y-6">
      {/* Header with Reset Button */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <Button
          variant="destructive"
          size="sm"
          onClick={handleClearAllData}
          className="flex items-center gap-2"
        >
          <RotateCcw className="h-4 w-4" />
          Reset to 0
        </Button>
      </div>

      {/* Term Selection */}
      <div className="bg-card border border-border rounded-xl p-4">
        <h3 className="text-sm font-semibold mb-3">Select Academic Term</h3>
        <div className="flex gap-3">
          {["Term 1", "Term 2", "Term 3"].map((term) => (
            <Button
              key={term}
              variant={currentTerm === term ? "default" : "outline"}
              size="sm"
              onClick={() => {
                setCurrentTerm(term as "Term 1" | "Term 2" | "Term 3");
                toast.info(`Switched to ${term} data`);
              }}
              className="flex-1"
            >
              {term}
            </Button>
          ))}
        </div>
        <p className="text-xs text-muted-foreground mt-3">
          Current Term: <span className="font-semibold">{currentTerm}</span> - All data below is specific to this term
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {statCards.map((s) => (
          <div key={s.label} className="bg-card border border-border rounded-lg p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className={`${s.color} p-2 rounded-md`}>
                <s.icon className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="text-xs text-muted-foreground">{s.label}</span>
            </div>
            <p className="text-2xl font-bold">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Detailed stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-lg p-4">
          <h3 className="text-sm font-semibold mb-3">Student Breakdown</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">Male</span><span>{stats.maleStudents}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Female</span><span>{stats.femaleStudents}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Boarding</span><span>{stats.boardingStudents}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Day</span><span>{stats.dayStudents}</span></div>
          </div>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <h3 className="text-sm font-semibold mb-3">Staff Breakdown</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">Teaching</span><span>{stats.teachingStaff}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Non-Teaching</span><span>{stats.nonTeachingStaff}</span></div>
          </div>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <h3 className="text-sm font-semibold mb-3">Attendance Overview</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">Attendance Rate</span><span>{stats.attendanceRate}%</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Alerts Today</span><span className="text-destructive">{stats.attendanceAlerts}</span></div>
          </div>
          <div className="mt-3 h-2 bg-secondary rounded-full overflow-hidden">
            <div className="h-full bg-success rounded-full" style={{ width: `${stats.attendanceRate}%` }} />
          </div>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <h3 className="text-sm font-semibold mb-3">Admission Pipeline</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">Inquiries</span><span>{stats.admissionInquiries}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Pending Approvals</span><span className="text-warning">{stats.pendingApprovals}</span></div>
          </div>
        </div>
      </div>

      {/* Quick links */}
      <div>
        <h3 className="text-sm font-semibold mb-3">Quick Links</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {quickLinks.map((l) => (
            <Link
              key={l.path}
              to={l.path}
              className="bg-card border border-border rounded-lg p-4 flex flex-col items-center gap-2 hover:bg-secondary transition-colors text-sm"
            >
              <l.icon className="h-6 w-6 text-primary" />
              <span>{l.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
