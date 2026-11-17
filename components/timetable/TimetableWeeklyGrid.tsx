"use client";

import React, { useState } from "react";
import {
  Clock,
  MapPin,
  User,
  AlertTriangle,
  Calendar,
  Download,
  Printer,
  ChevronLeft,
  ChevronRight,
  Info,
  Layers,
  Sparkles,
  LayoutGrid,
  List,
} from "lucide-react";
import { formatEnum } from "@/lib/utils";

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

const DAYS_META = [
  { key: "MONDAY", label: "Mon", date: "05 Oct" },
  { key: "TUESDAY", label: "Tue", date: "06 Oct" },
  { key: "WEDNESDAY", label: "Wed", date: "07 Oct" },
  { key: "THURSDAY", label: "Thu", date: "08 Oct" },
  { key: "FRIDAY", label: "Fri", date: "09 Oct", isToday: true },
];

const PERIOD_COLUMNS = [
  { type: "period", num: 1, label: "Period 1", time: "09:00 AM – 10:00 AM" },
  { type: "period", num: 2, label: "Period 2", time: "10:00 AM – 11:00 AM" },
  { type: "break", label: "Morning Recess", time: "11:00 AM – 11:15 AM", short: "Tea Break" },
  { type: "period", num: 3, label: "Period 3", time: "11:15 AM – 12:15 PM" },
  { type: "period", num: 4, label: "Period 4", time: "12:15 PM – 01:15 PM", isCurrentTime: true },
  { type: "break", label: "Lunch Recess", time: "01:15 PM – 02:00 PM", short: "Lunch Break" },
  { type: "period", num: 5, label: "Period 5", time: "02:00 PM – 03:00 PM" },
];

export default function TimetableWeeklyGrid({
  periods,
  status = "PUBLISHED",
  conflicts = [],
  title,
}: TimetableWeeklyGridProps) {
  const [activeMobileDay, setActiveMobileDay] = useState("FRIDAY");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [weekOffset, setWeekOffset] = useState(0);

  // Download .ics format calendar file for students
  const handleExportICS = () => {
    let ics = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Jagran Lakecity University//ERP Timetable//EN",
      "CALSCALE:GREGORIAN",
      "METHOD:PUBLISH",
    ];

    periods.forEach((p, idx) => {
      ics.push("BEGIN:VEVENT");
      ics.push(`UID:jlu-period-${p.id || idx}@jlu.edu.in`);
      ics.push(`SUMMARY:${p.subject.code}: ${p.subject.name}`);
      ics.push(
        `DESCRIPTION:Instructor: ${p.faculty.user.name} | Type: ${p.subject.type} | Room: ${p.room.roomNumber}`
      );
      ics.push(`LOCATION:Room ${p.room.roomNumber}, ${p.room.building}`);
      ics.push(`DTSTART:20261009T${p.startTime.replace(":", "")}00`);
      ics.push(`DTEND:20261009T${p.endTime.replace(":", "")}00`);
      ics.push("END:VEVENT");
    });

    ics.push("END:VCALENDAR");

    const blob = new Blob([ics.join("\r\n")], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `jlu-class-schedule-week6.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-white rounded-sm border border-slate-300 overflow-hidden space-y-0">
      {/* Top Header Bar */}
      <div className="px-4 py-3 border-b border-slate-300 flex flex-wrap items-center justify-between gap-3 bg-slate-50">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              {title || "Class Timetable"}
            </h2>
            <div className="group relative cursor-pointer">
              <span
                className={`px-1.5 py-0.2 rounded-xs text-[10px] font-bold border ${
                  status === "PUBLISHED"
                    ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                    : "bg-blue-50 text-blue-800 border-blue-300"
                }`}
              >
                ● {status}
              </span>
              {/* Tooltip explaining what published means */}
              <div className="absolute left-0 bottom-full mb-1.5 hidden group-hover:block w-56 p-2 bg-slate-900 text-white text-[11px] rounded-lg shadow-lg z-50">
                Officially authorized by the Office of the Dean of Academics and locked for room allocations.
              </div>
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Last updated Oct 8, 4:30 PM
          </p>
        </div>

        {/* Action Controls: Week Switcher, View Mode & Export */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          {/* Week Navigation */}
          <div className="flex items-center bg-white border border-slate-200 rounded-lg shadow-2xs p-0.5">
            <button
              type="button"
              onClick={() => setWeekOffset((prev) => prev - 1)}
              className="p-1 hover:bg-slate-100 rounded text-slate-500 hover:text-slate-900 transition"
              title="Previous Week"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-2 font-semibold text-slate-700">
              Week {6 + weekOffset} (Oct 05 – Oct 09, 2026)
            </span>
            <button
              type="button"
              onClick={() => setWeekOffset((prev) => prev + 1)}
              className="p-1 hover:bg-slate-100 rounded text-slate-500 hover:text-slate-900 transition"
              title="Next Week"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* View Toggle */}
          <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200">
            <button
              type="button"
              onClick={() => setViewMode("grid")}
              className={`p-1.5 rounded-md flex items-center gap-1 transition ${
                viewMode === "grid"
                  ? "bg-white text-slate-900 font-bold shadow-2xs"
                  : "text-slate-500 hover:text-slate-800"
              }`}
              title="Grid View"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Grid</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode("list")}
              className={`p-1.5 rounded-md flex items-center gap-1 transition ${
                viewMode === "list"
                  ? "bg-white text-slate-900 font-bold shadow-2xs"
                  : "text-slate-500 hover:text-slate-800"
              }`}
              title="List View"
            >
              <List className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">List</span>
            </button>
          </div>

          {/* Export to Calendar */}
          <button
            type="button"
            onClick={handleExportICS}
            className="px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-700 rounded-lg font-semibold border border-slate-200 shadow-2xs flex items-center gap-1.5 transition"
            title="Export calendar (.ics) for Google Calendar / Apple Calendar"
          >
            <Download className="w-3.5 h-3.5 text-blue-600" />
            <span>Add to Calendar (.ics)</span>
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-semibold shadow-2xs flex items-center gap-1.5 transition"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print</span>
          </button>
        </div>
      </div>

      {/* Mobile Day Selector (for small screens or list mode) */}
      <div className="p-3 bg-slate-50 border-b border-slate-200">
        <div className="flex items-center justify-between gap-1 overflow-x-auto pb-1">
          {DAYS_META.map((day) => {
            const isSelected = activeMobileDay === day.key;
            const daySlotCount = periods.filter((p) => p.dayOfWeek === day.key).length;

            return (
              <button
                key={day.key}
                type="button"
                onClick={() => setActiveMobileDay(day.key)}
                className={`flex-1 min-w-[70px] py-2 px-2 rounded-xl text-center transition ${
                  isSelected
                    ? "bg-blue-600 text-white shadow-xs font-bold"
                    : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-100 font-medium"
                }`}
              >
                <div className="flex items-center justify-center gap-1">
                  <span className="text-xs uppercase font-extrabold">{day.label}</span>
                  {day.isToday && (
                    <span
                      className={`text-[9px] px-1 rounded-sm font-bold ${
                        isSelected ? "bg-white/20 text-white" : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      Today
                    </span>
                  )}
                </div>
                <span className={`block text-[10px] mt-0.5 ${isSelected ? "text-blue-100" : "text-slate-400"}`}>
                  {day.date} • {daySlotCount} cls
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* List View Mode (Rendered if viewMode === "list" or on mobile) */}
      {viewMode === "list" && (
        <div className="p-4 sm:p-6 space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-slate-700 px-1">
            <span>
              {DAYS_META.find((d) => d.key === activeMobileDay)?.label},{" "}
              {DAYS_META.find((d) => d.key === activeMobileDay)?.date} Schedule
            </span>
            <span className="text-slate-400">5 Teaching Periods • 2 Recesses</span>
          </div>

          <div className="space-y-3">
            {PERIOD_COLUMNS.map((col, idx) => {
              if (col.type === "break") {
                return (
                  <div
                    key={idx}
                    className="p-2.5 rounded-xl bg-slate-50 border border-dashed border-slate-300 text-center text-xs text-slate-500 font-medium flex items-center justify-center gap-2"
                  >
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{col.label} ({col.time})</span>
                  </div>
                );
              }

              const slot = periods.find(
                (p) => p.dayOfWeek === activeMobileDay && p.periodNumber === col.num
              );

              return (
                <div
                  key={idx}
                  className={`p-4 rounded-xl border transition ${
                    slot
                      ? slot.subject.type === "LAB"
                        ? "bg-purple-50/50 border-purple-200"
                        : "bg-blue-50/40 border-blue-200"
                      : "bg-white border-slate-200 text-slate-400"
                  }`}
                >
                  <div className="flex items-center justify-between text-xs mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900">Period {col.num}</span>
                      <span className="text-[11px] text-slate-500 font-mono">({col.time})</span>
                      {col.isCurrentTime && activeMobileDay === "FRIDAY" && (
                        <span className="px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-blue-600 text-white animate-pulse">
                          Now / Next
                        </span>
                      )}
                    </div>

                    {slot && (
                      <span
                        className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                          slot.subject.type === "LAB"
                            ? "bg-purple-100 text-purple-800 border border-purple-200"
                            : "bg-blue-100 text-blue-800 border border-blue-200"
                        }`}
                      >
                        {formatEnum(slot.subject.type)}
                      </span>
                    )}
                  </div>

                  {slot ? (
                    <div className="space-y-1.5">
                      <h4 className="font-extrabold text-slate-900 text-sm">
                        {slot.subject.code}: {slot.subject.name}
                      </h4>
                      <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 pt-1">
                        <span className="flex items-center gap-1">
                          <User className="w-3.5 h-3.5 text-slate-400" />
                          {slot.faculty.user.name}
                        </span>
                        <span className="flex items-center gap-1 font-mono">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          Room {slot.room.roomNumber} ({slot.room.building})
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="text-xs text-slate-400 italic py-1 flex items-center gap-1">
                      <span>– Free Period (No lecture scheduled)</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Desktop Equal-Width Timetable Grid Table */}
      {viewMode === "grid" && (
        <div className="overflow-x-auto">
          <table className="table-fixed w-full border-collapse text-left min-w-[900px]">
            <thead>
              <tr className="bg-slate-100/80 border-b border-slate-200 text-[11px] font-bold uppercase text-slate-700">
                {/* Day column */}
                <th className="p-3 w-[110px] text-center border-r border-slate-200">
                  Day
                </th>

                {/* Period 1 */}
                <th className="p-3 w-[160px] border-r border-slate-200">
                  <div className="font-bold text-slate-900">Period 1</div>
                  <div className="text-[10px] text-slate-500 font-normal">09:00 AM – 10:00 AM</div>
                </th>

                {/* Period 2 */}
                <th className="p-3 w-[160px] border-r border-slate-200">
                  <div className="font-bold text-slate-900">Period 2</div>
                  <div className="text-[10px] text-slate-500 font-normal">10:00 AM – 11:00 AM</div>
                </th>

                {/* Morning Break Column */}
                <th className="p-2 w-[55px] bg-amber-50/40 border-r border-slate-200 text-center">
                  <div className="text-[9px] text-amber-800 font-extrabold rotate-0 leading-tight">
                    Recess
                  </div>
                  <div className="text-[8px] text-amber-600 font-mono">11:00 AM</div>
                </th>

                {/* Period 3 */}
                <th className="p-3 w-[160px] border-r border-slate-200">
                  <div className="font-bold text-slate-900">Period 3</div>
                  <div className="text-[10px] text-slate-500 font-normal">11:15 AM – 12:15 PM</div>
                </th>

                {/* Period 4 */}
                <th className="p-3 w-[160px] border-r border-slate-200">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">Period 4</span>
                    <span className="text-[8px] px-1 py-0.2 rounded font-bold bg-blue-600 text-white">
                      Now / Next
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-500 font-normal">12:15 PM – 01:15 PM</div>
                </th>

                {/* Lunch Break Column */}
                <th className="p-2 w-[55px] bg-amber-50/40 border-r border-slate-200 text-center">
                  <div className="text-[9px] text-amber-800 font-extrabold rotate-0 leading-tight">
                    Lunch
                  </div>
                  <div className="text-[8px] text-amber-600 font-mono">01:15 PM</div>
                </th>

                {/* Period 5 */}
                <th className="p-3 w-[160px]">
                  <div className="font-bold text-slate-900">Period 5</div>
                  <div className="text-[10px] text-slate-500 font-normal">02:00 PM – 03:00 PM</div>
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 text-xs">
              {DAYS_META.map((day) => {
                const isToday = day.isToday;

                return (
                  <tr
                    key={day.key}
                    className={`transition ${
                      isToday
                        ? "bg-blue-50/30 hover:bg-blue-50/50"
                        : "hover:bg-slate-50/60"
                    }`}
                  >
                    {/* Day Label Cell with Single Clean Date */}
                    <td
                      className={`p-3 text-center border-r border-slate-200 ${
                        isToday ? "bg-blue-100/50" : "bg-slate-50"
                      }`}
                    >
                      <div className="font-extrabold text-slate-900 text-sm">
                        {day.label}
                      </div>
                      <div className="text-[10px] text-slate-500 font-medium">
                        {day.date}
                      </div>
                      {isToday && (
                        <span className="inline-block mt-1 px-1.5 py-0.2 rounded text-[9px] font-extrabold bg-blue-600 text-white">
                          Today
                        </span>
                      )}
                    </td>

                    {/* Period 1 */}
                    <td className="p-2 align-top border-r border-slate-100">
                      {renderSlot(periods, day.key, 1)}
                    </td>

                    {/* Period 2 */}
                    <td className="p-2 align-top border-r border-slate-100">
                      {renderSlot(periods, day.key, 2)}
                    </td>

                    {/* Morning Break Column Body */}
                    <td className="p-1 bg-amber-50/20 border-r border-slate-100 text-center align-middle">
                      <span className="text-[10px] font-mono text-amber-500 writing-mode-vertical">
                        –
                      </span>
                    </td>

                    {/* Period 3 */}
                    <td className="p-2 align-top border-r border-slate-100">
                      {renderSlot(periods, day.key, 3)}
                    </td>

                    {/* Period 4 */}
                    <td className="p-2 align-top border-r border-slate-100">
                      {renderSlot(periods, day.key, 4)}
                    </td>

                    {/* Lunch Break Column Body */}
                    <td className="p-1 bg-amber-50/20 border-r border-slate-100 text-center align-middle">
                      <span className="text-[10px] font-mono text-amber-500 writing-mode-vertical">
                        –
                      </span>
                    </td>

                    {/* Period 5 */}
                    <td className="p-2 align-top">
                      {renderSlot(periods, day.key, 5)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function renderSlot(periods: PeriodSlot[], day: string, periodNum: number) {
  const slot = periods.find(
    (p) => p.dayOfWeek === day && p.periodNumber === periodNum
  );

  if (!slot) {
    return (
      <div className="h-24 rounded-xl border border-dashed border-slate-200 flex items-center justify-center text-slate-300 text-xs">
        –
      </div>
    );
  }

  const isLab = slot.subject.type === "LAB";

  return (
    <div
      className={`h-24 p-2.5 rounded-xl border flex flex-col justify-between transition hover:shadow-xs ${
        isLab
          ? "bg-purple-50/70 border-purple-200 text-purple-950"
          : "bg-blue-50/60 border-blue-200 text-blue-950"
      }`}
    >
      <div>
        <div className="flex items-center justify-between mb-0.5">
          <span className="font-extrabold text-xs text-slate-900">
            {slot.subject.code}
          </span>
          <span
            className={`text-[9px] uppercase font-bold px-1.5 py-0.2 rounded ${
              isLab
                ? "bg-purple-200/80 text-purple-800"
                : "bg-blue-200/80 text-blue-800"
            }`}
          >
            {formatEnum(slot.subject.type)}
          </span>
        </div>
        <p className="font-semibold text-[11px] leading-tight line-clamp-2 text-slate-800">
          {slot.subject.name}
        </p>
      </div>

      <div className="space-y-0.5 text-[10px] text-slate-500 border-t border-slate-200/60 pt-1">
        <div className="flex items-center gap-1 truncate" title={slot.faculty.user.name}>
          <User className="w-3 h-3 text-slate-400 shrink-0" />
          <span className="truncate">{slot.faculty.user.name}</span>
        </div>
        <div className="flex items-center gap-1">
          <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
          <span>Room {slot.room.roomNumber}</span>
        </div>
      </div>
    </div>
  );
}
