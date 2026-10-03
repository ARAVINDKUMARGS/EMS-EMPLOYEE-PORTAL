const db = require("../db");

// Get tasks (Employee sees assigned/created, HR/Admin sees all)
exports.getTasks = (req, res) => {
  const { role, employee_id } = req.user;
  const isHrOrAdmin = ["hr", "admin"].includes(role);

  let query = `
    SELECT t.*, e.name AS assignee_name, c.name AS creator_name
    FROM tasks t
    LEFT JOIN employees e ON t.assigned_to = e.employee_id
    LEFT JOIN employees c ON t.created_by = c.employee_id
  `;
  const params = [];

  if (!isHrOrAdmin) {
    query += ` WHERE t.assigned_to = ? OR t.created_by = ?`;
    params.push(employee_id, employee_id);
  }
  query += ` ORDER BY t.created_at DESC`;

  db.query(query, params, (err, rows) => {
    if (err) {
      console.error("GET TASKS ERROR:", err);
      return res.status(500).json({ message: "Failed to fetch tasks" });
    }
    res.json(rows);
  });
};

// Create Task
exports.createTask = (req, res) => {
  const { title, description, assigned_to, due_date, priority } = req.body;
  const created_by = req.user.employee_id;

  if (!title || !title.trim()) {
    return res.status(400).json({ message: "Task title is required" });
  }

  const query = `
    INSERT INTO tasks (title, description, assigned_to, created_by, due_date, priority, status)
    VALUES (?, ?, ?, ?, ?, ?, 'todo')
  `;

  db.query(
    query,
    [title.trim(), description || null, assigned_to || created_by, created_by, due_date || null, priority || "Medium"],
    (err, result) => {
      if (err) {
        console.error("CREATE TASK ERROR:", err);
        return res.status(500).json({ message: "Failed to create task" });
      }
      res.status(201).json({ message: "Task created successfully", id: result.insertId });
    }
  );
};

// Update Task
exports.updateTask = (req, res) => {
  const { id } = req.params;
  const { title, description, assigned_to, due_date, priority, status, completed } = req.body;

  const isCompleted = completed || status === "done" ? 1 : 0;
  const query = `
    UPDATE tasks
    SET title = COALESCE(?, title),
        description = COALESCE(?, description),
        assigned_to = COALESCE(?, assigned_to),
        due_date = COALESCE(?, due_date),
        priority = COALESCE(?, priority),
        status = COALESCE(?, status),
        completed = ?
    WHERE id = ?
  `;

  db.query(query, [title, description, assigned_to, due_date, priority, status, isCompleted, id], (err) => {
    if (err) {
      console.error("UPDATE TASK ERROR:", err);
      return res.status(500).json({ message: "Failed to update task" });
    }
    res.json({ message: "Task updated successfully" });
  });
};

// Toggle Complete
exports.toggleTaskComplete = (req, res) => {
  const { id } = req.params;

  db.query("SELECT completed, status FROM tasks WHERE id = ?", [id], (err, rows) => {
    if (err || rows.length === 0) {
      return res.status(404).json({ message: "Task not found" });
    }
    const newCompleted = rows[0].completed ? 0 : 1;
    const newStatus = newCompleted ? "done" : "todo";

    db.query("UPDATE tasks SET completed = ?, status = ? WHERE id = ?", [newCompleted, newStatus, id], (err) => {
      if (err) return res.status(500).json({ message: "Failed to toggle task" });
      res.json({ message: "Task updated", completed: !!newCompleted, status: newStatus });
    });
  });
};

// Delete Task
exports.deleteTask = (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM tasks WHERE id = ?", [id], (err) => {
    if (err) {
      console.error("DELETE TASK ERROR:", err);
      return res.status(500).json({ message: "Failed to delete task" });
    }
    res.json({ message: "Task deleted successfully" });
  });
};
