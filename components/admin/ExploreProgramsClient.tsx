"use client";

import React, { useState, useMemo } from "react";
import { Search, Filter, School, Building, Clock, Users, BookOpen, Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";
import EmptyState from "@/components/ui/EmptyState";
import { JLU_PROFILE } from "@/lib/jlu-constants";

interface ProgramItem {
  id: string;
  code: string;
  name: string;
  degreeType: string;
  durationYears: number;
  department: {
    id: string;
    code: string;
    name: string;
    building?: string | null;
  };
  semesters: { id: string; number: number }[];
  students: { id: string }[];
}

interface ExploreProgramsClientProps {
  initialPrograms: ProgramItem[];
  departments: { id: string; name: string; code: string }[];
}

export default function ExploreProgramsClient({
  initialPrograms,
  departments,
}: ExploreProgramsClientProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("ALL");
  const [selectedDept, setSelectedDept] = useState("ALL");

  const filteredPrograms = useMemo(() => {
    return initialPrograms.filter((prog) => {
      const matchesSearch =
        prog.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prog.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prog.department.name.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesLevel =
        selectedLevel === "ALL" ||
        (selectedLevel === "PHD" ? prog.name.includes("Ph.D.") || prog.code.includes("PHD") : prog.degreeType === selectedLevel);

      const matchesDept =
        selectedDept === "ALL" || prog.department.id === selectedDept;

      return matchesSearch && matchesLevel && matchesDept;
    });
  }, [initialPrograms, searchQuery, selectedLevel, selectedDept]);

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-rose-950 text-white p-6 sm:p-8 rounded-2xl shadow-md border border-slate-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-rose-500/20 text-rose-300 border border-rose-400/30 mb-2">
            Multidisciplinary Academic Curriculum • JLU Bhopal
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Explore Degree Programs & Faculties
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            Browse undergraduate, postgraduate, and doctoral pathways offered across Jagran Lakecity University
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/admin/programs"
            className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold shadow-xs transition"
          >
            Manage Master Programs
          </Link>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search degree programs or schools..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:ring-1 focus:ring-rose-500 focus:outline-none"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Degree Level Tabs */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs">
            {["ALL", "UNDERGRADUATE", "POSTGRADUATE", "PHD"].map((lvl) => (
              <button
                key={lvl}
                type="button"
                onClick={() => setSelectedLevel(lvl)}
                className={`px-3 py-1 rounded-lg font-semibold transition ${
                  selectedLevel === lvl
                    ? "bg-white text-slate-900 shadow-2xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {lvl === "ALL" ? "All Levels" : lvl === "PHD" ? "Ph.D." : lvl.charAt(0) + lvl.slice(1).toLowerCase()}
              </button>
            ))}
          </div>

          {/* School Selector */}
          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="p-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none"
          >
            <option value="ALL">All Schools / Faculties</option>
            {departments.map((dept) => (
              <option key={dept.id} value={dept.id}>
                {dept.name}
              </option>
            ))}
          </select>

          {(searchQuery || selectedLevel !== "ALL" || selectedDept !== "ALL") && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                setSelectedLevel("ALL");
                setSelectedDept("ALL");
              }}
              className="text-xs text-rose-600 font-semibold hover:underline ml-1"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Program Cards Grid */}
      {filteredPrograms.length === 0 ? (
        <EmptyState
          icon={School}
          title="No Degree Programs Found"
          description="No academic programs match your active filter criteria."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredPrograms.map((prog) => {
            const isPhd = prog.name.includes("Ph.D.") || prog.code.includes("PHD");
            return (
              <div
                key={prog.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4 hover:border-rose-300 hover:shadow-xs transition flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-slate-100 text-slate-700">
                      {prog.code}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        isPhd
                          ? "bg-purple-50 text-purple-700 border border-purple-200"
                          : prog.degreeType === "UNDERGRADUATE"
                          ? "bg-blue-50 text-blue-700 border border-blue-200"
                          : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                      }`}
                    >
                      {isPhd ? "Doctoral" : prog.degreeType}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 leading-snug">
                    {prog.name}
                  </h3>

                  <p className="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
                    <Building className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{prog.department.name}</span>
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 space-y-2 text-xs">
                  <div className="grid grid-cols-2 gap-2 text-slate-600">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{prog.durationYears} Years Duration</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-slate-400" />
                      <span>{prog.students.length} Enrolled</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[10px] text-slate-400">
                      {prog.semesters.length} Semesters Configured
                    </span>
                    <Link
                      href="/admin/subjects"
                      className="text-xs text-rose-600 font-semibold hover:underline flex items-center gap-1"
                    >
                      View Syllabus &rarr;
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
