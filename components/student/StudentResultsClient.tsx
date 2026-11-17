"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Download,
  FileText,
  TrendingUp,
  HelpCircle,
  Calendar,
  ShieldCheck,
  RotateCcw,
} from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";

interface CourseResult {
  code: string;
  name: string;
  credits: number;
  internal: number;
  maxInternal: number;
  external: number;
  maxExternal: number;
  total: number;
  maxTotal: number;
  grade: string;
  gradePoints: number;
  status: "PASS" | "FAIL";
}

interface SemesterData {
  semNumber: number;
  title: string;
  sgpa: number;
  credits: number;
  examMonth: string;
  courses: CourseResult[];
}

const SEMESTER_RECORDS: Record<number, SemesterData> = {
  1: {
    semNumber: 1,
    title: "Semester 1 (Autumn 2025)",
    sgpa: 8.83,
    credits: 24,
    examMonth: "December 2025",
    courses: [
      {
        code: "CS101",
        name: "Engineering Mathematics I",
        credits: 4,
        internal: 38,
        maxInternal: 40,
        external: 52,
        maxExternal: 60,
        total: 90,
        maxTotal: 100,
        grade: "A+",
        gradePoints: 10,
        status: "PASS",
      },
      {
        code: "CS102",
        name: "Problem Solving with C & C++",
        credits: 4,
        internal: 37,
        maxInternal: 40,
        external: 51,
        maxExternal: 60,
        total: 88,
        maxTotal: 100,
        grade: "A",
        gradePoints: 9,
        status: "PASS",
      },
      {
        code: "CS103",
        name: "Digital Electronics & Logic Design",
        credits: 4,
        internal: 36,
        maxInternal: 40,
        external: 49,
        maxExternal: 60,
        total: 85,
        maxTotal: 100,
        grade: "A",
        gradePoints: 9,
        status: "PASS",
      },
      {
        code: "CS104",
        name: "Engineering Physics & Semiconductor Devices",
        credits: 4,
        internal: 35,
        maxInternal: 40,
        external: 48,
        maxExternal: 60,
        total: 83,
        maxTotal: 100,
        grade: "A",
        gradePoints: 9,
        status: "PASS",
      },
      {
        code: "CS105",
        name: "Technical Communication & Professional Ethics",
        credits: 4,
        internal: 39,
        maxInternal: 40,
        external: 53,
        maxExternal: 60,
        total: 92,
        maxTotal: 100,
        grade: "A+",
        gradePoints: 10,
        status: "PASS",
      },
      {
        code: "CS106",
        name: "Computing & IT Workshop Practicals",
        credits: 4,
        internal: 39,
        maxInternal: 40,
        external: 51,
        maxExternal: 60,
        total: 90,
        maxTotal: 100,
        grade: "A+",
        gradePoints: 10,
        status: "PASS",
      },
    ],
  },
  2: {
    semNumber: 2,
    title: "Semester 2 (Spring 2026)",
    sgpa: 9.0,
    credits: 24,
    examMonth: "May 2026",
    courses: [
      {
        code: "CS201",
        name: "Discrete Mathematical Structures",
        credits: 4,
        internal: 37,
        maxInternal: 40,
        external: 50,
        maxExternal: 60,
        total: 87,
        maxTotal: 100,
        grade: "A",
        gradePoints: 9,
        status: "PASS",
      },
      {
        code: "CS202",
        name: "Data Structures & Modern Algorithms",
        credits: 4,
        internal: 39,
        maxInternal: 40,
        external: 55,
        maxExternal: 60,
        total: 94,
        maxTotal: 100,
        grade: "A+",
        gradePoints: 10,
        status: "PASS",
      },
      {
        code: "CS203",
        name: "Object Oriented Programming via Java",
        credits: 4,
        internal: 38,
        maxInternal: 40,
        external: 52,
        maxExternal: 60,
        total: 90,
        maxTotal: 100,
        grade: "A+",
        gradePoints: 10,
        status: "PASS",
      },
      {
        code: "CS204",
        name: "Computer Organization & Architecture",
        credits: 4,
        internal: 36,
        maxInternal: 40,
        external: 51,
        maxExternal: 60,
        total: 87,
        maxTotal: 100,
        grade: "A",
        gradePoints: 9,
        status: "PASS",
      },
      {
        code: "CS205",
        name: "Principles of Programming Languages",
        credits: 4,
        internal: 37,
        maxInternal: 40,
        external: 52,
        maxExternal: 60,
        total: 89,
        maxTotal: 100,
        grade: "A",
        gradePoints: 9,
        status: "PASS",
      },
      {
        code: "CS206",
        name: "Design & Analysis of Basic Algorithms",
        credits: 4,
        internal: 38,
        maxInternal: 40,
        external: 53,
        maxExternal: 60,
        total: 91,
        maxTotal: 100,
        grade: "A+",
        gradePoints: 10,
        status: "PASS",
      },
    ],
  },
};

interface StudentResultsClientProps {
  student: any;
}

export default function StudentResultsClient({ student }: StudentResultsClientProps) {
  const [selectedSemester, setSelectedSemester] = useState<number | "ALL">(2);
  const [reevalModalOpen, setReevalModalOpen] = useState(false);
  const [selectedCourseForReeval, setSelectedCourseForReeval] = useState<string>("");

  const activeSemData =
    selectedSemester === "ALL"
      ? null
      : SEMESTER_RECORDS[selectedSemester] || SEMESTER_RECORDS[2];

  const handlePrintMarksheet = () => {
    window.print();
  };

  const handleRequestOfficialTranscript = () => {
    alert(
      "Official Transcript Request submitted to Registrar Office.\nTracking Ref: TRN-2026-JLU-8819\nDispatched digitally within 48 working hours."
    );
  };

  const getGradeBadge = (grade: string) => {
    switch (grade) {
      case "A+":
        return "bg-emerald-50 text-emerald-800 border-emerald-300";
      case "A":
        return "bg-teal-50 text-teal-800 border-teal-300";
      case "B+":
        return "bg-blue-50 text-blue-800 border-blue-300";
      case "B":
        return "bg-slate-100 text-slate-800 border-slate-300";
      default:
        return "bg-red-50 text-red-800 border-red-300";
    }
  };

  return (
    <div className="space-y-4 font-sans text-slate-800">
      {/* Header & Utilitarian Breadcrumbs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
        <div>
          <nav className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
            <Link href="/student/dashboard" className="hover:text-slate-800">
              Dashboard
            </Link>
            <span>/</span>
            <span className="text-slate-600">Academic Records</span>
            <span>/</span>
            <span className="text-slate-900 font-medium">Results & Transcripts</span>
          </nav>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Examination Grade Sheet & Official Transcripts
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Office of the Controller of Examinations • Verified Academic Ledger (CGPA / SGPA)
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handlePrintMarksheet}
            className="px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-sm text-xs font-semibold flex items-center gap-1.5 transition"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Marksheet PDF</span>
          </button>

          <button
            type="button"
            onClick={handleRequestOfficialTranscript}
            className="px-3 py-1.5 bg-blue-700 hover:bg-blue-800 text-white rounded-sm text-xs font-bold transition flex items-center gap-1.5"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Official Transcript</span>
          </button>
        </div>
      </div>

      {/* Dense KPI Metric Strip */}
      <div className="border border-slate-300 bg-white rounded-sm p-3 grid grid-cols-2 lg:grid-cols-4 gap-3 divide-y lg:divide-y-0 lg:divide-x divide-slate-200">
        <div className="pr-3">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
            Cumulative GPA (CGPA)
          </span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-2xl font-bold font-mono text-slate-900">8.92</span>
            <span className="text-xs text-slate-400 font-semibold font-mono">/ 10.0</span>
          </div>
          <span className="text-[10px] text-emerald-700 font-semibold mt-0.5 block">
            Cohort Rank 3 in Section A (Top 5%)
          </span>
        </div>

        <div className="pt-2 lg:pt-0 lg:px-3">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
            Semester SGPA
          </span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-2xl font-bold font-mono text-slate-900">
              {activeSemData ? activeSemData.sgpa : "8.92"}
            </span>
            <span className="text-xs text-slate-400 font-semibold font-mono">/ 10.0</span>
          </div>
          <span className="text-[10px] text-slate-500 mt-0.5 block">
            {selectedSemester === "ALL" ? "Cumulative Across Sem 1 & 2" : activeSemData?.title}
          </span>
        </div>

        <div className="pt-2 lg:pt-0 lg:px-3">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
            Earned Academic Credits
          </span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-2xl font-bold font-mono text-slate-900">
              {selectedSemester === "ALL" ? "48" : `${activeSemData?.credits}`}
            </span>
            <span className="text-xs text-slate-400 font-semibold font-mono">
              {selectedSemester === "ALL" ? "/ 48 Total" : "/ 24 Total"}
            </span>
          </div>
          <span className="text-[10px] text-slate-500 mt-0.5 block">
            Sem 1 (24) + Sem 2 (24) = 48 Credits
          </span>
        </div>

        <div className="pt-2 lg:pt-0 lg:pl-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
              Academic Standing
            </span>
            <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
          </div>
          <p className="text-xl font-bold text-emerald-800 mt-1">Exemplary</p>
          <span className="text-[10px] text-slate-500 mt-0.5 block">Zero backlogs on university record</span>
        </div>
      </div>

      {/* Mini CGPA Trend Across Semesters */}
      <div className="border border-slate-300 bg-white rounded-sm p-3 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5 text-slate-700" />
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              CGPA Progression Audit
            </h3>
          </div>
          <span className="text-[11px] text-emerald-700 font-semibold">+0.17 SGPA progression in Semester 2</span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
          <div className="p-2.5 rounded-xs bg-slate-50 border border-slate-300">
            <span className="text-slate-500 text-[10px] uppercase font-bold block">Semester 1</span>
            <p className="text-sm font-bold text-slate-900 font-mono mt-0.5">8.83 SGPA</p>
            <span className="text-[10px] text-slate-500">24 Credits Earned</span>
          </div>
          <div className="p-2.5 rounded-xs bg-slate-50 border border-slate-300">
            <span className="text-slate-500 text-[10px] uppercase font-bold block">Semester 2</span>
            <p className="text-sm font-bold text-slate-900 font-mono mt-0.5">9.00 SGPA</p>
            <span className="text-[10px] text-slate-500">24 Credits Earned</span>
          </div>
          <div className="p-2.5 rounded-xs bg-slate-50 border border-dashed border-slate-300 text-slate-500">
            <span className="text-[10px] uppercase font-bold block">Semester 3 (Current)</span>
            <p className="text-xs font-semibold text-slate-700 mt-0.5">Under Assessment</p>
            <span className="text-[10px] text-slate-400">Nov 2026 Term</span>
          </div>
          <div className="p-2.5 rounded-xs bg-slate-50 border border-dashed border-slate-300 text-slate-500">
            <span className="text-[10px] uppercase font-bold block">Semester 4</span>
            <p className="text-xs font-semibold text-slate-700 mt-0.5">Scheduled</p>
            <span className="text-[10px] text-slate-400">Spring 2027</span>
          </div>
        </div>
      </div>

      {/* Semester Tabs & Examination Table */}
      <div className="border border-slate-300 bg-white rounded-sm overflow-hidden">
        <div className="px-3.5 py-2.5 bg-slate-50 border-b border-slate-300 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          {/* Semester Selector Tabs */}
          <div className="flex items-center gap-1.5 text-xs">
            <button
              type="button"
              onClick={() => setSelectedSemester(1)}
              className={`px-2.5 py-1 rounded-xs font-semibold border transition ${
                selectedSemester === 1
                  ? "bg-slate-800 text-white border-slate-800 font-bold"
                  : "bg-white text-slate-700 hover:bg-slate-50 border-slate-300"
              }`}
            >
              Semester 1 (24 Credits)
            </button>
            <button
              type="button"
              onClick={() => setSelectedSemester(2)}
              className={`px-2.5 py-1 rounded-xs font-semibold border transition ${
                selectedSemester === 2
                  ? "bg-slate-800 text-white border-slate-800 font-bold"
                  : "bg-white text-slate-700 hover:bg-slate-50 border-slate-300"
              }`}
            >
              Semester 2 (24 Credits)
            </button>
            <button
              type="button"
              onClick={() => setSelectedSemester("ALL")}
              className={`px-2.5 py-1 rounded-xs font-semibold border transition ${
                selectedSemester === "ALL"
                  ? "bg-slate-800 text-white border-slate-800 font-bold"
                  : "bg-white text-slate-700 hover:bg-slate-50 border-slate-300"
              }`}
            >
              All Semesters (48 Credits)
            </button>
          </div>

          <div className="text-[11px] text-slate-600 flex items-center gap-1">
            <RotateCcw className="w-3 h-3 text-slate-500" />
            <span>Re-evaluation scrutiny window closes <strong>Oct 25, 2026</strong></span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100 border-b border-slate-300 text-[10px] font-bold uppercase tracking-wider text-slate-600">
                <th className="py-2.5 px-3">Subject Code</th>
                <th className="py-2.5 px-3">Course Title</th>
                <th className="py-2.5 px-3 text-center">Credits</th>
                <th className="py-2.5 px-3 text-right">Internal (40)</th>
                <th className="py-2.5 px-3 text-right">External (60)</th>
                <th className="py-2.5 px-3 text-right">Total (100)</th>
                <th className="py-2.5 px-3 text-center">Grade</th>
                <th className="py-2.5 px-3 text-center">Result</th>
                <th className="py-2.5 px-3 text-right">Re-Evaluation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {(selectedSemester === "ALL"
                ? [...SEMESTER_RECORDS[1].courses, ...SEMESTER_RECORDS[2].courses]
                : activeSemData?.courses || []
              ).map((course, idx) => (
                <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-2.5 px-3 font-mono font-bold text-slate-900 whitespace-nowrap">
                    {course.code}
                  </td>
                  <td className="py-2.5 px-3 font-medium text-slate-900">
                    {course.name}
                  </td>
                  <td className="py-2.5 px-3 text-center font-mono text-slate-700">
                    {course.credits}
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono text-slate-800">
                    {course.internal}
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono text-slate-800">
                    {course.external}
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-900">
                    {course.total}
                  </td>
                  <td className="py-2.5 px-3 text-center whitespace-nowrap">
                    <span
                      className={`inline-block px-1.5 py-0.2 rounded-xs text-[10px] font-bold border ${getGradeBadge(
                        course.grade
                      )}`}
                    >
                      {course.grade}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-center whitespace-nowrap">
                    <span className="text-[10px] font-bold text-emerald-800">PASS</span>
                  </td>
                  <td className="py-2.5 px-3 text-right whitespace-nowrap">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedCourseForReeval(`${course.code}: ${course.name}`);
                        setReevalModalOpen(true);
                      }}
                      className="text-[11px] text-blue-700 hover:underline font-semibold"
                    >
                      Request
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-slate-100 font-bold border-t border-slate-300">
                <td className="p-2.5 text-slate-900" colSpan={2}>
                  Reconciled Total
                </td>
                <td className="p-2.5 text-center font-mono text-slate-900">
                  {selectedSemester === "ALL" ? 48 : activeSemData?.credits}
                </td>
                <td className="p-2.5 text-right text-slate-500" colSpan={2}>
                  Aggregated Score
                </td>
                <td className="p-2.5 text-right font-mono text-slate-900">
                  {selectedSemester === "ALL" ? "1068 / 1200" : "538 / 600"}
                </td>
                <td className="p-2.5 text-center text-slate-900" colSpan={2}>
                  {selectedSemester === "ALL" ? "8.92 CGPA" : `${activeSemData?.sgpa} SGPA`}
                </td>
                <td className="p-2.5 text-right text-emerald-800 font-bold">
                  CLEARED
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Useful Extras: Upcoming Exams & Transcript Verification */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
        <div className="border border-slate-300 bg-white rounded-sm p-3.5 space-y-2">
          <div className="flex items-center gap-1.5 text-slate-900 font-bold uppercase tracking-wider text-[11px]">
            <Calendar className="w-3.5 h-3.5 text-slate-700" />
            <span>Upcoming Examination Schedule</span>
          </div>
          <div className="space-y-1.5">
            <div className="p-2 rounded-xs bg-slate-50 border border-slate-200 flex justify-between items-center">
              <div>
                <p className="font-bold text-slate-900">Mid-Term Assessment Autumn 2026</p>
                <p className="text-[11px] text-slate-500">October 26 – October 31, 2026</p>
              </div>
              <span className="px-1.5 py-0.2 rounded-xs text-[10px] font-bold bg-slate-200 text-slate-800 border border-slate-300">
                Seating Notified
              </span>
            </div>
            <div className="p-2 rounded-xs bg-slate-50 border border-slate-200 flex justify-between items-center">
              <div>
                <p className="font-bold text-slate-900">End-Term Theory Examinations</p>
                <p className="text-[11px] text-slate-500">November 24 – December 12, 2026</p>
              </div>
              <span className="px-1.5 py-0.2 rounded-xs text-[10px] font-bold bg-slate-200 text-slate-800 border border-slate-300">
                Draft Schedule
              </span>
            </div>
          </div>
        </div>

        <div className="border border-slate-300 bg-white rounded-sm p-3.5 space-y-2">
          <div className="flex items-center gap-1.5 text-slate-900 font-bold uppercase tracking-wider text-[11px]">
            <ShieldCheck className="w-3.5 h-3.5 text-slate-700" />
            <span>Digital Certificate Verification</span>
          </div>
          <p className="text-[11px] text-slate-500">
            All Jagran Lakecity University transcripts are signed by the Controller of Examinations and verifiable via the National Academic Depository (NAD / DigiLocker).
          </p>
          <div className="space-y-1 font-mono text-[11px] bg-slate-50 p-2.5 rounded-xs border border-slate-200 text-slate-700">
            <div className="flex justify-between">
              <span className="text-slate-400 font-sans">NAD Roll ID:</span>
              <span className="font-bold text-slate-900">{student.rollNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400 font-sans">Digital Seal:</span>
              <span className="text-slate-600 truncate max-w-[200px]">
                SHA256: 8a91bc729f38...
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Re-evaluation Modal */}
      {reevalModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-sm shadow-xl max-w-md w-full p-5 space-y-3 border border-slate-300">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <div className="flex items-center gap-1.5">
                <RotateCcw className="w-4 h-4 text-slate-700" />
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Request Answer Script Re-Evaluation
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setReevalModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <p className="text-[11px] text-slate-500">
              Apply for formal re-checking and scrutiny of End-Term theory answer booklet under University Examination Ordinance §14.
            </p>

            <div className="space-y-2.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Course Selected</label>
                <input
                  type="text"
                  readOnly
                  value={selectedCourseForReeval}
                  className="w-full p-1.5 border border-slate-300 bg-slate-50 rounded-xs text-slate-900 font-semibold text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Re-Evaluation Type</label>
                <select className="w-full p-1.5 border border-slate-300 rounded-xs text-xs focus:ring-1 focus:ring-slate-800 focus:outline-none">
                  <option>Totaling Verification & Retotaling (Fee: ₹300)</option>
                  <option>Complete Re-Evaluation by External Evaluator (Fee: ₹800)</option>
                  <option>Certified Photocopy of Evaluated Answer Script (Fee: ₹500)</option>
                </select>
              </div>

              <div className="p-2 bg-slate-50 border border-slate-300 rounded-xs text-slate-700 text-[11px]">
                <strong>Notice:</strong> Application deadline is <strong>October 25, 2026</strong>. Scrutiny reports are published in the student ledger within 21 days.
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setReevalModalOpen(false)}
                className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-sm border border-slate-300 transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  alert(
                    "Re-evaluation request registered with Office of Controller of Examinations. An invoice of ₹800 has been routed to your Fee Portal."
                  );
                  setReevalModalOpen(false);
                }}
                className="px-3.5 py-1.5 bg-blue-700 hover:bg-blue-800 text-white rounded-sm text-xs font-bold transition"
              >
                Submit Scrutiny Request
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
