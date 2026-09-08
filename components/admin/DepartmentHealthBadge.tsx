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
      <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-800">
        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
        <span>Configured</span>
      </span>
    );
  }

  if (status === "NEEDS_SETUP") {
    return (
      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-800 bg-amber-50/80 px-2 py-0.5 rounded border border-amber-200/80">
        <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
        <span>Needs Setup</span>
      </span>
    );
  }

  if (status === "NEEDS_FACULTY") {
    return (
      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-800 bg-amber-50/80 px-2 py-0.5 rounded border border-amber-200/80">
        <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
        <span>Needs Faculty</span>
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-800 bg-amber-50/80 px-2 py-0.5 rounded border border-amber-200/80">
      <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
      <span>Needs Program</span>
    </span>
  );
}
