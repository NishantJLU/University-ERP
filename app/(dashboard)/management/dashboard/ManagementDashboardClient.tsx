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
  ShieldCheck,
} from "lucide-react";
import { JLU_PROFILE } from "@/lib/jlu-constants";
import DashboardHeader from "@/components/ui/DashboardHeader";
import MetricCard from "@/components/ui/MetricCard";

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

const DONUT_COLORS = ["#16845B", "#8B1E3F", "#3574B9", "#B7791F", "#172B4D"];

export default function ManagementDashboardClient({
  stats,
  deptData,
  feeData,
}: ManagementDashboardClientProps) {
  const realizationRate = Math.round(
    (stats.totalCollected / (stats.totalBilled || 1)) * 100
  );

  return (
    <div className="space-y-6">
      {/* 1. Refined Executive Hero Header */}
      <DashboardHeader
        badge="EXECUTIVE COUNCIL • GOVERNANCE"
        title="JLU Institutional Management Overview"
        subtitle="Jagran Lakecity University Executive Council • One Connected Multidisciplinary Campus Ecosystem"
        userMeta={`Bhopal, MP • AY ${JLU_PROFILE.currentAcademicYear}`}
        accent="crimson"
        actions={
          <div className="flex items-center gap-2">
            <div className="px-3 py-1.5 rounded-lg bg-[#F9FAFB] border border-[#E5E7EB] text-[#172B4D] text-xs font-semibold flex items-center gap-2 shadow-xs">
              <span className="w-2 h-2 rounded-full bg-[#16845B] animate-pulse" />
              <span>Central Relational Core Online</span>
            </div>
            <Link
              href="/management/reports"
              className="px-3.5 py-2 bg-[#8B1E3F] hover:bg-[#701831] text-white rounded-lg text-xs font-bold shadow-xs transition flex items-center gap-1.5"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Governance Reports</span>
            </Link>
          </div>
        }
      />

      {/* 2. Executive Oversight & Strategic Action Priorities */}
      <div className="erp-card p-5 space-y-3">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-rose-600 animate-ping" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800">
              Executive Oversight & Strategic Escalations
            </h2>
          </div>
          <span className="text-xs font-semibold text-rose-700 bg-rose-50 px-2.5 py-0.5 rounded-md border border-rose-200">
            Strategic Priorities
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Link
            href="/management/reports"
            className="p-4 rounded-xl border border-rose-200/80 bg-rose-50/50 hover:bg-rose-50 hover:border-rose-300 transition flex items-start gap-3 group"
          >
            <div className="p-2.5 bg-rose-100 rounded-lg text-rose-700 shrink-0">
              <FileText className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="text-xs font-bold text-rose-950 group-hover:text-rose-800 flex items-center gap-1">
                <span>Executive Council Reports</span>
                <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
              </div>
              <p className="text-[11px] text-rose-800/80 mt-1 leading-relaxed">
                Audit departmental census, academic metrics & NAAC accreditation compliance
              </p>
            </div>
          </Link>

          <Link
            href="/management/analytics"
            className="p-4 rounded-xl border border-amber-200/80 bg-amber-50/50 hover:bg-amber-50 hover:border-amber-300 transition flex items-start gap-3 group"
          >
            <div className="p-2.5 bg-amber-100 rounded-lg text-amber-700 shrink-0">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="text-xs font-bold text-amber-950 group-hover:text-amber-800 flex items-center gap-1">
                <span>Program Intake & Quota Analytics</span>
                <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
              </div>
              <p className="text-[11px] text-amber-800/80 mt-1 leading-relaxed">
                Review admissions pipeline vs capacity across university faculties
              </p>
            </div>
          </Link>

          <Link
            href="/accounts/reconciliation"
            className="p-4 rounded-xl border border-blue-200/80 bg-blue-50/50 hover:bg-blue-50 hover:border-blue-300 transition flex items-start gap-3 group"
          >
            <div className="p-2.5 bg-blue-100 rounded-lg text-blue-700 shrink-0">
              <CreditCard className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="text-xs font-bold text-blue-950 group-hover:text-blue-800 flex items-center gap-1">
                <span>Receivables & Treasury Flow</span>
                <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
              </div>
              <p className="text-[11px] text-blue-800/80 mt-1 leading-relaxed">
                {formatCurrency(stats.outstanding)} pending collection across departments
              </p>
            </div>
          </Link>
        </div>
      </div>

      {/* 3. Official Institutional Profile Ribbon */}
      <div className="rounded-xl bg-white text-[#172B4D] p-6 border border-[#E5E7EB] shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#E5E7EB]">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#8B1E3F]" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#8B1E3F]">
              Official University Institutional Profile
            </h2>
          </div>
          <span className="text-[10px] text-[#8490A0] font-mono">
            Source: Official Jagran Lakecity University Charter (jlu.edu.in)
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 text-center">
          <div className="p-3 rounded-lg bg-[#F9FAFB] border border-[#E5E7EB]">
            <span className="text-lg font-black text-[#172B4D] block">232-Acre</span>
            <span className="text-[10px] text-[#475569]">Green Campus</span>
          </div>
          <div className="p-3 rounded-lg bg-[#F9FAFB] border border-[#E5E7EB]">
            <span className="text-lg font-black text-[#172B4D] block">2,500+</span>
            <span className="text-[10px] text-[#475569]">Total Census</span>
          </div>
          <div className="p-3 rounded-lg bg-[#F9FAFB] border border-[#E5E7EB]">
            <span className="text-lg font-black text-[#172B4D] block">50+</span>
            <span className="text-[10px] text-[#475569]">Degree Programs</span>
          </div>
          <div className="p-3 rounded-lg bg-[#F9FAFB] border border-[#E5E7EB]">
            <span className="text-lg font-black text-[#172B4D] block">45+</span>
            <span className="text-[10px] text-[#475569]">Global Ties</span>
          </div>
          <div className="p-3 rounded-lg bg-[#F9FAFB] border border-[#E5E7EB]">
            <span className="text-lg font-black text-[#172B4D] block">42+</span>
            <span className="text-[10px] text-[#475569]">Industry Tie-ups</span>
          </div>
          <div className="p-3 rounded-lg bg-[#F9FAFB] border border-[#E5E7EB]">
            <span className="text-lg font-black text-[#172B4D] block">45+</span>
            <span className="text-[10px] text-[#475569]">Advanced Labs</span>
          </div>
          <div className="p-3 rounded-lg bg-[#F9FAFB] border border-[#E5E7EB] col-span-2 sm:col-span-1">
            <span className="text-lg font-black text-[#172B4D] block">1-on-1</span>
            <span className="text-[10px] text-[#475569]">Mentoring Ratio</span>
          </div>
        </div>
      </div>

      {/* 4. Live Operational ERP Census (4 MetricCards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Current Enrolled Roster"
          value={stats.totalStudents}
          color="blue"
          icon={GraduationCap}
          badge="Live Census"
          subtitle={`Across ${stats.totalPrograms} Degree Programs`}
          href="/management/analytics"
          actionText="Intake Analytics"
        />

        <MetricCard
          title="Active Faculty Body"
          value={stats.totalFaculty}
          color="green"
          icon={Users}
          badge="Academic Staff"
          subtitle="Verified Teaching Appointments"
          href="/management/analytics"
          actionText="Faculty Distribution"
        />

        <MetricCard
          title="Net Fee Remittance"
          value={formatCurrency(stats.totalCollected)}
          color="crimson"
          icon={TrendingUp}
          badge={`${realizationRate}% Realized`}
          subtitle={`Outstanding: ${formatCurrency(stats.outstanding)}`}
          href="/accounts/reports"
          actionText="Treasury Analytics"
        />

        <MetricCard
          title="Aggregate Attendance"
          value={`${stats.attendanceAvg}%`}
          color="purple"
          icon={CheckSquare}
          badge="Above 75% Cutoff"
          subtitle="University Statutory Compliance Bar"
          href="/management/analytics"
          actionText="Compliance Metrics"
        />
      </div>

      {/* 5. Visual Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Department Enrollment Distribution */}
        <div className="lg:col-span-7 erp-card p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-sm font-bold text-slate-900 tracking-tight">
                Student Enrollment by Academic School / Department
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Census distribution across Faculties & Specialized Schools
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md">
              {stats.totalDepartments} Departments
            </span>
          </div>

          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={deptData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#64748b" }} />
                <YAxis tick={{ fontSize: 11, fill: "#64748b" }} />
                <Tooltip
                  formatter={(val: any) => [`${val} Students`, "Enrollment"]}
                  contentStyle={{
                    backgroundColor: "#ffffff",
                    borderRadius: "0.75rem",
                    border: "1px solid #e2e8f0",
                    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                    fontSize: "12px",
                    fontWeight: "600",
                  }}
                />
                <Bar dataKey="students" fill="#8B1E3F" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right: Fee Realization vs Outstanding */}
        <div className="lg:col-span-5 erp-card p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-sm font-bold text-slate-900 tracking-tight">
                Treasury Fee Realization vs Outstanding
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Current academic year collection realization ratio
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
              {realizationRate}% Realized
            </span>
          </div>

          <div className="h-60 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={feeData}
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={95}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {feeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={DONUT_COLORS[index % DONUT_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(val: any) => [formatCurrency(Number(val)), "Amount"]}
                  contentStyle={{
                    backgroundColor: "#ffffff",
                    borderRadius: "0.75rem",
                    border: "1px solid #e2e8f0",
                    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                    fontSize: "12px",
                    fontWeight: "600",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="flex justify-center gap-6 text-xs pt-1 border-t border-slate-100">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#16845B]" />
              <span className="text-[#475569] font-medium">
                Collected: <span className="font-bold text-[#172B4D] font-mono">{formatCurrency(stats.totalCollected)}</span>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#8B1E3F]" />
              <span className="text-[#475569] font-medium">
                Outstanding: <span className="font-bold text-[#8B1E3F] font-mono">{formatCurrency(stats.outstanding)}</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 6. Global Partnerships & Strategic Collaborations */}
      <div className="erp-card p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Globe2 className="w-4 h-4 text-blue-600" />
              <span>Global Partnerships & Experiential Industry Collaborations</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Verified institutional consortia delivering student exchange, global immersion & corporate mentoring
            </p>
          </div>
          <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2.5 py-1 rounded-md border border-rose-200 self-start sm:self-auto">
            {JLU_PROFILE.internationalCollaborations} Global Collaborations
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-slate-50/70 border border-slate-200/80 hover:border-slate-300 transition space-y-2">
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

          <div className="p-4 rounded-xl bg-slate-50/70 border border-slate-200/80 hover:border-slate-300 transition space-y-2">
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

          <div className="p-4 rounded-xl bg-slate-50/70 border border-slate-200/80 hover:border-slate-300 transition space-y-2">
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
