function StatCard({ title, number, icon: Icon, tint }) {
  return (
    <div className={`rounded-xl border border-border p-3 flex items-center justify-between ${tint || "bg-card"}`}>
      <div>
        <p className="text-[10px] font-medium tracking-wide text-muted-foreground uppercase">{title}</p>
        <h2 className="text-lg font-bold mt-1">{number}</h2>
      </div>
      <div className="grid h-8 w-8 place-items-center rounded-lg bg-accent text-foreground">
        <Icon className="h-4 w-4" />
      </div>
    </div>
  );
}

export default StatCard;