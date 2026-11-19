import React from "react";
import { JLU_PROFILE } from "@/lib/jlu-constants";

export interface DashboardHeaderProps {
  badge: string;
  title: string;
  subtitle?: React.ReactNode;
  userMeta?: React.ReactNode;
  academicYear?: string;
  actions?: React.ReactNode;
  accent?: "crimson" | "burgundy" | "amber" | "indigo" | "navy";
  className?: string;
}

export default function DashboardHeader({
  badge,
  title,
  subtitle,
  userMeta,
  academicYear = `AY ${JLU_PROFILE.currentAcademicYear}`,
  actions,
  accent = "burgundy",
  className = "",
}: DashboardHeaderProps) {
  // Institutional accent bar mapping
  const borderAccentColor =
    accent === "amber"
      ? "border-l-[#B7791F]"
      : accent === "indigo"
      ? "border-l-[#3567A5]"
      : accent === "navy"
      ? "border-l-[#202435]"
      : "border-l-[#861F41]"; // Burgundy primary

  return (
    <div
      className={`relative overflow-hidden rounded-xl bg-white border border-[#E5E7EB] ${borderAccentColor} border-l-4 p-5 sm:p-7 shadow-xs text-[#202435] ${className}`}
    >
      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="space-y-1.5 max-w-3xl">
          {/* Metadata & Academic Tag line */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-[#F9EEF2] text-[#861F41] border border-[#F4D3DE]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#861F41]" />
              {badge}
            </span>
            <span className="text-xs text-[#9299A8] font-medium">{academicYear}</span>
            {userMeta && (
              <>
                <span className="text-[#D8DBE2]">•</span>
                <span className="text-xs text-[#697386] font-medium">{userMeta}</span>
              </>
            )}
          </div>

          {/* Heading */}
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#202435]">
            {title}
          </h1>

          {/* Subtitle */}
          {subtitle && (
            <p className="text-xs sm:text-sm text-[#697386] leading-relaxed pt-0.5">
              {subtitle}
            </p>
          )}
        </div>

        {/* Action Controls */}
        {actions && (
          <div className="flex flex-wrap items-center gap-2.5 shrink-0 self-start md:self-auto">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
}
