import Link from "next/link";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import {
  Users,
  GraduationCap,
  CalendarDays,
  CheckSquare,
  ShieldCheck,
  AlertTriangle,
  Briefcase,
  BarChart3,
  ArrowRight,
  School,
  Building,
  CheckCircle2,
} from "lucide-react";
import { JLU_PROFILE } from "@/lib/jlu-constants";

export default async function HODDashboardPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  if (user.role !== "HOD" && user.role !== "ADMIN") {
    redirect(`/${user.role.toLowerCase()}/dashboard`);
  }

  const deptId = user.departmentId || (await prisma.department.findFirst())?.id;
  if (!deptId) {
    return <div className="p-6">No department found.</div>;
  }

  const department = await prisma.department.findUnique({
    where: { id: deptId },
    include: {
      faculty: { include: { user: true, assignments: true } },
      programs: {
        include: {
          students: true,
          semesters: {
            include: {
              timetables: true,
            },
          },
        },
      },
    },
  });

  if (!department) return <div className="p-6">School / Department record not found.</div>;

  const totalStudents = department.programs.reduce(
    (acc, prog) => acc + prog.students.length,
    0
  );
  const totalFaculty = department.faculty.length;

  // Pending timetable approvals
  const pendingTimetables = await prisma.timetable.findMany({
    where: {
      status: { in: ["DRAFT", "SUBMITTED"] },
      semester: { program: { departmentId: department.id } },
    },
    include: {
      section: true,
      semester: { include: { program: true } },
      periods: true,
    },
  });

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-rose-950 text-white p-6 sm:p-8 rounded-2xl shadow-md border border-slate-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-500/20 text-rose-300 border border-rose-400/30">
              Department Code: {department.code}
            </span>
            <span className="text-xs text-slate-400">
              AY {JLU_PROFILE.currentAcademicYear}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {department.name}
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            Head of School: {user.name} • Venue: {department.building || "Campus Block A"} • Jagran Lakecity University
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/hod/approvals"
            className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold shadow-sm transition flex items-center gap-1.5"
          >
            <ShieldCheck className="w-4 h-4" />
            Timetable Approvals ({pendingTimetables.length})
          </Link>
          <Link
            href="/hod/reports"
            className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-semibold backdrop-blur-xs border border-white/20 transition flex items-center gap-1.5"
          >
            <BarChart3 className="w-4 h-4" />
            School Analytics
          </Link>
        </div>
      </div>

      {/* ACTION REQUIRED: HOD Departmental Priorities */}
      <div className="bg-white rounded-2xl shadow-xs border border-slate-200 p-5 space-y-3">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-600 animate-ping" />
            <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Department Action Required
            </span>
          </div>
          <span className="text-[11px] font-mono text-slate-400">Academic Governance</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          {/* Timetable Approvals */}
          {pendingTimetables.length > 0 ? (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 flex flex-col justify-between space-y-2">
              <div>
                <div className="flex items-center justify-between font-bold text-rose-900">
                  <span>Timetable Approvals Pending</span>
                  <span className="text-xs font-mono font-bold">{pendingTimetables.length} Drafts</span>
                </div>
                <p className="text-[11px] text-rose-800 mt-1">
                  Draft class schedules have been generated and require HOD departmental sign-off.
                </p>
              </div>
              <Link
                href="/hod/approvals"
                className="self-start px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-bold text-[11px] transition shadow-xs flex items-center gap-1"
              >
                <span>Review & Approve</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          ) : (
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <div>
                <span className="font-bold text-slate-900 block">Timetables Approved</span>
                <span className="text-[11px] text-slate-500">All departmental schedules published.</span>
              </div>
            </div>
          )}

          {/* Attendance Governance */}
          <div className="p-3.5 rounded-xl bg-blue-50/70 border border-blue-200 flex flex-col justify-between space-y-2">
            <div>
              <div className="flex items-center justify-between font-bold text-blue-900">
                <span>Department Attendance Tracking</span>
                <span className="text-[10px] bg-blue-100 text-blue-800 font-mono px-1.5 py-0.5 rounded">Roster Watch</span>
              </div>
              <p className="text-[11px] text-blue-800 mt-1">
                Monitor student attendance percentages and flag chronic absenteeism across cohorts.
              </p>
            </div>
            <Link
              href="/hod/attendance"
              className="self-start px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold text-[11px] transition shadow-xs flex items-center gap-1"
            >
              <span>Monitor Attendance</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {/* Faculty Workload */}
          <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200 flex flex-col justify-between space-y-2">
            <div>
              <div className="flex items-center justify-between font-bold text-amber-900">
                <span>Faculty Workload & Roster</span>
                <span className="text-[10px] bg-amber-100 text-amber-800 font-mono px-1.5 py-0.5 rounded">{totalFaculty} Faculty</span>
              </div>
              <p className="text-[11px] text-amber-800 mt-1">
                Audit weekly teaching hours distribution and subject allocations.
              </p>
            </div>
            <Link
              href="/hod/faculty"
              className="self-start px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-bold text-[11px] transition shadow-xs flex items-center gap-1"
            >
              <span>Audit Workload</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl shadow-xs border border-slate-200">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Enrolled Students</span>
            <GraduationCap className="w-4 h-4 text-blue-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-slate-900">{totalStudents}</span>
            <span className="text-[11px] text-blue-700 font-medium">Undergraduate / PG</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Across {department.programs.length} Degree Offerings</p>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-xs border border-slate-200">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Faculty Roster</span>
            <Users className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-slate-900">{totalFaculty}</span>
            <span className="text-[11px] text-emerald-700 font-medium">Professors & Lecturers</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">100% Teaching Load Allocated</p>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-xs border border-slate-200">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Pending Approvals</span>
            <ShieldCheck className="w-4 h-4 text-amber-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-amber-700">{pendingTimetables.length}</span>
            <span className="text-[11px] text-amber-700 font-medium">Schedules</span>
          </div>
          <Link href="/hod/approvals" className="text-[11px] text-amber-600 font-bold hover:underline mt-1 inline-block">
            Review Drafts &rarr;
          </Link>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-xs border border-slate-200">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">School Attendance Avg</span>
            <CheckSquare className="w-4 h-4 text-purple-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-slate-900">86.4%</span>
            <span className="text-[11px] text-emerald-600 font-bold">Compliant</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">University Cutoff: 75.0%</p>
        </div>
      </div>

      {/* Main Grid: Pending Approvals & Faculty Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Timetable Approvals Queue */}
        <div className="lg:col-span-8 bg-white rounded-2xl shadow-xs border border-slate-200 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <CalendarDays className="w-4 h-4 text-rose-600" />
                School Timetable Scheduling & Conflict Approvals
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Verify period room mappings and teacher load before publishing
              </p>
            </div>
            <Link href="/hod/approvals" className="text-xs text-rose-600 font-semibold hover:underline">
              Approvals Queue &rarr;
            </Link>
          </div>

          <div className="space-y-3">
            {pendingTimetables.length > 0 ? (
              pendingTimetables.map((tt) => (
                <div
                  key={tt.id}
                  className="p-4 rounded-xl border border-amber-200 bg-amber-50/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-slate-900">{tt.title}</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
                        {tt.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                      Program: {tt.semester.program.name} (Section {tt.section.name}) • {tt.periods.length} Periods configured
                    </p>
                    {tt.conflictNotes && (
                      <p className="text-[11px] text-amber-800 mt-1 italic">
                        Note: {tt.conflictNotes}
                      </p>
                    )}
                  </div>

                  <Link
                    href="/hod/approvals"
                    className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold transition shrink-0 shadow-2xs"
                  >
                    Inspect & Approve
                  </Link>
                </div>
              ))
            ) : (
              <div className="p-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200 text-slate-400 text-xs">
                All school schedules are validated and actively running across campus.
              </div>
            )}
          </div>
        </div>

        {/* Right: Faculty Roster Snapshot */}
        <div className="lg:col-span-4 bg-white rounded-2xl shadow-xs border border-slate-200 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
              Department Faculty Roster
            </h3>
            <Link href="/hod/faculty" className="text-[11px] text-rose-600 hover:underline font-semibold">
              Roster &rarr;
            </Link>
          </div>

          <div className="space-y-3">
            {department.faculty.slice(0, 5).map((fac) => (
              <div key={fac.id} className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs space-y-1">
                <div className="flex items-center justify-between font-bold text-slate-900">
                  <span>{fac.user.name}</span>
                  <span className="text-[10px] font-mono text-slate-400">{fac.employeeCode}</span>
                </div>
                <p className="text-[11px] text-slate-600">{fac.designation}</p>
                <span className="text-[10px] text-rose-700 font-medium block">
                  {fac.specialization || "Academic Faculty"}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
