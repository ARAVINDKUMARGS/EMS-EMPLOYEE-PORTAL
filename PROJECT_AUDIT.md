# Project Audit: Nexus HR — Employee Management System

## 1. Architecture Overview
- **Frontend Stack**: Vite + React 18 + React Router v6 + Tailwind CSS + Axios + Lucide Icons + Recharts + Sonner.
- **Backend Stack**: Node.js + Express + MySQL (`mysql2` connection pool) + JWT + Bcryptjs + Multer (file upload) + Nodemailer (OTP emails).
- **Database Target**: `nexus_hr_db` (MySQL 8+, InnoDB, `utf8mb4`).

---

## 2. Comprehensive Module Status

| Module | Status | Frontend Findings | Backend Findings | Database Findings |
|---|---|---|---|---|
| **Authentication & RBAC** | **Partially Working** | `Login.jsx`, `Signup.jsx`, `ForgotPassword.jsx`. Uses `authService.js` and `auth.js` helper. Hardcoded `http://localhost:5000/auth`. | `authController.js` handles signup, login, OTP verification, pending signup approvals. Admin/HR approvals present. | Missing explicit `roles` table, relies on ENUM in `employees`. |
| **Employee Profile & HR Employee Mgmt** | **Partially Working** | `Profile.jsx`, `Employees.jsx`. Profile tabs for personal, employment, skills, emergency contacts. | `profileController.js` handles profile fetch/update, skills CRUD, emergency contact upsert. | `employees`, `employee_profile`, `employee_skills`, `employee_emergency_contacts` exist. |
| **Departments** | **Partially Working** | `Departments.jsx` (HR) allows creating & updating departments. | `departmentsController.js` fetches departments with employee count, supports create/update. | Schema missing `head_name` and `budget` columns queried by backend controller. |
| **Attendance** | **Partially Working** | `Attendance.jsx` component handles check-in, check-out, break timer, history, summary. | `attendanceController.js` handles check-in/out, history, summary, calendar. | `attendance` table exists with `unique_employee_day` constraint. |
| **Leave Management** | **Partially Working** | `Leave.jsx` (Employee) and `LeaveApproval.jsx` (HR). Supports leave application and HR approve/reject. | `leaveController.js` handles leave submission, list, review. | `leave_requests` table exists. Missing `leave_types` master table. |
| **Documents** | **Partially Working** | `Documents.jsx` (Employee & HR views). Upload modal and preview/delete buttons. | `documentsController.js` handles Multer file uploads to `/uploads`. | Schema missing `category` and `uploaded_by` columns queried by controller. |
| **Tasks** | **Mocked / Broken** | `Tasks.jsx` uses static `tasks.js` mock data and local state. Modal adds tasks to React memory only. | **MISSING** — No task routes or controllers exist in backend. | **MISSING** — No `tasks` table in schema. |
| **Payroll** | **Mocked / Broken** | `Payroll.jsx` (Employee) uses `payrollData.js`. `Payroll.jsx` (Admin) uses `payrollData.js` & mock timer. | **MISSING** — No payroll routes or controllers in backend. | **MISSING** — No `payroll` or `payroll_items` tables in schema. |
| **Performance** | **Mocked / Broken** | `Performance.jsx` (Employee & HR) uses static mock data files (`performanceData.js`). | **MISSING** — No performance routes or controllers in backend. | **MISSING** — No `performance_reviews` or `performance_goals` tables in schema. |
| **Training** | **Mocked / Broken** | `Training.jsx` and `CourseDetails.jsx` use static `courses.js` mock data. | **MISSING** — No training routes or controllers in backend. | **MISSING** — No `training_courses` or `training_enrollments` tables in schema. |
| **Notifications** | **Mocked / Broken** | `Notifications.jsx` uses static `notificationsData.js` mock data. | **MISSING** — No notification routes or controllers in backend. | **MISSING** — No `notifications` table in schema. |
| **Chat / Messaging** | **Mocked / Broken** | `Chat.jsx` uses static `contacts.js` and `messages.js`. | **MISSING** — No chat routes, socket handler, or controllers in backend. | **MISSING** — No `conversations`, `conversation_members`, or `messages` tables. |
| **Recruitment** | **Mocked / Broken** | `Recruitment.jsx`, `JobDetails.jsx`, `CandidateDetails.jsx` use `recruitmentData.js`. "Post Job" buttons show mock toast. | **MISSING** — No recruitment routes or controllers in backend. | **MISSING** — No `jobs`, `candidates`, `job_applications`, `interviews` tables. |
| **Dashboards** | **Partially Working** | HR Dashboard calls `/hr-overview` endpoints. Employee & Admin Dashboards rely partly on mock widgets. | `hrOverviewController.js` calculates real stats for HR overview. Missing employee & admin dashboard aggregations. | Query structure works once schema is complete. |
| **Audit Logs** | **Mocked / Broken** | `AuditLogs.jsx` uses static `auditLogsData.js` mock file. | **MISSING** — No audit log recording middleware or fetch controller. | **MISSING** — No `audit_logs` table in schema. |
| **User Management** | **Mocked / Broken** | `UserManagement.jsx` (Admin) uses `userManagementData.js` static array. | `getAllEmployees` in `authController.js` exists, but User Management admin page is not connected. | Schema handles users/employees but lacks role mapping table. |
| **System Settings** | **Mocked / Broken** | `SystemSettings.jsx` uses static input defaults and mock toasts. | **MISSING** — No settings routes or controller. | **MISSING** — No `system_settings` table. |

---

## 3. Database Audit & Schema Gaps

1. **Existing SQL Schema Inconsistencies**:
   - `departments` table in `schema.sql` lacks `head_name` (`VARCHAR(100)`), `budget` (`DECIMAL(12,2)`), and `created_at`.
   - `employee_documents` table in `schema.sql` lacks `category` (`VARCHAR(50)`) and `uploaded_by` (`VARCHAR(50)`).
   - `employees` table relies on an `ENUM` role (`employee`, `hr`, `admin`). A normalized `roles` table is required to comply with database specification.
   - Financial fields (salary, budget) need `DECIMAL(12,2)` data types.

2. **Missing Database Tables Required for Full Functionality**:
   - `roles`
   - `leave_types`
   - `tasks`
   - `payroll` & `payroll_items`
   - `performance_reviews` & `performance_goals`
   - `training_courses` & `training_enrollments`
   - `notifications`
   - `conversations`, `conversation_members`, `messages`
   - `jobs`, `candidates`, `job_applications`, `interviews`
   - `audit_logs`
   - `system_settings`

---

## 4. Security & Configuration Audit
- **Hardcoded Endpoints**: Frontend services currently hardcode `http://localhost:5000/...`. Standardized centralization using `import.meta.env.VITE_API_URL` is required.
- **Backend Secrets**: `JWT_SECRET` fallback needs to be replaced with strict environment variable loading. `.env.example` must be created.
- **RBAC Middleware**: Authorization middleware needs to be applied consistently across all backend endpoints for tasks, payroll, recruitment, audit logs, etc.
- **Input Validation**: Backend endpoints must validate incoming payload parameters to prevent SQL syntax errors or orphaned data.

---

## 5. Phased Implementation Roadmap

- **PHASE 1**: Complete repository analysis (Done — `PROJECT_AUDIT.md`).
- **PHASE 2**: Create new `nexus_hr_db` relational database schema in `database/schema.sql`.
- **PHASE 3**: Create realistic seed dataset in `database/seed.sql` with hashed passwords for demo accounts.
- **PHASE 4**: Validate database structure against all SQL queries.
- **PHASE 5**: Connect backend Node.js/Express service to `nexus_hr_db` with connection pooling & environment configuration.
- **PHASE 6**: Fix authentication, JWT authorization, password hashing, and role-based access control.
- **PHASE 7**: Complete Employees and Departments modules with full CRUD capabilities.
- **PHASE 8**: Complete Attendance, Leave, and Documents modules.
- **PHASE 9**: Implement Tasks and Notifications APIs and backend controllers.
- **PHASE 10**: Implement Payroll, Performance, and Training backend services.
- **PHASE 11**: Implement Chat / Messaging persistence backend.
- **PHASE 12**: Implement Recruitment, Candidates, Applications, and Interviews APIs.
- **PHASE 13**: Connect Employee, HR, and Admin Dashboards to real aggregation endpoints.
- **PHASE 14**: Remove business mock data imports and connect frontend pages to API services.
- **PHASE 15**: Perform security audit (parameterization, RBAC, input validation).
- **PHASE 16**: Create automated tests for core workflows (Auth, Employee, Leave, Attendance, Tasks, Payroll, Recruitment).
- **PHASE 17**: Run production build verification (`npm run build`).
- **PHASE 18**: Create `database/README.md`, update `README.md`, and generate `.env.example`.
- **PHASE 19**: Complete end-to-end verification.
