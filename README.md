# Jagran Lakecity University ERP & LMS
> **"One Connected Platform for Jagran Lakecity University"**

A centralized, enterprise-grade University Management Platform and integrated Learning Management System built under the strict principle of **ONE SOURCE OF TRUTH**. Information is entered once in master records and synchronized dynamically across Timetables, Attendance, Fees, Digital Receipts, LMS courses, Continuous Evaluation, and Macro Analytics.

---

## 🏛️ Core Principles & Architecture

- **One Source of Truth**: When an administrator configures a timetable slot or assigns a faculty member to a subject, that single relational record automatically populates the **Student Timetable**, **Teacher Timetable**, **Room Booking Schedule**, **Department Timetable**, and provisions the corresponding **LMS Course Hub**.
- **Role-Based Access Control (RBAC)**: 6 primary roles with dedicated interfaces and strict server-side validation:
  1. **STUDENT**: Schedules, attendance %, fee dues with sandbox checkout, verifiable digital receipts, LMS courses, assignments, quizzes, and circulars.
  2. **TEACHER**: Teaching timetable, class attendance register, assigned student cohorts, LMS course modules, assignment grading with rubrics, and workload compliance.
  3. **HOD / DEPARTMENT ADMIN**: Department faculty and student rosters, multi-dimensional timetable conflict engine, schedule authorization/publishing, and attendance reports.
  4. **ACCOUNTS**: Fee structure configuration, student receivables, transaction logs with HMAC verification, bank reconciliation, and refund authorizations.
  5. **UNIVERSITY ADMINISTRATOR**: Master data (Departments, Programs, Semesters, Subjects, Sections, Rooms, Allocations), Timetable Builder, System Audit Trail, and Settings.
  6. **MANAGEMENT**: Executive chancellor dashboard with Recharts visualizations (Census trends, Fee Realization vs Dues, Department attendance benchmarks).

---

## 🔑 Demo Accounts & Credentials

All demo accounts share the password:
```text
password123
```

| Role | Demo Email | Persona | Key Capabilities to Test |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@demo.edu` | Dr. Alistair Vance (Registrar) | Master Data, Timetable Engine, Audit Logs, Settings |
| **HOD (CS)** | `hod@demo.edu` | Dr. Rajesh Sharma | Inspect timetable conflicts, Authorize & Publish schedule |
| **Teacher** | `teacher@demo.edu` | Dr. Vikram Rao | Today's classes, Mark Attendance, Grade assignments |
| **Student** | `student@demo.edu` | Aarav Sharma (B.Tech CSE) | Timetable, Attendance, Sandbox Fee Payment, LMS Course Hub |
| **Accounts** | `accounts@demo.edu` | Suresh Patel (Bursar) | Fee Structures, Verify transactions, Bank reconciliation |
| **Management** | `management@demo.edu` | Dr. Arvind Mehta (Chancellor) | Executive KPI analytics, Enrollment & Revenue charts |

> 💡 **Instant Role Switcher**: Use the **Role** dropdown in the top header or the 1-click launcher cards on the login page (`/login`) to toggle between any role during testing.

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js 18+ (Tested on Node v20 & v22)
- npm or yarn

### 2. Installation
```bash
cd university-erp
npm install
```

### 3. Database Initialization & Seeding
The project is configured for out-of-the-box local execution using SQLite (`dev.db`), while fully compatible with PostgreSQL.
```bash
# Push Prisma Schema to database
npx prisma db push

# Seed realistic university dataset (55 students, 10 faculty, timetables, dues, LMS)
npm run prisma:seed
```

### 4. Running the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Production Build
```bash
npm run build
npm start
```

---

## 🧪 End-to-End Workflow Testing

### TEST 1: Timetable Conflict Engine & Publication
1. Log in as **HOD** (`hod@demo.edu`).
2. Navigate to **Timetable Approvals** (`/hod/approvals`).
3. Select `BCA-3A Master Schedule [Draft]` and click **Run Conflict Engine**.
4. Click **Authorize & Publish Timetable**.
5. Switch to **Student** (`student@demo.edu`) or **Teacher** (`teacher@demo.edu`): Notice their weekly timetables automatically reflect the approved schedule!

### TEST 2: Classroom Attendance Register
1. Log in as **Teacher** (`teacher@demo.edu`).
2. Open **Mark Attendance** (`/teacher/attendance`).
3. Toggle student statuses or click **Mark All Present**, then click **Finalize & Save Class Attendance**.
4. Switch to **Student** (`student@demo.edu`) & open **Attendance** (`/student/attendance`): The aggregate percentage and session ledger update immediately!

### TEST 3: Sandbox Fee Payment with Server Verification
1. Log in as **Student** (`student@demo.edu`).
2. Navigate to **Fees & Payments** (`/student/fees`).
3. Click **Pay via Sandbox** on the pending semester due.
4. Select payment method (UPI / Card / NetBanking) & click **Proceed to Sandbox Checkout**.
5. Click **Simulate Successful Payment (Server Verified)**.
6. The server validates the cryptographic token, marks the due as paid, and issues a verified digital receipt with an immutable SHA-256 seal.
7. Switch to **Accounts** (`accounts@demo.edu`): The transaction and reconciled balance appear in real time!

### TEST 4: Canvas Simplicity & D2L Brightspace Depth LMS
1. Log in as **Student** (`student@demo.edu`) and visit **My Courses** (`/student/lms`).
2. Click **CS301: Relational Database Management Systems**.
3. View **Module 1 & 2** with lesson notes, YouTube lectures, and downloadable slides.
4. Click **Quizzes** tab: Start Quiz 1, answer objective questions, and click **Submit & Auto-Evaluate** for instant grading.
5. Click **Assignments** tab: Submit response text; switch to **Teacher** (`teacher@demo.edu`) to review and grade under `/teacher/submissions`.

---

## 📂 Project Structure

```
university-erp/
├── app/
│   ├── (auth)/login/page.tsx          # Login & 1-Click Role Switcher
│   ├── (dashboard)/
│   │   ├── layout.tsx                # Server Auth Guard
│   │   ├── DashboardClientLayout.tsx # Responsive Sidebar & Topbar
│   │   ├── admin/                    # Admin Console & Master Data
│   │   ├── student/                  # Student Portal (Timetable, Fees, LMS)
│   │   ├── teacher/                  # Faculty Portal (Attendance, Grading)
│   │   ├── hod/                      # HOD Approvals & Workload
│   │   ├── accounts/                 # Treasury, Dues & Reconciliation
│   │   └── management/               # Executive Analytics & Charts
│   └── api/                          # REST endpoints with RBAC & Audit logs
├── components/
│   ├── layout/                       # Sidebar, Header
│   ├── lms/LMSCourseHub.tsx          # Canvas + D2L Course Hub
│   ├── payment/SandboxPaymentModal.tsx # Verifiable Payment Gateway
│   └── timetable/TimetableWeeklyGrid.tsx # Central Schedule Grid
├── lib/
│   ├── auth.ts                       # JWT, Passwords, RBAC Guard
│   ├── audit.ts                      # Immutable System Audit Service
│   ├── prisma.ts                     # Prisma Database Singleton
│   └── timetable-engine.ts           # Conflict Detection Engine
├── prisma/
│   ├── schema.prisma                 # Relational Schema (30+ Entities)
│   └── seed.ts                       # Realistic University Dataset
├── docs/                             # Full Engineering Documentation
├── docker-compose.yml                # PostgreSQL Docker Service
└── README.md
```

---

## 🔒 Security Architecture
- **Password Security**: Bcrypt with salt rounds.
- **Session Security**: HTTP-only, secure, same-site session cookies with JWT verification.
- **RBAC Server Guards**: Authorization enforced on every API route and server page.
- **Financial Security**: HMAC-SHA256 signature verification for payment settlements. Zero storage of card/UPI credentials.
- **Auditability**: Every critical state change (attendance, payments, timetables, grades) writes to the `AuditLog` table with actor metadata and timestamps.
