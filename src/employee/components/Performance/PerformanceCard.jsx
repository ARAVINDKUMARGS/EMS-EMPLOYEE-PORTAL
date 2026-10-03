import { performanceCards } from "../../data/performanceData";

function PerformanceCard() {
  return (
    <div className="card-grid">
      {performanceCards.map((card) => {
        const Icon = card.icon;

        return (
          <div className="performance-card" key={card.id}>

            <div className="card-header">

              <div>
                <h4>{card.title}</h4>
              </div>

              <div
                className="icon-box"
                style={{
                  backgroundColor: `${card.color}20`,
                  color: card.color,
                }}
              >
                <Icon />
              </div>

            </div>

            <h2>{card.value}</h2>

            <p>{card.subtitle}</p>

          </div>
        );
      })}
    </div>
  );
}

export default PerformanceCard;