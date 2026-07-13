import { useState } from "react";
import { teachers as initialTeachers, type Teacher } from "@/data/schoolData";
import { Plus, Trash2, Edit2, X, Search } from "lucide-react";

export default function ManageTeachers() {
  const [teachers, setTeachers] = useState<Teacher[]>([...initialTeachers]);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Teacher | null>(null);
  const [form, setForm] = useState({ name: "", age: "", phone: "", email: "", address: "", subjects: "" });

  const filtered = teachers.filter(t => t.name.toLowerCase().includes(search.toLowerCase()));
  const inputCls = "w-full bg-secondary border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    const subjects = form.subjects.split(",").map(s => s.trim()).filter(Boolean);
    if (editing) {
      setTeachers(prev => prev.map(t => t.id === editing.id ? { ...t, name: form.name, age: Number(form.age), phone: form.phone, email: form.email, address: form.address, subjects } : t));
    } else {
      setTeachers(prev => [...prev, { id: `T${String(prev.length + 1).padStart(3, "0")}`, name: form.name, age: Number(form.age) || 30, phone: form.phone, email: form.email, address: form.address, employeeId: `EMP${String(prev.length + 1).padStart(3, "0")}`, subjects, assignedClasses: [] }]);
    }
    resetForm();
  };

  const resetForm = () => { setForm({ name: "", age: "", phone: "", email: "", address: "", subjects: "" }); setEditing(null); setShowForm(false); };
  const startEdit = (t: Teacher) => { setForm({ name: t.name, age: String(t.age), phone: t.phone, email: t.email, address: t.address, subjects: t.subjects.join(", ") }); setEditing(t); setShowForm(true); };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Teacher Management</h2>
        <button onClick={() => { resetForm(); setShowForm(true); }} className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90"><Plus className="h-4 w-4" />Add Teacher</button>
      </div>
      {showForm && (
        <div className="bg-card border border-border rounded-xl p-5">
          <div className="flex items-center justify-between mb-4"><h3 className="text-sm font-semibold">{editing ? "Edit" : "New"} Teacher</h3><button onClick={resetForm}><X className="h-4 w-4 text-muted-foreground" /></button></div>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <input placeholder="Full Name" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} className={inputCls} required />
            <input placeholder="Age" type="number" value={form.age} onChange={e => setForm(p => ({ ...p, age: e.target.value }))} className={inputCls} />
            <input placeholder="Phone" value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} className={inputCls} />
            <input placeholder="Email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} className={inputCls} />
            <input placeholder="Address" value={form.address} onChange={e => setForm(p => ({ ...p, address: e.target.value }))} className={inputCls} />
            <input placeholder="Subjects (comma-separated)" value={form.subjects} onChange={e => setForm(p => ({ ...p, subjects: e.target.value }))} className={inputCls} />
            <button type="submit" className="bg-primary text-primary-foreground py-2 rounded-lg text-sm font-medium hover:opacity-90">{editing ? "Update" : "Add"}</button>
          </form>
        </div>
      )}
      <div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search teachers..." className={`${inputCls} pl-10`} /></div>
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-border bg-secondary/50 text-muted-foreground">
              <th className="text-left py-3 px-4">ID</th><th className="text-left py-3 px-4">Name</th><th className="text-left py-3 px-4">Subjects</th><th className="text-left py-3 px-4">Phone</th><th className="text-left py-3 px-4">Email</th><th className="text-left py-3 px-4">Actions</th>
            </tr></thead>
            <tbody>
              {filtered.map(t => (
                <tr key={t.id} className="border-b border-border hover:bg-secondary/30">
                  <td className="py-3 px-4 font-mono text-xs">{t.employeeId}</td>
                  <td className="py-3 px-4 font-medium">{t.name}</td>
                  <td className="py-3 px-4"><div className="flex flex-wrap gap-1">{t.subjects.map(s => <span key={s} className="bg-primary/20 text-primary text-xs px-2 py-0.5 rounded">{s}</span>)}</div></td>
                  <td className="py-3 px-4 text-muted-foreground">{t.phone}</td>
                  <td className="py-3 px-4 text-muted-foreground">{t.email}</td>
                  <td className="py-3 px-4 flex gap-2">
                    <button onClick={() => startEdit(t)} className="text-primary hover:opacity-80"><Edit2 className="h-4 w-4" /></button>
                    <button onClick={() => setTeachers(p => p.filter(x => x.id !== t.id))} className="text-destructive hover:opacity-80"><Trash2 className="h-4 w-4" /></button>
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
