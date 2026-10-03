import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

import { departmentRatings } from "../../data/performanceData";
import { Card } from "@/components/ui/card";

const DepartmentChart = () => {
  return (
    <Card className="p-5">
      <h2 className="text-base font-semibold">Department Average Ratings</h2>
      <p className="text-sm text-muted-foreground">Department performance overview</p>

      <div className="mt-4">
        <ResponsiveContainer width="100%" height={250}>
          <BarChart
            data={departmentRatings}
            margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey="department" stroke="var(--muted-foreground)" />
            <YAxis domain={[0, 5]} stroke="var(--muted-foreground)" />
            <Tooltip
              contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)" }}
            />
            <Bar dataKey="rating" fill="var(--primary)" radius={[8, 8, 0, 0]} barSize={30} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export default DepartmentChart;