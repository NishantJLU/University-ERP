import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { BarChart3, TrendingUp, CreditCard } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

export default async function AccountsReportsPage() {
  const user = await getCurrentUser();
  if (!user || user.role !== "ACCOUNTS") {
    redirect("/login");
  }

  const feeDues = await prisma.studentFeeDue.findMany();
  const totalBilled = feeDues.reduce((acc, d) => acc + d.totalAmount, 0);
  const totalCollected = feeDues.reduce((acc, d) => acc + d.paidAmount, 0);
  const totalOutstanding = totalBilled - totalCollected;

  return (
    <div className="space-y-6">
      <div>
        <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">
          Financial Intelligence
        </span>
        <h1 className="text-2xl font-extrabold text-slate-900 mt-1">
          Financial & Revenue Analytics
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Comprehensive fee collection progress, receivables forecasting, and cash flow reconciliation
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl shadow-xs border border-slate-200">
          <span className="text-xs font-bold uppercase text-slate-400">Total Billed Revenue</span>
          <p className="text-3xl font-extrabold text-slate-900 mt-1">{formatCurrency(totalBilled)}</p>
          <span className="text-[11px] text-slate-500">Current Academic Cycle</span>
        </div>
        <div className="bg-white p-5 rounded-2xl shadow-xs border border-slate-200">
          <span className="text-xs font-bold uppercase text-slate-400">Total Remitted</span>
          <p className="text-3xl font-extrabold text-emerald-700 mt-1">{formatCurrency(totalCollected)}</p>
          <span className="text-[11px] text-emerald-600 font-semibold">
            {Math.round((totalCollected / totalBilled) * 100)}% Collection Efficiency
          </span>
        </div>
        <div className="bg-white p-5 rounded-2xl shadow-xs border border-slate-200">
          <span className="text-xs font-bold uppercase text-slate-400">Accounts Receivable</span>
          <p className="text-3xl font-extrabold text-blue-900 mt-1">{formatCurrency(totalOutstanding)}</p>
          <span className="text-[11px] text-amber-600 font-semibold">Pending Student Remittance</span>
        </div>
      </div>
    </div>
  );
}
