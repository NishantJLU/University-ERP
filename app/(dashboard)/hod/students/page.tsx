import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { GraduationCap, Mail } from "lucide-react";

export default async function HODStudentsPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  if (user.role !== "HOD" && user.role !== "ADMIN") {
    redirect(`/${user.role.toLowerCase()}/dashboard`);
  }

  const deptId = user.departmentId || (await prisma.department.findFirst())?.id;

  const students = await prisma.student.findMany({
    where: deptId ? { program: { departmentId: deptId } } : {},
    include: {
      user: true,
      program: true,
      currentSemester: true,
      section: true,
      attendanceRecords: true,
    },
    orderBy: { rollNumber: "asc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <span className="text-xs font-bold text-purple-600 uppercase tracking-wider">
          Student Cohort
        </span>
        <h1 className="text-2xl font-extrabold text-slate-900 mt-1">
          Department Enrolled Students ({students.length})
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Master enrollment roster across undergraduate and postgraduate departmental programs
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-xs border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-[10px] font-bold uppercase text-slate-500">
                <th className="p-3">Roll Number</th>
                <th className="p-3">Student Name</th>
                <th className="p-3">Program</th>
                <th className="p-3">Semester</th>
                <th className="p-3">Section</th>
                <th className="p-3">Attendance</th>
                <th className="p-3">Email Address</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {students.map((st) => {
                const total = st.attendanceRecords.length || 1;
                const present = st.attendanceRecords.filter((r) => r.status === "PRESENT").length;
                const pct = Math.round((present / total) * 100);
                return (
                  <tr key={st.id} className="hover:bg-slate-50/50 transition">
                    <td className="p-3 font-mono font-bold text-slate-800">{st.rollNumber}</td>
                    <td className="p-3 font-semibold text-slate-900">{st.user.name}</td>
                    <td className="p-3 font-medium text-slate-700">{st.program.code}</td>
                    <td className="p-3 text-slate-600">Sem {st.currentSemester.number}</td>
                    <td className="p-3 font-mono text-slate-600">{st.section?.name || "—"}</td>
                    <td className="p-3">
                      <span className={`font-bold ${pct >= 75 ? "text-emerald-700" : "text-red-700"}`}>
                        {pct}%
                      </span>
                    </td>
                    <td className="p-3 text-slate-500">{st.user.email}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
