import {
  LayoutDashboard,
  Users,
  CalendarCheck,
  Briefcase,
  Building2,
  TrendingUp
} from "lucide-react";
import { PortalSidebar } from "@/components/common/PortalSidebar";

const navItems = [
  { label: "Overview", to: "/hr", icon: LayoutDashboard, end: true },
  { label: "Employees", to: "/hr/employees", icon: Users },
  { label: "Leave Approval", to: "/hr/leave-approval", icon: CalendarCheck },
  { label: "Recruitment", to: "/hr/recruitment", icon: Briefcase },
  { label: "Departments", to: "/hr/departments", icon: Building2 },
  { label: "Performance", to: "/hr/performance", icon: TrendingUp }
];

function HRSidebar() {
  return <PortalSidebar navItems={navItems} portalLabel="HR Portal" avatarTone="primary" />;
}

export default HRSidebar;