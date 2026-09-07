import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Award, CheckCircle2, TrendingUp } from "lucide-react";

export default async function StudentResultsPage() {
  const user = await getCurrentUser();
  if (!user || user.role !== "STUDENT" || !user.studentId) {
    redirect("/login");
  }

  const student = await prisma.student.findUnique({
    where: { id: user.studentId },
    include: {
      program: true,
      currentSemester: true,
      examResults: {
        include: { subject: true },
      },
    },
  });

  if (!student) return <div className="p-6">Student record not found.</div>;

  return (
    <div className="space-y-6">
      <div>
        <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
          Office of the Controller of Examinations
        </span>
        <h1 className="text-2xl font-extrabold text-slate-900 mt-1">
          Academic Results & Transcripts
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Semester grade reports, CGPA calculation, and continuous evaluation marks
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl shadow-xs border border-slate-200">
          <span className="text-xs font-bold uppercase text-slate-400">Cumulative GPA (CGPA)</span>
          <p className="text-3xl font-extrabold text-blue-700 mt-1">8.92 / 10</p>
          <span className="text-[11px] text-emerald-600 font-semibold">First Class with Distinction</span>
        </div>
        <div className="bg-white p-5 rounded-2xl shadow-xs border border-slate-200">
          <span className="text-xs font-bold uppercase text-slate-400">Total Credits Earned</span>
          <p className="text-3xl font-extrabold text-slate-900 mt-1">48 Credits</p>
          <span className="text-[11px] text-slate-500">Across Semesters 1 & 2</span>
        </div>
        <div className="bg-white p-5 rounded-2xl shadow-xs border border-slate-200">
          <span className="text-xs font-bold uppercase text-slate-400">Academic Standing</span>
          <p className="text-3xl font-extrabold text-emerald-600 mt-1">Exemplary</p>
          <span className="text-[11px] text-slate-500">Zero active backlogs</span>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-xs border border-slate-200 p-6 space-y-4">
        <h2 className="text-sm font-bold text-slate-900">
          Semester 2 End-Term Examination Marks
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-[10px] font-bold uppercase text-slate-500">
                <th className="p-3">Course Code</th>
                <th className="p-3">Course Name</th>
                <th className="p-3">Credits</th>
                <th className="p-3">Internal (40)</th>
                <th className="p-3">End-Term (60)</th>
                <th className="p-3">Total (100)</th>
                <th className="p-3">Grade</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr>
                <td className="p-3 font-mono font-bold text-slate-800">CS201</td>
                <td className="p-3 font-medium text-slate-900">Discrete Mathematical Structures</td>
                <td className="p-3">4</td>
                <td className="p-3 text-slate-600">38</td>
                <td className="p-3 text-slate-600">54</td>
                <td className="p-3 font-bold text-emerald-700">92</td>
                <td className="p-3"><span className="status-badge status-badge-success">A+</span></td>
              </tr>
              <tr>
                <td className="p-3 font-mono font-bold text-slate-800">CS202</td>
                <td className="p-3 font-medium text-slate-900">Digital Logic & Computer Organization</td>
                <td className="p-3">4</td>
                <td className="p-3 text-slate-600">36</td>
                <td className="p-3 text-slate-600">51</td>
                <td className="p-3 font-bold text-emerald-700">87</td>
                <td className="p-3"><span className="status-badge status-badge-success">A</span></td>
              </tr>
              <tr>
                <td className="p-3 font-mono font-bold text-slate-800">CS203</td>
                <td className="p-3 font-medium text-slate-900">Object Oriented Programming with Java</td>
                <td className="p-3">4</td>
                <td className="p-3 text-slate-600">39</td>
                <td className="p-3 text-slate-600">55</td>
                <td className="p-3 font-bold text-emerald-700">94</td>
                <td className="p-3"><span className="status-badge status-badge-success">A+</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
