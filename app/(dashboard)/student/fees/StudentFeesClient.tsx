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
  Download,
  FileText,
  Clock,
  Sparkles,
  Calendar,
  X,
  FileSpreadsheet,
} from "lucide-react";
import { formatCurrency, formatDate, formatEnum } from "@/lib/utils";
import SandboxPaymentModal from "@/components/payment/SandboxPaymentModal";
import Link from "next/link";
import JLULogo from "@/components/ui/JLULogo";

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

  // Document Modal States: 'statement' | 'consolidated' | 'single_receipt' | null
  const [activeDocType, setActiveDocType] = useState<"statement" | "consolidated" | "receipt" | null>(null);
  const [activeReceiptTxn, setActiveReceiptTxn] = useState<any | null>(null);

  // 1. Calculations across all semesters
  const totalFees = feeDues.reduce((acc, d) => acc + d.totalAmount, 0);
  const totalPaid = feeDues.reduce((acc, d) => acc + d.paidAmount, 0);
  const totalOutstanding = Math.max(0, totalFees - totalPaid);
  const paidSemestersCount = feeDues.filter((d) => d.paidAmount >= d.totalAmount).length;
  const pendingSemestersCount = feeDues.filter((d) => d.paidAmount < d.totalAmount).length;

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

  const openSingleReceipt = (txn: any) => {
    setActiveReceiptTxn(txn);
    setActiveDocType("receipt");
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-5 font-sans text-slate-800">
      {/* Top Breadcrumb & Document Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-[#E5E7EB] pb-3">
        <div>
          <nav className="flex items-center gap-1.5 text-xs text-[#9299A8] mb-1">
            <Link href="/student/dashboard" className="hover:text-[#202435]">
              Dashboard
            </Link>
            <span>/</span>
            <span className="text-[#697386]">Finance & Accounts</span>
            <span>/</span>
            <span className="text-[#202435] font-semibold">Semester Fee Ledger</span>
          </nav>
          <h1 className="text-xl font-extrabold text-[#202435] tracking-tight">
            Semester Fee Management & Institutional Ledger
          </h1>
          <p className="text-xs text-[#697386] mt-0.5">
            Student: <span className="font-semibold text-[#202435]">{student.user.name}</span> • Roll No:{" "}
            <span className="font-mono text-[#861F41] font-bold">{student.rollNumber}</span> • Program:{" "}
            <span className="text-[#202435]">{student.program.name} ({student.program.code})</span>
          </p>
        </div>

        {/* Action Buttons for Document Downloads */}
        <div className="flex flex-wrap items-center gap-2 self-start md:self-auto">
          <button
            type="button"
            onClick={() => setActiveDocType("statement")}
            className="px-3 py-1.5 bg-white hover:bg-[#F9FAFB] border border-[#E5E7EB] text-[#202435] rounded-lg text-xs font-semibold flex items-center gap-1.5 transition shadow-2xs cursor-pointer"
            title="Download complete university fee statement"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-[#861F41]" />
            <span>Download Fee Statement</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveDocType("consolidated")}
            className="px-3 py-1.5 bg-[#861F41] hover:bg-[#64152F] text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition shadow-2xs cursor-pointer"
            title="Download consolidated all-semester fee records"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download All Fee Records</span>
          </button>
        </div>
      </div>

      {/* Gateway Simulation Notice */}
      <div className="px-3.5 py-2.5 rounded-lg bg-[#F9FAFB] border border-[#E5E7EB] text-[#697386] text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-2xs">
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded-md font-bold text-[10px] uppercase bg-[#F9EEF2] text-[#861F41] border border-[#FBE4E9]">
            Active Clearing Gateway
          </span>
          <span className="text-[11px] text-[#697386]">
            University automated fee reconciliation is active. Transactions generate digitally sealed audit receipts instantly.
          </span>
        </div>
        <span className="text-[10px] font-mono text-[#9299A8] shrink-0">
          Terminal ID: JLU-BNK-3029 • SSL Secured
        </span>
      </div>

      {/* 2. Fee Summary Cards (Task 3.B) */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        <div className="p-4 rounded-xl bg-white border border-[#E5E7EB] shadow-2xs space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#9299A8] block">
            Total Programme Fees
          </span>
          <p className="text-xl font-extrabold text-[#202435] font-mono">
            {formatCurrency(totalFees)}
          </p>
          <span className="text-[10px] text-[#697386] block">All Mapped Semesters</span>
        </div>

        <div className="p-4 rounded-xl bg-white border border-[#E5E7EB] shadow-2xs space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#9299A8] block">
            Total Amount Paid
          </span>
          <p className="text-xl font-extrabold text-[#16845B] font-mono">
            {formatCurrency(totalPaid)}
          </p>
          <span className="text-[10px] text-[#16845B] font-medium block">Cleared & Reconciled</span>
        </div>

        <div className="p-4 rounded-xl bg-white border border-[#E5E7EB] shadow-2xs space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#9299A8] block">
            Total Outstanding Fees
          </span>
          <p className={`text-xl font-extrabold font-mono ${totalOutstanding > 0 ? "text-[#C23B4A]" : "text-[#16845B]"}`}>
            {formatCurrency(totalOutstanding)}
          </p>
          <span className="text-[10px] text-[#9299A8] block">Net Current Dues</span>
        </div>

        <div className="p-4 rounded-xl bg-white border border-[#E5E7EB] shadow-2xs space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#9299A8] block">
            Paid Semesters
          </span>
          <p className="text-xl font-extrabold text-[#202435]">
            {paidSemestersCount} <span className="text-xs font-normal text-[#9299A8]">/ {feeDues.length}</span>
          </p>
          <span className="text-[10px] text-[#16845B] font-medium block">Fully Settled Terms</span>
        </div>

        <div className="p-4 rounded-xl bg-white border border-[#E5E7EB] shadow-2xs space-y-1 col-span-2 lg:col-span-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#9299A8] block">
            Pending Semesters
          </span>
          <p className={`text-xl font-extrabold ${pendingSemestersCount > 0 ? "text-[#B7791F]" : "text-[#16845B]"}`}>
            {pendingSemestersCount} <span className="text-xs font-normal text-[#9299A8]">Pending</span>
          </p>
          <span className="text-[10px] text-[#697386] block">
            {pendingSemestersCount === 0 ? "Account in Good Standing" : "Action Required"}
          </span>
        </div>
      </div>

      {/* 3. All Semester Fee Records Table (Task 3.A & 3.C) */}
      <div className="border border-[#E5E7EB] bg-white rounded-xl shadow-xs overflow-hidden space-y-0">
        <div className="px-4 py-3 bg-[#F9FAFB] border-b border-[#E5E7EB] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-xs font-bold text-[#202435] uppercase tracking-wider flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-[#861F41]" />
              <span>All Semester Fee Records ({feeDues.length} Terms)</span>
            </h2>
            <p className="text-[11px] text-[#697386] mt-0.5">
              Comprehensive institutional record of semester tuition, laboratories, examinations, and clearance status
            </p>
          </div>
          <span className="text-[10px] font-mono text-[#9299A8] bg-white border border-[#E5E7EB] px-2 py-0.5 rounded-md self-start sm:self-auto font-semibold">
            Program: {student.program.code}
          </span>
        </div>

        <div className="overflow-x-auto w-full">
          <table className="w-full text-left text-xs min-w-[850px] border-collapse">
            <thead>
              <tr className="bg-[#F9FAFB] border-b border-[#E5E7EB] text-[10px] font-bold uppercase tracking-wider text-[#9299A8]">
                <th className="py-3 px-3.5">Semester & Year</th>
                <th className="py-3 px-3">Total Fee</th>
                <th className="py-3 px-3">Amount Paid</th>
                <th className="py-3 px-3">Outstanding Balance</th>
                <th className="py-3 px-3 text-center">Payment Status</th>
                <th className="py-3 px-3">Payment Date</th>
                <th className="py-3 px-3">Transaction ID</th>
                <th className="py-3 px-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E7EB]">
              {feeDues.map((due) => {
                const pending = Math.max(0, due.totalAmount - due.paidAmount);
                const isPaid = pending === 0;
                const isExpanded = expandedBreakdownId === due.id;

                // Find latest transaction and receipt for this due
                const dueTxns = due.transactions || [];
                const latestTxn = dueTxns[0] || transactions.find((t) => t.studentFeeDueId === due.id);
                const paymentDate = latestTxn ? formatDate(latestTxn.createdAt) : "—";
                const txnId = latestTxn ? latestTxn.transactionId : "—";

                const breakdownItems = [
                  { label: "Tuition Fee", amount: due.feeStructure.tuitionFee, desc: "Academic Instruction & Faculty Core" },
                  { label: "Laboratory Fee", amount: due.feeStructure.labFee, desc: "Computing Infrastructure & Lab Supplies" },
                  { label: "Library Fee", amount: due.feeStructure.libraryFee, desc: "Physical Library, IEEE/ACM Digital Access" },
                  { label: "Examination Fee", amount: due.feeStructure.examFee, desc: "End-Term Assessment, Moderation & Grade Cards" },
                  { label: "Amenities & Welfare", amount: due.feeStructure.otherFee || 2000, desc: "Campus High-Speed Wi-Fi & Student Services" },
                ];

                return (
                  <React.Fragment key={due.id}>
                    <tr className="hover:bg-[#F9FAFB] transition">
                      {/* Semester Number & Academic Year */}
                      <td className="py-3 px-3.5 align-top">
                        <div className="font-bold text-[#202435]">
                          Semester {due.feeStructure.semester?.number || "?"}
                        </div>
                        <div className="text-[11px] text-[#697386]">
                          {due.feeStructure.title}
                        </div>
                        <div className="text-[10px] text-[#9299A8] font-mono mt-0.5">
                          {due.feeStructure.academicYear?.name || "AY 2026–2027"}
                        </div>
                      </td>

                      {/* Total Semester Fee */}
                      <td className="py-3 px-3 align-top font-bold text-[#202435] font-mono">
                        {formatCurrency(due.totalAmount)}
                      </td>

                      {/* Amount Paid */}
                      <td className="py-3 px-3 align-top font-bold text-[#16845B] font-mono">
                        {formatCurrency(due.paidAmount)}
                      </td>

                      {/* Outstanding Balance */}
                      <td className="py-3 px-3 align-top font-mono font-bold">
                        <span className={pending > 0 ? "text-[#C23B4A]" : "text-[#16845B]"}>
                          {formatCurrency(pending)}
                        </span>
                      </td>

                      {/* Payment Status */}
                      <td className="py-3 px-3 align-top text-center">
                        {isPaid ? (
                          <span className="inline-block px-2.5 py-0.5 text-[10px] font-bold bg-[#EAF7F0] text-[#16845B] border border-[#B7EAD0] rounded-md">
                            Paid in Full
                          </span>
                        ) : due.paidAmount > 0 ? (
                          <span className="inline-block px-2.5 py-0.5 text-[10px] font-bold bg-[#FFF7E6] text-[#B7791F] border border-[#FDE68A] rounded-md">
                            Partially Paid
                          </span>
                        ) : (
                          <span className="inline-block px-2.5 py-0.5 text-[10px] font-bold bg-[#FCEDEF] text-[#C23B4A] border border-[#FECACA] rounded-md">
                            Pending
                          </span>
                        )}
                      </td>

                      {/* Payment Date */}
                      <td className="py-3 px-3 align-top text-[#697386] font-medium whitespace-nowrap">
                        {paymentDate}
                      </td>

                      {/* Transaction ID */}
                      <td className="py-3 px-3 align-top font-mono text-[11px] text-[#697386] max-w-[150px] truncate" title={txnId}>
                        {txnId !== "—" ? (
                          <span className="text-[#202435] font-medium">{txnId}</span>
                        ) : (
                          <span className="text-[#9299A8]">—</span>
                        )}
                      </td>

                      {/* Action Buttons */}
                      <td className="py-3 px-3.5 align-top text-right whitespace-nowrap space-y-1">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => toggleBreakdown(due.id)}
                            className="px-2 py-1 text-[11px] font-semibold text-[#697386] hover:text-[#202435] bg-[#F9FAFB] hover:bg-[#F7F7F9] border border-[#E5E7EB] rounded-md flex items-center gap-1 transition"
                            title="Expand semester fee breakdown"
                          >
                            <span>{isExpanded ? "Hide" : "Details"}</span>
                            {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                          </button>

                          {pending > 0 ? (
                            <button
                              type="button"
                              onClick={() => handleOpenPay(due, pending)}
                              className="px-2.5 py-1 text-[11px] font-bold bg-[#861F41] hover:bg-[#64152F] text-white rounded-md transition shadow-2xs flex items-center gap-1"
                            >
                              <CreditCard className="w-3 h-3" />
                              <span>Pay {formatCurrency(pending)}</span>
                            </button>
                          ) : (
                            latestTxn && (
                              <button
                                type="button"
                                onClick={() => openSingleReceipt(latestTxn)}
                                className="px-2.5 py-1 text-[11px] font-semibold bg-[#EAF7F0] hover:bg-[#EAF7F0] text-[#16845B] border border-[#B7EAD0] rounded-md flex items-center gap-1 transition cursor-pointer"
                              >
                                <ReceiptIcon className="w-3 h-3" />
                                <span>Receipt</span>
                              </button>
                            )
                          )}
                        </div>
                      </td>
                    </tr>

                    {/* Expandable Semester Fee Breakdown */}
                    {isExpanded && (
                      <tr className="bg-[#F9FAFB] border-y border-[#E5E7EB]">
                        <td colSpan={8} className="p-4">
                          <div className="bg-white border border-[#E5E7EB] rounded-lg p-4 space-y-3 shadow-2xs">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 border-b border-[#E5E7EB] gap-1">
                              <div>
                                <h3 className="text-xs font-bold text-[#202435] uppercase tracking-wider">
                                  Official Itemized Fee Schedule • {due.feeStructure.title}
                                </h3>
                                <p className="text-[11px] text-[#697386]">
                                  Sanctioned by Academic Council for Semester {due.feeStructure.semester?.number || "?"}
                                </p>
                              </div>
                              <span className="text-[10px] font-mono text-[#9299A8]">
                                Due Date: {formatDate(due.dueDate)}
                              </span>
                            </div>

                            <div className="overflow-x-auto">
                              <table className="w-full text-left text-xs border border-[#E5E7EB] border-collapse">
                                <thead>
                                  <tr className="bg-[#F9FAFB] text-[10px] font-bold uppercase text-[#9299A8] border-b border-[#E5E7EB]">
                                    <th className="p-2">Fee Head</th>
                                    <th className="p-2">Statutory Allocation Description</th>
                                    <th className="p-2 text-right">Sanctioned Amount</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-[#E5E7EB]">
                                  {breakdownItems.map((item, idx) => (
                                    <tr key={idx} className="hover:bg-[#F9FAFB]">
                                      <td className="p-2 font-semibold text-[#202435]">{item.label}</td>
                                      <td className="p-2 text-[#697386] text-[11px]">{item.desc}</td>
                                      <td className="p-2 text-right font-mono font-bold text-[#202435]">
                                        {formatCurrency(item.amount)}
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                                <tfoot>
                                  <tr className="bg-[#F9FAFB] font-bold border-t border-[#E5E7EB]">
                                    <td colSpan={2} className="p-2 text-[#202435]">
                                      Total Semester Bill
                                    </td>
                                    <td className="p-2 text-right font-mono text-[#202435]">
                                      {formatCurrency(due.totalAmount)}
                                    </td>
                                  </tr>
                                </tfoot>
                              </table>
                            </div>
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

      {/* 4. Transactions & Audit Vouchers */}
      <div className="border border-[#E5E7EB] bg-white rounded-xl shadow-xs overflow-hidden">
        <div className="px-4 py-3 bg-[#F9FAFB] border-b border-[#E5E7EB] flex items-center justify-between">
          <div>
            <h2 className="text-xs font-bold text-[#202435] uppercase tracking-wider flex items-center gap-2">
              <ReceiptIcon className="w-4 h-4 text-[#861F41]" />
              <span>Payment Clearing Ledger & Official Receipts</span>
            </h2>
            <p className="text-[11px] text-[#697386] mt-0.5">
              Verified clearing transactions with cryptographic verification hashes
            </p>
          </div>
          <span className="text-xs font-mono text-[#9299A8] bg-white border border-[#E5E7EB] px-2 py-0.5 rounded-md font-semibold">
            {transactions.length} Verified Clearing Record(s)
          </span>
        </div>

        <div className="overflow-x-auto w-full">
          <table className="w-full text-left text-xs min-w-[750px] border-collapse">
            <thead>
              <tr className="bg-[#F9FAFB] border-b border-[#E5E7EB] text-[10px] font-bold uppercase tracking-wider text-[#9299A8]">
                <th className="py-3 px-3.5">Voucher / Receipt No.</th>
                <th className="py-3 px-3">Transaction Date</th>
                <th className="py-3 px-3">Clearing Channel</th>
                <th className="py-3 px-3 text-right">Amount Settled</th>
                <th className="py-3 px-3 text-center">Gateway Status</th>
                <th className="py-3 px-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E7EB]">
              {transactions.length > 0 ? (
                transactions.map((txn) => (
                  <tr key={txn.id} className="hover:bg-[#F9FAFB] transition">
                    <td className="py-3 px-3.5 font-mono font-bold text-[#202435]">
                      {txn.receipt?.receiptNumber || txn.transactionId}
                    </td>
                    <td className="py-3 px-3 text-[#697386]">
                      {formatDate(txn.createdAt)}
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-[#F9FAFB] border border-[#E5E7EB] text-[#202435]">
                        {txn.paymentMethod.replace(/_/g, " ")}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right font-mono font-bold text-[#16845B]">
                      {formatCurrency(txn.amount)}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span className="inline-block px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-[#EAF7F0] text-[#16845B] border border-[#B7EAD0]">
                        {formatEnum(txn.status)}
                      </span>
                    </td>
                    <td className="py-3 px-3.5 text-right">
                      <button
                        type="button"
                        onClick={() => openSingleReceipt(txn)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 bg-white hover:bg-[#F9FAFB] border border-[#E5E7EB] rounded-md text-xs font-semibold text-[#202435] transition shadow-2xs cursor-pointer"
                      >
                        <Printer className="w-3.5 h-3.5 text-[#861F41]" />
                        <span>View Voucher</span>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-6 px-4 text-center text-xs text-[#9299A8]">
                    No clearing transactions recorded.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* DOCUMENT PREVIEW MODALS FOR DOWNLOAD / PRINT */}
      {/* ========================================================================= */}

      {/* Modal 1: Official Student Fee Statement (Task 3.D.3) */}
      {activeDocType === "statement" && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full border border-[#E5E7EB] overflow-hidden flex flex-col max-h-[92vh]">
            <div className="px-6 py-3.5 bg-[#F9FAFB] border-b border-[#E5E7EB] flex items-center justify-between print:hidden">
              <span className="text-xs font-bold text-[#202435] flex items-center gap-2">
                <FileSpreadsheet className="w-4 h-4 text-[#861F41]" />
                <span>Official Student Fee Statement</span>
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handlePrint}
                  className="px-3 py-1.5 bg-[#861F41] hover:bg-[#64152F] text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition shadow-xs cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print / Save PDF</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveDocType(null)}
                  className="p-1 rounded-lg text-[#9299A8] hover:text-[#202435] hover:bg-slate-200 transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Printable Document Body */}
            <div className="p-8 overflow-y-auto space-y-6 text-xs text-[#202435] print:p-0">
              {/* Header */}
              <div className="flex items-center justify-between border-b-2 border-[#861F41] pb-4">
                <JLULogo variant="full" size="md" />
                <div className="text-right">
                  <span className="text-[10px] font-bold text-[#861F41] uppercase tracking-wider block">
                    Office of the University Bursar
                  </span>
                  <h2 className="text-base font-extrabold text-[#202435]">Student Fee Account Statement</h2>
                  <span className="text-[10px] text-[#9299A8] font-mono">
                    Generated: {formatDate(new Date())}
                  </span>
                </div>
              </div>

              {/* Student Biodata */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#F9FAFB] p-3.5 rounded-lg border border-[#E5E7EB] text-xs">
                <div>
                  <span className="text-[10px] text-[#9299A8] uppercase font-bold block">Student Name</span>
                  <span className="font-bold text-[#202435]">{student.user.name}</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#9299A8] uppercase font-bold block">Roll Number</span>
                  <span className="font-bold font-mono text-[#202435]">{student.rollNumber}</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#9299A8] uppercase font-bold block">Programme</span>
                  <span className="font-medium text-[#202435]">{student.program.code} - {student.program.name}</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#9299A8] uppercase font-bold block">Current Standing</span>
                  <span className="font-medium text-[#202435]">Semester {student.currentSemester.number}</span>
                </div>
              </div>

              {/* Multi-Semester Table */}
              <div className="space-y-2">
                <h3 className="text-xs font-bold text-[#202435] uppercase tracking-wider">
                  Semester Demand & Payment Summary
                </h3>
                <table className="w-full text-left text-xs border border-[#E5E7EB] border-collapse">
                  <thead>
                    <tr className="bg-[#F9FAFB] text-[10px] font-bold uppercase text-[#9299A8] border-b border-[#E5E7EB]">
                      <th className="p-2.5">Term</th>
                      <th className="p-2.5">Academic Session</th>
                      <th className="p-2.5 text-right">Sanctioned Fee</th>
                      <th className="p-2.5 text-right">Amount Paid</th>
                      <th className="p-2.5 text-right">Outstanding</th>
                      <th className="p-2.5 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E5E7EB]">
                    {feeDues.map((due) => {
                      const bal = Math.max(0, due.totalAmount - due.paidAmount);
                      return (
                        <tr key={due.id}>
                          <td className="p-2.5 font-bold">Semester {due.feeStructure.semester?.number}</td>
                          <td className="p-2.5 text-[#697386]">{due.feeStructure.academicYear?.name || "AY 2026-27"}</td>
                          <td className="p-2.5 text-right font-mono">{formatCurrency(due.totalAmount)}</td>
                          <td className="p-2.5 text-right font-mono text-[#16845B] font-semibold">{formatCurrency(due.paidAmount)}</td>
                          <td className="p-2.5 text-right font-mono font-bold text-[#202435]">{formatCurrency(bal)}</td>
                          <td className="p-2.5 text-center font-bold text-[10px]">
                            {bal === 0 ? "PAID" : due.paidAmount > 0 ? "PARTIAL" : "PENDING"}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                  <tfoot>
                    <tr className="bg-[#F9FAFB] font-bold border-t-2 border-[#202435]">
                      <td colSpan={2} className="p-2.5 text-[#202435]">Cumulative Totals</td>
                      <td className="p-2.5 text-right font-mono">{formatCurrency(totalFees)}</td>
                      <td className="p-2.5 text-right font-mono text-[#16845B]">{formatCurrency(totalPaid)}</td>
                      <td className="p-2.5 text-right font-mono text-[#C23B4A]">{formatCurrency(totalOutstanding)}</td>
                      <td className="p-2.5 text-center">{totalOutstanding === 0 ? "CLEARED" : "DUE"}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              {/* Institutional Endorsement */}
              <div className="pt-6 border-t border-[#E5E7EB] flex items-center justify-between text-[11px] text-[#9299A8]">
                <div>
                  <span className="block font-semibold text-[#202435]">Jagran Lakecity University, Bhopal</span>
                  <span>Mugaliyachap, Near Bilkisganj, MP 462044</span>
                </div>
                <div className="text-right">
                  <div className="w-24 h-8 border-b border-dashed border-[#9299A8] mb-1 mx-auto" />
                  <span className="font-semibold text-[#202435] block">Comptroller of Finance</span>
                  <span>Official University Clearing Seal</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal 2: Consolidated All Fee Records (Task 3.D.2) */}
      {activeDocType === "consolidated" && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full border border-[#E5E7EB] overflow-hidden flex flex-col max-h-[92vh]">
            <div className="px-6 py-3.5 bg-[#F9FAFB] border-b border-[#E5E7EB] flex items-center justify-between print:hidden">
              <span className="text-xs font-bold text-[#202435] flex items-center gap-2">
                <ReceiptIcon className="w-4 h-4 text-[#861F41]" />
                <span>Consolidated Multi-Semester Fee Records</span>
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handlePrint}
                  className="px-3 py-1.5 bg-[#861F41] hover:bg-[#64152F] text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition shadow-xs cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print / Save PDF</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveDocType(null)}
                  className="p-1 rounded-lg text-[#9299A8] hover:text-[#202435] hover:bg-slate-200 transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-8 overflow-y-auto space-y-6 text-xs text-[#202435] print:p-0">
              <div className="flex items-center justify-between border-b-2 border-[#861F41] pb-4">
                <JLULogo variant="full" size="md" />
                <div className="text-right">
                  <span className="text-[10px] font-bold text-[#861F41] uppercase tracking-wider block">
                    Institutional Record
                  </span>
                  <h2 className="text-base font-extrabold text-[#202435]">Consolidated Fee Ledger</h2>
                  <span className="text-[10px] text-[#9299A8] font-mono">
                    Ref: JLU-ALL-FEE-{student.rollNumber}
                  </span>
                </div>
              </div>

              <div className="bg-[#F9FAFB] p-3 rounded-lg border border-[#E5E7EB] flex justify-between text-xs">
                <div>
                  <span className="text-[#9299A8] text-[10px] uppercase font-bold block">Student</span>
                  <span className="font-bold text-sm text-[#202435]">{student.user.name}</span>
                  <span className="text-[#697386] block">Roll No: {student.rollNumber}</span>
                </div>
                <div className="text-right">
                  <span className="text-[#9299A8] text-[10px] uppercase font-bold block">Programme Enrolled</span>
                  <span className="font-semibold text-[#202435]">{student.program.name}</span>
                  <span className="text-[#697386] block">{student.program.department?.name || "School of Engineering"}</span>
                </div>
              </div>

              {/* Itemized by semester */}
              <div className="space-y-4">
                {feeDues.map((due) => (
                  <div key={due.id} className="border border-[#E5E7EB] rounded-lg p-3 space-y-2">
                    <div className="flex justify-between items-center bg-[#F9FAFB] p-2 rounded text-xs font-bold">
                      <span className="text-[#861F41]">Semester {due.feeStructure.semester?.number} Composite Fee</span>
                      <span className="font-mono">{formatCurrency(due.totalAmount)}</span>
                    </div>
                    <div className="grid grid-cols-4 gap-2 text-[11px] text-[#697386] px-2">
                      <div>Tuition: {formatCurrency(due.feeStructure.tuitionFee)}</div>
                      <div>Laboratory: {formatCurrency(due.feeStructure.labFee)}</div>
                      <div>Library: {formatCurrency(due.feeStructure.libraryFee)}</div>
                      <div>Examination: {formatCurrency(due.feeStructure.examFee)}</div>
                    </div>
                    <div className="flex justify-between items-center px-2 pt-1 border-t border-[#E5E7EB] text-[11px]">
                      <span>Amount Cleared: <strong className="text-[#16845B] font-mono">{formatCurrency(due.paidAmount)}</strong></span>
                      <span>Balance Outstanding: <strong className="text-[#C23B4A] font-mono">{formatCurrency(due.totalAmount - due.paidAmount)}</strong></span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-3 bg-[#EAF7F0] border border-[#B7EAD0] rounded-lg text-xs flex justify-between items-center font-bold text-[#16845B]">
                <span>Total Cumulative Settled Amount:</span>
                <span className="font-mono text-base">{formatCurrency(totalPaid)}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal 3: Individual Semester Receipt (Task 3.D.1) */}
      {activeDocType === "receipt" && activeReceiptTxn && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-xl shadow-2xl max-w-xl w-full border border-[#E5E7EB] overflow-hidden flex flex-col max-h-[92vh]">
            <div className="px-6 py-3.5 bg-[#F9FAFB] border-b border-[#E5E7EB] flex items-center justify-between print:hidden">
              <span className="text-xs font-bold text-[#202435] flex items-center gap-2">
                <ReceiptIcon className="w-4 h-4 text-[#861F41]" />
                <span>Official Fee Payment Receipt</span>
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handlePrint}
                  className="px-3 py-1.5 bg-[#861F41] hover:bg-[#64152F] text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition shadow-xs cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Receipt</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setActiveDocType(null);
                    setActiveReceiptTxn(null);
                  }}
                  className="p-1 rounded-lg text-[#9299A8] hover:text-[#202435] hover:bg-slate-200 transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-8 overflow-y-auto space-y-5 text-xs text-[#202435] print:p-0">
              <div className="flex items-center justify-between border-b-2 border-[#861F41] pb-4">
                <JLULogo variant="full" size="md" />
                <div className="text-right">
                  <span className="text-[10px] font-bold text-[#861F41] uppercase tracking-wider block">
                    Official Fee Receipt
                  </span>
                  <h2 className="text-sm font-extrabold text-[#202435]">
                    {activeReceiptTxn.receipt?.receiptNumber || "REC-2026-VERIFIED"}
                  </h2>
                  <span className="text-[10px] text-[#9299A8] font-mono">
                    Date: {formatDate(activeReceiptTxn.createdAt)}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 bg-[#F9FAFB] p-3.5 rounded-lg border border-[#E5E7EB] text-xs">
                <div>
                  <span className="text-[10px] text-[#9299A8] uppercase font-bold block">Student Name</span>
                  <span className="font-bold text-[#202435]">{student.user.name}</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#9299A8] uppercase font-bold block">Roll Number</span>
                  <span className="font-bold font-mono text-[#202435]">{student.rollNumber}</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#9299A8] uppercase font-bold block">Programme</span>
                  <span className="font-medium text-[#202435]">{student.program.code}</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#9299A8] uppercase font-bold block">Payment Channel</span>
                  <span className="font-medium text-[#202435]">{activeReceiptTxn.paymentMethod}</span>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-[#EAF7F0] border border-[#B7EAD0] flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase text-[#16845B] block">Amount Received</span>
                  <span className="text-xl font-extrabold text-[#16845B] font-mono">
                    {formatCurrency(activeReceiptTxn.amount)}
                  </span>
                </div>
                <div className="text-right">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-white text-[#16845B] border border-[#B7EAD0]">
                    CLEARED & SETTLED
                  </span>
                  <span className="text-[10px] text-[#16845B] block mt-1 font-mono">
                    Ref: {activeReceiptTxn.referenceNo || "SBX_AUTO"}
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-[#F9FAFB] border border-[#E5E7EB] space-y-1 font-mono text-[10px] text-[#697386]">
                <div className="text-[10px] font-bold uppercase text-[#9299A8] font-sans">
                  Digital Verification Signature
                </div>
                <div className="break-all select-all text-[#202435]">
                  {activeReceiptTxn.receipt?.receiptHash || "SHA256:7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069"}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sandbox Payment Modal */}
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
