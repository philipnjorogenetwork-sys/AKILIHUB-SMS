import { schoolInfo, students, teachers, courses, classrooms, feePayments, attendanceRecords } from "@/data/schoolData";
import { Users, GraduationCap, BookOpen, CreditCard, TrendingUp, AlertTriangle } from "lucide-react";

export default function AdminDashboard() {
  const totalFees = students.reduce((s, st) => s + st.feePaid + st.feeBalance, 0);
  const collected = students.reduce((s, st) => s + st.feePaid, 0);
  const outstanding = students.reduce((s, st) => s + st.feeBalance, 0);
  const recentPayments = feePayments.slice(-5).reverse();
  const todayAttendance = attendanceRecords.filter(a => a.date === "2026-04-10");
  const presentCount = todayAttendance.filter(a => a.status === "present").length;
  const attendanceRate = todayAttendance.length > 0 ? Math.round((presentCount / todayAttendance.length) * 100) : 0;

  const stats = [
    { label: "Total Students", value: students.length, icon: GraduationCap, color: "text-blue-400" },
    { label: "Total Teachers", value: teachers.length, icon: Users, color: "text-emerald-400" },
    { label: "Courses", value: courses.length, icon: BookOpen, color: "text-purple-400" },
    { label: "Classrooms", value: classrooms.length, icon: Users, color: "text-amber-400" },
    { label: "Fees Collected", value: `KSh ${(collected / 1000).toFixed(0)}K`, icon: CreditCard, color: "text-green-400" },
    { label: "Outstanding", value: `KSh ${(outstanding / 1000).toFixed(0)}K`, icon: AlertTriangle, color: "text-red-400" },
    { label: "Attendance Rate", value: `${attendanceRate}%`, icon: TrendingUp, color: "text-cyan-400" },
    { label: "Collection Rate", value: `${Math.round((collected / totalFees) * 100)}%`, icon: CreditCard, color: "text-indigo-400" },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">Admin Dashboard</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map(s => (
          <div key={s.label} className="bg-card border border-border rounded-xl p-4">
            <div className="flex items-center gap-3 mb-2">
              <s.icon className={`h-5 w-5 ${s.color}`} />
              <span className="text-xs text-muted-foreground">{s.label}</span>
            </div>
            <p className="text-2xl font-bold">{s.value}</p>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card border border-border rounded-xl p-5">
          <h3 className="text-sm font-semibold mb-3">Recent Fee Payments</h3>
          <div className="space-y-2">
            {recentPayments.map(p => {
              const st = students.find(s => s.id === p.studentId);
              return (
                <div key={p.id} className="flex items-center justify-between text-sm p-2 bg-secondary rounded-lg">
                  <div><p className="font-medium">{st?.name}</p><p className="text-xs text-muted-foreground">{p.date} • {p.method.toUpperCase()}</p></div>
                  <span className="font-semibold text-green-400">KSh {p.amount.toLocaleString()}</span>
                </div>
              );
            })}
          </div>
        </div>
        <div className="bg-card border border-border rounded-xl p-5">
          <h3 className="text-sm font-semibold mb-3">Students with Outstanding Fees</h3>
          <div className="space-y-2">
            {students.filter(s => s.feeBalance > 0).sort((a, b) => b.feeBalance - a.feeBalance).slice(0, 5).map(s => (
              <div key={s.id} className="flex items-center justify-between text-sm p-2 bg-secondary rounded-lg">
                <div><p className="font-medium">{s.name}</p><p className="text-xs text-muted-foreground">{s.grade} {s.section}</p></div>
                <span className="font-semibold text-red-400">KSh {s.feeBalance.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
