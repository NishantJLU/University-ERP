import Link from "next/link";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import {
  AlertTriangle,
  ShieldCheck,
  CheckCircle2,
  Info,
  CalendarDays,
  Users,
  Building,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { detectTimetableConflicts } from "@/lib/timetable-engine";

export default async function AdminTimetableConflictsPage() {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") {
    redirect("/login");
  }

  // Fetch all timetable periods
  const periods = await prisma.timetablePeriod.findMany({
    include: {
      faculty: { include: { user: true } },
      room: true,
      section: true,
      subject: true,
    },
  });

  const periodInputs = periods.map((p) => ({
    subjectId: p.subjectId,
    facultyId: p.facultyId,
    roomId: p.roomId,
    sectionId: p.sectionId,
    dayOfWeek: p.dayOfWeek,
    periodNumber: p.periodNumber,
    startTime: p.startTime,
    endTime: p.endTime,
  }));

  const conflicts = await detectTimetableConflicts(periodInputs);

  const facultyConflicts = conflicts.filter((c) => c.type === "TEACHER_CONFLICT");
  const roomConflicts = conflicts.filter((c) => c.type === "ROOM_CONFLICT");
  const sectionConflicts = conflicts.filter((c) => c.type === "SECTION_CONFLICT");
  const capacityConflicts = conflicts.filter((c) => c.type === "CAPACITY_CONFLICT");
  const labConflicts = conflicts.filter((c) => c.type === "LAB_REQUIREMENT_CONFLICT");

  const validSlotsCount = Math.max(0, periods.length - conflicts.length);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-rose-600 uppercase tracking-wider">
            Multi-Dimensional Scheduling Validator
          </span>
          <h1 className="text-2xl font-extrabold text-slate-900 mt-1">
            Timetable Health & Conflict Center
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            5D algorithmic validation: faculty collisions, room double-bookings, section concurrency, capacity, and lab requirements.
          </p>
        </div>

        <Link
          href="/admin/timetable"
          className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow-xs transition flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
        >
          <CalendarDays className="w-4 h-4" />
          <span>Manage Timetable</span>
        </Link>
      </div>

      {/* TIMETABLE HEALTH SCORECARD */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-slate-500 text-[10px] font-bold uppercase tracking-wider block">
            Valid Slots
          </span>
          <span className="text-xl font-black text-emerald-600 font-mono block">
            {validSlotsCount}
          </span>
          <span className="text-[10px] text-slate-400 block">Collision-free</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-slate-500 text-[10px] font-bold uppercase tracking-wider block">
            Faculty Conflicts
          </span>
          <span
            className={`text-xl font-black font-mono block ${
              facultyConflicts.length > 0 ? "text-rose-600" : "text-emerald-600"
            }`}
          >
            {facultyConflicts.length}
          </span>
          <span className="text-[10px] text-slate-400 block">Concurrent booking</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-slate-500 text-[10px] font-bold uppercase tracking-wider block">
            Room Conflicts
          </span>
          <span
            className={`text-xl font-black font-mono block ${
              roomConflicts.length > 0 ? "text-rose-600" : "text-emerald-600"
            }`}
          >
            {roomConflicts.length}
          </span>
          <span className="text-[10px] text-slate-400 block">Hall double-booking</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-slate-500 text-[10px] font-bold uppercase tracking-wider block">
            Section Overlaps
          </span>
          <span
            className={`text-xl font-black font-mono block ${
              sectionConflicts.length > 0 ? "text-rose-600" : "text-emerald-600"
            }`}
          >
            {sectionConflicts.length}
          </span>
          <span className="text-[10px] text-slate-400 block">Cohort concurrency</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-slate-500 text-[10px] font-bold uppercase tracking-wider block">
            Capacity Issues
          </span>
          <span
            className={`text-xl font-black font-mono block ${
              capacityConflicts.length > 0 ? "text-amber-600" : "text-emerald-600"
            }`}
          >
            {capacityConflicts.length}
          </span>
          <span className="text-[10px] text-slate-400 block">Room too small</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-slate-500 text-[10px] font-bold uppercase tracking-wider block">
            Lab Mismatches
          </span>
          <span
            className={`text-xl font-black font-mono block ${
              labConflicts.length > 0 ? "text-rose-600" : "text-emerald-600"
            }`}
          >
            {labConflicts.length}
          </span>
          <span className="text-[10px] text-slate-400 block">Equipment mismatch</span>
        </div>
      </div>

      {/* Engine Status Banner */}
      {conflicts.length === 0 ? (
        <div className="bg-emerald-50 border border-emerald-200 p-6 rounded-2xl flex items-center justify-between gap-4 text-xs text-emerald-900">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-8 h-8 text-emerald-600 shrink-0" />
            <div>
              <h3 className="text-sm font-bold">Central Timetable Engine: All Schedules 100% Conflict-Free</h3>
              <p className="text-emerald-700 mt-0.5">
                All {periods.length} allocated periods across all university programs satisfy faculty availability, room capacity, section concurrency, and laboratory facility rules.
              </p>
            </div>
          </div>
          <span className="px-3 py-1 bg-emerald-600 text-white font-bold rounded-lg shrink-0">
            Zero Conflicts Detected
          </span>
        </div>
      ) : (
        <div className="bg-rose-50 border border-rose-200 p-6 rounded-2xl flex items-center justify-between gap-4 text-xs text-rose-900">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-8 h-8 text-rose-600 shrink-0" />
            <div>
              <h3 className="text-sm font-bold">{conflicts.length} Scheduling Conflicts Require Attention</h3>
              <p className="text-rose-700 mt-0.5">
                Review the items below and modify room or period allocations in the Timetable Master.
              </p>
            </div>
          </div>
          <Link
            href="/admin/timetable"
            className="px-3 py-1.5 bg-rose-600 text-white font-bold rounded-lg shrink-0 hover:bg-rose-700 transition"
          >
            Fix in Timetable
          </Link>
        </div>
      )}

      {/* DETAILED CONFLICTS BREAKDOWN TABLE (If any) */}
      {conflicts.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-100 font-bold text-slate-900 text-sm">
            Conflict Diagnostics ({conflicts.length})
          </div>
          <div className="divide-y divide-slate-100 text-xs">
            {conflicts.map((conf, idx) => (
              <div key={idx} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/80">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono ${
                        conf.severity === "ERROR"
                          ? "bg-rose-100 text-rose-800 border border-rose-200"
                          : "bg-amber-100 text-amber-800 border border-amber-200"
                      }`}
                    >
                      {conf.type}
                    </span>
                    <span className="font-bold text-slate-900">
                      {conf.dayOfWeek} • Period {conf.periodNumber} ({conf.timeSlot})
                    </span>
                  </div>
                  <p className="text-slate-600">{conf.description}</p>
                  <p className="text-[11px] text-slate-400 font-mono">
                    Entity: {conf.involvedEntity}
                  </p>
                </div>
                <Link
                  href="/admin/timetable"
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition shrink-0 self-start sm:self-auto"
                >
                  Edit Slot
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Rules Inspected Cards */}
      <div className="bg-slate-50/80 border border-slate-200 rounded-2xl p-5 space-y-3">
        <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
          5D Conflict Engine Verification Rules
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
          <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-xs space-y-1">
            <div className="flex items-center gap-2 font-bold text-slate-900">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>1. Faculty Collision Rule</span>
            </div>
            <p className="text-slate-500 text-[11px]">
              Ensures no professor is booked across two different classrooms at the same time period.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-xs space-y-1">
            <div className="flex items-center gap-2 font-bold text-slate-900">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>2. Room Double-Booking Rule</span>
            </div>
            <p className="text-slate-500 text-[11px]">
              Guarantees that each lecture hall or laboratory holds only one class section per period.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-xs space-y-1">
            <div className="flex items-center gap-2 font-bold text-slate-900">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>3. Section Concurrency Rule</span>
            </div>
            <p className="text-slate-500 text-[11px]">
              Prevents students belonging to a batch from being assigned simultaneous lectures.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-xs space-y-1">
            <div className="flex items-center gap-2 font-bold text-slate-900">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>4. Seating Capacity Rule</span>
            </div>
            <p className="text-slate-500 text-[11px]">
              Flags warnings whenever an assigned room&apos;s capacity is lower than the section&apos;s enrollment.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-xs space-y-1">
            <div className="flex items-center gap-2 font-bold text-slate-900">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>5. Laboratory Room Type Rule</span>
            </div>
            <p className="text-slate-500 text-[11px]">
              Enforces that practical/lab subjects must be scheduled in specialized LAB rooms.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-xs space-y-1">
            <div className="flex items-center gap-2 font-bold text-slate-900">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>6. Institutional Working Rules</span>
            </div>
            <p className="text-slate-500 text-[11px]">
              Adheres to 5-day working week, standard period slots, and designated recess intervals.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
