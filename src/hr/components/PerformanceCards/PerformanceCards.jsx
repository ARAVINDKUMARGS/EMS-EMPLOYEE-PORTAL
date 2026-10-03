import { StatCard } from "@/components/common/StatCard";
import { statCards } from "../../data/performanceData";

const toneMap = {
  "#F59E0B": "warning",
  "#22C55E": "success",
  "#FACC15": "warning",
  "#A855F7": "violet",
};

const PerformanceCards = () => {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {statCards.map((card) => {
        const Icon = card.icon;
        return (
          <StatCard
            key={card.title}
            label={card.title}
            value={card.value}
            sub={card.subtitle}
            icon={<Icon size={16} />}
            tone={toneMap[card.iconColor] || "info"}
          />
        );
      })}
    </div>
  );
};

export default PerformanceCards;