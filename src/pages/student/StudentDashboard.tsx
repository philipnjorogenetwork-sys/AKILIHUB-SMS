import { useAuth } from "@/contexts/AuthContext";
import { 
  students, getAttendanceForStudent, 
  assignments, academicCalendar, examResults, exams, courses, teachers 
} from "@/data/schoolData";
import { 
  Calendar as CalendarIcon, Award, ChevronRight, Clock, Star, 
  Users, GraduationCap, BookMarked, Layers, FileText, ClipboardCheck,
  CheckCircle2, MessageCircle
} from "lucide-react";
import { Link } from "react-router-dom";

export default function StudentDashboard() {
  const { user } = useAuth();
  const student = students.find(s => s.id === user?.personId);
  if (!student) return <p>Student not found</p>;

  const attendance = getAttendanceForStudent(student.id);
  const presentCount = attendance.filter(a => a.status === "present").length;
  const attendanceRate = attendance.length > 0 ? Math.round((presentCount / attendance.length) * 100) : 0;
  
  const results = examResults.filter(r => r.studentId === student.id).slice(0, 4);
  const upcomingEvents = academicCalendar.slice(0, 3);
  const myAssignments = assignments.filter(a => student.enrolledCourses.includes(a.courseId)).slice(0, 3);
  
  // Find teachers who teach courses the student is enrolled in
  const myTeachers = teachers.filter(teacher => {
    return teacher.subjects.some(subj => 
      courses.some(c => c.name === subj && student.enrolledCourses.includes(c.id))
    );
  }).slice(0, 3);

  return (
    <div className="space-y-8 pb-10">
      {/* 1. Huge Orange Rectangular Card */}
      <div className="relative overflow-hidden bg-gradient-to-br from-orange-500 to-orange-600 rounded-3xl p-8 md:p-12 text-white shadow-2xl shadow-orange-500/20">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-4 bg-white/20 w-fit px-3 py-1 rounded-full backdrop-blur-md">
              <Star className="w-4 h-4 text-amber-300 fill-amber-300" />
              <span className="text-[10px] font-bold uppercase tracking-widest">{student.grade} student</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-2">
              {student.name}
            </h1>
            <p className="text-orange-100/80 text-lg flex items-center gap-2">
              <GraduationCap className="w-5 h-5" />
              Admission: <span className="font-bold text-white">{student.admissionNo}</span>
            </p>
          </div>
          
          <div className="flex flex-col gap-4">
             <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-5 rounded-2xl flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center font-black text-xl">
                  {attendanceRate}%
                </div>
                <div>
                  <p className="text-[10px] font-bold text-orange-100 uppercase">Attendance Snapshot</p>
                  <p className="text-sm font-medium">Tracking Term 1 Progress</p>
                </div>
             </div>
          </div>
        </div>
        
        {/* Abstract Background Elements */}
        <div className="absolute top-[-50px] right-[-50px] w-64 h-64 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-[-20px] left-[10%] w-32 h-32 bg-orange-400/30 rounded-full blur-2xl" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 2. Academic Calendar */}
        <div className="lg:col-span-1 space-y-4">
           <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <CalendarIcon className="w-5 h-5 text-orange-500" />
                Academic Calendar
              </h3>
           </div>
           
           <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
             <div className="space-y-4">
               {upcomingEvents.map((event) => (
                 <div key={event.id} className="flex gap-4 group cursor-pointer hover:translate-x-1 transition-transform">
                   <div className="flex flex-col items-center justify-center min-w-[50px] h-[60px] bg-slate-50 border border-slate-100 rounded-xl group-hover:bg-orange-50 group-hover:border-orange-100 transition-colors">
                     <span className="text-[10px] font-bold text-slate-400 group-hover:text-orange-400 uppercase">
                        {new Date(event.date).toLocaleString('default', { month: 'short' })}
                     </span>
                     <span className="text-lg font-black text-slate-700 group-hover:text-orange-600">
                       {event.date.split('-')[2]}
                     </span>
                   </div>
                   <div className="flex-1 border-b border-slate-50 pb-3 group-last:border-0 group-last:pb-0">
                     <p className="text-sm font-bold text-slate-800">{event.title}</p>
                     <p className="text-xs text-slate-400 mt-1 line-clamp-1">{event.description}</p>
                   </div>
                 </div>
               ))}
             </div>
             
             <Link to="/student/timetable" className="block w-full text-center mt-6 py-3 rounded-2xl bg-slate-50 text-slate-600 text-xs font-bold hover:bg-slate-100 transition-colors">
               View Full Schedule
             </Link>
           </div>
        </div>

        {/* 3. Recent Grade Activity */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <Award className="w-5 h-5 text-orange-500" />
                Recent Grade Activity
              </h3>
              <Link to="/student/marks" className="text-xs font-bold text-orange-600 hover:text-orange-700">View All</Link>
           </div>
           
           <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
             <table className="w-full text-left border-collapse">
               <thead>
                 <tr className="bg-slate-50/50 border-b border-slate-100">
                   <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Subject</th>
                   <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Exam</th>
                   <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Grade</th>
                   <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Status</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-slate-50">
                 {results.map((r) => {
                    const exam = exams.find(e => e.id === r.examId);
                    const course = exam ? courses.find(c => c.id === exam.courseId) : null;
                    return (
                      <tr key={r.id} className="hover:bg-slate-50/50 transition-colors group">
                        <td className="px-6 py-4">
                          <p className="text-sm font-bold text-slate-800">{course?.name}</p>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <p className="text-sm text-slate-500">{exam?.name}</p>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className="text-sm font-black text-orange-600">{r.grade}</span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase inline-flex items-center gap-1.5 ${
                            r.status === 'approved' 
                              ? "bg-emerald-50 text-emerald-600" 
                              : "bg-amber-50 text-amber-600"
                          }`}>
                            {r.status === 'approved' ? (
                              <CheckCircle2 className="w-3 h-3" />
                            ) : (
                              <Clock className="w-3 h-3" />
                            )}
                            {r.status}
                          </span>
                        </td>
                      </tr>
                    );
                 })}
               </tbody>
             </table>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Teachers Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold">My Instructors</h3>
            <Link to="/student/teachers" className="text-xs font-bold text-orange-600">All Teachers</Link>
          </div>
          <div className="bg-white border border-slate-200 rounded-[2rem] overflow-hidden shadow-sm">
             <div className="divide-y divide-slate-50">
               {myTeachers.map(teacher => (
                 <div key={teacher.id} className="p-4 flex items-center justify-between group hover:bg-slate-50 transition-colors">
                   <div className="flex items-center gap-4">
                     <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center font-bold">
                       {teacher.name.charAt(0)}
                     </div>
                     <div>
                       <p className="text-sm font-bold text-slate-800">{teacher.name}</p>
                       <p className="text-[10px] text-slate-400 font-bold uppercase">{teacher.subjects[0]}</p>
                     </div>
                   </div>
                   <Link 
                     to="/messages" 
                     className="p-2 text-slate-400 hover:text-orange-500 hover:bg-orange-50 rounded-xl transition-all"
                     title="Chat with instructor"
                   >
                     <MessageCircle className="w-5 h-5" />
                   </Link>
                 </div>
               ))}
             </div>
          </div>
        </div>

        {/* Quick Nav Grid */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold">Portal Navigation</h3>
          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: Users, label: "My Teachers", path: "/student/teachers", color: "bg-blue-50 text-blue-600" },
              { icon: GraduationCap, label: "All Students", path: "/student/students", color: "bg-purple-50 text-purple-600" },
              { icon: BookMarked, label: "Subjects", path: "/student/subjects", color: "bg-orange-50 text-orange-600" },
              { icon: Layers, label: "Classes", path: "/student/classes", color: "bg-emerald-50 text-emerald-600" },
              { icon: FileText, label: "Lessons", path: "/student/lessons", color: "bg-rose-50 text-rose-600" },
              { icon: ClipboardCheck, label: "Exams", path: "/student/exams", color: "bg-amber-50 text-amber-600" },
            ].map((nav) => {
               const Icon = nav.icon;
               return (
                <Link key={nav.label} to={nav.path} className="flex items-center gap-4 p-4 bg-white border border-slate-200 rounded-2xl hover:border-orange-500 hover:shadow-lg hover:shadow-orange-500/10 transition-all group">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${nav.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-bold text-slate-700">{nav.label}</span>
                  <ChevronRight className="w-4 h-4 text-slate-300 ml-auto group-hover:text-orange-500 transition-colors" />
                </Link>
               );
            })}
          </div>
        </div>

        {/* Recent Assignments Preview */}
        <div className="space-y-4">
           <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <Clock className="w-5 h-5 text-orange-500" />
                Recent Assignments
              </h3>
              <Link to="/student/assignments" className="text-xs font-bold text-orange-600 hover:text-orange-700">Manage All</Link>
           </div>
           
           <div className="space-y-4">
              {myAssignments.length > 0 ? myAssignments.map((a) => (
                <Link key={a.id} to={`/student/assignments`} className="block p-5 bg-white border border-slate-200 rounded-2xl hover:border-orange-500 transition-all shadow-sm">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="text-sm font-bold text-slate-800">{a.title}</p>
                      <p className="text-xs text-slate-500 mt-1">{courses.find(c => c.id === a.courseId)?.name}</p>
                    </div>
                    <span className="text-xs font-bold text-slate-400">Due {a.dueDate}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-1 bg-slate-100 text-slate-500 rounded text-[10px] font-bold uppercase">Pending</span>
                  </div>
                </Link>
              )) : (
                <div className="p-8 text-center bg-slate-50 border border-slate-100 rounded-2xl">
                   <p className="text-sm text-slate-400 font-medium">No pending assignments</p>
                </div>
              )}
           </div>
        </div>
      </div>
    </div>
  );
}
