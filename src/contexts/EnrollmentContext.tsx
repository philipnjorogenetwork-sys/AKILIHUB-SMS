import { createContext, useContext, useState, type ReactNode } from "react";

export interface EnrolledStudent {
  id: string;
  name: string;
  email: string;
  grade: string;
  section: string;
  enrollmentDate: string;
  parentName: string;
  parentEmail: string;
  parentPhone: string;
}

interface EnrollmentContextType {
  enrolledStudents: EnrolledStudent[];
  addEnrolledStudent: (student: EnrolledStudent) => void;
  removeEnrolledStudent: (id: string) => void;
  convertToAccount: (id: string) => void;
}

const EnrollmentContext = createContext<EnrollmentContextType | null>(null);

export function EnrollmentProvider({ children }: { children: ReactNode }) {
  const [enrolledStudents, setEnrolledStudents] = useState<EnrolledStudent[]>([]);

  const addEnrolledStudent = (student: EnrolledStudent) => {
    setEnrolledStudents(prev => {
      const exists = prev.find(s => s.email === student.email);
      if (exists) return prev;
      return [...prev, student];
    });
  };

  const removeEnrolledStudent = (id: string) => {
    setEnrolledStudents(prev => prev.filter(s => s.id !== id));
  };

  const convertToAccount = (id: string) => {
    removeEnrolledStudent(id);
  };

  return (
    <EnrollmentContext.Provider value={{ enrolledStudents, addEnrolledStudent, removeEnrolledStudent, convertToAccount }}>
      {children}
    </EnrollmentContext.Provider>
  );
}

export function useEnrollment() {
  const ctx = useContext(EnrollmentContext);
  if (!ctx) throw new Error("useEnrollment must be inside EnrollmentProvider");
  return ctx;
}
