"use client";

import React, { useState } from "react";
import { Calculator, CheckCircle2, AlertTriangle, RefreshCw, Minus, Plus, Info } from "lucide-react";

interface SubjectStat {
  subject: {
    id: string;
    code: string;
    name: string;
  };
  total: number;
  present: number;
  percentage: number | null;
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

  const isDataThin = currentTotal < 5;
  const CURRICULUM_SEMESTER_CLASSES = 40;

  // Simulated metrics based on actual + future inputs
  const simTotal = currentTotal + attendNext + missNext;
  const simPresent = currentPresent + attendNext;
  const simPercentage = simTotal > 0 ? Math.round((simPresent / simTotal) * 100) : null;
  const currentPercentage = currentTotal > 0 ? Math.round((currentPresent / currentTotal) * 100) : null;

  // Safe miss calculation:
  let safeToMiss = 0;
  if (currentPercentage !== null && currentPercentage >= 75) {
    safeToMiss = Math.max(0, Math.floor((4 * currentPresent) / 3 - currentTotal));
  }

  // Recovery calculation:
  let classesNeededFor75 = 0;
  if (currentPercentage !== null && currentPercentage < 75) {
    classesNeededFor75 = Math.max(0, Math.ceil(3 * currentTotal - 4 * currentPresent));
  }

  const handleReset = () => {
    setAttendNext(0);
    setMissNext(0);
  };

  const QUICK_STEPS = [1, 2, 3, 5];

  return (
    <div className="border border-slate-300 bg-white rounded-sm p-3.5 space-y-3 font-sans text-slate-800">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <Calculator className="w-4 h-4 text-slate-700" />
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Statutory Attendance Forecaster & Simulator
              </h3>
              <span className="px-1.5 py-0.2 rounded-xs text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-300">
                Rule 75% Model
              </span>
            </div>
            <p className="text-[11px] text-slate-500">
              Calculate projected eligibility margins and safe absences before the End-Term examination window
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleReset}
          className="text-xs text-slate-600 hover:text-slate-900 flex items-center gap-1 transition self-start sm:self-auto px-2 py-1 rounded-sm border border-slate-300 bg-white hover:bg-slate-50 font-medium"
        >
          <RefreshCw className="w-3 h-3 text-slate-500" />
          Reset Simulator
        </button>
      </div>

      {/* Scope Selector */}
      <div className="space-y-1">
        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
          Select Target Subject:
        </label>
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          <button
            type="button"
            onClick={() => {
              setSelectedScope("OVERALL");
              handleReset();
            }}
            className={`px-2.5 py-1 rounded-xs font-semibold border transition ${
              selectedScope === "OVERALL"
                ? "bg-slate-800 text-white border-slate-800"
                : "bg-white text-slate-700 hover:bg-slate-50 border-slate-300"
            }`}
          >
            All Subjects ({overallTotal > 0 ? `${overallPresent}/${overallTotal}` : "0 held"})
          </button>

          {subjects.map((sub) => (
            <button
              key={sub.subject.id}
              type="button"
              onClick={() => {
                setSelectedScope(sub.subject.id);
                handleReset();
              }}
              className={`px-2.5 py-1 rounded-xs font-semibold border transition ${
                selectedScope === sub.subject.id
                  ? "bg-slate-800 text-white border-slate-800"
                  : "bg-white text-slate-700 hover:bg-slate-50 border-slate-300"
              }`}
            >
              {sub.subject.code} {sub.total > 0 ? `(${sub.percentage}%)` : `(0 held)`}
            </button>
          ))}
        </div>
      </div>

      {/* Thin Data Banner */}
      {isDataThin && (
        <div className="p-2.5 rounded-xs bg-slate-50 border border-slate-300 text-xs text-slate-700 flex items-start gap-2">
          <Info className="w-3.5 h-3.5 text-slate-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-slate-900 text-[11px]">
              Initial Curriculum Phase ({currentTotal} session{currentTotal === 1 ? "" : "s"} recorded)
            </p>
            <p className="text-[11px] text-slate-600">
              Statutory 75% baseline activates following 5 recorded lectures. You can simulate upcoming classes below to forecast compliance against the standard {CURRICULUM_SEMESTER_CLASSES}-session term.
            </p>
          </div>
        </div>
      )}

      {/* Simulation Controls & Output */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 pt-1">
        {/* Left Inputs */}
        <div className="md:col-span-7 space-y-2.5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {/* Classes to attend */}
            <div className="p-2.5 rounded-xs bg-slate-50 border border-slate-300 space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-800">
                  Upcoming Classes to Attend
                </label>
                <span className="text-xs font-mono font-bold text-emerald-800 bg-emerald-50 px-1.5 py-0.2 rounded-xs border border-emerald-300">
                  +{attendNext}
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setAttendNext((prev) => Math.max(0, prev - 1))}
                  className="w-6 h-6 rounded-xs bg-white border border-slate-300 text-slate-700 flex items-center justify-center hover:bg-slate-100 font-bold text-xs"
                >
                  <Minus className="w-3 h-3" />
                </button>
                <input
                  type="range"
                  min={0}
                  max={30}
                  value={attendNext}
                  onChange={(e) => setAttendNext(Number(e.target.value))}
                  className="flex-1 accent-slate-800 cursor-pointer"
                />
                <button
                  type="button"
                  onClick={() => setAttendNext((prev) => prev + 1)}
                  className="w-6 h-6 rounded-xs bg-white border border-slate-300 text-slate-700 flex items-center justify-center hover:bg-slate-100 font-bold text-xs"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>

              <div className="flex items-center gap-1 pt-1">
                {QUICK_STEPS.map((step) => (
                  <button
                    key={step}
                    type="button"
                    onClick={() => setAttendNext((prev) => prev + step)}
                    className="flex-1 py-0.5 text-[10px] font-semibold bg-white border border-slate-300 rounded-xs hover:bg-slate-100 text-slate-700"
                  >
                    +{step}
                  </button>
                ))}
              </div>
            </div>

            {/* Classes to miss */}
            <div className="p-2.5 rounded-xs bg-slate-50 border border-slate-300 space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-800">
                  Upcoming Classes to Miss
                </label>
                <span className="text-xs font-mono font-bold text-red-800 bg-red-50 px-1.5 py-0.2 rounded-xs border border-red-300">
                  +{missNext}
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setMissNext((prev) => Math.max(0, prev - 1))}
                  className="w-6 h-6 rounded-xs bg-white border border-slate-300 text-slate-700 flex items-center justify-center hover:bg-slate-100 font-bold text-xs"
                >
                  <Minus className="w-3 h-3" />
                </button>
                <input
                  type="range"
                  min={0}
                  max={20}
                  value={missNext}
                  onChange={(e) => setMissNext(Number(e.target.value))}
                  className="flex-1 accent-red-700 cursor-pointer"
                />
                <button
                  type="button"
                  onClick={() => setMissNext((prev) => prev + 1)}
                  className="w-6 h-6 rounded-xs bg-white border border-slate-300 text-slate-700 flex items-center justify-center hover:bg-slate-100 font-bold text-xs"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>

              <div className="flex items-center gap-1 pt-1">
                {QUICK_STEPS.map((step) => (
                  <button
                    key={step}
                    type="button"
                    onClick={() => setMissNext((prev) => prev + step)}
                    className="flex-1 py-0.5 text-[10px] font-semibold bg-white border border-slate-300 rounded-xs hover:bg-slate-100 text-slate-700"
                  >
                    +{step}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Output Panel */}
        <div className="md:col-span-5 bg-slate-50 border border-slate-300 rounded-xs p-3 flex flex-col justify-between space-y-2.5">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block">
              Projected Standing
            </span>
            <div className="flex items-baseline justify-between mt-1">
              <div>
                <span className="text-2xl font-bold font-mono text-slate-900">
                  {simPercentage !== null ? `${simPercentage}%` : "—"}
                </span>
                <span className="text-[11px] text-slate-500 ml-2">
                  ({simPresent}/{simTotal} sessions)
                </span>
              </div>
              <span
                className={`px-1.5 py-0.2 rounded-xs text-[10px] font-bold border ${
                  simPercentage !== null && simPercentage >= 75
                    ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                    : "bg-red-50 text-red-800 border-red-300"
                }`}
              >
                {simPercentage !== null && simPercentage >= 75 ? "Eligible" : "Shortage Risk"}
              </span>
            </div>
          </div>

          <div className="border-t border-slate-200 pt-2 text-[11px] space-y-1 text-slate-700">
            <div className="flex justify-between">
              <span className="text-slate-500">Permissible Absences Remaining:</span>
              <span className="font-mono font-bold text-slate-900">
                {safeToMiss > 0 ? `${safeToMiss} class(es)` : "0"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Classes Needed to Reach 75%:</span>
              <span className="font-mono font-bold text-slate-900">
                {classesNeededFor75 > 0 ? `+${classesNeededFor75}` : "0 (Compliant)"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
