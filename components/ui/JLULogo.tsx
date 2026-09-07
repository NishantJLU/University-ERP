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

  // Official JLU Diamond Crest Symbol
  const Symbol = (
    <div
      className={`${sizeMap[size].symbol} rounded-xl bg-gradient-to-br from-rose-700 via-rose-600 to-rose-900 flex items-center justify-center text-white font-black shadow-md border border-rose-400/30 shrink-0 relative overflow-hidden group`}
    >
      {/* Facet Sheen */}
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent pointer-events-none" />
      
      {/* Diamond & Academic Icon Graphic */}
      <svg
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-4/5 h-4/5 text-white drop-shadow-sm"
      >
        {/* Diamond Silhouette */}
        <polygon
          points="24,4 40,16 24,44 8,16"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
        {/* Inner Diamond Facet Lines */}
        <line x1="8" y1="16" x2="40" y2="16" stroke="currentColor" strokeWidth="2" strokeOpacity="0.7" />
        <line x1="16" y1="16" x2="24" y2="4" stroke="currentColor" strokeWidth="2" strokeOpacity="0.7" />
        <line x1="32" y1="16" x2="24" y2="4" stroke="currentColor" strokeWidth="2" strokeOpacity="0.7" />
        <line x1="16" y1="16" x2="24" y2="44" stroke="currentColor" strokeWidth="2" strokeOpacity="0.7" />
        <line x1="32" y1="16" x2="24" y2="44" stroke="currentColor" strokeWidth="2" strokeOpacity="0.7" />
        {/* Academic Center Star */}
        <circle cx="24" cy="22" r="3" fill="#FDE047" />
      </svg>
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
            BHOPAL, MADHYA PRADESH
          </span>
          <span className={`hidden sm:inline text-[9px] ${taglineColor}`}>•</span>
          <span className={`hidden sm:inline italic text-[10px] font-medium ${taglineColor}`}>
            &ldquo;Central India&apos;s Diamond University&rdquo;
          </span>
        </div>
      </div>
    </div>
  );
}
