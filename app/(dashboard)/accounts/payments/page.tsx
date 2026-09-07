import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Receipt, CheckCircle2, ShieldCheck } from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";

export default async function AccountsPaymentsPage() {
  const user = await getCurrentUser();
  if (!user || user.role !== "ACCOUNTS") {
    redirect("/login");
  }

  const transactions = await prisma.paymentTransaction.findMany({
    include: {
      student: { include: { user: true, program: true } },
      studentFeeDue: { include: { feeStructure: true } },
      receipt: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">
          Transaction Verification Desk
        </span>
        <h1 className="text-2xl font-extrabold text-slate-900 mt-1">
          Payment Transactions Log
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Audited gateway payment transactions with server-side HMAC validation and settlement status
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-xs border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-[10px] font-bold uppercase text-slate-500">
                <th className="p-3">Transaction ID</th>
                <th className="p-3">Gateway Ref</th>
                <th className="p-3">Student Name</th>
                <th className="p-3">Roll Number</th>
                <th className="p-3">Amount</th>
                <th className="p-3">Method</th>
                <th className="p-3">Status</th>
                <th className="p-3">Receipt Number</th>
                <th className="p-3">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono">
              {transactions.map((txn) => (
                <tr key={txn.id} className="hover:bg-slate-50/50 transition">
                  <td className="p-3 font-bold text-slate-900">{txn.transactionId}</td>
                  <td className="p-3 text-slate-500 text-[11px]">{txn.referenceNo}</td>
                  <td className="p-3 font-sans font-semibold text-slate-900">{txn.student.user.name}</td>
                  <td className="p-3 text-slate-600">{txn.student.rollNumber}</td>
                  <td className="p-3 font-sans font-bold text-emerald-700">{formatCurrency(txn.amount)}</td>
                  <td className="p-3 font-sans text-slate-600 text-[11px]">{txn.paymentMethod}</td>
                  <td className="p-3 font-sans">
                    <span className="status-badge status-badge-success">{txn.status}</span>
                  </td>
                  <td className="p-3 font-sans font-bold text-blue-600">
                    {txn.receipt?.receiptNumber || "Pending"}
                  </td>
                  <td className="p-3 font-sans text-slate-500 text-[11px]">{formatDate(txn.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
