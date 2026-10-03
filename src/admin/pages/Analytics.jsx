import { StatCard } from "@/components/common/StatCard";
import EmployeeGrowthChart from "../components/analytics/EmployeeGrowthChart";
import PayrollChart from "../components/analytics/PayrollChart";
import SystemHealth from "../components/analytics/SystemHealth";

import { stats } from "../data/analyticsData";

function Analytics() {
  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold">
          Analytics
        </h1>

        <p className="text-muted-foreground mt-2">
          Company-wide metrics and insights
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {stats.map((card, index) => (
          <StatCard
            key={index}
            label={card.title}
            value={card.value}
            sub={card.subtitle}
            icon={card.icon}
          />
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mt-8">
        <EmployeeGrowthChart />
        <PayrollChart />
      </div>

      {/* System Health */}
      <div className="mt-8">
        <SystemHealth />
      </div>
    </div>
  );
}

export default Analytics;