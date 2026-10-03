import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { BsCheckCircleFill, BsCircle, BsArrowLeft, BsAward, BsX } from "react-icons/bs";
import courses from "../../data/courses";
import "../../css/training-dashboard.css";

function CourseDetails() {
  const { id } = useParams();
  const course = courses.find((c) => c.id === Number(id));
  const [modules, setModules] = useState(course ? course.modules : []);
  const [showCertificate, setShowCertificate] = useState(false);

  if (!course) {
    return (
      <div className="training-module">
        <p>Course not found.</p>
        <Link to="/training" className="continue-btn">Back to Training</Link>
      </div>
    );
  }

  const toggleModule = (index) => {
    setModules((prev) =>
      prev.map((mod, i) =>
        i === index ? { ...mod, completed: !mod.completed } : mod
      )
    );
  };

  const completedCount = modules.filter((m) => m.completed).length;
  const progress = Math.round((completedCount / modules.length) * 100);
  const isComplete = progress === 100;

  let currentStatus = "not started";
  if (progress === 100) currentStatus = "completed";
  else if (progress > 0) currentStatus = "in progress";

  return (
    <div className="training-module">
      <Link to="/training" className="course-back-link">
        <BsArrowLeft size={14} /> Back to Training
      </Link>

      <div className="course-detail-header">
        <span className="category">{course.category}</span>
        <span className="status">{currentStatus}</span>
      </div>

      <h1 className="course-detail-title">{course.title}</h1>
      <p className="course-detail-meta">{course.duration} • Instructor: {course.instructor}</p>

      <p className="course-detail-description">{course.description}</p>

      <div className="progress-text">
        <span>Progress</span>
        <span>{progress}% Complete</span>
      </div>
      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${progress}%` }}></div>
      </div>

      <h2 className="section-title">Modules</h2>
      <div className="module-list">
        {modules.map((mod, i) => (
          <div
            key={i}
            className="module-item"
            onClick={() => toggleModule(i)}
            style={{ cursor: "pointer" }}
          >
            {mod.completed ? (
              <BsCheckCircleFill size={16} className="module-check-done" />
            ) : (
              <BsCircle size={16} className="module-check-pending" />
            )}
            <span>{mod.name}</span>
          </div>
        ))}
      </div>

      <div className="course-action-row">
        <button className="continue-btn">
          Continue Learning
        </button>
        {isComplete && (
          <button
            className="continue-btn certificate-btn"
            onClick={() => setShowCertificate(true)}
          >
            View Certificate
          </button>
        )}
      </div>

      {showCertificate && (
        <div className="certificate-overlay" onClick={() => setShowCertificate(false)}>
          <div className="certificate-card" onClick={(e) => e.stopPropagation()}>
            <button className="certificate-close" onClick={() => setShowCertificate(false)}>
              <BsX size={20} />
            </button>
            <BsAward size={48} className="certificate-icon" />
            <p className="certificate-label">Certificate of Completion</p>
            <h2 className="certificate-title">{course.title}</h2>
            <p className="certificate-sub">Awarded to John Doe</p>
            <p className="certificate-date">Completed on {new Date().toLocaleDateString()}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default CourseDetails;