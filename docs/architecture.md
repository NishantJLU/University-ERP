# University ERP & LMS: System Architecture

## Architectural Philosophy: One Source of Truth

Traditional university administration suffers from data silos: the examination cell maintains one database, the accounts department maintains another, the timetable committee keeps spreadsheets, and professors use an external third-party LMS.

In **UNIVERSITY ERP & LMS**, there is strictly **ONE SOURCE OF TRUTH**:
```
                           ┌─────────────────────────┐
                           │ Jagran Lakecity Univ DB │
                           │       (Relational)      │
                           └────────────┬────────────┘
                                        │
           ┌────────────────────────────┼────────────────────────────┐
           │                            │                            │
 ┌─────────▼─────────┐        ┌─────────▼─────────┐        ┌─────────▼─────────┐
 │ Master Curriculum │        │  Timetable Engine │        │ Financial Ledger  │
 └─────────┬─────────┘        └─────────┬─────────┘        └─────────┬─────────┘
           │                            │                            │
 ┌─────────▼─────────┐        ┌─────────▼─────────┐        ┌─────────▼─────────┐
 │   Integrated LMS  │        │ Class Attendance  │        │ Gateway & Receipt │
 └───────────────────┘        └───────────────────┘        └───────────────────┘
```

## Layered Design

1. **Presentation Layer (Next.js 14 App Router & React 18)**:
   - Server-rendered views for SEO, initial load speed, and direct data fetching.
   - Interactive Client components for interactive tables, attendance toggles, payment modal simulators, and Canvas-inspired LMS hubs.
   - Tailwind CSS design system tailored for academic enterprise UI.

2. **Domain Service & Controller Layer**:
   - `lib/auth.ts`: Session tokens, password hashing, RBAC authorization guards.
   - `lib/timetable-engine.ts`: Multi-dimensional conflict detection algorithm.
   - `lib/audit.ts`: Auditing utility recording system events with actor metadata.
   - `app/api/*`: Structured API routes validating payloads and verifying permissions.

3. **Data Access Layer (Prisma ORM)**:
   - Declarative schema in `prisma/schema.prisma`.
   - Unified foreign keys, cascading deletions, composite unique keys, and indexes for high query efficiency.
   - SQLite for instantaneous local zero-setup execution, with seamless PostgreSQL docker/production readiness.
