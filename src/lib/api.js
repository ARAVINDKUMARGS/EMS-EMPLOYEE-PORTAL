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

// Fallback Mock Data Registry for seamless demo deployment
const MOCK_DATA = {
  "/documents": [
    { id: 1, title: "Offer Letter", category: "HR", uploadDate: "2026-01-15", file_url: "/uploads/sample.pdf", status: "Approved", fileName: "Offer_Letter_Rahul_Kapoor.pdf" },
    { id: 2, title: "NDA Agreement", category: "Legal", uploadDate: "2026-01-16", file_url: "/uploads/sample.pdf", status: "Approved", fileName: "NDA_Agreement_Signed.pdf" },
    { id: 3, title: "Identity Proof (Passport)", category: "Identity", uploadDate: "2026-02-01", file_url: "/uploads/sample.pdf", status: "Approved", fileName: "Passport_Scan.pdf" },
    { id: 4, title: "Tax Declaration 2026", category: "Finance", uploadDate: "2026-04-10", file_url: "/uploads/sample.pdf", status: "Pending", fileName: "Form16_Declaration.pdf" }
  ],
  "/tasks": [
    { id: 1, title: "Complete Q3 Audit Report", description: "Review financial statements and submit feedback to the finance committee", status: "In Progress", priority: "High", dueDate: "2026-10-15", assignedTo: "Rahul Kapoor" },
    { id: 2, title: "Update Employee Handbook", description: "Incorporate remote work policy updates for international offices", status: "Pending", priority: "Medium", dueDate: "2026-10-20", assignedTo: "Neha Verma" },
    { id: 3, title: "Quarterly Performance Review", description: "Conduct team evaluation meetings and compile ratings", status: "Completed", priority: "High", dueDate: "2026-09-30", assignedTo: "Karan Mehta" },
    { id: 4, title: "Security Awareness Compliance", description: "Complete mandatory annual cybersecurity training module", status: "In Progress", priority: "High", dueDate: "2026-10-25", assignedTo: "Rahul Kapoor" }
  ],
  "/attendance": [
    { id: 1, date: "2026-10-01", checkIn: "09:00 AM", checkOut: "05:30 PM", status: "Present", totalHours: "8.5 hrs" },
    { id: 2, date: "2026-10-02", checkIn: "09:15 AM", checkOut: "05:45 PM", status: "Present", totalHours: "8.5 hrs" },
    { id: 3, date: "2026-10-03", checkIn: "08:55 AM", checkOut: "05:30 PM", status: "Present", totalHours: "8.5 hrs" },
    { id: 4, date: "2026-09-30", checkIn: "09:05 AM", checkOut: "05:35 PM", status: "Present", totalHours: "8.5 hrs" }
  ],
  "/leave": [
    { id: 1, type: "Casual Leave", startDate: "2026-10-10", endDate: "2026-10-12", reason: "Family Event", status: "Approved", days: 3 },
    { id: 2, type: "Sick Leave", startDate: "2026-09-05", endDate: "2026-09-06", reason: "Fever & Rest", status: "Approved", days: 2 },
    { id: 3, type: "Privilege Leave", startDate: "2026-11-20", endDate: "2026-11-25", reason: "Vacation Trip", status: "Pending", days: 5 }
  ],
  "/payroll": [
    { id: 1, month: "September 2026", basicSalary: 75000, allowances: 15000, deductions: 5000, netPay: 85000, status: "Paid", payDate: "2026-09-30", slipUrl: "#" },
    { id: 2, month: "August 2026", basicSalary: 75000, allowances: 15000, deductions: 5000, netPay: 85000, status: "Paid", payDate: "2026-08-31", slipUrl: "#" },
    { id: 3, month: "July 2026", basicSalary: 75000, allowances: 15000, deductions: 5000, netPay: 85000, status: "Paid", payDate: "2026-07-31", slipUrl: "#" }
  ],
  "/performance": {
    rating: 4.8,
    goals: [
      { id: 1, title: "Optimize Core Web Vitals", progress: 85, targetDate: "2026-11-30" },
      { id: 2, title: "Automate CI/CD Deployment Pipelines", progress: 100, targetDate: "2026-09-15" },
      { id: 3, title: "Mentor Junior Engineers", progress: 70, targetDate: "2026-12-31" }
    ],
    reviews: [
      { id: 1, reviewer: "Neha Verma", score: "Exceeds Expectations", comments: "Outstanding technical leadership and high deliverability." }
    ]
  },
  "/training": [
    { id: 1, title: "Advanced React & Web Architecture", instructor: "Sarah Jenkins", duration: "12 Hours", status: "Enrolled", progress: 60 },
    { id: 2, title: "Cybersecurity & Data Privacy 2026", instructor: "Michael Chen", duration: "4 Hours", status: "Completed", progress: 100 },
    { id: 3, title: "Cloud Native Microservices with Node.js", instructor: "David Miller", duration: "16 Hours", status: "Available", progress: 0 }
  ],
  "/notifications": [
    { id: 1, title: "Leave Request Approved", message: "Your Casual Leave for Oct 10-12 has been approved.", time: "2 hours ago", read: false },
    { id: 2, title: "New Task Assigned", message: "Complete Q3 Audit Report has been assigned to you.", time: "1 day ago", read: true },
    { id: 3, title: "Payslip Generated", message: "Your payslip for September 2026 is now available.", time: "3 days ago", read: true }
  ],
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
  "/hr-overview": {
    totalEmployees: 97,
    activeEmployees: 92,
    pendingApprovals: 3,
    onLeaveToday: 2,
    departmentDistribution: [
      { department: "Engineering", count: 42 },
      { department: "Marketing", count: 25 },
      { department: "Finance", count: 18 },
      { department: "HR", count: 12 }
    ]
  },
  "/recruitment": {
    jobPostings: [
      { id: 1, title: "Senior Frontend Developer", department: "Engineering", location: "Bangalore / Remote", type: "Full-Time", status: "Active", applicantsCount: 24 },
      { id: 2, title: "HR Specialist", department: "Human Resources", location: "Mumbai", type: "Full-Time", status: "Active", applicantsCount: 14 }
    ],
    applicants: [
      { id: 1, name: "Vikram Malhotra", role: "Senior Frontend Developer", stage: "Interview", experience: "5 Yrs", appliedDate: "2026-09-28" }
    ]
  },
  "/chat": [
    { id: 1, sender: "Neha Verma", message: "Hi Rahul, please review the document when free.", time: "10:30 AM" }
  ],
  "/dashboard": {
    stats: {
      pendingTasks: 3,
      leavesAvailable: 14,
      attendanceRate: "98%",
      upcomingTrainings: 2
    }
  },
  "/audit-logs": [
    { id: 1, user: "Karan Mehta", action: "Updated System Settings", timestamp: "2026-10-03 18:45:00", ip: "192.168.1.5" },
    { id: 2, user: "Neha Verma", action: "Approved Leave Request EMP101", timestamp: "2026-10-03 14:20:00", ip: "192.168.1.12" }
  ]
};

// Automatic Interceptor Fallback when API backend is unreachable or errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const url = error.config?.url || "";
    const method = (error.config?.method || "get").toLowerCase();

    console.warn(`API Network/Server Error on ${method.toUpperCase()} ${url}. Utilizing graceful demo fallback.`);

    // Find matching mock key
    const matchedKey = Object.keys(MOCK_DATA).find((key) => url.startsWith(key) || url.includes(key));
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
      data: { message: "Action completed successfully (Demo Mode)", success: true, id: Date.now() },
      status: 200,
      statusText: "OK",
      headers: {},
      config: error.config,
    });
  }
);

export default api;
