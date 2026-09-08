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

export function AuditEventItem({ log }: { log: AuditLogItem }) {
  const getEventMeta = (action: string) => {
    switch (action) {
      case "USER_LOGIN":
        return {
          icon: LogIn,
          iconColor: "text-blue-600 bg-blue-50 border-blue-200",
          actionBadge: "bg-blue-50 text-blue-700 border-blue-200",
          readableAction: "User Login",
        };
      case "STUDENT_ENROLLED":
      case "STUDENT_CREATED":
        return {
          icon: UserPlus,
          iconColor: "text-purple-600 bg-purple-50 border-purple-200",
          actionBadge: "bg-purple-50 text-purple-700 border-purple-200",
          readableAction: "Student Enrolled",
        };
      case "FACULTY_ONBOARDED":
      case "FACULTY_UPDATED":
        return {
          icon: Users,
          iconColor: "text-emerald-600 bg-emerald-50 border-emerald-200",
          actionBadge: "bg-emerald-50 text-emerald-700 border-emerald-200",
          readableAction: "Faculty Updated",
        };
      case "DEPARTMENT_CREATED":
      case "DEPARTMENT_UPDATED":
        return {
          icon: Building,
          iconColor: "text-indigo-600 bg-indigo-50 border-indigo-200",
          actionBadge: "bg-indigo-50 text-indigo-700 border-indigo-200",
          readableAction: "Department Action",
        };
      case "NOTICE_PUBLISHED":
        return {
          icon: Bell,
          iconColor: "text-amber-600 bg-amber-50 border-amber-200",
          actionBadge: "bg-amber-50 text-amber-700 border-amber-200",
          readableAction: "Notice Published",
        };
      case "TIMETABLE_APPROVED":
      case "TIMETABLE_PUBLISHED":
        return {
          icon: CalendarCheck,
          iconColor: "text-cyan-600 bg-cyan-50 border-cyan-200",
          actionBadge: "bg-cyan-50 text-cyan-700 border-cyan-200",
          readableAction: "Timetable Event",
        };
      case "PAYMENT_VERIFIED":
      case "PAYMENT_RECONCILED":
        return {
          icon: CreditCard,
          iconColor: "text-emerald-600 bg-emerald-50 border-emerald-200",
          actionBadge: "bg-emerald-50 text-emerald-700 border-emerald-200",
          readableAction: "Payment Verified",
        };
      case "ATTENDANCE_RECORDED":
      case "ATTENDANCE_MARKED":
        return {
          icon: CheckCircle,
          iconColor: "text-teal-600 bg-teal-50 border-teal-200",
          actionBadge: "bg-teal-50 text-teal-700 border-teal-200",
          readableAction: "Attendance Recorded",
        };
      case "ACADEMIC_YEAR_CONFIGURED":
        return {
          icon: Settings,
          iconColor: "text-violet-600 bg-violet-50 border-violet-200",
          actionBadge: "bg-violet-50 text-violet-700 border-violet-200",
          readableAction: "System Configured",
        };
      default:
        return {
          icon: FileText,
          iconColor: "text-slate-600 bg-slate-50 border-slate-200",
          actionBadge: "bg-slate-50 text-slate-700 border-slate-200",
          readableAction: action.replace(/_/g, " "),
        };
    }
  };

  const meta = getEventMeta(log.action);
  const IconComponent = meta.icon;

  // Attempt to parse readable target detail
  let targetDetail = "";
  if (log.details) {
    try {
      const parsed = typeof log.details === "string" ? JSON.parse(log.details) : log.details;
      if (parsed.name) targetDetail = parsed.name;
      else if (parsed.title) targetDetail = parsed.title;
      else if (parsed.program) targetDetail = parsed.program;
      else if (parsed.role) targetDetail = `Role: ${parsed.role}`;
    } catch {
      targetDetail = String(log.details);
    }
  }

  return (
    <div className="p-3 rounded-xl bg-slate-50/70 border border-slate-200/80 hover:bg-slate-50 hover:border-slate-300 transition flex items-start gap-3">
      <div className={`p-2 rounded-lg border shrink-0 ${meta.iconColor}`}>
        <IconComponent className="w-3.5 h-3.5" />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 min-w-0">
            <span
              className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded border uppercase shrink-0 ${meta.actionBadge}`}
            >
              {log.action}
            </span>
            <span className="text-xs font-bold text-slate-900 truncate">
              {log.actorName}
            </span>
            <span className="text-[10px] font-semibold text-slate-500 bg-slate-200/60 px-1.5 py-0.2 rounded shrink-0">
              {log.actorRole}
            </span>
          </div>

          <span className="text-[10px] text-slate-500 font-mono shrink-0">
            {formatDateTime(log.createdAt)}
          </span>
        </div>

        <div className="flex items-center justify-between gap-2 mt-1 text-[11px] text-slate-600">
          <span className="font-mono text-slate-500 truncate">
            Target: <span className="text-slate-800 font-semibold">{log.entity}</span>
            {targetDetail ? ` • ${targetDetail}` : ""}
          </span>
        </div>
      </div>
    </div>
  );
}
