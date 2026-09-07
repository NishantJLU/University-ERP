import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { RotateCcw } from "lucide-react";

export default async function AccountsRefundsPage() {
  const user = await getCurrentUser();
  if (!user || user.role !== "ACCOUNTS") {
    redirect("/login");
  }

  const refunds = await prisma.refund.findMany({
    include: {
      paymentTransaction: {
        include: {
          student: { include: { user: true } },
        },
      },
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">
          Treasury Exceptions
        </span>
        <h1 className="text-2xl font-extrabold text-slate-900 mt-1">
          Refund & Reversal Authorizations
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Process verified fee adjustments, caution deposit refunds, and transaction chargebacks
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-xs border border-slate-200 p-8 text-center space-y-2">
        <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
          <RotateCcw className="w-6 h-6" />
        </div>
        <h3 className="text-sm font-bold text-slate-900">No Active Refund Claims</h3>
        <p className="text-xs text-slate-500 max-w-sm mx-auto">
          All verified student fee payments are settled. Any newly filed refund requests will appear here for Bursar signoff.
        </p>
      </div>
    </div>
  );
}
