import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import { AppShell } from '@/components/layout/AppShell';
import { isAuthenticated, getRole } from '@/lib/auth';
import HRShell from './hr/components/HRShell';
import AdminShell from './admin/components/AdminShell';
import AccessDenied from './pages/AccessDenied';

import Login from './pages/Login';
import Signup from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';
import Dashboard from './employee/pages/Dashboard';
import Profile from './employee/pages/Profile';
import Attendance from './employee/pages/Attendance';
import Leave from './employee/pages/Leave';
import Payroll from './employee/pages/Payroll';
import Tasks from './employee/pages/Tasks';
import Performance from './employee/pages/Performance';
import Chat from './employee/pages/Chat';
import Notifications from './employee/pages/Notifications';
import Training from './employee/pages/Training';
import CourseDetails from './employee/components/training/CourseDetails';
import Documents from './employee/pages/Documents';
import Settings from './employee/pages/Settings';
import HRDashboard from './hr/pages/Dashboard';
import HRPerformance from './hr/pages/Performance';
import HREmployees from './hr/pages/Employees';
import HRLeaveApproval from './hr/pages/LeaveApproval';
import HRDepartments from './hr/pages/Departments';
import Recruitment from './hr/pages/Recruitment';
import JobDetails from './hr/pages/JobDetails';
import CandidateDetails from './hr/pages/CandidateDetails';
import Analytics from './admin/pages/Analytics';
import Reports from './admin/pages/Reports';
import AdminPayroll from './admin/pages/Payroll';
import AuditLogs from './admin/pages/AuditLogs';
import UserManagement from './admin/pages/UserManagement';
import SystemSettings from './admin/pages/SystemSettings';

function RequireAuth({ children }) {
  return isAuthenticated() ? children : <Navigate to="/" replace />;
}

function RequireRole({ children, allow }) {
  if (!isAuthenticated()) return <Navigate to="/" replace />;
  const role = getRole();
  if (!allow.includes(role)) return <Navigate to="/access-denied" replace />;
  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/access-denied" element={<AccessDenied />} />

        <Route element={<RequireAuth><AppShell /></RequireAuth>}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/attendance" element={<Attendance />} />
          <Route path="/leave" element={<Leave />} />
          <Route path="/payroll" element={<Payroll />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/performance" element={<Performance />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/training" element={<Training />} />
          <Route path="/course/:id" element={<CourseDetails />} />
          <Route path="/documents" element={<Documents />} />
          <Route path="/settings" element={<Settings />} />
        </Route>

        <Route path="/hr" element={<RequireRole allow={["hr", "admin"]}><HRShell /></RequireRole>}>
          <Route index element={<HRDashboard />} />
          <Route path="employees" element={<HREmployees />} />
          <Route path="leave-approval" element={<HRLeaveApproval />} />
          <Route path="departments" element={<HRDepartments />} />
          <Route path="performance" element={<HRPerformance />} />
          <Route path="recruitment" element={<Recruitment />} />
          <Route path="job/:id" element={<JobDetails />} />
          <Route path="candidate/:id" element={<CandidateDetails />} />
        </Route>

       <Route path="/admin" element={<RequireRole allow={["admin"]}><AdminShell /></RequireRole>}>
          <Route index element={<Analytics />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="reports" element={<Reports />} />
          <Route path="payroll" element={<AdminPayroll />} />
          <Route path="audit-logs" element={<AuditLogs />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="employee-approvals" element={<HREmployees />} />
          <Route path="settings" element={<SystemSettings />} />
       </Route>

        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
      <Toaster position="top-right" richColors closeButton />
    </BrowserRouter>
  );
}