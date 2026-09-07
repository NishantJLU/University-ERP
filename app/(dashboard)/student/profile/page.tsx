import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { User, Mail, Phone, Calendar, School, Shield, Award } from "lucide-react";
import { formatDate } from "@/lib/utils";

export default async function StudentProfilePage() {
  const user = await getCurrentUser();
  if (!user || user.role !== "STUDENT" || !user.studentId) {
    redirect("/login");
  }

  const student = await prisma.student.findUnique({
    where: { id: user.studentId },
    include: {
      user: true,
      program: { include: { department: true } },
      currentSemester: true,
      section: true,
      enrollments: {
        include: { subject: true },
      },
    },
  });

  if (!student) return <div className="p-6">Student record not found.</div>;

  return (
    <div className="space-y-6">
      <div>
        <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
          University Official Identity
        </span>
        <h1 className="text-2xl font-extrabold text-slate-900 mt-1">
          Student Academic Profile
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Centralized academic enrollment record on file with the Registrar&apos;s Office
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Profile Card */}
        <div className="lg:col-span-4 bg-white rounded-2xl shadow-xs border border-slate-200 p-6 text-center space-y-4">
          <div className="w-20 h-20 rounded-2xl bg-blue-700 text-white font-extrabold text-2xl flex items-center justify-center mx-auto shadow-md">
            {student.user.name.charAt(0)}
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">{student.user.name}</h2>
            <p className="text-xs text-slate-500 font-mono mt-0.5">{student.rollNumber}</p>
            <span className="inline-block mt-2 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
              Active Student (Good Standing)
            </span>
          </div>

          <div className="pt-4 border-t border-slate-100 text-left space-y-2.5 text-xs text-slate-600">
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-slate-400" />
              <span className="truncate">{student.user.email}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-slate-400" />
              <span>{student.user.phone || "+91 98765 00000"}</span>
            </div>
            <div className="flex items-center gap-2">
              <School className="w-4 h-4 text-slate-400" />
              <span>{student.program.department.name}</span>
            </div>
          </div>
        </div>

        {/* Academic Details */}
        <div className="lg:col-span-8 bg-white rounded-2xl shadow-xs border border-slate-200 p-6 space-y-5">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
            Institutional Enrollment Details
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70">
              <span className="text-slate-400 uppercase font-bold text-[10px] block">Program</span>
              <span className="text-slate-900 font-bold mt-1 block">{student.program.name}</span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70">
              <span className="text-slate-400 uppercase font-bold text-[10px] block">Registration No</span>
              <span className="text-slate-900 font-mono font-bold mt-1 block">{student.registrationNo}</span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70">
              <span className="text-slate-400 uppercase font-bold text-[10px] block">Current Semester</span>
              <span className="text-slate-900 font-bold mt-1 block">Semester {student.currentSemester.number}</span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70">
              <span className="text-slate-400 uppercase font-bold text-[10px] block">Section Batch</span>
              <span className="text-slate-900 font-bold mt-1 block">{student.section?.name || "Section A"}</span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70">
              <span className="text-slate-400 uppercase font-bold text-[10px] block">Admission Date</span>
              <span className="text-slate-900 font-medium mt-1 block">{formatDate(student.admissionDate)}</span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70">
              <span className="text-slate-400 uppercase font-bold text-[10px] block">Guardian / Contact</span>
              <span className="text-slate-900 font-medium mt-1 block">{student.guardianName} ({student.guardianPhone})</span>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100">
            <h4 className="text-xs font-bold text-slate-800 mb-3">Enrolled Academic Subjects</h4>
            <div className="space-y-2">
              {student.enrollments.map((enr) => (
                <div key={enr.id} className="p-2.5 rounded-lg border border-slate-200 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2.5">
                    <span className="font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                      {enr.subject.code}
                    </span>
                    <span className="font-medium text-slate-900">{enr.subject.name}</span>
                  </div>
                  <span className="text-slate-500 font-mono text-[11px]">{enr.subject.credits} Credits ({enr.subject.type})</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
