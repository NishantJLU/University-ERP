import React from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2, AlertTriangle, ShieldAlert } from "lucide-react";

export type AttentionStatus = "healthy" | "warning" | "critical";

export interface AttentionCardProps {
  title: string;
  value: number | string;
  statusText: string;
  status: AttentionStatus;
  href: string;
  badgeLabel?: string;
  customIcon?: React.ReactNode;
}

export function AttentionCard({
  title,
  value,
  statusText,
  status,
  href,
  badgeLabel,
  customIcon,
}: AttentionCardProps) {
  const getStatusConfig = () => {
    switch (status) {
      case "healthy":
        return {
          wrapperClass:
            "border-emerald-200/90 bg-emerald-50/40 hover:bg-emerald-50/90 hover:border-emerald-300",
          iconClass: "bg-emerald-100 text-emerald-700",
          DefaultIcon: CheckCircle2,
          valueClass: "text-emerald-950",
          badgeClass: "bg-emerald-100 text-emerald-800 border-emerald-200",
          defaultBadge: "HEALTHY",
          subtextClass: "text-emerald-800/80",
        };
      case "critical":
        return {
          wrapperClass:
            "border-rose-300 bg-rose-50/60 hover:bg-rose-100/70 hover:border-rose-400 shadow-xs",
          iconClass: "bg-rose-100 text-rose-700",
          DefaultIcon: ShieldAlert,
          valueClass: "text-rose-950",
          badgeClass: "bg-rose-100 text-rose-900 border-rose-300 font-bold",
          defaultBadge: "CRITICAL",
          subtextClass: "text-rose-900/90 font-medium",
        };
      case "warning":
      default:
        return {
          wrapperClass:
            "border-amber-200/90 bg-amber-50/50 hover:bg-amber-100/60 hover:border-amber-300",
          iconClass: "bg-amber-100 text-amber-700",
          DefaultIcon: AlertTriangle,
          valueClass: "text-amber-950",
          badgeClass: "bg-amber-100 text-amber-900 border-amber-200 font-semibold",
          defaultBadge: "ACTION NEEDED",
          subtextClass: "text-amber-900/80",
        };
    }
  };

  const config = getStatusConfig();
  const IconComponent = config.DefaultIcon;

  return (
    <Link
      href={href}
      className={`p-4 rounded-xl border transition flex flex-col justify-between group relative ${config.wrapperClass}`}
      aria-label={`${title}: ${value}. ${statusText}. Status: ${badgeLabel || config.defaultBadge}`}
    >
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className={`p-2 rounded-lg shrink-0 ${config.iconClass}`}>
          {customIcon || <IconComponent className="w-4 h-4" />}
        </div>
        <span
          className={`text-[10px] px-2 py-0.5 rounded-full border tracking-wide uppercase ${config.badgeClass}`}
        >
          {badgeLabel || config.defaultBadge}
        </span>
      </div>

      <div className="min-w-0">
        <div className="flex items-baseline gap-2">
          <span className={`text-2xl font-extrabold font-mono tracking-tight ${config.valueClass}`}>
            {value}
          </span>
          <span className="text-xs font-bold text-slate-800 truncate">{title}</span>
        </div>
        <p className={`text-[11px] mt-1 line-clamp-2 ${config.subtextClass}`}>{statusText}</p>
      </div>

      <div className="mt-3 pt-2 border-t border-black/5 flex items-center justify-between text-[11px] font-semibold text-slate-600 group-hover:text-slate-900">
        <span>Review details</span>
        <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1 text-slate-400 group-hover:text-slate-800" />
      </div>
    </Link>
  );
}
