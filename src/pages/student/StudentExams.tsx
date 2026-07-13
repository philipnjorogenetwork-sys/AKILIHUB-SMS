import { useAuth } from "@/contexts/AuthContext";
import { students, exams, courses, examResults } from "@/data/schoolData";
import { ClipboardCheck, Award, TrendingUp, Calendar, AlertCircle, ChevronRight } from "lucide-react";

export default function StudentExams() {
  const { user } = useAuth();
  const student = students.find(s => s.id === user?.personId);
  const myResults = student ? examResults.filter(r => r.studentId === student.id) : [];
  const upcomingExams = exams.filter(e => e.grade === student?.grade);

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-black text-slate-800 uppercase ">Examination Hall</h2>
        <p className="text-sm text-slate-500">Review your past scores and prepare for upcoming assessments.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Upcoming Exams */}
        <div className="lg:col-span-1 space-y-4">
           <h3 className="text-lg font-bold flex items-center gap-2">
             <Calendar className="w-5 h-5 text-orange-500" />
             Upcoming Exams
           </h3>
           <div className="space-y-4">
             {upcomingExams.map((exam) => (
               <div key={exam.id} className="bg-white border border-slate-200 rounded-[2rem] p-6 shadow-sm hover:border-orange-500 transition-all group">
                 <div className="flex items-center justify-between mb-4">
                    <span className="px-3 py-1 bg-orange-50 text-orange-600 rounded-full text-[10px] font-black uppercase tracking-widest">Active</span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{exam.date}</span>
                 </div>
                 <h4 className="font-black text-slate-800  uppercase group-hover:text-orange-600 transition-colors">{exam.name}</h4>
                 <p className="text-xs font-bold text-slate-400 mt-1">{courses.find(c => c.id === exam.courseId)?.name}</p>
                 <div className="mt-6 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase">
                      <AlertCircle className="w-3.5 h-3.5" />
                      {exam.totalMarks} Marks
                    </div>
                    <button className="text-[10px] font-black text-orange-600 hover:text-orange-700 transition-colors">Exam Rules ↗</button>
                 </div>
               </div>
             ))}
           </div>
        </div>

        {/* Right: Past Performance */}
        <div className="lg:col-span-2 space-y-4">
           <h3 className="text-lg font-bold flex items-center gap-2">
             <Award className="w-5 h-5 text-orange-500" />
             Past Results
           </h3>
           
           <div className="bg-white border border-slate-200 rounded-[2.5rem] overflow-hidden shadow-sm">
             <table className="w-full">
               <thead>
                 <tr className="bg-slate-50/50 border-b border-slate-100 text-left">
                   <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Evaluation</th>
                   <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Marks</th>
                   <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Grade</th>
                   <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Performance</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-slate-50">
                 {myResults.map((r) => {
                   const exam = exams.find(e => e.id === r.examId);
                   const course = exam ? courses.find(c => c.id === exam.courseId) : null;
                   return (
                     <tr key={r.id} className="hover:bg-slate-50/50 transition-colors group">
                       <td className="px-8 py-5">
                         <p className="text-sm font-black text-slate-800  uppercase">{course?.name}</p>
                         <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">{exam?.name}</p>
                       </td>
                       <td className="px-8 py-5">
                         <div className="flex flex-col gap-1">
                           <span className="text-sm font-bold text-slate-700">{r.marksObtained} / {exam?.totalMarks}</span>
                           <div className="w-16 h-1 bg-slate-100 rounded-full overflow-hidden">
                             <div 
                              className="h-full bg-orange-500" 
                              style={{ width: `${(r.marksObtained / (exam?.totalMarks || 100)) * 100}%` }} 
                             />
                           </div>
                         </div>
                       </td>
                       <td className="px-8 py-5">
                         <span className="text-lg font-black text-orange-600">{r.grade}</span>
                       </td>
                       <td className="px-8 py-5">
                         <div className="flex items-center gap-1 text-emerald-600 font-black text-[10px] uppercase tracking-widest">
                           <TrendingUp className="w-3.5 h-3.5" />
                           Top 10%
                         </div>
                       </td>
                     </tr>
                   );
                 })}
               </tbody>
             </table>
           </div>
        </div>
      </div>
    </div>
  );
}
