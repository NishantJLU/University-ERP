import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Bell, ShieldCheck } from "lucide-react";
import { formatDate } from "@/lib/utils";

export default async function TeacherNoticesPage() {
  const user = await getCurrentUser();
  if (!user || user.role !== "TEACHER") {
    redirect("/login");
  }

  const notices = await prisma.notice.findMany({
    include: { author: true },
    orderBy: { publishedAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
          Faculty Circulars
        </span>
        <h1 className="text-2xl font-extrabold text-slate-900 mt-1">
          Academic Notices & Bulletins
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Official communications from University Administration, Registrar, and Dean of Academics
        </p>
      </div>

      <div className="space-y-4">
        {notices.map((notice) => (
          <div
            key={notice.id}
            className="bg-white rounded-2xl shadow-xs border border-slate-200 p-6 space-y-3"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                    notice.priority === "HIGH" || notice.priority === "URGENT"
                      ? "bg-red-50 text-red-700 border border-red-200"
                      : "bg-blue-50 text-blue-700 border border-blue-200"
                  }`}
                >
                  {notice.priority}
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                  Target: {notice.targetScope}
                </span>
              </div>
              <span className="text-xs text-slate-400">
                {formatDate(notice.publishedAt)}
              </span>
            </div>

            <h3 className="text-base font-bold text-slate-900">{notice.title}</h3>
            <p className="text-xs text-slate-600 leading-relaxed">{notice.content}</p>

            <div className="pt-2 border-t border-slate-100 flex items-center gap-1.5 text-[11px] text-slate-500">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
              <span>Published by {notice.author.name}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
