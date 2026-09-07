import Link from "next/link";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import {
  CalendarDays,
  CheckSquare,
  CreditCard,
  BookOpen,
  FileText,
  Bell,
  ArrowRight,
  Clock,
  MapPin,
  AlertCircle,
  CheckCircle2,
  Sparkles,
  Flame,
  PlayCircle,
  ExternalLink,
} from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";
import { JLU_PROFILE } from "@/lib/jlu-constants";

export default async function StudentDashboardPage() {
  const user = await getCurrentUser();
  if (!user || user.role !== "STUDENT" || !user.studentId) {
    redirect("/login");
  }

  // Fetch student profile, section, department, and enrollment data
  const student = await prisma.student.findUnique({
    where: { id: user.studentId },
    include: {
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
      feeDues: {
        include: { feeStructure: true },
      },
      paymentTransactions: {
        orderBy: { createdAt: "desc" },
        take: 3,
      },
      assignmentSubmissions: {
        include: { assignment: true },
        orderBy: { submittedAt: "desc" },
        take: 3,
      },
    },
  });

  if (!student) {
    return <div className="p-6">Student record not found.</div>;
  }

  // Fetch today's classes from Timetable
  const dayName = new Date().toLocaleDateString("en-US", { weekday: "long" }).toUpperCase();
  const timetablePeriods = await prisma.timetablePeriod.findMany({
    where: {
      sectionId: student.sectionId || "",
      dayOfWeek: ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY"].includes(dayName) ? dayName : "MONDAY",
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

  // Fetch attendance stats for this student
  const attendanceRecords = await prisma.attendanceRecord.findMany({
    where: { studentId: student.id },
  });
  const totalClasses = attendanceRecords.length || 0;
  const attendedClasses = attendanceRecords.filter((r) => r.status === "PRESENT").length;
  const attendancePct = totalClasses > 0 ? Math.round((attendedClasses / totalClasses) * 100) : 100;

  // Fee dues calculation
  const totalFee = student.feeDues.reduce((acc, d) => acc + d.totalAmount, 0);
  const paidFee = student.feeDues.reduce((acc, d) => acc + d.paidAmount, 0);
  const pendingFee = totalFee - paidFee;

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
    take: 3,
  });

  // Identify next class
  const nextClass = timetablePeriods.length > 0 ? timetablePeriods[0] : null;

  // Mocked progress numbers per enrolled subject for visual tracking
  const sampleProgress = [72, 81, 64, 90, 75];

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-rose-950 text-white p-6 sm:p-8 rounded-2xl shadow-md border border-slate-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-500/20 text-rose-300 border border-rose-400/30">
              {student.program.code} • Sem {student.currentSemester.number} • {student.section?.name || "Section A"}
            </span>
            <span className="text-xs text-slate-400 font-mono">
              Roll No: {student.rollNumber}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Good morning, {user.name}
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            {student.program.department.name} • {student.program.name} • AY {JLU_PROFILE.currentAcademicYear}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/student/timetable"
            className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-semibold backdrop-blur-xs border border-white/20 transition flex items-center gap-1.5"
          >
            <CalendarDays className="w-4 h-4" />
            Class Schedule
          </Link>
          <Link
            href="/student/fees"
            className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold shadow-xs transition flex items-center gap-1.5"
          >
            <CreditCard className="w-4 h-4" />
            Fee Portal
          </Link>
        </div>
      </div>

      {/* TODAY AT JLU: Highlighted Next Class Banner */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-rose-900 via-rose-950 to-slate-900 text-white border border-rose-800/60 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        {nextClass ? (
          <>
            <div className="flex items-start sm:items-center gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-rose-700 text-white flex flex-col items-center justify-center font-mono font-bold shrink-0 shadow-md">
                <span className="text-[9px] uppercase tracking-wider text-rose-200">Next</span>
                <span className="text-xs font-black">{nextClass.startTime.slice(0, 5)}</span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-white/20 text-rose-100 uppercase tracking-wider">
                    TODAY AT JLU
                  </span>
                  <span className="text-xs text-rose-200 font-mono">{nextClass.startTime} - {nextClass.endTime}</span>
                </div>
                <h3 className="text-base font-extrabold text-white mt-1">
                  {nextClass.subject.code}: {nextClass.subject.name}
                </h3>
                <p className="text-xs text-slate-300 mt-0.5 flex items-center gap-3">
                  <span>Instructor: {nextClass.faculty.user.name}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-rose-300" />
                    Room {nextClass.room.roomNumber} ({nextClass.room.building})
                  </span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-start md:self-auto">
              {nextClass.subject.lmsCourse ? (
                <Link
                  href={`/student/lms/${nextClass.subject.lmsCourse.id}`}
                  className="px-4 py-2 bg-white hover:bg-slate-100 text-rose-900 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
                >
                  <PlayCircle className="w-4 h-4 text-rose-700" />
                  Open Course
                </Link>
              ) : (
                <Link
                  href="/student/lms"
                  className="px-4 py-2 bg-white hover:bg-slate-100 text-rose-900 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
                >
                  <BookOpen className="w-4 h-4 text-rose-700" />
                  Open Course
                </Link>
              )}
            </div>
          </>
        ) : (
          <div className="flex items-center justify-between w-full">
            <div>
              <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-white/20 text-rose-100 uppercase tracking-wider">
                TODAY AT JLU
              </span>
              <h3 className="text-sm font-bold text-white mt-1">
                No active lectures currently in session.
              </h3>
              <p className="text-xs text-slate-300 mt-0.5">
                Next scheduled teaching periods resume Monday morning at 09:00 AM.
              </p>
            </div>
            <Link
              href="/student/timetable"
              className="px-4 py-2 bg-white text-rose-900 rounded-xl text-xs font-bold shadow-xs hover:bg-slate-100 transition shrink-0"
            >
              Inspect Timetable
            </Link>
          </div>
        )}
      </div>

      {/* MY LEARNING: Course Progress Cards */}
      <div className="bg-white rounded-2xl shadow-xs border border-slate-200 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-rose-600 uppercase tracking-wider">
              MY LEARNING (JLU LMS)
            </span>
            <h2 className="text-base font-extrabold text-slate-900">
              My Learning & Coursework Progress
            </h2>
          </div>
          <Link
            href="/student/lms"
            className="text-xs text-rose-600 font-bold hover:underline flex items-center gap-1"
          >
            All Courses &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {student.enrollments.map((enr, idx) => {
            const pct = sampleProgress[idx % sampleProgress.length];
            return (
              <div
                key={enr.id}
                className="p-4 rounded-xl border border-slate-200 hover:border-slate-300 hover:shadow-xs transition bg-slate-50/40 flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-mono font-bold text-rose-600">
                      {enr.subject.code}
                    </span>
                    <span className="text-[11px] font-bold text-slate-800 font-mono">
                      {pct}%
                    </span>
                  </div>
                  <h3 className="text-xs font-bold text-slate-900 line-clamp-1">
                    {enr.subject.name}
                  </h3>
                  <span className="text-[10px] text-slate-500 font-medium">
                    {enr.subject.credits} Credits • {enr.subject.type}
                  </span>
                </div>

                {/* Progress bar */}
                <div className="space-y-2">
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-rose-600 h-full rounded-full transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[10px] text-slate-400">Continuous Assessment</span>
                    {enr.subject.lmsCourse ? (
                      <Link
                        href={`/student/lms/${enr.subject.lmsCourse.id}`}
                        className="text-xs text-rose-600 hover:underline font-bold"
                      >
                        Continue Learning &rarr;
                      </Link>
                    ) : (
                      <Link
                        href="/student/lms"
                        className="text-xs text-rose-600 hover:underline font-bold"
                      >
                        View Syllabus &rarr;
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Attendance KPI */}
        <div className="bg-white p-5 rounded-xl shadow-xs border border-slate-200">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Attendance %</span>
            <CheckSquare className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-slate-900">{attendancePct}%</span>
            <span
              className={`text-[11px] font-bold ${
                attendancePct >= 75 ? "text-emerald-600" : "text-amber-600"
              }`}
            >
              {attendancePct >= 75 ? "Eligible" : "Shortage Warning"}
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            {attendedClasses} of {totalClasses} classes attended
          </p>
          <div className="w-full bg-slate-100 h-1.5 rounded-full mt-3 overflow-hidden">
            <div
              className={`h-full rounded-full ${
                attendancePct >= 75 ? "bg-emerald-500" : "bg-amber-500"
              }`}
              style={{ width: `${attendancePct}%` }}
            />
          </div>
          <Link
            href="/student/attendance"
            className="text-[11px] text-rose-600 font-bold hover:underline mt-2 inline-block"
          >
            What-If Simulator &rarr;
          </Link>
        </div>

        {/* Pending Fees KPI */}
        <div className="bg-white p-5 rounded-xl shadow-xs border border-slate-200">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Outstanding Dues</span>
            <CreditCard className="w-4 h-4 text-blue-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-blue-900">{formatCurrency(pendingFee)}</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            {formatCurrency(paidFee)} paid of {formatCurrency(totalFee)}
          </p>
          <Link
            href="/student/fees"
            className="text-[11px] text-blue-600 font-bold hover:underline mt-3 inline-block"
          >
            Pay Dues & Receipts &rarr;
          </Link>
        </div>

        {/* Assignments Pending */}
        <div className="bg-white p-5 rounded-xl shadow-xs border border-slate-200">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Assignments</span>
            <FileText className="w-4 h-4 text-amber-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-slate-900">
              {student.assignmentSubmissions.length}
            </span>
            <span className="text-[11px] text-emerald-600 font-semibold">Submitted</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Continuous internal evaluation
          </p>
          <Link
            href="/student/assignments"
            className="text-[11px] text-amber-600 font-bold hover:underline mt-3 inline-block"
          >
            View Submissions &rarr;
          </Link>
        </div>

        {/* Campus Life Highlight */}
        <div className="bg-white p-5 rounded-xl shadow-xs border border-slate-200">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Campus Life</span>
            <Flame className="w-4 h-4 text-rose-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-slate-900">5 Clubs</span>
            <span className="text-[11px] text-rose-600 font-bold">Active</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Lakecity Conclave & Talent Fest
          </p>
          <Link
            href="/student/campus-life"
            className="text-[11px] text-rose-600 font-bold hover:underline mt-3 inline-block"
          >
            Explore Societies &rarr;
          </Link>
        </div>
      </div>

      {/* Main Grid: Today's Classes & University Notices */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Today's Schedule */}
        <div className="lg:col-span-8 bg-white rounded-2xl shadow-xs border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <CalendarDays className="w-4 h-4 text-rose-600" />
                Schedule for {dayName === "SUNDAY" || dayName === "SATURDAY" ? "Monday (Upcoming)" : dayName}
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Live timetable slots mapped to Section {student.section?.name || "Section A"}
              </p>
            </div>
            <Link
              href="/student/timetable"
              className="text-xs text-rose-600 hover:underline font-semibold"
            >
              Full Weekly Schedule &rarr;
            </Link>
          </div>

          {timetablePeriods.length > 0 ? (
            <div className="space-y-3">
              {timetablePeriods.map((period) => (
                <div
                  key={period.id}
                  className="p-4 rounded-xl border border-slate-200/80 hover:border-rose-300 hover:shadow-xs transition bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 flex flex-col items-center justify-center shrink-0">
                      <span className="text-[9px] font-bold uppercase">Period</span>
                      <span className="text-sm font-extrabold">{period.periodNumber}</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900">
                          {period.subject.code}: {period.subject.name}
                        </span>
                        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-200/70 text-slate-700">
                          {period.subject.type}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-slate-500 mt-1">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          {period.startTime} - {period.endTime}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          {period.room.roomNumber} ({period.room.building})
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0 border-t sm:border-t-0 pt-2 sm:pt-0">
                    <p className="text-xs font-semibold text-slate-800">
                      {period.faculty.user.name}
                    </p>
                    <span className="text-[10px] text-slate-400">Assigned Instructor</span>
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

        {/* Right: Notices & Quick Academic Profile */}
        <div className="lg:col-span-4 space-y-6">
          {/* University Broadcasts */}
          <div className="bg-white rounded-2xl shadow-xs border border-slate-200 p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                <Bell className="w-4 h-4 text-rose-600" />
                JLU Campus Circulars
              </h3>
              <Link href="/student/notices" className="text-[11px] text-rose-600 hover:underline font-semibold">
                View All &rarr;
              </Link>
            </div>

            <div className="space-y-3">
              {notices.map((notice) => (
                <div key={notice.id} className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-bold uppercase px-1.5 py-0.2 rounded bg-rose-100 text-rose-800">
                      {notice.priority}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {formatDate(notice.publishedAt)}
                    </span>
                  </div>
                  <h4 className="font-bold text-slate-900 leading-snug">
                    {notice.title}
                  </h4>
                  <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed">
                    {notice.content}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Academic Profile Summary */}
          <div className="bg-white rounded-2xl shadow-xs border border-slate-200 p-5 text-xs space-y-2.5">
            <h3 className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">
              Institutional Affiliation
            </h3>
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">Faculty / School:</span>
              <span className="font-semibold text-slate-800 text-right max-w-[170px] truncate">
                {student.program.department.name}
              </span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">Degree Program:</span>
              <span className="font-semibold text-slate-800">{student.program.name}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">Current Semester:</span>
              <span className="font-semibold text-slate-800">Semester {student.currentSemester.number}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">Cohort Section:</span>
              <span className="font-semibold text-slate-800">{student.section?.name || "Section A"}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-500">Academic Standing:</span>
              <span className="text-emerald-700 font-bold">Good Standing</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
