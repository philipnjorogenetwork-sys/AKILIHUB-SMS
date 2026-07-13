import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import SMSLayout from "@/components/SMSLayout";
import Login from "@/pages/Login";
import AdminDashboard from "@/pages/Admin/AdminDashboard";
import ManageStudents from "@/pages/Admin/ManageStudents";
import ManageTeachers from "@/pages/Admin/ManageTeachers";
import ManageCourses from "@/pages/Admin/ManageCourses";
import ManageClassrooms from "@/pages/Admin/ManageClassrooms";
import Enrollment from "@/pages/Admin/Enrollment";
import FeeCollection from "@/pages/Admin/FeeCollection";
import AdminReports from "@/pages/Admin/AdminReports";
import AdminSettings from "@/pages/Admin/AdminSettings";
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
import ParentDashboard from "@/pages/parent/ParentDashboard";
import ChildProgress from "@/pages/parent/ChildProgress";
import ParentFees from "@/pages/parent/ParentFees";
import ParentNotifications from "@/pages/parent/ParentNotifications";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function AppRoutes() {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) return <Login />;

  const roleHome: Record<string, string> = { Admin: "/Admin", teacher: "/teacher", student: "/student", parent: "/parent" };

  return (
    <Routes>
      <Route path="/" element={<Navigate to={roleHome[user!.role]} replace />} />
      <Route element={<SMSLayout />}>
        {/* Admin */}
        <Route path="/Admin" element={<AdminDashboard />} />
        <Route path="/Admin/students" element={<ManageStudents />} />
        <Route path="/Admin/teachers" element={<ManageTeachers />} />
        <Route path="/Admin/courses" element={<ManageCourses />} />
        <Route path="/Admin/classrooms" element={<ManageClassrooms />} />
        <Route path="/Admin/enrollment" element={<Enrollment />} />
        <Route path="/Admin/fees" element={<FeeCollection />} />
        <Route path="/Admin/reports" element={<AdminReports />} />
        <Route path="/Admin/settings" element={<AdminSettings />} />
        {/* Teacher */}
        <Route path="/teacher" element={<TeacherDashboard />} />
        <Route path="/teacher/attendance" element={<TakeAttendance />} />
        <Route path="/teacher/marks" element={<MarksEntry />} />
        <Route path="/teacher/assignments" element={<ManageAssignments />} />
        <Route path="/teacher/timetable" element={<TeacherTimetable />} />
        <Route path="/teacher/classes" element={<TeacherClasses />} />
        {/* Student */}
        <Route path="/student" element={<StudentDashboard />} />
        <Route path="/student/timetable" element={<StudentTimetable />} />
        <Route path="/student/attendance" element={<StudentAttendance />} />
        <Route path="/student/marks" element={<StudentMarks />} />
        <Route path="/student/assignments" element={<StudentAssignments />} />
        <Route path="/student/electives" element={<StudentElectives />} />
        {/* Parent */}
        <Route path="/parent" element={<ParentDashboard />} />
        <Route path="/parent/progress" element={<ChildProgress />} />
        <Route path="/parent/fees" element={<ParentFees />} />
        <Route path="/parent/notifications" element={<ParentNotifications />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
