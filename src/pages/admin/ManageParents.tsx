import React, { useState } from "react";
import { useUserManagement } from "@/contexts/UserManagementContext";
import { Plus, Trash2, Search, Edit2, X, MessageCircle, Eye, Upload, Download } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function ManageParents() {
  const { parents, students, addParent, updateParent, deleteParent } = useUserManagement();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<(typeof parents)[0] | null>(null);
  const [showStudents, setShowStudents] = useState<string | null>(null);
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [form, setForm] = useState({ name: "", phone: "", email: "", address: "", occupation: "", relationship: "Father" });
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const filtered = parents.filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || p.phone.includes(search));
  const inputCls = "w-full bg-secondary border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    if (editing) {
      updateParent(editing.id, { name: form.name, phone: form.phone, email: form.email, address: form.address, occupation: form.occupation, relationship: form.relationship });
      // Update student associations
      selectedStudents.forEach(studentId => {
        const student = students.find(s => s.id === studentId);
        if (student && student.parentId !== editing.id) {
          // Update student's parent if needed - this would require a way to update student's parentId
        }
      });
      toast.success(`${form.name} updated successfully!`);
    } else {
      addParent({ name: form.name, phone: form.phone, email: form.email, address: form.address, occupation: form.occupation, relationship: form.relationship });
      toast.success(`${form.name} added successfully!`);
    }
    resetForm();
  };

  const resetForm = () => { setForm({ name: "", phone: "", email: "", address: "", occupation: "", relationship: "Father" }); setEditing(null); setShowForm(false); setSelectedStudents([]); };
  const startEdit = (p: (typeof parents)[0]) => { 
    const parentStudents = students.filter(s => s.parentId === p.id).map(s => s.id);
    setForm({ name: p.name, phone: p.phone, email: p.email, address: p.address, occupation: p.occupation, relationship: p.relationship }); 
    setSelectedStudents(parentStudents);
    setEditing(p); 
    setShowForm(true); 
  };
  
  const handleDelete = (id: string, name: string) => {
    deleteParent(id);
    toast.success(`${name} deleted successfully!`);
  };

  const handleImportParents = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const lines = text.split("\n").filter(line => line.trim());
        
        // Parse CSV (assuming: name,phone,email,address,occupation,relationship)
        let importedCount = 0;
        lines.forEach((line, index) => {
          if (index === 0 && line.toLowerCase().includes("name")) return; // Skip header
          
          const [name, phone, email, address, occupation, relationship] = line.split(",").map(s => s.trim());
          
          if (name && phone && email) {
            addParent({
              name,
              phone: phone || "",
              email: email || "",
              address: address || "",
              occupation: occupation || "",
              relationship: (relationship || "Father") as any,
            });
            importedCount++;
          }
        });

        if (importedCount > 0) {
          toast.success(`${importedCount} parents imported successfully!`);
        } else {
          toast.error("No valid parents found in file");
        }
      } catch (err) {
        toast.error("Failed to import parents. Check CSV format.");
        console.error(err);
      }
    };
    
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleExportParents = () => {
    if (parents.length === 0) {
      toast.error("No parents to export");
      return;
    }

    const headers = ["Name", "Phone", "Email", "Address", "Occupation", "Relationship"];
    const csvContent = [
      headers.join(","),
      ...parents.map(p => 
        `"${p.name}","${p.phone}","${p.email}","${p.address}","${p.occupation}","${p.relationship}"`
      )
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `parents-${new Date().toISOString().split("T")[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    
    toast.success("Parents exported successfully");
  };

  const getStudentCount = (parentId: string) => {
    return students.filter(s => s.parentId === parentId).length;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Parent Management</h2>
        <div className="flex gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            onChange={handleImportParents}
            className="hidden"
          />
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            <Upload className="h-4 w-4" />Import
          </button>
          <button 
            onClick={handleExportParents}
            className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
          >
            <Download className="h-4 w-4" />Export
          </button>
          <button onClick={() => { resetForm(); setShowForm(true); }} className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90"><Plus className="h-4 w-4" />Add Parent</button>
        </div>
      </div>

      {showForm && (
        <div className="bg-card border border-border rounded-xl p-5">
          <div className="flex items-center justify-between mb-4"><h3 className="text-sm font-semibold">{editing ? "Edit" : "New"} Parent</h3><button onClick={resetForm}><X className="h-4 w-4 text-muted-foreground" /></button></div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <input placeholder="Full Name" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} className={inputCls} required />
              <input placeholder="Phone" value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} className={inputCls} required />
              <input placeholder="Email" type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} className={inputCls} required />
              <input placeholder="Address" value={form.address} onChange={e => setForm(p => ({ ...p, address: e.target.value }))} className={inputCls} />
              <input placeholder="Occupation" value={form.occupation} onChange={e => setForm(p => ({ ...p, occupation: e.target.value }))} className={inputCls} />
              <select value={form.relationship} onChange={e => setForm(p => ({ ...p, relationship: e.target.value }))} className={inputCls}>
                <option value="Father">Father</option>
                <option value="Mother">Mother</option>
                <option value="Guardian">Guardian</option>
                <option value="Other">Other</option>
              </select>
            </div>
            {editing && (
              <div className="border-t pt-4">
                <p className="text-sm font-semibold mb-3">Associated Students</p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-40 overflow-y-auto">
                  {students.map(s => (
                    <label key={s.id} className="flex items-center gap-2 text-sm cursor-pointer hover:bg-secondary/50 p-2 rounded">
                      <input type="checkbox" checked={selectedStudents.includes(s.id)} onChange={e => setSelectedStudents(e.target.checked ? [...selectedStudents, s.id] : selectedStudents.filter(id => id !== s.id))} />
                      <span>{s.name} ({s.grade})</span>
                    </label>
                  ))}
                </div>
              </div>
            )}
            <button type="submit" className="bg-primary text-primary-foreground py-2 px-4 rounded-lg text-sm font-medium hover:opacity-90">{editing ? "Update" : "Add"}</button>
          </form>
        </div>
      )}

      <div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search parents..." className={`${inputCls} pl-10`} /></div>

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead><tr className="border-b border-border bg-secondary/50 text-muted-foreground">
            <th className="text-left py-3 px-4">Name</th><th className="text-left py-3 px-4">Phone</th><th className="text-left py-3 px-4">Email</th><th className="text-left py-3 px-4">Relationship</th><th className="text-center py-3 px-4">Students</th><th className="text-left py-3 px-4">Actions</th>
          </tr></thead>
          <tbody>
            {filtered.map(p => (
              <tr key={p.id} className="border-b border-border hover:bg-secondary/30 cursor-pointer transition-colors" onClick={() => navigate(`/Admin/monitoring/${p.id}`)}>
                <td className="py-3 px-4 font-medium">{p.name}</td>
                <td className="py-3 px-4 text-muted-foreground">{p.phone}</td>
                <td className="py-3 px-4 text-muted-foreground">{p.email}</td>
                <td className="py-3 px-4 text-muted-foreground">{p.relationship}</td>
                <td className="py-3 px-4 text-center"><span className="bg-primary/20 text-primary px-2 py-1 rounded text-xs font-semibold">{getStudentCount(p.id)}</span></td>
                <td className="py-3 px-4 flex gap-2" onClick={(e) => e.stopPropagation()}>
                  <Link to={`/Admin/monitoring/${p.id}`} className="text-blue-500 hover:opacity-80" title="Monitor user activity"><Eye className="h-4 w-4" /></Link>
                  <Link to="/messages" className="text-success hover:opacity-80" title="Message parent"><MessageCircle className="h-4 w-4" /></Link>
                  <button onClick={() => startEdit(p)} className="text-primary hover:opacity-80"><Edit2 className="h-4 w-4" /></button>
                  <button onClick={() => handleDelete(p.id, p.name)} className="text-destructive hover:opacity-80"><Trash2 className="h-4 w-4" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <div className="p-6 text-center text-muted-foreground">No parents found</div>}
      </div>
    </div>
  );
}
