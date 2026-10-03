-- ========================================================
-- Nexus HR — Database Seed Data
-- Database: nexus_hr_db
-- Engine: MySQL 8+ | InnoDB | utf8mb4
-- ========================================================

USE nexus_hr_db;

SET FOREIGN_KEY_CHECKS = 0;

-- Clean existing records to guarantee repeatable seeding
TRUNCATE TABLE audit_logs;
TRUNCATE TABLE system_settings;
TRUNCATE TABLE interviews;
TRUNCATE TABLE job_applications;
TRUNCATE TABLE candidates;
TRUNCATE TABLE jobs;
TRUNCATE TABLE messages;
TRUNCATE TABLE conversation_members;
TRUNCATE TABLE conversations;
TRUNCATE TABLE notifications;
TRUNCATE TABLE training_enrollments;
TRUNCATE TABLE training_courses;
TRUNCATE TABLE performance_goals;
TRUNCATE TABLE performance_reviews;
TRUNCATE TABLE payroll_items;
TRUNCATE TABLE payroll;
TRUNCATE TABLE tasks;
TRUNCATE TABLE employee_documents;
TRUNCATE TABLE leave_requests;
TRUNCATE TABLE leave_types;
TRUNCATE TABLE attendance;
TRUNCATE TABLE password_resets;
TRUNCATE TABLE employee_emergency_contacts;
TRUNCATE TABLE employee_skills;
TRUNCATE TABLE employee_profile;
TRUNCATE TABLE employees;
TRUNCATE TABLE departments;
TRUNCATE TABLE roles;

-- --------------------------------------------------------
-- 1. SEED ROLES
-- --------------------------------------------------------
INSERT INTO roles (id, name, description) VALUES
(1, 'admin', 'Full system administration and oversight'),
(2, 'hr', 'Human resources management and recruitment oversight'),
(3, 'employee', 'Standard employee portal access');

-- --------------------------------------------------------
-- 2. SEED DEPARTMENTS
-- --------------------------------------------------------
INSERT INTO departments (id, name, head_name, budget) VALUES
(1, 'Engineering', 'Sarah Jenkins', 450000.00),
(2, 'Human Resources', 'Priya Sharma', 180000.00),
(3, 'Sales', 'Michael Scott', 320000.00),
(4, 'Marketing', 'Elena Rostova', 210000.00),
(5, 'Finance', 'David Chen', 290000.00),
(6, 'Operations', 'Marcus Vance', 240000.00);

-- --------------------------------------------------------
-- 3. SEED DEMO USERS / EMPLOYEES
-- Passwords:
-- Admin: admin123
-- HR: hr123456
-- Employees: emp123456
-- --------------------------------------------------------
INSERT INTO employees (id, employee_id, name, email, password_hash, role, role_id, department_id, designation, phone, date_of_joining, salary, approval_status, status) VALUES
(1, 'ADM001', 'System Administrator', 'admin@nexus.com', '$2a$10$.0oUAe7.gJ6yrimJv9cHkO/e6oY7YagLkOB.C4r3hMMM8SkieA1HO', 'admin', 1, 1, 'Chief Technology Officer', '+1 (555) 019-2831', '2022-01-15', 165000.00, 'Approved', 'Active'),
(2, 'HR001', 'Priya Sharma', 'hr@nexus.com', '$2a$10$enLJi9yghQh6XpqixLcvrOENZcK8baFRJ1T8hlk8yIE8tgTZmN5sW', 'hr', 2, 2, 'Senior HR Manager', '+1 (555) 018-9201', '2022-03-01', 95000.00, 'Approved', 'Active'),
(3, 'EMP001', 'Aravind Kumar', 'emp@nexus.com', '$2a$10$4FxF7vQtFFhU9M8S7eCQuODxQEtIPzSdXfjN92EydEkWg2f8Gvifi', 'employee', 3, 1, 'Senior Frontend Developer', '+1 (555) 014-4921', '2023-02-10', 115000.00, 'Approved', 'Active'),
(4, 'EMP002', 'Sophia Martinez', 'sophia.m@nexus.com', '$2a$10$4FxF7vQtFFhU9M8S7eCQuODxQEtIPzSdXfjN92EydEkWg2f8Gvifi', 'employee', 3, 1, 'Full Stack Engineer', '+1 (555) 016-8392', '2023-05-15', 105000.00, 'Approved', 'Active'),
(5, 'EMP003', 'Liam Wilson', 'liam.w@nexus.com', '$2a$10$4FxF7vQtFFhU9M8S7eCQuODxQEtIPzSdXfjN92EydEkWg2f8Gvifi', 'employee', 3, 4, 'Growth Marketing Lead', '+1 (555) 012-7381', '2023-08-01', 88000.00, 'Approved', 'Active'),
(6, 'EMP004', 'Emily Davis', 'emily.d@nexus.com', '$2a$10$4FxF7vQtFFhU9M8S7eCQuODxQEtIPzSdXfjN92EydEkWg2f8Gvifi', 'employee', 3, 5, 'Financial Analyst', '+1 (555) 017-3829', '2023-11-20', 82000.00, 'Approved', 'Active');

-- --------------------------------------------------------
-- 4. SEED EMPLOYEE PROFILES
-- --------------------------------------------------------
INSERT INTO employee_profile (employee_id, dob, gender, address, city, state, zip_code, country, employment_type, manager, work_location) VALUES
('ADM001', '1988-06-14', 'Male', '100 Executive Way', 'San Francisco', 'CA', '94105', 'USA', 'Full Time', 'Board of Directors', 'Headquarters - SF'),
('HR001', '1991-09-23', 'Female', '452 Innovation Blvd', 'San Francisco', 'CA', '94107', 'USA', 'Full Time', 'System Administrator', 'Headquarters - SF'),
('EMP001', '1995-04-12', 'Male', '789 Tech Park Rd', 'San Jose', 'CA', '95112', 'USA', 'Full Time', 'Sarah Jenkins', 'Hybrid - SF'),
('EMP002', '1996-11-30', 'Female', '321 Bayview Terrace', 'Oakland', 'CA', '94607', 'USA', 'Full Time', 'Sarah Jenkins', 'Headquarters - SF'),
('EMP003', '1994-01-18', 'Male', '654 Market Street', 'San Francisco', 'CA', '94103', 'USA', 'Full Time', 'Elena Rostova', 'Remote'),
('EMP004', '1997-07-05', 'Female', '987 Financial Plaza', 'San Francisco', 'CA', '94111', 'USA', 'Full Time', 'David Chen', 'Headquarters - SF');

-- --------------------------------------------------------
-- 5. SEED SKILLS
-- --------------------------------------------------------
INSERT INTO employee_skills (employee_id, skill_name, level) VALUES
('EMP001', 'React / Next.js', 95),
('EMP001', 'TypeScript & JavaScript', 90),
('EMP001', 'Tailwind CSS', 88),
('EMP001', 'Node.js Express', 85),
('EMP002', 'Python / Django', 90),
('EMP002', 'MySQL / PostgreSQL', 85),
('EMP002', 'Docker & Kubernetes', 80);

-- --------------------------------------------------------
-- 6. SEED EMERGENCY CONTACTS
-- --------------------------------------------------------
INSERT INTO employee_emergency_contacts (employee_id, contact_type, contact_name, relationship, phone, email) VALUES
('EMP001', 'Primary', 'Kavitha Kumar', 'Spouse', '+1 (555) 998-1234', 'kavitha@gmail.com'),
('EMP001', 'Secondary', 'Ramesh Kumar', 'Brother', '+1 (555) 998-5678', 'ramesh@gmail.com'),
('HR001', 'Primary', 'Amit Sharma', 'Spouse', '+1 (555) 887-1122', 'amit.sharma@gmail.com');

-- --------------------------------------------------------
-- 7. SEED ATTENDANCE RECORDS (Past 7 Days + Today)
-- --------------------------------------------------------
INSERT INTO attendance (employee_id, attendance_date, check_in, check_out, break_seconds, working_seconds, status) VALUES
('EMP001', CURDATE(), DATE_SUB(NOW(), INTERVAL 4 HOUR), NULL, 1800, 12600, 'Present'),
('EMP002', CURDATE(), DATE_SUB(NOW(), INTERVAL 4 HOUR), NULL, 1800, 12600, 'Present'),
('HR001', CURDATE(), DATE_SUB(NOW(), INTERVAL 5 HOUR), NULL, 1800, 16200, 'Present'),
('ADM001', CURDATE(), DATE_SUB(NOW(), INTERVAL 6 HOUR), NULL, 1800, 19800, 'Present'),
('EMP001', DATE_SUB(CURDATE(), INTERVAL 1 DAY), '2026-10-02 09:00:00', '2026-10-02 17:30:00', 3600, 27000, 'Present'),
('EMP002', DATE_SUB(CURDATE(), INTERVAL 1 DAY), '2026-10-02 09:15:00', '2026-10-02 17:45:00', 3600, 27000, 'Present'),
('EMP001', DATE_SUB(CURDATE(), INTERVAL 2 DAY), '2026-10-01 08:55:00', '2026-10-01 17:15:00', 3600, 26400, 'Present');

-- --------------------------------------------------------
-- 8. SEED LEAVE TYPES & LEAVE REQUESTS
-- --------------------------------------------------------
INSERT INTO leave_types (id, name, days_allowed, description) VALUES
(1, 'Annual Leave', 18, 'Paid annual vacation days'),
(2, 'Sick Leave', 10, 'Paid medical and health leave'),
(3, 'Casual Leave', 7, 'Short personal leave'),
(4, 'Maternity/Paternity', 90, 'Parental care leave');

INSERT INTO leave_requests (id, employee_id, leave_type, start_date, end_date, reason, status, applied_at, reviewed_by, reviewed_at) VALUES
(1, 'EMP001', 'Annual Leave', '2026-10-15', '2026-10-18', 'Family vacation trip', 'Pending', NOW(), NULL, NULL),
(2, 'EMP002', 'Sick Leave', '2026-09-20', '2026-09-21', 'Flu recovery', 'Approved', '2026-09-19 14:00:00', 'HR001', '2026-09-19 15:30:00'),
(3, 'EMP003', 'Casual Leave', '2026-11-02', '2026-11-03', 'Personal errands', 'Pending', NOW(), NULL, NULL);

-- --------------------------------------------------------
-- 9. SEED EMPLOYEE DOCUMENTS
-- --------------------------------------------------------
INSERT INTO employee_documents (id, employee_id, document_name, file_path, file_size, category, uploaded_by, status) VALUES
(1, 'EMP001', 'Employment_Contract_Aravind.pdf', '/uploads/sample_contract.pdf', 2450000, 'contract', 'HR001', 'Approved'),
(2, 'EMP001', 'Passport_Copy.pdf', '/uploads/sample_passport.pdf', 1200000, 'identification', 'EMP001', 'Approved'),
(3, 'EMP002', 'Offer_Letter_Sophia.pdf', '/uploads/offer_sophia.pdf', 1800000, 'contract', 'HR001', 'Approved');

-- --------------------------------------------------------
-- 10. SEED TASKS
-- --------------------------------------------------------
INSERT INTO tasks (id, title, description, assigned_to, created_by, due_date, priority, status, completed) VALUES
(1, 'Migrate Database Schema to MySQL 8', 'Create normalized database schema and migration scripts for nexus_hr_db.', 'EMP001', 'ADM001', '2026-10-10', 'High', 'in-progress', 0),
(2, 'Optimize React Dashboard Rendering', 'Refactor state hooks and memoize complex charts for high performance.', 'EMP001', 'HR001', '2026-10-12', 'Medium', 'todo', 0),
(3, 'Implement Security Audit Logs', 'Record sensitive administrative actions with severity and user metadata.', 'EMP002', 'ADM001', '2026-10-14', 'Urgent', 'in-progress', 0),
(4, 'Update HR Recruitment Portal', 'Connect job postings and candidate pipelines to real database APIs.', 'EMP002', 'HR001', '2026-10-20', 'High', 'todo', 0);

-- --------------------------------------------------------
-- 11. SEED PAYROLL & PAYROLL ITEMS
-- --------------------------------------------------------
INSERT INTO payroll (id, employee_id, month, basic_salary, allowances, deductions, net_salary, status, paid_on) VALUES
(1, 'EMP001', 'September 2026', 8000.00, 1500.00, 1200.00, 8300.00, 'Paid', '2026-09-30'),
(2, 'EMP002', 'September 2026', 7500.00, 1200.00, 1000.00, 7700.00, 'Paid', '2026-09-30'),
(3, 'HR001', 'September 2026', 6800.00, 1000.00, 900.00, 6900.00, 'Paid', '2026-09-30');

INSERT INTO payroll_items (payroll_id, type, label, amount) VALUES
(1, 'Earning', 'Basic Salary', 8000.00),
(1, 'Earning', 'Housing Allowance', 1000.00),
(1, 'Earning', 'Transport Allowance', 500.00),
(1, 'Deduction', 'Income Tax', 950.00),
(1, 'Deduction', 'Health Insurance', 250.00);

-- --------------------------------------------------------
-- 12. SEED PERFORMANCE REVIEWS & GOALS
-- --------------------------------------------------------
INSERT INTO performance_reviews (id, employee_id, reviewer_id, review_period, rating, feedback, strengths, areas_for_improvement, status) VALUES
(1, 'EMP001', 'HR001', 'Q3 2026', 4.8, 'Outstanding technical execution and leadership in full-stack architecture.', 'Clean code practices, problem solving, teamwork.', 'Cross-team communication documentation.', 'Completed'),
(2, 'EMP002', 'HR001', 'Q3 2026', 4.5, 'Consistently delivers backend APIs on time with strong attention to reliability.', 'Database queries, REST API design.', 'Proactive unit test coverage.', 'Completed');

INSERT INTO performance_goals (id, employee_id, title, description, target_date, progress, status) VALUES
(1, 'EMP001', 'Complete Full Stack EMS Integration', 'Connect all frontend modules to MySQL database endpoints.', '2026-10-15', 85, 'In Progress'),
(2, 'EMP001', 'Achieve 90%+ Test Coverage', 'Write comprehensive unit and integration tests across services.', '2026-11-01', 60, 'In Progress');

-- --------------------------------------------------------
-- 13. SEED TRAINING COURSES & ENROLLMENTS
-- --------------------------------------------------------
INSERT INTO training_courses (id, title, category, duration, description, instructor) VALUES
(1, 'Advanced React Patterns & State Management', 'Technical', '8h total', 'Deep dive into React custom hooks, performance optimization, and global state.', 'Dan Abramov'),
(2, 'Security Best Practices for Web Applications', 'Compliance', '3h total', 'OWASP Top 10, JWT security, SQL injection prevention, and CORS policies.', 'Troy Hunt'),
(3, 'Leadership Fundamentals for Engineers', 'Soft Skills', '4h total', 'Effective mentoring, code review etiquette, and architectural decision making.', 'Sarah Jenkins'),
(4, 'Data-Driven Decision Making', 'Analytics', '6h total', 'Using SQL aggregations and metrics to guide product development.', 'David Chen');

INSERT INTO training_enrollments (employee_id, course_id, progress, status, completion_date) VALUES
('EMP001', 1, 75, 'in progress', NULL),
('EMP001', 2, 100, 'completed', '2026-09-15'),
('EMP001', 3, 30, 'in progress', NULL),
('EMP001', 4, 0, 'not started', NULL);

-- --------------------------------------------------------
-- 14. SEED NOTIFICATIONS
-- --------------------------------------------------------
INSERT INTO notifications (id, employee_id, title, body, tag, pinned, is_read) VALUES
(1, NULL, 'Company All-Hands Meeting', 'Quarterly town hall scheduled for Friday at 10 AM PST in Main Auditorium.', 'Event', 1, 0),
(2, NULL, 'Updated Remote Work Policy', 'Please review the updated hybrid work guidelines in the document portal.', 'Policy', 1, 0),
(3, 'EMP001', 'Leave Request Update', 'Your leave request for Annual Leave is currently under review by HR.', 'HR', 0, 0),
(4, 'EMP001', 'System Maintenance Notice', 'Database maintenance scheduled for Saturday at 02:00 AM UTC.', 'IT', 0, 1);

-- --------------------------------------------------------
-- 15. SEED CONVERSATIONS, MEMBERS, & MESSAGES
-- --------------------------------------------------------
INSERT INTO conversations (id, title, is_group) VALUES
(1, 'Priya Sharma (HR)', 0),
(2, 'Engineering Team Chat', 1);

INSERT INTO conversation_members (conversation_id, employee_id) VALUES
(1, 'EMP001'),
(1, 'HR001'),
(2, 'EMP001'),
(2, 'EMP002'),
(2, 'ADM001');

INSERT INTO messages (conversation_id, sender_id, message_type, text) VALUES
(1, 'HR001', 'text', 'Hi Aravind, please make sure to upload your updated passport copy when possible.'),
(1, 'EMP001', 'text', 'Hi Priya! I have uploaded it to my documents section. Thanks!'),
(2, 'ADM001', 'text', 'Welcome team! Let us complete the nexus_hr_db database migration today.');

-- --------------------------------------------------------
-- 16. SEED RECRUITMENT — JOBS, CANDIDATES, APPLICATIONS, INTERVIEWS
-- --------------------------------------------------------
INSERT INTO jobs (id, title, department_id, department_name, location, type, experience, salary_range, status, description) VALUES
(1, 'Senior Backend Engineer', 1, 'Engineering', 'San Francisco, CA', 'Full-time', '5+ years', '$140k - $170k', 'Interviewing', 'Looking for an experienced Node.js and SQL architect to scale backend microservices.'),
(2, 'UX/UI Designer', 4, 'Marketing', 'Remote', 'Full-time', '3+ years', '$110k - $135k', 'Screening', 'Design intuitive user experiences and design systems for enterprise portals.'),
(3, 'HR Specialist', 2, 'Human Resources', 'San Francisco, CA', 'Full-time', '2+ years', '$80k - $95k', 'Active', 'Handle onboarding, employee relations, and leave management systems.');

INSERT INTO candidates (id, name, email, phone, location, experience, current_company) VALUES
(1, 'Vikram Malhotra', 'vikram.m@gmail.com', '+1 (555) 345-6789', 'San Jose, CA', '6 years', 'TechCorp Solutions'),
(2, 'Jessica Chen', 'jessica.chen@gmail.com', '+1 (555) 456-7890', 'San Francisco, CA', '4 years', 'DesignStudio Inc'),
(3, 'Marcus Thorne', 'marcus.t@gmail.com', '+1 (555) 567-8901', 'Austin, TX', '5 years', 'CloudNet Systems');

INSERT INTO job_applications (id, job_id, candidate_id, stage, match_score, notes) VALUES
(1, 1, 1, 'Interviewing', 92, 'Excellent systemic knowledge of Express and MySQL optimization.'),
(2, 2, 2, 'Screening', 88, 'Strong portfolio demonstrating Figma design system components.'),
(3, 1, 3, 'Applied', 84, 'Solid resume; scheduled for initial phone screen.');

INSERT INTO interviews (id, application_id, interviewer_id, interviewer_name, scheduled_at, round_name, status) VALUES
(1, 1, 'ADM001', 'System Administrator', '2026-10-08 14:00:00', 'System Design & Architecture', 'Scheduled');

-- --------------------------------------------------------
-- 17. SEED AUDIT LOGS
-- --------------------------------------------------------
INSERT INTO audit_logs (id, user_name, user_email, action, target, module, severity) VALUES
(1, 'System Administrator', 'admin@nexus.com', 'Database Initialization', 'nexus_hr_db', 'System', 'Info'),
(2, 'System Administrator', 'admin@nexus.com', 'Role Permission Setup', 'roles', 'Security', 'Info'),
(3, 'Priya Sharma', 'hr@nexus.com', 'Approved Employee Signup', 'EMP001', 'HR', 'Info');

-- --------------------------------------------------------
-- 18. SEED SYSTEM SETTINGS
-- --------------------------------------------------------
INSERT INTO system_settings (setting_key, setting_value) VALUES
('company_name', 'Nexus Technologies'),
('industry', 'Software & Technology'),
('headquarters', 'San Francisco, CA'),
('fiscal_year_start', 'January'),
('default_currency', 'USD'),
('work_week', 'Mon-Fri'),
('maintenance_mode', 'false'),
('email_notifications', 'true'),
('mfa_required', 'true'),
('audit_logging', 'true');

SET FOREIGN_KEY_CHECKS = 1;
