"use client";

import { useState } from "react";
import { ShieldCheck, AlertTriangle, CheckCircle2, Loader2 } from "lucide-react";
import { toast } from "@/components/ui/Toast";

interface TimetableItem {
  id: string;
  title: string;
  status: string;
  hasConflicts: boolean;
  conflictNotes: string | null;
  sectionName: string;
  programName: string;
  periods: any[];
}

interface HODApprovalsClientProps {
  timetables: TimetableItem[];
}

export default function HODApprovalsClient({
  timetables,
}: HODApprovalsClientProps) {
  const [selectedTimetable, setSelectedTimetable] = useState<TimetableItem | null>(
    timetables[0] || null
  );
  const [approving, setApproving] = useState(false);
  const [inspectingConflicts, setInspectingConflicts] = useState(false);
  const [conflicts, setConflicts] = useState<any[]>([]);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  const handleInspectConflicts = async () => {
    if (!selectedTimetable) return;
    setInspectingConflicts(true);
    setConflicts([]);
    try {
      const periodsPayload = selectedTimetable.periods.map((p) => ({
        subjectId: p.subjectId,
        facultyId: p.facultyId,
        roomId: p.roomId,
        sectionId: p.sectionId,
        dayOfWeek: p.dayOfWeek,
        periodNumber: p.periodNumber,
        startTime: p.startTime,
        endTime: p.endTime,
      }));

      const res = await fetch("/api/timetable/conflicts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          periods: periodsPayload,
          ignoreTimetableId: selectedTimetable.id,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setConflicts(data.conflicts || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setInspectingConflicts(false);
    }
  };

  const handleApproveOrPublish = async (action: "APPROVE" | "PUBLISH") => {
    if (!selectedTimetable) return;
    setApproving(true);
    setActionSuccess(null);
    try {
      const res = await fetch("/api/timetable/approve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          timetableId: selectedTimetable.id,
          action,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setActionSuccess(
          `Timetable successfully ${action === "PUBLISH" ? "Published" : "Approved"}! Synchronized across all Student, Teacher, and Room schedules.`
        );
        setTimeout(() => {
          window.location.reload();
        }, 1200);
      } else {
        toast.error(data.message || "Approval failed.");
      }
    } catch (err) {
      toast.error("Network error approving timetable.");
    } finally {
      setApproving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <span className="text-xs font-bold text-purple-600 uppercase tracking-wider">
          HOD Academic Governance Desk
        </span>
        <h1 className="text-2xl font-extrabold text-slate-900 mt-1">
          Timetable Review & Approval Portal
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Verify conflict detection, enforce room and faculty constraints, and authorize official publication
        </p>
      </div>

      {actionSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{actionSuccess}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: List of Timetables */}
        <div className="lg:col-span-4 space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700">
            Department Schedules ({timetables.length})
          </h2>

          {timetables.map((tt) => {
            const isSelected = selectedTimetable?.id === tt.id;
            return (
              <button
                key={tt.id}
                type="button"
                onClick={() => {
                  setSelectedTimetable(tt);
                  setConflicts([]);
                  setActionSuccess(null);
                }}
                className={`w-full text-left p-4 rounded-xl border transition ${
                  isSelected
                    ? "bg-purple-50/80 border-purple-400 shadow-xs ring-1 ring-purple-400"
                    : "bg-white border-slate-200 hover:bg-slate-50"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900">{tt.sectionName}</span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      tt.status === "PUBLISHED"
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        : tt.status === "APPROVED"
                        ? "bg-blue-50 text-blue-700 border border-blue-200"
                        : "bg-amber-50 text-amber-700 border border-amber-200"
                    }`}
                  >
                    {tt.status}
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-1 font-medium">{tt.title}</p>
                <p className="text-[11px] text-slate-400 mt-1">
                  {tt.periods.length} Periods • {tt.programName}
                </p>
              </button>
            );
          })}
        </div>

        {/* Right Column: Timetable Detail, Conflict Detection & Approval Action */}
        <div className="lg:col-span-8 bg-white rounded-2xl shadow-xs border border-slate-200 p-6 space-y-5">
          {selectedTimetable ? (
            <>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-slate-900">
                      {selectedTimetable.title}
                    </h3>
                    <span className="text-xs font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                      {selectedTimetable.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Section: {selectedTimetable.sectionName} • Program: {selectedTimetable.programName}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleInspectConflicts}
                    disabled={inspectingConflicts}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition"
                  >
                    {inspectingConflicts ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                    )}
                    Run Conflict Engine
                  </button>

                  {selectedTimetable.status !== "PUBLISHED" && (
                    <button
                      type="button"
                      onClick={() => handleApproveOrPublish("PUBLISH")}
                      disabled={approving}
                      className="px-4 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-sm transition disabled:opacity-50"
                    >
                      {approving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <ShieldCheck className="w-3.5 h-3.5" />}
                      Authorize & Publish Timetable
                    </button>
                  )}
                </div>
              </div>

              {/* Conflict Detection Results Banner */}
              {conflicts.length > 0 ? (
                <div className="p-4 bg-red-50 border border-red-200 rounded-xl space-y-2">
                  <div className="flex items-center gap-2 text-red-800 font-bold text-xs">
                    <AlertTriangle className="w-4 h-4 text-red-600" />
                    <span>{conflicts.length} Conflict(s) Detected by Timetable Engine</span>
                  </div>
                  <div className="space-y-1 text-xs text-red-700 pl-6">
                    {conflicts.map((c, i) => (
                      <p key={i}>• {c.description}</p>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>
                    Conflict Inspector: Clean. Zero teacher, room, section, or capacity collisions.
                  </span>
                </div>
              )}

              {/* Scheduled Periods Table */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase text-slate-700 tracking-wider">
                  Configured Periods ({selectedTimetable.periods.length})
                </h4>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-200 bg-slate-50 text-[10px] font-bold uppercase text-slate-500">
                        <th className="p-2.5">Day</th>
                        <th className="p-2.5">Period</th>
                        <th className="p-2.5">Time</th>
                        <th className="p-2.5">Subject</th>
                        <th className="p-2.5">Faculty</th>
                        <th className="p-2.5">Room</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {selectedTimetable.periods.map((p) => (
                        <tr key={p.id} className="hover:bg-slate-50/50">
                          <td className="p-2.5 font-bold text-slate-800">{p.dayOfWeek}</td>
                          <td className="p-2.5 text-slate-600">Period {p.periodNumber}</td>
                          <td className="p-2.5 font-mono text-slate-500">{p.startTime} - {p.endTime}</td>
                          <td className="p-2.5 font-semibold text-slate-900">{p.subject.code}: {p.subject.name}</td>
                          <td className="p-2.5 text-slate-700">{p.faculty.user.name}</td>
                          <td className="p-2.5 font-mono text-blue-700">{p.room.roomNumber}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          ) : (
            <div className="p-12 text-center text-slate-400 text-xs">
              No timetables available for review.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
