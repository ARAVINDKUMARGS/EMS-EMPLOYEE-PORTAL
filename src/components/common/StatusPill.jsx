import { cn } from "@/lib/utils";
const toneClasses = {
  success: "bg-success/15 text-success border border-success/25",
  info: "bg-info/15 text-info border border-info/25",
  warning: "bg-warning/15 text-warning border border-warning/25",
  danger: "bg-destructive/15 text-destructive border border-destructive/25",
  muted: "bg-muted text-muted-foreground border border-border",
  violet: "bg-chart-5/15 text-chart-5 border border-chart-5/25"
};
function StatusPill({
  status,
  tone: toneOverride,
  className
}) {
  const map = {
    approved: "success",
    done: "success",
    completed: "success",
    present: "success",
    paid: "success",
    processed: "success",
    resolved: "success",
    active: "success",
    "on leave": "warning",
    healthy: "success",
    "in-progress": "info",
    "in progress": "info",
    pending: "warning",
    late: "warning",
    open: "warning",
    degraded: "warning",
    "not-started": "muted",
    todo: "muted",
    rejected: "danger",
    absent: "danger",
    urgent: "danger",
    high: "warning",
    medium: "info",
    low: "muted"
  };
  const tone = toneOverride ?? (map[status.toLowerCase()] ?? "muted");
  return <span
    className={cn(
      "inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium capitalize",
      toneClasses[tone],
      className
    )}
  >
      {status}
    </span>;
}
export {
  StatusPill
};