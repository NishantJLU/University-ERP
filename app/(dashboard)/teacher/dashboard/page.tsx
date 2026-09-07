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
  AlertCircle,
  Briefcase,
  ArrowRight,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import { formatDate } from "@/lib/utils";
import { JLU_PROFILE } from "@/lib/jlu-constants";

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

  if (!faculty) return <div className="p-6">Faculty record not found.</div>;

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
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-rose-950 text-white p-6 sm:p-8 rounded-2xl shadow-md border border-slate-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-500/20 text-rose-300 border border-rose-400/30">
              Code: {faculty.employeeCode} • {faculty.designation}
            </span>
            <span className="text-xs text-slate-400">
              AY {JLU_PROFILE.currentAcademicYear}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Good morning, Professor {user.name.split(" ")[0]}
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            {faculty.department.name} • Jagran Lakecity University • Specialization: {faculty.specialization || "Computer Science"}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/teacher/attendance"
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-sm transition flex items-center gap-1.5"
          >
            <CheckSquare className="w-4 h-4" />
            Record Class Attendance
          </Link>
          <Link
            href="/teacher/submissions"
            className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-semibold backdrop-blur-xs border border-white/20 transition flex items-center gap-1.5"
          >
            <Award className="w-4 h-4" />
            Grading Queue
          </Link>
        </div>
      </div>

      {/* ACTION REQUIRED: Faculty Operational Priorities */}
      <div className="bg-white rounded-2xl shadow-xs border border-slate-200 p-5 space-y-3">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-600 animate-ping" />
            <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Faculty Action Required
            </span>
          </div>
          <span className="text-[11px] font-mono text-slate-400">Teaching Operations & Compliance</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          {/* Attendance Action */}
          <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200 flex flex-col justify-between space-y-2">
            <div>
              <div className="flex items-center justify-between font-bold text-emerald-900">
                <span>Class Attendance Roster</span>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-mono">
                  {todayClasses.length} Scheduled Today
                </span>
              </div>
              <p className="text-[11px] text-emerald-800 mt-1">
                Mark dynamic attendance for today&apos;s lectures and lab sessions.
              </p>
            </div>
            <Link
              href="/teacher/attendance"
              className="self-start px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-[11px] transition shadow-xs flex items-center gap-1"
            >
              <span>Open Attendance Desk</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {/* Submissions Action */}
          {pendingSubmissions.length > 0 ? (
            <div className="p-3.5 rounded-xl bg-amber-50/80 border border-amber-200 flex flex-col justify-between space-y-2">
              <div>
                <div className="flex items-center justify-between font-bold text-amber-900">
                  <span>Submissions Awaiting Grading</span>
                  <span className="text-xs font-mono font-black">{pendingSubmissions.length} Pending</span>
                </div>
                <p className="text-[11px] text-amber-800 mt-1">
                  Students have submitted coursework requiring evaluation and marks entry.
                </p>
              </div>
              <Link
                href="/teacher/submissions"
                className="self-start px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-bold text-[11px] transition shadow-xs flex items-center gap-1"
              >
                <span>Grade Submissions</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          ) : (
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <div>
                <span className="font-bold text-slate-900 block">Grading Queue Clear</span>
                <span className="text-[11px] text-slate-500">All student submissions are graded.</span>
              </div>
            </div>
          )}

          {/* LMS Management Action */}
          <div className="p-3.5 rounded-xl bg-purple-50/60 border border-purple-200 flex flex-col justify-between space-y-2">
            <div>
              <div className="flex items-center justify-between font-bold text-purple-900">
                <span>LMS Course Management</span>
                <span className="text-[10px] bg-purple-100 text-purple-800 font-mono px-1.5 py-0.5 rounded">
                  {faculty.lmsCourses.length} Courses
                </span>
              </div>
              <p className="text-[11px] text-purple-800 mt-1">
                Upload weekly lecture notes, configure quizzes, and assign problem sets.
              </p>
            </div>
            <Link
              href="/teacher/lms"
              className="self-start px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-bold text-[11px] transition shadow-xs flex items-center gap-1"
            >
              <span>Manage LMS Hub</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>

      {/* Faculty KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl shadow-xs border border-slate-200">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Today&apos;s Lectures</span>
            <CalendarDays className="w-4 h-4 text-blue-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-slate-900">{todayClasses.length}</span>
            <span className="text-[11px] text-slate-500 font-medium">Periods Scheduled</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">{activeDay} Schedule</p>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-xs border border-slate-200">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Assigned Sections</span>
            <Users className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-slate-900">{faculty.assignments.length}</span>
            <span className="text-[11px] text-emerald-700 font-medium">Subject Cohorts</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Official Academic Allocations</p>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-xs border border-slate-200">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">LMS Courses</span>
            <BookOpen className="w-4 h-4 text-purple-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-slate-900">{faculty.lmsCourses.length}</span>
            <span className="text-[11px] text-purple-700 font-medium">Active Courses</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Syllabus & Coursework Hubs</p>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-xs border border-slate-200">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Submissions to Grade</span>
            <Award className="w-4 h-4 text-amber-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-amber-900">{pendingSubmissions.length}</span>
            <span className="text-[11px] text-amber-700 font-medium">Pending Review</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Continuous Internal Evaluation</p>
        </div>
      </div>

      {/* Main Grid: Today's Classes & Grading Queue */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Today's Teaching Schedule */}
        <div className="lg:col-span-8 bg-white rounded-2xl shadow-xs border border-slate-200 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <CalendarDays className="w-4 h-4 text-rose-600" />
                Your Classes for Today ({activeDay})
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Centralized timetable slots verified against university room allocations
              </p>
            </div>
            <Link href="/teacher/timetable" className="text-xs text-rose-600 font-semibold hover:underline">
              Weekly Timetable &rarr;
            </Link>
          </div>

          {todayClasses.length > 0 ? (
            <div className="space-y-3">
              {todayClasses.map((cls) => (
                <div
                  key={cls.id}
                  className="p-4 rounded-xl border border-slate-200/80 hover:border-slate-300 transition bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="flex items-start gap-3.5">
                    <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 flex flex-col items-center justify-center font-mono font-bold shrink-0">
                      <span className="text-[9px] uppercase text-slate-500">Period</span>
                      <span className="text-sm font-black">{cls.periodNumber}</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-xs font-bold text-slate-900">
                          {cls.subject.code}: {cls.subject.name}
                        </h3>
                        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-200 text-slate-700">
                          {cls.subject.type}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-slate-500 mt-1">
                        <span className="flex items-center gap-1 font-mono">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          {cls.startTime} - {cls.endTime}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          Room {cls.room.roomNumber} ({cls.room.building})
                        </span>
                        {cls.section && (
                          <span className="px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 font-mono text-[10px]">
                            {cls.section.name}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-start sm:self-auto pt-2 sm:pt-0 border-t sm:border-t-0">
                    <Link
                      href={`/teacher/attendance?subjectId=${cls.subject.id}&sectionId=${cls.section?.id}`}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-2xs transition flex items-center gap-1"
                    >
                      <CheckSquare className="w-3.5 h-3.5" />
                      Attendance
                    </Link>
                    {cls.subject.lmsCourse && (
                      <Link
                        href={`/student/lms/${cls.subject.lmsCourse.id}`}
                        className="px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-lg text-xs font-semibold transition"
                      >
                        LMS
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
          <div className="bg-white rounded-2xl shadow-xs border border-slate-200 p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                <Award className="w-4 h-4 text-amber-600" />
                Grading Queue
              </h3>
              <Link href="/teacher/submissions" className="text-[11px] text-rose-600 hover:underline font-semibold">
                All Queue &rarr;
              </Link>
            </div>

            {pendingSubmissions.length > 0 ? (
              <div className="space-y-2.5 text-xs">
                {pendingSubmissions.map((sub) => (
                  <div
                    key={sub.id}
                    className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900">
                        {sub.student.user.name}
                      </span>
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-amber-50 text-amber-800 border border-amber-200">
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
              <p className="text-xs text-slate-400 py-3 text-center">
                Grading queue is completely clear!
              </p>
            )}
          </div>

          {/* Department Faculty Affiliation */}
          <div className="bg-white rounded-2xl shadow-xs border border-slate-200 p-5 text-xs space-y-2.5">
            <h3 className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">
              Faculty Designation
            </h3>
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
              <span className="text-emerald-700 font-bold">Active Teaching Body</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
