"use client";

import React, { useState, useMemo } from "react";
import { Plus, Search, Users, Mail, Phone, BookOpen } from "lucide-react";
import OnboardFacultyDrawer from "@/components/admin/drawers/OnboardFacultyDrawer";
import EmptyState from "@/components/ui/EmptyState";

interface FacultyItem {
  id: string;
  employeeCode: string;
  name: string;
  email: string;
  departmentName: string;
  designation: string;
  specialization: string | null;
  coursesCount: number;
}

interface FacultyClientProps {
  initialFaculty: FacultyItem[];
  departments: { id: string; name: string; code: string }[];
}

export default function FacultyClient({
  initialFaculty,
  departments,
}: FacultyClientProps) {
  const [faculty] = useState<FacultyItem[]>(initialFaculty);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [deptFilter, setDeptFilter] = useState("ALL");

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return faculty.filter((f) => {
      const matchSearch =
        !q ||
        f.name.toLowerCase().includes(q) ||
        f.employeeCode.toLowerCase().includes(q) ||
        f.email.toLowerCase().includes(q) ||
        f.departmentName.toLowerCase().includes(q) ||
        f.designation.toLowerCase().includes(q);
      const matchDept = deptFilter === "ALL" || f.departmentName === deptFilter;
      return matchSearch && matchDept;
    });
  }, [faculty, search, deptFilter]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-rose-600 uppercase tracking-wider">
            Academic Staff & Professoriate
          </span>
          <h1 className="text-2xl font-extrabold text-slate-900 mt-1">
            Faculty Directory ({faculty.length})
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Institutional directory of professors, associate professors, assistant professors, and departmental chairs
          </p>
        </div>

        <button
          type="button"
          onClick={() => setDrawerOpen(true)}
          className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold shadow-sm transition flex items-center gap-1.5 shrink-0"
        >
          <Plus className="w-4 h-4" />
          Onboard Faculty Member
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
            placeholder="Search faculty by name, employee code, designation..."
            className="w-full pl-9 pr-4 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-rose-500 focus:bg-white"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
            className="p-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none"
          >
            <option value="ALL">All Departments</option>
            {departments.map((d) => (
              <option key={d.id} value={d.name}>
                {d.name}
              </option>
            ))}
          </select>
          <span className="text-xs text-slate-500 font-medium">
            Showing <span className="font-bold text-slate-800">{filtered.length}</span> of {faculty.length}
          </span>
        </div>
      </div>

      {/* Faculty Table */}
      {filtered.length > 0 ? (
        <div className="bg-white rounded-2xl shadow-xs border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-[10px] font-bold uppercase text-slate-500">
                  <th className="p-3">Employee Code</th>
                  <th className="p-3">Faculty Name</th>
                  <th className="p-3">Department</th>
                  <th className="p-3">Designation</th>
                  <th className="p-3">Specialization</th>
                  <th className="p-3">Email Address</th>
                  <th className="p-3">Assigned Courses</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((f) => (
                  <tr key={f.id} className="hover:bg-slate-50/50 transition">
                    <td className="p-3 font-mono font-bold text-slate-900">{f.employeeCode}</td>
                    <td className="p-3 font-semibold text-slate-900">{f.name}</td>
                    <td className="p-3 text-slate-700">{f.departmentName}</td>
                    <td className="p-3 font-medium text-slate-600">{f.designation}</td>
                    <td className="p-3 text-slate-500 max-w-[200px] truncate">{f.specialization || "General"}</td>
                    <td className="p-3 text-blue-600 font-mono text-[11px]">{f.email}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                        {f.coursesCount} Courses
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <EmptyState
          icon={<Users className="w-6 h-6" />}
          title="No faculty members found"
          description={search ? `No personnel matched "${search}".` : "No faculty profiles registered."}
          action={
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setDeptFilter("ALL");
                setDrawerOpen(true);
              }}
              className="px-3.5 py-1.5 bg-rose-600 text-white rounded-lg text-xs font-semibold"
            >
              Onboard Faculty Member
            </button>
          }
        />
      )}

      {/* Onboard Drawer */}
      <OnboardFacultyDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        departments={departments}
      />
    </div>
  );
}
