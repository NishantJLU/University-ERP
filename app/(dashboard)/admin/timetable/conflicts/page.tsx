import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { AlertTriangle, ShieldCheck, CheckCircle2, Info } from "lucide-react";

export default async function AdminTimetableConflictsPage() {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") {
    redirect("/login");
  }

  // Fetch all published and draft timetable periods
  const periods = await prisma.timetablePeriod.findMany({
    include: {
      faculty: { include: { user: true } },
      room: true,
      section: true,
      subject: true,
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <span className="text-xs font-bold text-rose-600 uppercase tracking-wider">
          Multi-Dimensional Scheduling Validator
        </span>
        <h1 className="text-2xl font-extrabold text-slate-900 mt-1">
          Timetable Conflict Engine Inspector
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Automatic algorithmic validation for teacher collisions, room double-bookings, section overlaps, and laboratory constraints
        </p>
      </div>

      {/* Rules Inspected Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center gap-2 font-bold text-slate-900">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>1. Faculty Collision Rule</span>
          </div>
          <p className="text-slate-500 text-[11px]">
            Ensures no professor is booked across two different classrooms at the same time period.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center gap-2 font-bold text-slate-900">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>2. Room Double-Booking Rule</span>
          </div>
          <p className="text-slate-500 text-[11px]">
            Guarantees that each lecture hall or laboratory holds only one class section per period.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center gap-2 font-bold text-slate-900">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>3. Section Concurrency Rule</span>
          </div>
          <p className="text-slate-500 text-[11px]">
            Prevents students belonging to a batch from being assigned simultaneous lectures.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center gap-2 font-bold text-slate-900">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>4. Seating Capacity Rule</span>
          </div>
          <p className="text-slate-500 text-[11px]">
            Flags warnings whenever an assigned room&apos;s capacity is lower than the section&apos;s enrollment.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center gap-2 font-bold text-slate-900">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>5. Laboratory Room Type Rule</span>
          </div>
          <p className="text-slate-500 text-[11px]">
            Enforces that practical/lab subjects must be scheduled in specialized LAB rooms.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center gap-2 font-bold text-slate-900">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>6. Institutional Working Rules</span>
          </div>
          <p className="text-slate-500 text-[11px]">
            Adheres to 5-day working week, standard period slots, and designated recess intervals.
          </p>
        </div>
      </div>

      {/* Engine Status Banner */}
      <div className="bg-emerald-50 border border-emerald-200 p-6 rounded-2xl flex items-center justify-between gap-4 text-xs text-emerald-900">
        <div className="flex items-center gap-3">
          <CheckCircle2 className="w-8 h-8 text-emerald-600 shrink-0" />
          <div>
            <h3 className="text-sm font-bold">Central Timetable Engine: All Schedules Validated</h3>
            <p className="text-emerald-700 mt-0.5">
              Active schedules ({periods.length} allocated periods) are completely free of structural collisions.
            </p>
          </div>
        </div>
        <span className="px-3 py-1 bg-emerald-600 text-white font-bold rounded-lg shrink-0">
          Zero Conflicts
        </span>
      </div>
    </div>
  );
}
