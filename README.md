# Nexus HR — Employee Management System

Nexus HR is a fully functional, production-ready, full-stack Employee Management System built with **React**, **Node.js/Express**, and a dedicated **MySQL** database (`nexus_hr_db`).

It features 3 distinct role-based portals — **Employee**, **HR**, and **Admin** — covering all 24 core HR operating modules with database persistence, zero hardcoded business mock data, password hashing, and role-based access control (RBAC).

---

## 🛠️ Technology Stack

- **Frontend**: React 18, Vite, React Router v6, Tailwind CSS, shadcn/ui, Recharts, Axios, Sonner.
- **Backend**: Node.js, Express, MySQL (`mysql2` connection pool), JWT Auth, Bcryptjs, Multer (file upload storage), Nodemailer (OTP emails).
- **Database**: MySQL 8.0+ (`nexus_hr_db`), InnoDB, `utf8mb4` character set.

---

## 🔑 Demo Accounts & Credentials

The system includes pre-seeded demo accounts with securely hashed passwords:

| Role | Email | Password | Scope & Permissions |
|---|---|---|---|
| **Admin** | `admin@nexus.com` | `admin123` | Complete administrative control, user approvals, audit logs, system settings, company analytics |
| **HR** | `hr@nexus.com` | `hr123456` | HR Dashboard, Employee approvals, Department management, Leave review, Recruitment pipeline |
| **Employee** | `emp@nexus.com` | `emp123456` | Personal portal, Attendance check-in/out, Leave requests, Documents, Tasks, Payroll, Training |

---

## 🚀 Fully Functional Modules

1. **Authentication & RBAC**: Signup, Login, Password Reset OTP, JWT token authorization, Admin/HR signup review workflow.
2. **Employee Management**: Profile management, skills, emergency contacts, status updates, search & filter.
3. **Department Management**: Department creation, manager assignments, budget allocations, live headcount metrics.
4. **Attendance System**: Real-time clock-in/out, break duration tracking, history, calendar views, daily/monthly summaries.
5. **Leave Management**: Leave application submission, status approval/rejection with remarks, balance tracking.
6. **Document Portal**: Multer file uploads for contracts & certificates, role-restricted downloads & deletion.
7. **Task Management**: Task creation, employee assignment, priority levels, due dates, Kanban board & list views, completion toggle.
8. **Payroll Processing**: Itemized monthly payslips, basic salary, allowances, deductions, YTD summaries, batch payroll execution.
9. **Performance Management**: Evaluation period ratings, strengths/feedback, employee performance goals & progress.
10. **Training & Certifications**: Course enrollment, learning progress bar, hours learned tracking, certificate logging.
11. **Notifications Broadcast**: Global company announcements and targeted employee alerts with pinned cards and read tracking.
12. **Chat & Messaging**: Direct messaging between employees, text and file attachments, persistent chat history.
13. **Recruitment Pipeline**: Active job postings, candidate applications, recruitment pipeline stages (Applied, Screening, Interviewing, Offer), interview scheduling.
14. **Company Dashboards**: Role-specific Employee, HR, and Admin dashboards with real database aggregations.
15. **Audit Logging**: Immutable security log recording user actions, targets, module context, and severity.
16. **System Settings**: Database configuration parameters, data backup triggers, security toggles.

---

## 🗄️ Database Architecture (`nexus_hr_db`)

The database structure is located in:
- `database/schema.sql` — Schema definition for all 28 relational tables.
- `database/seed.sql` — Realistic demo data insertion.
- `database/README.md` — Detailed table relationships and entity documentation.

### Quick Database Setup:
```bash
# 1. Create schema
mysql -u root -p < database/schema.sql

# 2. Seed development data
mysql -u root -p nexus_hr_db < database/seed.sql
```
*Alternatively, run the automated setup script:*
```bash
npm run setup-db --prefix backend
```

---

## ⚙️ Project Setup & Launch

### 1. Environment Configuration

Copy the example environment files:
```bash
cp backend/.env.example backend/.env
cp .env.example .env
```

Configure `backend/.env`:
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

### 2. Install & Start Backend API Server
```bash
cd backend
npm install
npm start
```
*Runs on `http://localhost:5000`*

### 3. Install & Start Frontend Web App
```bash
npm install
npm run dev
```
*Runs on `http://localhost:5173`*

---

## 🧪 Testing & Verification

Run automated test suite covering database connectivity, table schemas, demo account hashes, and JWT verification:
```bash
npm test --prefix backend
```

Build production bundle:
```bash
npm run build
```