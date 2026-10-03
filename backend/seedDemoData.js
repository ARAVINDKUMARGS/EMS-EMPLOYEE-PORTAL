require("dotenv").config();
const mysql = require("mysql2/promise");
const bcrypt = require("bcryptjs");
const fs = require("fs");
const path = require("path");

const MINIMAL_PDF = Buffer.from(
  "%PDF-1.1\n1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj\n2 0 obj<</Type/Pages/Kids[3 0 R]/Count 1>>endobj\n3 0 obj<</Type/Page/Parent 2 0 R/MediaBox[0 0 300 150]/Resources<</Font<</F1 4 0 R>>>>/Contents 5 0 R>>endobj\n4 0 obj<</Type/Font/Subtype/Type1/BaseFont/Helvetica>>endobj\n5 0 obj<</Length 55>>stream\nBT /F1 18 Tf 20 80 Td (Sample Document) Tj ET\nendstream endobj\nxref\n0 6\n0000000000 65535 f \ntrailer<</Size 6/Root 1 0 R>>\nstartxref\n0\n%%EOF",
  "utf-8"
);

async function main() {
  const db = await mysql.createConnection({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "ems_db",
    port: process.env.DB_PORT || 3306,
  });

  console.log("Connected to database. Seeding demo data...\n");

  const uploadDir = path.join(__dirname, "uploads");
  if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

  const [depts] = await db.query("SELECT id, name FROM departments");
  const deptId = (name) => depts.find((d) => d.name === name)?.id || null;

  const demoPassword = await bcrypt.hash("password123", 10);

  // Exactly one demo account per role.
  const people = [
    {
      employee_id: "EMP101",
      name: "Rahul Kapoor",
      email: "rahul.kapoor@nexus.io",
      role: "employee",
      department: "Engineering",
      designation: "Software Engineer",
      phone: "+91 98765 43210",
    },
    {
      employee_id: "HR101",
      name: "Neha Verma",
      email: "neha.verma@nexus.io",
      role: "hr",
      department: "Human Resources",
      designation: "HR Manager",
      phone: "+91 98765 43212",
    },
    {
      employee_id: "ADM101",
      name: "Karan Mehta",
      email: "karan.mehta@nexus.io",
      role: "admin",
      department: "Operations",
      designation: "System Administrator",
      phone: "+91 98765 43213",
    },
  ];

  for (const p of people) {
    await db.query("DELETE FROM employees WHERE email = ? AND employee_id <> ?", [
      p.email,
      p.employee_id,
    ]);

    await db.query("DELETE FROM employees WHERE employee_id = ? AND email <> ?", [
      p.employee_id,
      p.email,
    ]);

    
    await db.query(
      `INSERT INTO employees (employee_id, name, email, password_hash, role, department_id, designation, phone, date_of_joining, status, approval_status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, '2023-06-01', 'Active', 'Approved')
       ON DUPLICATE KEY UPDATE
         name=VALUES(name), password_hash=VALUES(password_hash), role=VALUES(role),
         department_id=VALUES(department_id), designation=VALUES(designation), phone=VALUES(phone),
         status='Active', approval_status='Approved'`,
      [p.employee_id, p.name, p.email, demoPassword, p.role, deptId(p.department), p.designation, p.phone]
    );
    console.log(`✓ ${p.role.toUpperCase()}: ${p.name} (${p.email})`);
  }

  await db.query("DELETE FROM employee_documents WHERE employee_id = 'EMP102'");
  await db.query("DELETE FROM leave_requests WHERE employee_id = 'EMP102'");
  await db.query("DELETE FROM attendance WHERE employee_id = 'EMP102'");
  await db.query("DELETE FROM employee_profile WHERE employee_id = 'EMP102'");
  await db.query("DELETE FROM employees WHERE employee_id = 'EMP102'");

  await db.query("UPDATE employees SET approval_status='Approved' WHERE approval_status='Pending'");

  // ---------------- Profile details ----------------
  const profileExtras = {
    EMP101: {
      dob: "1996-03-14",
      gender: "Male",
      city: "Bengaluru",
      state: "Karnataka",
      country: "India",
      employment_type: "Full Time",
      manager: "Neha Verma",
      work_location: "Bengaluru HQ",
    },
  };

  for (const [empId, d] of Object.entries(profileExtras)) {
    await db.query(
      `INSERT INTO employee_profile (employee_id, dob, gender, city, state, country, employment_type, manager, work_location)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE dob=VALUES(dob), gender=VALUES(gender), city=VALUES(city), state=VALUES(state),
         country=VALUES(country), employment_type=VALUES(employment_type), manager=VALUES(manager), work_location=VALUES(work_location)`,
      [empId, d.dob, d.gender, d.city, d.state, d.country, d.employment_type, d.manager, d.work_location]
    );
  }
  console.log("✓ Profile details added");

  // ---------------- Skills ----------------
await db.query("DELETE FROM employee_skills WHERE employee_id = 'EMP101'");
const skills = [
  ["EMP101", "JavaScript", 85],
  ["EMP101", "React", 80],
  ["EMP101", "Node.js", 70],
  ["EMP101", "SQL", 65],
];
for (const [empId, skillName, level] of skills) {
  await db.query(
    `INSERT INTO employee_skills (employee_id, skill_name, level) VALUES (?, ?, ?)`,
    [empId, skillName, level]
  );
}
console.log("✓ Skills added");

// ---------------- Emergency Contacts ----------------
await db.query("DELETE FROM employee_emergency_contacts WHERE employee_id = 'EMP101'");
const contacts = [
  ["EMP101", "Primary", "Anjali Kapoor", "Spouse", "+91 98765 11111", "anjali.kapoor@example.com"],
  ["EMP101", "Secondary", "Rakesh Kapoor", "Father", "+91 98765 22222", "rakesh.kapoor@example.com"],
];
for (const [empId, type, name, relation, phone, email] of contacts) {
  await db.query(
    `INSERT INTO employee_emergency_contacts (employee_id, contact_type, contact_name, relationship, phone, email)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [empId, type, name, relation, phone, email]
  );
}
console.log("✓ Emergency contacts added");

  // ---------------- Attendance (last 7 workdays) ----------------
  await db.query("DELETE FROM attendance WHERE employee_id = 'EMP101'");

  const today = new Date();
  let daysAdded = 0;
  let offset = 0;
  while (daysAdded < 7) {
    const d = new Date(today);
    d.setDate(d.getDate() - offset);
    offset++;
    const dow = d.getDay();
    if (dow === 0 || dow === 6) continue; // skip weekends
    const dateStr = d.toISOString().slice(0, 10);

    const checkIn = new Date(`${dateStr}T09:05:00`);
    const checkOut = new Date(`${dateStr}T18:10:00`);
    const workingSeconds = Math.floor((checkOut - checkIn) / 1000) - 1800;
    await db.query(
      `INSERT INTO attendance (employee_id, attendance_date, check_in, check_out, break_seconds, working_seconds, status)
       VALUES (?, ?, ?, ?, 1800, ?, 'Present')`,
      [
        "EMP101",
        dateStr,
        checkIn.toISOString().slice(0, 19).replace("T", " "),
        checkOut.toISOString().slice(0, 19).replace("T", " "),
        workingSeconds,
      ]
    );
    daysAdded++;
  }
  console.log("✓ Attendance history added (last 7 workdays)");

  // ---------------- Leave requests ----------------
  await db.query("DELETE FROM leave_requests WHERE employee_id = 'EMP101'");

  const leaveRows = [
    ["EMP101", "Annual Leave", "2026-06-10", "2026-06-12", "Family trip", "Approved", "HR101"],
    ["EMP101", "Sick Leave", "2026-07-02", "2026-07-02", "Fever", "Approved", "HR101"],
  ];
  for (const row of leaveRows) {
    await db.query(
      `INSERT INTO leave_requests (employee_id, leave_type, start_date, end_date, reason, status, reviewed_by, reviewed_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ${row[5] === "Pending" ? "NULL" : "NOW()"})`,
      row
    );
  }
  console.log("✓ Leave requests added");

  // ---------------- Documents ----------------
  await db.query("DELETE FROM employee_documents WHERE employee_id = 'EMP101'");

  const docSets = [
    { empId: "EMP101", name: "Employment Contract.pdf", category: "contract" },
    { empId: "EMP101", name: "Offer Letter.pdf", category: "offer" },
    { empId: "EMP101", name: "June 2026 Payslip.pdf", category: "payslip" },
  ];

  for (const doc of docSets) {
    const filename = `${Date.now()}-${Math.round(Math.random() * 1e9)}.pdf`;
    fs.writeFileSync(path.join(uploadDir, filename), MINIMAL_PDF);
    await db.query(
      `INSERT INTO employee_documents (employee_id, document_name, file_path, file_size, category, uploaded_by)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [doc.empId, doc.name, `/uploads/${filename}`, MINIMAL_PDF.length, doc.category, doc.empId]
    );
  }
  console.log("✓ Sample documents added");

  await db.end();

  console.log("\n=== Demo data seeded successfully ===\n");
  console.log("Login credentials (password for all: password123):");
  console.log("  Employee: rahul.kapoor@nexus.io");
  console.log("  HR:       neha.verma@nexus.io");
  console.log("  Admin:    karan.mehta@nexus.io");
}

main().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});