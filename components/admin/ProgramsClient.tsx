"use client";

import React, { useState, useMemo } from "react";
import { Plus, Search, GraduationCap } from "lucide-react";
import CreateProgramDrawer from "@/components/admin/drawers/CreateProgramDrawer";
import EmptyState from "@/components/ui/EmptyState";

interface ProgramItem {
  id: string;
  code: string;
  name: string;
  degreeType: string;
  durationYears: number;
  departmentName: string;
  semestersCount: number;
  studentsCount: number;
}

interface ProgramsClientProps {
  initialPrograms: ProgramItem[];
  departments: { id: string; name: string; code: string }[];
}

export default function ProgramsClient({
  initialPrograms,
  departments,
}: ProgramsClientProps) {
  const [programs] = useState<ProgramItem[]>(initialPrograms);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return programs;
    return programs.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.code.toLowerCase().includes(q) ||
        p.departmentName.toLowerCase().includes(q)
    );
  }, [programs, search]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-rose-600 uppercase tracking-wider">
            Degrees & Curriculum
          </span>
          <h1 className="text-2xl font-extrabold text-slate-900 mt-1">
            Academic Programs & Degrees
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Degree programs, duration, awarding departments, and student enrollments
          </p>
        </div>

        <button
          type="button"
          onClick={() => setDrawerOpen(true)}
          className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold shadow-sm transition flex items-center gap-1.5 shrink-0"
        >
          <Plus className="w-4 h-4" />
          Add Program
        </button>
      </div>

      {/* Search Bar */}
      <div className="flex items-center justify-between gap-4 bg-white p-3 rounded-xl border border-slate-200">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search programs by name, code or department..."
            className="w-full pl-9 pr-4 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-rose-500 focus:bg-white"
          />
        </div>
        <span className="text-xs text-slate-500 font-medium">
          Showing <span className="font-bold text-slate-800">{filtered.length}</span> of {programs.length}
        </span>
      </div>

      {/* Programs Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.map((prog) => (
            <div
              key={prog.id}
              className="bg-white rounded-2xl shadow-xs border border-slate-200 p-6 space-y-3 hover:shadow-md transition"
            >
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded font-mono font-bold text-[10px] bg-purple-50 text-purple-700 border border-purple-200">
                  {prog.code}
                </span>
                <span className="text-[10px] uppercase font-bold text-slate-500">{prog.degreeType}</span>
              </div>

              <h3 className="text-base font-bold text-slate-900">{prog.name}</h3>
              <p className="text-xs text-slate-500">Department: {prog.departmentName}</p>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
                <span>{prog.durationYears} Years ({prog.semestersCount} Semesters)</span>
                <span className="font-semibold text-blue-700">{prog.studentsCount} Students Enrolled</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={<GraduationCap className="w-6 h-6" />}
          title="No degree programs found"
          description={search ? `No programs match "${search}".` : "No degree programs have been registered."}
          action={
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setDrawerOpen(true);
              }}
              className="px-3.5 py-1.5 bg-rose-600 text-white rounded-lg text-xs font-semibold"
            >
              Add Degree Program
            </button>
          }
        />
      )}

      {/* Creation Drawer */}
      <CreateProgramDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        departments={departments}
      />
    </div>
  );
}
