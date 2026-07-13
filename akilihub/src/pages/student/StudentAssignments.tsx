import { useAuth } from "@/contexts/AuthContext";
import { students, assignments, courses } from "@/data/schoolData";

export default function StudentAssignments() {
  const { user } = useAuth();
  const student = students.find(s => s.id === user?.personId);
  if (!student) return null;
  const myAssignments = assignments.filter(a => student.enrolledCourses.includes(a.courseId));

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">My Assignments</h2>
      <div className="space-y-3">
        {myAssignments.map(a => {
          const course = courses.find(c => c.id === a.courseId);
          const dueDate = new Date(a.dueDate);
          const isPast = dueDate < new Date();
          return (
            <div key={a.id} className="bg-card border border-border rounded-xl p-5">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold">{a.title}</h3>
                <span className={`text-xs px-2 py-0.5 rounded ${isPast ? "bg-red-500/20 text-red-400" : "bg-green-500/20 text-green-400"}`}>{isPast ? "Past Due" : "Active"}</span>
              </div>
              <p className="text-sm text-muted-foreground mb-1">{a.description}</p>
              <div className="flex gap-4 text-xs text-muted-foreground">
                <span>Course: {course?.name}</span>
                <span>Due: {a.dueDate}</span>
                <span>Marks: {a.totalMarks}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
