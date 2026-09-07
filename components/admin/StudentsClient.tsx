"use client";

import React, { useState, useMemo } from "react";
import { Search, Plus, GraduationCap, Filter, Download, CheckSquare, Square, Eye, Sparkles } from "lucide-react";
import EnrollStudentDrawer from "@/components/admin/drawers/EnrollStudentDrawer";
import StudentDetailDrawer from "@/components/admin/drawers/StudentDetailDrawer";
import EmptyState from "@/components/ui/EmptyState";
import { toast } from "@/components/ui/Toast";

interface StudentRecord {
  id: string;
  rollNumber: string;
  registrationNo: string;
  phone?: string | null;
  gender?: string | null;
  admissionDate: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
  program: {
    id: string;
    name: string;
    code: string;
  };
  currentSemester: {
    id: string;
    number: number;
  };
  section: {
    id: string;
    name: string;
  } | null;
}

interface StudentsClientProps {
  initialStudents: StudentRecord[];
  programs: { id: string; name: string; code: string }[];
  sections: { id: string; name: string }[];
}

export default function StudentsClient({
  initialStudents,
  programs,
  sections,
}: StudentsClientProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProgram, setSelectedProgram] = useState("ALL");
  const [selectedSemester, setSelectedSemester] = useState("ALL");
  const [isEnrollOpen, setIsEnrollOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<any | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Filter logic
  const filteredStudents = useMemo(() => {
    return initialStudents.filter((st) => {
      const matchSearch =
        st.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        st.rollNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        st.registrationNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        st.user.email.toLowerCase().includes(searchTerm.toLowerCase());

      const matchProgram =
        selectedProgram === "ALL" || st.program.id === selectedProgram;

      const matchSemester =
        selectedSemester === "ALL" ||
        st.currentSemester.number.toString() === selectedSemester;

      return matchSearch && matchProgram && matchSemester;
    });
  }, [initialStudents, searchTerm, selectedProgram, selectedSemester]);

  // Bulk Selection
  const allFilteredSelected =
    filteredStudents.length > 0 &&
    filteredStudents.every((st) => selectedIds.includes(st.id));

  const toggleSelectAll = () => {
    if (allFilteredSelected) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredStudents.map((st) => st.id));
    }
  };

  const toggleSelect = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const exportSelectedCSV = () => {
    const listToExport =
      selectedIds.length > 0
        ? initialStudents.filter((st) => selectedIds.includes(st.id))
        : filteredStudents;

    if (listToExport.length === 0) {
      toast.warning("No student records to export.");
      return;
    }

    const headers = ["Roll No", "Name", "Reg No", "Program", "Semester", "Section", "Email", "Phone"];
    const rows = listToExport.map((s) => [
      s.rollNumber,
      `"${s.user.name}"`,
      s.registrationNo,
      s.program.code,
      `Sem ${s.currentSemester.number}`,
      s.section?.name || "Unassigned",
      s.user.email,
      s.phone || "",
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `JLU_Students_Census_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success(`Exported ${listToExport.length} student records to CSV.`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-rose-600 uppercase tracking-wider">
            Student Identity & Census
          </span>
          <h1 className="text-2xl font-extrabold text-slate-900 mt-1">
            University Student Directory ({initialStudents.length})
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Central verified student census across academic departments, cohorts, and semesters
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={exportSelectedCSV}
            className="px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-lg text-xs font-semibold shadow-xs transition flex items-center gap-1.5"
            title="Export filtered or selected students"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Export CSV</span>
          </button>
          <button
            type="button"
            onClick={() => setIsEnrollOpen(true)}
            className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold shadow-xs transition flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            Enroll New Student
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-3.5 bg-white border border-slate-200 rounded-xl shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by name, roll no, email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white focus:ring-1 focus:ring-rose-500 focus:outline-none"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <div className="flex items-center gap-1.5 text-xs text-slate-600">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span>Program:</span>
            <select
              value={selectedProgram}
              onChange={(e) => setSelectedProgram(e.target.value)}
              className="p-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none"
            >
              <option value="ALL">All Programs</option>
              {programs.map((prog) => (
                <option key={prog.id} value={prog.id}>
                  {prog.code}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-slate-600">
            <span>Semester:</span>
            <select
              value={selectedSemester}
              onChange={(e) => setSelectedSemester(e.target.value)}
              className="p-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none"
            >
              <option value="ALL">All Semesters</option>
              {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                <option key={num} value={num.toString()}>
                  Sem {num}
                </option>
              ))}
            </select>
          </div>

          {(searchTerm || selectedProgram !== "ALL" || selectedSemester !== "ALL") && (
            <button
              type="button"
              onClick={() => {
                setSearchTerm("");
                setSelectedProgram("ALL");
                setSelectedSemester("ALL");
              }}
              className="text-xs text-rose-600 font-semibold hover:underline ml-1"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Bulk Action Bar if Selected */}
      {selectedIds.length > 0 && (
        <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-xl flex items-center justify-between animate-fadeIn text-xs">
          <div className="flex items-center gap-2 text-rose-900 font-semibold">
            <span className="w-5 h-5 rounded-full bg-rose-600 text-white text-[11px] font-bold flex items-center justify-center">
              {selectedIds.length}
            </span>
            <span>{selectedIds.length} students selected</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={exportSelectedCSV}
              className="px-3 py-1 bg-white hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-lg font-medium transition flex items-center gap-1"
            >
              <Download className="w-3.5 h-3.5" />
              Export Selected
            </button>
            <button
              onClick={() => setSelectedIds([])}
              className="px-2 py-1 text-slate-500 hover:text-slate-700 font-medium"
            >
              Clear
            </button>
          </div>
        </div>
      )}

      {/* Directory Table */}
      {filteredStudents.length === 0 ? (
        <EmptyState
          icon={GraduationCap}
          title="No Students Found"
          description={
            searchTerm || selectedProgram !== "ALL" || selectedSemester !== "ALL"
              ? "No students match your active filter criteria."
              : "No students are currently registered in the database."
          }
          actionLabel="Enroll Student"
          onAction={() => setIsEnrollOpen(true)}
        />
      ) : (
        <div className="bg-white rounded-2xl shadow-xs border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-[10px] font-bold uppercase text-slate-500">
                  <th className="p-3 w-10 text-center">
                    <button
                      type="button"
                      onClick={toggleSelectAll}
                      className="text-slate-400 hover:text-slate-600 focus:outline-none"
                    >
                      {allFilteredSelected ? (
                        <CheckSquare className="w-4 h-4 text-rose-600" />
                      ) : (
                        <Square className="w-4 h-4" />
                      )}
                    </button>
                  </th>
                  <th className="p-3">Roll Number</th>
                  <th className="p-3">Student Name</th>
                  <th className="p-3">Registration No</th>
                  <th className="p-3">Program</th>
                  <th className="p-3">Semester</th>
                  <th className="p-3">Section</th>
                  <th className="p-3">Email Address</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredStudents.map((st) => {
                  const isSelected = selectedIds.includes(st.id);
                  return (
                    <tr
                      key={st.id}
                      onClick={() =>
                        setSelectedStudent({
                          id: st.id,
                          name: st.user.name,
                          rollNumber: st.rollNumber,
                          email: st.user.email,
                          phone: st.phone,
                          programName: st.program.name,
                          programCode: st.program.code,
                          semesterNumber: st.currentSemester.number,
                          sectionName: st.section?.name,
                          admissionDate: new Date(st.admissionDate).toLocaleDateString(),
                          gender: st.gender,
                        })
                      }
                      className={`hover:bg-rose-50/40 cursor-pointer transition ${
                        isSelected ? "bg-rose-50/60" : ""
                      }`}
                    >
                      <td className="p-3 text-center" onClick={(e) => toggleSelect(st.id, e)}>
                        <button type="button" className="focus:outline-none">
                          {isSelected ? (
                            <CheckSquare className="w-4 h-4 text-rose-600" />
                          ) : (
                            <Square className="w-4 h-4 text-slate-300 hover:text-slate-500" />
                          )}
                        </button>
                      </td>
                      <td className="p-3 font-mono font-bold text-slate-900">{st.rollNumber}</td>
                      <td className="p-3">
                        <div className="font-semibold text-slate-900">{st.user.name}</div>
                      </td>
                      <td className="p-3 font-mono text-slate-500 text-[11px]">{st.registrationNo}</td>
                      <td className="p-3 font-medium text-slate-700">
                        <span className="px-2 py-0.5 rounded bg-slate-100 font-mono text-[11px]">
                          {st.program.code}
                        </span>
                      </td>
                      <td className="p-3 text-slate-600">Sem {st.currentSemester.number}</td>
                      <td className="p-3 font-mono text-slate-700">
                        {st.section?.name ? (
                          <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                            {st.section.name}
                          </span>
                        ) : (
                          <span className="text-slate-400 italic">Unassigned</span>
                        )}
                      </td>
                      <td className="p-3 text-slate-500">{st.user.email}</td>
                      <td className="p-3">
                        <span className="status-badge status-badge-success">Active</span>
                      </td>
                      <td className="p-3 text-right">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedStudent({
                              id: st.id,
                              name: st.user.name,
                              rollNumber: st.rollNumber,
                              email: st.user.email,
                              phone: st.phone,
                              programName: st.program.name,
                              programCode: st.program.code,
                              semesterNumber: st.currentSemester.number,
                              sectionName: st.section?.name,
                              admissionDate: new Date(st.admissionDate).toLocaleDateString(),
                              gender: st.gender,
                            });
                          }}
                          className="p-1 text-slate-400 hover:text-rose-600 rounded transition"
                          title="View Student Profile"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Detail Drawer */}
      <StudentDetailDrawer
        isOpen={!!selectedStudent}
        onClose={() => setSelectedStudent(null)}
        student={selectedStudent}
      />

      {/* Creation Drawer */}
      <EnrollStudentDrawer
        isOpen={isEnrollOpen}
        onClose={() => setIsEnrollOpen(false)}
        programs={programs}
        sections={sections}
      />
    </div>
  );
}
