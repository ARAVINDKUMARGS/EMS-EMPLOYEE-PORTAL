# EMS — Employee Management Portal

A full-stack, production-ready Employee Management System built with **React 18**, **Node.js/Express**, and **MySQL**. Deployed on Vercel with serverless API functions (`/api`) and role-based access control (RBAC).

Live Demo: [https://ems-employee-portal.vercel.app](https://ems-employee-portal.vercel.app)
GitHub: [https://github.com/ARAVINDKUMARGS/EMS-EMPLOYEE-PORTAL](https://github.com/ARAVINDKUMARGS/EMS-EMPLOYEE-PORTAL)

---

## 🛠️ Technology Stack
- **Frontend**: React 18, Vite, React Router v6, Tailwind CSS, Recharts, Axios, Lucide Icons, Sonner.
- **Backend**: Node.js, Express, MySQL (`mysql2` pool), JWT Authentication, Bcryptjs, Multer, Nodemailer.
- **Database**: Remote / Cloud MySQL (`ems_db`), InnoDB, UTF-8.

---

## ⚙️ Local Setup Instructions

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/ARAVINDKUMARGS/EMS-EMPLOYEE-PORTAL.git
cd EMS-EMPLOYEE-PORTAL

# Install root & frontend dependencies
npm install

# Install backend dependencies
cd backend && npm install && cd ..
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
cp backend/.env.example backend/.env
```

Configure local environment in `backend/.env`:
```ini
PORT=5000
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_local_password
DB_NAME=ems_db
JWT_SECRET=your_dev_secret_key_32_characters_minimum
CLIENT_URL=http://localhost:5173
```

### 3. Database Migration & Setup
Import the complete SQL schema:
```bash
mysql -u root -p < backend/schema.sql
```
Alternatively, execute database setup script:
```bash
node backend/scripts/setupDatabase.js
```
Seed demo accounts (Admin, HR, Employee):
```bash
node backend/seedDemoData.js
```

### 4. Start Local Development
Start backend server:
```bash
cd backend && npm run dev
```
Start frontend server:
```bash
npm run dev
```
Frontend runs at `http://localhost:5173` and connects to API at `http://localhost:5000`.

---

## 🚀 Vercel Production Deployment Instructions

### 1. Repository Connection
- Import [https://github.com/ARAVINDKUMARGS/EMS-EMPLOYEE-PORTAL](https://github.com/ARAVINDKUMARGS/EMS-EMPLOYEE-PORTAL) into Vercel.
- Framework Preset: **Vite**
- Build Command: `npm run build`
- Output Directory: `dist`

### 2. Configure Production MySQL Database
Deploy a remote MySQL instance (e.g., PlanetScale, TiDB Cloud, Aiven, Railway, AWS RDS, or Clever Cloud).

### 3. Vercel Environment Variables
Add the following in Vercel **Project Settings -> Environment Variables**:

| Variable Name | Value / Purpose |
|---|---|
| `DB_HOST` | Remote MySQL host domain |
| `DB_PORT` | `3306` |
| `DB_USER` | MySQL database user |
| `DB_PASSWORD` | MySQL database password |
| `DB_NAME` | `ems_db` |
| `JWT_SECRET` | Production secret key for signing JWTs |
| `CLIENT_URL` | `https://ems-employee-portal.vercel.app` |
| `EMAIL_HOST` | `smtp.gmail.com` (for OTP emails) |
| `EMAIL_PORT` | `587` |
| `EMAIL_USER` | Sender Gmail address |
| `EMAIL_PASSWORD` | Gmail App Password |

### 4. Verify Deployment
- Visit `/api/health` endpoint: `https://ems-employee-portal.vercel.app/api/health` (should return `{ status: "ok" }`).
- Perform authentication test at `https://ems-employee-portal.vercel.app/login`.

---

## 🧪 Testing & Verification
Build verification:
```bash
npm run build
```
Backend health check:
```bash
curl http://localhost:5000/health
```

---

## ⚠️ Known Limitations & Deployment Notes
- File uploads (`uploads/`) on Vercel Serverless Functions use ephemeral filesystem storage. For long-term persistent file uploads in production, configure an S3 bucket or cloud media storage service.