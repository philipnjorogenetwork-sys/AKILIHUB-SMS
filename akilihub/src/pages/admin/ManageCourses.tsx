import { useState } from "react";
import { courses as initialCourses, teachers, type Course } from "@/data/schoolData";
import { Plus, Trash2, Edit2, X, Search } from "lucide-react";

export default function ManageCourses() {
  const [courseList, setCourses] = useState<Course[]>([...initialCourses]);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Course | null>(null);
  const [form, setForm] = useState({ name: "", description: "", assignedTeacherId: "", isElective: false, category: "" });

  const filtered = courseList.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));
  const inputCls = "w-full bg-secondary border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    if (editing) {
      setCourses(prev => prev.map(c => c.id === editing.id ? { ...c, ...form } : c));
    } else {
      setCourses(prev => [...prev, { id: `C${String(prev.length + 1).padStart(3, "0")}`, name: form.name, description: form.description, assignedTeacherId: form.assignedTeacherId, grade: "All", isElective: form.isElective, category: form.category }]);
    }
    resetForm();
  };
  const resetForm = () => { setForm({ name: "", description: "", assignedTeacherId: "", isElective: false, category: "" }); setEditing(null); setShowForm(false); };
  const startEdit = (c: Course) => { setForm({ name: c.name, description: c.description, assignedTeacherId: c.assignedTeacherId, isElective: c.isElective, category: c.category || "" }); setEditing(c); setShowForm(true); };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Course Management</h2>
        <button onClick={() => { resetForm(); setShowForm(true); }} className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90"><Plus className="h-4 w-4" />Add Course</button>
      </div>
      {showForm && (
        <div className="bg-card border border-border rounded-xl p-5">
          <div className="flex items-center justify-between mb-4"><h3 className="text-sm font-semibold">{editing ? "Edit" : "New"} Course</h3><button onClick={resetForm}><X className="h-4 w-4 text-muted-foreground" /></button></div>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <input placeholder="Course Name" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} className={inputCls} required />
            <input placeholder="Description" value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} className={inputCls} />
            <select value={form.assignedTeacherId} onChange={e => setForm(p => ({ ...p, assignedTeacherId: e.target.value }))} className={inputCls}>
              <option value="">Assign Teacher</option>
              {teachers.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.isElective} onChange={e => setForm(p => ({ ...p, isElective: e.target.checked }))} />Elective</label>
            {form.isElective && <input placeholder="Category (coding/music/art/engineering)" value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))} className={inputCls} />}
            <button type="submit" className="bg-primary text-primary-foreground py-2 rounded-lg text-sm font-medium hover:opacity-90">{editing ? "Update" : "Add"}</button>
          </form>
        </div>
      )}
      <div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search courses..." className={`${inputCls} pl-10`} /></div>
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead><tr className="border-b border-border bg-secondary/50 text-muted-foreground">
            <th className="text-left py-3 px-4">ID</th><th className="text-left py-3 px-4">Name</th><th className="text-left py-3 px-4">Teacher</th><th className="text-left py-3 px-4">Type</th><th className="text-left py-3 px-4">Actions</th>
          </tr></thead>
          <tbody>
            {filtered.map(c => (
              <tr key={c.id} className="border-b border-border hover:bg-secondary/30">
                <td className="py-3 px-4 font-mono text-xs">{c.id}</td>
                <td className="py-3 px-4 font-medium">{c.name}</td>
                <td className="py-3 px-4 text-muted-foreground">{teachers.find(t => t.id === c.assignedTeacherId)?.name || "-"}</td>
                <td className="py-3 px-4"><span className={`text-xs px-2 py-0.5 rounded ${c.isElective ? "bg-purple-500/20 text-purple-400" : "bg-blue-500/20 text-blue-400"}`}>{c.isElective ? `Elective (${c.category})` : "Core"}</span></td>
                <td className="py-3 px-4 flex gap-2">
                  <button onClick={() => startEdit(c)} className="text-primary hover:opacity-80"><Edit2 className="h-4 w-4" /></button>
                  <button onClick={() => setCourses(p => p.filter(x => x.id !== c.id))} className="text-destructive hover:opacity-80"><Trash2 className="h-4 w-4" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
