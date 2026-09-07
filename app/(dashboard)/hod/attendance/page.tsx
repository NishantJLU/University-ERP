import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { CheckSquare, AlertTriangle, Users } from "lucide-react";

export default async function HODAttendancePage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  if (user.role !== "HOD" && user.role !== "ADMIN") {
    redirect(`/${user.role.toLowerCase()}/dashboard`);
  }

  const deptId = user.departmentId || (await prisma.department.findFirst())?.id;

  // Fetch all attendance sessions conducted in this department
  const sessions = await prisma.attendanceSession.findMany({
    where: deptId ? {
      subject: { departmentId: deptId },
    } : {},
    include: {
      subject: true,
      section: true,
      faculty: { include: { user: true } },
      records: true,
    },
    orderBy: { date: "desc" },
    take: 20,
  });

  return (
    <div className="space-y-6">
      <div>
        <span className="text-xs font-bold text-purple-600 uppercase tracking-wider">
          Compliance & Analytics
        </span>
        <h1 className="text-2xl font-extrabold text-slate-900 mt-1">
          Department Attendance Analytics
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Audited class attendance logs, student aggregate percentages, and statutory shortage tracking
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-xs border border-slate-200 p-6 space-y-4">
        <h2 className="text-sm font-bold text-slate-900">
          Recent Class Attendance Sessions Conducted
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-[10px] font-bold uppercase text-slate-500">
                <th className="p-3">Date</th>
                <th className="p-3">Subject</th>
                <th className="p-3">Section</th>
                <th className="p-3">Instructor</th>
                <th className="p-3">Present / Total</th>
                <th className="p-3">Session Pct</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {sessions.map((sess) => {
                const total = sess.records.length;
                const present = sess.records.filter((r) => r.status === "PRESENT").length;
                const pct = total > 0 ? Math.round((present / total) * 100) : 0;
                return (
                  <tr key={sess.id} className="hover:bg-slate-50/50 transition">
                    <td className="p-3 font-mono text-slate-600">
                      {new Date(sess.date).toLocaleDateString()}
                    </td>
                    <td className="p-3 font-semibold text-slate-900">
                      {sess.subject.code}: {sess.subject.name}
                    </td>
                    <td className="p-3 font-mono text-slate-700">{sess.section.name}</td>
                    <td className="p-3 text-slate-600">{sess.faculty.user.name}</td>
                    <td className="p-3 font-mono">
                      {present} / {total}
                    </td>
                    <td className="p-3 font-bold text-slate-900">{pct}%</td>
                    <td className="p-3">
                      <span className="status-badge status-badge-success">{sess.status}</span>
                    </td>
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
