const db = require("../db");

// ================= SUMMARY =================

exports.summary = (req, res) => {
  const query = `
    SELECT
      (SELECT COUNT(*) FROM employees WHERE approval_status='Approved') AS totalEmployees,
      (SELECT COUNT(*) FROM employees WHERE approval_status='Approved' AND created_at >= DATE_FORMAT(NOW(),'%Y-%m-01')) AS newThisMonth,
      (SELECT COUNT(*) FROM departments) AS totalDepartments,
      (SELECT COUNT(*) FROM leave_requests WHERE status='Pending') AS pendingLeaves,
      (
        SELECT ROUND(
          100 * COUNT(DISTINCT CASE WHEN a.check_in IS NOT NULL THEN a.employee_id END)
          / NULLIF(COUNT(DISTINCT e.employee_id), 0)
        , 1)
        FROM employees e
        LEFT JOIN attendance a ON a.employee_id = e.employee_id AND a.attendance_date = CURDATE()
        WHERE e.approval_status='Approved'
      ) AS avgAttendanceToday
  `;

  db.query(query, (err, result) => {
    if (err) {
      console.log("HR OVERVIEW SUMMARY ERROR:", err);
      return res.status(500).json(err);
    }
    res.json(result[0]);
  });
};

// ================= ATTENDANCE BY DEPARTMENT (today) =================

exports.attendanceByDepartment = (req, res) => {
  const query = `
    SELECT
      d.name AS department,
      ROUND(
        100 * COUNT(DISTINCT CASE WHEN a.check_in IS NOT NULL THEN e.employee_id END)
        / NULLIF(COUNT(DISTINCT e.employee_id), 0)
      , 1) AS attendance
    FROM departments d
    LEFT JOIN employees e ON e.department_id = d.id AND e.approval_status='Approved'
    LEFT JOIN attendance a ON a.employee_id = e.employee_id AND a.attendance_date = CURDATE()
    GROUP BY d.id, d.name
    ORDER BY d.name;
  `;

  db.query(query, (err, result) => {
    if (err) {
      console.log("HR OVERVIEW ATTENDANCE ERROR:", err);
      return res.status(500).json(err);
    }
    res.json(result);
  });
};

// ================= HEADCOUNT BY DEPARTMENT =================

exports.headcountByDepartment = (req, res) => {
  const query = `
    SELECT
      d.name AS department,
      COUNT(e.id) AS count
    FROM departments d
    LEFT JOIN employees e ON e.department_id = d.id AND e.approval_status='Approved'
    GROUP BY d.id, d.name
    ORDER BY d.name;
  `;

  db.query(query, (err, result) => {
    if (err) {
      console.log("HR OVERVIEW HEADCOUNT ERROR:", err);
      return res.status(500).json(err);
    }
    res.json(result);
  });
};

// ================= PENDING LEAVES (for the overview widget) =================

exports.pendingLeaves = (req, res) => {
  const query = `
    SELECT
      lr.id,
      e.name AS employee_name,
      d.name AS department,
      lr.leave_type,
      lr.start_date,
      lr.end_date,
      lr.reason,
      lr.status
    FROM leave_requests lr
    LEFT JOIN employees e ON e.employee_id = lr.employee_id
    LEFT JOIN departments d ON d.id = e.department_id
    WHERE lr.status='Pending'
    ORDER BY lr.start_date
    LIMIT 10;
  `;

  db.query(query, (err, result) => {
    if (err) {
      console.log("HR OVERVIEW PENDING LEAVES ERROR:", err);
      return res.status(500).json(err);
    }
    res.json(result);
  });
};