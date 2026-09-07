import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Settings, ShieldCheck, Database, Server, Key } from "lucide-react";

export default async function AdminSettingsPage() {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") {
    redirect("/login");
  }

  return (
    <div className="space-y-6">
      <div>
        <span className="text-xs font-bold text-rose-600 uppercase tracking-wider">
          System Infrastructure & Policies
        </span>
        <h1 className="text-2xl font-extrabold text-slate-900 mt-1">
          University System Settings
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Enterprise security controls, database connectivity, backup schedules, and payment gateway configuration
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow-xs border border-slate-200 p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-50 text-blue-700">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Database & ORM Status</h3>
              <p className="text-xs text-slate-500">Prisma ORM • Relational Architecture</p>
            </div>
          </div>
          <div className="space-y-2 text-xs text-slate-600 bg-slate-50 p-3.5 rounded-xl border border-slate-100">
            <div className="flex justify-between">
              <span>Database Engine:</span>
              <span className="font-mono font-bold text-slate-900">SQLite / PostgreSQL Ready</span>
            </div>
            <div className="flex justify-between">
              <span>Active Entities:</span>
              <span className="font-mono font-bold text-slate-900">30+ Relational Tables</span>
            </div>
            <div className="flex justify-between">
              <span>Sync State:</span>
              <span className="font-semibold text-emerald-700">One Source of Truth Active</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xs border border-slate-200 p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-50 text-amber-700">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Payment Sandbox Gateway</h3>
              <p className="text-xs text-slate-500">HMAC-SHA256 Server-Side Signature Verification</p>
            </div>
          </div>
          <div className="space-y-2 text-xs text-slate-600 bg-slate-50 p-3.5 rounded-xl border border-slate-100">
            <div className="flex justify-between">
              <span>Gateway Mode:</span>
              <span className="font-mono font-bold text-amber-800">SANDBOX TEST</span>
            </div>
            <div className="flex justify-between">
              <span>Merchant Identifier:</span>
              <span className="font-mono font-bold text-slate-900">MERCHANT_UNIV_TEST_001</span>
            </div>
            <div className="flex justify-between">
              <span>Card / Banking Storage:</span>
              <span className="font-bold text-emerald-700">Disabled (Zero PCI Exposure)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
