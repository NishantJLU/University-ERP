import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { CheckSquare, AlertCircle, CheckCircle2, Clock, Calendar } from "lucide-react";
import { formatDate } from "@/lib/utils";
import AttendanceWhatIfCalculator from "@/components/student/AttendanceWhatIfCalculator";

export default async function StudentAttendancePage() {
  const user = await getCurrentUser();
  if (!user || user.role !== "STUDENT" || !user.studentId) {
    redirect("/login");
  }

  const student = await prisma.student.findUnique({
    where: { id: user.studentId },
    include: {
      program: true,
      currentSemester: true,
      enrollments: {
        include: { subject: true },
      },
      attendanceRecords: {
        include: {
          session: {
            include: {
              subject: true,
              faculty: { include: { user: true } },
            },
          },
        },
        orderBy: { session: { date: "desc" } },
      },
    },
  });

  if (!student) return <div className="p-6">Student record not found.</div>;

  const totalClasses = student.attendanceRecords.length || 0;
  const presentClasses = student.attendanceRecords.filter((r) => r.status === "PRESENT").length;
  const overallPercentage = totalClasses > 0 ? Math.round((presentClasses / totalClasses) * 100) : 100;

  // Subject-wise grouping
  const subjectStats = student.enrollments.map((enr) => {
    const records = student.attendanceRecords.filter(
      (r) => r.session.subjectId === enr.subjectId
    );
    const subTotal = records.length;
    const subPresent = records.filter((r) => r.status === "PRESENT").length;
    const subPct = subTotal > 0 ? Math.round((subPresent / subTotal) * 100) : 100;
    return {
      subject: {
        id: enr.subject.id,
        code: enr.subject.code,
        name: enr.subject.name,
      },
      total: subTotal,
      present: subPresent,
      percentage: subPct,
      type: enr.subject.type,
    };
  });

  return (
    <div className="space-y-6">
      <div>
        <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
          Academic Compliance & Ledger
        </span>
        <h1 className="text-2xl font-extrabold text-slate-900 mt-1">
          Attendance Records
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Minimum 75% aggregate attendance required to sit for University Term-End Examinations
        </p>
      </div>

      {/* Overall Metric Card */}
      <div className="bg-white rounded-2xl shadow-xs border border-slate-200 p-6 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-200">
            <CheckSquare className="w-8 h-8" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Overall Aggregate Attendance
            </span>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-3xl font-extrabold text-slate-900">{overallPercentage}%</span>
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                overallPercentage >= 75 ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-red-50 text-red-700 border border-red-200"
              }`}>
                {overallPercentage >= 75 ? "Examination Eligible" : "Attendance Shortage"}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Recorded across {totalClasses} scheduled lecture sessions
            </p>
          </div>
        </div>

        <div className="w-full sm:w-64 bg-slate-100 h-3 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              overallPercentage >= 75 ? "bg-emerald-500" : "bg-red-500"
            }`}
            style={{ width: `${overallPercentage}%` }}
          />
        </div>
      </div>

      {/* Interactive 75% Simulator */}
      <AttendanceWhatIfCalculator
        overallTotal={totalClasses}
        overallPresent={presentClasses}
        subjects={subjectStats}
      />

      {/* Subject-Wise Attendance Breakdown */}
      <div className="bg-white rounded-2xl shadow-xs border border-slate-200 p-6 space-y-4">
        <h2 className="text-sm font-bold text-slate-900">
          Subject-Wise Attendance Breakdown
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-[10px] font-bold uppercase text-slate-500">
                <th className="p-3">Subject Code</th>
                <th className="p-3">Subject Name</th>
                <th className="p-3">Type</th>
                <th className="p-3">Total Classes</th>
                <th className="p-3">Attended</th>
                <th className="p-3">Percentage</th>
                <th className="p-3">Eligibility Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {subjectStats.map((stat) => (
                <tr key={stat.subject.id} className="hover:bg-slate-50/50 transition">
                  <td className="p-3 font-mono font-bold text-slate-800">{stat.subject.code}</td>
                  <td className="p-3 font-medium text-slate-900">{stat.subject.name}</td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-100 border border-slate-200">
                      {stat.type}
                    </span>
                  </td>
                  <td className="p-3 text-slate-600">{stat.total}</td>
                  <td className="p-3 font-semibold text-emerald-700">{stat.present}</td>
                  <td className="p-3">
                    <span className="font-extrabold text-slate-900">{stat.percentage}%</span>
                  </td>
                  <td className="p-3">
                    {stat.percentage >= 75 ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3" /> Eligible
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-red-700 bg-red-50 px-2 py-0.5 rounded border border-red-200">
                        <AlertCircle className="w-3 h-3" /> Warning
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detailed Attendance Session Log */}
      <div className="bg-white rounded-2xl shadow-xs border border-slate-200 p-6 space-y-4">
        <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <Calendar className="w-4 h-4 text-slate-500" />
          Recent Class-by-Class Attendance Ledger
        </h2>

        <div className="divide-y divide-slate-100">
          {student.attendanceRecords.map((rec) => (
            <div key={rec.id} className="py-3 flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <div
                  className={`w-2.5 h-2.5 rounded-full ${
                    rec.status === "PRESENT"
                      ? "bg-emerald-500 ring-2 ring-emerald-200"
                      : rec.status === "LATE"
                      ? "bg-amber-500 ring-2 ring-amber-200"
                      : "bg-red-500 ring-2 ring-red-200"
                  }`}
                />
                <div>
                  <p className="font-bold text-slate-900">
                    {rec.session.subject.code}: {rec.session.subject.name}
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Faculty: {rec.session.faculty.user.name} • Period {rec.session.periodNumber}
                  </p>
                </div>
              </div>

              <div className="text-right">
                <span
                  className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                    rec.status === "PRESENT"
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                      : rec.status === "LATE"
                      ? "bg-amber-50 text-amber-700 border border-amber-200"
                      : "bg-red-50 text-red-700 border border-red-200"
                  }`}
                >
                  {rec.status}
                </span>
                <span className="block text-[10px] text-slate-400 mt-0.5">
                  {formatDate(rec.session.date)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
