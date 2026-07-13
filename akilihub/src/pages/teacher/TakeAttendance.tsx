import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { classrooms, students, teachers, type AttendanceRecord } from "@/data/schoolData";
import { Check, X as XIcon, Clock, Download } from "lucide-react";

export default function TakeAttendance() {
  const { user } = useAuth();
  const teacher = teachers.find(t => t.id === user?.personId);
  const myClasses = classrooms.filter(c => teacher?.assignedClasses.includes(c.id));

  const [selectedClass, setSelectedClass] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [attendance, setAttendance] = useState<Record<string, "present" | "absent" | "late">>({});
  const [saved, setSaved] = useState(false);

  const cl = classrooms.find(c => c.id === selectedClass);
  const classStudents = cl ? students.filter(s => cl.enrolledStudentIds.includes(s.id)) : [];

  const selectClass = (id: string) => {
    setSelectedClass(id);
    setSaved(false);
    const cl = classrooms.find(c => c.id === id);
    if (cl) {
      const init: Record<string, "present" | "absent" | "late"> = {};
      cl.enrolledStudentIds.forEach(sid => { init[sid] = "present"; });
      setAttendance(init);
    }
  };

  const handleSave = () => { setSaved(true); };
  const inputCls = "w-full bg-secondary border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring";

  const statusColors = { present: "bg-green-500/20 text-green-400", absent: "bg-red-500/20 text-red-400", late: "bg-amber-500/20 text-amber-400" };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">Take Attendance</h2>
      <div className="flex flex-wrap gap-3">
        <select value={selectedClass} onChange={e => selectClass(e.target.value)} className={`${inputCls} max-w-xs`}>
          <option value="">Select Class</option>
          {myClasses.map(c => <option key={c.id} value={c.id}>{c.grade} - {c.section}</option>)}
        </select>
        <input type="date" value={date} onChange={e => setDate(e.target.value)} className={`${inputCls} max-w-xs`} />
      </div>

      {selectedClass && classStudents.length > 0 && (
        <div className="bg-card border border-border rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold">{cl?.grade} {cl?.section} — {date}</h3>
            <div className="flex gap-2">
              <button onClick={handleSave} className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90">Save</button>
              <button className="border border-border px-4 py-2 rounded-lg text-sm flex items-center gap-1"><Download className="h-3 w-3" />Export</button>
            </div>
          </div>
          {saved && <div className="bg-green-500/10 text-green-400 text-sm p-3 rounded-lg mb-4">✓ Attendance saved successfully!</div>}
          <table className="w-full text-sm">
            <thead><tr className="border-b border-border text-muted-foreground">
              <th className="text-left py-2 px-3">Student</th><th className="text-left py-2 px-3">Adm No</th><th className="text-center py-2 px-3">Status</th>
            </tr></thead>
            <tbody>
              {classStudents.map(s => (
                <tr key={s.id} className="border-b border-border">
                  <td className="py-3 px-3 font-medium">{s.name}</td>
                  <td className="py-3 px-3 text-muted-foreground text-xs">{s.admissionNo}</td>
                  <td className="py-3 px-3">
                    <div className="flex justify-center gap-2">
                      {(["present", "absent", "late"] as const).map(st => (
                        <button key={st} onClick={() => setAttendance(p => ({ ...p, [s.id]: st }))} className={`px-3 py-1 rounded text-xs font-medium ${attendance[s.id] === st ? statusColors[st] : "bg-secondary text-muted-foreground"}`}>
                          {st === "present" ? <Check className="h-3 w-3 inline" /> : st === "absent" ? <XIcon className="h-3 w-3 inline" /> : <Clock className="h-3 w-3 inline" />} {st}
                        </button>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="mt-4 flex gap-4 text-xs text-muted-foreground">
            <span>Present: {Object.values(attendance).filter(v => v === "present").length}</span>
            <span>Absent: {Object.values(attendance).filter(v => v === "absent").length}</span>
            <span>Late: {Object.values(attendance).filter(v => v === "late").length}</span>
          </div>
        </div>
      )}
      {selectedClass && classStudents.length === 0 && <p className="text-sm text-muted-foreground">No students in this class.</p>}
    </div>
  );
}
