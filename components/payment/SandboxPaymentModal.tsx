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
  const [payAmount, setPayAmount] = useState(feeDue.pendingAmount);
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
        setError(data.message || "Failed to initialize payment.");
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
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-blue-600 text-white">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white leading-tight">
                Jagran Lakecity University Secure Gateway
              </h3>
              <p className="text-[11px] text-blue-200">
                Sandbox Test Mode • 256-Bit Encrypted
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-md"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {step === "SELECT" && (
            <div className="space-y-4">
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                      Fee Item
                    </span>
                    <h4 className="text-xs font-bold text-slate-900">
                      {feeDue.title}
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      Student: {feeDue.studentName} ({feeDue.rollNumber})
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                      Remaining
                    </span>
                    <p className="text-sm font-extrabold text-blue-700">
                      {formatCurrency(feeDue.pendingAmount)}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Payable Amount (₹)
                </label>
                <input
                  type="number"
                  min="1"
                  max={feeDue.pendingAmount}
                  value={payAmount}
                  onChange={(e) => setPayAmount(Number(e.target.value))}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2">
                  Select Payment Method
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setMethod("UPI")}
                    className={`p-2.5 rounded-xl border text-center transition ${
                      method === "UPI"
                        ? "border-blue-600 bg-blue-50/60 text-blue-700 font-bold"
                        : "border-slate-200 hover:bg-slate-50 text-slate-700"
                    }`}
                  >
                    <QrCode className="w-5 h-5 mx-auto mb-1 text-blue-600" />
                    <span className="text-xs">UPI / QR</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setMethod("CARD")}
                    className={`p-2.5 rounded-xl border text-center transition ${
                      method === "CARD"
                        ? "border-blue-600 bg-blue-50/60 text-blue-700 font-bold"
                        : "border-slate-200 hover:bg-slate-50 text-slate-700"
                    }`}
                  >
                    <CreditCard className="w-5 h-5 mx-auto mb-1 text-emerald-600" />
                    <span className="text-xs">Debit / Card</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setMethod("NETBANKING")}
                    className={`p-2.5 rounded-xl border text-center transition ${
                      method === "NETBANKING"
                        ? "border-blue-600 bg-blue-50/60 text-blue-700 font-bold"
                        : "border-slate-200 hover:bg-slate-50 text-slate-700"
                    }`}
                  >
                    <Building2 className="w-5 h-5 mx-auto mb-1 text-purple-600" />
                    <span className="text-xs">NetBanking</span>
                  </button>
                </div>
              </div>

              <button
                type="button"
                onClick={handleInitiate}
                disabled={loading || payAmount <= 0}
                className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold shadow-md flex items-center justify-center gap-2 disabled:opacity-50 transition"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Connecting to Gateway...
                  </>
                ) : (
                  <>Proceed to Sandbox Checkout ({formatCurrency(payAmount)})</>
                )}
              </button>
            </div>
          )}

          {step === "GATEWAY" && (
            <div className="space-y-4">
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
                <div className="flex items-center gap-2 text-amber-800 font-bold text-xs">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Sandbox Gateway Simulator</span>
                </div>
                <p className="text-[11px] text-amber-700 mt-1">
                  Order ID: <code className="font-mono">{txnDetails.transactionId}</code>
                </p>
                <p className="text-[11px] text-amber-700">
                  Amount: <span className="font-bold">{formatCurrency(txnDetails.amount)}</span> via {method}
                </p>
              </div>

              <p className="text-xs text-slate-600 text-center">
                Select test scenario to simulate server-side verification:
              </p>

              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => handleSimulateOutcome("SUCCESS")}
                  disabled={loading}
                  className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-sm flex items-center justify-center gap-2 disabled:opacity-50 transition"
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <CheckCircle2 className="w-4 h-4" />
                  )}
                  Simulate Successful Payment (Server Verified)
                </button>

                <button
                  type="button"
                  onClick={() => handleSimulateOutcome("GATEWAY_FAILURE")}
                  disabled={loading}
                  className="w-full py-2 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold border border-slate-300 flex items-center justify-center gap-2 transition"
                >
                  Simulate Bank Failure / Insufficient Funds
                </button>

                <button
                  type="button"
                  onClick={() => handleSimulateOutcome("USER_CANCELLED")}
                  disabled={loading}
                  className="w-full py-2 px-4 text-slate-500 hover:text-slate-800 text-xs font-medium"
                >
                  Cancel Transaction
                </button>
              </div>
            </div>
          )}

          {step === "SUCCESS" && receipt && (
            <div className="text-center space-y-4 py-2">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <FileCheck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-base font-bold text-slate-900">
                  Payment Verified & Settled
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Official Digital Receipt Generated
                </p>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-left text-xs space-y-1.5 font-mono">
                <div className="flex justify-between">
                  <span className="text-slate-500">Receipt No:</span>
                  <span className="font-bold text-slate-900">{receipt.receiptNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Amount Paid:</span>
                  <span className="font-bold text-emerald-700">{formatCurrency(receipt.amountPaid)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Signature:</span>
                  <span className="text-[10px] text-slate-400 truncate max-w-[200px]">
                    {receipt.receiptHash}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition"
              >
                Done & View Receipts
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
