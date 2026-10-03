import "./PerformanceStatCard.css";

const PerformanceStatCard = ({
  title,
  value,
  subtitle,
  icon,
  iconBg,
}) => {
  return (
    <div className="performance-stat-card">
      <div className="card-top">
        <div>
          <h4>{title}</h4>
        </div>

        <div
          className="icon-box"
          style={{ backgroundColor: iconBg }}
        >
          {icon}
        </div>
      </div>

      <h2>{value}</h2>

      <p>{subtitle}</p>
    </div>
  );
};

export default PerformanceStatCard;