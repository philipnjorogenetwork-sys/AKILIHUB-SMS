// ─── Types ───────────────────────────────────────────────────────
export type UserRole = "Admin" | "teacher" | "student" | "parent";

export interface Person {
  id: string;
  name: string;
  age: number;
  address: string;
  phone: string;
  email: string;
}

export interface Student extends Person {
  admissionNo: string;
  grade: string;
  section: string;
  parentId: string;
  enrolledCourses: string[];
  feeBalance: number;
  feePaid: number;
}

export interface Teacher extends Person {
  employeeId: string;
  subjects: string[];
  assignedClasses: string[];
}

export interface Parent extends Person {
  childrenIds: string[];
}

export interface Course {
  id: string;
  name: string;
  description: string;
  assignedTeacherId: string;
  grade: string;
  isElective: boolean;
  category?: string;
}

export interface Classroom {
  id: string;
  grade: string;
  section: string;
  enrolledStudentIds: string[];
  classTearcherId: string;
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  date: string;
  status: "present" | "absent" | "late";
  classroomId: string;
}

export interface Assignment {
  id: string;
  courseId: string;
  title: string;
  description: string;
  dueDate: string;
  totalMarks: number;
  teacherId: string;
}

export interface Exam {
  id: string;
  name: string;
  courseId: string;
  date: string;
  totalMarks: number;
  grade: string;
}

export interface ExamResult {
  id: string;
  examId: string;
  studentId: string;
  marksObtained: number;
  grade: string;
  remarks: string;
}

export interface FeePayment {
  id: string;
  studentId: string;
  amount: number;
  date: string;
  method: "mpesa" | "cash" | "bank";
  reference: string;
  status: "completed" | "pending" | "failed";
}

export interface TimetableSlot {
  id: string;
  classroomId: string;
  courseId: string;
  teacherId: string;
  day: "MON" | "TUE" | "WED" | "THU" | "FRI";
  startTime: string;
  endTime: string;
}

export interface Notification {
  id: string;
  targetRole: UserRole;
  targetId?: string;
  message: string;
  time: string;
  read: boolean;
  type: "info" | "warning" | "success" | "error";
}

export interface UserAccount {
  id: string;
  email: string;
  password: string;
  role: UserRole;
  personId: string;
  name: string;
}

// ─── Demo Data ───────────────────────────────────────────────────

export const teachers: Teacher[] = [
  { id: "T001", name: "Dr. James Mwangi", age: 45, address: "123 Uhuru St", phone: "0722100100", email: "james@school.com", employeeId: "EMP001", subjects: ["Mathematics"], assignedClasses: ["CL01", "CL04", "CL07"] },
  { id: "T002", name: "Prof. Sarah Otieno", age: 40, address: "456 Kenyatta Ave", phone: "0733200200", email: "sarah@school.com", employeeId: "EMP002", subjects: ["Physics", "Chemistry"], assignedClasses: ["CL01", "CL02"] },
  { id: "T003", name: "Mrs. Grace Wanjiku", age: 38, address: "789 Moi Rd", phone: "0744300300", email: "grace@school.com", employeeId: "EMP003", subjects: ["English", "Literature"], assignedClasses: ["CL01", "CL05"] },
  { id: "T004", name: "Mr. Peter Kamau", age: 42, address: "321 Ngong Rd", phone: "0755400400", email: "peter@school.com", employeeId: "EMP004", subjects: ["History", "Geography"], assignedClasses: ["CL02", "CL06"] },
  { id: "T005", name: "Mr. David Ochieng", age: 35, address: "654 Waiyaki Way", phone: "0766500500", email: "david@school.com", employeeId: "EMP005", subjects: ["Computer Studies", "Coding"], assignedClasses: ["CL03", "CL08"] },
  { id: "T006", name: "Ms. Faith Njeri", age: 30, address: "987 Thika Rd", phone: "0777600600", email: "faith@school.com", employeeId: "EMP006", subjects: ["Music", "Art"], assignedClasses: ["CL04", "CL09"] },
  { id: "T007", name: "Mr. John Kiprop", age: 33, address: "147 Lang'ata Rd", phone: "0788700700", email: "john@school.com", employeeId: "EMP007", subjects: ["Physical Education"], assignedClasses: ["CL05", "CL10"] },
  { id: "T008", name: "Ms. Linda Achieng", age: 29, address: "258 Karen Rd", phone: "0799800800", email: "linda@school.com", employeeId: "EMP008", subjects: ["Biology", "Agriculture"], assignedClasses: ["CL06", "CL11"] },
];

export const parents: Parent[] = [
  { id: "P001", name: "Mr. Joseph Kamau", age: 48, address: "12 Riverside Dr", phone: "0722111001", email: "joseph.k@email.com", childrenIds: ["S001", "S002"] },
  { id: "P002", name: "Mrs. Mary Wanjiru", age: 44, address: "34 Lavington Rd", phone: "0733222002", email: "mary.w@email.com", childrenIds: ["S003"] },
  { id: "P003", name: "Mr. Samuel Odera", age: 50, address: "56 Kilimani Rd", phone: "0744333003", email: "samuel.o@email.com", childrenIds: ["S004", "S005"] },
  { id: "P004", name: "Mrs. Jane Muthoni", age: 42, address: "78 Hurlingham Rd", phone: "0755444004", email: "jane.m@email.com", childrenIds: ["S006"] },
  { id: "P005", name: "Mr. Daniel Kipchoge", age: 46, address: "90 Westlands Rd", phone: "0766555005", email: "daniel.k@email.com", childrenIds: ["S007", "S008"] },
  { id: "P006", name: "Mrs. Alice Chebet", age: 40, address: "11 Parklands Rd", phone: "0777666006", email: "alice.c@email.com", childrenIds: ["S009"] },
  { id: "P007", name: "Mr. Patrick Wafula", age: 52, address: "22 Muthaiga Rd", phone: "0788777007", email: "patrick.w@email.com", childrenIds: ["S010", "S011"] },
  { id: "P008", name: "Mrs. Lucy Nyambura", age: 39, address: "33 Runda Rd", phone: "0799888008", email: "lucy.n@email.com", childrenIds: ["S012"] },
];

export const students: Student[] = [
  { id: "S001", name: "Kevin Kamau", age: 14, address: "12 Riverside Dr", phone: "0700001001", email: "kevin.k@student.com", admissionNo: "ADM2026001", grade: "Form 1", section: "East", parentId: "P001", enrolledCourses: ["C001", "C002", "C003", "C004"], feeBalance: 15000, feePaid: 35000 },
  { id: "S002", name: "Sharon Kamau", age: 16, address: "12 Riverside Dr", phone: "0700001002", email: "sharon.k@student.com", admissionNo: "ADM2026002", grade: "Form 3", section: "East", parentId: "P001", enrolledCourses: ["C001", "C003", "C005", "C010"], feeBalance: 5000, feePaid: 45000 },
  { id: "S003", name: "Brian Wanjiru", age: 15, address: "34 Lavington Rd", phone: "0700002001", email: "brian.w@student.com", admissionNo: "ADM2026003", grade: "Form 2", section: "West", parentId: "P002", enrolledCourses: ["C001", "C002", "C006"], feeBalance: 20000, feePaid: 30000 },
  { id: "S004", name: "Mercy Odera", age: 14, address: "56 Kilimani Rd", phone: "0700003001", email: "mercy.o@student.com", admissionNo: "ADM2026004", grade: "Form 1", section: "West", parentId: "P003", enrolledCourses: ["C001", "C002", "C003", "C011"], feeBalance: 0, feePaid: 50000 },
  { id: "S005", name: "Alex Odera", age: 17, address: "56 Kilimani Rd", phone: "0700003002", email: "alex.o@student.com", admissionNo: "ADM2026005", grade: "Form 4", section: "East", parentId: "P003", enrolledCourses: ["C001", "C003", "C005", "C007"], feeBalance: 10000, feePaid: 40000 },
  { id: "S006", name: "Grace Muthoni", age: 15, address: "78 Hurlingham Rd", phone: "0700004001", email: "grace.m@student.com", admissionNo: "ADM2026006", grade: "Form 2", section: "East", parentId: "P004", enrolledCourses: ["C001", "C002", "C004", "C012"], feeBalance: 8000, feePaid: 42000 },
  { id: "S007", name: "Dennis Kipchoge", age: 14, address: "90 Westlands Rd", phone: "0700005001", email: "dennis.k@student.com", admissionNo: "ADM2026007", grade: "Form 1", section: "North", parentId: "P005", enrolledCourses: ["C001", "C002", "C003"], feeBalance: 25000, feePaid: 25000 },
  { id: "S008", name: "Faith Kipchoge", age: 16, address: "90 Westlands Rd", phone: "0700005002", email: "faith.k@student.com", admissionNo: "ADM2026008", grade: "Form 3", section: "West", parentId: "P005", enrolledCourses: ["C001", "C005", "C006", "C010"], feeBalance: 12000, feePaid: 38000 },
  { id: "S009", name: "Victor Chebet", age: 15, address: "11 Parklands Rd", phone: "0700006001", email: "victor.c@student.com", admissionNo: "ADM2026009", grade: "Form 2", section: "North", parentId: "P006", enrolledCourses: ["C001", "C002", "C007"], feeBalance: 18000, feePaid: 32000 },
  { id: "S010", name: "Diana Wafula", age: 17, address: "22 Muthaiga Rd", phone: "0700007001", email: "diana.w@student.com", admissionNo: "ADM2026010", grade: "Form 4", section: "West", parentId: "P007", enrolledCourses: ["C001", "C003", "C005", "C008"], feeBalance: 3000, feePaid: 47000 },
  { id: "S011", name: "Martin Wafula", age: 14, address: "22 Muthaiga Rd", phone: "0700007002", email: "martin.w@student.com", admissionNo: "ADM2026011", grade: "Form 1", section: "East", parentId: "P007", enrolledCourses: ["C001", "C002", "C003", "C011"], feeBalance: 30000, feePaid: 20000 },
  { id: "S012", name: "Esther Nyambura", age: 16, address: "33 Runda Rd", phone: "0700008001", email: "esther.n@student.com", admissionNo: "ADM2026012", grade: "Form 3", section: "North", parentId: "P008", enrolledCourses: ["C001", "C003", "C006", "C012"], feeBalance: 7000, feePaid: 43000 },
];

export const courses: Course[] = [
  { id: "C001", name: "Mathematics", description: "Core mathematics curriculum", assignedTeacherId: "T001", grade: "All", isElective: false },
  { id: "C002", name: "English", description: "English language and comprehension", assignedTeacherId: "T003", grade: "All", isElective: false },
  { id: "C003", name: "Physics", description: "Physics fundamentals and experiments", assignedTeacherId: "T002", grade: "All", isElective: false },
  { id: "C004", name: "Chemistry", description: "Chemistry theory and practicals", assignedTeacherId: "T002", grade: "All", isElective: false },
  { id: "C005", name: "History", description: "World and African history", assignedTeacherId: "T004", grade: "All", isElective: false },
  { id: "C006", name: "Geography", description: "Physical and human geography", assignedTeacherId: "T004", grade: "All", isElective: false },
  { id: "C007", name: "Biology", description: "Biology and life sciences", assignedTeacherId: "T008", grade: "All", isElective: false },
  { id: "C008", name: "Computer Studies", description: "Computer science fundamentals", assignedTeacherId: "T005", grade: "All", isElective: false },
  { id: "C009", name: "Physical Education", description: "Sports and physical fitness", assignedTeacherId: "T007", grade: "All", isElective: false },
  { id: "C010", name: "Coding & Programming", description: "Python, JavaScript and web development", assignedTeacherId: "T005", grade: "All", isElective: true, category: "coding" },
  { id: "C011", name: "Music & Performance", description: "Instruments, vocals and music theory", assignedTeacherId: "T006", grade: "All", isElective: true, category: "music" },
  { id: "C012", name: "Art & Design", description: "Visual arts, painting and sculpture", assignedTeacherId: "T006", grade: "All", isElective: true, category: "art" },
  { id: "C013", name: "Engineering Basics", description: "Intro to mechanical and electrical engineering", assignedTeacherId: "T005", grade: "All", isElective: true, category: "engineering" },
];

export const classrooms: Classroom[] = [
  { id: "CL01", grade: "Form 1", section: "East", enrolledStudentIds: ["S001", "S011"], classTearcherId: "T001" },
  { id: "CL02", grade: "Form 1", section: "West", enrolledStudentIds: ["S004"], classTearcherId: "T002" },
  { id: "CL03", grade: "Form 1", section: "North", enrolledStudentIds: ["S007"], classTearcherId: "T005" },
  { id: "CL04", grade: "Form 2", section: "East", enrolledStudentIds: ["S006"], classTearcherId: "T006" },
  { id: "CL05", grade: "Form 2", section: "West", enrolledStudentIds: ["S003"], classTearcherId: "T003" },
  { id: "CL06", grade: "Form 2", section: "North", enrolledStudentIds: ["S009"], classTearcherId: "T004" },
  { id: "CL07", grade: "Form 3", section: "East", enrolledStudentIds: ["S002"], classTearcherId: "T001" },
  { id: "CL08", grade: "Form 3", section: "West", enrolledStudentIds: ["S008"], classTearcherId: "T005" },
  { id: "CL09", grade: "Form 3", section: "North", enrolledStudentIds: ["S012"], classTearcherId: "T006" },
  { id: "CL10", grade: "Form 4", section: "East", enrolledStudentIds: ["S005"], classTearcherId: "T007" },
  { id: "CL11", grade: "Form 4", section: "West", enrolledStudentIds: ["S010"], classTearcherId: "T008" },
  { id: "CL12", grade: "Form 4", section: "North", enrolledStudentIds: [], classTearcherId: "T004" },
];

const generateAttendance = (): AttendanceRecord[] => {
  const records: AttendanceRecord[] = [];
  const statuses: AttendanceRecord["status"][] = ["present", "present", "present", "present", "absent", "late", "present"];
  let id = 1;
  students.forEach((s) => {
    const cl = classrooms.find((c) => c.grade === s.grade && c.section === s.section);
    if (!cl) return;
    for (let d = 1; d <= 10; d++) {
      records.push({ id: `ATT${String(id++).padStart(4, "0")}`, studentId: s.id, date: `2026-04-${String(d).padStart(2, "0")}`, status: statuses[d % statuses.length], classroomId: cl.id });
    }
  });
  return records;
};
export const attendanceRecords: AttendanceRecord[] = generateAttendance();

export const assignments: Assignment[] = [
  { id: "ASG001", courseId: "C001", title: "Algebra Worksheet 1", description: "Solve quadratic equations", dueDate: "2026-04-15", totalMarks: 20, teacherId: "T001" },
  { id: "ASG002", courseId: "C001", title: "Geometry Assignment", description: "Areas and volumes of 3D shapes", dueDate: "2026-04-20", totalMarks: 25, teacherId: "T001" },
  { id: "ASG003", courseId: "C002", title: "Essay Writing", description: "Write a 500-word argumentative essay", dueDate: "2026-04-18", totalMarks: 30, teacherId: "T003" },
  { id: "ASG004", courseId: "C003", title: "Physics Lab Report", description: "Ohm's law experiment report", dueDate: "2026-04-22", totalMarks: 20, teacherId: "T002" },
  { id: "ASG005", courseId: "C010", title: "Build a Calculator", description: "Create a web calculator using JavaScript", dueDate: "2026-04-25", totalMarks: 40, teacherId: "T005" },
  { id: "ASG006", courseId: "C007", title: "Cell Biology Diagram", description: "Draw and label animal and plant cells", dueDate: "2026-04-17", totalMarks: 15, teacherId: "T008" },
];

export const exams: Exam[] = [
  { id: "EX001", name: "Mid-Term Exam", courseId: "C001", date: "2026-04-25", totalMarks: 100, grade: "Form 1" },
  { id: "EX002", name: "Mid-Term Exam", courseId: "C002", date: "2026-04-26", totalMarks: 100, grade: "Form 1" },
  { id: "EX003", name: "Mid-Term Exam", courseId: "C003", date: "2026-04-27", totalMarks: 100, grade: "Form 2" },
  { id: "EX004", name: "CAT 1", courseId: "C001", date: "2026-04-10", totalMarks: 30, grade: "Form 3" },
  { id: "EX005", name: "CAT 1", courseId: "C005", date: "2026-04-11", totalMarks: 30, grade: "Form 4" },
  { id: "EX006", name: "Mid-Term Exam", courseId: "C007", date: "2026-04-28", totalMarks: 100, grade: "Form 2" },
];

export const examResults: ExamResult[] = [
  { id: "ER001", examId: "EX001", studentId: "S001", marksObtained: 78, grade: "B+", remarks: "Good performance" },
  { id: "ER002", examId: "EX001", studentId: "S004", marksObtained: 92, grade: "A", remarks: "Excellent" },
  { id: "ER003", examId: "EX001", studentId: "S007", marksObtained: 65, grade: "B-", remarks: "Needs improvement" },
  { id: "ER004", examId: "EX001", studentId: "S011", marksObtained: 85, grade: "A-", remarks: "Very good" },
  { id: "ER005", examId: "EX002", studentId: "S001", marksObtained: 70, grade: "B", remarks: "Satisfactory" },
  { id: "ER006", examId: "EX003", studentId: "S003", marksObtained: 88, grade: "A-", remarks: "Excellent work" },
  { id: "ER007", examId: "EX003", studentId: "S006", marksObtained: 72, grade: "B", remarks: "Good effort" },
  { id: "ER008", examId: "EX003", studentId: "S009", marksObtained: 55, grade: "C+", remarks: "More practice needed" },
  { id: "ER009", examId: "EX004", studentId: "S002", marksObtained: 25, grade: "A-", remarks: "Great" },
  { id: "ER010", examId: "EX004", studentId: "S008", marksObtained: 22, grade: "B+", remarks: "Good" },
  { id: "ER011", examId: "EX004", studentId: "S012", marksObtained: 28, grade: "A", remarks: "Outstanding" },
  { id: "ER012", examId: "EX005", studentId: "S005", marksObtained: 27, grade: "A", remarks: "Excellent" },
  { id: "ER013", examId: "EX005", studentId: "S010", marksObtained: 20, grade: "B", remarks: "Satisfactory" },
];

export const feePayments: FeePayment[] = [
  { id: "FP001", studentId: "S001", amount: 15000, date: "2026-01-15", method: "mpesa", reference: "QWE12345", status: "completed" },
  { id: "FP002", studentId: "S001", amount: 20000, date: "2026-03-10", method: "mpesa", reference: "QWE12346", status: "completed" },
  { id: "FP003", studentId: "S002", amount: 45000, date: "2026-01-20", method: "bank", reference: "BNK78901", status: "completed" },
  { id: "FP004", studentId: "S003", amount: 30000, date: "2026-02-01", method: "mpesa", reference: "QWE12347", status: "completed" },
  { id: "FP005", studentId: "S004", amount: 50000, date: "2026-01-10", method: "bank", reference: "BNK78902", status: "completed" },
  { id: "FP006", studentId: "S005", amount: 40000, date: "2026-01-25", method: "mpesa", reference: "QWE12348", status: "completed" },
  { id: "FP007", studentId: "S006", amount: 42000, date: "2026-02-15", method: "cash", reference: "CSH00001", status: "completed" },
  { id: "FP008", studentId: "S007", amount: 25000, date: "2026-03-01", method: "mpesa", reference: "QWE12349", status: "completed" },
  { id: "FP009", studentId: "S010", amount: 47000, date: "2026-01-05", method: "bank", reference: "BNK78903", status: "completed" },
  { id: "FP010", studentId: "S012", amount: 43000, date: "2026-02-20", method: "mpesa", reference: "QWE12350", status: "completed" },
];

export const timetableSlots: TimetableSlot[] = [
  { id: "TS01", classroomId: "CL01", courseId: "C001", teacherId: "T001", day: "MON", startTime: "08:00", endTime: "08:40" },
  { id: "TS02", classroomId: "CL01", courseId: "C002", teacherId: "T003", day: "MON", startTime: "08:40", endTime: "09:20" },
  { id: "TS03", classroomId: "CL01", courseId: "C003", teacherId: "T002", day: "MON", startTime: "09:40", endTime: "10:20" },
  { id: "TS04", classroomId: "CL01", courseId: "C004", teacherId: "T002", day: "MON", startTime: "10:20", endTime: "11:00" },
  { id: "TS05", classroomId: "CL01", courseId: "C005", teacherId: "T004", day: "TUE", startTime: "08:00", endTime: "08:40" },
  { id: "TS06", classroomId: "CL01", courseId: "C006", teacherId: "T004", day: "TUE", startTime: "08:40", endTime: "09:20" },
  { id: "TS07", classroomId: "CL01", courseId: "C007", teacherId: "T008", day: "TUE", startTime: "09:40", endTime: "10:20" },
  { id: "TS08", classroomId: "CL01", courseId: "C008", teacherId: "T005", day: "WED", startTime: "08:00", endTime: "08:40" },
  { id: "TS09", classroomId: "CL01", courseId: "C009", teacherId: "T007", day: "WED", startTime: "08:40", endTime: "09:20" },
  { id: "TS10", classroomId: "CL01", courseId: "C001", teacherId: "T001", day: "WED", startTime: "09:40", endTime: "10:20" },
  { id: "TS11", classroomId: "CL01", courseId: "C002", teacherId: "T003", day: "THU", startTime: "08:00", endTime: "08:40" },
  { id: "TS12", classroomId: "CL01", courseId: "C003", teacherId: "T002", day: "THU", startTime: "08:40", endTime: "09:20" },
  { id: "TS13", classroomId: "CL01", courseId: "C001", teacherId: "T001", day: "FRI", startTime: "08:00", endTime: "08:40" },
  { id: "TS14", classroomId: "CL01", courseId: "C004", teacherId: "T002", day: "FRI", startTime: "08:40", endTime: "09:20" },
  { id: "TS15", classroomId: "CL04", courseId: "C001", teacherId: "T001", day: "MON", startTime: "11:00", endTime: "11:40" },
  { id: "TS16", classroomId: "CL04", courseId: "C002", teacherId: "T003", day: "MON", startTime: "11:40", endTime: "12:20" },
  { id: "TS17", classroomId: "CL04", courseId: "C006", teacherId: "T004", day: "TUE", startTime: "11:00", endTime: "11:40" },
  { id: "TS18", classroomId: "CL04", courseId: "C007", teacherId: "T008", day: "WED", startTime: "11:00", endTime: "11:40" },
  { id: "TS19", classroomId: "CL07", courseId: "C001", teacherId: "T001", day: "MON", startTime: "14:00", endTime: "14:40" },
  { id: "TS20", classroomId: "CL07", courseId: "C003", teacherId: "T002", day: "TUE", startTime: "14:00", endTime: "14:40" },
  { id: "TS21", classroomId: "CL10", courseId: "C001", teacherId: "T001", day: "THU", startTime: "14:00", endTime: "14:40" },
  { id: "TS22", classroomId: "CL10", courseId: "C005", teacherId: "T004", day: "FRI", startTime: "14:00", endTime: "14:40" },
];

export const notifications: Notification[] = [
  { id: "N001", targetRole: "Admin", message: "3 new admission inquiries received", time: "2 hours ago", read: false, type: "info" },
  { id: "N002", targetRole: "Admin", message: "Fee payment deadline approaching for Term 1", time: "4 hours ago", read: false, type: "warning" },
  { id: "N003", targetRole: "teacher", targetId: "T001", message: "Mid-term exam schedule published", time: "1 day ago", read: false, type: "info" },
  { id: "N004", targetRole: "student", targetId: "S001", message: "Your Algebra assignment is due in 2 days", time: "6 hours ago", read: false, type: "warning" },
  { id: "N005", targetRole: "parent", targetId: "P001", message: "Kevin's attendance dropped below 90%", time: "1 day ago", read: false, type: "error" },
  { id: "N006", targetRole: "parent", targetId: "P001", message: "Fee balance reminder: KSh 15,000 outstanding", time: "2 days ago", read: true, type: "warning" },
  { id: "N007", targetRole: "student", targetId: "S002", message: "New assignment: Physics Lab Report", time: "3 hours ago", read: false, type: "info" },
  { id: "N008", targetRole: "Admin", message: "System backup completed successfully", time: "1 day ago", read: true, type: "success" },
];

export const userAccounts: UserAccount[] = [
  { id: "U001", email: "Admin@school.com", password: "Admin123", role: "Admin", personId: "Admin", name: "System Admin" },
  { id: "U002", email: "james@school.com", password: "teacher123", role: "teacher", personId: "T001", name: "Dr. James Mwangi" },
  { id: "U003", email: "sarah@school.com", password: "teacher123", role: "teacher", personId: "T002", name: "Prof. Sarah Otieno" },
  { id: "U004", email: "kevin.k@student.com", password: "student123", role: "student", personId: "S001", name: "Kevin Kamau" },
  { id: "U005", email: "sharon.k@student.com", password: "student123", role: "student", personId: "S002", name: "Sharon Kamau" },
  { id: "U006", email: "joseph.k@email.com", password: "parent123", role: "parent", personId: "P001", name: "Mr. Joseph Kamau" },
  { id: "U007", email: "mary.w@email.com", password: "parent123", role: "parent", personId: "P002", name: "Mrs. Mary Wanjiru" },
];

// ─── Helper Functions ────────────────────────────────────────────
export function getStudentsByClassroom(classroomId: string): Student[] {
  const cl = classrooms.find(c => c.id === classroomId);
  if (!cl) return [];
  return students.filter(s => cl.enrolledStudentIds.includes(s.id));
}

export function getTeacherById(id: string): Teacher | undefined {
  return teachers.find(t => t.id === id);
}

export function getCourseById(id: string): Course | undefined {
  return courses.find(c => c.id === id);
}

export function getStudentById(id: string): Student | undefined {
  return students.find(s => s.id === id);
}

export function getAttendanceForStudent(studentId: string): AttendanceRecord[] {
  return attendanceRecords.filter(a => a.studentId === studentId);
}

export function getResultsForStudent(studentId: string): ExamResult[] {
  return examResults.filter(r => r.studentId === studentId);
}

export function getChildrenForParent(parentId: string): Student[] {
  const parent = parents.find(p => p.id === parentId);
  if (!parent) return [];
  return students.filter(s => parent.childrenIds.includes(s.id));
}

export function getTimetableForClassroom(classroomId: string): TimetableSlot[] {
  return timetableSlots.filter(t => t.classroomId === classroomId);
}

export function getClassroomForStudent(student: Student): Classroom | undefined {
  return classrooms.find(c => c.grade === student.grade && c.section === student.section);
}

export const schoolInfo = {
  name: "Akili Hub Solutions",
  motto: "Excellence Through Knowledge",
  academicYear: "2026",
  term: "Term 1",
  totalStudents: students.length,
  totalTeachers: teachers.length,
  totalRevenue: students.reduce((sum, s) => sum + s.feePaid, 0),
  totalOutstanding: students.reduce((sum, s) => sum + s.feeBalance, 0),
};
