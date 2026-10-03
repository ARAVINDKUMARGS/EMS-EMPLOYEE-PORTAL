import { performanceMetrics } from "../../data/performanceData";

function PerformanceScores() {
  return (
    <div className="score-card">

      <div className="section-header">

        <h2>Performance Scores</h2>

        <p>Employee competency overview</p>

      </div>

      <div className="chart">

        {performanceMetrics.map((item) => (

          <div className="bar-item" key={item.id}>

            <span className="percentage">

              {item.score}%

            </span>

            <div className="bar-bg">

              <div
                className="bar-fill"
                style={{
                  height: `${item.score}%`,
                  background: item.color,
                }}
              ></div>

            </div>

            <p>{item.skill}</p>

          </div>

        ))}

      </div>

    </div>
  );
}

export default PerformanceScores;