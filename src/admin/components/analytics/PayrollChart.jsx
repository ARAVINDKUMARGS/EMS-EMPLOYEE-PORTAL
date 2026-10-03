import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

import { payrollCostData } from "../../data/analyticsData";

function PayrollChart() {
  return (
    <div className="bg-[#111827] border border-slate-700 rounded-2xl p-6">
      <h2 className="text-white text-xl font-semibold mb-6">
        Payroll Cost ($M) — 2024
      </h2>

      <ResponsiveContainer width="100%" height={320}>
        <LineChart data={payrollCostData}>
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

          <Line
            type="monotone"
            dataKey="payroll"
            stroke="#06B6D4"
            strokeWidth={3}
            dot={{ r: 4 }}
          />

          <Line
            type="monotone"
            dataKey="bonus"
            stroke="#A855F7"
            strokeWidth={3}
            dot={{ r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default PayrollChart;
