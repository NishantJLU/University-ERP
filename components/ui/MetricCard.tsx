import React from "react";
import Link from "next/link";
import { LucideIcon, ArrowRight } from "lucide-react";

export type MetricColor = "teal" | "gold" | "crimson" | "burgundy" | "green" | "blue" | "amber" | "purple" | "slate";

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
  teal: {
    iconBg: "bg-[#EAF5F8]",
    iconColor: "text-[#027EA1]",
    border: "border-[#EAEDF0] hover:border-[#027EA1]/40",
    valueColor: "text-[#21313C]",
    badgeBg: "bg-[#EAF5F8] border-[#BEE1EC]",
    badgeText: "text-[#027EA1]",
  },
  blue: {
    iconBg: "bg-[#EAF5F8]",
    iconColor: "text-[#027EA1]",
    border: "border-[#EAEDF0] hover:border-[#027EA1]/40",
    valueColor: "text-[#21313C]",
    badgeBg: "bg-[#EAF5F8] border-[#BEE1EC]",
    badgeText: "text-[#027EA1]",
  },
  gold: {
    iconBg: "bg-[#FEF8E7]",
    iconColor: "text-[#F0C14B]",
    border: "border-[#EAEDF0] hover:border-[#F0C14B]/40",
    valueColor: "text-[#21313C]",
    badgeBg: "bg-[#FEF8E7] border-[#FDE5A9]",
    badgeText: "text-[#B7791F]",
  },
  amber: {
    iconBg: "bg-[#FFF7E6]",
    iconColor: "text-[#B7791F]",
    border: "border-[#EAEDF0] hover:border-[#B7791F]/40",
    valueColor: "text-[#21313C]",
    badgeBg: "bg-[#FFF7E6] border-[#FDE5A9]",
    badgeText: "text-[#B7791F]",
  },
  green: {
    iconBg: "bg-[#EAF7F0]",
    iconColor: "text-[#16845B]",
    border: "border-[#EAEDF0] hover:border-[#16845B]/40",
    valueColor: "text-[#21313C]",
    badgeBg: "bg-[#EAF7F0] border-[#B7EAD0]",
    badgeText: "text-[#16845B]",
  },
  burgundy: {
    iconBg: "bg-[#EAF5F8]",
    iconColor: "text-[#027EA1]",
    border: "border-[#EAEDF0] hover:border-[#027EA1]/40",
    valueColor: "text-[#21313C]",
    badgeBg: "bg-[#EAF5F8] border-[#BEE1EC]",
    badgeText: "text-[#027EA1]",
  },
  crimson: {
    iconBg: "bg-[#EAF5F8]",
    iconColor: "text-[#027EA1]",
    border: "border-[#EAEDF0] hover:border-[#027EA1]/40",
    valueColor: "text-[#21313C]",
    badgeBg: "bg-[#EAF5F8] border-[#BEE1EC]",
    badgeText: "text-[#027EA1]",
  },
  purple: {
    iconBg: "bg-[#EAF5F8]",
    iconColor: "text-[#027EA1]",
    border: "border-[#EAEDF0] hover:border-[#027EA1]/40",
    valueColor: "text-[#21313C]",
    badgeBg: "bg-[#EAF5F8] border-[#BEE1EC]",
    badgeText: "text-[#027EA1]",
  },
  slate: {
    iconBg: "bg-[#F1F3F5]",
    iconColor: "text-[#546574]",
    border: "border-[#EAEDF0] hover:border-[#E2E8F0]",
    valueColor: "text-[#21313C]",
    badgeBg: "bg-[#F1F3F5] border-[#E2E8F0]",
    badgeText: "text-[#546574]",
  },
};

export default function MetricCard({
  title,
  value,
  subtitle,
  icon,
  color = "teal",
  badge,
  href,
  actionText,
  className = "",
}: MetricCardProps) {
  const c = COLOR_VARIANTS[color] || COLOR_VARIANTS.teal;

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
          <span className="text-xs font-semibold uppercase tracking-wider text-[#8D9BA8] truncate">
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
          <div className="text-xs text-[#546574] mt-1.5 leading-relaxed">
            {subtitle}
          </div>
        )}
      </div>

      {href && actionText && (
        <div className="mt-3 pt-2.5 border-t border-[#EAEDF0] flex items-center justify-between text-xs font-semibold text-[#546574] group-hover:text-[#027EA1] transition">
          <span>{actionText}</span>
          <ArrowRight className="w-3.5 h-3.5 text-[#8D9BA8] group-hover:text-[#027EA1] group-hover:translate-x-0.5 transition" />
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
