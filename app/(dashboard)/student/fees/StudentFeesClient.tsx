"use client";

import { useState } from "react";
import { CreditCard, CheckCircle2, ShieldCheck, Download, Clock, Receipt as ReceiptIcon } from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";
import SandboxPaymentModal from "@/components/payment/SandboxPaymentModal";
import Link from "next/link";

interface StudentFeesClientProps {
  student: any;
  feeDues: any[];
  transactions: any[];
}

export default function StudentFeesClient({
  student,
  feeDues,
  transactions,
}: StudentFeesClientProps) {
  const [selectedDue, setSelectedDue] = useState<any | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const totalFees = feeDues.reduce((acc, d) => acc + d.totalAmount, 0);
  const totalPaid = feeDues.reduce((acc, d) => acc + d.paidAmount, 0);
  const totalPending = totalFees - totalPaid;

  const handleOpenPay = (due: any) => {
    setSelectedDue({
      id: due.id,
      title: due.feeStructure.title,
      totalAmount: due.totalAmount,
      paidAmount: due.paidAmount,
      pendingAmount: due.totalAmount - due.paidAmount,
      studentName: student.user.name,
      rollNumber: student.rollNumber,
    });
    setModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
            Student Bursar & Treasury Portal
          </span>
          <h1 className="text-2xl font-extrabold text-slate-900 mt-1">
            Fees & Sandbox Payments
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            View semester fee structures, settle dues via Sandbox Gateway, and generate digital receipts
          </p>
        </div>

        <Link
          href="/student/receipts"
          className="px-4 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-2 shadow-xs transition"
        >
          <ReceiptIcon className="w-4 h-4" />
          View All Receipts
        </Link>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl shadow-xs border border-slate-200">
          <span className="text-xs font-bold uppercase text-slate-400">Total Billed Fees</span>
          <p className="text-2xl font-extrabold text-slate-900 mt-1">{formatCurrency(totalFees)}</p>
          <span className="text-[11px] text-slate-500">Academic Year 2026-2027</span>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-xs border border-slate-200">
          <span className="text-xs font-bold uppercase text-emerald-600">Total Amount Settled</span>
          <p className="text-2xl font-extrabold text-emerald-700 mt-1">{formatCurrency(totalPaid)}</p>
          <span className="text-[11px] text-slate-500">Verified by University Accounts</span>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-xs border border-slate-200">
          <span className="text-xs font-bold uppercase text-blue-600">Outstanding Balance</span>
          <p className="text-2xl font-extrabold text-blue-800 mt-1">{formatCurrency(totalPending)}</p>
          <span className="text-[11px] text-amber-600 font-semibold">Due by September 30, 2026</span>
        </div>
      </div>

      {/* Active Dues Table */}
      <div className="bg-white rounded-2xl shadow-xs border border-slate-200 p-6 space-y-4">
        <h2 className="text-sm font-bold text-slate-900">
          Semester Fee Invoices & Dues
        </h2>

        <div className="space-y-4">
          {feeDues.map((due) => {
            const pending = due.totalAmount - due.paidAmount;
            return (
              <div
                key={due.id}
                className="p-5 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-slate-900">
                      {due.feeStructure.title}
                    </h3>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        due.status === "PAID"
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : "bg-amber-50 text-amber-700 border border-amber-200"
                      }`}
                    >
                      {due.status}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
                    <span>Tuition: {formatCurrency(due.feeStructure.tuitionFee)}</span>
                    <span>•</span>
                    <span>Lab: {formatCurrency(due.feeStructure.labFee)}</span>
                    <span>•</span>
                    <span>Library: {formatCurrency(due.feeStructure.libraryFee)}</span>
                    <span>•</span>
                    <span>Exam: {formatCurrency(due.feeStructure.examFee)}</span>
                  </div>

                  <p className="text-[11px] text-slate-400">
                    Due Date: {formatDate(due.dueDate)}
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">
                      Remaining Due
                    </span>
                    <span className="text-lg font-extrabold text-blue-900">
                      {formatCurrency(pending)}
                    </span>
                  </div>

                  {pending > 0 ? (
                    <button
                      onClick={() => handleOpenPay(due)}
                      className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold shadow-sm transition flex items-center gap-2"
                    >
                      <CreditCard className="w-4 h-4" />
                      Pay via Sandbox
                    </button>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
                      <CheckCircle2 className="w-4 h-4" /> Cleared
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Payment Transactions History */}
      <div className="bg-white rounded-2xl shadow-xs border border-slate-200 p-6 space-y-4">
        <h2 className="text-sm font-bold text-slate-900">
          Payment Transactions Log
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-[10px] font-bold uppercase text-slate-500">
                <th className="p-3">Transaction ID</th>
                <th className="p-3">Reference No</th>
                <th className="p-3">Amount</th>
                <th className="p-3">Method</th>
                <th className="p-3">Date</th>
                <th className="p-3">Status</th>
                <th className="p-3">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono">
              {transactions.map((txn) => (
                <tr key={txn.id} className="hover:bg-slate-50/50 transition">
                  <td className="p-3 font-bold text-slate-900">{txn.transactionId}</td>
                  <td className="p-3 text-slate-500 text-[11px]">{txn.referenceNo}</td>
                  <td className="p-3 font-bold text-slate-900 font-sans">
                    {formatCurrency(txn.amount)}
                  </td>
                  <td className="p-3 text-slate-600 font-sans text-[11px]">
                    {txn.paymentMethod.replace("SANDBOX_", "")}
                  </td>
                  <td className="p-3 text-slate-500 font-sans text-[11px]">
                    {formatDate(txn.createdAt)}
                  </td>
                  <td className="p-3 font-sans">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <CheckCircle2 className="w-3 h-3" /> {txn.status}
                    </span>
                  </td>
                  <td className="p-3 font-sans">
                    {txn.receipt ? (
                      <Link
                        href="/student/receipts"
                        className="text-blue-600 hover:underline font-bold text-xs flex items-center gap-1"
                      >
                        <ReceiptIcon className="w-3 h-3" /> {txn.receipt.receiptNumber}
                      </Link>
                    ) : (
                      "—"
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Sandbox Payment Modal */}
      {selectedDue && (
        <SandboxPaymentModal
          isOpen={modalOpen}
          onClose={() => {
            setModalOpen(false);
            setSelectedDue(null);
          }}
          onSuccess={() => {
            window.location.reload();
          }}
          feeDue={selectedDue}
        />
      )}
    </div>
  );
}
