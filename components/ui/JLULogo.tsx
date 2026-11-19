"use client";

import React from "react";
import Image from "next/image";

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
    sm: { symbol: "w-7 h-7", height: 28, text: "text-xs", sub: "text-[9px]" },
    md: { symbol: "w-9 h-9", height: 36, text: "text-sm", sub: "text-[10px]" },
    lg: { symbol: "w-12 h-12", height: 48, text: "text-base", sub: "text-xs" },
    xl: { symbol: "w-16 h-16", height: 64, text: "text-xl", sub: "text-sm" },
  };

  const isWhite = variant === "white";
  const textColor = isWhite ? "text-white" : "text-[#21313C]";
  const subColor = isWhite ? "text-[#D4E4A0]" : "text-[#027EA1]";
  const taglineColor = isWhite ? "text-[#F0C14B]" : "text-[#8D9BA8]";

  // Official JLU Symbol Mark
  const Symbol = (
    <div
      className={`${sizeMap[size].symbol} rounded-xl bg-white flex items-center justify-center p-1 shadow-xs border border-[#E2E8F0] shrink-0 relative overflow-hidden group`}
    >
      <img
        src="/images/jlu-official-logo.webp"
        alt="JLU Official Emblem"
        className="w-full h-full object-contain"
        onError={(e) => {
          // Fallback to flame icon if needed
          (e.currentTarget as HTMLImageElement).src = "/images/jlu-flame.png";
        }}
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

  // Full official logo display
  return (
    <div className={`inline-flex items-center gap-3 ${className}`}>
      {Symbol}
      <div className="flex flex-col leading-tight">
        <div className="flex items-center gap-1.5">
          <span className={`font-black tracking-tight ${sizeMap[size].text} ${textColor}`}>
            JAGRAN LAKECITY
          </span>
        </div>
        <div className="flex items-center gap-1.5 mt-0.5">
          <span className={`font-bold uppercase tracking-wider ${sizeMap[size].sub} ${subColor}`}>
            UNIVERSITY
          </span>
          <span className={`text-[9px] ${taglineColor}`}>•</span>
          <span className={`text-[10px] font-semibold uppercase tracking-wider ${taglineColor}`}>
            DIGITAL CAMPUS
          </span>
        </div>
      </div>
    </div>
  );
}
