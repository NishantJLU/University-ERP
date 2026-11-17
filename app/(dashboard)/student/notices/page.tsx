import Link from "next/link";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Bell, ShieldCheck } from "lucide-react";
import { formatDate } from "@/lib/utils";

export default async function StudentNoticesPage() {
  const user = await getCurrentUser();
  if (!user || user.role !== "STUDENT" || !user.studentId) {
    redirect("/login");
  }

  const notices = await prisma.notice.findMany({
    include: { author: true },
    orderBy: { publishedAt: "desc" },
  });

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
            <span className="text-slate-900 font-medium">Institutional Circulars</span>
          </nav>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Official Announcements & Administrative Circulars
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Statutory university circulars, examination notifications, and departmental bulletins
          </p>
        </div>
      </div>

      {/* Structured Notices Register */}
      <div className="border border-slate-300 bg-white rounded-sm divide-y divide-slate-200">
        {notices.map((notice) => (
          <div
            key={notice.id}
            className="p-3.5 hover:bg-slate-50/60 transition-colors space-y-2"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span
                  className={`px-1.5 py-0.2 rounded-xs text-[10px] font-bold border ${
                    notice.priority === "HIGH" || notice.priority === "URGENT"
                      ? "bg-red-50 text-red-800 border-red-300"
                      : "bg-slate-100 text-slate-800 border-slate-300"
                  }`}
                >
                  {notice.priority}
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-xs bg-slate-100 border border-slate-300 text-slate-700">
                  Scope: {notice.targetScope}
                </span>
              </div>
              <span className="text-xs text-slate-500 font-mono">
                {formatDate(notice.publishedAt)}
              </span>
            </div>

            <h3 className="text-sm font-bold text-slate-900 leading-snug">{notice.title}</h3>
            <p className="text-xs text-slate-600 leading-relaxed">{notice.content}</p>

            <div className="pt-1.5 border-t border-slate-100 flex items-center gap-1.5 text-[11px] text-slate-500">
              <ShieldCheck className="w-3.5 h-3.5 text-slate-600" />
              <span>Issued by {notice.author.name} (Registrar / Dean Office)</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
