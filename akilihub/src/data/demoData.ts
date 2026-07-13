export interface Department {
  id: number;
  name: string;
  head: string;
  status: "Active" | "Inactive";
}

export interface ClassStream {
  id: number;
  className: string;
  stream: string;
  teacher: string;
  students: number;
}

export interface AdmissionLead {
  id: number;
  name: string;
  contact: string;
  stage: "Inquiry" | "Assessment" | "Approved" | "Enrolled" | "Rejected";
  date: string;
}

export interface TimetableEntry {
  id: number;
  className: string;
  subject: string;
  day: string;
  startTime: string;
  endTime: string;
  teacher: string;
}

export interface SystemSetting {
  id: number;
  key: string;
  value: string;
}

export interface AuditLog {
  id: number;
  portal: string;
  action: string;
  entity: string;
  entityId: string;
  time: string;
}

export interface Notification {
  id: number;
  message: string;
  time: string;
  read: boolean;
}

export const initialDepartments: Department[] = [
  { id: 1, name: "Mathematics", head: "Dr. James Mwangi", status: "Active" },
  { id: 2, name: "Sciences", head: "Prof. Sarah Otieno", status: "Active" },
  { id: 3, name: "Languages", head: "Mrs. Grace Wanjiku", status: "Active" },
  { id: 4, name: "Humanities", head: "Mr. Peter Kamau", status: "Active" },
  { id: 5, name: "Technical", head: "Mr. David Ochieng", status: "Active" },
  { id: 6, name: "Arts & Music", head: "Ms. Faith Njeri", status: "Inactive" },
  { id: 7, name: "Physical Education", head: "Mr. John Kiprop", status: "Active" },
  { id: 8, name: "ICT", head: "Ms. Linda Achieng", status: "Active" },
];

export const initialClasses: ClassStream[] = [
  { id: 1, className: "Form 1", stream: "East", teacher: "Mr. Omondi", students: 48 },
  { id: 2, className: "Form 1", stream: "West", teacher: "Mrs. Wambui", students: 45 },
  { id: 3, className: "Form 1", stream: "North", teacher: "Mr. Kibet", students: 47 },
  { id: 4, className: "Form 2", stream: "East", teacher: "Ms. Akinyi", students: 44 },
  { id: 5, className: "Form 2", stream: "West", teacher: "Mr. Njoroge", students: 46 },
  { id: 6, className: "Form 2", stream: "North", teacher: "Mrs. Chebet", students: 43 },
  { id: 7, className: "Form 3", stream: "East", teacher: "Mr. Mutua", students: 42 },
  { id: 8, className: "Form 3", stream: "West", teacher: "Ms. Wangari", students: 41 },
  { id: 9, className: "Form 3", stream: "North", teacher: "Mr. Rotich", students: 44 },
  { id: 10, className: "Form 4", stream: "East", teacher: "Dr. Onyango", students: 40 },
  { id: 11, className: "Form 4", stream: "West", teacher: "Mrs. Muthoni", students: 39 },
  { id: 12, className: "Form 4", stream: "North", teacher: "Mr. Langat", students: 38 },
];

export const initialAdmissions: AdmissionLead[] = [
  { id: 1, name: "Alice Kemunto", contact: "0722111222", stage: "Inquiry", date: "2026-04-01" },
  { id: 2, name: "Brian Kipchoge", contact: "0733222333", stage: "Assessment", date: "2026-04-02" },
  { id: 3, name: "Carol Nyambura", contact: "0744333444", stage: "Approved", date: "2026-03-28" },
  { id: 4, name: "Dennis Odhiambo", contact: "0755444555", stage: "Enrolled", date: "2026-03-20" },
  { id: 5, name: "Eva Wekesa", contact: "0766555666", stage: "Inquiry", date: "2026-04-05" },
  { id: 6, name: "Frank Mutiso", contact: "0777666777", stage: "Rejected", date: "2026-03-15" },
  { id: 7, name: "Grace Mwende", contact: "0788777888", stage: "Assessment", date: "2026-04-08" },
  { id: 8, name: "Henry Wafula", contact: "0799888999", stage: "Approved", date: "2026-04-10" },
];

export const initialTimetable: TimetableEntry[] = [
  { id: 1, className: "Form 1 East", subject: "Mathematics", day: "MON", startTime: "08:00", endTime: "08:40", teacher: "Dr. J. Mwangi" },
  { id: 2, className: "Form 1 East", subject: "English", day: "MON", startTime: "08:40", endTime: "09:20", teacher: "Mrs. G. Wanjiku" },
  { id: 3, className: "Form 1 East", subject: "Physics", day: "MON", startTime: "09:40", endTime: "10:20", teacher: "Prof. S. Otieno" },
  { id: 4, className: "Form 2 West", subject: "Chemistry", day: "TUE", startTime: "08:00", endTime: "08:40", teacher: "Mr. D. Ochieng" },
  { id: 5, className: "Form 2 West", subject: "Biology", day: "TUE", startTime: "08:40", endTime: "09:20", teacher: "Ms. F. Njeri" },
  { id: 6, className: "Form 3 East", subject: "History", day: "WED", startTime: "10:00", endTime: "10:40", teacher: "Mr. P. Kamau" },
  { id: 7, className: "Form 3 North", subject: "Geography", day: "THU", startTime: "11:00", endTime: "11:40", teacher: "Mr. Rotich" },
  { id: 8, className: "Form 4 East", subject: "Computer Studies", day: "FRI", startTime: "08:00", endTime: "08:40", teacher: "Ms. L. Achieng" },
];

export const initialSettings: SystemSetting[] = [
  { id: 1, key: "school_name", value: "Akili Hub Solutions" },
  { id: 2, key: "school_motto", value: "Excellence Through Knowledge" },
  { id: 3, key: "academic_year", value: "2026" },
  { id: 4, key: "term", value: "Term 1" },
  { id: 5, key: "sms_gateway", value: "africastalking" },
  { id: 6, key: "payment_gateway", value: "mpesa" },
  { id: 7, key: "grading_system", value: "KCSE" },
  { id: 8, key: "max_students_per_class", value: "50" },
];

export const initialAuditLogs: AuditLog[] = [
  { id: 1, portal: "Admin", action: "CREATE", entity: "Department", entityId: "D001", time: "2026-04-12 08:15" },
  { id: 2, portal: "Admin", action: "UPDATE", entity: "Student", entityId: "S1042", time: "2026-04-12 09:30" },
  { id: 3, portal: "Finance", action: "CREATE", entity: "Invoice", entityId: "INV-2026-0451", time: "2026-04-12 10:00" },
  { id: 4, portal: "Admin", action: "UPDATE", entity: "Timetable", entityId: "TT-F1E-MON", time: "2026-04-11 14:20" },
  { id: 5, portal: "Admin", action: "DELETE", entity: "Admission Lead", entityId: "AL006", time: "2026-04-11 16:45" },
  { id: 6, portal: "HR", action: "UPDATE", entity: "Staff", entityId: "STF089", time: "2026-04-11 11:00" },
  { id: 7, portal: "Admin", action: "CREATE", entity: "Class", entityId: "CLS-F1N", time: "2026-04-10 09:00" },
  { id: 8, portal: "Finance", action: "UPDATE", entity: "Fee Structure", entityId: "FS-2026-T1", time: "2026-04-10 13:30" },
  { id: 9, portal: "Admin", action: "LOGIN", entity: "User", entityId: "USR-ADM01", time: "2026-04-12 07:55" },
  { id: 10, portal: "Exam", action: "CREATE", entity: "Exam Schedule", entityId: "EX-2026-MID", time: "2026-04-09 15:00" },
];

export const initialNotifications: Notification[] = [
  { id: 1, message: "Fee payment deadline approaching for Term 1", time: "2 hours ago", read: false },
  { id: 2, message: "3 new admission inquiries received", time: "4 hours ago", read: false },
  { id: 3, message: "Staff meeting scheduled for Friday 3:00 PM", time: "1 day ago", read: false },
  { id: 4, message: "Exam results for Form 3 ready for review", time: "1 day ago", read: true },
  { id: 5, message: "Maintenance request: Lab 2 AC repair", time: "2 days ago", read: true },
];

export const dashboardStats = {
  totalStudents: 1047,
  totalStaff: 82,
  teachingStaff: 58,
  nonTeachingStaff: 24,
  revenue: 42_350_000,
  outstandingFees: 8_720_000,
  avgPerformance: 67.4,
  attendanceRate: 94.2,
  attendanceAlerts: 12,
  maleStudents: 538,
  femaleStudents: 509,
  boardingStudents: 680,
  dayStudents: 367,
  admissionInquiries: 23,
  pendingApprovals: 8,
};
