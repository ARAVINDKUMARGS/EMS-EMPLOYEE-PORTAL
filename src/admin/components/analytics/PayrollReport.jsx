import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

import { payrollReportData } from "../../data/reportsData";

function PayrollReport() {
  return (
    <div className="bg-[#111827] border border-slate-700 rounded-2xl p-6">

      <h2 className="text-white text-2xl font-bold mb-2">
        Payroll Report
      </h2>

      <p className="text-slate-400 mb-6">
        Monthly payroll expenditure
      </p>

      <ResponsiveContainer width="100%" height={350}>
        <LineChart data={payrollReportData}>
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
        </LineChart>
      </ResponsiveContainer>

    </div>
  );
}

export default PayrollReport;