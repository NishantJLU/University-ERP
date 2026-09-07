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
  MapPin,
  Sparkles,
  Globe2,
  CheckCircle2,
  Award,
  X,
} from "lucide-react";
import JLULogo from "@/components/ui/JLULogo";
import { JLU_PROFILE } from "@/lib/jlu-constants";

const DEMO_ACCOUNTS = [
  {
    role: "STUDENT",
    title: "Student Portal",
    email: "student@demo.edu",
    name: "Aarav Sharma",
    meta: "B.Tech CSE • Sem 3",
    icon: GraduationCap,
    desc: "Academics, timetable, attendance, LMS coursework, fees & receipts",
    color: "border-blue-200 bg-blue-50/70 hover:border-blue-400 text-blue-900",
  },
  {
    role: "TEACHER",
    title: "Faculty Portal",
    email: "teacher@demo.edu",
    name: "Dr. Vikram Rao",
    meta: "Assoc. Professor • Engg",
    icon: BookOpen,
    desc: "Attendance ledger, LMS course content, grading queue & teaching schedule",
    color: "border-emerald-200 bg-emerald-50/70 hover:border-emerald-400 text-emerald-900",
  },
  {
    role: "HOD",
    title: "HOD Portal",
    email: "hod@demo.edu",
    name: "Dr. Rajesh Sharma",
    meta: "Head • School of Engg",
    icon: Users,
    desc: "Department approvals, timetable conflicts, teaching workload & roster",
    color: "border-purple-200 bg-purple-50/70 hover:border-purple-400 text-purple-900",
  },
  {
    role: "ACCOUNTS",
    title: "Bursar & Treasury",
    email: "accounts@demo.edu",
    name: "Suresh Patel",
    meta: "Accounts Officer",
    icon: Calculator,
    desc: "Fee invoices, payment gateway reconciliation, refunds & official receipts",
    color: "border-amber-200 bg-amber-50/70 hover:border-amber-400 text-amber-900",
  },
  {
    role: "ADMIN",
    title: "Administration",
    email: "admin@demo.edu",
    name: "Dr. Alistair Vance",
    meta: "Office of the Registrar",
    icon: ShieldCheck,
    desc: "University master data, faculties, schools, programs, timetable & audits",
    color: "border-rose-200 bg-rose-50/70 hover:border-rose-400 text-rose-900",
  },
  {
    role: "MANAGEMENT",
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
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [authTab, setAuthTab] = useState<"production" | "demo">("production");
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);

  const handleLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
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
        setError(data?.message || "Invalid credentials. Please verify email and password.");
      }
    } catch (err: any) {
      setError(err?.message || "Unable to connect to the JLU authentication server.");
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = async (accountEmail: string) => {
    setEmail(accountEmail);
    setPassword("password123");
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
    <div className="min-h-screen bg-slate-950 flex items-stretch">
      {/* LEFT SIDE: Editorial JLU Campus & Institutional Identity */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-slate-950 via-slate-900 to-rose-950 flex-col justify-between p-12 overflow-hidden text-white border-r border-slate-800">
        {/* Background Architectural Canvas Pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(#e11d48_1px,transparent_1px)] [background-size:24px_24px] opacity-15 pointer-events-none" />
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-rose-600/20 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-indigo-600/20 blur-3xl pointer-events-none" />

        {/* Top Header */}
        <div className="relative z-10">
          <JLULogo variant="white" size="lg" />
          <div className="mt-4 flex items-center gap-2 text-xs font-semibold tracking-wider text-rose-300 uppercase">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
            <span>Official University Operating System</span>
          </div>
        </div>

        {/* Center: Editorial Hero Text */}
        <div className="relative z-10 my-auto py-8 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-white/10 text-amber-300 border border-amber-400/30 backdrop-blur-xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Central India&apos;s Diamond University</span>
          </div>

          <h2 className="text-3xl xl:text-4xl font-black tracking-tight leading-tight text-white">
            One Connected Digital Campus for Multidisciplinary Excellence
          </h2>

          <p className="text-slate-300 text-sm leading-relaxed max-w-lg">
            A unified institution-wide platform orchestrating academic administration, experiential learning, timetable scheduling, dynamic attendance, student finance, and executive governance.
          </p>

          {/* Official JLU Institutional Figures */}
          <div className="pt-4 border-t border-slate-800/80">
            <span className="text-[11px] uppercase font-bold tracking-wider text-slate-400 block mb-3">
              Institutional Profile
            </span>
            <div className="grid grid-cols-3 gap-3 text-left">
              <div className="p-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur-xs">
                <span className="text-xl font-extrabold text-white block">232-Acre</span>
                <span className="text-[11px] text-slate-400">Green Campus</span>
              </div>
              <div className="p-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur-xs">
                <span className="text-xl font-extrabold text-white block">50+</span>
                <span className="text-[11px] text-slate-400">Degree Programs</span>
              </div>
              <div className="p-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur-xs">
                <span className="text-xl font-extrabold text-white block">45+</span>
                <span className="text-[11px] text-slate-400">Global Ties</span>
              </div>
              <div className="p-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur-xs">
                <span className="text-xl font-extrabold text-white block">45+</span>
                <span className="text-[11px] text-slate-400">Advanced Labs</span>
              </div>
              <div className="p-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur-xs">
                <span className="text-xl font-extrabold text-white block">42+</span>
                <span className="text-[11px] text-slate-400">Industry Tie-ups</span>
              </div>
              <div className="p-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur-xs">
                <span className="text-xl font-extrabold text-white block">1-on-1</span>
                <span className="text-[11px] text-slate-400">Faculty Mentoring</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Meta */}
        <div className="relative z-10 flex items-center justify-between text-xs text-slate-400 pt-4 border-t border-slate-800">
          <span className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-rose-400" />
            Bhopal, Madhya Pradesh, India
          </span>
          <span className="font-mono text-[11px]">Academic Year 2026–2027</span>
        </div>
      </div>

      {/* RIGHT SIDE: Authentication & Demo Role Launcher */}
      <div className="w-full lg:w-1/2 flex flex-col justify-between p-6 sm:p-10 lg:p-12 bg-white overflow-y-auto">
        <div className="max-w-md w-full mx-auto space-y-6 my-auto">
          {/* Mobile University Emblem */}
          <div className="lg:hidden text-center space-y-2 pb-4 border-b border-slate-100">
            <JLULogo variant="compact" size="lg" className="justify-center" />
            <p className="text-xs text-slate-500 font-medium">
              &ldquo;Central India&apos;s Diamond University&rdquo; • Bhopal, MP
            </p>
          </div>

          <div>
            <span className="text-xs font-bold text-rose-600 uppercase tracking-wider">
              Unified Portal Authentication
            </span>
            <h1 className="text-2xl font-black text-slate-900 mt-1">
              JLU Digital Campus
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Sign in with your official university credentials to access your personalized role dashboard.
            </p>
          </div>

          {error && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 font-medium">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Official Email / University Registration ID
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. admin@demo.edu or student@demo.edu"
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-rose-500 focus:border-rose-500 focus:outline-none transition"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="font-semibold text-slate-700">Password</label>
                <button
                  type="button"
                  onClick={() => setForgotPasswordOpen(true)}
                  className="text-rose-600 hover:underline text-[11px] font-semibold focus:outline-hidden"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-rose-500 focus:border-rose-500 focus:outline-hidden transition"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-slate-600">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-slate-300 text-rose-600 focus:ring-rose-500"
                />
                <span>Remember this workstation</span>
              </label>
              <span className="text-[11px] font-mono text-slate-400">TLS 1.3 Secure</span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl shadow-md transition flex items-center justify-center gap-2 disabled:opacity-50 text-xs cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <span>Sign In to JLU Digital Campus</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Separation: Production vs Evaluation Persona Mode */}
          <div className="pt-4 border-t border-slate-200">
            <div className="bg-slate-100/80 p-1 rounded-xl flex gap-1 mb-3">
              <button
                type="button"
                onClick={() => setAuthTab("production")}
                className={`flex-1 py-1.5 text-center text-xs font-bold rounded-lg transition ${
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
                className={`flex-1 py-1.5 text-center text-xs font-bold rounded-lg transition flex items-center justify-center gap-1.5 ${
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
              <div className="space-y-3 bg-rose-50/50 border border-rose-100 p-3.5 rounded-2xl animate-in fade-in duration-200">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-rose-900 uppercase tracking-wider">
                    Sandbox Evaluation Personas
                  </span>
                  <span className="text-[10px] bg-rose-100 text-rose-700 font-bold px-2 py-0.5 rounded-full">
                    Isolated Roles
                  </span>
                </div>
                <p className="text-[11px] text-slate-600">
                  Select a pre-seeded institutional role below to evaluate role-specific operational dashboards:
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
        </div>

        {/* Forgot Password Modal */}
        {forgotPasswordOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in">
            <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 space-y-4 border border-slate-200">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-rose-50 text-rose-600">
                    <Lock className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Credential Recovery</h3>
                    <p className="text-[11px] text-slate-500">JLU Central IT Security & Identity Desk</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setForgotPasswordOpen(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="text-xs text-slate-600 space-y-3">
                <p>
                  To reset your official Jagran Lakecity University credentials, please contact the central campus IT service desk:
                </p>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1.5 text-[11px]">
                  <p><strong className="text-slate-900">Email:</strong> support@jlu.edu.in</p>
                  <p><strong className="text-slate-900">Internal Helpline:</strong> +91 755 6611111 (Ext. 402)</p>
                  <p><strong className="text-slate-900">Campus Location:</strong> Central Computing Center, Block B, Room B-102</p>
                </div>
                <p className="text-[11px] text-slate-500 italic">
                  Note: For security audit compliance, identity verification with your official JLU Registration Card is required for password resets.
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

        <div className="text-center pt-6 text-[11px] text-slate-400">
          Jagran Lakecity University • Central India&apos;s Diamond University • All Rights Reserved
        </div>
      </div>
    </div>
  );
}
