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
  Sparkles,
} from "lucide-react";
import { JLU_PROFILE } from "@/lib/jlu-constants";
import DashboardHeader from "@/components/ui/DashboardHeader";
import MetricCard from "@/components/ui/MetricCard";

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
    return <div className="p-6 text-sm text-slate-600">No department found.</div>;
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

  if (!department) return <div className="p-6 text-sm text-slate-600">School / Department record not found.</div>;

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
      {/* 1. Refined Executive Hero Header */}
      <DashboardHeader
        badge="ACADEMIC DEAN & HOD CONSOLE"
        title={department.name}
        subtitle={`Head of Department: ${user.name} • Location: ${department.building || "Campus Block A"} • Jagran Lakecity University`}
        userMeta={`Code: ${department.code} • AY ${JLU_PROFILE.currentAcademicYear}`}
        accent="burgundy"
        actions={
          <div className="flex items-center gap-2">
            <Link
              href="/hod/approvals"
              className="px-3.5 py-2 bg-[#8B1E3F] hover:bg-[#701831] text-white rounded-lg text-xs font-bold shadow-xs transition flex items-center gap-1.5"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Timetable Approvals ({pendingTimetables.length})</span>
            </Link>
            <Link
              href="/hod/reports"
              className="px-3.5 py-2 bg-white hover:bg-[#F9FAFB] text-[#172B4D] border border-[#E5E7EB] rounded-lg text-xs font-semibold shadow-xs transition flex items-center gap-1.5"
            >
              <BarChart3 className="w-3.5 h-3.5 text-[#8B1E3F]" />
              <span>School Analytics</span>
            </Link>
          </div>
        }
      />

      {/* 2. Departmental Operational Action Center */}
      <div className="erp-card p-5 space-y-3">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-rose-600 animate-ping" />
            <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Department Governance & Action Center
            </span>
          </div>
          <span className="text-xs font-mono text-slate-400">Academic Operations</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          {/* Timetable Approvals Action */}
          {pendingTimetables.length > 0 ? (
            <div className="p-4 rounded-xl bg-rose-50/70 border border-rose-200/80 flex flex-col justify-between space-y-3">
              <div>
                <div className="flex items-center justify-between font-bold text-rose-950">
                  <span className="text-xs">Timetable Approvals Pending</span>
                  <span className="text-[10px] font-mono font-bold bg-rose-100 text-rose-800 px-2 py-0.5 rounded-md">
                    {pendingTimetables.length} Drafts
                  </span>
                </div>
                <p className="text-[11px] text-rose-800 mt-1.5 leading-relaxed">
                  Draft class schedules have been generated and require HOD departmental sign-off.
                </p>
              </div>
              <Link
                href="/hod/approvals"
                className="self-start px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-bold text-xs transition shadow-xs flex items-center gap-1"
              >
                <span>Review & Approve</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-3">
              <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                <CheckCircle2 className="w-5 h-5 shrink-0" />
              </div>
              <div>
                <span className="font-bold text-slate-900 block text-xs">Timetables Approved</span>
                <span className="text-[11px] text-slate-500">All departmental schedules are active.</span>
              </div>
            </div>
          )}

          {/* Attendance Tracking Action */}
          <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200/80 flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center justify-between font-bold text-blue-950">
                <span className="text-xs">Cohort Attendance Health</span>
                <span className="text-[10px] bg-blue-100 text-blue-800 font-mono font-bold px-2 py-0.5 rounded-md">
                  Roster Watch
                </span>
              </div>
              <p className="text-[11px] text-blue-800 mt-1.5 leading-relaxed">
                Monitor student attendance percentages and flag chronic absenteeism across cohorts.
              </p>
            </div>
            <Link
              href="/hod/attendance"
              className="self-start px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold text-xs transition shadow-xs flex items-center gap-1"
            >
              <span>Monitor Attendance</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Faculty Workload Action */}
          <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200/80 flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center justify-between font-bold text-amber-950">
                <span className="text-xs">Faculty Load Distribution</span>
                <span className="text-[10px] bg-amber-100 text-amber-800 font-mono font-bold px-2 py-0.5 rounded-md">
                  {totalFaculty} Faculty
                </span>
              </div>
              <p className="text-[11px] text-amber-800 mt-1.5 leading-relaxed">
                Audit weekly teaching hours distribution and subject allocations across department programs.
              </p>
            </div>
            <Link
              href="/hod/faculty"
              className="self-start px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-bold text-xs transition shadow-xs flex items-center gap-1"
            >
              <span>Audit Workload</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* 3. Department KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Enrolled Students"
          value={totalStudents}
          color="blue"
          icon={GraduationCap}
          badge="Active Census"
          subtitle={`Across ${department.programs.length} Degree Offerings`}
          href="/hod/students"
          actionText="Student Directory"
        />

        <MetricCard
          title="Faculty Roster"
          value={totalFaculty}
          color="green"
          icon={Users}
          badge="Teaching Staff"
          subtitle="100% Teaching Load Allocated"
          href="/hod/faculty"
          actionText="View Faculty List"
        />

        <MetricCard
          title="Pending Approvals"
          value={pendingTimetables.length}
          color={pendingTimetables.length > 0 ? "crimson" : "green"}
          icon={ShieldCheck}
          badge={pendingTimetables.length > 0 ? "Sign-off Required" : "All Approved"}
          subtitle="Semester Timetable Drafts"
          href="/hod/approvals"
          actionText="Inspect Drafts"
        />

        <MetricCard
          title="School Attendance Avg"
          value="86.4%"
          color="purple"
          icon={CheckSquare}
          badge="Compliant"
          subtitle="University Cutoff Bar: 75.0%"
          href="/hod/attendance"
          actionText="Attendance Analytics"
        />
      </div>

      {/* 4. Main Grid: Timetable Approval Queue & Faculty Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Timetable Approvals Queue */}
        <div className="lg:col-span-8 erp-card p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-rose-50 text-rose-600">
                  <CalendarDays className="w-4 h-4" />
                </span>
                <h2 className="text-sm font-bold text-slate-900 tracking-tight">
                  Timetable Scheduling & Conflict Sign-off Queue
                </h2>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Verify period room mappings and teacher load before publishing to students
              </p>
            </div>
            <Link
              href="/hod/approvals"
              className="text-xs font-semibold text-rose-600 hover:text-rose-700 hover:underline flex items-center gap-1 self-start sm:self-auto"
            >
              <span>Approvals Queue</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {pendingTimetables.length > 0 ? (
              pendingTimetables.map((tt) => (
                <div
                  key={tt.id}
                  className="p-4 rounded-xl border border-amber-200/80 bg-amber-50/30 hover:border-amber-300 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-slate-900">{tt.title}</span>
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                        {tt.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mt-1">
                      Program: <span className="font-semibold text-slate-800">{tt.semester.program.name}</span> (Section {tt.section.name}) • {tt.periods.length} Periods configured
                    </p>
                    {tt.conflictNotes && (
                      <p className="text-[11px] text-amber-800 mt-1 italic">
                        Note: {tt.conflictNotes}
                      </p>
                    )}
                  </div>

                  <Link
                    href="/hod/approvals"
                    className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold transition shrink-0 shadow-xs text-center"
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
        <div className="lg:col-span-4 erp-card p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
              Department Faculty Roster
            </h3>
            <Link href="/hod/faculty" className="text-xs text-rose-600 hover:underline font-semibold">
              All Roster &rarr;
            </Link>
          </div>

          <div className="space-y-2.5">
            {department.faculty.slice(0, 5).map((fac) => (
              <div
                key={fac.id}
                className="p-3 rounded-xl bg-slate-50/70 border border-slate-100 hover:border-slate-200 text-xs space-y-1 transition"
              >
                <div className="flex items-center justify-between font-bold text-slate-900">
                  <span>{fac.user.name}</span>
                  <span className="text-[10px] font-mono text-slate-400">{fac.employeeCode}</span>
                </div>
                <p className="text-[11px] text-slate-600">{fac.designation}</p>
                <span className="text-[10px] text-rose-700 font-semibold block">
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
