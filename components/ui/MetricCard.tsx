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
    iconBg: "bg-[#FDF2F4]",
    iconColor: "text-[#8B1E3F]",
    border: "border-[#E5E7EB] hover:border-[#8B1E3F]/40",
    valueColor: "text-[#172B4D]",
    badgeBg: "bg-[#FDF2F4] border-[#FBE4E9]",
    badgeText: "text-[#8B1E3F]",
  },
  crimson: {
    iconBg: "bg-[#FDF2F4]",
    iconColor: "text-[#8B1E3F]",
    border: "border-[#E5E7EB] hover:border-[#8B1E3F]/40",
    valueColor: "text-[#172B4D]",
    badgeBg: "bg-[#FDF2F4] border-[#FBE4E9]",
    badgeText: "text-[#8B1E3F]",
  },
  green: {
    iconBg: "bg-[#ECFDF3]",
    iconColor: "text-[#16845B]",
    border: "border-[#E5E7EB] hover:border-[#16845B]/40",
    valueColor: "text-[#172B4D]",
    badgeBg: "bg-[#ECFDF3] border-[#A7F3D0]",
    badgeText: "text-[#16845B]",
  },
  blue: {
    iconBg: "bg-[#EFF6FF]",
    iconColor: "text-[#3574B9]",
    border: "border-[#E5E7EB] hover:border-[#3574B9]/40",
    valueColor: "text-[#172B4D]",
    badgeBg: "bg-[#EFF6FF] border-[#BFDBFE]",
    badgeText: "text-[#3574B9]",
  },
  amber: {
    iconBg: "bg-[#FFFAEB]",
    iconColor: "text-[#B7791F]",
    border: "border-[#E5E7EB] hover:border-[#B7791F]/40",
    valueColor: "text-[#172B4D]",
    badgeBg: "bg-[#FFFAEB] border-[#FDE68A]",
    badgeText: "text-[#B7791F]",
  },
  purple: {
    iconBg: "bg-[#FAF5FF]",
    iconColor: "text-[#6B46C1]",
    border: "border-[#E5E7EB] hover:border-[#6B46C1]/40",
    valueColor: "text-[#172B4D]",
    badgeBg: "bg-[#FAF5FF] border-[#E9D5FF]",
    badgeText: "text-[#6B46C1]",
  },
  slate: {
    iconBg: "bg-[#F9FAFB]",
    iconColor: "text-[#475569]",
    border: "border-[#E5E7EB] hover:border-[#CBD5E1]",
    valueColor: "text-[#172B4D]",
    badgeBg: "bg-[#F9FAFB] border-[#E5E7EB]",
    badgeText: "text-[#475569]",
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
          <span className="text-xs font-semibold uppercase tracking-wider text-[#8490A0] truncate">
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
          <div className="text-xs text-[#475569] mt-1.5 leading-relaxed">
            {subtitle}
          </div>
        )}
      </div>

      {href && actionText && (
        <div className="mt-3 pt-2.5 border-t border-[#E5E7EB] flex items-center justify-between text-xs font-semibold text-[#475569] group-hover:text-[#8B1E3F] transition">
          <span>{actionText}</span>
          <ArrowRight className="w-3.5 h-3.5 text-[#8490A0] group-hover:text-[#8B1E3F] group-hover:translate-x-0.5 transition" />
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
