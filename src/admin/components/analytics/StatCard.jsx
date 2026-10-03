function StatCard({ title, value, subtitle, icon }) {
  return (
    <div className="bg-slate-900 border border-slate-700 rounded-xl p-6">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-slate-400 text-sm">{title}</p>

          <h2 className="text-3xl font-bold text-white mt-3">
            {value}
          </h2>

          <p className="text-green-400 text-sm mt-2">
            {subtitle}
          </p>
        </div>

        <div className="text-4xl">
          {icon}
        </div>
      </div>
    </div>
  );
}

export default StatCard;
