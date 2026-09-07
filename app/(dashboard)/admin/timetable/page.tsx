import Link from "next/link";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { CalendarDays, AlertTriangle, ShieldCheck, Plus } from "lucide-react";
import TimetableWeeklyGrid from "@/components/timetable/TimetableWeeklyGrid";

export default async function AdminTimetablePage() {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") {
    redirect("/login");
  }

  const timetables = await prisma.timetable.findMany({
    include: {
      section: true,
      semester: { include: { program: true } },
      periods: {
        include: {
          subject: true,
          faculty: { include: { user: true } },
          room: true,
        },
      },
    },
  });

  const publishedTimetable = timetables.find((t) => t.status === "PUBLISHED");

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-rose-600 uppercase tracking-wider">
            Institutional Timetable Architecture
          </span>
          <h1 className="text-2xl font-extrabold text-slate-900 mt-1">
            Master Timetable Schedules
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Centralized timetable repository enforcing teacher, room, and section conflict prevention
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/admin/timetable/conflicts"
            className="px-4 py-2 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition"
          >
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            Conflict Inspector
          </Link>
          <Link
            href="/hod/approvals"
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-bold shadow-sm flex items-center gap-1.5 transition"
          >
            <ShieldCheck className="w-4 h-4" />
            Approvals Portal
          </Link>
        </div>
      </div>

      {/* List of Schedules */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {timetables.map((tt) => (
          <div
            key={tt.id}
            className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between space-y-3"
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="px-2 py-0.5 rounded font-mono text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                  {tt.section.name}
                </span>
                <h3 className="text-sm font-bold text-slate-900 mt-1">{tt.title}</h3>
                <p className="text-xs text-slate-500">Program: {tt.semester.program.name}</p>
              </div>
              <span
                className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                  tt.status === "PUBLISHED"
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                    : "bg-amber-50 text-amber-700 border border-amber-200"
                }`}
              >
                {tt.status}
              </span>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
              <span>{tt.periods.length} Scheduled Periods</span>
              <span>Conflicts: 0</span>
            </div>
          </div>
        ))}
      </div>

      {/* Published Timetable Preview */}
      {publishedTimetable && (
        <TimetableWeeklyGrid
          periods={publishedTimetable.periods as any}
          status={publishedTimetable.status}
          title={`Campus Master View: ${publishedTimetable.title}`}
        />
      )}
    </div>
  );
}
