import React from "react";
import { CheckCircle2, AlertTriangle } from "lucide-react";

export type DepartmentHealthStatus =
  | "CONFIGURED"
  | "NEEDS_FACULTY"
  | "NEEDS_PROGRAM"
  | "NEEDS_SETUP";

export function getDepartmentHealthStatus(
  facultyCount: number,
  programsCount: number
): DepartmentHealthStatus {
  if (facultyCount === 0 && programsCount === 0) {
    return "NEEDS_SETUP";
  }
  if (facultyCount === 0) {
    return "NEEDS_FACULTY";
  }
  if (programsCount === 0) {
    return "NEEDS_PROGRAM";
  }
  return "CONFIGURED";
}

export function DepartmentHealthBadge({
  facultyCount,
  programsCount,
}: {
  facultyCount: number;
  programsCount: number;
}) {
  const status = getDepartmentHealthStatus(facultyCount, programsCount);

  if (status === "CONFIGURED") {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
        <span>Configured</span>
      </span>
    );
  }

  if (status === "NEEDS_SETUP") {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-300">
        <AlertTriangle className="w-3 h-3 text-amber-600" />
        <span>Needs Setup</span>
      </span>
    );
  }

  if (status === "NEEDS_FACULTY") {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-300">
        <AlertTriangle className="w-3 h-3 text-amber-600" />
        <span>Needs Faculty Setup</span>
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-300">
      <AlertTriangle className="w-3 h-3 text-amber-600" />
      <span>Needs Program Setup</span>
    </span>
  );
}
