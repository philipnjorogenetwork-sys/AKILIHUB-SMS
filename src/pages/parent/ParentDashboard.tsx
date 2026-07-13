import { useAuth } from "@/contexts/AuthContext";
import { parents, getChildrenForParent, getAttendanceForStudent, getResultsForStudent, exams, courses, notifications } from "@/data/schoolData";
import { Users, Award, CreditCard, Bell } from "lucide-react";

export default function ParentDashboard() {
  const { user } = useAuth();
  const parent = parents.find(p => p.id === user?.personId);
  if (!parent) return <p>Parent not found</p>;
  const children = getChildrenForParent(parent.id);
  const totalBalance = children.reduce((s, c) => s + c.feeBalance, 0);
  const myNotifs = notifications.filter(n => n.targetRole === "parent" && (!n.targetId || n.targetId === parent.id));

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">Welcome, {parent.name}</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-xl p-4"><div className="flex items-center gap-2 mb-2"><Users className="h-4 w-4 text-blue-400" /><span className="text-xs text-muted-foreground">Children</span></div><p className="text-2xl font-bold">{children.length}</p></div>
        <div className="bg-card border border-border rounded-xl p-4"><div className="flex items-center gap-2 mb-2"><CreditCard className="h-4 w-4 text-red-400" /><span className="text-xs text-muted-foreground">Total Balance</span></div><p className="text-2xl font-bold">KSh {totalBalance.toLocaleString()}</p></div>
        <div className="bg-card border border-border rounded-xl p-4"><div className="flex items-center gap-2 mb-2"><Bell className="h-4 w-4 text-amber-400" /><span className="text-xs text-muted-foreground">Notifications</span></div><p className="text-2xl font-bold">{myNotifs.filter(n => !n.read).length}</p></div>
        <div className="bg-card border border-border rounded-xl p-4"><div className="flex items-center gap-2 mb-2"><Award className="h-4 w-4 text-emerald-400" /><span className="text-xs text-muted-foreground">Total Paid</span></div><p className="text-2xl font-bold">KSh {children.reduce((s, c) => s + c.feePaid, 0).toLocaleString()}</p></div>
      </div>
      <div className="space-y-4">
        {children.map(child => {
          const att = getAttendanceForStudent(child.id);
          const presentRate = att.length > 0 ? Math.round((att.filter(a => a.status === "present").length / att.length) * 100) : 0;
          const results = getResultsForStudent(child.id);
          return (
            <div key={child.id} className="bg-card border border-border rounded-xl p-5">
              <div className="flex items-center justify-between mb-3">
                <div><h3 className="font-semibold">{child.name}</h3><p className="text-xs text-muted-foreground">{child.grade} {child.section} • {child.admissionNo}</p></div>
                <span className={`text-sm font-semibold ${child.feeBalance > 0 ? "text-red-400" : "text-green-400"}`}>Balance: KSh {child.feeBalance.toLocaleString()}</span>
              </div>
              <div className="grid grid-cols-3 gap-3 text-sm">
                <div className="bg-secondary rounded-lg p-3"><p className="text-xs text-muted-foreground">Attendance</p><p className="font-bold">{presentRate}%</p></div>
                <div className="bg-secondary rounded-lg p-3"><p className="text-xs text-muted-foreground">Exams</p><p className="font-bold">{results.length}</p></div>
                <div className="bg-secondary rounded-lg p-3"><p className="text-xs text-muted-foreground">Courses</p><p className="font-bold">{child.enrolledCourses.length}</p></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
