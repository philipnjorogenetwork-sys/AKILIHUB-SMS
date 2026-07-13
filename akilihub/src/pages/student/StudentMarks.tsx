import { useAuth } from "@/contexts/AuthContext";
import { students, getResultsForStudent, exams, courses } from "@/data/schoolData";

export default function StudentMarks() {
  const { user } = useAuth();
  const student = students.find(s => s.id === user?.personId);
  if (!student) return null;
  const results = getResultsForStudent(student.id);

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">Marks & Grades</h2>
      {results.length === 0 ? <p className="text-sm text-muted-foreground">No results available yet.</p> : (
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-border bg-secondary/50 text-muted-foreground">
              <th className="text-left py-3 px-4">Exam</th><th className="text-left py-3 px-4">Course</th><th className="text-center py-3 px-4">Marks</th><th className="text-center py-3 px-4">Grade</th><th className="text-left py-3 px-4">Remarks</th>
            </tr></thead>
            <tbody>
              {results.map(r => {
                const exam = exams.find(e => e.id === r.examId);
                const course = exam ? courses.find(c => c.id === exam.courseId) : null;
                return (
                  <tr key={r.id} className="border-b border-border">
                    <td className="py-3 px-4 font-medium">{exam?.name}</td>
                    <td className="py-3 px-4">{course?.name}</td>
                    <td className="py-3 px-4 text-center">{r.marksObtained}/{exam?.totalMarks}</td>
                    <td className="py-3 px-4 text-center"><span className="bg-primary/20 text-primary text-xs px-2 py-0.5 rounded font-medium">{r.grade}</span></td>
                    <td className="py-3 px-4 text-muted-foreground text-xs">{r.remarks}</td>
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
