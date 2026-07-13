import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { courses, students, examResults, exams } from "@/data/schoolData";
import { BookMarked, Award, TrendingUp, ChevronRight, Info, CheckCircle, Clock } from "lucide-react";

export default function StudentSubjects() {
  const { user } = useAuth();
  const student = students.find(s => s.id === user?.personId);
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);

  if (!student) return null;

  const myCourses = courses.filter(c => student.enrolledCourses.includes(c.id));

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-black text-slate-800">My Subjects</h2>
        <p className="text-sm text-slate-500">Curriculum overview and academic performance tracking.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {myCourses.map((course) => {
          const subjectExams = exams.filter(e => e.courseId === course.id);
          const results = examResults.filter(r => r.studentId === student.id && subjectExams.some(se => se.id === r.examId));
          const latestResult = results.length > 0 ? results[results.length - 1] : null;
          const latestExam = latestResult ? subjectExams.find(e => e.id === latestResult.examId) : null;

          return (
            <div 
              key={course.id} 
              className={`bg-white border transition-all rounded-3xl p-6 relative overflow-hidden group shadow-sm hover:shadow-xl hover:shadow-orange-500/5 ${selectedSubject === course.id ? 'border-orange-500 ring-4 ring-orange-50' : 'border-slate-200'}`}
              onClick={() => setSelectedSubject(selectedSubject === course.id ? null : course.id)}
            >
              <div className="flex items-center justify-between mb-4 relative z-10">
                <div className="w-12 h-12 rounded-2xl bg-orange-50 text-orange-500 flex items-center justify-center">
                  <BookMarked className="w-6 h-6" />
                </div>
                <button className="text-slate-300 hover:text-orange-500 transition-colors">
                  <Info className="w-5 h-5" />
                </button>
              </div>

              <h3 className="text-lg font-black text-slate-800 mb-1 group-hover:text-orange-600 transition-colors">{course.name}</h3>
              <p className="text-xs text-slate-400 font-medium mb-4 line-clamp-1">{course.description}</p>
              
              <div className="space-y-3 relative z-10">
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl group-hover:bg-orange-50/50 transition-colors">
                   <div className="flex items-center gap-2">
                     <Award className="w-4 h-4 text-orange-500" />
                     <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Recent Grade</span>
                   </div>
                   <span className="text-sm font-black text-slate-700">{latestResult?.grade || "N/A"}</span>
                </div>
                
                {selectedSubject === course.id && (
                  <div className="pt-4 border-t border-slate-100 animate-in slide-in-from-top-2 duration-300">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 ">Exam History</h4>
                    <div className="space-y-2">
                      {results.map((r, idx) => (
                        <div key={idx} className="flex items-center justify-between text-xs">
                          <p className="text-slate-600 truncate max-w-[120px]">{subjectExams.find(e => e.id === r.examId)?.name}</p>
                          <span className="font-bold text-orange-600">{r.marksObtained}/{subjectExams.find(e => e.id === r.examId)?.totalMarks}</span>
                        </div>
                      ))}
                    </div>
                    <button className="w-full mt-4 py-2 bg-orange-500 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-orange-600 transition-all shadow-lg shadow-orange-500/20">
                      View Syllabus
                    </button>
                  </div>
                )}
              </div>

              {/* Decorative blobs */}
              <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-orange-50 rounded-full opacity-50 group-hover:scale-110 transition-transform" />
            </div>
          );
        })}
      </div>
    </div>
  );
}
