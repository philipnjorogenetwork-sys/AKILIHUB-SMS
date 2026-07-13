import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { classrooms, students, teachers, courses, exams, type ExamResult } from "@/data/schoolData";
import { Save } from "lucide-react";

export default function MarksEntry() {
  const { user } = useAuth();
  const teacher = teachers.find(t => t.id === user?.personId);
  const myCourses = courses.filter(c => c.assignedTeacherId === teacher?.id);
  const myExams = exams.filter(ex => myCourses.some(c => c.id === ex.courseId));

  const [selectedExam, setSelectedExam] = useState("");
  const [marks, setMarks] = useState<Record<string, string>>({});
  const [saved, setSaved] = useState(false);

  const exam = exams.find(e => e.id === selectedExam);
  const examStudents = exam ? students.filter(s => s.grade === exam.grade) : [];
  const inputCls = "w-full bg-secondary border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring";

  const selectExam = (id: string) => {
    setSelectedExam(id);
    setSaved(false);
    const ex = exams.find(e => e.id === id);
    if (ex) {
      const init: Record<string, string> = {};
      students.filter(s => s.grade === ex.grade).forEach(s => { init[s.id] = ""; });
      setMarks(init);
    }
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
      <h2 className="text-xl font-bold">Marks Entry</h2>
      <select value={selectedExam} onChange={e => selectExam(e.target.value)} className={`${inputCls} max-w-md`}>
        <option value="">Select Exam</option>
        {myExams.map(ex => {
          const course = courses.find(c => c.id === ex.courseId);
          return <option key={ex.id} value={ex.id}>{ex.name} - {course?.name} ({ex.grade})</option>;
        })}
      </select>

      {exam && examStudents.length > 0 && (
        <div className="bg-card border border-border rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold">{exam.name} — {courses.find(c => c.id === exam.courseId)?.name}</h3>
              <p className="text-xs text-muted-foreground">{exam.grade} • Total: {exam.totalMarks} marks</p>
            </div>
            <button onClick={() => setSaved(true)} className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium"><Save className="h-4 w-4" />Save Marks</button>
          </div>
          {saved && <div className="bg-green-500/10 text-green-400 text-sm p-3 rounded-lg mb-4">✓ Marks saved and grades calculated!</div>}
          <table className="w-full text-sm">
            <thead><tr className="border-b border-border text-muted-foreground">
              <th className="text-left py-2 px-3">Student</th><th className="text-left py-2 px-3">Adm No</th><th className="text-center py-2 px-3">Marks (/{exam.totalMarks})</th><th className="text-center py-2 px-3">Grade</th>
            </tr></thead>
            <tbody>
              {examStudents.map(s => {
                const m = Number(marks[s.id]) || 0;
                return (
                  <tr key={s.id} className="border-b border-border">
                    <td className="py-3 px-3 font-medium">{s.name}</td>
                    <td className="py-3 px-3 text-xs text-muted-foreground">{s.admissionNo}</td>
                    <td className="py-3 px-3 text-center"><input type="number" min="0" max={exam.totalMarks} value={marks[s.id] || ""} onChange={e => setMarks(p => ({ ...p, [s.id]: e.target.value }))} className="w-20 bg-secondary border border-border rounded px-2 py-1 text-sm text-center" /></td>
                    <td className="py-3 px-3 text-center"><span className="bg-primary/20 text-primary text-xs px-2 py-0.5 rounded">{marks[s.id] ? calcGrade(m, exam.totalMarks) : "-"}</span></td>
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
