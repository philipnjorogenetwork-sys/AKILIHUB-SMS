import { createContext, useContext, useState, type ReactNode } from "react";
import { teachers as initialTeachers, students as initialStudents, parents as initialParents, type Teacher, type Student, type Parent } from "@/data/schoolData";

export interface PendingUser {
  id: string;
  name: string;
  email: string;
  role: "teacher" | "student" | "parent";
  personId: string;
  addedAt: string;
}

export interface UserCredential {
  id: string;
  personId: string;
  email: string;
  password: string;
  role: "teacher" | "student" | "parent";
  issuedAt: string;
  status: "active" | "pending";
}

interface UserManagementState {
  teachers: Teacher[];
  students: Student[];
  parents: Parent[];
  pendingUsers: PendingUser[];
  credentials: UserCredential[];
}

interface UserManagementContextType extends UserManagementState {
  addTeacher: (teacher: Omit<Teacher, "id" | "employeeId">) => void;
  updateTeacher: (id: string, teacher: Partial<Teacher>) => void;
  deleteTeacher: (id: string) => void;
  addStudent: (student: Omit<Student, "id" | "admissionNo">) => void;
  updateStudent: (id: string, student: Partial<Student>) => void;
  deleteStudent: (id: string) => void;
  addParent: (parent: Omit<Parent, "id">) => void;
  updateParent: (id: string, parent: Partial<Parent>) => void;
  deleteParent: (id: string) => void;
  addPendingUser: (user: Omit<PendingUser, "addedAt">) => void;
  removePendingUser: (id: string) => void;
  issueCredential: (personId: string, email: string, password: string, role: "teacher" | "student" | "parent") => void;
  editCredential: (id: string, password: string) => void;
  deleteCredential: (id: string) => void;
  updateCredentialStatus: (id: string, status: "active" | "pending") => void;
  updateUserInformation: (personId: string, role: string, updates: { name?: string, email?: string }) => void;
  getCredentialByPersonId: (personId: string) => UserCredential | undefined;
  suspendUser: (personId: string, role: "teacher" | "student" | "parent") => void;
  unsuspendUser: (personId: string, role: "teacher" | "student" | "parent") => void;
  resetUserPassword: (personId: string) => string;
}

const UserManagementContext = createContext<UserManagementContextType | null>(null);

export function UserManagementProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<UserManagementState>({
    teachers: [...initialTeachers],
    students: [...initialStudents],
    parents: [...initialParents],
    pendingUsers: [],
    credentials: [],
  });

  const addTeacher = (teacher: Omit<Teacher, "id" | "employeeId">) => {
    const newId = `T${String(state.teachers.length + 1).padStart(3, "0")}`;
    const newTeacher: Teacher = {
      ...teacher,
      id: newId,
      employeeId: `EMP${String(state.teachers.length + 1).padStart(3, "0")}`,
    };
    setState(prev => ({
      ...prev,
      teachers: [...prev.teachers, newTeacher],
    }));
    // Add to pending users
    addPendingUser({
      id: `PEND${Math.random().toString(36).substr(2, 9)}`,
      name: teacher.name,
      email: teacher.email,
      role: "teacher",
      personId: newId,
    });
  };

  const updateTeacher = (id: string, updates: Partial<Teacher>) => {
    setState(prev => ({
      ...prev,
      teachers: prev.teachers.map(t => (t.id === id ? { ...t, ...updates } : t)),
    }));
  };

  const deleteTeacher = (id: string) => {
    setState(prev => ({
      ...prev,
      teachers: prev.teachers.filter(t => t.id !== id),
      credentials: prev.credentials.filter(c => c.personId !== id),
      pendingUsers: prev.pendingUsers.filter(u => u.personId !== id),
    }));
  };

  const addStudent = (student: Omit<Student, "id" | "admissionNo">) => {
    const newId = `S${String(state.students.length + 1).padStart(3, "0")}`;
    const newStudent: Student = {
      ...student,
      id: newId,
      admissionNo: `ADM2026${String(state.students.length + 1).padStart(3, "0")}`,
    };
    setState(prev => ({
      ...prev,
      students: [...prev.students, newStudent],
    }));
    // Add to pending users
    addPendingUser({
      id: `PEND${Math.random().toString(36).substr(2, 9)}`,
      name: student.name,
      email: student.email,
      role: "student",
      personId: newId,
    });
  };

  const updateStudent = (id: string, updates: Partial<Student>) => {
    setState(prev => ({
      ...prev,
      students: prev.students.map(s => (s.id === id ? { ...s, ...updates } : s)),
    }));
  };

  const deleteStudent = (id: string) => {
    setState(prev => ({
      ...prev,
      students: prev.students.filter(s => s.id !== id),
      credentials: prev.credentials.filter(c => c.personId !== id),
      pendingUsers: prev.pendingUsers.filter(u => u.personId !== id),
    }));
  };

  const addParent = (parent: Omit<Parent, "id">) => {
    const newId = `P${String(state.parents.length + 1).padStart(3, "0")}`;
    const newParent: Parent = { ...parent, id: newId };
    setState(prev => ({
      ...prev,
      parents: [...prev.parents, newParent],
    }));
    // Add to pending users
    addPendingUser({
      id: `PEND${Math.random().toString(36).substr(2, 9)}`,
      name: parent.name,
      email: parent.email,
      role: "parent",
      personId: newId,
    });
  };

  const updateParent = (id: string, updates: Partial<Parent>) => {
    setState(prev => ({
      ...prev,
      parents: prev.parents.map(p => (p.id === id ? { ...p, ...updates } : p)),
    }));
  };

  const deleteParent = (id: string) => {
    setState(prev => ({
      ...prev,
      parents: prev.parents.filter(p => p.id !== id),
      credentials: prev.credentials.filter(c => c.personId !== id),
      pendingUsers: prev.pendingUsers.filter(u => u.personId !== id),
    }));
  };

  const addPendingUser = (user: Omit<PendingUser, "addedAt">) => {
    setState(prev => {
      // Check if already pending
      if (prev.pendingUsers.find(u => u.personId === user.personId)) {
        return prev;
      }
      return {
        ...prev,
        pendingUsers: [
          ...prev.pendingUsers,
          { ...user, addedAt: new Date().toISOString() },
        ],
      };
    });
  };

  const removePendingUser = (id: string) => {
    setState(prev => ({
      ...prev,
      pendingUsers: prev.pendingUsers.filter(u => u.id !== id),
    }));
  };

  const issueCredential = (personId: string, email: string, password: string, role: "teacher" | "student" | "parent") => {
    setState(prev => {
      // Check if credential already exists
      const existing = prev.credentials.find(c => c.personId === personId);
      if (existing) {
        return prev;
      }
      return {
        ...prev,
        credentials: [
          ...prev.credentials,
          {
            id: `CRED${Math.random().toString(36).substr(2, 9)}`,
            personId,
            email,
            password,
            role,
            issuedAt: new Date().toISOString(),
            status: "active",
          },
        ],
      };
    });
    // Remove from pending
    removePendingUser(personId);
  };

  const editCredential = (id: string, password: string) => {
    setState(prev => ({
      ...prev,
      credentials: prev.credentials.map(c =>
        c.id === id ? { ...c, password } : c
      ),
    }));
  };

  const deleteCredential = (id: string) => {
    setState(prev => ({
      ...prev,
      credentials: prev.credentials.filter(c => c.id !== id),
    }));
  };

  const updateCredentialStatus = (id: string, status: "active" | "pending") => {
    setState(prev => ({
      ...prev,
      credentials: prev.credentials.map(c => (c.id === id ? { ...c, status } : c)),
    }));
  };

  const updateUserInformation = (personId: string, role: string, updates: { name?: string, email?: string }) => {
    setState(prev => {
      const newState = { ...prev };
      if (role === "teacher") {
        newState.teachers = prev.teachers.map(t => t.id === personId ? { ...t, ...updates } : t);
      } else if (role === "student") {
        newState.students = prev.students.map(s => s.id === personId ? { ...s, ...updates } : s);
      } else if (role === "parent") {
        newState.parents = prev.parents.map(p => (p.id === personId ? { ...p, ...updates } : p));
      }
      
      // Also update credentials if they exist
      newState.credentials = prev.credentials.map(c => 
        c.personId === personId ? { ...c, email: updates.email || c.email } : c
      );
      
      return newState;
    });
  };

  const getCredentialByPersonId = (personId: string) => {
    return state.credentials.find(c => c.personId === personId);
  };

  const suspendUser = (personId: string, role: "teacher" | "student" | "parent") => {
    setState(prev => {
      const newState = { ...prev };
      if (role === "teacher") {
        newState.teachers = prev.teachers.map(t => t.id === personId ? { ...t, suspended: true } : t);
      } else if (role === "student") {
        newState.students = prev.students.map(s => s.id === personId ? { ...s, suspended: true } : s);
      } else if (role === "parent") {
        newState.parents = prev.parents.map(p => p.id === personId ? { ...p, suspended: true } : p);
      }
      // Update credential status
      newState.credentials = prev.credentials.map(c => 
        c.personId === personId ? { ...c, status: "inactive" as const } : c
      );
      return newState;
    });
  };

  const unsuspendUser = (personId: string, role: "teacher" | "student" | "parent") => {
    setState(prev => {
      const newState = { ...prev };
      if (role === "teacher") {
        newState.teachers = prev.teachers.map(t => t.id === personId ? { ...t, suspended: false } : t);
      } else if (role === "student") {
        newState.students = prev.students.map(s => s.id === personId ? { ...s, suspended: false } : s);
      } else if (role === "parent") {
        newState.parents = prev.parents.map(p => p.id === personId ? { ...p, suspended: false } : p);
      }
      // Update credential status
      newState.credentials = prev.credentials.map(c => 
        c.personId === personId ? { ...c, status: "active" as const } : c
      );
      return newState;
    });
  };

  const resetUserPassword = (personId: string): string => {
    // Generate a temporary password
    const tempPassword = `Temp${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    
    setState(prev => ({
      ...prev,
      credentials: prev.credentials.map(c => 
        c.personId === personId ? { ...c, password: tempPassword } : c
      ),
    }));

    return tempPassword;
  };

  return (
    <UserManagementContext.Provider
      value={{
        ...state,
        addTeacher,
        updateTeacher,
        deleteTeacher,
        addStudent,
        updateStudent,
        deleteStudent,
        addParent,
        updateParent,
        deleteParent,
        addPendingUser,
        removePendingUser,
        issueCredential,
        editCredential,
        deleteCredential,
        updateCredentialStatus,
        updateUserInformation,
        getCredentialByPersonId,
        suspendUser,
        unsuspendUser,
        resetUserPassword,
      }}
    >
      {children}
    </UserManagementContext.Provider>
  );
}

export function useUserManagement() {
  const ctx = useContext(UserManagementContext);
  if (!ctx) throw new Error("useUserManagement must be inside UserManagementProvider");
  return ctx;
}
