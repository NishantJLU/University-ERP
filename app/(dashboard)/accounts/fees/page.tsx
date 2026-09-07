import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { FileSpreadsheet, Plus } from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";

export default async function AccountsFeesPage() {
  const user = await getCurrentUser();
  if (!user || user.role !== "ACCOUNTS") {
    redirect("/login");
  }

  const structures = await prisma.feeStructure.findMany({
    include: {
      program: true,
      semester: true,
      academicYear: true,
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">
            Fee Policy & Schedule
          </span>
          <h1 className="text-2xl font-extrabold text-slate-900 mt-1">
            Program Fee Structures
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Institutional fee categories, laboratory fees, examination charges, and payment deadlines
          </p>
        </div>

        <button
          type="button"
          className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold shadow-sm transition flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          Create New Fee Structure
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {structures.map((s) => (
          <div
            key={s.id}
            className="bg-white rounded-2xl shadow-xs border border-slate-200 p-6 space-y-4"
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-blue-50 text-blue-700 border border-blue-200">
                  {s.program.code} • Sem {s.semester.number}
                </span>
                <h3 className="text-sm font-bold text-slate-900 mt-1.5">{s.title}</h3>
                <p className="text-xs text-slate-500">Academic Year: {s.academicYear.name}</p>
              </div>
              <span className="text-base font-extrabold text-slate-900">
                {formatCurrency(s.totalAmount)}
              </span>
            </div>

            <div className="space-y-2 pt-3 border-t border-slate-100 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Tuition Fee:</span>
                <span className="font-semibold text-slate-900">{formatCurrency(s.tuitionFee)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Laboratory & Practical Fee:</span>
                <span className="font-semibold text-slate-900">{formatCurrency(s.labFee)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Library & Digital Resources:</span>
                <span className="font-semibold text-slate-900">{formatCurrency(s.libraryFee)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Examination & Assessment Fee:</span>
                <span className="font-semibold text-slate-900">{formatCurrency(s.examFee)}</span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-500 flex justify-between">
              <span>Payment Deadline:</span>
              <span className="font-bold text-amber-700">{formatDate(s.dueDate)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
