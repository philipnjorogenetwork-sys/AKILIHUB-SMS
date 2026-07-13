import { classrooms, students, teachers } from "@/data/schoolData";

export default function ManageClassrooms() {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">Classroom Management</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {classrooms.map(cl => {
          const teacher = teachers.find(t => t.id === cl.classTearcherId);
          const enrolled = students.filter(s => cl.enrolledStudentIds.includes(s.id));
          return (
            <div key={cl.id} className="bg-card border border-border rounded-xl p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold">{cl.grade} - {cl.section}</h3>
                <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded">{cl.id}</span>
              </div>
              <p className="text-sm text-muted-foreground mb-2">Class Teacher: <span className="text-foreground">{teacher?.name || "-"}</span></p>
              <p className="text-sm text-muted-foreground mb-3">Students: <span className="text-foreground font-semibold">{enrolled.length}</span></p>
              <div className="space-y-1">
                {enrolled.map(s => (
                  <div key={s.id} className="text-xs bg-secondary rounded px-2 py-1.5 flex justify-between">
                    <span>{s.name}</span><span className="text-muted-foreground">{s.admissionNo}</span>
                  </div>
                ))}
                {enrolled.length === 0 && <p className="text-xs text-muted-foreground italic">No students enrolled</p>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
