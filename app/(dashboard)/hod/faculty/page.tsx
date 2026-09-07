import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Users, Mail, Phone, BookOpen, Briefcase } from "lucide-react";

export default async function HODFacultyPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  if (user.role !== "HOD" && user.role !== "ADMIN") {
    redirect(`/${user.role.toLowerCase()}/dashboard`);
  }

  const deptId = user.departmentId || (await prisma.department.findFirst())?.id;

  const faculty = await prisma.faculty.findMany({
    where: deptId ? { departmentId: deptId } : {},
    include: {
      user: true,
      assignments: {
        include: { subject: true, section: true },
      },
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <span className="text-xs font-bold text-purple-600 uppercase tracking-wider">
          Department Personnel
        </span>
        <h1 className="text-2xl font-extrabold text-slate-900 mt-1">
          Faculty Directory & Workload
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Academic rank, qualifications, research specializations, and assigned teaching loads
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {faculty.map((fac) => (
          <div
            key={fac.id}
            className="bg-white rounded-2xl shadow-xs border border-slate-200 p-6 space-y-4"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-800 font-extrabold flex items-center justify-center text-sm">
                  {fac.user.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">{fac.user.name}</h3>
                  <p className="text-xs text-slate-500 font-mono">{fac.employeeCode} • {fac.designation}</p>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                Active
              </span>
            </div>

            <div className="space-y-1.5 text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100">
              <p><span className="font-semibold text-slate-700">Qualification:</span> {fac.qualification || "Ph.D"}</p>
              <p><span className="font-semibold text-slate-700">Specialization:</span> {fac.specialization || "Distributed Computing"}</p>
              <p><span className="font-semibold text-slate-700">Email:</span> {fac.user.email}</p>
            </div>

            <div>
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">
                Teaching Allocations ({fac.assignments.length} Courses)
              </h4>
              <div className="space-y-1.5">
                {fac.assignments.map((alloc) => (
                  <div key={alloc.id} className="p-2 rounded-lg border border-slate-200 text-xs flex items-center justify-between">
                    <span className="font-semibold text-slate-800">{alloc.subject.code}: {alloc.subject.name}</span>
                    <span className="font-mono text-[10px] bg-slate-100 px-1.5 py-0.2 rounded text-slate-600">{alloc.section.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
