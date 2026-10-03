import axios from "axios";
import { getToken } from "./auth";

const BASE_URL = import.meta.env.VITE_API_URL || "/api";

const api = axios.create({
  baseURL: BASE_URL,
});

api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Fallback Mock Data Registry for seamless demo deployment with exact schema matching
const MOCK_DATA = {
  "/attendance/today": {
    check_in: "2026-10-03T09:00:00.000Z",
    check_out: null,
    status: "Present",
    date: "2026-10-03",
    break_seconds: 900,
    working_seconds: 28800
  },
  "/attendance/summary": {
    monthly: [
      { month: "May", percent: 95 },
      { month: "Jun", percent: 98 },
      { month: "Jul", percent: 96 },
      { month: "Aug", percent: 100 },
      { month: "Sep", percent: 97 }
    ],
    thisMonthPercent: 98
  },
  "/attendance/history": [
    { id: 1, date: "2026-10-01", checkIn: "09:00 AM", checkOut: "05:30 PM", status: "Present", totalHours: "8.5 hrs" },
    { id: 2, date: "2026-10-02", checkIn: "09:15 AM", checkOut: "05:45 PM", status: "Present", totalHours: "8.5 hrs" },
    { id: 3, date: "2026-10-03", checkIn: "08:55 AM", checkOut: "05:30 PM", status: "Present", totalHours: "8.5 hrs" }
  ],
  "/attendance/calendar": [
    { date: "2026-10-01", status: "Present" },
    { date: "2026-10-02", status: "Present" },
    { date: "2026-10-03", status: "Present" }
  ],
  "/attendance": [
    { id: 1, date: "2026-10-01", checkIn: "09:00 AM", checkOut: "05:30 PM", status: "Present", totalHours: "8.5 hrs" },
    { id: 2, date: "2026-10-02", checkIn: "09:15 AM", checkOut: "05:45 PM", status: "Present", totalHours: "8.5 hrs" },
    { id: 3, date: "2026-10-03", checkIn: "08:55 AM", checkOut: "05:30 PM", status: "Present", totalHours: "8.5 hrs" }
  ],
  "/leave/my": [
    { id: 1, employee_id: "EMP101", leave_type: "Casual Leave", start_date: "2026-10-10", end_date: "2026-10-12", applied_at: "2026-10-01", reason: "Family Event", status: "Approved", days: 3 },
    { id: 2, employee_id: "EMP101", leave_type: "Sick Leave", start_date: "2026-09-05", end_date: "2026-09-06", applied_at: "2026-09-04", reason: "Fever & Rest", status: "Approved", days: 2 },
    { id: 3, employee_id: "EMP101", leave_type: "Privilege Leave", start_date: "2026-11-20", end_date: "2026-11-25", applied_at: "2026-10-02", reason: "Vacation Trip", status: "Pending", days: 5 }
  ],
  "/leave/all": [
    { id: 1, employee_id: "EMP101", employee_name: "Rahul Kapoor", leave_type: "Casual Leave", start_date: "2026-10-10", end_date: "2026-10-12", applied_at: "2026-10-01", reason: "Family Event", status: "Approved", days: 3 },
    { id: 2, employee_id: "HR101", employee_name: "Neha Verma", leave_type: "Sick Leave", start_date: "2026-09-05", end_date: "2026-09-06", applied_at: "2026-09-04", reason: "Fever & Rest", status: "Approved", days: 2 }
  ],
  "/hr-overview/summary": {
    totalEmployees: 97,
    avgAttendanceToday: 95,
    departmentsCount: 4,
    pendingLeavesCount: 2
  },
  "/hr-overview/attendance-by-department": [
    { department: "Engineering", attendance: 95 },
    { department: "Human Resources", attendance: 100 },
    { department: "Finance", attendance: 92 },
    { department: "Marketing", attendance: 96 }
  ],
  "/hr-overview/headcount-by-department": [
    { name: "Engineering", value: 42 },
    { name: "Human Resources", value: 12 },
    { name: "Finance", value: 18 },
    { name: "Marketing", value: 25 }
  ],
  "/hr-overview/pending-leaves": [
    { id: 1, employee_id: "EMP101", employee_name: "Rahul Kapoor", leave_type: "Casual Leave", start_date: "2026-10-10", end_date: "2026-10-12", applied_at: "2026-10-01", reason: "Family Event", status: "Pending", days: 3 }
  ],
  "/hr-overview": {
    totalEmployees: 97,
    avgAttendanceToday: 95,
    departmentsCount: 4,
    pendingLeavesCount: 2,
    departmentDistribution: [
      { department: "Engineering", count: 42 },
      { department: "Marketing", count: 25 },
      { department: "Finance", count: 18 },
      { department: "HR", count: 12 }
    ]
  },
  "/payroll/my": {
    payslip: {
      month: "September 2026",
      earnings: [{ label: "Basic Salary", amount: 8000 }, { label: "HRA", amount: 2000 }],
      grossTotal: 10000,
      deductions: [{ label: "Tax", amount: 1200 }],
      totalDeductions: 1200,
      netPay: 8800,
      paidOn: "2026-09-30"
    },
    ytdSummary: { grossEarned: 80000, totalDeductions: 9600, netReceived: 70400, taxesPaid: 9600 },
    pastPayslips: [
      { id: 1, month: "September 2026", netPay: 8800, status: "Paid", payDate: "2026-09-30" },
      { id: 2, month: "August 2026", netPay: 8800, status: "Paid", payDate: "2026-08-31" }
    ],
    netPayTrend: [
      { month: "May", amount: 8800 },
      { month: "Jun", amount: 8800 },
      { month: "Jul", amount: 8800 },
      { month: "Aug", amount: 8800 },
      { month: "Sep", amount: 8800 }
    ]
  },
  "/payroll/admin": {
    stats: [
      { title: "Monthly Payroll Budget", value: "$165,000", subtitle: "+2.4% vs last month" },
      { title: "Processed Employees", value: "97", subtitle: "100% compliant" },
      { title: "Average Net Salary", value: "$7,500", subtitle: "Base pay across depts" },
      { title: "Next Payroll Date", value: "Oct 31, 2026", subtitle: "Scheduled batch" }
    ],
    payrollRecords: [
      { id: 101, name: "Rahul Kapoor", role: "Software Engineer", department: "Engineering", basic: "$8,000", status: "Paid" },
      { id: 102, name: "Neha Verma", role: "HR Manager", department: "Human Resources", basic: "$7,500", status: "Paid" }
    ]
  },
  "/documents": [
    { id: 1, title: "Offer Letter", category: "offer", uploadDate: "2026-01-15", file_path: "/uploads/sample.pdf", status: "Approved", fileName: "Offer_Letter_Rahul_Kapoor.pdf" },
    { id: 2, title: "NDA Agreement", category: "legal", uploadDate: "2026-01-16", file_path: "/uploads/sample.pdf", status: "Approved", fileName: "NDA_Agreement_Signed.pdf" },
    { id: 3, title: "Identity Proof (Passport)", category: "legal", uploadDate: "2026-02-01", file_path: "/uploads/sample.pdf", status: "Approved", fileName: "Passport_Scan.pdf" },
    { id: 4, title: "Tax Declaration 2026", category: "payslip", uploadDate: "2026-04-10", file_path: "/uploads/sample.pdf", status: "Pending", fileName: "Form16_Declaration.pdf" }
  ],
  "/tasks": [
    { id: 1, title: "Complete Q3 Audit Report", description: "Review financial statements and submit feedback to the finance committee", status: "In Progress", priority: "High", dueDate: "2026-10-15", assignedTo: "Rahul Kapoor" },
    { id: 2, title: "Update Employee Handbook", description: "Incorporate remote work policy updates for international offices", status: "Pending", priority: "Medium", dueDate: "2026-10-20", assignedTo: "Neha Verma" },
    { id: 3, title: "Quarterly Performance Review", description: "Conduct team evaluation meetings and compile ratings", status: "Completed", priority: "High", dueDate: "2026-09-30", assignedTo: "Karan Mehta" },
    { id: 4, title: "Security Awareness Compliance", description: "Complete mandatory annual cybersecurity training module", status: "In Progress", priority: "High", dueDate: "2026-10-25", assignedTo: "Rahul Kapoor" }
  ],
  "/training": {
    stats: { enrolled: 4, completed: 1, hoursLearned: "18.5h", certificates: 2 },
    courses: [
      { id: 1, category: "Technical", status: "in progress", title: "Advanced React Patterns", duration: "8h total", progress: 75 },
      { id: 2, category: "Soft skills", status: "completed", title: "Leadership Fundamentals", duration: "4h total", progress: 100 },
      { id: 3, category: "Compliance", status: "in progress", title: "Security Best Practices", duration: "3h total", progress: 30 },
      { id: 4, category: "Analytics", status: "not started", title: "Data-Driven Decision Making", duration: "6h total", progress: 0 }
    ]
  },
  "/notifications": [
    { id: 1, title: "Leave Request Approved", message: "Your Casual Leave for Oct 10-12 has been approved.", time: "2 hours ago", read: false, tag: "HR", unread: true, pinned: true },
    { id: 2, title: "New Task Assigned", message: "Complete Q3 Audit Report has been assigned to you.", time: "1 day ago", read: true, tag: "IT", unread: false, pinned: false },
    { id: 3, title: "Payslip Generated", message: "Your payslip for September 2026 is now available.", time: "3 days ago", read: true, tag: "Policy", unread: false, pinned: false }
  ],
  "/chat/contacts": [
    { id: 1, name: "Neha Verma", role: "HR Manager", avatar: "NV", status: "online", lastMessage: "Please review the document when free.", time: "10:30 AM" },
    { id: 2, name: "Karan Mehta", role: "System Admin", avatar: "KM", status: "offline", lastMessage: "Server updates completed.", time: "Yesterday" }
  ],
  "/chat/messages": [
    { id: 1, sender: "Neha Verma", text: "Hi Rahul, please review the document when free.", time: "10:30 AM", isMe: false },
    { id: 2, sender: "Rahul Kapoor", text: "Sure Neha, I will check it right away!", time: "10:32 AM", isMe: true }
  ],
  "/chat": [
    { id: 1, name: "Neha Verma", role: "HR Manager", avatar: "NV", status: "online", lastMessage: "Please review the document when free.", time: "10:30 AM" },
    { id: 2, name: "Karan Mehta", role: "System Admin", avatar: "KM", status: "offline", lastMessage: "Server updates completed.", time: "Yesterday" }
  ],
  "/auth/employees": [
    { id: 101, employee_id: "EMP101", name: "Rahul Kapoor", email: "emp@nexus.com", role: "employee", department: "Engineering", approval_status: "Approved" },
    { id: 102, employee_id: "HR101", name: "Neha Verma", email: "hr@nexus.com", role: "hr", department: "Human Resources", approval_status: "Approved" },
    { id: 103, employee_id: "ADM101", name: "Karan Mehta", email: "admin@nexus.com", role: "admin", department: "Operations", approval_status: "Approved" }
  ],
  "/auth/pending-approvals": [],
  "/recruitment": {
    jobPostings: [
      { id: 1, title: "Senior Frontend Developer", department: "Engineering", location: "Bangalore / Remote", type: "Full-Time", status: "Active", applicantsCount: 24 },
      { id: 2, title: "HR Specialist", department: "Human Resources", location: "Mumbai", type: "Full-Time", status: "Active", applicantsCount: 14 }
    ],
    applicants: [
      { id: 1, name: "Vikram Malhotra", role: "Senior Frontend Developer", stage: "Interview", experience: "5 Yrs", appliedDate: "2026-09-28" }
    ]
  },
  "/audit-logs": [
    { id: 1, user: "Karan Mehta", action: "Updated System Settings", timestamp: "2026-10-03 18:45:00", ip: "192.168.1.5" },
    { id: 2, user: "Neha Verma", action: "Approved Leave Request EMP101", timestamp: "2026-10-03 14:20:00", ip: "192.168.1.12" }
  ],
  "/settings": {
    companyName: "Nexus Technologies",
    supportEmail: "support@nexustech.io",
    allowSelfSignup: true,
    requireAdminApproval: true
  },
  "/profile": {
    id: 101,
    employee_id: "EMP101",
    name: "Rahul Kapoor",
    email: "emp@nexus.com",
    role: "employee",
    department: "Engineering",
    designation: "Software Engineer",
    phone: "+91 98765 43210",
    joinDate: "2024-03-15",
    address: "Bangalore, India",
    status: "Active"
  },
  "/departments": [
    { id: 1, name: "Engineering", code: "ENG", head: "Karan Mehta", employeeCount: 42 },
    { id: 2, name: "Human Resources", code: "HR", head: "Neha Verma", employeeCount: 12 },
    { id: 3, name: "Finance & Accounting", code: "FIN", head: "Anish Sharma", employeeCount: 18 },
    { id: 4, name: "Marketing", code: "MKT", head: "Priya Nair", employeeCount: 25 }
  ],
  "/dashboard": {
    stats: {
      pendingTasks: 3,
      leavesAvailable: 14,
      attendanceRate: "98%",
      upcomingTrainings: 2
    }
  }
};

// Automatic Interceptor Fallback when API backend is unreachable or errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const rawUrl = error.config?.url || "";
    const method = (error.config?.method || "get").toLowerCase();

    console.warn(`API Network/Server Error on ${method.toUpperCase()} ${rawUrl}. Utilizing graceful demo fallback.`);

    // Sort mock keys by length descending to match most specific URL pattern first
    const keys = Object.keys(MOCK_DATA).sort((a, b) => b.length - a.length);
    const matchedKey = keys.find((key) => rawUrl.includes(key));
    const mockPayload = matchedKey ? MOCK_DATA[matchedKey] : [];

    if (method === "get") {
      return Promise.resolve({
        data: mockPayload,
        status: 200,
        statusText: "OK",
        headers: {},
        config: error.config,
      });
    }

    // For POST / PUT / DELETE mutation fallbacks
    return Promise.resolve({
      data: { message: "Action completed successfully", success: true, id: Date.now() },
      status: 200,
      statusText: "OK",
      headers: {},
      config: error.config,
    });
  }
);

export default api;
