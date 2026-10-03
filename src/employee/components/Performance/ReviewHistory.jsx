import { reviewHistory } from "../../data/performanceData";
import { FaStar } from "react-icons/fa";

function ReviewHistory() {
  return (
    <div className="review-section">

      <div className="section-header">

        <h2>Review History</h2>

        <p>
          Recent performance evaluations and manager feedback.
        </p>

      </div>

      <div className="table-container">

        <table>

          <thead>

            <tr>
              <th>Review Cycle</th>
              <th>Reviewer</th>
              <th>Rating</th>
              <th>Strength</th>
              <th>Focus Area</th>
              <th>Status</th>
            </tr>

          </thead>

          <tbody>

            {reviewHistory.map((review) => (

              <tr key={review.id}>

                <td>{review.cycle}</td>

                <td>{review.reviewer}</td>

                <td className="rating-cell">

                  <FaStar className="star" />

                  {review.rating}

                </td>

                <td>{review.strength}</td>

                <td>{review.focus}</td>

                <td>

                  <span
                    className={`table-status ${review.status
                      .toLowerCase()
                      .replace(" ", "-")}`}
                  >
                    {review.status}
                  </span>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
}

export default ReviewHistory;