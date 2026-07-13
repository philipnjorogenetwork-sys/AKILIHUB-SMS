import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { assignments as initialAssignments, courses, teachers, type Assignment } from "@/data/schoolData";
import { Plus, Trash2, Edit2, X } from "lucide-react";

export default function ManageAssignments() {
  const { user } = useAuth();
  const teacher = teachers.find(t => t.id === user?.personId);
  const myCourses = courses.filter(c => c.assignedTeacherId === teacher?.id);
  const [assignments, setAssignments] = useState<Assignment[]>(initialAssignments.filter(a => a.teacherId === teacher?.id));
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ courseId: "", title: "", description: "", dueDate: "", totalMarks: "" });
  const inputCls = "w-full bg-secondary border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    setAssignments(prev => [...prev, { id: `ASG${String(prev.length + 10).padStart(3, "0")}`, courseId: form.courseId, title: form.title, description: form.description, dueDate: form.dueDate, totalMarks: Number(form.totalMarks) || 20, teacherId: teacher?.id || "" }]);
    setForm({ courseId: "", title: "", description: "", dueDate: "", totalMarks: "" }); setShowForm(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Assignments</h2>
        <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium"><Plus className="h-4 w-4" />New Assignment</button>
      </div>
      {showForm && (
        <div className="bg-card border border-border rounded-xl p-5">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <select value={form.courseId} onChange={e => setForm(p => ({ ...p, courseId: e.target.value }))} className={inputCls} required>
              <option value="">Select Course</option>
              {myCourses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
            <input placeholder="Title" value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} className={inputCls} required />
            <input placeholder="Description" value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} className={inputCls} />
            <input type="date" value={form.dueDate} onChange={e => setForm(p => ({ ...p, dueDate: e.target.value }))} className={inputCls} />
            <input type="number" placeholder="Total Marks" value={form.totalMarks} onChange={e => setForm(p => ({ ...p, totalMarks: e.target.value }))} className={inputCls} />
            <button type="submit" className="bg-primary text-primary-foreground py-2 rounded-lg text-sm font-medium">Add</button>
          </form>
        </div>
      )}
      <div className="space-y-3">
        {assignments.map(a => {
          const course = courses.find(c => c.id === a.courseId);
          return (
            <div key={a.id} className="bg-card border border-border rounded-xl p-4 flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-sm">{a.title}</h3>
                <p className="text-xs text-muted-foreground">{course?.name} • Due: {a.dueDate} • {a.totalMarks} marks</p>
                <p className="text-xs text-muted-foreground mt-1">{a.description}</p>
              </div>
              <button onClick={() => setAssignments(p => p.filter(x => x.id !== a.id))} className="text-destructive hover:opacity-80"><Trash2 className="h-4 w-4" /></button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
