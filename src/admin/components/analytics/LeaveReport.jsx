import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts";

import { leaveData } from "../../data/reportsData";

const COLORS = ["#22C55E", "#FACC15", "#EF4444"];

function LeaveReport() {
  return (
    <div className="bg-[#111827] border border-slate-700 rounded-2xl p-6">
      <h2 className="text-white text-2xl font-bold mb-2">
        Leave Report
      </h2>

      <p className="text-slate-400 mb-6">
        Distribution of leave requests
      </p>

      <ResponsiveContainer width="100%" height={350}>
        <PieChart>
          <Pie
            data={leaveData}
            cx="50%"
            cy="50%"
            outerRadius={120}
            dataKey="value"
            label
          >
            {leaveData.map((entry, index) => (
              <Cell
                key={index}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>

          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export default LeaveReport;