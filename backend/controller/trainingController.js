const db = require("../db");

// Get courses list + user's enrollment status & training summary stats
exports.getCourses = (req, res) => {
  const employeeId = req.user.employee_id;

  const coursesQuery = `
    SELECT c.*, te.progress, te.status AS enrollment_status, te.completion_date
    FROM training_courses c
    LEFT JOIN training_enrollments te ON te.course_id = c.id AND te.employee_id = ?
    ORDER BY c.id ASC
  `;

  const statsQuery = `
    SELECT
      COUNT(*) AS total_enrolled,
      COUNT(CASE WHEN status='completed' THEN 1 END) AS completed,
      COUNT(CASE WHEN status='completed' THEN 1 END) AS certificates
    FROM training_enrollments
    WHERE employee_id = ?
  `;

  db.query(coursesQuery, [employeeId], (err, courses) => {
    if (err) return res.status(500).json(err);
    db.query(statsQuery, [employeeId], (err, statsRows) => {
      if (err) return res.status(500).json(err);

      const stats = statsRows[0] || {};
      res.json({
        stats: {
          enrolled: stats.total_enrolled || 0,
          completed: stats.completed || 0,
          hoursLearned: `${(stats.completed * 4 + 6.5).toFixed(1)}h`,
          certificates: stats.certificates || 0,
        },
        courses: courses.map((c) => ({
          id: c.id,
          category: c.category,
          status: c.enrollment_status || "not started",
          title: c.title,
          duration: c.duration,
          progress: c.progress || 0,
          instructor: c.instructor,
          description: c.description,
        })),
      });
    });
  });
};

// Get single course details
exports.getCourseDetails = (req, res) => {
  const { id } = req.params;
  const employeeId = req.user.employee_id;

  const query = `
    SELECT c.*, te.progress, te.status AS enrollment_status
    FROM training_courses c
    LEFT JOIN training_enrollments te ON te.course_id = c.id AND te.employee_id = ?
    WHERE c.id = ?
  `;

  db.query(query, [employeeId, id], (err, rows) => {
    if (err || rows.length === 0) return res.status(404).json({ message: "Course not found" });
    res.json(rows[0]);
  });
};

// Enroll employee in a course
exports.enrollCourse = (req, res) => {
  const { course_id } = req.body;
  const employeeId = req.user.employee_id;

  const query = `
    INSERT INTO training_enrollments (employee_id, course_id, progress, status)
    VALUES (?, ?, 0, 'in progress')
    ON DUPLICATE KEY UPDATE status='in progress'
  `;

  db.query(query, [employeeId, course_id], (err) => {
    if (err) return res.status(500).json(err);
    res.status(201).json({ message: "Enrolled in course successfully" });
  });
};

// Update enrollment progress
exports.updateProgress = (req, res) => {
  const { course_id, progress } = req.body;
  const employeeId = req.user.employee_id;

  const status = Number(progress) >= 100 ? "completed" : "in progress";
  const completionDate = Number(progress) >= 100 ? new Date().toISOString().slice(0, 10) : null;

  const query = `
    UPDATE training_enrollments
    SET progress = ?, status = ?, completion_date = COALESCE(?, completion_date)
    WHERE employee_id = ? AND course_id = ?
  `;

  db.query(query, [progress, status, completionDate, employeeId, course_id], (err) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "Training progress updated" });
  });
};

// Create new Course (HR/Admin)
exports.createCourse = (req, res) => {
  const { title, category, duration, description, instructor } = req.body;

  if (!title || !category || !duration) {
    return res.status(400).json({ message: "Title, category, and duration are required" });
  }

  const query = `
    INSERT INTO training_courses (title, category, duration, description, instructor)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.query(query, [title, category, duration, description || null, instructor || null], (err, result) => {
    if (err) return res.status(500).json(err);
    res.status(201).json({ message: "Course created successfully", id: result.insertId });
  });
};
