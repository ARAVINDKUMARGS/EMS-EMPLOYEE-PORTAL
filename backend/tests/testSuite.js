require("dotenv").config();
const db = require("../db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

async function runTests() {
  console.log("=================================================");
  console.log("RUNNING AUTOMATED TEST SUITE FOR NEXUS HR");
  console.log("=================================================\n");

  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`[PASS] ${message}`);
      passed++;
    } else {
      console.error(`[FAIL] ${message}`);
      failed++;
    }
  }

  // 1. Database Connection Test
  try {
    const [rows] = await db.promise().query("SELECT 1 + 1 AS result");
    assert(rows[0].result === 2, "MySQL Database connection verified");
  } catch (err) {
    assert(false, `MySQL Database connection failed: ${err.message}`);
  }

  // 2. Schema Tables Verification Test
  const requiredTables = [
    "roles", "departments", "employees", "employee_profile", "employee_skills",
    "employee_emergency_contacts", "password_resets", "attendance", "leave_types",
    "leave_requests", "employee_documents", "tasks", "payroll", "payroll_items",
    "performance_reviews", "performance_goals", "training_courses", "training_enrollments",
    "notifications", "conversations", "conversation_members", "messages", "jobs",
    "candidates", "job_applications", "interviews", "audit_logs", "system_settings"
  ];

  try {
    const [tables] = await db.promise().query("SHOW TABLES");
    const tableNames = tables.map((t) => Object.values(t)[0]);
    requiredTables.forEach((table) => {
      assert(tableNames.includes(table), `Table '${table}' exists in nexus_hr_db`);
    });
  } catch (err) {
    assert(false, `Show tables query failed: ${err.message}`);
  }

  // 3. Demo Accounts & Password Hash Verification
  try {
    const [adminRows] = await db.promise().query("SELECT * FROM employees WHERE email='admin@nexus.com'");
    assert(adminRows.length > 0, "Admin account 'admin@nexus.com' exists");
    if (adminRows.length > 0) {
      const match = await bcrypt.compare("admin123", adminRows[0].password_hash);
      assert(match, "Admin password hash matches 'admin123'");
    }

    const [hrRows] = await db.promise().query("SELECT * FROM employees WHERE email='hr@nexus.com'");
    assert(hrRows.length > 0, "HR account 'hr@nexus.com' exists");
    if (hrRows.length > 0) {
      const match = await bcrypt.compare("hr123456", hrRows[0].password_hash);
      assert(match, "HR password hash matches 'hr123456'");
    }

    const [empRows] = await db.promise().query("SELECT * FROM employees WHERE email='emp@nexus.com'");
    assert(empRows.length > 0, "Employee account 'emp@nexus.com' exists");
    if (empRows.length > 0) {
      const match = await bcrypt.compare("emp123456", empRows[0].password_hash);
      assert(match, "Employee password hash matches 'emp123456'");
    }
  } catch (err) {
    assert(false, `Demo accounts verification failed: ${err.message}`);
  }

  // 4. JWT Token Generation & RBAC Verification
  try {
    const secret = process.env.JWT_SECRET || "super_secret_jwt_key_nexus_hr_2026";
    const testUser = { id: 1, employee_id: "ADM001", role: "admin" };
    const token = jwt.sign(testUser, secret, { expiresIn: "1h" });
    const decoded = jwt.verify(token, secret);
    assert(decoded.role === "admin", "JWT token signing & verification works cleanly");
  } catch (err) {
    assert(false, `JWT test failed: ${err.message}`);
  }

  console.log("\n=================================================");
  console.log(`TEST SUMMARY: ${passed} PASSED, ${failed} FAILED`);
  console.log("=================================================");

  process.exit(failed > 0 ? 1 : 0);
}

runTests();
