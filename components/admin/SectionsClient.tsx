"use client";

import React, { useState, useMemo } from "react";
import { Plus, Search, Layers } from "lucide-react";
import CreateSectionDrawer from "@/components/admin/drawers/CreateSectionDrawer";
import EmptyState from "@/components/ui/EmptyState";

interface SectionItem {
  id: string;
  name: string;
  capacity: number;
  programName: string;
  semesterNumber: number;
  studentsCount: number;
  facultyCount: number;
}

interface SectionsClientProps {
  initialSections: SectionItem[];
  semesters: { id: string; number: number; programName: string }[];
}

export default function SectionsClient({
  initialSections,
  semesters,
}: SectionsClientProps) {
  const [sections] = useState<SectionItem[]>(initialSections);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return sections;
    return sections.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.programName.toLowerCase().includes(q)
    );
  }, [sections, search]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-rose-600 uppercase tracking-wider">
            Student Cohort Management
          </span>
          <h1 className="text-2xl font-extrabold text-slate-900 mt-1">
            Academic Sections & Batches
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Class batches, student capacity limits, and section timetable links
          </p>
        </div>

        <button
          type="button"
          onClick={() => setDrawerOpen(true)}
          className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold shadow-sm transition flex items-center gap-1.5 shrink-0"
        >
          <Plus className="w-4 h-4" />
          Create Section
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
            placeholder="Search sections by name or program..."
            className="w-full pl-9 pr-4 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-rose-500 focus:bg-white"
          />
        </div>
        <span className="text-xs text-slate-500 font-medium">
          Showing <span className="font-bold text-slate-800">{filtered.length}</span> of {sections.length}
        </span>
      </div>

      {/* Sections Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filtered.map((sec) => (
            <div
              key={sec.id}
              className="bg-white rounded-2xl shadow-xs border border-slate-200 p-6 space-y-3 hover:shadow-md transition"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-slate-900">{sec.name}</h3>
                <span className="px-2 py-0.5 rounded font-mono text-[10px] bg-slate-100 border border-slate-200 text-slate-600">
                  Cap: {sec.capacity}
                </span>
              </div>
              <p className="text-xs text-slate-500">
                {sec.programName} (Sem {sec.semesterNumber})
              </p>
              <div className="pt-3 border-t border-slate-100 flex justify-between text-xs text-slate-600">
                <span className="font-semibold text-blue-700">{sec.studentsCount} Students Enrolled</span>
                <span>{sec.facultyCount} Tutors</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={<Layers className="w-6 h-6" />}
          title="No sections found"
          description={search ? `No sections match "${search}".` : "No class sections registered."}
          action={
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setDrawerOpen(true);
              }}
              className="px-3.5 py-1.5 bg-rose-600 text-white rounded-lg text-xs font-semibold"
            >
              Create Class Section
            </button>
          }
        />
      )}

      {/* Creation Drawer */}
      <CreateSectionDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        semesters={semesters}
      />
    </div>
  );
}
