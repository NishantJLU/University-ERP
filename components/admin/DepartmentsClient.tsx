"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Plus,
  Search,
  Building,
  Filter,
  X,
  School,
  Users,
  Layers,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";
import CreateDepartmentDrawer from "@/components/admin/drawers/CreateDepartmentDrawer";
import EmptyState from "@/components/ui/EmptyState";
import {
  DepartmentHealthBadge,
  getDepartmentHealthStatus,
} from "@/components/admin/DepartmentHealthBadge";

export interface DepartmentItem {
  id: string;
  code: string;
  name: string;
  description: string | null;
  building: string | null;
  programsCount: number;
  facultyCount: number;
}

function extractFacultyGroup(description: string | null): string {
  if (!description) return "General Academic";
  if (description.includes("•")) {
    return description.split("•")[0].trim();
  }
  return description.split(",")[0].trim();
}

export default function DepartmentsClient({
  initialDepartments,
  initialStatus,
}: {
  initialDepartments: DepartmentItem[];
  initialStatus?: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryStatus = searchParams?.get("status") || initialStatus || "ALL";

  const [departments] = useState<DepartmentItem[]>(initialDepartments);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Filters state
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>(
    queryStatus.toLowerCase() === "needs-setup" ? "NEEDS_SETUP" : "ALL"
  );
  const [facultyGroupFilter, setFacultyGroupFilter] = useState<string>("ALL");
  const [programsFilter, setProgramsFilter] = useState<string>("ALL");

  // Keep filter in sync if URL query parameter changes
  useEffect(() => {
    const s = searchParams?.get("status");
    if (s && s.toLowerCase() === "needs-setup") {
      setStatusFilter("NEEDS_SETUP");
    }
  }, [searchParams]);

  // Extract unique faculty groups from real database descriptions
  const facultyGroups = useMemo(() => {
    const set = new Set<string>();
    departments.forEach((d) => {
      const g = extractFacultyGroup(d.description);
      if (g) set.add(g);
    });
    return Array.from(set).sort();
  }, [departments]);

  // Filter logic
  const filtered = useMemo(() => {
    return departments.filter((dept) => {
      // 1. Text Search (name, code, building, description)
      const q = search.toLowerCase().trim();
      if (q) {
        const matchesName = dept.name.toLowerCase().includes(q);
        const matchesCode = dept.code.toLowerCase().includes(q);
        const matchesBuilding = dept.building?.toLowerCase().includes(q);
        const matchesDesc = dept.description?.toLowerCase().includes(q);
        if (!matchesName && !matchesCode && !matchesBuilding && !matchesDesc) {
          return false;
        }
      }

      // 2. Setup Status Filter
      const healthStatus = getDepartmentHealthStatus(dept.facultyCount, dept.programsCount);
      const isConfigured = healthStatus === "CONFIGURED";
      const isNeedsSetup = !isConfigured;

      if (statusFilter === "CONFIGURED" && !isConfigured) return false;
      if (statusFilter === "NEEDS_SETUP" && !isNeedsSetup) return false;

      // 3. Faculty Group Filter
      if (facultyGroupFilter !== "ALL") {
        const group = extractFacultyGroup(dept.description);
        if (group !== facultyGroupFilter) return false;
      }

      // 4. Programs Count Filter
      if (programsFilter === "ZERO" && dept.programsCount !== 0) return false;
      if (programsFilter === "ONE_TO_TWO" && (dept.programsCount < 1 || dept.programsCount > 2)) return false;
      if (programsFilter === "THREE_PLUS" && dept.programsCount < 3) return false;

      return true;
    });
  }, [departments, search, statusFilter, facultyGroupFilter, programsFilter]);

  const hasActiveFilters =
    search.trim() !== "" ||
    statusFilter !== "ALL" ||
    facultyGroupFilter !== "ALL" ||
    programsFilter !== "ALL";

  const clearAllFilters = () => {
    setSearch("");
    setStatusFilter("ALL");
    setFacultyGroupFilter("ALL");
    setProgramsFilter("ALL");
    router.replace("/admin/departments");
  };

  // Health summary metrics
  const configuredCount = departments.filter(
    (d) => getDepartmentHealthStatus(d.facultyCount, d.programsCount) === "CONFIGURED"
  ).length;
  const needsSetupCount = departments.length - configuredCount;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-rose-600 uppercase tracking-wider">
            Academic Infrastructure
          </span>
          <h1 className="text-2xl font-extrabold text-slate-900 mt-1">
            University Academic Departments
          </h1>
          <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-2">
            <span>Centralized department hierarchy & academic configuration</span>
            <span>•</span>
            <span className="text-emerald-700 font-semibold">{configuredCount} Configured</span>
            <span>•</span>
            <span className={needsSetupCount > 0 ? "text-amber-700 font-semibold" : "text-slate-400"}>
              {needsSetupCount} Needing Setup
            </span>
          </p>
        </div>

        <button
          type="button"
          onClick={() => setDrawerOpen(true)}
          className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold shadow-sm transition flex items-center gap-1.5 shrink-0"
          id="btn-add-department"
        >
          <Plus className="w-4 h-4" />
          Add Department
        </button>
      </div>

      {/* Multi-Faceted Filter & Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by department name, code, school, or building..."
              className="w-full pl-9 pr-8 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-rose-500 focus:bg-white"
              id="input-department-search"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                aria-label="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Setup Status Filter */}
          <div className="w-full md:w-44 shrink-0">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full py-2 px-3 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-rose-500 font-medium text-slate-700"
              aria-label="Filter by setup status"
              id="select-status-filter"
            >
              <option value="ALL">Status: All Departments</option>
              <option value="CONFIGURED">✓ Configured Only</option>
              <option value="NEEDS_SETUP">⚠ Needs Setup Only</option>
            </select>
          </div>

          {/* Faculty Group / School Filter */}
          <div className="w-full md:w-56 shrink-0">
            <select
              value={facultyGroupFilter}
              onChange={(e) => setFacultyGroupFilter(e.target.value)}
              className="w-full py-2 px-3 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-rose-500 font-medium text-slate-700"
              aria-label="Filter by faculty school"
              id="select-faculty-filter"
            >
              <option value="ALL">Faculty School: All Groups</option>
              {facultyGroups.map((grp) => (
                <option key={grp} value={grp}>
                  {grp}
                </option>
              ))}
            </select>
          </div>

          {/* Program Count Filter */}
          <div className="w-full md:w-44 shrink-0">
            <select
              value={programsFilter}
              onChange={(e) => setProgramsFilter(e.target.value)}
              className="w-full py-2 px-3 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-rose-500 font-medium text-slate-700"
              aria-label="Filter by program count"
              id="select-programs-filter"
            >
              <option value="ALL">Programs: All Counts</option>
              <option value="ZERO">0 Programs</option>
              <option value="ONE_TO_TWO">1–2 Programs</option>
              <option value="THREE_PLUS">3+ Programs</option>
            </select>
          </div>
        </div>

        {/* Active Filters Summary & Clear Action */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 text-xs">
          <div className="flex flex-wrap items-center gap-1.5 text-slate-500">
            <span>
              Showing <span className="font-bold text-slate-900">{filtered.length}</span> of{" "}
              <span className="font-bold text-slate-900">{departments.length}</span> departments
            </span>

            {hasActiveFilters && (
              <>
                <span className="text-slate-300">•</span>
                <span className="text-slate-600 font-medium">Active filters:</span>
                {search && (
                  <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[11px] font-medium border border-slate-200">
                    Query: &quot;{search}&quot;
                  </span>
                )}
                {statusFilter !== "ALL" && (
                  <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 text-[11px] font-medium border border-amber-200">
                    {statusFilter === "CONFIGURED" ? "Configured" : "Needs Setup"}
                  </span>
                )}
                {facultyGroupFilter !== "ALL" && (
                  <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-800 text-[11px] font-medium border border-blue-200">
                    {facultyGroupFilter}
                  </span>
                )}
                {programsFilter !== "ALL" && (
                  <span className="px-2 py-0.5 rounded-full bg-purple-50 text-purple-800 text-[11px] font-medium border border-purple-200">
                    Programs: {programsFilter}
                  </span>
                )}
              </>
            )}
          </div>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={clearAllFilters}
              className="text-rose-600 hover:text-rose-700 font-bold hover:underline flex items-center gap-1 text-[11px]"
              id="btn-clear-filters"
            >
              <X className="w-3.5 h-3.5" />
              Clear all filters
            </button>
          )}
        </div>
      </div>

      {/* Departments Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((dept) => {
            const health = getDepartmentHealthStatus(dept.facultyCount, dept.programsCount);
            const isIncomplete = health !== "CONFIGURED";

            return (
              <div
                key={dept.id}
                className={`bg-white rounded-2xl shadow-xs border p-6 space-y-3 flex flex-col justify-between hover:shadow-md transition relative ${
                  isIncomplete
                    ? "border-amber-200/90 bg-amber-50/10 hover:border-amber-300"
                    : "border-slate-200/90 hover:border-slate-300"
                }`}
              >
                <div>
                  {/* Top Bar: Code, Building, and Setup Health Badge */}
                  <div className="flex items-center justify-between gap-2 mb-2.5">
                    <div className="flex items-center gap-1.5">
                      <span className="px-2 py-0.5 rounded font-mono font-bold text-[10px] bg-slate-100 text-slate-800 border border-slate-200">
                        {dept.code}
                      </span>
                      <span className="text-[10px] font-medium text-slate-500 truncate max-w-[120px]">
                        {dept.building || "Campus Main"}
                      </span>
                    </div>

                    <DepartmentHealthBadge
                      facultyCount={dept.facultyCount}
                      programsCount={dept.programsCount}
                    />
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-base font-bold text-slate-900 tracking-tight">{dept.name}</h3>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    {dept.description || "No academic faculty or description specified."}
                  </p>
                </div>

                {/* Bottom Metrics Bar */}
                <div className="pt-3 border-t border-slate-100/90 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5">
                    <School className="w-3.5 h-3.5 text-slate-400" />
                    <span
                      className={
                        dept.programsCount === 0
                          ? "text-amber-800 font-bold"
                          : "text-slate-700 font-medium"
                      }
                    >
                      {dept.programsCount} {dept.programsCount === 1 ? "Program" : "Programs"}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-slate-400" />
                    <span
                      className={
                        dept.facultyCount === 0
                          ? "text-amber-800 font-bold"
                          : "text-slate-700 font-medium"
                      }
                    >
                      {dept.facultyCount} {dept.facultyCount === 1 ? "Faculty" : "Faculty"}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <EmptyState
          icon={<Building className="w-6 h-6" />}
          title="No departments found"
          description={
            hasActiveFilters
              ? "No departments matched your active filters. Try clearing or relaxing the filter criteria."
              : "No academic departments have been created yet."
          }
          action={
            hasActiveFilters ? (
              <button
                type="button"
                onClick={clearAllFilters}
                className="px-3.5 py-1.5 bg-rose-600 text-white rounded-lg text-xs font-semibold"
              >
                Reset Filters
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setDrawerOpen(true)}
                className="px-3.5 py-1.5 bg-rose-600 text-white rounded-lg text-xs font-semibold"
              >
                Add New Department
              </button>
            )
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
