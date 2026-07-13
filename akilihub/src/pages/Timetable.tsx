import { useState } from "react";
import { initialTimetable, type TimetableEntry } from "@/data/demoData";
import { Trash2 } from "lucide-react";

const days = ["MON", "TUE", "WED", "THU", "FRI"];

export default function Timetable() {
  const [entries, setEntries] = useState<TimetableEntry[]>(initialTimetable);
  const [className, setClassName] = useState("");
  const [subject, setSubject] = useState("");
  const [day, setDay] = useState("MON");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [teacher, setTeacher] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!className.trim() || !subject.trim()) return;
    setEntries((prev) => [...prev, { id: Date.now(), className, subject, day, startTime, endTime, teacher }]);
    setClassName(""); setSubject(""); setDay("MON"); setStartTime(""); setEndTime(""); setTeacher("");
  };

  const inputClass = "w-full bg-secondary border border-border rounded-md px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring";

  const [filterDay, setFilterDay] = useState("ALL");

  const filtered = filterDay === "ALL" ? entries : entries.filter((e) => e.day === filterDay);

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-bold">Timetable Management</h2>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-card border border-border rounded-lg p-5">
          <h3 className="text-sm font-semibold mb-4">Create Timetable Entry</h3>
          <form onSubmit={handleSubmit} className="space-y-3">
            <input placeholder="Class (e.g. Form 1 East)" value={className} onChange={(e) => setClassName(e.target.value)} className={inputClass} />
            <input placeholder="Subject" value={subject} onChange={(e) => setSubject(e.target.value)} className={inputClass} />
            <select value={day} onChange={(e) => setDay(e.target.value)} className={inputClass}>
              {days.map((d) => <option key={d} value={d}>{d}</option>)}
            </select>
            <div className="grid grid-cols-2 gap-2">
              <input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} className={inputClass} />
              <input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} className={inputClass} />
            </div>
            <input placeholder="Teacher" value={teacher} onChange={(e) => setTeacher(e.target.value)} className={inputClass} />
            <button type="submit" className="w-full bg-primary text-primary-foreground rounded-md py-2 text-sm font-medium hover:opacity-90">Save Timetable</button>
          </form>
        </div>
        <div className="lg:col-span-2 bg-card border border-border rounded-lg p-5 overflow-auto">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold">Timetable Entries ({filtered.length})</h3>
            <select value={filterDay} onChange={(e) => setFilterDay(e.target.value)} className="bg-secondary border border-border rounded-md px-2 py-1 text-xs text-foreground">
              <option value="ALL">All Days</option>
              {days.map((d) => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-muted-foreground">
                <th className="text-left py-2 px-2">Class</th>
                <th className="text-left py-2 px-2">Subject</th>
                <th className="text-left py-2 px-2">Day</th>
                <th className="text-left py-2 px-2">Time</th>
                <th className="text-left py-2 px-2">Teacher</th>
                <th className="text-left py-2 px-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((e) => (
                <tr key={e.id} className="border-b border-border">
                  <td className="py-2 px-2">{e.className}</td>
                  <td className="py-2 px-2">{e.subject}</td>
                  <td className="py-2 px-2"><span className="text-xs bg-secondary px-2 py-0.5 rounded">{e.day}</span></td>
                  <td className="py-2 px-2 text-muted-foreground">{e.startTime} - {e.endTime}</td>
                  <td className="py-2 px-2">{e.teacher}</td>
                  <td className="py-2 px-2">
                    <button onClick={() => setEntries((p) => p.filter((x) => x.id !== e.id))} className="text-destructive hover:opacity-80"><Trash2 className="h-4 w-4" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
