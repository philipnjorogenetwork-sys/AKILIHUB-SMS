import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { students, getClassroomForStudent, getTimetableForClassroom, courses, teachers, classrooms } from "@/data/schoolData";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trash2, Plus, Edit } from "lucide-react";

interface TimetableSlot {
  id: string;
  classroomId: string;
  courseId: string;
  teacherId: string;
  day: "MON" | "TUE" | "WED" | "THU" | "FRI";
  startTime: string;
  endTime: string;
}

const days = ["MON", "TUE", "WED", "THU", "FRI"] as const;
const times = ["08:00", "08:40", "09:20", "09:40", "10:20", "11:00", "11:40", "12:20", "14:00", "14:40"];

export default function StudentTimetable() {
  const { user } = useAuth();
  const student = students.find(s => s.id === user?.personId);
  const classroom = student ? getClassroomForStudent(student) : null;
  const initialSlots = classroom ? getTimetableForClassroom(classroom.id) : [];
  
  const [slots, setSlots] = useState<TimetableSlot[]>(initialSlots);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingSlot, setEditingSlot] = useState<TimetableSlot | null>(null);
  const [formData, setFormData] = useState({
    courseId: "",
    teacherId: "",
    day: "MON" as const,
    startTime: "08:00",
    endTime: "08:40",
  });

  if (!student || !classroom) return null;

  const handleAddSlot = () => {
    setEditingSlot(null);
    setFormData({
      courseId: "",
      teacherId: "",
      day: "MON",
      startTime: "08:00",
      endTime: "08:40",
    });
    setOpenDialog(true);
  };

  const handleEditSlot = (slot: TimetableSlot) => {
    setEditingSlot(slot);
    setFormData({
      courseId: slot.courseId,
      teacherId: slot.teacherId,
      day: slot.day,
      startTime: slot.startTime,
      endTime: slot.endTime,
    });
    setOpenDialog(true);
  };

  const handleDeleteSlot = (slotId: string) => {
    setSlots(slots.filter(s => s.id !== slotId));
  };

  const handleSaveSlot = () => {
    if (!formData.courseId || !formData.teacherId) {
      alert("Please select both course and teacher");
      return;
    }

    const slotExists = slots.some(s => 
      s.day === formData.day && 
      s.startTime === formData.startTime && 
      s.id !== editingSlot?.id
    );

    if (slotExists) {
      alert("This time slot is already occupied");
      return;
    }

    if (editingSlot) {
      setSlots(slots.map(s => 
        s.id === editingSlot.id 
          ? { ...s, ...formData }
          : s
      ));
    } else {
      const newSlot: TimetableSlot = {
        id: `slot-${Date.now()}`,
        classroomId: classroom.id,
        ...formData,
      };
      setSlots([...slots, newSlot]);
    }
    setOpenDialog(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">My Timetable</h2>
          <p className="text-sm text-muted-foreground">{student.grade} {student.section}</p>
        </div>
        <Button onClick={handleAddSlot} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Class
        </Button>
      </div>

      <div className="bg-card border border-border rounded-xl overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-secondary/50">
              <th className="py-3 px-4 text-left text-muted-foreground">Time</th>
              {days.map(d => <th key={d} className="py-3 px-4 text-center text-muted-foreground">{d}</th>)}
              <th className="py-3 px-4 text-center text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {times.map(time => (
              <tr key={time} className="border-b border-border hover:bg-secondary/20">
                <td className="py-3 px-4 font-mono text-xs text-muted-foreground">{time}</td>
                {days.map(day => {
                  const slot = slots.find(s => s.day === day && s.startTime === time);
                  if (!slot) return <td key={day} className="py-3 px-4" />;
                  const course = courses.find(c => c.id === slot.courseId);
                  const teacher = teachers.find(t => t.id === slot.teacherId);
                  return (
                    <td key={day} className="py-3 px-4 group">
                      <div className="bg-primary/10 border border-primary/20 rounded-lg p-2 text-center relative">
                        <p className="font-medium text-xs">{course?.name}</p>
                        <p className="text-[10px] text-muted-foreground">{teacher?.name}</p>
                        <div className="absolute top-1 right-1 gap-1 hidden group-hover:flex">
                          <button
                            onClick={() => handleEditSlot(slot)}
                            className="bg-blue-500 hover:bg-blue-600 text-white p-1 rounded text-[10px]"
                            title="Edit"
                          >
                            <Edit className="h-3 w-3" />
                          </button>
                          <button
                            onClick={() => handleDeleteSlot(slot.id)}
                            className="bg-red-500 hover:bg-red-600 text-white p-1 rounded text-[10px]"
                            title="Delete"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                    </td>
                  );
                })}
                <td className="py-3 px-4" />
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingSlot ? "Edit Class" : "Add New Class"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Course</label>
              <Select value={formData.courseId} onValueChange={(value) => setFormData({ ...formData, courseId: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select course" />
                </SelectTrigger>
                <SelectContent>
                  {courses.map(c => (
                    <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">Teacher</label>
              <Select value={formData.teacherId} onValueChange={(value) => setFormData({ ...formData, teacherId: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select teacher" />
                </SelectTrigger>
                <SelectContent>
                  {teachers.map(t => (
                    <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">Day</label>
              <Select value={formData.day} onValueChange={(value: any) => setFormData({ ...formData, day: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {days.map(d => (
                    <SelectItem key={d} value={d}>{d}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">Start Time</label>
              <Select value={formData.startTime} onValueChange={(value) => setFormData({ ...formData, startTime: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {times.map(t => (
                    <SelectItem key={t} value={t}>{t}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">End Time</label>
              <Select value={formData.endTime} onValueChange={(value) => setFormData({ ...formData, endTime: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {times.map(t => (
                    <SelectItem key={t} value={t}>{t}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenDialog(false)}>Cancel</Button>
            <Button onClick={handleSaveSlot}>{editingSlot ? "Update" : "Add"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
