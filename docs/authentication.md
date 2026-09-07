# Authentication & Role-Based Access Control (RBAC)

## Authentication Mechanism

1. **Password Security**:
   Passwords are never stored in plaintext. They are hashed using **bcryptjs** with 10 salt rounds.
2. **Session Delivery**:
   Upon authentication at `/api/auth/login`, the server signs a JSON Web Token (JWT) using `process.env.JWT_SECRET` containing user metadata and role.
3. **HTTP-Only Cookies**:
   The token is stored in an `httpOnly`, `secure` (in production), `sameSite="lax"` cookie named `univ_session`. This prevents Cross-Site Scripting (XSS) extraction of session tokens.
4. **Server-Side Validation**:
   Every route checks the session server-side using `getCurrentUser()` and rejects unauthorized requests via `requireRole(["ADMIN", "TEACHER", ...], user.role)`.
   Frontend buttons are hidden appropriately, but the backend is the authoritative enforcement point.

## The 6 User Roles

- `STUDENT`: Read-only access to academic timetables, attendance %, grades, and fee records. Write access only to assignment submissions, quiz attempts, and initiating fee payments.
- `TEACHER`: Write access to class attendance registers, LMS course modules, and assignment grading.
- `HOD`: Department-scoped authority. Inspects timetable conflicts and approves/publishes schedules.
- `ACCOUNTS`: Financial desk authority. Sets fee structures, verifies payment gateway transactions, generates digital receipts, and manages reconciliation.
- `ADMIN`: University-wide administrative governance over master data, subjects, sections, faculty allocations, and system settings.
- `MANAGEMENT`: Analytical, read-only oversight across high-level institutional KPIs, financial realizations, and faculty ratios.
