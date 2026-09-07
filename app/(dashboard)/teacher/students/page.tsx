import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Users, Mail, CheckCircle2, AlertCircle } from "lucide-react";

export default async function TeacherStudentsPage() {
  const user = await getCurrentUser();
  if (!user || user.role !== "TEACHER" || !user.facultyId) {
    redirect("/login");
  }

  const faculty = await prisma.faculty.findUnique({
    where: { id: user.facultyId },
    include: {
      assignments: {
        include: {
          section: {
            include: {
              students: {
                include: {
                  user: true,
                  attendanceRecords: true,
                },
              },
            },
          },
          subject: true,
        },
      },
    },
  });

  if (!faculty) return <div className="p-6">Faculty not found.</div>;

  return (
    <div className="space-y-6">
      <div>
        <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
          Student Roster & Cohort
        </span>
        <h1 className="text-2xl font-extrabold text-slate-900 mt-1">
          Assigned Students Directory
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Directory of enrolled students across your assigned academic sections and laboratory batches
        </p>
      </div>

      <div className="space-y-6">
        {faculty.assignments.map((alloc) => {
          const students = alloc.section.students;
          return (
            <div
              key={alloc.id}
              className="bg-white rounded-2xl shadow-xs border border-slate-200 p-6 space-y-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    {alloc.subject.code}: {alloc.subject.name}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Section: {alloc.section.name} • {students.length} Enrolled Students
                  </p>
                </div>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                  {alloc.subject.type}
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50 text-[10px] font-bold uppercase text-slate-500">
                      <th className="p-3">Roll Number</th>
                      <th className="p-3">Student Name</th>
                      <th className="p-3">Email Address</th>
                      <th className="p-3">Attendance %</th>
                      <th className="p-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {students.map((st) => {
                      const totalRecords = st.attendanceRecords.length || 1;
                      const presentRecords = st.attendanceRecords.filter((r) => r.status === "PRESENT").length;
                      const pct = Math.round((presentRecords / totalRecords) * 100);
                      return (
                        <tr key={st.id} className="hover:bg-slate-50/50 transition">
                          <td className="p-3 font-mono font-bold text-slate-800">{st.rollNumber}</td>
                          <td className="p-3 font-medium text-slate-900">{st.user.name}</td>
                          <td className="p-3 text-slate-500">{st.user.email}</td>
                          <td className="p-3 font-bold text-slate-900">{pct}%</td>
                          <td className="p-3">
                            {pct >= 75 ? (
                              <span className="status-badge status-badge-success">Good</span>
                            ) : (
                              <span className="status-badge status-badge-danger">Shortage</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
