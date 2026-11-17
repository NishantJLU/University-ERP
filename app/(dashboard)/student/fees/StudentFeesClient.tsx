"use client";

import React, { useState } from "react";
import {
  CreditCard,
  CheckCircle2,
  AlertTriangle,
  Receipt as ReceiptIcon,
  Building,
  ChevronDown,
  ChevronUp,
  Printer,
  ShieldCheck,
  Info,
} from "lucide-react";
import { formatCurrency, formatDate, formatEnum } from "@/lib/utils";
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
  const [expandedBreakdownId, setExpandedBreakdownId] = useState<string | null>(null);
  const [expandedTxnId, setExpandedTxnId] = useState<string | null>(null);

  const totalFees = feeDues.reduce((acc, d) => acc + d.totalAmount, 0);
  const totalPaid = feeDues.reduce((acc, d) => acc + d.paidAmount, 0);
  const totalPending = totalFees - totalPaid;

  // Evaluation of overdue status
  const today = new Date();
  const mostUrgentDue = feeDues.find((d) => d.totalAmount - d.paidAmount > 0);
  let isOverdue = false;
  let overdueDays = 0;
  if (mostUrgentDue) {
    const dueTime = new Date(mostUrgentDue.dueDate).getTime();
    const nowTime = today.getTime();
    if (nowTime > dueTime) {
      isOverdue = true;
      overdueDays = Math.max(1, Math.floor((nowTime - dueTime) / (1000 * 60 * 60 * 24)));
    }
  }

  const handleOpenPay = (due: any, initialAmount?: number) => {
    setSelectedDue({
      id: due.id,
      title: due.feeStructure.title,
      totalAmount: due.totalAmount,
      paidAmount: due.paidAmount,
      pendingAmount: due.totalAmount - due.paidAmount,
      preferredPayAmount: initialAmount || due.totalAmount - due.paidAmount,
      studentName: student.user.name,
      rollNumber: student.rollNumber,
    });
    setModalOpen(true);
  };

  const toggleBreakdown = (id: string) => {
    setExpandedBreakdownId(expandedBreakdownId === id ? null : id);
  };

  const toggleTxnExpand = (id: string) => {
    setExpandedTxnId(expandedTxnId === id ? null : id);
  };

  return (
    <div className="space-y-4 font-sans text-slate-800">
      {/* Institutional Breadcrumb & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
        <div>
          <nav className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
            <Link href="/student/dashboard" className="hover:text-slate-800">
              Dashboard
            </Link>
            <span>/</span>
            <span className="text-slate-600">Finance & Accounts</span>
            <span>/</span>
            <span className="text-slate-900 font-medium">Fee Ledger</span>
          </nav>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Financial Ledger & Fee Payments
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Student: <span className="font-semibold text-slate-800">{student.user.name}</span> • Roll No:{" "}
            <span className="font-mono text-slate-800">{student.rollNumber}</span> • Program:{" "}
            <span className="text-slate-800">{student.program.code} (Sem {student.currentSemester.number})</span>
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <Link
            href="/student/receipts"
            className="px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-sm text-xs font-semibold flex items-center gap-1.5 transition"
          >
            <ReceiptIcon className="w-3.5 h-3.5 text-slate-500" />
            Voucher Receipts
          </Link>
        </div>
      </div>

      {/* Gateway Simulation Notice */}
      <div className="px-3 py-2 rounded-sm bg-slate-100 border border-slate-300 text-slate-700 text-xs flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="px-1.5 py-0.2 rounded-xs font-bold text-[10px] uppercase bg-slate-700 text-white">
            Sandbox Active
          </span>
          <span className="text-[11px] text-slate-600">
            Payment transactions execute via simulated university clearing gateway. Digital seal vouchers are issued immediately.
          </span>
        </div>
        <span className="text-[11px] font-mono text-slate-500 shrink-0 hidden md:inline">
          Terminal ID: JLU-BNK-3029
        </span>
      </div>

      {/* Dense Ledger KPI Strip */}
      <div className="border border-slate-300 bg-white rounded-sm p-3 grid grid-cols-2 md:grid-cols-4 gap-3 divide-y md:divide-y-0 md:divide-x divide-slate-200">
        <div className="pr-3">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
            Total Billed Fees
          </span>
          <p className="text-xl font-bold text-slate-900 mt-0.5">{formatCurrency(totalFees)}</p>
          <span className="text-[10px] text-slate-500">AY 2026–2027 Schedule</span>
        </div>

        <div className="pt-2 md:pt-0 md:px-3">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
            Realized Collections
          </span>
          <p className="text-xl font-bold text-slate-800 mt-0.5">{formatCurrency(totalPaid)}</p>
          <span className="text-[10px] text-emerald-700 font-medium">Reconciled to Student Account</span>
        </div>

        <div className="pt-2 md:pt-0 md:px-3">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
            Net Outstanding Dues
          </span>
          <p className="text-xl font-bold text-slate-900 mt-0.5">{formatCurrency(totalPending)}</p>
          <span className="text-[10px] text-slate-500">Subject to university fee regulations</span>
        </div>

        <div className="pt-2 md:pt-0 md:pl-3">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
            Account Status
          </span>
          <div className="mt-1">
            {isOverdue && totalPending > 0 ? (
              <span className="inline-flex items-center gap-1 text-xs font-bold text-red-700 bg-red-50 border border-red-300 px-2 py-0.5 rounded-xs">
                <AlertTriangle className="w-3 h-3 text-red-600" />
                Overdue by {overdueDays} days
              </span>
            ) : totalPending === 0 ? (
              <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-300 px-2 py-0.5 rounded-xs">
                <CheckCircle2 className="w-3 h-3 text-emerald-700" />
                All Dues Cleared
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-800 bg-amber-50 border border-amber-300 px-2 py-0.5 rounded-xs">
                Payment Pending
              </span>
            )}
          </div>
          <span className="text-[10px] text-slate-500 block mt-0.5">
            Due date: Sep 30, 2026
          </span>
        </div>
      </div>

      {/* Main Tabular Data Grid: Semester Fee Invoices & Dues */}
      <div className="border border-slate-300 bg-white rounded-sm overflow-hidden">
        <div className="px-3.5 py-2.5 bg-slate-50 border-b border-slate-300 flex items-center justify-between">
          <div>
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Semester Fee Invoices & Demand Ledger
            </h2>
            <p className="text-[11px] text-slate-500">
              Demand notes issued by the University Bursar & Comptroller of Finance
            </p>
          </div>
          <span className="text-xs font-mono text-slate-500 bg-white border border-slate-200 px-2 py-0.5 rounded-xs">
            {feeDues.length} Demand Note(s)
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100 border-b border-slate-300 text-[10px] font-bold uppercase tracking-wider text-slate-600">
                <th className="py-2.5 px-3">Fee Head / Title</th>
                <th className="py-2.5 px-3">Due Date</th>
                <th className="py-2.5 px-3 min-w-[260px]">Fee Breakdown (Itemized)</th>
                <th className="py-2.5 px-3 text-right">Total Billed</th>
                <th className="py-2.5 px-3 text-right">Paid</th>
                <th className="py-2.5 px-3 text-right">Balance Due</th>
                <th className="py-2.5 px-3 text-center">Status</th>
                <th className="py-2.5 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {feeDues.map((due) => {
                const pending = due.totalAmount - due.paidAmount;
                const dueOverdue = new Date(due.dueDate).getTime() < today.getTime() && pending > 0;
                const daysLate = Math.max(
                  1,
                  Math.floor((today.getTime() - new Date(due.dueDate).getTime()) / (1000 * 60 * 60 * 24))
                );
                const isExpanded = expandedBreakdownId === due.id;

                const breakdownItems = [
                  { label: "Tuition", amount: due.feeStructure.tuitionFee },
                  { label: "Laboratory", amount: due.feeStructure.labFee },
                  { label: "Library", amount: due.feeStructure.libraryFee },
                  { label: "Examination", amount: due.feeStructure.examFee },
                  { label: "Amenities", amount: due.feeStructure.otherFee || 2000 },
                ];

                return (
                  <React.Fragment key={due.id}>
                    <tr className="hover:bg-slate-50/80 transition-colors">
                      {/* Fee Head */}
                      <td className="py-2.5 px-3 align-top">
                        <div className="font-semibold text-slate-900">{due.feeStructure.title}</div>
                        <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                          Ref: INV-{due.id.slice(0, 8).toUpperCase()}
                        </div>
                      </td>

                      {/* Due Date */}
                      <td className="py-2.5 px-3 align-top whitespace-nowrap">
                        <div className="font-medium text-slate-800">{formatDate(due.dueDate)}</div>
                        {dueOverdue && (
                          <div className="text-[10px] text-red-600 font-semibold mt-0.5">
                            Overdue +{daysLate}d
                          </div>
                        )}
                      </td>

                      {/* Breakdown Summary */}
                      <td className="py-2.5 px-3 align-top">
                        <div className="text-[11px] space-y-1">
                          <div className="flex flex-wrap items-center gap-1 text-slate-600">
                            <span className="bg-slate-100 px-1 py-0.2 rounded-xs border border-slate-200">
                              Tuition: {formatCurrency(due.feeStructure.tuitionFee)}
                            </span>
                            <span className="bg-slate-100 px-1 py-0.2 rounded-xs border border-slate-200">
                              Lab: {formatCurrency(due.feeStructure.labFee)}
                            </span>
                            <span className="bg-slate-100 px-1 py-0.2 rounded-xs border border-slate-200">
                              Lib: {formatCurrency(due.feeStructure.libraryFee)}
                            </span>
                            <span className="bg-slate-100 px-1 py-0.2 rounded-xs border border-slate-200">
                              Exam: {formatCurrency(due.feeStructure.examFee)}
                            </span>
                            <span className="bg-slate-100 px-1 py-0.2 rounded-xs border border-slate-200">
                              Amenities: {formatCurrency(due.feeStructure.otherFee || 2000)}
                            </span>
                          </div>

                          <button
                            type="button"
                            onClick={() => toggleBreakdown(due.id)}
                            className="text-[10px] font-semibold text-blue-700 hover:text-blue-900 flex items-center gap-0.5"
                          >
                            {isExpanded ? (
                              <>
                                <span>Hide Itemized Schedule</span>
                                <ChevronUp className="w-3 h-3" />
                              </>
                            ) : (
                              <>
                                <span>Show Full Schedule Details</span>
                                <ChevronDown className="w-3 h-3" />
                              </>
                            )}
                          </button>
                        </div>
                      </td>

                      {/* Total Amount */}
                      <td className="py-2.5 px-3 text-right font-semibold text-slate-900 align-top whitespace-nowrap">
                        {formatCurrency(due.totalAmount)}
                      </td>

                      {/* Paid Amount */}
                      <td className="py-2.5 px-3 text-right font-medium text-slate-700 align-top whitespace-nowrap">
                        {formatCurrency(due.paidAmount)}
                      </td>

                      {/* Balance Due */}
                      <td className="py-2.5 px-3 text-right align-top whitespace-nowrap font-bold">
                        <span className={pending > 0 ? "text-red-700" : "text-emerald-700"}>
                          {formatCurrency(pending)}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-2.5 px-3 text-center align-top whitespace-nowrap">
                        {pending === 0 ? (
                          <span className="inline-block px-2 py-0.5 text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-300 rounded-xs">
                            Paid in Full
                          </span>
                        ) : dueOverdue ? (
                          <span className="inline-block px-2 py-0.5 text-[10px] font-bold bg-red-50 text-red-700 border border-red-300 rounded-xs">
                            Overdue
                          </span>
                        ) : (
                          <span className="inline-block px-2 py-0.5 text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-300 rounded-xs">
                            Pending
                          </span>
                        )}
                      </td>

                      {/* Action */}
                      <td className="py-2.5 px-3 text-right align-top whitespace-nowrap">
                        {pending > 0 ? (
                          <div className="flex items-center justify-end gap-1.5">
                            {pending > 25000 && (
                              <button
                                type="button"
                                onClick={() => handleOpenPay(due, 25000)}
                                className="px-2 py-1 text-[11px] font-medium bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-sm transition"
                              >
                                Pay ₹25k
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() => handleOpenPay(due, pending)}
                              className="px-2.5 py-1 text-[11px] font-bold bg-blue-700 hover:bg-blue-800 text-white rounded-sm border border-blue-800 transition flex items-center gap-1"
                            >
                              <CreditCard className="w-3 h-3" />
                              Pay Balance
                            </button>
                          </div>
                        ) : (
                          <span className="text-slate-400 text-xs font-mono">Settled</span>
                        )}
                      </td>
                    </tr>

                    {/* Expandable Itemized Schedule Row */}
                    {isExpanded && (
                      <tr className="bg-slate-50/70 border-y border-slate-200">
                        <td colSpan={8} className="p-3">
                          <div className="bg-white border border-slate-300 rounded-xs p-3">
                            <div className="text-[11px] font-bold text-slate-800 uppercase tracking-wider mb-2 flex items-center justify-between">
                              <span>Official Statutory Schedule of Charges — {due.feeStructure.title}</span>
                              <span className="text-slate-500 font-mono">Billed to: {student.rollNumber}</span>
                            </div>
                            <table className="w-full text-left text-xs border border-slate-200">
                              <thead>
                                <tr className="bg-slate-100 text-[10px] font-bold uppercase text-slate-600 border-b border-slate-200">
                                  <th className="p-2">Line Item Head</th>
                                  <th className="p-2">Statutory Allocation Description</th>
                                  <th className="p-2 text-right">Sanctioned Amount</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-100">
                                {breakdownItems.map((item, idx) => (
                                  <tr key={idx} className="hover:bg-slate-50/50">
                                    <td className="p-2 font-medium text-slate-800">{item.label} Fee</td>
                                    <td className="p-2 text-slate-500 text-[11px]">
                                      {item.label === "Tuition"
                                        ? "Academic Instruction & Faculty Costs"
                                        : item.label === "Laboratory"
                                        ? "Computing Labs, Equipment & Software Licensing"
                                        : item.label === "Library"
                                        ? "Central Library, IEEE/ACM Subscriptions"
                                        : item.label === "Examination"
                                        ? "End-Term Assessment, Moderation & Grade Cards"
                                        : "Campus Amenities, High-Speed Wi-Fi & Student Welfare"}
                                    </td>
                                    <td className="p-2 text-right font-mono text-slate-800">
                                      {formatCurrency(item.amount)}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                              <tfoot>
                                <tr className="bg-slate-50 font-bold border-t border-slate-200">
                                  <td colSpan={2} className="p-2 text-slate-900">
                                    Reconciled Total Billed
                                  </td>
                                  <td className="p-2 text-right font-mono text-slate-900">
                                    {formatCurrency(due.totalAmount)}
                                  </td>
                                </tr>
                              </tfoot>
                            </table>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payment Transactions & Receipts Table */}
      <div className="border border-slate-300 bg-white rounded-sm overflow-hidden">
        <div className="px-3.5 py-2.5 bg-slate-50 border-b border-slate-300 flex items-center justify-between">
          <div>
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Payment Transactions & Digital Vouchers
            </h2>
            <p className="text-[11px] text-slate-500">
              Audit trail of clearing transactions and university receipt vouchers
            </p>
          </div>
          <span className="text-xs font-mono text-slate-500 bg-white border border-slate-200 px-2 py-0.5 rounded-xs">
            {transactions.length} Record(s)
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100 border-b border-slate-300 text-[10px] font-bold uppercase tracking-wider text-slate-600">
                <th className="py-2.5 px-3">Receipt / Voucher No.</th>
                <th className="py-2.5 px-3">Transaction Date</th>
                <th className="py-2.5 px-3">Channel</th>
                <th className="py-2.5 px-3 text-right">Amount Settled</th>
                <th className="py-2.5 px-3 text-center">Status</th>
                <th className="py-2.5 px-3 text-right">Voucher</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {transactions.length > 0 ? (
                transactions.map((txn) => {
                  const isExpanded = expandedTxnId === txn.id;
                  const methodLabel =
                    txn.paymentMethod === "UPI" || txn.paymentMethod.includes("UPI")
                      ? "UPI / QR"
                      : txn.paymentMethod === "CARD" || txn.paymentMethod.includes("CARD")
                      ? "Debit/Credit Card"
                      : txn.paymentMethod === "NETBANKING" || txn.paymentMethod.includes("NET")
                      ? "Net Banking"
                      : "Online Clearing";

                  return (
                    <React.Fragment key={txn.id}>
                      <tr className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-2.5 px-3">
                          <div className="font-semibold text-slate-900 font-mono">
                            {txn.receipt ? txn.receipt.receiptNumber : txn.transactionId.slice(0, 16) + "..."}
                          </div>
                          <button
                            type="button"
                            onClick={() => toggleTxnExpand(txn.id)}
                            className="text-[10px] text-blue-700 hover:underline flex items-center gap-0.5 mt-0.5"
                          >
                            {isExpanded ? (
                              <>
                                <span>Hide Details</span>
                                <ChevronUp className="w-3 h-3" />
                              </>
                            ) : (
                              <>
                                <span>Audit Identifiers</span>
                                <ChevronDown className="w-3 h-3" />
                              </>
                            )}
                          </button>
                        </td>

                        <td className="py-2.5 px-3 text-slate-700 whitespace-nowrap">
                          {formatDate(txn.createdAt)}
                        </td>

                        <td className="py-2.5 px-3">
                          <span className="px-1.5 py-0.5 text-[10px] font-medium bg-slate-100 border border-slate-300 text-slate-700 rounded-xs">
                            {methodLabel}
                          </span>
                        </td>

                        <td className="py-2.5 px-3 text-right font-bold text-slate-900 font-mono whitespace-nowrap">
                          {formatCurrency(txn.amount)}
                        </td>

                        <td className="py-2.5 px-3 text-center whitespace-nowrap">
                          <span className="inline-block px-2 py-0.5 rounded-xs text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-300">
                            {formatEnum(txn.status)}
                          </span>
                        </td>

                        <td className="py-2.5 px-3 text-right whitespace-nowrap">
                          {txn.receipt ? (
                            <Link
                              href="/student/receipts"
                              className="inline-flex items-center gap-1 px-2.5 py-1 bg-white hover:bg-slate-100 border border-slate-300 rounded-sm text-xs font-semibold text-slate-700 transition"
                            >
                              <Printer className="w-3 h-3 text-slate-500" />
                              Print
                            </Link>
                          ) : (
                            <span className="text-slate-400 font-mono">—</span>
                          )}
                        </td>
                      </tr>

                      {/* Expandable Audit Trail */}
                      {isExpanded && (
                        <tr className="bg-slate-50/70 border-y border-slate-200">
                          <td colSpan={6} className="p-3">
                            <div className="bg-white p-2.5 border border-slate-300 rounded-xs grid grid-cols-1 md:grid-cols-3 gap-2 text-xs font-mono">
                              <div>
                                <span className="text-[10px] uppercase font-bold text-slate-400 block font-sans">
                                  University Txn Reference
                                </span>
                                <span className="text-slate-900 select-all text-[11px]">{txn.transactionId}</span>
                              </div>
                              <div>
                                <span className="text-[10px] uppercase font-bold text-slate-400 block font-sans">
                                  Bank Settlement Ref No.
                                </span>
                                <span className="text-slate-700 select-all text-[11px]">{txn.referenceNo}</span>
                              </div>
                              <div>
                                <span className="text-[10px] uppercase font-bold text-slate-400 block font-sans">
                                  SHA-256 Digital Signature
                                </span>
                                <span className="text-[10px] text-slate-500 truncate block select-all">
                                  {txn.receipt?.receiptHash || txn.gatewayToken || "VERIFIED-SANDBOX-AUTH"}
                                </span>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="py-4 px-3 text-center text-slate-500 text-xs">
                    No transactions recorded for the current billing cycle.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Institutional Bank Remittance & Bursar Advice */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
        <div className="border border-slate-300 bg-white rounded-sm p-3.5 space-y-2">
          <div className="flex items-center gap-1.5 text-slate-900 font-bold uppercase tracking-wider text-[11px]">
            <Building className="w-3.5 h-3.5 text-slate-700" />
            <span>Statutory University Bank Account (NEFT / RTGS)</span>
          </div>
          <p className="text-[11px] text-slate-500">
            Remittances through institutional wire transfer must reference the student Roll Number in the payment narration.
          </p>
          <div className="bg-slate-50 border border-slate-200 rounded-xs p-2.5 font-mono text-[11px] space-y-1 text-slate-700">
            <div><span className="text-slate-400 font-sans">Beneficiary:</span> Jagran Lakecity University Fee Collection A/C</div>
            <div><span className="text-slate-400 font-sans">Bank & Branch:</span> State Bank of India, JLU Campus Branch</div>
            <div><span className="text-slate-400 font-sans">Account No:</span> 409283019283 (Current A/C)</div>
            <div><span className="text-slate-400 font-sans">IFSC Code:</span> SBIN0021940</div>
          </div>
        </div>

        <div className="border border-slate-300 bg-white rounded-sm p-3.5 space-y-2">
          <div className="flex items-center gap-1.5 text-slate-900 font-bold uppercase tracking-wider text-[11px]">
            <ShieldCheck className="w-3.5 h-3.5 text-slate-700" />
            <span>Bursar Policy & Reconciliation Notes</span>
          </div>
          <p className="text-[11px] text-slate-500">
            Official guidelines governing tuition installment deadlines and late fee grace periods:
          </p>
          <ul className="list-disc pl-4 space-y-1 text-[11px] text-slate-600">
            <li>Payments completed via the portal reflect immediately with signed digital receipts.</li>
            <li>Wire transfer slips must be submitted to the Accounts Desk (Admin Block) within 3 working days.</li>
            <li>Admit cards for End-Semester Examinations require zero outstanding dues prior to hall ticket issuance.</li>
          </ul>
        </div>
      </div>

      {/* Payment Gateway Modal */}
      {selectedDue && (
        <SandboxPaymentModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onSuccess={() => {
            window.location.reload();
          }}
          feeDue={selectedDue}
        />
      )}
    </div>
  );
}
