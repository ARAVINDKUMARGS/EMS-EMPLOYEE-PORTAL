import { goals } from "../../data/performanceData";

function GoalsProgress() {
  return (
    <div className="goals-section">

      <div className="section-header">
        <h2>Goals Progress</h2>
        <p>Track ongoing goals and project completion.</p>
      </div>

      <div className="goal-grid">

        {goals.map((goal) => (

          <div className="goal-card" key={goal.id}>

            <div className="goal-top">

              <h3>{goal.title}</h3>

              <span
                className={`priority ${goal.priority.toLowerCase()}`}
              >
                {goal.priority}
              </span>

            </div>

            <p className="due-date">
              Due: {goal.dueDate}
            </p>

            <div className="goal-progress">

              <div
                className="goal-fill"
                style={{ width: `${goal.progress}%` }}
              ></div>

            </div>

            <div className="goal-footer">

              <span>{goal.progress}%</span>

              <span
                className={`status ${goal.status
                  .replace(" ", "-")
                  .toLowerCase()}`}
              >
                {goal.status}
              </span>

            </div>

          </div>

        ))}

      </div>

    </div>
  );
}

export default GoalsProgress;