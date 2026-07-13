import React, { useState } from "react";
import { useUserManagement } from "@/contexts/UserManagementContext";
import { useDashboardData } from "@/contexts/DashboardDataContext";
import { Plus, Trash2, Search, Edit2, X, MessageCircle, Eye, Upload, Download } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function ManageStudents() {
  const { students, parents, addStudent, updateStudent, deleteStudent } = useUserManagement();
  const { incrementStat } = useDashboardData();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<(typeof students)[0] | null>(null);
  const [form, setForm] = useState({ name: "", age: "", phone: "", email: "", address: "", grade: "Form 1", section: "East", parentId: "" });
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const filtered = students.filter(s => s.name.toLowerCase().includes(search.toLowerCase()) || s.admissionNo.toLowerCase().includes(search.toLowerCase()));
  const inputCls = "w-full bg-secondary border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    if (editing) {
      updateStudent(editing.id, { name: form.name, age: Number(form.age), phone: form.phone, email: form.email, address: form.address, grade: form.grade, section: form.section, parentId: form.parentId });
      toast.success(`${form.name} updated successfully!`);
    } else {
      addStudent({ name: form.name, age: Number(form.age) || 14, phone: form.phone, email: form.email, address: form.address, grade: form.grade, section: form.section, parentId: form.parentId, enrolledCourses: ["C001", "C002"], feeBalance: 50000, feePaid: 0 });
      // Update dashboard stats
      incrementStat("totalStudents", 1);
      toast.success(`${form.name} added successfully! They appear in Credential Generator.`);
    }
    resetForm();
  };

  const resetForm = () => { setForm({ name: "", age: "", phone: "", email: "", address: "", grade: "Form 1", section: "East", parentId: "" }); setEditing(null); setShowForm(false); };
  const startEdit = (s: (typeof students)[0]) => { setForm({ name: s.name, age: String(s.age), phone: s.phone, email: s.email, address: s.address, grade: s.grade, section: s.section, parentId: s.parentId }); setEditing(s); setShowForm(true); };
  
  const handleDelete = (id: string, name: string) => {
    deleteStudent(id);
    // Update dashboard stats
    incrementStat("totalStudents", -1);
    toast.success(`${name} and associated credentials deleted.`);
  };

  const handleImportStudents = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const lines = text.split("\n").filter(line => line.trim());
        
        // Parse CSV (assuming: name,age,phone,email,address,grade,section)
        let importedCount = 0;
        lines.forEach((line, index) => {
          if (index === 0 && line.toLowerCase().includes("name")) return; // Skip header
          
          const [name, age, phone, email, address, grade, section] = line.split(",").map(s => s.trim());
          
          if (name && age && email) {
            addStudent({
              name,
              age: Number(age) || 14,
              phone: phone || "",
              email: email || "",
              address: address || "",
              grade: grade || "Form 1",
              section: section || "East",
              parentId: "",
              enrolledCourses: ["C001", "C002"],
              feeBalance: 50000,
              feePaid: 0,
            });
            importedCount++;
          }
        });

        if (importedCount > 0) {
          // Update dashboard stats
          incrementStat("totalStudents", importedCount);
          toast.success(`${importedCount} students imported successfully!`);
        } else {
          toast.error("No valid students found in file");
        }
      } catch (err) {
        toast.error("Failed to import students. Check CSV format.");
        console.error(err);
      }
    };
    
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleExportStudents = () => {
    if (students.length === 0) {
      toast.error("No students to export");
      return;
    }

    const headers = ["Name", "Age", "Phone", "Email", "Address", "Grade", "Section", "Admission No"];
    const csvContent = [
      headers.join(","),
      ...students.map(s => 
        `"${s.name}","${s.age}","${s.phone}","${s.email}","${s.address}","${s.grade}","${s.section}","${s.admissionNo}"`
      )
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `students-${new Date().toISOString().split("T")[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    
    toast.success("Students exported successfully");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Student Management</h2>
        <div className="flex gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            onChange={handleImportStudents}
            className="hidden"
          />
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            <Upload className="h-4 w-4" />Import
          </button>
          <button 
            onClick={handleExportStudents}
            className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
          >
            <Download className="h-4 w-4" />Export
          </button>
          <button onClick={() => { resetForm(); setShowForm(true); }} className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90"><Plus className="h-4 w-4" />Add Student</button>
        </div>
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
                <tr key={s.id} className="border-b border-border hover:bg-secondary/30 cursor-pointer transition-colors" onClick={() => navigate(`/Admin/monitoring/${s.id}`)}>
                  <td className="py-3 px-4 font-mono text-xs">{s.admissionNo}</td>
                  <td className="py-3 px-4 font-medium">{s.name}</td>
                  <td className="py-3 px-4">{s.grade}</td>
                  <td className="py-3 px-4">{s.section}</td>
                  <td className="py-3 px-4 text-muted-foreground">{s.phone}</td>
                  <td className="py-3 px-4"><span className={s.feeBalance > 0 ? "text-red-400" : "text-green-400"}>KSh {s.feeBalance.toLocaleString()}</span></td>
                  <td className="py-3 px-4 flex gap-2" onClick={(e) => e.stopPropagation()}>
                    <Link to={`/Admin/monitoring/${s.id}`} className="text-blue-500 hover:opacity-80" title="Monitor user activity"><Eye className="h-4 w-4" /></Link>
                    <Link to="/messages" className="text-success hover:opacity-80" title="Message student"><MessageCircle className="h-4 w-4" /></Link>
                    <button onClick={() => startEdit(s)} className="text-primary hover:opacity-80"><Edit2 className="h-4 w-4" /></button>
                    <button onClick={() => handleDelete(s.id, s.name)} className="text-destructive hover:opacity-80"><Trash2 className="h-4 w-4" /></button>
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
