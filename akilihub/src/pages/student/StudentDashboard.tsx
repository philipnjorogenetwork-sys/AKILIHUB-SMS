import { useAuth } from "@/contexts/AuthContext";
import { students, getAttendanceForStudent, getResultsForStudent, assignments, courses, exams, getClassroomForStudent } from "@/data/schoolData";
import { Calendar, Award, BookOpen, ClipboardCheck } from "lucide-react";

export default function StudentDashboard() {
  const { user } = useAuth();
  const student = students.find(s => s.id === user?.personId);
  if (!student) return <p>Student not found</p>;

  const attendance = getAttendanceForStudent(student.id);
  const presentCount = attendance.filter(a => a.status === "present").length;
  const attendanceRate = attendance.length > 0 ? Math.round((presentCount / attendance.length) * 100) : 0;
  const results = getResultsForStudent(student.id);
  const myAssignments = assignments.filter(a => student.enrolledCourses.includes(a.courseId));
  const classroom = getClassroomForStudent(student);

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">Welcome, {student.name}</h2>
      <p className="text-sm text-muted-foreground">{student.grade} {student.section} • {student.admissionNo}</p>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-xl p-4"><div className="flex items-center gap-2 mb-2"><ClipboardCheck className="h-4 w-4 text-emerald-400" /><span className="text-xs text-muted-foreground">Attendance</span></div><p className="text-2xl font-bold">{attendanceRate}%</p></div>
        <div className="bg-card border border-border rounded-xl p-4"><div className="flex items-center gap-2 mb-2"><Award className="h-4 w-4 text-amber-400" /><span className="text-xs text-muted-foreground">Exams Taken</span></div><p className="text-2xl font-bold">{results.length}</p></div>
        <div className="bg-card border border-border rounded-xl p-4"><div className="flex items-center gap-2 mb-2"><BookOpen className="h-4 w-4 text-blue-400" /><span className="text-xs text-muted-foreground">Courses</span></div><p className="text-2xl font-bold">{student.enrolledCourses.length}</p></div>
        <div className="bg-card border border-border rounded-xl p-4"><div className="flex items-center gap-2 mb-2"><Calendar className="h-4 w-4 text-purple-400" /><span className="text-xs text-muted-foreground">Assignments</span></div><p className="text-2xl font-bold">{myAssignments.length}</p></div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card border border-border rounded-xl p-5">
          <h3 className="text-sm font-semibold mb-3">Recent Results</h3>
          {results.length === 0 ? <p className="text-sm text-muted-foreground">No results yet</p> : (
            <div className="space-y-2">{results.map(r => {
              const exam = exams.find(e => e.id === r.examId);
              const course = exam ? courses.find(c => c.id === exam.courseId) : null;
              return (
                <div key={r.id} className="flex items-center justify-between p-3 bg-secondary rounded-lg text-sm">
                  <div><p className="font-medium">{course?.name}</p><p className="text-xs text-muted-foreground">{exam?.name}</p></div>
                  <div className="text-right"><span className="bg-primary/20 text-primary text-xs px-2 py-0.5 rounded font-medium">{r.grade}</span><p className="text-xs text-muted-foreground mt-1">{r.marksObtained}/{exam?.totalMarks}</p></div>
                </div>
              );
            })}</div>
          )}
        </div>
        <div className="bg-card border border-border rounded-xl p-5">
          <h3 className="text-sm font-semibold mb-3">Upcoming Assignments</h3>
          <div className="space-y-2">{myAssignments.map(a => {
            const course = courses.find(c => c.id === a.courseId);
            return (
              <div key={a.id} className="p-3 bg-secondary rounded-lg text-sm">
                <p className="font-medium">{a.title}</p>
                <p className="text-xs text-muted-foreground">{course?.name} • Due: {a.dueDate} • {a.totalMarks} marks</p>
              </div>
            );
          })}</div>
        </div>
      </div>
    </div>
  );
}
