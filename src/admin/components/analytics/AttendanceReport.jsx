import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

import { attendanceData } from "../../data/reportsData";

function AttendanceReport() {
  return (
    <div className="bg-[#111827] border border-slate-700 rounded-2xl p-6">

      <h2 className="text-white text-2xl font-bold mb-2">
        Attendance Report
      </h2>

      <p className="text-slate-400 mb-6">
        Monthly employee attendance percentage
      </p>

      <ResponsiveContainer width="100%" height={350}>
        <AreaChart data={attendanceData}>
          <CartesianGrid
            stroke="#334155"
            strokeDasharray="3 3"
          />

          <XAxis
            dataKey="month"
            stroke="#94A3B8"
          />

          <YAxis
            stroke="#94A3B8"
          />

          <Tooltip />

          <Area
            type="monotone"
            dataKey="attendance"
            stroke="#22C55E"
            fill="#22C55E"
            fillOpacity={0.25}
            strokeWidth={3}
          />
        </AreaChart>
      </ResponsiveContainer>

    </div>
  );
}

export default AttendanceReport;