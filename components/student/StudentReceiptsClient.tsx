"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Receipt as ReceiptIcon, Printer, CheckCircle2, ShieldCheck, Eye, X } from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";
import EmptyState from "@/components/ui/EmptyState";
import { toast } from "@/components/ui/Toast";

interface ReceiptItem {
  id: string;
  receiptNumber: string;
  receiptHash: string;
  amountPaid: number;
  issueDate: string;
  paymentTransaction: {
    transactionId: string;
    studentFeeDue: {
      feeStructure: {
        title: string;
        academicYear: string;
      };
    };
  };
  student: {
    rollNumber: string;
    user: {
      name: string;
      email: string;
    };
    program: {
      name: string;
      code: string;
    };
  };
}

interface StudentReceiptsClientProps {
  receipts: ReceiptItem[];
}

export default function StudentReceiptsClient({ receipts }: StudentReceiptsClientProps) {
  const [selectedReceipt, setSelectedReceipt] = useState<ReceiptItem | null>(null);

  const handlePrint = (receipt: ReceiptItem) => {
    setSelectedReceipt(receipt);
    toast.info("Preparing official printable university receipt voucher...");
    setTimeout(() => {
      window.print();
    }, 300);
  };

  return (
    <div className="space-y-4 font-sans text-slate-800">
      {/* Institutional Breadcrumb & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3 print:hidden">
        <div>
          <nav className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
            <Link href="/student/dashboard" className="hover:text-slate-800">
              Dashboard
            </Link>
            <span>/</span>
            <Link href="/student/fees" className="hover:text-slate-800">
              Finance & Accounts
            </Link>
            <span>/</span>
            <span className="text-slate-900 font-medium">Receipt Vouchers</span>
          </nav>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Official Fee Receipts & Clearing Vouchers
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Cryptographically sealed verification vouchers issued by the Jagran Lakecity University Accounts Desk
          </p>
        </div>

        {receipts.length > 0 && (
          <button
            type="button"
            onClick={() => handlePrint(receipts[0])}
            className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-sm text-xs font-semibold shadow-xs transition flex items-center gap-1.5 self-start sm:self-auto"
          >
            <Printer className="w-3.5 h-3.5" />
            Print Latest Voucher
          </button>
        )}
      </div>

      {receipts.length === 0 ? (
        <EmptyState
          icon={ReceiptIcon}
          title="No Receipts Generated"
          description="You currently have no settled fee transactions or receipts on record."
        />
      ) : (
        /* Dense Tabular Receipts Register */
        <div className="border border-slate-300 bg-white rounded-sm overflow-hidden print:hidden">
          <div className="px-3.5 py-2.5 bg-slate-50 border-b border-slate-300 flex items-center justify-between">
            <div>
              <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Digital Receipt Register
              </h2>
              <p className="text-[11px] text-slate-500">
                Official audit trail of settled payments
              </p>
            </div>
            <span className="text-xs font-mono text-slate-500 bg-white border border-slate-200 px-2 py-0.5 rounded-xs">
              {receipts.length} Voucher(s)
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100 border-b border-slate-300 text-[10px] font-bold uppercase tracking-wider text-slate-600">
                  <th className="py-2.5 px-3">Receipt No.</th>
                  <th className="py-2.5 px-3">Issue Date</th>
                  <th className="py-2.5 px-3">Demand Note / Fee Head</th>
                  <th className="py-2.5 px-3">Txn Reference</th>
                  <th className="py-2.5 px-3 text-right">Amount Settled</th>
                  <th className="py-2.5 px-3 text-center">Status</th>
                  <th className="py-2.5 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {receipts.map((receipt) => (
                  <tr key={receipt.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-2.5 px-3 font-mono font-bold text-slate-900">
                      {receipt.receiptNumber}
                    </td>
                    <td className="py-2.5 px-3 text-slate-700 whitespace-nowrap">
                      {formatDate(receipt.issueDate)}
                    </td>
                    <td className="py-2.5 px-3 font-medium text-slate-800">
                      {receipt.paymentTransaction?.studentFeeDue?.feeStructure?.title || "Semester Tuition"}
                    </td>
                    <td className="py-2.5 px-3 font-mono text-slate-600 text-[11px]">
                      {receipt.paymentTransaction?.transactionId || "—"}
                    </td>
                    <td className="py-2.5 px-3 text-right font-bold text-slate-900 font-mono whitespace-nowrap">
                      {formatCurrency(receipt.amountPaid)}
                    </td>
                    <td className="py-2.5 px-3 text-center whitespace-nowrap">
                      <span className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded-xs text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-300">
                        <CheckCircle2 className="w-3 h-3 text-emerald-700" /> Settled
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => setSelectedReceipt(receipt)}
                          className="px-2 py-1 bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 rounded-sm text-[11px] font-semibold inline-flex items-center gap-1 transition"
                        >
                          <Eye className="w-3 h-3 text-slate-500" />
                          View
                        </button>
                        <button
                          type="button"
                          onClick={() => handlePrint(receipt)}
                          className="px-2.5 py-1 bg-blue-700 hover:bg-blue-800 text-white rounded-sm text-[11px] font-bold inline-flex items-center gap-1 transition"
                        >
                          <Printer className="w-3 h-3" />
                          Print
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Printable Receipt Voucher Container */}
      {selectedReceipt && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 print:p-0 print:static print:bg-transparent print:z-auto">
          <div className="bg-white rounded-sm max-w-xl w-full p-6 shadow-xl space-y-4 border border-slate-300 print:border-none print:shadow-none print:p-4 print:max-w-none">
            {/* Modal actions (hidden on print) */}
            <div className="flex items-center justify-between pb-2 border-b border-slate-200 print:hidden">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Official University Voucher Preview
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-3 py-1 bg-blue-700 hover:bg-blue-800 text-white rounded-sm text-xs font-bold transition flex items-center gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5" />
                  Print Receipt
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedReceipt(null)}
                  className="p-1 text-slate-400 hover:text-slate-700 rounded-xs hover:bg-slate-100"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* University Letterhead */}
            <div className="text-center space-y-0.5 pb-3 border-b-2 border-slate-900">
              <h2 className="text-lg font-bold text-slate-900 uppercase tracking-tight">
                Jagran Lakecity University
              </h2>
              <p className="text-[11px] text-slate-600 font-medium">
                Mugdalia Chhap, Near Bilkisganj, Bhopal, Madhya Pradesh 462044
              </p>
              <p className="text-[10px] text-slate-500 uppercase tracking-wider">
                Office of the University Bursar & Treasury • E-Payment Voucher
              </p>
            </div>

            {/* Receipt Metadata */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="space-y-1">
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-bold">Voucher No:</span>
                  <span className="font-mono font-bold text-slate-900 text-sm">
                    {selectedReceipt.receiptNumber}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-bold">Txn Reference:</span>
                  <span className="font-mono text-slate-700 text-[11px]">
                    {selectedReceipt.paymentTransaction?.transactionId || "TXN-DIRECT"}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-bold">Issue Date:</span>
                  <span className="text-slate-800">{formatDate(selectedReceipt.issueDate)}</span>
                </div>
              </div>

              <div className="space-y-1 text-right">
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-bold">Student Name:</span>
                  <span className="font-bold text-slate-900">
                    {selectedReceipt.student.user.name}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-bold">Roll Number:</span>
                  <span className="font-mono text-slate-800 font-bold">
                    {selectedReceipt.student.rollNumber}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-bold">Program:</span>
                  <span className="text-slate-800">
                    {selectedReceipt.student.program.code}
                  </span>
                </div>
              </div>
            </div>

            {/* Tabular Charge Breakdown */}
            <div className="border border-slate-300 rounded-xs overflow-hidden">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-100 border-b border-slate-300 text-[10px] font-bold uppercase text-slate-600">
                    <th className="p-2">Description / Fee Category</th>
                    <th className="p-2 text-right">Settled Sum</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="p-2 font-medium text-slate-800">
                      {selectedReceipt.paymentTransaction?.studentFeeDue?.feeStructure?.title || "Semester Composite Fee"}
                    </td>
                    <td className="p-2 text-right font-mono font-bold text-slate-900">
                      {formatCurrency(selectedReceipt.amountPaid)}
                    </td>
                  </tr>
                </tbody>
                <tfoot>
                  <tr className="bg-slate-50 font-bold border-t border-slate-300">
                    <td className="p-2 text-slate-900">Net Realized Collection</td>
                    <td className="p-2 text-right font-mono text-slate-900 font-bold">
                      {formatCurrency(selectedReceipt.amountPaid)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* Cryptographic Seal */}
            <div className="bg-slate-50 p-2.5 rounded-xs border border-slate-200 text-[10px] space-y-1">
              <div className="flex items-center gap-1 text-slate-700 font-bold uppercase">
                <ShieldCheck className="w-3.5 h-3.5 text-slate-600" />
                <span>SHA-256 Digital Verification Signature</span>
              </div>
              <p className="font-mono text-slate-600 break-all select-all text-[9px]">
                {selectedReceipt.receiptHash}
              </p>
              <p className="text-[10px] text-slate-400">
                Generated automatically by University ERP Treasury System. Valid without physical signature.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
