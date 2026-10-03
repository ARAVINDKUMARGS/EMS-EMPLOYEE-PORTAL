# Database Documentation: nexus_hr_db

## Overview
`nexus_hr_db` is a fully normalized MySQL database powering the Nexus HR Employee Management System. It manages 28 relational tables covering user authentication, employee profiles, department structures, attendance logs, leave management, document storage, task tracking, payroll processing, performance evaluations, training, notification broadcasts, persistent chat, recruitment pipelines, audit logging, and system configurations.

---

## Technical Specifications
- **DBMS**: MySQL 8.0+
- **Storage Engine**: InnoDB
- **Character Set**: `utf8mb4`
- **Collation**: `utf8mb4_unicode_ci`
- **Database Name**: `nexus_hr_db`

---

## Demo Accounts & Credentials

| Role | Name | Email | Password | Allowed Access |
|---|---|---|---|---|
| **Admin** | System Administrator | `admin@nexus.com` | `admin123` | Full access across all employee, HR, and admin settings/analytics |
| **HR** | Priya Sharma | `hr@nexus.com` | `hr123456` | HR Dashboard, Employee approvals, Department management, Leave review, Recruitment |
| **Employee** | Aravind Kumar | `emp@nexus.com` | `emp123456` | Personal portal, Check-in/out, Leave requests, Documents, Tasks, Payroll, Training |

*Note: All passwords are securely hashed using bcrypt (cost factor 10). Plaintext passwords are never stored in the database.*

---

## Installation & Setup Instructions

### 1. Prerequisites
Ensure MySQL 8+ service is running on your machine:
```bash
mysql --version
```

### 2. Run Schema Script
Import the schema into MySQL to create `nexus_hr_db` and all required tables:
```bash
mysql -u root -p < database/schema.sql
```

### 3. Run Seed Script
Populate the database with demo users, initial departments, attendance, payroll, recruitment pipelines, and audit logs:
```bash
mysql -u root -p nexus_hr_db < database/seed.sql
```

---

## Environment Variables Setup
Configure the backend `.env` file to connect to `nexus_hr_db`:
```env
PORT=5000
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=nexus_hr_db
JWT_SECRET=super_secret_jwt_key_nexus_hr_2026
CLIENT_URL=http://localhost:5173
```

---

## Database Architecture & Tables Summary

1. `roles`: Access control roles (`admin`, `hr`, `employee`).
2. `departments`: Company departments with manager heads and budgets.
3. `employees`: Core user identity, credentials, roles, department linkages, and approval statuses.
4. `employee_profile`: Personal information, address, manager, and employment terms.
5. `employee_skills`: Employee skill records and proficiency ratings.
6. `employee_emergency_contacts`: Primary and secondary emergency contact details.
7. `password_resets`: One-time OTP verification codes for login and password reset.
8. `attendance`: Daily clock-in, clock-out, break duration, and calculated working hours.
9. `leave_types`: Configured leave categories (Annual, Sick, Casual, Parental).
10. `leave_requests`: Employee leave applications, date ranges, reasons, and review status.
11. `employee_documents`: Metadata and file paths for uploaded contracts and certificates.
12. `tasks`: Employee task assignments, priorities, due dates, and completion status.
13. `payroll`: Monthly salary slips, gross salary, total deductions, net pay, and payment dates.
14. `payroll_items`: Itemized earnings and deductions associated with a payroll slip.
15. `performance_reviews`: Evaluation period ratings, manager feedback, and strengths.
16. `performance_goals`: Target performance milestones and completion percentages.
17. `training_courses`: Available learning modules, duration, and instructor details.
18. `training_enrollments`: Employee course progress and completion status.
19. `notifications`: Announcement broadcasts and targeted employee alerts.
20. `conversations`: Chat channels (direct message or group chat).
21. `conversation_members`: Members belonging to each chat conversation.
22. `messages`: Text and attachment chat messages.
23. `jobs`: Recruitment job postings, departments, experience, and salary ranges.
24. `candidates`: Candidate profiles, contact details, and resume paths.
25. `job_applications`: Candidate applications to jobs with recruitment stage pipeline.
26. `interviews`: Scheduled interview rounds, interviewers, ratings, and feedback.
27. `audit_logs`: Immutable audit trail recording user actions, targets, and severity.
28. `system_settings`: Key-value store for application configurations.

---

## Troubleshooting

- **Error: Unknown database 'nexus_hr_db'**: Make sure to run `database/schema.sql` first before seeding or starting the Node backend.
- **Error: Access denied for user 'root'**: Double-check `DB_USER` and `DB_PASSWORD` in `backend/.env`.
- **Foreign Key Constraint Failures**: Seeding disables FK checks temporarily with `SET FOREIGN_KEY_CHECKS = 0;`. Do not modify foreign key IDs manually without updating parent records.
