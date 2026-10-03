USE ems_db;

-- =========================================================
-- DEMO WORKFORCE SEED
-- All seeded employees share the password: password123
-- (real bcrypt hash below — just for local demo/testing)
-- =========================================================

SET @pw = '$2b$10$D8LY5whl5JEx7l5mnwJAKOO1IJisacuITgrqk6q65Ybz92Fo1LLQO';

-- ---------------- EMPLOYEES ----------------

INSERT IGNORE INTO employees
(employee_id, name, email, password_hash, role, approval_status, department_id, designation, phone, date_of_joining, salary, status)
VALUES
('EMP101','Ravi Kumar','ravi.kumar@nexus.io',@pw,'employee','Approved',(SELECT id FROM departments WHERE name='Engineering'),'Software Engineer','9800000101','2023-03-14',95000,'Active'),
('EMP102','Ananya Iyer','ananya.iyer@nexus.io',@pw,'employee','Approved',(SELECT id FROM departments WHERE name='Engineering'),'Senior Engineer','9800000102','2021-07-01',125000,'Active'),
('EMP103','Karan Mehta','karan.mehta@nexus.io',@pw,'employee','Approved',(SELECT id FROM departments WHERE name='Engineering'),'QA Engineer','9800000103','2022-11-20',80000,'Active'),
('EMP104','Priya Nair','priya.nair@nexus.io',@pw,'employee','Approved',(SELECT id FROM departments WHERE name='Design'),'Product Designer','9800000104','2022-05-09',90000,'Active'),
('EMP105','Rohan Das','rohan.das@nexus.io',@pw,'employee','Approved',(SELECT id FROM departments WHERE name='Design'),'UI/UX Designer','9800000105','2023-01-16',85000,'Active'),
('EMP106','Sneha Reddy','sneha.reddy@nexus.io',@pw,'employee','Approved',(SELECT id FROM departments WHERE name='Marketing'),'Marketing Lead','9800000106','2021-09-25',88000,'Active'),
('EMP107','Vikram Joshi','vikram.joshi@nexus.io',@pw,'employee','Approved',(SELECT id FROM departments WHERE name='Marketing'),'Content Strategist','9800000107','2023-06-02',72000,'Active'),
('EMP108','Neha Verma','neha.verma@nexus.io',@pw,'employee','Approved',(SELECT id FROM departments WHERE name='Sales'),'Sales Manager','9800000108','2020-12-11',98000,'Active'),
('EMP109','Arjun Rao','arjun.rao@nexus.io',@pw,'employee','Approved',(SELECT id FROM departments WHERE name='Sales'),'Account Executive','9800000109','2023-08-30',76000,'Active'),
('HR101','Kavya Menon','kavya.menon@nexus.io',@pw,'hr','Approved',(SELECT id FROM departments WHERE name='Human Resources'),'HR Manager','9800000110','2021-02-18',92000,'Active'),
('HR102','Aditya Pillai','aditya.pillai@nexus.io',@pw,'hr','Approved',(SELECT id FROM departments WHERE name='Human Resources'),'HR Specialist','9800000111','2022-10-05',68000,'Active'),
('EMP110','Meera Krishnan','meera.krishnan@nexus.io',@pw,'employee','Approved',(SELECT id FROM departments WHERE name='Finance'),'Financial Analyst','9800000112','2022-04-13',84000,'Active'),
('EMP111','Suresh Babu','suresh.babu@nexus.io',@pw,'employee','Approved',(SELECT id FROM departments WHERE name='Finance'),'Accountant','9800000113','2023-02-27',70000,'Active'),
('EMP112','Divya Shah','divya.shah@nexus.io',@pw,'employee','Approved',(SELECT id FROM departments WHERE name='Operations'),'Operations Coordinator','9800000114','2023-05-19',74000,'Active');

-- Assign the existing demo accounts to departments too
UPDATE employees SET department_id=(SELECT id FROM departments WHERE name='Engineering') WHERE employee_id='EMP001';
UPDATE employees SET department_id=(SELECT id FROM departments WHERE name='Human Resources') WHERE employee_id='HR001';

-- ---------------- ATTENDANCE (last 10 weekdays, all seeded + demo employees) ----------------

INSERT INTO attendance (employee_id, attendance_date, check_in, check_out, break_seconds, working_seconds, status)
SELECT
    e.employee_id,
    d.attendance_date,
    TIMESTAMP(d.attendance_date, '09:15:00'),
    TIMESTAMP(d.attendance_date, '18:20:00'),
    1800,
    TIME_TO_SEC(TIMEDIFF('18:20:00','09:15:00')) - 1800,
    'Present'
FROM employees e
CROSS JOIN (
    SELECT CURDATE() - INTERVAL seq DAY AS attendance_date
    FROM (SELECT 1 seq UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5
          UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9 UNION SELECT 10) seqs
) d
WHERE (e.employee_id LIKE 'EMP1%' OR e.employee_id LIKE 'HR1%' OR e.employee_id = 'EMP001')
AND WEEKDAY(d.attendance_date) < 5
ON DUPLICATE KEY UPDATE check_in = VALUES(check_in);

-- ---------------- LEAVE REQUESTS (mix of statuses so approval flow + charts have real data) ----------------

INSERT INTO leave_requests (employee_id, leave_type, start_date, end_date, reason, status, applied_at, reviewed_by, reviewed_at) VALUES
('EMP001','Annual', DATE_SUB(CURDATE(), INTERVAL 40 DAY), DATE_SUB(CURDATE(), INTERVAL 38 DAY), 'Family trip', 'Approved', DATE_SUB(CURDATE(), INTERVAL 45 DAY), 'HR001', DATE_SUB(CURDATE(), INTERVAL 44 DAY)),
('EMP001','Sick', DATE_SUB(CURDATE(), INTERVAL 15 DAY), DATE_SUB(CURDATE(), INTERVAL 15 DAY), 'Fever', 'Approved', DATE_SUB(CURDATE(), INTERVAL 15 DAY), 'HR001', DATE_SUB(CURDATE(), INTERVAL 15 DAY)),
('EMP001','Personal', CURDATE() + INTERVAL 5 DAY, CURDATE() + INTERVAL 5 DAY, 'Personal errand', 'Pending', CURDATE(), NULL, NULL),

('EMP101','Sick', DATE_SUB(CURDATE(), INTERVAL 20 DAY), DATE_SUB(CURDATE(), INTERVAL 19 DAY), 'Flu', 'Approved', DATE_SUB(CURDATE(), INTERVAL 20 DAY), 'HR101', DATE_SUB(CURDATE(), INTERVAL 20 DAY)),
('EMP102','Annual', CURDATE() + INTERVAL 10 DAY, CURDATE() + INTERVAL 14 DAY, 'Vacation', 'Pending', CURDATE(), NULL, NULL),
('EMP104','Annual', DATE_SUB(CURDATE(), INTERVAL 60 DAY), DATE_SUB(CURDATE(), INTERVAL 56 DAY), 'Holiday trip', 'Approved', DATE_SUB(CURDATE(), INTERVAL 65 DAY), 'HR101', DATE_SUB(CURDATE(), INTERVAL 64 DAY)),
('EMP106','Personal', DATE_SUB(CURDATE(), INTERVAL 10 DAY), DATE_SUB(CURDATE(), INTERVAL 10 DAY), 'Family event', 'Rejected', DATE_SUB(CURDATE(), INTERVAL 12 DAY), 'HR101', DATE_SUB(CURDATE(), INTERVAL 11 DAY)),
('EMP108','Sick', CURDATE() + INTERVAL 2 DAY, CURDATE() + INTERVAL 2 DAY, 'Medical appointment', 'Pending', CURDATE(), NULL, NULL),
('HR101','Comp Off', DATE_SUB(CURDATE(), INTERVAL 25 DAY), DATE_SUB(CURDATE(), INTERVAL 25 DAY), 'Worked weekend', 'Approved', DATE_SUB(CURDATE(), INTERVAL 26 DAY), 'ADM001', DATE_SUB(CURDATE(), INTERVAL 25 DAY)),
('EMP110','Annual', CURDATE() + INTERVAL 7 DAY, CURDATE() + INTERVAL 9 DAY, 'Short break', 'Pending', CURDATE(), NULL, NULL);





-- Passwords (for your reference only — never store plaintext like this in real systems):
-- employee.demo@nexus.io / password
-- hr.demo@nexus.io       / hrpass123
-- admin.demo@nexus.io    / adminpass123