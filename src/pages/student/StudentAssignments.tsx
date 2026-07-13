import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { students, assignments, courses, studentAssignments, type StudentAssignment } from "@/data/schoolData";
import { 
  FileText, Calendar, BookOpen, Clock, CheckCircle2, 
  AlertCircle, Upload, ChevronRight, X, Bookmark,
  MoreVertical, Download, Send
} from "lucide-react";
import { toast } from "sonner";

export default function StudentAssignments() {
  const { user } = useAuth();
  const student = students.find(s => s.id === user?.personId);
  const [selectedTask, setSelectedTask] = useState<typeof assignments[0] | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!student) return null;

  const myAssignments = assignments.filter(a => student.enrolledCourses.includes(a.courseId));

  const getStudentStatus = (asgId: string) => {
    return studentAssignments.find(sa => sa.studentId === student.id && sa.assignmentId === asgId);
  };

  const handleFakeSubmit = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success("Assignment submitted successfully!", {
        description: "Your instructor will be notified for marking."
      });
      setSelectedTask(null);
    }, 1500);
  };

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-black text-slate-800">Academic Lab</h2>
        <p className="text-sm text-slate-500">Submit your projects and track instructor feedback.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {myAssignments.map((a) => {
          const course = courses.find(c => c.id === a.courseId);
          const studentTask = getStudentStatus(a.id);
          const dueDate = new Date(a.dueDate);
          const isOverdue = dueDate < new Date() && !studentTask?.submissionDate;

          return (
            <div 
              key={a.id} 
              onClick={() => setSelectedTask(a)}
              className="bg-white border border-slate-200 rounded-[2rem] p-6 hover:border-orange-500 transition-all cursor-pointer group shadow-sm hover:shadow-xl hover:shadow-orange-500/5 relative overflow-hidden"
            >
              <div className="flex items-start justify-between mb-6">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                  studentTask?.status === 'finished' ? 'bg-emerald-50 text-emerald-600' : 'bg-orange-50 text-orange-600'
                }`}>
                  <FileText className="w-6 h-6" />
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                    studentTask?.status === 'finished' ? "bg-emerald-50 text-emerald-600" : isOverdue ? "bg-rose-50 text-rose-600" : "bg-slate-100 text-slate-500"
                  }`}>
                    {studentTask?.status === 'finished' ? 'Completed' : isOverdue ? 'Overdue' : 'Pending'}
                  </span>
                  <button className="p-2 text-slate-300 hover:text-slate-600">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-1 mb-6">
                <h3 className="text-lg font-black text-slate-800 group-hover:text-orange-600 transition-colors uppercase ">{a.title}</h3>
                <p className="text-xs font-bold text-slate-400 capitalize">{course?.name}</p>
              </div>

              <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-slate-500">
                <div className="flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5 text-orange-500" />
                  Deadline: <span className="text-slate-800">{a.dueDate}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Bookmark className="w-3.5 h-3.5 text-orange-500" />
                  Max: <span className="text-slate-800">{a.totalMarks} Marks</span>
                </div>
              </div>

              {/* Status Bar */}
              <div className="mt-6 pt-6 border-t border-slate-50">
                 <div className="flex items-center justify-between gap-4">
                    <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                       <div 
                        className={`h-full transition-all duration-1000 ${studentTask?.status === 'finished' ? 'w-full bg-emerald-500' : 'w-1/3 bg-orange-500 animate-pulse'}`} 
                       />
                    </div>
                    <span className="text-[10px] font-black text-slate-400 uppercase">
                      {studentTask?.status === 'finished' ? 'Ready' : 'In Progress'}
                    </span>
                 </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Detail & Submission Modal */}
      {selectedTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 bg-slate-900/60 backdrop-blur-md">
          <div className="bg-white w-full max-w-4xl max-h-[90vh] rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col md:flex-row animate-in fade-in zoom-in duration-300">
            {/* Left Info Panel */}
            <div className="w-full md:w-1/2 p-8 md:p-12 bg-slate-50 space-y-8 flex flex-col">
               <button onClick={() => setSelectedTask(null)} className="md:hidden self-end p-2 bg-white rounded-full shadow-sm">
                 <X className="w-4 h-4 text-slate-500" />
               </button>

               <div className="space-y-4">
                  <div className="w-16 h-16 rounded-3xl bg-orange-500 text-white flex items-center justify-center shadow-xl shadow-orange-500/20">
                    <FileText className="w-8 h-8" />
                  </div>
                  <h2 className="text-3xl font-black text-slate-800 leading-tight uppercase ">{selectedTask.title}</h2>
                  <div className="flex gap-2">
                    <span className="px-3 py-1 bg-white border border-slate-200 rounded-full text-[10px] font-bold text-slate-500 uppercase">{courses.find(c => c.id === selectedTask.courseId)?.name}</span>
                    <span className="px-3 py-1 bg-white border border-slate-200 rounded-full text-[10px] font-bold text-slate-500 uppercase">{selectedTask.totalMarks} Total marks</span>
                  </div>
               </div>

               <div className="flex-1 space-y-6">
                 <div>
                   <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Instructions</h4>
                   <p className="text-sm text-slate-600 leading-relaxed font-medium">
                     {selectedTask.description}
                     <br /><br />
                     Please ensure your file is in PDF format and does not exceed 10MB. 
                     Plagiarism will be strictly penalized. Refer to the course handbook for citation guidelines.
                   </p>
                 </div>

                 <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                       <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Marking Status</p>
                       <p className={`text-sm font-bold ${getStudentStatus(selectedTask.id)?.isMarked ? 'text-emerald-600' : 'text-amber-500'}`}>
                         {getStudentStatus(selectedTask.id)?.isMarked ? 'Graded' : 'Waiting for Tutor'}
                       </p>
                    </div>
                    <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                       <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Your Grade</p>
                       <p className="text-sm font-black text-orange-600">
                         {getStudentStatus(selectedTask.id)?.marksAwarded || '--'} / {selectedTask.totalMarks}
                       </p>
                    </div>
                 </div>
               </div>
            </div>

            {/* Right Submission Panel */}
            <div className="w-full md:w-1/2 p-8 md:p-12 space-y-8 bg-white relative">
               <button onClick={() => setSelectedTask(null)} className="hidden md:block absolute top-8 right-8 p-3 hover:bg-slate-50 rounded-full transition-colors">
                 <X className="w-5 h-5 text-slate-400" />
               </button>

               <div className="space-y-6">
                 <h3 className="text-xl font-bold text-slate-800">Submit Evidence</h3>
                 
                 <div className="border-2 border-dashed border-slate-200 rounded-[2rem] p-12 flex flex-col items-center justify-center text-center group hover:border-orange-500 hover:bg-orange-50/30 transition-all">
                    <div className="w-16 h-16 rounded-full bg-slate-50 text-slate-400 group-hover:bg-white group-hover:text-orange-500 transition-colors flex items-center justify-center mb-4 shadow-sm">
                      <Upload className="w-8 h-8" />
                    </div>
                    <p className="text-sm font-bold text-slate-700">Drop your document here</p>
                    <p className="text-xs text-slate-400 mt-2">PDF, DOCX or PNG up to 10MB</p>
                    <button className="mt-6 px-6 py-2 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest hover:border-orange-500 hover:text-orange-600 transition-all">Select File</button>
                 </div>

                 <div className="space-y-4">
                    <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest">
                       <span className="text-slate-400">Submission Status</span>
                       <span className={getStudentStatus(selectedTask.id)?.status === 'finished' ? 'text-emerald-500' : 'text-amber-500'}>
                         {getStudentStatus(selectedTask.id)?.status === 'finished' ? 'Locked & Finished' : 'Work in Progress'}
                       </span>
                    </div>
                    
                    <button 
                      onClick={handleFakeSubmit}
                      disabled={isSubmitting || getStudentStatus(selectedTask.id)?.status === 'finished'}
                      className={`w-full py-5 rounded-2xl flex items-center justify-center gap-3 font-black uppercase tracking-[0.2em] text-sm transition-all shadow-xl ${
                        getStudentStatus(selectedTask.id)?.status === 'finished' 
                          ? "bg-slate-100 text-slate-400 shadow-none cursor-not-allowed" 
                          : "bg-orange-500 text-white hover:bg-orange-600 shadow-orange-500/30 active:scale-95"
                      }`}
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          <span>Uploading...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-5 h-5" />
                          <span>Submit Project</span>
                        </>
                      )}
                    </button>
                 </div>

                 <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                    <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Tutor's Feedback</h5>
                    <p className="text-xs text-slate-600 leading-relaxed ">
                      {getStudentStatus(selectedTask.id)?.feedback || "Your submission hasn't been marked yet. Check back in 3-5 business days."}
                    </p>
                 </div>
               </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

