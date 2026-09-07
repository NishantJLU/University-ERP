import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Briefcase, Plus, CheckCircle2 } from "lucide-react";

export default async function AdminFacultyAllocationPage() {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") {
    redirect("/login");
  }

  const allocations = await prisma.facultyAssignment.findMany({
    include: {
      faculty: { include: { user: true, department: true } },
      subject: true,
      section: true,
      academicYear: true,
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-rose-600 uppercase tracking-wider">
            Academic Allocation
          </span>
          <h1 className="text-2xl font-extrabold text-slate-900 mt-1">
            Faculty Course Allocations
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Assign professors and instructors to subjects and student sections (automatically provisions LMS instructors)
          </p>
        </div>

        <button
          type="button"
          className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold shadow-sm transition flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          Assign Faculty to Course
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-xs border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-[10px] font-bold uppercase text-slate-500">
                <th className="p-3">Faculty Member</th>
                <th className="p-3">Department</th>
                <th className="p-3">Course Code</th>
                <th className="p-3">Course Title</th>
                <th className="p-3">Section</th>
                <th className="p-3">Academic Year</th>
                <th className="p-3">LMS Role</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {allocations.map((alloc) => (
                <tr key={alloc.id} className="hover:bg-slate-50/50 transition">
                  <td className="p-3 font-semibold text-slate-900">{alloc.faculty.user.name}</td>
                  <td className="p-3 text-slate-600">{alloc.faculty.department.code}</td>
                  <td className="p-3 font-mono font-bold text-blue-700">{alloc.subject.code}</td>
                  <td className="p-3 font-medium text-slate-800">{alloc.subject.name}</td>
                  <td className="p-3 font-mono font-bold text-slate-800">{alloc.section.name}</td>
                  <td className="p-3 text-slate-500">{alloc.academicYear.name}</td>
                  <td className="p-3">
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      <CheckCircle2 className="w-3 h-3" /> Auto-Synced LMS Instructor
                    </span>
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
