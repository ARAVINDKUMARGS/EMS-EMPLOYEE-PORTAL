import {
  BarChart3,
  Users,
  UserCheck,
  DollarSign,
  FileText,
  Settings,
  ShieldAlert
} from "lucide-react";
import { PortalSidebar } from "@/components/common/PortalSidebar";

const navItems = [
  { label: "Analytics", to: "/admin/analytics", icon: BarChart3 },
  { label: "User Management", to: "/admin/users", icon: Users },
  { label: "Employee Approvals", to: "/admin/employee-approvals", icon: UserCheck },
  { label: "Payroll", to: "/admin/payroll", icon: DollarSign },
  { label: "Reports", to: "/admin/reports", icon: FileText },
  { label: "System Settings", to: "/admin/settings", icon: Settings },
  { label: "Audit Logs", to: "/admin/audit-logs", icon: ShieldAlert }
];

function AdminSidebar() {
  return <PortalSidebar navItems={navItems} portalLabel="Admin Portal" avatarTone="warning" />;
}

export default AdminSidebar;