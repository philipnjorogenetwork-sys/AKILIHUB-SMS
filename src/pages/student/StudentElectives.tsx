import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { students, courses } from "@/data/schoolData";
import { Code, Music, Palette, Wrench, CheckCircle } from "lucide-react";

const categoryIcons: Record<string, React.ComponentType<{ className?: string }>> = { coding: Code, music: Music, art: Palette, engineering: Wrench };

export default function StudentElectives() {
  const { user } = useAuth();
  const student = students.find(s => s.id === user?.personId);
  
  const electives = courses.filter(c => c.isElective);
  const [enrolled, setEnrolled] = useState<string[]>(() => {
    if (student) {
      return student.enrolledCourses.filter(id => electives.some(e => e.id === id));
    }
    return [];
  });

  if (!student) return null;

  const toggleEnroll = (courseId: string) => {
    setEnrolled(prev => prev.includes(courseId) ? prev.filter(id => id !== courseId) : [...prev, courseId]);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">Elective Courses</h2>
      <p className="text-sm text-muted-foreground">Enroll in courses that interest you</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {electives.map(c => {
          const Icon = categoryIcons[c.category || ""] || Code;
          const isEnrolled = enrolled.includes(c.id);
          return (
            <div key={c.id} className={`bg-card border rounded-xl p-5 transition-colors ${isEnrolled ? "border-primary" : "border-border"}`}>
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${isEnrolled ? "bg-primary/20" : "bg-secondary"}`}><Icon className={`h-5 w-5 ${isEnrolled ? "text-primary" : "text-muted-foreground"}`} /></div>
                  <div><h3 className="font-semibold">{c.name}</h3><p className="text-xs text-muted-foreground capitalize">{c.category}</p></div>
                </div>
                {isEnrolled && <CheckCircle className="h-5 w-5 text-primary" />}
              </div>
              <p className="text-sm text-muted-foreground mb-4">{c.description}</p>
              <button onClick={() => toggleEnroll(c.id)} className={`w-full py-2 rounded-lg text-sm font-medium ${isEnrolled ? "border border-destructive text-destructive hover:bg-destructive/10" : "bg-primary text-primary-foreground hover:opacity-90"}`}>
                {isEnrolled ? "Unenroll" : "Enroll"}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
