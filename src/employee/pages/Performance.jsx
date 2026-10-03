import "../styles/Performance.css";
import "../styles/Cards.css";
import "../styles/Progress.css";
import "../styles/Goals.css";
import "../styles/Review.css";

import PerformanceCard from "../components/Performance/PerformanceCard";
import PerformanceScores from "../components/Performance/PerformanceScores";
import GoalsProgress from "../components/Performance/GoalsProgress";
import ReviewHistory from "../components/Performance/ReviewHistory";

function Performance() {
  return (
    <div className="performance-page">
      <div className="performance-header">
        <h1>Performance</h1>
        <p>
          Monitor achievements, evaluate strengths, and track overall employee
          growth.
        </p>
      </div>

      <PerformanceCard />
      <PerformanceScores />
      <GoalsProgress />
      <ReviewHistory />
    </div>
  );
}

export default Performance;