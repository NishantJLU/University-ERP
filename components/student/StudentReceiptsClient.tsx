"use client";

import React, { useState } from "react";
import { Receipt as ReceiptIcon, Printer, Download, CheckCircle2, ShieldCheck, Eye, X } from "lucide-react";
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
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
        <div>
          <span className="text-xs font-bold text-rose-600 uppercase tracking-wider">
            University Treasury & Bursar
          </span>
          <h1 className="text-2xl font-extrabold text-slate-900 mt-1">
            Official Fee Receipts ({receipts.length})
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Digitally signed and cryptographic receipts verified by Jagran Lakecity University Accounts
          </p>
        </div>

        {receipts.length > 0 && (
          <button
            type="button"
            onClick={() => handlePrint(receipts[0])}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold shadow-xs transition flex items-center gap-1.5 self-start sm:self-auto"
          >
            <Printer className="w-4 h-4" />
            Print Latest Receipt
          </button>
        )}
      </div>

      {receipts.length === 0 ? (
        <EmptyState
          icon={ReceiptIcon}
          title="No Receipts Generated"
          description="You currently have no settled fee transactions or receipts."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 print:hidden">
          {receipts.map((receipt) => (
            <div
              key={receipt.id}
              className="bg-white rounded-2xl shadow-xs border border-slate-200 p-6 space-y-4 font-sans relative overflow-hidden hover:border-slate-300 transition"
            >
              {/* Header badge */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-rose-600 text-white flex items-center justify-center font-extrabold text-xs">
                    JLU
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-900">
                      Jagran Lakecity University
                    </h3>
                    <p className="text-[10px] text-slate-500">Official Payment Receipt</p>
                  </div>
                </div>
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  <CheckCircle2 className="w-3 h-3" /> Settled
                </span>
              </div>

              {/* Breakdown */}
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Receipt Number:</span>
                  <span className="font-mono font-bold text-slate-900">{receipt.receiptNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Transaction ID:</span>
                  <span className="font-mono text-slate-700">{receipt.paymentTransaction.transactionId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Student Name:</span>
                  <span className="font-semibold text-slate-900">{receipt.student.user.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Roll Number:</span>
                  <span className="font-mono text-slate-700">{receipt.student.rollNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Degree Program:</span>
                  <span className="text-slate-800">{receipt.student.program.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Fee Category:</span>
                  <span className="text-slate-800 font-medium">
                    {receipt.paymentTransaction.studentFeeDue.feeStructure.title}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Settlement Date:</span>
                  <span className="text-slate-700">{formatDate(receipt.issueDate)}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Amount Paid</span>
                  <span className="text-xl font-extrabold text-emerald-700">
                    {formatCurrency(receipt.amountPaid)}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedReceipt(receipt)}
                    className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1 transition"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    Preview
                  </button>
                  <button
                    type="button"
                    onClick={() => handlePrint(receipt)}
                    className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-xs transition"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    Print Receipt
                  </button>
                </div>
              </div>

              {/* Digital Hash */}
              <div className="pt-2 border-t border-dashed border-slate-200 text-[9px] text-slate-400 font-mono truncate">
                <span className="font-bold text-slate-500">Digital Seal: </span>
                {receipt.receiptHash}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Printable Receipt Voucher Container (Visible when previewed or printed) */}
      {selectedReceipt && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 print:p-0 print:static print:bg-transparent print:z-auto">
          <div className="bg-white rounded-2xl max-w-xl w-full p-8 shadow-2xl space-y-6 border border-slate-200 print:border-none print:shadow-none print:p-4 print:max-w-none">
            {/* Modal actions (hidden on print) */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 print:hidden">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Official Receipt Preview
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold transition flex items-center gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5" />
                  Print Receipt
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedReceipt(null)}
                  className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* University Letterhead */}
            <div className="text-center space-y-1 pb-4 border-b-2 border-slate-900">
              <div className="inline-block px-3 py-1 bg-rose-600 text-white font-extrabold text-sm rounded mb-1">
                JLU
              </div>
              <h2 className="text-xl font-extrabold text-slate-900 uppercase tracking-tight">
                Jagran Lakecity University
              </h2>
              <p className="text-xs text-slate-600 font-medium">
                Mugdalia Chhap, Near Bilkisganj, Bhopal, Madhya Pradesh 462044
              </p>
              <p className="text-[11px] text-slate-500">
                Office of the University Bursar & Treasury • Student E-Payment Voucher
              </p>
            </div>

            {/* Receipt Metadata */}
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="space-y-1.5">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Receipt No:</span>
                  <span className="font-mono font-bold text-slate-900 text-sm">
                    {selectedReceipt.receiptNumber}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Transaction Ref:</span>
                  <span className="font-mono text-slate-700">
                    {selectedReceipt.paymentTransaction.transactionId}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Issue Date:</span>
                  <span className="text-slate-800">{formatDate(selectedReceipt.issueDate)}</span>
                </div>
              </div>

              <div className="space-y-1.5 text-right">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Student Name:</span>
                  <span className="font-bold text-slate-900 text-sm">
                    {selectedReceipt.student.user.name}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Roll Number:</span>
                  <span className="font-mono text-slate-700 font-bold">
                    {selectedReceipt.student.rollNumber}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Academic Program:</span>
                  <span className="text-slate-800 font-medium">
                    {selectedReceipt.student.program.name} ({selectedReceipt.student.program.code})
                  </span>
                </div>
              </div>
            </div>

            {/* Table of dues settled */}
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-100 border-b border-slate-200 font-bold text-slate-700 uppercase text-[10px]">
                  <tr>
                    <th className="p-3">Fee Particulars</th>
                    <th className="p-3">Session</th>
                    <th className="p-3 text-right">Settled Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr>
                    <td className="p-3 font-semibold text-slate-900">
                      {selectedReceipt.paymentTransaction.studentFeeDue.feeStructure.title}
                    </td>
                    <td className="p-3 text-slate-600">
                      {selectedReceipt.paymentTransaction.studentFeeDue.feeStructure.academicYear}
                    </td>
                    <td className="p-3 text-right font-mono font-bold text-slate-900">
                      {formatCurrency(selectedReceipt.amountPaid)}
                    </td>
                  </tr>
                </tbody>
                <tfoot className="bg-slate-50 border-t border-slate-200 font-bold">
                  <tr>
                    <td colSpan={2} className="p-3 text-slate-700 uppercase text-[10px]">
                      Total Amount Received (INR)
                    </td>
                    <td className="p-3 text-right text-base text-emerald-700 font-extrabold font-mono">
                      {formatCurrency(selectedReceipt.amountPaid)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* Digital signature & seal */}
            <div className="pt-4 border-t border-slate-200 flex items-center justify-between text-xs">
              <div className="space-y-1">
                <div className="flex items-center gap-1 text-emerald-700 font-bold">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Authenticated Payment Document</span>
                </div>
                <p className="text-[9px] text-slate-400 font-mono break-all max-w-xs">
                  Hash: {selectedReceipt.receiptHash}
                </p>
              </div>

              <div className="text-right space-y-1">
                <div className="w-24 h-10 border-b border-slate-400 ml-auto flex items-end justify-center text-[10px] text-slate-400 italic">
                  [Verified Seal]
                </div>
                <span className="block text-[10px] font-bold text-slate-700 uppercase">
                  Finance Officer, JLU
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
