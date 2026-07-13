import { useState } from "react";
import { students as initialStudents, classrooms, parents, type Student } from "@/data/schoolData";
import { Plus, Trash2, Search, Edit2, X } from "lucide-react";

export default function ManageStudents() {
  const [students, setStudents] = useState<Student[]>([...initialStudents]);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Student | null>(null);
  const [form, setForm] = useState({ name: "", age: "", phone: "", email: "", address: "", grade: "Form 1", section: "East", parentId: "" });

  const filtered = students.filter(s => s.name.toLowerCase().includes(search.toLowerCase()) || s.admissionNo.toLowerCase().includes(search.toLowerCase()));
  const inputCls = "w-full bg-secondary border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    if (editing) {
      setStudents(prev => prev.map(s => s.id === editing.id ? { ...s, name: form.name, age: Number(form.age), phone: form.phone, email: form.email, address: form.address, grade: form.grade, section: form.section, parentId: form.parentId } : s));
    } else {
      const newStudent: Student = {
        id: `S${String(students.length + 1).padStart(3, "0")}`, name: form.name, age: Number(form.age) || 14, phone: form.phone, email: form.email, address: form.address,
        admissionNo: `ADM2026${String(students.length + 1).padStart(3, "0")}`, grade: form.grade, section: form.section, parentId: form.parentId,
        enrolledCourses: ["C001", "C002"], feeBalance: 50000, feePaid: 0,
      };
      setStudents(prev => [...prev, newStudent]);
    }
    resetForm();
  };

  const resetForm = () => { setForm({ name: "", age: "", phone: "", email: "", address: "", grade: "Form 1", section: "East", parentId: "" }); setEditing(null); setShowForm(false); };
  const startEdit = (s: Student) => { setForm({ name: s.name, age: String(s.age), phone: s.phone, email: s.email, address: s.address, grade: s.grade, section: s.section, parentId: s.parentId }); setEditing(s); setShowForm(true); };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Student Management</h2>
        <button onClick={() => { resetForm(); setShowForm(true); }} className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90"><Plus className="h-4 w-4" />Add Student</button>
      </div>

      {showForm && (
        <div className="bg-card border border-border rounded-xl p-5">
          <div className="flex items-center justify-between mb-4"><h3 className="text-sm font-semibold">{editing ? "Edit Student" : "New Student"}</h3><button onClick={resetForm}><X className="h-4 w-4 text-muted-foreground" /></button></div>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <input placeholder="Full Name" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} className={inputCls} required />
            <input placeholder="Age" type="number" value={form.age} onChange={e => setForm(p => ({ ...p, age: e.target.value }))} className={inputCls} />
            <input placeholder="Phone" value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} className={inputCls} />
            <input placeholder="Email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} className={inputCls} />
            <input placeholder="Address" value={form.address} onChange={e => setForm(p => ({ ...p, address: e.target.value }))} className={inputCls} />
            <select value={form.grade} onChange={e => setForm(p => ({ ...p, grade: e.target.value }))} className={inputCls}>
              {["Form 1", "Form 2", "Form 3", "Form 4"].map(g => <option key={g}>{g}</option>)}
            </select>
            <select value={form.section} onChange={e => setForm(p => ({ ...p, section: e.target.value }))} className={inputCls}>
              {["East", "West", "North"].map(s => <option key={s}>{s}</option>)}
            </select>
            <select value={form.parentId} onChange={e => setForm(p => ({ ...p, parentId: e.target.value }))} className={inputCls}>
              <option value="">Select Parent</option>
              {parents.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
            <button type="submit" className="bg-primary text-primary-foreground py-2 rounded-lg text-sm font-medium hover:opacity-90">{editing ? "Update" : "Add Student"}</button>
          </form>
        </div>
      )}

      <div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search students..." className={`${inputCls} pl-10`} /></div>

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-border bg-secondary/50 text-muted-foreground">
              <th className="text-left py-3 px-4">Adm No</th><th className="text-left py-3 px-4">Name</th><th className="text-left py-3 px-4">Grade</th><th className="text-left py-3 px-4">Section</th><th className="text-left py-3 px-4">Phone</th><th className="text-left py-3 px-4">Fee Balance</th><th className="text-left py-3 px-4">Actions</th>
            </tr></thead>
            <tbody>
              {filtered.map(s => (
                <tr key={s.id} className="border-b border-border hover:bg-secondary/30">
                  <td className="py-3 px-4 font-mono text-xs">{s.admissionNo}</td>
                  <td className="py-3 px-4 font-medium">{s.name}</td>
                  <td className="py-3 px-4">{s.grade}</td>
                  <td className="py-3 px-4">{s.section}</td>
                  <td className="py-3 px-4 text-muted-foreground">{s.phone}</td>
                  <td className="py-3 px-4"><span className={s.feeBalance > 0 ? "text-red-400" : "text-green-400"}>KSh {s.feeBalance.toLocaleString()}</span></td>
                  <td className="py-3 px-4 flex gap-2">
                    <button onClick={() => startEdit(s)} className="text-primary hover:opacity-80"><Edit2 className="h-4 w-4" /></button>
                    <button onClick={() => setStudents(p => p.filter(x => x.id !== s.id))} className="text-destructive hover:opacity-80"><Trash2 className="h-4 w-4" /></button>
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
