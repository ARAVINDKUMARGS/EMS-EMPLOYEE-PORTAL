const db = require("../db");

/**
 * Log administrative and sensitive actions to audit_logs table
 */
exports.logAudit = ({ userName, userEmail, action, target, module = "System", severity = "Info", metadata = null }) => {
  const query = `
    INSERT INTO audit_logs (user_name, user_email, action, target, module, severity, metadata)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;
  const metaJson = metadata ? JSON.stringify(metadata) : null;
  db.query(query, [userName || "System", userEmail || null, action, target, module, severity, metaJson], (err) => {
    if (err) {
      console.error("AUDIT LOG INSERT ERROR:", err.message);
    }
  });
};
