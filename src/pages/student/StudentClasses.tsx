import { useAuth } from "@/contexts/AuthContext";
import { students, classrooms, teachers } from "@/data/schoolData";
import { Users, GraduationCap, MapPin, User, ChevronRight } from "lucide-react";

export default function StudentClasses() {
  const { user } = useAuth();
  const student = students.find(s => s.id === user?.personId);
  const myClass = student ? classrooms.find(c => c.grade === student.grade && c.section === student.section) : null;
  const classTeacher = myClass ? teachers.find(t => t.id === myClass.classTearcherId) : null;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-black text-slate-800  uppercase">Classroom Hub</h2>
        <p className="text-sm text-slate-500">Overview of your current class placement and peers.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Class Card */}
        <div className="lg:col-span-1">
          <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-[2.5rem] p-8 text-white shadow-xl shadow-indigo-500/20">
            <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center mb-6">
              <Users className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-3xl font-black mb-2">{myClass?.grade} {myClass?.section}</h3>
            <p className="text-indigo-100 text-sm font-bold uppercase tracking-widest mb-8">Official Classroom</p>
            
            <div className="space-y-4">
               <div className="flex items-center gap-3 bg-white/10 p-4 rounded-2xl">
                 <User className="w-5 h-5 text-indigo-200" />
                 <div>
                   <p className="text-[10px] font-bold text-indigo-200 uppercase">Class Teacher</p>
                   <p className="text-sm font-bold">{classTeacher?.name}</p>
                 </div>
               </div>
               <div className="flex items-center gap-3 bg-white/10 p-4 rounded-2xl">
                 <MapPin className="w-5 h-5 text-indigo-200" />
                 <div>
                   <p className="text-[10px] font-bold text-indigo-200 uppercase">Location</p>
                   <p className="text-sm font-bold">Main Block, Room {myClass?.id.slice(-2)}</p>
                 </div>
               </div>
            </div>
          </div>
        </div>

        {/* Peers List */}
        <div className="lg:col-span-2 space-y-4">
          <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">Your Peers ({myClass?.enrolledStudentIds.length})</h4>
          <div className="bg-white border border-slate-100 rounded-[2rem] overflow-hidden shadow-sm">
             <div className="divide-y divide-slate-50">
                {myClass?.enrolledStudentIds.map((sid) => {
                  const peer = students.find(s => s.id === sid);
                  return (
                    <div key={sid} className="flex items-center justify-between p-6 hover:bg-slate-50 transition-colors group">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-400 group-hover:bg-indigo-100 group-hover:text-indigo-600 transition-colors flex items-center justify-center font-bold">
                          {peer?.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-800">{peer?.name}</p>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{peer?.admissionNo}</p>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-slate-200 group-hover:text-indigo-500 transition-colors" />
                    </div>
                  );
                })}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
