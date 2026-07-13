import { useState } from "react";
import { initialDepartments, type Department } from "@/data/demoData";
import { Trash2, Edit2 } from "lucide-react";

export default function Departments() {
  const [departments, setDepartments] = useState<Department[]>(initialDepartments);
  const [name, setName] = useState("");
  const [head, setHead] = useState("");
  const [editId, setEditId] = useState<number | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !head.trim()) return;

    if (editId !== null) {
      setDepartments((prev) =>
        prev.map((d) => (d.id === editId ? { ...d, name, head } : d))
      );
      setEditId(null);
    } else {
      const newDept: Department = {
        id: Date.now(),
        name,
        head,
        status: "Active",
      };
      setDepartments((prev) => [...prev, newDept]);
    }
    setName("");
    setHead("");
  };

  const handleEdit = (d: Department) => {
    setEditId(d.id);
    setName(d.name);
    setHead(d.head);
  };

  const handleDelete = (id: number) => {
    setDepartments((prev) => prev.filter((d) => d.id !== id));
  };

  const toggleStatus = (id: number) => {
    setDepartments((prev) =>
      prev.map((d) =>
        d.id === id ? { ...d, status: d.status === "Active" ? "Inactive" : "Active" } : d
      )
    );
  };

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-bold">Department Management</h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form */}
        <div className="bg-card border border-border rounded-lg p-5">
          <h3 className="text-sm font-semibold mb-4">{editId ? "Edit" : "Create"} Department</h3>
          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              placeholder="Department Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-secondary border border-border rounded-md px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
            />
            <input
              placeholder="Head of Department"
              value={head}
              onChange={(e) => setHead(e.target.value)}
              className="w-full bg-secondary border border-border rounded-md px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
            />
            <button type="submit" className="w-full bg-primary text-primary-foreground rounded-md py-2 text-sm font-medium hover:opacity-90">
              {editId ? "Update" : "Save"} Department
            </button>
            {editId && (
              <button type="button" onClick={() => { setEditId(null); setName(""); setHead(""); }} className="w-full text-sm text-muted-foreground hover:text-foreground">
                Cancel
              </button>
            )}
          </form>
        </div>

        {/* Table */}
        <div className="lg:col-span-2 bg-card border border-border rounded-lg p-5 overflow-auto">
          <h3 className="text-sm font-semibold mb-4">Departments ({departments.length})</h3>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-muted-foreground">
                <th className="text-left py-2 px-2">ID</th>
                <th className="text-left py-2 px-2">Name</th>
                <th className="text-left py-2 px-2">Head</th>
                <th className="text-left py-2 px-2">Status</th>
                <th className="text-left py-2 px-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {departments.map((d) => (
                <tr key={d.id} className="border-b border-border">
                  <td className="py-2 px-2 text-muted-foreground">{d.id}</td>
                  <td className="py-2 px-2">{d.name}</td>
                  <td className="py-2 px-2">{d.head}</td>
                  <td className="py-2 px-2">
                    <button onClick={() => toggleStatus(d.id)} className={`text-xs px-2 py-0.5 rounded ${d.status === "Active" ? "bg-success/20 text-success" : "bg-destructive/20 text-destructive"}`}>
                      {d.status}
                    </button>
                  </td>
                  <td className="py-2 px-2 flex gap-2">
                    <button onClick={() => handleEdit(d)} className="text-primary hover:opacity-80"><Edit2 className="h-4 w-4" /></button>
                    <button onClick={() => handleDelete(d.id)} className="text-destructive hover:opacity-80"><Trash2 className="h-4 w-4" /></button>
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
