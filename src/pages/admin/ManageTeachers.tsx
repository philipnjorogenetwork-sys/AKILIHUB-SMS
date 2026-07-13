import React, { useState } from "react";
import { useUserManagement } from "@/contexts/UserManagementContext";
import { Plus, Trash2, Edit2, X, Search, MessageCircle, Eye, Upload, Download } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function ManageTeachers() {
  const { teachers, addTeacher, updateTeacher, deleteTeacher } = useUserManagement();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<(typeof teachers)[0] | null>(null);
  const [form, setForm] = useState({ name: "", age: "", phone: "", email: "", address: "", subjects: "" });
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const filtered = teachers.filter(t => t.name.toLowerCase().includes(search.toLowerCase()));
  const inputCls = "w-full bg-secondary border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    const subjects = form.subjects.split(",").map(s => s.trim()).filter(Boolean);
    if (editing) {
      updateTeacher(editing.id, { name: form.name, age: Number(form.age), phone: form.phone, email: form.email, address: form.address, subjects });
      toast.success(`${form.name} updated successfully!`);
    } else {
      addTeacher({ name: form.name, age: Number(form.age) || 30, phone: form.phone, email: form.email, address: form.address, subjects, assignedClasses: [] });
      toast.success(`${form.name} added successfully! They appear in Credential Generator.`);
    }
    resetForm();
  };

  const resetForm = () => { setForm({ name: "", age: "", phone: "", email: "", address: "", subjects: "" }); setEditing(null); setShowForm(false); };
  const startEdit = (t: (typeof teachers)[0]) => { setForm({ name: t.name, age: String(t.age), phone: t.phone, email: t.email, address: t.address, subjects: t.subjects.join(", ") }); setEditing(t); setShowForm(true); };
  
  const handleDelete = (id: string, name: string) => {
    deleteTeacher(id);
    toast.success(`${name} and associated credentials deleted.`);
  };

  const handleImportTeachers = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const lines = text.split("\n").filter(line => line.trim());
        
        // Parse CSV (assuming: name,age,phone,email,address,subjects)
        let importedCount = 0;
        lines.forEach((line, index) => {
          if (index === 0 && line.toLowerCase().includes("name")) return; // Skip header
          
          const [name, age, phone, email, address, subjectsStr] = line.split(",").map(s => s.trim());
          
          if (name && age && email) {
            const subjects = subjectsStr?.split("|").map(s => s.trim()) || [];
            addTeacher({
              name,
              age: Number(age) || 30,
              phone: phone || "",
              email: email || "",
              address: address || "",
              subjects: subjects,
              assignedClasses: [],
            });
            importedCount++;
          }
        });

        if (importedCount > 0) {
          toast.success(`${importedCount} teachers imported successfully!`);
        } else {
          toast.error("No valid teachers found in file");
        }
      } catch (err) {
        toast.error("Failed to import teachers. Check CSV format.");
        console.error(err);
      }
    };
    
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleExportTeachers = () => {
    if (teachers.length === 0) {
      toast.error("No teachers to export");
      return;
    }

    const headers = ["Name", "Age", "Phone", "Email", "Address", "Subjects", "Employee ID"];
    const csvContent = [
      headers.join(","),
      ...teachers.map(t => 
        `"${t.name}","${t.age}","${t.phone}","${t.email}","${t.address}","${t.subjects.join(" | ")}","${t.employeeId}"`
      )
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `teachers-${new Date().toISOString().split("T")[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    
    toast.success("Teachers exported successfully");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Teacher Management</h2>
        <div className="flex gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            onChange={handleImportTeachers}
            className="hidden"
          />
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            <Upload className="h-4 w-4" />Import
          </button>
          <button 
            onClick={handleExportTeachers}
            className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
          >
            <Download className="h-4 w-4" />Export
          </button>
          <button onClick={() => { resetForm(); setShowForm(true); }} className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90"><Plus className="h-4 w-4" />Add Teacher</button>
        </div>
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
                <tr key={t.id} className="border-b border-border hover:bg-secondary/30 cursor-pointer transition-colors" onClick={() => navigate(`/Admin/monitoring/${t.id}`)}>
                  <td className="py-3 px-4 font-mono text-xs">{t.employeeId}</td>
                  <td className="py-3 px-4 font-medium">{t.name}</td>
                  <td className="py-3 px-4"><div className="flex flex-wrap gap-1">{t.subjects.map(s => <span key={s} className="bg-primary/20 text-primary text-xs px-2 py-0.5 rounded">{s}</span>)}</div></td>
                  <td className="py-3 px-4 text-muted-foreground">{t.phone}</td>
                  <td className="py-3 px-4 text-muted-foreground">{t.email}</td>
                  <td className="py-3 px-4 flex gap-2" onClick={(e) => e.stopPropagation()}>
                    <Link to={`/Admin/monitoring/${t.id}`} className="text-blue-500 hover:opacity-80" title="Monitor user activity"><Eye className="h-4 w-4" /></Link>
                    <Link to="/messages" className="text-success hover:opacity-80" title="Message teacher"><MessageCircle className="h-4 w-4" /></Link>
                    <button onClick={() => startEdit(t)} className="text-primary hover:opacity-80"><Edit2 className="h-4 w-4" /></button>
                    <button onClick={() => handleDelete(t.id, t.name)} className="text-destructive hover:opacity-80"><Trash2 className="h-4 w-4" /></button>
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
