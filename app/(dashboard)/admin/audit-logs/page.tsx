import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Clock, Shield, Filter } from "lucide-react";
import { formatDate } from "@/lib/utils";

export default async function AdminAuditLogsPage() {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") {
    redirect("/login");
  }

  const logs = await prisma.auditLog.findMany({
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return (
    <div className="space-y-6">
      <div>
        <span className="text-xs font-bold text-rose-600 uppercase tracking-wider">
          Compliance & Security Ledger
        </span>
        <h1 className="text-2xl font-extrabold text-slate-900 mt-1">
          System-Wide Audit Logs
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Immutable event ledger recording academic authorizations, attendance updates, financial settlements, and administrative actions
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-xs border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-[10px] font-bold uppercase text-slate-500">
                <th className="p-3">Timestamp</th>
                <th className="p-3">Actor</th>
                <th className="p-3">Role</th>
                <th className="p-3">Action</th>
                <th className="p-3">Entity</th>
                <th className="p-3">IP Address</th>
                <th className="p-3">Event Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/50 transition">
                  <td className="p-3 font-mono text-slate-500 text-[11px] whitespace-nowrap">
                    {new Date(log.createdAt).toLocaleString()}
                  </td>
                  <td className="p-3 font-semibold text-slate-900">{log.actorName}</td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-100 border border-slate-200">
                      {log.actorRole}
                    </span>
                  </td>
                  <td className="p-3 font-mono font-bold text-slate-900">{log.action}</td>
                  <td className="p-3 text-slate-600 font-mono text-[11px]">{log.entity}</td>
                  <td className="p-3 font-mono text-slate-400 text-[10px]">{log.ipAddress || "127.0.0.1"}</td>
                  <td className="p-3 font-mono text-[11px] text-slate-600 max-w-xs truncate">
                    {log.details || "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
