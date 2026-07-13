import { useState } from "react";
import { useDashboardData } from "@/contexts/DashboardDataContext";
import { Users, GraduationCap, BookOpen, CreditCard, TrendingUp, AlertTriangle, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function AdminDashboard() {
  const { stats, resetStats } = useDashboardData();
  const [selectedTerm, setSelectedTerm] = useState<"Term 1" | "Term 2" | "Term 3">("Term 1");

  const handleClearAllData = () => {
    // Clear all localStorage
    localStorage.clear();
    resetStats();
    toast.success("All data cleared and reset to 0");
  };

  const statCards = [
    { label: "Total Students", value: stats.totalStudents, icon: GraduationCap, color: "text-orange-500" },
    { label: "Total Staff", value: stats.totalStaff, icon: Users, color: "text-emerald-500" },
    { label: "Teaching Staff", value: stats.teachingStaff, icon: BookOpen, color: "text-blue-500" },
    { label: "Non-Teaching Staff", value: stats.nonTeachingStaff, icon: Users, color: "text-orange-400" },
    { label: "Revenue (KES)", value: `${(stats.revenue / 1_000_000).toFixed(1)}M`, icon: CreditCard, color: "text-green-500" },
    { label: "Outstanding Fees", value: `${(stats.outstandingFees / 1_000_000).toFixed(1)}M`, icon: AlertTriangle, color: "text-red-500" },
    { label: "Avg Performance", value: `${stats.avgPerformance}%`, icon: TrendingUp, color: "text-orange-600" },
    { label: "Attendance Rate", value: `${stats.attendanceRate}%`, icon: TrendingUp, color: "text-amber-600" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h2 className="text-xl font-bold">Admin Dashboard</h2>
        <Button
          variant="destructive"
          size="sm"
          onClick={handleClearAllData}
          className="flex items-center gap-2"
        >
          <RotateCcw className="h-4 w-4" />
          Clear All Data to 0
        </Button>
      </div>

      {/* Term Selection */}
      <div className="bg-card border border-border rounded-xl p-4">
        <h3 className="text-sm font-semibold mb-3">Select Academic Term</h3>
        <div className="flex gap-3">
          {["Term 1", "Term 2", "Term 3"].map((term) => (
            <Button
              key={term}
              variant={selectedTerm === term ? "default" : "outline"}
              size="sm"
              onClick={() => {
                setSelectedTerm(term as "Term 1" | "Term 2" | "Term 3");
                toast.info(`Switched to ${term} data`);
              }}
              className="flex-1"
            >
              {term}
            </Button>
          ))}
        </div>
        <p className="text-xs text-muted-foreground mt-3">
          Current Term: <span className="font-semibold">{selectedTerm}</span> - All data below is specific to this term
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statCards.map(s => (
          <div key={s.label} className="bg-card border border-border rounded-xl p-4">
            <div className="flex items-center gap-3 mb-2">
              <s.icon className={`h-5 w-5 ${s.color}`} />
              <span className="text-xs text-muted-foreground">{s.label}</span>
            </div>
            <p className="text-2xl font-bold">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Breakdown Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-card border border-border rounded-xl p-4">
          <h3 className="text-sm font-semibold mb-3">Student Breakdown</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Male Students</span>
              <span className="font-medium">{stats.maleStudents}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Female Students</span>
              <span className="font-medium">{stats.femaleStudents}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Boarding Students</span>
              <span className="font-medium">{stats.boardingStudents}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Day Students</span>
              <span className="font-medium">{stats.dayStudents}</span>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-4">
          <h3 className="text-sm font-semibold mb-3">Admission Pipeline</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Admission Inquiries</span>
              <span className="font-medium">{stats.admissionInquiries}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Pending Approvals</span>
              <span className="font-medium text-warning">{stats.pendingApprovals}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Attendance Alerts</span>
              <span className="font-medium text-destructive">{stats.attendanceAlerts}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
