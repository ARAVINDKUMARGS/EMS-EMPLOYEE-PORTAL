const db = require("../db");
const fs = require("fs");
const path = require("path");

// ---------------- HR/ADMIN: UPLOAD A DOCUMENT FOR AN EMPLOYEE ----------------

exports.uploadDocument = (req, res) => {
  const { document, category } = req.body;
  const isHrOrAdmin = ["hr", "admin"].includes(req.user.role);
  const employeeId = isHrOrAdmin && req.body.employeeId ? req.body.employeeId : req.user.employee_id;

  if (!document || !req.file) {
    return res.status(400).json({ message: "Document name and file are required" });
  }

  const filePath = `/uploads/${req.file.filename}`;
  const fileSize = req.file.size;
  const finalCategory = category || "other";

  db.query(
    `INSERT INTO employee_documents (employee_id, document_name, file_path, file_size, category, uploaded_by)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [employeeId, document, filePath, fileSize, finalCategory, req.user.employee_id],
    (err, result) => {
      if (err) {
        console.log("UPLOAD DOCUMENT ERROR:", err);
        return res.status(500).json(err);
      }
      res.status(201).json({ message: "Document uploaded successfully", id: result.insertId });
    }
  );
};

// ---------------- EMPLOYEE: VIEW MY OWN DOCUMENTS ----------------

exports.getMyDocuments = (req, res) => {
  const employeeId = req.user.employee_id;

  db.query(
    "SELECT * FROM employee_documents WHERE employee_id=? ORDER BY uploaded_at DESC",
    [employeeId],
    (err, rows) => {
      if (err) {
        console.log("GET DOCUMENTS ERROR:", err);
        return res.status(500).json(err);
      }
      res.json(rows);
    }
  );
};

// ---------------- HR/ADMIN: VIEW ANY EMPLOYEE'S DOCUMENTS ----------------

exports.getDocumentsForEmployee = (req, res) => {
  if (!["hr", "admin"].includes(req.user.role)) {
    return res.status(403).json({ message: "You don't have permission to view this" });
  }

  const { employeeId } = req.params;

  db.query(
    "SELECT * FROM employee_documents WHERE employee_id=? ORDER BY uploaded_at DESC",
    [employeeId],
    (err, rows) => {
      if (err) {
        console.log("GET EMPLOYEE DOCUMENTS ERROR:", err);
        return res.status(500).json(err);
      }
      res.json(rows);
    }
  );
};

// ---------------- HR/ADMIN: DELETE A DOCUMENT ----------------

exports.deleteDocument = (req, res) => {
  if (!["hr", "admin"].includes(req.user.role)) {
    return res.status(403).json({ message: "Only HR or Admin can delete documents" });
  }

  const { id } = req.params;

  db.query("SELECT * FROM employee_documents WHERE id=?", [id], (err, rows) => {
    if (err) {
      console.log("DELETE DOCUMENT LOOKUP ERROR:", err);
      return res.status(500).json(err);
    }
    if (rows.length === 0) {
      return res.status(404).json({ message: "Document not found" });
    }

    const filePath = path.join(__dirname, "..", rows[0].file_path);

    db.query("DELETE FROM employee_documents WHERE id=?", [id], (err) => {
      if (err) {
        console.log("DELETE DOCUMENT ERROR:", err);
        return res.status(500).json(err);
      }
      fs.unlink(filePath, () => {});
      res.json({ message: "Document deleted successfully" });
    });
  });
};