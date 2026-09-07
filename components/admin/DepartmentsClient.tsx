"use client";

import React, { useState, useMemo } from "react";
import { Plus, Search, Building } from "lucide-react";
import CreateDepartmentDrawer from "@/components/admin/drawers/CreateDepartmentDrawer";
import EmptyState from "@/components/ui/EmptyState";

interface DepartmentItem {
  id: string;
  code: string;
  name: string;
  description: string | null;
  building: string | null;
  programsCount: number;
  facultyCount: number;
}

export default function DepartmentsClient({
  initialDepartments,
}: {
  initialDepartments: DepartmentItem[];
}) {
  const [departments] = useState<DepartmentItem[]>(initialDepartments);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return departments;
    return departments.filter(
      (d) =>
        d.name.toLowerCase().includes(q) ||
        d.code.toLowerCase().includes(q) ||
        (d.building && d.building.toLowerCase().includes(q))
    );
  }, [departments, search]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-rose-600 uppercase tracking-wider">
            Academic Infrastructure
          </span>
          <h1 className="text-2xl font-extrabold text-slate-900 mt-1">
            University Academic Departments
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Centralized department hierarchy, physical campus buildings, and appointed leadership
          </p>
        </div>

        <button
          type="button"
          onClick={() => setDrawerOpen(true)}
          className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold shadow-sm transition flex items-center gap-1.5 shrink-0"
        >
          <Plus className="w-4 h-4" />
          Add Department
        </button>
      </div>

      {/* Filter / Search Bar */}
      <div className="flex items-center justify-between gap-4 bg-white p-3 rounded-xl border border-slate-200">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search departments by name, code, or building..."
            className="w-full pl-9 pr-4 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-rose-500 focus:bg-white"
          />
        </div>
        <span className="text-xs text-slate-500 font-medium">
          Showing <span className="font-bold text-slate-800">{filtered.length}</span> of {departments.length}
        </span>
      </div>

      {/* Departments Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((dept) => (
            <div
              key={dept.id}
              className="bg-white rounded-2xl shadow-xs border border-slate-200 p-6 space-y-3 flex flex-col justify-between hover:shadow-md transition"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="px-2 py-0.5 rounded font-mono font-bold text-[10px] bg-blue-50 text-blue-700 border border-blue-200">
                    {dept.code}
                  </span>
                  <span className="text-[10px] font-medium text-slate-500">{dept.building || "Campus Main"}</span>
                </div>
                <h3 className="text-base font-bold text-slate-900">{dept.name}</h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">{dept.description || "No description provided."}</p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
                <span>{dept.programsCount} Degree Programs</span>
                <span>{dept.facultyCount} Faculty</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={<Building className="w-6 h-6" />}
          title="No departments found"
          description={search ? `No departments matched "${search}". Try clearing the search.` : "No academic departments have been created yet."}
          action={
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setDrawerOpen(true);
              }}
              className="px-3.5 py-1.5 bg-rose-600 text-white rounded-lg text-xs font-semibold"
            >
              Add New Department
            </button>
          }
        />
      )}

      {/* Interactive Creation Drawer */}
      <CreateDepartmentDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      />
    </div>
  );
}
