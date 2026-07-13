import { useAuth } from "@/contexts/AuthContext";
import { students, getAttendanceForStudent } from "@/data/schoolData";

export default function StudentAttendance() {
  const { user } = useAuth();
  const student = students.find(s => s.id === user?.personId);
  if (!student) return null;
  const records = getAttendanceForStudent(student.id);
  const present = records.filter(r => r.status === "present").length;
  const absent = records.filter(r => r.status === "absent").length;
  const late = records.filter(r => r.status === "late").length;
  const rate = records.length > 0 ? Math.round((present / records.length) * 100) : 0;

  const statusColor = (s: string) => s === "present" ? "bg-green-500/20 text-green-400" : s === "absent" ? "bg-red-500/20 text-red-400" : "bg-amber-500/20 text-amber-400";

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">My Attendance</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-xl p-4"><p className="text-xs text-muted-foreground">Attendance Rate</p><p className="text-2xl font-bold">{rate}%</p></div>
        <div className="bg-card border border-border rounded-xl p-4"><p className="text-xs text-muted-foreground">Present</p><p className="text-2xl font-bold text-green-400">{present}</p></div>
        <div className="bg-card border border-border rounded-xl p-4"><p className="text-xs text-muted-foreground">Absent</p><p className="text-2xl font-bold text-red-400">{absent}</p></div>
        <div className="bg-card border border-border rounded-xl p-4"><p className="text-xs text-muted-foreground">Late</p><p className="text-2xl font-bold text-amber-400">{late}</p></div>
      </div>
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead><tr className="border-b border-border bg-secondary/50 text-muted-foreground">
            <th className="text-left py-3 px-4">Date</th><th className="text-left py-3 px-4">Status</th>
          </tr></thead>
          <tbody>
            {records.map(r => (
              <tr key={r.id} className="border-b border-border">
                <td className="py-3 px-4">{r.date}</td>
                <td className="py-3 px-4"><span className={`text-xs px-2 py-0.5 rounded ${statusColor(r.status)}`}>{r.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
