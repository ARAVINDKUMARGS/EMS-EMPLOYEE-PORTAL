const currentUser = {
  id: "EMP-1847",
  firstName: "John",
  lastName: "Doe",
  initials: "JD",
  role: "Senior Engineer",
  email: "demo.john@nexus.io",
  phone: "+1 (555) 012-4789",
  dob: "1993-08-14",
  nationality: "US Citizen",
  address: "San Francisco, CA",
  emergency: "Wei Chen (spouse)",
  department: "Engineering",
  timezone: "America/Los_Angeles",
  joined: "2019-04-02",
  manager: "Jane Wu"
};
const dashboardStats = [
  { label: "Attendance", value: "96%", sub: "20 / 21 days this month", tone: "info", icon: "clock" },
  { label: "Tasks done", value: "4/6", sub: "2 in progress", tone: "success", icon: "check" },
  { label: "Leave balance", value: "12d", sub: "Annual remaining", tone: "violet", icon: "calendar" },
  { label: "Net salary", value: "$8,800", sub: "June 2024", tone: "warning", icon: "dollar" }
];
const attendanceMonthly = [
  { month: "Feb", days: 20 },
  { month: "Mar", days: 20 },
  { month: "Apr", days: 20 },
  { month: "May", days: 22 },
  { month: "Jun", days: 20 },
  { month: "Jul", days: 15 }
];
const recentTasks = [
  { id: 1, title: "Review Q3 architecture proposal", status: "in-progress", due: "Jul 5", priority: "high" },
  { id: 2, title: "Update API documentation", status: "todo", due: "Jul 8", priority: "medium" },
  { id: 3, title: "Fix authentication bug #1247", status: "in-progress", due: "Jul 3", priority: "urgent" },
  { id: 4, title: "Code review for feature/auth-refresh", status: "done", due: "Jul 1", priority: "medium" },
  { id: 5, title: "Deploy staging environment", status: "todo", due: "Jul 10", priority: "low" },
  { id: 6, title: "Onboard new team member", status: "done", due: "Jun 28", priority: "medium" }
];
const attendanceHistory = [
  { date: "Jul 1, 2024", day: "Mon", in: "09:01", out: "18:05", brk: "1h", hours: "8h 4m", status: "present" },
  { date: "Jun 28, 2024", day: "Fri", in: "08:58", out: "17:45", brk: "10m", hours: "8h 2m", status: "present" },
  { date: "Jun 27, 2024", day: "Thu", in: "09:34", out: "18:10", brk: "1h", hours: "7h 36m", status: "late" },
  { date: "Jun 26, 2024", day: "Wed", in: "09:00", out: "18:00", brk: "1h", hours: "8h 0m", status: "present" },
  { date: "Jun 25, 2024", day: "Tue", in: "\u2014", out: "\u2014", brk: "\u2014", hours: "\u2014", status: "absent" },
  { date: "Jun 24, 2024", day: "Mon", in: "08:55", out: "17:58", brk: "45m", hours: "8h 18m", status: "present" }
];
const leaveBalances = [
  { type: "Annual Leave", used: 8, total: 20, color: "primary" },
  { type: "Sick Leave", used: 2, total: 10, color: "success" },
  { type: "Personal Leave", used: 1, total: 10, color: "warning" },
  { type: "Comp Off", used: 0, total: 30, color: "chart-5" }
];
const leaveHistory = [
  { type: "Annual", dates: "Jul 15-17", days: 3, reason: "Personal vacation", applied: "Jul 1", status: "approved" },
  { type: "Sick", dates: "Jun 12", days: 1, reason: "Fever", applied: "Jun 12", status: "approved" },
  { type: "Annual", dates: "May 27-31", days: 5, reason: "Holiday trip", applied: "May 10", status: "approved" },
  { type: "Personal", dates: "Apr 8", days: 1, reason: "Family event", applied: "Apr 5", status: "rejected" },
  { type: "Sick", dates: "Mar 22", days: 2, reason: "Flu", applied: "Mar 22", status: "approved" }
];
const leaveUsage = [
  { month: "Jan", days: 0 },
  { month: "Feb", days: 0 },
  { month: "Mar", days: 2 },
  { month: "Apr", days: 1 },
  { month: "May", days: 5 },
  { month: "Jun", days: 1 },
  { month: "Jul", days: 3 }
];
const payslips = [
  { month: "Jun 2024", gross: 11500, net: 8800, tax: 2200, bonus: 500, status: "paid" },
  { month: "May 2024", gross: 11e3, net: 8450, tax: 2100, bonus: 0, status: "paid" },
  { month: "Apr 2024", gross: 11e3, net: 8450, tax: 2100, bonus: 0, status: "paid" },
  { month: "Mar 2024", gross: 11e3, net: 8450, tax: 2100, bonus: 0, status: "paid" },
  { month: "Feb 2024", gross: 11e3, net: 8450, tax: 2100, bonus: 0, status: "paid" },
  { month: "Jan 2024", gross: 11e3, net: 8450, tax: 2100, bonus: 0, status: "paid" }
];
const salaryTrend = [
  { month: "Jan", net: 8450 },
  { month: "Feb", net: 8450 },
  { month: "Mar", net: 8450 },
  { month: "Apr", net: 8450 },
  { month: "May", net: 8450 },
  { month: "Jun", net: 8800 },
  { month: "Jul", net: 8800 }
];
const kanbanTasks = {
  todo: [
    { id: "t1", title: "Update API documentation", priority: "medium", due: "Jul 8", assignee: "AC" },
    { id: "t2", title: "Deploy staging environment", priority: "low", due: "Jul 10", assignee: "AC" },
    { id: "t3", title: "Draft RFC for search v2", priority: "medium", due: "Jul 12", assignee: "AC" }
  ],
  inProgress: [
    { id: "t4", title: "Review Q3 architecture proposal", priority: "high", due: "Jul 5", assignee: "AC" },
    { id: "t5", title: "Fix authentication bug #1247", priority: "urgent", due: "Jul 3", assignee: "AC" }
  ],
  done: [
    { id: "t6", title: "Code review for feature/auth-refresh", priority: "medium", due: "Jul 1", assignee: "MK" },
    { id: "t7", title: "Onboard new team member", priority: "medium", due: "Jun 28", assignee: "AK" }
  ]
};
const documents = [
  { name: "Employment Contract.pdf", size: "412 KB", category: "employment", added: "2019-04-02" },
  { name: "NDA - 2024.pdf", size: "180 KB", category: "employment", added: "2024-01-11" },
  { name: "Q2 Performance Review.pdf", size: "240 KB", category: "performance", added: "2024-06-15" },
  { name: "June 2024 Payslip.pdf", size: "156 KB", category: "payslip", added: "2024-07-01" },
  { name: "AWS Solutions Architect Cert.pdf", size: "620 KB", category: "certificate", added: "2023-11-20" },
  { name: "Health Insurance Policy.pdf", size: "540 KB", category: "benefits", added: "2024-01-04" }
];
const performance = {
  rating: 4.6,
  goalsCompleted: 7,
  goalsTotal: 10,
  reviews: [
    { period: "Q2 2024", reviewer: "Jane Wu", rating: 4.6, strengths: "Ownership, Delivery", improve: "Delegation", status: "completed" },
    { period: "Q1 2024", reviewer: "Jane Wu", rating: 4.4, strengths: "Communication, Code quality", improve: "Cross-team", status: "completed" },
    { period: "Q4 2023", reviewer: "Jane Wu", rating: 4.5, strengths: "Innovation, Mentoring", improve: "Scope management", status: "completed" }
  ],
  goals: [
    { title: "Ship search v2 to production", progress: 65 },
    { title: "Mentor 2 junior engineers", progress: 80 },
    { title: "Reduce API p95 latency by 20%", progress: 45 },
    { title: "Complete AWS Pro certification", progress: 30 }
  ]
};
const trainings = [
  { title: "Advanced TypeScript Patterns", category: "Engineering", hours: 6, progress: 100, status: "completed" },
  { title: "Leading Distributed Teams", category: "Leadership", hours: 3, progress: 34, status: "in-progress" },
  { title: "System Design Interview Prep", category: "Engineering", hours: 8, progress: 60, status: "in-progress" },
  { title: "Data-Driven Decision Making", category: "Analytics", hours: 4, progress: 0, status: "not-started" },
  { title: "Effective Technical Writing", category: "Communication", hours: 2, progress: 0, status: "not-started" },
  { title: "Kubernetes Fundamentals", category: "Engineering", hours: 5, progress: 100, status: "completed" }
];
const announcements = [
  { title: "Company All-Hands \u2014 July 12", body: "Join us in the main hall or via Zoom at 10:00 PT.", tag: "Event", pinned: true, time: "1h ago", unread: true },
  { title: "New parental leave policy", body: "Effective Aug 1, all employees are entitled to 16 weeks of paid parental leave.", tag: "Policy", pinned: true, time: "1d ago", unread: true },
  { title: "Office closed on July 4", body: "Independence Day \u2014 offices closed. Remote work optional.", tag: "Holiday", pinned: false, time: "2d ago", unread: false },
  { title: "Q3 performance reviews", body: "Q3 performance review cycle opens Jul 10.", tag: "HR", pinned: false, time: "3d ago", unread: false },
  { title: "System maintenance", body: "Planned maintenance Jul 8, 2-4 AM UTC.", tag: "IT", pinned: false, time: "4d ago", unread: false }
];
const tickets = [
  { id: "TKT-1042", title: "MacBook charger replacement", priority: "medium", status: "open", updated: "2h ago", category: "IT" },
  { id: "TKT-1039", title: "VPN access for new project", priority: "high", status: "in-progress", updated: "1d ago", category: "IT" },
  { id: "TKT-1035", title: "Payslip discrepancy \u2014 May", priority: "high", status: "resolved", updated: "3d ago", category: "Payroll" },
  { id: "TKT-1029", title: "Standing desk request", priority: "low", status: "open", updated: "5d ago", category: "Facilities" }
];
const notifications = [
  { title: "Leave approved", body: "Your annual leave (Jul 15-17) was approved by Jane Wu.", time: "1h ago", type: "success" },
  { title: "New task assigned", body: "Deploy staging environment \xB7 due Jul 10", time: "3h ago", type: "info" },
  { title: "Payslip available", body: "June 2024 payslip is ready to download.", time: "1d ago", type: "info" },
  { title: "Review reminder", body: "Complete your Q2 self-review by Jul 8.", time: "2d ago", type: "warning" }
];
const skills = [
  { name: "TypeScript", level: 92 },
  { name: "React", level: 88 },
  { name: "System Design", level: 80 },
  { name: "AWS", level: 76 },
  { name: "Node.js", level: 84 },
  { name: "PostgreSQL", level: 72 }
];
export {
  announcements,
  attendanceHistory,
  attendanceMonthly,
  currentUser,
  dashboardStats,
  documents,
  kanbanTasks,
  leaveBalances,
  leaveHistory,
  leaveUsage,
  notifications,
  payslips,
  performance,
  recentTasks,
  salaryTrend,
  skills,
  tickets,
  trainings
};
