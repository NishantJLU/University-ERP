"use client";

import React from "react";
import { Printer } from "lucide-react";

export default function PrintScheduleButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      title="Print academic timetable"
      className="px-4 py-2 bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 rounded-xl text-xs font-semibold flex items-center gap-2 shadow-2xs transition cursor-pointer print:hidden"
    >
      <Printer className="w-4 h-4 text-slate-500" />
      <span>Print Schedule</span>
    </button>
  );
}
