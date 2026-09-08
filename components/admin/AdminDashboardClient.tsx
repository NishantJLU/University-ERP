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

  // Operational metrics
  const unassignedCount = metrics.unassignedStudentsCount || 0;
  const unpaidCount = metrics.unpaidFeeDuesCount || 0;
  const conflictsCount = metrics.timetableConflictsCount || 0;
  const incompleteDepts = metrics.incompleteDeptsCount || 0;
  const hasCritical = conflictsCount > 0;

  return (
    <div className="space-y-6">
      {/* 1. JLU Institutional Hero (Flat Maroon, Editorial Typography, Operational Status) */}
      <div className="bg-[#800020] text-white p-6 sm:p-8 rounded-lg shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-rose-200 block">
            JLU Administration
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-1 text-white">
            Academic Administration Console
          </h1>
          <p className="text-xs sm:text-sm text-rose-100/90 mt-1.5 max-w-2xl leading-relaxed">
            Monitor university operations, academic configuration, student lifecycle, and institutional compliance.
          </p>

          <div className="flex flex-wrap items-center gap-2 mt-3 text-xs text-rose-200">
            <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
            <span className="font-semibold text-white">Academic Year 2026–27</span>
            <span>•</span>
            <span>Central Database Online</span>
            <span>•</span>
            <span className="text-rose-200">Administrator: {user.name}</span>
          </div>
        </div>

        {/* Primary High-Priority Actions */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={() => setIsEnrollStudentOpen(true)}
            className="px-4 py-2 bg-white text-[#800020] hover:bg-rose-50 rounded-md text-xs font-bold shadow-xs transition"
            id="btn-hero-enroll-student"
          >
            Enroll Student
          </button>
          <button
            type="button"
            onClick={() => setIsPublishNoticeOpen(true)}
            className="px-4 py-2 bg-transparent hover:bg-white/10 text-white rounded-md text-xs font-semibold border border-white/30 transition"
            id="btn-hero-publish-notice"
          >
            Publish Notice
          </button>
        </div>
      </div>

      {/* 2. Institutional Attention Center (Editorial Hierarchy, Asymmetric Focus) */}
      <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-xs">
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800">
              Institutional Attention Center
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Priority operational indicators requiring administrative governance
            </p>
          </div>
          <span className="text-[11px] font-mono text-slate-500">Live Campus Pulse</span>
        </div>

        {/* CRITICAL Operational Issue Dominates when present */}
        {hasCritical && (
          <div className="p-4 mb-4 rounded-lg border border-rose-300 border-l-4 border-l-rose-700 bg-rose-50/40 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-rose-900 uppercase tracking-wider">
                <ShieldAlert className="w-4 h-4 text-rose-700" />
                <span>Action Required: Schedule Collision</span>
              </div>
              <div className="flex items-baseline gap-2.5 mt-1">
                <span className="text-3xl font-extrabold text-rose-950 font-mono">
                  {conflictsCount}
                </span>
                <span className="text-sm font-bold text-rose-950">
                  Timetable Schedule Clashes Detected
                </span>
              </div>
              <p className="text-xs text-rose-900/90 mt-1 max-w-2xl">
                The 5D engine detected room or faculty scheduling conflicts. Immediate resolution is required before timetable publication.
              </p>
            </div>
            <Link
              href="/admin/timetable/conflicts"
              className="px-4 py-2 bg-rose-700 hover:bg-rose-800 text-white text-xs font-bold rounded-md shrink-0 transition"
            >
              Resolve Schedule Clashes
            </Link>
          </div>
        )}

        {/* Secondary Operational Status Cards (Asymmetric Grid) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Card 1: Pending Invoices (Warning) */}
          <AttentionCard
            title="Pending Invoices"
            value={unpaidCount}
            status={unpaidCount === 0 ? "healthy" : "warning"}
            statusText={
              unpaidCount === 0
                ? "All active invoices reconciled and settled"
                : `${unpaidCount} invoices overdue (${formatCurrency(metrics.totalBilled - metrics.totalCollected)} outstanding)`
            }
            href="/admin/fees"
            badgeLabel={unpaidCount === 0 ? "SETTLED" : "REQUIRES REVIEW"}
            actionLabel="Review pending invoices"
          />

          {/* Card 2: Departments Needing Setup (Warning) */}
          <AttentionCard
            title="Department Configuration"
            value={incompleteDepts}
            status={incompleteDepts === 0 ? "healthy" : "warning"}
            statusText={
              incompleteDepts === 0
                ? "All academic departments fully configured"
                : `${incompleteDepts} departments have 0 faculty or degree programs`
            }
            href="/admin/departments?status=needs-setup"
            badgeLabel={incompleteDepts === 0 ? "CONFIGURED" : "SETUP PENDING"}
            actionLabel="Configure departments"
          />

          {/* Card 3: Student Cohort Assignment (Healthy Confirmation) */}
          <AttentionCard
            title="Student Cohort Assignment"
            value={unassignedCount}
            status={unassignedCount === 0 ? "healthy" : "warning"}
            statusText={
              unassignedCount === 0
                ? "All enrolled students assigned to sections"
                : `${unassignedCount} students require section allocation`
            }
            href="/admin/students"
            badgeLabel={unassignedCount === 0 ? "HEALTHY" : "NEEDS ASSIGNMENT"}
            actionLabel="View student directory"
          />
        </div>
      </div>

      {/* 3. University Core Metrics (Typography-first, No Decorative Rainbow Squares) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-lg border border-slate-200">
          <div className="flex items-center justify-between text-slate-500 mb-1.5">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-600">
              Students Enrolled
            </span>
            <GraduationCap className="w-4 h-4 text-slate-400" />
          </div>
          <p className="text-2xl font-bold font-mono text-slate-900">{metrics.studentCount}</p>
          <p className="text-[11px] text-slate-500 mt-0.5">Active across degree programs</p>
          <Link
            href="/admin/students"
            className="text-xs font-medium text-[#800020] hover:underline mt-3 inline-block"
          >
            Student directory
          </Link>
        </div>

        <div className="bg-white p-5 rounded-lg border border-slate-200">
          <div className="flex items-center justify-between text-slate-500 mb-1.5">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-600">
              Faculty Body
            </span>
            <Users className="w-4 h-4 text-slate-400" />
          </div>
          <p className="text-2xl font-bold font-mono text-slate-900">{metrics.facultyCount}</p>
          <p className="text-[11px] text-slate-500 mt-0.5">Appointed professors and lecturers</p>
          <Link
            href="/admin/faculty"
            className="text-xs font-medium text-[#800020] hover:underline mt-3 inline-block"
          >
            Faculty directory
          </Link>
        </div>

        <div className="bg-white p-5 rounded-lg border border-slate-200">
          <div className="flex items-center justify-between text-slate-500 mb-1.5">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-600">
              Departments & Programs
            </span>
            <Building className="w-4 h-4 text-slate-400" />
          </div>
          <p className="text-2xl font-bold font-mono text-slate-900">
            {metrics.deptCount} <span className="text-sm font-normal text-slate-500">/ {metrics.progCount}</span>
          </p>
          <p className="text-[11px] text-slate-500 mt-0.5">Academic departments and offerings</p>
          <Link
            href="/admin/programs"
            className="text-xs font-medium text-[#800020] hover:underline mt-3 inline-block"
          >
            Degree programs
          </Link>
        </div>

        <div className="bg-white p-5 rounded-lg border border-slate-200">
          <div className="flex items-center justify-between text-slate-500 mb-1.5">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-600">
              Fee Collections
            </span>
            <CreditCard className="w-4 h-4 text-slate-400" />
          </div>
          <p className="text-2xl font-bold font-mono text-slate-900">
            {formatCurrency(metrics.totalCollected)}
          </p>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Out of {formatCurrency(metrics.totalBilled)} billed
          </p>
          <Link
            href="/admin/fees"
            className="text-xs font-medium text-[#800020] hover:underline mt-3 inline-block"
          >
            Finance ledger
          </Link>
        </div>
      </div>

      {/* 4. Administrative Operations (Compact Neutral Utility Strip) */}
      <div className="bg-white border border-slate-200 rounded-lg p-3.5 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="shrink-0">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
            Administrative Operations
          </span>
          <span className="text-[11px] text-slate-500">Institutional navigation shortcuts</span>
        </div>

        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          <Link
            href="/admin/departments"
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-md font-medium transition"
          >
            Departments
          </Link>
          <Link
            href="/admin/programs"
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-md font-medium transition"
          >
            Programs
          </Link>
          <Link
            href="/admin/subjects"
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-md font-medium transition"
          >
            Subjects
          </Link>
          <Link
            href="/admin/faculty"
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-md font-medium transition"
          >
            Faculty
          </Link>
          <Link
            href="/admin/sections"
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-md font-medium transition"
          >
            Sections
          </Link>
          <Link
            href="/admin/rooms"
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-md font-medium transition"
          >
            Rooms
          </Link>
          <Link
            href="/admin/timetable"
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-md font-medium transition"
          >
            Timetable
          </Link>
          <Link
            href="/admin/audit-logs"
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-md font-medium transition"
          >
            Audit Logs
          </Link>
        </div>
      </div>

      {/* 5. Master Data Modules & Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Master Data Modules (Editorial, Asymmetric, No Tinted Squares) */}
        <div className="lg:col-span-7 bg-white rounded-lg border border-slate-200 p-6 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div>
              <h2 className="text-sm font-bold text-slate-900 tracking-tight">
                Academic Infrastructure Modules
              </h2>
              <p className="text-xs text-slate-500">
                Core structural entities supporting university curricula and venues
              </p>
            </div>
            <Link
              href="/admin/departments"
              className="text-xs font-semibold text-[#800020] hover:underline"
            >
              All modules
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <Link
              href="/admin/departments"
              className="p-3.5 rounded-lg bg-slate-50 hover:bg-slate-100/80 border border-slate-200/80 transition block group"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 group-hover:text-[#800020]">
                  Academic Departments
                </span>
                <span className="text-[11px] font-mono text-slate-500">
                  {metrics.deptCount} Active
                </span>
              </div>
              <p className="text-slate-500 mt-1 text-[11px] leading-normal">
                Department hierarchy, school grouping, and administrative chairs
              </p>
            </Link>

            <Link
              href="/admin/programs"
              className="p-3.5 rounded-lg bg-slate-50 hover:bg-slate-100/80 border border-slate-200/80 transition block group"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 group-hover:text-[#800020]">
                  Degree Programs
                </span>
                <span className="text-[11px] font-mono text-slate-500">
                  {metrics.progCount} Degrees
                </span>
              </div>
              <p className="text-slate-500 mt-1 text-[11px] leading-normal">
                Undergraduate, postgraduate, and doctoral program configurations
              </p>
            </Link>

            <Link
              href="/admin/subjects"
              className="p-3.5 rounded-lg bg-slate-50 hover:bg-slate-100/80 border border-slate-200/80 transition block group"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 group-hover:text-[#800020]">
                  Course Subjects
                </span>
                <span className="text-[11px] font-mono text-slate-500">Syllabus</span>
              </div>
              <p className="text-slate-500 mt-1 text-[11px] leading-normal">
                Course curriculum, academic credits, and semester mappings
              </p>
            </Link>

            <Link
              href="/admin/sections"
              className="p-3.5 rounded-lg bg-slate-50 hover:bg-slate-100/80 border border-slate-200/80 transition block group"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 group-hover:text-[#800020]">
                  Student Cohort Sections
                </span>
                <span className="text-[11px] font-mono text-slate-500">Batches</span>
              </div>
              <p className="text-slate-500 mt-1 text-[11px] leading-normal">
                Classroom batch allocation, capacities, and enrolled rosters
              </p>
            </Link>

            <Link
              href="/admin/rooms"
              className="p-3.5 rounded-lg bg-slate-50 hover:bg-slate-100/80 border border-slate-200/80 transition block group"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 group-hover:text-[#800020]">
                  Rooms & Facilities
                </span>
                <span className="text-[11px] font-mono text-slate-500">
                  {metrics.roomCount} Venues
                </span>
              </div>
              <p className="text-slate-500 mt-1 text-[11px] leading-normal">
                Campus lecture theatres, laboratory complexes, and seat quotas
              </p>
            </Link>

            <Link
              href="/admin/faculty-allocation"
              className="p-3.5 rounded-lg bg-slate-50 hover:bg-slate-100/80 border border-slate-200/80 transition block group"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 group-hover:text-[#800020]">
                  Faculty Workload Allocation
                </span>
                <span className="text-[11px] font-mono text-slate-500">Workload</span>
              </div>
              <p className="text-slate-500 mt-1 text-[11px] leading-normal">
                Teacher-subject assignments and semester teaching load validation
              </p>
            </Link>
          </div>
        </div>

        {/* Right: Live University Audit Trail (Clean Activity Feed, Timestamps, No Tinted Squares) */}
        <div className="lg:col-span-5 bg-white rounded-lg border border-slate-200 p-5 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>Recent System Audit Trail</span>
              </h3>
              <p className="text-[11px] text-slate-500">Immutable ledger of administrative events</p>
            </div>
            <Link
              href="/admin/audit-logs"
              className="text-[11px] font-semibold text-[#800020] hover:underline"
            >
              View all audit logs
            </Link>
          </div>

          <div className="divide-y divide-slate-100">
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
