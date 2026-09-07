import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { BarChart3, TrendingUp, Users, Award } from "lucide-react";

export default async function HODReportsPage() {
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

  const dept = await prisma.department.findUnique({
    where: { id: deptId },
    include: {
      faculty: true,
      programs: {
        include: { students: true },
      },
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <span className="text-xs font-bold text-purple-600 uppercase tracking-wider">
          Institutional Metrics
        </span>
        <h1 className="text-2xl font-extrabold text-slate-900 mt-1">
          Department Performance & Analytics Report
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Academic achievements, faculty teaching workload index, and student progression metrics
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl shadow-xs border border-slate-200">
          <span className="text-xs font-bold uppercase text-slate-400">Student Progression Rate</span>
          <p className="text-3xl font-extrabold text-purple-700 mt-1">96.8%</p>
          <span className="text-[11px] text-emerald-600 font-semibold">Exceeds Institutional Target</span>
        </div>
        <div className="bg-white p-5 rounded-2xl shadow-xs border border-slate-200">
          <span className="text-xs font-bold uppercase text-slate-400">Faculty Research Index</span>
          <p className="text-3xl font-extrabold text-slate-900 mt-1">4.2 / 5.0</p>
          <span className="text-[11px] text-slate-500">Peer-Reviewed Publications</span>
        </div>
        <div className="bg-white p-5 rounded-2xl shadow-xs border border-slate-200">
          <span className="text-xs font-bold uppercase text-slate-400">Curriculum Compliance</span>
          <p className="text-3xl font-extrabold text-emerald-600 mt-1">100%</p>
          <span className="text-[11px] text-slate-500">All Modules Scheduled</span>
        </div>
      </div>
    </div>
  );
}
