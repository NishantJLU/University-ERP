"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  GraduationCap,
  CalendarDays,
  CheckSquare,
  CreditCard,
  BookOpen,
  FileText,
  Bell,
  Users,
  Building,
  School,
  FileSpreadsheet,
  Settings,
  ShieldCheck,
  BarChart3,
  Award,
  Layers,
  DoorClosed,
  Receipt,
  RotateCcw,
  Clock,
  Briefcase,
  HelpCircle,
  LucideIcon,
  X,
  Compass,
  Sparkles,
  Flame,
  GripVertical,
} from "lucide-react";
import { Role } from "@/types";
import JLULogo from "@/components/ui/JLULogo";
import { JLU_PROFILE } from "@/lib/jlu-constants";

interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  badge?: string;
}

interface NavSection {
  title?: string;
  items: NavItem[];
}

const SIDEBAR_MENUS: Record<Role, NavSection[]> = {
  ADMIN: [
    {
      items: [
        { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
      ],
    },
    {
      title: "University Master Data",
      items: [
        { label: "Faculties & Schools", href: "/admin/departments", icon: Building },
        { label: "Degree Programs", href: "/admin/programs", icon: School },
        { label: "Subjects & Syllabus", href: "/admin/subjects", icon: BookOpen },
        { label: "Section Cohorts", href: "/admin/sections", icon: Layers },
        { label: "Rooms & Labs", href: "/admin/rooms", icon: DoorClosed },
        { label: "Faculty Allocation", href: "/admin/faculty-allocation", icon: Briefcase },
      ],
    },
    {
      title: "Census & People",
      items: [
        { label: "Student Directory", href: "/admin/students", icon: GraduationCap },
        { label: "Faculty Body", href: "/admin/faculty", icon: Users },
      ],
    },
    {
      title: "Scheduling Engine",
      items: [
        { label: "Master Timetable", href: "/admin/timetable", icon: CalendarDays },
        { label: "Conflict Inspector", href: "/admin/timetable/conflicts", icon: ShieldCheck, badge: "Engine" },
      ],
    },
    {
      title: "Finance & Operations",
      items: [
        { label: "Fee Structure Dues", href: "/admin/fees", icon: CreditCard },
        { label: "Campus Circulars", href: "/admin/notices", icon: Bell },
        { label: "System Audit Logs", href: "/admin/audit-logs", icon: Clock },
        { label: "Settings", href: "/admin/settings", icon: Settings },
      ],
    },
  ],
  HOD: [
    {
      items: [
        { label: "Dashboard", href: "/hod/dashboard", icon: LayoutDashboard },
        { label: "My School / Dept", href: "/hod/faculty", icon: Building },
        { label: "Faculty Roster", href: "/hod/faculty", icon: Users },
        { label: "Enrolled Students", href: "/hod/students", icon: GraduationCap },
      ],
    },
    {
      title: "Scheduling & Quality",
      items: [
        { label: "Timetable", href: "/hod/timetable", icon: CalendarDays },
        { label: "Pending Approvals", href: "/hod/approvals", icon: ShieldCheck, badge: "Action" },
        { label: "Attendance Health", href: "/hod/attendance", icon: CheckSquare },
      ],
    },
    {
      title: "Department Reports",
      items: [
        { label: "Academic Reports", href: "/hod/reports", icon: BarChart3 },
      ],
    },
  ],
  TEACHER: [
    {
      items: [
        { label: "Dashboard", href: "/teacher/dashboard", icon: LayoutDashboard },
        { label: "Teaching Timetable", href: "/teacher/timetable", icon: CalendarDays },
        { label: "Record Attendance", href: "/teacher/attendance", icon: CheckSquare },
        { label: "My Students", href: "/teacher/students", icon: Users },
      ],
    },
    {
      title: "JLU Learning (LMS)",
      items: [
        { label: "LMS Courses", href: "/teacher/lms", icon: BookOpen },
        { label: "Grading Queue", href: "/teacher/submissions", icon: Award },
        { label: "Workload Analysis", href: "/teacher/workload", icon: Briefcase },
        { label: "Campus Notices", href: "/teacher/notices", icon: Bell },
      ],
    },
  ],
  STUDENT: [
    {
      items: [
        { label: "Dashboard", href: "/student/dashboard", icon: LayoutDashboard },
        { label: "My Profile", href: "/student/profile", icon: Users },
      ],
    },
    {
      title: "Academics",
      items: [
        { label: "Class Timetable", href: "/student/timetable", icon: CalendarDays },
        { label: "Attendance Ledger", href: "/student/attendance", icon: CheckSquare },
        { label: "Exam Results", href: "/student/results", icon: Award },
      ],
    },
    {
      title: "JLU Learning",
      items: [
        { label: "My Courses", href: "/student/lms", icon: BookOpen },
        { label: "Assignments", href: "/student/assignments", icon: FileText },
        { label: "Quizzes", href: "/student/quizzes", icon: HelpCircle },
      ],
    },
    {
      title: "Bursar & Treasury",
      items: [
        { label: "Fees & Payment", href: "/student/fees", icon: CreditCard },
        { label: "Official Receipts", href: "/student/receipts", icon: Receipt },
      ],
    },
    {
      title: "Campus Life & Notices",
      items: [
        { label: "Campus Life & Clubs", href: "/student/campus-life", icon: Flame, badge: "JLU Life" },
        { label: "University Notices", href: "/student/notices", icon: Bell },
      ],
    },
  ],
  ACCOUNTS: [
    {
      items: [
        { label: "Dashboard", href: "/accounts/dashboard", icon: LayoutDashboard },
        { label: "Fee Structures", href: "/accounts/fees", icon: FileSpreadsheet },
        { label: "Student Invoices", href: "/accounts/dues", icon: CreditCard },
      ],
    },
    {
      title: "Transactions & Audit",
      items: [
        { label: "Payment Ledger", href: "/accounts/payments", icon: Receipt },
        { label: "Official Receipts", href: "/accounts/receipts", icon: FileText },
        { label: "Bank Reconciliation", href: "/accounts/reconciliation", icon: ShieldCheck },
        { label: "Refund Requests", href: "/accounts/refunds", icon: RotateCcw },
      ],
    },
    {
      title: "Financial Reports",
      items: [
        { label: "Collection Analytics", href: "/accounts/reports", icon: BarChart3 },
      ],
    },
  ],
  MANAGEMENT: [
    {
      items: [
        { label: "Institutional Overview", href: "/management/dashboard", icon: LayoutDashboard },
        { label: "University Analytics", href: "/management/analytics", icon: BarChart3 },
        { label: "Governance Reports", href: "/management/reports", icon: FileText },
      ],
    },
  ],
};

interface SidebarProps {
  role: Role;
  isOpen: boolean;
  onClose: () => void;
  width?: number;
  onWidthChanging?: (width: number) => void;
  onWidthChanged?: (width: number) => void;
  onResetWidth?: () => void;
}

const DEFAULT_WIDTH = 260;
const MIN_WIDTH = 220;
const MAX_WIDTH = 420;

export default function Sidebar({
  role,
  isOpen,
  onClose,
  width = DEFAULT_WIDTH,
  onWidthChanging,
  onWidthChanged,
  onResetWidth,
}: SidebarProps) {
  const pathname = usePathname();
  const sections = SIDEBAR_MENUS[role] || [];

  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const startWidthRef = useRef(width);
  const currentWidthRef = useRef(width);
  const [isDragging, setIsDragging] = useState(false);
  const [dragPx, setDragPx] = useState(width);

  // Sync ref and display with prop updates (e.g. from localStorage or reset)
  useEffect(() => {
    if (!isDraggingRef.current) {
      currentWidthRef.current = width;
      setDragPx(width);
    }
  }, [width]);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0) return; // Primary button only

    e.preventDefault();
    e.stopPropagation();

    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {}

    isDraggingRef.current = true;
    startXRef.current = e.clientX;
    startWidthRef.current = currentWidthRef.current;
    setIsDragging(true);

    document.body.style.userSelect = "none";
    document.body.style.cursor = "col-resize";
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current) return;

    e.preventDefault();
    const deltaX = e.clientX - startXRef.current;
    const rawWidth = startWidthRef.current + deltaX;
    const clamped = Math.min(Math.max(MIN_WIDTH, Math.round(rawWidth)), MAX_WIDTH);

    currentWidthRef.current = clamped;
    setDragPx(clamped);

    // Update parent layout CSS variable instantly for 60fps responsiveness
    onWidthChanging?.(clamped);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current) return;

    isDraggingRef.current = false;
    setIsDragging(false);

    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {}

    document.body.style.userSelect = "";
    document.body.style.cursor = "";

    // Commit final width once
    onWidthChanged?.(currentWidthRef.current);
  };

  const handlePointerCancel = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current) return;

    isDraggingRef.current = false;
    setIsDragging(false);

    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {}

    document.body.style.userSelect = "";
    document.body.style.cursor = "";

    onWidthChanged?.(currentWidthRef.current);
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/75 backdrop-blur-xs lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Dark Sidebar Panel */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 max-w-[85vw] lg:max-w-none jlu-sidebar-desktop bg-slate-950 text-slate-300 border-r border-slate-800/80 flex flex-col select-none transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Brand Lockup */}
        <div className="h-20 flex items-center justify-between px-5 border-b border-slate-800/80 bg-slate-950/80 shrink-0 overflow-hidden">
          <Link href={`/${role.toLowerCase()}/dashboard`} className="flex items-center gap-2.5 min-w-0">
            <JLULogo variant="white" size="md" />
          </Link>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 lg:hidden shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Institutional Positioning Ribbon */}
        <div className="px-5 py-2 bg-gradient-to-r from-rose-950/60 to-slate-900 border-b border-slate-800/60 flex items-center justify-between text-[10px] text-amber-300/90 font-medium shrink-0 overflow-hidden">
          <span className="flex items-center gap-1.5 truncate">
            <Sparkles className="w-3 h-3 text-amber-400 shrink-0" />
            <span className="truncate">Diamond University</span>
          </span>
          <span className="text-slate-500 font-mono shrink-0 pl-2">232 Acres</span>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 overflow-y-auto px-3.5 py-4 space-y-6">
          {sections.map((section, idx) => (
            <div key={idx} className="space-y-1">
              {section.title && (
                <div className="px-3 pb-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-500 truncate">
                  {section.title}
                </div>
              )}
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== `/${role.toLowerCase()}/dashboard`);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => {
                      if (window.innerWidth < 1024) onClose();
                    }}
                    className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all group ${
                      isActive
                        ? "bg-rose-600 text-white shadow-xs font-bold"
                        : "text-slate-300 hover:bg-slate-900 hover:text-white"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0 pr-1">
                      <Icon
                        className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-110 ${
                          isActive ? "text-white" : "text-slate-400 group-hover:text-slate-200"
                        }`}
                      />
                      <span className="truncate">{item.label}</span>
                    </div>

                    {item.badge && (
                      <span
                        className={`px-1.5 py-0.2 text-[9px] rounded-full font-bold font-mono shrink-0 ${
                          isActive
                            ? "bg-white/20 text-white"
                            : "bg-rose-950 text-rose-300 border border-rose-800/60"
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-slate-800/80 bg-slate-950/80 text-[11px] text-slate-500 flex items-center justify-between shrink-0 min-w-0">
          <div className="min-w-0 truncate mr-2">
            <p className="font-bold text-slate-400 truncate">JLU Digital Campus</p>
            <p className="text-[10px] text-slate-600 font-mono truncate">v2.4 • Bhopal, MP</p>
          </div>
          <div className="w-2 h-2 shrink-0 rounded-full bg-emerald-500 shadow-2xs shadow-emerald-500/50" title="Central Relational Server Online" />
        </div>

        {/* Dedicated Drag-to-Resize Handle */}
        <div
          role="separator"
          tabIndex={0}
          aria-orientation="vertical"
          aria-valuenow={dragPx}
          aria-valuemin={MIN_WIDTH}
          aria-valuemax={MAX_WIDTH}
          aria-label="Resize sidebar"
          title="Drag horizontally to resize sidebar (220px–420px) • Double-click to reset (260px)"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerCancel}
          onDoubleClick={() => {
            currentWidthRef.current = DEFAULT_WIDTH;
            setDragPx(DEFAULT_WIDTH);
            onResetWidth?.();
          }}
          onKeyDown={(e) => {
            const step = e.shiftKey ? 20 : 10;
            if (e.key === "ArrowRight") {
              e.preventDefault();
              const newW = Math.min(MAX_WIDTH, currentWidthRef.current + step);
              currentWidthRef.current = newW;
              setDragPx(newW);
              onWidthChanged?.(newW);
            } else if (e.key === "ArrowLeft") {
              e.preventDefault();
              const newW = Math.max(MIN_WIDTH, currentWidthRef.current - step);
              currentWidthRef.current = newW;
              setDragPx(newW);
              onWidthChanged?.(newW);
            } else if (e.key === "Home") {
              e.preventDefault();
              currentWidthRef.current = DEFAULT_WIDTH;
              setDragPx(DEFAULT_WIDTH);
              onResetWidth?.();
            }
          }}
          className="hidden lg:flex absolute top-0 bottom-0 -right-2.5 w-5 cursor-col-resize items-center justify-center group z-50 select-none touch-none focus:outline-none"
        >
          {/* Subtle vertical indicator bar */}
          <div
            className={`w-[2px] h-full transition-colors duration-150 ${
              isDragging
                ? "bg-rose-500 shadow-sm shadow-rose-500/50"
                : "bg-slate-800/80 group-hover:bg-rose-500/90 group-focus:bg-rose-500/90"
            }`}
          />
          {/* Center tactile grip pill */}
          <div
            className={`absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 w-4 h-8 rounded-full border border-slate-700 bg-slate-900 flex items-center justify-center transition-all duration-150 shadow-md ${
              isDragging
                ? "opacity-100 bg-rose-950 border-rose-500 text-rose-400 scale-110 ring-2 ring-rose-500/30"
                : "opacity-0 group-hover:opacity-100 group-focus:opacity-100 text-slate-400 hover:text-slate-200"
            }`}
          >
            <GripVertical className="w-3 h-3" />
          </div>
          {/* Width indicator badge while dragging */}
          {isDragging && (
            <div className="absolute top-20 left-4 px-2 py-1 bg-slate-900 text-rose-300 text-[10px] font-mono font-bold rounded-md border border-rose-500/40 shadow-xl pointer-events-none whitespace-nowrap z-50 flex items-center gap-1.5">
              <span>{dragPx}px</span>
              <span className="text-[9px] text-slate-500 font-normal">(220–420)</span>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
