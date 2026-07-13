import { useAuth } from "@/contexts/AuthContext";
import { teachers, timetableSlots, courses, classrooms } from "@/data/schoolData";

const days = ["MON", "TUE", "WED", "THU", "FRI"] as const;
const times = ["08:00", "08:40", "09:20", "09:40", "10:20", "11:00", "11:40", "12:20", "14:00", "14:40"];

export default function TeacherTimetable() {
  const { user } = useAuth();
  const teacher = teachers.find(t => t.id === user?.personId);
  const mySlots = timetableSlots.filter(s => s.teacherId === teacher?.id);

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">My Timetable</h2>
      <div className="bg-card border border-border rounded-xl overflow-x-auto">
        <table className="w-full text-sm">
          <thead><tr className="border-b border-border bg-secondary/50">
            <th className="py-3 px-4 text-left text-muted-foreground">Time</th>
            {days.map(d => <th key={d} className="py-3 px-4 text-center text-muted-foreground">{d}</th>)}
          </tr></thead>
          <tbody>
            {times.map(time => (
              <tr key={time} className="border-b border-border">
                <td className="py-3 px-4 font-mono text-xs text-muted-foreground">{time}</td>
                {days.map(day => {
                  const slot = mySlots.find(s => s.day === day && s.startTime === time);
                  if (!slot) return <td key={day} className="py-3 px-4" />;
                  const course = courses.find(c => c.id === slot.courseId);
                  const cl = classrooms.find(c => c.id === slot.classroomId);
                  return (
                    <td key={day} className="py-3 px-4">
                      <div className="bg-primary/10 border border-primary/20 rounded-lg p-2 text-center">
                        <p className="font-medium text-xs">{course?.name}</p>
                        <p className="text-[10px] text-muted-foreground">{cl?.grade} {cl?.section}</p>
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
