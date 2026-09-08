"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  GraduationCap,
  Users,
  Building,
  School,
  Clock,
  CreditCard,
  AlertTriangle,
  CheckCircle2,
  Bell,
  ArrowRight,
  ShieldAlert,
  UserPlus,
  BookOpen,
  Layers,
  Calendar,
  ShieldCheck,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import EnrollStudentDrawer from "@/components/admin/drawers/EnrollStudentDrawer";
import OnboardFacultyDrawer from "@/components/admin/drawers/OnboardFacultyDrawer";
import CreateDepartmentDrawer from "@/components/admin/drawers/CreateDepartmentDrawer";
import CreateSubjectDrawer from "@/components/admin/drawers/CreateSubjectDrawer";
import PublishNoticeDrawer from "@/components/admin/drawers/PublishNoticeDrawer";
import { AttentionCard } from "@/components/admin/AttentionCard";
import { AuditEventItem, AuditLogItem } from "@/components/admin/AuditEventItem";

interface AdminDashboardClientProps {
  user: {
    name: string;
    role: string;
    email: string;
  };
  metrics: {
    studentCount: number;
    facultyCount: number;
    deptCount: number;
    progCount: number;
    roomCount: number;
    timetableCount: number;
    totalCollected: number;
    totalBilled: number;
    unassignedStudentsCount: number;
    unpaidFeeDuesCount: number;
    urgentNoticesCount: number;
    timetableConflictsCount?: number;
    incompleteDeptsCount?: number;
  };
  recentAudits: AuditLogItem[];
  masterData: {
    departments: Array<{ id: string; name: string; code: string }>;
    programs: Array<{ id: string; name: string; code: string }>;
    sections: Array<{ id: string; name: string }>;
    semesters: Array<{ id: string; number: number; programName: string }>;
  };
}

export default function AdminDashboardClient({
  user,
  metrics,
  recentAudits,
  masterData,
}: AdminDashboardClientProps) {
  // Drawer states
  const [isEnrollStudentOpen, setIsEnrollStudentOpen] = useState(false);
  const [isOnboardFacultyOpen, setIsOnboardFacultyOpen] = useState(false);
  const [isCreateDeptOpen, setIsCreateDeptOpen] = useState(false);
  const [isCreateSubjectOpen, setIsCreateSubjectOpen] = useState(false);
  const [isPublishNoticeOpen, setIsPublishNoticeOpen] = useState(false);

  // Computed state for Attention Center
  const unassignedCount = metrics.unassignedStudentsCount || 0;
  const unpaidCount = metrics.unpaidFeeDuesCount || 0;
  const conflictsCount = metrics.timetableConflictsCount || 0;
  const incompleteDepts = metrics.incompleteDeptsCount || 0;

  return (
    <div className="space-y-6">
      {/* Hero Operational Banner */}
      <div className="bg-gradient-to-r from-rose-950 via-slate-900 to-indigo-950 text-white p-6 sm:p-8 rounded-2xl shadow-md flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-rose-500/20 text-rose-300 border border-rose-400/30 mb-2">
            JLU ERP • Admin Console
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Jagran Lakecity University Administrator Console
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 flex items-center gap-2">
            <span>Administrator: {user.name}</span>
            <span>•</span>
            <span className="text-emerald-400 font-medium">Academic Year 2026–27</span>
            <span>•</span>
            <span className="text-slate-300">Central Database Online</span>
          </p>
        </div>

        {/* Primary High-Priority Actions */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setIsEnrollStudentOpen(true)}
            className="px-3.5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold shadow-sm transition flex items-center gap-1.5"
            id="btn-hero-enroll-student"
          >
            <UserPlus className="w-4 h-4" />
            Enroll Student
          </button>
          <button
            type="button"
            onClick={() => setIsPublishNoticeOpen(true)}
            className="px-3.5 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-semibold backdrop-blur-xs border border-white/20 transition flex items-center gap-1.5"
            id="btn-hero-publish-notice"
          >
            <Bell className="w-4 h-4" />
            Publish Notice
          </button>
        </div>
      </div>

      {/* Institutional Attention Center with 3 Semantic States */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-rose-600" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800">
              Institutional Attention Center
            </h2>
          </div>
          <span className="text-[11px] font-semibold text-slate-400">Live Campus Pulse</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Card 1: Student Allocation (0 = HEALTHY) */}
          <AttentionCard
            title="Student Assignment"
            value={unassignedCount}
            status={unassignedCount === 0 ? "healthy" : "warning"}
            statusText={
              unassignedCount === 0
                ? "All students assigned to cohorts"
                : `${unassignedCount} student${unassignedCount > 1 ? "s" : ""} require section assignment`
            }
            href="/admin/students"
            badgeLabel={unassignedCount === 0 ? "✓ HEALTHY" : "NEEDS ASSIGNMENT"}
          />

          {/* Card 2: Fee Invoices (0 = HEALTHY, >0 = WARNING) */}
          <AttentionCard
            title="Pending Invoices"
            value={unpaidCount}
            status={unpaidCount === 0 ? "healthy" : "warning"}
            statusText={
              unpaidCount === 0
                ? "No outstanding pending invoices"
                : `Requires review (${formatCurrency(metrics.totalBilled - metrics.totalCollected)} balance)`
            }
            href="/admin/fees"
            badgeLabel={unpaidCount === 0 ? "✓ SETTLED" : "REQUIRES REVIEW"}
            customIcon={<CreditCard className="w-4 h-4" />}
          />

          {/* Card 3: Timetable Clashes (0 = HEALTHY, >0 = CRITICAL) */}
          <AttentionCard
            title="Timetable Conflicts"
            value={conflictsCount}
            status={conflictsCount === 0 ? "healthy" : "critical"}
            statusText={
              conflictsCount === 0
                ? "5D engine verified • No room or faculty clashes"
                : `${conflictsCount} schedule clash${conflictsCount > 1 ? "es" : ""} require immediate resolution`
            }
            href="/admin/timetable/conflicts"
            badgeLabel={conflictsCount === 0 ? "✓ VERIFIED" : "CRITICAL"}
            customIcon={<ShieldAlert className="w-4 h-4" />}
          />

          {/* Card 4: Incomplete Departments (0 = HEALTHY, >0 = WARNING) */}
          <AttentionCard
            title="Departments Needing Setup"
            value={incompleteDepts}
            status={incompleteDepts === 0 ? "healthy" : "warning"}
            statusText={
              incompleteDepts === 0
                ? "All academic departments configured"
                : `${incompleteDepts} department${incompleteDepts > 1 ? "s" : ""} have 0 faculty or programs`
            }
            href="/admin/departments?status=needs-setup"
            badgeLabel={incompleteDepts === 0 ? "✓ CONFIGURED" : "SETUP PENDING"}
            customIcon={<Building className="w-4 h-4" />}
          />
        </div>
      </div>

      {/* University Macro KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl shadow-xs border border-slate-200">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Enrolled</span>
            <GraduationCap className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-2xl font-extrabold text-slate-900">{metrics.studentCount}</p>
          <Link href="/admin/students" className="text-[11px] text-blue-600 font-bold hover:underline mt-1 inline-block">
            Student Directory &rarr;
          </Link>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-xs border border-slate-200">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Faculty Body</span>
            <Users className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-extrabold text-slate-900">{metrics.facultyCount}</p>
          <Link href="/admin/faculty" className="text-[11px] text-emerald-600 font-bold hover:underline mt-1 inline-block">
            Faculty Directory &rarr;
          </Link>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-xs border border-slate-200">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Depts / Programs</span>
            <Building className="w-4 h-4 text-purple-600" />
          </div>
          <p className="text-2xl font-extrabold text-slate-900">{metrics.deptCount} / {metrics.progCount}</p>
          <Link href="/admin/programs" className="text-[11px] text-purple-600 font-bold hover:underline mt-1 inline-block">
            Degree Programs &rarr;
          </Link>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-xs border border-slate-200">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Fee Collected</span>
            <CreditCard className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-2xl font-extrabold text-emerald-700">{formatCurrency(metrics.totalCollected)}</p>
          <span className="text-[11px] text-slate-500">Out of {formatCurrency(metrics.totalBilled)}</span>
        </div>
      </div>

      {/* Quick Administrative Operations (Broader Tools - No duplicate +Student / +Circular) */}
      <div className="p-4 bg-slate-900 text-white rounded-2xl shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-rose-400">
            Quick Administrative Operations
          </h3>
          <p className="text-xs text-slate-300 mt-0.5">
            Direct navigation to primary institutional management consoles
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Link
            href="/admin/departments"
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-semibold border border-slate-700 transition flex items-center gap-1.5"
          >
            <Building className="w-3.5 h-3.5 text-blue-400" />
            Departments
          </Link>
          <Link
            href="/admin/programs"
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-semibold border border-slate-700 transition flex items-center gap-1.5"
          >
            <School className="w-3.5 h-3.5 text-indigo-400" />
            Programs
          </Link>
          <Link
            href="/admin/subjects"
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-semibold border border-slate-700 transition flex items-center gap-1.5"
          >
            <BookOpen className="w-3.5 h-3.5 text-purple-400" />
            Subjects
          </Link>
          <Link
            href="/admin/faculty"
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-semibold border border-slate-700 transition flex items-center gap-1.5"
          >
            <Users className="w-3.5 h-3.5 text-emerald-400" />
            Faculty
          </Link>
          <Link
            href="/admin/sections"
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-semibold border border-slate-700 transition flex items-center gap-1.5"
          >
            <Layers className="w-3.5 h-3.5 text-cyan-400" />
            Sections
          </Link>
          <Link
            href="/admin/rooms"
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-semibold border border-slate-700 transition flex items-center gap-1.5"
          >
            <Building className="w-3.5 h-3.5 text-amber-400" />
            Rooms
          </Link>
          <Link
            href="/admin/timetable"
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-semibold border border-slate-700 transition flex items-center gap-1.5"
          >
            <Calendar className="w-3.5 h-3.5 text-pink-400" />
            Timetable
          </Link>
          <Link
            href="/admin/audit-logs"
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-semibold border border-slate-700 transition flex items-center gap-1.5"
          >
            <Clock className="w-3.5 h-3.5 text-slate-300" />
            Audit Logs
          </Link>
        </div>
      </div>

      {/* Grid: Master Data Modules & Live Audit Trail */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Master Data Navigation */}
        <div className="lg:col-span-7 bg-white rounded-2xl shadow-xs border border-slate-200 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900">
              University Master Data Modules
            </h2>
            <Link href="/admin/departments" className="text-xs font-semibold text-rose-600 hover:underline">
              View All &rarr;
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
            <Link
              href="/admin/departments"
              className="p-3.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200/80 transition block group"
            >
              <Building className="w-4 h-4 text-blue-600 mb-1 group-hover:scale-110 transition-transform" />
              <span className="font-bold text-slate-900 block">Departments</span>
              <span className="text-[11px] text-slate-500">{metrics.deptCount} Active Depts</span>
            </Link>

            <Link
              href="/admin/programs"
              className="p-3.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200/80 transition block group"
            >
              <School className="w-4 h-4 text-indigo-600 mb-1 group-hover:scale-110 transition-transform" />
              <span className="font-bold text-slate-900 block">Programs</span>
              <span className="text-[11px] text-slate-500">{metrics.progCount} Degree Offerings</span>
            </Link>

            <Link
              href="/admin/subjects"
              className="p-3.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200/80 transition block group"
            >
              <GraduationCap className="w-4 h-4 text-purple-600 mb-1 group-hover:scale-110 transition-transform" />
              <span className="font-bold text-slate-900 block">Subjects</span>
              <span className="text-[11px] text-slate-500">Syllabus & Credits</span>
            </Link>

            <Link
              href="/admin/sections"
              className="p-3.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200/80 transition block group"
            >
              <Users className="w-4 h-4 text-emerald-600 mb-1 group-hover:scale-110 transition-transform" />
              <span className="font-bold text-slate-900 block">Sections</span>
              <span className="text-[11px] text-slate-500">Batches & Capacities</span>
            </Link>

            <Link
              href="/admin/rooms"
              className="p-3.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200/80 transition block group"
            >
              <Building className="w-4 h-4 text-amber-600 mb-1 group-hover:scale-110 transition-transform" />
              <span className="font-bold text-slate-900 block">Rooms & Labs</span>
              <span className="text-[11px] text-slate-500">{metrics.roomCount} Venues</span>
            </Link>

            <Link
              href="/admin/faculty-allocation"
              className="p-3.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200/80 transition block group"
            >
              <CheckCircle2 className="w-4 h-4 text-rose-600 mb-1 group-hover:scale-110 transition-transform" />
              <span className="font-bold text-slate-900 block">Faculty Alloc</span>
              <span className="text-[11px] text-slate-500">Subject-Teacher Load</span>
            </Link>
          </div>
        </div>

        {/* Right: Live University Audit Trail with Real Time-of-Day Timestamps & Event Types */}
        <div className="lg:col-span-5 bg-white rounded-2xl shadow-xs border border-slate-200 p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-slate-500" />
              Recent System Audit Trail
            </h3>
            <Link
              href="/admin/audit-logs"
              className="text-[11px] font-semibold text-rose-600 hover:text-rose-700 hover:underline flex items-center gap-1"
            >
              <span>View all audit logs</span>
              <span>&rarr;</span>
            </Link>
          </div>

          <div className="space-y-2 text-xs">
            {recentAudits && recentAudits.length > 0 ? (
              recentAudits.map((log) => <AuditEventItem key={log.id} log={log} />)
            ) : (
              <p className="text-xs text-slate-400 p-4 text-center">No recent audit activity recorded.</p>
            )}
          </div>
        </div>
      </div>

      {/* Drawers */}
      <EnrollStudentDrawer
        isOpen={isEnrollStudentOpen}
        onClose={() => setIsEnrollStudentOpen(false)}
        programs={masterData.programs}
        sections={masterData.sections}
      />

      <OnboardFacultyDrawer
        isOpen={isOnboardFacultyOpen}
        onClose={() => setIsOnboardFacultyOpen(false)}
        departments={masterData.departments}
      />

      <CreateDepartmentDrawer
        isOpen={isCreateDeptOpen}
        onClose={() => setIsCreateDeptOpen(false)}
      />

      <CreateSubjectDrawer
        isOpen={isCreateSubjectOpen}
        onClose={() => setIsCreateSubjectOpen(false)}
        departments={masterData.departments}
        semesters={masterData.semesters}
      />

      <PublishNoticeDrawer
        isOpen={isPublishNoticeOpen}
        onClose={() => setIsPublishNoticeOpen(false)}
      />
    </div>
  );
}
