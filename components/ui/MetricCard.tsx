import React from "react";
import Link from "next/link";
import { LucideIcon, ArrowRight } from "lucide-react";

export type MetricColor = "crimson" | "burgundy" | "green" | "blue" | "amber" | "purple" | "slate";

export interface MetricCardProps {
  title: string;
  value: React.ReactNode;
  subtitle?: React.ReactNode;
  icon?: LucideIcon | React.ReactNode;
  color?: MetricColor;
  badge?: React.ReactNode;
  href?: string;
  actionText?: string;
  className?: string;
}

const COLOR_VARIANTS: Record<
  MetricColor,
  {
    iconBg: string;
    iconColor: string;
    border: string;
    valueColor: string;
    badgeBg: string;
    badgeText: string;
  }
> = {
  burgundy: {
    iconBg: "bg-[#F9EEF2]",
    iconColor: "text-[#861F41]",
    border: "border-[#EEF0F3] hover:border-[#861F41]/40",
    valueColor: "text-[#202435]",
    badgeBg: "bg-[#F9EEF2] border-[#F4D3DE]",
    badgeText: "text-[#861F41]",
  },
  crimson: {
    iconBg: "bg-[#F9EEF2]",
    iconColor: "text-[#861F41]",
    border: "border-[#EEF0F3] hover:border-[#861F41]/40",
    valueColor: "text-[#202435]",
    badgeBg: "bg-[#F9EEF2] border-[#F4D3DE]",
    badgeText: "text-[#861F41]",
  },
  green: {
    iconBg: "bg-[#EAF7F0]",
    iconColor: "text-[#16845B]",
    border: "border-[#EEF0F3] hover:border-[#16845B]/40",
    valueColor: "text-[#202435]",
    badgeBg: "bg-[#EAF7F0] border-[#B7EAD0]",
    badgeText: "text-[#16845B]",
  },
  blue: {
    iconBg: "bg-[#EDF3FA]",
    iconColor: "text-[#3567A5]",
    border: "border-[#EEF0F3] hover:border-[#3567A5]/40",
    valueColor: "text-[#202435]",
    badgeBg: "bg-[#EDF3FA] border-[#BCD7F3]",
    badgeText: "text-[#3567A5]",
  },
  amber: {
    iconBg: "bg-[#FFF7E6]",
    iconColor: "text-[#B7791F]",
    border: "border-[#EEF0F3] hover:border-[#B7791F]/40",
    valueColor: "text-[#202435]",
    badgeBg: "bg-[#FFF7E6] border-[#FDE5A9]",
    badgeText: "text-[#B7791F]",
  },
  purple: {
    iconBg: "bg-[#F9EEF2]",
    iconColor: "text-[#861F41]",
    border: "border-[#EEF0F3] hover:border-[#861F41]/40",
    valueColor: "text-[#202435]",
    badgeBg: "bg-[#F9EEF2] border-[#F4D3DE]",
    badgeText: "text-[#861F41]",
  },
  slate: {
    iconBg: "bg-[#F1F2F5]",
    iconColor: "text-[#697386]",
    border: "border-[#EEF0F3] hover:border-[#E5E7EB]",
    valueColor: "text-[#202435]",
    badgeBg: "bg-[#F1F2F5] border-[#E5E7EB]",
    badgeText: "text-[#697386]",
  },
};

export default function MetricCard({
  title,
  value,
  subtitle,
  icon,
  color = "blue",
  badge,
  href,
  actionText,
  className = "",
}: MetricCardProps) {
  const c = COLOR_VARIANTS[color] || COLOR_VARIANTS.blue;

  const renderIcon = () => {
    if (!icon) return null;
    if (React.isValidElement(icon)) return icon;
    const IconComponent = icon as LucideIcon;
    return <IconComponent className="w-4 h-4" />;
  };

  const content = (
    <div
      className={`erp-card erp-card-interactive p-5 flex flex-col justify-between h-full ${c.border} ${className}`}
    >
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#9299A8] truncate">
            {title}
          </span>
          {icon && (
            <div
              className={`p-2 rounded-lg ${c.iconBg} ${c.iconColor} border border-black/[0.04] shrink-0`}
            >
              {renderIcon()}
            </div>
          )}
        </div>

        <div className="flex items-baseline gap-2 flex-wrap">
          <span
            className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${c.valueColor}`}
          >
            {value}
          </span>
          {badge && (
            <span
              className={`text-[11px] font-semibold px-2 py-0.5 rounded-md border ${c.badgeBg} ${c.badgeText}`}
            >
              {badge}
            </span>
          )}
        </div>

        {subtitle && (
          <div className="text-xs text-[#697386] mt-1.5 leading-relaxed">
            {subtitle}
          </div>
        )}
      </div>

      {href && actionText && (
        <div className="mt-3 pt-2.5 border-t border-[#EEF0F3] flex items-center justify-between text-xs font-semibold text-[#697386] group-hover:text-[#861F41] transition">
          <span>{actionText}</span>
          <ArrowRight className="w-3.5 h-3.5 text-[#9299A8] group-hover:text-[#861F41] group-hover:translate-x-0.5 transition" />
        </div>
      )}
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="group block h-full">
        {content}
      </Link>
    );
  }

  return content;
}
