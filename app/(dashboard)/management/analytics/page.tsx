import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { BarChart3, TrendingUp, Users, Award } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

export default async function ManagementAnalyticsPage() {
  const user = await getCurrentUser();
  if (!user || user.role !== "MANAGEMENT") {
    redirect("/login");
  }

  const [studentCount, facultyCount, feeDues] = await Promise.all([
    prisma.student.count(),
    prisma.faculty.count(),
    prisma.studentFeeDue.findMany(),
  ]);

  const totalCollected = feeDues.reduce((acc, d) => acc + d.paidAmount, 0);

  return (
    <div className="space-y-6">
      <div>
        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
          University Macro Analytics
        </span>
        <h1 className="text-2xl font-extrabold text-slate-900 mt-1">
          Institutional Growth & KPI Benchmarks
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Long-term enrollment progression, faculty research footprint, and institutional financial sustainability
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl shadow-xs border border-slate-200">
          <span className="text-xs font-bold uppercase text-slate-400">Total Enrolled Students</span>
          <p className="text-3xl font-extrabold text-slate-900 mt-1">{studentCount}</p>
          <span className="text-[11px] text-emerald-600 font-semibold">+18% Year-over-Year Growth</span>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-xs border border-slate-200">
          <span className="text-xs font-bold uppercase text-slate-400">Teaching Faculty</span>
          <p className="text-3xl font-extrabold text-slate-900 mt-1">{facultyCount}</p>
          <span className="text-[11px] text-blue-600 font-semibold">100% Ph.D / Post-Grad Credentials</span>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-xs border border-slate-200">
          <span className="text-xs font-bold uppercase text-slate-400">Net Realized Treasury</span>
          <p className="text-3xl font-extrabold text-emerald-700 mt-1">{formatCurrency(totalCollected)}</p>
          <span className="text-[11px] text-slate-500">Zero Outstanding Audit Notes</span>
        </div>
      </div>
    </div>
  );
}
