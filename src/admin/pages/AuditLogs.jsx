import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Search, Download } from "lucide-react";
import { getAuditLogs } from "../services/adminService";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select, SelectTrigger, SelectContent, SelectItem } from "@/components/ui/select";
import {
  DataTable,
  DataTableHead,
  DataTableBody,
  DataTableRow,
  DataTableHeadCell,
  DataTableCell,
} from "@/components/ui/data-table";

const severityStyles = {
  Info: "bg-primary/15 text-primary",
  Warning: "bg-warning/15 text-warning",
  Critical: "bg-destructive/15 text-destructive",
};

function AuditLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [severity, setSeverity] = useState("All");

  useEffect(() => {
    getAuditLogs()
      .then((res) => setLogs(res.data))
      .catch((err) => {
        console.error("Fetch audit logs error:", err);
        toast.error("Failed to load audit logs");
      })
      .finally(() => setLoading(false));
  }, []);

  const filteredLogs = logs.filter((log) => {
    const matchSearch =
      (log.user || "").toLowerCase().includes(search.toLowerCase()) ||
      (log.action || "").toLowerCase().includes(search.toLowerCase()) ||
      (log.target || "").toLowerCase().includes(search.toLowerCase());
    const matchSeverity = severity === "All" || log.severity === severity;
    return matchSearch && matchSeverity;
  });

  const exportCSV = () => {
    const headers = ["User", "Action", "Target", "Severity", "Timestamp"];
    const rows = filteredLogs.map((log) => [log.user, log.action, log.target, log.severity, log.time]);
    const csv = [headers.join(","), ...rows.map((row) => row.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "audit_logs.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Audit logs exported successfully!");
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Audit Logs</h1>
          <p className="text-sm text-muted-foreground mt-1">Monitor all administrative activities</p>
        </div>
        <Button onClick={exportCSV}>
          <Download size={16} /> Export Logs
        </Button>
      </div>

      <div className="flex gap-4 mb-6">
        <div className="flex-1 flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2">
          <Search size={16} className="text-muted-foreground" />
          <input
            type="text"
            placeholder="Search user, action or target..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 bg-transparent outline-none text-sm"
          />
        </div>
        <Select value={severity} onValueChange={setSeverity}>
          <SelectTrigger className="w-48" />
          <SelectContent>
            <SelectItem value="All">All Severity</SelectItem>
            <SelectItem value="Info">Info</SelectItem>
            <SelectItem value="Warning">Warning</SelectItem>
            <SelectItem value="Critical">Critical</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card className="overflow-hidden p-0">
        <DataTable className="border-0">
          <DataTableHead>
            <DataTableRow>
              <DataTableHeadCell>User</DataTableHeadCell>
              <DataTableHeadCell>Action</DataTableHeadCell>
              <DataTableHeadCell>Target</DataTableHeadCell>
              <DataTableHeadCell>Severity</DataTableHeadCell>
              <DataTableHeadCell>Timestamp</DataTableHeadCell>
            </DataTableRow>
          </DataTableHead>
          <DataTableBody>
            {loading ? (
              <DataTableRow>
                <DataTableCell className="text-center text-muted-foreground py-6" colSpan={5}>
                  Loading audit logs...
                </DataTableCell>
              </DataTableRow>
            ) : filteredLogs.length > 0 ? (
              filteredLogs.map((log) => (
                <DataTableRow key={log.id}>
                  <DataTableCell>{log.user}</DataTableCell>
                  <DataTableCell>{log.action}</DataTableCell>
                  <DataTableCell>{log.target}</DataTableCell>
                  <DataTableCell>
                    <span className={`text-xs font-medium px-3 py-1 rounded-full ${severityStyles[log.severity] || severityStyles.Info}`}>{log.severity}</span>
                  </DataTableCell>
                  <DataTableCell className="text-muted-foreground">{log.time}</DataTableCell>
                </DataTableRow>
              ))
            ) : (
              <DataTableRow>
                <DataTableCell className="text-center text-muted-foreground py-6" colSpan={5}>
                  No audit logs found.
                </DataTableCell>
              </DataTableRow>
            )}
          </DataTableBody>
        </DataTable>
      </Card>
    </div>
  );
}

export default AuditLogs;