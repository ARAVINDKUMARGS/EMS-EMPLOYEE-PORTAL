import { Link } from "react-router-dom";

const categoryColors = {
  Technical: "bg-[#2563eb]",
  "Soft skills": "bg-[#9333ea]",
  Compliance: "bg-[#dc2626]",
  Analytics: "bg-[#0891b2]",
};

function CourseCard({
  id,
  category,
  status,
  title,
  duration,
  progress,
}) {
  return (
    <div className="course-card">
      <div className="course-top">
        <span className={`category ${categoryColors[category] || "bg-[#2563eb]"}`}>{category}</span>
        <span className="status">{status}</span>
      </div>

      <h3>{title}</h3>

      <p>{duration}</p>

      <div className="progress-text">
        <span>Progress</span>
        <span>{progress}% Complete</span>
      </div>

      <div className="progress-bar">
        <div
          className="progress-fill"
          style={{ width: `${progress}%` }}
        ></div>
      </div>

     <Link to={`/course/${id}`} className="continue-btn">
       Continue Learning
     </Link>
    </div>
  );
}

export default CourseCard;