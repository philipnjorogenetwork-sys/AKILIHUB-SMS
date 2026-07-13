import { useAuth } from "@/contexts/AuthContext";
import { teachers, courses, students } from "@/data/schoolData";
import { Mail, Phone, BookOpen, UserCheck } from "lucide-react";

export default function StudentTeachers() {
  const { user } = useAuth();
  const student = students.find(s => s.id === user?.personId);
  
  if (!student) return <p>Student profile not found</p>;

  // Find teachers who teach courses the student is enrolled in
  const myTeachers = teachers.filter(teacher => {
    return teacher.subjects.some(subj => 
      courses.some(c => c.name === subj && student.enrolledCourses.includes(c.id))
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-black text-slate-800">My Instructors</h2>
        <p className="text-sm text-slate-500">List of teachers handling your current curriculum.</p>
      </div>

      <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100 text-left">
              <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Instructor</th>
              <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Department / Subjects</th>
              <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Contact Info</th>
              <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Availability</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {myTeachers.map((teacher) => (
              <tr key={teacher.id} className="hover:bg-slate-50/50 transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-bold text-sm">
                      {teacher.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-800">{teacher.name}</p>
                      <p className="text-[10px] text-slate-400 font-medium">#{teacher.employeeId}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-1">
                    {teacher.subjects.map(s => (
                      <span key={s} className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded text-[10px] font-bold">
                        {s}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <Mail className="w-3 h-3 text-orange-400" />
                      {teacher.email}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <Phone className="w-3 h-3 text-orange-400" />
                      {teacher.phone}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1.5 text-emerald-600 font-bold text-[10px] uppercase">
                    <UserCheck className="w-3 h-3" />
                    Available now
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
