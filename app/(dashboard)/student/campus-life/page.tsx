import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import {
  Flame,
  Calendar,
  Users,
  Award,
  Sparkles,
  MapPin,
  ExternalLink,
  Shield,
  HeartHandshake,
  CheckCircle2,
  Trophy,
} from "lucide-react";
import { JLU_PROFILE, JLU_CAMPUS_LIFE } from "@/lib/jlu-constants";
import Link from "next/link";

export default async function StudentCampusLifePage() {
  const user = await getCurrentUser();
  if (!user || user.role !== "STUDENT") {
    redirect("/login");
  }

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-rose-950 via-slate-900 to-indigo-950 text-white p-6 sm:p-8 rounded-2xl shadow-md flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-rose-500/20 text-rose-300 border border-rose-400/30 mb-2">
            Campus Life & Student Welfare • JLU Bhopal
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Life at Jagran Lakecity University
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            232-Acre Vibrant Green Campus • Student Governance, Cultural Societies, Sports Forum & Leadership
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/student/dashboard"
            className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-semibold backdrop-blur-xs border border-white/20 transition"
          >
            &larr; Back to Dashboard
          </Link>
        </div>
      </div>

      {/* Grid: Events & Student Council */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Upcoming Events Calendar */}
        <div className="lg:col-span-7 bg-white rounded-2xl shadow-xs border border-slate-200 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-rose-600" />
              Upcoming Flagship University Events
            </h2>
            <span className="text-[11px] text-slate-400">AY {JLU_PROFILE.currentAcademicYear}</span>
          </div>

          <div className="space-y-3">
            {JLU_CAMPUS_LIFE.events.map((event, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl border border-slate-200/80 hover:border-rose-300 transition bg-slate-50/50 flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 flex flex-col items-center justify-center shrink-0">
                    <Flame className="w-5 h-5 text-rose-600" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-900">{event.title}</h3>
                    <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                      <span>{event.date}</span>
                      <span>•</span>
                      <span className="px-2 py-0.2 rounded bg-slate-100 text-slate-700 font-medium">
                        {event.category}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  className="px-3 py-1.5 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 shadow-2xs transition"
                >
                  View Details
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Student Council Governance */}
        <div className="lg:col-span-5 bg-white rounded-2xl shadow-xs border border-slate-200 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Shield className="w-4 h-4 text-indigo-600" />
              JLU Student Council
            </h2>
            <span className="text-[11px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              Active Body
            </span>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">
            The Student Council acts as the official bridge between students and university leadership, advocating for student welfare, campus enrichment, and academic innovation.
          </p>

          <div className="space-y-2 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">President</span>
                <span className="font-bold text-slate-900">President, Student Council</span>
              </div>
              <span className="text-[11px] text-slate-500 font-medium">School of Law</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">General Secretary</span>
                <span className="font-bold text-slate-900">General Secretary</span>
              </div>
              <span className="text-[11px] text-slate-500 font-medium">Jagran School of Engineering</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Cultural Secretary</span>
                <span className="font-bold text-slate-900">Secretary of Culture & Arts</span>
              </div>
              <span className="text-[11px] text-slate-500 font-medium">School of Design</span>
            </div>
          </div>
        </div>
      </div>

      {/* Student Clubs Section */}
      <div className="bg-white rounded-2xl shadow-xs border border-slate-200 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Users className="w-4 h-4 text-emerald-600" />
              Recognized Student Societies & Forums
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Pursue your passions across technical, cultural, debating, sports, and community outreach clubs
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
          {JLU_CAMPUS_LIFE.clubs.map((club, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl border border-slate-200 hover:border-slate-300 hover:shadow-2xs transition bg-slate-50/40 space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold text-rose-600">{club.category}</span>
                <span className="text-[10px] font-mono text-slate-400">{club.members}</span>
              </div>
              <h3 className="font-bold text-slate-900 text-sm">{club.name}</h3>
              <p className="text-[11px] text-slate-500">
                Official JLU extracurricular chapter operating across the 232-acre campus.
              </p>
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Registered
                </span>
                <button
                  type="button"
                  className="text-xs text-rose-600 hover:underline font-semibold"
                >
                  Join Club &rarr;
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
