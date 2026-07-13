import { useState } from "react";
import { classrooms, parents, type Student } from "@/data/schoolData";
import { useEnrollment } from "@/contexts/EnrollmentContext";
import { UserPlus, CheckCircle } from "lucide-react";

export default function Enrollment() {
  const { addEnrolledStudent } = useEnrollment();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ name: "", age: "", phone: "", email: "", address: "", grade: "Form 1", section: "East", parentName: "", parentPhone: "", parentEmail: "" });
  const [done, setDone] = useState(false);
  const inputCls = "w-full bg-secondary border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Add enrolled student to context
    const enrolledStudent = {
      id: `ENRL${Math.floor(1000 + Math.random() * 9000)}`,
      name: form.name,
      email: form.email,
      grade: form.grade,
      section: form.section,
      enrollmentDate: new Date().toLocaleDateString(),
      parentName: form.parentName,
      parentEmail: form.parentEmail,
      parentPhone: form.parentPhone,
    };
    
    addEnrolledStudent(enrolledStudent);
    setDone(true);
  };

  if (done) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="bg-card border border-border rounded-xl p-8 text-center max-w-md">
          <CheckCircle className="h-16 w-16 text-green-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">Enrollment Complete!</h2>
          <p className="text-sm text-muted-foreground mb-4">Student {form.name} has been enrolled in {form.grade} {form.section}.</p>
          <div className="bg-secondary rounded-lg p-4 text-left text-sm space-y-1 mb-4">
            <p><span className="text-muted-foreground">Login Email:</span> {form.email}</p>
            <p><span className="text-muted-foreground">Status:</span> <span className="text-orange-500 font-semibold">Awaiting Credential Generation</span></p>
            <p className="text-xs text-muted-foreground mt-2">This student will appear in the Credential Generator. Admin can now generate login credentials.</p>
          </div>
          <button onClick={() => { setDone(false); setStep(1); setForm({ name: "", age: "", phone: "", email: "", address: "", grade: "Form 1", section: "East", parentName: "", parentPhone: "", parentEmail: "" }); }} className="bg-primary text-primary-foreground px-6 py-2 rounded-lg text-sm font-medium hover:opacity-90">Enroll Another</button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <h2 className="text-xl font-bold flex items-center gap-2"><UserPlus className="h-5 w-5" />Student Enrollment</h2>
      <div className="flex gap-2 mb-4">
        {[1, 2, 3].map(s => (
          <div key={s} className={`flex-1 h-2 rounded-full ${step >= s ? "bg-primary" : "bg-secondary"}`} />
        ))}
      </div>
      <form onSubmit={handleSubmit}>
        {step === 1 && (
          <div className="bg-card border border-border rounded-xl p-6 space-y-4">
            <h3 className="font-semibold">Step 1: Student Details</h3>
            <input placeholder="Full Name" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} className={inputCls} required />
            <div className="grid grid-cols-2 gap-3">
              <input placeholder="Age" type="number" value={form.age} onChange={e => setForm(p => ({ ...p, age: e.target.value }))} className={inputCls} />
              <input placeholder="Grade" value={form.grade} onChange={e => setForm(p => ({ ...p, grade: e.target.value }))} className={inputCls} />
            </div>
            <input placeholder="Email" type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} className={inputCls} required />
            <button type="button" onClick={() => setStep(2)} className="w-full bg-primary text-primary-foreground py-2 rounded-lg text-sm font-medium">Next →</button>
          </div>
        )}
        {step === 2 && (
          <div className="bg-card border border-border rounded-xl p-6 space-y-4">
            <h3 className="font-semibold">Step 2: Assign Grade & Section</h3>
            <select value={form.grade} onChange={e => setForm(p => ({ ...p, grade: e.target.value }))} className={inputCls}>
              {["Form 1", "Form 2", "Form 3", "Form 4"].map(g => <option key={g}>{g}</option>)}
            </select>
            <select value={form.section} onChange={e => setForm(p => ({ ...p, section: e.target.value }))} className={inputCls}>
              {["East", "West", "North"].map(s => <option key={s}>{s}</option>)}
            </select>
            <div className="flex gap-3">
              <button type="button" onClick={() => setStep(1)} className="flex-1 border border-border py-2 rounded-lg text-sm">← Back</button>
              <button type="button" onClick={() => setStep(3)} className="flex-1 bg-primary text-primary-foreground py-2 rounded-lg text-sm font-medium">Next →</button>
            </div>
          </div>
        )}
        {step === 3 && (
          <div className="bg-card border border-border rounded-xl p-6 space-y-4">
            <h3 className="font-semibold">Step 3: Parent / Guardian Details</h3>
            <input placeholder="Parent Name" value={form.parentName} onChange={e => setForm(p => ({ ...p, parentName: e.target.value }))} className={inputCls} />
            <input placeholder="Parent Phone" value={form.parentPhone} onChange={e => setForm(p => ({ ...p, parentPhone: e.target.value }))} className={inputCls} />
            <input placeholder="Parent Email" value={form.parentEmail} onChange={e => setForm(p => ({ ...p, parentEmail: e.target.value }))} className={inputCls} />
            <div className="flex gap-3">
              <button type="button" onClick={() => setStep(2)} className="flex-1 border border-border py-2 rounded-lg text-sm">← Back</button>
              <button type="submit" className="flex-1 bg-primary text-primary-foreground py-2 rounded-lg text-sm font-medium">Complete Enrollment</button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}

