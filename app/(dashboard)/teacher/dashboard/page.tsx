import Link from "next/link";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import {
  CalendarDays,
  CheckSquare,
  BookOpen,
  Award,
  Users,
  Clock,
  MapPin,
  Briefcase,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Layers,
  GraduationCap,
} from "lucide-react";
import { formatDate } from "@/lib/utils";
import { JLU_PROFILE } from "@/lib/jlu-constants";
import DashboardHeader from "@/components/ui/DashboardHeader";
import MetricCard from "@/components/ui/MetricCard";

export default async function TeacherDashboardPage() {
  const user = await getCurrentUser();
  if (!user || user.role !== "TEACHER" || !user.facultyId) {
    redirect("/login");
  }

  const faculty = await prisma.faculty.findUnique({
    where: { id: user.facultyId },
    include: {
      department: true,
      assignments: {
        include: {
          subject: true,
          section: true,
        },
      },
      lmsCourses: {
        include: {
          subject: true,
          modules: true,
        },
      },
    },
  });

  if (!faculty) return <div className="p-6 text-sm text-slate-600">Faculty record not found.</div>;

  // Day name for schedule
  const dayName = new Date().toLocaleDateString("en-US", { weekday: "long" }).toUpperCase();
  const activeDay = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY"].includes(dayName)
    ? dayName
    : "MONDAY";

  // Today's classes for this teacher
  const todayClasses = await prisma.timetablePeriod.findMany({
    where: {
      facultyId: faculty.id,
      dayOfWeek: activeDay,
      timetable: { status: "PUBLISHED" },
    },
    include: {
      subject: {
        include: { lmsCourse: true },
      },
      room: true,
      section: true,
    },
    orderBy: { periodNumber: "asc" },
  });

  // Submissions needing review
  const pendingSubmissions = await prisma.assignmentSubmission.findMany({
    where: {
      assignment: { facultyId: faculty.id },
      status: { in: ["SUBMITTED", "LATE"] },
    },
    include: {
      student: { include: { user: true } },
      assignment: true,
    },
    take: 5,
  });

  return (
    <div className="space-y-6">
      {/* 1. Refined Executive Hero Header */}
      <DashboardHeader
        badge="FACULTY OPERATIONS & ACADEMICS"
        title={`Good morning, Prof. ${user.name.split(" ")[0]}`}
        subtitle={`${faculty.department.name} • ${faculty.designation} • Specialization: ${faculty.specialization || "Computer Science"}`}
        userMeta={`Employee Code: ${faculty.employeeCode} • AY ${JLU_PROFILE.currentAcademicYear}`}
        accent="burgundy"
        actions={
          <div className="flex items-center gap-2">
            <Link
              href="/teacher/attendance"
              className="px-3.5 py-2 bg-[#16845B] hover:bg-[#126b4a] text-white rounded-lg text-xs font-bold shadow-xs transition flex items-center gap-1.5"
            >
              <CheckSquare className="w-3.5 h-3.5" />
              <span>Record Class Attendance</span>
            </Link>
            <Link
              href="/teacher/submissions"
              className="px-3.5 py-2 bg-white hover:bg-[#F9FAFB] text-[#21313C] border border-[#E2E8F0] rounded-lg text-xs font-semibold shadow-xs transition flex items-center gap-1.5"
            >
              <Award className="w-3.5 h-3.5 text-[#027EA1]" />
              <span>Grading Queue ({pendingSubmissions.length})</span>
            </Link>
          </div>
        }
      />

      {/* 2. Faculty Operational Priorities (Action Center) */}
      <div className="erp-card p-5 space-y-3">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-rose-600 animate-ping" />
            <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Faculty Operational Action Center
            </span>
          </div>
          <span className="text-xs font-mono text-slate-400">Teaching Operations & Compliance</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          {/* Attendance Action */}
          <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200/80 flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center justify-between font-bold text-emerald-950">
                <span className="text-xs">Class Attendance Roster</span>
                <span className="text-[10px] bg-emerald-100/90 text-emerald-800 px-2 py-0.5 rounded-md font-mono font-bold">
                  {todayClasses.length} Lectures Today
                </span>
              </div>
              <p className="text-[11px] text-emerald-800 mt-1.5 leading-relaxed">
                Record attendance for today&apos;s lectures and lab sessions to maintain compliance.
              </p>
            </div>
            <Link
              href="/teacher/attendance"
              className="self-start px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-xs transition shadow-xs flex items-center gap-1"
            >
              <span>Open Attendance Desk</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Submissions Action */}
          {pendingSubmissions.length > 0 ? (
            <div className="p-4 rounded-xl bg-amber-50/80 border border-amber-200/80 flex flex-col justify-between space-y-3">
              <div>
                <div className="flex items-center justify-between font-bold text-amber-950">
                  <span className="text-xs">Submissions Awaiting Review</span>
                  <span className="text-[10px] font-mono font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded-md">
                    {pendingSubmissions.length} Pending
                  </span>
                </div>
                <p className="text-[11px] text-amber-800 mt-1.5 leading-relaxed">
                  Students have submitted coursework requiring evaluation and marks entry.
                </p>
              </div>
              <Link
                href="/teacher/submissions"
                className="self-start px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-bold text-xs transition shadow-xs flex items-center gap-1"
              >
                <span>Evaluate Coursework</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-3">
              <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                <CheckCircle2 className="w-5 h-5 shrink-0" />
              </div>
              <div>
                <span className="font-bold text-slate-900 block text-xs">Grading Queue Clear</span>
                <span className="text-[11px] text-slate-500">All student submissions are graded.</span>
              </div>
            </div>
          )}

          {/* LMS Management Action */}
          <div className="p-4 rounded-xl bg-purple-50/70 border border-purple-200/80 flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center justify-between font-bold text-purple-950">
                <span className="text-xs">LMS Course Management</span>
                <span className="text-[10px] bg-purple-100 text-purple-800 font-mono font-bold px-2 py-0.5 rounded-md">
                  {faculty.lmsCourses.length} Courses
                </span>
              </div>
              <p className="text-[11px] text-purple-800 mt-1.5 leading-relaxed">
                Upload weekly lecture notes, configure quizzes, and assign problem sets.
              </p>
            </div>
            <Link
              href="/teacher/lms"
              className="self-start px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-bold text-xs transition shadow-xs flex items-center gap-1"
            >
              <span>Manage LMS Hub</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* 3. Faculty KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Today's Lectures"
          value={todayClasses.length}
          color="blue"
          icon={CalendarDays}
          badge={`${activeDay}`}
          subtitle="Periods Scheduled in Master Grid"
          href="/teacher/timetable"
          actionText="View Teaching Timetable"
        />

        <MetricCard
          title="Assigned Sections"
          value={faculty.assignments.length}
          color="green"
          icon={Users}
          badge="Allocated"
          subtitle="Official Subject Cohorts"
          href="/teacher/students"
          actionText="Student Cohort Roster"
        />

        <MetricCard
          title="LMS Courses"
          value={faculty.lmsCourses.length}
          color="purple"
          icon={BookOpen}
          badge="Active Hubs"
          subtitle="Syllabus & Coursework Modules"
          href="/teacher/lms"
          actionText="LMS Course Management"
        />

        <MetricCard
          title="Grading Queue"
          value={pendingSubmissions.length}
          color={pendingSubmissions.length > 0 ? "amber" : "green"}
          icon={Award}
          badge={pendingSubmissions.length > 0 ? "Requires Review" : "Up To Date"}
          subtitle="Continuous Internal Assessment (CIA)"
          href="/teacher/submissions"
          actionText="Grade Submissions"
        />
      </div>

      {/* 4. Main Grid: Today's Classes & Grading Queue */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Today's Teaching Schedule */}
        <div className="lg:col-span-8 erp-card p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-rose-50 text-rose-600">
                  <CalendarDays className="w-4 h-4" />
                </span>
                <h2 className="text-sm font-bold text-slate-900 tracking-tight">
                  Your Classes for Today ({activeDay})
                </h2>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Centralized timetable slots verified against university room allocations
              </p>
            </div>
            <Link
              href="/teacher/timetable"
              className="text-xs font-semibold text-rose-600 hover:text-rose-700 hover:underline flex items-center gap-1 self-start sm:self-auto"
            >
              <span>Weekly Timetable</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {todayClasses.length > 0 ? (
            <div className="space-y-3">
              {todayClasses.map((cls) => (
                <div
                  key={cls.id}
                  className="p-4 rounded-xl border border-slate-200/80 hover:border-slate-300 transition-all bg-slate-50/50 hover:bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="flex items-start gap-3.5">
                    <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 text-slate-800 flex flex-col items-center justify-center font-mono font-bold shrink-0 shadow-xs">
                      <span className="text-[9px] uppercase text-slate-400">Period</span>
                      <span className="text-sm font-black">{cls.periodNumber}</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-xs font-bold text-slate-900">
                          {cls.subject.code}: {cls.subject.name}
                        </h3>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-700">
                          {cls.subject.type}
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-1.5">
                        <span className="flex items-center gap-1 font-mono">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          {cls.startTime} – {cls.endTime}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          Room {cls.room.roomNumber} ({cls.room.building})
                        </span>
                        {cls.section && (
                          <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200 font-mono text-[10px] font-semibold">
                            Section {cls.section.name}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-start sm:self-auto pt-2 sm:pt-0 border-t sm:border-t-0 w-full sm:w-auto justify-end">
                    <Link
                      href={`/teacher/attendance?subjectId=${cls.subject.id}&sectionId=${cls.section?.id}`}
                      className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-xs transition flex items-center gap-1.5"
                    >
                      <CheckSquare className="w-3.5 h-3.5" />
                      <span>Attendance</span>
                    </Link>
                    {cls.subject.lmsCourse && (
                      <Link
                        href={`/student/lms/${cls.subject.lmsCourse.id}`}
                        className="px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-lg text-xs font-semibold transition"
                      >
                        LMS Hub
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200 text-slate-400 text-xs">
              No classes scheduled for today.
            </div>
          )}
        </div>

        {/* Right: Submissions & Quick Academic Links */}
        <div className="lg:col-span-4 space-y-6">
          {/* Submissions to Grade */}
          <div className="erp-card p-5 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                <Award className="w-4 h-4 text-amber-600" />
                <span>Grading Queue</span>
              </h3>
              <Link href="/teacher/submissions" className="text-xs text-rose-600 hover:underline font-semibold">
                All Queue &rarr;
              </Link>
            </div>

            {pendingSubmissions.length > 0 ? (
              <div className="space-y-2.5 text-xs">
                {pendingSubmissions.map((sub) => (
                  <div
                    key={sub.id}
                    className="p-3 rounded-xl bg-slate-50/70 border border-slate-200/80 space-y-1 hover:border-slate-300 transition"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900">
                        {sub.student.user.name}
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200 font-bold">
                        Pending
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 truncate">
                      {sub.assignment.title}
                    </p>
                    <span className="text-[10px] text-slate-400 block font-mono">
                      Submitted: {formatDate(sub.submittedAt)}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 py-4 text-center">
                Grading queue is completely clear!
              </p>
            )}
          </div>

          {/* Department Faculty Affiliation */}
          <div className="erp-card p-5 text-xs space-y-3">
            <h3 className="font-bold text-slate-900 uppercase tracking-wider text-xs border-b border-slate-100 pb-2">
              Faculty Profile Details
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">School / Faculty:</span>
                <span className="font-semibold text-slate-800 text-right max-w-[170px] truncate">
                  {faculty.department.name}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Employee Code:</span>
                <span className="font-mono font-semibold text-slate-800">{faculty.employeeCode}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Qualification:</span>
                <span className="font-semibold text-slate-800">{faculty.qualification || "Ph.D."}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500">Academic Status:</span>
                <span className="text-emerald-700 font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  Active Teaching Body
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
