"use client";

import { useState } from "react";
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
  Sparkles,
} from "lucide-react";
import { SessionUser, Role } from "@/types";
import JLULogo from "@/components/ui/JLULogo";
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

const PORTAL_NAMES: Record<Role, string> = {
  ADMIN: "JLU Administration",
  TEACHER: "JLU Faculty Portal",
  STUDENT: "JLU Student Portal",
  HOD: "JLU HOD Portal",
  ACCOUNTS: "JLU Finance & Bursar",
  MANAGEMENT: "JLU Institutional Overview",
};

export default function Header({ user, onOpenSidebar, onOpenSearch }: HeaderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [switching, setSwitching] = useState(false);

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
      if (data.success) {
        setRoleMenuOpen(false);
        router.push(data.redirectUrl);
        router.refresh();
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
    <header className="sticky top-0 z-30 h-16 bg-white border-b border-slate-200 px-4 sm:px-6 flex items-center justify-between shadow-2xs">
      {/* Left: Mobile Toggle + University Logo / Portal Breadcrumb */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenSidebar}
          className="p-2 -ml-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 lg:hidden focus:outline-none"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Brand & Portal Indicator */}
        <div className="flex items-center gap-3">
          <div className="hidden lg:flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
              {PORTAL_NAMES[user.role] || "JLU Digital Campus"}
            </span>
            <span className="text-slate-300">/</span>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
            <span className="font-semibold text-slate-700">JLU</span>
            <span>/</span>
            {pathParts.map((part, index) => {
              const isLast = index === pathParts.length - 1;
              return (
                <span key={part} className="flex items-center gap-1.5">
                  <span
                    className={
                      isLast
                        ? "text-slate-900 font-bold capitalize"
                        : "text-slate-500 capitalize hover:text-slate-800"
                    }
                  >
                    {part.replace("-", " ")}
                  </span>
                  {!isLast && <span className="text-slate-300">/</span>}
                </span>
              );
            })}
          </div>
        </div>
      </div>

      {/* Right: Academic Year, Search, Role Switcher & Profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Academic Session Indicator */}
        <div className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200 text-slate-600 text-[11px] font-semibold">
          <Calendar className="w-3.5 h-3.5 text-slate-400" />
          <span>AY {JLU_PROFILE.currentAcademicYear}</span>
        </div>

        {/* Global Command / Search Trigger */}
        <button
          type="button"
          onClick={handleOpenSearch}
          className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200/80 text-slate-500 hover:text-slate-800 text-xs border border-slate-200 transition cursor-pointer"
          title="Global Search & Quick Actions (Cmd+K)"
        >
          <Search className="w-3.5 h-3.5 text-slate-400" />
          <span>Search JLU Campus...</span>
          <kbd className="ml-1.5 px-1.5 py-0.5 rounded bg-white text-[9px] font-mono border border-slate-200 text-slate-500 shadow-2xs">
            ⌘K
          </kbd>
        </button>

        <button
          type="button"
          onClick={handleOpenSearch}
          className="p-2 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 sm:hidden"
          title="Search"
        >
          <Search className="w-4 h-4" />
        </button>

        {/* Quick Role Switcher for seamless testing */}
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setRoleMenuOpen(!roleMenuOpen);
              setUserMenuOpen(false);
              setNotifOpen(false);
            }}
            disabled={switching}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition"
          >
            <span className="w-2 h-2 rounded-full bg-rose-600" />
            <span className="hidden md:inline text-slate-500 font-normal">Role:</span>
            <span>{user.role}</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
          </button>

          {roleMenuOpen && (
            <div className="absolute right-0 mt-2 w-60 rounded-xl bg-white shadow-xl border border-slate-200 py-1.5 z-50">
              <div className="px-3 py-1.5 border-b border-slate-100">
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Switch Active Portal
                </p>
                <p className="text-[10px] text-slate-500">Test JLU digital campus personas</p>
              </div>
              {ROLES_LIST.map((r) => {
                const Icon = r.icon;
                const isCurrent = r.role === user.role;
                return (
                  <button
                    key={r.role}
                    type="button"
                    onClick={() => handleSwitchRole(r.role)}
                    className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-50 transition ${
                      isCurrent ? "font-bold text-rose-600 bg-rose-50/50" : "text-slate-700"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Icon className={`w-3.5 h-3.5 ${isCurrent ? "text-rose-600" : "text-slate-400"}`} />
                      <span>{r.label}</span>
                    </div>
                    {isCurrent && <CheckCircle2 className="w-3.5 h-3.5 text-rose-600" />}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setNotifOpen(!notifOpen);
              setRoleMenuOpen(false);
              setUserMenuOpen(false);
            }}
            className="p-2 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 relative"
            title="University Alerts"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-600 ring-2 ring-white" />
          </button>

          {notifOpen && (
            <div className="absolute right-0 mt-2 w-80 rounded-xl bg-white shadow-xl border border-slate-200 p-3 z-50">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="text-xs font-bold text-slate-800">JLU Campus Broadcasts</span>
                <span className="text-[10px] bg-rose-50 text-rose-700 font-semibold px-2 py-0.5 rounded-full border border-rose-200">
                  Targeted
                </span>
              </div>
              <div className="mt-2 space-y-2 text-xs">
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                  <p className="font-semibold text-slate-900">Lakecity Conclave 2026</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Registration opened for the annual industry-academia summit.
                  </p>
                  <span className="text-[9px] text-slate-400 mt-1 block">2 hours ago</span>
                </div>
                <div className="p-2.5 rounded-lg bg-rose-50/50 border border-rose-100">
                  <p className="font-semibold text-rose-900">End-Term Examination Schedule</p>
                  <p className="text-[11px] text-rose-700 mt-0.5">
                    Practical exams commence Oct 18, 2026.
                  </p>
                  <span className="text-[9px] text-rose-500 mt-1 block">Yesterday</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User Profile Menu */}
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setUserMenuOpen(!userMenuOpen);
              setRoleMenuOpen(false);
              setNotifOpen(false);
            }}
            className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-slate-100 text-left transition"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-rose-700 to-rose-600 text-white font-black text-xs flex items-center justify-center shadow-xs">
              {user.name.charAt(0)}
            </div>
            <div className="hidden xl:block">
              <p className="text-xs font-semibold text-slate-800 leading-tight truncate max-w-[130px]">
                {user.name}
              </p>
              <p className="text-[10px] text-slate-500 font-mono truncate">{user.email}</p>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden xl:block" />
          </button>

          {userMenuOpen && (
            <div className="absolute right-0 mt-2 w-56 rounded-xl bg-white shadow-xl border border-slate-200 py-1.5 z-50">
              <div className="px-3 py-2 border-b border-slate-100">
                <p className="text-xs font-bold text-slate-800 truncate">{user.name}</p>
                <p className="text-[11px] text-slate-500 font-mono truncate">{user.email}</p>
                <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                  {user.role}
                </span>
              </div>
              <button
                type="button"
                onClick={handleLogout}
                className="w-full text-left px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50 flex items-center gap-2 transition"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out of JLU</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
