const db = require("../db");

// ---------------- GET PROFILE (merged employees + employee_profile) ----------------

exports.getProfile = (req, res) => {
  const { employeeId } = req.params;

  if (req.user.employee_id !== employeeId && !["hr", "admin"].includes(req.user.role)) {
    return res.status(403).json({ message: "You can only view your own profile" });
  }

  db.query(
    `SELECT e.employee_id, e.name, e.email, e.phone, e.designation, e.date_of_joining, e.status,
            d.name AS department,
            p.dob, p.gender, p.address, p.city, p.state, p.zip_code, p.country,
            p.employment_type, p.manager, p.work_location
     FROM employees e
     LEFT JOIN departments d ON e.department_id = d.id
     LEFT JOIN employee_profile p ON p.employee_id = e.employee_id
     WHERE e.employee_id = ?`,
    [employeeId],
    (err, rows) => {
      if (err) {
        console.log("GET PROFILE ERROR:", err);
        return res.status(500).json(err);
      }
      if (rows.length === 0) {
        return res.status(404).json({ message: "Profile not found" });
      }
      res.json(rows[0]);
    }
  );
};

// ---------------- UPDATE PERSONAL INFO ----------------

exports.updatePersonal = (req, res) => {
  const { employeeId } = req.params;

  if (req.user.employee_id !== employeeId) {
    return res.status(403).json({ message: "You can only update your own profile" });
  }

  const { name, email, phone, dob, gender, address, city, state, zip_code, country } = req.body;

  db.query(
    "UPDATE employees SET name=?, email=?, phone=? WHERE employee_id=?",
    [name, email, phone, employeeId],
    (err) => {
      if (err) {
        console.log("UPDATE PERSONAL (employees) ERROR:", err);
        return res.status(500).json(err);
      }

      db.query(
        `INSERT INTO employee_profile (employee_id, dob, gender, address, city, state, zip_code, country)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE
           dob=VALUES(dob), gender=VALUES(gender), address=VALUES(address),
           city=VALUES(city), state=VALUES(state), zip_code=VALUES(zip_code), country=VALUES(country)`,
        [employeeId, dob || null, gender, address, city, state, zip_code, country],
        (err) => {
          if (err) {
            console.log("UPDATE PERSONAL (profile) ERROR:", err);
            return res.status(500).json(err);
          }
          res.json({ message: "Personal information saved!" });
        }
      );
    }
  );
};

// ---------------- UPDATE EMPLOYMENT INFO ----------------

exports.updateEmployment = (req, res) => {
  const { employeeId } = req.params;

  if (req.user.employee_id !== employeeId && !["hr", "admin"].includes(req.user.role)) {
    return res.status(403).json({ message: "You don't have permission to update this" });
  }

  const { designation, department, employment_type, manager, date_of_joining, work_location, status } = req.body;

  db.query(
    "SELECT id FROM departments WHERE name=?",
    [department],
    (err, deptRows) => {
      if (err) {
        console.log("EMPLOYMENT DEPT LOOKUP ERROR:", err);
        return res.status(500).json(err);
      }

      const departmentId = deptRows.length > 0 ? deptRows[0].id : null;

      db.query(
        "UPDATE employees SET designation=?, department_id=?, date_of_joining=?, status=? WHERE employee_id=?",
        [designation, departmentId, date_of_joining || null, status, employeeId],
        (err) => {
          if (err) {
            console.log("UPDATE EMPLOYMENT (employees) ERROR:", err);
            return res.status(500).json(err);
          }

          db.query(
            `INSERT INTO employee_profile (employee_id, employment_type, manager, work_location)
             VALUES (?, ?, ?, ?)
             ON DUPLICATE KEY UPDATE
               employment_type=VALUES(employment_type), manager=VALUES(manager), work_location=VALUES(work_location)`,
            [employeeId, employment_type, manager, work_location],
            (err) => {
              if (err) {
                console.log("UPDATE EMPLOYMENT (profile) ERROR:", err);
                return res.status(500).json(err);
              }
              res.json({ message: "Employment details saved!" });
            }
          );
        }
      );
    }
  );
};

// ---------------- SKILLS ----------------

exports.getSkills = (req, res) => {
  const { employeeId } = req.params;
  if (req.user.employee_id !== employeeId) {
    return res.status(403).json({ message: "You can only view your own skills" });
  }
  db.query("SELECT * FROM employee_skills WHERE employee_id=?", [employeeId], (err, rows) => {
    if (err) return res.status(500).json(err);
    res.json(rows);
  });
};

exports.addSkill = (req, res) => {
  const { employeeId } = req.params;
  if (req.user.employee_id !== employeeId) {
    return res.status(403).json({ message: "You can only edit your own skills" });
  }
  const { skill_name, level } = req.body;
  if (!skill_name) return res.status(400).json({ message: "Skill name is required" });

  db.query(
    "INSERT INTO employee_skills (employee_id, skill_name, level) VALUES (?, ?, ?)",
    [employeeId, skill_name, level || 50],
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.status(201).json({ id: result.insertId, employee_id: employeeId, skill_name, level: level || 50 });
    }
  );
};

exports.updateSkill = (req, res) => {
  const { employeeId, skillId } = req.params;
  if (req.user.employee_id !== employeeId) {
    return res.status(403).json({ message: "You can only edit your own skills" });
  }
  const { skill_name, level } = req.body;
  db.query(
    "UPDATE employee_skills SET skill_name=?, level=? WHERE id=? AND employee_id=?",
    [skill_name, level, skillId, employeeId],
    (err) => {
      if (err) return res.status(500).json(err);
      res.json({ message: "Skill updated" });
    }
  );
};

exports.deleteSkill = (req, res) => {
  const { employeeId, skillId } = req.params;
  if (req.user.employee_id !== employeeId) {
    return res.status(403).json({ message: "You can only edit your own skills" });
  }
  db.query("DELETE FROM employee_skills WHERE id=? AND employee_id=?", [skillId, employeeId], (err) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "Skill deleted" });
  });
};

// ---------------- EMERGENCY CONTACTS ----------------

exports.getEmergencyContacts = (req, res) => {
  const { employeeId } = req.params;
  if (req.user.employee_id !== employeeId) {
    return res.status(403).json({ message: "You can only view your own emergency contacts" });
  }
  db.query("SELECT * FROM employee_emergency_contacts WHERE employee_id=?", [employeeId], (err, rows) => {
    if (err) return res.status(500).json(err);
    res.json(rows);
  });
};

exports.saveEmergencyContacts = (req, res) => {
  const { employeeId } = req.params;
  if (req.user.employee_id !== employeeId) {
    return res.status(403).json({ message: "You can only edit your own emergency contacts" });
  }
  const { primary, secondary } = req.body;

  const upsert = (contact, type) =>
    new Promise((resolve, reject) => {
      db.query(
        `INSERT INTO employee_emergency_contacts (employee_id, contact_type, contact_name, relationship, phone, email)
         VALUES (?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE
           contact_name=VALUES(contact_name), relationship=VALUES(relationship), phone=VALUES(phone), email=VALUES(email)`,
        [employeeId, type, contact.name, contact.relationship, contact.phone, contact.email],
        (err) => (err ? reject(err) : resolve())
      );
    });

  Promise.all([upsert(primary, "Primary"), upsert(secondary, "Secondary")])
    .then(() => res.json({ message: "Emergency contacts saved!" }))
    .catch((err) => res.status(500).json(err));
};