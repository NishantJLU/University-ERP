"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
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
  const [dynamicBreadcrumbs, setDynamicBreadcrumbs] = useState<Record<string, string>>({});

  const roleMenuRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const notifMenuRef = useRef<HTMLDivElement>(null);

  // Dynamic breadcrumb listener for pages with dynamic IDs
  useEffect(() => {
    const handleTitle = (e: any) => {
      if (e.detail?.id && e.detail?.title) {
        setDynamicBreadcrumbs((prev) => ({
          ...prev,
          [e.detail.id]: e.detail.title,
        }));
      }
    };
    window.addEventListener("erp-breadcrumb-title", handleTitle);
    return () => window.removeEventListener("erp-breadcrumb-title", handleTitle);
  }, []);

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
    <header className="sticky top-0 z-30 h-16 bg-[#FFFFFF] text-[#202435] border-b border-[#E5E7EB] px-4 sm:px-6 flex items-center justify-between select-none shadow-2xs">
      {/* Left: Mobile Toggle + Breadcrumbs */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onOpenSidebar}
          className="p-1.5 -ml-1.5 rounded-lg text-[#9299A8] hover:text-[#202435] hover:bg-[#F1F2F5] lg:hidden focus:outline-none transition shrink-0"
          aria-label="Open sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Functional Breadcrumb Navigation Context */}
        <div className="hidden sm:flex items-center gap-1.5 text-xs text-[#697386] font-medium min-w-0 overflow-hidden">
          <Link
            href="/"
            className="font-semibold text-[#202435] tracking-wide shrink-0 hover:text-[#861F41] transition"
          >
            JLU Digital Campus
          </Link>
          <span className="text-[#D8DBE2] shrink-0">/</span>
          {pathParts.map((part, index) => {
            const isLast = index === pathParts.length - 1;
            const labelMap: Record<string, string> = {
              student: "Student Portal",
              teacher: "Faculty Portal",
              admin: "Administration",
              hod: "HOD Portal",
              accounts: "Accounts",
              management: "Management",
              timetable: "Timetable",
              attendance: "Attendance",
              fees: "Fees & Dues",
              results: "Results",
              receipts: "Receipts",
              lms: "My Courses",
              assignments: "Assignments",
              quizzes: "Quizzes",
              dashboard: "Dashboard",
              profile: "Profile",
              department: "My School / Dept",
              resources: "Academic Resources",
              faculty: "Faculty Roster",
            };

            const isId =
              /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(part) ||
              /^[a-z0-9_-]{20,}$/i.test(part);

            let displayLabel = dynamicBreadcrumbs[part] || labelMap[part];
            if (!displayLabel) {
              if (isId) {
                const prev = pathParts[index - 1];
                if (prev === "lms" || prev === "courses") {
                  displayLabel = "Course Workspace";
                } else {
                  displayLabel = "Overview";
                }
              } else {
                displayLabel = part.replace(/-/g, " ");
              }
            }

            let href = "/" + pathParts.slice(0, index + 1).join("/");
            if (index === 0 && ["student", "teacher", "admin", "hod", "accounts", "management"].includes(part)) {
              href = `/${part}/dashboard`;
            }

            return (
              <span key={`${part}-${index}`} className="flex items-center gap-1.5 min-w-0">
                {isLast ? (
                  <span className="text-[#202435] font-bold capitalize truncate max-w-[200px] md:max-w-none">
                    {displayLabel}
                  </span>
                ) : (
                  <Link
                    href={href}
                    className="text-[#697386] capitalize hover:text-[#861F41] hover:underline transition truncate max-w-[120px] md:max-w-none"
                  >
                    {displayLabel}
                  </Link>
                )}
                {!isLast && <span className="text-[#D8DBE2] shrink-0">/</span>}
              </span>
            );
          })}
        </div>
      </div>

      {/* Right: Academic Year, Search, Role Switcher & Profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Academic Session Indicator */}
        <div className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#F9EEF2] border border-[#F4D3DE] text-[#861F41] text-[11px] font-semibold">
          <Calendar className="w-3.5 h-3.5 text-[#861F41]" />
          <span>AY {JLU_PROFILE.currentAcademicYear} (ODD SEM)</span>
        </div>

        {/* Global Command / Search Trigger */}
        <button
          type="button"
          onClick={handleOpenSearch}
          className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#F1F2F5] hover:bg-[#F8F8FA] text-[#697386] hover:text-[#202435] text-xs border border-[#E5E7EB] transition cursor-pointer"
          title="Search System (Cmd+K)"
        >
          <Search className="w-3.5 h-3.5 text-[#9299A8]" />
          <span>Search records...</span>
          <kbd className="ml-1 px-1.5 py-0.5 rounded-md bg-[#FFFFFF] text-[10px] font-mono border border-[#E5E7EB] text-[#697386]">
            ⌘K
          </kbd>
        </button>

        <button
          type="button"
          onClick={handleOpenSearch}
          className="p-1.5 rounded-lg text-[#9299A8] hover:text-[#202435] hover:bg-[#F1F2F5] sm:hidden"
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
            className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-[#F1F2F5] hover:bg-[#F8F8FA] text-[#202435] border border-[#E5E7EB] transition"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#861F41]" />
            <span className="hidden md:inline text-[#9299A8] font-normal">Role:</span>
            <span>{user.role}</span>
            <ChevronDown className="w-3.5 h-3.5 text-[#9299A8]" />
          </button>

          {roleMenuOpen && (
            <div className="absolute right-0 mt-2 w-60 rounded-xl bg-white shadow-lg border border-[#E5E7EB] py-1.5 z-50 text-[#202435] animate-in fade-in zoom-in-95 duration-100">
              <div className="px-3.5 py-2 border-b border-[#EEF0F3] bg-[#F1F2F5]">
                <p className="text-[10px] font-bold text-[#9299A8] uppercase tracking-wider">
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
                      className={`w-full text-left px-3 py-2 text-xs rounded-lg flex items-center justify-between hover:bg-[#F1F2F5] transition ${
                        isCurrent ? "font-bold text-[#861F41] bg-[#F9EEF2]" : "text-[#697386]"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className={`w-4 h-4 ${isCurrent ? "text-[#861F41]" : "text-[#9299A8]"}`} />
                        <span>{r.label}</span>
                      </div>
                      {isCurrent && <CheckCircle2 className="w-4 h-4 text-[#861F41]" />}
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
            className="p-2 rounded-lg text-[#9299A8] hover:text-[#202435] hover:bg-[#F1F2F5] relative transition"
            title="System Notices"
          >
            <Bell className="w-4 h-4" />
            {unreadNotifs > 0 && (
              <span className="absolute top-1.5 right-1.5 min-w-[14px] h-3.5 px-1 rounded-full bg-[#861F41] text-white text-[8px] font-bold flex items-center justify-center">
                {unreadNotifs}
              </span>
            )}
          </button>

          {notifOpen && (
            <div className="absolute right-0 mt-2 w-80 rounded-xl bg-white shadow-lg border border-[#E5E7EB] p-4 z-50 text-[#202435] animate-in fade-in zoom-in-95 duration-100">
              <div className="flex items-center justify-between pb-2.5 border-b border-[#EEF0F3]">
                <span className="text-xs font-bold text-[#202435]">Campus Circulars</span>
                {unreadNotifs > 0 ? (
                  <button
                    type="button"
                    onClick={() => setUnreadNotifs(0)}
                    className="text-[10px] text-[#861F41] hover:underline font-semibold"
                  >
                    Mark read ({unreadNotifs})
                  </button>
                ) : (
                  <span className="text-[10px] text-[#9299A8]">All read</span>
                )}
              </div>
              <div className="mt-2.5 space-y-2 text-xs">
                <div className="p-2.5 rounded-lg bg-[#F1F2F5] border border-[#EEF0F3]">
                  <p className="font-semibold text-[#202435]">Annual Academic Convocation</p>
                  <p className="text-[11px] text-[#697386] mt-0.5">
                    Registration opened for eligible graduating cohorts.
                  </p>
                  <span className="text-[9px] text-[#9299A8] mt-1 block font-mono">2 hours ago</span>
                </div>
                <div className="p-2.5 rounded-lg bg-[#F1F2F5] border border-[#EEF0F3]">
                  <p className="font-semibold text-[#202435]">End-Term Examination Schedule</p>
                  <p className="text-[11px] text-[#697386] mt-0.5">
                    Practical assessments commence Oct 18, 2026.
                  </p>
                  <span className="text-[9px] text-[#9299A8] mt-1 block font-mono">Yesterday</span>
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
            className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg bg-[#F1F2F5] hover:bg-[#F8F8FA] border border-[#E5E7EB] text-left transition"
          >
            <div className="w-6 h-6 rounded-md bg-[#861F41] text-white font-bold text-[11px] flex items-center justify-center shadow-2xs">
              {user.name.charAt(0)}
            </div>
            <div className="hidden xl:block text-left" title={user.name}>
              <p className="text-xs font-semibold text-[#202435] leading-tight truncate max-w-[150px]">
                {user.name.replace(/\s*\([^)]*\)$/, "").trim() || user.name}
              </p>
              <p className="text-[10px] text-[#9299A8] font-medium truncate max-w-[150px]">
                {user.role}
              </p>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-[#9299A8] hidden xl:block" />
          </button>

          {userMenuOpen && (
            <div className="absolute right-0 mt-2 w-64 rounded-xl bg-white shadow-lg border border-[#E5E7EB] py-1.5 z-50 text-[#202435] animate-in fade-in zoom-in-95 duration-100">
              <div className="px-3.5 py-2.5 border-b border-[#EEF0F3] bg-[#F1F2F5]">
                <p className="text-xs font-bold text-[#202435] leading-snug">{user.name}</p>
                <p className="text-[11px] text-[#9299A8] font-mono mt-0.5">{user.email}</p>
                <div className="mt-1.5">
                  <span className="inline-block px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#F9EEF2] text-[#861F41] border border-[#F4D3DE]">
                    {user.role} Portal
                  </span>
                </div>
              </div>

              <div className="p-1 text-xs">
                <div className="px-3 py-1.5 text-[#697386] flex justify-between">
                  <span>University:</span>
                  <span className="font-semibold text-[#202435]">JLU Bhopal</span>
                </div>
              </div>

              <div className="border-t border-[#EEF0F3] p-1">
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full text-left px-3 py-2 text-xs font-semibold text-[#C23B4A] hover:bg-[#FCEDEF] rounded-lg flex items-center gap-2 transition"
                >
                  <LogOut className="w-4 h-4 text-[#C23B4A]" />
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
