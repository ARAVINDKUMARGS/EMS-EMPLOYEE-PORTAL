CREATE DATABASE IF NOT EXISTS ems_db;
USE ems_db;

-- ---------------- DEPARTMENTS ----------------
CREATE TABLE IF NOT EXISTS departments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE
);

INSERT IGNORE INTO departments (name) VALUES
    ('Engineering'), ('Human Resources'), ('Sales'), ('Marketing'), ('Finance'), ('Operations');

-- ---------------- EMPLOYEES / USERS ----------------
CREATE TABLE IF NOT EXISTS employees (
    id INT AUTO_INCREMENT PRIMARY KEY,
    employee_id VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('employee','hr','admin') NOT NULL DEFAULT 'employee',
    approval_status ENUM('Pending','Approved','Rejected') NOT NULL DEFAULT 'Pending',
    approved_by VARCHAR(50) NULL,
    approved_at TIMESTAMP NULL,
    department_id INT NULL,
    designation VARCHAR(100) NULL,
    phone VARCHAR(20) NULL,
    date_of_joining DATE NULL,
    status ENUM('Active','Inactive') NOT NULL DEFAULT 'Active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE SET NULL
);

-- ---------------- ATTENDANCE ----------------
CREATE TABLE IF NOT EXISTS attendance (
    id INT AUTO_INCREMENT PRIMARY KEY,
    employee_id VARCHAR(50) NOT NULL,
    attendance_date DATE NOT NULL,
    check_in DATETIME NULL,
    check_out DATETIME NULL,
    break_seconds INT DEFAULT 0,
    working_seconds INT DEFAULT 0,
    status VARCHAR(20) DEFAULT 'Present',
    UNIQUE KEY unique_employee_day (employee_id, attendance_date)
);

-- ---------------- LEAVE REQUESTS ----------------
CREATE TABLE IF NOT EXISTS leave_requests (
    id INT AUTO_INCREMENT PRIMARY KEY,
    employee_id VARCHAR(50) NOT NULL,
    leave_type VARCHAR(50) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    reason VARCHAR(500) NULL,
    status ENUM('Pending','Approved','Rejected') NOT NULL DEFAULT 'Pending',
    applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    reviewed_by VARCHAR(50) NULL,
    reviewed_at TIMESTAMP NULL
);

-- ---------------- PASSWORD RESETS ----------------
CREATE TABLE IF NOT EXISTS password_resets (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(150) NOT NULL,
    otp_code VARCHAR(6) NOT NULL,
    purpose VARCHAR(20) NOT NULL DEFAULT 'reset',
    expires_at DATETIME NOT NULL,
    verified TINYINT(1) NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ---------------- EMPLOYEE PROFILE DETAILS ----------------
CREATE TABLE IF NOT EXISTS employee_profile (
    employee_id VARCHAR(50) PRIMARY KEY,
    dob DATE NULL,
    gender VARCHAR(20) NULL,
    address VARCHAR(255) NULL,
    city VARCHAR(100) NULL,
    state VARCHAR(100) NULL,
    zip_code VARCHAR(20) NULL,
    country VARCHAR(100) NULL,
    employment_type VARCHAR(50) DEFAULT 'Full Time',
    manager VARCHAR(100) NULL,
    work_location VARCHAR(100) NULL,
    FOREIGN KEY (employee_id) REFERENCES employees(employee_id) ON DELETE CASCADE
);

-- ---------------- DOCUMENTS ----------------
CREATE TABLE IF NOT EXISTS employee_documents (
    id INT AUTO_INCREMENT PRIMARY KEY,
    employee_id VARCHAR(50) NOT NULL,
    document_name VARCHAR(150) NOT NULL,
    file_path VARCHAR(255) NOT NULL,
    file_size INT NULL,
    status ENUM('Approved','Pending','Expired') NOT NULL DEFAULT 'Pending',
    expiry_date DATE NULL,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (employee_id) REFERENCES employees(employee_id) ON DELETE CASCADE
);

-- ---------------- SKILLS & CONTACTS ----------------
CREATE TABLE IF NOT EXISTS employee_skills (
    id INT AUTO_INCREMENT PRIMARY KEY,
    employee_id VARCHAR(50) NOT NULL,
    skill_name VARCHAR(100) NOT NULL,
    level INT NOT NULL DEFAULT 50,
    FOREIGN KEY (employee_id) REFERENCES employees(employee_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS employee_emergency_contacts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    employee_id VARCHAR(50) NOT NULL,
    contact_type ENUM('Primary','Secondary') NOT NULL,
    contact_name VARCHAR(100),
    relationship VARCHAR(50),
    phone VARCHAR(20),
    email VARCHAR(150),
    FOREIGN KEY (employee_id) REFERENCES employees(employee_id) ON DELETE CASCADE,
    UNIQUE KEY unique_contact_type (employee_id, contact_type)
);

-- ---------------- TASKS ----------------
CREATE TABLE IF NOT EXISTS tasks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT NULL,
    assigned_to VARCHAR(50) NOT NULL,
    created_by VARCHAR(50) NOT NULL,
    status ENUM('Pending','In Progress','Completed') DEFAULT 'Pending',
    priority ENUM('Low','Medium','High') DEFAULT 'Medium',
    due_date DATE NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ---------------- PAYROLL ----------------
CREATE TABLE IF NOT EXISTS payroll (
    id INT AUTO_INCREMENT PRIMARY KEY,
    employee_id VARCHAR(50) NOT NULL,
    month_year VARCHAR(20) NOT NULL,
    basic_salary DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    allowances DECIMAL(10,2) DEFAULT 0.00,
    deductions DECIMAL(10,2) DEFAULT 0.00,
    net_pay DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    status ENUM('Paid','Pending','Processing') DEFAULT 'Pending',
    pay_date DATE NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ---------------- NOTIFICATIONS ----------------
CREATE TABLE IF NOT EXISTS notifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_email VARCHAR(150) NOT NULL,
    title VARCHAR(150) NOT NULL,
    message TEXT NOT NULL,
    category VARCHAR(50) DEFAULT 'General',
    is_read TINYINT(1) DEFAULT 0,
    is_pinned TINYINT(1) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ---------------- CHAT MESSAGES ----------------
CREATE TABLE IF NOT EXISTS chat_messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    sender_id VARCHAR(50) NOT NULL,
    receiver_id VARCHAR(50) NOT NULL,
    message TEXT NOT NULL,
    sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ---------------- RECRUITMENT ----------------
CREATE TABLE IF NOT EXISTS job_postings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    department VARCHAR(100) NOT NULL,
    location VARCHAR(100) DEFAULT 'Remote',
    type VARCHAR(50) DEFAULT 'Full-Time',
    status ENUM('Active','Closed') DEFAULT 'Active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS job_applicants (
    id INT AUTO_INCREMENT PRIMARY KEY,
    job_id INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL,
    role VARCHAR(100) NOT NULL,
    stage ENUM('Applied','Screening','Interview','Hired','Rejected') DEFAULT 'Applied',
    applied_date DATE DEFAULT (CURRENT_DATE),
    FOREIGN KEY (job_id) REFERENCES job_postings(id) ON DELETE CASCADE
);

-- ---------------- AUDIT LOGS ----------------
CREATE TABLE IF NOT EXISTS audit_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user VARCHAR(150) NOT NULL,
    action VARCHAR(255) NOT NULL,
    ip VARCHAR(50) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ---------------- SYSTEM SETTINGS ----------------
CREATE TABLE IF NOT EXISTS system_settings (
    setting_key VARCHAR(100) PRIMARY KEY,
    setting_value TEXT NOT NULL
);