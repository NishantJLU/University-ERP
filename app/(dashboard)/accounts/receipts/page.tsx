import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Receipt, CheckCircle2 } from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";

export default async function AccountsReceiptsPage() {
  const user = await getCurrentUser();
  if (!user || user.role !== "ACCOUNTS") {
    redirect("/login");
  }

  const receipts = await prisma.receipt.findMany({
    include: {
      student: { include: { user: true, program: true } },
      paymentTransaction: true,
    },
    orderBy: { issueDate: "desc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">
          University Treasury Records
        </span>
        <h1 className="text-2xl font-extrabold text-slate-900 mt-1">
          Digital Fee Receipts Registry
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Official digital receipts with SHA-256 cryptographic signatures issued to students
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-xs border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-[10px] font-bold uppercase text-slate-500">
                <th className="p-3">Receipt Number</th>
                <th className="p-3">Student Name</th>
                <th className="p-3">Roll Number</th>
                <th className="p-3">Program</th>
                <th className="p-3">Amount Paid</th>
                <th className="p-3">Issue Date</th>
                <th className="p-3">Cryptographic Seal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono">
              {receipts.map((r) => (
                <tr key={r.id} className="hover:bg-slate-50/50 transition">
                  <td className="p-3 font-bold text-blue-700">{r.receiptNumber}</td>
                  <td className="p-3 font-sans font-semibold text-slate-900">{r.student.user.name}</td>
                  <td className="p-3 text-slate-600">{r.student.rollNumber}</td>
                  <td className="p-3 font-sans text-slate-600">{r.student.program.code}</td>
                  <td className="p-3 font-sans font-bold text-emerald-700">{formatCurrency(r.amountPaid)}</td>
                  <td className="p-3 font-sans text-slate-500 text-[11px]">{formatDate(r.issueDate)}</td>
                  <td className="p-3 text-[10px] text-slate-400 max-w-[200px] truncate">{r.receiptHash}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
