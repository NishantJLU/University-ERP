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
  X,
  Send,
} from "lucide-react";
import { formatDate, formatEnum } from "@/lib/utils";
import { toast } from "@/components/ui/Toast";

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
  const [leaveReason, setLeaveReason] = useState<string>("");
  const [leaveStartDate, setLeaveStartDate] = useState<string>("");
  const [leaveEndDate, setLeaveEndDate] = useState<string>("");
  const [submittingLeave, setSubmittingLeave] = useState(false);

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

  const handleLeaveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!leaveReason.trim()) {
      toast.error("Please specify a reason for leave or condonation.");
      return;
    }
    setSubmittingLeave(true);
    setTimeout(() => {
      setSubmittingLeave(false);
      setCondonationModalOpen(false);
      setLeaveReason("");
      toast.success("Leave / Condonation request submitted to Dean Academics for approval.");
    }, 600);
  };

  return (
    <div className="space-y-5 font-sans text-[#21313C]">
      {/* Institutional Breadcrumb & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#EAEDF0] pb-3">
        <div>
          <nav className="flex items-center gap-1.5 text-xs text-[#8D9BA8] mb-1">
            <Link href="/student/dashboard" className="hover:text-[#21313C]">
              Dashboard
            </Link>
            <span>/</span>
            <span className="text-[#546574]">Academic Records</span>
            <span>/</span>
            <span className="text-[#21313C] font-semibold">Attendance Ledger</span>
          </nav>
          <h1 className="text-xl font-extrabold text-[#21313C] tracking-tight">
            Statutory Lecture Attendance Ledger
          </h1>
          <p className="text-xs text-[#546574] mt-0.5">
            Class session registers, statutory compliance thresholds, and 75% examination eligibility status
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setSelectedSubjectForLeave(subjects[0]?.subject.name || "");
            setCondonationModalOpen(true);
          }}
          className="px-3.5 py-2 bg-white border border-[#E2E8F0] hover:border-[#027EA1] hover:bg-[#EAF5F8] text-[#21313C] hover:text-[#027EA1] rounded-lg text-xs font-semibold flex items-center gap-1.5 transition shadow-2xs self-start sm:self-auto cursor-pointer"
        >
          <FileText className="w-3.5 h-3.5 text-[#027EA1]" />
          <span>Request Leave / Condonation</span>
        </button>
      </div>

      {/* Dense Overall Metric Strip */}
      <div className="border border-[#EAEDF0] bg-white rounded-xl p-4 shadow-xs grid grid-cols-2 lg:grid-cols-4 gap-4 divide-y lg:divide-y-0 lg:divide-x divide-[#EAEDF0]">
        <div className="pr-3">
          <span className="text-[11px] font-semibold text-[#8D9BA8] uppercase tracking-wider block">
            Aggregate Standing
          </span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-[#21313C] font-mono">
              {overallPercentage !== null ? `${overallPercentage}%` : "—"}
            </span>
            <span
              className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${
                isDataThin
                  ? "bg-[#F1F2F5] text-[#546574] border-[#E2E8F0]"
                  : overallPercentage !== null && overallPercentage >= 75
                  ? "bg-[#EAF7F0] text-[#16845B] border-[#B7EAD0]"
                  : "bg-[#FCEDEF] text-[#C23B4A] border-[#F9CBD2]"
              }`}
            >
              {isDataThin ? "Initial Phase" : overallPercentage !== null && overallPercentage >= 75 ? "Eligible" : "Shortage Risk"}
            </span>
          </div>
          <span className="text-[10px] text-[#546574] block mt-1">
            {presentClasses} of {totalClasses} sessions attended
          </span>
        </div>

        <div className="pt-3 lg:pt-0 lg:px-3">
          <span className="text-[11px] font-semibold text-[#8D9BA8] uppercase tracking-wider block">
            Mandatory Statutory Threshold
          </span>
          <p className="text-xl font-extrabold text-[#027EA1] font-mono mt-1">75.0%</p>
          <span className="text-[10px] text-[#546574] block mt-1">JLU Academic Examination Regulations</span>
        </div>

        <div className="pt-3 lg:pt-0 lg:px-3">
          <span className="text-[11px] font-semibold text-[#8D9BA8] uppercase tracking-wider block">
            Course Curriculum Load
          </span>
          <p className="text-xl font-extrabold text-[#21313C] mt-1">{subjects.length} Subjects</p>
          <span className="text-[10px] text-[#546574] block mt-1">Current registered semester</span>
        </div>

        <div className="pt-3 lg:pt-0 lg:pl-3">
          <span className="text-[11px] font-semibold text-[#8D9BA8] uppercase tracking-wider block">
            Compliance Evaluation
          </span>
          <div className="mt-1">
            {isDataThin ? (
              <span className="text-[11px] font-semibold text-[#546574]">Baseline in effect at 5 classes</span>
            ) : overallPercentage !== null && overallPercentage >= 75 ? (
              <span className="text-[11px] font-bold text-[#16845B]">Satisfies hall ticket criteria</span>
            ) : (
              <span className="text-[11px] font-bold text-[#C23B4A]">Remedial sessions required</span>
            )}
          </div>
          <span className="text-[10px] text-[#8D9BA8] block mt-1">
            Audit cycle: Autumn Term 2026
          </span>
        </div>
      </div>

      {/* Subject-Wise Breakdown Table */}
      <div className="border border-[#EAEDF0] bg-white rounded-xl shadow-xs overflow-hidden">
        <div className="px-4 py-3 bg-[#F8F8FA] border-b border-[#EAEDF0] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-xs font-bold text-[#21313C] uppercase tracking-wider flex items-center gap-1.5">
              <CheckSquare className="w-3.5 h-3.5 text-[#027EA1]" />
              <span>Subject-Wise Attendance Ledger & Eligibility Register</span>
            </h2>
            <p className="text-[11px] text-[#546574] mt-0.5">
              Click any course row to view the chronological session register
            </p>
          </div>

          {/* Sort Controls */}
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-[#546574] text-[11px] font-medium flex items-center gap-1">
              <Filter className="w-3 h-3 text-[#8D9BA8]" /> Sort:
            </span>
            <button
              type="button"
              onClick={() => setSortBy("DEFAULT")}
              className={`px-2.5 py-1 rounded-md text-[11px] transition border cursor-pointer ${
                sortBy === "DEFAULT"
                  ? "bg-[#027EA1] text-white border-[#027EA1] font-bold shadow-2xs"
                  : "bg-white text-[#546574] hover:bg-[#F1F2F5] border-[#E2E8F0]"
              }`}
            >
              Default
            </button>
            <button
              type="button"
              onClick={() => setSortBy("RISK")}
              className={`px-2.5 py-1 rounded-md text-[11px] transition border cursor-pointer ${
                sortBy === "RISK"
                  ? "bg-[#027EA1] text-white border-[#027EA1] font-bold shadow-2xs"
                  : "bg-white text-[#546574] hover:bg-[#F1F2F5] border-[#E2E8F0]"
              }`}
            >
              Risk Level
            </button>
            <button
              type="button"
              onClick={() => setSortBy("PERCENTAGE")}
              className={`px-2.5 py-1 rounded-md text-[11px] transition border cursor-pointer ${
                sortBy === "PERCENTAGE"
                  ? "bg-[#027EA1] text-white border-[#027EA1] font-bold shadow-2xs"
                  : "bg-white text-[#546574] hover:bg-[#F1F2F5] border-[#E2E8F0]"
              }`}
            >
              Attendance %
            </button>
          </div>
        </div>

        <div className="overflow-x-auto w-full">
          <table className="w-full text-left text-xs min-w-[850px] border-collapse">
            <thead>
              <tr className="bg-[#F8F8FA] border-b border-[#EAEDF0] text-[10px] font-bold uppercase tracking-wider text-[#8D9BA8]">
                <th className="py-3 px-3.5">Subject Code</th>
                <th className="py-3 px-3">Subject Title</th>
                <th className="py-3 px-3">Type</th>
                <th className="py-3 px-3 text-center">Classes Held</th>
                <th className="py-3 px-3 text-center">Attended</th>
                <th className="py-3 px-3 text-center">Percentage</th>
                <th className="py-3 px-3 text-center">Safe to Miss</th>
                <th className="py-3 px-3 text-center">Attend to Reach 75%</th>
                <th className="py-3 px-3.5 text-center">Standing</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EAEDF0]">
              {sortedSubjects.map((stat) => {
                const isExpanded = expandedSubjectId === stat.subject.id;

                return (
                  <React.Fragment key={stat.subject.id}>
                    <tr
                      onClick={() => toggleSubjectExpand(stat.subject.id)}
                      className="hover:bg-[#F8F9FA] transition cursor-pointer select-none"
                    >
                      <td className="py-3 px-3.5 font-mono font-bold text-[#027EA1] whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          {isExpanded ? (
                            <ChevronUp className="w-3.5 h-3.5 text-[#027EA1]" />
                          ) : (
                            <ChevronDown className="w-3.5 h-3.5 text-[#8D9BA8]" />
                          )}
                          <span>{stat.subject.code}</span>
                        </div>
                      </td>

                      <td className="py-3 px-3 font-semibold text-[#21313C]">
                        {stat.subject.name}
                      </td>

                      <td className="py-3 px-3 whitespace-nowrap">
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#F1F2F5] border border-[#EAEDF0] text-[#546574]">
                          {formatEnum(stat.type)}
                        </span>
                      </td>

                      <td className="py-3 px-3 text-center text-[#21313C] font-mono">{stat.total}</td>
                      <td className="py-3 px-3 text-center font-bold text-[#21313C] font-mono">{stat.present}</td>

                      <td className="py-3 px-3 text-center whitespace-nowrap font-mono">
                        {stat.total === 0 ? (
                          <span className="text-[#8D9BA8]">—</span>
                        ) : (
                          <span
                            className={`font-bold ${
                              stat.percentage !== null && stat.percentage >= 75
                                ? "text-[#16845B]"
                                : "text-[#C23B4A]"
                            }`}
                          >
                            {stat.percentage}%
                          </span>
                        )}
                      </td>

                      {/* Safe to Miss */}
                      <td className="py-3 px-3 text-center whitespace-nowrap font-mono text-[11px]">
                        {stat.total === 0 ? (
                          <span className="text-[#8D9BA8]">—</span>
                        ) : typeof stat.safeToMiss === "number" && stat.safeToMiss > 0 ? (
                          <span className="text-[#16845B] font-semibold">
                            {stat.safeToMiss} class(es)
                          </span>
                        ) : (
                          <span className="text-[#8D9BA8]">0 (Limit)</span>
                        )}
                      </td>

                      {/* Attend to Reach 75% */}
                      <td className="py-3 px-3 text-center whitespace-nowrap font-mono text-[11px]">
                        {stat.total === 0 ? (
                          <span className="text-[#8D9BA8]">—</span>
                        ) : typeof stat.neededToRecover === "number" && stat.neededToRecover > 0 ? (
                          <span className="text-[#C23B4A] font-bold">
                            +{stat.neededToRecover} needed
                          </span>
                        ) : (
                          <span className="text-[#546574]">0 (Compliant)</span>
                        )}
                      </td>

                      {/* Standing Status Tag */}
                      <td className="py-3 px-3.5 text-center whitespace-nowrap">
                        {stat.total === 0 ? (
                          <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-[#F1F2F5] text-[#546574] border border-[#E2E8F0]">
                            No classes yet
                          </span>
                        ) : stat.total < 5 ? (
                          <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-[#F1F2F5] text-[#546574] border border-[#E2E8F0]">
                            Initial ({stat.present}/{stat.total})
                          </span>
                        ) : stat.percentage !== null && stat.percentage >= 75 ? (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#EAF7F0] text-[#16845B] border border-[#B7EAD0]">
                            Eligible
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#FCEDEF] text-[#C23B4A] border border-[#F9CBD2]">
                            Shortage Risk
                          </span>
                        )}
                      </td>
                    </tr>

                    {/* Date-wise Session History Accordion */}
                    {isExpanded && (
                      <tr className="bg-[#F8F8FA] border-y border-[#EAEDF0]">
                        <td colSpan={9} className="p-4">
                          <div className="bg-white border border-[#EAEDF0] rounded-lg p-4 space-y-3 shadow-2xs">
                            <div className="flex items-center justify-between">
                              <h4 className="text-xs font-bold text-[#21313C]">
                                Chronological Lecture Register — {stat.subject.code} ({stat.subject.name})
                              </h4>
                              <span className="text-[11px] text-[#546574] font-mono">
                                {stat.records.length} Recorded Lecture(s)
                              </span>
                            </div>

                            {stat.records.length === 0 ? (
                              <p className="text-xs text-[#8D9BA8] italic py-2">
                                No session logs recorded in university attendance ledger for this subject yet.
                              </p>
                            ) : (
                              <table className="w-full text-left text-xs border border-[#EAEDF0] rounded-md overflow-hidden">
                                <thead>
                                  <tr className="bg-[#F8F8FA] text-[10px] font-bold uppercase text-[#8D9BA8] border-b border-[#EAEDF0]">
                                    <th className="p-2.5">Date</th>
                                    <th className="p-2.5">Period</th>
                                    <th className="p-2.5">Faculty Instructor</th>
                                    <th className="p-2.5 text-center">Attendance Status</th>
                                    <th className="p-2.5">Remarks</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-[#EAEDF0]">
                                  {stat.records.map((rec) => (
                                    <tr key={rec.id} className="hover:bg-[#F8F9FA]">
                                      <td className="p-2.5 font-mono text-[#21313C]">{formatDate(rec.session.date)}</td>
                                      <td className="p-2.5 font-mono text-[#546574]">Period {rec.session.periodNumber}</td>
                                      <td className="p-2.5 text-[#21313C]">{rec.session.faculty.user.name}</td>
                                      <td className="p-2.5 text-center">
                                        <span
                                          className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                                            rec.status === "PRESENT"
                                              ? "bg-[#EAF7F0] text-[#16845B] border-[#B7EAD0]"
                                              : "bg-[#FCEDEF] text-[#C23B4A] border-[#F9CBD2]"
                                          }`}
                                        >
                                          {rec.status}
                                        </span>
                                      </td>
                                      <td className="p-2.5 text-[#546574] text-[11px]">{rec.remarks || "—"}</td>
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

      {/* Leave / Condonation Application Modal */}
      {condonationModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full border border-[#EAEDF0] overflow-hidden">
            <div className="px-5 py-3.5 bg-[#F8F8FA] border-b border-[#EAEDF0] flex items-center justify-between">
              <span className="text-xs font-bold text-[#21313C] flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#027EA1]" />
                <span>Statutory Leave & Attendance Condonation Request</span>
              </span>
              <button
                type="button"
                onClick={() => setCondonationModalOpen(false)}
                className="p-1 rounded-md text-[#8D9BA8] hover:text-[#21313C] hover:bg-[#F1F2F5] transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleLeaveSubmit} className="p-5 space-y-4 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-[#21313C] mb-1">
                  Subject / Course
                </label>
                <select
                  value={selectedSubjectForLeave}
                  onChange={(e) => setSelectedSubjectForLeave(e.target.value)}
                  className="w-full px-3 py-2 bg-[#F8F9FA] border border-[#E2E8F0] rounded-lg text-xs text-[#21313C] focus:outline-none focus:ring-1 focus:ring-[#027EA1]"
                >
                  <option value="All Subjects">All Semester Subjects</option>
                  {subjects.map((s) => (
                    <option key={s.subject.id} value={s.subject.name}>
                      {s.subject.code} — {s.subject.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-[#21313C] mb-1">
                    Absence Start Date
                  </label>
                  <input
                    type="date"
                    required
                    value={leaveStartDate}
                    onChange={(e) => setLeaveStartDate(e.target.value)}
                    className="w-full px-3 py-2 bg-[#F8F9FA] border border-[#E2E8F0] rounded-lg text-xs text-[#21313C] focus:outline-none focus:ring-1 focus:ring-[#027EA1]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-[#21313C] mb-1">
                    Absence End Date
                  </label>
                  <input
                    type="date"
                    required
                    value={leaveEndDate}
                    onChange={(e) => setLeaveEndDate(e.target.value)}
                    className="w-full px-3 py-2 bg-[#F8F9FA] border border-[#E2E8F0] rounded-lg text-xs text-[#21313C] focus:outline-none focus:ring-1 focus:ring-[#027EA1]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#21313C] mb-1">
                  Reason for Condonation / Absence <span className="text-[#027EA1]">*</span>
                </label>
                <textarea
                  rows={3}
                  required
                  value={leaveReason}
                  onChange={(e) => setLeaveReason(e.target.value)}
                  placeholder="Provide institutional rationale (e.g. Medical emergency, University Sports Representation, Academic Olympiad)..."
                  className="w-full p-2.5 bg-[#F8F9FA] border border-[#E2E8F0] rounded-lg text-xs text-[#21313C] focus:outline-none focus:ring-1 focus:ring-[#027EA1]"
                />
              </div>

              <div className="p-3 rounded-lg bg-[#FFF7E6] border border-[#FDE5A9] text-[11px] text-[#B7791F]">
                Condonation applications are subject to approval by the Head of Department and Dean Academics under JLU Examination By-Laws (Regulation 14.2).
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setCondonationModalOpen(false)}
                  className="px-3.5 py-1.5 bg-white border border-[#E2E8F0] text-[#546574] hover:text-[#21313C] rounded-lg text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingLeave}
                  className="px-4 py-1.5 bg-[#027EA1] hover:bg-[#026A88] text-white rounded-lg text-xs font-bold transition flex items-center gap-1.5 disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{submittingLeave ? "Submitting..." : "Submit Application"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
