import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { classrooms, students, teachers, courses, exams, examResults, type ExamResult } from "@/data/schoolData";
import { Save, CheckCircle, Clock } from "lucide-react";
import { toast } from "sonner";

export default function MarksEntry() {
  const { user } = useAuth();
  const teacher = teachers.find(t => t.id === user?.personId);
  const myCourses = courses.filter(c => c.assignedTeacherId === teacher?.id);
  const myExams = exams.filter(ex => myCourses.some(c => c.id === ex.courseId) || user?.role === "Admin");

  const [selectedExam, setSelectedExam] = useState("");
  const [marks, setMarks] = useState<Record<string, { marks: string, status: "pending" | "approved" }>>({});
  const [saved, setSaved] = useState(false);

  const exam = exams.find(e => e.id === selectedExam);
  const examStudents = exam ? students.filter(s => s.grade === exam.grade) : [];
  const inputCls = "w-full bg-secondary border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring";

  const selectExam = (id: string) => {
    setSelectedExam(id);
    setSaved(false);
    const ex = exams.find(e => e.id === id);
    if (ex) {
      const init: Record<string, { marks: string, status: "pending" | "approved" }> = {};
      students.filter(s => s.grade === ex.grade).forEach(s => { 
        const existing = examResults.find(r => r.examId === id && r.studentId === s.id);
        init[s.id] = { 
          marks: existing ? String(existing.marksObtained) : "", 
          status: existing ? existing.status : "pending" 
        }; 
      });
      setMarks(init);
    }
  };

  const handleSave = () => {
    setSaved(true);
    toast.success("Marks synchronized and updated!");
  };

  const calcGrade = (m: number, total: number) => {
    const pct = (m / total) * 100;
    if (pct >= 80) return "A";
    if (pct >= 70) return "A-";
    if (pct >= 60) return "B+";
    if (pct >= 50) return "B";
    if (pct >= 40) return "C+";
    if (pct >= 30) return "C";
    return "D";
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-black text-slate-800  uppercase">Marks & Grading Hall</h2>
        <p className="text-sm text-slate-500">Official examiner panel for inputting and approving student results.</p>
      </div>

      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Choose Assessment</label>
        <select value={selectedExam} onChange={e => selectExam(e.target.value)} className={`${inputCls} max-w-md bg-white`}>
          <option value="">Select Exam</option>
          {myExams.map(ex => {
            const course = courses.find(c => c.id === ex.courseId);
            return <option key={ex.id} value={ex.id}>{ex.name} - {course?.name} ({ex.grade})</option>;
          })}
        </select>
      </div>

      {exam && examStudents.length > 0 && (
        <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
          <div className="p-6 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
            <div>
              <h3 className="text-sm font-black text-slate-800 uppercase ">
                {exam.name} — {courses.find(c => c.id === exam.courseId)?.name}
              </h3>
              <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest">{exam.grade} • Maximum: {exam.totalMarks} points</p>
            </div>
            <button onClick={handleSave} className="flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-orange-500/20 active:scale-95">
              <Save className="h-3.5 w-3.5" />
              Commit Updates
            </button>
          </div>
          
          <table className="w-full">
            <thead>
              <tr className="bg-white border-b border-slate-50 text-left">
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Student Candidate</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Marks (/{exam.totalMarks})</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Grade</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Control Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {examStudents.map(s => {
                const data = marks[s.id] || { marks: "", status: "pending" };
                const m = Number(data.marks) || 0;
                return (
                  <tr key={s.id} className="hover:bg-slate-50/30 transition-colors">
                    <td className="px-6 py-4">
                      <p className="text-sm font-bold text-slate-800">{s.name}</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{s.admissionNo}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center">
                        <input 
                          type="number" 
                          min="0" 
                          max={exam.totalMarks} 
                          value={data.marks} 
                          onChange={e => setMarks(p => ({ ...p, [s.id]: { ...p[s.id], marks: e.target.value } }))} 
                          className="w-20 bg-slate-50 border border-slate-100 rounded-xl px-2 py-2 text-sm text-center font-bold text-slate-700 focus:bg-white focus:ring-2 focus:ring-orange-500/20 focus:outline-none" 
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-sm font-black text-orange-600">
                        {data.marks ? calcGrade(m, exam.totalMarks) : "-"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center">
                        <button 
                          onClick={() => setMarks(p => ({ ...p, [s.id]: { ...p[s.id], status: p[s.id].status === 'approved' ? 'pending' : 'approved' } }))}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
                            data.status === 'approved' 
                              ? "bg-emerald-50 text-emerald-600 border border-emerald-100" 
                              : "bg-amber-50 text-amber-600 border border-amber-100"
                          }`}
                        >
                          {data.status === 'approved' ? <CheckCircle className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                          {data.status}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

