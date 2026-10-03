import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

import { headcountData } from "../../data/reportsData";

function HeadcountReport() {
  return (
    <div className="bg-[#111827] border border-slate-700 rounded-2xl p-6">

      <h2 className="text-white text-2xl font-bold mb-2">
        Headcount Report
      </h2>

      <p className="text-slate-400 mb-6">
        Employee distribution by department
      </p>

      <ResponsiveContainer width="100%" height={350}>
        <BarChart data={headcountData}>
          <CartesianGrid
            stroke="#334155"
            strokeDasharray="3 3"
          />

          <XAxis
            dataKey="department"
            stroke="#94A3B8"
          />

          <YAxis
            stroke="#94A3B8"
          />

          <Tooltip />

          <Bar
            dataKey="employees"
            fill="#3B82F6"
            radius={[6, 6, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>

    </div>
  );
}

export default HeadcountReport;