import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

import { employeeGrowthData } from "../../data/analyticsData";

function EmployeeGrowthChart() {
  return (
    <div className="bg-[#111827] border border-slate-700 rounded-2xl p-6">
      <h2 className="text-white text-xl font-semibold mb-6">
        Employee Growth — 2024
      </h2>

      <ResponsiveContainer width="100%" height={320}>
        <ComposedChart data={employeeGrowthData}>
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

          <Bar
            dataKey="hired"
            fill="#34D399"
            radius={[4, 4, 0, 0]}
          />

          <Bar
            dataKey="left"
            fill="#EF4444"
            radius={[4, 4, 0, 0]}
          />

          <Line
            type="monotone"
            dataKey="total"
            stroke="#3B82F6"
            strokeWidth={3}
            dot={{ r: 4 }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}

export default EmployeeGrowthChart;
