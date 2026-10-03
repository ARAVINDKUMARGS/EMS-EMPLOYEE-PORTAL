const db = require("../db");

// ---------------- APPLY FOR LEAVE (employee) ----------------

exports.applyLeave = (req, res) => {

    const { employee_id: rawId, leave_type, start_date, end_date, reason } = req.body;
    const employee_id = String(rawId || "");

    if (!employee_id || !leave_type || !start_date || !end_date) {
        return res.status(400).json({ message: "employee_id, leave_type, start_date and end_date are required" });
    }

    if (new Date(end_date) < new Date(start_date)) {
        return res.status(400).json({ message: "End date can't be before start date" });
    }

    db.query(
        `INSERT INTO leave_requests (employee_id, leave_type, start_date, end_date, reason)
         VALUES (?, ?, ?, ?, ?)`,
        [employee_id, leave_type, start_date, end_date, reason || null],
        (err, result) => {
            if (err) {
                console.log("APPLY LEAVE ERROR:", err);
                return res.status(500).json(err);
            }
            res.status(201).json({ message: "Leave request submitted", id: result.insertId });
        }
    );
};

// ---------------- MY LEAVE REQUESTS (employee) ----------------

exports.getMyLeaves = (req, res) => {

    const employee_id = String(req.params.employeeId);

    db.query(
        `SELECT * FROM leave_requests WHERE employee_id=? ORDER BY applied_at DESC`,
        [employee_id],
        (err, rows) => {
            if (err) {
                console.log("GET MY LEAVES ERROR:", err);
                return res.status(500).json(err);
            }
            res.json(rows);
        }
    );
};

// ---------------- ALL LEAVE REQUESTS (HR/Admin) ----------------

exports.getAllLeaves = (req, res) => {

    db.query(
        `SELECT lr.*, e.name AS employee_name, e.employee_id AS emp_id
         FROM leave_requests lr
         LEFT JOIN employees e ON lr.employee_id = e.employee_id
         ORDER BY lr.applied_at DESC`,
        (err, rows) => {
            if (err) {
                console.log("GET ALL LEAVES ERROR:", err);
                return res.status(500).json(err);
            }
            res.json(rows);
        }
    );
};

// ---------------- REVIEW LEAVE REQUEST (HR/Admin) ----------------

exports.reviewLeave = (req, res) => {

    const { id } = req.params;
    const { decision } = req.body; // "Approved" or "Rejected"

    if (!["Approved", "Rejected"].includes(decision)) {
        return res.status(400).json({ message: "Decision must be 'Approved' or 'Rejected'" });
    }

    db.query(
        `SELECT * FROM leave_requests WHERE id=?`,
        [id],
        (err, rows) => {
            if (err) {
                console.log("REVIEW LEAVE LOOKUP ERROR:", err);
                return res.status(500).json(err);
            }

            if (rows.length === 0) {
                return res.status(404).json({ message: "Leave request not found" });
            }

            if (rows[0].status !== "Pending") {
                return res.status(400).json({ message: "This request has already been reviewed" });
            }

            db.query(
                `UPDATE leave_requests
                 SET status=?, reviewed_by=?, reviewed_at=NOW()
                 WHERE id=?`,
                [decision, req.user.employee_id, id],
                (err) => {
                    if (err) {
                        console.log("REVIEW LEAVE UPDATE ERROR:", err);
                        return res.status(500).json(err);
                    }
                    res.json({ message: `Leave request ${decision.toLowerCase()}` });
                }
            );
        }
    );
};