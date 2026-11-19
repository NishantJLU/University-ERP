import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  Building,
  Users,
  GraduationCap,
  School,
  BookOpen,
  ArrowRight,
  MapPin,
  CalendarDays,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import DashboardHeader from "@/components/ui/DashboardHeader";
import MetricCard from "@/components/ui/MetricCard";

export default async function HODDepartmentPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  if (user.role !== "HOD" && user.role !== "ADMIN") {
    redirect(`/${user.role.toLowerCase()}/dashboard`);
  }

  const deptId = user.departmentId || (await prisma.department.findFirst())?.id;

  const department = await prisma.department.findUnique({
    where: { id: deptId },
    include: {
      faculty: {
        include: {
          user: true,
          assignments: {
            include: { subject: true, section: true },
          },
        },
      },
      programs: {
        include: {
          semesters: {
            include: {
              subjects: true,
              sections: {
                include: { students: true },
              },
            },
          },
          students: {
            include: { user: true },
          },
        },
      },
    },
  });

  if (!department) {
    return (
      <div className="p-8 text-sm text-[#546574] bg-white rounded-xl border border-[#E2E8F0]">
        Department record not found or not assigned to this account.
      </div>
    );
  }

  // Aggregate metrics
  const totalFaculty = department.faculty.length;
  const totalStudents = department.programs.reduce(
    (acc, p) => acc + p.students.length,
    0
  );
  const totalPrograms = department.programs.length;
  const totalSubjects = department.programs.reduce(
    (acc, p) =>
      acc +
      p.semesters.reduce((sAcc, s) => sAcc + s.subjects.length, 0),
    0
  );

  return (
    <div className="space-y-6">
      {/* 1. Header */}
      <DashboardHeader
        badge="ACADEMIC UNIT GOVERNANCE"
        title={department.name}
        subtitle={`${department.description || "Faculty & School Administration"} • Location: ${department.building || "Block A, Campus Core"}`}
        userMeta={`Department Code: ${department.code} • Dean/HOD: ${user.name}`}
        accent="burgundy"
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <Link
              href="/hod/faculty"
              className="px-3.5 py-2 bg-[#027EA1] hover:bg-[#026A88] text-white rounded-lg text-xs font-bold shadow-xs transition flex items-center gap-1.5"
            >
              <Users className="w-3.5 h-3.5" />
              <span>Faculty Roster ({totalFaculty})</span>
            </Link>
            <Link
              href="/hod/students"
              className="px-3.5 py-2 bg-white hover:bg-[#F9FAFB] text-[#21313C] border border-[#E2E8F0] rounded-lg text-xs font-semibold shadow-xs transition flex items-center gap-1.5"
            >
              <GraduationCap className="w-3.5 h-3.5 text-[#027EA1]" />
              <span>Enrolled Students ({totalStudents})</span>
            </Link>
          </div>
        }
      />

      {/* 2. Core Metrics Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Degree Programs"
          value={totalPrograms}
          color="burgundy"
          icon={School}
          badge="Curriculum"
          subtitle="UG, PG & Specialized Programs"
        />

        <MetricCard
          title="Appointed Faculty"
          value={totalFaculty}
          color="green"
          icon={Users}
          badge="Active Body"
          subtitle="Professors & Instructors"
          href="/hod/faculty"
          actionText="View Faculty Directory"
        />

        <MetricCard
          title="Enrolled Census"
          value={totalStudents}
          color="blue"
          icon={GraduationCap}
          badge="Active Cohort"
          subtitle="Students across all batches"
          href="/hod/students"
          actionText="View Student Roster"
        />

        <MetricCard
          title="Curricular Subjects"
          value={totalSubjects}
          color="purple"
          icon={BookOpen}
          badge="Active Syllabus"
          subtitle="Courses currently mapped"
        />
      </div>

      {/* 3. Department Overview & Institutional Profile */}
      <div className="bg-white rounded-xl border border-[#E2E8F0] p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#E2E8F0] gap-2">
          <div>
            <h2 className="text-sm font-bold text-[#21313C] uppercase tracking-wider flex items-center gap-2">
              <Building className="w-4 h-4 text-[#027EA1]" />
              <span>Departmental Charter & Academic Profile</span>
            </h2>
            <p className="text-xs text-[#546574] mt-0.5">
              Official school accreditation, venue allocation, and leadership structure
            </p>
          </div>
          <span className="text-[11px] font-mono px-2.5 py-1 rounded-md bg-[#EAF5F8] text-[#027EA1] border border-[#027EA1]/20 font-semibold self-start sm:self-auto">
            Code: {department.code}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-lg bg-[#F9FAFB] border border-[#E2E8F0] space-y-1">
            <span className="text-[10px] font-bold text-[#8D9BA8] uppercase tracking-wider block">
              Head of Department
            </span>
            <p className="font-bold text-[#21313C] text-sm">{user.name}</p>
            <p className="text-[#546574]">{user.email}</p>
          </div>

          <div className="p-4 rounded-lg bg-[#F9FAFB] border border-[#E2E8F0] space-y-1">
            <span className="text-[10px] font-bold text-[#8D9BA8] uppercase tracking-wider block">
              Campus Venue & Block
            </span>
            <p className="font-bold text-[#21313C] text-sm flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#027EA1]" />
              <span>{department.building || "Block A • Academic Core"}</span>
            </p>
            <p className="text-[#546574]">Jagran Lakecity University, Bhopal</p>
          </div>

          <div className="p-4 rounded-lg bg-[#F9FAFB] border border-[#E2E8F0] space-y-1">
            <span className="text-[10px] font-bold text-[#8D9BA8] uppercase tracking-wider block">
              Academic Accreditation
            </span>
            <p className="font-bold text-[#21313C] text-sm flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#16845B]" />
              <span>UGC & NAAC Aligned</span>
            </p>
            <p className="text-[#546574]">Continuous Internal Assessment Enabled</p>
          </div>
        </div>

        {department.description && (
          <div className="p-4 rounded-lg bg-white border border-[#E2E8F0] text-xs text-[#546574] leading-relaxed">
            <span className="font-bold text-[#21313C] block mb-1">Academic Statement:</span>
            {department.description}
          </div>
        )}
      </div>

      {/* 4. Degree Programs Under This Department */}
      <div className="bg-white rounded-xl border border-[#E2E8F0] p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#E2E8F0] gap-2">
          <div>
            <h2 className="text-sm font-bold text-[#21313C] uppercase tracking-wider flex items-center gap-2">
              <School className="w-4 h-4 text-[#027EA1]" />
              <span>Degree Programs Offered ({department.programs.length})</span>
            </h2>
            <p className="text-xs text-[#546574] mt-0.5">
              Undergraduate, postgraduate, and professional pathways administered by this department
            </p>
          </div>
        </div>

        <div className="overflow-x-auto w-full">
          <table className="w-full text-left text-xs min-w-[700px] border-collapse">
            <thead>
              <tr className="border-b border-[#E2E8F0] bg-[#F9FAFB] text-[10px] font-bold uppercase text-[#8D9BA8]">
                <th className="p-3">Program Code</th>
                <th className="p-3">Program Title</th>
                <th className="p-3">Degree Level</th>
                <th className="p-3">Duration</th>
                <th className="p-3">Active Semesters</th>
                <th className="p-3">Enrolled Students</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0]">
              {department.programs.map((prog) => (
                <tr key={prog.id} className="hover:bg-[#F9FAFB] transition">
                  <td className="p-3 font-mono font-bold text-[#027EA1]">
                    {prog.code}
                  </td>
                  <td className="p-3 font-semibold text-[#21313C]">
                    {prog.name}
                  </td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#EDF3FA] text-[#3567A5] border border-[#BFDBFE]">
                      {prog.degreeType}
                    </span>
                  </td>
                  <td className="p-3 text-[#546574]">
                    {prog.durationYears} {prog.durationYears === 1 ? "Year" : "Years"}
                  </td>
                  <td className="p-3 text-[#546574]">
                    {prog.semesters.length} {prog.semesters.length === 1 ? "Semester" : "Semesters"}
                  </td>
                  <td className="p-3 font-mono font-semibold text-[#21313C]">
                    {prog.students.length} Students
                  </td>
                  <td className="p-3 text-right">
                    <Link
                      href="/hod/students"
                      className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#027EA1] hover:underline"
                    >
                      <span>View Roster</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
