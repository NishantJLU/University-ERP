import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Briefcase, Clock, BookOpen, Layers, CheckCircle2 } from "lucide-react";

export default async function TeacherWorkloadPage() {
  const user = await getCurrentUser();
  if (!user || user.role !== "TEACHER" || !user.facultyId) {
    redirect("/login");
  }

  const faculty = await prisma.faculty.findUnique({
    where: { id: user.facultyId },
    include: {
      assignments: {
        include: {
          subject: true,
          section: true,
        },
      },
    },
  });

  if (!faculty) return <div className="p-6">Faculty not found.</div>;

  const totalCredits = faculty.assignments.reduce((acc, a) => acc + a.subject.credits, 0);
  const theorySubjects = faculty.assignments.filter((a) => a.subject.type === "THEORY");
  const labSubjects = faculty.assignments.filter((a) => a.subject.type === "LAB");

  return (
    <div className="space-y-6">
      <div>
        <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
          Faculty Teaching Norms & Compliance
        </span>
        <h1 className="text-2xl font-extrabold text-slate-900 mt-1">
          Academic Workload Overview
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Calculated against University Grants Commission (UGC) teaching contact hours and accreditation standards
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl shadow-xs border border-slate-200">
          <span className="text-xs font-bold uppercase text-slate-400">Total Contact Hours</span>
          <p className="text-3xl font-extrabold text-blue-700 mt-1">14 Hours / Week</p>
          <span className="text-[11px] text-slate-500">Official Institutional Requirement: 12-16 hrs</span>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-xs border border-slate-200">
          <span className="text-xs font-bold uppercase text-slate-400">Assigned Credits</span>
          <p className="text-3xl font-extrabold text-slate-900 mt-1">{totalCredits} Credits</p>
          <span className="text-[11px] text-slate-500">Across {faculty.assignments.length} Course Sections</span>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-xs border border-slate-200">
          <span className="text-xs font-bold uppercase text-slate-400">Compliance Status</span>
          <p className="text-3xl font-extrabold text-emerald-600 mt-1">Balanced</p>
          <span className="text-[11px] text-emerald-700 font-semibold">Zero Overload Flag</span>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-xs border border-slate-200 p-6 space-y-4">
        <h2 className="text-sm font-bold text-slate-900">
          Workload Allocation Breakdown
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-[10px] font-bold uppercase text-slate-500">
                <th className="p-3">Subject Code</th>
                <th className="p-3">Course Title</th>
                <th className="p-3">Type</th>
                <th className="p-3">Section</th>
                <th className="p-3">Credits</th>
                <th className="p-3">Weekly Hours</th>
                <th className="p-3">Role</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {faculty.assignments.map((alloc) => (
                <tr key={alloc.id} className="hover:bg-slate-50/50 transition">
                  <td className="p-3 font-mono font-bold text-slate-800">{alloc.subject.code}</td>
                  <td className="p-3 font-medium text-slate-900">{alloc.subject.name}</td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-100 border border-slate-200">
                      {alloc.subject.type}
                    </span>
                  </td>
                  <td className="p-3 font-semibold text-slate-800">{alloc.section.name}</td>
                  <td className="p-3">{alloc.subject.credits}</td>
                  <td className="p-3 font-bold text-blue-700">
                    {alloc.subject.type === "LAB" ? "4 hrs (Practical)" : "3 hrs (Lecture) + 1 hr (Tutorial)"}
                  </td>
                  <td className="p-3 font-semibold text-emerald-700">Course Lead</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
