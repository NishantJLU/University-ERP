"use client";

import { useState, useEffect } from "react";
import { CheckCircle2, ShieldCheck, Loader2, Search, Users, AlertCircle } from "lucide-react";
import { AttendanceStatus } from "@/types";
import { toast } from "@/components/ui/Toast";
import { TableSkeleton } from "@/components/ui/Skeleton";
import EmptyState from "@/components/ui/EmptyState";

interface StudentItem {
  id: string;
  name: string;
  rollNumber: string;
  avatar?: string | null;
  email?: string;
  programName?: string;
}

interface TeacherAttendanceClientProps {
  subjects: any[];
  sections: any[];
  initialSubjectId: string;
  initialSectionId: string;
  initialPeriodNumber: number;
  initialStudents: StudentItem[];
  facultyId: string;
}

export default function TeacherAttendanceClient({
  subjects,
  sections,
  initialSubjectId,
  initialSectionId,
  initialPeriodNumber,
  initialStudents,
  facultyId,
}: TeacherAttendanceClientProps) {
  const [selectedSubject, setSelectedSubject] = useState(initialSubjectId);
  const [selectedSection, setSelectedSection] = useState(initialSectionId);
  const [periodNumber, setPeriodNumber] = useState(initialPeriodNumber || 1);
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);

  // Dynamic student list
  const [students, setStudents] = useState<StudentItem[]>(initialStudents);
  const [loadingRoster, setLoadingRoster] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Attendance map: studentId -> { status, remarks }
  const [attendanceMap, setAttendanceMap] = useState<
    Record<string, { status: AttendanceStatus; remarks: string }>
  >(() => {
    const initial: Record<string, { status: AttendanceStatus; remarks: string }> = {};
    initialStudents.forEach((st) => {
      initial[st.id] = { status: "PRESENT", remarks: "" };
    });
    return initial;
  });

  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Dynamic fetch when selectedSection changes (after initial mount)
  useEffect(() => {
    let isMounted = true;

    async function loadRoster() {
      if (!selectedSection) return;
      setLoadingRoster(true);
      setSavedSuccess(false);

      try {
        const res = await fetch(`/api/attendance/roster?sectionId=${selectedSection}`);
        const data = await res.json();
        if (isMounted) {
          if (data.success) {
            setStudents(data.students);
            // Reinitialize attendance map for newly loaded students
            const newMap: Record<string, { status: AttendanceStatus; remarks: string }> = {};
            data.students.forEach((st: StudentItem) => {
              newMap[st.id] = { status: "PRESENT", remarks: "" };
            });
            setAttendanceMap(newMap);
          } else {
            toast.error(data.message || "Failed to load section student roster.");
          }
        }
      } catch (err) {
        if (isMounted) {
          toast.error("Network error loading section student roster.");
        }
      } finally {
        if (isMounted) {
          setLoadingRoster(false);
        }
      }
    }

    loadRoster();

    return () => {
      isMounted = false;
    };
  }, [selectedSection]);

  const handleStatusChange = (studentId: string, status: AttendanceStatus) => {
    setAttendanceMap((prev) => ({
      ...prev,
      [studentId]: { ...prev[studentId], status },
    }));
  };

  const handleMarkAll = (status: AttendanceStatus) => {
    setAttendanceMap((prev) => {
      const updated: Record<string, { status: AttendanceStatus; remarks: string }> = {};
      students.forEach((st) => {
        updated[st.id] = { status, remarks: prev[st.id]?.remarks || "" };
      });
      return updated;
    });
    toast.info(`Marked all ${students.length} students as ${status}.`);
  };

  const handleSaveAttendance = async () => {
    if (students.length === 0) {
      toast.warning("No students in this section to record attendance for.");
      return;
    }

    setSaving(true);
    setSavedSuccess(false);

    try {
      const records = students.map((st) => ({
        studentId: st.id,
        status: attendanceMap[st.id]?.status || "PRESENT",
        remarks: attendanceMap[st.id]?.remarks || null,
      }));

      const res = await fetch("/api/attendance/mark", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subjectId: selectedSubject,
          sectionId: selectedSection,
          date,
          periodNumber: Number(periodNumber),
          records,
        }),
      });
      const data = await res.json();

      if (data.success) {
        setSavedSuccess(true);
        toast.success("Attendance successfully recorded and audit trail updated.");
      } else {
        toast.error(data.message || "Failed to finalize attendance.");
      }
    } catch (err) {
      toast.error("Network error recording attendance.");
    } finally {
      setSaving(false);
    }
  };

  const filteredStudents = students.filter(
    (st) =>
      st.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      st.rollNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const presentCount = Object.values(attendanceMap).filter((a) => a.status === "PRESENT").length;
  const absentCount = Object.values(attendanceMap).filter((a) => a.status === "ABSENT").length;
  const lateCount = Object.values(attendanceMap).filter((a) => a.status === "LATE").length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">
            Class Attendance Register
          </span>
          <h1 className="text-2xl font-extrabold text-slate-900 mt-1">
            Record Daily Class Attendance
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Synchronized directly with the student&apos;s central university record and ERP audit log
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => handleMarkAll("PRESENT")}
            disabled={loadingRoster || students.length === 0}
            className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-lg text-xs font-semibold border border-emerald-200 transition disabled:opacity-50"
          >
            Mark All Present
          </button>
          <button
            type="button"
            onClick={() => handleMarkAll("ABSENT")}
            disabled={loadingRoster || students.length === 0}
            className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-800 rounded-lg text-xs font-semibold border border-red-200 transition disabled:opacity-50"
          >
            Mark All Absent
          </button>
        </div>
      </div>

      {/* Control Bar */}
      <div className="bg-white p-5 rounded-2xl shadow-xs border border-slate-200 grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
        <div>
          <label className="block font-semibold text-slate-700 mb-1">Subject</label>
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-600 focus:outline-none"
          >
            {subjects.map((sub) => (
              <option key={sub.id} value={sub.id}>
                {sub.code}: {sub.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block font-semibold text-slate-700 mb-1">Section Batch</label>
          <select
            value={selectedSection}
            onChange={(e) => setSelectedSection(e.target.value)}
            className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-600 focus:outline-none"
          >
            {sections.map((sec) => (
              <option key={sec.id} value={sec.id}>
                {sec.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block font-semibold text-slate-700 mb-1">Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-600 focus:outline-none"
          >
          </input>
        </div>

        <div>
          <label className="block font-semibold text-slate-700 mb-1">Period Number</label>
          <select
            value={periodNumber}
            onChange={(e) => setPeriodNumber(Number(e.target.value))}
            className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-600 focus:outline-none"
          >
            {[1, 2, 3, 4, 5].map((p) => (
              <option key={p} value={p}>
                Period {p}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Summary Chips & Quick Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-2">
          <span className="px-3 py-1 bg-emerald-100/80 text-emerald-800 rounded-full font-bold">
            Present: {presentCount}
          </span>
          <span className="px-3 py-1 bg-red-100/80 text-red-800 rounded-full font-bold">
            Absent: {absentCount}
          </span>
          <span className="px-3 py-1 bg-amber-100/80 text-amber-800 rounded-full font-bold">
            Late: {lateCount}
          </span>
          <span className="text-slate-500 font-medium ml-2">
            Cohort Total: {students.length} Students
          </span>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search roster..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs focus:ring-1 focus:ring-rose-500 focus:outline-none"
          />
        </div>
      </div>

      {savedSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>
            Attendance successfully finalized and saved! Central student dashboards and parent alerts updated.
          </span>
        </div>
      )}

      {/* Student Roster Table */}
      <div className="bg-white rounded-2xl shadow-xs border border-slate-200 overflow-hidden">
        {loadingRoster ? (
          <div className="p-6">
            <TableSkeleton rows={5} cols={5} />
          </div>
        ) : students.length === 0 ? (
          <EmptyState
            icon={Users}
            title="No Students in Section"
            description="There are currently no students assigned to this section cohort."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-[10px] font-bold uppercase text-slate-500">
                  <th className="p-3 w-16">#</th>
                  <th className="p-3">Roll Number</th>
                  <th className="p-3">Student Name</th>
                  <th className="p-3 text-center">Status</th>
                  <th className="p-3">Remarks / Medical Note</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredStudents.map((st, idx) => {
                  const currentStatus = attendanceMap[st.id]?.status || "PRESENT";
                  return (
                    <tr key={st.id} className="hover:bg-slate-50/50 transition">
                      <td className="p-3 text-slate-400 font-mono">{idx + 1}</td>
                      <td className="p-3 font-mono font-bold text-slate-800">{st.rollNumber}</td>
                      <td className="p-3">
                        <div className="font-semibold text-slate-900">{st.name}</div>
                        {st.email && <div className="text-[10px] text-slate-400">{st.email}</div>}
                      </td>
                      <td className="p-3">
                        <div className="flex items-center justify-center gap-1.5">
                          {(["PRESENT", "ABSENT", "LATE", "EXCUSED"] as AttendanceStatus[]).map((status) => (
                            <button
                              key={status}
                              type="button"
                              onClick={() => handleStatusChange(st.id, status)}
                              className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition ${
                                currentStatus === status
                                  ? status === "PRESENT"
                                    ? "bg-emerald-600 text-white shadow-xs"
                                    : status === "ABSENT"
                                    ? "bg-red-600 text-white shadow-xs"
                                    : status === "LATE"
                                    ? "bg-amber-500 text-white shadow-xs"
                                    : "bg-blue-600 text-white shadow-xs"
                                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                              }`}
                            >
                              {status}
                            </button>
                          ))}
                        </div>
                      </td>
                      <td className="p-3">
                        <input
                          type="text"
                          placeholder="Optional remarks..."
                          value={attendanceMap[st.id]?.remarks || ""}
                          onChange={(e) =>
                            setAttendanceMap((prev) => ({
                              ...prev,
                              [st.id]: { ...prev[st.id], remarks: e.target.value },
                            }))
                          }
                          className="w-full p-1.5 text-[11px] border border-slate-200 rounded focus:ring-1 focus:ring-rose-600 focus:outline-none"
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            type="button"
            onClick={handleSaveAttendance}
            disabled={saving || loadingRoster || students.length === 0}
            className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md flex items-center gap-2 transition disabled:opacity-50"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Saving to University Central DB...
              </>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4" />
                Finalize & Save Class Attendance
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
