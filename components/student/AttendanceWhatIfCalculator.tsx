"use client";

import React, { useState } from "react";
import { Calculator, Sparkles, CheckCircle2, AlertTriangle, TrendingUp, RefreshCw } from "lucide-react";

interface SubjectStat {
  subject: {
    id: string;
    code: string;
    name: string;
  };
  total: number;
  present: number;
  percentage: number;
}

interface AttendanceWhatIfCalculatorProps {
  overallTotal: number;
  overallPresent: number;
  subjects: SubjectStat[];
}

export default function AttendanceWhatIfCalculator({
  overallTotal,
  overallPresent,
  subjects,
}: AttendanceWhatIfCalculatorProps) {
  const [selectedScope, setSelectedScope] = useState<string>("OVERALL");
  const [attendNext, setAttendNext] = useState<number>(0);
  const [missNext, setMissNext] = useState<number>(0);

  // Determine current baseline based on selection
  let currentTotal = overallTotal;
  let currentPresent = overallPresent;

  if (selectedScope !== "OVERALL") {
    const sub = subjects.find((s) => s.subject.id === selectedScope);
    if (sub) {
      currentTotal = sub.total;
      currentPresent = sub.present;
    }
  }

  // Simulated metrics
  const simTotal = currentTotal + attendNext + missNext;
  const simPresent = currentPresent + attendNext;
  const simPercentage = simTotal > 0 ? Math.round((simPresent / simTotal) * 100) : 100;
  const currentPercentage = currentTotal > 0 ? Math.round((currentPresent / currentTotal) * 100) : 100;

  // Calculate classes needed to reach 75%
  // 0.75 * (currentTotal + X) <= currentPresent + X
  // 0.75 * currentTotal + 0.75 * X <= currentPresent + X
  // 0.75 * currentTotal - currentPresent <= 0.25 * X
  // X >= (0.75 * currentTotal - currentPresent) / 0.25 = 3 * currentTotal - 4 * currentPresent
  let classesNeededFor75 = 0;
  if (currentPercentage < 75) {
    classesNeededFor75 = Math.max(0, Math.ceil(3 * currentTotal - 4 * currentPresent));
  }

  // Calculate classes student can safely miss and remain >= 75%
  // currentPresent / (currentTotal + M) >= 0.75
  // currentPresent >= 0.75 * currentTotal + 0.75 * M
  // 0.75 * M <= currentPresent - 0.75 * currentTotal
  // M <= (currentPresent - 0.75 * currentTotal) / 0.75 = (4 * currentPresent / 3) - currentTotal
  let safeToMiss = 0;
  if (currentPercentage >= 75) {
    safeToMiss = Math.max(0, Math.floor((4 * currentPresent) / 3 - currentTotal));
  }

  const handleReset = () => {
    setAttendNext(0);
    setMissNext(0);
  };

  return (
    <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-6 shadow-sm border border-slate-800 space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-300">
            <Calculator className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-white">
                75% Attendance &ldquo;What-If&rdquo; Simulator
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                Interactive
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Simulate upcoming lectures to forecast examination eligibility and safe miss buffers
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleReset}
          className="text-xs text-slate-400 hover:text-white flex items-center gap-1.5 transition self-start sm:self-auto px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10"
        >
          <RefreshCw className="w-3 h-3" />
          Reset Simulation
        </button>
      </div>

      {/* Scope Selector */}
      <div className="flex flex-wrap items-center gap-2 text-xs">
        <span className="text-slate-400 font-medium">Evaluate For:</span>
        <button
          type="button"
          onClick={() => {
            setSelectedScope("OVERALL");
            handleReset();
          }}
          className={`px-3 py-1 rounded-lg font-semibold transition ${
            selectedScope === "OVERALL"
              ? "bg-rose-600 text-white shadow-xs"
              : "bg-white/10 text-slate-300 hover:bg-white/20"
          }`}
        >
          University Aggregate ({overallTotal > 0 ? Math.round((overallPresent / overallTotal) * 100) : 100}%)
        </button>

        {subjects.map((sub) => (
          <button
            key={sub.subject.id}
            type="button"
            onClick={() => {
              setSelectedScope(sub.subject.id);
              handleReset();
            }}
            className={`px-3 py-1 rounded-lg font-semibold transition ${
              selectedScope === sub.subject.id
                ? "bg-rose-600 text-white shadow-xs"
                : "bg-white/10 text-slate-300 hover:bg-white/20"
            }`}
          >
            {sub.subject.code} ({sub.percentage}%)
          </button>
        ))}
      </div>

      {/* Simulation Controls & Output */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 pt-2">
        {/* Left Inputs */}
        <div className="md:col-span-7 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Classes to attend */}
            <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-2">
              <label className="block text-xs font-semibold text-emerald-400">
                Future Classes I Will Attend: +{attendNext}
              </label>
              <input
                type="range"
                min={0}
                max={30}
                value={attendNext}
                onChange={(e) => setAttendNext(Number(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer"
              />
              <div className="flex items-center gap-1.5 pt-1">
                {[1, 3, 5, 10].map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setAttendNext((prev) => Math.min(30, prev + val))}
                    className="px-2 py-0.5 rounded text-[10px] font-bold bg-white/10 hover:bg-white/20 text-slate-200 transition"
                  >
                    +{val}
                  </button>
                ))}
              </div>
            </div>

            {/* Classes to miss */}
            <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-2">
              <label className="block text-xs font-semibold text-red-400">
                Future Classes I Will Miss: +{missNext}
              </label>
              <input
                type="range"
                min={0}
                max={30}
                value={missNext}
                onChange={(e) => setMissNext(Number(e.target.value))}
                className="w-full accent-rose-500 cursor-pointer"
              />
              <div className="flex items-center gap-1.5 pt-1">
                {[1, 2, 3, 5].map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setMissNext((prev) => Math.min(30, prev + val))}
                    className="px-2 py-0.5 rounded text-[10px] font-bold bg-white/10 hover:bg-white/20 text-slate-200 transition"
                  >
                    +{val}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Dynamic Insight Banner */}
          <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-xs text-slate-300 flex items-start gap-2.5">
            <TrendingUp className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
            <div>
              {currentPercentage >= 75 ? (
                <p>
                  You are currently in the <strong className="text-emerald-400">Safe Zone</strong>. You can safely miss{" "}
                  <strong className="text-white font-mono">{safeToMiss}</strong> more class(es) without dropping below the mandatory 75% university examination cutoff.
                </p>
              ) : (
                <p>
                  You are currently under the <strong className="text-rose-400">Shortage Warning</strong>. You must attend the next{" "}
                  <strong className="text-white font-mono">{classesNeededFor75}</strong> consecutive lecture(s) to restore exam eligibility.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Right Output Gauge */}
        <div className="md:col-span-5 p-4 rounded-xl bg-white/10 border border-white/10 flex flex-col justify-between space-y-3">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
              Projected Outcome
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-4xl font-extrabold text-white">{simPercentage}%</span>
              <span className="text-xs text-slate-400">
                ({simPresent}/{simTotal} sessions)
              </span>
            </div>
          </div>

          {/* Progress bar with 75% marker */}
          <div className="space-y-1">
            <div className="relative w-full bg-slate-800 h-3 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-300 ${
                  simPercentage >= 75 ? "bg-emerald-500" : "bg-rose-500"
                }`}
                style={{ width: `${Math.min(100, simPercentage)}%` }}
              />
              {/* 75% tick marker */}
              <div
                className="absolute top-0 bottom-0 w-0.5 bg-white shadow-xs z-10"
                style={{ left: "75%" }}
                title="75% Examination Threshold"
              />
            </div>
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>0%</span>
              <span className="text-white font-bold">75% Threshold</span>
              <span>100%</span>
            </div>
          </div>

          <div>
            {simPercentage >= 75 ? (
              <div className="p-2 rounded-lg bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Status: Fully Examination Eligible</span>
              </div>
            ) : (
              <div className="p-2 rounded-lg bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs font-semibold flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>Status: Debarred / Shortage Risk</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
