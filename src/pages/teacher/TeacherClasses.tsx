import { useAuth } from "@/contexts/AuthContext";
import { teachers, classrooms, students } from "@/data/schoolData";

export default function TeacherClasses() {
  const { user } = useAuth();
  const teacher = teachers.find(t => t.id === user?.personId);
  const myClasses = classrooms.filter(c => teacher?.assignedClasses.includes(c.id));

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">My Classes</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {myClasses.map(cl => {
          const enrolled = students.filter(s => cl.enrolledStudentIds.includes(s.id));
          return (
            <div key={cl.id} className="bg-card border border-border rounded-xl p-5">
              <h3 className="font-semibold mb-2">{cl.grade} - {cl.section}</h3>
              <p className="text-sm text-muted-foreground mb-3">Students: {enrolled.length}</p>
              <div className="space-y-1">
                {enrolled.map(s => (
                  <div key={s.id} className="text-xs bg-secondary rounded px-2 py-1.5 flex justify-between">
                    <span>{s.name}</span><span className="text-muted-foreground">{s.admissionNo}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
