import React from "react";
import { JLU_PROFILE } from "@/lib/jlu-constants";

export interface DashboardHeaderProps {
  badge: string;
  title: string;
  subtitle?: React.ReactNode;
  userMeta?: React.ReactNode;
  academicYear?: string;
  actions?: React.ReactNode;
  accent?: "teal" | "gold" | "slate" | "crimson" | "burgundy" | "amber" | "indigo" | "navy";
  className?: string;
}

export default function DashboardHeader({
  badge,
  title,
  subtitle,
  userMeta,
  academicYear = `AY ${JLU_PROFILE.currentAcademicYear}`,
  actions,
  accent = "teal",
  className = "",
}: DashboardHeaderProps) {
  // Institutional accent bar mapping
  const borderAccentColor =
    accent === "gold" || accent === "amber"
      ? "border-l-[#F0C14B]"
      : accent === "slate" || accent === "navy"
      ? "border-l-[#21313C]"
      : "border-l-[#027EA1]"; // Official JLU Lake Teal

  return (
    <div
      className={`relative overflow-hidden rounded-xl bg-gradient-to-r from-[#FFFFFF] via-[#F5FAFC] to-[#EEF7FA] border border-[#DCEBF3] ${borderAccentColor} border-l-4 p-5 sm:p-7 shadow-xs text-[#21313C] ${className}`}
    >
      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="space-y-1.5 max-w-3xl">
          {/* Metadata & Academic Tag line */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-[#EAF5F8] text-[#027EA1] border border-[#BEE1EC]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#027EA1]" />
              {badge}
            </span>
            <span className="text-xs text-[#8D9BA8] font-medium">{academicYear}</span>
            {userMeta && (
              <>
                <span className="text-[#CBD5E1]">•</span>
                <span className="text-xs text-[#546574] font-medium">{userMeta}</span>
              </>
            )}
          </div>

          {/* Heading */}
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#21313C]">
            {title}
          </h1>

          {/* Subtitle */}
          {subtitle && (
            <p className="text-xs sm:text-sm text-[#546574] leading-relaxed pt-0.5">
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
