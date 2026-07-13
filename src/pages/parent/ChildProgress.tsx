import { useAuth } from "@/contexts/AuthContext";
import { parents, getChildrenForParent, getAttendanceForStudent, getResultsForStudent, exams, courses } from "@/data/schoolData";

export default function ChildProgress() {
  const { user } = useAuth();
  const parent = parents.find(p => p.id === user?.personId);
  if (!parent) return null;
  const children = getChildrenForParent(parent.id);

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">Children's Progress</h2>
      {children.map(child => {
        const attendance = getAttendanceForStudent(child.id);
        const results = getResultsForStudent(child.id);
        const presentRate = attendance.length > 0 ? Math.round((attendance.filter(a => a.status === "present").length / attendance.length) * 100) : 0;

        return (
          <div key={child.id} className="bg-card border border-border rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div><h3 className="text-lg font-semibold">{child.name}</h3><p className="text-sm text-muted-foreground">{child.grade} {child.section}</p></div>
              <div className="text-right"><p className="text-2xl font-bold">{presentRate}%</p><p className="text-xs text-muted-foreground">Attendance</p></div>
            </div>
            <div>
              <h4 className="text-sm font-semibold mb-2">Exam Results</h4>
              {results.length === 0 ? <p className="text-sm text-muted-foreground">No results yet</p> : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead><tr className="border-b border-border text-muted-foreground">
                      <th className="text-left py-2 px-3">Exam</th><th className="text-left py-2 px-3">Course</th><th className="text-center py-2 px-3">Marks</th><th className="text-center py-2 px-3">Grade</th>
                    </tr></thead>
                    <tbody>{results.map(r => {
                      const exam = exams.find(e => e.id === r.examId);
                      const course = exam ? courses.find(c => c.id === exam.courseId) : null;
                      return (
                        <tr key={r.id} className="border-b border-border">
                          <td className="py-2 px-3">{exam?.name}</td>
                          <td className="py-2 px-3">{course?.name}</td>
                          <td className="py-2 px-3 text-center">{r.marksObtained}/{exam?.totalMarks}</td>
                          <td className="py-2 px-3 text-center"><span className="bg-primary/20 text-primary text-xs px-2 py-0.5 rounded">{r.grade}</span></td>
                        </tr>
                      );
                    })}</tbody>
                  </table>
                </div>
              )}
            </div>
            <div>
              <h4 className="text-sm font-semibold mb-2">Recent Attendance</h4>
              <div className="flex flex-wrap gap-1">
                {attendance.slice(-10).map(a => (
                  <span key={a.id} className={`w-8 h-8 rounded flex items-center justify-center text-xs font-medium ${a.status === "present" ? "bg-green-500/20 text-green-400" : a.status === "absent" ? "bg-red-500/20 text-red-400" : "bg-amber-500/20 text-amber-400"}`}>
                    {a.date.split("-")[2]}
                  </span>
                ))}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
