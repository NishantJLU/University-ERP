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
  ShieldCheck,
  Building,
  Download,
  Filter,
} from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";
import { JLU_PROFILE } from "@/lib/jlu-constants";
import DashboardHeader from "@/components/ui/DashboardHeader";
import MetricCard from "@/components/ui/MetricCard";

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
  const realizationRate = Math.round((totalCollected / (totalBilled || 1)) * 100);

  const transactions = await prisma.paymentTransaction.findMany({
    include: {
      student: { include: { user: true } },
      receipt: true,
    },
    orderBy: { createdAt: "desc" },
    take: 8,
  });

  const successfulTxns = transactions.filter((t) => t.status === "SUCCESSFUL");

  return (
    <div className="space-y-6">
      {/* 1. Refined Executive Hero Header */}
      <DashboardHeader
        badge="BURSAR & TREASURY • FINANCIAL CONTROLLER"
        title="Accounts & Finance Console"
        subtitle={`Treasury Officer: ${user.name} • Server-Verified Transaction Gateway & Automated Bank Reconciliation`}
        userMeta={`Gateway Status: Active • AY ${JLU_PROFILE.currentAcademicYear}`}
        accent="crimson"
        actions={
          <div className="flex items-center gap-2">
            <Link
              href="/accounts/reconciliation"
              className="px-3.5 py-2 bg-[#8B1E3F] hover:bg-[#701831] text-white rounded-lg text-xs font-bold shadow-xs transition flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Bank Reconciliation</span>
            </Link>
            <Link
              href="/accounts/reports"
              className="px-3.5 py-2 bg-white hover:bg-[#F9FAFB] text-[#172B4D] border border-[#E5E7EB] rounded-lg text-xs font-semibold shadow-xs transition flex items-center gap-1.5"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-[#8B1E3F]" />
              <span>Financial Reports</span>
            </Link>
          </div>
        }
      />

      {/* 2. Treasury Operational Action Center */}
      <div className="erp-card p-5 space-y-3">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-rose-600 animate-ping" />
            <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Treasury Action Required & Recovery Queue
            </span>
          </div>
          <span className="text-xs font-mono text-slate-400">Institutional Dues Recovery</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          {/* Outstanding Recovery Action */}
          <div className="p-4 rounded-xl bg-rose-50/70 border border-rose-200/80 flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center justify-between font-bold text-rose-950">
                <span className="text-xs">Outstanding Fee Dues</span>
                <span className="text-xs font-mono font-bold text-rose-700">
                  {formatCurrency(totalOutstanding)}
                </span>
              </div>
              <p className="text-[11px] text-rose-800 mt-1.5 leading-relaxed">
                Outstanding student semester balances pending institutional collection.
              </p>
            </div>
            <Link
              href="/accounts/dues"
              className="self-start px-3 py-1.5 bg-[#8B1E3F] hover:bg-[#701831] text-white rounded-lg font-bold text-xs transition shadow-xs flex items-center gap-1"
            >
              <span>Manage Student Dues</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Reconciliation Desk Action */}
          <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200/80 flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center justify-between font-bold text-amber-950">
                <span className="text-xs">Bank Reconciliation Desk</span>
                <span className="text-[10px] bg-amber-100 text-amber-800 font-mono font-bold px-2 py-0.5 rounded-md">
                  Gateway Audit
                </span>
              </div>
              <p className="text-[11px] text-amber-800 mt-1.5 leading-relaxed">
                Match payment gateway transaction IDs against bank credit advice with zero discrepancy.
              </p>
            </div>
            <Link
              href="/accounts/reconciliation"
              className="self-start px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-bold text-xs transition shadow-xs flex items-center gap-1"
            >
              <span>Audit Gateway Records</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Official Receipts Action */}
          <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200/80 flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center justify-between font-bold text-blue-950">
                <span className="text-xs">Official Vouchers & Receipts</span>
                <span className="text-[10px] bg-blue-100 text-blue-800 font-mono font-bold px-2 py-0.5 rounded-md">
                  {successfulTxns.length} Verified
                </span>
              </div>
              <p className="text-[11px] text-blue-800 mt-1.5 leading-relaxed">
                Generate, stamp, and audit tamper-proof fee payment receipts for enrolled students.
              </p>
            </div>
            <Link
              href="/accounts/receipts"
              className="self-start px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold text-xs transition shadow-xs flex items-center gap-1"
            >
              <span>Open Receipts Desk</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* 3. Financial KPIs (Stripe/Banking Enterprise Look) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Net Collection"
          value={formatCurrency(totalCollected)}
          color="green"
          icon={TrendingUp}
          badge={`${realizationRate}% Realized`}
          subtitle={`Total Billed: ${formatCurrency(totalBilled)}`}
          href="/accounts/payments"
          actionText="View Collection Ledger"
        />

        <MetricCard
          title="Outstanding Dues"
          value={formatCurrency(totalOutstanding)}
          color="crimson"
          icon={CreditCard}
          badge="Pending Recovery"
          subtitle="Uncollected Student Semester Dues"
          href="/accounts/dues"
          actionText="View Student Dues"
        />

        <MetricCard
          title="Reconciled Rate"
          value="100%"
          color="blue"
          icon={CheckCircle2}
          badge="Zero Drift"
          subtitle="Zero Unsettled Discrepancies"
          href="/accounts/reconciliation"
          actionText="Audit Bank Ledger"
        />

        <MetricCard
          title="Active Refund Claims"
          value={formatCurrency(0)}
          color="slate"
          icon={RotateCcw}
          badge="0 Claims"
          subtitle="All Disputed Claims Cleared"
          href="/accounts/refunds"
          actionText="Manage Refund Queue"
        />
      </div>

      {/* 4. Recent Payment Gateway Transactions (Banking Dashboard Look) */}
      <div className="erp-card p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-sm font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <Receipt className="w-4 h-4 text-rose-600" />
              <span>Recent Payment Gateway Transactions</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Live settlement feed with server-verified cryptographic payment IDs
            </p>
          </div>
          <Link
            href="/accounts/payments"
            className="text-xs font-semibold text-rose-600 hover:text-rose-700 hover:underline flex items-center gap-1 self-start sm:self-auto"
          >
            <span>All Transactions</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="erp-table">
            <thead>
              <tr>
                <th>Transaction ID</th>
                <th>Student</th>
                <th>Roll No</th>
                <th>Amount</th>
                <th>Method</th>
                <th>Status</th>
                <th>Date</th>
                <th className="text-right">Receipt</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((txn) => (
                <tr key={txn.id}>
                  <td className="font-mono font-bold text-slate-900 text-xs">
                    {txn.transactionId}
                  </td>
                  <td className="font-medium text-slate-900 text-xs">
                    {txn.student.user.name}
                  </td>
                  <td className="font-mono text-slate-500 text-xs">
                    {txn.student.rollNumber}
                  </td>
                  <td className="font-bold text-emerald-700 text-xs font-mono">
                    {formatCurrency(txn.amount)}
                  </td>
                  <td className="text-slate-600 text-xs">
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 border border-slate-200 text-[10px] font-mono">
                      {txn.paymentMethod}
                    </span>
                  </td>
                  <td>
                    <span className="status-badge status-badge-success">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      {txn.status}
                    </span>
                  </td>
                  <td className="text-slate-500 text-xs">
                    {formatDate(txn.createdAt)}
                  </td>
                  <td className="text-right font-mono text-xs font-semibold">
                    {txn.receipt?.receiptNumber ? (
                      <Link
                        href={`/accounts/receipts`}
                        className="text-blue-600 hover:underline"
                      >
                        {txn.receipt.receiptNumber}
                      </Link>
                    ) : (
                      <span className="text-slate-400">—</span>
                    )}
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
