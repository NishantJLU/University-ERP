# Database Design & Entity Relationships

## Centralized Relational Data Model

The database comprises over 30 normalized tables designed around academic lifecycles:

### 1. Identity & Permissions
- `User`: Global login credentials, names, roles, contact numbers.
- `AuditLog`: Immutable history of state changes (action, entity, entityId, actorId, details JSON, IP).

### 2. Academic Hierarchy
- `Department` ➔ `Program` ➔ `AcademicYear` ➔ `Semester` ➔ `Subject` ➔ `Section`
- `Room`: Classrooms, computer laboratories, and seminar halls with seating capacities.

### 3. Faculty & Student Cohorts
- `Faculty`: Linked 1:1 with User, employee code, qualification, specialization.
- `Student`: Linked 1:1 with User, roll number, registration number, admission date.
- `Enrollment`: Links student, subject, semester, and academic year.
- `FacultyAssignment`: Allocates a teacher to a subject and section (auto-provisions LMS instructor).

### 4. Scheduling & Timetables
- `Timetable`: Header status (`DRAFT`, `SUBMITTED`, `APPROVED`, `PUBLISHED`).
- `TimetablePeriod`: Slot linking Timetable, Subject, Faculty, Room, Section, Day of Week, and Period Number.

### 5. Attendance
- `AttendanceSession`: Lecture instance with date, period, subject, section, faculty.
- `AttendanceRecord`: Status (`PRESENT`, `ABSENT`, `LATE`, `EXCUSED`) per student.

### 6. Treasury & Payments
- `FeeStructure`: Program and semester fee breakdowns (tuition, lab, library, exam).
- `StudentFeeDue`: Total and paid amounts for each student.
- `PaymentTransaction`: Transaction order, HMAC signature token, method, status (`SUCCESSFUL`, `FAILED`, `CANCELLED`).
- `Receipt`: Verifiable digital receipt with SHA-256 hash.

### 7. Learning Management System (LMS)
- `LMSCourse`: Direct 1:1 mapping with academic `Subject`.
- `CourseModule` & `Lesson`: Instructional units with video links and markdown notes.
- `Assignment` & `AssignmentSubmission`: Deadlines, grading marks, and teacher rubric feedback.
- `Quiz`, `QuizQuestion`, `QuizAttempt`: Objective questions with auto-evaluating scores.
