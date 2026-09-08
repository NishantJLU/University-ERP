"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  GraduationCap,
  ShieldCheck,
  BookOpen,
  Calculator,
  Users,
  Building,
  ArrowRight,
  Loader2,
  Lock,
  Mail,
  Eye,
  EyeOff,
  AlertCircle,
  HelpCircle,
  Sparkles,
  X,
  CheckCircle2,
} from "lucide-react";
import JLULogo from "@/components/ui/JLULogo";
import { Role } from "@/types";

const DEMO_ACCOUNTS = [
  {
    role: "STUDENT" as Role,
    title: "Student Portal",
    email: "student@demo.edu",
    name: "Aarav Sharma",
    meta: "B.Tech CSE • Sem 3",
    icon: GraduationCap,
    desc: "Academics, timetable, attendance, LMS coursework, fees & receipts",
    color: "border-blue-200 bg-blue-50/70 hover:border-blue-400 text-blue-900",
  },
  {
    role: "TEACHER" as Role,
    title: "Faculty Portal",
    email: "teacher@demo.edu",
    name: "Dr. Vikram Rao",
    meta: "Assoc. Professor • Computing",
    icon: BookOpen,
    desc: "Attendance ledger, LMS course studio, grading queue & teaching schedule",
    color: "border-emerald-200 bg-emerald-50/70 hover:border-emerald-400 text-emerald-900",
  },
  {
    role: "HOD" as Role,
    title: "HOD Portal",
    email: "hod@demo.edu",
    name: "Dr. Rajesh Sharma",
    meta: "Head • School of Engineering",
    icon: Users,
    desc: "Department approvals, timetable conflicts, teaching workload & roster",
    color: "border-purple-200 bg-purple-50/70 hover:border-purple-400 text-purple-900",
  },
  {
    role: "ACCOUNTS" as Role,
    title: "Bursar & Accounts",
    email: "accounts@demo.edu",
    name: "Suresh Patel",
    meta: "Accounts Officer",
    icon: Calculator,
    desc: "Fee invoices, payment reconciliation, refunds & official receipts",
    color: "border-amber-200 bg-amber-50/70 hover:border-amber-400 text-amber-900",
  },
  {
    role: "ADMIN" as Role,
    title: "Administration",
    email: "admin@demo.edu",
    name: "Dr. Alistair Vance",
    meta: "Office of the Registrar",
    icon: ShieldCheck,
    desc: "University master data, faculties, schools, programs, timetable & audits",
    color: "border-rose-200 bg-rose-50/70 hover:border-rose-400 text-rose-900",
  },
  {
    role: "MANAGEMENT" as Role,
    title: "Executive Board",
    email: "management@demo.edu",
    name: "Dr. Arvind Mehta",
    meta: "University Leadership",
    icon: Building,
    desc: "Institutional macro KPIs, enrollment trends, faculty metrics & analytics",
    color: "border-slate-300 bg-slate-100 hover:border-slate-400 text-slate-900",
  },
];

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@demo.edu");
  const [password, setPassword] = useState("password123");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({});
  const [authTab, setAuthTab] = useState<"production" | "demo">("production");
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);

  const validateForm = () => {
    const errors: { email?: string; password?: string } = {};
    if (!email.trim()) {
      errors.email = "Enter your university email or registration ID.";
    }
    if (!password) {
      errors.password = "Enter your password.";
    }
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (loading) return;

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password }),
      });

      let data: any = null;
      try {
        data = await res.json();
      } catch {
        const text = await res.text().catch(() => "");
        throw new Error(text.slice(0, 100) || `Server responded with HTTP ${res.status}`);
      }

      if (res.ok && data?.success && data.redirectUrl) {
        window.location.href = data.redirectUrl;
      } else {
        setError(data?.message || "Invalid email/ID or password. Please check your credentials and try again.");
      }
    } catch (err: any) {
      setError(err?.message || "Unable to connect to the JLU authentication server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = async (accountEmail: string) => {
    if (loading) return;
    setEmail(accountEmail);
    setPassword("password123");
    setFieldErrors({});
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: accountEmail, password: "password123" }),
      });

      let data: any = null;
      try {
        data = await res.json();
      } catch {
        const text = await res.text().catch(() => "");
        throw new Error(text.slice(0, 100) || `Server responded with HTTP ${res.status}`);
      }

      if (res.ok && data?.success && data.redirectUrl) {
        window.location.href = data.redirectUrl;
      } else {
        setError(data?.message || "Failed to switch role.");
      }
    } catch (err: any) {
      setError(err?.message || "Network error connecting to university server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-between">
      {/* Accessible Skip Link */}
      <a
        href="#login-form"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 z-50 px-4 py-2 bg-rose-600 text-white font-bold rounded-lg shadow-lg text-xs"
      >
        Skip to login
      </a>

      {/* Main Grid: Context Panel on Desktop, Direct Login Focus on Mobile */}
      <div className="flex-1 flex flex-col lg:flex-row items-stretch">
        {/* Left Side: Clean JLU Institutional Branding & Platform Context */}
        <div className="hidden lg:flex lg:w-5/12 xl:w-1/2 relative bg-gradient-to-br from-slate-950 via-slate-900 to-rose-950 p-10 xl:p-14 flex-col justify-between border-r border-slate-800 text-white overflow-hidden">
          {/* Subtle background grid accent */}
          <div className="absolute inset-0 bg-[radial-gradient(#e11d48_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none" />
          <div className="absolute -top-32 -left-32 w-80 h-80 rounded-full bg-rose-600/15 blur-3xl pointer-events-none" />

          {/* Institutional Lockup */}
          <div className="relative z-10">
            <JLULogo variant="white" size="lg" />
          </div>

          {/* Clean Primary Identity & Context Statement */}
          <div className="relative z-10 my-auto py-8 space-y-5 max-w-lg">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-white/10 text-rose-300 border border-rose-500/20 backdrop-blur-xs">
              <Sparkles className="w-3.5 h-3.5 text-rose-400" />
              <span>Unified Academic Platform</span>
            </div>

            <h2 className="text-2xl xl:text-3xl font-extrabold tracking-tight text-white leading-tight">
              University ERP & Learning Management System
            </h2>

            <p className="text-slate-300 text-sm leading-relaxed">
              Manage academics, learning, attendance, dynamic timetables, and university services in one place.
            </p>

            {/* Secondary Institutional Context Pills (Clean, non-competing) */}
            <div className="pt-4 border-t border-slate-800/80">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-3">
                Institutional Context
              </span>
              <div className="grid grid-cols-3 gap-2.5 text-center text-xs">
                <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
                  <span className="font-extrabold text-white block text-sm">232-Acre</span>
                  <span className="text-[10px] text-slate-400">Campus</span>
                </div>
                <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
                  <span className="font-extrabold text-white block text-sm">50+</span>
                  <span className="text-[10px] text-slate-400">Programs</span>
                </div>
                <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
                  <span className="font-extrabold text-white block text-sm">45+</span>
                  <span className="text-[10px] text-slate-400">Global Ties</span>
                </div>
              </div>
            </div>
          </div>

          {/* Subtle Institutional Secondary Footer */}
          <div className="relative z-10 text-xs text-slate-400 pt-4 border-t border-slate-800 flex items-center justify-between">
            <span>Jagran Lakecity University</span>
            <span className="font-mono text-[11px]">Academic Year 2026–2027</span>
          </div>
        </div>

        {/* Right Side: Primary Login Portal */}
        <div className="w-full lg:w-7/12 xl:w-1/2 flex flex-col justify-center items-center p-6 sm:p-10 lg:p-12 bg-white overflow-y-auto min-h-screen lg:min-h-0">
          <div className="max-w-md w-full space-y-6">
            {/* Mobile Header Lockup */}
            <div className="lg:hidden flex flex-col items-center text-center space-y-2 pb-2">
              <JLULogo variant="full" size="md" />
            </div>

            {/* Login Heading */}
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-rose-600 uppercase tracking-wider">
                  JLU Digital Campus
                </span>
                <span className="text-[10px] font-mono text-slate-400">
                  SSL Encrypted
                </span>
              </div>
              <h1 className="text-2xl font-black text-slate-900 mt-1">
                Welcome Back
              </h1>
              <p className="text-xs text-slate-500 mt-1">
                Sign in with your official university credentials to continue to your dashboard.
              </p>
            </div>

            {/* Error Banner */}
            {error && (
              <div
                role="alert"
                className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-start gap-2.5 animate-in fade-in"
              >
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <div className="flex-1 font-medium">{error}</div>
                <button
                  type="button"
                  onClick={() => setError(null)}
                  className="text-rose-500 hover:text-rose-700 p-0.5"
                  aria-label="Dismiss error message"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Login Form (Visually Dominant) */}
            <form id="login-form" onSubmit={handleLogin} noValidate className="space-y-4 text-xs">
              {/* Field: University Email / Registration ID */}
              <div>
                <label htmlFor="user-identifier" className="block font-semibold text-slate-800 mb-1">
                  University Email / Registration ID <span className="text-rose-600">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    id="user-identifier"
                    name="identifier"
                    type="text"
                    required
                    autoComplete="username"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (fieldErrors.email) {
                        setFieldErrors((prev) => ({ ...prev, email: undefined }));
                      }
                    }}
                    placeholder="Enter your university ID or email"
                    aria-describedby="identifier-help"
                    className={`w-full pl-9 pr-3 py-2.5 bg-slate-50 border rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-rose-500 focus:border-rose-500 focus:outline-none transition ${
                      fieldErrors.email ? "border-rose-400 bg-rose-50/30" : "border-slate-200"
                    }`}
                  />
                </div>
                {fieldErrors.email ? (
                  <p className="text-[11px] text-rose-600 mt-1 font-medium">{fieldErrors.email}</p>
                ) : (
                  <p id="identifier-help" className="text-[11px] text-slate-500 mt-1">
                    Students may use their university registration ID. Faculty and staff may use their official university credentials.
                  </p>
                )}
              </div>

              {/* Field: Password */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label htmlFor="user-password" className="font-semibold text-slate-800">
                    Password <span className="text-rose-600">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setForgotPasswordOpen(true)}
                    className="text-rose-600 hover:text-rose-700 hover:underline text-[11px] font-semibold cursor-pointer"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    id="user-password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (fieldErrors.password) {
                        setFieldErrors((prev) => ({ ...prev, password: undefined }));
                      }
                    }}
                    placeholder="Enter your password"
                    className={`w-full pl-9 pr-10 py-2.5 bg-slate-50 border rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-rose-500 focus:border-rose-500 focus:outline-none transition ${
                      fieldErrors.password ? "border-rose-400 bg-rose-50/30" : "border-slate-200"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 rounded-md focus:outline-none"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {fieldErrors.password && (
                  <p className="text-[11px] text-rose-600 mt-1 font-medium">{fieldErrors.password}</p>
                )}
              </div>

              {/* Remember Device & Security Tag */}
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-slate-600 select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded border-slate-300 text-rose-600 focus:ring-rose-500 w-3.5 h-3.5"
                  />
                  <span className="text-xs">Remember this device</span>
                </label>
                <span className="text-[11px] text-slate-400">7-day active session</span>
              </div>

              {/* Primary Sign In Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 px-4 bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white font-bold rounded-xl shadow-md hover:shadow-lg transition flex items-center justify-center gap-2 disabled:opacity-50 text-xs cursor-pointer focus:ring-2 focus:ring-rose-500 focus:ring-offset-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Mode Switcher: Production vs Demo Evaluation Mode */}
            <div className="pt-4 border-t border-slate-200">
              <div className="bg-slate-100 p-1 rounded-xl flex gap-1 mb-3">
                <button
                  type="button"
                  onClick={() => setAuthTab("production")}
                  className={`flex-1 py-1.5 text-center text-xs font-bold rounded-lg transition cursor-pointer ${
                    authTab === "production"
                      ? "bg-white text-slate-900 shadow-xs"
                      : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  Official Sign-In
                </button>
                <button
                  type="button"
                  onClick={() => setAuthTab("demo")}
                  className={`flex-1 py-1.5 text-center text-xs font-bold rounded-lg transition flex items-center justify-center gap-1.5 cursor-pointer ${
                    authTab === "demo"
                      ? "bg-rose-600 text-white shadow-xs"
                      : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Demo Evaluation Mode</span>
                </button>
              </div>

              {authTab === "demo" && (
                <div className="space-y-3 bg-slate-50 border border-slate-200 p-3.5 rounded-2xl animate-in fade-in duration-200">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-800 uppercase tracking-wider">
                      Demo Evaluation Personas
                    </span>
                    <span className="text-[10px] bg-slate-200 text-slate-700 font-bold px-2 py-0.5 rounded-full">
                      Testing Environment
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Select a pre-seeded institutional persona below to preview role-specific operational dashboards:
                  </p>

                  <div className="grid grid-cols-2 gap-2">
                    {DEMO_ACCOUNTS.map((acc) => {
                      const Icon = acc.icon;
                      return (
                        <button
                          key={acc.role}
                          type="button"
                          onClick={() => handleQuickLogin(acc.email)}
                          disabled={loading}
                          className={`text-left p-2.5 rounded-xl border transition flex flex-col justify-between group hover:shadow-xs cursor-pointer ${acc.color}`}
                        >
                          <div className="flex items-center gap-2">
                            <div className="p-1.5 rounded-lg bg-white shadow-2xs shrink-0 group-hover:scale-105 transition-transform">
                              <Icon className="w-3.5 h-3.5" />
                            </div>
                            <div className="min-w-0">
                              <span className="text-[11px] font-bold text-slate-900 block truncate">
                                {acc.title}
                              </span>
                              <span className="text-[10px] text-slate-600 block truncate font-medium">
                                {acc.name}
                              </span>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Minimal Help & Support Section */}
            <div className="pt-2 text-center">
              <button
                type="button"
                onClick={() => setForgotPasswordOpen(true)}
                className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 transition cursor-pointer"
              >
                <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
                <span>Need help? Contact ERP Support</span>
              </button>
            </div>
          </div>

          {/* Minimal Clean Footer */}
          <footer className="pt-8 text-center text-[11px] text-slate-400 space-x-2">
            <span>JLU Digital Campus</span>
            <span>•</span>
            <span>&copy; Jagran Lakecity University</span>
            <span>•</span>
            <button
              type="button"
              onClick={() => setForgotPasswordOpen(true)}
              className="text-slate-500 hover:underline cursor-pointer"
            >
              ERP Support
            </button>
          </footer>
        </div>
      </div>

      {/* ERP Support / Credential Recovery Modal */}
      {forgotPasswordOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="recovery-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in"
        >
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 space-y-4 border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-rose-50 text-rose-600">
                  <Lock className="w-5 h-5" />
                </div>
                <div>
                  <h3 id="recovery-title" className="text-sm font-bold text-slate-900">
                    Central ERP Support & Identity Desk
                  </h3>
                  <p className="text-[11px] text-slate-500">Jagran Lakecity University IT Services</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setForgotPasswordOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                aria-label="Close recovery modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="text-xs text-slate-600 space-y-3">
              <p>
                Self-service password recovery is managed through the central IT service desk. To reset your official university credentials or unlock your account, please reach out to:
              </p>
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-1.5 text-[11px]">
                <p>
                  <strong className="text-slate-900">Email:</strong>{" "}
                  <a href="mailto:support@jlu.edu.in" className="text-rose-600 hover:underline">
                    support@jlu.edu.in
                  </a>
                </p>
                <p>
                  <strong className="text-slate-900">Internal Helpline:</strong> +91 755 6611111 (Ext. 402)
                </p>
                <p>
                  <strong className="text-slate-900">Campus Desk:</strong> Central Computing Center, Block B, Room B-102
                </p>
              </div>
              <p className="text-[11px] text-slate-500 italic">
                Note: In compliance with university information security policies, official JLU Registration ID or Faculty ID verification is required for password resets.
              </p>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setForgotPasswordOpen(false)}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

