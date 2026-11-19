import React from "react";
import Link from "next/link";
import { CheckCircle2, AlertTriangle, ShieldAlert } from "lucide-react";

export type AttentionStatus = "healthy" | "warning" | "critical";

export interface AttentionCardProps {
  title: string;
  value: number | string;
  statusText: string;
  status: AttentionStatus;
  href: string;
  badgeLabel?: string;
  actionLabel?: string;
  isDominant?: boolean;
}

export function AttentionCard({
  title,
  value,
  statusText,
  status,
  href,
  badgeLabel,
  actionLabel = "Review details",
  isDominant = false,
}: AttentionCardProps) {
  const getStatusConfig = () => {
    switch (status) {
      case "critical":
        return {
          wrapper: isDominant
            ? "border border-[#F9CBD2] border-l-4 border-l-[#C23B4A] bg-[#FCEDEF] p-5 rounded-lg shadow-xs"
            : "border border-[#F9CBD2] border-l-4 border-l-[#C23B4A] bg-[#FCEDEF]/60 p-4 rounded-lg shadow-xs",
          icon: <ShieldAlert className="w-4 h-4 text-[#C23B4A] shrink-0" />,
          value: "text-[#202435]",
          badge: "bg-[#FCEDEF] text-[#C23B4A] border-[#F9CBD2]",
          defaultBadge: "CRITICAL",
          subtext: "text-[#697386]",
          actionClass: "text-[#C23B4A] hover:text-[#9F1239] font-semibold",
        };
      case "warning":
        return {
          wrapper:
            "border border-[#EEF0F3] border-l-4 border-l-[#B7791F] bg-[#FFFFFF] hover:border-[#E5E7EB] p-4 rounded-lg shadow-xs",
          icon: <AlertTriangle className="w-4 h-4 text-[#B7791F] shrink-0" />,
          value: "text-[#202435]",
          badge: "bg-[#FFF7E6] text-[#B7791F] border-[#FDE5A9]",
          defaultBadge: "REQUIRES REVIEW",
          subtext: "text-[#697386]",
          actionClass: "text-[#B7791F] hover:text-[#8D5B0F] font-semibold",
        };
      case "healthy":
      default:
        return {
          wrapper:
            "border border-[#EEF0F3] border-l-4 border-l-[#16845B] bg-[#FFFFFF] hover:border-[#E5E7EB] p-4 rounded-lg shadow-xs",
          icon: <CheckCircle2 className="w-4 h-4 text-[#16845B] shrink-0" />,
          value: "text-[#202435]",
          badge: "bg-[#EAF7F0] text-[#16845B] border-[#B7EAD0]",
          defaultBadge: "HEALTHY",
          subtext: "text-[#697386]",
          actionClass: "text-[#16845B] hover:text-[#116645] font-semibold",
        };
    }
  };

  const config = getStatusConfig();

  return (
    <div
      className={`transition flex flex-col justify-between group relative ${config.wrapper}`}
      aria-label={`${title}: ${value}. ${statusText}. Status: ${badgeLabel || config.defaultBadge}`}
    >
      <div>
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-[#202435]">
            {config.icon}
            <span>{title}</span>
          </div>
          <span
            className={`text-[10px] px-2 py-0.5 rounded border uppercase tracking-wider font-semibold ${config.badge}`}
          >
            {badgeLabel || config.defaultBadge}
          </span>
        </div>

        <div className="flex items-baseline gap-2 mt-1">
          <span className={`text-2xl font-bold font-mono tracking-tight ${config.value}`}>
            {value}
          </span>
        </div>

        <p className={`text-xs mt-1 leading-snug ${config.subtext}`}>{statusText}</p>
      </div>

      <div className="mt-3 pt-2.5 border-t border-[#E5E7EB] flex items-center justify-between text-xs">
        <Link
          href={href}
          className={`${config.actionClass} hover:underline focus:outline-none focus:underline`}
        >
          {actionLabel}
        </Link>
      </div>
    </div>
  );
}
