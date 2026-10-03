import { useEffect, useState } from "react";
import { Users, UserCheck, UserX, Clock, Search, Download } from "lucide-react";
import { toast } from "sonner";
import { StatusPill } from "@/components/common/StatusPill";
import { StatCard } from "@/components/common/StatCard";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  DataTable,
  DataTableHead,
  DataTableBody,
  DataTableRow,
  DataTableHeadCell,
  DataTableCell,
} from "@/components/ui/data-table";
import { getUser } from "@/lib/auth";
import { getPendingApprovals, getAllEmployees, reviewSignup } from "@/lib/authService";

const AVATAR_COLORS = ["#3B82F6", "#A855F7", "#10B981", "#F59E0B", "#EF4444", "#EC4899", "#06B6D4"];

function initials(name) {
  if (!name) return "?";
  return name.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase();
}

function avatarColor(id) {
  const idx = String(id).split("").reduce((sum, c) => sum + c.charCodeAt(0), 0);
  return AVATAR_COLORS[idx % AVATAR_COLORS.length];
}

function formatSalary(value) {
  if (value === null || value === undefined) return "—";
  return `$${Math.round(Number(value) / 1000)}k`;
}

function Employees() {
  const currentUser = getUser();
  const [pending, setPending] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);
  const [search, setSearch] = useState("");

  async function loadData() {
    setLoading(true);
    try {
      const [pendingRes, employeesRes] = await Promise.all([
        getPendingApprovals(),
        getAllEmployees(),
      ]);
      setPending(pendingRes.data);
      setEmployees(employeesRes.data);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Could not load employees");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  async function handleReview(id, decision) {
    setProcessingId(id);
    try {
      const res = await reviewSignup(id, decision);
      toast.success(res.data.message);
      loadData();
    } catch (err) {
      toast.error(err.response?.data?.message || "Action failed");
    } finally {
      setProcessingId(null);
    }
  }

  const activeCount = employees.filter((e) => e.approval_status === "Approved").length;
  const rejectedCount = employees.filter((e) => e.approval_status === "Rejected").length;

  const filteredEmployees = employees.filter((e) => {
    const q = search.trim().toLowerCase();
    if (!q) return true;
    return (
      e.name?.toLowerCase().includes(q) ||
      e.email?.toLowerCase().includes(q) ||
      e.employee_id?.toLowerCase().includes(q)
    );
  });

  function handleExport() {
    const headers = ["Name", "Employee ID", "Email", "Role", "Department", "Status", "Salary"];
    const rows = filteredEmployees.map((e) => [
      e.name, e.employee_id, e.email, e.role, e.department || "", e.approval_status, e.salary ?? "",
    ]);
    const csv = [headers, ...rows].map((r) => r.map((v) => `"${v}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "employees.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Employees</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manage employee accounts and review new signups
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 mb-8 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Accounts" value={employees.length} icon={<Users size={16} />} />
        <StatCard label="Pending Approval" value={pending.length} icon={<Clock size={16} />} tone="warning" />
        <StatCard label="Active" value={activeCount} icon={<UserCheck size={16} />} tone="success" />
        <StatCard label="Rejected" value={rejectedCount} icon={<UserX size={16} />} tone="danger" />
      </div>

      {/* Pending approvals */}
      <h2 className="text-lg font-semibold mb-4">Pending Signups</h2>

      {loading ? (
        <p className="text-sm text-muted-foreground mb-8">Loading...</p>
      ) : pending.length === 0 ? (
        <div className="rounded-xl border border-border bg-card p-6 text-center text-sm text-muted-foreground mb-8">
          No signups waiting for review.
        </div>
      ) : (
        <div className="space-y-3 mb-8">
          {pending.map((p) => (
            <div
              key={p.id}
              className="flex items-center justify-between rounded-xl border border-border bg-card p-4"
            >
              <div>
                <h3 className="font-medium">{p.name}</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {p.email} • {p.employee_id} • <span className="capitalize">{p.role}</span>
                </p>
              </div>
              <div className="flex items-center gap-3">
                <StatusPill status="pending" />
                {currentUser?.role !== "admin" && p.role === "hr" ? (
                  <span className="text-xs text-muted-foreground">Only Admin can review HR signups</span>
                ) : (
                  <>
                    <Button
                      size="sm"
                      variant="secondary"
                      className="bg-success/15 text-success hover:bg-success/25"
                      disabled={processingId === p.id}
                      onClick={() => handleReview(p.id, "Approved")}
                    >
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      disabled={processingId === p.id}
                      onClick={() => handleReview(p.id, "Rejected")}
                    >
                      Reject
                    </Button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Full directory */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">All Employees</h2>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search employees..."
              className="rounded-lg bg-input border border-border pl-8 pr-3 py-2 text-sm w-56 focus:outline-none focus:ring-2 focus:ring-ring/60"
            />
          </div>
          <Button variant="outline" onClick={handleExport}>
            <Download size={14} /> Export
          </Button>
        </div>
      </div>

      <Card className="overflow-hidden p-0">
        <DataTable className="border-0">
          <DataTableHead>
            <DataTableRow>
              <DataTableHeadCell>Employee</DataTableHeadCell>
              <DataTableHeadCell>ID</DataTableHeadCell>
              <DataTableHeadCell>Role</DataTableHeadCell>
              <DataTableHeadCell>Department</DataTableHeadCell>
              <DataTableHeadCell>Status</DataTableHeadCell>
              <DataTableHeadCell>Salary</DataTableHeadCell>
            </DataTableRow>
          </DataTableHead>
          <DataTableBody>
            {filteredEmployees.map((e) => (
              <DataTableRow key={e.id}>
                <DataTableCell>
                  <div className="flex items-center gap-3">
                    <div
                      className="h-8 w-8 rounded-full flex items-center justify-center text-xs font-semibold text-white shrink-0"
                      style={{ backgroundColor: avatarColor(e.employee_id) }}
                    >
                      {initials(e.name)}
                    </div>
                    <div>
                      <p className="font-medium">{e.name}</p>
                      <p className="text-xs text-muted-foreground">{e.email}</p>
                    </div>
                  </div>
                </DataTableCell>
                <DataTableCell className="text-muted-foreground">{e.employee_id}</DataTableCell>
                <DataTableCell className="capitalize">{e.role}</DataTableCell>
                <DataTableCell className="text-muted-foreground">{e.department || "—"}</DataTableCell>
                <DataTableCell>
                  <StatusPill
                    status={
                      e.approval_status === "Approved"
                        ? (e.on_leave_today ? "on leave" : "active")
                        : e.approval_status.toLowerCase()
                    }
                  />
                </DataTableCell>
                <DataTableCell className="text-muted-foreground">{formatSalary(e.salary)}</DataTableCell>
              </DataTableRow>
            ))}
          </DataTableBody>
        </DataTable>
      </Card>
    </div>
  );
}

export default Employees;