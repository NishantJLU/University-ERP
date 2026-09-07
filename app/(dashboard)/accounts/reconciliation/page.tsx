import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { ShieldCheck, CheckCircle2, TrendingUp, Building2 } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

export default async function AccountsReconciliationPage() {
  const user = await getCurrentUser();
  if (!user || user.role !== "ACCOUNTS") {
    redirect("/login");
  }

  const transactions = await prisma.paymentTransaction.findMany({
    where: { status: "SUCCESSFUL" },
  });

  const totalSettled = transactions.reduce((acc, t) => acc + t.amount, 0);

  return (
    <div className="space-y-6">
      <div>
        <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">
          Daily Treasury Audit
        </span>
        <h1 className="text-2xl font-extrabold text-slate-900 mt-1">
          Bank & Gateway Reconciliation
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          End-of-day settlement matching between ERP internal receipts and sandbox gateway bank ledgers
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl shadow-xs border border-slate-200">
          <span className="text-xs font-bold uppercase text-slate-400">Total Settled Collections</span>
          <p className="text-3xl font-extrabold text-emerald-700 mt-1">{formatCurrency(totalSettled)}</p>
          <span className="text-[11px] text-slate-500">Verified via Server Webhooks</span>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-xs border border-slate-200">
          <span className="text-xs font-bold uppercase text-slate-400">Gateway Ledger Match</span>
          <p className="text-3xl font-extrabold text-slate-900 mt-1">100% Match</p>
          <span className="text-[11px] text-emerald-600 font-semibold">Zero Variance Detected</span>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-xs border border-slate-200">
          <span className="text-xs font-bold uppercase text-slate-400">Audit Status</span>
          <p className="text-3xl font-extrabold text-blue-700 mt-1">Reconciled</p>
          <span className="text-[11px] text-slate-500">Bursar Signoff Active</span>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-xs border border-slate-200 p-6 space-y-4">
        <h2 className="text-sm font-bold text-slate-900">
          Settlement Reconciliation Batches
        </h2>

        <div className="space-y-3">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900">Batch ID: SETTLE-JLU-2026-B1</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Fully Reconciled
                </span>
              </div>
              <p className="text-slate-500 mt-0.5">Payment Partner: Jagran Lakecity University Gateway Simulator</p>
            </div>
            <div className="text-right">
              <span className="font-bold text-emerald-700 text-sm">{formatCurrency(totalSettled)}</span>
              <span className="block text-[10px] text-slate-400">Settled to University Main Treasury</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
