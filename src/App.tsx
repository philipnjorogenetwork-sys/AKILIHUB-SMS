import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter, Route, Routes, Navigate } from "react-router-dom";
import React from "react";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { EnrollmentProvider } from "@/contexts/EnrollmentContext";
import { UserManagementProvider } from "@/contexts/UserManagementContext";
import { NotificationProvider } from "@/contexts/NotificationContext";
import { MessagingProvider } from "@/contexts/MessagingContext";
import { AdminDataProvider } from "@/contexts/AdminDataContext";
import { DashboardDataProvider } from "@/contexts/DashboardDataContext";
import NetworkStatusIndicator from "@/components/NetworkStatusIndicator";
import SMSLayout from "@/components/SMSLayout";
import Login from "@/pages/Login";
import AccountProfile from "@/pages/AccountProfile";
import AccountSettings from "@/pages/AccountSettings";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import ManageStudents from "@/pages/admin/ManageStudents";
import ManageTeachers from "@/pages/admin/ManageTeachers";
import ManageParents from "@/pages/admin/ManageParents";
import ManageCourses from "@/pages/admin/ManageCourses";
import ManageClassrooms from "@/pages/admin/ManageClassrooms";
import Enrollment from "@/pages/admin/Enrollment";
import FeeCollection from "@/pages/admin/FeeCollection";
import AdminReports from "@/pages/admin/AdminReports";
import AdminSettings from "@/pages/admin/AdminSettings";
import BackendCredentialManager from "@/pages/admin/BackendCredentialManager";
import TeacherDashboard from "@/pages/teacher/TeacherDashboard";
import TakeAttendance from "@/pages/teacher/TakeAttendance";
import MarksEntry from "@/pages/teacher/MarksEntry";
import ManageAssignments from "@/pages/teacher/ManageAssignments";
import TeacherTimetable from "@/pages/teacher/TeacherTimetable";
import TeacherClasses from "@/pages/teacher/TeacherClasses";
import StudentDashboard from "@/pages/student/StudentDashboard";
import StudentTimetable from "@/pages/student/StudentTimetable";
import StudentAttendance from "@/pages/student/StudentAttendance";
import StudentMarks from "@/pages/student/StudentMarks";
import StudentAssignments from "@/pages/student/StudentAssignments";
import StudentElectives from "@/pages/student/StudentElectives";
import StudentTeachers from "@/pages/student/StudentTeachers";
import StudentAllStudents from "@/pages/student/StudentAllStudents";
import StudentSubjects from "@/pages/student/StudentSubjects";
import StudentClasses from "@/pages/student/StudentClasses";
import StudentLessons from "@/pages/student/StudentLessons";
import StudentExams from "@/pages/student/StudentExams";
import ParentDashboard from "@/pages/parent/ParentDashboard";
import ChildProgress from "@/pages/parent/ChildProgress";
import ParentFees from "@/pages/parent/ParentFees";
import ParentNotifications from "@/pages/parent/ParentNotifications";
import SecretaryDashboard from "@/pages/secretary/SecretaryDashboard";
import ManageAdmissions from "@/pages/secretary/ManageAdmissions";
import NotFound from "./pages/NotFound";
import ContactUs from "@/pages/ContactUs";
import CredentialGenerator from "@/pages/admin/CredentialGenerator";

// New SIS and Financial Overview Pages
import SISAdmissions from "@/pages/admin/sis/Admissions";
import SISProfiles from "@/pages/admin/sis/StudentProfiles";
import AllUsers from "@/pages/admin/sis/AllUsers";
import SISDocuments from "@/pages/admin/sis/Documents";
import SISPromotion from "@/pages/admin/sis/Promotion";
import SISAlumni from "@/pages/admin/sis/Alumni";
import FinancialOverview from "@/pages/common/FinancialOverview";
import FinanceDashboard from "@/pages/financecontroller/FinanceDashboard";
import AuditLogs from "@/pages/financecontroller/AuditLogs";
import AcademicCalendar from "@/pages/common/AcademicCalendar";
import Messages from "@/pages/common/Messages";
import UserMonitoring from "@/pages/admin/UserMonitoring";
import SystemOverview from "@/pages/admin/system/SystemOverview";
import UserManagement from "@/pages/admin/system/UserManagement";
import Permissions from "@/pages/admin/system/Permissions";


const queryClient = new QueryClient();

function AppRoutes() {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return (
      <Routes>
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  const roleHome: Record<string, string> = { 
    Admin: "/Admin", 
    teacher: "/teacher", 
    student: "/student", 
    parent: "/parent",
    finance: "/finance",
    secretary: "/secretary"
  };

  return (
    <Routes>
      <Route path="/" element={<Navigate to={roleHome[user!.role]} replace />} />
      <Route element={<SMSLayout />}>
        {/* Account */}
        <Route path="/account/profile" element={<AccountProfile />} />
        <Route path="/account/settings" element={<AccountSettings />} />
        {/* Global Messaging */}
        <Route path="/messages" element={<Messages />} />
        
        {/* Admin */}
        <Route path="/Admin" element={<AdminDashboard />} />
        <Route path="/Admin/sis/admissions" element={<SISAdmissions />} />
        <Route path="/Admin/sis/profiles" element={<SISProfiles />} />
        <Route path="/Admin/sis/documents" element={<SISDocuments />} />
        <Route path="/Admin/sis/promotion" element={<SISPromotion />} />
        <Route path="/Admin/sis/alumni" element={<SISAlumni />} />
        <Route path="/Admin/financials" element={<FinancialOverview />} />
        <Route path="/Admin/system" element={<SystemOverview />} />
        <Route path="/Admin/system/users" element={<UserManagement />} />
        <Route path="/Admin/system/permissions" element={<Permissions />} />
        
        <Route path="/Admin/credentials" element={<CredentialGenerator />} />
        <Route path="/Admin/credential-manager" element={<BackendCredentialManager />} />
        <Route path="/Admin/students" element={<ManageStudents />} />
        <Route path="/Admin/teachers" element={<ManageTeachers />} />
        <Route path="/Admin/parents" element={<ManageParents />} />
        <Route path="/Admin/monitoring/:userId" element={<UserMonitoring />} />
        <Route path="/Admin/courses" element={<ManageCourses />} />
        <Route path="/Admin/classrooms" element={<ManageClassrooms />} />
        <Route path="/Admin/enrollment" element={<Enrollment />} />
        <Route path="/Admin/fees" element={<FeeCollection />} />
        <Route path="/Admin/reports" element={<AdminReports />} />
        <Route path="/Admin/settings" element={<AdminSettings />} />
        <Route path="/Admin/calendar" element={<AcademicCalendar />} />
        <Route path="/Admin/marks" element={<MarksEntry />} />

        {/* Finance */}
        <Route path="/finance" element={<FinanceDashboard />} />
        <Route path="/finance/overview" element={<FinancialOverview />} />
        <Route path="/finance/audit" element={<AuditLogs />} />

        {/* Teacher */}
        <Route path="/teacher" element={<TeacherDashboard />} />
        <Route path="/teacher/attendance" element={<TakeAttendance />} />
        <Route path="/teacher/marks" element={<MarksEntry />} />
        <Route path="/teacher/assignments" element={<ManageAssignments />} />
        <Route path="/teacher/timetable" element={<TeacherTimetable />} />
        <Route path="/teacher/classes" element={<TeacherClasses />} />
        <Route path="/teacher/calendar" element={<AcademicCalendar />} />
        {/* Student */}
        <Route path="/student" element={<StudentDashboard />} />
        <Route path="/student/timetable" element={<StudentTimetable />} />
        <Route path="/student/attendance" element={<StudentAttendance />} />
        <Route path="/student/marks" element={<StudentMarks />} />
        <Route path="/student/assignments" element={<StudentAssignments />} />
        <Route path="/student/electives" element={<StudentElectives />} />
        <Route path="/student/teachers" element={<StudentTeachers />} />
        <Route path="/student/students" element={<StudentAllStudents />} />
        <Route path="/student/subjects" element={<StudentSubjects />} />
        <Route path="/student/classes" element={<StudentClasses />} />
        <Route path="/student/lessons" element={<StudentLessons />} />
        <Route path="/student/exams" element={<StudentExams />} />
        {/* Parent */}
        <Route path="/parent" element={<ParentDashboard />} />
        <Route path="/parent/progress" element={<ChildProgress />} />
        <Route path="/parent/fees" element={<ParentFees />} />
        <Route path="/parent/notifications" element={<ParentNotifications />} />
        {/* Secretary */}
        <Route path="/secretary" element={<SecretaryDashboard />} />
        <Route path="/secretary/financials" element={<FinancialOverview />} />
        <Route path="/secretary/sis/admissions" element={<SISAdmissions />} />
        <Route path="/secretary/sis/profiles" element={<SISProfiles />} />
        <Route path="/secretary/sis/documents" element={<SISDocuments />} />
        <Route path="/secretary/sis/promotion" element={<SISPromotion />} />
        <Route path="/secretary/sis/alumni" element={<SISAlumni />} />
        <Route path="/secretary/admissions" element={<ManageAdmissions />} />
        <Route path="/secretary/students" element={<SecretaryDashboard />} />
        <Route path="/secretary/parents" element={<SecretaryDashboard />} />
        <Route path="/secretary/fees" element={<SecretaryDashboard />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: any) {
    console.error("App Error:", error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: "20px", textAlign: "center" }}>
          <h1>Application Error</h1>
          <p>The application encountered an error. Please refresh the page.</p>
          <details style={{ marginTop: "20px", textAlign: "left" }}>
            <summary>Details</summary>
            <pre>Check browser console for error details</pre>
          </details>
        </div>
      );
    }

    return this.props.children;
  }
}

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <NetworkStatusIndicator />
        <Toaster />
        <Sonner />
        <HashRouter>
          <AuthProvider>
            <DashboardDataProvider>
              <AdminDataProvider>
                <MessagingProvider>
                  <NotificationProvider>
                    <UserManagementProvider>
                      <EnrollmentProvider>
                        <AppRoutes />
                      </EnrollmentProvider>
                    </UserManagementProvider>
                  </NotificationProvider>
                </MessagingProvider>
              </AdminDataProvider>
            </DashboardDataProvider>
          </AuthProvider>
        </HashRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
