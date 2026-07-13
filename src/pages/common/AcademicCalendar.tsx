import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { academicCalendar, type CalendarEvent } from "@/data/schoolData";
import { Calendar as CalendarIcon, Plus, Trash2, Edit2, CheckCircle2, X, Clock, MapPin } from "lucide-react";
import { toast } from "sonner";

export default function AcademicCalendar() {
  const { user } = useAuth();
  const [events, setEvents] = useState<CalendarEvent[]>(academicCalendar);
  const [isAdding, setIsAdding] = useState(false);
  const [newEvent, setNewEvent] = useState<Partial<CalendarEvent>>({
    title: "",
    description: "",
    date: "",
    type: "academic"
  });

  const handleAdd = () => {
    if (!newEvent.title || !newEvent.date) {
      toast.error("Title and Date are required");
      return;
    }
    const event: CalendarEvent = {
       id: `EV${Math.random().toString(36).substr(2, 9)}`,
       title: newEvent.title!,
       description: newEvent.description || "",
       date: newEvent.date!,
       type: (newEvent.type as any) || "academic",
       createdBy: user?.id || "Admin"
    };
    setEvents([...events, event]);
    setIsAdding(false);
    setNewEvent({ title: "", description: "", date: "", type: "academic" });
    toast.success("Event added to calendar!");
  };

  const handleDelete = (id: string) => {
    setEvents(events.filter(e => e.id !== id));
    toast.success("Event removed");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h2 className="text-2xl font-black text-slate-800 uppercase ">Events & Calendar</h2>
          <p className="text-sm text-slate-500">Manage school-wide events and academic milestones.</p>
        </div>
        
        <button 
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-orange-500/20 active:scale-95"
        >
          <Plus className="w-4 h-4" />
          Schedule Event
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Event List */}
        <div className="lg:col-span-2 space-y-4">
           {[...events].sort((a,b) => a.date.localeCompare(b.date)).map((event) => (
             <div key={event.id} className="bg-white border border-slate-200 rounded-[2rem] p-6 hover:border-orange-500 transition-all group flex items-start gap-6 shadow-sm">
                <div className="flex flex-col items-center justify-center min-w-[70px] h-[80px] bg-slate-50 border border-slate-100 rounded-2xl group-hover:bg-orange-50 group-hover:border-orange-100 transition-colors">
                  <span className="text-[10px] font-black text-slate-400 group-hover:text-orange-400 uppercase tracking-widest">
                    {new Date(event.date).toLocaleString('default', { month: 'short' })}
                  </span>
                  <span className="text-2xl font-black text-slate-800 group-hover:text-orange-600">
                    {event.date.split('-')[2]}
                  </span>
                </div>
                
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-black text-slate-800 group-hover:text-orange-600 transition-colors uppercase ">{event.title}</h3>
                    <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-tighter ${
                      event.type === 'exam' ? 'bg-rose-50 text-rose-600' : 
                      event.type === 'holiday' ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'
                    }`}>
                      {event.type}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 font-medium leading-relaxed">{event.description}</p>
                </div>

                <div className="flex flex-col gap-2">
                   <button onClick={() => handleDelete(event.id)} className="p-2 text-slate-300 hover:text-rose-500 transition-colors">
                     <Trash2 className="w-4 h-4" />
                   </button>
                   <button className="p-2 text-slate-300 hover:text-orange-500 transition-colors">
                     <Edit2 className="w-4 h-4" />
                   </button>
                </div>
             </div>
           ))}
        </div>

        {/* Sidebar / Stats */}
        <div className="lg:col-span-1 space-y-6">
           <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden">
             <CalendarIcon className="w-16 h-16 text-white/10 absolute -top-4 -right-4" />
             <h4 className="text-xl font-black mb-2 ">Term 1 Roadmap</h4>
             <p className="text-slate-400 text-xs font-medium leading-relaxed mb-6">You have {events.length} events scheduled for the remainder of the term.</p>
             <div className="space-y-4">
                <div className="flex items-center gap-3">
                   <div className="w-2 h-2 rounded-full bg-orange-500" />
                   <span className="text-[10px] font-black uppercase tracking-widest">3 Academic Exams</span>
                </div>
                <div className="flex items-center gap-3">
                   <div className="w-2 h-2 rounded-full bg-emerald-500" />
                   <span className="text-[10px] font-black uppercase tracking-widest">1 Public Holiday</span>
                </div>
             </div>
           </div>
        </div>
      </div>

      {/* Add Modal */}
      {isAdding && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl animate-in zoom-in duration-200">
             <div className="flex items-center justify-between mb-8">
               <h3 className="text-xl font-black text-slate-800 uppercase ">New Event</h3>
               <button onClick={() => setIsAdding(false)} className="p-2 hover:bg-slate-50 rounded-full transition-colors">
                 <X className="w-5 h-5 text-slate-400" />
               </button>
             </div>
             
             <div className="space-y-6">
                <div>
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Event Title</label>
                   <input 
                    type="text" 
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                    placeholder="e.g. End of Term Meeting"
                    value={newEvent.title}
                    onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
                   />
                </div>
                <div>
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Date</label>
                   <input 
                    type="date" 
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                    value={newEvent.date}
                    onChange={(e) => setNewEvent({...newEvent, date: e.target.value})}
                   />
                </div>
                <div>
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Type</label>
                   <select 
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                    value={newEvent.type}
                    onChange={(e) => setNewEvent({...newEvent, type: e.target.value as any})}
                   >
                     <option value="academic">Academic</option>
                     <option value="exam">Exam</option>
                     <option value="holiday">Holiday</option>
                     <option value="event">General Event</option>
                   </select>
                </div>
                <div>
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Description</label>
                   <textarea 
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 resize-none h-24"
                    placeholder="Provide details..."
                    value={newEvent.description}
                    onChange={(e) => setNewEvent({...newEvent, description: e.target.value})}
                   />
                </div>
                
                <button 
                  onClick={handleAdd}
                  className="w-full py-4 bg-orange-600 hover:bg-orange-700 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-orange-500/20 transition-all active:scale-95"
                >
                  Save to Calendar
                </button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
}
