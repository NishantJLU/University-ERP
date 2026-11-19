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
  BookMarked,
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
        { label: "Academic Resources", href: "/student/resources", icon: BookMarked },
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
        { label: "My School / Dept", href: "/hod/department", icon: Building },
        { label: "Faculty Roster", href: "/hod/faculty", icon: Users },
        { label: "Enrolled Students", href: "/hod/students", icon: GraduationCap },
        { label: "Academic Resources", href: "/student/resources", icon: BookMarked },
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
        { label: "Academic Resources", href: "/student/resources", icon: BookMarked },
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
        { label: "Timetable", href: "/student/timetable", icon: CalendarDays },
        { label: "Attendance", href: "/student/attendance", icon: CheckSquare },
        { label: "Results", href: "/student/results", icon: Award },
      ],
    },
    {
      title: "Learning & Courses",
      items: [
        { label: "My Courses", href: "/student/lms", icon: BookOpen },
        { label: "Academic Resources", href: "/student/resources", icon: BookMarked },
        { label: "Assignments", href: "/student/assignments", icon: FileText },
        { label: "Quizzes", href: "/student/quizzes", icon: HelpCircle },
      ],
    },
    {
      title: "Fees & Accounts",
      items: [
        { label: "Fees", href: "/student/fees", icon: CreditCard },
        { label: "Receipts", href: "/student/receipts", icon: Receipt },
      ],
    },
    {
      title: "Campus Notices",
      items: [
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
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Clean White Institutional Sidebar Panel */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 max-w-[85vw] lg:max-w-none jlu-sidebar-desktop bg-[#FFFFFF] text-[#546574] border-r border-[#E2E8F0] flex flex-col select-none transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Brand Lockup */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-[#E2E8F0] bg-[#FFFFFF] shrink-0 overflow-hidden">
          <Link
            href={`/${role.toLowerCase()}/dashboard`}
            className="flex items-center gap-2.5 min-w-0 group"
          >
            <JLULogo variant="full" size="md" />
          </Link>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#8D9BA8] hover:text-[#21313C] hover:bg-[#F1F3F5] lg:hidden shrink-0 transition"
            aria-label="Close menu"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Institutional Positioning Ribbon */}
        <div className="px-4 py-1.5 bg-[#F1F3F5] border-b border-[#EAEDF0] flex items-center justify-between text-[10px] text-[#546574] font-medium shrink-0">
          <span className="flex items-center gap-1.5 truncate">
            <span className="w-1.5 h-1.5 rounded-full bg-[#027EA1] shrink-0" />
            <span className="text-[#027EA1] font-semibold truncate">Central India&apos;s Diamond University</span>
          </span>
          <span className="text-[#8D9BA8] font-mono shrink-0 pl-2">232 Acres</span>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-5">
          {sections.map((section, idx) => (
            <div key={idx} className="space-y-1">
              {section.title && (
                <div className="px-2.5 pb-1 text-[10px] font-bold uppercase tracking-wider text-[#8D9BA8] truncate">
                  {section.title}
                </div>
              )}
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive =
                  pathname === item.href ||
                  (item.href !== `/${role.toLowerCase()}/dashboard` &&
                    pathname.startsWith(item.href + "/"));

                return (
                  <Link
                    key={`${item.href}-${item.label}`}
                    href={item.href}
                    onClick={() => {
                      if (window.innerWidth < 1024) onClose();
                    }}
                    className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all group ${
                      isActive
                        ? "bg-[#EAF5F8] text-[#015D77] font-semibold border-l-[3px] border-[#027EA1] pl-2.5 shadow-2xs"
                        : "text-[#546574] hover:text-[#21313C] hover:bg-[#F1F3F5]"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0 pr-1">
                      <Icon
                        className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-105 ${
                          isActive
                            ? "text-[#027EA1]"
                            : "text-[#8D9BA8] group-hover:text-[#21313C]"
                        }`}
                      />
                      <span className="truncate">{item.label}</span>
                    </div>

                    {item.badge && (
                      <span className="px-2 py-0.5 text-[9px] font-mono font-bold rounded-full bg-[#EAF5F8] text-[#027EA1] border border-[#BEE1EC] shrink-0">
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
        <div className="p-3.5 border-t border-[#EAEDF0] bg-[#FFFFFF] text-xs text-[#546574] flex items-center justify-between shrink-0 min-w-0">
          <div className="min-w-0 truncate mr-2">
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-[#21313C] truncate">JLU Digital Campus</span>
              <span className="px-1.5 py-0.5 text-[9px] font-bold rounded-sm bg-[#EAF5F8] text-[#027EA1] border border-[#BEE1EC]">
                {role}
              </span>
            </div>
            <p className="text-[10px] text-[#8D9BA8] font-mono truncate mt-0.5">
              AY {JLU_PROFILE.currentAcademicYear} • Central DB
            </p>
          </div>
          <div className="flex items-center gap-1.5 shrink-0" title="Central Academic Database Online">
            <span className="w-2 h-2 rounded-full bg-[#16845B]" />
          </div>
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
                ? "bg-[#027EA1] shadow-xs shadow-[#027EA1]/40"
                : "bg-transparent group-hover:bg-[#027EA1]/70 group-focus:bg-[#027EA1]/70"
            }`}
          />
          {/* Center tactile grip pill */}
          <div
            className={`absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 w-4 h-8 rounded-full border border-[#E2E8F0] bg-[#FFFFFF] flex items-center justify-center transition-all duration-150 shadow-xs ${
              isDragging
                ? "opacity-100 bg-[#EAF5F8] border-[#027EA1] text-[#027EA1] scale-110 ring-2 ring-[#027EA1]/20"
                : "opacity-0 group-hover:opacity-100 group-focus:opacity-100 text-[#8D9BA8] hover:text-[#21313C]"
            }`}
          >
            <GripVertical className="w-3 h-3" />
          </div>
          {/* Width indicator badge while dragging */}
          {isDragging && (
            <div className="absolute top-20 left-4 px-2 py-1 bg-[#FFFFFF] text-[#027EA1] text-[10px] font-mono font-bold rounded-md border border-[#BEE1EC] shadow-md pointer-events-none whitespace-nowrap z-50 flex items-center gap-1.5">
              <span>{dragPx}px</span>
              <span className="text-[9px] text-[#8D9BA8] font-normal">(220–420)</span>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
