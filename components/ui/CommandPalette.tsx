"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  X,
  GraduationCap,
  BookOpen,
  Calendar,
  CreditCard,
  Building,
  Users,
  ShieldCheck,
  AlertTriangle,
  ArrowRight,
  FileText,
  Clock,
  Settings,
} from "lucide-react";
import { Role } from "@/types";

interface CommandItem {
  id: string;
  title: string;
  category: "Navigation" | "Academics" | "Finance" | "Tools" | "Actions";
  icon: any;
  href: string;
  roles?: Role[];
  keywords: string[];
}

const COMMAND_ITEMS: CommandItem[] = [
  // Admin & General
  {
    id: "admin-dashboard",
    title: "Admin Governance Console",
    category: "Navigation",
    icon: ShieldCheck,
    href: "/admin/dashboard",
    roles: ["ADMIN"],
    keywords: ["admin", "dashboard", "home", "registrar", "governance"],
  },
  {
    id: "admin-departments",
    title: "Academic Departments",
    category: "Academics",
    icon: Building,
    href: "/admin/departments",
    roles: ["ADMIN"],
    keywords: ["department", "faculty", "buildings", "schools"],
  },
  {
    id: "admin-programs",
    title: "Degree Programs Master",
    category: "Academics",
    icon: GraduationCap,
    href: "/admin/programs",
    roles: ["ADMIN"],
    keywords: ["programs", "degrees", "btech", "bca", "mba", "bba"],
  },
  {
    id: "admin-subjects",
    title: "Curriculum Subjects & Credits",
    category: "Academics",
    icon: BookOpen,
    href: "/admin/subjects",
    roles: ["ADMIN"],
    keywords: ["subjects", "courses", "credits", "syllabus"],
  },
  {
    id: "admin-timetable-conflicts",
    title: "Timetable Conflict Inspector",
    category: "Tools",
    icon: AlertTriangle,
    href: "/admin/timetable/conflicts",
    roles: ["ADMIN", "HOD"],
    keywords: ["conflicts", "collision", "timetable", "room", "teacher double booking"],
  },
  {
    id: "admin-audit-logs",
    title: "System Audit Trail",
    category: "Tools",
    icon: Clock,
    href: "/admin/audit-logs",
    roles: ["ADMIN"],
    keywords: ["audit", "logs", "security", "activity", "trail"],
  },
  {
    id: "admin-students",
    title: "Student Census Directory",
    category: "Academics",
    icon: Users,
    href: "/admin/students",
    roles: ["ADMIN", "HOD"],
    keywords: ["students", "enrollment", "roster", "directory"],
  },
  // Teacher
  {
    id: "teacher-attendance",
    title: "Record Daily Class Attendance",
    category: "Actions",
    icon: Calendar,
    href: "/teacher/attendance",
    roles: ["TEACHER", "ADMIN"],
    keywords: ["attendance", "mark", "class", "present", "absent", "roster"],
  },
  {
    id: "teacher-timetable",
    title: "My Teaching Timetable",
    category: "Academics",
    icon: Calendar,
    href: "/teacher/timetable",
    roles: ["TEACHER"],
    keywords: ["teacher", "schedule", "timetable", "classes", "periods"],
  },
  {
    id: "teacher-submissions",
    title: "Grade Student Submissions",
    category: "Actions",
    icon: FileText,
    href: "/teacher/submissions",
    roles: ["TEACHER"],
    keywords: ["grade", "grading", "submissions", "assignments", "marks"],
  },
  {
    id: "teacher-lms",
    title: "Faculty LMS Course Studio",
    category: "Academics",
    icon: BookOpen,
    href: "/teacher/lms",
    roles: ["TEACHER"],
    keywords: ["lms", "course", "modules", "learning", "studio"],
  },
  // Student
  {
    id: "student-dashboard",
    title: "Student Academic Cockpit",
    category: "Navigation",
    icon: GraduationCap,
    href: "/student/dashboard",
    roles: ["STUDENT"],
    keywords: ["student", "dashboard", "grades", "classes", "today"],
  },
  {
    id: "student-attendance",
    title: "My Attendance & 75% Tracker",
    category: "Academics",
    icon: Calendar,
    href: "/student/attendance",
    roles: ["STUDENT"],
    keywords: ["attendance", "percentage", "safety margin", "safe", "shortage"],
  },
  {
    id: "student-fees",
    title: "Pay Semester Fees & Dues",
    category: "Finance",
    icon: CreditCard,
    href: "/student/fees",
    roles: ["STUDENT"],
    keywords: ["fees", "pay", "payment", "dues", "tuition"],
  },
  {
    id: "student-receipts",
    title: "Official Digital Fee Receipts",
    category: "Finance",
    icon: FileText,
    href: "/student/receipts",
    roles: ["STUDENT"],
    keywords: ["receipt", "receipts", "pdf", "seal", "payment proof"],
  },
  {
    id: "student-lms",
    title: "LMS Learning Hub (Canvas + D2L)",
    category: "Academics",
    icon: BookOpen,
    href: "/student/lms",
    roles: ["STUDENT"],
    keywords: ["lms", "canvas", "brightspace", "modules", "assignments", "quiz"],
  },
  // Accounts
  {
    id: "accounts-reconciliation",
    title: "Bank Batch Reconciliation",
    category: "Finance",
    icon: CreditCard,
    href: "/accounts/reconciliation",
    roles: ["ACCOUNTS", "ADMIN"],
    keywords: ["reconciliation", "bank", "settle", "batch", "finance"],
  },
  {
    id: "accounts-dues",
    title: "Outstanding Defaulter Ledger",
    category: "Finance",
    icon: CreditCard,
    href: "/accounts/dues",
    roles: ["ACCOUNTS"],
    keywords: ["dues", "defaulters", "outstanding", "unpaid"],
  },
  // HOD
  {
    id: "hod-approvals",
    title: "Timetable Approval & Publication",
    category: "Actions",
    icon: ShieldCheck,
    href: "/hod/approvals",
    roles: ["HOD", "ADMIN"],
    keywords: ["approve", "publish", "timetable", "schedule", "hod"],
  },
  // Management
  {
    id: "management-dashboard",
    title: "Executive Chancellor KPI Cockpit",
    category: "Navigation",
    icon: Building,
    href: "/management/dashboard",
    roles: ["MANAGEMENT"],
    keywords: ["management", "chancellor", "analytics", "charts", "kpi"],
  },
];

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  userRole: Role;
}

export default function CommandPalette({ isOpen, onClose, userRole }: CommandPaletteProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Filter accessible commands
  const filteredCommands = useMemo(() => {
    const q = query.toLowerCase().trim();
    return COMMAND_ITEMS.filter((item) => {
      const hasRole = !item.roles || item.roles.includes(userRole);
      if (!hasRole) return false;
      if (!q) return true;
      return (
        item.title.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        item.keywords.some((k) => k.toLowerCase().includes(q))
      );
    });
  }, [query, userRole]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  // Handle keyboard navigation inside command palette
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % (filteredCommands.length || 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + filteredCommands.length) % (filteredCommands.length || 1));
      } else if (e.key === "Enter" && filteredCommands[selectedIndex]) {
        e.preventDefault();
        router.push(filteredCommands[selectedIndex].href);
        onClose();
      } else if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, filteredCommands, selectedIndex, router, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-start justify-center pt-20 p-4">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity animate-in fade-in"
      />

      {/* Palette Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-xl w-full border border-slate-200 overflow-hidden z-10 animate-in zoom-in-95 duration-150">
        {/* Search Bar Input */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-200">
          <Search className="w-5 h-5 text-slate-400 shrink-0 mr-3" />
          <input
            autoFocus
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command or search students, subjects, timetable, fees... (Esc to close)"
            className="w-full text-sm bg-transparent placeholder-slate-400 text-slate-900 focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="text-slate-400 hover:text-slate-600 p-1 rounded-md"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-block ml-2 px-2 py-0.5 text-[10px] font-mono bg-slate-100 text-slate-500 rounded border border-slate-200">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="max-h-80 overflow-y-auto p-2 divide-y divide-slate-100">
          {filteredCommands.length > 0 ? (
            filteredCommands.map((item, idx) => {
              const isSelected = idx === selectedIndex;
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    router.push(item.href);
                    onClose();
                  }}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs flex items-center justify-between transition ${
                    isSelected
                      ? "bg-blue-50/80 text-blue-900 font-semibold ring-1 ring-blue-200"
                      : "text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-lg shrink-0 ${
                        isSelected ? "bg-blue-600 text-white shadow-xs" : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-semibold">{item.title}</p>
                      <span className="text-[10px] text-slate-400">{item.category}</span>
                    </div>
                  </div>
                  <ArrowRight
                    className={`w-3.5 h-3.5 transition-transform ${
                      isSelected ? "text-blue-600 translate-x-0.5" : "text-slate-300 opacity-0"
                    }`}
                  />
                </button>
              );
            })
          ) : (
            <div className="p-8 text-center text-xs text-slate-400">
              No matching commands or pages found for &ldquo;{query}&rdquo;
            </div>
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
          <div className="flex items-center gap-3">
            <span>
              <kbd className="px-1.5 py-0.5 bg-white border border-slate-200 rounded font-mono text-[9px] shadow-xs">↑</kbd>{" "}
              <kbd className="px-1.5 py-0.5 bg-white border border-slate-200 rounded font-mono text-[9px] shadow-xs">↓</kbd> to navigate
            </span>
            <span>
              <kbd className="px-1.5 py-0.5 bg-white border border-slate-200 rounded font-mono text-[9px] shadow-xs">↵</kbd> to select
            </span>
          </div>
          <span className="font-medium text-slate-500">JLU Platform Command</span>
        </div>
      </div>
    </div>
  );
}
