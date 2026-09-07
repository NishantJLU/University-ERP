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
  Plus,
  ArrowRight,
  ShieldAlert,
  FileText,
  UserPlus,
  BookOpen,
} from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";
import EnrollStudentDrawer from "@/components/admin/drawers/EnrollStudentDrawer";
import OnboardFacultyDrawer from "@/components/admin/drawers/OnboardFacultyDrawer";
import CreateDepartmentDrawer from "@/components/admin/drawers/CreateDepartmentDrawer";
import CreateSubjectDrawer from "@/components/admin/drawers/CreateSubjectDrawer";
import PublishNoticeDrawer from "@/components/admin/drawers/PublishNoticeDrawer";

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
  };
  recentAudits: Array<{
    id: string;
    action: string;
    entity: string;
    actorName: string;
    actorRole: string;
    createdAt: string;
  }>;
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

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-rose-950 via-slate-900 to-indigo-950 text-white p-6 sm:p-8 rounded-2xl shadow-md flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-rose-500/20 text-rose-300 border border-rose-400/30 mb-2">
            Central Institutional Governance
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Jagran Lakecity University Administrator Console
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            Administrator: {user.name} • One Source of Truth Active Across All 6 Roles
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setIsEnrollStudentOpen(true)}
            className="px-3.5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold shadow-sm transition flex items-center gap-1.5"
          >
            <UserPlus className="w-4 h-4" />
            Enroll Student
          </button>
          <button
            type="button"
            onClick={() => setIsPublishNoticeOpen(true)}
            className="px-3.5 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-semibold backdrop-blur-xs border border-white/20 transition flex items-center gap-1.5"
          >
            <Bell className="w-4 h-4" />
            Publish Notice
          </button>
        </div>
      </div>

      {/* Institutional Attention Center */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800">
              Institutional Attention Center
            </h2>
          </div>
          <span className="text-[11px] font-semibold text-slate-400">Live Campus Pulse</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Fee collection attention */}
          <Link
            href="/admin/fees"
            className="p-3.5 rounded-xl border border-amber-200 bg-amber-50/50 hover:bg-amber-50 transition flex items-start gap-3 group"
          >
            <div className="p-2 bg-amber-100 rounded-lg text-amber-700 shrink-0">
              <CreditCard className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="text-xs font-bold text-amber-950 group-hover:text-amber-800 flex items-center gap-1">
                <span>{metrics.unpaidFeeDuesCount} Pending Invoices</span>
                <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
              </div>
              <p className="text-[11px] text-amber-800/80 mt-0.5">
                Outstanding: {formatCurrency(metrics.totalBilled - metrics.totalCollected)}
              </p>
            </div>
          </Link>

          {/* Section unassigned attention */}
          <Link
            href="/admin/students"
            className="p-3.5 rounded-xl border border-blue-200 bg-blue-50/50 hover:bg-blue-50 transition flex items-start gap-3 group"
          >
            <div className="p-2 bg-blue-100 rounded-lg text-blue-700 shrink-0">
              <Users className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="text-xs font-bold text-blue-950 group-hover:text-blue-800 flex items-center gap-1">
                <span>{metrics.unassignedStudentsCount} Unassigned Students</span>
                <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
              </div>
              <p className="text-[11px] text-blue-800/80 mt-0.5">
                Cohort section unassigned in DB
              </p>
            </div>
          </Link>

          {/* Timetable Conflict Center */}
          <Link
            href="/admin/timetable/conflicts"
            className="p-3.5 rounded-xl border border-rose-200 bg-rose-50/50 hover:bg-rose-50 transition flex items-start gap-3 group"
          >
            <div className="p-2 bg-rose-100 rounded-lg text-rose-700 shrink-0">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="text-xs font-bold text-rose-950 group-hover:text-rose-800 flex items-center gap-1">
                <span>Timetable Conflict Audit</span>
                <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
              </div>
              <p className="text-[11px] text-rose-800/80 mt-0.5">
                Run 5D engine check for clashes
              </p>
            </div>
          </Link>

          {/* Broadcast Circulars */}
          <Link
            href="/admin/notices"
            className="p-3.5 rounded-xl border border-emerald-200 bg-emerald-50/50 hover:bg-emerald-50 transition flex items-start gap-3 group"
          >
            <div className="p-2 bg-emerald-100 rounded-lg text-emerald-700 shrink-0">
              <Bell className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="text-xs font-bold text-emerald-950 group-hover:text-emerald-800 flex items-center gap-1">
                <span>{metrics.urgentNoticesCount} Active Broadcasts</span>
                <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
              </div>
              <p className="text-[11px] text-emerald-800/80 mt-0.5">
                Official circulars published campus-wide
              </p>
            </div>
          </Link>
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

      {/* Quick Interactive Actions Panel */}
      <div className="p-4 bg-slate-900 text-white rounded-2xl shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-rose-400">
            Quick Administrative Operations
          </h3>
          <p className="text-xs text-slate-300 mt-0.5">
            Create entities directly without leaving the dashboard
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setIsEnrollStudentOpen(true)}
            className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-semibold transition flex items-center gap-1.5"
          >
            <UserPlus className="w-3.5 h-3.5" />
            + Student
          </button>
          <button
            type="button"
            onClick={() => setIsOnboardFacultyOpen(true)}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-semibold border border-slate-700 transition flex items-center gap-1.5"
          >
            <Users className="w-3.5 h-3.5 text-emerald-400" />
            + Faculty
          </button>
          <button
            type="button"
            onClick={() => setIsCreateDeptOpen(true)}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-semibold border border-slate-700 transition flex items-center gap-1.5"
          >
            <Building className="w-3.5 h-3.5 text-blue-400" />
            + Department
          </button>
          <button
            type="button"
            onClick={() => setIsCreateSubjectOpen(true)}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-semibold border border-slate-700 transition flex items-center gap-1.5"
          >
            <BookOpen className="w-3.5 h-3.5 text-purple-400" />
            + Subject
          </button>
          <button
            type="button"
            onClick={() => setIsPublishNoticeOpen(true)}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-semibold border border-slate-700 transition flex items-center gap-1.5"
          >
            <Bell className="w-3.5 h-3.5 text-amber-400" />
            + Circular
          </button>
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

        {/* Right: Live University Audit Trail */}
        <div className="lg:col-span-5 bg-white rounded-2xl shadow-xs border border-slate-200 p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-slate-500" />
              Recent System Audit Trail
            </h3>
            <Link href="/admin/audit-logs" className="text-[11px] text-blue-600 hover:underline">
              All Audits &rarr;
            </Link>
          </div>

          <div className="space-y-2.5 text-xs">
            {recentAudits.map((log) => (
              <div key={log.id} className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 font-sans">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">{log.action}</span>
                  <span className="text-[10px] text-slate-400 font-mono">{formatDate(log.createdAt)}</span>
                </div>
                <p className="text-[11px] text-slate-600 mt-0.5">
                  Actor: <span className="font-semibold text-slate-800">{log.actorName}</span> ({log.actorRole})
                </p>
                <span className="text-[10px] font-mono text-slate-400 block mt-0.5">Entity: {log.entity}</span>
              </div>
            ))}
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
