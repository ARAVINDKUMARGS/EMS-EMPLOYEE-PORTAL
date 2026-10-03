function StatCard({
  label,
  value,
  sub,
  icon,
  tone = "info",
  variant = "default"
}) {
  const toneMap = {
    info: "bg-info/15 text-info",
    success: "bg-success/15 text-success",
    warning: "bg-warning/15 text-warning",
    violet: "bg-chart-5/15 text-chart-5",
    danger: "bg-destructive/15 text-destructive"
  };
  const isCompact = variant === "compact";
  return <div className={`rounded-2xl border border-border bg-card shadow-elegant ${isCompact ? "p-3.5" : "p-4"}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
          {label}
        </div>
        {icon && <div className={`grid place-items-center rounded-lg ${toneMap[tone]} ${isCompact ? "h-7 w-7" : "h-8 w-8"}`}>{icon}</div>}
      </div>
      <div className={`font-semibold tracking-tight ${isCompact ? "mt-2 text-xl" : "mt-4 text-3xl"}`}>{value}</div>
      {sub && <div className="mt-1 text-xs text-muted-foreground">{sub}</div>}
    </div>;
}
export {
  StatCard
};