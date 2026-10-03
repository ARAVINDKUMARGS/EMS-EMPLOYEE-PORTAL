const db = require("../db");

// ---------------- LIST ALL DEPARTMENTS (with real employee counts) ----------------

exports.getAllDepartments = (req, res) => {
    db.query(
        `SELECT d.id, d.name, d.head_name, d.budget,
                COUNT(e.id) AS employee_count
         FROM departments d
         LEFT JOIN employees e ON e.department_id = d.id AND e.approval_status='Approved'
         GROUP BY d.id, d.name, d.head_name, d.budget
         ORDER BY d.name`,
        (err, rows) => {
            if (err) {
                console.log("GET DEPARTMENTS ERROR:", err);
                return res.status(500).json(err);
            }
            res.json(rows);
        }
    );
};

// ---------------- CREATE DEPARTMENT ----------------

exports.createDepartment = (req, res) => {
    const { name, head_name, budget } = req.body;

    if (!name || !name.trim()) {
        return res.status(400).json({ message: "Department name is required" });
    }

    db.query(
        `INSERT INTO departments (name, head_name, budget) VALUES (?, ?, ?)`,
        [name.trim(), head_name || null, budget || null],
        (err, result) => {
            if (err) {
                if (err.code === "ER_DUP_ENTRY") {
                    return res.status(409).json({ message: "A department with this name already exists" });
                }
                console.log("CREATE DEPARTMENT ERROR:", err);
                return res.status(500).json(err);
            }
            res.status(201).json({ message: "Department created", id: result.insertId });
        }
    );
};

// ---------------- UPDATE DEPARTMENT ----------------

exports.updateDepartment = (req, res) => {
    const { id } = req.params;
    const { name, head_name, budget } = req.body;

    if (!name || !name.trim()) {
        return res.status(400).json({ message: "Department name is required" });
    }

    db.query(
        `UPDATE departments SET name=?, head_name=?, budget=? WHERE id=?`,
        [name.trim(), head_name || null, budget || null, id],
        (err) => {
            if (err) {
                if (err.code === "ER_DUP_ENTRY") {
                    return res.status(409).json({ message: "A department with this name already exists" });
                }
                console.log("UPDATE DEPARTMENT ERROR:", err);
                return res.status(500).json(err);
            }
            res.json({ message: "Department updated" });
        }
    );
};