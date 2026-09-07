import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { FileSpreadsheet, Download } from "lucide-react";

export default async function ManagementReportsPage() {
  const user = await getCurrentUser();
  if (!user || user.role !== "MANAGEMENT") {
    redirect("/login");
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Chancellor Briefing
          </span>
          <h1 className="text-2xl font-extrabold text-slate-900 mt-1">
            Executive Institutional Reports
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Quarterly audit summaries, academic senate resolutions, and compliance packages
          </p>
        </div>

        <button
          type="button"
          className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-sm transition"
        >
          <Download className="w-4 h-4" />
          Export Chancellor Briefing PDF
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-xs border border-slate-200 p-6 space-y-4">
        <h2 className="text-sm font-bold text-slate-900">
          Executive Document Dossier
        </h2>

        <div className="space-y-3 text-xs">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
            <div>
              <p className="font-bold text-slate-900">Autumn Semester 2026 Comprehensive Review.pdf</p>
              <p className="text-[11px] text-slate-500">Student Progression, Attendance Indices & Fee Realization</p>
            </div>
            <span className="px-3 py-1 bg-white border border-slate-200 font-semibold rounded-lg text-slate-700">
              Generated Today
            </span>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
            <div>
              <p className="font-bold text-slate-900">University Statutory Accreditation Dossier 2026-27.pdf</p>
              <p className="text-[11px] text-slate-500">Faculty-to-Student Ratios, Classroom Capacities & Lab Utilizations</p>
            </div>
            <span className="px-3 py-1 bg-white border border-slate-200 font-semibold rounded-lg text-slate-700">
              Verified
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
