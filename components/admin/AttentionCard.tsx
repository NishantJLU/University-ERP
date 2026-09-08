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
            ? "border border-rose-300 border-l-4 border-l-rose-700 bg-rose-50/40 p-5 rounded-lg"
            : "border border-rose-300 border-l-4 border-l-rose-700 bg-rose-50/20 p-4 rounded-lg",
          icon: <ShieldAlert className="w-4 h-4 text-rose-700 shrink-0" />,
          value: "text-rose-950",
          badge: "bg-rose-100 text-rose-800 border-rose-200",
          defaultBadge: "CRITICAL",
          subtext: "text-rose-900",
          actionClass: "text-rose-700 hover:text-rose-900 font-semibold",
        };
      case "warning":
        return {
          wrapper:
            "border border-slate-200 border-l-4 border-l-amber-500 bg-white hover:border-slate-300 p-4 rounded-lg",
          icon: <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />,
          value: "text-slate-900",
          badge: "bg-amber-50 text-amber-800 border-amber-200",
          defaultBadge: "REQUIRES REVIEW",
          subtext: "text-slate-600",
          actionClass: "text-amber-800 hover:text-amber-900 font-medium",
        };
      case "healthy":
      default:
        return {
          wrapper:
            "border border-slate-200 bg-white hover:border-slate-300 p-4 rounded-lg opacity-90",
          icon: <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />,
          value: "text-slate-800",
          badge: "bg-slate-100 text-slate-700 border-slate-200",
          defaultBadge: "HEALTHY",
          subtext: "text-slate-500",
          actionClass: "text-slate-600 hover:text-slate-900 font-normal",
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
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
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

      <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
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
