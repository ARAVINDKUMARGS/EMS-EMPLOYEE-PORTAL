chema · SQL
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
-- One table serves both as the login identity and the employee profile record.
 
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
    FOREIGN KEY (department_id) REFERENCES departments(id)
);
 
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
 
-- ---------------- PASSWORD RESET OTPS ----------------
 
CREATE TABLE IF NOT EXISTS password_resets (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(150) NOT NULL,
    otp_code VARCHAR(6) NOT NULL,
    purpose VARCHAR(20) NOT NULL DEFAULT 'reset',
    expires_at DATETIME NOT NULL,
    verified TINYINT(1) NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ---------------- EXTENDED PROFILE DETAILS ----------------

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
    FOREIGN KEY (employee_id) REFERENCES employees(employee_id)
);

-- ---------------- EMPLOYEE DOCUMENTS ----------------

CREATE TABLE IF NOT EXISTS employee_documents (
    id INT AUTO_INCREMENT PRIMARY KEY,
    employee_id VARCHAR(50) NOT NULL,
    document_name VARCHAR(150) NOT NULL,
    file_path VARCHAR(255) NOT NULL,
    file_size INT NULL,
    status ENUM('Approved','Pending','Expired') NOT NULL DEFAULT 'Pending',
    expiry_date DATE NULL,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (employee_id) REFERENCES employees(employee_id)
);

ALTER TABLE password_resets ADD COLUMN purpose VARCHAR(20) NOT NULL DEFAULT 'reset';


CREATE TABLE IF NOT EXISTS employee_skills (
    id INT AUTO_INCREMENT PRIMARY KEY,
    employee_id VARCHAR(50) NOT NULL,
    skill_name VARCHAR(100) NOT NULL,
    level INT NOT NULL DEFAULT 50,
    FOREIGN KEY (employee_id) REFERENCES employees(employee_id)
);

CREATE TABLE IF NOT EXISTS employee_emergency_contacts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    employee_id VARCHAR(50) NOT NULL,
    contact_type ENUM('Primary','Secondary') NOT NULL,
    contact_name VARCHAR(100),
    relationship VARCHAR(50),
    phone VARCHAR(20),
    email VARCHAR(150),
    FOREIGN KEY (employee_id) REFERENCES employees(employee_id),
    UNIQUE KEY unique_contact_type (employee_id, contact_type)
);
-- Optional: quick test row so you can confirm the API works immediately
-- INSERT INTO attendance (employee_id, attendance_date, status) VALUES ('EMP001', CURDATE(), 'Present');