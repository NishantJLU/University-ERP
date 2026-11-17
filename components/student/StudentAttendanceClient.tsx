"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  CheckSquare,
  AlertTriangle,
  Clock,
  Calendar,
  ChevronDown,
  ChevronUp,
  FileText,
  Filter,
  User,
  Info,
} from "lucide-react";
import { formatDate, formatEnum } from "@/lib/utils";
import AttendanceWhatIfCalculator from "@/components/student/AttendanceWhatIfCalculator";

interface AttendanceRecordItem {
  id: string;
  status: string;
  remarks: string | null;
  session: {
    id: string;
    date: string | Date;
    periodNumber: number;
    subjectId: string;
    subject: {
      code: string;
      name: string;
    };
    faculty: {
      user: {
        name: string;
      };
    };
  };
}

interface SubjectStatItem {
  subject: {
    id: string;
    code: string;
    name: string;
  };
  total: number;
  present: number;
  percentage: number | null;
  type: string;
  records: AttendanceRecordItem[];
}

interface StudentAttendanceClientProps {
  totalClasses: number;
  presentClasses: number;
  overallPercentage: number | null;
  subjects: SubjectStatItem[];
}

export default function StudentAttendanceClient({
  totalClasses,
  presentClasses,
  overallPercentage,
  subjects,
}: StudentAttendanceClientProps) {
  const [expandedSubjectId, setExpandedSubjectId] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<"DEFAULT" | "RISK" | "PERCENTAGE">("DEFAULT");
  const [condonationModalOpen, setCondonationModalOpen] = useState(false);
  const [selectedSubjectForLeave, setSelectedSubjectForLeave] = useState<string>("");

  const isDataThin = totalClasses < 5;

  // Compute safe miss & recover numbers for each subject
  const subjectsWithCalculations = subjects.map((sub) => {
    let safeToMiss: number | string = "—";
    let neededToRecover: number | string = "—";

    if (sub.total > 0 && sub.percentage !== null) {
      if (sub.percentage >= 75) {
        safeToMiss = Math.max(0, Math.floor((4 * sub.present) / 3 - sub.total));
        neededToRecover = 0;
      } else {
        safeToMiss = 0;
        neededToRecover = Math.max(0, Math.ceil(3 * sub.total - 4 * sub.present));
      }
    }

    return {
      ...sub,
      safeToMiss,
      neededToRecover,
    };
  });

  // Sorting
  const sortedSubjects = [...subjectsWithCalculations].sort((a, b) => {
    if (sortBy === "RISK") {
      const getScore = (item: typeof a) => {
        if (item.total === 0) return 999;
        if (item.percentage !== null && item.percentage < 75) return 1;
        if (item.percentage !== null && item.percentage === 75) return 2;
        return 100 - (item.percentage || 0);
      };
      return getScore(a) - getScore(b);
    }
    if (sortBy === "PERCENTAGE") {
      return (b.percentage || 0) - (a.percentage || 0);
    }
    return a.subject.code.localeCompare(b.subject.code);
  });

  const toggleSubjectExpand = (subId: string) => {
    setExpandedSubjectId(expandedSubjectId === subId ? null : subId);
  };

  return (
    <div className="space-y-4 font-sans text-slate-800">
      {/* Institutional Breadcrumb & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
        <div>
          <nav className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
            <Link href="/student/dashboard" className="hover:text-slate-800">
              Dashboard
            </Link>
            <span>/</span>
            <span className="text-slate-600">Academic Records</span>
            <span>/</span>
            <span className="text-slate-900 font-medium">Attendance Ledger</span>
          </nav>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Statutory Lecture Attendance Ledger
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Class session registers, statutory compliance thresholds, and 75% examination eligibility forecasting
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setSelectedSubjectForLeave(subjects[0]?.subject.name || "");
            setCondonationModalOpen(true);
          }}
          className="px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-sm text-xs font-semibold flex items-center gap-1.5 transition self-start sm:self-auto"
        >
          <FileText className="w-3.5 h-3.5 text-slate-600" />
          Request Leave / Condonation
        </button>
      </div>

      {/* Dense Overall Metric Strip */}
      <div className="border border-slate-300 bg-white rounded-sm p-3 grid grid-cols-2 lg:grid-cols-4 gap-3 divide-y lg:divide-y-0 lg:divide-x divide-slate-200">
        <div className="pr-3">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
            Aggregate Standing
          </span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900 font-mono">
              {overallPercentage !== null ? `${overallPercentage}%` : "—"}
            </span>
            <span
              className={`px-1.5 py-0.2 rounded-xs text-[10px] font-bold border ${
                isDataThin
                  ? "bg-slate-100 text-slate-700 border-slate-300"
                  : overallPercentage !== null && overallPercentage >= 75
                  ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                  : "bg-red-50 text-red-800 border-red-300"
              }`}
            >
              {isDataThin ? "Initial Phase" : overallPercentage !== null && overallPercentage >= 75 ? "Eligible" : "Shortage Risk"}
            </span>
          </div>
          <span className="text-[10px] text-slate-500 block mt-0.5">
            {presentClasses} of {totalClasses} sessions attended
          </span>
        </div>

        <div className="pt-2 lg:pt-0 lg:px-3">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
            Mandatory Statutory Threshold
          </span>
          <p className="text-xl font-bold text-slate-800 font-mono mt-1">75.0%</p>
          <span className="text-[10px] text-slate-500 block">JLU Academic Examination Regulations</span>
        </div>

        <div className="pt-2 lg:pt-0 lg:px-3">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
            Course Curriculum Load
          </span>
          <p className="text-xl font-bold text-slate-900 mt-1">{subjects.length} Subjects</p>
          <span className="text-[10px] text-slate-500 block">Current registered semester</span>
        </div>

        <div className="pt-2 lg:pt-0 lg:pl-3">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
            Compliance Evaluation
          </span>
          <div className="mt-1">
            {isDataThin ? (
              <span className="text-[11px] font-semibold text-slate-700">Baseline in effect at 5 classes</span>
            ) : overallPercentage !== null && overallPercentage >= 75 ? (
              <span className="text-[11px] font-bold text-emerald-700">Satisfies hall ticket criteria</span>
            ) : (
              <span className="text-[11px] font-bold text-red-700">Remedial sessions required</span>
            )}
          </div>
          <span className="text-[10px] text-slate-500 block mt-0.5">
            Audit cycle: Autumn Term 2026
          </span>
        </div>
      </div>

      {/* Interactive What-If Simulator */}
      <AttendanceWhatIfCalculator
        overallTotal={totalClasses}
        overallPresent={presentClasses}
        subjects={subjects.map((s) => ({
          subject: s.subject,
          total: s.total,
          present: s.present,
          percentage: s.percentage,
        }))}
      />

      {/* Subject-Wise Breakdown Table */}
      <div className="border border-slate-300 bg-white rounded-sm overflow-hidden">
        <div className="px-3.5 py-2.5 bg-slate-50 border-b border-slate-300 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Subject-Wise Attendance Ledger & Eligibility Register
            </h2>
            <p className="text-[11px] text-slate-500">
              Click any course row to view the chronological session register
            </p>
          </div>

          {/* Sort Controls */}
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-slate-500 text-[11px] font-medium flex items-center gap-1">
              <Filter className="w-3 h-3 text-slate-400" /> Sort:
            </span>
            <button
              type="button"
              onClick={() => setSortBy("DEFAULT")}
              className={`px-2 py-0.5 rounded-xs text-[11px] transition border ${
                sortBy === "DEFAULT"
                  ? "bg-slate-800 text-white border-slate-800 font-bold"
                  : "bg-white text-slate-700 hover:bg-slate-50 border-slate-300"
              }`}
            >
              Default
            </button>
            <button
              type="button"
              onClick={() => setSortBy("RISK")}
              className={`px-2 py-0.5 rounded-xs text-[11px] transition border ${
                sortBy === "RISK"
                  ? "bg-slate-800 text-white border-slate-800 font-bold"
                  : "bg-white text-slate-700 hover:bg-slate-50 border-slate-300"
              }`}
            >
              Risk Level
            </button>
            <button
              type="button"
              onClick={() => setSortBy("PERCENTAGE")}
              className={`px-2 py-0.5 rounded-xs text-[11px] transition border ${
                sortBy === "PERCENTAGE"
                  ? "bg-slate-800 text-white border-slate-800 font-bold"
                  : "bg-white text-slate-700 hover:bg-slate-50 border-slate-300"
              }`}
            >
              Attendance %
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100 border-b border-slate-300 text-[10px] font-bold uppercase tracking-wider text-slate-600">
                <th className="py-2.5 px-3">Subject Code</th>
                <th className="py-2.5 px-3">Subject Title</th>
                <th className="py-2.5 px-3">Type</th>
                <th className="py-2.5 px-3 text-center">Classes Held</th>
                <th className="py-2.5 px-3 text-center">Attended</th>
                <th className="py-2.5 px-3 text-center">Percentage</th>
                <th className="py-2.5 px-3 text-center">Safe to Miss</th>
                <th className="py-2.5 px-3 text-center">Attend to Reach 75%</th>
                <th className="py-2.5 px-3 text-center">Standing</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {sortedSubjects.map((stat) => {
                const isExpanded = expandedSubjectId === stat.subject.id;

                return (
                  <React.Fragment key={stat.subject.id}>
                    <tr
                      onClick={() => toggleSubjectExpand(stat.subject.id)}
                      className="hover:bg-slate-50/80 transition cursor-pointer select-none"
                    >
                      <td className="py-2.5 px-3 font-mono font-bold text-slate-900 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          {isExpanded ? (
                            <ChevronUp className="w-3.5 h-3.5 text-blue-700" />
                          ) : (
                            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                          )}
                          <span>{stat.subject.code}</span>
                        </div>
                      </td>

                      <td className="py-2.5 px-3 font-medium text-slate-900">
                        {stat.subject.name}
                      </td>

                      <td className="py-2.5 px-3 whitespace-nowrap">
                        <span className="px-1.5 py-0.2 rounded-xs text-[10px] font-mono bg-slate-100 border border-slate-300 text-slate-700">
                          {formatEnum(stat.type)}
                        </span>
                      </td>

                      <td className="py-2.5 px-3 text-center text-slate-800 font-mono">{stat.total}</td>
                      <td className="py-2.5 px-3 text-center font-bold text-slate-900 font-mono">{stat.present}</td>

                      <td className="py-2.5 px-3 text-center whitespace-nowrap font-mono">
                        {stat.total === 0 ? (
                          <span className="text-slate-400">—</span>
                        ) : (
                          <span
                            className={`font-bold ${
                              stat.percentage !== null && stat.percentage >= 75
                                ? "text-emerald-800"
                                : "text-red-700"
                            }`}
                          >
                            {stat.percentage}%
                          </span>
                        )}
                      </td>

                      {/* Safe to Miss */}
                      <td className="py-2.5 px-3 text-center whitespace-nowrap font-mono text-[11px]">
                        {stat.total === 0 ? (
                          <span className="text-slate-400">—</span>
                        ) : typeof stat.safeToMiss === "number" && stat.safeToMiss > 0 ? (
                          <span className="text-emerald-700 font-semibold">
                            {stat.safeToMiss} class(es)
                          </span>
                        ) : (
                          <span className="text-slate-400">0 (Limit)</span>
                        )}
                      </td>

                      {/* Attend to Reach 75% */}
                      <td className="py-2.5 px-3 text-center whitespace-nowrap font-mono text-[11px]">
                        {stat.total === 0 ? (
                          <span className="text-slate-400">—</span>
                        ) : typeof stat.neededToRecover === "number" && stat.neededToRecover > 0 ? (
                          <span className="text-red-700 font-bold">
                            +{stat.neededToRecover} needed
                          </span>
                        ) : (
                          <span className="text-slate-500">0 (Compliant)</span>
                        )}
                      </td>

                      {/* Standing Status Tag */}
                      <td className="py-2.5 px-3 text-center whitespace-nowrap">
                        {stat.total === 0 ? (
                          <span className="px-1.5 py-0.2 rounded-xs text-[10px] font-medium bg-slate-100 text-slate-600 border border-slate-300">
                            No classes yet
                          </span>
                        ) : stat.total < 5 ? (
                          <span className="px-1.5 py-0.2 rounded-xs text-[10px] font-medium bg-slate-100 text-slate-700 border border-slate-300">
                            Initial ({stat.present}/{stat.total})
                          </span>
                        ) : stat.percentage !== null && stat.percentage >= 75 ? (
                          <span className="px-1.5 py-0.2 rounded-xs text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-300">
                            Eligible
                          </span>
                        ) : (
                          <span className="px-1.5 py-0.2 rounded-xs text-[10px] font-bold bg-red-50 text-red-700 border border-red-300">
                            Shortage Risk
                          </span>
                        )}
                      </td>
                    </tr>

                    {/* Date-wise Session History Accordion */}
                    {isExpanded && (
                      <tr className="bg-slate-50/70 border-y border-slate-200">
                        <td colSpan={9} className="p-3">
                          <div className="bg-white border border-slate-300 rounded-xs p-3 space-y-2">
                            <div className="flex items-center justify-between">
                              <h4 className="text-xs font-bold text-slate-900">
                                Chronological Lecture Register — {stat.subject.code} ({stat.subject.name})
                              </h4>
                              <span className="text-[11px] text-slate-500 font-mono">
                                {stat.records.length} Recorded Lecture(s)
                              </span>
                            </div>

                            {stat.records.length === 0 ? (
                              <p className="text-xs text-slate-400 italic py-1">
                                No session logs recorded in university attendance ledger for this subject yet.
                              </p>
                            ) : (
                              <table className="w-full text-left text-xs border border-slate-200">
                                <thead>
                                  <tr className="bg-slate-100 text-[10px] font-bold uppercase text-slate-600 border-b border-slate-200">
                                    <th className="p-2">Date</th>
                                    <th className="p-2">Period</th>
                                    <th className="p-2">Faculty Instructor</th>
                                    <th className="p-2 text-center">Attendance Status</th>
                                    <th className="p-2">Remarks</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                  {stat.records.map((rec) => (
                                    <tr key={rec.id} className="hover:bg-slate-50/50">
                                      <td className="p-2 font-mono text-slate-800">{formatDate(rec.session.date)}</td>
                                      <td className="p-2 font-mono text-slate-700">Period {rec.session.periodNumber}</td>
                                      <td className="p-2 text-slate-800">{rec.session.faculty.user.name}</td>
                                      <td className="p-2 text-center">
                                        <span
                                          className={`px-1.5 py-0.2 rounded-xs text-[10px] font-bold border ${
                                            rec.status === "PRESENT"
                                              ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                                              : "bg-red-50 text-red-800 border-red-300"
                                          }`}
                                        >
                                          {rec.status}
                                        </span>
                                      </td>
                                      <td className="p-2 text-slate-500 text-[11px]">{rec.remarks || "—"}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
