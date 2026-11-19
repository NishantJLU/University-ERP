"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  Menu,
  Bell,
  Search,
  LogOut,
  ChevronDown,
  Shield,
  GraduationCap,
  BookOpen,
  Calculator,
  Building,
  CheckCircle2,
  Calendar,
  User as UserIcon,
} from "lucide-react";
import { SessionUser, Role } from "@/types";
import { JLU_PROFILE } from "@/lib/jlu-constants";

interface HeaderProps {
  user: SessionUser;
  onOpenSidebar: () => void;
  onOpenSearch?: () => void;
}

const ROLES_LIST: { role: Role; label: string; icon: any }[] = [
  { role: "ADMIN", label: "Administration Console", icon: Shield },
  { role: "TEACHER", label: "Faculty Portal", icon: BookOpen },
  { role: "STUDENT", label: "Student Portal", icon: GraduationCap },
  { role: "HOD", label: "HOD Department Portal", icon: Building },
  { role: "ACCOUNTS", label: "Accounts & Bursar", icon: Calculator },
  { role: "MANAGEMENT", label: "Executive Board", icon: Building },
];

export default function Header({ user, onOpenSidebar, onOpenSearch }: HeaderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [switching, setSwitching] = useState(false);
  const [unreadNotifs, setUnreadNotifs] = useState(2);

  const roleMenuRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const notifMenuRef = useRef<HTMLDivElement>(null);

  // Outside click listener to dismiss all dropdown menus
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (roleMenuRef.current && !roleMenuRef.current.contains(event.target as Node)) {
        setRoleMenuOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
      if (notifMenuRef.current && !notifMenuRef.current.contains(event.target as Node)) {
        setNotifOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setRoleMenuOpen(false);
        setUserMenuOpen(false);
        setNotifOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const handleOpenSearch = () => {
    if (onOpenSearch) {
      onOpenSearch();
    } else if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("open-command-palette"));
    }
  };

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  };

  const handleSwitchRole = async (targetRole: Role) => {
    if (targetRole === user.role) {
      setRoleMenuOpen(false);
      return;
    }
    setSwitching(true);
    try {
      const res = await fetch("/api/auth/switch-role", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: targetRole }),
      });
      const data = await res.json();
      if (data.success && data.redirectUrl) {
        setRoleMenuOpen(false);
        window.location.href = data.redirectUrl;
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSwitching(false);
    }
  };

  // Generate readable academic breadcrumbs
  const pathParts = pathname.split("/").filter(Boolean);

  return (
    <header className="sticky top-0 z-30 h-16 bg-[#FFFFFF] text-[#172B4D] border-b border-[#E5E7EB] px-4 sm:px-6 flex items-center justify-between select-none shadow-2xs">
      {/* Left: Mobile Toggle + Breadcrumbs */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onOpenSidebar}
          className="p-1.5 -ml-1.5 rounded-lg text-[#8490A0] hover:text-[#172B4D] hover:bg-[#F5F6F8] lg:hidden focus:outline-none transition shrink-0"
          aria-label="Open sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Functional Breadcrumb Navigation Context */}
        <div className="hidden sm:flex items-center gap-1.5 text-xs text-[#8490A0] font-medium min-w-0 overflow-hidden">
          <span className="font-semibold text-[#172B4D] tracking-wide shrink-0">JLU Digital Campus</span>
          <span className="text-[#CBD5E1] shrink-0">/</span>
          {pathParts.map((part, index) => {
            const isLast = index === pathParts.length - 1;
            const labelMap: Record<string, string> = {
              timetable: "Timetable",
              attendance: "Attendance",
              fees: "Fees",
              results: "Results",
              receipts: "Receipts",
              lms: "Courses",
              assignments: "Assignments",
              quizzes: "Quizzes",
              dashboard: "Dashboard",
              profile: "Profile",
              department: "Department",
              resources: "Resources",
              faculty: "Faculty Roster",
            };
            const displayLabel = labelMap[part] || part.replace("-", " ");

            return (
              <span key={part} className="flex items-center gap-1.5 min-w-0">
                <span
                  className={
                    isLast
                      ? "text-[#172B4D] font-bold capitalize truncate max-w-[140px] md:max-w-none"
                      : "text-[#8490A0] capitalize hover:text-[#172B4D] truncate max-w-[100px] md:max-w-none"
                  }
                >
                  {displayLabel}
                </span>
                {!isLast && <span className="text-[#CBD5E1] shrink-0">/</span>}
              </span>
            );
          })}
        </div>
      </div>

      {/* Right: Academic Year, Search, Role Switcher & Profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Academic Session Indicator */}
        <div className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#FDF2F4] border border-[#FBE4E9] text-[#8B1E3F] text-[11px] font-semibold">
          <Calendar className="w-3.5 h-3.5 text-[#8B1E3F]" />
          <span>AY {JLU_PROFILE.currentAcademicYear} (ODD SEM)</span>
        </div>

        {/* Global Command / Search Trigger */}
        <button
          type="button"
          onClick={handleOpenSearch}
          className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#F9FAFB] hover:bg-[#F5F6F8] text-[#475569] hover:text-[#172B4D] text-xs border border-[#E5E7EB] transition cursor-pointer"
          title="Search System (Cmd+K)"
        >
          <Search className="w-3.5 h-3.5 text-[#8490A0]" />
          <span>Search records...</span>
          <kbd className="ml-1 px-1.5 py-0.5 rounded-md bg-[#FFFFFF] text-[10px] font-mono border border-[#E5E7EB] text-[#475569]">
            ⌘K
          </kbd>
        </button>

        <button
          type="button"
          onClick={handleOpenSearch}
          className="p-1.5 rounded-lg text-[#8490A0] hover:text-[#172B4D] hover:bg-[#F5F6F8] sm:hidden"
          title="Search"
        >
          <Search className="w-4 h-4" />
        </button>

        {/* Quick Role Switcher for seamless testing */}
        <div className="relative" ref={roleMenuRef}>
          <button
            type="button"
            onClick={() => {
              setRoleMenuOpen(!roleMenuOpen);
              setUserMenuOpen(false);
              setNotifOpen(false);
            }}
            disabled={switching}
            className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-[#F9FAFB] hover:bg-[#F5F6F8] text-[#172B4D] border border-[#E5E7EB] transition"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#8B1E3F]" />
            <span className="hidden md:inline text-[#8490A0] font-normal">Role:</span>
            <span>{user.role}</span>
            <ChevronDown className="w-3.5 h-3.5 text-[#8490A0]" />
          </button>

          {roleMenuOpen && (
            <div className="absolute right-0 mt-2 w-60 rounded-xl bg-white shadow-lg border border-[#E5E7EB] py-1.5 z-50 text-[#172B4D] animate-in fade-in zoom-in-95 duration-100">
              <div className="px-3.5 py-2 border-b border-[#E5E7EB] bg-[#F9FAFB]">
                <p className="text-[10px] font-bold text-[#8490A0] uppercase tracking-wider">
                  Switch Portal Persona
                </p>
              </div>
              <div className="p-1">
                {ROLES_LIST.map((r) => {
                  const Icon = r.icon;
                  const isCurrent = r.role === user.role;
                  return (
                    <button
                      key={r.role}
                      type="button"
                      onClick={() => handleSwitchRole(r.role)}
                      className={`w-full text-left px-3 py-2 text-xs rounded-lg flex items-center justify-between hover:bg-[#F5F6F8] transition ${
                        isCurrent ? "font-bold text-[#8B1E3F] bg-[#FDF2F4]" : "text-[#475569]"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className={`w-4 h-4 ${isCurrent ? "text-[#8B1E3F]" : "text-[#8490A0]"}`} />
                        <span>{r.label}</span>
                      </div>
                      {isCurrent && <CheckCircle2 className="w-4 h-4 text-[#8B1E3F]" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Notifications Dropdown */}
        <div className="relative" ref={notifMenuRef}>
          <button
            type="button"
            onClick={() => {
              setNotifOpen(!notifOpen);
              setRoleMenuOpen(false);
              setUserMenuOpen(false);
            }}
            className="p-2 rounded-lg text-[#8490A0] hover:text-[#172B4D] hover:bg-[#F5F6F8] relative transition"
            title="System Notices"
          >
            <Bell className="w-4 h-4" />
            {unreadNotifs > 0 && (
              <span className="absolute top-1.5 right-1.5 min-w-[14px] h-3.5 px-1 rounded-full bg-[#8B1E3F] text-white text-[8px] font-bold flex items-center justify-center">
                {unreadNotifs}
              </span>
            )}
          </button>

          {notifOpen && (
            <div className="absolute right-0 mt-2 w-80 rounded-xl bg-white shadow-lg border border-[#E5E7EB] p-4 z-50 text-[#172B4D] animate-in fade-in zoom-in-95 duration-100">
              <div className="flex items-center justify-between pb-2.5 border-b border-[#E5E7EB]">
                <span className="text-xs font-bold text-[#172B4D]">Campus Circulars</span>
                {unreadNotifs > 0 ? (
                  <button
                    type="button"
                    onClick={() => setUnreadNotifs(0)}
                    className="text-[10px] text-[#8B1E3F] hover:underline font-semibold"
                  >
                    Mark read ({unreadNotifs})
                  </button>
                ) : (
                  <span className="text-[10px] text-[#8490A0]">All read</span>
                )}
              </div>
              <div className="mt-2.5 space-y-2 text-xs">
                <div className="p-2.5 rounded-lg bg-[#F9FAFB] border border-[#E5E7EB]">
                  <p className="font-semibold text-[#172B4D]">Annual Academic Convocation</p>
                  <p className="text-[11px] text-[#475569] mt-0.5">
                    Registration opened for eligible graduating cohorts.
                  </p>
                  <span className="text-[9px] text-[#8490A0] mt-1 block font-mono">2 hours ago</span>
                </div>
                <div className="p-2.5 rounded-lg bg-[#F9FAFB] border border-[#E5E7EB]">
                  <p className="font-semibold text-[#172B4D]">End-Term Examination Schedule</p>
                  <p className="text-[11px] text-[#475569] mt-0.5">
                    Practical assessments commence Oct 18, 2026.
                  </p>
                  <span className="text-[9px] text-[#8490A0] mt-1 block font-mono">Yesterday</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Standard User Profile Menu */}
        <div className="relative" ref={userMenuRef}>
          <button
            type="button"
            onClick={() => {
              setUserMenuOpen(!userMenuOpen);
              setRoleMenuOpen(false);
              setNotifOpen(false);
            }}
            className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg bg-[#F9FAFB] hover:bg-[#F5F6F8] border border-[#E5E7EB] text-left transition"
          >
            <div className="w-6 h-6 rounded-md bg-[#8B1E3F] text-white font-bold text-[11px] flex items-center justify-center shadow-2xs">
              {user.name.charAt(0)}
            </div>
            <div className="hidden xl:block text-left" title={user.name}>
              <p className="text-xs font-semibold text-[#172B4D] leading-tight truncate max-w-[150px]">
                {user.name.replace(/\s*\([^)]*\)$/, "").trim() || user.name}
              </p>
              <p className="text-[10px] text-[#8490A0] font-medium truncate max-w-[150px]">
                {user.role}
              </p>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-[#8490A0] hidden xl:block" />
          </button>

          {userMenuOpen && (
            <div className="absolute right-0 mt-2 w-64 rounded-xl bg-white shadow-lg border border-[#E5E7EB] py-1.5 z-50 text-[#172B4D] animate-in fade-in zoom-in-95 duration-100">
              <div className="px-3.5 py-2.5 border-b border-[#E5E7EB] bg-[#F9FAFB]">
                <p className="text-xs font-bold text-[#172B4D] leading-snug">{user.name}</p>
                <p className="text-[11px] text-[#8490A0] font-mono mt-0.5">{user.email}</p>
                <div className="mt-1.5">
                  <span className="inline-block px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#FDF2F4] text-[#8B1E3F] border border-[#FBE4E9]">
                    {user.role} Portal
                  </span>
                </div>
              </div>

              <div className="p-1 text-xs">
                <div className="px-3 py-1.5 text-[#475569] flex justify-between">
                  <span>University:</span>
                  <span className="font-semibold text-[#172B4D]">JLU Bhopal</span>
                </div>
              </div>

              <div className="border-t border-[#E5E7EB] p-1">
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full text-left px-3 py-2 text-xs font-semibold text-[#C2414B] hover:bg-[#FEF2F2] rounded-lg flex items-center gap-2 transition"
                >
                  <LogOut className="w-4 h-4 text-[#C2414B]" />
                  <span>Log Out of Portal</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
