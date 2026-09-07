"use client";

import React, { useState, useMemo } from "react";
import { Plus, Search, BookOpen, Layers } from "lucide-react";
import CreateSubjectDrawer from "@/components/admin/drawers/CreateSubjectDrawer";
import EmptyState from "@/components/ui/EmptyState";

interface SubjectItem {
  id: string;
  code: string;
  name: string;
  credits: number;
  type: string;
  programName: string;
  semesterNumber: number;
  departmentName: string;
}

interface SubjectsClientProps {
  initialSubjects: SubjectItem[];
  departments: { id: string; name: string; code: string }[];
  semesters: { id: string; number: number; programName: string }[];
}

export default function SubjectsClient({
  initialSubjects,
  departments,
  semesters,
}: SubjectsClientProps) {
  const [subjects] = useState<SubjectItem[]>(initialSubjects);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("ALL");

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return subjects.filter((s) => {
      const matchSearch =
        !q ||
        s.name.toLowerCase().includes(q) ||
        s.code.toLowerCase().includes(q) ||
        s.programName.toLowerCase().includes(q) ||
        s.departmentName.toLowerCase().includes(q);
      const matchType = typeFilter === "ALL" || s.type === typeFilter;
      return matchSearch && matchType;
    });
  }, [subjects, search, typeFilter]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-rose-600 uppercase tracking-wider">
            Syllabus & Courses
          </span>
          <h1 className="text-2xl font-extrabold text-slate-900 mt-1">
            Curriculum Subjects & Modules
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Theory and practical laboratory courses with assigned academic credit weights
          </p>
        </div>

        <button
          type="button"
          onClick={() => setDrawerOpen(true)}
          className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold shadow-sm transition flex items-center gap-1.5 shrink-0"
        >
          <Plus className="w-4 h-4" />
          Add Subject
        </button>
      </div>

      {/* Filter / Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3 rounded-xl border border-slate-200">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by subject code, course title, or program..."
            className="w-full pl-9 pr-4 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-rose-500 focus:bg-white"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="p-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none"
          >
            <option value="ALL">All Types</option>
            <option value="THEORY">Theory Only</option>
            <option value="LAB">Lab Only</option>
            <option value="HYBRID">Hybrid</option>
          </select>
          <span className="text-xs text-slate-500 font-medium">
            Showing <span className="font-bold text-slate-800">{filtered.length}</span> of {subjects.length}
          </span>
        </div>
      </div>

      {/* Subjects Table */}
      {filtered.length > 0 ? (
        <div className="bg-white rounded-2xl shadow-xs border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-[10px] font-bold uppercase text-slate-500">
                  <th className="p-3">Subject Code</th>
                  <th className="p-3">Course Title</th>
                  <th className="p-3">Program</th>
                  <th className="p-3">Semester</th>
                  <th className="p-3">Type</th>
                  <th className="p-3">Credits</th>
                  <th className="p-3">Department</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50/50 transition">
                    <td className="p-3 font-mono font-bold text-blue-700">{s.code}</td>
                    <td className="p-3 font-semibold text-slate-900">{s.name}</td>
                    <td className="p-3 text-slate-600">{s.programName}</td>
                    <td className="p-3 text-slate-600">Semester {s.semesterNumber}</td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          s.type === "LAB"
                            ? "bg-amber-50 text-amber-700 border border-amber-200"
                            : s.type === "HYBRID"
                            ? "bg-purple-50 text-purple-700 border border-purple-200"
                            : "bg-blue-50 text-blue-700 border border-blue-200"
                        }`}
                      >
                        {s.type}
                      </span>
                    </td>
                    <td className="p-3 font-semibold text-slate-800">{s.credits} Credits</td>
                    <td className="p-3 text-slate-500">{s.departmentName}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <EmptyState
          icon={<BookOpen className="w-6 h-6" />}
          title="No subjects found"
          description={search || typeFilter !== "ALL" ? "No subjects matched your filter criteria." : "No curriculum subjects registered yet."}
          action={
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setTypeFilter("ALL");
                setDrawerOpen(true);
              }}
              className="px-3.5 py-1.5 bg-rose-600 text-white rounded-lg text-xs font-semibold"
            >
              Add Curriculum Subject
            </button>
          }
        />
      )}

      {/* Creation Drawer */}
      <CreateSubjectDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        departments={departments}
        semesters={semesters}
      />
    </div>
  );
}
