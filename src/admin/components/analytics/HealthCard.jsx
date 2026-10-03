function HealthCard({ title, uptime, latency, status }) {
  const statusColor =
    status === "Healthy"
      ? "bg-green-500"
      : status === "Degraded"
      ? "bg-yellow-500"
      : "bg-red-500";

  return (
    <div className="bg-[#111827] border border-slate-700 rounded-2xl p-5">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-white text-lg font-semibold">{title}</h3>

          <p className="text-slate-400 text-sm mt-2">
            Uptime {uptime} • Latency {latency}
          </p>
        </div>

        <span
          className={`${statusColor} text-white text-xs px-3 py-1 rounded-full`}
        >
          {status}
        </span>
      </div>
    </div>
  );
}

export default HealthCard;
