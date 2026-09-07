# Security, Auditing & Compliance Standards

## Threat Modeling & Protections

1. **SQL Injection**:
   Prevented by Prisma ORM's parameterized query engine. Raw SQL concatenation is forbidden across the codebase.
2. **Cross-Site Scripting (XSS)**:
   React natively escapes variables rendered in JSX. Session cookies are marked `httpOnly` to prevent JavaScript access.
3. **Cross-Site Request Forgery (CSRF)**:
   Session cookies use `SameSite=Lax` or `SameSite=Strict`. API mutation endpoints accept JSON bodies requiring server-authenticated authorization headers or verified session cookies.
4. **Role Escalation**:
   Server-side role guards inspect `user.role` from the verified session token on every API route and server component. Frontend UI element hiding is treated as a visual convenience, never an authorization boundary.
5. **Auditing of Sensitive Operations**:
   The `AuditLog` table stores actor metadata, action codes, entity references, IP addresses, and JSON state diffs for:
   - Timetable approvals and publications
   - Classroom attendance registrations
   - Fee invoice adjustments and payment verifications
   - Refund processing
   - User profile and permission modifications
