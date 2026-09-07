import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { CreditCard, CheckCircle2, AlertCircle } from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";

export default async function AccountsDuesPage() {
  const user = await getCurrentUser();
  if (!user || user.role !== "ACCOUNTS") {
    redirect("/login");
  }

  const dues = await prisma.studentFeeDue.findMany({
    include: {
      student: {
        include: {
          user: true,
          program: true,
        },
      },
      feeStructure: true,
    },
    orderBy: { dueDate: "asc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">
          Student Financial Accounts
        </span>
        <h1 className="text-2xl font-extrabold text-slate-900 mt-1">
          Student Fee Dues & Receivables
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Real-time ledger of student fee invoices, settled amounts, and outstanding collection balances
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-xs border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-[10px] font-bold uppercase text-slate-500">
                <th className="p-3">Roll No</th>
                <th className="p-3">Student Name</th>
                <th className="p-3">Program</th>
                <th className="p-3">Fee Title</th>
                <th className="p-3">Total Amount</th>
                <th className="p-3">Paid Amount</th>
                <th className="p-3">Pending Balance</th>
                <th className="p-3">Status</th>
                <th className="p-3">Due Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {dues.map((due) => {
                const pending = due.totalAmount - due.paidAmount;
                return (
                  <tr key={due.id} className="hover:bg-slate-50/50 transition">
                    <td className="p-3 font-mono font-bold text-slate-800">{due.student.rollNumber}</td>
                    <td className="p-3 font-semibold text-slate-900">{due.student.user.name}</td>
                    <td className="p-3 text-slate-600">{due.student.program.code}</td>
                    <td className="p-3 text-slate-700">{due.feeStructure.title}</td>
                    <td className="p-3 font-bold text-slate-900">{formatCurrency(due.totalAmount)}</td>
                    <td className="p-3 font-bold text-emerald-700">{formatCurrency(due.paidAmount)}</td>
                    <td className="p-3 font-bold text-blue-900">{formatCurrency(pending)}</td>
                    <td className="p-3">
                      <span
                        className={`status-badge ${
                          due.status === "PAID"
                            ? "status-badge-success"
                            : due.status === "PARTIALLY_PAID"
                            ? "status-badge-info"
                            : "status-badge-warning"
                        }`}
                      >
                        {due.status}
                      </span>
                    </td>
                    <td className="p-3 text-slate-500 font-mono text-[11px]">{formatDate(due.dueDate)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
