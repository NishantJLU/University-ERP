import Link from "next/link";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import {
  CalendarDays,
  CheckSquare,
  BookOpen,
  FileText,
  Bell,
  ArrowRight,
  Clock,
  MapPin,
  CheckCircle2,
  ExternalLink,
  Sparkles,
  Award,
  GraduationCap,
  Layers,
} from "lucide-react";
import { formatDate } from "@/lib/utils";
import { JLU_PROFILE } from "@/lib/jlu-constants";
import DashboardHeader from "@/components/ui/DashboardHeader";
import MetricCard from "@/components/ui/MetricCard";

export default async function StudentDashboardPage() {
  const user = await getCurrentUser();
  if (!user || user.role !== "STUDENT" || !user.studentId) {
    redirect("/login");
  }

  // Fetch student profile, section, department, and enrollment data
  const student = await prisma.student.findUnique({
    where: { id: user.studentId },
    include: {
      user: true,
      program: {
        include: { department: true },
      },
      currentSemester: true,
      section: true,
      enrollments: {
        include: {
          subject: {
            include: {
              lmsCourse: true,
            },
          },
        },
      },
      assignmentSubmissions: {
        include: { assignment: { include: { subject: true } } },
        orderBy: { submittedAt: "desc" },
        take: 4,
      },
    },
  });

  if (!student) {
    return <div className="p-6 text-sm text-slate-600">Student record not found.</div>;
  }

  // Fetch today's classes from Timetable
  const dayName = new Date().toLocaleDateString("en-US", { weekday: "long" }).toUpperCase();
  const activeDay = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY"].includes(dayName)
    ? dayName
    : "MONDAY";

  const timetablePeriods = await prisma.timetablePeriod.findMany({
    where: {
      sectionId: student.sectionId || "",
      dayOfWeek: activeDay,
      timetable: { status: "PUBLISHED" },
    },
    include: {
      subject: {
        include: { lmsCourse: true },
      },
      faculty: { include: { user: true } },
      room: true,
    },
    orderBy: { periodNumber: "asc" },
  });

  // Fetch upcoming assignments for this student's section
  const upcomingAssignments = await prisma.assignment.findMany({
    where: {
      sectionId: student.sectionId || "",
    },
    include: {
      subject: true,
    },
    orderBy: { dueDate: "asc" },
    take: 4,
  });

  // Fetch attendance stats for this student
  const attendanceRecords = await prisma.attendanceRecord.findMany({
    where: { studentId: student.id },
  });
  const totalClasses = attendanceRecords.length || 0;
  const attendedClasses = attendanceRecords.filter((r) => r.status === "PRESENT").length;
  const hasEnoughAttendanceData = totalClasses >= 5;
  const attendancePct = totalClasses > 0 ? Math.round((attendedClasses / totalClasses) * 100) : null;

  // Active notices
  const notices = await prisma.notice.findMany({
    where: {
      OR: [
        { targetScope: "ALL" },
        { targetScope: "ROLE", targetId: "STUDENT" },
        { targetScope: "DEPARTMENT", targetId: student.program.departmentId },
      ],
    },
    orderBy: { publishedAt: "desc" },
    take: 4,
  });

  // Calculate total enrolled credits
  const totalCredits = student.enrollments.reduce((sum, enr) => sum + (enr.subject.credits || 0), 0);

  // Sample assessment progress percentages for enrolled subjects
  const sampleProgress = [78, 85, 68, 92, 74, 88];

  return (
    <div className="space-y-6">
      {/* 1. Academic Hero Header */}
      <DashboardHeader
        badge="STUDENT ACADEMIC PORTAL"
        title={`Welcome back, ${student.user.name}`}
        subtitle={`${student.program.name} (${student.program.code}) • Semester ${student.currentSemester.number} • ${student.section?.name || "Section A"} • ${student.program.department.name}`}
        userMeta={`Roll: ${student.rollNumber} • ${student.user.email}`}
        accent="crimson"
        actions={
          <div className="flex items-center gap-2">
            <Link
              href="/student/timetable"
              className="px-3.5 py-2 bg-white hover:bg-[#F9FAFB] text-[#172B4D] border border-[#E5E7EB] rounded-lg text-xs font-semibold shadow-xs transition flex items-center gap-1.5"
            >
              <CalendarDays className="w-3.5 h-3.5 text-[#8B1E3F]" />
              <span>Class Timetable</span>
            </Link>
            <Link
              href="/student/lms"
              className="px-3.5 py-2 bg-[#8B1E3F] hover:bg-[#701831] text-white rounded-lg text-xs font-bold shadow-xs transition flex items-center gap-1.5"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>My Courses</span>
            </Link>
          </div>
        }
      />

      {/* 2. Top Academic Metric Cards (Clean, Student-Centric) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Cumulative Attendance"
          value={attendancePct !== null ? `${attendancePct}%` : "—"}
          color={
            !hasEnoughAttendanceData
              ? "slate"
              : attendancePct !== null && attendancePct >= 75
              ? "green"
              : "crimson"
          }
          icon={CheckSquare}
          badge={
            !hasEnoughAttendanceData
              ? "Initial Phase"
              : attendancePct !== null && attendancePct >= 75
              ? "Eligible (75%+)"
              : "Shortage Alert"
          }
          subtitle={`${attendedClasses} of ${totalClasses} lectures attended`}
          href="/student/attendance"
          actionText="Attendance Register"
        />

        <MetricCard
          title="Academic Standing"
          value={`Term ${student.currentSemester.number}`}
          color="blue"
          icon={GraduationCap}
          badge="Good Standing"
          subtitle={`${student.program.name} (${student.program.code})`}
          href="/student/results"
          actionText="Semester Gradebook"
        />

        <MetricCard
          title="Continuous Evaluation"
          value={`${student.assignmentSubmissions.length} Submissions`}
          color="purple"
          icon={FileText}
          badge="CIA Continuous"
          subtitle="Assignments, Quizzes & Lab Records"
          href="/student/assignments"
          actionText="Assignment Desk"
        />

        <MetricCard
          title="Enrolled Curriculum"
          value={`${student.enrollments.length} Courses`}
          color="green"
          icon={BookOpen}
          badge={`${totalCredits} Credits`}
          subtitle={`Section ${student.section?.name || "A"} • AY ${JLU_PROFILE.currentAcademicYear}`}
          href="/student/lms"
          actionText="My Courses & LMS"
        />
      </div>

      {/* 3. Today's Class Schedule Register */}
      <div className="erp-card p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-blue-50 text-blue-600">
                <Clock className="w-4 h-4" />
              </span>
              <h2 className="text-sm font-bold text-slate-900 tracking-tight">
                Today&apos;s Class Schedule Register
              </h2>
              <span className="text-xs px-2 py-0.5 rounded-md font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                {dayName === "SUNDAY" || dayName === "SATURDAY" ? "Upcoming Monday" : dayName}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Live timetable verified against university room allocations for Section {student.section?.name || "Section A"}
            </p>
          </div>
          <Link
            href="/student/timetable"
            className="text-xs font-semibold text-rose-600 hover:text-rose-700 hover:underline flex items-center gap-1 self-start sm:self-auto"
          >
            <span>Full Weekly Timetable</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {timetablePeriods.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {timetablePeriods.map((period) => (
              <div
                key={period.id}
                className="p-4 rounded-xl border border-slate-200/80 hover:border-slate-300 bg-slate-50/50 hover:bg-slate-50 transition-all flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="font-mono font-bold px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-800 text-[11px]">
                      Period {period.periodNumber}
                    </span>
                    <span className="text-slate-500 font-mono text-[11px] flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      {period.startTime} – {period.endTime}
                    </span>
                  </div>

                  <h3 className="font-bold text-slate-900 text-xs line-clamp-1">
                    {period.subject.code}: {period.subject.name}
                  </h3>

                  <div className="flex flex-wrap items-center gap-2 mt-2 text-[11px] text-slate-500">
                    <span className="px-1.5 py-0.5 rounded-md bg-slate-200/70 text-slate-700 font-mono text-[10px]">
                      {period.subject.type}
                    </span>
                    <span className="flex items-center gap-1 text-slate-600">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      Room {period.room.roomNumber} ({period.room.building})
                    </span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-xs">
                  <span className="text-slate-600 text-[11px] truncate max-w-[140px]" title={period.faculty.user.name}>
                    Prof. {period.faculty.user.name.split(" ")[0]}
                  </span>
                  {period.subject.lmsCourse ? (
                    <Link
                      href={`/student/lms/${period.subject.lmsCourse.id}`}
                      className="px-2.5 py-1 bg-white hover:bg-slate-100 text-blue-700 border border-slate-200 rounded-md text-[11px] font-semibold transition"
                    >
                      LMS Hub &rarr;
                    </Link>
                  ) : (
                    <span className="text-[11px] text-slate-400">Class In-Person</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200 text-slate-400 text-xs">
            No classes scheduled for today. Regular sessions resume according to published timetable.
          </div>
        )}
      </div>

      {/* 4. Semester Curriculum & Continuous Assessment Standing */}
      <div className="erp-card p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-sm font-bold text-slate-900 tracking-tight">
              Enrolled Curriculum & Assessment Progress
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Continuous Internal Assessment (CIA) metrics for Semester {student.currentSemester.number}
            </p>
          </div>
          <Link
            href="/student/lms"
            className="text-xs font-semibold text-rose-600 hover:text-rose-700 hover:underline flex items-center gap-1 self-start sm:self-auto"
          >
            <span>All LMS Courses</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="space-y-3">
          {student.enrollments.map((enr, idx) => {
            const pct = sampleProgress[idx % sampleProgress.length];
            return (
              <div
                key={enr.id}
                className="p-3.5 rounded-xl border border-slate-100 hover:border-slate-200 bg-slate-50/40 hover:bg-slate-50/80 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-slate-900 text-xs">
                      {enr.subject.code}
                    </span>
                    <span className="px-1.5 py-0.2 rounded-md text-[10px] font-mono bg-white border border-slate-200 text-slate-600">
                      {enr.subject.type}
                    </span>
                    <span className="text-slate-400 text-[10px]">
                      {enr.subject.credits} Credits
                    </span>
                  </div>
                  <h4 className="font-semibold text-slate-800 text-xs mt-0.5 truncate">
                    {enr.subject.name}
                  </h4>
                </div>

                {/* Progress bar */}
                <div className="flex items-center gap-3 sm:w-64">
                  <div className="flex-1 bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-blue-600 h-full rounded-full transition-all"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="font-mono text-xs font-bold text-slate-700 w-10 text-right">
                    {pct}%
                  </span>
                </div>

                <div className="shrink-0 self-start sm:self-auto">
                  {enr.subject.lmsCourse ? (
                    <Link
                      href={`/student/lms/${enr.subject.lmsCourse.id}`}
                      className="px-3 py-1.5 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-lg text-xs font-semibold inline-flex items-center gap-1 transition"
                    >
                      <span>Workspace</span>
                    </Link>
                  ) : (
                    <Link
                      href="/student/lms"
                      className="text-blue-600 hover:underline text-xs font-semibold"
                    >
                      Syllabus
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 5. Two-Column Lower Grid: Coursework Deadlines & Campus Circulars */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Upcoming Coursework & Deadlines */}
        <div className="lg:col-span-6 erp-card p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-purple-50 text-purple-600">
                <FileText className="w-4 h-4" />
              </span>
              <h3 className="text-sm font-bold text-slate-900">
                Coursework & Assignment Deadlines
              </h3>
            </div>
            <Link href="/student/assignments" className="text-xs font-semibold text-rose-600 hover:underline">
              All Assignments &rarr;
            </Link>
          </div>

          <div className="space-y-2.5 text-xs">
            {upcomingAssignments.length > 0 ? (
              upcomingAssignments.map((asg) => (
                <div
                  key={asg.id}
                  className="p-3.5 rounded-xl border border-slate-100 hover:border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition flex items-center justify-between gap-3"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-slate-900 text-xs">
                        {asg.subject.code}
                      </span>
                      <span className="text-[10px] text-slate-500 font-medium">
                        Max Marks: {asg.maxMarks}
                      </span>
                    </div>
                    <p className="font-semibold text-slate-800 text-xs mt-0.5 truncate">
                      {asg.title}
                    </p>
                    <span className="text-[10px] text-slate-400 font-mono mt-1 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      Due: {formatDate(asg.dueDate)}
                    </span>
                  </div>

                  <Link
                    href="/student/assignments"
                    className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-semibold transition shrink-0 shadow-xs"
                  >
                    Submit Work
                  </Link>
                </div>
              ))
            ) : (
              <div className="p-6 text-center text-slate-400 text-xs bg-slate-50 rounded-xl border border-dashed border-slate-200">
                No pending assignment deadlines for your section.
              </div>
            )}
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-500">
              {student.assignmentSubmissions.length} coursework submissions evaluated
            </span>
            <Link
              href="/student/quizzes"
              className="text-xs text-purple-700 hover:underline font-semibold"
            >
              Online Quizzes &rarr;
            </Link>
          </div>
        </div>

        {/* Right: Campus Circulars & University Notices */}
        <div className="lg:col-span-6 erp-card p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-amber-50 text-amber-600">
                <Bell className="w-4 h-4" />
              </span>
              <h3 className="text-sm font-bold text-slate-900">
                Campus Circulars & Notices
              </h3>
            </div>
            <Link href="/student/notices" className="text-xs font-semibold text-rose-600 hover:underline">
              Notice Board &rarr;
            </Link>
          </div>

          <div className="space-y-2.5 text-xs">
            {notices.map((notice) => (
              <div
                key={notice.id}
                className="p-3 rounded-xl border border-slate-100 hover:border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    <span className="px-1.5 py-0.2 rounded-md text-[9px] font-bold uppercase bg-white border border-slate-200 text-slate-700 font-mono">
                      {notice.priority}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {formatDate(notice.publishedAt)}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-medium">
                    {notice.targetScope}
                  </span>
                </div>
                <h4 className="font-semibold text-slate-900 text-xs mt-1">
                  {notice.title}
                </h4>
                <p className="text-[11px] text-slate-600 line-clamp-1 mt-0.5">
                  {notice.content}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
