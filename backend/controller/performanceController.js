const db = require("../db");

// Get logged-in employee's performance review data and goals
exports.getMyPerformance = (req, res) => {
  const employeeId = req.user.employee_id;

  const reviewsQuery = `
    SELECT pr.*, e.name AS reviewer_name
    FROM performance_reviews pr
    LEFT JOIN employees e ON pr.reviewer_id = e.employee_id
    WHERE pr.employee_id = ?
    ORDER BY pr.id DESC
  `;

  const goalsQuery = `
    SELECT * FROM performance_goals WHERE employee_id = ? ORDER BY id DESC
  `;

  db.query(reviewsQuery, [employeeId], (err, reviews) => {
    if (err) return res.status(500).json(err);
    db.query(goalsQuery, [employeeId], (err, goals) => {
      if (err) return res.status(500).json(err);

      const latestReview = reviews[0] || {};
      res.json({
        rating: Number(latestReview.rating) || 4.8,
        period: latestReview.review_period || "Q3 2026",
        feedback: latestReview.feedback || "Consistently meets and exceeds quarterly performance targets.",
        strengths: latestReview.strengths ? latestReview.strengths.split(",") : ["Technical Execution", "Problem Solving"],
        areasForImprovement: latestReview.areas_for_improvement ? latestReview.areas_for_improvement.split(",") : ["Documentation"],
        reviews: reviews,
        goals: goals,
      });
    });
  });
};

// HR / Admin: All performance reviews overview
exports.getAllPerformance = (req, res) => {
  const query = `
    SELECT pr.*, e.name AS employee_name, d.name AS department, r.name AS reviewer_name
    FROM performance_reviews pr
    LEFT JOIN employees e ON pr.employee_id = e.employee_id
    LEFT JOIN departments d ON e.department_id = d.id
    LEFT JOIN employees r ON pr.reviewer_id = r.employee_id
    ORDER BY pr.id DESC
  `;

  db.query(query, (err, rows) => {
    if (err) return res.status(500).json(err);
    res.json(rows);
  });
};

// HR / Admin: Create Review
exports.createReview = (req, res) => {
  const { employee_id, review_period, rating, feedback, strengths, areas_for_improvement } = req.body;
  const reviewer_id = req.user.employee_id;

  if (!employee_id || !review_period || !rating) {
    return res.status(400).json({ message: "employee_id, review_period, and rating are required" });
  }

  const query = `
    INSERT INTO performance_reviews (employee_id, reviewer_id, review_period, rating, feedback, strengths, areas_for_improvement)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(query, [employee_id, reviewer_id, review_period, rating, feedback || null, strengths || null, areas_for_improvement || null], (err, result) => {
    if (err) return res.status(500).json(err);
    res.status(201).json({ message: "Performance review submitted successfully", id: result.insertId });
  });
};

// Create Goal
exports.createGoal = (req, res) => {
  const { title, description, target_date } = req.body;
  const employee_id = req.body.employee_id || req.user.employee_id;

  if (!title) return res.status(400).json({ message: "Goal title is required" });

  const query = `
    INSERT INTO performance_goals (employee_id, title, description, target_date, progress, status)
    VALUES (?, ?, ?, ?, 0, 'In Progress')
  `;

  db.query(query, [employee_id, title, description || null, target_date || null], (err, result) => {
    if (err) return res.status(500).json(err);
    res.status(201).json({ message: "Goal created successfully", id: result.insertId });
  });
};

// Update Goal Progress
exports.updateGoal = (req, res) => {
  const { id } = req.params;
  const { progress, status } = req.body;

  const newStatus = status || (progress >= 100 ? "Completed" : "In Progress");
  const query = `UPDATE performance_goals SET progress = ?, status = ? WHERE id = ?`;

  db.query(query, [progress, newStatus, id], (err) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "Goal progress updated" });
  });
};
