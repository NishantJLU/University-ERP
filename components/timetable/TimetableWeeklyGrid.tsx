"use client";

import React, { useState } from "react";
import { Clock, MapPin, User, AlertTriangle, Calendar, Layers } from "lucide-react";

interface PeriodSlot {
  id: string;
  dayOfWeek: string;
  periodNumber: number;
  startTime: string;
  endTime: string;
  subject: {
    code: string;
    name: string;
    type: string;
  };
  faculty: {
    user: {
      name: string;
    };
  };
  room: {
    roomNumber: string;
    building: string;
    roomType: string;
  };
  section?: {
    name: string;
  };
}

interface TimetableWeeklyGridProps {
  periods: PeriodSlot[];
  status?: string;
  conflicts?: any[];
  title?: string;
}

const DAYS = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY"];
const PERIOD_HEADERS = [
  { num: 1, time: "09:00 - 10:00" },
  { num: 2, time: "10:00 - 11:00" },
  { num: 3, time: "11:15 - 12:15" },
  { num: 4, time: "12:15 - 01:15" },
  { num: 5, time: "02:00 - 03:00" },
];

export default function TimetableWeeklyGrid({
  periods,
  status = "PUBLISHED",
  conflicts = [],
  title,
}: TimetableWeeklyGridProps) {
  // Mobile active day pill
  const [activeMobileDay, setActiveMobileDay] = useState("MONDAY");

  const mobileSlotsForDay = PERIOD_HEADERS.map((header) => {
    const slot = periods.find(
      (p) => p.dayOfWeek === activeMobileDay && p.periodNumber === header.num
    );
    return {
      header,
      slot,
    };
  });

  return (
    <div className="bg-white rounded-2xl shadow-xs border border-slate-200 overflow-hidden">
      {/* Header Bar */}
      <div className="px-6 py-4 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 bg-slate-50/50">
        <div>
          <h3 className="text-sm font-bold text-slate-900">
            {title || "Institutional Master Timetable"}
          </h3>
          <p className="text-xs text-slate-500">
            Centralized Synchronized University Schedule
          </p>
        </div>

        <div className="flex items-center gap-2">
          {conflicts.length > 0 && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
              {conflicts.length} Conflicts Detected
            </span>
          )}

          <span
            className={`px-3 py-1 rounded-full text-xs font-bold ${
              status === "PUBLISHED"
                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                : status === "APPROVED"
                ? "bg-blue-50 text-blue-700 border border-blue-200"
                : "bg-amber-50 text-amber-700 border border-amber-200"
            }`}
          >
            ● {status}
          </span>
        </div>
      </div>

      {/* Mobile Day Selector (<md viewports) */}
      <div className="md:hidden p-3 bg-slate-50 border-b border-slate-200">
        <div className="flex items-center justify-between gap-1 overflow-x-auto pb-1">
          {DAYS.map((day) => {
            const isSelected = activeMobileDay === day;
            const daySlotCount = periods.filter((p) => p.dayOfWeek === day).length;
            return (
              <button
                key={day}
                type="button"
                onClick={() => setActiveMobileDay(day)}
                className={`flex-1 min-w-[58px] py-2 px-1 rounded-xl text-center transition ${
                  isSelected
                    ? "bg-rose-600 text-white shadow-xs font-bold"
                    : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-100 font-medium"
                }`}
              >
                <span className="block text-xs uppercase">{day.slice(0, 3)}</span>
                <span className={`block text-[10px] ${isSelected ? "text-rose-200" : "text-slate-400"}`}>
                  {daySlotCount} cls
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Mobile Chronological Schedule (<md viewports) */}
      <div className="md:hidden p-4 space-y-3">
        <div className="flex items-center justify-between text-xs text-slate-500 font-semibold px-1">
          <span className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-rose-600" />
            {activeMobileDay} Schedule
          </span>
          <span>5 Teaching Periods</span>
        </div>

        <div className="space-y-2.5">
          {mobileSlotsForDay.map(({ header, slot }) => (
            <div
              key={header.num}
              className={`p-3.5 rounded-xl border transition ${
                slot
                  ? slot.subject.type === "LAB"
                    ? "bg-purple-50/70 border-purple-200 text-purple-950"
                    : "bg-blue-50/70 border-blue-200 text-blue-950"
                  : "bg-slate-50/60 border-slate-200/80 text-slate-400"
              }`}
            >
              <div className="flex items-center justify-between text-xs mb-1.5">
                <div className="flex items-center gap-1.5 font-bold font-mono">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>Period {header.num}</span>
                  <span className="text-[10px] text-slate-500 font-normal">({header.time})</span>
                </div>

                {slot && (
                  <span
                    className={`text-[9px] uppercase font-extrabold px-2 py-0.5 rounded-full ${
                      slot.subject.type === "LAB"
                        ? "bg-purple-200 text-purple-800"
                        : "bg-blue-200 text-blue-800"
                    }`}
                  >
                    {slot.subject.type}
                  </span>
                )}
              </div>

              {slot ? (
                <div className="space-y-2">
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">
                      {slot.subject.code}: {slot.subject.name}
                    </h4>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 pt-1 border-t border-slate-200/60">
                    <div className="flex items-center gap-1">
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      <span>{slot.faculty.user.name}</span>
                    </div>

                    <div className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>Room {slot.room.roomNumber}</span>
                    </div>

                    {slot.section && (
                      <span className="ml-auto font-mono text-[10px] bg-white px-2 py-0.5 rounded border border-slate-200 text-slate-700">
                        Batch {slot.section.name}
                      </span>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-xs text-slate-400 italic py-1">
                  No lecture scheduled (Free Academic Period)
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Desktop Grid Table (hidden on mobile <md) */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="bg-slate-100/75 border-b border-slate-200 text-[11px] font-bold uppercase text-slate-600">
              <th className="p-3 w-28 text-center">Day / Time</th>
              {PERIOD_HEADERS.map((h) => (
                <th key={h.num} className="p-3 min-w-[170px]">
                  <div className="font-bold text-slate-800">Period {h.num}</div>
                  <div className="text-[10px] text-slate-500 font-mono font-normal">
                    {h.time}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs">
            {DAYS.map((day) => (
              <tr key={day} className="hover:bg-slate-50/50 transition">
                <td className="p-3 font-bold text-slate-700 text-center bg-slate-50 border-r border-slate-200">
                  <span className="block text-xs">{day.slice(0, 3)}</span>
                  <span className="text-[10px] font-normal text-slate-400">
                    {day.toLowerCase()}
                  </span>
                </td>

                {PERIOD_HEADERS.map((header) => {
                  const slot = periods.find(
                    (p) => p.dayOfWeek === day && p.periodNumber === header.num
                  );

                  return (
                    <td
                      key={header.num}
                      className="p-2.5 align-top border-r border-slate-100 last:border-r-0"
                    >
                      {slot ? (
                        <div
                          className={`p-2.5 rounded-xl border transition-all hover:shadow-sm ${
                            slot.subject.type === "LAB"
                              ? "bg-purple-50/60 border-purple-200 text-purple-950"
                              : "bg-blue-50/50 border-blue-200 text-blue-950"
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-bold text-xs">
                              {slot.subject.code}
                            </span>
                            <span
                              className={`text-[9px] uppercase font-bold px-1.5 py-0.2 rounded ${
                                slot.subject.type === "LAB"
                                  ? "bg-purple-200/80 text-purple-800"
                                  : "bg-blue-200/80 text-blue-800"
                              }`}
                            >
                              {slot.subject.type}
                            </span>
                          </div>

                          <div className="font-medium text-[11px] leading-snug line-clamp-2 mb-1.5 text-slate-800">
                            {slot.subject.name}
                          </div>

                          <div className="space-y-1 text-[10px] text-slate-500">
                            <div className="flex items-center gap-1 truncate">
                              <User className="w-3 h-3 text-slate-400 shrink-0" />
                              <span className="truncate">{slot.faculty.user.name}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                              <span>{slot.room.roomNumber}</span>
                              {slot.section && (
                                <span className="ml-auto font-mono text-[9px] bg-white px-1 rounded border border-slate-200">
                                  {slot.section.name}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="h-20 rounded-xl border border-dashed border-slate-200/80 flex items-center justify-center text-slate-300 text-[11px]">
                          Free Slot
                        </div>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
