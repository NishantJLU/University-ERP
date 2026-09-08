"use client";

import React from "react";

interface JLULogoProps {
  variant?: "full" | "compact" | "white" | "symbol";
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
}

export default function JLULogo({
  variant = "full",
  className = "",
  size = "md",
}: JLULogoProps) {
  const sizeMap = {
    sm: { symbol: "w-7 h-7", text: "text-xs", sub: "text-[9px]" },
    md: { symbol: "w-9 h-9", text: "text-sm", sub: "text-[10px]" },
    lg: { symbol: "w-12 h-12", text: "text-base", sub: "text-xs" },
    xl: { symbol: "w-16 h-16", text: "text-xl", sub: "text-xs" },
  };

  const isWhite = variant === "white";
  const textColor = isWhite ? "text-white" : "text-slate-900";
  const subColor = isWhite ? "text-slate-300" : "text-rose-600";
  const taglineColor = isWhite ? "text-amber-400" : "text-slate-500";

  // Official JLU Flame Torch Emblem
  const Symbol = (
    <div
      className={`${sizeMap[size].symbol} rounded-xl bg-white flex items-center justify-center p-1 shadow-xs border border-slate-200/80 shrink-0 relative overflow-hidden group`}
    >
      <img
        src="/images/jlu-flame.png"
        alt="JLU Official Flame Emblem"
        className="w-full h-full object-contain"
      />
    </div>
  );

  if (variant === "symbol") {
    return <div className={`inline-flex items-center ${className}`}>{Symbol}</div>;
  }

  if (variant === "compact") {
    return (
      <div className={`inline-flex items-center gap-2.5 ${className}`}>
        {Symbol}
        <div className="flex flex-col leading-tight">
          <span className={`font-extrabold tracking-tight ${sizeMap[size].text} ${textColor}`}>
            JLU
          </span>
          <span className={`font-semibold tracking-wider uppercase text-[9px] ${taglineColor}`}>
            Digital Campus
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className={`inline-flex items-center gap-3 ${className}`}>
      {Symbol}
      <div className="flex flex-col leading-tight">
        <div className="flex items-center gap-1.5">
          <span className={`font-extrabold tracking-tight ${sizeMap[size].text} ${textColor}`}>
            JAGRAN LAKECITY UNIVERSITY
          </span>
        </div>
        <div className="flex items-center gap-1.5 mt-0.5">
          <span className={`font-semibold uppercase tracking-wider ${sizeMap[size].sub} ${subColor}`}>
            DIGITAL CAMPUS
          </span>
          <span className={`hidden sm:inline text-[9px] ${taglineColor}`}>•</span>
          <span className={`hidden sm:inline text-[10px] font-medium ${taglineColor}`}>
            Bhopal, MP
          </span>
        </div>
      </div>
    </div>
  );
}
