const db = require("../db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { sendOtpEmail } = require("../utils/mailer");

const JWT_SECRET = process.env.JWT_SECRET || "super_secret_jwt_key_nexus_hr_2026";

// Helper for email normalization
const normalizeEmail = (email) => (email ? String(email).trim().toLowerCase() : "");

// ---------------- SIGNUP ----------------

exports.signup = async (req, res) => {
    const { name, email, password, role } = req.body;
    const cleanEmail = normalizeEmail(email);

    if (!name || !cleanEmail || !password) {
        return res.status(400).json({ message: "Name, email and password are required" });
    }

    // Admin accounts are never created via public signup — only 'employee' and 'hr' are allowed here.
    const allowedRoles = ["employee", "hr"];
    const finalRole = allowedRoles.includes(role) ? role : "employee";

    db.query(
        "SELECT id FROM employees WHERE LOWER(TRIM(email)) = LOWER(?)",
        [cleanEmail],
        async (err, rows) => {
            if (err) {
                console.error("[AUTH ERROR] Signup email check failed:", err.message);
                return res.status(500).json({ message: "Database query error during signup" });
            }

            if (rows && rows.length > 0) {
                return res.status(409).json({ message: "An account with this email already exists" });
            }

            const rolePrefix = { employee: "EMP", hr: "HR", admin: "ADM" }[finalRole];

            db.query(
                "SELECT employee_id FROM employees WHERE employee_id LIKE ? ORDER BY id DESC LIMIT 1",
                [`${rolePrefix}%`],
                async (err, prefixRows) => {
                    if (err) {
                        console.error("[AUTH ERROR] Signup ID generation query failed:", err.message);
                        return res.status(500).json({ message: "Database error generating employee ID" });
                    }

                    let nextNumber = 1;
                    if (prefixRows && prefixRows.length > 0) {
                        const lastId = prefixRows[0].employee_id;
                        const lastNumber = parseInt(lastId.replace(rolePrefix, ""), 10);
                        if (!isNaN(lastNumber)) nextNumber = lastNumber + 1;
                    }
                    const employee_id = `${rolePrefix}${String(nextNumber).padStart(3, "0")}`;

                    try {
                        const passwordHash = await bcrypt.hash(password, 10);

                        db.query(
                            `INSERT INTO employees (employee_id, name, email, password_hash, role, approval_status, status)
                             VALUES (?, ?, ?, ?, ?, 'Pending', 'Active')`,
                            [employee_id, name.trim(), cleanEmail, passwordHash, finalRole],
                            (err, result) => {
                                if (err) {
                                    console.error("[AUTH ERROR] Signup insert failed:", err.message);
                                    return res.status(500).json({ message: "Error saving new account to database" });
                                }

                                console.log(`[AUTH INFO] Account created: ${employee_id} (${cleanEmail}, role: ${finalRole})`);

                                res.status(201).json({
                                    message: finalRole === "hr"
                                        ? "Account created. An Admin needs to approve it before you can log in."
                                        : "Account created. HR or an Admin needs to approve it before you can log in.",
                                    employee_id,
                                });
                            }
                        );
                    } catch (hashErr) {
                        console.error("[AUTH ERROR] Signup password hashing exception:", hashErr.message);
                        res.status(500).json({ message: "Something went wrong creating your account" });
                    }
                }
            );
        }
    );
};

// ---------------- LOGIN ----------------

exports.login = async (req, res) => {
    const { email, password } = req.body;
    const cleanEmail = normalizeEmail(email);

    if (!cleanEmail || !password) {
        return res.status(400).json({ message: "Email and password are required" });
    }

    db.query(
        "SELECT * FROM employees WHERE LOWER(TRIM(email)) = LOWER(?)",
        [cleanEmail],
        async (err, rows) => {
            if (err) {
                console.error("[AUTH ERROR] Login database query failed:", { email: cleanEmail, error: err.message });
                return res.status(500).json({ message: "Database error during login. Please try again." });
            }

            if (!rows || rows.length === 0) {
                console.warn("[AUTH WARN] Login failed - No user record found:", { email: cleanEmail });
                return res.status(401).json({ message: "Invalid email or password" });
            }

            const employee = rows[0];

            try {
                const match = await bcrypt.compare(password, employee.password_hash);

                if (!match) {
                    console.warn("[AUTH WARN] Login failed - Password mismatch:", { email: cleanEmail, employee_id: employee.employee_id });
                    return res.status(401).json({ message: "Invalid email or password" });
                }

                if (employee.approval_status === "Pending") {
                    console.warn("[AUTH WARN] Login blocked - Pending approval:", { email: cleanEmail, employee_id: employee.employee_id });
                    return res.status(403).json({ message: "Your account is still awaiting approval." });
                }

                if (employee.approval_status === "Rejected") {
                    console.warn("[AUTH WARN] Login blocked - Account rejected:", { email: cleanEmail, employee_id: employee.employee_id });
                    return res.status(403).json({ message: "Your signup request was rejected. Contact HR/Admin for details." });
                }

                if (employee.status === "Inactive") {
                    console.warn("[AUTH WARN] Login blocked - Account inactive:", { email: cleanEmail, employee_id: employee.employee_id });
                    return res.status(403).json({ message: "Your account is inactive. Contact HR/Admin." });
                }

                const user = {
                    id: employee.id,
                    employee_id: employee.employee_id,
                    name: employee.name,
                    email: employee.email,
                    role: employee.role,
                };

                const token = jwt.sign(user, JWT_SECRET, { expiresIn: "7d" });

                console.log("[AUTH INFO] Login successful:", { employee_id: user.employee_id, email: user.email, role: user.role });

                return res.json({ message: "Login successful", token, user });

            } catch (compareErr) {
                console.error("[AUTH ERROR] Login password compare exception:", { email: cleanEmail, error: compareErr.message });
                return res.status(500).json({ message: "Something went wrong logging you in" });
            }
        }
    );
};

// ---------------- FORGOT PASSWORD: SEND OTP ----------------

exports.forgotPassword = async (req, res) => {
    const { email } = req.body;
    const cleanEmail = normalizeEmail(email);

    if (!cleanEmail) {
        return res.status(400).json({ message: "Email is required" });
    }

    db.query(
        "SELECT id FROM employees WHERE LOWER(TRIM(email)) = LOWER(?)",
        [cleanEmail],
        async (err, rows) => {
            if (err) {
                console.error("[AUTH ERROR] Forgot password check query failed:", err.message);
                return res.status(500).json({ message: "Database error during password reset request" });
            }

            if (!rows || rows.length === 0) {
                return res.json({ message: "If that email exists, a code has been sent." });
            }

            const otpCode = String(Math.floor(100000 + Math.random() * 900000));
            const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

            db.query(
                "INSERT INTO password_resets (email, otp_code, expires_at, purpose) VALUES (?, ?, ?, 'reset')",
                [cleanEmail, otpCode, expiresAt],
                async (err) => {
                    if (err) {
                        console.error("[AUTH ERROR] Forgot password insert query failed:", err.message);
                        return res.status(500).json({ message: "Database error saving OTP code" });
                    }

                    try {
                        await sendOtpEmail(cleanEmail, otpCode, "reset");
                        res.json({ message: "If that email exists, a code has been sent.", devOtp: otpCode });
                    } catch (mailErr) {
                        console.error("[AUTH ERROR] Email send failed:", mailErr.message);
                        res.json({ message: "Code generated.", devOtp: otpCode });
                    }
                }
            );
        }
    );
};

// ---------------- FORGOT PASSWORD: VERIFY OTP ----------------

exports.verifyOtp = (req, res) => {
    const { email, otp } = req.body;
    const cleanEmail = normalizeEmail(email);

    if (!cleanEmail || !otp) {
        return res.status(400).json({ message: "Email and code are required" });
    }

    db.query(
        `SELECT * FROM password_resets
         WHERE LOWER(TRIM(email)) = LOWER(?) AND otp_code=? AND verified=0
         ORDER BY id DESC LIMIT 1`,
        [cleanEmail, otp],
        (err, rows) => {
            if (err) {
                console.error("[AUTH ERROR] Verify OTP query failed:", err.message);
                return res.status(500).json({ message: "Database error verifying code" });
            }

            if (!rows || rows.length === 0) {
                return res.status(400).json({ message: "Incorrect or already-used code" });
            }

            const record = rows[0];

            if (new Date(record.expires_at) < new Date()) {
                return res.status(400).json({ message: "This code has expired. Please request a new one." });
            }

            db.query(
                "UPDATE password_resets SET verified=1 WHERE id=?",
                [record.id],
                (err) => {
                    if (err) {
                        console.error("[AUTH ERROR] Verify OTP update query failed:", err.message);
                        return res.status(500).json({ message: "Database error updating code status" });
                    }
                    res.json({ message: "Code verified" });
                }
            );
        }
    );
};

// ---------------- FORGOT PASSWORD: RESET ----------------

exports.resetPassword = async (req, res) => {
    const { email, otp, newPassword } = req.body;
    const cleanEmail = normalizeEmail(email);

    if (!cleanEmail || !otp || !newPassword) {
        return res.status(400).json({ message: "Email, code, and new password are required" });
    }

    if (newPassword.length < 4) {
        return res.status(400).json({ message: "Password must be at least 4 characters" });
    }

    db.query(
        `SELECT * FROM password_resets
         WHERE LOWER(TRIM(email)) = LOWER(?) AND otp_code=? AND verified=1
         ORDER BY id DESC LIMIT 1`,
        [cleanEmail, otp],
        async (err, rows) => {
            if (err) {
                console.error("[AUTH ERROR] Reset password check query failed:", err.message);
                return res.status(500).json({ message: "Database error checking verified reset code" });
            }

            if (!rows || rows.length === 0) {
                return res.status(400).json({ message: "Please verify your code again before resetting your password" });
            }

            try {
                const passwordHash = await bcrypt.hash(newPassword, 10);

                db.query(
                    "UPDATE employees SET password_hash=? WHERE LOWER(TRIM(email)) = LOWER(?)",
                    [passwordHash, cleanEmail],
                    (err) => {
                        if (err) {
                            console.error("[AUTH ERROR] Reset password update query failed:", err.message);
                            return res.status(500).json({ message: "Database error updating password" });
                        }
                        res.json({ message: "Password updated successfully" });
                    }
                );
            } catch (hashErr) {
                console.error("[AUTH ERROR] Reset password hash exception:", hashErr.message);
                res.status(500).json({ message: "Something went wrong resetting your password" });
            }
        }
    );
};

// ---------------- LOGIN: SEND OTP ----------------

exports.sendLoginOtp = (req, res) => {
    const { email } = req.body;
    const cleanEmail = normalizeEmail(email);

    if (!cleanEmail) {
        return res.status(400).json({ message: "Email is required" });
    }

    db.query(
        "SELECT id FROM employees WHERE LOWER(TRIM(email)) = LOWER(?)",
        [cleanEmail],
        async (err, rows) => {
            if (err) {
                console.error("[AUTH ERROR] Send login OTP check query failed:", err.message);
                return res.status(500).json({ message: "Database error checking email" });
            }

            if (!rows || rows.length === 0) {
                return res.status(404).json({ message: "No account found with that email" });
            }

            const otpCode = String(Math.floor(100000 + Math.random() * 900000));
            const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

            db.query(
                "INSERT INTO password_resets (email, otp_code, expires_at, purpose) VALUES (?, ?, ?, 'login')",
                [cleanEmail, otpCode, expiresAt],
                async (err) => {
                    if (err) {
                        console.error("[AUTH ERROR] Send login OTP insert query failed:", err.message);
                        return res.status(500).json({ message: "Database error generating login code" });
                    }

                    try {
                        await sendOtpEmail(cleanEmail, otpCode, "login");
                        res.json({ message: "Code sent to your email", devOtp: otpCode });
                    } catch (mailErr) {
                        console.error("[AUTH ERROR] Email send failed:", mailErr.message);
                        res.json({ message: "Code sent.", devOtp: otpCode });
                    }
                }
            );
        }
    );
};

// ---------------- LOGIN: VERIFY OTP ----------------

exports.verifyLoginOtp = (req, res) => {
    const { email, otp } = req.body;
    const cleanEmail = normalizeEmail(email);

    if (!cleanEmail || !otp) {
        return res.status(400).json({ message: "Email and code are required" });
    }

    db.query(
        `SELECT * FROM password_resets
         WHERE LOWER(TRIM(email)) = LOWER(?) AND otp_code=? AND purpose='login' AND verified=0
         ORDER BY id DESC LIMIT 1`,
        [cleanEmail, otp],
        (err, rows) => {
            if (err) {
                console.error("[AUTH ERROR] Verify login OTP query failed:", err.message);
                return res.status(500).json({ message: "Database error verifying login code" });
            }

            if (!rows || rows.length === 0) {
                return res.status(400).json({ message: "Incorrect or already-used code" });
            }

            const record = rows[0];

            if (new Date(record.expires_at) < new Date()) {
                return res.status(400).json({ message: "This code has expired. Please request a new one." });
            }

            db.query("UPDATE password_resets SET verified=1 WHERE id=?", [record.id], (err) => {
                if (err) {
                    console.error("[AUTH ERROR] Verify login OTP update query failed:", err.message);
                    return res.status(500).json({ message: "Database error updating login OTP" });
                }

                db.query("SELECT * FROM employees WHERE LOWER(TRIM(email)) = LOWER(?)", [cleanEmail], (err, empRows) => {
                    if (err) {
                        console.error("[AUTH ERROR] Fetch employee for OTP login failed:", err.message);
                        return res.status(500).json({ message: "Database error fetching employee details" });
                    }
                    if (!empRows || empRows.length === 0) return res.status(404).json({ message: "Account not found" });

                    const employee = empRows[0];

                    if (employee.approval_status === "Pending") {
                        return res.status(403).json({ message: "Your account is still awaiting approval." });
                    }

                    if (employee.approval_status === "Rejected") {
                        return res.status(403).json({ message: "Your signup request was rejected. Contact HR/Admin for details." });
                    }

                    if (employee.status === "Inactive") {
                        return res.status(403).json({ message: "Your account is inactive. Contact HR/Admin." });
                    }

                    const user = {
                        id: employee.id,
                        employee_id: employee.employee_id,
                        name: employee.name,
                        email: employee.email,
                        role: employee.role,
                    };
                    const token = jwt.sign(user, JWT_SECRET, { expiresIn: "7d" });

                    res.json({ message: "Login successful", token, user });
                });
            });
        }
    );
};

// ---------------- LIST PENDING SIGNUPS ----------------

exports.getPendingApprovals = (req, res) => {
    const requesterRole = req.user.role;
    const rolesVisible = requesterRole === "admin" ? ["employee", "hr"] : ["employee"];

    db.query(
        `SELECT id, employee_id, name, email, role, created_at
         FROM employees
         WHERE approval_status='Pending' AND role IN (?)
         ORDER BY created_at DESC`,
        [rolesVisible],
        (err, rows) => {
            if (err) {
                console.error("[AUTH ERROR] Get pending approvals query failed:", err.message);
                return res.status(500).json({ message: "Database error fetching pending signups" });
            }
            res.json(rows || []);
        }
    );
};

// ---------------- LIST ALL EMPLOYEES ----------------

exports.getAllEmployees = (req, res) => {
    db.query(
        `SELECT e.id, e.employee_id, e.name, e.email, e.role, e.approval_status,
                e.designation, e.phone, e.status, e.date_of_joining, e.salary, d.name AS department,
                EXISTS(
                  SELECT 1 FROM leave_requests lr
                  WHERE lr.employee_id = e.employee_id
                  AND lr.status='Approved'
                  AND CURDATE() BETWEEN lr.start_date AND lr.end_date
                ) AS on_leave_today
         FROM employees e
         LEFT JOIN departments d ON e.department_id = d.id
         ORDER BY e.created_at DESC`,
        (err, rows) => {
            if (err) {
                console.error("[AUTH ERROR] Get all employees query failed:", err.message);
                return res.status(500).json({ message: "Database error fetching employee directory" });
            }
            res.json(rows || []);
        }
    );
};

// ---------------- APPROVE / REJECT ----------------

function canReview(requesterRole, targetRole) {
    if (targetRole === "employee") return requesterRole === "hr" || requesterRole === "admin";
    if (targetRole === "hr") return requesterRole === "admin";
    return false;
}

exports.reviewSignup = (req, res) => {
    const { id } = req.params;
    const { decision } = req.body;

    if (!["Approved", "Rejected"].includes(decision)) {
        return res.status(400).json({ message: "Decision must be 'Approved' or 'Rejected'" });
    }

    db.query(
        "SELECT * FROM employees WHERE id=?",
        [id],
        (err, rows) => {
            if (err) {
                console.error("[AUTH ERROR] Review signup lookup query failed:", err.message);
                return res.status(500).json({ message: "Database error finding signup request" });
            }

            if (!rows || rows.length === 0) {
                return res.status(404).json({ message: "Signup request not found" });
            }

            const target = rows[0];

            if (target.approval_status !== "Pending") {
                return res.status(400).json({ message: "This request has already been reviewed" });
            }

            if (!canReview(req.user.role, target.role)) {
                return res.status(403).json({
                    message: target.role === "hr"
                        ? "Only an Admin can approve HR signups"
                        : "You don't have permission to review this signup"
                });
            }

            db.query(
                "UPDATE employees SET approval_status=?, approved_by=?, approved_at=NOW() WHERE id=?",
                [decision, req.user.employee_id, id],
                (err) => {
                    if (err) {
                        console.error("[AUTH ERROR] Review signup update query failed:", err.message);
                        return res.status(500).json({ message: "Database error updating signup approval status" });
                    }
                    res.json({ message: `${target.name}'s signup was ${decision.toLowerCase()}` });
                }
            );
        }
    );
};