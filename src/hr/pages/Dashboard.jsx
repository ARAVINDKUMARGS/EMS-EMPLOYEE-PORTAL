import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Users, Clock, Building2, CalendarClock, Check, X } from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { StatCard } from "@/components/common/StatCard";
import {
  getSummary,
  getAttendanceByDepartment,
  getHeadcountByDepartment,
  getPendingLeaves,
} from "../services/overviewService";
import { reviewLeave } from "@/employee/services/leaveService";

const PIE_COLORS = ["#3B82F6", "#22D3EE", "#A78BFA", "#34D399", "#F59E0B", "#F472B6", "#F87171"];

function initials(name) {
  if (!name) return "?";
  return name.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase();
}

function daysBetween(start, end) {
  const ms = new Date(end) - new Date(start);
  return Math.round(ms / (1000 * 60 * 60 * 24)) + 1;
}

export default function HRDashboard() {
  const [summary, setSummary] = useState(null);
  const [attendanceData, setAttendanceData] = useState([]);
  const [headcountData, setHeadcountData] = useState([]);
  const [pendingLeaves, setPendingLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);

  async function loadAll() {
    setLoading(true);
    try {
      const [s, a, h, p] = await Promise.all([
        getSummary(),
        getAttendanceByDepartment(),
        getHeadcountByDepartment(),
        getPendingLeaves(),
      ]);
      setSummary(s.data);
      setAttendanceData(a.data.map((d) => ({ ...d, attendance: d.attendance ?? 0 })));
      setHeadcountData(h.data);
      setPendingLeaves(p.data);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Could not load overview data");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAll();
  }, []);

  async function handleReview(id, decision) {
    setProcessingId(id);
    try {
      await reviewLeave(id, decision);
      toast.success(`Leave ${decision.toLowerCase()}`);
      loadAll();
    } catch (err) {
      toast.error(err.response?.data?.message || "Action failed");
    } finally {
      setProcessingId(null);
    }
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">HR Overview</h1>
        <p className="text-sm text-muted-foreground mt-1">Company-wide workforce summary</p>
      </div>

      <div className="grid grid-cols-1 gap-4 mb-8 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total Employees"
          value={loading ? "…" : summary?.totalEmployees ?? 0}
          sub={loading ? "" : `+${summary?.newThisMonth ?? 0} this month`}
          icon={<Users size={16} />}
        />
        <StatCard
          label="Avg Attendance Today"
          value={loading ? "…" : `${summary?.avgAttendanceToday ?? 0}%`}
          sub="Across all depts"
          icon={<Clock size={16} />}
        />
        <StatCard
          label="Departments"
          value={loading ? "…" : summary?.totalDepartments ?? 0}
          icon={<Building2 size={16} />}
        />
        <StatCard
          label="Pending Leaves"
          value={loading ? "…" : summary?.pendingLeaves ?? 0}
          sub="Awaiting approval"
          icon={<CalendarClock size={16} />}
          tone="warning"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 mb-8 xl:grid-cols-3">

        <div className="col-span-2 rounded-2xl border border-border bg-card p-6">
          <h2 className="font-semibold mb-4">Attendance by Department — Today</h2>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={attendanceData}>
              <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" />
              <XAxis dataKey="department" stroke="var(--muted-foreground)" fontSize={12} />
              <YAxis stroke="var(--muted-foreground)" fontSize={12} domain={[0, 100]} unit="%" />
              <Tooltip />
              <Bar dataKey="attendance" fill="var(--primary)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6">
          <h2 className="font-semibold mb-4">Headcount by Department</h2>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={headcountData}
                dataKey="count"
                nameKey="department"
                innerRadius={55}
                outerRadius={90}
                paddingAngle={3}
              >
                {headcountData.map((_, i) => (
                  <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-1.5 mt-2">
            {headcountData.map((d, i) => (
              <div key={d.department} className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2 text-muted-foreground">
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ background: PIE_COLORS[i % PIE_COLORS.length] }}
                  />
                  {d.department}
                </span>
                <span className="font-medium">{d.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        <div className="p-5 border-b border-border">
          <h2 className="font-semibold">Pending Leave Requests</h2>
        </div>

        {loading ? (
          <p className="p-5 text-sm text-muted-foreground">Loading...</p>
        ) : pendingLeaves.length === 0 ? (
          <p className="p-5 text-sm text-muted-foreground">No pending leave requests.</p>
        ) : (
          <div className="divide-y divide-border">
            {pendingLeaves.map((l) => (
              <div key={l.id} className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-full bg-primary/15 text-primary flex items-center justify-center text-xs font-semibold">
                    {initials(l.employee_name)}
                  </div>
                  <div>
                    <p className="font-medium text-sm">{l.employee_name || "Unknown"}</p>
                    <p className="text-xs text-muted-foreground">
                      {l.leave_type} · {new Date(l.start_date).toLocaleDateString()}
                      {l.start_date !== l.end_date && ` – ${new Date(l.end_date).toLocaleDateString()}`}
                      {" "}({daysBetween(l.start_date, l.end_date)}d)
                      {l.reason ? ` · ${l.reason}` : ""}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    disabled={processingId === l.id}
                    onClick={() => handleReview(l.id, "Approved")}
                    className="h-8 w-8 rounded-lg bg-success/15 text-success border border-success/25 flex items-center justify-center hover:opacity-80 disabled:opacity-50"
                  >
                    <Check size={16} />
                  </button>
                  <button
                    disabled={processingId === l.id}
                    onClick={() => handleReview(l.id, "Rejected")}
                    className="h-8 w-8 rounded-lg bg-destructive/15 text-destructive border border-destructive/25 flex items-center justify-center hover:opacity-80 disabled:opacity-50"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}