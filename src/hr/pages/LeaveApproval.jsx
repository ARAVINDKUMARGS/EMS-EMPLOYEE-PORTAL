import { useState, useEffect, useMemo } from "react";
import { toast } from "sonner";
import { CalendarCheck, Clock, CheckCircle2, XCircle } from "lucide-react";
import { StatCard } from "@/components/common/StatCard";
import { StatusPill } from "@/components/common/StatusPill";
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
import { getAllLeaves, reviewLeave } from "@/employee/services/leaveService";

function daysBetween(start, end) {
  const ms = new Date(end) - new Date(start);
  return Math.round(ms / (1000 * 60 * 60 * 24)) + 1;
}

function isThisMonth(dateStr) {
  if (!dateStr) return false;
  const d = new Date(dateStr);
  const now = new Date();
  return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
}

export default function LeaveApproval() {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);

  async function loadLeaves() {
    setLoading(true);
    try {
      const res = await getAllLeaves();
      setLeaves(res.data);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Could not load leave requests");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadLeaves();
  }, []);

  async function handleReview(id, decision) {
    setProcessingId(id);
    try {
      const res = await reviewLeave(id, decision);
      toast.success(res.data.message);
      loadLeaves();
    } catch (err) {
      toast.error(err.response?.data?.message || "Action failed");
    } finally {
      setProcessingId(null);
    }
  }

  const pending = useMemo(() => leaves.filter((l) => l.status === "Pending"), [leaves]);

  const approvedThisMonth = useMemo(
    () => leaves.filter((l) => l.status === "Approved" && isThisMonth(l.reviewed_at)).length,
    [leaves]
  );

  const rejectedCount = useMemo(() => leaves.filter((l) => l.status === "Rejected").length, [leaves]);

  const recentlyProcessed = useMemo(
    () =>
      leaves
        .filter((l) => l.status !== "Pending" && l.reviewed_at)
        .sort((a, b) => new Date(b.reviewed_at) - new Date(a.reviewed_at))
        .slice(0, 8),
    [leaves]
  );

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Leave Approval</h1>
        <p className="text-sm text-muted-foreground mt-1">Review and action pending leave requests</p>
      </div>

      <div className="grid grid-cols-1 gap-4 mb-8 sm:grid-cols-3">
        <StatCard label="Pending" value={pending.length} icon={<Clock size={16} />} tone="warning" />
        <StatCard label="Approved This Month" value={approvedThisMonth} icon={<CheckCircle2 size={16} />} tone="success" />
        <StatCard label="Rejected" value={rejectedCount} icon={<XCircle size={16} />} tone="danger" />
      </div>

      <h2 className="text-lg font-semibold mb-4">Pending Requests ({pending.length})</h2>

      {loading ? (
        <p className="text-sm text-muted-foreground mb-8">Loading...</p>
      ) : pending.length === 0 ? (
        <div className="rounded-xl border border-border bg-card p-6 text-center text-sm text-muted-foreground mb-8">
          <CalendarCheck className="mx-auto mb-2 h-6 w-6 text-muted-foreground" />
          No pending leave requests.
        </div>
      ) : (
        <div className="space-y-3 mb-8">
          {pending.map((l) => (
            <div key={l.id} className="flex items-center justify-between rounded-xl border border-border bg-card p-4">
              <div>
                <h3 className="font-medium">
                  {l.employee_name || l.employee_id}{" "}
                  <span className="ml-1 rounded-md bg-primary/15 text-primary px-2 py-0.5 text-xs font-medium align-middle">
                    {l.leave_type}
                  </span>
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {new Date(l.start_date).toLocaleDateString()}
                  {l.start_date !== l.end_date && ` – ${new Date(l.end_date).toLocaleDateString()}`}
                  {" "}· {daysBetween(l.start_date, l.end_date)} day{daysBetween(l.start_date, l.end_date) > 1 ? "s" : ""}
                  {l.reason ? ` · ${l.reason}` : ""}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Button
                  size="sm"
                  variant="secondary"
                  className="bg-success/15 text-success hover:bg-success/25"
                  disabled={processingId === l.id}
                  onClick={() => handleReview(l.id, "Approved")}
                >
                  Approve
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  disabled={processingId === l.id}
                  onClick={() => handleReview(l.id, "Rejected")}
                >
                  Reject
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Card className="overflow-hidden p-0">
        <div className="p-5 border-b border-border">
          <h2 className="font-semibold">Recently Processed</h2>
        </div>

        {recentlyProcessed.length === 0 ? (
          <p className="p-5 text-sm text-muted-foreground">Nothing processed yet.</p>
        ) : (
          <DataTable className="border-0">
            <DataTableHead>
              <DataTableRow>
                <DataTableHeadCell>Employee</DataTableHeadCell>
                <DataTableHeadCell>Type</DataTableHeadCell>
                <DataTableHeadCell>Dates</DataTableHeadCell>
                <DataTableHeadCell>Days</DataTableHeadCell>
                <DataTableHeadCell>Action</DataTableHeadCell>
                <DataTableHeadCell>Status</DataTableHeadCell>
              </DataTableRow>
            </DataTableHead>
            <DataTableBody>
              {recentlyProcessed.map((l) => (
                <DataTableRow key={l.id}>
                  <DataTableCell>{l.employee_name || l.employee_id}</DataTableCell>
                  <DataTableCell className="text-muted-foreground">{l.leave_type}</DataTableCell>
                  <DataTableCell className="text-muted-foreground">
                    {new Date(l.start_date).toLocaleDateString()}
                    {l.start_date !== l.end_date && ` – ${new Date(l.end_date).toLocaleDateString()}`}
                  </DataTableCell>
                  <DataTableCell>{daysBetween(l.start_date, l.end_date)}</DataTableCell>
                  <DataTableCell className="text-muted-foreground">{l.reviewed_by || "—"}</DataTableCell>
                  <DataTableCell>
                    <StatusPill status={l.status.toLowerCase()} />
                  </DataTableCell>
                </DataTableRow>
              ))}
            </DataTableBody>
          </DataTable>
        )}
      </Card>
    </div>
  );
}