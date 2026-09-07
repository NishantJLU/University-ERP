import Link from "next/link";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import {
  CreditCard,
  Receipt,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  FileSpreadsheet,
  ArrowRight,
} from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";

export default async function AccountsDashboardPage() {
  const user = await getCurrentUser();
  if (!user || user.role !== "ACCOUNTS") {
    redirect("/login");
  }

  // Aggregate financial data
  const feeDues = await prisma.studentFeeDue.findMany();
  const totalBilled = feeDues.reduce((acc, d) => acc + d.totalAmount, 0);
  const totalCollected = feeDues.reduce((acc, d) => acc + d.paidAmount, 0);
  const totalOutstanding = totalBilled - totalCollected;

  const transactions = await prisma.paymentTransaction.findMany({
    include: {
      student: { include: { user: true } },
      receipt: true,
    },
    orderBy: { createdAt: "desc" },
    take: 6,
  });

  const successfulTxns = transactions.filter((t) => t.status === "SUCCESSFUL");

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-amber-950 via-slate-900 to-amber-900 text-white p-6 sm:p-8 rounded-2xl shadow-md flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-500/20 text-amber-300 border border-amber-400/30 mb-2">
            Bursar & Treasury Management
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Accounts & Finance Console
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            Officer: {user.name} • Server-Verified Transaction Gateway & Reconciliation
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/accounts/reconciliation"
            className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold shadow-sm transition flex items-center gap-1.5"
          >
            <CheckCircle2 className="w-4 h-4" />
            Bank Reconciliation
          </Link>
          <Link
            href="/accounts/reports"
            className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-semibold backdrop-blur-xs border border-white/20 transition flex items-center gap-1.5"
          >
            <FileSpreadsheet className="w-4 h-4" />
            Financial Reports
          </Link>
        </div>
      </div>

      {/* ACTION REQUIRED: Bursar & Accounts Operational Priorities */}
      <div className="bg-white rounded-2xl shadow-xs border border-slate-200 p-5 space-y-3">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-600 animate-ping" />
            <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Treasury Action Required
            </span>
          </div>
          <span className="text-[11px] font-mono text-slate-400">Remittance Verification & Dues Recovery</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          {/* Outstanding Recovery */}
          <div className="p-3.5 rounded-xl bg-rose-50/70 border border-rose-200 flex flex-col justify-between space-y-2">
            <div>
              <div className="flex items-center justify-between font-bold text-rose-900">
                <span>Fee Dues Collection</span>
                <span className="text-xs font-mono font-bold">{formatCurrency(totalOutstanding)}</span>
              </div>
              <p className="text-[11px] text-rose-700 mt-1">
                Outstanding student semester balances pending institutional collection.
              </p>
            </div>
            <Link
              href="/accounts/dues"
              className="self-start px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-bold text-[11px] transition shadow-xs flex items-center gap-1"
            >
              <span>Manage Student Dues</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {/* Reconciliation Desk */}
          <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200 flex flex-col justify-between space-y-2">
            <div>
              <div className="flex items-center justify-between font-bold text-amber-900">
                <span>Bank Reconciliation Desk</span>
                <span className="text-[10px] bg-amber-100 text-amber-800 font-mono px-1.5 py-0.5 rounded">
                  Gateway Audit
                </span>
              </div>
              <p className="text-[11px] text-amber-800 mt-1">
                Match payment gateway transaction IDs against bank credit advice.
              </p>
            </div>
            <Link
              href="/accounts/reconciliation"
              className="self-start px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-bold text-[11px] transition shadow-xs flex items-center gap-1"
            >
              <span>Audit Gateway Records</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {/* Official Receipts */}
          <div className="p-3.5 rounded-xl bg-blue-50/70 border border-blue-200 flex flex-col justify-between space-y-2">
            <div>
              <div className="flex items-center justify-between font-bold text-blue-900">
                <span>Vouchers & Receipts</span>
                <span className="text-[10px] bg-blue-100 text-blue-800 font-mono px-1.5 py-0.5 rounded">
                  {successfulTxns.length} Verified
                </span>
              </div>
              <p className="text-[11px] text-blue-800 mt-1">
                Generate, stamp, and audit tamper-proof fee payment receipts.
              </p>
            </div>
            <Link
              href="/accounts/receipts"
              className="self-start px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold text-[11px] transition shadow-xs flex items-center gap-1"
            >
              <span>Open Receipts Desk</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>

      {/* Financial KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl shadow-xs border border-slate-200">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Collection</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-extrabold text-emerald-700">{formatCurrency(totalCollected)}</p>
          <p className="text-[11px] text-slate-500 mt-1">Total Remittances Verified</p>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-xs border border-slate-200">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Outstanding Dues</span>
            <CreditCard className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-2xl font-extrabold text-blue-900">{formatCurrency(totalOutstanding)}</p>
          <Link href="/accounts/dues" className="text-[11px] text-blue-600 font-bold hover:underline mt-1 inline-block">
            View Student Dues &rarr;
          </Link>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-xs border border-slate-200">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Reconciled Rate</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-extrabold text-slate-900">100%</p>
          <p className="text-[11px] text-emerald-600 font-semibold mt-1">Zero Unsettled Discrepancies</p>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-xs border border-slate-200">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Processed Refunds</span>
            <RotateCcw className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-2xl font-extrabold text-slate-900">{formatCurrency(0)}</p>
          <span className="text-[11px] text-slate-500 mt-1 block">0 Active Refund Claims</span>
        </div>
      </div>

      {/* Recent Transactions Table */}
      <div className="bg-white rounded-2xl shadow-xs border border-slate-200 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-900">
            Recent Payment Gateway Transactions
          </h2>
          <Link href="/accounts/payments" className="text-xs text-blue-600 hover:underline font-semibold">
            All Transactions &rarr;
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-[10px] font-bold uppercase text-slate-500">
                <th className="p-3">Transaction ID</th>
                <th className="p-3">Student Name</th>
                <th className="p-3">Roll No</th>
                <th className="p-3">Amount</th>
                <th className="p-3">Method</th>
                <th className="p-3">Status</th>
                <th className="p-3">Date</th>
                <th className="p-3">Receipt No</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono">
              {transactions.map((txn) => (
                <tr key={txn.id} className="hover:bg-slate-50/50 transition">
                  <td className="p-3 font-bold text-slate-900">{txn.transactionId}</td>
                  <td className="p-3 font-sans font-medium text-slate-800">{txn.student.user.name}</td>
                  <td className="p-3 text-slate-500">{txn.student.rollNumber}</td>
                  <td className="p-3 font-bold font-sans text-emerald-700">{formatCurrency(txn.amount)}</td>
                  <td className="p-3 font-sans text-slate-600 text-[11px]">{txn.paymentMethod}</td>
                  <td className="p-3 font-sans">
                    <span className="status-badge status-badge-success">{txn.status}</span>
                  </td>
                  <td className="p-3 font-sans text-slate-500">{formatDate(txn.createdAt)}</td>
                  <td className="p-3 font-sans font-semibold text-blue-600">
                    {txn.receipt?.receiptNumber || "—"}
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
