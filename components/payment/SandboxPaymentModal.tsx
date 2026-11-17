"use client";

import { useState } from "react";
import {
  CreditCard,
  QrCode,
  Building2,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Loader2,
  X,
  FileCheck,
  ArrowRight,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface SandboxPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (receipt: any) => void;
  feeDue: {
    id: string;
    title: string;
    totalAmount: number;
    paidAmount: number;
    pendingAmount: number;
    preferredPayAmount?: number;
    studentName: string;
    rollNumber: string;
  };
}

export default function SandboxPaymentModal({
  isOpen,
  onClose,
  onSuccess,
  feeDue,
}: SandboxPaymentModalProps) {
  const [payAmount, setPayAmount] = useState(
    feeDue.preferredPayAmount && feeDue.preferredPayAmount <= feeDue.pendingAmount
      ? feeDue.preferredPayAmount
      : feeDue.pendingAmount
  );
  const [method, setMethod] = useState<"UPI" | "CARD" | "NETBANKING">("UPI");
  const [step, setStep] = useState<"SELECT" | "GATEWAY" | "SUCCESS">("SELECT");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [txnDetails, setTxnDetails] = useState<any>(null);
  const [receipt, setReceipt] = useState<any>(null);

  if (!isOpen) return null;

  const handleInitiate = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/payments/initiate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentFeeDueId: feeDue.id,
          amount: Number(payAmount),
        }),
      });
      const data = await res.json();

      if (data.success) {
        setTxnDetails(data);
        setStep("GATEWAY");
      } else {
        setError(data.message || "Failed to initialize payment gateway.");
      }
    } catch (err) {
      setError("Payment gateway network error.");
    } finally {
      setLoading(false);
    }
  };

  const handleSimulateOutcome = async (outcome: "SUCCESS" | "USER_CANCELLED" | "GATEWAY_FAILURE") => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/payments/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          transactionId: txnDetails.transactionId,
          referenceNo: txnDetails.referenceNo,
          gatewayToken: txnDetails.gatewayToken,
          sandboxOutcome: outcome,
          paymentChannel: method,
        }),
      });
      const data = await res.json();

      if (data.success) {
        setReceipt(data.receipt);
        setStep("SUCCESS");
        onSuccess(data.receipt);
      } else {
        setError(data.message || "Payment verification failed.");
      }
    } catch (err) {
      setError("Server verification connection failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-sm shadow-lg max-w-lg w-full overflow-hidden border border-slate-300">
        {/* Modal Header */}
        <div className="px-4 py-3 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-slate-300" />
            <div>
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                Payment Settlement Gateway
              </h3>
              <p className="text-[10px] text-slate-400">
                Official University Clearing Desk • 256-Bit SSL Encrypted
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-xs transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Sandbox Notice Strip */}
        <div className="bg-slate-100 px-4 py-1.5 border-b border-slate-200 flex items-center justify-between text-[11px] text-slate-700">
          <span className="font-semibold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-xs bg-blue-700" />
            Sandbox Simulation Active
          </span>
          <span className="text-[10px] font-mono text-slate-500">No real financial charge incurred</span>
        </div>

        {/* Modal Content */}
        <div className="p-4">
          {error && (
            <div className="mb-3 p-2.5 bg-red-50 border border-red-300 rounded-xs text-xs text-red-800 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-600" />
              <span>{error}</span>
            </div>
          )}

          {step === "SELECT" && (
            <div className="space-y-3.5">
              {/* Fee Context Summary */}
              <div className="bg-slate-50 p-3 rounded-xs border border-slate-200">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                      Target Demand Note
                    </span>
                    <h4 className="text-xs font-bold text-slate-900 mt-0.5">
                      {feeDue.title}
                    </h4>
                    <p className="text-[11px] text-slate-600 font-mono mt-0.5">
                      Student: {feeDue.studentName} ({feeDue.rollNumber})
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                      Outstanding Balance
                    </span>
                    <p className="text-sm font-bold text-slate-900 font-mono mt-0.5">
                      {formatCurrency(feeDue.pendingAmount)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Amount Selection */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-slate-700">
                    Remittance Amount (₹)
                  </label>
                  <div className="flex items-center gap-1 text-[11px]">
                    <button
                      type="button"
                      onClick={() => setPayAmount(feeDue.pendingAmount)}
                      className={`px-2 py-0.5 rounded-xs font-semibold border transition ${
                        payAmount === feeDue.pendingAmount
                          ? "bg-slate-800 text-white border-slate-800"
                          : "bg-white text-slate-600 border-slate-300 hover:bg-slate-50"
                      }`}
                    >
                      Full ({formatCurrency(feeDue.pendingAmount)})
                    </button>
                    {feeDue.pendingAmount > 25000 && (
                      <button
                        type="button"
                        onClick={() => setPayAmount(25000)}
                        className={`px-2 py-0.5 rounded-xs font-semibold border transition ${
                          payAmount === 25000
                            ? "bg-slate-800 text-white border-slate-800"
                            : "bg-white text-slate-600 border-slate-300 hover:bg-slate-50"
                        }`}
                      >
                        Installment (₹25,000)
                      </button>
                    )}
                  </div>
                </div>

                <div className="relative">
                  <span className="absolute left-3 top-2 text-slate-500 text-xs font-semibold">₹</span>
                  <input
                    type="number"
                    min="1"
                    max={feeDue.pendingAmount}
                    value={payAmount}
                    onChange={(e) => setPayAmount(Number(e.target.value))}
                    className="w-full pl-7 pr-3 py-1.5 text-xs font-mono border border-slate-300 rounded-xs focus:ring-1 focus:ring-slate-800 focus:outline-none font-semibold text-slate-900"
                  />
                </div>
              </div>

              {/* Payment Channel Selection */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Select Settlement Channel
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setMethod("UPI")}
                    className={`p-2.5 rounded-xs border text-center transition ${
                      method === "UPI"
                        ? "border-blue-700 bg-blue-50/60 text-blue-900 font-bold"
                        : "border-slate-300 hover:bg-slate-50 text-slate-700"
                    }`}
                  >
                    <QrCode className="w-4 h-4 mx-auto mb-1 text-slate-700" />
                    <span className="text-xs">UPI / VPA</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setMethod("CARD")}
                    className={`p-2.5 rounded-xs border text-center transition ${
                      method === "CARD"
                        ? "border-blue-700 bg-blue-50/60 text-blue-900 font-bold"
                        : "border-slate-300 hover:bg-slate-50 text-slate-700"
                    }`}
                  >
                    <CreditCard className="w-4 h-4 mx-auto mb-1 text-slate-700" />
                    <span className="text-xs">Debit/Credit Card</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setMethod("NETBANKING")}
                    className={`p-2.5 rounded-xs border text-center transition ${
                      method === "NETBANKING"
                        ? "border-blue-700 bg-blue-50/60 text-blue-900 font-bold"
                        : "border-slate-300 hover:bg-slate-50 text-slate-700"
                    }`}
                  >
                    <Building2 className="w-4 h-4 mx-auto mb-1 text-slate-700" />
                    <span className="text-xs">Net Banking</span>
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-3 py-1.5 border border-slate-300 text-slate-700 hover:bg-slate-50 rounded-sm text-xs font-medium transition"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleInitiate}
                  disabled={loading || payAmount <= 0}
                  className="px-4 py-1.5 bg-blue-700 hover:bg-blue-800 text-white rounded-sm text-xs font-bold transition flex items-center gap-1.5 disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      Initializing...
                    </>
                  ) : (
                    <>
                      Proceed to Authorize ({formatCurrency(payAmount)})
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {step === "GATEWAY" && (
            <div className="space-y-3.5">
              <div className="p-3 bg-slate-50 border border-slate-300 rounded-xs space-y-1.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Order ID:</span>
                  <code className="font-mono font-bold text-slate-800">{txnDetails.transactionId}</code>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Channel:</span>
                  <span className="font-medium text-slate-800">
                    {method === "UPI" ? "UPI Clearing" : method === "CARD" ? "Debit / Credit Card" : "Net Banking"}
                  </span>
                </div>
                <div className="flex items-center justify-between border-t border-slate-200 pt-1.5">
                  <span className="text-slate-700 font-bold">Settlement Sum:</span>
                  <span className="font-bold text-slate-900 font-mono text-sm">
                    {formatCurrency(txnDetails.amount)}
                  </span>
                </div>
              </div>

              <p className="text-[11px] text-slate-600 text-center">
                Simulate gateway authorization outcome:
              </p>

              <div className="space-y-1.5">
                <button
                  type="button"
                  onClick={() => handleSimulateOutcome("SUCCESS")}
                  disabled={loading}
                  className="w-full py-2 px-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-sm text-xs font-bold transition flex items-center justify-center gap-1.5 disabled:opacity-50"
                >
                  {loading ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  )}
                  Authorize & Settle Transaction (Success)
                </button>

                <button
                  type="button"
                  onClick={() => handleSimulateOutcome("GATEWAY_FAILURE")}
                  disabled={loading}
                  className="w-full py-1.5 px-3 bg-white hover:bg-slate-50 text-slate-700 rounded-sm text-xs font-semibold border border-slate-300 flex items-center justify-center gap-1.5 transition"
                >
                  Simulate Bank Rejection / Insufficient Funds
                </button>

                <button
                  type="button"
                  onClick={() => handleSimulateOutcome("USER_CANCELLED")}
                  disabled={loading}
                  className="w-full py-1 text-slate-500 hover:text-slate-800 text-xs font-medium transition"
                >
                  Abort Transaction
                </button>
              </div>
            </div>
          )}

          {step === "SUCCESS" && receipt && (
            <div className="space-y-3 py-1">
              <div className="flex items-center gap-2 p-2.5 bg-emerald-50 border border-emerald-300 rounded-xs text-emerald-900">
                <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" />
                <div>
                  <h4 className="text-xs font-bold">
                    Payment Verified & Reconciled
                  </h4>
                  <p className="text-[11px] text-emerald-700">
                    Official digital receipt voucher has been generated in the ledger.
                  </p>
                </div>
              </div>

              <div className="bg-slate-50 p-3 rounded-xs border border-slate-300 text-xs space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-500">Voucher No:</span>
                  <span className="font-mono font-bold text-slate-900">{receipt.receiptNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Amount Paid:</span>
                  <span className="font-bold text-slate-900 font-mono">{formatCurrency(receipt.amountPaid)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Status:</span>
                  <span className="font-semibold text-emerald-700">Cleared & Credited</span>
                </div>
                <div className="flex justify-between border-t border-slate-200 pt-1.5 font-mono text-[10px]">
                  <span className="text-slate-500">Digital Seal:</span>
                  <span className="text-slate-600 truncate max-w-[200px]">
                    {receipt.receiptHash}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="w-full py-2 px-3 bg-blue-700 hover:bg-blue-800 text-white rounded-sm text-xs font-bold transition"
              >
                Close & Return to Ledger
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
