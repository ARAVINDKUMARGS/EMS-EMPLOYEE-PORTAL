const db = require("../db");

// Fetch notifications for logged in employee (includes broadcast notifications where employee_id IS NULL)
exports.getNotifications = (req, res) => {
  const employeeId = req.user.employee_id;

  const query = `
    SELECT id, title, body, tag, pinned, is_read AS unread, created_at AS time
    FROM notifications
    WHERE employee_id IS NULL OR employee_id = ?
    ORDER BY pinned DESC, created_at DESC
  `;

  db.query(query, [employeeId], (err, rows) => {
    if (err) return res.status(500).json(err);
    res.json(rows.map((n) => ({ ...n, unread: !n.unread })));
  });
};

// Post Notification / Announcement (HR / Admin)
exports.createNotification = (req, res) => {
  const { employee_id, title, body, tag, pinned } = req.body;

  if (!title || !body) {
    return res.status(400).json({ message: "Title and body are required" });
  }

  const query = `
    INSERT INTO notifications (employee_id, title, body, tag, pinned, is_read)
    VALUES (?, ?, ?, ?, ?, 0)
  `;

  db.query(query, [employee_id || null, title, body, tag || "HR", pinned ? 1 : 0], (err, result) => {
    if (err) return res.status(500).json(err);
    res.status(201).json({ message: "Notification broadcasted", id: result.insertId });
  });
};

// Mark as read
exports.markAsRead = (req, res) => {
  const { id } = req.params;
  db.query("UPDATE notifications SET is_read = 1 WHERE id = ?", [id], (err) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "Notification marked as read" });
  });
};

// Mark all as read
exports.markAllAsRead = (req, res) => {
  const employeeId = req.user.employee_id;
  db.query("UPDATE notifications SET is_read = 1 WHERE employee_id IS NULL OR employee_id = ?", [employeeId], (err) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "All notifications marked as read" });
  });
};

// Delete notification
exports.deleteNotification = (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM notifications WHERE id = ?", [id], (err) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "Notification deleted" });
  });
};
