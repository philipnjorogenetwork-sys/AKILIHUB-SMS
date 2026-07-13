import { useAuth } from "@/contexts/AuthContext";
import { teachers, classrooms, students, courses, timetableSlots, assignments } from "@/data/schoolData";
import { Users, BookOpen, Calendar, ClipboardCheck } from "lucide-react";

export default function TeacherDashboard() {
  const { user } = useAuth();
  const teacher = teachers.find(t => t.id === user?.personId);
  if (!teacher) return <p>Teacher not found</p>;

  const myClasses = classrooms.filter(c => teacher.assignedClasses.includes(c.id));
  const totalStudents = myClasses.reduce((sum, c) => sum + c.enrolledStudentIds.length, 0);
  const myCourses = courses.filter(c => c.assignedTeacherId === teacher.id);
  const myAssignments = assignments.filter(a => a.teacherId === teacher.id);
  const todaySlots = timetableSlots.filter(t => t.teacherId === teacher.id && t.day === "MON");

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">Welcome, {teacher.name}</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-xl p-4"><div className="flex items-center gap-2 mb-2"><Users className="h-4 w-4 text-blue-400" /><span className="text-xs text-muted-foreground">My Classes</span></div><p className="text-2xl font-bold">{myClasses.length}</p></div>
        <div className="bg-card border border-border rounded-xl p-4"><div className="flex items-center gap-2 mb-2"><Users className="h-4 w-4 text-emerald-400" /><span className="text-xs text-muted-foreground">Total Students</span></div><p className="text-2xl font-bold">{totalStudents}</p></div>
        <div className="bg-card border border-border rounded-xl p-4"><div className="flex items-center gap-2 mb-2"><BookOpen className="h-4 w-4 text-purple-400" /><span className="text-xs text-muted-foreground">Courses</span></div><p className="text-2xl font-bold">{myCourses.length}</p></div>
        <div className="bg-card border border-border rounded-xl p-4"><div className="flex items-center gap-2 mb-2"><ClipboardCheck className="h-4 w-4 text-amber-400" /><span className="text-xs text-muted-foreground">Assignments</span></div><p className="text-2xl font-bold">{myAssignments.length}</p></div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card border border-border rounded-xl p-5">
          <h3 className="text-sm font-semibold mb-3 flex items-center gap-2"><Calendar className="h-4 w-4" />Today's Schedule (Monday)</h3>
          {todaySlots.length === 0 ? <p className="text-sm text-muted-foreground">No classes today</p> : (
            <div className="space-y-2">{todaySlots.map(s => {
              const course = courses.find(c => c.id === s.courseId);
              const cl = classrooms.find(c => c.id === s.classroomId);
              return (
                <div key={s.id} className="flex items-center justify-between p-3 bg-secondary rounded-lg text-sm">
                  <div><p className="font-medium">{course?.name}</p><p className="text-xs text-muted-foreground">{cl?.grade} {cl?.section}</p></div>
                  <span className="text-xs text-muted-foreground">{s.startTime} - {s.endTime}</span>
                </div>
              );
            })}</div>
          )}
        </div>
        <div className="bg-card border border-border rounded-xl p-5">
          <h3 className="text-sm font-semibold mb-3">My Assignments</h3>
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
