import { useState, useEffect } from "react";
import { toast } from "sonner";
import { StatCard } from "@/components/common/StatCard";
import CourseCard from "../components/training/CourseCard";
import "../css/training-dashboard.css";
import {
  BsBook,
  BsCheckCircle,
  BsClock,
  BsAward,
} from "react-icons/bs";
import { getCourses } from "../services/trainingService";

export default function Training() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCourses()
      .then((res) => setData(res.data))
      .catch((err) => {
        console.error("Fetch training error:", err);
        toast.error("Failed to load training courses");
      })
      .finally(() => setLoading(false));
  }, []);

  const stats = data?.stats || { enrolled: 4, completed: 1, hoursLearned: "18.5h", certificates: 2 };
  const courses = data?.courses || [
    { id: 1, category: "Technical", status: "in progress", title: "Advanced React Patterns", duration: "8h total", progress: 75 },
    { id: 2, category: "Soft skills", status: "completed", title: "Leadership Fundamentals", duration: "4h total", progress: 100 },
    { id: 3, category: "Compliance", status: "in progress", title: "Security Best Practices", duration: "3h total", progress: 30 },
    { id: 4, category: "Analytics", status: "not started", title: "Data-Driven-Decision Making", duration: "6h total", progress: 0 },
  ];

  return (
    <div className="training-module">
      <div className="page-header">
        <h1>Training</h1>
        <p>Courses, certifications, and learning paths</p>
      </div>
      <div className="stats-container">
        <StatCard label="COURSES ENROLLED" value={stats.enrolled} icon={<BsBook size={18} />} tone="info" variant="compact" />
        <StatCard label="COMPLETED" value={stats.completed} icon={<BsCheckCircle size={18} />} tone="success" variant="compact" />
        <StatCard label="HOURS LEARNED" value={stats.hoursLearned} icon={<BsClock size={18} />} tone="violet" variant="compact" />
        <StatCard label="CERTIFICATES" value={stats.certificates} icon={<BsAward size={18} />} tone="warning" variant="compact" />
      </div>
      <h2 className="section-title">Current Courses</h2>
      <div className="course-container">
        {loading ? (
          <p className="text-sm text-muted-foreground">Loading courses...</p>
        ) : (
          courses.map((course) => (
            <CourseCard
              key={course.id}
              id={course.id}
              category={course.category}
              status={course.status}
              title={course.title}
              duration={course.duration}
              progress={course.progress}
            />
          ))
        )}
      </div>
    </div>
  );
}