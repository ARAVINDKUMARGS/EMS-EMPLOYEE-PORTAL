const db = require("../db");

// Get Audit Logs (Admin only)
exports.getAuditLogs = (req, res) => {
  const query = `
    SELECT id, user_name AS user, user_email, action, target, module, severity, created_at AS time
    FROM audit_logs
    ORDER BY created_at DESC
    LIMIT 200
  `;

  db.query(query, (err, rows) => {
    if (err) return res.status(500).json(err);
    res.json(rows.map((r) => ({
      ...r,
      time: new Date(r.time).toLocaleString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }),
    })));
  });
};
