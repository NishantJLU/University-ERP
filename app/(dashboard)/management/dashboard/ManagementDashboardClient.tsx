"use client";

import Link from "next/link";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { formatCurrency } from "@/lib/utils";
import {
  Building,
  GraduationCap,
  Users,
  TrendingUp,
  CheckSquare,
  CreditCard,
  Globe2,
  Briefcase,
  Sparkles,
  Award,
  Layers,
  ExternalLink,
  ArrowRight,
  AlertTriangle,
  FileText,
} from "lucide-react";
import { JLU_PROFILE } from "@/lib/jlu-constants";
import JLULogo from "@/components/ui/JLULogo";

interface ManagementDashboardClientProps {
  stats: {
    totalStudents: number;
    totalFaculty: number;
    totalDepartments: number;
    totalPrograms: number;
    totalBilled: number;
    totalCollected: number;
    outstanding: number;
    attendanceAvg: number;
  };
  deptData: any[];
  feeData: any[];
}

const COLORS = ["#e11d48", "#1e40af", "#10b981", "#8b5cf6", "#f59e0b"];

export default function ManagementDashboardClient({
  stats,
  deptData,
  feeData,
}: ManagementDashboardClientProps) {
  return (
    <div className="space-y-6">
      {/* Executive Banner */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-rose-950 text-white p-6 sm:p-8 rounded-2xl shadow-md border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-500/20 text-rose-300 border border-rose-400/30">
              Institutional Governance & Macro Strategy
            </span>
            <span className="text-xs text-slate-400">
              AY {JLU_PROFILE.currentAcademicYear}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            JLU Institutional Overview
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            Jagran Lakecity University Executive Council • One Connected Multidisciplinary Campus
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="px-3.5 py-1.5 rounded-xl bg-white/10 border border-white/20 text-xs font-semibold backdrop-blur-xs flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>ERP Central Engine Online</span>
          </div>
        </div>
      </div>

      {/* Action Required: Executive Oversight & Strategic Escalations */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-600" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800">
              Action Required & Executive Oversight
            </h2>
          </div>
          <span className="text-[11px] font-semibold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-100">
            Strategic Priorities
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Link
            href="/management/reports"
            className="p-3.5 rounded-xl border border-rose-200 bg-rose-50/50 hover:bg-rose-50 transition flex items-start gap-3 group"
          >
            <div className="p-2 bg-rose-100 rounded-lg text-rose-700 shrink-0">
              <FileText className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="text-xs font-bold text-rose-950 group-hover:text-rose-800 flex items-center gap-1">
                <span>Executive Council Reports</span>
                <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
              </div>
              <p className="text-[11px] text-rose-800/80 mt-0.5">
                Audit departmental census, academic metrics & NAAC compliance
              </p>
            </div>
          </Link>

          <Link
            href="/management/analytics"
            className="p-3.5 rounded-xl border border-amber-200 bg-amber-50/50 hover:bg-amber-50 transition flex items-start gap-3 group"
          >
            <div className="p-2 bg-amber-100 rounded-lg text-amber-700 shrink-0">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="text-xs font-bold text-amber-950 group-hover:text-amber-800 flex items-center gap-1">
                <span>Program Intake & Quota Analytics</span>
                <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
              </div>
              <p className="text-[11px] text-amber-800/80 mt-0.5">
                Review admissions pipeline vs capacity across faculties
              </p>
            </div>
          </Link>

          <Link
            href="/accounts/reconciliation"
            className="p-3.5 rounded-xl border border-blue-200 bg-blue-50/50 hover:bg-blue-50 transition flex items-start gap-3 group"
          >
            <div className="p-2 bg-blue-100 rounded-lg text-blue-700 shrink-0">
              <CreditCard className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="text-xs font-bold text-blue-950 group-hover:text-blue-800 flex items-center gap-1">
                <span>Receivables & Treasury Flow</span>
                <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
              </div>
              <p className="text-[11px] text-blue-800/80 mt-0.5">
                {formatCurrency(stats.outstanding)} pending collection across departments
              </p>
            </div>
          </Link>
        </div>
      </div>

      {/* Official Institutional Profile (Distinguished from Live ERP Metrics) */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 border border-slate-800 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-amber-300">
              Official University Institutional Profile
            </h2>
          </div>
          <span className="text-[10px] text-slate-400 font-mono">
            Source: Official Jagran Lakecity University Charter (jlu.edu.in)
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 text-center">
          <div className="p-3 rounded-xl bg-white/5 border border-white/10">
            <span className="text-lg font-black text-white block">232-Acre</span>
            <span className="text-[10px] text-slate-400">Green Campus</span>
          </div>
          <div className="p-3 rounded-xl bg-white/5 border border-white/10">
            <span className="text-lg font-black text-white block">2,500+</span>
            <span className="text-[10px] text-slate-400">Total Census</span>
          </div>
          <div className="p-3 rounded-xl bg-white/5 border border-white/10">
            <span className="text-lg font-black text-white block">50+</span>
            <span className="text-[10px] text-slate-400">Degree Programs</span>
          </div>
          <div className="p-3 rounded-xl bg-white/5 border border-white/10">
            <span className="text-lg font-black text-white block">45+</span>
            <span className="text-[10px] text-slate-400">Global Ties</span>
          </div>
          <div className="p-3 rounded-xl bg-white/5 border border-white/10">
            <span className="text-lg font-black text-white block">42+</span>
            <span className="text-[10px] text-slate-400">Industry Tie-ups</span>
          </div>
          <div className="p-3 rounded-xl bg-white/5 border border-white/10">
            <span className="text-lg font-black text-white block">45+</span>
            <span className="text-[10px] text-slate-400">Advanced Labs</span>
          </div>
          <div className="p-3 rounded-xl bg-white/5 border border-white/10 col-span-2 sm:col-span-1">
            <span className="text-lg font-black text-white block">1-on-1</span>
            <span className="text-[10px] text-slate-400">Mentoring Ratio</span>
          </div>
        </div>
      </div>

      {/* Live Operational ERP KPIs */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Live ERP Operational Census
          </span>
          <span className="text-[10px] px-2 py-0.2 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold">
            Real-Time Database Records
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl shadow-xs border border-slate-200">
            <span className="text-xs font-bold uppercase text-slate-400">Current Enrolled Roster</span>
            <p className="text-3xl font-extrabold text-slate-900 mt-1">{stats.totalStudents}</p>
            <span className="text-[11px] text-slate-500">Across {stats.totalPrograms} Active Programs</span>
          </div>

          <div className="bg-white p-5 rounded-2xl shadow-xs border border-slate-200">
            <span className="text-xs font-bold uppercase text-slate-400">Active Faculty Body</span>
            <p className="text-3xl font-extrabold text-slate-900 mt-1">{stats.totalFaculty}</p>
            <span className="text-[11px] text-emerald-600 font-semibold">Verified Academic Appointments</span>
          </div>

          <div className="bg-white p-5 rounded-2xl shadow-xs border border-slate-200">
            <span className="text-xs font-bold uppercase text-rose-600">Net Fee Remittance</span>
            <p className="text-3xl font-extrabold text-rose-700 mt-1">{formatCurrency(stats.totalCollected)}</p>
            <span className="text-[11px] text-slate-500">
              {Math.round((stats.totalCollected / (stats.totalBilled || 1)) * 100)}% Realization Rate
            </span>
          </div>

          <div className="bg-white p-5 rounded-2xl shadow-xs border border-slate-200">
            <span className="text-xs font-bold uppercase text-purple-600">Aggregate Class Attendance</span>
            <p className="text-3xl font-extrabold text-purple-700 mt-1">{stats.attendanceAvg}%</p>
            <span className="text-[11px] text-emerald-600 font-semibold">Above 75.0% Compliance Bar</span>
          </div>
        </div>
      </div>

      {/* Visual Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Department Enrollment Distribution */}
        <div className="lg:col-span-7 bg-white rounded-2xl shadow-xs border border-slate-200 p-6 space-y-4">
          <h2 className="text-sm font-bold text-slate-900">
            Student Enrollment by Academic School / Department
          </h2>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={deptData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#64748b" }} />
                <YAxis tick={{ fontSize: 11, fill: "#64748b" }} />
                <Tooltip
                  formatter={(val: any) => [`${val} Students`, "Enrollment"]}
                  contentStyle={{ borderRadius: "8px", fontSize: "12px" }}
                />
                <Bar dataKey="students" fill="#e11d48" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right: Fee Realization vs Outstanding */}
        <div className="lg:col-span-5 bg-white rounded-2xl shadow-xs border border-slate-200 p-6 space-y-4">
          <h2 className="text-sm font-bold text-slate-900">
            Treasury Fee Realization vs Outstanding
          </h2>
          <div className="h-72 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={feeData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={95}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {feeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(val: any) => [formatCurrency(Number(val)), "Amount"]}
                  contentStyle={{ borderRadius: "8px", fontSize: "12px" }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="flex justify-center gap-6 text-xs">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-rose-600" />
              <span className="text-slate-600">Collected: {formatCurrency(stats.totalCollected)}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-blue-800" />
              <span className="text-slate-600">Receivables: {formatCurrency(stats.outstanding)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Global Partnerships & Industry Connections Section */}
      <div className="bg-white rounded-2xl shadow-xs border border-slate-200 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Globe2 className="w-4 h-4 text-blue-600" />
              Global Partnerships & Experiential Industry Collaborations
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Verified institutional consortia delivering student exchange, global immersion & corporate mentoring
            </p>
          </div>
          <span className="text-xs font-bold text-rose-600">{JLU_PROFILE.internationalCollaborations} Global Collaborations</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="flex items-center gap-2 text-rose-600 font-bold">
              <Globe2 className="w-4 h-4" />
              <span>International Academic Linkages</span>
            </div>
            <p className="text-slate-600 text-[11px] leading-relaxed">
              Collaborative student progression, dual-degree pathways, semester abroad, and joint research symposiums across leading UK, US, and European universities.
            </p>
            <span className="text-[10px] font-mono text-slate-400 block pt-1">
              45+ MOUs Established
            </span>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="flex items-center gap-2 text-emerald-600 font-bold">
              <Briefcase className="w-4 h-4" />
              <span>Industry Tie-ups & Labs</span>
            </div>
            <p className="text-slate-600 text-[11px] leading-relaxed">
              Co-created specialized curricula, corporate internships, on-campus innovation hubs, and specialized technological certifications with Fortune 500 partners.
            </p>
            <span className="text-[10px] font-mono text-slate-400 block pt-1">
              42+ Corporate Alliances
            </span>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="flex items-center gap-2 text-purple-600 font-bold">
              <Award className="w-4 h-4" />
              <span>Experiential Learning & Placements</span>
            </div>
            <p className="text-slate-600 text-[11px] leading-relaxed">
              Industry immersion from semester 1, capstone live client projects, corporate mentorship programs, and multidisciplinary hackathons.
            </p>
            <span className="text-[10px] font-mono text-slate-400 block pt-1">
              Continuous Career Incubation
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
