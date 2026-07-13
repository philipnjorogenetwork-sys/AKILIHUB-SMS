import { useState } from "react";
import { initialClasses, type ClassStream } from "@/data/demoData";
import { Trash2, Edit2 } from "lucide-react";

export default function Classes() {
  const [classes, setClasses] = useState<ClassStream[]>(initialClasses);
  const [className, setClassName] = useState("");
  const [stream, setStream] = useState("");
  const [teacher, setTeacher] = useState("");
  const [students, setStudents] = useState("");
  const [editId, setEditId] = useState<number | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!className.trim() || !stream.trim()) return;

    if (editId !== null) {
      setClasses((prev) =>
        prev.map((c) => (c.id === editId ? { ...c, className, stream, teacher, students: parseInt(students) || 0 } : c))
      );
      setEditId(null);
    } else {
      setClasses((prev) => [
        ...prev,
        { id: Date.now(), className, stream, teacher, students: parseInt(students) || 0 },
      ]);
    }
    setClassName(""); setStream(""); setTeacher(""); setStudents("");
  };

  const handleEdit = (c: ClassStream) => {
    setEditId(c.id); setClassName(c.className); setStream(c.stream); setTeacher(c.teacher); setStudents(c.students.toString());
  };

  const inputClass = "w-full bg-secondary border border-border rounded-md px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring";

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-bold">Class & Stream Management</h2>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-card border border-border rounded-lg p-5">
          <h3 className="text-sm font-semibold mb-4">{editId ? "Edit" : "Create"} Class/Stream</h3>
          <form onSubmit={handleSubmit} className="space-y-3">
            <input placeholder="Class Name (e.g. Form 1)" value={className} onChange={(e) => setClassName(e.target.value)} className={inputClass} />
            <input placeholder="Stream (e.g. East)" value={stream} onChange={(e) => setStream(e.target.value)} className={inputClass} />
            <input placeholder="Class Teacher" value={teacher} onChange={(e) => setTeacher(e.target.value)} className={inputClass} />
            <input placeholder="Number of Students" type="number" value={students} onChange={(e) => setStudents(e.target.value)} className={inputClass} />
            <button type="submit" className="w-full bg-primary text-primary-foreground rounded-md py-2 text-sm font-medium hover:opacity-90">
              {editId ? "Update" : "Save"} Class/Stream
            </button>
            {editId && <button type="button" onClick={() => { setEditId(null); setClassName(""); setStream(""); setTeacher(""); setStudents(""); }} className="w-full text-sm text-muted-foreground">Cancel</button>}
          </form>
        </div>
        <div className="lg:col-span-2 bg-card border border-border rounded-lg p-5 overflow-auto">
          <h3 className="text-sm font-semibold mb-4">Class/Stream Registry ({classes.length})</h3>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-muted-foreground">
                <th className="text-left py-2 px-2">Class</th>
                <th className="text-left py-2 px-2">Stream</th>
                <th className="text-left py-2 px-2">Teacher</th>
                <th className="text-left py-2 px-2">Students</th>
                <th className="text-left py-2 px-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {classes.map((c) => (
                <tr key={c.id} className="border-b border-border">
                  <td className="py-2 px-2">{c.className}</td>
                  <td className="py-2 px-2">{c.stream}</td>
                  <td className="py-2 px-2">{c.teacher}</td>
                  <td className="py-2 px-2">{c.students}</td>
                  <td className="py-2 px-2 flex gap-2">
                    <button onClick={() => handleEdit(c)} className="text-primary hover:opacity-80"><Edit2 className="h-4 w-4" /></button>
                    <button onClick={() => setClasses((p) => p.filter((x) => x.id !== c.id))} className="text-destructive hover:opacity-80"><Trash2 className="h-4 w-4" /></button>
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
