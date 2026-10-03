export const users = [
  { id: 1, name: "Alex Chen", initials: "AC", color: "bg-blue-500", role: "Employee", dept: "Engineering", lastLogin: "Today 09:04", mfa: true, status: "Active" },
  { id: 2, name: "Sarah Mitchell", initials: "SM", color: "bg-purple-500", role: "HR Manager", dept: "HR", lastLogin: "Today 08:45", mfa: true, status: "Active" },
  { id: 3, name: "James Rodriguez", initials: "JR", color: "bg-orange-500", role: "Admin", dept: "IT", lastLogin: "Today 08:12", mfa: true, status: "Active" },
  { id: 4, name: "Maria Santos", initials: "MS", color: "bg-violet-500", role: "Employee", dept: "Design", lastLogin: "Yesterday", mfa: false, status: "Active" },
  { id: 5, name: "Tom Walker", initials: "TW", color: "bg-red-500", role: "Employee", dept: "Sales", lastLogin: "2 days ago", mfa: false, status: "Inactive" },
];

export const rolePermissions = [
  { role: "Employee", tone: "bg-blue-500/15 text-blue-400", permissions: ["View Profile", "Check-in/out", "Apply Leave", "View Payslip", "Use Chat"] },
  { role: "HR Manager", tone: "bg-purple-500/15 text-purple-400", permissions: ["Manage Employees", "Approve Leave", "Manage Recruitment", "View Reports", "Manage Departments"] },
  { role: "Admin", tone: "bg-red-500/15 text-red-400", permissions: ["Full System Access", "Manage Roles", "System Settings", "Audit Logs", "Payroll Processing"] },
];