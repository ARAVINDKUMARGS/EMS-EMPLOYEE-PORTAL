import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  CartesianGrid
} from "recharts";
import {
  Clock,
  CalendarDays,
  ChevronRight,
  UserRound,
  LogOut as LogOutIcon,
} from "lucide-react";
import { StatCard } from "@/components/common/StatCard";
import { StatusPill } from "@/components/common/StatusPill";
import { Button } from "@/components/ui/button";
import { getUser } from "@/lib/auth";
import { checkIn, checkOut, getToday, getSummary } from "@/employee/components/Attendance/services/attendanceService";
import { getMyLeaves } from "@/employee/services/leaveService";
import { LEAVE_POLICY, leaveTypes, daysBetween } from "@/employee/lib/leavePolicy";

const quickActions = [
  { label: "Apply for Leave", to: "/leave", icon: CalendarDays },
  { label: "View Attendance", to: "/attendance", icon: Clock },
  { label: "Update Profile", to: "/profile", icon: UserRound },
];

function Dashboard() {
  const user = getUser();
  const employeeId = user?.employee_id;

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const [attendanceToday, setAttendanceToday] = useState(null);
  const [summary, setSummary] = useState({ monthly: [], thisMonthPercent: 0 });
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  async function loadAll() {
    if (!employeeId) return;
    setLoading(true);
    try {
      const [todayRes, summaryRes, leavesRes] = await Promise.all([
        getToday(employeeId),
        getSummary(employeeId),
        getMyLeaves(employeeId),
      ]);
      setAttendanceToday(todayRes.data);
      setSummary(summaryRes.data);
      setLeaves(leavesRes.data);
    } catch (err) {
      console.error(err);
      toast.error("Could not load dashboard data");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAll();
  }, []);

  const isCheckedIn = !!attendanceToday?.check_in && !attendanceToday?.check_out;
  const dayCompleted = !!(attendanceToday?.check_in && attendanceToday?.check_out);

  async function handlePunch() {
    if (isProcessing || dayCompleted) return;
    setIsProcessing(true);
    try {
      if (!attendanceToday?.check_in) {
        await checkIn(employeeId);
        toast.success("Checked in");
      } else if (!attendanceToday?.check_out) {
        await checkOut(employeeId);
        toast.success("Checked out");
      }
      loadAll();
    } catch (err) {
      toast.error(err.response?.data?.message || "Action failed");
    } finally {
      setIsProcessing(false);
    }
  }

  // Leave balance: total remaining days across all types, from Approved requests this year
  const currentYear = new Date().getFullYear();
  const usedByType = {};
  leaveTypes.forEach((t) => (usedByType[t] = 0));
  leaves.forEach((l) => {
    if (l.status === "Approved" && new Date(l.start_date).getFullYear() === currentYear) {
      usedByType[l.leave_type] = (usedByType[l.leave_type] || 0) + daysBetween(l.start_date, l.end_date);
    }
  });
  const totalAllowance = leaveTypes.reduce((sum, t) => sum + LEAVE_POLICY[t].allowance, 0);
  const totalUsed = leaveTypes.reduce((sum, t) => sum + (usedByType[t] || 0), 0);
  const leaveBalance = totalAllowance - totalUsed;

  const pendingLeaveCount = leaves.filter((l) => l.status === "Pending").length;

  const recentLeaves = [...leaves]
    .sort((a, b) => new Date(b.applied_at) - new Date(a.applied_at))
    .slice(0, 4);

  return (
    <div className="space-y-6">
      {/* Welcome banner */}
      <div className="relative overflow-hidden rounded-2xl border border-border bg-gradient-banner p-6 sm:p-8">
        <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-primary/20 blur-3xl" />
        <div className="relative">
          <div className="text-sm text-primary/90">{today}</div>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight">
            Good day, {user?.name?.split(" ")[0] || "there"} <span className="inline-block">👋</span>
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {dayCompleted
              ? "You've completed your attendance for today."
              : isCheckedIn
              ? `Checked in at ${new Date(attendanceToday.check_in).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`
              : "You haven't checked in yet today."}
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <Button
              onClick={handlePunch}
              disabled={isProcessing || dayCompleted}
              variant={isCheckedIn ? "destructive" : "default"}
            >
              {isCheckedIn ? <LogOutIcon className="h-4 w-4" /> : <Clock className="h-4 w-4" />}
              {dayCompleted ? "Completed for Today" : isProcessing ? "..." : isCheckedIn ? "Check Out" : "Check In"}
            </Button>
            <Link
              to="/leave"
              className="inline-flex items-center gap-2 rounded-lg border border-border bg-surface px-4 py-2 text-sm font-medium hover:bg-surface-elevated"
            >
              <CalendarDays className="h-4 w-4" /> My Leave
            </Link>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Link to="/attendance" className="block transition hover:scale-[1.01]">
          <StatCard
            label="Attendance This Month"
            value={loading ? "…" : `${summary.thisMonthPercent}%`}
            icon={<Clock size={16} />}
          />
        </Link>
        <Link to="/leave" className="block transition hover:scale-[1.01]">
          <StatCard
            label="Leave Balance"
            value={loading ? "…" : `${leaveBalance}d`}
            sub={`of ${totalAllowance}d`}
            icon={<CalendarDays size={16} />}
          />
        </Link>
        <Link to="/leave" className="block transition hover:scale-[1.01]">
          <StatCard
            label="Pending Leave Requests"
            value={loading ? "…" : pendingLeaveCount}
            icon={<CalendarDays size={16} />}
            tone={pendingLeaveCount > 0 ? "warning" : undefined}
          />
        </Link>
      </div>

      {/* Chart + quick actions */}
      <div className="grid gap-4 xl:grid-cols-3">
        <div className="xl:col-span-2 rounded-2xl border border-border bg-card p-5">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold">Attendance — last 6 months</h2>
            <span className="text-xs text-muted-foreground">Days present</span>
          </div>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={summary.monthly} barSize={28}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="month" tick={{ fill: "var(--muted-foreground)", fontSize: 12 }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fill: "var(--muted-foreground)", fontSize: 12 }} tickLine={false} axisLine={false} allowDecimals={false} />
                <Tooltip
                  cursor={{ fill: "var(--accent)", opacity: 0.4 }}
                  contentStyle={{
                    background: "var(--popover)",
                    border: "1px solid var(--border)",
                    borderRadius: 8,
                    color: "var(--foreground)",
                  }}
                />
                <Bar dataKey="days" fill="var(--chart-1)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5">
          <h2 className="text-sm font-semibold">Quick Actions</h2>
          <div className="mt-4 space-y-1">
            {quickActions.map((a) => (
              <Link
                key={a.label}
                to={a.to}
                className="flex items-center justify-between rounded-lg px-3 py-2.5 text-sm hover:bg-accent"
              >
                <span className="flex items-center gap-3">
                  <a.icon className="h-4 w-4 text-primary" />
                  {a.label}
                </span>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Recent leave requests */}
      <div className="rounded-2xl border border-border bg-card p-5">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold">Recent Leave Requests</h2>
          <Link to="/leave" className="text-xs text-primary hover:underline">View all</Link>
        </div>
        <div className="mt-4 divide-y divide-border">
          {loading ? (
            <p className="py-3 text-sm text-muted-foreground">Loading...</p>
          ) : recentLeaves.length === 0 ? (
            <p className="py-3 text-sm text-muted-foreground">No leave requests yet.</p>
          ) : (
            recentLeaves.map((l) => (
              <div key={l.id} className="flex items-center justify-between gap-3 py-3">
                <div className="flex min-w-0 items-center gap-3">
                  <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: LEAVE_POLICY[l.leave_type]?.color || "#94A3B8" }} />
                  <span className="truncate text-sm">
                    {l.leave_type} · {new Date(l.start_date).toLocaleDateString()}
                    {l.start_date !== l.end_date && ` – ${new Date(l.end_date).toLocaleDateString()}`}
                  </span>
                </div>
                <StatusPill status={l.status.toLowerCase()} />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;