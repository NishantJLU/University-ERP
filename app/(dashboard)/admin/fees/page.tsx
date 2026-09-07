import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { CreditCard, Plus } from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";

export default async function AdminFeesPage() {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") {
    redirect("/login");
  }

  const structures = await prisma.feeStructure.findMany({
    include: {
      program: true,
      semester: true,
      academicYear: true,
      studentDues: true,
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-rose-600 uppercase tracking-wider">
            Financial Policies
          </span>
          <h1 className="text-2xl font-extrabold text-slate-900 mt-1">
            University Fee Structure Configuration
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Institutional fee brackets, tuition levies, and semester payment deadlines
          </p>
        </div>

        <button
          type="button"
          className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold shadow-sm transition flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          Configure Fee Structure
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
                <span className="px-2.5 py-0.5 rounded font-mono font-bold text-[10px] bg-blue-50 text-blue-700 border border-blue-200">
                  {s.program.code}
                </span>
                <h3 className="text-sm font-bold text-slate-900 mt-1.5">{s.title}</h3>
                <p className="text-xs text-slate-500">
                  Semester {s.semester.number} • {s.academicYear.name}
                </p>
              </div>
              <span className="text-base font-extrabold text-slate-900">
                {formatCurrency(s.totalAmount)}
              </span>
            </div>

            <div className="space-y-2 pt-3 border-t border-slate-100 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Tuition:</span>
                <span className="font-semibold text-slate-900">{formatCurrency(s.tuitionFee)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Lab & Practical:</span>
                <span className="font-semibold text-slate-900">{formatCurrency(s.labFee)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Library & Examination:</span>
                <span className="font-semibold text-slate-900">{formatCurrency(s.libraryFee + s.examFee)}</span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-500 flex justify-between">
              <span>Billed to {s.studentDues.length} Students</span>
              <span>Due: {formatDate(s.dueDate)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
