import HealthCard from "./HealthCard";
import { systemHealth } from "../../data/analyticsData";
import { Button } from "@/components/ui/button";

function SystemHealth() {
  return (
    <div className="bg-card border border-border rounded-2xl p-6 mt-8">

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-base font-semibold">
          System Health
        </h2>

        <Button variant="outline" size="sm">Refresh</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {systemHealth.map((item, index) => (
          <HealthCard
            key={index}
            title={item.title}
            uptime={item.uptime}
            latency={item.latency}
            status={item.status}
          />
        ))}
      </div>
    </div>
  );
}

export default SystemHealth;