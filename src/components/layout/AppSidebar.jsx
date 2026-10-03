import { Link, useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";
import {
  LayoutDashboard,
  User,
  Clock,
  CalendarDays,
  Wallet,
  CheckSquare,
  LineChart,
  MessagesSquare,
  Bell,
  GraduationCap,
  FileText,
  Settings as SettingsIcon,
  LogOut,
  Layers,
  HelpCircle,
  ShieldCheck,
  Users,
  Building2,
  Activity,
  Settings2,
  Briefcase,
  UserPlus,
  Megaphone
} from "lucide-react";
import { useRole, useUser, roleLabels, logout } from "@/lib/auth";
const employeeNav = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/profile", label: "Profile", icon: User },
  { to: "/attendance", label: "Attendance", icon: Clock },
  { to: "/leave", label: "Leave", icon: CalendarDays },
  { to: "/payroll", label: "Payroll", icon: Wallet },
  { to: "/tasks", label: "Tasks", icon: CheckSquare },
  { to: "/performance", label: "Performance", icon: LineChart },
  { to: "/chat", label: "Chat", icon: MessagesSquare },
  { to: "/notifications", label: "Notifications", icon: Bell },
  { to: "/training", label: "Training", icon: GraduationCap },
  { to: "/documents", label: "Documents", icon: FileText },
  { to: "/settings", label: "Settings", icon: SettingsIcon }
];
const adminNav = [
  { to: "/admin", label: "Overview", icon: ShieldCheck, exact: true },
  { to: "/admin/employees", label: "Employees", icon: Users },
  { to: "/admin/departments", label: "Departments", icon: Building2 },
  { to: "/admin/roles", label: "Roles & access", icon: ShieldCheck },
  { to: "/admin/payroll", label: "Payroll runs", icon: Wallet },
  { to: "/admin/audit", label: "Audit log", icon: Activity },
  { to: "/admin/settings", label: "Organization", icon: Settings2 }
];
const hrNav = [
  { to: "/hr", label: "Overview", icon: LayoutDashboard, exact: true },
  { to: "/hr/employees", label: "Employees", icon: Users },
  { to: "/hr/recruitment", label: "Recruitment", icon: Briefcase },
  { to: "/hr/onboarding", label: "Onboarding", icon: UserPlus },
  { to: "/hr/leave", label: "Leave approvals", icon: CalendarDays },
  { to: "/hr/attendance", label: "Attendance", icon: Clock },
  { to: "/hr/reviews", label: "Performance", icon: LineChart },
  { to: "/hr/announcements", label: "Announcements", icon: Megaphone }
];
function AppSidebar() {
  const pathname = useLocation().pathname;
  const navigate = useNavigate();
  const role = useRole();
  const user = useUser();
  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
    : "?";
  const showAdmin = role === "admin";
  const showHr = role === "hr" || role === "admin";
  const handleLogout = () => {
    logout();
    toast.success("Signed out");
    navigate("/", { replace: true  });
  };
  return <aside className="hidden lg:flex w-60 shrink-0 flex-col bg-sidebar border-r border-sidebar-border">
      <div className="flex items-center gap-2.5 px-5 h-16 border-b border-sidebar-border">
        <div className="grid h-9 w-9 place-items-center rounded-lg bg-gradient-primary shadow-glow">
          <Layers className="h-5 w-5 text-primary-foreground" />
        </div>
        <div className="font-semibold text-sidebar-foreground">Nexus HR</div>
      </div>

      <nav className="flex-1 overflow-y-auto scrollbar-hide px-3 pb-4 space-y-0.5">
        <div className="px-2 pt-5 pb-2 text-[10px] font-semibold tracking-[0.14em] text-muted-foreground uppercase">
          Employee Portal
        </div>
        {employeeNav.map((item) => {
    const active = pathname === item.to || item.to !== "/dashboard" && !pathname.startsWith("/admin") && !pathname.startsWith("/hr") && pathname.startsWith(item.to);
    const Icon = item.icon;
    return <Link
      key={item.to}
      to={item.to}
      className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${active ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium shadow-sm" : "text-sidebar-foreground/75 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"}`}
    >
              <Icon className={`h-4 w-4 ${active ? "text-primary" : ""}`} />
              <span>{item.label}</span>
            </Link>;
  })}

        {showHr && <>
            <div className="px-2 pt-6 pb-2 text-[10px] font-semibold tracking-[0.14em] text-muted-foreground uppercase flex items-center gap-1.5">
              <Users className="h-3 w-3" /> HR Portal
            </div>
            {hrNav.map((item) => {
    const active = item.exact ? pathname === item.to : pathname === item.to || pathname.startsWith(item.to + "/");
    const Icon = item.icon;
    return <Link
      key={item.to}
      to={item.to}
      className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${active ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium shadow-sm" : "text-sidebar-foreground/75 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"}`}
    >
                  <Icon className={`h-4 w-4 ${active ? "text-primary" : ""}`} />
                  <span>{item.label}</span>
                </Link>;
  })}
          </>}

        {showAdmin && <>
            <div className="px-2 pt-6 pb-2 text-[10px] font-semibold tracking-[0.14em] text-muted-foreground uppercase flex items-center gap-1.5">
              <ShieldCheck className="h-3 w-3" /> Admin Portal
            </div>
            {adminNav.map((item) => {
    const active = item.exact ? pathname === item.to : pathname === item.to || pathname.startsWith(item.to + "/");
    const Icon = item.icon;
    return <Link
      key={item.to}
      to={item.to}
      className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${active ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium shadow-sm" : "text-sidebar-foreground/75 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"}`}
    >
                  <Icon className={`h-4 w-4 ${active ? "text-primary" : ""}`} />
                  <span>{item.label}</span>
                </Link>;
  })}
          </>}
      </nav>

      <div className="border-t border-sidebar-border p-3">
        <div className="flex items-center gap-3 rounded-lg px-2 py-2">
          <div className="grid h-9 w-9 place-items-center rounded-full bg-gradient-primary text-xs font-semibold text-primary-foreground shrink-0">
            {initials}
          </div>
          <div className="min-w-0 flex-1">
            <div className="truncate text-sm font-medium text-sidebar-foreground">
              {user?.name || "Guest"}
            </div>
            <div className="truncate text-xs text-muted-foreground">{roleLabels[role]}</div>
          </div>
          <button
    onClick={handleLogout}
    className="text-muted-foreground hover:text-sidebar-foreground"
    aria-label="Sign out"
    title="Sign out"
  >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
        <div className="mt-2 flex items-center justify-end px-2">
          <Link to="/helpdesk" aria-label="Help" title="Help">
            <HelpCircle className="h-4 w-4 text-muted-foreground/70 hover:text-sidebar-foreground" />
          </Link>
        </div>
      </div>
    </aside>;
}
export {
  AppSidebar
};
