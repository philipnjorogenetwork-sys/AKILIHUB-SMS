import { useState } from "react";
import { students, examResults, attendanceRecords } from "@/data/schoolData";
import { Search, User, Filter, GraduationCap, Calendar, Activity, ChevronRight, X, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";

export default function StudentAllStudents() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<typeof students[0] | null>(null);

  const filteredStudents = students.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.admissionNo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h2 className="text-2xl font-black text-slate-800">Student Community</h2>
          <p className="text-sm text-slate-500">Connect and view details of your fellow schoolmates.</p>
        </div>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search by name or admission no..." 
            className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 w-full md:w-64"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredStudents.map((s) => (
          <div 
            key={s.id} 
            onClick={() => setSelectedStudent(s)}
            className="bg-white border border-slate-200 p-5 rounded-3xl hover:border-orange-500 transition-all cursor-pointer group shadow-sm hover:shadow-lg hover:shadow-orange-500/5"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-2xl bg-slate-50 text-slate-400 group-hover:bg-orange-50 group-hover:text-orange-500 transition-colors flex items-center justify-center font-bold text-lg">
                <User className="w-6 h-6" />
              </div>
              <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                Math.random() > 0.1 ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
              }`}>
                {Math.random() > 0.1 ? "Active" : "Inactive"}
              </span>
            </div>
            
            <h3 className="font-bold text-slate-800 group-hover:text-orange-600 transition-colors">{s.name}</h3>
            <p className="text-xs text-slate-400 mt-1 uppercase font-bold tracking-wider">{s.grade} • {s.section}</p>
            
            <div className="mt-4 flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase">
              <div className="flex items-center gap-3">
                <span>{s.admissionNo}</span>
                <Link to="/messages" className="text-orange-500 hover:text-orange-600 flex items-center gap-1 group/btn" onClick={(e) => e.stopPropagation()}>
                   <MessageCircle className="w-3.5 h-3.5" />
                   <span className="opacity-0 group-hover/btn:opacity-100 transition-opacity">Chat</span>
                </Link>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-200 group-hover:text-orange-500 group-hover:translate-x-1 transition-all" />
            </div>
          </div>
        ))}
      </div>

      {/* Student Details Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="relative h-32 bg-orange-500">
              <button 
                onClick={() => setSelectedStudent(null)}
                className="absolute top-4 right-4 p-2 bg-black/10 hover:bg-black/20 rounded-full text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
              <div className="absolute -bottom-8 left-8 p-1 bg-white rounded-2xl shadow-lg">
                <div className="w-20 h-20 bg-slate-100 rounded-xl flex items-center justify-center font-bold text-2xl text-slate-400">
                  {selectedStudent.name.charAt(0)}
                </div>
              </div>
            </div>
            
            <div className="pt-12 p-8 space-y-8">
              <div>
                <h2 className="text-2xl font-black text-slate-800">{selectedStudent.name}</h2>
                <p className="text-sm font-bold text-slate-400 mt-1">{selectedStudent.grade} {selectedStudent.section} / {selectedStudent.admissionNo}</p>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="bg-slate-50 p-4 rounded-2xl">
                   <div className="flex items-center gap-2 mb-2">
                     <GraduationCap className="w-4 h-4 text-blue-500" />
                     <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Academic</span>
                   </div>
                   <p className="text-lg font-black text-slate-700">A-</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-2xl">
                   <div className="flex items-center gap-2 mb-2">
                     <Calendar className="w-4 h-4 text-emerald-500" />
                     <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Attendance</span>
                   </div>
                   <p className="text-lg font-black text-slate-700">92%</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-2xl border-2 border-orange-500/10">
                   <div className="flex items-center gap-2 mb-2">
                     <Activity className="w-4 h-4 text-orange-500" />
                     <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Chat</span>
                   </div>
                   <Link 
                    to="/messages" 
                    className="flex items-center gap-2 bg-orange-500 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-orange-600 transition-all shadow-lg shadow-orange-500/20"
                   >
                      <MessageCircle className="w-4 h-4" />
                      Send Message
                   </Link>
                </div>
              </div>
              
              <div className="space-y-4">
                <h4 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Recent Activity</h4>
                <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4">
                  <p className="text-xs text-slate-500 ">No public activity record for this student.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
