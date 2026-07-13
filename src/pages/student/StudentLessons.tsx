import { useAuth } from "@/contexts/AuthContext";
import { students, timetableSlots, courses, teachers, getClassroomForStudent } from "@/data/schoolData";
import { Clock, BookOpen, User, MapPin, Calendar, BookMarked } from "lucide-react";

export default function StudentLessons() {
  const { user } = useAuth();
  const student = students.find(s => s.id === user?.personId);
  const classroom = student ? getClassroomForStudent(student) : null;
  const myLessons = classroom ? timetableSlots.filter(t => t.classroomId === classroom.id) : [];

  const days = ["MON", "TUE", "WED", "THU", "FRI"];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-black text-slate-800 uppercase ">Learning Sessions</h2>
        <p className="text-sm text-slate-500">Track your daily subject schedules and lesson timings.</p>
      </div>

      <div className="space-y-8">
        {days.map((day) => {
          const dayLessons = myLessons.filter(l => l.day === day).sort((a, b) => a.startTime.localeCompare(b.startTime));
          if (dayLessons.length === 0) return null;

          return (
            <div key={day} className="space-y-4">
              <div className="flex items-center gap-4">
                 <div className="h-px flex-1 bg-slate-100" />
                 <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em]">{day}</h3>
                 <div className="h-px flex-1 bg-slate-100" />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {dayLessons.map((lesson) => {
                  const course = courses.find(c => c.id === lesson.courseId);
                  const teacher = teachers.find(t => t.id === lesson.teacherId);
                  return (
                    <div key={lesson.id} className="bg-white border border-slate-200 rounded-[1.5rem] p-5 hover:border-orange-500 transition-all shadow-sm hover:shadow-lg hover:shadow-orange-500/5 group">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2 text-[10px] font-black text-orange-600 uppercase">
                          <Clock className="w-3 h-3" />
                          {lesson.startTime} - {lesson.endTime}
                        </div>
                        <div className="w-8 h-8 rounded-lg bg-slate-50 text-slate-400 group-hover:bg-orange-50 group-hover:text-orange-500 transition-colors flex items-center justify-center">
                          <BookMarked className="w-4 h-4" />
                        </div>
                      </div>
                      
                      <h4 className="font-bold text-slate-800 group-hover:text-orange-600 transition-colors">{course?.name}</h4>
                      
                      <div className="mt-4 space-y-2">
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                          <User className="w-3.5 h-3.5 text-slate-300" />
                          {teacher?.name}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                          <MapPin className="w-3.5 h-3.5 text-slate-300" />
                          Room 102
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
