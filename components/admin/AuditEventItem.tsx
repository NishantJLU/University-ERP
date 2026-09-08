import React from "react";
import {
  LogIn,
  UserPlus,
  Users,
  Building,
  Bell,
  CalendarCheck,
  CreditCard,
  CheckCircle,
  FileText,
  Settings,
} from "lucide-react";
import { formatDateTime } from "@/lib/utils";

export interface AuditLogItem {
  id: string;
  action: string;
  entity: string;
  actorName: string;
  actorRole: string;
  createdAt: string;
  details?: string | null;
}

const ACTION_LABELS: Record<string, string> = {
  USER_LOGIN: "User Login",
  STUDENT_ENROLLED: "Student Enrolled",
  STUDENT_CREATED: "Student Created",
  FACULTY_ONBOARDED: "Faculty Onboarded",
  FACULTY_UPDATED: "Faculty Updated",
  DEPARTMENT_CREATED: "Department Created",
  DEPARTMENT_UPDATED: "Department Updated",
  NOTICE_PUBLISHED: "Notice Published",
  TIMETABLE_APPROVED: "Timetable Approved",
  TIMETABLE_PUBLISHED: "Timetable Published",
  PAYMENT_VERIFIED: "Payment Verified",
  PAYMENT_RECONCILED: "Payment Reconciled",
  ATTENDANCE_RECORDED: "Attendance Recorded",
  ATTENDANCE_MARKED: "Attendance Marked",
  ACADEMIC_YEAR_CONFIGURED: "Academic Year Configured",
};

const ROLE_LABELS: Record<string, string> = {
  ADMIN: "Administrator",
  TEACHER: "Faculty",
  STUDENT: "Student",
  HOD: "Head of Department",
  ACCOUNTS: "Finance / Bursar",
  MANAGEMENT: "Executive Board",
  SYSTEM: "System Automation",
};

export function AuditEventItem({ log }: { log: AuditLogItem }) {
  const getEventIcon = (action: string) => {
    switch (action) {
      case "USER_LOGIN":
        return LogIn;
      case "STUDENT_ENROLLED":
      case "STUDENT_CREATED":
        return UserPlus;
      case "FACULTY_ONBOARDED":
      case "FACULTY_UPDATED":
        return Users;
      case "DEPARTMENT_CREATED":
      case "DEPARTMENT_UPDATED":
        return Building;
      case "NOTICE_PUBLISHED":
        return Bell;
      case "TIMETABLE_APPROVED":
      case "TIMETABLE_PUBLISHED":
        return CalendarCheck;
      case "PAYMENT_VERIFIED":
      case "PAYMENT_RECONCILED":
        return CreditCard;
      case "ATTENDANCE_RECORDED":
      case "ATTENDANCE_MARKED":
        return CheckCircle;
      case "ACADEMIC_YEAR_CONFIGURED":
        return Settings;
      default:
        return FileText;
    }
  };

  const IconComponent = getEventIcon(log.action);
  const eventLabel = ACTION_LABELS[log.action] || log.action.replace(/_/g, " ");
  const roleLabel = ROLE_LABELS[log.actorRole] || log.actorRole;

  // Clean, readable target details
  let detailSnippet = "";
  if (log.details) {
    try {
      const parsed = typeof log.details === "string" ? JSON.parse(log.details) : log.details;
      if (parsed.name) detailSnippet = parsed.name;
      else if (parsed.title) detailSnippet = parsed.title;
      else if (parsed.program) detailSnippet = parsed.program;
      else if (parsed.role && log.action !== "USER_LOGIN") detailSnippet = `Role: ${parsed.role}`;
    } catch {
      detailSnippet = String(log.details);
    }
  }

  // Format short clean time of day: e.g. "11:42 AM" or date if older
  const timestamp = formatDateTime(log.createdAt);

  return (
    <div className="py-2.5 px-3 hover:bg-slate-50/80 transition rounded flex items-start gap-3 text-xs border-b border-slate-100 last:border-b-0">
      <div className="mt-0.5 text-slate-400 shrink-0">
        <IconComponent className="w-3.5 h-3.5" />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-baseline justify-between gap-2">
          <span className="font-semibold text-slate-900 tracking-tight">
            {eventLabel}
          </span>
          <span className="text-[11px] text-slate-500 font-mono shrink-0">
            {timestamp}
          </span>
        </div>

        <p className="text-[11px] text-slate-600 mt-0.5">
          <span className="font-medium text-slate-800">{log.actorName}</span>
          <span className="text-slate-500"> • {roleLabel}</span>
          {log.entity && log.entity !== "User" && (
            <span className="text-slate-500">
              {" "}
              — {log.entity}
              {detailSnippet ? ` (${detailSnippet})` : ""}
            </span>
          )}
        </p>
      </div>
    </div>
  );
}
